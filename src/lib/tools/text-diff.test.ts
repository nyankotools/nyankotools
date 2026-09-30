import { describe, expect, it } from 'vitest';
import { diffLines, getDiffStats } from './text-diff';

describe('diffLines', () => {
  it('完全に同じテキストはすべてequalになる', () => {
    const result = diffLines('a\nb\nc', 'a\nb\nc');
    expect(result).toEqual([
      { type: 'equal', text: 'a', leftLine: 1, rightLine: 1 },
      { type: 'equal', text: 'b', leftLine: 2, rightLine: 2 },
      { type: 'equal', text: 'c', leftLine: 3, rightLine: 3 },
    ]);
  });

  it('末尾に行が追加された場合をaddedとして検出する', () => {
    const result = diffLines('a\nb', 'a\nb\nc');
    expect(result).toEqual([
      { type: 'equal', text: 'a', leftLine: 1, rightLine: 1 },
      { type: 'equal', text: 'b', leftLine: 2, rightLine: 2 },
      { type: 'added', text: 'c', leftLine: null, rightLine: 3 },
    ]);
  });

  it('行が削除された場合をremovedとして検出する', () => {
    const result = diffLines('a\nb\nc', 'a\nc');
    expect(result).toEqual([
      { type: 'equal', text: 'a', leftLine: 1, rightLine: 1 },
      { type: 'removed', text: 'b', leftLine: 2, rightLine: null },
      { type: 'equal', text: 'c', leftLine: 3, rightLine: 2 },
    ]);
  });

  it('行の変更をremoved+addedのペアとして検出する', () => {
    const result = diffLines('a\nb\nc', 'a\nX\nc');
    expect(result).toEqual([
      { type: 'equal', text: 'a', leftLine: 1, rightLine: 1 },
      { type: 'removed', text: 'b', leftLine: 2, rightLine: null },
      { type: 'added', text: 'X', leftLine: null, rightLine: 2 },
      { type: 'equal', text: 'c', leftLine: 3, rightLine: 3 },
    ]);
  });

  it('ignoreWhitespaceを指定すると前後の空白差を無視する', () => {
    const result = diffLines('  a  ', 'a', { ignoreWhitespace: true });
    expect(result).toEqual([
      { type: 'equal', text: '  a  ', leftLine: 1, rightLine: 1 },
    ]);
  });

  it('ignoreCaseを指定すると大文字小文字の差を無視する', () => {
    const result = diffLines('Hello', 'hello', { ignoreCase: true });
    expect(result).toEqual([
      { type: 'equal', text: 'Hello', leftLine: 1, rightLine: 1 },
    ]);
  });

  it('空文字列同士は空行1件のequalになる', () => {
    const result = diffLines('', '');
    expect(result).toEqual([
      { type: 'equal', text: '', leftLine: 1, rightLine: 1 },
    ]);
  });

  it('片方が空文字列の場合は全行がaddedまたはremovedになる', () => {
    const result = diffLines('', 'a\nb');
    expect(result).toEqual([
      { type: 'removed', text: '', leftLine: 1, rightLine: null },
      { type: 'added', text: 'a', leftLine: null, rightLine: 1 },
      { type: 'added', text: 'b', leftLine: null, rightLine: 2 },
    ]);
  });

  it('CRLFの改行コードは行末の\\rを含んだまま比較される（LF区切りのみに対応）', () => {
    // 実装は split('\n') のみで行分割するため、CRLFの場合は各行末に \r が残る。
    // そのため同じ内容でも改行コードがLFの側とCRLFの側は別の行として扱われる。
    const result = diffLines('a\r\nb\r\n', 'a\nb\n');
    expect(result).toEqual([
      { type: 'removed', text: 'a\r', leftLine: 1, rightLine: null },
      { type: 'removed', text: 'b\r', leftLine: 2, rightLine: null },
      { type: 'added', text: 'a', leftLine: null, rightLine: 1 },
      { type: 'added', text: 'b', leftLine: null, rightLine: 2 },
      { type: 'equal', text: '', leftLine: 3, rightLine: 3 },
    ]);
  });

  it('ignoreWhitespaceとignoreCaseを同時に指定すると両方の差を無視する', () => {
    const result = diffLines('  Hello  ', 'hello', {
      ignoreWhitespace: true,
      ignoreCase: true,
    });
    expect(result).toEqual([
      { type: 'equal', text: '  Hello  ', leftLine: 1, rightLine: 1 },
    ]);
  });

  it('絵文字（サロゲートペア）を含む行も正しく比較する', () => {
    const result = diffLines('猫🐱\n犬', '猫🐱\n犬🐶');
    expect(result).toEqual([
      { type: 'equal', text: '猫🐱', leftLine: 1, rightLine: 1 },
      { type: 'removed', text: '犬', leftLine: 2, rightLine: null },
      { type: 'added', text: '犬🐶', leftLine: null, rightLine: 2 },
    ]);
  });

  it('大量の行数（1000行）でも正しく比較できる', () => {
    const a = Array.from({ length: 1000 }, (_, i) => `line${i}`).join('\n');
    const b = Array.from({ length: 1000 }, (_, i) =>
      i === 500 ? 'CHANGED' : `line${i}`,
    ).join('\n');
    const result = diffLines(a, b);
    const stats = getDiffStats(result);
    expect(stats.removed).toBe(1);
    expect(stats.added).toBe(1);
    expect(stats.equal).toBe(999);
  });
});

describe('getDiffStats', () => {
  it('各typeの件数を集計する', () => {
    const lines = diffLines('a\nb\nc', 'a\nX\nc\nd');
    expect(getDiffStats(lines)).toEqual({ added: 2, removed: 1, equal: 2 });
  });
});

describe('diffLines（先頭・末尾の切り落とし）', () => {
  it('中央だけ変わったとき、切り落とした前後も元の行番号で返す', () => {
    const result = diffLines('a\nb\nX\nd\ne', 'a\nb\nY\nZ\nd\ne');
    expect(result).toEqual([
      { type: 'equal', text: 'a', leftLine: 1, rightLine: 1 },
      { type: 'equal', text: 'b', leftLine: 2, rightLine: 2 },
      { type: 'removed', text: 'X', leftLine: 3, rightLine: null },
      { type: 'added', text: 'Y', leftLine: null, rightLine: 3 },
      { type: 'added', text: 'Z', leftLine: null, rightLine: 4 },
      { type: 'equal', text: 'd', leftLine: 4, rightLine: 5 },
      { type: 'equal', text: 'e', leftLine: 5, rightLine: 6 },
    ]);
  });

  it('ほぼ同じ数万行の比較でもLCS表が巨大にならず完了する', () => {
    const lines = Array.from({ length: 50_000 }, (_, i) => `line ${i}`);
    const changed = [...lines];
    changed[25_000] = 'changed';
    const stats = getDiffStats(diffLines(lines.join('\n'), changed.join('\n')));
    expect(stats).toEqual({ added: 1, removed: 1, equal: 49_999 });
  });
});

describe('diffLines（巨大な変更）', () => {
  it('変更部分が十数万行でも例外にならない', () => {
    const lines = Array.from({ length: 200_000 }, (_, i) => `line ${i}`);
    const result = diffLines(lines.join('\n'), '');
    expect(getDiffStats(result)).toEqual({
      added: 1,
      removed: 200_000,
      equal: 0,
    });
  });
});
