import { describe, expect, it } from 'vitest';
import {
  checkFileSize,
  columnCount,
  decodeCsvBytes,
  dedupeRows,
  detectDelimiter,
  encodeCsvText,
  mergeCsvData,
  parseCsvData,
  serializeCsv,
  splitFileName,
  splitRows,
  stripExtension,
  MAX_FILE_BYTES,
  MAX_PARTS,
  WARN_FILE_BYTES,
  type CsvData,
} from './csv-split-merge';

function parse(text: string, hasHeader = true, delimiter = ','): CsvData {
  const result = parseCsvData(text, delimiter, hasHeader);
  if (!result.success) throw new Error(result.reason);
  return result.data;
}

describe('parseCsvData', () => {
  it('見出しと行に分ける', () => {
    expect(parse('a,b\n1,2\n3,4')).toEqual({
      header: ['a', 'b'],
      rows: [
        ['1', '2'],
        ['3', '4'],
      ],
    });
  });

  it('ヘッダーなしなら全行がデータ', () => {
    expect(parse('a,b\n1,2', false)).toEqual({
      header: null,
      rows: [
        ['a', 'b'],
        ['1', '2'],
      ],
    });
  });

  it('BOM・CRLF・空行・引用符内の改行を扱う', () => {
    const data = parse('\uFEFFa,b\r\n\r\n"x\ny",2\r\n');
    expect(data.header).toEqual(['a', 'b']);
    expect(data.rows).toEqual([['x\ny', '2']]);
  });

  it('タブ区切り', () => {
    expect(parse('a\tb\n1\t2', true, '\t').rows).toEqual([['1', '2']]);
  });

  it('空・閉じていない引用符は失敗', () => {
    expect(parseCsvData('\n\n', ',', true)).toEqual({
      success: false,
      reason: 'empty',
    });
    expect(parseCsvData('a,"b', ',', true)).toEqual({
      success: false,
      reason: 'unterminated-quote',
    });
  });
});

describe('detectDelimiter / columnCount', () => {
  it('区切り文字を判定する', () => {
    expect(detectDelimiter('a\tb\tc\n1,2,3')).toBe('\t');
    expect(detectDelimiter('"a,b,c"\td\n')).toBe('\t');
    expect(detectDelimiter('abc')).toBe(',');
  });

  it('最大列数を返す', () => {
    expect(columnCount({ header: ['a'], rows: [['1', '2', '3'], ['4']] })).toBe(
      3,
    );
    expect(columnCount({ header: null, rows: [] })).toBe(0);
  });
});

describe('serializeCsv', () => {
  it('必要なセルだけ引用符で囲む', () => {
    expect(
      serializeCsv(
        ['a', 'b'],
        [
          ['x,y', 'say "hi"'],
          ['l1\nl2', ''],
        ],
        ',',
      ),
    ).toBe('a,b\n"x,y","say ""hi"""\n"l1\nl2",\n');
  });

  it('区切り文字に合わせて引用符を付ける', () => {
    expect(serializeCsv(null, [['a,b', 'c\td']], '\t')).toBe('a,b\t"c\td"\n');
  });

  it('1列の空値は "" にして行が消えないようにする', () => {
    expect(serializeCsv(['a'], [[''], ['x']], ',')).toBe('a\n""\nx\n');
  });

  it('行が無ければ空文字、見出しだけなら見出し行のみ', () => {
    expect(serializeCsv(null, [], ',')).toBe('');
    expect(serializeCsv(['a', 'b'], [], ',')).toBe('a,b\n');
  });

  it('往復しても同じになる', () => {
    const text = 'a,b\n"x\ny","q""r"\n1,2\n';
    const data = parse(text);
    expect(serializeCsv(data.header, data.rows, ',')).toBe(text);
  });
});

