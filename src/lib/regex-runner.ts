import {
  runRegexJob,
  type RegexJobRequest,
  type RegexJobResponse,
} from './tools/regex-tester';

/** 正規表現の実行を打ち切るまでの時間（ms）。通常の処理は数ms以内に終わる */
export const REGEX_TIMEOUT_MS = 2000;

/** Worker と同じ形の最小限のインターフェース（テストでは偽物を差し込む） */
export interface RegexWorkerLike {
  postMessage(message: RegexJobRequest): void;
  terminate(): void;
  onmessage: ((event: { data: RegexJobResponse }) => void) | null;
  onerror: ((event: unknown) => void) | null;
}

export type RegexRunOutcome =
  | { status: 'done'; response: RegexJobResponse }
  | { status: 'timeout' }
  /** 後続の依頼に置き換えられたため、結果は使わない */
  | { status: 'superseded' };

export interface RegexRunner {
  run(request: Omit<RegexJobRequest, 'id'>): Promise<RegexRunOutcome>;
}

interface PendingJob {
  id: number;
  request: RegexJobRequest;
  resolve: (outcome: RegexRunOutcome) => void;
  timer: ReturnType<typeof setTimeout>;
}

/**
 * 正規表現の実行を Worker に任せるランナー。
 * - 処理中に新しい依頼が来たら、古い依頼は破棄し、（Worker が詰まっている可能性があるので）Worker を作り直す
 * - 制限時間内に終わらなければ Worker を破棄して 'timeout' を返す
 * - Worker を作れない・読み込めない環境では、メインスレッドで同期実行にフォールバックする
 */
export function createRegexRunner(
  createWorker: () => RegexWorkerLike,
  timeoutMs: number = REGEX_TIMEOUT_MS,
): RegexRunner {
  let worker: RegexWorkerLike | null = null;
  let workerUnavailable = false;
  /** 一度でも Worker から応答があったか（読み込み失敗と実行時エラーを区別する） */
  let workerResponded = false;
  let pending: PendingJob | null = null;
  let nextId = 0;

  function discardWorker() {
    worker?.terminate();
    worker = null;
  }

  function settle(outcome: RegexRunOutcome) {
    if (!pending) return;
    clearTimeout(pending.timer);
    const { resolve } = pending;
    pending = null;
    resolve(outcome);
  }

  function ensureWorker(): RegexWorkerLike | null {
    if (workerUnavailable) return null;
    if (worker) return worker;
    try {
      const created = createWorker();
      created.onmessage = (event) => {
        workerResponded = true;
        if (pending && event.data.id === pending.id) {
          settle({ status: 'done', response: event.data });
        }
      };
      created.onerror = () => {
        const job = pending;
        discardWorker();
        if (workerResponded) {
          // 一度動いた Worker の実行時エラー。フリーズ保護を失わないよう同期実行には切り替えず、
          // 処理中の依頼は中断扱いにして、次回は Worker を作り直す
          if (job) settle({ status: 'timeout' });
          return;
        }
        // Worker の読み込み失敗など。以降はメインスレッドでの同期実行に切り替える
        workerUnavailable = true;
        // 処理中だった依頼は、同期実行で結果を返す
        if (job) settle({ status: 'done', response: runRegexJob(job.request) });
      };
      worker = created;
      return worker;
    } catch {
      workerUnavailable = true;
      return null;
    }
  }

  return {
    run(request) {
      if (pending) {
        settle({ status: 'superseded' });
        discardWorker();
      }
      const id = ++nextId;
      const full: RegexJobRequest = { ...request, id };

      const active = ensureWorker();
      if (!active) {
        return Promise.resolve({
          status: 'done',
          response: runRegexJob(full),
        });
      }

      return new Promise<RegexRunOutcome>((resolve) => {
        const timer = setTimeout(() => {
          discardWorker();
          settle({ status: 'timeout' });
        }, timeoutMs);
        pending = { id, request: full, resolve, timer };
        active.postMessage(full);
      });
    },
  };
}
