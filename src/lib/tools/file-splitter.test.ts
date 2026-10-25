import { describe, expect, it } from 'vitest';
import {
  FileSplitterError,
  MAX_PART_COUNT,
  countParts,
  findMissingNumbers,
  formatBytes,
  formatNumberList,
  indexDigits,
  parsePartName,
  partName,
  planMerge,
  planSplit,
  safeFileName,
  sliceBlob,
  splitWarnings,
  toBytes,
} from './file-splitter';

describe('toBytes', () => {
  it('KB/MBをバイトにする', () => {
    expect(toBytes(1, 'KB')).toBe(1024);
    expect(toBytes(2, 'MB')).toBe(2 * 1024 * 1024);
    expect(toBytes(0.5, 'MB')).toBe(512 * 1024);
  });
  it('不正な値はnull', () => {
    expect(toBytes(0, 'KB')).toBeNull();
    expect(toBytes(-1, 'MB')).toBeNull();
    expect(toBytes(NaN, 'MB')).toBeNull();
    expect(toBytes(0.0001, 'KB')).toBeNull();
    expect(toBytes(Infinity, 'MB')).toBeNull();
  });
  // 既知の不具合: 入力は有限でも、単位換算後に Infinity になると null にならない
  // （プレビューが「0個のパーツ」になる）。修正されたら it.fails を it に変えること。
  it('単位換算後に有限でなくなる巨大値もnull', () => {
    expect(toBytes(1e308, 'MB')).toBeNull();
  });
});

describe('formatBytes（分割画面の表示）', () => {
  it('単位を切り替える', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1023)).toBe('1023 B');
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1024 * 1024)).toBe('1.0 MB');
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1.00 GB');
  });
  // 既知の不具合: 1023.99… KB が「1024.0 KB」と表示される（本来は 1.0 MB）。
  // 修正されたら it.fails を it に変えること。
  it('単位の繰り上がり境界では次の単位で表示する', () => {
    expect(formatBytes(1024 * 1024 - 1)).toBe('1.0 MB');
  });
});

describe('partName / indexDigits', () => {
  it('3桁0埋め', () => {
    expect(partName('a.zip', 1, 5)).toBe('a.zip.001');
    expect(partName('a.zip', 12, 100)).toBe('a.zip.012');
  });
  it('1000個以上は桁数が増える', () => {
    expect(indexDigits(999)).toBe(3);
    expect(indexDigits(1000)).toBe(4);
    expect(partName('a', 1, 1000)).toBe('a.0001');
  });
});

describe('planSplit', () => {
  it('端数を最後のパーツに持たせる', () => {
    expect(planSplit(10, 4)).toEqual([
      { index: 1, start: 0, end: 4 },
      { index: 2, start: 4, end: 8 },
      { index: 3, start: 8, end: 10 },
    ]);
  });
  it('ちょうど割り切れる場合', () => {
    expect(planSplit(8, 4)).toHaveLength(2);
  });
  it('分割サイズが大きければ1パーツ', () => {
    expect(planSplit(3, 100)).toEqual([{ index: 1, start: 0, end: 3 }]);
  });
  it('空ファイル・不正サイズ・多すぎる分割はエラー', () => {
    expect(() => planSplit(0, 4)).toThrow(FileSplitterError);
    expect(() => planSplit(10, 0)).toThrow(FileSplitterError);
    expect(() => planSplit(MAX_PART_COUNT + 1, 1)).toThrow(FileSplitterError);
    expect(planSplit(MAX_PART_COUNT, 1)).toHaveLength(MAX_PART_COUNT);
  });
});

describe('countParts / splitWarnings', () => {
  it('分割数を数える', () => {
    expect(countParts(10, 3)).toBe(4);
    expect(countParts(0, 3)).toBe(0);
  });
  it('1000超で警告、1GB超で警告', () => {
    expect(splitWarnings(1000, 1)).toEqual([]);
    expect(splitWarnings(1001, 1)).toEqual(['many-parts']);
    expect(splitWarnings(1024 * 1024 * 1024 + 1, 1024 * 1024 * 1024)).toEqual([
      'large-file',
    ]);
  });
});

describe('sliceBlob', () => {
  it('範囲だけ切り出し、連結で元に戻る', async () => {
    const blob = new Blob(['abcdefghij']);
    const parts = planSplit(blob.size, 4).map((r) => sliceBlob(blob, r));
    expect(await parts[2].text()).toBe('ij');
    const merged = new Blob(parts);
    expect(await merged.text()).toBe('abcdefghij');
  });
});

