import * as prettier from 'prettier/standalone';
import prettierBabel from 'prettier/plugins/babel';
import prettierEstree from 'prettier/plugins/estree';
import prettierHtml from 'prettier/plugins/html';
import prettierPostcss from 'prettier/plugins/postcss';
import { minify as minifyJs } from 'terser';
import { minify as minifyCss } from 'csso';

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

const PRETTIER_PLUGINS = [
  prettierBabel,
  prettierEstree,
  prettierHtml,
  prettierPostcss,
];

export async function formatCode(
  input: string,
  language: CodeLanguage,
  options: FormatCodeOptions = {},
): Promise<string> {
  const { tabWidth = 2, useTabs = false } = options;
  return prettier.format(input, {
    parser: PRETTIER_PARSERS[language],
    plugins: PRETTIER_PLUGINS,
    tabWidth,
    useTabs,
  });
}

export async function minifyCode(
  input: string,
  language: CodeLanguage,
): Promise<string> {
  switch (language) {
    case 'css':
      return minifyCss(input).css;
    case 'javascript': {
      const result = await minifyJs(input);
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
 * HTMLコメントの除去とタグ間の空白圧縮のみを行う簡易ミニファイ。
 * フルスペックのHTMLパーサーではなく、SQL整形ツールのminifySqlQueryと同様に
 * 「タグ」「コメント」「raw要素の中身」を読み飛ばしながら処理する軽量実装。
 */
export function minifyHtmlSource(input: string): string {
  let result = '';
  let pendingSpace = false;
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    // HTMLコメント（条件付きコメント等も区別せず除去する）
    if (ch === '<' && input.startsWith('<!--', i)) {
      const end = input.indexOf('-->', i + 4);
      i = end === -1 ? input.length : end + 3;
      pendingSpace = false;
      continue;
    }

    // 開始タグ・終了タグ
    if (ch === '<' && /[a-zA-Z/]/.test(input[i + 1] ?? '')) {
      const tagNameMatch = /^<\/?([a-zA-Z][a-zA-Z0-9-]*)/.exec(input.slice(i));
      const tagName = tagNameMatch?.[1].toLowerCase() ?? '';
      const isClosingTag = input[i + 1] === '/';
      const [tagText, afterTag] = readTag(input, i);
      result += tagText;
      i = afterTag;
      pendingSpace = false;

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

    if (pendingSpace) {
      result += ' ';
      pendingSpace = false;
    }
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
