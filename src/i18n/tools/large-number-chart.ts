import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface LargeNumberChartPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  inputHint: string;
  resultHeading: string;
  commasLabel: string;
  shortLabel: string;
  jaLabel: string;
  scientificLabel: string;
  digitsLabel: string;
  digitsUnit: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  errorInvalid: string;
  errorFraction: string;
  errorTooLarge: string;
  /** 範囲外で表せない項目の表示 */
  notAvailable: string;
  chartHeading: string;
  chartIntro: string;
  columnPower: string;
  columnCommas: string;
  columnShort: string;
  columnShortName: string;
  columnJa: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const largeNumberChartContent: Record<
  Locale,
  LargeNumberChartPageContent
> = {
  ja: {
    title:
      '大きな数の早見表（K・M・B・T表記と万・億・兆の相互変換・カンマ区切り）',
    description:
      'インクリメンタルゲーム（放置ゲーム）でよく使う大きな数の早見表。10の3乗〜68乗を、3桁カンマ区切り・K/M/B/T/Qa…表記・万/億/兆/京/垓…表記で一覧にし、入力した数も同時に変換します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '大きな数の早見表（K・M・億・兆）',
    introHtml:
      '放置ゲーム（インクリメンタルゲーム）で出てくる「1.5Qa」や「3垓」といった大きな数を、3桁カンマ区切り・K/M/B/T表記・万/億/兆表記・指数表記で見比べられる早見表です。数値を入力すると4つの表記を同時に表示します。「1.5M」「3億」「2億3000万」「1e50」のような入力にも対応しています。進数の変換は <a href="/tools/base-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">進数変換ツール</a> をご利用ください。',
    inputLabel: '数値を入力',
    inputPlaceholder: '例: 1234567890、1.5M、3億、2億3000万、1e50',
    inputHint:
      '整数（カンマ区切り可）、指数（1e50）、英語表記（1.5M・3Qa）、日本語表記（3億・2億3000万）が使えます。',
    resultHeading: '変換結果',
    commasLabel: 'カンマ区切り',
    shortLabel: 'K/M/B/T表記',
    jaLabel: '万・億・兆表記',
    scientificLabel: '指数表記',
    digitsLabel: '桁数',
    digitsUnit: '桁',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorInvalid:
      '読み取れない書式です。「1234567」「1.5M」「3億」「1e50」のように入力してください（マイナスは使えません）。',
    errorFraction:
      '整数にならない値です。小数は、K・M・億などを付けて整数になる場合のみ使えます（例: 1.5K = 1,500）。',
    errorTooLarge: '大きすぎる値です。1000桁以内の数を入力してください。',
    notAvailable: '—',
    chartHeading: '大きな数の早見表（10の3乗〜68乗）',
    chartIntro:
      '10のべき乗ごとに、カンマ区切り・K/M/B/T表記・万/億/兆表記を並べた一覧です。表は横にスクロールできます。',
    columnPower: '10の何乗',
    columnCommas: 'カンマ区切り',
    columnShort: 'K/M/B/T表記',
    columnShortName: '英語名',
    columnJa: '万・億・兆表記',
    notesHeading: '注意事項',
    notes: [
      'K/M/B/T表記は英語圏の短い位取り（short scale）で、Kは10の3乗、Mは10の6乗、Bは10の9乗、Tは10の12乗です。Qa以降の略称（Qa・Qi・Sx・Sp・Oc・No・Dc…）はゲームごとに異なる場合があるため、遊んでいるゲームの表記と照らし合わせてください。',
      '小数を含むK/M/B/T表記や「1.23億」のような表記は、表示桁数を超える部分を切り捨てています（四捨五入ではありません）。',
      '日本語の単位は万（10の4乗）から無量大数（10の68乗）までを使用しています。無量大数を超える数は「10000無量大数」のように係数が増えます。',
      '英語の短い位取りは10の63乗のVg（Vigintillion）まで対応しています。それを超える数は「1,000Vg」のように最大の接尾辞で表します。',
      '入力できるのは0以上の整数です（最大1000桁）。内部ではBigIntを使うため、JavaScriptの通常の数値では丸め誤差が出る大きな数も正確に扱えます。',
    ],
    glossaryHeading: '用語集',
    glossaryTerms: [
      {
        term: 'インクリメンタルゲーム（放置ゲーム）',
        description:
          'クリックや時間経過で数値が増え続け、アップグレードで増加速度を上げていくゲームの総称です。数値が指数的に大きくなるため、K・M・Bなどの略記や指数表記で表示されます。',
      },
      {
        term: '短い位取り（short scale）と長い位取り（long scale）',
        description:
          '英語圏のBillion（10億）などの数え方です。米国では1000倍ごとに名前が変わる短い位取り、一部の欧州では100万倍ごとに変わる長い位取りが使われます。多くのゲームは短い位取りを採用しています。',
      },
      {
        term: '指数表記',
        description:
          '「1.5e12」のように、仮数と10の指数で数を表す書き方です。インクリメンタルゲームでは、接尾辞では足りないほど大きな数の表示にも使われます。',
      },
      {
        term: '万進法',
        description:
          '日本語の数え方で、4桁ごと（万・億・兆・京…）に単位が変わります。英語圏の3桁ごとの区切りとは位置が合わないため、換算には早見表が便利です。',
      },
    ],
  },
  en: {
    title: 'Large Number Chart: K/M/B/T Suffixes and Japanese Units',
    description:
      'Idle-game number cheat sheet: 10^3 to 10^68 with commas, K/M/B/T suffixes and Japanese units (man, oku, cho). Runs in your browser.',
    h1: 'Large Number Chart (K, M, B, T and Japanese Units)',
    introHtml:
      'A cheat sheet for the big numbers in incremental and idle games: compare "1.5Qa" with its comma-separated value, K/M/B/T suffix, Japanese unit (万・億・兆) and scientific notation. Type a number to see all four formats at once. Inputs such as "1.5M", "3億", "2億3000万" and "1e50" work too. To convert between number bases, use the <a href="/en/tools/base-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Number Base Converter</a>.',
    inputLabel: 'Enter a number',
    inputPlaceholder: 'e.g. 1234567890, 1.5M, 3億, 2億3000万, 1e50',
    inputHint:
      'Accepts integers (commas allowed), exponents (1e50), suffixes (1.5M, 3Qa) and Japanese units (3億, 2億3000万).',
    resultHeading: 'Result',
    commasLabel: 'With commas',
    shortLabel: 'K/M/B/T suffix',
    jaLabel: 'Japanese units',
    scientificLabel: 'Scientific',
    digitsLabel: 'Digits',
    digitsUnit: 'digits',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Failed to copy',
    errorInvalid:
      'Unrecognized format. Try "1234567", "1.5M", "3億" or "1e50" (negative numbers are not supported).',
    errorFraction:
      'That is not a whole number. Decimals work only when a suffix makes them whole (e.g. 1.5K = 1,500).',
    errorTooLarge: 'That number is too large. Enter up to 1000 digits.',
    notAvailable: '—',
    chartHeading: 'Large number chart (10^3 to 10^68)',
    chartIntro:
      'Each power of ten with its comma-separated value, K/M/B/T suffix and Japanese unit. The table scrolls horizontally.',
    columnPower: 'Power of 10',
    columnCommas: 'With commas',
    columnShort: 'Suffix',
    columnShortName: 'Name',
    columnJa: 'Japanese units',
    notesHeading: 'Notes',
    notes: [
      'Suffixes follow the short scale: K is 10^3, M is 10^6, B is 10^9 and T is 10^12. Abbreviations from Qa onward (Qa, Qi, Sx, Sp, Oc, No, Dc…) vary between games, so check them against the game you play.',
      'Values such as "1.23M" or "1.23億" are truncated to the displayed digits, not rounded.',
      'Japanese units run from 万 (10^4) to 無量大数 (10^68). Beyond that the coefficient grows, as in "10000無量大数".',
      'English suffixes are supported up to Vg (Vigintillion, 10^63). Larger values use the biggest suffix, as in "1,000Vg".',
      'Input must be a non-negative integer of up to 1000 digits. BigInt is used internally, so numbers that lose precision as ordinary JavaScript numbers are handled exactly.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Incremental (idle) game',
        description:
          'A game where numbers keep growing through clicks or time and upgrades speed up the growth. Because values grow exponentially, they are shown with suffixes like K, M, B or scientific notation.',
      },
      {
        term: 'Short scale vs. long scale',
        description:
          'Two ways to name large numbers. The short scale (used in the US and most games) gains a new name every factor of 1000; the long scale (used in parts of Europe) every factor of 1,000,000.',
      },
      {
        term: 'Scientific notation',
        description:
          'Writing a number as a mantissa and a power of ten, such as "1.5e12". Games switch to it once the number outgrows the available suffixes.',
      },
      {
        term: 'Myriad system (man-shin-ho)',
        description:
          'The Japanese way of counting, where the unit changes every 4 digits (万, 億, 兆, 京…). It does not line up with 3-digit grouping, so a chart helps when converting.',
      },
    ],
  },
};
