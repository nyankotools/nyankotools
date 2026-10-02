export type KanaScript = 'hiragana' | 'katakana';
export type RomajiStyle = 'hepburn' | 'kunrei';
/** ー（長音符）のローマ字表記。macron: ā / double: aa / dash: a- / omit: a */
export type LongVowelStyle = 'macron' | 'double' | 'dash' | 'omit';
export type RomajiCase = 'lower' | 'capitalize' | 'upper';

export interface RomajiToKanaOptions {
  script: KanaScript;
}

export interface KanaToRomajiOptions {
  style: RomajiStyle;
  longVowel: LongVowelStyle;
  letterCase: RomajiCase;
}

// ---------------------------------------------------------------------------
// ローマ字 → かな
// ---------------------------------------------------------------------------

function pairs(source: string): [string, string][] {
  const tokens = source.split(' ').filter(Boolean);
  const result: [string, string][] = [];
  for (let i = 0; i < tokens.length; i += 2) {
    result.push([tokens[i], tokens[i + 1]]);
  }
  return result;
}

const ROMAJI_TABLE: Record<string, string> = {};

function register(entries: [string, string][]) {
  for (const [romaji, kana] of entries) ROMAJI_TABLE[romaji] = kana;
}

register(
  pairs(
    'a あ i い u う e え o お ' +
      'ka か ki き ku く ke け ko こ ga が gi ぎ gu ぐ ge げ go ご ' +
      'sa さ si し shi し su す se せ so そ za ざ zi じ ji じ zu ず ze ぜ zo ぞ ' +
      'ta た ti ち chi ち tu つ tsu つ te て to と da だ di ぢ du づ de で do ど ' +
      'na な ni に nu ぬ ne ね no の ha は hi ひ hu ふ fu ふ he へ ho ほ ' +
      'ba ば bi び bu ぶ be べ bo ぼ pa ぱ pi ぴ pu ぷ pe ぺ po ぽ ' +
      'ma ま mi み mu む me め mo も ya や yu ゆ yo よ ye いぇ ' +
      'ra ら ri り ru る re れ ro ろ wa わ wo を wi うぃ we うぇ wu う ' +
      'xa ぁ xi ぃ xu ぅ xe ぇ xo ぉ la ぁ li ぃ lu ぅ le ぇ lo ぉ ' +
      'xya ゃ xyu ゅ xyo ょ lya ゃ lyu ゅ lyo ょ ' +
      'xtu っ ltu っ xtsu っ ltsu っ xwa ゎ lwa ゎ ' +
      'vu ゔ va ゔぁ vi ゔぃ ve ゔぇ vo ゔぉ vyu ゔゅ ' +
      'fa ふぁ fi ふぃ fe ふぇ fo ふぉ fya ふゃ fyu ふゅ fyo ふょ ' +
      'tsa つぁ tsi つぃ tse つぇ tso つぉ ' +
      'tha てゃ thi てぃ thu てゅ the てぇ tho てょ ' +
      'dha でゃ dhi でぃ dhu でゅ dhe でぇ dho でょ twu とぅ dwu どぅ ' +
      'kwa くぁ kwi くぃ kwe くぇ kwo くぉ gwa ぐぁ gwi ぐぃ gwe ぐぇ gwo ぐぉ',
  ),
);

const SMALL_Y: [string, string][] = [
  ['a', 'ゃ'],
  ['u', 'ゅ'],
  ['o', 'ょ'],
  ['e', 'ぇ'],
  ['i', 'ぃ'],
];

// 子音＋y＋母音（kya, sya, tya …）
const YOON_BASES: [string, string][] = [
  ['k', 'き'],
  ['g', 'ぎ'],
  ['s', 'し'],
  ['z', 'じ'],
  ['j', 'じ'],
  ['t', 'ち'],
  ['c', 'ち'],
  ['d', 'ぢ'],
  ['n', 'に'],
  ['h', 'ひ'],
  ['b', 'び'],
  ['p', 'ぴ'],
  ['m', 'み'],
  ['r', 'り'],
];
for (const [consonant, kana] of YOON_BASES) {
  for (const [vowel, small] of SMALL_Y) {
    ROMAJI_TABLE[`${consonant}y${vowel}`] = kana + small;
  }
}

