import { describe, expect, it } from 'vitest';
import {
  addMatrices,
  determinant,
  formatDecimal,
  formatFraction,
  inverseMatrix,
  matrixToText,
  multiplyMatrices,
  parseFraction,
  parseMatrix,
  scaleMatrix,
  subtractMatrices,
  transposeMatrix,
  type Matrix,
} from './matrix-calculator';

function m(cells: string[][]): Matrix {
  const r = parseMatrix(cells);
  if (!r.ok) throw new Error('parse failed');
  return r.matrix;
}

function text(matrix: Matrix): string {
  return matrixToText(matrix, 'fraction');
}

describe('parseFraction', () => {
  it('整数・小数・分数を厳密に解釈する', () => {
    expect(formatFraction(parseFraction('3')!)).toBe('3');
    expect(formatFraction(parseFraction('-2.5')!)).toBe('-5/2');
    expect(formatFraction(parseFraction('0.1')!)).toBe('1/10');
    expect(formatFraction(parseFraction('6/8')!)).toBe('3/4');
    expect(formatFraction(parseFraction('1.5/3')!)).toBe('1/2');
  });

  it('全角入力と全角マイナスを受け付ける', () => {
    expect(formatFraction(parseFraction('−１／２')!)).toBe('-1/2');
  });

  it('不正な文字列と分母0は null', () => {
    expect(parseFraction('')).toBeNull();
    expect(parseFraction('abc')).toBeNull();
    expect(parseFraction('1/0')).toBeNull();
    expect(parseFraction('1/2/3')).toBeNull();
    expect(parseFraction('3/-4')).toBeNull();
    expect(parseFraction('.')).toBeNull();
    expect(parseFraction('1e3')).toBeNull();
  });
});

describe('parseMatrix', () => {
  it('空欄は 0 として扱う', () => {
    expect(
      text(
        m([
          ['1', ''],
          ['', '2'],
        ]),
      ),
    ).toBe('1\t0\n0\t2');
  });

  it('不正なセルの位置を返す', () => {
    const r = parseMatrix([
      ['1', '2'],
      ['3', 'x'],
    ]);
    expect(r).toEqual({ ok: false, error: 'invalid', row: 1, col: 1 });
  });

  it('空配列は empty', () => {
    expect(parseMatrix([])).toMatchObject({ ok: false, error: 'empty' });
  });
});

describe('和・差・積', () => {
  const a = m([
    ['1', '2'],
    ['3', '4'],
  ]);
  const b = m([
    ['5', '6'],
    ['7', '8'],
  ]);

  it('和', () => {
    const r = addMatrices(a, b);
    expect(r.ok && text(r.matrix)).toBe('6\t8\n10\t12');
  });

  it('差', () => {
    const r = subtractMatrices(a, b);
    expect(r.ok && text(r.matrix)).toBe('-4\t-4\n-4\t-4');
  });

  it('積', () => {
    const r = multiplyMatrices(a, b);
    expect(r.ok && text(r.matrix)).toBe('19\t22\n43\t50');
  });

  it('非正方行列の積（2x3 × 3x1）', () => {
    const r = multiplyMatrices(
      m([
        ['1', '2', '3'],
        ['4', '5', '6'],
      ]),
      m([['1'], ['0'], ['-1']]),
    );
    expect(r.ok && text(r.matrix)).toBe('-2\n-2');
  });

  it('サイズ不一致はエラー', () => {
    const c = m([['1', '2', '3']]);
    expect(addMatrices(a, c)).toEqual({ ok: false, error: 'sizeMismatch' });
    expect(subtractMatrices(a, c)).toEqual({
      ok: false,
      error: 'sizeMismatch',
    });
    expect(multiplyMatrices(a, c)).toEqual({
      ok: false,
      error: 'sizeMismatch',
    });
    expect(multiplyMatrices(c, a)).toEqual({
      ok: false,
      error: 'sizeMismatch',
    });
  });
});

