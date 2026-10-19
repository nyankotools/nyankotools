export type CodeLanguage = 'css' | 'javascript' | 'html';

export interface FormatCodeOptions {
  tabWidth?: number;
  useTabs?: boolean;
}

const PRETTIER_PARSERS: Record<CodeLanguage, string> = {
  css: 'css',
  javascript: 'babel',
  html: 'html',
};

// prettier・terser・csso は大きいため、使う言語・操作のぶんだけ動的に読み込む
// （ページ初期表示のJSを小さく保つ）。HTML は埋め込みの script / style も整形するため全プラグインを使う。
async function loadPrettierPlugins(language: CodeLanguage) {
  switch (language) {
    case 'css':
      return [(await import('prettier/plugins/postcss')).default];
    case 'javascript':
      return Promise.all([
        import('prettier/plugins/babel'),
        import('prettier/plugins/estree'),
      ]).then((modules) => modules.map((m) => m.default));
    case 'html':
      return Promise.all([
        import('prettier/plugins/babel'),
        import('prettier/plugins/estree'),
        import('prettier/plugins/html'),
        import('prettier/plugins/postcss'),
      ]).then((modules) => modules.map((m) => m.default));
  }
}

/** 整形に使うライブラリを先読みする（入力の操作前に呼び、最初の整形・コピーの待ちを短くする。失敗は実処理側で再試行される） */
export function preloadFormatter(language: CodeLanguage): void {
  void import('prettier/standalone').catch(() => {});
  void loadPrettierPlugins(language).catch(() => {});
}

/** 圧縮に使うライブラリを先読みする（CSS・JS のみ。HTML の圧縮は自前処理） */
export function preloadMinifier(language: CodeLanguage): void {
  if (language === 'css') void import('csso').catch(() => {});
  if (language === 'javascript') void import('terser').catch(() => {});
}

export async function formatCode(
  input: string,
  language: CodeLanguage,
  options: FormatCodeOptions = {},
): Promise<string> {
  const { tabWidth = 2, useTabs = false } = options;
  const [prettier, plugins] = await Promise.all([
    import('prettier/standalone'),
    loadPrettierPlugins(language),
  ]);
  return prettier.format(input, {
    parser: PRETTIER_PARSERS[language],
    plugins,
    tabWidth,
    useTabs,
  });
}

export async function minifyCode(
  input: string,
  language: CodeLanguage,
): Promise<string> {
  switch (language) {
    case 'css': {
      const { minify } = await import('csso');
      return minify(input).css;
    }
    case 'javascript': {
      const { minify } = await import('terser');
      const result = await minify(input);
      return result.code ?? '';
    }
    case 'html':
      return minifyHtmlSource(input);
  }
}

/** 開いても中身をそのまま保持する要素（内部の空白・改行が意味を持つため） */
const RAW_TEXT_ELEMENTS: ReadonlySet<string> = new Set([
  'script',
  'style',
  'pre',
  'textarea',
]);

/**
 * 前後の空白が表示に影響しないブロック・構造系の要素。
 * これらのタグに隣接する空白は捨ててよいが、インライン要素（b, i, span, a 等）に隣接する空白は
 * 語間の空白として表示に効くため、1個のスペースに圧縮して残す。
 */
const BLOCK_LEVEL_ELEMENTS: ReadonlySet<string> = new Set([
  'html',
  'head',
  'body',
  'title',
  'meta',
  'link',
  'base',
  'script',
  'style',
  'noscript',
  'template',
  'address',
  'article',
  'aside',
  'blockquote',
  'details',
  'dialog',
  'dd',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hgroup',
  'hr',
  'legend',
  'li',
  'main',
  'menu',
  'nav',
  'ol',
  'p',
  'pre',
  'section',
  'summary',
  'table',
  'caption',
  'colgroup',
  'col',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'ul',
  'br',
  'option',
  'optgroup',
  'datalist',
]);

/**
 * HTMLコメントの除去とタグ間の空白圧縮のみを行う簡易ミニファイ。
 * フルスペックのHTMLパーサーではなく、SQL整形ツールのminifySqlQueryと同様に
 * 「タグ」「コメント」「raw要素の中身」を読み飛ばしながら処理する軽量実装。
 */
export function minifyHtmlSource(input: string): string {
  let result = '';
  let pendingSpace = false;
  // 直前がブロック要素のタグ（または先頭）か。その直後の空白は表示に影響しないので捨てる
  let afterBlock = true;
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    // HTMLコメント（条件付きコメント等も区別せず除去する）
    if (ch === '<' && input.startsWith('<!--', i)) {
      const end = input.indexOf('-->', i + 4);
      i = end === -1 ? input.length : end + 3;
      continue;
    }

    // 開始タグ・終了タグ
    if (ch === '<' && /[a-zA-Z/]/.test(input[i + 1] ?? '')) {
      const tagNameMatch = /^<\/?([a-zA-Z][a-zA-Z0-9-]*)/.exec(input.slice(i));
      const tagName = tagNameMatch?.[1].toLowerCase() ?? '';
      const isClosingTag = input[i + 1] === '/';
      const [tagText, afterTag] = readTag(input, i);
      const isBlock = BLOCK_LEVEL_ELEMENTS.has(tagName);
      // インライン要素の直前の空白は語間の空白なので1個残す（例: "Hello <b>world</b>"）
      if (pendingSpace && !isBlock && !afterBlock) result += ' ';
      result += tagText;
      i = afterTag;
      pendingSpace = false;
      afterBlock = isBlock;

      if (!isClosingTag && RAW_TEXT_ELEMENTS.has(tagName)) {
        const [rawText, afterRaw] = readRawUntilCloseTag(input, i, tagName);
        result += rawText;
        i = afterRaw;
      }
      continue;
    }

    // テキストノード内の空白は1個のスペースに圧縮し、タグに隣接する空白は捨てる
    if (
      ch === ' ' ||
      ch === '\t' ||
      ch === '\n' ||
      ch === '\r' ||
      ch === '\f'
    ) {
      pendingSpace = true;
      i++;
      continue;
    }

    if (pendingSpace && !afterBlock) result += ' ';
    pendingSpace = false;
    afterBlock = false;
    result += ch;
    i++;
  }

  return result.trim();
}

/** タグの開始位置（`<`）から、引用符内の`>`を無視して対応する`>`までを読み取る */
function readTag(input: string, start: number): [string, number] {
  let i = start + 1;
  let quote: string | null = null;
  while (i < input.length) {
    const ch = input[i];
    if (quote) {
      if (ch === quote) quote = null;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      i++;
      continue;
    }
    if (ch === '>') {
      i++;
      break;
    }
    i++;
  }
  return [input.slice(start, i), i];
}

/**
 * script/style/pre/textarea要素の中身を、対応する終了タグの直前までそのまま読み取る。
 * 終了タグが見つからない場合は末尾までを中身として扱う。
 */
function readRawUntilCloseTag(
  input: string,
  start: number,
  tagName: string,
): [string, number] {
  const closeIndex = input.toLowerCase().indexOf(`</${tagName}`, start);
  if (closeIndex === -1) return [input.slice(start), input.length];
  return [input.slice(start, closeIndex), closeIndex];
}
