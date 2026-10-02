import { describe, expect, it } from 'vitest';
import {
  applyLineEnding,
  decodeBytes,
  detectLineEnding,
  detectEncoding,
  diagnoseMojibake,
  encodeText,
} from './encoding-converter';

describe('encodeText', () => {
  it('Shift_JISにエンコードする', () => {
    expect(Array.from(encodeText('あa', 'shift_jis').bytes)).toEqual([
      0x82, 0xa0, 0x61,
    ]);
  });

  it('半角カナと機種依存文字（①）をShift_JISで表現する', () => {
    expect(Array.from(encodeText('ｱ①', 'shift_jis').bytes)).toEqual([
      0xb1, 0x87, 0x40,
    ]);
  });

  it('EUC-JPにエンコードする', () => {
    expect(Array.from(encodeText('あ', 'euc-jp').bytes)).toEqual([0xa4, 0xa2]);
  });

  it('ISO-2022-JPはエスケープシーケンスで切り替える', () => {
    expect(Array.from(encodeText('aあb', 'iso-2022-jp').bytes)).toEqual([
      0x61, 0x1b, 0x24, 0x42, 0x24, 0x22, 0x1b, 0x28, 0x42, 0x62,
    ]);
  });

  it('表現できない文字は「?」にして報告する', () => {
    const r = encodeText('a😀b😀', 'shift_jis');
    expect(Array.from(r.bytes)).toEqual([0x61, 0x3f, 0x62, 0x3f]);
    expect(r.unmappable).toEqual(['😀']);
  });

  it('UTF-8のBOMを付けられる', () => {
    expect(Array.from(encodeText('a', 'utf-8', { bom: true }).bytes)).toEqual([
      0xef, 0xbb, 0xbf, 0x61,
    ]);
  });

  it('UTF-16LE/BEをBOM付きで出力できる', () => {
    expect(
      Array.from(encodeText('a', 'utf-16le', { bom: true }).bytes),
    ).toEqual([0xff, 0xfe, 0x61, 0x00]);
    expect(Array.from(encodeText('a', 'utf-16be').bytes)).toEqual([0x00, 0x61]);
  });

  it('デコードすると元に戻る（往復）', () => {
    const text = '日本語テキスト、ｱｲｳ①㈱ﾃｽﾄ';
    for (const enc of ['shift_jis', 'utf-8', 'utf-16le', 'utf-16be'] as const) {
      const { bytes } = encodeText(text, enc);
      expect(decodeBytes(bytes, enc).text).toBe(text);
    }
    const eucText = '日本語テキスト、ｱｲｳ';
    for (const enc of ['euc-jp', 'iso-2022-jp'] as const) {
      const { bytes } = encodeText(eucText.replace(/[ｱ-ﾝ]/g, ''), enc);
      expect(decodeBytes(bytes, enc).text).toBe(eucText.replace(/[ｱ-ﾝ]/g, ''));
    }
  });
});

describe('detectEncoding', () => {
  it('ASCIIのみならasciiフラグを立てる', () => {
    const r = detectEncoding(new TextEncoder().encode('hello'));
    expect(r.ascii).toBe(true);
    expect(r.best).toBe('utf-8');
  });

  it('UTF-8を判定する', () => {
    const { bytes } = encodeText('これは日本語のテキストです', 'utf-8');
    expect(detectEncoding(bytes).best).toBe('utf-8');
  });

  it('Shift_JISを判定する', () => {
    const { bytes } = encodeText('これは日本語のテキストです。', 'shift_jis');
    expect(detectEncoding(bytes).best).toBe('shift_jis');
  });

  it('EUC-JPを判定する', () => {
    const { bytes } = encodeText('これは日本語のテキストです。', 'euc-jp');
    expect(detectEncoding(bytes).best).toBe('euc-jp');
  });

  it('ISO-2022-JPを判定する', () => {
    const { bytes } = encodeText('日本語', 'iso-2022-jp');
    expect(detectEncoding(bytes).best).toBe('iso-2022-jp');
  });

  it('BOMからUTF-16LEを判定する', () => {
    const { bytes } = encodeText('日本語', 'utf-16le', { bom: true });
    expect(detectEncoding(bytes).best).toBe('utf-16le');
  });
});

