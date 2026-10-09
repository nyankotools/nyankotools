import { marked } from 'marked';
import TurndownService from 'turndown';

export interface ConvertSuccess {
  success: true;
  output: string;
}

export interface ConvertFailure {
  success: false;
  message: string;
}

export type ConvertOutcome = ConvertSuccess | ConvertFailure;

marked.setOptions({ gfm: true, breaks: false, pedantic: false });

export function markdownToHtml(input: string): ConvertOutcome {
  try {
    const output = marked.parse(input, { async: false });
    return { success: true, output };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export interface HtmlToMarkdownOptions {
  headingStyle: 'atx' | 'setext';
  bulletMarker: '-' | '*' | '+';
  codeBlockStyle: 'fenced' | 'indented';
  removeImages: boolean;
  removeLinks: boolean;
}

export const defaultOptions: HtmlToMarkdownOptions = {
  headingStyle: 'atx',
  bulletMarker: '-',
  codeBlockStyle: 'fenced',
  removeImages: false,
  removeLinks: false,
};

/** 表セルの内容をMarkdownの表セルに入れられる1行の文字列にする */
function cellText(cell: Element): string {
  return (cell.textContent ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|');
}

function tableToMarkdown(table: Element): string {
  const rows = Array.from(table.querySelectorAll('tr')).map((tr) =>
    Array.from(tr.children)
      .filter((c) => c.tagName === 'TH' || c.tagName === 'TD')
      .map(cellText),
  );
  const filled = rows.filter((row) => row.length > 0);
  if (filled.length === 0) return '';
  const width = Math.max(...filled.map((row) => row.length));
  const line = (row: string[]) =>
    `| ${Array.from({ length: width }, (_, i) => row[i] ?? '').join(' | ')} |`;
  const separator = `| ${Array.from({ length: width }, () => '---').join(' | ')} |`;
  return `\n\n${[line(filled[0]), separator, ...filled.slice(1).map(line)].join('\n')}\n\n`;
}

/** ブラウザ環境（またはdominoが使えるNode）で動作する */
function createService(options: HtmlToMarkdownOptions): TurndownService {
  const service = new TurndownService({
    headingStyle: options.headingStyle,
    bulletListMarker: options.bulletMarker,
    codeBlockStyle: options.codeBlockStyle,
    hr: '---',
    emDelimiter: '*',
  });
  service.remove(['script', 'style', 'noscript', 'template']);
  service.addRule('table', {
    filter: 'table',
    replacement: (_content, node) => tableToMarkdown(node as Element),
  });
  service.addRule('strikethrough', {
    filter: ['del', 's', 'strike'] as (keyof HTMLElementTagNameMap)[],
    replacement: (content) => (content ? `~~${content}~~` : ''),
  });
  if (options.removeImages) {
    service.addRule('removeImages', { filter: 'img', replacement: () => '' });
  }
  if (options.removeLinks) {
    service.addRule('removeLinks', {
      filter: 'a',
      replacement: (content) => content,
    });
  }
  return service;
}

export function htmlToMarkdown(
  input: string,
  options: HtmlToMarkdownOptions = defaultOptions,
): ConvertOutcome {
  try {
    return { success: true, output: createService(options).turndown(input) };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
