import { describe, expect, it } from 'vitest';
import {
  checkExtension,
  detectFileType,
  formatFileSize,
  formatHexDump,
  formatHeadBytes,
  getExtension,
} from './file-type-detector';

const bytes = (...values: number[]) => new Uint8Array(values);
const ascii = (s: string) => new TextEncoder().encode(s);
const concat = (...parts: Uint8Array[]) => {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let pos = 0;
  for (const p of parts) {
    out.set(p, pos);
    pos += p.length;
  }
  return out;
};

/** 非圧縮・サイズ既知のZIPローカルヘッダーを持つエントリを作る */
function zipEntry(name: string, content = ''): Uint8Array {
  const nameBytes = ascii(name);
  const body = ascii(content);
  const header = new Uint8Array(30);
  header.set([0x50, 0x4b, 0x03, 0x04], 0);
  new DataView(header.buffer).setUint32(18, body.length, true);
  new DataView(header.buffer).setUint32(22, body.length, true);
  new DataView(header.buffer).setUint16(26, nameBytes.length, true);
  return concat(header, nameBytes, body);
}

function riff(form: string): Uint8Array {
  return concat(ascii('RIFF'), bytes(0, 0, 0, 0), ascii(form), bytes(0, 0));
}

function ftyp(major: string, ...compatible: string[]): Uint8Array {
  const size = 16 + compatible.length * 4;
  return concat(
    bytes(0, 0, 0, size),
    ascii('ftyp'),
    ascii(major),
    bytes(0, 0, 0, 0),
    ...compatible.map(ascii),
  );
}

const PNG_HEAD = bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);

/** BMP のファイルヘッダー（14バイト）と DIB ヘッダーサイズ 40 */
function bmpHead(): Uint8Array {
  const data = new Uint8Array(18);
  data.set(ascii('BM'), 0);
  data[14] = 40;
  return data;
}

