import { describe, expect, it } from 'vitest';
import {
  buildShareHash,
  decodePayload,
  encodePayload,
  extractShareCode,
  formatShareCode,
  parseShareCode,
  parseShareHash,
} from './codec';
import { randomInput, testRandom } from './test-theme';

/** codec.ts の ALPHABET と同じ（符号の値 → 文字を確かめるため） */
const ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

describe('codec', () => {
  it('12問 + variant は6文字で、往復できる', () => {
    const rand = testRandom(1);
    for (let i = 0; i < 2000; i++) {
      const { answers, variant } = randomInput(rand);
      const payload = encodePayload(answers, variant);
      expect(payload).toMatch(/^[A-Za-z0-9_-]{6}$/);
      expect(decodePayload(payload, 12)).toEqual({ answers, variant });
    }
  });

  it('端の値も往復できる', () => {
    for (const [answers, variant] of [
      [Array(12).fill(0), 0],
      [Array(12).fill(3), 4095],
    ] as const) {
      expect(decodePayload(encodePayload(answers, variant), 12)).toEqual({
        answers,
        variant,
      });
    }
    expect(encodePayload(Array(12).fill(0), 0)).toBe('AAAAAA');
  });

  it('問数 1〜12 のすべてで往復できる（6の倍数でない問数も含む）', () => {
    const rand = testRandom(12);
    for (let q = 1; q <= 12; q++) {
      for (let i = 0; i < 200; i++) {
        const answers = Array.from({ length: q }, () => Math.floor(rand() * 4));
        const variant = Math.floor(rand() * 4096);
        const payload = encodePayload(answers, variant);
        expect(payload).toHaveLength(Math.ceil((q * 2 + 12) / 6));
        expect(decodePayload(payload, q)).toEqual({ answers, variant });
      }
    }
  });

  it('問数が6の倍数でないときは余りbitを0で埋め、0以外は拒否する', () => {
    const payload = encodePayload(Array(11).fill(3), 4095); // 34bit → 6文字
    expect(payload).toHaveLength(6);
    expect(decodePayload(payload, 11)?.variant).toBe(4095);
    const last = payload.at(-1)!;
    expect(last).toBe('8'); // 111100
    expect(decodePayload(`${payload.slice(0, 5)}9`, 11)).toBeNull();
  });

  it('余りbitが立っていれば、どの問数でも拒否する', () => {
    for (let q = 1; q <= 12; q++) {
      if ((q * 2 + 12) % 6 === 0) continue; // 余りがない問数は対象外
      const payload = encodePayload(Array(q).fill(1), 5);
      // 最後の文字の最下位bitは余りbit（0で埋めたもの）なので、それを立てる
      const bad =
        payload.slice(0, -1) + ALPHABET[ALPHABET.indexOf(payload.at(-1)!) ^ 1];
      expect(decodePayload(bad, q)).toBeNull();
    }
  });

  it('壊れた payload は例外を出さず null', () => {
    expect(decodePayload('', 12)).toBeNull();
    expect(decodePayload('AAAAA', 12)).toBeNull();
    expect(decodePayload('AAAAAAA', 12)).toBeNull();
    expect(decodePayload('AAAA+A', 12)).toBeNull();
    expect(decodePayload('AAAAあA', 12)).toBeNull();
  });

  it('記号・空白・改行・絵文字（サロゲートペア）を含む payload は null', () => {
    for (const bad of [
      'AAAA🐈', // 長さは6でも絵文字は1文字として扱えない
      'AAAAAA\n',
      ' AAAAA',
      'AAAAA=',
      'AAAA/A',
      'AAAA A',
      'AAAAA.',
    ]) {
      expect(decodePayload(bad, 12)).toBeNull();
    }
  });

  it('共有コードは <engineVer>.<themeVer>.<payload>', () => {
    const code = { engineVersion: 1, themeVersion: 2, payload: 'AbC-_9' };
    expect(formatShareCode(code)).toBe('1.2.AbC-_9');
    expect(parseShareCode('1.2.AbC-_9')).toEqual(code);
    for (const bad of [
      '',
      '1.2',
      '0.1.AAAAAA',
      '1.01.AAAAAA',
      '1.1.AA=A',
      'x',
    ]) {
      expect(parseShareCode(bad)).toBeNull();
    }
  });

  it('共有コードの桁数・空payload・末尾改行・先頭ゼロを拒否する', () => {
    for (const bad of [
      '1.1.',
      '1.1.AAAAAA\n',
      ' 1.1.AAAAAA',
      '01.1.AAAAAA',
      '1000.1.AAAAAA',
      '1.1000.AAAAAA',
      `1.1.${'A'.repeat(65)}`,
      '1.1.AAAA AA',
      '1.1.AAAAAA.',
    ]) {
      expect(parseShareCode(bad)).toBeNull();
    }
    // 上限ちょうど（版3桁・payload 64文字）は通る
    expect(parseShareCode(`999.999.${'A'.repeat(64)}`)).not.toBeNull();
  });

  it('共有ハッシュを組み立て・分解できる', () => {
    expect(buildShareHash('1.1.AAAAAA')).toBe('#r=1.1.AAAAAA');
    expect(buildShareHash('1.1.AAAAAA', '1.1.BBBBBB')).toBe(
      '#r=1.1.AAAAAA&vs=1.1.BBBBBB',
    );
    expect(parseShareHash('#r=1.1.AAAAAA&vs=1.1.BBBBBB')).toEqual({
      self: '1.1.AAAAAA',
      vs: '1.1.BBBBBB',
    });
    expect(parseShareHash('#r=1.1.AAAAAA')).toEqual({ self: '1.1.AAAAAA' });
    expect(parseShareHash('')).toBeNull();
    expect(parseShareHash('#vs=1.1.AAAAAA')).toBeNull();
  });

  it('vs が空・#なしのURLハッシュは相手なし扱い、空の相手は組み立てない', () => {
    expect(parseShareHash('#r=1.1.AAAAAA&vs=')).toEqual({ self: '1.1.AAAAAA' });
    expect(parseShareHash('r=1.1.AAAAAA')).toEqual({ self: '1.1.AAAAAA' });
    expect(buildShareHash('1.1.AAAAAA', '')).toBe('#r=1.1.AAAAAA');
  });

  it('ランダムな文字列は例外を出さず、decode・parse できたものは入力と同じ表記になる', () => {
    const rand = testRandom(55);
    const chars = `${ALPHABET}+/= .\nあ🐈`;
    let decoded = 0;
    let parsed = 0;
    for (let i = 0; i < 20000; i++) {
      const len = Math.floor(rand() * 10);
      let s = '';
      for (let j = 0; j < len; j++) {
        s += [...chars][Math.floor(rand() * [...chars].length)];
      }
      const d = decodePayload(s, 12);
      if (d) {
        decoded++;
        expect(encodePayload(d.answers, d.variant)).toBe(s);
      }
      const p = parseShareCode(`1.1.${s}`);
      if (p) {
        parsed++;
        expect(formatShareCode(p)).toBe(`1.1.${s}`);
      }
    }
    expect(decoded).toBeGreaterThan(0);
    expect(parsed).toBeGreaterThan(0);
  });
});

