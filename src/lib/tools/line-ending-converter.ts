export type LineEnding = 'lf' | 'crlf' | 'cr';

export interface LineEndingStats {
  lf: number;
  crlf: number;
  cr: number;
}

const LINE_ENDING_CHARS: Record<LineEnding, string> = {
  lf: '\n',
  crlf: '\r\n',
  cr: '\r',
};

/** テキスト中に含まれる各改行コードの出現数を数える（CRLFはCR/LF単体としては二重にカウントしない） */
export function countLineEndings(text: string): LineEndingStats {
  const stats: LineEndingStats = { lf: 0, crlf: 0, cr: 0 };
  const matches = text.match(/\r\n|\r|\n/g) ?? [];
  for (const match of matches) {
    if (match === '\r\n') stats.crlf++;
    else if (match === '\r') stats.cr++;
    else stats.lf++;
  }
  return stats;
}

/** 改行コードを指定した種類に統一する */
export function convertLineEndings(text: string, target: LineEnding): string {
  const normalized = text.replace(/\r\n|\r/g, '\n');
  if (target === 'lf') return normalized;
  return normalized.replace(/\n/g, LINE_ENDING_CHARS[target]);
}