describe('parsePartName', () => {
  it('連番を読む', () => {
    expect(parsePartName('movie.mp4.001')).toEqual({
      base: 'movie.mp4',
      number: 1,
    });
    expect(parsePartName('a.0012')).toEqual({ base: 'a', number: 12 });
    // 分割上限を超える巨大な数字（年月日など）はパーツ名にしない
    expect(parsePartName('video.20240101')).toBeNull();
    expect(parsePartName('a.zip.999999999999')).toBeNull();
  });
  it('パーツ名でなければnull', () => {
    expect(parsePartName('movie.mp4')).toBeNull();
    expect(parsePartName('a.01')).toBeNull();
    expect(parsePartName('.001')).toBeNull();
  });
  it('日本語のファイル名もパーツとして読める', () => {
    expect(parsePartName('動画 テスト.mp4.001')).toEqual({
      base: '動画 テスト.mp4',
      number: 1,
    });
    expect(parsePartName('写真.002')).toEqual({ base: '写真', number: 2 });
  });
  it('分割上限ちょうどの番号は受け付ける', () => {
    expect(parsePartName('a.10000')).toEqual({ base: 'a', number: 10000 });
    expect(parsePartName('a.10001')).toBeNull();
  });
});

describe('findMissingNumbers / formatNumberList', () => {
  it('欠番を返す', () => {
    expect(findMissingNumbers([1, 2, 5])).toEqual([3, 4]);
    expect(findMissingNumbers([1, 2, 3])).toEqual([]);
    expect(findMissingNumbers([])).toEqual([]);
  });
  it('範囲表記にする', () => {
    expect(formatNumberList([1, 2, 5, 6, 7, 9])).toBe('1-2, 5-7, 9');
    expect(formatNumberList([1, 3, 5], 2)).toBe('1, 3, …');
  });
});

describe('planMerge', () => {
  const f = (name: string) => ({ name });
  it('名前順に並べ、元の名前を復元する', () => {
    const plan = planMerge([f('a.zip.003'), f('a.zip.001'), f('a.zip.002')]);
    expect(plan.ordered.map((p) => p.name)).toEqual([
      'a.zip.001',
      'a.zip.002',
      'a.zip.003',
    ]);
    expect(plan.outputName).toBe('a.zip');
    expect(plan.issues).toEqual([]);
  });
  it('数値順で並べる（桁が違っても）', () => {
    const plan = planMerge([f('a.1000'), f('a.0002'), f('a.0001')]);
    expect(plan.ordered.map((p) => p.name)[2]).toBe('a.1000');
  });
  it('欠番を検出する', () => {
    const plan = planMerge([f('a.001'), f('a.002'), f('a.005')]);
    expect(plan.issues).toContainEqual({ type: 'missing', numbers: [3, 4] });
  });
  it('1から始まらない場合を検出する', () => {
    const plan = planMerge([f('a.002'), f('a.003')]);
    expect(plan.issues).toContainEqual({ type: 'not-from-one', first: 2 });
  });
  it('重複を検出する', () => {
    const plan = planMerge([f('a.001'), f('a.001')]);
    expect(plan.issues).toContainEqual({ type: 'duplicate', numbers: [1] });
  });
  it('別ファイルの混在を検出する', () => {
    const plan = planMerge([f('a.001'), f('b.002')]);
    expect(plan.issues.some((i) => i.type === 'mixed-base')).toBe(true);
    expect(plan.outputName).toBeNull();
  });
  it('パーツ名でないファイルを検出する', () => {
    const plan = planMerge([f('a.001'), f('note.txt')]);
    expect(plan.issues).toContainEqual({
      type: 'not-part',
      names: ['note.txt'],
    });
    expect(plan.ordered).toHaveLength(1);
  });
  it('すべてパーツ名でなければ空の計画', () => {
    const plan = planMerge([f('x.txt')]);
    expect(plan.ordered).toEqual([]);
    expect(plan.outputName).toBeNull();
  });
  it('0件の入力は問題なしの空計画（結合ボタンは無効のまま）', () => {
    const plan = planMerge([]);
    expect(plan).toEqual({ ordered: [], outputName: null, issues: [] });
  });
  it('1件だけでも結合計画になる（欠番なし）', () => {
    const plan = planMerge([f('a.zip.001')]);
    expect(plan.outputName).toBe('a.zip');
    expect(plan.issues).toEqual([]);
  });
});

describe('safeFileName', () => {
  it('禁止文字と先頭ドットを除く', () => {
    expect(safeFileName('a/b:c.txt')).toBe('abc.txt');
    expect(safeFileName('..')).toBe('restored');
    expect(safeFileName('')).toBe('restored');
  });
});
