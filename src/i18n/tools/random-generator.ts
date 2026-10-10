import type { Locale } from '../../data/tools';

export interface RandomGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeString: string;
  modeInteger: string;
  modeDecimal: string;
  charsetLabel: string;
  lowercase: string;
  uppercase: string;
  digits: string;
  symbols: string;
  hiragana: string;
  katakana: string;
  kyoikuKanji: string;
  joyoKanji: string;
  customCharsLabel: string;
  customCharsPlaceholder: string;
  excludeSimilar: string;
  lengthLabel: string;
  minLabel: string;
  maxLabel: string;
  decimalsLabel: string;
  countLabel: string;
  unique: string;
  sort: string;
  generate: string;
  resultLabel: string;
  /** {count} を置換して表示する */
  resultSummary: string;
  copy: string;
  copied: string;
  copyFailed: string;
  emptyCharset: string;
  /** {max} を置換して表示する */
  invalidLength: string;
  /** {max} を置換して表示する */
  invalidCount: string;
  notEnoughCombinations: string;
  invalidRange: string;
  rangeTooLarge: string;
  countExceedsRange: string;
  /** {max} を置換して表示する */
  invalidDecimals: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
}

export const randomGeneratorContent: Record<
  Locale,
  RandomGeneratorPageContent
> = {
  ja: {
    title:
      'ランダム文字列・乱数生成ツール｜文字種・桁数・範囲を指定して一括生成',
    description:
      '英数字・記号・ひらがな・カタカナ・漢字などの文字種と長さ・個数を指定したランダム文字列と、範囲指定の乱数（整数・小数、重複なし）を最大1000件まとめて生成できる無料ツールです。ブラウザの暗号用乱数を使用。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ランダム文字列・乱数生成ツール',
    introHtml:
      'テスト用データやサンプルID、くじ引きの番号など、ランダムな文字列や数値を一度にまとめて作れます。英数字・ひらがな・カタカナ・漢字などの文字種を選ぶ・好きな文字だけで作る、範囲を決めて重複なしで整数を引く、といった使い方ができます。パスワードを作るなら<a href="/tools/password-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">パスワード生成</a>、一意のIDなら<a href="/tools/uuid-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">UUID生成</a>をご利用ください。',
    modeLabel: '種類',
    modeString: 'ランダム文字列',
    modeInteger: '乱数（整数）',
    modeDecimal: '乱数（小数）',
    charsetLabel: '使う文字',
    lowercase: '英小文字（a-z）',
    uppercase: '英大文字（A-Z）',
    digits: '数字（0-9）',
    symbols: '記号（!@#$ など）',
    hiragana: 'ひらがな（71字）',
    katakana: 'カタカナ（71字）',
    kyoikuKanji: '教育漢字（小学校の1026字）',
    joyoKanji: '常用漢字（2136字）',
    customCharsLabel: '追加する文字（任意）',
    customCharsPlaceholder: '例: abcdef0123456789、あいうえお',
    excludeSimilar: '紛らわしい文字（1 l I 0 O o）を除く',
    lengthLabel: '文字数',
    minLabel: '最小値',
    maxLabel: '最大値',
    decimalsLabel: '小数点以下の桁数',
    countLabel: '個数',
    unique: '重複させない',
    sort: '昇順に並べる',
    generate: '生成する',
    resultLabel: '生成結果',
    resultSummary: '{count}件を生成しました',
    copy: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    emptyCharset: '使う文字を1つ以上選ぶか、追加する文字を入力してください。',
    invalidLength: '文字数は1〜{max}の整数で入力してください。',
    invalidCount: '個数は1〜{max}の整数で入力してください。',
    notEnoughCombinations:
      'この文字種・文字数では、重複なしで作れる組み合わせの数が個数に足りません。文字数や文字種を増やすか、個数を減らしてください。',
    invalidRange:
      '最小値と最大値を、最小値 ≦ 最大値となる数値で入力してください（整数モードでは整数）。',
    rangeTooLarge:
      '範囲が広すぎます。最大値 − 最小値（小数の場合は刻みの数）が約43億以内になるようにしてください。',
    countExceedsRange:
      '重複させない場合、個数は範囲内の整数の数（最大値 − 最小値 + 1）以下にしてください。',
    invalidDecimals: '小数点以下の桁数は0〜{max}の整数で入力してください。',
    howToHeading: '使い方',
    howToSteps: [
      '「種類」で、ランダム文字列・乱数（整数）・乱数（小数）のいずれかを選びます。',
      '文字列なら使う文字と文字数、乱数なら最小値・最大値を入力し、「個数」を指定します。',
      '「生成する」を押すと、結果が1行に1件で表示されます。押すたびに新しい結果になります。',
      '「結果をコピー」で、全件を改行区切りのテキストとしてコピーできます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '乱数にはブラウザの暗号用乱数（crypto.getRandomValues）を使い、偏りが出ないようにしています。ただし、このページの結果をそのままパスワードや暗号鍵として使うことは推奨しません。パスワードには専用のパスワード生成ツールを使ってください。',
      '1回に生成できるのは最大1000件、ランダム文字列は最大256文字です。',
      'ひらがな・カタカナは清音と濁音・半濁音の71字ずつです（小書き文字・ゐ・ゑ・ヴは含みません）。漢字は、小学校で学ぶ教育漢字1026字と、常用漢字表の2136字（教育漢字を含む）から選べます。ランダムな漢字の並びが意味のある語になるとは限りません。',
      '整数・小数の範囲は、幅（最大値 − 最小値）が約43億（2の32乗）以内、小数点以下は6桁までです。小数は指定した桁数の刻みで一様に選ばれ、範囲の両端も含みます。',
      '「重複させない」は、ランダム文字列では生成した文字列どうし、整数では取り出した数値どうしが重複しないことを意味します（文字列の中の同じ文字は重複してよい）。',
      '入力した内容や生成結果はブラウザ内だけで処理し、サーバーには送信しません。',
    ],
  },
  en: {
    title: 'Random String & Number Generator – No Duplicates',
    description:
      'Generate up to 1,000 random strings from your own characters, or random integers and decimals in a range, with no duplicates. Runs in your browser.',
    h1: 'Random String & Number Generator',
    introHtml:
      'Create random strings or numbers in bulk for test data, sample IDs or raffle numbers. Pick character types or use only your own characters, or draw integers from a range without repeats. For passwords use the <a href="/en/tools/password-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Password Generator</a>; for unique IDs use the <a href="/en/tools/uuid-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">UUID Generator</a>.',
    modeLabel: 'Type',
    modeString: 'Random string',
    modeInteger: 'Random integer',
    modeDecimal: 'Random decimal',
    charsetLabel: 'Characters',
    lowercase: 'Lowercase (a-z)',
    uppercase: 'Uppercase (A-Z)',
    digits: 'Digits (0-9)',
    symbols: 'Symbols (!@#$ etc.)',
    hiragana: 'Hiragana (71)',
    katakana: 'Katakana (71)',
    kyoikuKanji: 'Kyoiku kanji (elementary school, 1,026)',
    joyoKanji: 'Joyo kanji (common use, 2,136)',
    customCharsLabel: 'Extra characters (optional)',
    customCharsPlaceholder: 'e.g. abcdef0123456789',
    excludeSimilar: 'Exclude look-alike characters (1 l I 0 O o)',
    lengthLabel: 'Length',
    minLabel: 'Minimum',
    maxLabel: 'Maximum',
    decimalsLabel: 'Decimal places',
    countLabel: 'How many',
    unique: 'No duplicates',
    sort: 'Sort ascending',
    generate: 'Generate',
    resultLabel: 'Result',
    resultSummary: 'Generated {count} item(s)',
    copy: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    emptyCharset:
      'Select at least one character type or enter extra characters.',
    invalidLength: 'Enter a whole number of characters from 1 to {max}.',
    invalidCount: 'Enter a whole number from 1 to {max} for how many.',
    notEnoughCombinations:
      'With these characters and this length, there are fewer unique combinations than the number you asked for. Use more characters, a longer length, or a smaller count.',
    invalidRange:
      'Enter numbers where the minimum is not greater than the maximum (whole numbers for integers).',
    rangeTooLarge:
      'The range is too wide. Keep (maximum − minimum), or the number of steps for decimals, within about 4.29 billion.',
    countExceedsRange:
      'Without duplicates, the count cannot exceed the number of integers in the range (maximum − minimum + 1).',
    invalidDecimals: 'Enter a whole number of decimal places from 0 to {max}.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a type: random string, random integer or random decimal.',
      'For strings, pick the characters and length; for numbers, enter the minimum and maximum. Then set how many.',
      'Press "Generate" to list the results, one per line. Each press gives a fresh result.',
      'Use "Copy result" to copy everything as newline-separated text.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Values come from your browser’s cryptographic generator (crypto.getRandomValues) without bias. Even so, do not use these results as passwords or encryption keys; use a dedicated password generator for that.',
      'You can generate up to 1,000 items at a time, and strings up to 256 characters long.',
      'Hiragana and katakana each cover the 71 basic and voiced/semi-voiced kana (no small kana, ゐ, ゑ or ヴ). Kanji can come from the 1,026 kyoiku kanji taught in Japanese elementary schools, or the 2,136 joyo kanji (which include them). Random kanji sequences do not necessarily form meaningful words.',
      'The width of an integer or decimal range (maximum − minimum) must be within about 4.29 billion (2^32), and decimals are limited to 6 places. Decimals are chosen uniformly in steps of the chosen precision, and both ends of the range can appear.',
      '"No duplicates" means the generated strings, or the drawn numbers, differ from each other (a string may still repeat a character inside itself).',
      'Your settings and results are processed only in your browser and never sent to a server.',
    ],
  },
};
