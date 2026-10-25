/** 一度に扱えるファイル数の上限（zip-tool の MAX_ENTRIES と同じ）。 */
export const MAX_FILES = 5000;
/** 連番の桁数の上限（巨大な桁数でのメモリ・時間の浪費を防ぐ）。 */
export const MAX_DIGITS = 10;
export const MAX_START = 999_999_999;
export const MAX_STEP = 99_999;
/** 正規表現パターンの長さの上限。 */
export const MAX_PATTERN_LENGTH = 200;
/** 付ける文字列（接頭辞・接尾辞・置換後・区切り）の長さの上限。 */
export const MAX_AFFIX_LENGTH = 100;
/** ファイル名の長さの上限（多くのファイルシステムの上限）。 */
export const MAX_NAME_LENGTH = 255;

export type CaseMode = 'none' | 'lower' | 'upper';
export type ExtMode = 'keep' | 'lower' | 'upper' | 'change' | 'remove';
export type NumberPosition = 'suffix' | 'prefix' | 'replace';
export type SortMode = 'selection' | 'name';

export interface NumberingOptions {
  enabled: boolean;
  start: number;
  step: number;
  digits: number;
  position: NumberPosition;
  /** 連番と元の名前の間に入れる文字列 */
  separator: string;
}

export interface RenameOptions {
  find: string;
  replaceWith: string;
  useRegex: boolean;
  ignoreCase: boolean;
  caseMode: CaseMode;
  prefix: string;
  suffix: string;
  numbering: NumberingOptions;
  extMode: ExtMode;
  /** extMode が 'change' のときの新しい拡張子（先頭の . は不要） */
  newExt: string;
}

export const DEFAULT_OPTIONS: RenameOptions = {
  find: '',
  replaceWith: '',
  useRegex: false,
  ignoreCase: false,
  caseMode: 'none',
  prefix: '',
  suffix: '',
  numbering: {
    enabled: false,
    start: 1,
    step: 1,
    digits: 3,
    position: 'suffix',
    separator: '_',
  },
  extMode: 'keep',
  newExt: '',
};

export type RenameIssueType =
  /** 結果が空・`.`・`..` になる（ブロック） */
  | 'empty'
  /** 他のファイルと結果が同じ（ブロック。大小文字は区別しない） */
  | 'duplicate'
  /** 禁止文字・パス区切りを _ に置き換えた */
  | 'sanitized'
  /** Windows の予約名（CON など） */
  | 'reserved'
  /** 長すぎる名前（ブロック） */
  | 'too-long';

export interface RenameRow {
  original: string;
  renamed: string;
  changed: boolean;
  issues: RenameIssueType[];
}

export type RenameErrorCode =
  | 'too-many-files'
  | 'invalid-regex'
  | 'pattern-too-long'
  | 'invalid-number'
  | 'text-too-long';

export interface RenamePlan {
  rows: RenameRow[];
  /** 設定そのものが不正なとき（rows は空） */
  error?: RenameErrorCode;
  /** ブロックされる問題（空・重複・長すぎ）が1件でもあるか */
  blocked: boolean;
  /** 実際に名前が変わるファイルの数 */
  changedCount: number;
}