describe('detectFileType', () => {
  it('PNG・JPEG・GIF・PDF を判定する', () => {
    expect(detectFileType(PNG_HEAD)?.name).toBe('PNG');
    expect(detectFileType(bytes(0xff, 0xd8, 0xff, 0xe0))?.name).toBe('JPEG');
    expect(detectFileType(ascii('GIF89a....'))?.name).toBe('GIF');
    expect(detectFileType(ascii('%PDF-1.7\n'))?.name).toBe('PDF');
  });

  it('RIFF コンテナを WebP / WAV / AVI に振り分ける', () => {
    expect(detectFileType(riff('WEBP'))?.name).toBe('WebP');
    expect(detectFileType(riff('WAVE'))?.name).toBe('WAV');
    expect(detectFileType(riff('AVI '))?.name).toBe('AVI');
  });

  it('ftyp ブランドで MP4 / MOV / AVIF / HEIC を見分ける', () => {
    expect(detectFileType(ftyp('isom', 'mp42'))?.name).toBe('MP4');
    expect(detectFileType(ftyp('qt  '))?.name).toBe('QuickTime');
    expect(detectFileType(ftyp('mif1', 'avif'))?.name).toBe('AVIF');
    expect(detectFileType(ftyp('heic'))?.name).toBe('HEIC');
    expect(detectFileType(ftyp('M4A '))?.name).toBe('M4A');
  });

  it('ZIP のエントリ名から Office / EPUB / APK / JAR を見分ける', () => {
    expect(
      detectFileType(
        concat(zipEntry('[Content_Types].xml'), zipEntry('word/document.xml')),
      )?.name,
    ).toBe('DOCX');
    expect(detectFileType(zipEntry('xl/workbook.xml'))?.name).toBe('XLSX');
    expect(
      detectFileType(
        concat(zipEntry('mimetype', 'application/epub+zip'), zipEntry('a')),
      )?.name,
    ).toBe('EPUB');
    expect(detectFileType(zipEntry('AndroidManifest.xml'))?.name).toBe('APK');
    expect(detectFileType(zipEntry('META-INF/MANIFEST.MF'))?.name).toBe('JAR');
    expect(detectFileType(zipEntry('readme.txt', 'hi'))?.name).toBe('ZIP');
  });

  it('CAFEBABE を Java クラスと Mach-O ユニバーサルで分ける', () => {
    expect(
      detectFileType(bytes(0xca, 0xfe, 0xba, 0xbe, 0, 0, 0, 52))?.name,
    ).toBe('Java class');
    expect(
      detectFileType(bytes(0xca, 0xfe, 0xba, 0xbe, 0, 0, 0, 2))?.name,
    ).toBe('Mach-O');
  });

  it('EXE（MZ）・ELF・SQLite・WebAssembly を判定する', () => {
    const pe = new Uint8Array(128);
    pe.set(ascii('MZ'), 0);
    pe[0x3c] = 0x60; // e_lfanew
    pe.set(ascii('PE'), 0x60);
    expect(detectFileType(pe)?.category).toBe('executable');
    expect(detectFileType(bytes(0x7f, 0x45, 0x4c, 0x46, 2, 1))?.name).toBe(
      'ELF',
    );
    expect(detectFileType(ascii('SQLite format 3\0'))?.name).toBe('SQLite');
    expect(detectFileType(bytes(0, 0x61, 0x73, 0x6d, 1, 0, 0, 0))?.name).toBe(
      'WebAssembly',
    );
  });

  it('TAR は 257 バイト目の ustar で判定する', () => {
    const data = new Uint8Array(512);
    data.set(ascii('ustar'), 257);
    expect(detectFileType(data)?.name).toBe('TAR');
  });

  it('WebM と Matroska を DocType で分ける', () => {
    const webm = concat(bytes(0x1a, 0x45, 0xdf, 0xa3), ascii('....webm'));
    const mkv = concat(bytes(0x1a, 0x45, 0xdf, 0xa3), ascii('..matroska'));
    expect(detectFileType(webm)?.name).toBe('WebM');
    expect(detectFileType(mkv)?.name).toBe('Matroska');
  });

  it('テキスト系（HTML・XML・SVG・スクリプト・プレーン）を判定する', () => {
    expect(detectFileType(ascii('<!DOCTYPE html><html>'))?.name).toBe('HTML');
    expect(detectFileType(ascii('<?xml version="1.0"?><root/>'))?.name).toBe(
      'XML',
    );
    expect(
      detectFileType(ascii('<?xml version="1.0"?>\n<svg xmlns=""/>'))?.name,
    ).toBe('SVG');
    expect(detectFileType(ascii('#!/bin/sh\necho hi'))?.name).toBe(
      'Script (#!)',
    );
    expect(detectFileType(ascii('こんにちは\nhello'))?.name).toBe('Text');
  });

  it('BOM 付きテキストを判定する', () => {
    expect(detectFileType(bytes(0xef, 0xbb, 0xbf, 0x61))?.name).toBe(
      'Text (UTF-8 with BOM)',
    );
    expect(detectFileType(bytes(0xff, 0xfe, 0x61, 0x00))?.name).toBe(
      'Text (UTF-16 LE)',
    );
  });

  it('Shift_JIS 等の非UTF-8テキストを判定する', () => {
    // 「あい」= 82 A0 82 A2
    expect(detectFileType(bytes(0x82, 0xa0, 0x82, 0xa2))?.name).toBe(
      'Text (non-UTF-8)',
    );
  });

  it('マルチバイト文字がサンプル末尾で切れてもテキストと判定する', () => {
    const data = new Uint8Array(4096);
    data.fill(0x61);
    data.set(ascii('あ').subarray(0, 2), 4094);
    expect(detectFileType(data)?.name).toBe('Text');
  });

  it('MZ・BZh・ID3 で始まるだけのテキストはバイナリ扱いしない', () => {
    expect(detectFileType(ascii('MZ_note: hello'))?.name).toBe('Text');
    expect(detectFileType(ascii('BZh is a prefix'))?.name).toBe('Text');
    expect(detectFileType(ascii('ID3 tags explained'))?.name).toBe('Text');
  });

  it('制御文字を含む未知のバイナリは null', () => {
    expect(detectFileType(bytes(0x01, 0x02, 0x03, 0x04))).toBeNull();
  });

  it('主要な署名（圧縮・音声・画像・フォント・その他）を個別に判定する', () => {
    // 先頭に署名バイトを置き、残りを0埋めした64バイトのデータを作る
    const pad = (head: number[] | string, size = 64) => {
      const body =
        typeof head === 'string' ? ascii(head) : Uint8Array.from(head);
      const out = new Uint8Array(size);
      out.set(body, 0);
      return out;
    };
    const cases: [string, Uint8Array, string][] = [
      ['GZIP', pad([0x1f, 0x8b, 0x08]), 'GZIP'],
      [
        'BZIP2',
        pad([0x42, 0x5a, 0x68, 0x39, 0x31, 0x41, 0x59, 0x26, 0x53, 0x59]),
        'BZIP2',
      ],
      ['7z', pad([0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c]), '7-Zip'],
      ['RAR', pad([0x52, 0x61, 0x72, 0x21, 0x1a, 0x07]), 'RAR'],
      ['XZ', pad([0xfd, 0x37, 0x7a, 0x58, 0x5a, 0x00]), 'XZ'],
      ['Zstandard', pad([0x28, 0xb5, 0x2f, 0xfd]), 'Zstandard'],
      ['CAB', pad('MSCF'), 'CAB'],
      ['LZIP', pad('LZIP'), 'LZIP'],
      ['RPM', pad([0xed, 0xab, 0xee, 0xdb]), 'RPM'],
      ['ar', pad('!<arch>\n'), 'ar'],
      ['ID3 付き MP3', pad([0x49, 0x44, 0x33, 0x03, 0x00]), 'MP3'],
      ['MP3 (frame sync)', pad([0xff, 0xfb, 0x90]), 'MP3'],
      ['AAC (ADTS)', pad([0xff, 0xf1, 0x50]), 'AAC'],
      ['FLAC', pad('fLaC'), 'FLAC'],
      ['Ogg', pad('OggS'), 'Ogg'],
      ['MIDI', pad('MThd'), 'MIDI'],
      ['AIFF', concat(ascii('FORM'), bytes(0, 0, 0, 0), ascii('AIFF')), 'AIFF'],
      ['FLV', pad([0x46, 0x4c, 0x56, 0x01]), 'FLV'],
      ['MPEG-PS', pad([0x00, 0x00, 0x01, 0xba]), 'MPEG'],
      [
        'ASF (WMV)',
        pad([
          0x30, 0x26, 0xb2, 0x75, 0x8e, 0x66, 0xcf, 0x11, 0xa6, 0xd9, 0x00,
          0xaa, 0x00, 0x62, 0xce, 0x6c,
        ]),
        'ASF',
      ],
      ['3GP（ftyp の 3gp ブランド）', ftyp('3gp4'), '3GP'],
      ['ICO', pad([0, 0, 1, 0, 1, 0]), 'ICO'],
      ['CUR', pad([0, 0, 2, 0, 1, 0]), 'CUR'],
      ['BMP', bmpHead(), 'BMP'],
      ['TIFF (little endian)', pad('II*\0'), 'TIFF'],
      ['TIFF (big endian)', pad('MM\0*'), 'TIFF'],
      ['PSD', pad('8BPS'), 'PSD'],
      [
        'OLE2 (旧 Office)',
        pad([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]),
        'OLE2 (legacy Office)',
      ],
      ['PostScript', pad('%!PS'), 'PostScript'],
      ['RTF', pad('{\\rtf1'), 'RTF'],
      [
        'Windows shortcut',
        pad([0x4c, 0, 0, 0, 0x01, 0x14, 0x02, 0]),
        'Windows shortcut',
      ],
      ['Dalvik DEX', pad('dex\n035\0'), 'Dalvik DEX'],
      ['TrueType', pad([0, 1, 0, 0, 0, 1]), 'TrueType'],
      ['OpenType (CFF)', pad('OTTO'), 'OpenType'],
      ['TrueType Collection', pad('ttcf'), 'TrueType Collection'],
      ['WOFF', pad('wOFF'), 'WOFF'],
      ['WOFF2', pad('wOF2'), 'WOFF2'],
      ['pcap', pad([0xd4, 0xc3, 0xb2, 0xa1]), 'pcap'],
      ['pcapng', pad([0x0a, 0x0d, 0x0d, 0x0a]), 'pcapng'],
      [
        'MPEG-TS',
        (() => {
          const d = new Uint8Array(400);
          d[0] = 0x47;
          d[188] = 0x47;
          d[376] = 0x47;
          return d;
        })(),
        'MPEG-TS',
      ],
      ['ZIP（空の中身）', pad([0x50, 0x4b, 0x05, 0x06]), 'ZIP'],
    ];
    for (const [label, data, expected] of cases) {
      expect(detectFileType(data)?.name, label).toBe(expected);
    }
  });

  it('テキストの改行（LF・CRLF・CR）・タブ・ANSIエスケープ・絵文字を通す', () => {
    expect(detectFileType(ascii('a\r\nb\r\n'))?.name).toBe('Text');
    expect(detectFileType(ascii('a\rb\rc'))?.name).toBe('Text');
    expect(detectFileType(ascii('col1\tcol2'))?.name).toBe('Text');
    expect(detectFileType(ascii('\x1b[31mred\x1b[0m'))?.name).toBe('Text');
    expect(detectFileType(ascii('😀 テスト 🎉'))?.name).toBe('Text');
  });

  it('UTF-16 BE の BOM を判定し、NUL・DEL を含むものは判定しない', () => {
    expect(detectFileType(bytes(0xfe, 0xff, 0x00, 0x61))?.name).toBe(
      'Text (UTF-16 BE)',
    );
    expect(detectFileType(ascii('a\0b'))).toBeNull();
    expect(detectFileType(bytes(0x61, 0x7f, 0x62))).toBeNull();
  });

  it('ストリーム書き込みZIP（サイズ未記載）の Office 形式も先頭の名前から判定する', () => {
    const entry = zipEntry('[Content_Types].xml');
    entry[6] = 0x08; // bit3: サイズ未記載
    const data = concat(entry, ascii('xxword/document.xml'));
    expect(detectFileType(data)?.name).toBe('DOCX');
  });

  it('ODF（ODS）と EPUB 以外の mimetype は ZIP のまま', () => {
    expect(
      detectFileType(
        zipEntry('mimetype', 'application/vnd.oasis.opendocument.spreadsheet'),
      )?.name,
    ).toBe('ODS');
    expect(
      detectFileType(zipEntry('mimetype', 'application/unknown'))?.name,
    ).toBe('ZIP');
  });

  it('空データは null', () => {
    expect(detectFileType(new Uint8Array(0))).toBeNull();
  });

  it('壊れた ZIP ヘッダーでも例外を投げない', () => {
    expect(() =>
      detectFileType(bytes(0x50, 0x4b, 0x03, 0x04, 1, 2, 3)),
    ).not.toThrow();
  });
});

