import { describe, expect, it } from 'vitest';
import {
  HISTORY_MAX,
  addHistory,
  parseHistory,
  removeHistory,
  type HistoryEntry,
} from './history';

const entry = (code: string, at = 1, themeId = 'neko'): HistoryEntry => ({
  themeId,
  code,
  at,
});

describe('parseHistory', () => {
  it('保存した配列を読み戻す', () => {
    const list = [entry('1.1.AAAAAA', 2), entry('1.1.BBBBBB', 1)];
    expect(parseHistory(JSON.stringify(list))).toEqual(list);
  });

  it('壊れた値・形式の違う値は空配列（例外を出さない）', () => {
    for (const raw of [null, '', '{', 'null', '{"a":1}', '"x"', '123']) {
      expect(parseHistory(raw), String(raw)).toEqual([]);
    }
  });

  it('不正な項目だけを捨てる', () => {
    const raw = JSON.stringify([
      entry('1.1.AAAAAA'),
      { themeId: 'neko', code: 'garbage', at: 1 },
      { themeId: 'NEKO!', code: '1.1.AAAAAA', at: 1 },
      { themeId: 'neko', code: '1.1.BBBBBB', at: 'x' },
      { themeId: 'neko', code: '1.1.DDDDDD', at: 1e300 },
      { themeId: 'neko', code: '1.1.CCCCCC', at: 1, name: 'たま' },
      null,
    ]);
    // 余分なキー（名前など）は読み込み時に落とす
    expect(parseHistory(raw)).toEqual([
      entry('1.1.AAAAAA'),
      entry('1.1.CCCCCC'),
    ]);
  });

  it('重複を除き、上限で打ち切る', () => {
    const list = Array.from({ length: HISTORY_MAX + 5 }, (_, i) =>
      entry(`1.1.A${String(i).padStart(5, 'A')}`, i),
    );
    const raw = JSON.stringify([list[0], ...list]);
    const parsed = parseHistory(raw);
    expect(parsed).toHaveLength(HISTORY_MAX);
    expect(parsed[0]).toEqual(list[0]);
    expect(parsed[1]).toEqual(list[1]);
  });
});

describe('addHistory / removeHistory', () => {
  it('先頭に追加し、同じ結果は先頭へ移す', () => {
    const a = entry('1.1.AAAAAA', 1);
    const b = entry('1.1.BBBBBB', 2);
    expect(addHistory([a], b)).toEqual([b, a]);
    const a2 = entry('1.1.AAAAAA', 3);
    expect(addHistory([b, a], a2)).toEqual([a2, b]);
  });

  it('テーマが違えば同じコードでも別の項目', () => {
    const a = entry('1.1.AAAAAA', 1, 'neko');
    const other = entry('1.1.AAAAAA', 2, 'inu');
    expect(addHistory([a], other)).toEqual([other, a]);
    expect(removeHistory([other, a], 'neko', '1.1.AAAAAA')).toEqual([other]);
  });

  it('上限を超えた古いものは捨てる', () => {
    let list: HistoryEntry[] = [];
    for (let i = 0; i < HISTORY_MAX + 3; i++) {
      list = addHistory(list, entry(`1.1.A${String(i).padStart(5, 'A')}`, i));
    }
    expect(list).toHaveLength(HISTORY_MAX);
    expect(list[0].at).toBe(HISTORY_MAX + 2);
    expect(list.at(-1)!.at).toBe(3);
  });
});
