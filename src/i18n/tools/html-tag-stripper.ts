import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface HtmlTagStripperPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  optionsLabel: string;
  optKeepBlockBreaks: string;
  optCollapseWhitespace: string;
  optCompressBlankLines: string;
  optKeepLinkUrls: string;
  optKeepImageAlt: string;
  optDecodeEntities: string;
  outputLabel: string;
  /** {before} {after} を置換する */
  stats: string;
  copy: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const htmlTagStripperContent: Record<
  Locale,
  HtmlTagStripperPageContent
> = {
  ja: {
    title: 'HTMLタグ除去・プレーンテキスト抽出ツール',
    description:
      'HTMLからタグを取り除いてプレーンテキストだけを取り出す無料ツールです。ブロック要素の改行保持、空白・空行の圧縮、リンクURLの併記、文字参照のデコードに対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'HTMLタグ除去・プレーンテキスト抽出ツール',
    introHtml:
      'HTMLソースやメール本文からタグを取り除き、読める文章だけを取り出します。script・style・コメントは中身ごと除去し、HTMLは実行も描画もしません。タグを文字として表示したいときは <a href="/tools/html-escape/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTMLエスケープ</a> をご利用ください。',
    inputLabel: 'HTML',
    inputPlaceholder: 'HTMLを貼り付け',
    sampleText:
      '<h1>お知らせ</h1>\n<p>新機能を公開しました。<br>詳しくは<a href="https://example.com/news">こちら</a>をご覧ください。</p>\n<ul><li>速度&amp;安定性の向上</li><li>不具合の修正</li></ul>\n<script>alert(1)</script>',
    optionsLabel: '変換オプション',
    optKeepBlockBreaks: 'ブロック要素・br の位置で改行する',
    optCollapseWhitespace: '連続する空白をまとめ、行頭行末の空白を削る',
    optCompressBlankLines: '連続する空行を1つにまとめる',
    optKeepLinkUrls: 'リンクのURLを残す',
    optKeepImageAlt: '画像の代替テキスト（alt）を残す',
    optDecodeEntities: '文字参照（&amp; など）をデコードする',
    outputLabel: 'プレーンテキスト',
    stats: '{before}文字 → {after}文字',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      'HTMLを実行・描画せず、文字列として解析します。ブラウザのDOMには挿入しないため、貼り付けたスクリプトが動くことはありません。',
      '実際の表示とは異なる場合があります。CSSによる表示・非表示（display:none など）や、JavaScriptで後から挿入される内容は反映されません。',
      'script・style・template・noscript・head の中身は除去します。title なども出力されません。',
      '文字参照は主要な名前付き参照と数値参照に対応しています。未対応の名前はそのまま残ります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '文字参照（HTMLエンティティ）',
        description:
          '&amp; や &#12354; のように、HTML中で特殊な文字や記号を表す書き方です。デコードすると & や「あ」などの実際の文字に戻ります。',
      },
      {
        term: 'ブロック要素',
        description:
          'p・div・li・h1 など、前後で改行されて表示される要素です。このツールでは、これらの位置を改行として残せます。',
      },
    ],
  },
  en: {
    title: 'HTML Tag Stripper - Extract Plain Text from HTML',
    description:
      'Strip HTML tags and extract plain text. Keep line breaks and link URLs, collapse whitespace, decode entities. Runs in your browser; nothing is sent to a server.',
    h1: 'HTML Tag Stripper & Plain Text Extractor',
    introHtml:
      'Paste HTML source or an email body to remove the tags and keep only readable text. Scripts, styles and comments are dropped, and the HTML is never executed or rendered. To show tags as literal text instead, use the <a href="/en/tools/html-escape/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTML Escape</a> tool.',
    inputLabel: 'HTML',
    inputPlaceholder: 'Paste HTML here',
    sampleText:
      '<h1>News</h1>\n<p>We shipped new features.<br>See <a href="https://example.com/news">the details</a> for more.</p>\n<ul><li>Faster &amp; more stable</li><li>Bug fixes</li></ul>\n<script>alert(1)</script>',
    optionsLabel: 'Options',
    optKeepBlockBreaks: 'Break lines at block elements and <br>',
    optCollapseWhitespace: 'Collapse whitespace and trim line ends',
    optCompressBlankLines: 'Merge consecutive blank lines',
    optKeepLinkUrls: 'Keep link URLs',
    optKeepImageAlt: 'Keep image alt text',
    optDecodeEntities: 'Decode entities (&amp; etc.)',
    outputLabel: 'Plain text',
    stats: '{before} chars → {after} chars',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'The HTML is parsed as a string and never executed or rendered. It is not inserted into the page DOM, so pasted scripts cannot run.',
      'The result can differ from what a browser shows. CSS visibility (such as display:none) and content added later by JavaScript are not taken into account.',
      'The contents of script, style, template, noscript and head (including title) are removed.',
      'Common named entities and numeric references are decoded. Unknown names are left as they are.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'HTML entity',
        description:
          'A way to write special characters in HTML, such as &amp; or &#12354;. Decoding turns them back into the real characters, like & or あ.',
      },
      {
        term: 'Block element',
        description:
          'An element such as p, div, li or h1 that starts on its own line when displayed. This tool can keep those positions as line breaks.',
      },
    ],
  },
};
