import type { Locale } from '../../data/tools';
import type { MimeCategory } from '../../lib/tools/mime-type-lookup';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface MimeTypeLookupPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  modeLabel: string;
  modeAuto: string;
  modeExtension: string;
  modeMime: string;
  categoryLabel: string;
  categoryAll: string;
  categories: Record<MimeCategory, string>;
  exactHeading: string;
  partialHeading: string;
  /** {shown}, {total} を置換する */
  partialLimited: string;
  /** 検索語の判別結果。{kind}, {query} を置換する */
  detectedAs: string;
  kindExtension: string;
  kindMime: string;
  colMime: string;
  colExtensions: string;
  colCategory: string;
  colContentType: string;
  noExtensions: string;
  noResult: string;
  hintEmpty: string;
  wildcardNotice: string;
  /** {suffix} を置換する */
  suffixNotice: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** コピーボタンの aria-label の接頭辞（後ろに MIME タイプを付ける） */
  copyAria: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const categoriesJa: Record<MimeCategory, string> = {
  web: 'Web',
  text: 'テキスト',
  data: 'データ',
  image: '画像',
  audio: '音声',
  video: '動画',
  document: '文書',
  archive: 'アーカイブ',
  font: 'フォント',
  executable: '実行ファイル',
  model: '3Dモデル',
  other: 'その他',
};

const categoriesEn: Record<MimeCategory, string> = {
  web: 'Web',
  text: 'Text',
  data: 'Data',
  image: 'Image',
  audio: 'Audio',
  video: 'Video',
  document: 'Document',
  archive: 'Archive',
  font: 'Font',
  executable: 'Executable',
  model: '3D model',
  other: 'Other',
};