describe('共有ハッシュのエンコード違い', () => {
  const code = '1.1.AbC-_9';

  it('パーセント符号化された区切り（%2E）やキー（%72 = r）も同じ値に戻す', () => {
    expect(parseShareHash(`#r=${code.replaceAll('.', '%2E')}`)).toEqual({
      self: code,
    });
    expect(parseShareHash(`#%72=${code}`)).toEqual({ self: code });
  });

  it('余分なキー・末尾の & は無視し、値の前後の空白や改行は残して後段で拒否させる', () => {
    expect(parseShareHash(`#x=1&r=${code}&`)).toEqual({ self: code });
    // URLSearchParams は %0A・%20 を文字として残すので、共有コードの形式で拒否される
    const withNewline = parseShareHash(`#r=${code}%0A`)!;
    expect(withNewline.self).toBe(`${code}\n`);
    expect(parseShareCode(withNewline.self)).toBeNull();
    expect(parseShareCode(parseShareHash(`#r=${code}%20`)!.self)).toBeNull();
  });
});

describe('extractShareCode', () => {
  const code = '1.1.AbC-_9';

  it('共有URL・ハッシュ・共有コードそのものから取り出す', () => {
    for (const text of [
      `https://nyankotools.com/shindan/neko/#r=${code}`,
      `  https://nyankotools.com/shindan/neko/#r=${code}\n`,
      `#r=${code}`,
      code,
    ]) {
      expect(extractShareCode(text), text).toBe(code);
    }
  });

  it('相性URLは持ち主（r）のコードを返す', () => {
    expect(
      extractShareCode(
        `https://nyankotools.com/shindan/neko/#r=${code}&vs=1.1.AAAAAA`,
      ),
    ).toBe(code);
  });

  it('形式が違えば null', () => {
    for (const text of [
      '',
      'https://nyankotools.com/shindan/neko/',
      'https://nyankotools.com/shindan/neko/#vs=1.1.AAAAAA',
      '#r=garbage',
      '1.1.AbC-_9 extra',
    ]) {
      expect(extractShareCode(text), text).toBeNull();
    }
  });
});
