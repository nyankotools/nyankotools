import { describe, expect, it } from 'vitest';
import {
  parseRadixBytes,
  radixToText,
  textToRadix,
} from './text-binary-converter';

describe('textToRadix', () => {
  it('ASCIIを2/8/16進数にする', () => {
    expect(textToRadix('A', 'utf-8', 2).output).toBe('01000001');
    expect(textToRadix('A', 'utf-8', 8).output).toBe('101');
    expect(textToRadix('A', 'utf-8', 16).output).toBe('41');
  });

  it('空文字は空になる', () => {
    expect(textToRadix('', 'utf-8', 16)).toEqual({
      output: '',
      byteCount: 0,
      unmappable: [],
    });
  });

  it('UTF-8の日本語をバイトごとに空白区切りで出す', () => {
    const r = textToRadix('あ', 'utf-8', 16);
    expect(r.output).toBe('E3 81 82');
    expect(r.byteCount).toBe(3);
  });

  it('文字コードごとにバイト列が変わる', () => {
    expect(textToRadix('あ', 'shift_jis', 16).output).toBe('82 A0');
    expect(textToRadix('あ', 'utf-16le', 16).output).toBe('42 30');
    expect(textToRadix('あ', 'utf-16be', 16).output).toBe('30 42');
  });

  it('サロゲートペアをUTF-16BEで出す', () => {
    expect(textToRadix('😺', 'utf-16be', 16).output).toBe('D8 3D DE 3A');
    expect(textToRadix('😺', 'utf-8', 16).output).toBe('F0 9F 98 BA');
  });

  it('区切りなし・小文字を指定できる', () => {
    expect(
      textToRadix('あ', 'utf-8', 16, { separator: 'none', uppercase: false })
        .output,
    ).toBe('e38182');
    expect(textToRadix('AB', 'utf-8', 2, { separator: 'none' }).output).toBe(
      '0100000101000010',
    );
  });

  it('BOMを付けられる', () => {
    expect(textToRadix('A', 'utf-8', 16, { bom: true }).output).toBe(
      'EF BB BF 41',
    );
    expect(textToRadix('A', 'utf-16le', 16, { bom: true }).output).toBe(
      'FF FE 41 00',
    );
  });

  it('Shift_JISで表せない文字は?になり報告される', () => {
    const r = textToRadix('A😺', 'shift_jis', 16);
    expect(r.output).toBe('41 3F');
    expect(r.unmappable).toEqual(['😺']);
  });

  it('8進数は3桁にゼロ埋めする', () => {
    expect(textToRadix('\t', 'utf-8', 8).output).toBe('011');
  });
});

describe('parseRadixBytes', () => {
  it('区切りなしの連続を1バイトずつに分ける', () => {
    const r = parseRadixBytes('e38182', 16);
    expect(r.ok && Array.from(r.bytes)).toEqual([0xe3, 0x81, 0x82]);
  });

  it('カンマ・改行区切りと0x/\\x接頭辞を受け付ける', () => {
    const r = parseRadixBytes('0xE3,\\x81\n82', 16);
    expect(r.ok && Array.from(r.bytes)).toEqual([0xe3, 0x81, 0x82]);
  });

  it('2進数は区切りなしでも8桁ずつ読む', () => {
    const r = parseRadixBytes('0100000101000010', 2);
    expect(r.ok && Array.from(r.bytes)).toEqual([0x41, 0x42]);
  });

  it('不正な文字はinvalid-char', () => {
    expect(parseRadixBytes('41 4G', 16)).toEqual({
      ok: false,
      reason: 'invalid-char',
      token: '4G',
    });
    expect(parseRadixBytes('0102', 2).ok).toBe(false);
  });

  it('区切りなしで桁数が合わないとbad-length', () => {
    expect(parseRadixBytes('414', 16)).toMatchObject({
      ok: false,
      reason: 'bad-length',
    });
  });

  it('8進数で377を超えるとout-of-range', () => {
    expect(parseRadixBytes('400', 8)).toMatchObject({
      ok: false,
      reason: 'out-of-range',
    });
    expect(parseRadixBytes('101 400', 8)).toMatchObject({
      ok: false,
      reason: 'out-of-range',
    });
  });

  it('空入力は空のバイト列', () => {
    const r = parseRadixBytes('  ', 16);
    expect(r.ok && r.bytes.length).toBe(0);
  });
});

describe('radixToText', () => {
  it('往復して元のテキストに戻る', () => {
    const text = 'Hello こんにちは 😺 ｱ';
    for (const encoding of ['utf-8', 'utf-16le', 'utf-16be'] as const) {
      for (const radix of [2, 8, 16] as const) {
        const { output } = textToRadix(text, encoding, radix);
        expect(radixToText(output, encoding, radix)).toEqual({
          ok: true,
          text,
          errorCount: 0,
        });
      }
    }
  });

  it('Shift_JISを往復できる', () => {
    const text = '日本語テキスト';
    const { output } = textToRadix(text, 'shift_jis', 16);
    expect(radixToText(output, 'shift_jis', 16)).toMatchObject({
      ok: true,
      text,
    });
  });

  it('BOM付きはBOMを除いて復号する', () => {
    expect(radixToText('EF BB BF 41', 'utf-8', 16)).toMatchObject({
      text: 'A',
    });
  });

  it('不正なUTF-8バイトはerrorCountに数えられる', () => {
    const r = radixToText('FF 41', 'utf-8', 16);
    expect(r).toMatchObject({ ok: true, errorCount: 1 });
  });

  it('パース失敗はそのまま返す', () => {
    expect(radixToText('zz', 'utf-8', 16)).toMatchObject({
      ok: false,
      reason: 'invalid-char',
    });
  });
});
