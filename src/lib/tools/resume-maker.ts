/**
 * 履歴書作成（印刷用）のロジック。
 * 入力の解析（年月つきの行）、和暦変換、年齢、折り返し、行数の収まり判定、保存データの検証を行う。
 * 画面の文言は持たない（書類に印字する日本語の見出しは呼び出し側が渡す）。
 */

export type EraStyle = 'wareki' | 'seireki';
export type Gender = '' | 'male' | 'female';

export interface ResumeData {
  era: EraStyle;
  /** 提出日 YYYY-MM-DD（空なら印字しない） */
  date: string;
  nameKana: string;
  name: string;
  /** 生年月日 YYYY-MM-DD */
  birth: string;
  gender: Gender;
  postal: string;
  addressKana: string;
  address: string;
  phone: string;
  email: string;
  /** 学歴（1行1項目。「2015-04 ○○高等学校 入学」の形式） */
  education: string;
  /** 職歴 */
  work: string;
  /** 免許・資格 */
  licenses: string;
  motivation: string;
  wishes: string;
}

export const EMPTY_RESUME: ResumeData = {
  era: 'wareki',
  date: '',
  nameKana: '',
  name: '',
  birth: '',
  gender: '',
  postal: '',
  addressKana: '',
  address: '',
  phone: '',
  email: '',
  education: '',
  work: '',
  licenses: '',
  motivation: '',
  wishes: '',
};

/** 学歴・職歴欄の行数（見出し・「以上」・折り返しを含む） */
export const HISTORY_ROWS = 21;
/** 免許・資格欄の行数 */
export const LICENSE_ROWS = 8;
/** 学歴・職歴・免許・資格の本文1行に入る幅（全角=1、半角=0.5） */
export const ROW_TEXT_WIDTH = 36;
/** 志望動機・本人希望欄の1行に入る幅 */
export const BOX_TEXT_WIDTH = 44;
export const MOTIVATION_LINES = 11;
export const WISHES_LINES = 8;

// ---------- 日付・和暦 ----------

export interface YMD {
  year: number;
  month: number;
  day: number;
}

