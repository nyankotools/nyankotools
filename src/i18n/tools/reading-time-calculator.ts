import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export interface ReadingTimeCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  settingsLabel: string;
  jaSpeedLabel: string;
  jaSpeedUnit: string;
  enSpeedLabel: string;
  enSpeedUnit: string;
  manuscriptLabel: string;
  manuscriptOptions: SelectOption[];
  lineBreakLabel: string;
  statNonSpaceChars: string;
  statJaChars: string;
  statEnWords: string;
  statReadingTime: string;
  statSpeakingTime: string;
  statManuscript: string;
  /** {m} {s} を置換する */
  timeMinSec: string;
  /** {s} を置換する */
  timeSecOnly: string;
  /** {sheets} を置換する */
  manuscriptValue: string;
  /** {rows} {ceil} を置換する */
  manuscriptSub: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const readingTimeCalculatorContent: Record<
  Locale,
  ReadingTimeCalculatorPageContent
> = {
  ja: {
    title: '読了時間・原稿用紙換算ツール（文字数から計算）',
    description:
      '文章を貼り付けるだけで、読了時間・朗読にかかる時間・原稿用紙（400字詰め・200字詰め）の枚数を計算できる無料ツールです。日本語と英語の混在文にも対応し、読む速さも調整できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '読了時間・原稿用紙換算ツール',
    introHtml:
      '文章を貼り付けると、読むのにかかる時間・声に出して話す時間・原稿用紙に換算した枚数がわかります。ブログ記事の目安時間や、スピーチ原稿の長さ、作文の枚数確認に使えます。文字数や行数だけ知りたい場合は <a href="/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字数カウント</a> をご利用ください。',
    inputLabel: '文章',
    inputPlaceholder: '計算したい文章を貼り付け',
    sampleText:
      '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。',
    settingsLabel: '設定',
    jaSpeedLabel: '日本語の読む速さ',
    jaSpeedUnit: '字/分',
    enSpeedLabel: '英語の読む速さ',
    enSpeedUnit: '語/分',
    manuscriptLabel: '原稿用紙',
    manuscriptOptions: [
      { value: '400', label: '400字詰め（20字×20行）' },
      { value: '200', label: '200字詰め（20字×10行）' },
    ],
    lineBreakLabel: '改行ごとに行を改める',
    statNonSpaceChars: '文字数（空白・改行を除く）',
    statJaChars: '日本語の文字数',
    statEnWords: '英単語数',
    statReadingTime: '読了時間',
    statSpeakingTime: '朗読・スピーチの時間',
    statManuscript: '原稿用紙',
    timeMinSec: '{m}分{s}秒',
    timeSecOnly: '{s}秒',
    manuscriptValue: '{sheets}枚',
    manuscriptSub: '{rows}行・切り上げて{ceil}枚',
    notesHeading: '注意事項',
    notes: [
      '読了時間は「日本語の文字数 ÷ 日本語の読む速さ + 英単語数 ÷ 英語の読む速さ」で計算しています。日本語は1分あたり500字前後が一般的な目安ですが、文章の難しさや読み手によって大きく変わります。',
      '朗読・スピーチの時間は、日本語を1分あたり300字、英語を1分あたり130語として計算した目安で、速さは変更できません。',
      '日本語の文字数には、かな・漢字・全角の記号を数えます。半角の英数字は単語として数え、半角の記号は数えません。',
      '原稿用紙は1行20字として、半角文字も1文字（1マス）で数えます。「改行ごとに行を改める」をオンにすると、改行のたびに行頭から書き始めた場合の行数で換算します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '読了時間',
        description:
          '文章を黙読して読み終えるまでにかかる時間の目安です。一般に日本語は1分あたり400〜600字程度とされます。',
      },
      {
        term: '原稿用紙（400字詰め・200字詰め）',
        description:
          '1行20字のマス目に文章を書く日本の用紙です。1枚に20行（400字詰め）または10行（200字詰め）あり、作文やコンクールなどの規定枚数の換算に使われます。',
      },
    ],
  },
  en: {
    title: 'Reading Time & Manuscript Page Calculator',
    description:
      'Estimate reading time, speaking time and Japanese manuscript paper sheets from pasted text. Adjustable speed. Runs in your browser; nothing is sent to a server.',
    h1: 'Reading Time & Manuscript Page Calculator',
    introHtml:
      'Paste your text to see how long it takes to read, how long it takes to say aloud, and how many sheets of Japanese manuscript paper (genkō yōshi) it fills. Useful for blog post read times, speech lengths and Japanese essay page limits. English words and Japanese characters are counted separately, so mixed text works too. If you only need counts, try the <a href="/en/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Character Counter</a>.',
    inputLabel: 'Text',
    inputPlaceholder: 'Paste the text to measure',
    sampleText:
      'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity.',
    settingsLabel: 'Settings',
    jaSpeedLabel: 'Japanese reading speed',
    jaSpeedUnit: 'chars/min',
    enSpeedLabel: 'English reading speed',
    enSpeedUnit: 'words/min',
    manuscriptLabel: 'Manuscript paper',
    manuscriptOptions: [
      { value: '400', label: '400 characters (20 × 20)' },
      { value: '200', label: '200 characters (20 × 10)' },
    ],
    lineBreakLabel: 'Start a new row at each line break',
    statNonSpaceChars: 'Characters (no spaces or line breaks)',
    statJaChars: 'Japanese characters',
    statEnWords: 'English words',
    statReadingTime: 'Reading time',
    statSpeakingTime: 'Speaking time',
    statManuscript: 'Manuscript paper',
    timeMinSec: '{m} min {s} sec',
    timeSecOnly: '{s} sec',
    manuscriptValue: '{sheets} sheets',
    manuscriptSub: '{rows} rows · {ceil} sheets rounded up',
    notesHeading: 'Notes',
    notes: [
      'Reading time is calculated as Japanese characters ÷ Japanese reading speed + English words ÷ English reading speed. Around 500 Japanese characters per minute is a common guideline, but it varies widely with the difficulty of the text and the reader.',
      'Speaking time assumes 300 Japanese characters or 130 English words per minute. It is a rough guide and the speed cannot be changed.',
      'Japanese characters means kana, kanji and full-width symbols. Half-width letters and digits are counted as words, and half-width symbols are not counted.',
      'Manuscript paper uses 20 characters per row and counts half-width characters as one cell each. Turn on "Start a new row at each line break" to count rows as if each line break starts a fresh row.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Reading time',
        description:
          'An estimate of how long it takes to read a text silently. Japanese is generally read at about 400 to 600 characters per minute, English at roughly 200 to 250 words per minute.',
      },
      {
        term: 'Manuscript paper (genkō yōshi)',
        description:
          'Japanese writing paper with a grid of 20 cells per row. A sheet has 20 rows (400-character) or 10 rows (200-character), and page limits for essays and contests are often given in sheets.',
      },
    ],
  },
};
