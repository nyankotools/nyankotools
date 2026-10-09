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

export const X_DEFAULT_LIMIT = 280;
const X_URL_WEIGHT = 23;

export interface XCountResult {
  /** X方式の重み付き文字数（半角=1、全角・絵文字=2、URL=23） */
  weighted: number;
  /** 上限までの残り（超過時は負の値） */
  remaining: number;
  overLimit: boolean;
}

// URL（ASCIIのURL文字のみ。直後に続く日本語などは含めず、末尾の句読点・閉じ括弧も除く）と、
// ZWJ・異体字セレクタ・肌色修飾でつながった絵文字を1塊として拾う。
// ©や®のような「絵文字にもなる記号」は、絵文字表示（Emoji_Presentation または U+FE0F 付き）のときだけ絵文字扱い
const X_TOKEN_PATTERN = new RegExp(
  String.raw`(https?:\/\/[A-Za-z0-9\-._~:/?#\[\]@!$&'()*+,;=%]*[A-Za-z0-9\-_~/#@$&*+=%])` +
    String.raw`|([0-9#*]️?⃣|(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}️)(?:️|\p{Emoji_Modifier}|‍(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}))*)`,
  'giu',
);

// Xの文字数カウント（twitter-text）で重み1となるコードポイント範囲。これ以外は重み2
function codePointWeight(cp: number): number {
  if (
    cp <= 0x10ff ||
    (cp >= 0x2000 && cp <= 0x200d) ||
    (cp >= 0x2010 && cp <= 0x201f) ||
    (cp >= 0x2032 && cp <= 0x2037)
  ) {
    return 1;
  }
  return 2;
}

function plainWeight(text: string): number {
  let sum = 0;
  for (const ch of text) sum += codePointWeight(ch.codePointAt(0)!);
  return sum;
}

/** X（旧Twitter）の重み付け方式で文字数を数え、上限との差を返す */
export function countXWeighted(
  text: string,
  limit: number = X_DEFAULT_LIMIT,
): XCountResult {
  const normalized = text.normalize('NFC');
  let weighted = 0;
  let last = 0;
  for (const m of normalized.matchAll(X_TOKEN_PATTERN)) {
    weighted += plainWeight(normalized.slice(last, m.index));
    weighted += m[1] ? X_URL_WEIGHT : 2;
    last = m.index + m[0].length;
  }
  weighted += plainWeight(normalized.slice(last));
  return { weighted, remaining: limit - weighted, overLimit: weighted > limit };
}
