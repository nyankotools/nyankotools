export type Locale = 'ja' | 'en';

interface LocalizedText {
  category: string;
  label: string;
  replacement: string;
}

export interface KishuIzonEntry {
  translations: Record<Locale, LocalizedText>;
}

type EntryTuple = [
  char: string,
  labelJa: string,
  labelEn: string,
  replacementJa: string,
  replacementEn: string,
];

function entries(
  categoryJa: string,
  categoryEn: string,
  list: EntryTuple[],
): Record<string, KishuIzonEntry> {
  const result: Record<string, KishuIzonEntry> = {};
  for (const [char, labelJa, labelEn, replacementJa, replacementEn] of list) {
    result[char] = {
      translations: {
        ja: {
          category: categoryJa,
          label: labelJa,
          replacement: replacementJa,
        },
        en: {
          category: categoryEn,
          label: labelEn,
          replacement: replacementEn,
        },
      },
    };
  }
  return result;
}

const CIRCLED_NUMBERS = entries(
  '丸数字',
  'Circled number',
  Array.from({ length: 20 }, (_, i) => {
    const char = String.fromCodePoint(0x2460 + i);
    const n = String(i + 1);
    return [char, `丸数字 ${n}`, `Circled number ${n}`, `(${n})`, `(${n})`];
  }),
);

const ROMAN_ASCII = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
];

const ROMAN_NUMERALS: Record<string, KishuIzonEntry> = {};
for (let i = 0; i < 10; i++) {
  const upper = String.fromCodePoint(0x2160 + i);
  const lower = String.fromCodePoint(0x2170 + i);
  const upperAscii = ROMAN_ASCII[i];
  const lowerAscii = upperAscii.toLowerCase();
  ROMAN_NUMERALS[upper] = {
    translations: {
      ja: {
        category: 'ローマ数字',
        label: `ローマ数字 ${i + 1}（大文字）`,
        replacement: upperAscii,
      },
      en: {
        category: 'Roman numeral',
        label: `Roman numeral ${i + 1} (uppercase)`,
        replacement: upperAscii,
      },
    },
  };
  ROMAN_NUMERALS[lower] = {
    translations: {
      ja: {
        category: 'ローマ数字',
        label: `ローマ数字 ${i + 1}（小文字）`,
        replacement: lowerAscii,
      },
      en: {
        category: 'Roman numeral',
        label: `Roman numeral ${i + 1} (lowercase)`,
        replacement: lowerAscii,
      },
    },
  };
}

const UNIT_LIGATURES = entries(
  '単位記号（組み文字）',
  'Unit symbol (ligature)',
  [
    ['㍉', '㍉（ミリ）', '㍉ (milli-)', 'ミリ', 'milli'],
    ['㌔', '㌔（キロ）', '㌔ (kilo-)', 'キロ', 'kilo'],
    ['㌢', '㌢（センチ）', '㌢ (centi-)', 'センチ', 'centi'],
    ['㍍', '㍍（メートル）', '㍍ (meter)', 'メートル', 'meter'],
    ['㌘', '㌘（グラム）', '㌘ (gram)', 'グラム', 'gram'],
    ['㌧', '㌧（トン）', '㌧ (ton)', 'トン', 'ton'],
    ['㌃', '㌃（アール）', '㌃ (are)', 'アール', 'are'],
    ['㌶', '㌶（ヘクタール）', '㌶ (hectare)', 'ヘクタール', 'hectare'],
    ['㍑', '㍑（リットル）', '㍑ (liter)', 'リットル', 'liter'],
    ['㍗', '㍗（ワット）', '㍗ (watt)', 'ワット', 'watt'],
    ['㌍', '㌍（カロリー）', '㌍ (calorie)', 'カロリー', 'calorie'],
    ['㌦', '㌦（ドル）', '㌦ (dollar)', 'ドル', 'dollar'],
    ['㌣', '㌣（セント）', '㌣ (cent)', 'セント', 'cent'],
    ['㌫', '㌫（パーセント）', '㌫ (percent)', 'パーセント', 'percent'],
    ['㍊', '㍊（ミリバール）', '㍊ (millibar)', 'ミリバール', 'millibar'],
    ['㌻', '㌻（ページ）', '㌻ (page)', 'ページ', 'page'],
  ],
);

