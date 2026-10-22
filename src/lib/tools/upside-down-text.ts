/**
 * 上下反転・鏡文字テキストのロジック。
 * 対応表で文字を置き換え、行ごとに順序を逆にする。
 * 対応表にない文字はそのまま残し、変換できなかった文字数を数える。
 */

export const upsideDownModeIds = ['upsideDown', 'mirror', 'reverse'] as const;
export type UpsideDownMode = (typeof upsideDownModeIds)[number];

function buildMap(pairs: string[], extra: Record<string, string>) {
  const map = new Map<string, string>();
  for (const pair of pairs) {
    const [from, to] = Array.from(pair);
    if (from !== undefined && to !== undefined) map.set(from, to);
  }
  for (const [from, to] of Object.entries(extra)) map.set(from, to);
  return map;
}

/** 上下反転（180度回転）の対応表。「元の1文字 + 変換後の1文字」の並び */
const UPSIDE_DOWN_MAP = buildMap(
  [
    'aɐ',
    'bq',
    'cɔ',
    'dp',
    'eǝ',
    'fɟ',
    'gƃ',
    'hɥ',
    'iᴉ',
    'jɾ',
    'kʞ',
    'll',
    'mɯ',
    'nu',
    'oo',
    'pd',
    'qb',
    'rɹ',
    'ss',
    'tʇ',
    'un',
    'vʌ',
    'wʍ',
    'xx',
    'yʎ',
    'zz',
    'A∀',
    'Bᗺ',
    'CƆ',
    'Dᗡ',
    'EƎ',
    'FℲ',
    'G⅁',
    'HH',
    'II',
    'Jſ',
    'K⋊',
    'L⅂',
    'MW',
    'NN',
    'OO',
    'PԀ',
    'QΌ',
    'Rᴚ',
    'SS',
    'T⊥',
    'U∩',
    'VΛ',
    'WM',
    'XX',
    'Y⅄',
    'ZZ',
    '00',
    '1Ɩ',
    '2ᄅ',
    '3Ɛ',
    '4ㄣ',
    '5ϛ',
    '69',
    '7ㄥ',
    '88',
    '96',
    '.˙',
    ',‘',
    '?¿',
    '!¡',
    '()',
    ')(',
    '[]',
    '][',
    '{}',
    '}{',
    '<>',
    '><',
    '_‾',
    '&⅋',
    ';؛',
    '"„',
  ],
  {},
);
UPSIDE_DOWN_MAP.set("'", ',');

/** 鏡文字（左右反転）の対応表 */
const MIRROR_MAP = buildMap(
  [
    'aɒ',
    'bd',
    'cɔ',
    'db',
    'eɘ',
    'fꟻ',
    'gǫ',
    'hʜ',
    'ii',
    'jį',
    'kʞ',
    'll',
    'mm',
    'nᴎ',
    'oo',
    'pq',
    'qp',
    'rɿ',
    'sƨ',
    'tƚ',
    'uu',
    'vv',
    'ww',
    'xx',
    'yʏ',
    'zƹ',
    'AA',
    'Bᗺ',
    'CƆ',
    'Dᗡ',
    'EƎ',
    'Fꟻ',
    'HH',
    'II',
    'JႱ',
    'K⋊',
    'L⅃',
    'MM',
    'NИ',
    'OO',
    'Pꟼ',
    'QϘ',
    'RЯ',
    'SƧ',
    'TT',
    'UU',
    'VV',
    'WW',
    'XX',
    'YY',
    'ZƸ',
    '00',
    '11',
    '3Ɛ',
    '88',
    '()',
    ')(',
    '[]',
    '][',
    '{}',
    '}{',
    '<>',
    '><',
    '/\\',
    '\\/',
    '?⸮',
    '!!',
    '..',
    ',,',
    '__',
    '--',
    '::',
    '||',
    '**',
    '++',
    '==',
  ],
  {},
);

const segmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;

function graphemes(text: string): string[] {
  if (segmenter) return Array.from(segmenter.segment(text), (s) => s.segment);
  return Array.from(text);
}

export interface UpsideDownResult {
  output: string;
  /** 対応表で変換できた文字数（空白・改行を除く） */
  converted: number;
  /** 対応表になく、そのまま残した文字数（空白・改行を除く） */
  unconverted: number;
}

/** 指定した方式でテキストを変換する（行ごとに逆順にする） */
export function transform(
  text: string,
  mode: UpsideDownMode,
): UpsideDownResult {
  const map =
    mode === 'upsideDown'
      ? UPSIDE_DOWN_MAP
      : mode === 'mirror'
        ? MIRROR_MAP
        : null;
  let converted = 0;
  let unconverted = 0;
  const output = text
    .split(/\r?\n/)
    .map((line) =>
      graphemes(line)
        .map((g) => {
          if (!map) return g;
          if (/^\s+$/.test(g)) return g;
          const mapped = map.get(g);
          if (mapped === undefined) {
            unconverted++;
            return g;
          }
          converted++;
          return mapped;
        })
        .reverse()
        .join(''),
    )
    .join('\n');
  return { output, converted, unconverted };
}