describe('スカラー倍・転置', () => {
  it('分数のスカラー倍', () => {
    const r = scaleMatrix(
      m([
        ['2', '4'],
        ['6', '1'],
      ]),
      parseFraction('1/2')!,
    );
    expect(text(r)).toBe('1\t2\n3\t1/2');
  });

  it('転置', () => {
    expect(
      text(
        transposeMatrix(
          m([
            ['1', '2', '3'],
            ['4', '5', '6'],
          ]),
        ),
      ),
    ).toBe('1\t4\n2\t5\n3\t6');
  });
});

describe('行列式', () => {
  it('2x2', () => {
    const r = determinant(
      m([
        ['1', '2'],
        ['3', '4'],
      ]),
    );
    expect(r.ok && formatFraction(r.value)).toBe('-2');
  });

  it('3x3 で行の入れ替えが必要な場合', () => {
    const r = determinant(
      m([
        ['0', '2', '1'],
        ['1', '0', '0'],
        ['3', '1', '2'],
      ]),
    );
    // 0(0-0) - 2(2-0) + 1(1-0) = -3
    expect(r.ok && formatFraction(r.value)).toBe('-3');
  });

  it('特異行列は 0', () => {
    const r = determinant(
      m([
        ['1', '2'],
        ['2', '4'],
      ]),
    );
    expect(r.ok && formatFraction(r.value)).toBe('0');
  });

  it('1x1', () => {
    const r = determinant(m([['5/3']]));
    expect(r.ok && formatFraction(r.value)).toBe('5/3');
  });

  it('正方行列でなければエラー', () => {
    expect(determinant(m([['1', '2']]))).toEqual({
      ok: false,
      error: 'notSquare',
    });
  });

  it('6x6 の単位行列', () => {
    const rows = Array.from({ length: 6 }, (_, i) =>
      Array.from({ length: 6 }, (_, j) => (i === j ? '1' : '0')),
    );
    const r = determinant(m(rows));
    expect(r.ok && formatFraction(r.value)).toBe('1');
  });
});

describe('逆行列', () => {
  it('2x2 の逆行列は分数になる', () => {
    const r = inverseMatrix(
      m([
        ['1', '2'],
        ['3', '4'],
      ]),
    );
    expect(r.ok && text(r.matrix)).toBe('-2\t1\n3/2\t-1/2');
  });

  it('A × A^-1 が単位行列になる（3x3）', () => {
    const a = m([
      ['2', '0', '1'],
      ['1', '3', '2'],
      ['1', '1', '2'],
    ]);
    const inv = inverseMatrix(a);
    expect(inv.ok).toBe(true);
    if (!inv.ok) return;
    const prod = multiplyMatrices(a, inv.matrix);
    expect(prod.ok && text(prod.matrix)).toBe('1\t0\t0\n0\t1\t0\n0\t0\t1');
  });

  it('ピボットが 0 でも行入れ替えで求まる', () => {
    const r = inverseMatrix(
      m([
        ['0', '1'],
        ['1', '0'],
      ]),
    );
    expect(r.ok && text(r.matrix)).toBe('0\t1\n1\t0');
  });

  it('特異行列は singular', () => {
    expect(
      inverseMatrix(
        m([
          ['1', '2'],
          ['2', '4'],
        ]),
      ),
    ).toEqual({
      ok: false,
      error: 'singular',
    });
  });

  it('非正方行列は notSquare', () => {
    expect(inverseMatrix(m([['1', '2', '3']]))).toEqual({
      ok: false,
      error: 'notSquare',
    });
  });

  it('桁あふれしない（大きな整数）', () => {
    const big = '123456789012345678901234567890';
    const r = inverseMatrix(
      m([
        [big, '0'],
        ['0', '1'],
      ]),
    );
    expect(r.ok && text(r.matrix)).toBe(`1/${big}\t0\n0\t1`);
  });
});

describe('formatDecimal', () => {
  it('小数表示は6桁で丸め、末尾の0を落とす', () => {
    expect(formatDecimal(parseFraction('1/3')!)).toBe('0.333333');
    expect(formatDecimal(parseFraction('2/3')!)).toBe('0.666667');
    expect(formatDecimal(parseFraction('-3/2')!)).toBe('-1.5');
    expect(formatDecimal(parseFraction('4')!)).toBe('4');
  });

  it('丸めて 0 になる負数は -0 と表示しない', () => {
    expect(formatDecimal(parseFraction('-1/10000000')!)).toBe('0');
  });
});
