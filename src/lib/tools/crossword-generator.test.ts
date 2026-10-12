import { describe, it, expect } from 'vitest';
import {
  MAX_CLUE_LENGTH,
  MAX_WORDS,
  MAX_WORD_LENGTH,
  generateCrossword,
  parseEntries,
} from './crossword-generator';
import type { ClueWord, Crossword, RandomInt } from './crossword-generator';

/** 再現可能な疑似乱数（LCG） */
function seeded(seed: number): RandomInt {
  let s = seed >>> 0;
  return (max) => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return Math.floor((s / 0x100000000) * max);
  };
}

const ANIMALS: ClueWord[] = [
  { word: 'ねこ', clue: 'ニャーと鳴く' },
  { word: 'いぬ', clue: 'ワンと鳴く' },
  { word: 'うさぎ', clue: '耳が長い' },
  { word: 'さかな', clue: '水中を泳ぐ' },
  { word: 'くま', clue: '冬眠する' },
  { word: 'とり', clue: '空を飛ぶ' },
  { word: 'かめ', clue: '甲羅がある' },
  { word: 'きつね', clue: 'コンと鳴く' },
];

/** 盤面から、2文字以上の連続した並び（ヨコ・タテ）をすべて集める */
function runs(puzzle: Crossword): string[] {
  const { width, height, cells } = puzzle;
  const result: string[] = [];
  const scan = (
    outer: number,
    inner: number,
    at: (a: number, b: number) => string | null,
  ) => {
    for (let a = 0; a < outer; a++) {
      let current = '';
      for (let b = 0; b <= inner; b++) {
        const ch = b < inner ? at(a, b) : null;
        if (ch !== null) {
          current += ch;
        } else {
          if (Array.from(current).length >= 2) result.push(current);
          current = '';
        }
      }
    }
  };
  scan(height, width, (y, x) => cells[y * width + x]);
  scan(width, height, (x, y) => cells[y * width + x]);
  return result;
}

function readEntry(
  puzzle: Crossword,
  e: { word: string; x: number; y: number; direction: string },
): string {
  const len = Array.from(e.word).length;
  let out = '';
  for (let k = 0; k < len; k++) {
    const x = e.x + (e.direction === 'across' ? k : 0);
    const y = e.y + (e.direction === 'down' ? k : 0);
    out += puzzle.cells[y * puzzle.width + x] ?? '?';
  }
  return out;
}

describe('parseEntries', () => {
  it('「答え:ヒント」を取り出し、最初の区切りだけで分ける', () => {
    const { entries, ignored } = parseEntries(
      'ねこ:ニャーと鳴く\nいぬ，ワンと鳴く、よく吠える\nCAT\tpet, small',
    );
    expect(entries).toEqual([
      { word: 'ねこ', clue: 'ニャーと鳴く' },
      { word: 'いぬ', clue: 'ワンと鳴く、よく吠える' },
      { word: 'CAT', clue: 'pet, small' },
    ]);
    expect(ignored).toBe(0);
  });

  it('ヒントがなくても答えとして使える', () => {
    expect(parseEntries('apple\nbanana:').entries).toEqual([
      { word: 'APPLE', clue: '' },
      { word: 'BANANA', clue: '' },
    ]);
  });

  it('空行・重複を除き、全角英数と空白を正規化する', () => {
    const { entries, ignored } = parseEntries(
      '\n ｉｃｅ cream :a\nICECREAM:b\n',
    );
    expect(entries).toEqual([{ word: 'ICECREAM', clue: 'a' }]);
    expect(ignored).toBe(0);
  });

  it('1文字・21文字以上の語は除外して数える', () => {
    const long = 'A'.repeat(MAX_WORD_LENGTH + 1);
    const ok = 'B'.repeat(MAX_WORD_LENGTH);
    const { entries, ignored } = parseEntries(`あ:x\n${long}:y\n${ok}:z`);
    expect(entries.map((e) => e.word)).toEqual([ok]);
    expect(ignored).toBe(2);
  });

  it('語数の上限を超えた分は除外する', () => {
    const lines = Array.from({ length: MAX_WORDS + 3 }, (_, i) => `W${i}X:c`);
    const { entries, ignored } = parseEntries(lines.join('\n'));
    expect(entries).toHaveLength(MAX_WORDS);
    expect(ignored).toBe(3);
  });

  it('長すぎるヒントは切り詰める', () => {
    const { entries } = parseEntries(`AB:${'あ'.repeat(MAX_CLUE_LENGTH + 20)}`);
    expect(Array.from(entries[0].clue)).toHaveLength(MAX_CLUE_LENGTH);
  });
});

