import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface KanjiNumberConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  directionLabel: string;
  modeToArabic: string;
  modeToKanji: string;
  styleLabel: string;
  styleUnit: string;
  stylePlain: string;
  styleDaiji: string;
  commaLabel: string;
  inputLabel: string;
  inputPlaceholderToArabic: string;
  inputPlaceholderToKanji: string;
  sampleText: string;
  outputLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** {converted} {skipped} を置換して表示する */
  summary: string;
  summarySkipped: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const kanjiNumberConverterContent: Record<
  Locale,
  KanjiNumberConverterPageContent
> = {
  ja: {
    title: '漢数字⇔算用数字変換・大字（壱弐参）対応',
    description:
      '漢数字と算用数字（アラビア数字）を相互に変換する無料ツールです。千二百三十四・二〇二四・壱萬弐千円のような単位記法・位取り記法・大字（壱弐参）に対応し、文章中の金額もまとめて変換できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '漢数字⇔算用数字・大字変換',
    introHtml:
      '漢数字（千二百三十四・二〇二四）と算用数字（1234・2024）を相互に変換します。契約書や領収書の金額に使う大字（壱萬弐千参百円）にも対応し、文章中の数をまとめて変換できます。全角数字・カンマ区切りも入力できます。全角と半角の変換は <a href="/tools/zenkaku-hankaku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">全角/半角変換</a>、和暦と西暦の変換は <a href="/tools/japanese-era-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">和暦・西暦変換</a> をご利用ください。',
    directionLabel: '変換方向',
    modeToArabic: '漢数字→算用数字',
    modeToKanji: '算用数字→漢数字',
    styleLabel: '漢数字の書き方',
    styleUnit: '単位記法（千二百三十四）',
    stylePlain: '位取り記法（一二三四）',
    styleDaiji: '大字（壱千弐百参拾四）',
    commaLabel: '3桁ごとにカンマで区切る',
    inputLabel: '入力',
    inputPlaceholderToArabic: '例: 金壱萬弐千参百円',
    inputPlaceholderToKanji: '例: 金12,300円',
    sampleText:
      '金壱萬弐千参百円也。会費は3,500円、参加者は二十四名、令和7年。',
    outputLabel: '結果',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    summary: '{converted}個の数を変換しました。',
    summarySkipped:
      '数として読めない漢数字が{skipped}か所あり、そのまま残しています。',
    notesHeading: '注意事項',
    notes: [
      '文中の漢数字をすべて数として扱います。「一緒」「三日月」「四季」のように熟語の一部になっている漢数字も変換されるため、結果を確認してから使ってください。ただし「京都」「千葉」「十分」「万歳」のように、〇〜九を含まず単位だけの並びは変換しません。',
      '「十十」「百十千」のように数として成り立たない並びは変換せず、そのまま残します。',
      '算用数字→漢数字は、単位記法・大字では24桁（垓まで）の整数が対象です。位取り記法は桁数の制限なく変換できます。',
      '小数は整数部と小数部を分けて変換し、小数点は「点」と書きます（3.14 → 三点一四）。',
      '契約書・請求書などの金額表記は、書式の指定がある場合があります。提出前に宛先の指定を確認してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '単位記法・位取り記法',
        description:
          '単位記法は「千二百三十四」のように十・百・千・万などの単位を使う書き方、位取り記法は「一二三四」のように数字を1桁ずつ並べる書き方です。年号や番号には位取り記法（二〇二四年）、金額や数量には単位記法がよく使われます。',
      },
      {
        term: '大字（だいじ）',
        description:
          '壱・弐・参・拾・萬のように、画数の多い字で数を書く方法です。「一」を「二」「三」に書き換えるなどの改ざんを防ぐため、契約書・請求書・領収書の金額に使われます。このツールでは、十・百・千の前でも「壱」を省略せずに書きます（壱拾・壱百・壱千）。',
      },
      {
        term: '万・億・兆・京・垓',
        description:
          '日本語では4桁ごとに新しい単位を使います。万は10の4乗、億は8乗、兆は12乗、京は16乗、垓は20乗です。3桁ごとに区切る算用数字とは区切り方が違うため、桁を読み間違えないように注意が必要です。',
      },
    ],
  },
  en: {
    title: 'Kanji Numeral Converter – Japanese Numbers to Arabic Digits',
    description:
      'Convert Japanese kanji numerals to Arabic digits and back, including formal daiji numerals used on contracts. Runs in your browser; nothing is sent to a server.',
    h1: 'Kanji Numeral Converter (Japanese Numbers ⇔ Arabic Digits)',
    introHtml:
      'Convert Japanese numbers written in kanji (千二百三十四, 二〇二四) to ordinary digits (1234, 2024) and back. It also handles formal daiji numerals (壱萬弐千参百) used for amounts on contracts and receipts, and converts every number in a block of text at once. Full-width digits and comma-separated numbers are accepted. For other Japanese date formats, try the <a href="/en/tools/japanese-era-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Japanese Era Converter</a>.',
    directionLabel: 'Direction',
    modeToArabic: 'Kanji → digits',
    modeToKanji: 'Digits → kanji',
    styleLabel: 'Kanji style',
    styleUnit: 'With units (千二百三十四)',
    stylePlain: 'Digit by digit (一二三四)',
    styleDaiji: 'Formal daiji (壱千弐百参拾四)',
    commaLabel: 'Add thousands separators',
    inputLabel: 'Input',
    inputPlaceholderToArabic: 'e.g. 金壱萬弐千参百円',
    inputPlaceholderToKanji: 'e.g. 金12,300円',
    sampleText:
      '金壱萬弐千参百円也。会費は3,500円、参加者は二十四名、令和7年。',
    outputLabel: 'Result',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    summary: 'Converted {converted} number(s).',
    summarySkipped:
      '{skipped} kanji sequence(s) could not be read as a number and were left as they are.',
    notesHeading: 'Notes',
    notes: [
      'Every kanji numeral in the text is treated as a number. Numerals that are part of a word, such as 一緒 (together) or 三日月 (crescent moon), are converted too, so check the result before using it. Sequences made only of units with no digit, such as 京都, 千葉, 十分 or 万歳, are left unchanged.',
      'Sequences that are not valid numbers, such as 十十 or 百十千, are left unchanged.',
      'Digits to kanji with units or daiji supports integers up to 24 digits (up to 垓). The digit-by-digit style has no length limit.',
      'Decimals are converted as an integer part and a fractional part, with 点 for the decimal point (3.14 → 三点一四).',
      'Contracts and invoices sometimes require a specific format for amounts. Check the recipient’s requirements before you submit.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Unit notation vs. digit-by-digit',
        description:
          'Unit notation writes 1234 as 千二百三十四, using the units 十 (10), 百 (100) and 千 (1,000). Digit-by-digit notation writes it as 一二三四, one kanji per digit. Years and ID numbers usually use the digit-by-digit form (二〇二四年), while amounts and counts usually use units.',
      },
      {
        term: 'Daiji (formal numerals)',
        description:
          'Daiji are more complex characters used for numbers, such as 壱 (1), 弐 (2), 参 (3), 拾 (10) and 萬 (10,000). They make it harder to alter an amount by adding strokes, so they appear on contracts, invoices and receipts. This tool always writes 壱 even before 拾, 百 and 千 (壱拾, 壱百, 壱千).',
      },
      {
        term: '万, 億, 兆, 京, 垓',
        description:
          'Japanese introduces a new unit every four digits: 万 is 10^4, 億 is 10^8, 兆 is 10^12, 京 is 10^16 and 垓 is 10^20. Western numbers group digits by three, so it is easy to misplace a digit when moving between the two.',
      },
    ],
  },
};
