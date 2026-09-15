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
    words: trimmed === '' ? 0 : trimmed.split(/\s+/).length,
    lines: text === '' ? 0 : text.split(/\n/).length,
  };
}