const JIS_UNIT_LIGATURES = entries('単位記号（JIS単位）', 'Unit symbol (JIS)', [
  ['㎜', '㎜（ミリメートル）', '㎜ (millimeter)', 'mm', 'mm'],
  ['㎝', '㎝（センチメートル）', '㎝ (centimeter)', 'cm', 'cm'],
  ['㎞', '㎞（キロメートル）', '㎞ (kilometer)', 'km', 'km'],
  ['㎎', '㎎（ミリグラム）', '㎎ (milligram)', 'mg', 'mg'],
  ['㎏', '㎏（キログラム）', '㎏ (kilogram)', 'kg', 'kg'],
  ['㏄', '㏄（立方センチメートル）', '㏄ (cubic centimeter)', 'cc', 'cc'],
  ['㎡', '㎡（平方メートル）', '㎡ (square meter)', 'm2', 'm2'],
]);

const ERA_SYMBOLS = entries('元号・組み文字', 'Era name (ligature)', [
  ['㍾', '㍾（明治）', '㍾ (Meiji era)', '明治', 'Meiji'],
  ['㍽', '㍽（大正）', '㍽ (Taisho era)', '大正', 'Taisho'],
  ['㍼', '㍼（昭和）', '㍼ (Showa era)', '昭和', 'Showa'],
  ['㍻', '㍻（平成）', '㍻ (Heisei era)', '平成', 'Heisei'],
  ['㋿', '㋿（令和）', '㋿ (Reiwa era)', '令和', 'Reiwa'],
  ['㍿', '㍿（株式会社）', '㍿ (stock company)', '(株)', '(K.K.)'],
]);

const PARENTHESIZED_ABBREVIATIONS = entries(
  '丸括弧付き略号',
  'Parenthesized abbreviation',
  [
    ['㈱', '㈱（株式会社）', '㈱ (stock company)', '(株)', '(K.K.)'],
    ['㈲', '㈲（有限会社）', '㈲ (limited company)', '(有)', '(Ltd.)'],
    [
      '㈳',
      '㈳（社団法人）',
      '㈳ (incorporated association)',
      '(社)',
      '(Assoc.)',
    ],
    ['㈴', '㈴（名称）', '㈴ (name)', '(名)', '(Name)'],
    ['㈵', '㈵（特殊）', '㈵ (special)', '(特)', '(Special)'],
    ['㈶', '㈶（財団法人）', '㈶ (foundation)', '(財)', '(Foundation)'],
    ['㈷', '㈷（祝日）', '㈷ (holiday)', '(祝)', '(Holiday)'],
    ['㈸', '㈸（労働）', '㈸ (labor)', '(労)', '(Labor)'],
    ['㈹', '㈹（代表）', '㈹ (representative)', '(代)', '(Rep.)'],
    ['㈺', '㈺（呼出）', '㈺ (call)', '(呼)', '(Call)'],
    ['㈻', '㈻（学校）', '㈻ (school)', '(学)', '(School)'],
    ['㈼', '㈼（監査）', '㈼ (audit)', '(監)', '(Audit)'],
    ['㈽', '㈽（企業）', '㈽ (enterprise)', '(企)', '(Enterprise)'],
    ['㈾', '㈾（資本）', '㈾ (capital)', '(資)', '(Capital)'],
    ['㈿', '㈿（協力）', '㈿ (cooperation)', '(協)', '(Coop.)'],
    ['㉀', '㉀（祭日）', '㉀ (festival)', '(祭)', '(Festival)'],
    ['㉁', '㉁（休日）', '㉁ (day off)', '(休)', '(Off)'],
    ['㉂', '㉂（自己）', '㉂ (self)', '(自)', '(Self)'],
    ['㉃', '㉃（至）', '㉃ (to)', '(至)', '(To)'],
  ],
);

