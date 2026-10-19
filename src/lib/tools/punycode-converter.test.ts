import { describe, expect, it } from 'vitest';
import {
  decodePunycode,
  domainToAscii,
  domainToUnicode,
  encodePunycode,
} from './punycode-converter';

const cps = (...codes: number[]) => String.fromCodePoint(...codes);

// RFC 3492 section 7.1 のテストベクタ
const vectors: { name: string; text: string; puny: string }[] = [
  {
    name: 'Arabic (Egyptian)',
    text: cps(
      0x644,
      0x64a,
      0x647,
      0x645,
      0x627,
      0x628,
      0x62a,
      0x643,
      0x644,
      0x645,
      0x648,
      0x634,
      0x639,
      0x631,
      0x628,
      0x64a,
      0x61f,
    ),
    puny: 'egbpdaj6bu4bxfgehfvwxn',
  },
  {
    name: 'Chinese (simplified)',
    text: cps(
      0x4ed6,
      0x4eec,
      0x4e3a,
      0x4ec0,
      0x4e48,
      0x4e0d,
      0x8bf4,
      0x4e2d,
      0x6587,
    ),
    puny: 'ihqwcrb4cv8a8dqg056pqjye',
  },
  {
    name: 'Czech',
    text:
      'Pro' +
      cps(0x10d) +
      'prost' +
      cps(0x11b) +
      'nemluv' +
      cps(0xed) +
      cps(0x10d) +
      'esky',
    puny: 'Proprostnemluvesky-uyb24dma41a',
  },
  {
    name: 'Japanese 3nen B gumi',
    text: '3' + cps(0x5e74) + 'B' + cps(0x7d44, 0x91d1, 0x516b, 0x5148, 0x751f),
    puny: '3B-ww4c5e180e575a65lsy2b',
  },
  {
    name: 'Japanese with ASCII',
    text:
      'Hello-Another-Way-' +
      cps(0x305d, 0x308c, 0x305e, 0x308c, 0x306e, 0x5834, 0x6240),
    puny: 'Hello-Another-Way--fc4qua05auwb3674vfr0b',
  },
  {
    name: 'Japanese (maji de koi suru)',
    text:
      'Maji' +
      cps(0x3067) +
      'Koi' +
      cps(0x3059, 0x308b) +
      '5' +
      cps(0x79d2, 0x524d),
    puny: 'MajiKoi5-783gue6qz075azm5e',
  },
  {
    name: 'ASCII only',
    text: 'abc',
    puny: 'abc-',
  },
  {
    name: 'single non-ASCII',
    text: cps(0xfc),
    puny: 'tda',
  },
];

describe('encodePunycode / decodePunycode (RFC 3492)', () => {
  for (const v of vectors) {
    it(`encodes ${v.name}`, () => {
      expect(encodePunycode(v.text)).toEqual({ success: true, output: v.puny });
    });
    it(`decodes ${v.name}`, () => {
      expect(decodePunycode(v.puny)).toEqual({ success: true, output: v.text });
    });
  }

  it('handles supplementary-plane characters', () => {
    const text = 'a' + cps(0x1f600) + 'b';
    const enc = encodePunycode(text);
    expect(enc.success).toBe(true);
    if (enc.success) {
      expect(decodePunycode(enc.output)).toEqual({
        success: true,
        output: text,
      });
    }
  });

  it('returns empty for empty input', () => {
    expect(encodePunycode('')).toEqual({ success: true, output: '' });
    expect(decodePunycode('')).toEqual({ success: true, output: '' });
  });

  it('rejects invalid characters with position', () => {
    const r = decodePunycode('abc-!!');
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.kind).toBe('invalid-char');
      expect(r.error.char).toBe('!');
      expect(r.error.index).toBe(4);
    }
  });

  it('rejects non-ASCII in the basic part', () => {
    const r = decodePunycode(cps(0xe9) + '-abc');
    expect(r.success).toBe(false);
  });

  it('rejects truncated input', () => {
    // 先頭の変数長整数が途中で切れている
    const r = decodePunycode('99999');
    expect(r.success).toBe(false);
  });

  it('rejects overflow', () => {
    const r = decodePunycode('zzzzzzzzzzzzzzzzzzzz');
    expect(r.success).toBe(false);
  });
});

