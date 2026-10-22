export type TocStyle = 'bullet' | 'number';

export interface MarkdownHeading {
  /** 見出しレベル（1〜6） */
  level: number;
  /** インライン装飾を除去した表示用テキスト */
  text: string;
  /** GitHub形式のアンカー（重複は -1, -2 … を付与） */
  anchor: string;
  /** 元の行番号（1始まり） */
  line: number;
}

export interface TocOptions {
  minLevel: number;
  maxLevel: number;
  style: TocStyle;
  /** 1段ごとのインデント幅（スペース数）。番号付きは最低3 */
  indent: number;
  /** false のときはリンクにせず見出しテキストのみ */
  links: boolean;
}

export const defaultTocOptions: TocOptions = {
  minLevel: 1,
  maxLevel: 3,
  style: 'bullet',
  indent: 2,
  links: true,
};

/** 見出しテキストからインライン装飾を取り除く */
export function stripInlineMarkdown(raw: string): string {
  let s = raw;
  // 画像・リンク・参照リンク
  s = s.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');
  s = s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  s = s.replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1');
  // インラインコード
  s = s.replace(/(`+)(.+?)\1/g, '$2');
  // HTMLタグ
  s = s.replace(/<\/?[A-Za-z][^>]*>/g, '');
  // 強調・取り消し線
  s = s.replace(/(\*\*|__)(?=\S)(.+?)(?<=\S)\1/g, '$2');
  s = s.replace(/~~(?=\S)(.+?)(?<=\S)~~/g, '$1');
  s = s.replace(/\*(?=\S)(.+?)(?<=\S)\*/g, '$1');
  s = s.replace(
    /(^|[^\p{L}\p{N}_])_(?=\S)(.+?)(?<=\S)_(?![\p{L}\p{N}_])/gu,
    '$1$2',
  );
  // バックスラッシュエスケープ
  s = s.replace(/\\([!-/:-@[-`{-~])/g, '$1');
  return s.replace(/\s+/g, ' ').trim();
}

/** GitHub形式のアンカー（重複処理前） */
export function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, '')
    .replace(/ /g, '-');
}

const ATX = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?[ \t]*$/;
const FENCE = /^ {0,3}(`{3,}|~{3,})/;
const SETEXT_1 = /^ {0,3}=+[ \t]*$/;
const SETEXT_2 = /^ {0,3}-+[ \t]*$/;
const NON_PARAGRAPH_START =
  /^(?: {4,}|\t|>|\s*(?:[-+*]|\d{1,9}[.)])(?:\s|$)|<)/;

/** Markdown本文から見出しを抽出する（コードブロック・フロントマターは除外） */
export function extractHeadings(markdown: string): MarkdownHeading[] {
  const lines = markdown.split(/\r\n|\r|\n/);
  const found: { level: number; raw: string; line: number }[] = [];
  let start = 0;

  if (lines[0]?.trim() === '---') {
    for (let i = 1; i < lines.length; i++) {
      const t = lines[i].trim();
      if (t === '---' || t === '...') {
        start = i + 1;
        break;
      }
    }
  }

  let fence: { char: string; length: number } | null = null;
  let paragraph: string[] = [];
  let paragraphStart = 0;

  for (let i = start; i < lines.length; i++) {
    const line = lines[i];

    if (fence) {
      const close = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/);
      if (
        close &&
        close[1][0] === fence.char &&
        close[1].length >= fence.length
      ) {
        fence = null;
      }
      continue;
    }

    const open = line.match(FENCE);
    if (open) {
      fence = { char: open[1][0], length: open[1].length };
      paragraph = [];
      continue;
    }

    if (line.trim() === '') {
      paragraph = [];
      continue;
    }

    const atx = line.match(ATX);
    if (atx) {
      const raw = (atx[2] ?? '').replace(/(?:^|[ \t]+)#+[ \t]*$/, '').trim();
      found.push({ level: atx[1].length, raw, line: i + 1 });
      paragraph = [];
      continue;
    }

    if (paragraph.length > 0) {
      const underline1 = SETEXT_1.test(line);
      const underline2 = SETEXT_2.test(line);
      if (underline1 || underline2) {
        found.push({
          level: underline1 ? 1 : 2,
          raw: paragraph.join(' '),
          line: paragraphStart + 1,
        });
        paragraph = [];
        continue;
      }
    }

    if (NON_PARAGRAPH_START.test(line)) {
      paragraph = [];
      continue;
    }
    if (paragraph.length === 0) paragraphStart = i;
    paragraph.push(line.trim());
  }

  const used = new Set<string>();
  const next = new Map<string, number>();
  const headings: MarkdownHeading[] = [];
  for (const h of found) {
    const text = stripInlineMarkdown(h.raw);
    if (text === '') continue;
    const base = slugifyHeading(text);
    let n = next.get(base) ?? 0;
    let anchor = n === 0 ? base : `${base}-${n}`;
    while (used.has(anchor)) {
      n++;
      anchor = `${base}-${n}`;
    }
    used.add(anchor);
    next.set(base, n + 1);
    headings.push({ level: h.level, text, anchor, line: h.line });
  }
  return headings;
}

function escapeLinkText(text: string): string {
  return text.replace(/([[\]\\])/g, '\\$1');
}

export interface TocResult {
  headings: MarkdownHeading[];
  /** 目次に含めた見出し数 */
  included: number;
  markdown: string;
}

/** 見出し一覧から目次のMarkdownを組み立てる */
export function buildToc(
  headings: MarkdownHeading[],
  options: TocOptions,
): TocResult {
  const min = Math.min(options.minLevel, options.maxLevel);
  const max = Math.max(options.minLevel, options.maxLevel);
  const targets = headings.filter((h) => h.level >= min && h.level <= max);
  const unit =
    options.style === 'number' ? Math.max(options.indent, 3) : options.indent;

  const stack: number[] = []; // 各深さのレベル
  const counters: number[] = [];
  const out: string[] = [];

  for (const h of targets) {
    while (stack.length > 0 && stack[stack.length - 1] >= h.level) {
      stack.pop();
    }
    const depth = stack.length;
    stack.push(h.level);
    counters.length = depth + 1;
    counters[depth] = (counters[depth] ?? 0) + 1;

    const label = options.links
      ? `[${escapeLinkText(h.text)}](#${h.anchor})`
      : h.text;
    const marker = options.style === 'number' ? `${counters[depth]}.` : '-';
    out.push(`${' '.repeat(unit * depth)}${marker} ${label}`);
  }

  return {
    headings,
    included: targets.length,
    markdown: out.join('\n'),
  };
}

export function generateToc(
  markdown: string,
  options: TocOptions = defaultTocOptions,
): TocResult {
  return buildToc(extractHeadings(markdown), options);
}
