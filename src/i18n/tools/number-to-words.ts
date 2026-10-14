import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface NumberToWordsPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  britishLabel: string;
  currencyLabel: string;
  currencyDollars: string;
  currencyPounds: string;
  currencyEuros: string;
  cardinalLabel: string;
  ordinalLabel: string;
  checkLabel: string;
  readingLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** 結果が出せない行に表示する */
  unavailable: string;
  errorInvalid: string;
  errorTooLong: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const numberToWordsContent: Record<Locale, NumberToWordsPageContent> = {
  ja: {
    title: '数字→英語表記・日本語読み変換｜小切手・契約書の金額表記',
    description:
      '数字を英語の数詞表記（one hundred twenty-three）・序数（twenty-first）・小切手表記（and 50/100 dollars）と、ひらがなの日本語読みに変換する無料ツールです。英国式のandにも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '数字→英語表記・日本語読み変換（小切手・契約書用）',
    introHtml:
      '数字を入力すると、英語の数詞表記（1234 → one thousand two hundred thirty-four）、序数（first・twenty-first）、小切手や契約書に書く金額表記、ひらがなの日本語読みをまとめて表示します。カンマ区切りや全角数字も入力できます。漢数字との変換は <a href="/tools/kanji-number-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">漢数字⇔算用数字変換</a>、ローマ数字は <a href="/tools/roman-numeral-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ローマ数字変換</a> をご利用ください。',
    inputLabel: '数字',
    inputPlaceholder: '例: 1,234.56',
    sampleText: '1234.56',
    britishLabel: '英国式（100の位の後に and を入れる）',
    currencyLabel: '小切手表記の通貨',
    currencyDollars: 'dollars（ドル）',
    currencyPounds: 'pounds（ポンド）',
    currencyEuros: 'euros（ユーロ）',
    cardinalLabel: '英語の数詞（基数）',
    ordinalLabel: '英語の序数',
    checkLabel: '小切手・契約書の金額表記',
    readingLabel: '日本語読み（ひらがな）',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    unavailable: '—（この入力では表示できません）',
    errorInvalid:
      '数字として読み取れません。半角または全角の数字、カンマ、小数点、先頭のマイナスだけを入力してください。',
    errorTooLong:
      '桁数が多すぎます。整数部は36桁、小数部は30桁まで変換できます。',
    notesHeading: '注意事項',
    notes: [
      '英語は米国式の位取り（thousand・million・billion…）で、整数部は36桁（decillionの位）まで対応します。',
      '序数は0以上の整数のみ表示します。小数・負の数では表示しません。',
      '小切手表記は0以上で小数部が2桁までの数のみ表示します（端数は 50/100 のように分数で書きます）。小数部が3桁以上のとき・負の数のときは表示しません。',
      '日本語読みは一般的な読み方です。四は「よん」、七は「なな」、九は「きゅう」で表示し、「し」「しち」「く」などの読みは扱いません。',
      '契約書・小切手の書式は、金融機関や提出先の指定に従ってください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '基数と序数',
        description:
          '基数は one・two・three のように数量を表す数詞、序数は first・second・third のように順番を表す数詞です。21番目は twenty-first のように、最後の語だけが序数になります。',
      },
      {
        term: '小切手表記（and 50/100）',
        description:
          '米国の小切手では、金額を数字と英語の両方で書きます。端数のセント（小数部）は「and 50/100」のように100分の何かで書き、改ざんを防ぎます。',
      },
      {
        term: '英国式の and',
        description:
          'イギリス英語では 101 を one hundred and one のように、100の位や1000の位の後に and を入れて読みます。米国式では and を入れません（one hundred one）。',
      },
    ],
  },
  en: {
    title: 'Number to Words Converter – Check Writing & Ordinals',
    description:
      'Spell out a number in English words, ordinals and check format, plus its Japanese reading. Runs in your browser; nothing is sent to a server.',
    h1: 'Number to Words Converter (Check Writing & Japanese Reading)',
    introHtml:
      'Type a number to see it spelled out in English (1234 → one thousand two hundred thirty-four), as an ordinal (first, twenty-first), in the format used to write amounts on checks and contracts, and as a Japanese reading in hiragana. Comma-separated and full-width digits are accepted. To work with kanji numerals use the <a href="/en/tools/kanji-number-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Kanji Numeral Converter</a>, and for Roman numerals the <a href="/en/tools/roman-numeral-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Roman Numeral Converter</a>.',
    inputLabel: 'Number',
    inputPlaceholder: 'e.g. 1,234.56',
    sampleText: '1234.56',
    britishLabel: 'British style (add "and" after hundreds)',
    currencyLabel: 'Currency for check format',
    currencyDollars: 'dollars',
    currencyPounds: 'pounds',
    currencyEuros: 'euros',
    cardinalLabel: 'English words (cardinal)',
    ordinalLabel: 'English ordinal',
    checkLabel: 'Check / contract amount',
    readingLabel: 'Japanese reading (hiragana)',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    unavailable: '— (not available for this input)',
    errorInvalid:
      'This is not a number. Enter only digits (half- or full-width), commas, a decimal point and an optional leading minus sign.',
    errorTooLong:
      'The number is too long. Up to 36 integer digits and 30 decimal digits are supported.',
    notesHeading: 'Notes',
    notes: [
      'English uses the short scale (thousand, million, billion…) and supports up to 36 integer digits (decillions).',
      'Ordinals are shown only for integers of zero or more, not for decimals or negative numbers.',
      'The check format is shown only for numbers of zero or more with at most two decimal places; the fraction is written as 50/100. It is not shown for three or more decimals or for negative numbers.',
      'The Japanese reading uses the common forms: 4 is よん, 7 is なな and 9 is きゅう. Alternative readings such as し, しち and く are not produced.',
      'Follow the format required by your bank or the recipient when writing checks and contracts.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Cardinal vs. ordinal',
        description:
          'Cardinal numbers (one, two, three) express quantity; ordinal numbers (first, second, third) express position. Only the last word becomes ordinal, so 21st is twenty-first.',
      },
      {
        term: 'Check format (and 50/100)',
        description:
          'US checks show the amount in both digits and words. The cents are written as a fraction of 100, such as "and 50/100", which makes the amount harder to alter.',
      },
      {
        term: 'British "and"',
        description:
          'British English reads 101 as "one hundred and one", adding "and" after the hundreds or thousands. American English omits it ("one hundred one").',
      },
    ],
  },
};