describe('splitRows', () => {
  const rows = Array.from({ length: 10 }, (_, i) => [String(i)]);

  it('行数指定で分割する（最後は端数）', () => {
    const result = splitRows(rows, { mode: 'rows', value: 4 });
    expect(result.success && result.chunks.map((c) => c.length)).toEqual([
      4, 4, 2,
    ]);
  });

  it('行数が多い指定なら1ファイル', () => {
    const result = splitRows(rows, { mode: 'rows', value: 100 });
    expect(result.success && result.chunks.length).toBe(1);
  });

  it('個数指定ではできるだけ均等に分ける', () => {
    const result = splitRows(rows, { mode: 'parts', value: 3 });
    expect(result.success && result.chunks.map((c) => c.length)).toEqual([
      4, 3, 3,
    ]);
    // 順序と内容が保たれる
    expect(result.success && result.chunks.flat()).toEqual(rows);
  });

  it('行数より多い個数を指定しても空ファイルを作らない', () => {
    const result = splitRows(rows, { mode: 'parts', value: 50 });
    expect(result.success && result.chunks.length).toBe(10);
  });

  it('不正な値・行なし・多すぎる個数は失敗', () => {
    expect(splitRows(rows, { mode: 'rows', value: 0 })).toEqual({
      success: false,
      reason: 'invalid-value',
    });
    expect(splitRows(rows, { mode: 'parts', value: 1.5 })).toEqual({
      success: false,
      reason: 'invalid-value',
    });
    expect(splitRows([], { mode: 'rows', value: 5 })).toEqual({
      success: false,
      reason: 'no-rows',
    });
    expect(splitRows(rows, { mode: 'parts', value: MAX_PARTS + 1 })).toEqual({
      success: false,
      reason: 'too-many-parts',
    });
    const many = Array.from({ length: MAX_PARTS + 1 }, () => ['x']);
    expect(splitRows(many, { mode: 'rows', value: 1 })).toEqual({
      success: false,
      reason: 'too-many-parts',
    });
  });
});

describe('ファイル名', () => {
  it('拡張子を除く', () => {
    expect(stripExtension('sales.2024.csv')).toBe('sales.2024');
    expect(stripExtension('C:\\tmp\\a.csv')).toBe('a');
    expect(stripExtension('.csv')).toBe('.csv');
    expect(stripExtension('', 'data')).toBe('data');
  });

  it('連番をゼロ埋めする', () => {
    expect(splitFileName('data', 0, 3)).toBe('data_01.csv');
    expect(splitFileName('data', 99, 100)).toBe('data_100.csv');
    expect(splitFileName('data', 4, 12, 'tsv')).toBe('data_05.tsv');
  });
});

describe('mergeCsvData', () => {
  const a = { name: 'a.csv', data: parse('id,name\n1,A') };
  const b = { name: 'b.csv', data: parse('id,name\n2,B\n3,C') };

  it('見出しが一致すれば行を連結し、見出しは1回だけ', () => {
    const result = mergeCsvData([a, b], true);
    expect(result).toEqual({
      success: true,
      data: {
        header: ['id', 'name'],
        rows: [
          ['1', 'A'],
          ['2', 'B'],
          ['3', 'C'],
        ],
      },
      rowCount: 3,
    });
  });

  it('見出しが違うファイルを検出する', () => {
    const c = { name: 'c.csv', data: parse('id,title\n9,Z') };
    expect(mergeCsvData([a, b, c], true)).toEqual({
      success: false,
      reason: 'header-mismatch',
      fileIndex: 2,
    });
    // 順序違い・列数違いも不一致
    const d = { name: 'd.csv', data: parse('name,id\nZ,9') };
    expect(mergeCsvData([a, d], true)).toMatchObject({ success: false });
    const e = { name: 'e.csv', data: parse('id\n9') };
    expect(mergeCsvData([a, e], true)).toMatchObject({ success: false });
  });

  it('検証しない場合は2ファイル目以降の見出し行もデータとして残す', () => {
    const c = { name: 'c.csv', data: parse('id,title\n9,Z') };
    const result = mergeCsvData([a, c], false);
    expect(result.success && result.data.rows).toEqual([
      ['1', 'A'],
      ['id', 'title'],
      ['9', 'Z'],
    ]);
  });

  it('見出しなしなら単純に連結', () => {
    const x = { name: 'x', data: parse('1,2', false) };
    const y = { name: 'y', data: parse('3,4', false) };
    const result = mergeCsvData([x, y], true);
    expect(result.success && result.data).toEqual({
      header: null,
      rows: [
        ['1', '2'],
        ['3', '4'],
      ],
    });
  });

  it('1ファイルでは結合できない', () => {
    expect(mergeCsvData([a], true)).toEqual({
      success: false,
      reason: 'too-few-files',
    });
  });
});

