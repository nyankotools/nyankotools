export type RubyToken =
  { type: 'text'; text: string } | { type: 'ruby'; base: string; rt: string };

export interface RubyHtmlOptions {
  /** <rp>（括弧）を出力する */
  rp: boolean;
  /** 改行を <br> に変換する */
  br: boolean;
}

export interface RubyParseResult {
  tokens: RubyToken[];
  rubyCount: number;
}

// 1: ｜親文字《ルビ》形式 / 3: 漢字《ルビ》形式（直前の漢字の連続が親文字）
const RUBY_PATTERN =
  /[｜|]([^｜|《》\n]+)《([^《》\n]+)》|([\p{Script=Han}々〆ヶ]+)《([^《》\n]+)》/gu;

/** 青空文庫風の記法を解析し、テキストとルビのトークン列にする */
export function parseRuby(input: string): RubyParseResult {
  const tokens: RubyToken[] = [];
  let rubyCount = 0;
  let last = 0;
  for (const m of input.matchAll(RUBY_PATTERN)) {
    const index = m.index ?? 0;
    if (index > last) {
      tokens.push({ type: 'text', text: input.slice(last, index) });
    }
    const base = m[1] ?? m[3] ?? '';
    const rt = (m[2] ?? m[4] ?? '').trim();
    if (rt === '') {
      tokens.push({ type: 'text', text: m[0] });
    } else {
      tokens.push({ type: 'ruby', base, rt });
      rubyCount += 1;
    }
    last = index + m[0].length;
  }
  if (last < input.length) {
    tokens.push({ type: 'text', text: input.slice(last) });
  }
  return { tokens, rubyCount };
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** トークン列から <ruby> を含むHTML文字列を生成する（テキストは必ずエスケープ） */
export function buildRubyHtml(
  tokens: RubyToken[],
  options: RubyHtmlOptions,
): string {
  return tokens
    .map((token) => {
      if (token.type === 'text') {
        const escaped = escapeHtml(token.text);
        return options.br ? escaped.replace(/\r?\n/g, '<br>\n') : escaped;
      }
      const base = escapeHtml(token.base);
      const rt = escapeHtml(token.rt);
      return options.rp
        ? `<ruby>${base}<rp>(</rp><rt>${rt}</rt><rp>)</rp></ruby>`
        : `<ruby>${base}<rt>${rt}</rt></ruby>`;
    })
    .join('');
}

export function generateRubyHtml(
  input: string,
  options: RubyHtmlOptions,
): { html: string; rubyCount: number; tokens: RubyToken[] } {
  const { tokens, rubyCount } = parseRuby(input);
  return { html: buildRubyHtml(tokens, options), rubyCount, tokens };
}
