import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRegexRunner, type RegexWorkerLike } from './regex-runner';
import { runRegexJob, type RegexJobRequest } from './tools/regex-tester';

/** メッセージを受けたら即座に runRegexJob で返す、正常な Worker の代わり */
class EchoWorker implements RegexWorkerLike {
  onmessage: RegexWorkerLike['onmessage'] = null;
  onerror: RegexWorkerLike['onerror'] = null;
  terminated = false;
  postMessage(message: RegexJobRequest) {
    queueMicrotask(() => this.onmessage?.({ data: runRegexJob(message) }));
  }
  terminate() {
    this.terminated = true;
  }
}

/** 返事をしない（破滅的バックトラッキングで固まった）Worker の代わり */
class HangingWorker implements RegexWorkerLike {
  onmessage: RegexWorkerLike['onmessage'] = null;
  onerror: RegexWorkerLike['onerror'] = null;
  terminated = false;
  postMessage() {}
  terminate() {
    this.terminated = true;
  }
}

const request = (pattern: string, text = 'abc') => ({
  pattern,
  flags: '',
  text,
  replacement: '',
});

describe('createRegexRunner', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('Worker の結果を返す', async () => {
    const runner = createRegexRunner(() => new EchoWorker());
    const outcome = await runner.run(request('b'));
    expect(outcome.status).toBe('done');
    if (outcome.status === 'done') {
      expect(outcome.response.test.matches[0].match).toBe('b');
    }
  });

  it('置換文字列があれば置換結果も返す', async () => {
    const runner = createRegexRunner(() => new EchoWorker());
    const outcome = await runner.run({ ...request('b'), replacement: 'X' });
    if (outcome.status !== 'done') throw new Error('not done');
    expect(outcome.response.replace?.result).toBe('aXc');
  });

  it('制限時間を超えたら timeout を返し、Worker を破棄して次回は作り直す', async () => {
    const workers: RegexWorkerLike[] = [new HangingWorker(), new EchoWorker()];
    const created: RegexWorkerLike[] = [];
    const runner = createRegexRunner(() => {
      const w = workers[created.length];
      created.push(w);
      return w;
    }, 1000);

    const first = runner.run(request('(a+)+$'));
    await vi.advanceTimersByTimeAsync(1000);
    expect(await first).toEqual({ status: 'timeout' });
    expect((created[0] as HangingWorker).terminated).toBe(true);

    const second = await runner.run(request('b'));
    expect(second.status).toBe('done');
    expect(created).toHaveLength(2);
  });

  it('処理中に新しい依頼が来たら古い依頼は superseded になる', async () => {
    const created: RegexWorkerLike[] = [];
    const runner = createRegexRunner(() => {
      const w = created.length === 0 ? new HangingWorker() : new EchoWorker();
      created.push(w);
      return w;
    });
    const first = runner.run(request('(a+)+$'));
    const second = runner.run(request('b'));
    expect(await first).toEqual({ status: 'superseded' });
    expect((created[0] as HangingWorker).terminated).toBe(true);
    expect((await second).status).toBe('done');
  });

  it('Worker を作れない環境では同期実行せず unavailable を返す', async () => {
    const runner = createRegexRunner(() => {
      throw new Error('Worker is not defined');
    });
    expect(await runner.run(request('c'))).toEqual({ status: 'unavailable' });
    expect(await runner.run(request('c'))).toEqual({ status: 'unavailable' });
  });

  it('一度応答した Worker が実行時エラーになっても同期実行には切り替えない', async () => {
    const workers: RegexWorkerLike[] = [];
    const runner = createRegexRunner(() => {
      const w = new EchoWorker();
      workers.push(w);
      return w;
    });
    await runner.run(request('a'));
    const hanging = runner.run(request('b'));
    workers[0].onerror?.(new Error('runtime'));
    expect(await hanging).toEqual({ status: 'timeout' });
    await runner.run(request('c'));
    expect(workers).toHaveLength(2);
  });

  it('一度応答→Worker 再作成→新 Worker の読み込み失敗は unavailable になる', async () => {
    const created: RegexWorkerLike[] = [];
    const runner = createRegexRunner(() => {
      const w = created.length === 0 ? new EchoWorker() : new HangingWorker();
      created.push(w);
      return w;
    }, 1000);
    await runner.run(request('a'));
    // 古い Worker を詰まらせて破棄させ、新しい Worker を作らせる
    created[0].postMessage = () => {};
    const stuck = runner.run(request('b'));
    await vi.advanceTimersByTimeAsync(1000);
    expect(await stuck).toEqual({ status: 'timeout' });

    const reloaded = runner.run(request('c'));
    created[1].onerror?.(new Error('load failed'));
    expect(await reloaded).toEqual({ status: 'unavailable' });
    expect(await runner.run(request('d'))).toEqual({ status: 'unavailable' });
  });

  it('Worker の読み込み失敗時は、処理中の依頼も同期実行せず unavailable にする', async () => {
    let failing: HangingWorker | undefined;
    const runner = createRegexRunner(() => (failing = new HangingWorker()));
    const pending = runner.run(request('a'));
    failing!.onerror?.(new Error('load failed'));
    expect(await pending).toEqual({ status: 'unavailable' });
    expect(await runner.run(request('b'))).toEqual({ status: 'unavailable' });
  });
});

describe('runRegexJob', () => {
  it('不正なパターンでは置換を行わない', () => {
    const r = runRegexJob({
      id: 1,
      pattern: '(',
      flags: '',
      text: 'a',
      replacement: 'x',
    });
    expect(r.test.isValid).toBe(false);
    expect(r.replace).toBeNull();
  });

  it('id をそのまま返す', () => {
    expect(
      runRegexJob({
        id: 42,
        pattern: 'a',
        flags: '',
        text: 'a',
        replacement: '',
      }).id,
    ).toBe(42);
  });
});
