import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface RomanNumeralConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  directionLabel: string;
  modeToRoman: string;
  modeToArabic: string;
  inputLabelToRoman: string;
  inputLabelToArabic: string;
  inputPlaceholderToRoman: string;
  inputPlaceholderToArabic: string;
  unicodeLabel: string;
  lowercaseLabel: string;
  outputLabel: string;
  breakdownLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** 以下のメッセージは {input} {roman} {value} {min} {max} を置換して表示する */
  errorInvalidNumber: string;
  errorOutOfRange: string;
  errorInvalidChar: string;
  errorInvalidForm: string;
  nonstandardNotice: string;
  tablesHeading: string;
  tableNumberHeading: string;
  tableRomanHeading: string;
  tableBasicCaption: string;
  tableYearCaption: string;
  tableSymbolCaption: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const romanNumeralConverterContent: Record<
  Locale,
  RomanNumeralConverterPageContent
> = {
  ja: {
    title: 'ローマ数字変換｜算用数字⇔ローマ数字（1〜3999）',
    description:
      '算用数字（1〜3999）とローマ数字を相互に変換する無料ツールです。IIII・VX などの誤った表記には正規形を表示し、Ⅻ などのUnicodeローマ数字・小文字出力、1〜20や西暦年の一覧にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ローマ数字⇔算用数字変換（1〜3999）',
    introHtml:
      '算用数字（1994）とローマ数字（MCMXCIV）を相互に変換します。章番号・時計の文字盤・ドキュメントの版番号などに使えます。小文字（i, ii, iii）やUnicodeのローマ数字（Ⅳ・Ⅻ）での出力にも対応しています。2進数・16進数など他の基数は <a href="/tools/base-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">基数変換</a>、漢字の数字は <a href="/tools/kanji-number-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">漢数字⇔算用数字変換</a> をご利用ください。',
    directionLabel: '変換方向',
    modeToRoman: '算用数字→ローマ数字',
    modeToArabic: 'ローマ数字→算用数字',
    inputLabelToRoman: '算用数字（1〜3999）',
    inputLabelToArabic: 'ローマ数字',
    inputPlaceholderToRoman: '例: 1994',
    inputPlaceholderToArabic: '例: MCMXCIV',
    unicodeLabel: 'Unicodeのローマ数字文字で出力（Ⅻ）',
    lowercaseLabel: '小文字で出力（i, ii, iii）',
    outputLabel: '結果',
    breakdownLabel: '内訳',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorInvalidNumber:
      '数字として読めません。半角または全角の整数（1〜3999）を入力してください。',
    errorOutOfRange:
      '{min}〜{max} の範囲外です。標準的なローマ数字で表せるのは {min}〜{max} までです。',
    errorInvalidChar:
      'ローマ数字に使える文字は I・V・X・L・C・D・M（大文字小文字・Ⅰ〜Ⅿ も可）だけです。',
    errorInvalidForm:
      '「{input}」は正しいローマ数字として読めません（例: VX・IC・IIX）。',
    nonstandardNotice:
      '「{input}」は標準的な書き方ではありません。値は {value}、正規形は {roman} です。',
    tablesHeading: 'よく使うローマ数字の一覧',
    tableNumberHeading: '算用数字',
    tableRomanHeading: 'ローマ数字',
    tableBasicCaption: '1〜20',
    tableYearCaption: '西暦年・区切りのよい数',
    tableSymbolCaption: '基本の文字',
    notesHeading: '注意事項',
    notes: [
      '標準的なローマ数字で表せるのは 1〜3999 です。0 と負数は表せず、4000 以上は上線（バー）を使う拡張表記になるため扱いません。',
      '同じ文字の連続は3つまでが標準です（4 は IIII ではなく IV）。IIII のように標準形でない表記は、値と正規形を表示します。時計の文字盤など慣用的に IIII を使う場合もあります。',
      '減算の書き方は IV・IX・XL・XC・CD・CM の6通りだけです。IC（99）・VX（5）・IL（49）などの表記は読み取りません（99 は XCIX、49 は XLIX と書きます）。',
      'Unicodeのローマ数字（Ⅰ〜Ⅿ）は、フォントによって表示できない場合があります。文書や検索では、通常のアルファベットの方が扱いやすいことが多いです。',
      '入力に全角文字やUnicodeのローマ数字（Ⅻ）が混じっていても、半角に直して読み取ります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '加算則・減算則',
        description:
          'ローマ数字は、文字を並べて足し算する「加算則」（VIII = 5+1+1+1 = 8）が基本です。小さい文字を大きい文字の左に置くと引き算になる「減算則」（IV = 5−1 = 4、IX = 9）もあります。減算則を使えるのは I・X・C の3つで、直後の2つの文字（I は V・X、X は L・C、C は D・M）に対してだけです。',
      },
      {
        term: '正規形',
        description:
          '同じ数を表す書き方が複数ある場合に、標準とされる1通りの表記のことです。たとえば 4 は IIII でも読めますが、現在の標準は IV です。このツールは 1〜3999 の正規形だけを出力します。',
      },
      {
        term: 'Unicodeのローマ数字',
        description:
          'Ⅰ（U+2160）〜Ⅿ（U+216F）、小文字のⅰ（U+2170）〜ⅿ（U+217F）として文字コードに用意された専用の文字です。Ⅻ のように 1〜12 を1文字で表せますが、アルファベットの I・V・X とは別の文字として扱われます。',
      },
    ],
  },
  en: {
    title: 'Roman Numeral Converter – Numbers 1 to 3999 and Back',
    description:
      'Convert numbers 1–3999 to Roman numerals and back. Non-standard forms like IIII are flagged with the standard form. Lowercase and Unicode (Ⅻ) output.',
    h1: 'Roman Numeral Converter (1–3999 ⇔ Numbers)',
    introHtml:
      'Convert numbers (1994) to Roman numerals (MCMXCIV) and back. Handy for chapter numbers, clock faces, outline lists, and document or version numbering. You can also get lowercase (i, ii, iii) or Unicode Roman numeral characters (Ⅳ, Ⅻ). For other number bases such as binary and hexadecimal, use the <a href="/en/tools/base-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Base Converter</a>.',
    directionLabel: 'Direction',
    modeToRoman: 'Number → Roman',
    modeToArabic: 'Roman → number',
    inputLabelToRoman: 'Number (1–3999)',
    inputLabelToArabic: 'Roman numeral',
    inputPlaceholderToRoman: 'e.g. 1994',
    inputPlaceholderToArabic: 'e.g. MCMXCIV',
    unicodeLabel: 'Use Unicode Roman numeral characters (Ⅻ)',
    lowercaseLabel: 'Lowercase (i, ii, iii)',
    outputLabel: 'Result',
    breakdownLabel: 'Breakdown',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorInvalidNumber:
      'That is not a whole number. Enter an integer from 1 to 3999.',
    errorOutOfRange:
      'Out of range. Standard Roman numerals cover {min} to {max}.',
    errorInvalidChar:
      'Roman numerals use only I, V, X, L, C, D and M (upper or lower case, or the Unicode Ⅰ–Ⅿ).',
    errorInvalidForm:
      '"{input}" is not a valid Roman numeral (for example VX, IC or IIX).',
    nonstandardNotice:
      '"{input}" is not written in the standard form. It reads as {value}; the standard form is {roman}.',
    tablesHeading: 'Common Roman numerals',
    tableNumberHeading: 'Number',
    tableRomanHeading: 'Roman',
    tableBasicCaption: '1 to 20',
    tableYearCaption: 'Years and round numbers',
    tableSymbolCaption: 'Basic symbols',
    notesHeading: 'Notes',
    notes: [
      'Standard Roman numerals cover 1 to 3999. Zero and negative numbers cannot be written, and 4000 and above need an overline (vinculum), which this tool does not support.',
      'A symbol repeats at most three times in the standard form (4 is IV, not IIII). Non-standard forms such as IIII are read, and the value and standard form are shown. Some clock faces deliberately use IIII.',
      'Only six subtractive pairs are valid: IV, IX, XL, XC, CD and CM. Forms such as IC (99), VX (5) or IL (49) are rejected; write 99 as XCIX and 49 as XLIX.',
      'Unicode Roman numerals (Ⅰ–Ⅿ) may not display in every font. For documents and search, plain letters are usually easier to work with.',
      'Full-width letters and Unicode Roman numerals (Ⅻ) in the input are normalized to plain letters before reading.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Additive and subtractive notation',
        description:
          'Roman numerals mainly add symbols together (VIII = 5+1+1+1 = 8). A smaller symbol placed before a larger one is subtracted instead (IV = 5−1 = 4, IX = 9). Only I, X and C can be subtracted, and only from the next two larger symbols (I from V and X, X from L and C, C from D and M).',
      },
      {
        term: 'Standard form',
        description:
          'When one number has several possible spellings, the standard form is the single accepted one. For example 4 can be read from IIII, but today the standard form is IV. This tool only outputs the standard form for 1 to 3999.',
      },
      {
        term: 'Unicode Roman numerals',
        description:
          'Dedicated characters from Ⅰ (U+2160) to Ⅿ (U+216F), plus lowercase ⅰ (U+2170) to ⅿ (U+217F). Ⅻ, for instance, writes 12 in a single character. They are different code points from the Latin letters I, V and X.',
      },
    ],
  },
};