describe('domainToAscii', () => {
  it('converts Japanese domains', () => {
    expect(domainToAscii(cps(0x65e5, 0x672c, 0x8a9e) + '.jp')).toEqual({
      success: true,
      output: 'xn--wgv71a119e.jp',
    });
  });

  it('converts only non-ASCII labels', () => {
    expect(domainToAscii('www.m' + cps(0xfc) + 'nchen.de')).toEqual({
      success: true,
      output: 'www.xn--mnchen-3ya.de',
    });
  });

  it('accepts ideographic and fullwidth dots', () => {
    expect(
      domainToAscii('b' + cps(0xfc) + 'cher' + cps(0x3002) + 'de'),
    ).toEqual({
      success: true,
      output: 'xn--bcher-kva.de',
    });
    expect(
      domainToAscii('b' + cps(0xfc) + 'cher' + cps(0xff0e) + 'de'),
    ).toEqual({
      success: true,
      output: 'xn--bcher-kva.de',
    });
  });

  it('lowercases and normalizes non-ASCII labels', () => {
    expect(domainToAscii('B' + cps(0xdc) + 'CHER.de')).toEqual({
      success: true,
      output: 'xn--bcher-kva.de',
    });
  });

  it('leaves ASCII domains untouched', () => {
    expect(domainToAscii('Example.COM')).toEqual({
      success: true,
      output: 'Example.COM',
    });
  });

  it('reports labels longer than 63 characters', () => {
    const r = domainToAscii(cps(0x3042).repeat(60) + '.jp');
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.kind).toBe('label-too-long');
  });

  it('reports domains longer than 253 characters', () => {
    const label = 'a'.repeat(60);
    const r = domainToAscii(
      [label, label, label, label, label, cps(0xfc)].join('.'),
    );
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.kind).toBe('domain-too-long');
  });
});

describe('domainToUnicode', () => {
  it('converts xn-- labels back', () => {
    expect(domainToUnicode('xn--wgv71a119e.jp')).toEqual({
      success: true,
      output: cps(0x65e5, 0x672c, 0x8a9e) + '.jp',
    });
  });

  it('is case-insensitive for the prefix and keeps other labels', () => {
    expect(domainToUnicode('WWW.XN--mnchen-3ya.de')).toEqual({
      success: true,
      output: 'WWW.m' + cps(0xfc) + 'nchen.de',
    });
  });

  it('reports invalid Punycode in a label', () => {
    const r = domainToUnicode('xn--a!b.jp');
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.kind).toBe('invalid-char');
      expect(r.error.char).toBe('!');
    }
  });

  it('round-trips with domainToAscii', () => {
    const domain = cps(0x30c9, 0x30e1, 0x30a4, 0x30f3, 0x540d, 0x4f8b) + '.jp';
    const a = domainToAscii(domain);
    expect(a.success).toBe(true);
    if (a.success) {
      expect(domainToUnicode(a.output)).toEqual({
        success: true,
        output: domain,
      });
    }
  });
});

describe('レビュー指摘の回帰', () => {
  it('孤立サロゲートのエンコードは invalid-char になる', () => {
    const r = encodePunycode('a\ud800');
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.kind).toBe('invalid-char');
  });

  it('大量のコードポイントをデコードしても例外にならない', () => {
    const text = 'あ'.repeat(150000);
    const enc = encodePunycode(text);
    expect(enc.success).toBe(true);
  });
});

describe('エッジケース（QA追加）', () => {
  it('空文字のドメインは空のまま', () => {
    expect(domainToAscii('')).toEqual({ success: true, output: '' });
    expect(domainToUnicode('')).toEqual({ success: true, output: '' });
  });

  it('全角英数字はNFKCで正規化してASCIIのままにする', () => {
    expect(domainToAscii('ＥＸＡＭＰＬＥ．ｊｐ')).toEqual({
      success: true,
      output: 'example.jp',
    });
  });

  it('絵文字を含むドメインを往復できる', () => {
    const domain = '😀' + cps(0xfc) + '.jp';
    const a = domainToAscii(domain);
    expect(a.success).toBe(true);
    if (a.success) {
      expect(domainToUnicode(a.output)).toEqual({
        success: true,
        output: domain,
      });
    }
  });

  it('末尾のドットを保持する', () => {
    expect(domainToAscii('b' + cps(0xfc) + 'cher.de.')).toEqual({
      success: true,
      output: 'xn--bcher-kva.de.',
    });
  });

  it('ドメイン中の孤立サロゲートは invalid-char', () => {
    const r = domainToAscii('a\ud800.jp');
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.kind).toBe('invalid-char');
  });

  it('xn-- のみのラベルはエラーになる', () => {
    const r = domainToUnicode('xn--.jp');
    expect(r.success).toBe(false);
  });
});
