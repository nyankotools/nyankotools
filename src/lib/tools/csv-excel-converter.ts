import { strToU8, unzipSync, zipSync } from 'fflate';
import { XMLParser } from 'fast-xml-parser';
import {
  escapeCsvField,
  parseCsvRows,
  UnterminatedQuoteError,
} from './csv-json-converter';

/** 読み込むファイル（CSV・xlsx）の上限。メモリに全て載せるため。 */
export const MAX_FILE_BYTES = 50 * 1024 * 1024;

/** xlsx（zip）の展開後に読む部分の合計上限（zip爆弾対策）。 */
const MAX_UNCOMPRESSED_BYTES = 200 * 1024 * 1024;

/** Excelの上限（行・列・1セルの文字数）。 */
export const MAX_ROWS = 1_048_576;
export const MAX_COLUMNS = 16_384;
export const MAX_CELL_CHARS = 32_767;

export type ExcelErrorCode =
  | 'unterminated-quote'
  | 'too-many-rows'
  | 'too-many-columns'
  | 'cell-too-long'
  | 'not-xlsx'
  | 'legacy-or-encrypted'
  | 'too-large'
  | 'invalid-xlsx'
  | 'no-sheet';

export class ExcelConvertError extends Error {
  constructor(public code: ExcelErrorCode) {
    super(code);
    this.name = 'ExcelConvertError';
  }
}

export type CsvDelimiter = ',' | '\t' | ';';
export type CsvEncoding = 'auto' | 'utf-8' | 'shift_jis';

/* ---------------------------------------------------------------- CSV入力 */

/** CSVのバイト列を文字列にする。auto は BOM → UTF-8 → Shift_JIS の順に判定する。 */
export function decodeCsvBytes(
  bytes: Uint8Array,
  encoding: CsvEncoding = 'auto',
): string {
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    return new TextDecoder('utf-16le').decode(bytes.subarray(2));
  }
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    return new TextDecoder('utf-16be').decode(bytes.subarray(2));
  }
  if (encoding === 'shift_jis')
    return new TextDecoder('shift_jis').decode(bytes);
  if (encoding === 'utf-8') {
    return new TextDecoder('utf-8').decode(bytes).replace(/^\uFEFF/, '');
  }
  try {
    return new TextDecoder('utf-8', { fatal: true })
      .decode(bytes)
      .replace(/^\uFEFF/, '');
  } catch {
    return new TextDecoder('shift_jis').decode(bytes);
  }
}

