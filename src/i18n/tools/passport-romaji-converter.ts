import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface PassportRomajiConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  surnameLabel: string;
  surnamePlaceholder: string;
  givenLabel: string;
  givenPlaceholder: string;
  longVowelLabel: string;
  longVowelOmit: string;
  longVowelOh: string;
  orderLabel: string;
  orderSurnameFirst: string;
  orderGivenFirst: string;
  resultHeading: string;
  surnameResultLabel: string;
  givenResultLabel: string;
  fullResultLabel: string;
  unsupportedMessage: string;
  copy: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const passportRomajiConverterContent: Record<
  Locale,
  PassportRomajiConverterPageContent
> = {
  ja: {
    title: 'パスポート用ローマ字氏名変換（ヘボン式・長音省略）',
    description:
      'ひらがな・カタカナの氏名を、パスポートのヘボン式ローマ字に変換する無料ツールです。オ段・ウ段の長音の省略、「ん」のB・M・P前のM表記、OH表記の切替に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'パスポート用ローマ字氏名変換（ヘボン式）',
    introHtml:
      '姓と名をひらがな・カタカナで入力すると、パスポートで使われるヘボン式のローマ字（大文字）にします。大野→ONO、伊藤→ITO のようなオ段・ウ段の長音の省略と、なんば→NAMBA のような「ん」の M 表記に対応し、希望すれば OH 表記（OHNO）にも切り替えられます。長音の省略などを行わない一般的なローマ字変換は <a href="/tools/romaji-kana-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ローマ字⇔ひらがな変換</a> をご利用ください。',
    surnameLabel: '姓（ひらがな・カタカナ）',
    surnamePlaceholder: '例: おおの',
    givenLabel: '名（ひらがな・カタカナ）',
    givenPlaceholder: '例: ゆうこ',
    longVowelLabel: 'オ段の長音（おう・おお）',
    longVowelOmit: '省略（ONO）',
    longVowelOh: 'OH 表記（OHNO）',
    orderLabel: '並べ方',
    orderSurnameFirst: '姓 名',
    orderGivenFirst: '名 姓',
    resultHeading: '変換結果',
    surnameResultLabel: '姓',
    givenResultLabel: '名',
    fullResultLabel: '氏名',
    unsupportedMessage:
      '変換できない文字が含まれています: {chars}。ひらがな・カタカナで読みを入力してください。',
    copy: '氏名をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '外務省が案内するヘボン式ローマ字の考え方（オ段・ウ段の長音は書かない、B・M・P の前の「ん」は M、促音は子音を重ねる）に沿って変換しますが、法的な助言ではありません。申請時は、必ず最新の案内と窓口の指示を確認してください。',
      '「OH」などヘボン式によらない表記は、希望する場合に事前に旅券窓口へ相談が必要です。一度決めた綴りは原則として後から変更できず、家族で姓の綴りがそろっているかにも注意が必要です。',
      '漢字は変換できません。戸籍上の読みをひらがなで入力してください。姓名の区切りや旧姓併記・別名併記などの扱いは、このツールの対象外です。',
      'ア段・イ段・エ段の重なり（かあ→KAA、みい→MII）は、ヘボン式でも省略しません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '長音の省略',
        description:
          'パスポートのヘボン式では、オ段・ウ段の長音（おう・おお・うう）は原則として書きません。大野（おおの）は ONO、優子（ゆうこ）は YUKO になります。',
      },
      {
        term: 'OH 表記',
        description:
          'オ段の長音を OH と書く表記（OHNO、ITOH など）です。ヘボン式の原則とは異なるため、希望する場合は旅券窓口への事前の相談が必要です。',
      },
      {
        term: '撥音の M 表記',
        description:
          '「ん」は N と書きますが、B・M・P の前だけは M と書きます（なんば→NAMBA、ほんま→HOMMA、さんぺい→SAMPEI）。アポストロフィは使いません（じゅんいち→JUNICHI）。',
      },
    ],
  },
  en: {
    title: 'Passport Romaji Name Converter (Japanese Hepburn Rules)',
    description:
      'Convert a Japanese name in kana to passport Hepburn romaji: long O/U omitted, M before B/M/P, optional OH. Runs in your browser; nothing is uploaded.',
    h1: 'Passport Romaji Name Converter (Hepburn)',
    introHtml:
      'Enter your family and given names in hiragana or katakana to get the uppercase Hepburn romaji used on Japanese passports. It omits long O and U sounds (大野 → ONO, 伊藤 → ITO), writes ん as M before B, M or P (NAMBA), and can switch to the OH spelling (OHNO) if you prefer. For general romaji conversion without these passport rules, use the <a href="/en/tools/romaji-kana-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Romaji ⇔ Hiragana Converter</a>.',
    surnameLabel: 'Family name (hiragana / katakana)',
    surnamePlaceholder: 'e.g. おおの',
    givenLabel: 'Given name (hiragana / katakana)',
    givenPlaceholder: 'e.g. ゆうこ',
    longVowelLabel: 'Long O sound (おう / おお)',
    longVowelOmit: 'Omit (ONO)',
    longVowelOh: 'OH spelling (OHNO)',
    orderLabel: 'Name order',
    orderSurnameFirst: 'Family Given',
    orderGivenFirst: 'Given Family',
    resultHeading: 'Result',
    surnameResultLabel: 'Family name',
    givenResultLabel: 'Given name',
    fullResultLabel: 'Full name',
    unsupportedMessage:
      'These characters cannot be converted: {chars}. Enter the reading in hiragana or katakana.',
    copy: 'Copy full name',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'The result follows the Hepburn conventions that the Japanese Ministry of Foreign Affairs describes for passports (no long O/U vowels, M before B/M/P, doubled consonants for small っ). It is not legal advice; always check the latest official guidance and your passport office before applying.',
      'Spellings that depart from standard Hepburn, such as OH, must be requested and discussed with the passport office in advance. The spelling you choose generally cannot be changed later, and family members should keep the same spelling of the family name.',
      'Kanji cannot be converted. Enter the official reading in hiragana. Maiden-name and alias notations are outside the scope of this tool.',
      'Repeated A, I and E vowels (かあ → KAA, みい → MII) are not shortened, even in passport Hepburn.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Omitting long vowels',
        description:
          'In passport Hepburn, long O and U sounds (おう, おお, うう) are normally not written. 大野 (おおの) becomes ONO and 優子 (ゆうこ) becomes YUKO.',
      },
      {
        term: 'OH spelling',
        description:
          'A way of writing the long O sound as OH (OHNO, ITOH). It departs from standard Hepburn, so you need to ask the passport office beforehand if you want it.',
      },
      {
        term: 'M before B, M and P',
        description:
          'ん is written N, except before B, M and P where it is M (なんば → NAMBA, ほんま → HOMMA, さんぺい → SAMPEI). No apostrophe is used (じゅんいち → JUNICHI).',
      },
    ],
  },
};
