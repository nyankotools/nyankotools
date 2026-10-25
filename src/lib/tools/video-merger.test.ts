import { describe, expect, it } from 'vitest';
import {
  FrameGrid,
  MAX_CLIPS,
  MAX_FILE_SIZE,
  MAX_TOTAL_SECONDS,
  MAX_TOTAL_SIZE,
  buildMergedFileName,
  checkAddLimit,
  computeOffsets,
  computeOutputSize,
  isMergeOutputFormat,
  moveItem,
  normalizeFps,
  planAudioChunk,
  removeItem,
  sumDuration,
  sumSize,
} from './video-merger';

describe('checkAddLimit', () => {
  const clip = { size: 1000, duration: 10 };
  it('上限内なら null', () => {
    expect(checkAddLimit([], clip)).toBeNull();
    expect(checkAddLimit([clip, clip], clip)).toBeNull();
  });
  it('ファイル数の上限', () => {
    const list = Array.from({ length: MAX_CLIPS }, () => clip);
    expect(checkAddLimit(list.slice(0, MAX_CLIPS - 1), clip)).toBeNull();
    expect(checkAddLimit(list, clip)).toBe('tooMany');
  });
  it('1ファイルのサイズ上限', () => {
    expect(checkAddLimit([], { size: MAX_FILE_SIZE, duration: 1 })).toBeNull();
    expect(checkAddLimit([], { size: MAX_FILE_SIZE + 1, duration: 1 })).toBe(
      'fileTooLarge',
    );
  });
  it('合計サイズの上限', () => {
    const big = { size: MAX_FILE_SIZE, duration: 1 };
    expect(checkAddLimit([big], big)).toBeNull();
    expect(checkAddLimit([big, big], { size: 1, duration: 1 })).toBe(
      'totalTooLarge',
    );
    expect(checkAddLimit([big, big], big)).toBe('totalTooLarge');
    expect(MAX_TOTAL_SIZE).toBe(2 * MAX_FILE_SIZE);
  });
  it('合計の長さの上限', () => {
    const half = { size: 1, duration: MAX_TOTAL_SECONDS / 2 };
    expect(checkAddLimit([half], half)).toBeNull();
    expect(checkAddLimit([half, half], { size: 1, duration: 0.5 })).toBe(
      'totalTooLong',
    );
  });
});

describe('合計・開始位置', () => {
  it('合計サイズと長さ', () => {
    const list = [
      { size: 10, duration: 1.5 },
      { size: 20, duration: 2 },
    ];
    expect(sumSize(list)).toBe(30);
    expect(sumDuration(list)).toBe(3.5);
    expect(sumSize([])).toBe(0);
  });
  it('不正な長さは 0 として扱う', () => {
    expect(sumDuration([{ size: 0, duration: NaN }])).toBe(0);
    expect(computeOffsets([2, -1, 3, 4])).toEqual([0, 2, 2, 5]);
    expect(computeOffsets([])).toEqual([]);
  });
});

describe('computeOutputSize', () => {
  it('上限なしは元のサイズ（偶数に丸める）', () => {
    expect(computeOutputSize(1920, 1080, 0)).toEqual({
      width: 1920,
      height: 1080,
    });
    expect(computeOutputSize(1281, 721, 0)).toEqual({
      width: 1280,
      height: 720,
    });
  });
  it('高さ上限を超えるときだけ縮小する', () => {
    expect(computeOutputSize(1920, 1080, 720)).toEqual({
      width: 1280,
      height: 720,
    });
    expect(computeOutputSize(640, 360, 720)).toEqual({
      width: 640,
      height: 360,
    });
  });
  it('縦長動画の縮小', () => {
    expect(computeOutputSize(1080, 1920, 1080)).toEqual({
      width: 606,
      height: 1080,
    });
  });
  it('0 や不正値でも 2 以上の偶数になる', () => {
    const s = computeOutputSize(0, 0, 0);
    expect(s.width).toBeGreaterThanOrEqual(2);
    expect(s.width % 2).toBe(0);
    expect(s.height % 2).toBe(0);
  });
});

describe('normalizeFps', () => {
  it('整数に近い値は丸める', () => {
    expect(normalizeFps(29.97)).toBe(30);
    expect(normalizeFps(59.94)).toBe(60);
    expect(normalizeFps(24)).toBe(24);
  });
  it('整数から離れた値は小数を残す', () => {
    expect(normalizeFps(12.5)).toBe(12.5);
  });
  it('範囲外・不正値は収める', () => {
    expect(normalizeFps(120)).toBe(60);
    expect(normalizeFps(0.2)).toBe(1);
    expect(normalizeFps(NaN)).toBe(30);
    expect(normalizeFps(0)).toBe(30);
    expect(normalizeFps(-5)).toBe(30);
  });
});

