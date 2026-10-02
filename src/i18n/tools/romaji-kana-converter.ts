import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface RomajiKanaConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  directionLabel: string;
  modeToKana: string;
  modeToRomaji: string;
  scriptLabel: string;
  scriptHiragana: string;
  scriptKatakana: string;
  styleLabel: string;
  styleHepburn: string;
  styleKunrei: string;
  longVowelLabel: string;
  longVowelMacron: string;
  longVowelDouble: string;
  longVowelDash: string;
  longVowelOmit: string;
  caseLabel: string;
  caseLower: string;
  caseCapitalize: string;
  caseUpper: string;
  inputLabel: string;
  inputPlaceholderToKana: string;
  inputPlaceholderToRomaji: string;
  sampleText: string;
  outputLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const romajiKanaConverterContent: Record<
  Locale,
  RomajiKanaConverterPageContent
> = {
  ja: {
    title: 'ローマ字⇔ひらがな変換（ヘボン式・訓令式）',
    description:
      'ローマ字をひらがな・カタカナに、ひらがな・カタカナをローマ字（ヘボン式・訓令式）に変換する無料ツールです。ローマ字入力の確認、名前のローマ字表記づくりに使えます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ローマ字⇔ひらがな変換（ヘボン式・訓令式対応）',
    introHtml:
      'ローマ字をひらがな・カタカナに、ひらがな・カタカナをローマ字に相互変換します。「nn」「n\'」「kk」のようなローマ字入力の打ち方の確認や、名前・地名のローマ字表記づくりに使えます。ヘボン式と訓令式を切り替えられ、長音（ー）の書き方も選べます。ひらがなとカタカナの変換だけなら <a href="/tools/kana-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ひらがな/カタカナ変換</a> をご利用ください。',
    directionLabel: '変換方向',
    modeToKana: 'ローマ字→かな',
    modeToRomaji: 'かな→ローマ字',
    scriptLabel: '変換後の文字',
    scriptHiragana: 'ひらがな',
    scriptKatakana: 'カタカナ',
    styleLabel: 'ローマ字の方式',
    styleHepburn: 'ヘボン式（shi・chi・tsu）',
    styleKunrei: '訓令式（si・ti・tu）',
    longVowelLabel: '長音（ー）の書き方',
    longVowelMacron: 'マクロン（ā）',
    longVowelDouble: '母音を重ねる（aa）',
    longVowelDash: 'ハイフン（a-）',
    longVowelOmit: '省略（a）',
    caseLabel: '大文字・小文字',
    caseLower: 'すべて小文字',
    caseCapitalize: '単語の先頭を大文字',
    caseUpper: 'すべて大文字',
    inputLabel: '入力',
    inputPlaceholderToKana: 'ローマ字を入力（例: konnichiwa）',
    inputPlaceholderToRomaji: 'ひらがな・カタカナを入力（例: こんにちは）',
    sampleText: 'konnichiwa, sakura tarou\nこんにちは、さくら たろう',
    outputLabel: '結果',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      "ローマ字→かなは、ヘボン式・訓令式・日本式のどの綴りも受け付けます（shi / si、chi / ti、fu / hu など）。IME の入力に合わせ、「nn」「n'」で「ん」、「ka-」の「-」で長音（ー）になります。",
      'かな→ローマ字では、助詞の「は」は ha、「を」は o と書きます。「こんにちは」は konnichiha になるため、あいさつの綴り（konnichiwa）にしたい場合は手で直してください。',
      '「おう」「おお」などのかな表記の長音は、そのまま ou・oo と書きます。マクロンやハイフンにするのは、カタカナの長音符「ー」だけです。',
      '漢字は変換できません（読みを知っている場合はひらがなに直してから入力してください）。かな・ローマ字以外の文字はそのまま残ります。',
      'パスポート用の氏名表記（ヘボン式の運用ルールなど）は、公的な案内で確認してください。このツールの結果をそのまま申請に使うことは避けてください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ヘボン式・訓令式',
        description:
          'ヘボン式は英語話者が読みやすいように音に合わせて綴る方式（shi, chi, tsu, fu, ji）で、パスポートや駅名表示で使われます。訓令式は五十音図の規則に沿って綴る方式（si, ti, tu, hu, zi）で、学校教育で教えられてきました。',
      },
      {
        term: '促音・撥音・長音',
        description:
          "促音は小さい「っ」（kk・tt など子音を重ねて書く）、撥音は「ん」（n、母音や y の前では n' と書く）、長音は音を伸ばす「ー」や「おう」「おお」のことです。",
      },
    ],
  },
  en: {
    title: 'Romaji ⇔ Hiragana Converter (Hepburn & Kunrei)',
    description:
      'Convert romaji to hiragana or katakana, and kana to romaji in Hepburn or Kunrei style. Runs in your browser; nothing is sent to a server.',
    h1: 'Romaji ⇔ Hiragana Converter (Hepburn & Kunrei)',
    introHtml:
      'Convert romaji to hiragana or katakana and back. Use it to check how to type Japanese with a romaji IME (nn, n\', double consonants), or to write a Japanese name or place in romaji. You can switch between Hepburn and Kunrei-shiki, and choose how long vowels are written. For plain hiragana and katakana conversion, see the <a href="/en/tools/kana-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Hiragana / Katakana Converter</a>.',
    directionLabel: 'Direction',
    modeToKana: 'Romaji → kana',
    modeToRomaji: 'Kana → romaji',
    scriptLabel: 'Output script',
    scriptHiragana: 'Hiragana',
    scriptKatakana: 'Katakana',
    styleLabel: 'Romanization system',
    styleHepburn: 'Hepburn (shi, chi, tsu)',
    styleKunrei: 'Kunrei-shiki (si, ti, tu)',
    longVowelLabel: 'Long vowel mark (ー)',
    longVowelMacron: 'Macron (ā)',
    longVowelDouble: 'Doubled vowel (aa)',
    longVowelDash: 'Hyphen (a-)',
    longVowelOmit: 'Omit (a)',
    caseLabel: 'Letter case',
    caseLower: 'All lowercase',
    caseCapitalize: 'Capitalize each word',
    caseUpper: 'All uppercase',
    inputLabel: 'Input',
    inputPlaceholderToKana: 'Enter romaji (e.g. konnichiwa)',
    inputPlaceholderToRomaji: 'Enter hiragana or katakana (e.g. こんにちは)',
    sampleText: 'konnichiwa, sakura tarou\nこんにちは、さくら たろう',
    outputLabel: 'Result',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Romaji → kana accepts Hepburn, Kunrei-shiki and Nihon-shiki spellings (shi / si, chi / ti, fu / hu, and so on). Like a Japanese IME, "nn" or "n\'" gives ん and a hyphen after kana (ka-) gives the long vowel mark ー.',
      'Kana → romaji writes the particle は as ha and を as o, so こんにちは becomes konnichiha. Edit it by hand if you want the greeting spelling konnichiwa.',
      'Long vowels written in kana (おう, おお) are romanized as they are (ou, oo). Only the katakana long vowel mark ー is turned into a macron, doubled vowel or hyphen.',
      'Kanji cannot be converted. If you know the reading, type it in hiragana first. Characters other than kana and romaji are left as they are.',
      'For the romanization of names on a passport or official forms, check the official guidance. Do not use this tool’s output as-is on an application.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Hepburn and Kunrei-shiki',
        description:
          'Hepburn spells Japanese the way it sounds to English readers (shi, chi, tsu, fu, ji) and is used on passports and station signs. Kunrei-shiki follows the structure of the gojūon table (si, ti, tu, hu, zi) and has been taught in schools.',
      },
      {
        term: 'Sokuon, hatsuon and chōon',
        description:
          "Sokuon is the small っ, written by doubling the next consonant (kk, tt). Hatsuon is ん, written n (n' before a vowel or y). Chōon is a long vowel, written with ー, おう or おお.",
      },
    ],
  },
};