const PARENTHESIZED_NUMBERS_AND_DAYS = entries(
  '丸括弧付き数字・曜日',
  'Parenthesized number / weekday',
  [
    ['㈠', '㈠（一）', '㈠ (one)', '(一)', '(1)'],
    ['㈡', '㈡（二）', '㈡ (two)', '(二)', '(2)'],
    ['㈢', '㈢（三）', '㈢ (three)', '(三)', '(3)'],
    ['㈣', '㈣（四）', '㈣ (four)', '(四)', '(4)'],
    ['㈤', '㈤（五）', '㈤ (five)', '(五)', '(5)'],
    ['㈥', '㈥（六）', '㈥ (six)', '(六)', '(6)'],
    ['㈦', '㈦（七）', '㈦ (seven)', '(七)', '(7)'],
    ['㈧', '㈧（八）', '㈧ (eight)', '(八)', '(8)'],
    ['㈨', '㈨（九）', '㈨ (nine)', '(九)', '(9)'],
    ['㈩', '㈩（十）', '㈩ (ten)', '(十)', '(10)'],
    ['㈪', '㈪（月曜）', '㈪ (Monday)', '(月)', '(Mon)'],
    ['㈫', '㈫（火曜）', '㈫ (Tuesday)', '(火)', '(Tue)'],
    ['㈬', '㈬（水曜）', '㈬ (Wednesday)', '(水)', '(Wed)'],
    ['㈭', '㈭（木曜）', '㈭ (Thursday)', '(木)', '(Thu)'],
    ['㈮', '㈮（金曜）', '㈮ (Friday)', '(金)', '(Fri)'],
    ['㈯', '㈯（土曜）', '㈯ (Saturday)', '(土)', '(Sat)'],
    ['㈰', '㈰（日曜）', '㈰ (Sunday)', '(日)', '(Sun)'],
  ],
);

const CIRCLED_KANJI = entries('丸囲み文字', 'Circled ideograph', [
  ['㊀', '㊀（一）', '㊀ (one)', '(一)', '(1)'],
  ['㊁', '㊁（二）', '㊁ (two)', '(二)', '(2)'],
  ['㊂', '㊂（三）', '㊂ (three)', '(三)', '(3)'],
  ['㊃', '㊃（四）', '㊃ (four)', '(四)', '(4)'],
  ['㊄', '㊄（五）', '㊄ (five)', '(五)', '(5)'],
  ['㊅', '㊅（六）', '㊅ (six)', '(六)', '(6)'],
  ['㊆', '㊆（七）', '㊆ (seven)', '(七)', '(7)'],
  ['㊇', '㊇（八）', '㊇ (eight)', '(八)', '(8)'],
  ['㊈', '㊈（九）', '㊈ (nine)', '(九)', '(9)'],
  ['㊉', '㊉（十）', '㊉ (ten)', '(十)', '(10)'],
  ['㊤', '㊤（上）', '㊤ (top)', '(上)', '(Top)'],
  ['㊥', '㊥（中）', '㊥ (middle)', '(中)', '(Mid)'],
  ['㊦', '㊦（下）', '㊦ (bottom)', '(下)', '(Btm)'],
  ['㊧', '㊧（左）', '㊧ (left)', '(左)', '(Left)'],
  ['㊨', '㊨（右）', '㊨ (right)', '(右)', '(Right)'],
  ['㊙', '㊙（秘）', '㊙ (secret)', '(秘)', '(Secret)'],
  ['㊚', '㊚（男）', '㊚ (male)', '(男)', '(Male)'],
  ['㊛', '㊛（女）', '㊛ (female)', '(女)', '(Female)'],
  ['㊜', '㊜（適）', '㊜ (suitable)', '(適)', '(Suitable)'],
  ['㊝', '㊝（優）', '㊝ (excellent)', '(優)', '(Excellent)'],
  ['㊞', '㊞（印）', '㊞ (seal)', '(印)', '(Seal)'],
  ['㊟', '㊟（注）', '㊟ (note)', '(注)', '(Note)'],
  ['㊩', '㊩（医）', '㊩ (medicine)', '(医)', '(Medical)'],
  ['㊫', '㊫（学）', '㊫ (study)', '(学)', '(Study)'],
  ['㊬', '㊬（監）', '㊬ (supervise)', '(監)', '(Supervise)'],
  ['㊭', '㊭（企）', '㊭ (enterprise)', '(企)', '(Enterprise)'],
  ['㊮', '㊮（資）', '㊮ (capital)', '(資)', '(Capital)'],
  ['㊯', '㊯（協）', '㊯ (cooperation)', '(協)', '(Coop.)'],
  ['㊰', '㊰（夜）', '㊰ (night)', '(夜)', '(Night)'],
]);