const BLOCKING: RenameIssueType[] = ['empty', 'duplicate', 'too-long'];
const RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
// eslint-disable-next-line no-control-regex
const FORBIDDEN = /[\\/:*?"<>|\u0000-\u001f]/g;

/** 名前を本体と拡張子（先頭のドットなし）に分ける。`.bashrc` のような先頭ドットのみは本体扱い。 */
export function splitName(name: string): { stem: string; ext: string } {
  const dot = name.lastIndexOf('.');
  if (dot <= 0 || dot === name.length - 1) return { stem: name, ext: '' };
  return { stem: name.slice(0, dot), ext: name.slice(dot + 1) };
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** 自然順（file2 < file10）で並べ替えた新しい配列を返す。 */
export function compareNatural(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

export function sortNatural(names: string[]): string[] {
  return [...names].sort(compareNatural);
}

/** 連番を桁数でゼロ埋めする。桁数は MAX_DIGITS までに制限済みであること。 */
export function formatNumber(n: number, digits: number): string {
  return String(n).padStart(digits, '0');
}

function isIntInRange(n: number, min: number, max: number): boolean {
  return Number.isInteger(n) && n >= min && n <= max;
}

function validate(
  count: number,
  options: RenameOptions,
): RenameErrorCode | undefined {
  if (count > MAX_FILES) return 'too-many-files';
  const n = options.numbering;
  if (
    !isIntInRange(n.start, 0, MAX_START) ||
    !isIntInRange(n.step, 1, MAX_STEP) ||
    !isIntInRange(n.digits, 1, MAX_DIGITS)
  )
    return 'invalid-number';
  if (options.useRegex && options.find.length > MAX_PATTERN_LENGTH)
    return 'pattern-too-long';
  if (
    options.find.length > MAX_AFFIX_LENGTH * 2 ||
    options.replaceWith.length > MAX_AFFIX_LENGTH ||
    options.prefix.length > MAX_AFFIX_LENGTH ||
    options.suffix.length > MAX_AFFIX_LENGTH ||
    n.separator.length > MAX_AFFIX_LENGTH ||
    options.newExt.length > MAX_AFFIX_LENGTH
  )
    return 'text-too-long';
  return undefined;
}

function buildReplacer(options: RenameOptions): {
  apply: (s: string) => string;
  error?: RenameErrorCode;
} {
  if (options.find === '') return { apply: (s) => s };
  const flags = options.ignoreCase ? 'gi' : 'g';
  try {
    if (options.useRegex) {
      const re = new RegExp(options.find, flags);
      return { apply: (s) => s.replace(re, options.replaceWith) };
    }
    const re = new RegExp(escapeRegExp(options.find), flags);
    // 関数で返すことで、置換後の $& などを特別扱いしない
    return { apply: (s) => s.replace(re, () => options.replaceWith) };
  } catch {
    return { apply: (s) => s, error: 'invalid-regex' };
  }
}

function applyCase(text: string, mode: CaseMode): string {
  if (mode === 'lower') return text.toLowerCase();
  if (mode === 'upper') return text.toUpperCase();
  return text;
}

/** 禁止文字を _ にし、末尾のドット・空白と先頭の空白を取り除く。 */
function cleanName(name: string): { value: string; sanitized: boolean } {
  let sanitized = false;
  let value = name.replace(FORBIDDEN, () => {
    sanitized = true;
    return '_';
  });
  const trimmed = value.replace(/^\s+/, '').replace(/[.\s]+$/, '');
  if (trimmed !== value) sanitized = true;
  value = trimmed;
  return { value, sanitized };
}

/**
 * 元のファイル名の一覧から、変更後の名前と問題点の一覧を作る。
 * 処理順: 置換 → 大小変換 → 連番 → 接頭辞・接尾辞 → 拡張子の処理 → 禁止文字の除去。
 */
export function planRenames(
  names: string[],
  options: RenameOptions,
): RenamePlan {
  const empty = (error: RenameErrorCode): RenamePlan => ({
    rows: [],
    error,
    blocked: true,
    changedCount: 0,
  });
  const invalid = validate(names.length, options);
  if (invalid) return empty(invalid);
  const replacer = buildReplacer(options);
  if (replacer.error) return empty(replacer.error);

  const num = options.numbering;
  const newExt = options.newExt.replace(/^\.+/, '');
  const results: {
    original: string;
    renamed: string;
    issues: RenameIssueType[];
  }[] = names.map((original, index) => {
    const { stem, ext } = splitName(original);
    let body = applyCase(replacer.apply(stem), options.caseMode);
    if (num.enabled) {
      const n = formatNumber(num.start + num.step * index, num.digits);
      if (num.position === 'replace') body = n;
      else if (num.position === 'prefix') body = n + num.separator + body;
      else body = body + num.separator + n;
    }
    body = options.prefix + body + options.suffix;

    let outExt = ext;
    if (options.extMode === 'lower') outExt = ext.toLowerCase();
    else if (options.extMode === 'upper') outExt = ext.toUpperCase();
    else if (options.extMode === 'change') outExt = newExt;
    else if (options.extMode === 'remove') outExt = '';
    const joined = outExt === '' ? body : `${body}.${outExt}`;

    const issues: RenameIssueType[] = [];
    const { value, sanitized } = cleanName(joined);
    if (sanitized) issues.push('sanitized');
    if (value === '' || value === '.' || value === '..') issues.push('empty');
    if (value.length > MAX_NAME_LENGTH) issues.push('too-long');
    if (RESERVED.test(splitName(value).stem)) issues.push('reserved');
    return { original, renamed: value, issues };
  });

  const counts = new Map<string, number>();
  for (const r of results) {
    if (r.renamed === '') continue;
    const key = r.renamed.toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const rows: RenameRow[] = results.map((r) => {
    const issues = [...r.issues];
    if ((counts.get(r.renamed.toLowerCase()) ?? 0) > 1)
      issues.push('duplicate');
    return {
      original: r.original,
      renamed: r.renamed,
      changed: r.renamed !== r.original,
      issues,
    };
  });
  return {
    rows,
    blocked: rows.some((r) => r.issues.some((i) => BLOCKING.includes(i))),
    changedCount: rows.filter((r) => r.changed).length,
  };
}
