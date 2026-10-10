import { describe, expect, it } from 'vitest';
import { strToU8, unzipSync, zipSync } from 'fflate';
import {
  columnLetters,
  csvFileName,
  csvToXlsx,
  decodeCsvBytes,
  detectDelimiter,
  ExcelConvertError,
  formatSerialDate,
  MAX_FILE_BYTES,
  openXlsx,
  rowsToCsv,
  sanitizeSheetName,
  xlsxFileName,
} from './csv-excel-converter';

const MAIN_NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const REL_NS =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

/** テスト用に、Excelが書き出す形（共有文字列・書式付き）のxlsxを手で組み立てる */
function buildXlsx(parts: {
  sheetXml: string;
  sharedStrings?: string;
  styles?: string;
  workbookPr?: string;
  sheetName?: string;
}): Uint8Array {
  const files: Record<string, Uint8Array> = {
    'xl/workbook.xml': strToU8(
      `<workbook xmlns="${MAIN_NS}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">${parts.workbookPr ?? ''}<sheets><sheet name="${parts.sheetName ?? 'Data'}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
    ),
    'xl/_rels/workbook.xml.rels': strToU8(
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="x" Target="worksheets/sheet1.xml"/></Relationships>',
    ),
    'xl/worksheets/sheet1.xml': strToU8(
      `<worksheet xmlns="${MAIN_NS}"><sheetData>${parts.sheetXml}</sheetData></worksheet>`,
    ),
  };
  if (parts.sharedStrings) {
    files['xl/sharedStrings.xml'] = strToU8(
      `<sst xmlns="${MAIN_NS}">${parts.sharedStrings}</sst>`,
    );
  }
  if (parts.styles) {
    files['xl/styles.xml'] = strToU8(
      `<styleSheet xmlns="${MAIN_NS}">${parts.styles}</styleSheet>`,
    );
  }
  return zipSync(files);
}

function readFirst(bytes: Uint8Array): string[][] {
  return openXlsx(bytes).readSheet(0);
}

describe('columnLetters', () => {
  it('列番号をアルファベットにする', () => {
    expect(columnLetters(0)).toBe('A');
    expect(columnLetters(25)).toBe('Z');
    expect(columnLetters(26)).toBe('AA');
    expect(columnLetters(701)).toBe('ZZ');
    expect(columnLetters(702)).toBe('AAA');
    expect(columnLetters(16383)).toBe('XFD');
  });
});

describe('sanitizeSheetName', () => {
  it('使えない文字を除き31文字に切り詰める', () => {
    expect(sanitizeSheetName('a/b:c*d?[e]')).toBe('abcde');
    expect(sanitizeSheetName('x'.repeat(40))).toHaveLength(31);
  });
  it('空になる場合は Sheet1', () => {
    expect(sanitizeSheetName('')).toBe('Sheet1');
    expect(sanitizeSheetName('///')).toBe('Sheet1');
  });
});

describe('decodeCsvBytes', () => {
  it('UTF-8（BOMあり・なし）を読む', () => {
    const bom = new Uint8Array([0xef, 0xbb, 0xbf, ...strToU8('名前,年齢')]);
    expect(decodeCsvBytes(bom)).toBe('名前,年齢');
    expect(decodeCsvBytes(strToU8('名前,年齢'))).toBe('名前,年齢');
  });
  it('UTF-8として不正なバイト列は Shift_JIS として読む', () => {
    // 「名前」= 0x96BC 0x914F
    const sjis = new Uint8Array([0x96, 0xbc, 0x91, 0x4f]);
    expect(decodeCsvBytes(sjis)).toBe('名前');
    expect(decodeCsvBytes(sjis, 'shift_jis')).toBe('名前');
  });
  it('UTF-16LEのBOMを判定する', () => {
    const bytes = new Uint8Array([0xff, 0xfe, 0x41, 0x00, 0x42, 0x00]);
    expect(decodeCsvBytes(bytes)).toBe('AB');
  });
});

describe('detectDelimiter', () => {
  it('カンマ・タブ・セミコロンを推定する', () => {
    expect(detectDelimiter('a,b,c\n1,2,3')).toBe(',');
    expect(detectDelimiter('a\tb\tc\n1\t2\t3')).toBe('\t');
    expect(detectDelimiter('a;b;c\n1;2;3')).toBe(';');
  });
  it('引用符の中の区切り文字は数えない', () => {
    expect(detectDelimiter('"a,b,c,d"\t"x"\n"1,2,3"\t"y"')).toBe('\t');
  });
  it('判断できなければカンマ', () => {
    expect(detectDelimiter('abc')).toBe(',');
  });
});

describe('csvToXlsx → openXlsx（往復）', () => {
  it('値・日本語・引用符・改行を保ったまま往復できる', () => {
    const csv = 'name,note\n"山田, 太郎","line1\nline2"\n"say ""hi""",\n';
    const { bytes, rows, columns } = csvToXlsx(csv);
    expect(rows).toBe(3);
    expect(columns).toBe(2);
    expect(readFirst(bytes)).toEqual([
      ['name', 'note'],
      ['山田, 太郎', 'line1\nline2'],
      ['say "hi"', ''],
    ]);
  });

  it('シート名を指定できる', () => {
    const { bytes } = csvToXlsx('a\n1', { sheetName: '売上' });
    expect(openXlsx(bytes).sheetNames).toEqual(['売上']);
  });

  it('数値に見える値は数値セル、先頭0や長い数字は文字列のまま', () => {
    const { bytes } = csvToXlsx('n,zip,id\n1.5,00123,12345678901234567890\n');
    const sheet = openXlsx(bytes);
    expect(sheet.readSheet(0)[1]).toEqual([
      '1.5',
      '00123',
      '12345678901234567890',
    ]);
    // 数値セルは t 属性を持たない
    const xml = new TextDecoder().decode(
      unzipSync(bytes)['xl/worksheets/sheet1.xml'],
    );
    expect(xml).toContain('<c r="A2"><v>1.5</v></c>');
    expect(xml).toContain('<c r="B2" t="inlineStr">');
    expect(xml).toContain('<c r="C2" t="inlineStr">');
  });

  it('指数表記の値（製品コードなど）は文字列のまま', () => {
    const { bytes } = csvToXlsx('1e5\n');
    const xml = new TextDecoder().decode(
      unzipSync(bytes)['xl/worksheets/sheet1.xml'],
    );
    expect(xml).toContain('t="inlineStr"');
    expect(readFirst(bytes)).toEqual([['1e5']]);
  });

  it('detectNumbers: false なら全て文字列セル', () => {
    const { bytes } = csvToXlsx('1\n2', { detectNumbers: false });
    const xml = new TextDecoder().decode(
      unzipSync(bytes)['xl/worksheets/sheet1.xml'],
    );
    expect(xml).not.toContain('<v>');
  });

  it('XML特殊文字と使えない制御文字を安全に扱う', () => {
    const { bytes } = csvToXlsx('a\n"<b>&amp;\u0001x"\n');
    expect(readFirst(bytes)).toEqual([['a'], ['<b>&amp;x']]);
  });

  it('先頭が = のセルは数式にならず文字列として入る', () => {
    const { bytes } = csvToXlsx('a\n=1+1\n');
    const xml = new TextDecoder().decode(
      unzipSync(bytes)['xl/worksheets/sheet1.xml'],
    );
    expect(xml).not.toContain('<f>');
    expect(readFirst(bytes)).toEqual([['a'], ['=1+1']]);
  });

  it('タブ区切り・BOM付きUTF-8を読める', () => {
    const { bytes } = csvToXlsx('﻿a\tb\n1\t2', { delimiter: '\t' });
    expect(readFirst(bytes)).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('空のCSVでも読めるxlsxになる', () => {
    const { bytes, rows } = csvToXlsx('');
    expect(rows).toBe(0);
    expect(readFirst(bytes)).toEqual([]);
  });

  it('引用符が閉じていなければエラー', () => {
    expect(() => csvToXlsx('a\n"b')).toThrow(ExcelConvertError);
    try {
      csvToXlsx('a\n"b');
    } catch (e) {
      expect((e as ExcelConvertError).code).toBe('unterminated-quote');
    }
  });

  it('1セルが32767文字を超えるとエラー', () => {
    try {
      csvToXlsx('x'.repeat(32768));
      expect.unreachable();
    } catch (e) {
      expect((e as ExcelConvertError).code).toBe('cell-too-long');
    }
  });
});

describe('openXlsx（Excelが書き出す形式）', () => {
  it('共有文字列・リッチテキスト・真偽値・数式の結果を読む', () => {
    const bytes = buildXlsx({
      sharedStrings:
        '<si><t>名前</t></si><si><r><t>Hel</t></r><r><t>lo</t></r></si><si><t xml:space="preserve"> pad </t></si>',
      sheetXml:
        '<row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c><c r="C1" t="s"><v>2</v></c></row>' +
        '<row r="2"><c r="A2" t="b"><v>1</v></c><c r="B2" t="b"><v>0</v></c><c r="C2" t="str"><f>A1&amp;"x"</f><v>名前x</v></c></row>',
    });
    expect(readFirst(bytes)).toEqual([
      ['名前', 'Hello', ' pad '],
      ['TRUE', 'FALSE', '名前x'],
    ]);
  });

  it('飛び越した行・列は空文字で埋め、列数を揃える', () => {
    const bytes = buildXlsx({
      sheetXml:
        '<row r="2"><c r="B2" t="inlineStr"><is><t>x</t></is></c></row>' +
        '<row r="4"><c r="D4"><v>7</v></c></row>',
    });
    expect(readFirst(bytes)).toEqual([
      ['', '', '', ''],
      ['', 'x', '', ''],
      ['', '', '', ''],
      ['', '', '', '7'],
    ]);
  });

  it('数値は15桁に丸めて表示する', () => {
    const bytes = buildXlsx({
      sheetXml:
        '<row r="1"><c r="A1"><v>0.30000000000000004</v></c><c r="B1"><v>1E-3</v></c><c r="C1"><v>100</v></c></row>',
    });
    expect(readFirst(bytes)).toEqual([['0.3', '0.001', '100']]);
  });

  it('日付書式のセルは日付文字列にする（組み込み・カスタム）', () => {
    const bytes = buildXlsx({
      styles:
        '<numFmts count="2"><numFmt numFmtId="164" formatCode="yyyy&quot;年&quot;m&quot;月&quot;d&quot;日&quot;"/><numFmt numFmtId="165" formatCode="0.00&quot;m&quot;"/></numFmts>' +
        '<cellXfs count="4"><xf numFmtId="0"/><xf numFmtId="14"/><xf numFmtId="164"/><xf numFmtId="165"/></cellXfs>',
      sheetXml:
        '<row r="1">' +
        '<c r="A1" s="1"><v>45000</v></c>' +
        '<c r="B1" s="2"><v>45000.5</v></c>' +
        '<c r="C1" s="3"><v>45000</v></c>' +
        '<c r="D1" s="0"><v>45000</v></c>' +
        '</row>',
    });
    expect(readFirst(bytes)).toEqual([
      ['2023-03-15', '2023-03-15 12:00:00', '45000', '45000'],
    ]);
  });

  it('1904年方式のブックを判定する', () => {
    const bytes = buildXlsx({
      workbookPr: '<workbookPr date1904="1"/>',
      styles:
        '<cellXfs count="2"><xf numFmtId="0"/><xf numFmtId="14"/></cellXfs>',
      sheetXml: '<row r="1"><c r="A1" s="1"><v>0</v></c></row>',
    });
    // v が 0 のときは日付化されうるが、1904方式の起点は 1904-01-01
    expect(readFirst(bytes)).toEqual([['1904-01-01']]);
  });

  it('エラー値や _xHHHH_ エスケープを扱う', () => {
    const bytes = buildXlsx({
      sheetXml:
        '<row r="1"><c r="A1" t="e"><v>#DIV/0!</v></c><c r="B1" t="inlineStr"><is><t>a_x000A_b</t></is></c></row>',
    });
    expect(readFirst(bytes)).toEqual([['#DIV/0!', 'a\nb']]);
  });

  it('数値文字参照（&#10; &#x41; &#x1F600;）を復号し、&amp;#10; は文字のまま残す', () => {
    const bytes = buildXlsx({
      sheetXml:
        '<row r="1"><c r="A1" t="inlineStr"><is><t>x&#10;y&#x41;&#x1F600;</t></is></c><c r="B1" t="inlineStr"><is><t>&amp;#10;</t></is></c></row>',
    });
    expect(readFirst(bytes)).toEqual([['x\nyA😀', '&#10;']]);
  });

  it('経過時間書式は24時間を超えても時間として出力する', () => {
    const bytes = buildXlsx({
      styles:
        '<numFmts count="1"><numFmt numFmtId="170" formatCode="[h]:mm:ss"/></numFmts><cellXfs count="2"><xf numFmtId="0"/><xf numFmtId="170"/></cellXfs>',
      sheetXml: '<row r="1"><c r="A1" s="1"><v>1.25</v></c></row>',
    });
    expect(readFirst(bytes)).toEqual([['30:00:00']]);
  });

  it('グラフシートはシート一覧に含めない', () => {
    const files = unzipSync(buildXlsx({ sheetXml: '' }));
    const wb = new TextDecoder().decode(files['xl/workbook.xml']);
    const rels = new TextDecoder().decode(files['xl/_rels/workbook.xml.rels']);
    const bytes = zipSync({
      ...files,
      'xl/workbook.xml': strToU8(
        wb.replace(
          '</sheets>',
          '<sheet name="Chart1" sheetId="2" r:id="rId2"/></sheets>',
        ),
      ),
      'xl/_rels/workbook.xml.rels': strToU8(
        rels.replace(
          '</Relationships>',
          '<Relationship Id="rId2" Type="x" Target="chartsheets/sheet1.xml"/></Relationships>',
        ),
      ),
    });
    expect(openXlsx(bytes).sheetNames).toEqual(['Data']);
  });

  it('シート名を取り出す', () => {
    const bytes = buildXlsx({ sheetXml: '', sheetName: '集計 & 一覧' });
    expect(openXlsx(bytes).sheetNames).toEqual(['集計 & 一覧']);
  });
});

describe('openXlsx（不正な入力）', () => {
  it('古い形式（.xls）やパスワード付きは専用のエラー', () => {
    const ole = new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0, 0, 0, 0]);
    try {
      openXlsx(ole);
      expect.unreachable();
    } catch (e) {
      expect((e as ExcelConvertError).code).toBe('legacy-or-encrypted');
    }
  });

  it('xlsxではないファイルは not-xlsx', () => {
    try {
      openXlsx(strToU8('a,b\n1,2'));
      expect.unreachable();
    } catch (e) {
      expect((e as ExcelConvertError).code).toBe('not-xlsx');
    }
  });

  it('zipだがワークブックが無いものは invalid-xlsx', () => {
    try {
      openXlsx(zipSync({ 'hello.txt': strToU8('hi') }));
      expect.unreachable();
    } catch (e) {
      expect((e as ExcelConvertError).code).toBe('invalid-xlsx');
    }
  });
});

describe('formatSerialDate', () => {
  it('日付・日時・時刻', () => {
    expect(formatSerialDate(45000)).toBe('2023-03-15');
    expect(formatSerialDate(45000.75)).toBe('2023-03-15 18:00:00');
    expect(formatSerialDate(0.5)).toBe('12:00:00');
    expect(formatSerialDate(61)).toBe('1900-03-01');
    expect(formatSerialDate(1)).toBe('1900-01-01');
  });
  it('範囲外は null', () => {
    expect(formatSerialDate(-1)).toBeNull();
    expect(formatSerialDate(Number.NaN)).toBeNull();
    expect(formatSerialDate(3_000_000)).toBeNull();
  });
});

describe('rowsToCsv', () => {
  const rows = [
    ['a', 'b,c', 'd"e'],
    ['1', 'x\ny', ''],
  ];
  it('区切り文字・引用符・改行をエスケープする', () => {
    expect(rowsToCsv(rows)).toBe('a,"b,c","d""e"\n1,"x\ny",\n');
  });
  it('タブ区切り・CRLF・BOM', () => {
    expect(rowsToCsv([['a', 'b,c']], { delimiter: '\t', crlf: true })).toBe(
      'a\tb,c\r\n',
    );
    expect(rowsToCsv([['a']], { bom: true })).toBe('﻿a\n');
  });
  it('1列だけの空値は "" にして行が消えないようにする', () => {
    expect(rowsToCsv([['a'], [''], ['b']])).toBe('a\n""\nb\n');
  });
  it('空なら空文字', () => {
    expect(rowsToCsv([])).toBe('');
  });
});

describe('ファイル名', () => {
  it('xlsxFileName', () => {
    expect(xlsxFileName('data.csv')).toBe('data.xlsx');
    expect(xlsxFileName('a.b.tsv')).toBe('a.b.xlsx');
    expect(xlsxFileName('')).toBe('output.xlsx');
  });
  it('csvFileName', () => {
    expect(csvFileName('book.xlsx', null)).toBe('book.csv');
    expect(csvFileName('book.xlsx', 'Sheet 2')).toBe('book_Sheet 2.csv');
    expect(csvFileName('book.xlsx', 'a/b')).toBe('book_a_b.csv');
    expect(csvFileName('book.xlsx', null, '\t')).toBe('book.tsv');
  });
});

describe('エッジケース（QA追加）', () => {
  it('CRLFの改行を行区切りとして扱う', () => {
    expect(readFirst(csvToXlsx('a,b\r\n1,2\r\n').bytes)).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });
  // 既知の問題: 共有パーサ parseCsvRows は単独の CR を捨てるため、
  // 'a,b\r1,2\r' は ['a','b1','2'] になる（CR単独の改行は未対応）。

  it('CRLFの先頭行でも区切り文字を推定できる', () => {
    expect(detectDelimiter('a;b\r\n1;2\r\n')).toBe(';');
  });

  it('絵文字・サロゲートペア（拡張漢字）を壊さず往復する', () => {
    const csv = '😀,日本語\n𠮷野家,"🎉,x"\n';
    expect(readFirst(csvToXlsx(csv).bytes)).toEqual([
      ['😀', '日本語'],
      ['𠮷野家', '🎉,x'],
    ]);
    expect(rowsToCsv([['😀', '𠮷']])).toBe('😀,𠮷\n');
  });

  it('Shift_JISの「ソ」(0x83 0x5C) を後続のカンマと取り違えない', () => {
    const bytes = new Uint8Array([0x83, 0x5c, 0x2c, 0x61]);
    expect(decodeCsvBytes(bytes)).toBe('ソ,a');
    expect(decodeCsvBytes(bytes, 'shift_jis')).toBe('ソ,a');
  });

  it('空行は空の行として保持される', () => {
    expect(readFirst(csvToXlsx('a\n\nb').bytes)).toEqual([['a'], [''], ['b']]);
  });

  it('数値の前後の空白・+符号・末尾の小数点は文字列のまま', () => {
    const csv = ' 1,+2,1.,.5\n';
    expect(readFirst(csvToXlsx(csv).bytes)).toEqual([[' 1', '+2', '1.', '.5']]);
  });

  it('1セル32767文字はちょうど上限として通る', () => {
    const { rows } = csvToXlsx('x'.repeat(32767));
    expect(rows).toBe(1);
  });

  it('CRLF と BOM を同時に指定できる', () => {
    expect(rowsToCsv([['a']], { bom: true, crlf: true })).toBe('﻿a\r\n');
  });

  it('複数シートのxlsxは各シートを index で個別に読める', () => {
    const bytes = zipSync({
      'xl/workbook.xml': strToU8(
        `<workbook xmlns="${MAIN_NS}" xmlns:r="${REL_NS}"><sheets>` +
          '<sheet name="売上" sheetId="1" r:id="rId1"/>' +
          '<sheet name="在庫" sheetId="2" r:id="rId2"/>' +
          '</sheets></workbook>',
      ),
      'xl/_rels/workbook.xml.rels': strToU8(
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
          `<Relationship Id="rId1" Type="x" Target="worksheets/sheet1.xml"/>` +
          `<Relationship Id="rId2" Type="x" Target="worksheets/sheet2.xml"/>` +
          '</Relationships>',
      ),
      'xl/worksheets/sheet1.xml': strToU8(
        `<worksheet xmlns="${MAIN_NS}"><sheetData><row r="1"><c r="A1"><v>1</v></c></row></sheetData></worksheet>`,
      ),
      'xl/worksheets/sheet2.xml': strToU8(
        `<worksheet xmlns="${MAIN_NS}"><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>在庫</t></is></c></row></sheetData></worksheet>`,
      ),
    });
    const wb = openXlsx(bytes);
    expect(wb.sheetNames).toEqual(['売上', '在庫']);
    expect(wb.readSheet(0)).toEqual([['1']]);
    expect(wb.readSheet(1)).toEqual([['在庫']]);
  });

  it('シートが1つも無いxlsxは no-sheet', () => {
    const bytes = zipSync({
      'xl/workbook.xml': strToU8(
        `<workbook xmlns="${MAIN_NS}"><sheets></sheets></workbook>`,
      ),
    });
    try {
      openXlsx(bytes);
      expect.unreachable();
    } catch (e) {
      expect((e as ExcelConvertError).code).toBe('no-sheet');
    }
  });

  it('セルのないシートは空配列を返す', () => {
    expect(readFirst(buildXlsx({ sheetXml: '' }))).toEqual([]);
  });

  it('上限（50MB）を超えるファイルは too-large', () => {
    try {
      openXlsx(new Uint8Array(MAX_FILE_BYTES + 1));
      expect.unreachable();
    } catch (e) {
      expect((e as ExcelConvertError).code).toBe('too-large');
    }
  });
});