describe('generateCrossword', () => {
  it('語がなければ空の盤面', () => {
    const puzzle = generateCrossword([], seeded(1));
    expect(puzzle.width).toBe(0);
    expect(puzzle.entries).toEqual([]);
    expect(puzzle.unplaced).toEqual([]);
  });

  it('1語だけなら1行のヨコのカギ', () => {
    const puzzle = generateCrossword([{ word: 'ねこ', clue: 'a' }], seeded(1));
    expect(puzzle.width).toBe(2);
    expect(puzzle.height).toBe(1);
    expect(puzzle.entries).toHaveLength(1);
    expect(puzzle.entries[0]).toMatchObject({
      number: 1,
      direction: 'across',
      word: 'ねこ',
    });
  });

  it('置いた語が盤面の文字と一致し、答えの語以外の並びができない', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const puzzle = generateCrossword(ANIMALS, seeded(seed));
      expect(puzzle.entries.length + puzzle.unplaced.length).toBe(
        ANIMALS.length,
      );
      for (const e of puzzle.entries) {
        expect(readEntry(puzzle, e)).toBe(e.word);
      }
      // 盤面にある2文字以上の並びは、すべて置いた語と1対1で対応する
      const expected = puzzle.entries.map((e) => e.word).sort();
      expect(runs(puzzle).sort()).toEqual(expected);
    }
  });

  it('置けた語はすべて他の語と交差してつながっている', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const puzzle = generateCrossword(ANIMALS, seeded(seed));
      if (puzzle.entries.length < 2) continue;
      const filled = puzzle.cells.filter((c) => c !== null).length;
      const letters = puzzle.entries.reduce(
        (sum, e) => sum + Array.from(e.word).length,
        0,
      );
      // 交差があれば、重なったマスの分だけ文字数の合計より少なくなる
      expect(filled).toBeLessThan(letters);
    }
  });

  it('番号は左上から順にふられ、同じ開始マスのタテとヨコは同じ番号', () => {
    const puzzle = generateCrossword(ANIMALS, seeded(7));
    const numbers = puzzle.entries.map((e) => e.number);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(numbers[0]).toBe(1);
    for (const e of puzzle.entries) {
      expect(puzzle.numbers[e.y * puzzle.width + e.x]).toBe(e.number);
    }
    const distinct = new Set(numbers);
    expect(Math.max(...numbers)).toBe(distinct.size);
  });

  it('文字を共有できない語は置けなかった語になる', () => {
    const puzzle = generateCrossword(
      [
        { word: 'ねこ', clue: '' },
        { word: 'こま', clue: '' },
        { word: 'XYZ', clue: '' },
      ],
      seeded(3),
    );
    expect(puzzle.unplaced.map((e) => e.word)).toEqual(['XYZ']);
    expect(puzzle.entries.map((e) => e.word).sort()).toEqual(['こま', 'ねこ']);
  });

  it('同じ乱数列なら同じ盤面になる', () => {
    const a = generateCrossword(ANIMALS, seeded(42));
    const b = generateCrossword(ANIMALS, seeded(42));
    expect(b).toEqual(a);
  });

  it('上限いっぱいの語数・文字数でも盤面ができる', () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const words: ClueWord[] = Array.from({ length: MAX_WORDS }, (_, i) => ({
      word: Array.from(
        { length: MAX_WORD_LENGTH },
        (_, k) => letters[(i * 7 + k * 3) % letters.length],
      ).join(''),
      clue: `clue ${i}`,
    }));
    const puzzle = generateCrossword(words, seeded(5));
    expect(puzzle.entries.length + puzzle.unplaced.length).toBe(MAX_WORDS);
    for (const e of puzzle.entries) {
      expect(readEntry(puzzle, e)).toBe(e.word);
    }
  });
});

describe('入力と盤面の境界・異常系', () => {
  it('CRLF・LF・混在の改行を同じように扱う', () => {
    const { entries, ignored } = parseEntries('CAT:a\r\nDOG:b\nBIRD:c\r\n');
    expect(entries.map((e) => e.word)).toEqual(['CAT', 'DOG', 'BIRD']);
    expect(entries[1].clue).toBe('b');
    expect(ignored).toBe(0);
  });

  it('答えが空の行（ヒントだけ・空白だけ）は無視し、除外数にも数えない', () => {
    const { entries, ignored } = parseEntries(':ヒントだけ\n   \n  :x\nCAT:a');
    expect(entries.map((e) => e.word)).toEqual(['CAT']);
    expect(ignored).toBe(0);
  });

  it('大文字小文字違いの重複は最初のヒントを使い、重複行は除外数に数えない', () => {
    const lines = Array.from({ length: MAX_WORDS }, (_, i) => `W${i}X:c`);
    // 先頭 CAT で1枠使うので、W29X の1語だけが上限超えで除外される
    const { entries, ignored } = parseEntries(
      ['cat:a', 'CAT:b', ...lines, ...lines.slice(0, 5)].join('\n'),
    );
    expect(entries).toHaveLength(MAX_WORDS);
    expect(entries[0]).toEqual({ word: 'CAT', clue: 'a' });
    expect(ignored).toBe(1);
  });

  it('ヒントは最初の区切りより後ろ全体を使う（2つ目のコロン以降も含む）', () => {
    expect(parseEntries('ab:c:d').entries).toEqual([
      { word: 'AB', clue: 'c:d' },
    ]);
  });

  it('絵文字は1文字として数え、ヒントの切り詰めでサロゲートペアを壊さない', () => {
    const { entries, ignored } = parseEntries(
      `🐱:x\n🐱🐶:${'🐱'.repeat(MAX_CLUE_LENGTH + 5)}`,
    );
    expect(entries.map((e) => e.word)).toEqual(['🐱🐶']);
    expect(ignored).toBe(1);
    expect(entries[0].clue).toBe('🐱'.repeat(MAX_CLUE_LENGTH));
  });

  it('文字を共有できない語ばかりでも、最初の1語は盤面に残る', () => {
    const words: ClueWord[] = ['AAA', 'BBB', 'CCC', 'DDD'].map((word) => ({
      word,
      clue: '',
    }));
    const puzzle = generateCrossword(words, seeded(9));
    expect(puzzle.entries).toHaveLength(1);
    expect(puzzle.unplaced).toHaveLength(3);
    expect(puzzle.width).toBe(3);
    expect(puzzle.height).toBe(1);
  });

  it('全角英数の答えも、盤面の文字と一致して置かれる', () => {
    const { entries } = parseEntries('ＣＡＴ:a\nＤＯＧ:b');
    const puzzle = generateCrossword(entries, seeded(4));
    expect(puzzle.entries.length + puzzle.unplaced.length).toBe(2);
    for (const e of puzzle.entries) {
      expect(readEntry(puzzle, e)).toBe(e.word);
    }
  });
});
