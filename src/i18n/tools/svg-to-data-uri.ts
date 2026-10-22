import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SvgToDataUriPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  methodLabel: string;
  methodUrl: string;
  methodBase64: string;
  layoutLabel: string;
  previewHeading: string;
  cssHeading: string;
  uriHeading: string;
  copyCssButton: string;
  copyUriButton: string;
  copied: string;
  copyFailed: string;
  /** `{original}` `{output}` `{ratio}` を置換して使うテンプレート */
  statsTemplate: string;
  errorNotSvg: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const SAMPLE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#2563eb"/><path d="M7 12l3 3 7-7" fill="none" stroke="#fff" stroke-width="2"/></svg>';

export const svgToDataUriContent: Record<Locale, SvgToDataUriPageContent> = {
  ja: {
    title: 'SVG→Data URI変換（CSS background-image用エンコード）',
    description:
      'SVGコードをData URIに変換し、CSSのbackground-image用コードを出力。最小限のURLエスケープとBase64を選べ、プレビューも確認できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'SVG→Data URI変換（CSS背景用エンコード）',
    introHtml:
      'SVGコードを貼り付けると、CSSの <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">background-image: url("data:image/svg+xml,...")</code> にそのまま使えるData URIを生成します。外部ファイルを増やさずにアイコンや模様を埋め込めます。Base64化する文字列変換は <a href="/tools/base64/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Base64エンコード/デコード</a>、ビットマップ画像の場合は <a href="/tools/image-to-base64/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像のBase64変換</a>、SVGで作る繰り返し模様は <a href="/tools/css-pattern-background/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSSパターン背景ジェネレーター</a> が便利です。',
    howToHeading: '使い方',
    howToSteps: [
      '「SVGコード」欄にSVGを貼り付けます。',
      '「方式」でURLエンコード（軽量）かBase64を選びます。',
      'プレビューで見た目を確認します。必要なら「背景の配置指定も出力」にチェックします。',
      '「CSSをコピー」または「Data URIをコピー」で結果を取り出します。',
    ],
    inputLabel: 'SVGコード',
    inputPlaceholder: '<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>',
    sampleText: SAMPLE_SVG,
    methodLabel: '方式',
    methodUrl: 'URLエンコード（軽量）',
    methodBase64: 'Base64',
    layoutLabel: '背景の配置指定も出力',
    previewHeading: 'プレビュー',
    cssHeading: 'CSS（background-image）',
    uriHeading: 'Data URI',
    copyCssButton: 'CSSをコピー',
    copyUriButton: 'Data URIをコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    statsTemplate:
      '元のSVG {original}バイト → Data URI {output}文字（{ratio}%）',
    errorNotSvg:
      'SVGとして解釈できませんでした。<svg ...> から </svg> までを含めて貼り付けてください。',
    notesHeading: '注意点',
    notes: [
      'URLエンコードは % # < > バックスラッシュ と引用符、日本語などの非ASCII文字だけをエスケープする方式で、Base64より短くなることがほとんどです。ただし文字列としては読みにくくなります。',
      'Base64方式は元のサイズの約1.33倍になり、gzipの圧縮も効きにくいため、SVGが小さい場合や互換性を優先する場合に向いています。',
      'xmlns（名前空間）が無いSVGは背景画像として表示されないため、自動で補います。XML宣言・DOCTYPE・コメントは取り除き、空白を詰めます。',
      '出力はCSSの二重引用符 url("...") で囲む前提です。SVG内の二重引用符は単一引用符（または %22）に置き換えます。HTMLの属性にそのまま貼る場合は、&amp; などのHTMLエスケープに注意してください。',
      '背景画像として読み込まれたSVG内のスクリプトや外部リソースは実行・取得されませんが、色を変えたい場合は fill などをエンコード前に書き換えてください。',
      'すべての処理はブラウザ内で完結し、貼り付けたSVGがサーバーに送信されることはありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Data URI',
        description:
          '`data:image/svg+xml,...` のように、データそのものをURLの形で埋め込む方式です。別ファイルを取りに行かずに済み、CSSの`url()`や`<img src>`に直接指定できます。',
      },
      {
        term: 'パーセントエンコーディング',
        description:
          'URLで使えない文字を `%23`（#）のように「%」と16進数で表す方式です。SVGのData URIでは `#` や `<` `>` など一部の文字だけを変換する最小限のエスケープが使われます。',
      },
      {
        term: 'xmlns',
        description:
          'XMLの名前空間を示す属性で、SVGでは `xmlns="http://www.w3.org/2000/svg"` と書きます。画像として単体で読み込む場合は必須です。',
      },
    ],
  },
  en: {
    title: 'SVG to Data URI Converter for CSS Backgrounds',
    description:
      'Convert SVG code to a data URI for CSS background-image, using compact URL escaping or Base64, with a live preview. Runs in your browser; nothing is uploaded.',
    h1: 'SVG to Data URI Converter for CSS Backgrounds',
    introHtml:
      'Paste SVG code to get a data URI that drops straight into <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">background-image: url(data:image/svg+xml,...)</code>, so icons and patterns need no extra file request. To Base64-encode plain text, use the <a href="/en/tools/base64/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Base64 Encoder/Decoder</a>; for bitmap images, see <a href="/en/tools/image-to-base64/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image to Base64</a>; for repeating SVG patterns, try the <a href="/en/tools/css-pattern-background/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS Pattern Background Generator</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Paste your SVG into the "SVG code" box.',
      'Pick URL-encoded (compact) or Base64 under "Method".',
      'Check the preview. If you need it, tick "Also output background positioning".',
      'Take the result with "Copy CSS" or "Copy data URI".',
    ],
    inputLabel: 'SVG code',
    inputPlaceholder: '<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>',
    sampleText: SAMPLE_SVG,
    methodLabel: 'Method',
    methodUrl: 'URL-encoded (compact)',
    methodBase64: 'Base64',
    layoutLabel: 'Also output background positioning',
    previewHeading: 'Preview',
    cssHeading: 'CSS (background-image)',
    uriHeading: 'Data URI',
    copyCssButton: 'Copy CSS',
    copyUriButton: 'Copy data URI',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    statsTemplate: 'SVG {original} bytes → data URI {output} chars ({ratio}%)',
    errorNotSvg:
      "This doesn't look like SVG. Paste the whole markup, from <svg ...> to </svg>.",
    notesHeading: 'Notes',
    notes: [
      'URL encoding escapes only the characters % # < > and backslash, quotes, and non-ASCII characters, so it is usually shorter than Base64, though harder to read.',
      'Base64 grows the data by about 1.33x and compresses poorly with gzip, so it suits small SVGs or cases where compatibility matters most.',
      'An SVG without xmlns will not render as a background image, so the tool adds it. The XML declaration, DOCTYPE, and comments are removed and whitespace is collapsed.',
      'The output assumes it sits inside a CSS url() wrapped in double quotes. Double quotes in the SVG become single quotes (or %22). If you paste it into an HTML attribute instead, watch for HTML escapes such as &amp;.',
      'Scripts and external resources in an SVG loaded as a background image are not run or fetched. To change colors, edit fill and similar attributes before encoding.',
      'Everything runs in your browser; the SVG you paste is never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Data URI',
        description:
          'A URL that carries the data itself, like `data:image/svg+xml,...`. It avoids a separate file request and can be used directly in CSS `url()` or `<img src>`.',
      },
      {
        term: 'Percent-encoding',
        description:
          'Writing characters that are unsafe in URLs as "%" plus hex digits, such as `%23` for `#`. SVG data URIs usually escape only a few characters like `#`, `<`, and `>`.',
      },
      {
        term: 'xmlns',
        description:
          'The XML namespace attribute. For SVG it is `xmlns="http://www.w3.org/2000/svg"`, and it is required when the SVG is loaded as a standalone image.',
      },
    ],
  },
};
