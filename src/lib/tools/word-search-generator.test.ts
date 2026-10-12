import { describe, it, expect } from 'vitest';
import {
  DIFFICULTIES,
  MAX_SIZE,
  MAX_WORDS,
  MIN_SIZE,
  clampSize,
  fillAlphabet,
  generateWordSearch,
  normalizeWord,
  parseWords,
} from './word-search-generator';
import type { RandomInt } from './word-search-generator';

/** 再現可能な疑似乱数（LCG） */
function seeded(seed: number): RandomInt {
  let s = seed >>> 0;
  return (max) => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return Math.floor((s / 0x100000000) * max);
  };
}

function readWord(
  grid: readonly string[],
  size: number,
  p: { word: string; x: number; y: number; dx: number; dy: number },
): string {
  const len = Array.from(p.word).length;
  let out = '';
  for (let k = 0; k < len; k++) {
    out += grid[(p.y + p.dy * k) * size + (p.x + p.dx * k)];
  }
  return out;
}

describe('clampSize', () => {
  it('範囲内に丸める', () => {
    expect(clampSize(1)).toBe(MIN_SIZE);
    expect(clampSize(999)).toBe(MAX_SIZE);
    expect(clampSize(12.6)).toBe(13);
  });
  it('数値でなければ既定値', () => {
    expect(clampSize(NaN)).toBe(12);
    expect(clampSize(Infinity)).toBe(12);
    expect(clampSize(-Infinity)).toBe(12);
  });
  it('境界値はそのまま、小数は四捨五入して範囲内に収める', () => {
    expect(clampSize(MIN_SIZE)).toBe(8);
    expect(clampSize(MAX_SIZE)).toBe(25);
    expect(clampSize(25.4)).toBe(25);
    expect(clampSize(7.5)).toBe(8);
    expect(clampSize(0)).toBe(8);
    expect(clampSize(-5)).toBe(8);
  });
});

describe('normalizeWord / parseWords', () => {
  it('全角英数を半角にし、大文字化と空白除去をする', () => {
    expect(normalizeWord(' ｉｃｅ cream ')).toBe('ICECREAM');
  });

  it('改行・カンマ・読点で区切り、重複を除く', () => {
    const { words, ignored } = parseWords('cat\nDog,cat、bird\r\n\n');
    expect(words).toEqual(['CAT', 'DOG', 'BIRD']);
    expect(ignored).toBe(0);
  });

  it('1文字の語は除外して数える', () => {
    const { words, ignored } = parseWords('a\nねこ');
    expect(words).toEqual(['ねこ']);
    expect(ignored).toBe(1);
  });

  it('語数の上限を超えた分は除外する', () => {
    const text = Array.from(
      { length: MAX_WORDS + 3 },
      (_, i) => `WORD${i}`,
    ).join('\n');
    const { words, ignored } = parseWords(text);
    expect(words).toHaveLength(MAX_WORDS);
    expect(ignored).toBe(3);
  });

  it('サロゲートペアも1文字として数える', () => {
    expect(parseWords('𠮷').words).toEqual([]);
    expect(parseWords('𠮷野').words).toEqual(['𠮷野']);
  });

  it('空入力や区切り文字だけなら語は0件', () => {
    expect(parseWords('')).toEqual({ words: [], ignored: 0 });
    expect(parseWords(' \n\n , 、\r\n')).toEqual({ words: [], ignored: 0 });
  });

  it('CR単独・全角の区切り（，；）でも分かれる', () => {
    expect(parseWords('a1\rbb').words).toEqual(['A1', 'BB']);
    expect(parseWords('ねこ；いぬ，とり').words).toEqual([
      'ねこ',
      'いぬ',
      'とり',
    ]);
  });

  it('全角英数は半角にそろえ、大文字小文字の違いは重複とみなす', () => {
    expect(parseWords('ＣＡＴ\nｄｏｇ\ncat\nCAT').words).toEqual([
      'CAT',
      'DOG',
    ]);
  });

  it('濁点の分解形はNFKCで1文字にまとめる', () => {
    expect(normalizeWord('がご')).toBe('がご');
    expect(parseWords('がご').words).toEqual(['がご']);
  });

  it('絵文字1つは1文字として除外、2つ以上なら扱う', () => {
    expect(parseWords('🐱')).toEqual({ words: [], ignored: 1 });
    expect(parseWords('🐱🐶').words).toEqual(['🐱🐶']);
  });

  it('上限ちょうどの50語は除外しない', () => {
    const text = Array.from({ length: MAX_WORDS }, (_, i) => `W${i}`).join(
      '\n',
    );
    expect(parseWords(text)).toEqual({
      words: Array.from({ length: MAX_WORDS }, (_, i) => `W${i}`),
      ignored: 0,
    });
  });
});

