export type DelimiterKind =
  | 'newline'
  | 'comma'
  | 'commaSpace'
  | 'tab'
  | 'space'
  | 'semicolon'
  | 'pipe'
  | 'custom';

export type QuoteKind = 'none' | 'double' | 'single' | 'backtick';

export interface DelimiterOptions {
  inputDelimiter: DelimiterKind;
  /** inputDelimiter が custom のときの区切り文字列（\n \t \\ のエスケープ可） */
  inputCustom: string;
  outputDelimiter: DelimiterKind;
  /** outputDelimiter が custom のときの区切り文字列（\n \t \\ のエスケープ可） */
  outputCustom: string;
  /** 各項目の前後の空白を削除する */
  trim: boolean;
  /** 空の項目を取り除く */
  removeEmpty: boolean;
  /** 重複する項目を取り除く（先に出現したものを残す） */
  dedupe: boolean;
  /** 入力項目を囲んでいる引用符（" ' `）を外す */
  stripQuotes: boolean;
  /** 出力項目に付与する引用符 */
  quote: QuoteKind;
}

export interface DelimiterResult {
  items: string[];
  output: string;
}

const QUOTE_CHARS: Record<Exclude<QuoteKind, 'none'>, string> = {
  double: '"',
  single: "'",
  backtick: '`',
};

/** カスタム区切りの \n \t \r \\ を実際の文字に変換する */
export function unescapeDelimiter(value: string): string {
  return value.replace(/\\([ntr\\])/g, (_, c: string) => {
    if (c === 'n') return '\n';
    if (c === 't') return '\t';
    if (c === 'r') return '\r';
    return '\\';
  });
}

function splitByDelimiter(
  text: string,
  kind: DelimiterKind,
  custom: string,
): string[] {
  if (text === '') return [];
  switch (kind) {
    case 'newline':
      return text.split(/\r\n|\r|\n/);
    case 'comma':
    case 'commaSpace':
      return text.split(',');
    case 'tab':
      return text.split('\t');
    case 'space':
      // 半角・全角スペースの連続は1つの区切りとして扱う
      return text.split(/[ \u3000]+/);
    case 'semicolon':
      return text.split(';');
    case 'pipe':
      return text.split('|');
    case 'custom': {
      const sep = unescapeDelimiter(custom);
      if (sep === '') return [text];
      return text.split(sep);
    }
  }
}

function joinString(kind: DelimiterKind, custom: string): string {
  switch (kind) {
    case 'newline':
      return '\n';
    case 'comma':
      return ',';
    case 'commaSpace':
      return ', ';
    case 'tab':
      return '\t';
    case 'space':
      return ' ';
    case 'semicolon':
      return ';';
    case 'pipe':
      return '|';
    case 'custom':
      return unescapeDelimiter(custom);
  }
}

/** 前後が同じ引用符で囲まれていれば外す（内側で二重化された引用符は1つに戻す） */
function stripSurroundingQuotes(item: string): string {
  if (item.length < 2) return item;
  const first = item[0];
  if (
    (first === '"' || first === "'" || first === '`') &&
    item.endsWith(first)
  ) {
    const inner = item.slice(1, -1);
    return inner.split(first + first).join(first);
  }
  return item;
}

function applyQuote(item: string, quote: QuoteKind): string {
  if (quote === 'none') return item;
  const q = QUOTE_CHARS[quote];
  // 項目内の同じ引用符は二重化してエスケープする（CSV・SQL と同じ流儀）
  return q + item.split(q).join(q + q) + q;
}

/**
 * 区切り文字で区切られたテキストを項目に分解し、別の区切り文字・引用符で組み立て直す。
 * 処理順: 分割 → 前後空白削除 → 引用符除去 → 空要素除去 → 重複除去 → 引用符付与 → 結合
 */
export function convertDelimited(
  text: string,
  options: DelimiterOptions,
): DelimiterResult {
  let items = splitByDelimiter(
    text,
    options.inputDelimiter,
    options.inputCustom,
  );
  if (options.trim) items = items.map((item) => item.trim());
  if (options.stripQuotes) items = items.map(stripSurroundingQuotes);
  if (options.removeEmpty) items = items.filter((item) => item !== '');
  if (options.dedupe) items = [...new Set(items)];

  const output = items
    .map((item) => applyQuote(item, options.quote))
    .join(joinString(options.outputDelimiter, options.outputCustom));
  return { items, output };
}