describe('FrameGrid', () => {
  it('指定時刻より前のコマだけを順に払い出す', () => {
    const g = new FrameGrid(10);
    expect(g.advanceTo(0.3)).toEqual([0, 0.1, 0.2]);
    expect(g.advanceTo(0.3)).toEqual([]);
    expect(g.advanceTo(0.5)).toEqual([0.3, 0.4]);
    expect(g.count).toBe(5);
  });
  it('クリップ境界ちょうどのコマは次のクリップに属する', () => {
    const g = new FrameGrid(30);
    const first = g.advanceTo(1);
    expect(first).toHaveLength(30);
    const second = g.advanceTo(2);
    expect(second[0]).toBeCloseTo(1);
    expect(second).toHaveLength(30);
  });
  it('fpsが違う素材でも合計コマ数は長さ×fps', () => {
    const g = new FrameGrid(24);
    let total = 0;
    for (const end of [1.5, 3.25, 7]) total += g.advanceTo(end).length;
    expect(total).toBe(7 * 24);
  });
  it('時刻が戻っても重複して払い出さない', () => {
    const g = new FrameGrid(10);
    g.advanceTo(1);
    expect(g.advanceTo(0.5)).toEqual([]);
  });
  it('不正なfpsは例外', () => {
    expect(() => new FrameGrid(0)).toThrow();
    expect(() => new FrameGrid(NaN)).toThrow();
  });
});

describe('planAudioChunk', () => {
  it('連続していればそのまま使う', () => {
    expect(planAudioChunk(1000, 1000, 500, 10000)).toEqual({
      silence: 0,
      skip: 0,
      take: 500,
    });
  });
  it('開始が遅れていれば無音を挟む', () => {
    expect(planAudioChunk(1000, 1300, 500, 10000)).toEqual({
      silence: 300,
      skip: 0,
      take: 500,
    });
  });
  it('重なっていれば先頭を捨てる', () => {
    expect(planAudioChunk(1000, 900, 500, 10000)).toEqual({
      silence: 0,
      skip: 100,
      take: 400,
    });
    expect(planAudioChunk(1000, 0, 500, 10000)).toEqual({
      silence: 0,
      skip: 500,
      take: 0,
    });
  });
  it('クリップの終端を超える分は使わない', () => {
    expect(planAudioChunk(1000, 1000, 500, 1200)).toEqual({
      silence: 0,
      skip: 0,
      take: 200,
    });
    expect(planAudioChunk(1200, 1200, 500, 1200)).toEqual({
      silence: 0,
      skip: 0,
      take: 0,
    });
  });
  it('無音が終端を超えないようにする', () => {
    expect(planAudioChunk(1000, 5000, 500, 1200)).toEqual({
      silence: 200,
      skip: 0,
      take: 0,
    });
  });
});

describe('補助', () => {
  it('順序の入れ替えと削除', () => {
    expect(moveItem(['a', 'b', 'c'], 0, 1)).toEqual(['b', 'a', 'c']);
    expect(moveItem(['a', 'b', 'c'], 0, -1)).toEqual(['a', 'b', 'c']);
    expect(removeItem(['a', 'b', 'c'], 1)).toEqual(['a', 'c']);
  });
  it('出力ファイル名は先頭ファイルに -merged を付ける', () => {
    expect(buildMergedFileName(['a.mov', 'b.mp4'], 'mp4')).toBe('a-merged.mp4');
    expect(buildMergedFileName(['clip.webm'], 'webm')).toBe('clip-merged.webm');
    expect(buildMergedFileName([], 'mp4')).toBe('media-merged.mp4');
  });
  it('出力形式の判定', () => {
    expect(isMergeOutputFormat('mp4')).toBe(true);
    expect(isMergeOutputFormat('webm')).toBe(true);
    expect(isMergeOutputFormat('gif')).toBe(false);
  });
  it('空のクリップ一覧は合計0・開始位置なし', () => {
    expect(computeOffsets([])).toEqual([]);
    expect(sumSize([])).toBe(0);
    expect(sumDuration([])).toBe(0);
    expect(checkAddLimit([], { size: 1, duration: 0 })).toBeNull();
  });
  it('fpsが NaN や 0 のときは既定の30fps', () => {
    expect(normalizeFps(Number.NaN)).toBe(30);
    expect(normalizeFps(0)).toBe(30);
  });
});