describe('fillAlphabet', () => {
  it('英字の語ならA-Z', () => {
    expect(fillAlphabet(['CAT', 'DOG'])).toHaveLength(26);
  });
  it('ひらがなの語ならひらがな', () => {
    const alphabet = fillAlphabet(['ねこ', 'いぬ']);
    expect(alphabet.every((c) => /[ぁ-ゖ]/.test(c))).toBe(true);
  });
  it('カタカナの語ならカタカナ', () => {
    const alphabet = fillAlphabet(['ネコ', 'イヌ']);
    expect(alphabet.every((c) => /[ァ-ヺ]/.test(c))).toBe(true);
  });
  it('漢字など他の文字種は語に使われた文字から選ぶ', () => {
    expect(fillAlphabet(['猫犬']).sort()).toEqual(['犬', '猫'].sort());
  });
  it('語が無ければA-Z', () => {
    expect(fillAlphabet([])).toHaveLength(26);
  });
  it('文字種が過半数でなければ語の文字から選ぶ（ひらがな2・英字1）', () => {
    const alphabet = fillAlphabet(['ねこ', 'A']);
    expect(alphabet.every((c) => /[ぁ-ゖ]/.test(c))).toBe(true);
  });
});

describe('generateWordSearch', () => {
  const words = ['APPLE', 'BANANA', 'CHERRY', 'GRAPE', 'LEMON', 'PEACH'];

  it('全ての語が指定位置・向きでグリッドに現れる', () => {
    for (const difficulty of DIFFICULTIES) {
      const result = generateWordSearch(words, 12, difficulty, seeded(7));
      expect(result.grid).toHaveLength(144);
      expect(result.unplaced).toEqual([]);
      expect(result.placements).toHaveLength(words.length);
      for (const p of result.placements) {
        expect(readWord(result.grid, result.size, p)).toBe(p.word);
      }
    }
  });

  it('かんたんは右と下だけ、ふつうは逆向きを使わない', () => {
    const many = Array.from(
      { length: 20 },
      (_, i) => `WORD${'ABCDEFGHIJKLMNOPQRST'[i]}`,
    );
    const easy = generateWordSearch(many, 20, 'easy', seeded(1));
    for (const p of easy.placements) {
      expect([
        [1, 0],
        [0, 1],
      ]).toContainEqual([p.dx, p.dy]);
    }
    const normal = generateWordSearch(many, 20, 'normal', seeded(2));
    for (const p of normal.placements) {
      expect(p.dx).toBeGreaterThanOrEqual(0);
      expect(p.dy === 0 || p.dy === 1 || p.dy === -1).toBe(true);
      expect(p.dx === 0 && p.dy === 0).toBe(false);
    }
  });

  it('むずかしいでは逆向きの配置が現れうる', () => {
    const many = Array.from({ length: 30 }, (_, i) => `ZW${i}XQ`);
    const hard = generateWordSearch(many, 25, 'hard', seeded(3));
    expect(
      hard.placements.some((p) => p.dx < 0 || (p.dx === 0 && p.dy < 0)),
    ).toBe(true);
  });

  it('グリッドより長い語は置けず unplaced に入る', () => {
    const result = generateWordSearch(
      ['ABCDEFGHIJKLM', 'CAT'],
      8,
      'normal',
      seeded(5),
    );
    expect(result.unplaced).toEqual(['ABCDEFGHIJKLM']);
    expect(result.placements.map((p) => p.word)).toEqual(['CAT']);
  });

  it('同じ入力と乱数なら同じ結果になる', () => {
    const a = generateWordSearch(words, 12, 'normal', seeded(42));
    const b = generateWordSearch(words, 12, 'normal', seeded(42));
    expect(a).toEqual(b);
  });

  it('空きマスは語の文字種で埋まる（ひらがな）', () => {
    const result = generateWordSearch(
      ['ねこ', 'いぬ', 'うさぎ'],
      8,
      'normal',
      seeded(9),
    );
    expect(result.grid.every((c) => /[ぁ-ゖ]/.test(c))).toBe(true);
  });

  it('語が空の入力でも落ちず、指定サイズの空きマスだけのグリッドになる', () => {
    const result = generateWordSearch([], 8, 'normal', seeded(4));
    expect(result.grid).toHaveLength(64);
    expect(result.placements).toEqual([]);
    expect(result.unplaced).toEqual([]);
  });

  it('マス数ちょうどの長さの語は置ける', () => {
    const result = generateWordSearch(['ABCDEFGH'], 8, 'easy', seeded(6));
    expect(result.unplaced).toEqual([]);
    expect(readWord(result.grid, 8, result.placements[0])).toBe('ABCDEFGH');
  });

  it('グリッドより長い語だけの場合は全部 unplaced になる', () => {
    const result = generateWordSearch(
      ['ABCDEFGHIJ', 'KLMNOPQRSTU'],
      8,
      'hard',
      seeded(8),
    );
    expect(result.placements).toEqual([]);
    expect([...result.unplaced].sort()).toEqual(['ABCDEFGHIJ', 'KLMNOPQRSTU']);
  });

  it('25×25に50語を入れても、置けた語は正しく読め、置けない語は必ず報告される', () => {
    const many = Array.from({ length: MAX_WORDS }, (_, i) => {
      const a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return `${a[i % 26]}${a[(i * 7) % 26]}${a[(i * 3) % 26]}${a[(i * 11) % 26]}${a[(i * 5) % 26]}${i}`;
    });
    for (const difficulty of DIFFICULTIES) {
      const result = generateWordSearch(many, 25, difficulty, seeded(11));
      expect(result.grid).toHaveLength(625);
      expect(result.placements.length + result.unplaced.length).toBe(MAX_WORDS);
      for (const p of result.placements) {
        expect(readWord(result.grid, 25, p)).toBe(p.word);
      }
    }
  });

  it('サロゲートペアの語は1マスとして置かれる', () => {
    const result = generateWordSearch(['𠮷野', '猫'], 8, 'normal', seeded(12));
    expect(result.unplaced).toEqual([]);
    const p = result.placements.find((q) => q.word === '𠮷野');
    expect(p).toBeDefined();
    expect(readWord(result.grid, 8, p!)).toBe('𠮷野');
    expect(result.grid.every((c) => Array.from(c).length === 1)).toBe(true);
  });

  it('意図しない同じ語が現れないようにする（置いた位置以外に出現しない）', () => {
    const short = ['AB', 'CD', 'EF', 'GH', 'IJ', 'KL', 'MN', 'OP'];
    for (let seed = 1; seed <= 20; seed++) {
      const r = generateWordSearch(short, 10, 'hard', seeded(seed));
      expect(r.unplaced).toEqual([]);
      for (const p of r.placements) {
        let hits = 0;
        for (const [dx, dy] of [
          [1, 0],
          [0, 1],
          [1, 1],
          [1, -1],
          [-1, 0],
          [0, -1],
          [-1, -1],
          [-1, 1],
        ]) {
          for (let y = 0; y < r.size; y++) {
            for (let x = 0; x < r.size; x++) {
              const ex = x + dx;
              const ey = y + dy;
              if (ex < 0 || ey < 0 || ex >= r.size || ey >= r.size) continue;
              if (
                r.grid[y * r.size + x] === p.word[0] &&
                r.grid[ey * r.size + ex] === p.word[1]
              ) {
                hits++;
              }
            }
          }
        }
        expect(hits).toBe(1);
      }
    }
  });
});