// sh / ch / j ＋母音（sha, cha, ja …）
for (const [prefix, kana] of [
  ['sh', 'し'],
  ['ch', 'ち'],
  ['j', 'じ'],
] as const) {
  for (const [vowel, small] of SMALL_Y) {
    if (vowel === 'i') continue;
    ROMAJI_TABLE[`${prefix}${vowel}`] = kana + small;
  }
}
ROMAJI_TABLE['she'] = 'しぇ';
ROMAJI_TABLE['che'] = 'ちぇ';
ROMAJI_TABLE['je'] = 'じぇ';
ROMAJI_TABLE['-'] = 'ー';

const VOWEL_CHARS = 'aiueo';
// マクロン展開で、そのまま出力する部分を囲む私用領域の文字
const DIRECT_OPEN = '';
const DIRECT_CLOSE = '';
const MACRON_TO_VOWEL: Record<string, string> = {
  ā: 'a',
  â: 'a',
  ī: 'i',
  î: 'i',
  ū: 'u',
  û: 'u',
  ē: 'e',
  ê: 'e',
  ō: 'o',
  ô: 'o',
};
const HIRAGANA_LONG: Record<string, string> = {
  a: 'あ',
  i: 'い',
  u: 'う',
  e: 'え',
  o: 'う',
};

function expandMacrons(input: string, script: KanaScript): string {
  return input.replace(/[āâīîūûēêōôĀÂĪÎŪÛĒÊŌÔ]/g, (ch) => {
    const vowel = MACRON_TO_VOWEL[ch.toLowerCase()];
    if (script === 'katakana') return `${vowel}-`;
    return `${vowel}${DIRECT_OPEN}${HIRAGANA_LONG[vowel]}${DIRECT_CLOSE}`;
  });
}

function toKatakana(hiragana: string): string {
  let result = '';
  for (const ch of hiragana) {
    const code = ch.charCodeAt(0);
    result +=
      code >= 0x3041 && code <= 0x3096 ? String.fromCharCode(code + 0x60) : ch;
  }
  return result;
}

function isLowerLetter(ch: string | undefined): boolean {
  return ch !== undefined && ch >= 'a' && ch <= 'z';
}

/**
 * ローマ字（ヘボン式・訓令式・日本式の入力）をかなに変換する。
 * IME のローマ字入力に準じ、nn・n'・促音（kk）・長音（-）・ā などのマクロン付き母音に対応する。
 * 変換できない文字（漢字・数字・記号・未対応の綴り）はそのまま残す。
 */
