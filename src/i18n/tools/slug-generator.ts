import type { Locale } from '../../data/tools';

export interface SlugGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  outputLabel: string;
  separatorLabel: string;
  separatorHyphen: string;
  separatorUnderscore: string;
  kanaLabel: string;
  kanjiLabel: string;
  kanjiRemove: string;
  kanjiKeep: string;
  maxLengthLabel: string;
  maxLengthHint: string;
  cutAtWordLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  emptyHint: string;
  notesHeading: string;
  notes: string[];
}

export const slugGeneratorContent: Record<Locale, SlugGeneratorPageContent> = {
  ja: {
    title: 'URLスラッグ生成 - 日本語をローマ字のスラッグに変換',
    description:
      '記事タイトルなどの日本語を、URLに使えるローマ字・英数字とハイフンのスラッグに変換する無料ツールです。記号除去・文字数制限に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'URLスラッグ生成（日本語→ローマ字・英数ハイフン）',
    introHtml:
      '記事タイトルや商品名を入力すると、ひらがな・カタカナをローマ字に直し、記号を取り除いてハイフン区切りのスラッグにします。最大文字数の指定や、複数行の一括変換にも対応しています。変数名向けの命名規則変換は<a href="/tools/text-case-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">テキストケース変換</a>、かなとローマ字の相互変換だけを行いたい場合は<a href="/tools/romaji-kana-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ローマ字⇔ひらがな変換</a>をご利用ください。',
    inputLabel: '入力（1行につき1つのスラッグ）',
    inputPlaceholder: '例: 今日のラーメン日記 2024',
    sampleText: 'ふわふわパンケーキの作り方\nHello, World! 2024',
    outputLabel: '生成されたスラッグ',
    separatorLabel: '区切り文字',
    separatorHyphen: 'ハイフン（-）',
    separatorUnderscore: 'アンダースコア（_）',
    kanaLabel: 'ひらがな・カタカナをローマ字にする',
    kanjiLabel: '漢字の扱い',
    kanjiRemove: '取り除く',
    kanjiKeep: 'そのまま残す',
    maxLengthLabel: '最大文字数',
    maxLengthHint: '0 で無制限',
    cutAtWordLabel: '単語の途中で切らず、区切りの位置で切る',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    emptyHint: '入力するとここにスラッグが表示されます',
    notesHeading: '注意事項',
    notes: [
      '漢字は読み方を判定できないため、ローマ字にはできません。「取り除く」では漢字部分が消え、「そのまま残す」では漢字が残るため、URLではパーセントエンコードされた長い文字列になります。漢字を含むタイトルは、英語やローマ字に書き直して入力するのがおすすめです。',
      "ひらがな・カタカナはヘボン式で変換し、長音（ー）と「ん」の区切り記号（'）は省いて出力します。助詞の「は」「を」も表記どおり ha・o になります。",
      '全角英数字と半角カナは正規化してから変換します。ハングルやキリル文字など、英数字と漢字以外の文字は区切りとして扱われ、取り除かれます。',
      'スラッグはすべて小文字になり、英数字と区切り文字以外の記号は取り除かれます。',
    ],
  },
  en: {
    title: 'URL Slug Generator - Japanese to Romaji, Hyphenated',
    description:
      'Turn titles, including Japanese, into clean URL slugs: kana to romaji, symbols stripped, hyphen-separated, with a length limit. Runs in your browser only.',
    h1: 'URL Slug Generator (Japanese to Romaji, Hyphenated)',
    introHtml:
      'Enter an article title or product name and get a URL-safe slug: hiragana and katakana become romaji, symbols are removed, and words are joined with hyphens. You can cap the length and convert many lines at once. For variable-name styles, use the <a href="/en/tools/text-case-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Text Case Converter</a>; for plain kana and romaji conversion, try the <a href="/en/tools/romaji-kana-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Romaji ⇔ Hiragana Converter</a>.',
    inputLabel: 'Input (one slug per line)',
    inputPlaceholder: 'e.g. My First Post: Hello, World! 2024',
    sampleText: 'ふわふわパンケーキの作り方\nHello, World! 2024',
    outputLabel: 'Generated slug',
    separatorLabel: 'Separator',
    separatorHyphen: 'Hyphen (-)',
    separatorUnderscore: 'Underscore (_)',
    kanaLabel: 'Convert hiragana and katakana to romaji',
    kanjiLabel: 'Kanji',
    kanjiRemove: 'Remove',
    kanjiKeep: 'Keep as is',
    maxLengthLabel: 'Max length',
    maxLengthHint: '0 means no limit',
    cutAtWordLabel: 'Cut at a separator instead of mid-word',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    emptyHint: 'The slug appears here as you type',
    notesHeading: 'Notes',
    notes: [
      'Kanji cannot be romanized because their readings depend on context. "Remove" drops them; "Keep as is" leaves them in, which turns into a long percent-encoded string in a URL. For titles with kanji, rewrite them in English or romaji first.',
      'Kana is converted with Hepburn romanization. Long vowel marks and the apostrophe after n are omitted, and particles are spelled as written (ha, o).',
      'Full-width letters and digits and half-width katakana are normalized first. Characters other than letters, digits and kanji, such as Hangul or Cyrillic, are treated as separators and removed.',
      'Slugs are lowercase, and any symbol other than letters, digits and the separator is removed.',
    ],
  },
};
