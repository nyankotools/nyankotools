import type { Locale } from '../../data/tools';

export interface WordFrequencyPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  unitLabel: string;
  unitChar: string;
  unitWord: string;
  /** 既定の数える単位（言語に合わせる） */
  defaultUnit: 'char' | 'word';
  ignoreCaseLabel: string;
  skipSymbolsLabel: string;
  topNLabel: string;
  topNHint: string;
  /** `{total}` `{unique}` を置換して使うテンプレート */
  summaryTemplate: string;
  emptyMessage: string;
  columnRank: string;
  columnItem: string;
  columnCount: string;
  columnPercent: string;
  resultCaption: string;
  copyCsvButton: string;
  downloadCsvButton: string;
  copied: string;
  copyFailed: string;
  downloaded: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
}

export const wordFrequencyContent: Record<Locale, WordFrequencyPageContent> = {
  ja: {
    title: '単語・文字の出現頻度カウント',
    description:
      'テキストに含まれる文字や単語の出現回数・割合をランキング表示し、上位N件の絞り込みやCSV出力もできる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '単語・文字の出現頻度カウント',
    introHtml:
      '文章に何度も出てくる文字や単語を、回数の多い順に一覧にします。日本語は文字単位、英語は単語単位での集計に向いており、文章のクセの確認やキーワードの洗い出しに使えます。全体の文字数や行数を知りたい場合は<a href="/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字数カウント</a>、2つの文章の違いを比べたい場合は<a href="/tools/text-diff/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">テキスト差分比較</a>もご利用ください。入力した内容はブラウザ内で処理され、サーバーに送信されることはありません。',
    inputLabel: 'テキスト',
    inputPlaceholder: '集計したい文章を貼り付けてください',
    sampleText:
      'The quick brown fox jumps over the lazy dog. The dog sleeps, and the fox runs.\n吾輩は猫である。名前はまだ無い。',
    unitLabel: '数える単位',
    unitChar: '文字単位（日本語向け）',
    unitWord: '単語単位（英語向け）',
    defaultUnit: 'char',
    ignoreCaseLabel: '大文字・小文字を区別しない',
    skipSymbolsLabel: '空白・記号を除く（文字単位）',
    topNLabel: '表示する上位件数',
    topNHint: '0または空欄で全件を表示します。',
    summaryTemplate: '合計 {total} 件 / {unique} 種類',
    emptyMessage: '集計できる文字・単語がありません。',
    columnRank: '順位',
    columnItem: '文字・単語',
    columnCount: '回数',
    columnPercent: '割合',
    resultCaption: '出現頻度ランキング',
    copyCsvButton: 'CSVをコピー',
    downloadCsvButton: 'CSVをダウンロード',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    downloaded: 'ダウンロードしました',
    howToHeading: '使い方',
    howToSteps: [
      '「テキスト」に集計したい文章を貼り付けます。',
      '「数える単位」で文字単位か単語単位かを選びます。',
      '「表示する上位件数」を指定すると、回数の多い順に絞り込めます。',
      '結果の表を確認し、必要なら「CSVをコピー」または「CSVをダウンロード」で書き出します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '文字単位では、絵文字や結合文字も見た目の1文字として数えます。空白・句読点・記号は初期設定で除外されます。',
      '単語単位の分割にはブラウザの単語分割機能を使うため、日本語の文章でも単語に近い単位で数えられます。ブラウザによって分割結果が異なる場合があります。',
      '回数が同じ項目は、テキスト内で先に現れた順に並びます。割合は、除外後の合計に対する比率です。',
      '助詞や英語のtheのような頻出語も除外せず、そのまま数えます。',
      'CSVは先頭がカンマ区切りのヘッダ行で、改行はCRLFです。表計算ソフトで数式として扱われないよう、先頭が = + - @ のいずれかの項目には、先頭にアポストロフィを付けて出力します。',
    ],
  },
  en: {
    title: 'Word Frequency Counter',
    description:
      'Count how often each word or character appears in your text, rank the top results and export them as CSV. Runs in your browser; nothing is uploaded.',
    h1: 'Word and Character Frequency Counter',
    introHtml:
      'Paste any text to see which words or characters appear most often, ranked with counts and percentages. Use word mode for English and character mode for Japanese or Chinese. Handy for spotting repeated words in a draft or pulling out keywords. For overall length, try the <a href="/en/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Character Counter</a>; to compare two versions of a text, use the <a href="/en/tools/text-diff/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Text Diff Checker</a>. Your text is processed in the browser and never sent to a server.',
    inputLabel: 'Text',
    inputPlaceholder: 'Paste the text you want to analyze',
    sampleText:
      'The quick brown fox jumps over the lazy dog. The dog sleeps, and the fox runs.\n吾輩は猫である。名前はまだ無い。',
    unitLabel: 'Count by',
    unitChar: 'Characters (for Japanese)',
    unitWord: 'Words (for English)',
    defaultUnit: 'word',
    ignoreCaseLabel: 'Ignore case',
    skipSymbolsLabel: 'Skip spaces and symbols (character mode)',
    topNLabel: 'Top results',
    topNHint: 'Enter 0 or leave blank to show everything.',
    summaryTemplate: '{total} total / {unique} unique',
    emptyMessage: 'There are no characters or words to count.',
    columnRank: 'Rank',
    columnItem: 'Character / word',
    columnCount: 'Count',
    columnPercent: 'Share',
    resultCaption: 'Frequency ranking',
    copyCsvButton: 'Copy CSV',
    downloadCsvButton: 'Download CSV',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    downloaded: 'Downloaded',
    howToHeading: 'How to use',
    howToSteps: [
      'Paste your text into "Text".',
      'Choose characters or words under "Count by".',
      'Set "Top results" to keep only the most frequent items.',
      'Check the table, then export it with "Copy CSV" or "Download CSV" if you need it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'In character mode, emoji and combined characters count as one visible character. Spaces, punctuation and symbols are skipped by default.',
      "Words are split with the browser's word segmentation, so Japanese text is also counted in word-like units. Results can vary slightly between browsers.",
      'Items with the same count are listed in the order they first appear. Shares are relative to the total after exclusions.',
      'Common words such as English articles and Japanese particles, are not filtered out.',
      "The CSV has a comma-separated header row and CRLF line endings. Items starting with =, +, - or @ get a leading ' so spreadsheets do not treat them as formulas.",
    ],
  },
};
