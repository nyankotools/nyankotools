export interface CharCounterResult {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
}

export function countText(text: string): CharCounterResult {
  const trimmed = text.trim();
  return {
    characters: [...text].length,
    charactersNoSpaces: [...text.replace(/\s/g, '')].length,
    words: countWords(trimmed),
    lines: text === '' ? 0 : text.split(/\n/).length,
  };
}

function countWords(trimmed: string): number {
  if (trimmed === '') return 0;

  // 日本語は単語間にスペースがないため、空白区切りでは単語数を数えられない。
  // Intl.Segmenter の単語分割を使い、日英どちらも正しくカウントする。
  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter('ja', { granularity: 'word' });
    let count = 0;
    for (const segment of segmenter.segment(trimmed)) {
      if (segment.isWordLike) count++;
    }
    return count;
  }

  return trimmed.split(/\s+/).length;
}