describe('dedupeRows', () => {
  const rows = [
    ['1', 'Taro', 'x'],
    ['2', 'taro ', 'y'],
    ['1', 'Taro', 'x'],
    ['3', 'Hanako', 'x'],
    ['1', 'Taro', 'z'],
  ];
  const base = {
    keyColumns: [] as number[],
    keep: 'first' as const,
    ignoreCase: false,
    trim: false,
  };

  it('行全体が同じ行を取り除く（最初を残す）', () => {
    const result = dedupeRows(rows, base);
    expect(result.removed).toBe(1);
    expect(result.rows.map((r) => r.join('|'))).toEqual([
      '1|Taro|x',
      '2|taro |y',
      '3|Hanako|x',
      '1|Taro|z',
    ]);
  });

  it('キー列で判定し、最初を残す', () => {
    const result = dedupeRows(rows, { ...base, keyColumns: [0] });
    expect(result.rows.map((r) => r[2])).toEqual(['x', 'y', 'x']);
    expect(result.removed).toBe(2);
  });

  it('最後を残す場合は元の順序を保つ', () => {
    const result = dedupeRows(rows, {
      ...base,
      keyColumns: [0],
      keep: 'last',
    });
    expect(result.rows.map((r) => r.join('|'))).toEqual([
      '2|taro |y',
      '3|Hanako|x',
      '1|Taro|z',
    ]);
  });

  it('大文字小文字・前後の空白を無視できる', () => {
    const result = dedupeRows(rows, {
      ...base,
      keyColumns: [1],
      ignoreCase: true,
      trim: true,
    });
    expect(result.rows.map((r) => r[1])).toEqual(['Taro', 'Hanako']);
  });

  it('複数キー列は組み合わせで判定し、区切りを含む値でも衝突しない', () => {
    const data = [
      ['a,b', 'c'],
      ['a', 'b,c'],
    ];
    expect(dedupeRows(data, { ...base, keyColumns: [0, 1] }).removed).toBe(0);
  });

  it('列数が足りない行は空欄として扱う', () => {
    const data = [['1', ''], ['1']];
    expect(dedupeRows(data, base).removed).toBe(1);
  });

  it('空配列', () => {
    expect(dedupeRows([], base)).toEqual({ rows: [], removed: 0 });
  });
});

describe('文字コード・サイズ', () => {
  it('UTF-8のBOMを取り除いて読む', () => {
    const bytes = new Uint8Array([0xef, 0xbb, 0xbf, 0x61, 0x2c, 0x62]);
    expect(decodeCsvBytes(bytes)).toBe('a,b');
  });

  it('Shift_JISを読める', () => {
    // 「あ」= 0x82 0xA0
    expect(decodeCsvBytes(new Uint8Array([0x82, 0xa0]), 'shift_jis')).toBe(
      'あ',
    );
  });

  it('BOM付きUTF-8に書き出せる', () => {
    expect(Array.from(encodeCsvText('a', true))).toEqual([
      0xef, 0xbb, 0xbf, 0x61,
    ]);
    expect(Array.from(encodeCsvText('a', false))).toEqual([0x61]);
  });

  it('ファイルサイズの判定', () => {
    expect(checkFileSize(1)).toBe('ok');
    expect(checkFileSize(WARN_FILE_BYTES + 1)).toBe('warn');
    expect(checkFileSize(MAX_FILE_BYTES + 1)).toBe('too-large');
  });
});
