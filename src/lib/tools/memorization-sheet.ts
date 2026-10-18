export interface SheetSegment {
  text: string;
  /** `**語**` で囲まれた（隠す対象の）語かどうか */
  hidden: boolean;
}

export type SheetLine = SheetSegment[];

const MARKER = '**';

/**
 * 1行を `**語**` の境界で分割する。
 * 閉じていない `**` と、中身が空の `****` はそのまま文字として扱う。
 */
export function parseLine(line: string): SheetLine {
  const segments: SheetLine = [];
  let plain = '';
  let i = 0;
  const flush = () => {
    if (plain !== '') segments.push({ text: plain, hidden: false });
    plain = '';
  };
  while (i < line.length) {
    if (line.startsWith(MARKER, i)) {
      const close = line.indexOf(MARKER, i + MARKER.length);
      const inner = close === -1 ? '' : line.slice(i + MARKER.length, close);
      if (close !== -1 && inner !== '') {
        flush();
        segments.push({ text: inner, hidden: true });
        i = close + MARKER.length;
        continue;
      }
    }
    plain += line[i];
    i += 1;
  }
  flush();
  return segments;
}

/** 入力全体を行ごとに解析する（改行は CRLF / CR / LF を区別しない） */
export function parseSheet(text: string): SheetLine[] {
  if (text === '') return [];
  return text.split(/\r\n|\r|\n/).map(parseLine);
}

/** 隠す対象の語を出現順に取り出す */
export function extractAnswers(lines: SheetLine[]): string[] {
  const answers: string[] = [];
  for (const line of lines) {
    for (const seg of line) if (seg.hidden) answers.push(seg.text);
  }
  return answers;
}

/** 選択範囲を `**…**` で囲む（すでに囲まれている場合は外す） */
export function toggleMarker(
  text: string,
  start: number,
  end: number,
): { text: string; start: number; end: number } {
  if (start === end) return { text, start, end };
  const before = text.slice(0, start);
  const selected = text.slice(start, end);
  const after = text.slice(end);
  if (before.endsWith(MARKER) && after.startsWith(MARKER)) {
    return {
      text: before.slice(0, -MARKER.length) + selected + after.slice(2),
      start: start - MARKER.length,
      end: end - MARKER.length,
    };
  }
  return {
    text: before + MARKER + selected + MARKER + after,
    start: start + MARKER.length,
    end: end + MARKER.length,
  };
}
