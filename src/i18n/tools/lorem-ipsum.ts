import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface LoremIpsumPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  languageLegend: string;
  languageLatinLabel: string;
  languageJaLabel: string;
  unitLegend: string;
  unitParagraphsLabel: string;
  unitSentencesLabel: string;
  unitWordsLabel: string;
  countLabel: string;
  generateButton: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  fixedOpeningLabel: string;
  outputLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const loremIpsumContent: Record<Locale, LoremIpsumPageContent> = {
  ja: {
    title: 'ダミーテキスト生成（Lorem ipsum・日本語対応）',
    description:
      'Lorem ipsum（欧文）または日本語のダミーテキストを、段落・文・単語単位で指定した個数だけ生成する無料ツールです。デザインカンプや原稿の仮置きに便利。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ダミーテキスト生成',
    introHtml:
      'デザインや原稿の仮置きに使えるダミーテキストを生成します。定番のLorem ipsum（欧文）と日本語の2種類に対応し、段落・文・単語の単位で個数を指定できます。生成した文章量を確認したい場合は <a href="/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字数カウント</a> もあわせてご利用ください。',
    languageLegend: '言語',
    languageLatinLabel: 'Lorem ipsum（欧文）',
    languageJaLabel: '日本語',
    unitLegend: '単位',
    unitParagraphsLabel: '段落',
    unitSentencesLabel: '文',
    unitWordsLabel: '単語',
    countLabel: '個数（1〜200）',
    generateButton: '生成する',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    fixedOpeningLabel: '定番の書き出し文から始める',
    outputLabel: '結果',
    notesHeading: '注意点',
    notes: [
      '日本語は「単語」単位での区切りが不自然なため、段落・文の単位のみ選択できます。',
      '生成される内容はランダムであり、実際に意味のある文章ではありません。デザインや文字量の確認用としてご利用ください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Lorem ipsum（ロレム・イプサム）',
        description:
          'デザインや組版の確認用に古くから使われている、意味を持たないラテン語風のダミーテキストです。実際の原稿がまだ無い段階で、文字量やレイアウトの見た目を確認するために使われます。',
      },
      {
        term: 'ダミーテキスト（プレースホルダーテキスト）',
        description:
          '本文が未確定の段階で、レイアウトや文字数の目安を確認するために仮置きする文章のことです。内容そのものに意味はなく、後で実際の原稿に差し替えることを前提としています。',
      },
      {
        term: '文字組み（もじぐみ）',
        description:
          '文字の大きさ・行間・余白などを調整して、読みやすい見た目に整えることです。ダミーテキストを流し込むことで、実際の原稿を用意する前に文字組みの確認ができます。',
      },
    ],
  },
  en: {
    title: 'Dummy Text Generator (Lorem Ipsum & Japanese)',
    description:
      'Generates Lorem ipsum (Latin) or Japanese placeholder text by paragraphs, sentences, or words, in any count you choose. Handy for mocking up designs before real copy is ready. Your data is processed in the browser and never sent to a server.',
    h1: 'Dummy Text Generator',
    introHtml:
      'Generates placeholder text for mocking up designs or drafts. Supports both classic Lorem ipsum (Latin) and Japanese placeholder text, with a selectable unit — paragraphs, sentences, or words — and a count. To check how much text you generated, also try the <a href="/en/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Character Counter</a> tool.',
    languageLegend: 'Language',
    languageLatinLabel: 'Lorem ipsum (Latin)',
    languageJaLabel: 'Japanese',
    unitLegend: 'Unit',
    unitParagraphsLabel: 'Paragraphs',
    unitSentencesLabel: 'Sentences',
    unitWordsLabel: 'Words',
    countLabel: 'Count (1-200)',
    generateButton: 'Generate',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    fixedOpeningLabel: 'Start with the classic opening sentence',
    outputLabel: 'Result',
    notesHeading: 'Notes',
    notes: [
      "Japanese text doesn't split naturally into space-separated words, so only the paragraph and sentence units are available for it.",
      "The generated content is random and carries no real meaning — it's meant for checking design and text length only.",
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Lorem ipsum',
        description:
          'A long-standing placeholder text used for checking design and typesetting. It looks like meaningless Latin and is used to preview the amount of text and the overall layout before real content is ready.',
      },
      {
        term: 'Placeholder text (dummy text)',
        description:
          'Text used as a stand-in while the real content is not yet finalized, so you can check layout and text length. It carries no real meaning and is meant to be replaced with the final copy later.',
      },
      {
        term: 'Typesetting',
        description:
          'Adjusting font size, line spacing, and margins to make text readable. Flowing in placeholder text lets you check typesetting before the real copy is available.',
      },
    ],
  },
};