const MISC_SYMBOLS = entries('その他の記号', 'Other symbol', [
  ['№', '№（ナンバー）', '№ (numero sign)', 'No.', 'No.'],
  ['℡', '℡（電話番号）', '℡ (telephone sign)', 'TEL', 'TEL'],
  ['㏍', '㏍（KK）', '㏍ (KK)', 'KK', 'KK'],
]);

const IBM_EXTENSION_KANJI = entries(
  'IBM拡張文字（代表例）',
  'IBM extension character (example)',
  [
    [
      '髙',
      '髙（はしごだか。「高」の異体字）',
      '髙 (variant of 高 "tall/high", known as "ladder-taka")',
      '高',
      '高',
    ],
    [
      '﨑',
      '﨑（たつざき。「崎」の異体字）',
      '﨑 (variant of 崎 "cape/promontory", known as "tatsu-zaki")',
      '崎',
      '崎',
    ],
  ],
);

const KISHU_IZON_TABLE: Record<string, KishuIzonEntry> = {
  ...CIRCLED_NUMBERS,
  ...ROMAN_NUMERALS,
  ...UNIT_LIGATURES,
  ...JIS_UNIT_LIGATURES,
  ...ERA_SYMBOLS,
  ...PARENTHESIZED_ABBREVIATIONS,
  ...PARENTHESIZED_NUMBERS_AND_DAYS,
  ...CIRCLED_KANJI,
  ...MISC_SYMBOLS,
  ...IBM_EXTENSION_KANJI,
};

export interface KishuIzonMatch {
  index: number;
  char: string;
  codePoint: string;
  category: string;
  label: string;
  replacement: string;
}

export interface KishuIzonSummaryItem extends KishuIzonMatch {
  count: number;
}

function toCodePointLabel(char: string): string {
  const codePoint = char.codePointAt(0) ?? 0;
  return `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`;
}

export function findKishuIzonMoji(
  text: string,
  locale: Locale = 'ja',
): KishuIzonMatch[] {
  const matches: KishuIzonMatch[] = [];
  let index = 0;
  for (const char of text) {
    const entry = KISHU_IZON_TABLE[char];
    if (entry) {
      const t = entry.translations[locale];
      matches.push({
        index,
        char,
        codePoint: toCodePointLabel(char),
        category: t.category,
        label: t.label,
        replacement: t.replacement,
      });
    }
    index += char.length;
  }
  return matches;
}

export function summarizeMatches(
  matches: KishuIzonMatch[],
): KishuIzonSummaryItem[] {
  const byChar = new Map<string, KishuIzonSummaryItem>();
  for (const match of matches) {
    const existing = byChar.get(match.char);
    if (existing) {
      existing.count += 1;
    } else {
      byChar.set(match.char, { ...match, count: 1 });
    }
  }
  return Array.from(byChar.values());
}

export function replaceKishuIzonMoji(
  text: string,
  locale: Locale = 'ja',
): string {
  let result = '';
  for (const char of text) {
    const entry = KISHU_IZON_TABLE[char];
    result += entry ? entry.translations[locale].replacement : char;
  }
  return result;
}