describe('checkExtension', () => {
  const png = detectFileType(PNG_HEAD);
  const text = detectFileType(ascii('hello'));
  const html = detectFileType(ascii('<html>'));

  it('拡張子が一致する', () => {
    expect(checkExtension(png, 'a.PNG').status).toBe('match');
  });

  it('拡張子が一致しない', () => {
    const result = checkExtension(png, 'photo.jpg');
    expect(result.status).toBe('mismatch');
    expect(result.extension).toBe('jpg');
  });

  it('拡張子が無い', () => {
    expect(checkExtension(png, 'README').status).toBe('no-extension');
    expect(checkExtension(png, '.gitignore').status).toBe('no-extension');
  });

  it('判定できない場合は undetermined', () => {
    expect(checkExtension(null, 'a.bin').status).toBe('undetermined');
  });

  it('テキストはバイナリ形式の拡張子のときだけ不一致', () => {
    expect(checkExtension(text, 'notes.md').status).toBe('match');
    expect(checkExtension(text, 'data.csv').status).toBe('match');
    expect(checkExtension(html, 'photo.png').status).toBe('mismatch');
    expect(checkExtension(html, 'report.pdf').status).toBe('mismatch');
  });

  it('テキストで使われがちな拡張子（.ts など）は警告しない', () => {
    for (const name of [
      'main.ts',
      'a.out',
      'id.pub',
      'x.msg',
      'y.lib',
      'z.bin',
    ]) {
      expect(checkExtension(text, name).status).toBe('match');
    }
  });

  it('署名済みAPK相当（META-INFが先頭・ストリーム書き込み）でも APK と判定する', () => {
    const entry = zipEntry('META-INF/MANIFEST.MF');
    entry[6] = 0x08; // bit3: サイズ未記載
    const data = concat(entry, ascii('xxAndroidManifest.xml'));
    expect(detectFileType(data)?.name).toBe('APK');
  });

  it('docm・dotm・xltm・apk(jar) は拡張子一致', () => {
    expect(
      checkExtension(detectFileType(zipEntry('word/document.xml')), 'a.dotm')
        .status,
    ).toBe('match');
    expect(
      checkExtension(detectFileType(zipEntry('META-INF/MANIFEST.MF')), 'a.apk')
        .status,
    ).toBe('match');
  });

  it('ZIP は Office 系の拡張子でも一致扱い', () => {
    const zip = detectFileType(zipEntry('readme.txt'));
    expect(checkExtension(zip, 'a.docx').status).toBe('match');
  });

  it('大文字の拡張子や別名の拡張子（.jpeg）も一致扱い', () => {
    const jpeg = detectFileType(bytes(0xff, 0xd8, 0xff, 0xe0));
    expect(checkExtension(jpeg, 'a.JPEG').status).toBe('match');
    expect(checkExtension(jpeg, 'a.jfif').status).toBe('match');
  });

  it('テキストが実行ファイル等の拡張子を名乗ると不一致', () => {
    expect(checkExtension(text, 'setup.exe').status).toBe('mismatch');
    expect(checkExtension(text, 'song.mp3').status).toBe('mismatch');
  });

  it('Office 形式どうしでも拡張子が違えば不一致', () => {
    const docx = detectFileType(zipEntry('word/document.xml'));
    expect(checkExtension(docx, 'a.xlsx').status).toBe('mismatch');
  });

  it('判定できない場合は拡張子が無くても undetermined を優先', () => {
    expect(checkExtension(null, 'README').status).toBe('undetermined');
  });
});

