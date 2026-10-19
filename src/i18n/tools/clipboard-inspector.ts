import type { Locale } from '../../data/tools';
import type { MimeCategory } from '../../lib/tools/clipboard-inspector';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ClipboardInspectorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  pasteZoneLabel: string;
  pasteZoneHint: string;
  emptyMessage: string;
  summaryTemplate: string;
  typeLabel: string;
  sizeLabel: string;
  fileLabel: string;
  categoryLabels: Record<MimeCategory, string>;
  textStatsTemplate: string;
  htmlStatsTemplate: string;
  htmlScriptWarning: string;
  htmlFragmentNote: string;
  htmlSourceHeading: string;
  jsonPrettyHeading: string;
  uriListHeading: string;
  imagePreviewHeading: string;
  imageSizeTemplate: string;
  imageFailed: string;
  noFormats: string;
  copyAll: string;
  copyEntry: string;
  clearButton: string;
  copied: string;
  copyFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const clipboardInspectorContent: Record<
  Locale,
  ClipboardInspectorPageContent
> = {
  ja: {
    title: 'クリップボード確認ツール｜貼り付けデータのMIME・HTML・画像',
    description:
      '貼り付けたクリップボードのMIME種別、text/plain、HTMLソース（描画しません）、画像のプレビューとサイズ、ファイル一覧を表示。データはブラウザ内で処理されます。',
    h1: 'クリップボード内容確認ツール（MIME種別・HTML・画像）',
    introHtml:
      '下の貼り付け欄にフォーカスして Ctrl+V（Macは ⌘+V）を押すと、貼り付けイベントで受け取ったクリップボードの全形式を一覧表示します。text/plain・text/html などのMIME種別、各形式の中身とサイズ、画像のプレビューと寸法、ファイルの名前と種類を確認できます。HTMLはソースのテキストとして表示するだけで、描画もスクリプト実行もしません。Webアプリの貼り付け処理の開発やデバッグに使えます。ブラウザ内で処理され、内容がサーバーに送信されることはありません。HTMLの特殊文字の変換は <a href="/tools/html-escape/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTMLエスケープ</a> をご利用ください。',
    pasteZoneLabel: '貼り付け欄',
    pasteZoneHint:
      'ここをクリックしてフォーカスし、Ctrl+V（⌘+V）で貼り付けてください',
    emptyMessage: 'まだ貼り付けられていません',
    summaryTemplate: '{n} 件の形式が見つかりました',
    typeLabel: 'MIME種別',
    sizeLabel: 'サイズ',
    fileLabel: 'ファイル名',
    categoryLabels: {
      text: 'テキスト',
      html: 'HTML',
      image: '画像',
      json: 'JSON',
      'uri-list': 'URL一覧',
      rtf: 'リッチテキスト（RTF）',
      file: 'ファイル',
      other: 'その他',
    },
    textStatsTemplate: '{chars} 文字 / {lines} 行 / {bytes}',
    htmlStatsTemplate:
      'タグ {tags} 個（画像 {images}・リンク {links}）。多いタグ: {top}',
    htmlScriptWarning:
      'scriptタグが含まれています。このツールはHTMLを描画しないため実行されません。',
    htmlFragmentNote:
      '<!--StartFragment--> マーカーを含んでいます（Windowsのブラウザ等からのコピー）。',
    htmlSourceHeading: 'HTMLソース（テキスト表示）',
    jsonPrettyHeading: '整形したJSON',
    uriListHeading: 'URL',
    imagePreviewHeading: 'プレビュー',
    imageSizeTemplate: '{w} × {h} px',
    imageFailed: '画像として読み込めませんでした',
    noFormats:
      'クリップボードにデータがありません（アプリによっては空で届くことがあります）',
    copyAll: '全体をコピー',
    copyEntry: 'この形式をコピー',
    clearButton: 'クリア',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    howToHeading: '使い方',
    howToSteps: [
      '調べたい内容を別のアプリやページでコピーします（画像・表・ファイルも可）。',
      '「貼り付け欄」をクリックしてフォーカスし、Ctrl+V（⌘+V）で貼り付けます。',
      'MIME種別ごとに中身、サイズ、画像のプレビューが表示されます。',
      '「この形式をコピー」または「全体をコピー」で内容を取り出せます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '表示されるのは貼り付けイベントで取得できる形式だけです。ブラウザやOSの仕様で、コピー元が持つ形式の一部が見えないことがあります。',
      'HTMLは常にテキストとして表示します。描画・スクリプト実行・外部リソースの読み込みは行いません。',
      '画像は貼り付けたデータをこのページ内でのみプレビューします。アップロードはされません。',
      '大きなテキストや画像は、表示とコピーに時間がかかることがあります。',
      'パスワードなどの機密情報が入っている場合があるため、画面共有中の貼り付けにご注意ください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'MIME種別',
        description:
          'データの形式を表す文字列です（例: text/plain、text/html、image/png）。クリップボードは同じ内容を複数の形式で同時に持てます。',
      },
      {
        term: 'DataTransfer',
        description:
          'pasteやdropイベントで渡される、クリップボードやドラッグ中のデータを扱うブラウザのオブジェクトです。types・items・filesから中身を取り出せます。',
      },
      {
        term: 'StartFragment',
        description:
          'Windowsのクリップボードでは、HTMLのコピー範囲を <!--StartFragment--> と <!--EndFragment--> で囲んで示します。',
      },
    ],
  },
  en: {
    title: 'Clipboard Inspector: View Pasted MIME Types, HTML, Images',
    description:
      'Paste to see each clipboard format: MIME types, text/plain, HTML source (never rendered), image previews and files. Runs in your browser; nothing is uploaded.',
    h1: 'Clipboard Inspector: See What You Pasted (MIME Types, HTML, Images)',
    introHtml:
      'Focus the paste area below and press Ctrl+V (⌘+V on Mac) to list every format the browser receives in the paste event. You get each MIME type such as text/plain and text/html, its contents and size, image previews with dimensions, and the names and types of any files. HTML is only shown as source text; it is never rendered or executed. Handy for building and debugging paste handling in web apps. Everything runs in your browser and nothing is sent to a server. To convert special characters in HTML, use the <a href="/en/tools/html-escape/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTML Escape</a> tool.',
    pasteZoneLabel: 'Paste area',
    pasteZoneHint: 'Click here to focus, then press Ctrl+V (⌘+V) to paste',
    emptyMessage: 'Nothing pasted yet',
    summaryTemplate: '{n} format(s) found',
    typeLabel: 'MIME type',
    sizeLabel: 'Size',
    fileLabel: 'File name',
    categoryLabels: {
      text: 'Text',
      html: 'HTML',
      image: 'Image',
      json: 'JSON',
      'uri-list': 'URL list',
      rtf: 'Rich text (RTF)',
      file: 'File',
      other: 'Other',
    },
    textStatsTemplate: '{chars} characters / {lines} lines / {bytes}',
    htmlStatsTemplate:
      '{tags} tags ({images} images, {links} links). Most common: {top}',
    htmlScriptWarning:
      'Contains a script tag. It is not executed because this tool never renders HTML.',
    htmlFragmentNote:
      'Contains <!--StartFragment--> markers (typical of copies from Windows browsers).',
    htmlSourceHeading: 'HTML source (shown as text)',
    jsonPrettyHeading: 'Formatted JSON',
    uriListHeading: 'URLs',
    imagePreviewHeading: 'Preview',
    imageSizeTemplate: '{w} × {h} px',
    imageFailed: 'Could not load this as an image',
    noFormats: 'The clipboard has no data (some apps deliver an empty paste)',
    copyAll: 'Copy everything',
    copyEntry: 'Copy this format',
    clearButton: 'Clear',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    howToHeading: 'How to use',
    howToSteps: [
      'Copy what you want to inspect in another app or page (images, tables and files work too).',
      'Click the "Paste area" to focus it, then press Ctrl+V (⌘+V).',
      'Each MIME type is listed with its contents, size and an image preview.',
      'Use "Copy this format" or "Copy everything" to take the data out.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Only the formats exposed by the paste event are shown. Depending on the browser and OS, some formats the source holds may not be visible.',
      'HTML is always shown as text. It is never rendered, executed, or used to load external resources.',
      'Pasted images are previewed only inside this page. Nothing is uploaded.',
      'Very large text or images can be slow to display and copy.',
      'The clipboard may contain secrets such as passwords, so be careful when pasting during a screen share.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'MIME type',
        description:
          'A string naming a data format, such as text/plain, text/html or image/png. The clipboard can hold the same content in several formats at once.',
      },
      {
        term: 'DataTransfer',
        description:
          'The browser object passed to paste and drop events that exposes clipboard or drag data through types, items and files.',
      },
      {
        term: 'StartFragment',
        description:
          'On the Windows clipboard, the copied part of an HTML document is wrapped in <!--StartFragment--> and <!--EndFragment--> comments.',
      },
    ],
  },
};