/** 先頭の数行から区切り文字（カンマ・タブ・セミコロン）を推定する。引用符内は数えない。 */
export function detectDelimiter(text: string): CsvDelimiter {
  const counts: Record<CsvDelimiter, number> = { ',': 0, '\t': 0, ';': 0 };
  let inQuotes = false;
  let lines = 0;
  for (let i = 0; i < text.length && lines < 5; i += 1) {
    const char = text[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (inQuotes) continue;
    else if (char === '\n') lines += 1;
    else if (char === ',' || char === '\t' || char === ';') counts[char] += 1;
  }
  let best: CsvDelimiter = ',';
  for (const d of ['\t', ';'] as const) {
    if (counts[d] > counts[best]) best = d;
  }
  return best;
}

/* ---------------------------------------------------------------- CSV → xlsx */

export interface CsvToXlsxOptions {
  delimiter?: CsvDelimiter;
  /** 数値に見える値を数値セルにする（先頭0の値・16桁以上の値は文字列のまま）。既定 true */
  detectNumbers?: boolean;
  sheetName?: string;
}

export interface CsvToXlsxResult {
  bytes: Uint8Array;
  rows: number;
  columns: number;
}

const NUMBER_PATTERN = /^-?(?:0|[1-9]\d*)(?:\.\d+)?$/;

function isPlainNumber(value: string): boolean {
  if (!NUMBER_PATTERN.test(value)) return false;
  // 有効桁が15桁を超えると丸められるため、文字列のままにする
  const digits = value.replace(/[eE].*$/, '').replace(/[^0-9]/g, '');
  return (
    digits.replace(/^0+/, '').length <= 15 && Number.isFinite(Number(value))
  );
}

/** Excelのシート名に使えない文字を除き、31文字までにする。空になる場合は Sheet1。 */
export function sanitizeSheetName(name: string): string {
  const cleaned = name
    .replace(/[[\]:*?/\\]/g, '')
    .replace(/^'+|'+$/g, '')
    .trim()
    .slice(0, 31);
  return cleaned === '' ? 'Sheet1' : cleaned;
}

/** 0始まりの列番号を A, B, ..., Z, AA ... にする */
export function columnLetters(index: number): string {
  let n = index + 1;
  let s = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

/** XML 1.0 で使えない制御文字を除いて、特殊文字をエスケープする */
function escapeXmlText(value: string): string {
  return (
    value
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  );
}

function escapeXmlAttr(value: string): string {
  return escapeXmlText(value).replace(/"/g, '&quot;');
}

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const MAIN_NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const REL_NS =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

/** CSVテキストをxlsx（1シート）にする。 */
export function csvToXlsx(
  csv: string,
  options: CsvToXlsxOptions = {},
): CsvToXlsxResult {
  const delimiter = options.delimiter ?? ',';
  const detectNumbers = options.detectNumbers ?? true;
  const sheetName = sanitizeSheetName(options.sheetName ?? 'Sheet1');

  let rows: string[][];
  try {
    rows = parseCsvRows(csv.replace(/^\uFEFF/, ''), delimiter).map(
      (r) => r.fields,
    );
  } catch (error) {
    if (error instanceof UnterminatedQuoteError) {
      throw new ExcelConvertError('unterminated-quote');
    }
    throw error;
  }
  if (rows.length > MAX_ROWS) throw new ExcelConvertError('too-many-rows');

  let columns = 0;
  const parts: string[] = [];
  rows.forEach((fields, rowIndex) => {
    if (fields.length > MAX_COLUMNS) {
      throw new ExcelConvertError('too-many-columns');
    }
    columns = Math.max(columns, fields.length);
    const cells: string[] = [];
    fields.forEach((value, colIndex) => {
      if (value === '') return;
      if (value.length > MAX_CELL_CHARS) {
        throw new ExcelConvertError('cell-too-long');
      }
      const ref = `${columnLetters(colIndex)}${rowIndex + 1}`;
      if (detectNumbers && isPlainNumber(value)) {
        cells.push(`<c r="${ref}"><v>${value}</v></c>`);
      } else {
        cells.push(
          `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${escapeXmlText(value)}</t></is></c>`,
        );
      }
    });
    if (cells.length > 0) {
      parts.push(`<row r="${rowIndex + 1}">${cells.join('')}</row>`);
    }
  });

  const sheetXml =
    `${XML_HEADER}<worksheet xmlns="${MAIN_NS}"><sheetData>` +
    parts.join('') +
    '</sheetData></worksheet>';

  const files = {
    '[Content_Types].xml': strToU8(
      `${XML_HEADER}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
        '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
        '</Types>',
    ),
    '_rels/.rels': strToU8(
      `${XML_HEADER}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
        `<Relationship Id="rId1" Type="${REL_NS}/officeDocument" Target="xl/workbook.xml"/>` +
        '</Relationships>',
    ),
    'xl/workbook.xml': strToU8(
      `${XML_HEADER}<workbook xmlns="${MAIN_NS}" xmlns:r="${REL_NS}">` +
        `<sheets><sheet name="${escapeXmlAttr(sheetName)}" sheetId="1" r:id="rId1"/></sheets>` +
        '</workbook>',
    ),
    'xl/_rels/workbook.xml.rels': strToU8(
      `${XML_HEADER}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
        `<Relationship Id="rId1" Type="${REL_NS}/worksheet" Target="worksheets/sheet1.xml"/>` +
        `<Relationship Id="rId2" Type="${REL_NS}/styles" Target="styles.xml"/>` +
        '</Relationships>',
    ),
    'xl/styles.xml': strToU8(
      `${XML_HEADER}<styleSheet xmlns="${MAIN_NS}">` +
        '<fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>' +
        '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>' +
        '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
        '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
        '<cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>' +
        '</styleSheet>',
    ),
    'xl/worksheets/sheet1.xml': strToU8(sheetXml),
  };

  return { bytes: zipSync(files, { level: 6 }), rows: rows.length, columns };
}

/** 保存するxlsxのファイル名。元のファイル名（拡張子は除く）があればそれを使う。 */
export function xlsxFileName(sourceName: string): string {
  const base = sourceName.replace(/\.[^./\\]+$/, '').trim();
  return `${base === '' ? 'output' : base}.xlsx`;
}

/* ---------------------------------------------------------------- xlsx → CSV */

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: false,
  isArray: (name, _jPath, _isLeaf, isAttribute) =>
    !isAttribute &&
    ['sheet', 'Relationship', 'si', 'r', 'row', 'c', 'xf', 'numFmt'].includes(
      name,
    ),
});

type XmlNode = Record<string, unknown>;

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined || value === null || value === '') return [];
  return Array.isArray(value) ? value : [value];
}

/** <t> 要素（文字列そのもの、または属性付きオブジェクト）のテキストを取り出す */
function textOf(node: unknown): string {
  if (node === undefined || node === null) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'object') {
    const text = (node as XmlNode)['#text'];
    return typeof text === 'string' ? text : '';
  }
  return String(node);
}

/** <si> / <is> のテキスト（リッチテキストは <r><t> を連結。ふりがな <rPh> は含めない） */
function richText(node: unknown): string {
  if (node === undefined || node === null || typeof node === 'string') {
    return textOf(node);
  }
  const obj = node as XmlNode;
  let out = textOf(obj.t);
  for (const run of asArray(obj.r as XmlNode | XmlNode[] | undefined)) {
    out += textOf(run.t);
  }
  return out;
}

/** Excelが制御文字などを表す `_x000D_` 形式のエスケープを元の文字に戻す */
function unescapeOoxml(value: string): string {
  return value.replace(/_x([0-9A-Fa-f]{4})_/g, (_, hex: string) =>
    String.fromCharCode(parseInt(hex, 16)),
  );
}

const PREDEFINED_ENTITIES: Record<number, string> = {
  34: '&quot;',
  38: '&amp;',
  39: '&apos;',
  60: '&lt;',
  62: '&gt;',
};

/** パーサーが復号しない数値文字参照（&#10; &#x1F600; など）を、解析前に文字へ直す */
function decodeNumericReferences(xml: string): string {
  return xml.replace(
    /&#(?:x([0-9A-Fa-f]{1,6})|(\d{1,7}));/g,
    (match, hex: string | undefined, dec: string | undefined) => {
      const code = hex ? parseInt(hex, 16) : Number(dec);
      if (PREDEFINED_ENTITIES[code]) return PREDEFINED_ENTITIES[code];
      const valid =
        code === 9 ||
        code === 10 ||
        code === 13 ||
        (code >= 0x20 &&
          code <= 0x10ffff &&
          !(code >= 0xd800 && code <= 0xdfff));
      return valid ? String.fromCodePoint(code) : match;
    },
  );
}

function parseXml(bytes: Uint8Array | undefined): XmlNode {
  if (!bytes) return {};
  try {
    return parser.parse(
      decodeNumericReferences(new TextDecoder('utf-8').decode(bytes)),
    ) as XmlNode;
  } catch {
    throw new ExcelConvertError('invalid-xlsx');
  }
}

function normalizePartPath(target: string): string {
  if (target.startsWith('/')) return target.slice(1);
  const parts = `xl/${target}`.split('/');
  const out: string[] = [];
  for (const p of parts) {
    if (p === '..') out.pop();
    else if (p !== '.' && p !== '') out.push(p);
  }
  return out.join('/');
}

const BUILTIN_DATE_FORMATS = new Set([
  14, 15, 16, 17, 18, 19, 20, 21, 22, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
  45, 46, 47, 50, 51, 52, 53, 54, 55, 56, 57, 58,
]);

type StyleKind = 'date' | 'elapsed' | null;

/** 日付・時刻書式か、経過時間書式（[h]:mm:ss など）か、それ以外（null）かを判定する */
function styleKindOf(code: string): StyleKind {
  if (/\[(?:h+|m+|s+)\]/i.test(code)) return 'elapsed';
  const stripped = code
    .replace(/"[^"]*"/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\\./g, '')
    .replace(/_./g, '')
    .replace(/\*./g, '');
  return /[ymdhs]/i.test(stripped) && !/^general$/i.test(stripped.trim())
    ? 'date'
    : null;
}

/** 経過時間（シリアル値の日数）を H:MM:SS にする。24時間を超えても時間として数える */
export function formatElapsed(serial: number): string | null {
  if (!Number.isFinite(serial) || serial < 0) return null;
  const total = Math.round(serial * 86400);
  const h = Math.floor(total / 3600);
  return `${h}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
}

function pad(n: number, width = 2): string {
  return String(n).padStart(width, '0');
}

/** Excelのシリアル値（日付セル）を YYYY-MM-DD / HH:MM:SS / YYYY-MM-DD HH:MM:SS にする */
export function formatSerialDate(
  serial: number,
  date1904 = false,
): string | null {
  if (!Number.isFinite(serial) || serial < 0) return null;
  const totalSeconds = Math.round(serial * 86400);
  const days = Math.floor(totalSeconds / 86400);
  const secs = totalSeconds - days * 86400;
  const ms = date1904
    ? (days - 24107) * 86400000
    : (days - (serial >= 60 ? 25569 : 25568)) * 86400000;
  const d = new Date(ms);
  const year = d.getUTCFullYear();
  if (Number.isNaN(year) || year > 9999) return null;
  const datePart = `${pad(year, 4)}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
  const timePart = `${pad(Math.floor(secs / 3600))}:${pad(Math.floor((secs % 3600) / 60))}:${pad(secs % 60)}`;
  if (secs === 0) return datePart;
  if (days === 0) return timePart;
  return `${datePart} ${timePart}`;
}

/** 数値セルの文字列。Excelの表示に合わせて15桁に丸める（0.1+0.2 → 0.3）。 */
function formatNumber(raw: string): string {
  const n = Number(raw);
  if (raw.trim() === '' || !Number.isFinite(n)) return raw;
  return String(parseFloat(n.toPrecision(15)));
}

/** セル参照（B3）から 0始まりの列番号を取り出す。取れなければ -1。 */
function columnIndexOf(ref: string | undefined): number {
  const m = ref?.match(/^([A-Za-z]+)/);
  if (!m) return -1;
  let n = 0;
  for (const ch of m[1].toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

export interface XlsxWorkbook {
  sheetNames: string[];
  /** 指定シートを行×列の文字列配列にする（末尾の空行・空列は含めない） */
  readSheet(index: number): string[][];
}

const PK_MAGIC = [0x50, 0x4b, 0x03, 0x04];
const OLE_MAGIC = [0xd0, 0xcf, 0x11, 0xe0];

function startsWith(bytes: Uint8Array, magic: number[]): boolean {
  return magic.every((b, i) => bytes[i] === b);
}

/** xlsxを開き、シート名の一覧と各シートの読み出し関数を返す。 */
export function openXlsx(bytes: Uint8Array): XlsxWorkbook {
  if (bytes.length > MAX_FILE_BYTES) throw new ExcelConvertError('too-large');
  if (!startsWith(bytes, PK_MAGIC)) {
    throw new ExcelConvertError(
      startsWith(bytes, OLE_MAGIC) ? 'legacy-or-encrypted' : 'not-xlsx',
    );
  }

  let total = 0;
  let files: Record<string, Uint8Array>;
  try {
    files = unzipSync(bytes, {
      filter: (file) => {
        const name = file.name;
        const wanted =
          name === 'xl/workbook.xml' ||
          name === 'xl/_rels/workbook.xml.rels' ||
          name === 'xl/sharedStrings.xml' ||
          name === 'xl/styles.xml' ||
          /^xl\/worksheets\/[^/]+\.xml$/.test(name);
        if (!wanted) return false;
        total += file.originalSize;
        if (total > MAX_UNCOMPRESSED_BYTES) {
          throw new ExcelConvertError('too-large');
        }
        return true;
      },
    });
  } catch (error) {
    if (error instanceof ExcelConvertError) throw error;
    throw new ExcelConvertError('invalid-xlsx');
  }

  const workbook = parseXml(files['xl/workbook.xml']);
  const wb = workbook.workbook as XmlNode | undefined;
  if (!wb) throw new ExcelConvertError('invalid-xlsx');

  const relsRoot = parseXml(files['xl/_rels/workbook.xml.rels']);
  const relTargets = new Map<string, string>();
  const relationships = (relsRoot.Relationships as XmlNode | undefined)
    ?.Relationship as XmlNode[] | undefined;
  for (const rel of relationships ?? []) {
    const id = rel['@_Id'];
    const target = rel['@_Target'];
    if (typeof id === 'string' && typeof target === 'string') {
      relTargets.set(id, normalizePartPath(target));
    }
  }

  const sheetEntries = asArray(
    (wb.sheets as XmlNode | undefined)?.sheet as
      XmlNode | XmlNode[] | undefined,
  );
  const sheets = sheetEntries
    .map((s, i) => ({
      name: String(s['@_name'] ?? `Sheet${i + 1}`),
      path: relTargets.get(String(s['@_r:id'] ?? '')),
    }))
    // グラフシートなど、セルを持たないシートは一覧に出さない
    .filter((s) => s.path?.startsWith('xl/worksheets/'));
  if (sheets.length === 0) throw new ExcelConvertError('no-sheet');

  const date1904 =
    (wb.workbookPr as XmlNode | undefined)?.['@_date1904'] === '1' ||
    (wb.workbookPr as XmlNode | undefined)?.['@_date1904'] === 'true';

  // 共有文字列
  let sharedStrings: string[] | null = null;
  const getSharedStrings = (): string[] => {
    if (sharedStrings) return sharedStrings;
    const sst = parseXml(files['xl/sharedStrings.xml']).sst as
      XmlNode | undefined;
    sharedStrings = asArray(sst?.si as unknown[] | undefined).map((si) =>
      unescapeOoxml(richText(si)),
    );
    return sharedStrings;
  };

  // セル書式 → 日付かどうか
  let dateStyles: StyleKind[] | null = null;
  const getDateStyles = (): StyleKind[] => {
    if (dateStyles) return dateStyles;
    const styleSheet = parseXml(files['xl/styles.xml']).styleSheet as
      XmlNode | undefined;
    const customKinds = new Map<number, StyleKind>();
    const numFmts = (styleSheet?.numFmts as XmlNode | undefined)?.numFmt as
      XmlNode[] | undefined;
    for (const f of numFmts ?? []) {
      customKinds.set(
        Number(f['@_numFmtId']),
        styleKindOf(String(f['@_formatCode'] ?? '')),
      );
    }
    const xfs = (styleSheet?.cellXfs as XmlNode | undefined)?.xf as
      XmlNode[] | undefined;
    dateStyles = (xfs ?? []).map((xf) => {
      const id = Number(xf['@_numFmtId']);
      if (customKinds.has(id)) return customKinds.get(id) ?? null;
      if (id === 46) return 'elapsed';
      return BUILTIN_DATE_FORMATS.has(id) ? 'date' : null;
    });
    return dateStyles;
  };

  const readSheet = (index: number): string[][] => {
    const sheet = sheets[index];
    const bytesOfSheet = sheet?.path ? files[sheet.path] : undefined;
    if (!sheet || !bytesOfSheet) throw new ExcelConvertError('invalid-xlsx');
    const ws = parseXml(bytesOfSheet).worksheet as XmlNode | undefined;
    const sheetData = ws?.sheetData as XmlNode | undefined;
    const rowNodes = asArray(sheetData?.row as XmlNode | XmlNode[] | undefined);

    const cellValue = (cell: XmlNode): string => {
      const type = cell['@_t'] as string | undefined;
      const v = textOf(cell.v);
      switch (type) {
        case 's':
          return getSharedStrings()[Number(v)] ?? '';
        case 'inlineStr':
          return unescapeOoxml(richText(cell.is));
        case 'str':
          return unescapeOoxml(v);
        case 'e':
          return v;
        case 'b':
          return v === '1' ? 'TRUE' : v === '0' ? 'FALSE' : v;
        case 'd':
          return v;
        default: {
          if (v === '') return '';
          const styleIndex = Number(cell['@_s']);
          const kind = Number.isInteger(styleIndex)
            ? getDateStyles()[styleIndex]
            : null;
          if (kind) {
            const formatted =
              kind === 'elapsed'
                ? formatElapsed(Number(v))
                : formatSerialDate(Number(v), date1904);
            if (formatted !== null) return formatted;
          }
          return formatNumber(v);
        }
      }
    };

    const out: string[][] = [];
    let maxCols = 0;
    let lastNonEmptyRow = -1;
    let nextRow = 0;

    for (const rowNode of rowNodes) {
      const rowRef = Number(rowNode['@_r']);
      const rowIndex =
        Number.isInteger(rowRef) && rowRef >= 1 ? rowRef - 1 : nextRow;
      nextRow = rowIndex + 1;
      if (rowIndex >= MAX_ROWS) throw new ExcelConvertError('invalid-xlsx');

      const cells: string[] = [];
      let nextCol = 0;
      for (const cell of asArray(
        rowNode.c as XmlNode | XmlNode[] | undefined,
      )) {
        const refCol = columnIndexOf(cell['@_r'] as string | undefined);
        const col = refCol >= 0 ? refCol : nextCol;
        nextCol = col + 1;
        if (col >= MAX_COLUMNS) continue;
        const value = cellValue(cell);
        if (value === '') continue;
        while (cells.length < col) cells.push('');
        cells[col] = value;
      }
      if (cells.length === 0) continue;
      maxCols = Math.max(maxCols, cells.length);
      while (out.length < rowIndex) out.push([]);
      out[rowIndex] = cells;
      lastNonEmptyRow = rowIndex;
    }

    const trimmed = out.slice(0, lastNonEmptyRow + 1);
    return trimmed.map((r) => {
      const row = r ?? [];
      while (row.length < maxCols) row.push('');
      return row;
    });
  };

  return { sheetNames: sheets.map((s) => s.name), readSheet };
}

export interface RowsToCsvOptions {
  delimiter?: CsvDelimiter;
  /** 行末を CRLF にする。既定 false（LF） */
  crlf?: boolean;
  /** 先頭に UTF-8 の BOM を付ける（日本語版Excelで直接開くとき用）。既定 false */
  bom?: boolean;
}

/** 行×列の文字列配列をCSVテキストにする。 */
export function rowsToCsv(
  rows: string[][],
  options: RowsToCsvOptions = {},
): string {
  const delimiter = options.delimiter ?? ',';
  const eol = options.crlf ? '\r\n' : '\n';
  const singleColumn = rows.length > 0 && rows.every((r) => r.length <= 1);
  const lines = rows.map((row) =>
    row.map((v) => escapeCsvField(v, delimiter, singleColumn)).join(delimiter),
  );
  const body = lines.length === 0 ? '' : lines.join(eol) + eol;
  return (options.bom ? '\uFEFF' : '') + body;
}

/** 保存するCSVのファイル名。シート名を付けるときは `元の名前_シート名.csv`。 */
export function csvFileName(
  sourceName: string,
  sheetName: string | null,
  delimiter: CsvDelimiter = ',',
): string {
  const base = sourceName.replace(/\.[^./\\]+$/, '').trim() || 'output';
  const safeSheet = (sheetName ?? '').replace(/[\\/:*?"<>|]/g, '_').trim();
  const ext = delimiter === '\t' ? 'tsv' : 'csv';
  return safeSheet === '' ? `${base}.${ext}` : `${base}_${safeSheet}.${ext}`;
}
