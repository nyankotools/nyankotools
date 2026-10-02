import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface EnglishKatakanaConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  vSoundLabel: string;
  vSoundBa: string;
  vSoundVu: string;
  acronymLabel: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  outputLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** {total} {dictionary} {rules} {acronym} を置換して表示する */
  summary: string;
  summaryNone: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const englishKatakanaConverterContent: Record<
  Locale,
  EnglishKatakanaConverterPageContent
> = {
  ja: {
    title: '英単語カタカナ変換（英語→片仮名表記・簡易版）',
    description:
      '英単語の綴りを片仮名表記に変換する無料ツールです。綴りのルールと頻出語の辞書で変換する簡易版で、USB などの略語は文字読みにもできます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '英単語カタカナ変換（英語→片仮名表記）',
    introHtml:
      '英単語のスペルを、綴りのパターンから片仮名表記に変換します（例: school→スクール、night→ナイト）。ふりがな付けや、英語名のカタカナ表記の目安づくりに使えます。実際の発音を調べるものではなく、不規則な綴りは頻出語の辞書で補う簡易版です。ローマ字とかなの変換は <a href="/tools/romaji-kana-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ローマ字⇔ひらがな変換</a> をご利用ください。',
    vSoundLabel: 'v の音',
    vSoundBa: 'バ行（ビデオ）',
    vSoundVu: 'ヴ（ヴィデオ）',
    acronymLabel: 'USB・HTML のような大文字の略語は文字読みにする',
    inputLabel: '入力',
    inputPlaceholder: '英単語や英文を入力（例: nice school）',
    sampleText: 'Hello world, this is a nice school.\nUSB cable, night light',
    outputLabel: '結果',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    summary:
      '{total}語を変換しました（辞書 {dictionary}語・綴りのルール {rules}語・文字読み {acronym}語）。',
    summaryNone: '変換対象の英単語はありませんでした。',
    notesHeading: '注意事項',
    notes: [
      '綴りのパターンと約300語の辞書で変換する簡易版です。英語の発音は綴りと一致しないことが多く、実際に使われているカタカナ表記と異なる結果になる場合があります。あくまで目安としてお使いください。',
      '「knife」「people」のような不規則な綴りは、辞書に載っている語だけを正しく変換できます。辞書にない語はルールで推測するため、精度が下がります。',
      '同じ綴りでも、発音が複数ある語（read、live など）は片方の読みになります。',
      '人名は、英語圏で一般的な名前（John・Mary・Smith など約180語）だけを辞書で正しく変換します。辞書にない名前はルールで推測するため、発音と違う結果になりやすくなります。',
      '公式な表記（商品名・社名・人名）は、それぞれの公式サイトなどで確認してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '片仮名表記（外来語表記）',
        description:
          '外国語の音を日本語の音で書き表したものです。日本語にない音（th, v, l/r の区別など）は近い音に置き換えられるため、同じ英単語でも「ヴ」を使うかどうかなど、複数の表記が使われます。',
      },
      {
        term: 'マジックe',
        description:
          '語末の「母音＋子音＋e」（make, nice, home など）で、e を読まずに前の母音を長く読む英語の綴りの規則です。このツールでも、この規則を使って「メイク」「ナイス」「ホーム」のように変換します。',
      },
    ],
  },
  en: {
    title: 'English to Katakana Converter (Simple Spelling Rules)',
    description:
      'Convert English words to katakana using spelling rules and a small dictionary. Spells out acronyms like USB. Runs in your browser; nothing is sent to a server.',
    h1: 'English to Katakana Converter',
    introHtml:
      'Convert English words into katakana from their spelling patterns (school → スクール, night → ナイト). It is handy for adding readings to English words or getting a rough idea of how a name is written in katakana. This is a simple tool, not a pronunciation checker: spelling rules are backed by a small dictionary for irregular common words. For romaji and kana, see the <a href="/en/tools/romaji-kana-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Romaji ⇔ Hiragana Converter</a>.',
    vSoundLabel: 'Sound of v',
    vSoundBa: 'B-row (ビデオ)',
    vSoundVu: 'ヴ (ヴィデオ)',
    acronymLabel: 'Spell out all-caps acronyms such as USB and HTML',
    inputLabel: 'Input',
    inputPlaceholder: 'Enter English words or text (e.g. nice school)',
    sampleText: 'Hello world, this is a nice school.\nUSB cable, night light',
    outputLabel: 'Result',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    summary:
      'Converted {total} word(s): {dictionary} from the dictionary, {rules} by spelling rules, {acronym} spelled out.',
    summaryNone: 'No English words found.',
    notesHeading: 'Notes',
    notes: [
      'This is a simple converter based on spelling patterns and a dictionary of about 300 words. English pronunciation often differs from spelling, so the result may not match the katakana actually in use. Treat it as a rough guide.',
      'Irregular spellings such as "knife" and "people" are only handled correctly when the word is in the dictionary. Words outside it are guessed by rules and are less accurate.',
      'Words with more than one pronunciation (read, live) are converted with only one of them.',
      'Only common English first and last names (John, Mary, Smith and about 180 others) are in the dictionary and convert correctly. Other names are guessed by rules and often come out wrong.',
      'For official spellings of product names, company names or personal names, check the official source.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Katakana transcription (gairaigo)',
        description:
          'Foreign words written with Japanese sounds. Sounds that do not exist in Japanese (th, v, the l/r distinction) are replaced by close ones, so one English word can have several spellings, for example with or without ヴ.',
      },
      {
        term: 'Magic e',
        description:
          'The English spelling rule where a final "vowel + consonant + e" (make, nice, home) leaves the e silent and lengthens the vowel. The tool uses it to produce メイク, ナイス and ホーム.',
      },
    ],
  },
};