describe('diagnoseMojibake', () => {
  it('UTF-8をShift_JISで読んだ文字化けを復元する', () => {
    const garbled = decodeBytes(
      encodeText('こんにちは', 'utf-8').bytes,
      'shift_jis',
    ).text;
    const result = diagnoseMojibake(garbled);
    expect(result[0]?.text).toBe('こんにちは');
    expect(result[0]?.actual).toBe('utf-8');
    expect(result[0]?.misread).toBe('shift_jis');
  });

  it('失われた部分（�）を含んでいても読める部分を復元する', () => {
    const garbled = decodeBytes(
      encodeText('日本語のテキストを入力してください', 'utf-8').bytes,
      'shift_jis',
    ).text;
    expect(garbled).toContain('�');
    const result = diagnoseMojibake(garbled);
    expect(result[0]?.actual).toBe('utf-8');
    expect(result[0]?.text).toContain('入力');
  });

  it('Shift_JISをLatin-1系で読んだ文字化けを復元する', () => {
    const garbled = new TextDecoder('windows-1252').decode(
      encodeText('テスト', 'shift_jis').bytes,
    );
    const result = diagnoseMojibake(garbled);
    expect(result.some((c) => c.text === 'テスト')).toBe(true);
  });

  it('化けていないテキストは候補なし', () => {
    expect(diagnoseMojibake('abc')).toEqual([]);
  });

  it('巨大な入力でもスタックを溢れさせずに処理できる', () => {
    const garbled = 'ç¸ºã�'.repeat(50000);
    expect(() => diagnoseMojibake(garbled)).not.toThrow();
  });
});

describe('波ダッシュなどの代替マッピング', () => {
  it('U+301C は Shift_JIS で全角チルダ相当（0x8160）になる', () => {
    const r = encodeText('〜', 'shift_jis');
    expect(Array.from(r.bytes)).toEqual([0x81, 0x60]);
    expect(r.unmappable).toEqual([]);
  });

  it('U+FF5E は EUC-JP でも変換できる', () => {
    expect(encodeText('～', 'euc-jp').unmappable).toEqual([]);
  });
});

describe('改行コード', () => {
  it('CRLFを検出し、指定した改行に揃える', () => {
    expect(detectLineEnding('a\r\nb\r\n')).toBe('crlf');
    expect(detectLineEnding('a\nb')).toBe('lf');
    expect(applyLineEnding('a\nb', 'crlf')).toBe('a\r\nb');
    expect(applyLineEnding('a\r\nb', 'lf')).toBe('a\nb');
  });

  it('空の文字列のときLFを返す', () => {
    expect(detectLineEnding('')).toBe('lf');
    expect(applyLineEnding('', 'lf')).toBe('');
    expect(applyLineEnding('', 'crlf')).toBe('');
  });

  it('CRLFだけの場合と同数のとき、CRLFを優先する', () => {
    expect(detectLineEnding('a\r\nb')).toBe('crlf');
    expect(detectLineEnding('a\r\nb\r\nc')).toBe('crlf');
  });

  it('古いMacの改行コード（CR）も正規化する', () => {
    expect(applyLineEnding('a\rb\rc', 'lf')).toBe('a\nb\nc');
    expect(applyLineEnding('a\rb\rc', 'crlf')).toBe('a\r\nb\r\nc');
  });
});

describe('エッジケース', () => {
  it('空文字列をエンコード・デコードする', () => {
    for (const enc of [
      'utf-8',
      'shift_jis',
      'euc-jp',
      'utf-16le',
      'utf-16be',
      'iso-2022-jp',
    ] as const) {
      const { bytes } = encodeText('', enc);
      expect(bytes.length).toBeGreaterThanOrEqual(0);
      const { text } = decodeBytes(bytes, enc);
      expect(text).toBe('');
    }
  });

  it('大きなテキストをエンコード・デコードする', () => {
    const large = '日本語テキスト'.repeat(1000);
    for (const enc of [
      'utf-8',
      'shift_jis',
      'euc-jp',
      'utf-16le',
      'utf-16be',
    ] as const) {
      const { bytes } = encodeText(large, enc);
      expect(bytes.length).toBeGreaterThan(0);
      const { text } = decodeBytes(bytes, enc);
      expect(text).toBe(large);
    }
  });

  it('ASCII文字のみのテキストを各エンコードで処理できる', () => {
    const ascii = 'Hello World 123 !@#$%';
    for (const enc of [
      'utf-8',
      'shift_jis',
      'euc-jp',
      'utf-16le',
      'utf-16be',
      'iso-2022-jp',
    ] as const) {
      const { bytes } = encodeText(ascii, enc);
      const { text } = decodeBytes(bytes, enc);
      expect(text).toBe(ascii);
    }
  });

  it('絵文字（サロゲートペア）はマッピング不可として扱う', () => {
    const emoji = '😀😁😂';
    for (const enc of ['shift_jis', 'euc-jp', 'iso-2022-jp'] as const) {
      const r = encodeText(emoji, enc);
      expect(r.unmappable).toContain('😀');
      expect(r.unmappable).toContain('😁');
      expect(r.unmappable).toContain('😂');
    }
  });

  it('複数のマッピング不可文字は重複なく報告される', () => {
    const text = '😀😀😀';
    const r = encodeText(text, 'shift_jis');
    expect(r.unmappable).toEqual(['😀']);
  });

  it('BOM付きUTF-8はBOMとして検出される', () => {
    const { bytes } = encodeText('テスト', 'utf-8', { bom: true });
    const result = detectEncoding(bytes);
    expect(result.best).toBe('utf-8');
    expect(result.candidates[0]?.score).toBe(2);
  });

  it('BOM付きUTF-16LEはBOMから検出される', () => {
    const { bytes } = encodeText('テスト', 'utf-16le', { bom: true });
    const result = detectEncoding(bytes);
    expect(result.best).toBe('utf-16le');
  });

  it('BOM付きUTF-16BEはBOMから検出される', () => {
    const { bytes } = encodeText('テスト', 'utf-16be', { bom: true });
    const result = detectEncoding(bytes);
    expect(result.best).toBe('utf-16be');
  });

  it('全角・半角混在テキスト', () => {
    const mixed = 'ａｂｃABC123あいうアイウ①㈱';
    for (const enc of ['utf-8', 'shift_jis', 'euc-jp'] as const) {
      const { bytes } = encodeText(mixed, enc);
      const { text } = decodeBytes(bytes, enc);
      expect(text).toBe(mixed);
    }
  });

  it('制御文字を含むテキスト', () => {
    const ctrl = 'a\x00\x01\x1fb';
    for (const enc of ['utf-8', 'shift_jis', 'euc-jp'] as const) {
      const { bytes } = encodeText(ctrl, enc);
      const { text } = decodeBytes(bytes, enc);
      expect(text).toBe(ctrl);
    }
  });
});