export function parseIsoDate(value: string): YMD | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const d = new Date(Date.UTC(year, month - 1, day));
  if (
    d.getUTCFullYear() !== year ||
    d.getUTCMonth() !== month - 1 ||
    d.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

interface Era {
  name: string;
  y: number;
  m: number;
  d: number;
}

// 新しい順。開始日以降ならその元号
const ERAS: Era[] = [
  { name: '令和', y: 2019, m: 5, d: 1 },
  { name: '平成', y: 1989, m: 1, d: 8 },
  { name: '昭和', y: 1926, m: 12, d: 25 },
  { name: '大正', y: 1912, m: 7, d: 30 },
  { name: '明治', y: 1868, m: 1, d: 25 },
];

/** 月だけが分かる場合に境界判定へ使う日（月途中の改元は月の中ごろで判定する） */
const DEFAULT_DAY = 15;

export function toEra(
  year: number,
  month: number,
  day: number = DEFAULT_DAY,
): { name: string; year: number } | null {
  for (const e of ERAS) {
    const afterStart =
      year > e.y ||
      (year === e.y && (month > e.m || (month === e.m && day >= e.d)));
    if (afterStart) return { name: e.name, year: year - e.y + 1 };
  }
  return null;
}

function eraYearText(n: number): string {
  return n === 1 ? '元' : String(n);
}

/** 年欄の表示（和暦: 令和元 / 西暦: 2019）。和暦にできない年は西暦 */
export function formatYearCell(
  year: number,
  month: number,
  style: EraStyle,
): string {
  if (style === 'wareki') {
    const era = toEra(year, month);
    if (era) return `${era.name}${eraYearText(era.year)}`;
  }
  return String(year);
}

/** 日付の表示（令和8年10月23日 / 2026年10月23日） */
export function formatDateJa(value: string, style: EraStyle): string {
  const ymd = parseIsoDate(value);
  if (!ymd) return '';
  if (style === 'wareki') {
    const era = toEra(ymd.year, ymd.month, ymd.day);
    if (era) {
      return `${era.name}${eraYearText(era.year)}年${ymd.month}月${ymd.day}日`;
    }
  }
  return `${ymd.year}年${ymd.month}月${ymd.day}日`;
}

/** 満年齢。どちらかが不正、または生年月日が基準日より後なら null */
export function calcAge(birth: string, onDate: string): number | null {
  const b = parseIsoDate(birth);
  const d = parseIsoDate(onDate);
  if (!b || !d) return null;
  let age = d.year - b.year;
  if (d.month < b.month || (d.month === b.month && d.day < b.day)) age -= 1;
  return age >= 0 ? age : null;
}

// ---------- テキストの折り返し ----------

function charWidth(ch: string): number {
  return /[ -~｡-ﾟ]/.test(ch) ? 0.5 : 1;
}

export function textWidth(text: string): number {
  let w = 0;
  for (const ch of text) w += charWidth(ch);
  return w;
}

/** 幅 maxWidth を超えないよう文字単位で折り返す。空文字列は [''] */
export function wrapByWidth(text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let cur = '';
  let w = 0;
  for (const ch of text) {
    const cw = charWidth(ch);
    if (w + cw > maxWidth && cur !== '') {
      lines.push(cur);
      cur = '';
      w = 0;
    }
    cur += ch;
    w += cw;
  }
  lines.push(cur);
  return lines;
}

/** 改行ごとに折り返した行の配列（末尾の空行は除く。段落間の空行は残す） */
export function wrapParagraphs(text: string, maxWidth: number): string[] {
  const src = text.replace(/\r\n?/g, '\n').replace(/\s+$/, '');
  if (src === '') return [];
  return src.split('\n').flatMap((line) => wrapByWidth(line, maxWidth));
}

// ---------- 学歴・職歴の解析 ----------

export interface Entry {
  /** 年欄・月欄に出す文字列（日付なしの行は空） */
  year: number | null;
  month: number | null;
  text: string;
}

const WAREKI_BASE: Record<string, number> = {
  明治: 1868,
  大正: 1912,
  昭和: 1926,
  平成: 1989,
  令和: 2019,
};

const WESTERN_RE = /^\s*(\d{4})\s*[-/.年]\s*(\d{1,2})\s*月?\s*(.*)$/;
const WAREKI_RE =
  /^\s*(明治|大正|昭和|平成|令和)\s*(元|\d{1,2})\s*年\s*(\d{1,2})\s*月?\s*(.*)$/;

export interface ParsedEntries {
  entries: Entry[];
  /** 月が1〜12でない行など、日付として読めなかった行 */
  badLines: string[];
}

/** 1行1項目のテキストを年・月・内容に分ける。空行は無視する */
export function parseEntries(text: string): ParsedEntries {
  const entries: Entry[] = [];
  const badLines: string[] = [];
  for (const raw of text.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw
      .trim()
      .replace(/[０-９]/g, (c) =>
        String.fromCharCode(c.charCodeAt(0) - 0xfee0),
      );
    if (line === '') continue;
    let year: number | null = null;
    let monthText = '';
    let rest = line;
    const w = WESTERN_RE.exec(line);
    const j = w ? null : WAREKI_RE.exec(line);
    if (w) {
      year = Number(w[1]);
      monthText = w[2];
      rest = w[3].trim();
    } else if (j) {
      const n = j[2] === '元' ? 1 : Number(j[2]);
      year = WAREKI_BASE[j[1]] + n - 1;
      monthText = j[3];
      rest = j[4].trim();
    }
    if (year !== null) {
      const month = Number(monthText);
      if (month >= 1 && month <= 12) {
        entries.push({ year, month, text: rest });
      } else {
        badLines.push(line);
        entries.push({ year: null, month: null, text: line });
      }
    } else {
      entries.push({ year: null, month: null, text: line });
    }
  }
  return { entries, badLines };
}

export type RowKind = 'heading' | 'entry' | 'cont' | 'end' | 'blank';

export interface HistoryRow {
  kind: RowKind;
  year: string;
  month: string;
  text: string;
}

function entryRows(entries: Entry[], style: EraStyle): HistoryRow[] {
  const rows: HistoryRow[] = [];
  for (const e of entries) {
    const lines = wrapByWidth(e.text, ROW_TEXT_WIDTH);
    const hasDate = e.year !== null && e.month !== null;
    lines.forEach((line, i) => {
      if (i === 0) {
        rows.push({
          kind: 'entry',
          year: hasDate ? formatYearCell(e.year!, e.month!, style) : '',
          month: hasDate ? String(e.month) : '',
          text: line,
        });
      } else {
        rows.push({ kind: 'cont', year: '', month: '', text: line });
      }
    });
  }
  return rows;
}

export interface HistoryLabels {
  education: string;
  work: string;
  end: string;
}

/** 学歴・職歴欄の行（見出し・学歴・空行・見出し・職歴・「以上」） */
export function buildHistoryRows(
  education: string,
  work: string,
  style: EraStyle,
  labels: HistoryLabels,
): { rows: HistoryRow[]; badLines: string[] } {
  const edu = parseEntries(education);
  const wk = parseEntries(work);
  const heading = (text: string): HistoryRow => ({
    kind: 'heading',
    year: '',
    month: '',
    text,
  });
  const rows: HistoryRow[] = [
    heading(labels.education),
    ...entryRows(edu.entries, style),
    { kind: 'blank', year: '', month: '', text: '' },
    heading(labels.work),
    ...entryRows(wk.entries, style),
    { kind: 'end', year: '', month: '', text: labels.end },
  ];
  return { rows, badLines: [...edu.badLines, ...wk.badLines] };
}

/** 免許・資格欄の行 */
export function buildLicenseRows(
  licenses: string,
  style: EraStyle,
): { rows: HistoryRow[]; badLines: string[] } {
  const parsed = parseEntries(licenses);
  return { rows: entryRows(parsed.entries, style), badLines: parsed.badLines };
}

// ---------- 全体のレイアウトと検証 ----------

export type IssueCode =
  'history' | 'licenses' | 'motivation' | 'wishes' | 'entryDate';

export interface ResumeIssue {
  code: IssueCode;
  /** 収まる最大行数 */
  limit?: number;
  /** 実際に必要な行数 */
  actual?: number;
  /** 日付として読めなかった行 */
  line?: string;
}

export interface ResumeLayout {
  dateText: string;
  birthText: string;
  age: number | null;
  history: HistoryRow[];
  licenses: HistoryRow[];
  motivation: string[];
  wishes: string[];
  issues: ResumeIssue[];
}

export function layoutResume(
  data: ResumeData,
  labels: HistoryLabels,
): ResumeLayout {
  const history = buildHistoryRows(data.education, data.work, data.era, labels);
  const lic = buildLicenseRows(data.licenses, data.era);
  const motivation = wrapParagraphs(data.motivation, BOX_TEXT_WIDTH);
  const wishes = wrapParagraphs(data.wishes, BOX_TEXT_WIDTH);

  const issues: ResumeIssue[] = [];
  for (const line of [...history.badLines, ...lic.badLines]) {
    issues.push({ code: 'entryDate', line });
  }
  const checks: [IssueCode, number, number][] = [
    ['history', history.rows.length, HISTORY_ROWS],
    ['licenses', lic.rows.length, LICENSE_ROWS],
    ['motivation', motivation.length, MOTIVATION_LINES],
    ['wishes', wishes.length, WISHES_LINES],
  ];
  for (const [code, actual, limit] of checks) {
    if (actual > limit) issues.push({ code, limit, actual });
  }

  const birthDate = formatDateJa(data.birth, data.era);
  return {
    dateText: formatDateJa(data.date, data.era),
    birthText: birthDate === '' ? '' : `${birthDate}生`,
    age: calcAge(data.birth, data.date),
    history: history.rows,
    licenses: lic.rows,
    motivation,
    wishes,
    issues,
  };
}

/** ローカル日付の YYYY-MM-DD（提出日の初期値用） */
export function todayIso(now: Date = new Date()): string {
  const y = String(now.getFullYear()).padStart(4, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ---------- 郵便番号 ----------

/** 7桁なら「123-4567」形式に。空は空、それ以外は null */
export function normalizePostal(value: string): string | null {
  const digits = value
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[\s\-ー－‐]/g, '');
  if (digits === '') return '';
  return /^\d{7}$/.test(digits)
    ? `${digits.slice(0, 3)}-${digits.slice(3)}`
    : null;
}

// ---------- 保存データ ----------

const STORAGE_VERSION = 1;

export function serializeResume(data: ResumeData): string {
  return JSON.stringify({ v: STORAGE_VERSION, data });
}

/** localStorage の文字列を検証して読み戻す。壊れていれば null。欠けた項目は空にする */
export function parseStoredResume(raw: string | null): ResumeData | null {
  if (!raw) return null;
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof obj !== 'object' || obj === null) return null;
  const record = obj as Record<string, unknown>;
  if (record.v !== STORAGE_VERSION) return null;
  const src = record.data;
  if (typeof src !== 'object' || src === null) return null;
  const s = src as Record<string, unknown>;
  const str = (key: keyof ResumeData): string =>
    typeof s[key] === 'string' ? (s[key] as string) : '';
  return {
    era: s.era === 'seireki' ? 'seireki' : 'wareki',
    date: str('date'),
    nameKana: str('nameKana'),
    name: str('name'),
    birth: str('birth'),
    gender: s.gender === 'male' || s.gender === 'female' ? s.gender : '',
    postal: str('postal'),
    addressKana: str('addressKana'),
    address: str('address'),
    phone: str('phone'),
    email: str('email'),
    education: str('education'),
    work: str('work'),
    licenses: str('licenses'),
    motivation: str('motivation'),
    wishes: str('wishes'),
  };
}