describe('getExtension', () => {
  it('最後のドット以降を小文字で返す', () => {
    expect(getExtension('a.tar.GZ')).toBe('gz');
    expect(getExtension('noext')).toBe('');
    expect(getExtension('trailing.')).toBe('');
  });
});

describe('formatHexDump', () => {
  it('オフセット・16進・ASCII を整形する', () => {
    const lines = formatHexDump(ascii('ABCDEFGHIJKLMNOPQ')).split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe(
      '00000000  41 42 43 44 45 46 47 48  49 4A 4B 4C 4D 4E 4F 50  |ABCDEFGHIJKLMNOP|',
    );
    expect(lines[1].startsWith('00000010  51 ')).toBe(true);
    expect(lines[1].endsWith('|Q|')).toBe(true);
  });

  it('制御文字は . で表示し、最大バイト数で打ち切る', () => {
    expect(formatHexDump(bytes(0, 1, 0x41))).toContain('|..A|');
    expect(formatHexDump(new Uint8Array(1000)).split('\n')).toHaveLength(16);
  });
});

describe('formatHeadBytes / formatFileSize', () => {
  it('先頭バイトを16進で返す', () => {
    expect(formatHeadBytes(bytes(0x89, 0x50, 0x4e), 2)).toBe('89 50');
  });

  it('サイズを読みやすい単位にする', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
  });

  it('単位の境界（1023 B / 1 KB / 100 KB / 1 GB）を正しく切り替える', () => {
    expect(formatFileSize(1023)).toBe('1023 B');
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(100 * 1024)).toBe('100 KB');
    expect(formatFileSize(1024 ** 3)).toBe('1.0 GB');
  });

  it('16進ダンプは最大バイト数ちょうど（256バイト）を16行で出す', () => {
    const lines = formatHexDump(new Uint8Array(256)).split('\n');
    expect(lines).toHaveLength(16);
    expect(lines[15].startsWith('000000F0  00 ')).toBe(true);
  });

  it('先頭バイトの表示は既定で16バイト', () => {
    expect(formatHeadBytes(new Uint8Array(32))).toHaveLength(16 * 3 - 1);
    expect(formatHeadBytes(new Uint8Array(0))).toBe('');
  });
});

describe('formatFileSize の繰り上がり', () => {
  it('1MB直前は 1.0 MB と表示する', () => {
    expect(formatFileSize(1024 * 1024 - 1)).toBe('1.0 MB');
  });
});