export function romajiToKana(
  input: string,
  options: RomajiToKanaOptions,
): string {
  // マクロン付き母音は「母音＋ひらがなの長音」に展開する
  const text = expandMacrons(input, options.script);
  const lower = text.replace(/[A-Z]/g, (c) => c.toLowerCase());
  const emit = (hiragana: string) =>
    options.script === 'katakana' ? toKatakana(hiragana) : hiragana;

  let out = '';
  let i = 0;
  while (i < lower.length) {
    const ch = lower[i];

    // 展開済みの直接出力
    if (ch === DIRECT_OPEN) {
      const end = lower.indexOf(DIRECT_CLOSE, i);
      if (end > i) {
        out += lower.slice(i + 1, end);
        i = end + 1;
        continue;
      }
    }

    // ヘボン式の撥音 m（shimbun, kampai）
    if (ch === 'm' && (lower[i + 1] === 'b' || lower[i + 1] === 'p')) {
      out += emit('ん');
      i += 1;
      continue;
    }

    if (ch === 'n') {
      const next = lower[i + 1];
      if (next === undefined) {
        out += emit('ん');
        i += 1;
        continue;
      }
      if (next === "'" || next === '’') {
        out += emit('ん');
        i += 2;
        continue;
      }
      if (next === 'n') {
        const after = lower[i + 2];
        const startsSyllable =
          after !== undefined && (VOWEL_CHARS.includes(after) || after === 'y');
        out += emit('ん');
        i += startsSyllable ? 1 : 2;
        continue;
      }
      if (!(VOWEL_CHARS.includes(next) || next === 'y')) {
        out += emit('ん');
        i += 1;
        continue;
      }
    }

    // 促音: 同じ子音の連続（kk, ss, tt …）と tch
    if (isLowerLetter(ch) && !VOWEL_CHARS.includes(ch) && ch !== 'n') {
      if (
        lower[i + 1] === ch ||
        (ch === 't' && lower.startsWith('ch', i + 1))
      ) {
        out += emit('っ');
        i += 1;
        continue;
      }
    }

    let matched = false;
    for (let len = 4; len >= 1; len--) {
      const kana = ROMAJI_TABLE[lower.slice(i, i + len)];
      if (kana !== undefined) {
        // 「-」は直前がかなのときだけ長音符にする（e-mail の英字間などのハイフンを壊さない）
        if (len === 1 && ch === '-' && !/[ぁ-ヿ]$/.test(out)) {
          break;
        }
        out += emit(kana);
        i += len;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    out += text[i];
    i += 1;
  }
  return out;
}

// ---------------------------------------------------------------------------
// かな → ローマ字
// ---------------------------------------------------------------------------

interface MonoEntry {
  hepburn: string;
  kunrei: string;
}

const MONO: Record<string, MonoEntry> = {};
for (const item of (
  'あ:a い:i う:u え:e お:o か:ka き:ki く:ku け:ke こ:ko が:ga ぎ:gi ぐ:gu げ:ge ご:go ' +
  'さ:sa し:shi:si す:su せ:se そ:so ざ:za じ:ji:zi ず:zu ぜ:ze ぞ:zo ' +
  'た:ta ち:chi:ti つ:tsu:tu て:te と:to だ:da ぢ:ji:zi づ:zu で:de ど:do ' +
  'な:na に:ni ぬ:nu ね:ne の:no は:ha ひ:hi ふ:fu:hu へ:he ほ:ho ' +
  'ば:ba び:bi ぶ:bu べ:be ぼ:bo ぱ:pa ぴ:pi ぷ:pu ぺ:pe ぽ:po ' +
  'ま:ma み:mi む:mu め:me も:mo や:ya ゆ:yu よ:yo ら:ra り:ri る:ru れ:re ろ:ro ' +
  'わ:wa ゐ:i ゑ:e を:o ゔ:vu ぁ:a ぃ:i ぅ:u ぇ:e ぉ:o ゎ:wa ゕ:ka ゖ:ke ' +
  'ゃ:ya ゅ:yu ょ:yo'
).split(' ')) {
  const [kana, hepburn, kunrei] = item.split(':');
  MONO[kana] = { hepburn, kunrei: kunrei ?? hepburn };
}

/** 「か名＋小書き」の外来音などの組み合わせ（ヘボン式・訓令式で共通の綴り） */
const COMBO: Record<string, string> = {};
for (const [kana, romaji] of pairs(
  'うぃ wi うぇ we うぉ wo ゔぁ va ゔぃ vi ゔぇ ve ゔぉ vo ゔゅ vyu ' +
    'ふぁ fa ふぃ fi ふぇ fe ふぉ fo ふゃ fya ふゅ fyu ふょ fyo ' +
    'てぃ ti でぃ di てゅ tyu でゅ dyu とぅ tu どぅ du ' +
    'しぇ she じぇ je ちぇ che つぁ tsa つぃ tsi つぇ tse つぉ tso ' +
    'くぁ kwa くぃ kwi くぇ kwe くぉ kwo ぐぁ gwa いぇ ye きぇ kye',
)) {
  COMBO[kana] = romaji;
}

const I_ROW = new Set('きしちにひみりぎじぢびぴ');
const SMALL_YOON: Record<string, string> = { ゃ: 'a', ゅ: 'u', ょ: 'o' };

type Unit =
  | { kind: 'syl'; r: string }
  | { kind: 'n' }
  | { kind: 'sokuon' }
  | { kind: 'long' }
  | { kind: 'raw'; r: string };

function toHiraganaChar(ch: string): string {
  const code = ch.charCodeAt(0);
  return code >= 0x30a1 && code <= 0x30f6
    ? String.fromCharCode(code - 0x60)
    : ch;
}

function tokenizeKana(input: string, style: RomajiStyle): Unit[] {
  const chars = Array.from(input, toHiraganaChar);
  const units: Unit[] = [];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const next = chars[i + 1];

    if (ch === 'ん') {
      units.push({ kind: 'n' });
      continue;
    }
    if (ch === 'っ') {
      units.push({ kind: 'sokuon' });
      continue;
    }
    if (ch === 'ー') {
      units.push({ kind: 'long' });
      continue;
    }

    const mono = MONO[ch];
    if (mono === undefined) {
      units.push({ kind: 'raw', r: ch });
      continue;
    }
    const base = style === 'hepburn' ? mono.hepburn : mono.kunrei;

    if (next !== undefined) {
      const combo = COMBO[ch + next];
      if (combo !== undefined) {
        units.push({ kind: 'syl', r: combo });
        i += 1;
        continue;
      }
      const small = SMALL_YOON[next];
      if (small !== undefined && I_ROW.has(ch)) {
        const stem = base.slice(0, -1);
        const needsY = !(
          style === 'hepburn' &&
          (stem === 'sh' || stem === 'ch' || stem === 'j')
        );
        units.push({ kind: 'syl', r: stem + (needsY ? 'y' : '') + small });
        i += 1;
        continue;
      }
    }
    units.push({ kind: 'syl', r: base });
  }
  return units;
}

const MACRON: Record<string, string> = {
  a: 'ā',
  i: 'ī',
  u: 'ū',
  e: 'ē',
  o: 'ō',
};

function applyCase(text: string, letterCase: RomajiCase): string {
  if (letterCase === 'upper') return text.toUpperCase();
  if (letterCase === 'capitalize') {
    return text.replace(
      /(^|[^\p{L}'])(\p{L})/gu,
      (_, before: string, letter: string) => before + letter.toUpperCase(),
    );
  }
  return text;
}

/**
 * ひらがな・カタカナをローマ字に変換する。
 * かな以外の文字（漢字・英数字・記号）はそのまま残す。
 */
export function kanaToRomaji(
  input: string,
  options: KanaToRomajiOptions,
): string {
  const units = tokenizeKana(input, options.style);
  const out: Exclude<Unit, { kind: 'sokuon' | 'long' }>[] = [];
  let pendingSokuon = false;

  for (const unit of units) {
    if (unit.kind === 'sokuon') {
      pendingSokuon = true;
      continue;
    }
    if (unit.kind === 'long') {
      const prev = out[out.length - 1];
      const vowel =
        prev?.kind === 'syl' ? prev.r[prev.r.length - 1] : undefined;
      if (prev?.kind === 'syl' && vowel !== undefined && vowel in MACRON) {
        if (options.longVowel === 'macron') {
          prev.r = prev.r.slice(0, -1) + MACRON[vowel];
        } else if (options.longVowel === 'double') {
          prev.r += vowel;
        } else if (options.longVowel === 'dash') {
          prev.r += '-';
        }
      } else {
        out.push({ kind: 'raw', r: '-' });
      }
      continue;
    }
    if (pendingSokuon) {
      pendingSokuon = false;
      if (unit.kind === 'syl' && !VOWEL_CHARS.includes(unit.r[0])) {
        unit.r = (unit.r.startsWith('ch') ? 't' : unit.r[0]) + unit.r;
      } else {
        out.push({ kind: 'raw', r: 't' });
      }
    }
    out.push(unit);
  }
  if (pendingSokuon) out.push({ kind: 'raw', r: 't' });

  let result = '';
  out.forEach((unit, index) => {
    if (unit.kind === 'n') {
      const next = out[index + 1];
      result += next?.kind === 'syl' && /^[aiueoy]/.test(next.r) ? "n'" : 'n';
    } else {
      result += unit.r;
    }
  });
  return applyCase(result, options.letterCase);
}
