import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface MetaTagGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  formHeading: string;
  titleLabel: string;
  titlePlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  urlLabel: string;
  urlPlaceholder: string;
  imageUrlLabel: string;
  imageUrlPlaceholder: string;
  siteNameLabel: string;
  siteNamePlaceholder: string;
  twitterCardLabel: string;
  twitterCardSummary: string;
  twitterCardSummaryLargeImage: string;
  twitterSiteLabel: string;
  twitterSitePlaceholder: string;
  localeLabel: string;
  localePlaceholder: string;
  previewHeading: string;
  previewImageNotShown: string;
  previewEmptyImage: string;
  outputHeading: string;
  outputEmpty: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const metaTagGeneratorContent: Record<
  Locale,
  MetaTagGeneratorPageContent
> = {
  ja: {
    title: 'metaタグ・OGPタグ生成ツール（SNSシェアプレビュー付き）',
    description:
      'タイトル・説明文・URL・画像などを入力するだけで、基本のmetaタグ・OGP（Open Graph Protocol）・Twitter Cardのタグをまとめて生成できる無料ツールです。X（旧Twitter）やFacebookでシェアした際のカードレイアウト（タイトル・説明文・ドメイン）をその場で確認できます。生成したHTMLはワンクリックでコピー可能。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'metaタグ・OGPタグ生成',
    introHtml:
      'ページタイトルや説明文、URL、OGP画像などを入力すると、<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">&lt;title&gt;</code>や<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">&lt;meta name="description"&gt;</code>などの基本タグ、OGP（<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">og:title</code>など）、Twitter Cardのタグがリアルタイムに生成されます。入力した項目に対応するタグのみが出力されるため、不要な空タグは含まれません。生成したHTMLはそのまま<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">&lt;head&gt;</code>内に貼り付けて使用できます。OGP画像のサイズを作る際は <a href="/tools/placeholder-image-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ダミー画像生成ツール</a> も参考にしてください。',
    formHeading: 'ページ情報',
    titleLabel: 'ページタイトル',
    titlePlaceholder: '例: NyankoTools - ブラウザだけで動く便利ツール集',
    descriptionLabel: 'ページの説明文',
    descriptionPlaceholder:
      '例: テキスト変換や画像処理などをブラウザ内だけで完結できる無料ツール集です。',
    urlLabel: 'ページURL',
    urlPlaceholder: '例: https://nyankotools.com/',
    imageUrlLabel: 'OGP画像URL',
    imageUrlPlaceholder: '例: https://nyankotools.com/ogp.png',
    siteNameLabel: 'サイト名',
    siteNamePlaceholder: '例: NyankoTools',
    twitterCardLabel: 'Twitter Cardの種類',
    twitterCardSummary: 'summary（小さい画像）',
    twitterCardSummaryLargeImage: 'summary_large_image（大きい画像）',
    twitterSiteLabel: 'Xのユーザー名（@なしでも可）',
    twitterSitePlaceholder: '例: nyankotools',
    localeLabel: 'og:locale（任意）',
    localePlaceholder: '例: ja_JP',
    previewHeading: 'シェアプレビュー',
    previewImageNotShown: '画像は表示されません',
    previewEmptyImage: '画像なし',
    outputHeading: '生成されたHTML',
    outputEmpty: 'ページタイトルなどを入力すると、ここにタグが生成されます。',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '各項目は未入力の場合、対応するタグ自体が出力されません（空の`content`属性は生成しません）。',
      'OGP画像は横1200px×縦630px程度（アスペクト比1.91:1）が推奨サイズです。Twitter Cardの`summary_large_image`もほぼ同じ比率を想定しています。',
      '本サイトはサーバーに一切通信しない設計のため、シェアプレビューの画像欄は指定したURLをそのまま表示するのみで、画像自体は読み込みません。実際の見た目は公開後に各社の公式デバッグツール（Facebookシェアデバッガー等）で確認してください。',
      '入力した文字列に含まれる`<`や`"`などの記号は、HTMLとして壊れないよう自動的にエスケープして出力します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'OGP（Open Graph Protocol）',
        description:
          'FacebookやX（旧Twitter）などでURLをシェアした際に、タイトル・説明文・画像などを含むカードを表示させるための仕様。`<meta property="og:...">`の形で`<head>`内に記述する。',
      },
      {
        term: 'Twitter Card',
        description:
          'X（旧Twitter）でリンクをシェアした際のカード表示を制御するためのmetaタグ。`twitter:card`で表示形式（summary/summary_large_image等）を指定する。',
      },
      {
        term: 'canonical URL',
        description:
          '同じ内容のページが複数のURLで存在する場合に、検索エンジンへ「正規のURL」を伝えるためのリンク。`<link rel="canonical" href="...">`で指定する。',
      },
    ],
  },
  en: {
    title: 'Meta Tag & Open Graph (OGP) Generator with Social Preview',
    description:
      'Generate basic meta tags, Open Graph (OGP), and Twitter Card tags from a page title, description, URL, and image — with a live preview of the card layout (title, description, domain) as it would appear when shared on X (Twitter) or Facebook. Copy the generated HTML with one click. Your data is processed in the browser and never sent to a server.',
    h1: 'Meta Tag & OGP Generator',
    introHtml:
      'Enter a page title, description, URL, and OGP image, and the tool instantly generates the basic tags (<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">&lt;title&gt;</code>, <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">&lt;meta name="description"&gt;</code>, …), Open Graph tags (<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">og:title</code>, …), and Twitter Card tags. Only tags for the fields you fill in are output, so there are no empty attributes cluttering the result. Paste the generated HTML directly into your page\'s <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">&lt;head&gt;</code>. If you need a placeholder image sized for OGP testing, the <a href="/en/tools/placeholder-image-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Placeholder Image Generator</a> can help.',
    formHeading: 'Page info',
    titleLabel: 'Page title',
    titlePlaceholder: 'e.g. NyankoTools - Free browser-only utility tools',
    descriptionLabel: 'Page description',
    descriptionPlaceholder:
      'e.g. A collection of free tools for text conversion and image processing that run entirely in your browser.',
    urlLabel: 'Page URL',
    urlPlaceholder: 'e.g. https://nyankotools.com/',
    imageUrlLabel: 'OGP image URL',
    imageUrlPlaceholder: 'e.g. https://nyankotools.com/ogp.png',
    siteNameLabel: 'Site name',
    siteNamePlaceholder: 'e.g. NyankoTools',
    twitterCardLabel: 'Twitter Card type',
    twitterCardSummary: 'summary (small image)',
    twitterCardSummaryLargeImage: 'summary_large_image (large image)',
    twitterSiteLabel: 'X username (with or without @)',
    twitterSitePlaceholder: 'e.g. nyankotools',
    localeLabel: 'og:locale (optional)',
    localePlaceholder: 'e.g. en_US',
    previewHeading: 'Share preview',
    previewImageNotShown: 'Image not shown',
    previewEmptyImage: 'No image',
    outputHeading: 'Generated HTML',
    outputEmpty: 'Enter a page title and other fields to generate tags here.',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'A field left empty produces no corresponding tag — the tool never outputs an empty `content` attribute.',
      'The recommended OGP image size is about 1200×630px (a 1.91:1 aspect ratio), which also matches the Twitter Card `summary_large_image` format.',
      "Since this site never makes network requests, the share preview's image area only displays the URL you entered — it does not actually load the image. After publishing, verify the real appearance with each platform's own debugging tool (e.g. the Facebook Sharing Debugger).",
      'Characters like `<` and `"` in your input are automatically escaped so the generated HTML stays valid.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'OGP (Open Graph Protocol)',
        description:
          'A specification that controls how a shared URL appears on platforms like Facebook and X (Twitter) — as a card with a title, description, and image. Declared in `<head>` via `<meta property="og:...">` tags.',
      },
      {
        term: 'Twitter Card',
        description:
          'Meta tags that control how a shared link is displayed on X (Twitter). `twitter:card` selects the layout, such as summary or summary_large_image.',
      },
      {
        term: 'canonical URL',
        description:
          'When the same content is reachable at multiple URLs, this link tells search engines which one is the authoritative version: `<link rel="canonical" href="...">`.',
      },
    ],
  },
};
