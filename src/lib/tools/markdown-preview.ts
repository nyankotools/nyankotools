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

let turndownService: TurndownService | null = null;

/** ブラウザ環境でのみ動作（DOMParserが必要なため） */
function getTurndownService(): TurndownService {
  if (!turndownService) {
    turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
    });
  }
  return turndownService;
}

export function htmlToMarkdown(input: string): ConvertOutcome {
  try {
    const output = getTurndownService().turndown(input);
    return { success: true, output };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