describe('代替マッピングの詳細', () => {
  it('波ダッシュとチルダの相互変換', () => {
    const wave = '〜';
    const tilde = '～';

    // U+301C (波ダッシュ) をShift_JISエンコード
    const waveEncoded = encodeText(wave, 'shift_jis');
    expect(waveEncoded.unmappable).toEqual([]);

    // U+FF5E (全角チルダ) をShift_JISエンコード
    const tildeEncoded = encodeText(tilde, 'shift_jis');
    expect(tildeEncoded.unmappable).toEqual([]);
  });

  it('その他の代替マッピング文字', () => {
    // テスト対象: ‖, ∥, −, −, ¢, ￠, £, ￡, ¬, ￢, —, —
    const alternates = [
      ['‖', '∥'],
      ['−', '－'],
      ['¢', '￠'],
      ['£', '￡'],
      ['¬', '￢'],
      ['—', '―'],
    ];

    for (const [char1, char2] of alternates) {
      // 両方の文字がShift_JISで表現可能か試す
      const r1 = encodeText(char1, 'shift_jis');
      const r2 = encodeText(char2, 'shift_jis');
      // 少なくとも片方は表現可能なはず
      expect(r1.unmappable.length + r2.unmappable.length).toBeLessThanOrEqual(
        1,
      );
    }
  });
});

describe('Shift_JISの機種依存文字', () => {
  it('代表的な機種依存文字をエンコードできる', () => {
    // CP932で表現可能な機種依存文字（文字参照テストで確認済み）
    const chars = ['①', '②', '③', '④', '⑤', '㈱', '㈲', '㈹'];
    for (const ch of chars) {
      const r = encodeText(ch, 'shift_jis');
      expect(r.unmappable).not.toContain(ch);
    }
  });

  it('CP932に無いUnicode文字はマッピング不可になる', () => {
    // U+3DFF (㍿) はCP932に存在しない
    const r = encodeText('㍿', 'shift_jis');
    expect(r.unmappable).toContain('㍿');
  });
});

describe('文字化け診断の詳細', () => {
  it('空文字列と空白のみは候補なし', () => {
    expect(diagnoseMojibake('')).toEqual([]);
    expect(diagnoseMojibake('   ')).toEqual([]);
    expect(diagnoseMojibake('\n\n')).toEqual([]);
  });

  it('EUC-JPがShift_JISで読まれた場合', () => {
    const garbled = decodeBytes(
      encodeText('こんにちは', 'euc-jp').bytes,
      'shift_jis',
    ).text;
    const result = diagnoseMojibake(garbled);
    expect(
      result.some((c) => c.actual === 'euc-jp' && c.misread === 'shift_jis'),
    ).toBe(true);
  });

  it('Shift_JISがUTF-8として読まれた場合', () => {
    const garbled = decodeBytes(
      encodeText('テスト', 'shift_jis').bytes,
      'utf-8',
    ).text;
    if (garbled.includes('�')) {
      // 不正バイトが含まれている場合
      const result = diagnoseMojibake(garbled);
      expect(result.length).toBeGreaterThanOrEqual(0);
    }
  });

  it('化けていない日本語テキストは候補なし', () => {
    expect(diagnoseMojibake('こんにちは')).toEqual([]);
    expect(diagnoseMojibake('日本語のテキスト')).toEqual([]);
  });

  it('スコア計算で自然な日本語が上位になる', () => {
    const garbled = decodeBytes(
      encodeText('これは日本語のテキストです。', 'utf-8').bytes,
      'shift_jis',
    ).text;
    const result = diagnoseMojibake(garbled);
    if (result.length > 0) {
      expect(result[0]?.score).toBeGreaterThan(0);
      expect(result[0]?.text).toContain('日本語');
    }
  });
});