export const mimeTypeLookupContent: Record<Locale, MimeTypeLookupPageContent> =
  {
    ja: {
      title: 'MIMEタイプ（Content-Type）検索｜拡張子との相互変換',
      description:
        '拡張子からMIMEタイプ（Content-Type）を、MIMEタイプから拡張子を調べられる無料の早見表ツールです。画像・音声・動画・文書・フォント・アーカイブなどを収録し、部分一致検索にも対応。ブラウザ内で処理され、入力はサーバーに送信されません。',
      h1: 'MIMEタイプ（Content-Type）検索 ⇔ 拡張子',
      introHtml:
        '拡張子（.png・.pdf・.json など）からMIMEタイプ（Content-Type）を、MIMEタイプから対応する拡張子を調べるツールです。入力に「/」が含まれていればMIMEタイプ、無ければ拡張子として自動で判別します。「image/*」のような指定や、部分一致の一覧検索もできます。ファイルの中身から形式を調べたいときは <a href="/tools/file-type-detector/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ファイル種別判定</a>、レスポンスヘッダー全体の確認には <a href="/tools/http-header-analyzer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTTPヘッダー解析</a> をご利用ください。',
      inputLabel: '拡張子またはMIMEタイプ',
      inputPlaceholder: '例: png / .pdf / application/json / image/*',
      modeLabel: '検索モード',
      modeAuto: '自動判別',
      modeExtension: '拡張子',
      modeMime: 'MIMEタイプ',
      categoryLabel: '分類で絞り込み',
      categoryAll: 'すべて',
      categories: categoriesJa,
      exactHeading: '完全一致',
      partialHeading: '部分一致',
      partialLimited: '{total}件中、先頭の{shown}件を表示しています。',
      detectedAs: '「{query}」を{kind}として検索しました。',
      kindExtension: '拡張子',
      kindMime: 'MIMEタイプ',
      colMime: 'MIMEタイプ',
      colExtensions: '拡張子',
      colCategory: '分類',
      colContentType: 'Content-Type の例',
      noExtensions: '（なし）',
      noResult:
        '該当するものが見つかりませんでした。検索語を短くするか、検索モードや分類を変えてみてください。',
      hintEmpty:
        '拡張子またはMIMEタイプを入力してください。入力が空でも、分類を選ぶとその一覧を表示します。',
      wildcardNotice:
        '「type/*」の指定のため、その種別に属するMIMEタイプをすべて表示しています。',
      suffixNotice:
        '登録されていないMIMEタイプです。「+{suffix}」で終わるため、{suffix}形式として扱われる構造化サフィックス付きの形式と考えられます。',
      copy: 'コピー',
      copied: 'コピーしました',
      copyFailed: 'コピーに失敗しました',
      copyAria: 'MIMEタイプをコピー:',
      howToHeading: '使い方',
      howToSteps: [
        '入力欄に拡張子（例: png）またはMIMEタイプ（例: image/png）を入力します。',
        '自動判別で意図と違う場合は、検索モードを「拡張子」「MIMEタイプ」に切り替えます。',
        '完全一致と部分一致の一覧から、必要なMIMEタイプや拡張子を確認し、コピーボタンで取り込みます。',
        '分類を選ぶと、画像・音声・動画などの種別ごとに絞り込めます。',
      ],
      notesHeading: '注意事項',
      notes: [
        '収録しているのは主要なWeb・画像・音声・動画・文書・アーカイブ・フォントなどの代表的な形式です。すべてのMIMEタイプを網羅しているわけではありません。',
        '同じ拡張子に複数のMIMEタイプが割り当てられている場合は、すべて表示します（例: xml は application/xml と text/xml）。実際にどれを使うかは用途やサーバーの設定によります。',
        'このツールは拡張子とMIMEタイプの対応表を引くだけで、ファイルの中身は調べません。ファイルが本当にその形式かは確認できません。',
        '「Content-Type の例」は text/* に charset=utf-8 を付けた一般的な書き方です。文字コードは実際のファイルに合わせて変更してください。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'MIMEタイプ',
          description:
            '「image/png」のように「種別/サブ種別」の形でデータの種類を表す識別子です。メディアタイプとも呼ばれ、IANAが登録を管理しています。',
        },
        {
          term: 'Content-Type',
          description:
            'HTTPレスポンスやリクエストのヘッダーで、本文の種類を伝える項目です。「text/html; charset=utf-8」のようにMIMEタイプの後ろに文字コードなどのパラメータを付けられます。',
        },
        {
          term: '構造化サフィックス',
          description:
            '「application/ld+json」の「+json」のように、MIMEタイプの末尾でデータの記述形式（JSONやXMLなど）を示す部分です。',
        },
        {
          term: 'application/octet-stream',
          description:
            '種類が不明な任意のバイナリデータを表す汎用のMIMEタイプです。ブラウザはこの種別を受け取ると、表示せずにダウンロードとして扱うのが一般的です。',
        },
      ],
    },
    en: {
      title: 'MIME Type Lookup: File Extension to Content-Type and Back',
      description:
        'Look up the MIME type (Content-Type) for a file extension, or the extensions for a MIME type, with partial-match search. Runs in your browser.',
      h1: 'MIME Type (Content-Type) Lookup ⇔ File Extension',
      introHtml:
        'Find the MIME type (Content-Type) for an extension such as .png, .pdf, or .json, or the extensions that belong to a MIME type. Input containing a slash is treated as a MIME type and anything else as an extension. Wildcards like image/* and partial-match search are supported. To identify a file from its actual bytes, use the <a href="/en/tools/file-type-detector/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">File Type Detector</a>; to inspect whole response headers, use the <a href="/en/tools/http-header-analyzer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTTP Header Analyzer</a>.',
      inputLabel: 'File extension or MIME type',
      inputPlaceholder: 'e.g. png / .pdf / application/json / image/*',
      modeLabel: 'Search mode',
      modeAuto: 'Auto-detect',
      modeExtension: 'Extension',
      modeMime: 'MIME type',
      categoryLabel: 'Filter by category',
      categoryAll: 'All',
      categories: categoriesEn,
      exactHeading: 'Exact matches',
      partialHeading: 'Partial matches',
      partialLimited: 'Showing the first {shown} of {total} results.',
      detectedAs: 'Searched “{query}” as a {kind}.',
      kindExtension: 'file extension',
      kindMime: 'MIME type',
      colMime: 'MIME type',
      colExtensions: 'Extensions',
      colCategory: 'Category',
      colContentType: 'Content-Type example',
      noExtensions: '(none)',
      noResult:
        'No matches found. Try a shorter query, or change the search mode or category.',
      hintEmpty:
        'Enter a file extension or MIME type. With an empty input, choosing a category lists everything in it.',
      wildcardNotice:
        'Because you used “type/*”, every MIME type under that top-level type is listed.',
      suffixNotice:
        'This MIME type is not in the table. Because it ends in “+{suffix}”, it is probably a structured-syntax type whose content is {suffix}.',
      copy: 'Copy',
      copied: 'Copied',
      copyFailed: 'Copy failed',
      copyAria: 'Copy MIME type:',
      howToHeading: 'How to use',
      howToSteps: [
        'Type a file extension (e.g. png) or a MIME type (e.g. image/png) into the input.',
        'If auto-detect guesses wrong, switch the search mode to Extension or MIME type.',
        'Check the exact and partial matches, and use the copy button to grab the value you need.',
        'Pick a category to narrow the list to images, audio, video, and so on.',
      ],
      notesHeading: 'Notes',
      notes: [
        'The table holds the common web, image, audio, video, document, archive, and font types. It is not an exhaustive copy of the IANA registry.',
        'When an extension maps to several MIME types, all of them are shown (for example xml maps to application/xml and text/xml). Which one to use depends on the context and your server configuration.',
        'The tool only looks up the extension/MIME table; it never inspects file contents, so it cannot confirm that a file really is the format its extension claims.',
        'The “Content-Type example” column adds charset=utf-8 to text/* types as a typical form. Adjust the charset to match your actual file.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'MIME type',
          description:
            'An identifier of the form type/subtype, such as image/png, that describes a kind of data. Also called a media type; IANA maintains the registry.',
        },
        {
          term: 'Content-Type',
          description:
            'An HTTP header that tells the receiver what kind of data the body contains. It can carry parameters after the MIME type, as in text/html; charset=utf-8.',
        },
        {
          term: 'Structured syntax suffix',
          description:
            'The “+json” in application/ld+json: a trailing part of a MIME type that names the underlying syntax, such as JSON or XML.',
        },
        {
          term: 'application/octet-stream',
          description:
            'A generic MIME type for arbitrary binary data of unknown kind. Browsers usually treat it as a download rather than displaying it.',
        },
      ],
    },
  };
