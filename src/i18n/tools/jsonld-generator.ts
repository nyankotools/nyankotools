import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface JsonldGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  typeLabel: string;
  typeFaq: string;
  typeArticle: string;
  typeProduct: string;
  typeBreadcrumb: string;
  faqLabel: string;
  faqPlaceholder: string;
  faqHint: string;
  articleTypeLabel: string;
  headlineLabel: string;
  headlinePlaceholder: string;
  articleDescriptionLabel: string;
  articleImageLabel: string;
  articleUrlLabel: string;
  authorNameLabel: string;
  authorUrlLabel: string;
  publisherNameLabel: string;
  publisherLogoLabel: string;
  datePublishedLabel: string;
  dateModifiedLabel: string;
  dateHint: string;
  productNameLabel: string;
  productNamePlaceholder: string;
  productDescriptionLabel: string;
  productImageLabel: string;
  productUrlLabel: string;
  brandLabel: string;
  skuLabel: string;
  priceLabel: string;
  currencyLabel: string;
  availabilityLabel: string;
  availabilityInStock: string;
  availabilityOutOfStock: string;
  availabilityPreOrder: string;
  availabilityDiscontinued: string;
  breadcrumbLabel: string;
  breadcrumbPlaceholder: string;
  breadcrumbHint: string;
  minifyLabel: string;
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

export const jsonldGeneratorContent: Record<
  Locale,
  JsonldGeneratorPageContent
> = {
  ja: {
    title: 'JSON-LD構造化データ生成（FAQ・記事・商品・パンくず）',
    description:
      'FAQPage・Article・Product・BreadcrumbListのJSON-LD構造化データをフォーム入力から生成。scriptタグごとコピーできます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'JSON-LD構造化データ生成',
    introHtml:
      'FAQ・記事・商品・パンくずリストの情報を入力すると、<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">&lt;script type="application/ld+json"&gt;</code>形式の構造化データを生成します。検索結果のリッチリザルト対応に使えます。入力した項目だけが出力され、<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">&lt;</code>などはJSON内で安全にエスケープされるため、そのまま<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">&lt;head&gt;</code>に貼り付けられます。metaタグやOGPは <a href="/tools/meta-tag-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">metaタグ・OGPタグ生成</a> を、生成したJSONの確認には <a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a> をお使いください。',
    howToHeading: '使い方',
    howToSteps: [
      '「構造化データの種類」でFAQ・記事・商品・パンくずリストのいずれかを選びます。',
      '表示された入力欄に内容を入力します。入力した項目だけが出力されます。',
      '「コピー」を押して、生成されたscriptタグをページの<head>またはbody内に貼り付けます。',
    ],
    typeLabel: '構造化データの種類',
    typeFaq: 'FAQPage（よくある質問）',
    typeArticle: 'Article（記事）',
    typeProduct: 'Product（商品）',
    typeBreadcrumb: 'BreadcrumbList（パンくずリスト）',
    faqLabel: '質問と回答',
    faqPlaceholder:
      '例:\nこのツールは無料ですか？\nはい、無料でお使いいただけます。\n\nデータは送信されますか？\nいいえ、ブラウザ内だけで処理します。',
    faqHint: '1行目が質問、2行目以降が回答です。複数の質問は空行で区切ります。',
    articleTypeLabel: '記事の種類',
    headlineLabel: '見出し（headline）',
    headlinePlaceholder: '例: JSON-LDの書き方入門',
    articleDescriptionLabel: '記事の概要',
    articleImageLabel: '画像URL',
    articleUrlLabel: '記事のURL',
    authorNameLabel: '著者名',
    authorUrlLabel: '著者のURL',
    publisherNameLabel: '発行者名',
    publisherLogoLabel: '発行者ロゴのURL',
    datePublishedLabel: '公開日時',
    dateModifiedLabel: '更新日時',
    dateHint: 'ISO 8601形式（例: 2026-10-19 または 2026-10-19T09:00:00+09:00）',
    productNameLabel: '商品名',
    productNamePlaceholder: '例: ニャンコ缶 24個セット',
    productDescriptionLabel: '商品説明',
    productImageLabel: '商品画像URL',
    productUrlLabel: '商品ページのURL',
    brandLabel: 'ブランド名',
    skuLabel: 'SKU',
    priceLabel: '価格',
    currencyLabel: '通貨コード',
    availabilityLabel: '在庫状況',
    availabilityInStock: '在庫あり',
    availabilityOutOfStock: '在庫切れ',
    availabilityPreOrder: '予約受付中',
    availabilityDiscontinued: '販売終了',
    breadcrumbLabel: 'パンくずリスト',
    breadcrumbPlaceholder:
      '例:\nホーム | https://example.com/\nツール | https://example.com/tools/\nJSON-LD生成',
    breadcrumbHint:
      '1行に1階層、「名前 | URL」の形式で上位から順に入力します。最後の階層はURLを省略できます。',
    minifyLabel: '1行に圧縮して出力する',
    outputHeading: '生成されたscriptタグ',
    outputEmpty: '内容を入力すると、ここにJSON-LDが生成されます。',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '入力した項目だけが出力され、空欄の項目は含まれません。必須項目はGoogleの仕様やリッチリザルトの種類によって異なるため、公開前にGoogleのリッチリザルトテストなどで確認してください。',
      'ページに見えない内容を構造化データだけに書くことはガイドライン違反になる場合があります。FAQや商品情報はページ上の表示と一致させてください。',
      '`<` `>` `&` はJSON内で`\\u003c`などに置き換えて出力します。`</script>`を含む文章でもscriptタグが途中で閉じることはなく、JSONとしての意味は変わりません。',
      '価格は半角数字のみ有効です（カンマは自動で取り除きます）。数値以外を入力すると価格情報は出力されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'JSON-LD',
        description:
          'JSON for Linking Data。ページの内容を検索エンジンに伝えるための構造化データ形式で、`<script type="application/ld+json">`に記述する。HTML本文を変更せずに追加できる。',
      },
      {
        term: 'schema.org',
        description:
          'FAQPage・Article・Productなど、構造化データの語彙（型とプロパティ）を定義する共通の規格。`@context`にそのURLを指定する。',
      },
      {
        term: 'リッチリザルト',
        description:
          '検索結果に評価・価格・FAQ・パンくずなどの追加情報を表示する形式。構造化データが正しく記述されていると対象になる場合がある。',
      },
    ],
  },
  en: {
    title: 'JSON-LD Schema Generator (FAQ, Article, Product)',
    description:
      'Generate JSON-LD for FAQPage, Article, Product and BreadcrumbList from a simple form and copy the script tag. Runs in your browser; nothing is uploaded.',
    h1: 'JSON-LD Structured Data Generator',
    introHtml:
      'Fill in your FAQ, article, product or breadcrumb details and get ready-to-paste <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">&lt;script type=&quot;application/ld+json&quot;&gt;</code> markup for schema.org rich results. Only the fields you fill in are output, and characters such as <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">&lt;</code> are escaped safely inside the JSON, so the result can go straight into your page. For title and Open Graph tags, try the <a href="/en/tools/meta-tag-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Meta Tag &amp; OGP Generator</a>; to inspect the JSON, use the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Pick FAQ, article, product or breadcrumb under "Structured data type".',
      'Fill in the fields that appear. Only the fields you fill in are output.',
      'Press "Copy" and paste the generated script tag into your page\'s <head> or body.',
    ],
    typeLabel: 'Structured data type',
    typeFaq: 'FAQPage',
    typeArticle: 'Article',
    typeProduct: 'Product',
    typeBreadcrumb: 'BreadcrumbList',
    faqLabel: 'Questions and answers',
    faqPlaceholder:
      'e.g.\nIs this tool free?\nYes, it is free to use.\n\nIs my data uploaded?\nNo, everything runs in your browser.',
    faqHint:
      'The first line is the question and the following lines are the answer. Separate questions with a blank line.',
    articleTypeLabel: 'Article type',
    headlineLabel: 'Headline',
    headlinePlaceholder: "e.g. A beginner's guide to JSON-LD",
    articleDescriptionLabel: 'Description',
    articleImageLabel: 'Image URL',
    articleUrlLabel: 'Article URL',
    authorNameLabel: 'Author name',
    authorUrlLabel: 'Author URL',
    publisherNameLabel: 'Publisher name',
    publisherLogoLabel: 'Publisher logo URL',
    datePublishedLabel: 'Date published',
    dateModifiedLabel: 'Date modified',
    dateHint: 'ISO 8601 format (e.g. 2026-10-19 or 2026-10-19T09:00:00+09:00)',
    productNameLabel: 'Product name',
    productNamePlaceholder: 'e.g. Cat food, 24-can pack',
    productDescriptionLabel: 'Product description',
    productImageLabel: 'Product image URL',
    productUrlLabel: 'Product page URL',
    brandLabel: 'Brand',
    skuLabel: 'SKU',
    priceLabel: 'Price',
    currencyLabel: 'Currency code',
    availabilityLabel: 'Availability',
    availabilityInStock: 'In stock',
    availabilityOutOfStock: 'Out of stock',
    availabilityPreOrder: 'Pre-order',
    availabilityDiscontinued: 'Discontinued',
    breadcrumbLabel: 'Breadcrumb trail',
    breadcrumbPlaceholder:
      'e.g.\nHome | https://example.com/\nTools | https://example.com/tools/\nJSON-LD generator',
    breadcrumbHint:
      'One level per line as "Name | URL", from the top down. The last level may omit the URL.',
    minifyLabel: 'Output as a single line',
    outputHeading: 'Generated script tag',
    outputEmpty: 'Enter some details and the JSON-LD appears here.',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Only the fields you fill in are output. Required properties vary by rich result type, so validate the markup with the Rich Results Test before publishing.',
      'Structured data should match what visitors can see on the page. Marking up hidden FAQ or product content can violate search guidelines.',
      '`<`, `>` and `&` are written as `\\u003c` and similar escapes inside the JSON. Text containing `</script>` cannot close the tag early, and the parsed JSON stays identical.',
      'Price accepts digits only (commas are removed). If it is not a number, the offer is left out.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'JSON-LD',
        description:
          'JSON for Linking Data: a structured data format that tells search engines what a page is about, placed in a `<script type="application/ld+json">` tag without changing the visible HTML.',
      },
      {
        term: 'schema.org',
        description:
          'The shared vocabulary of types and properties (FAQPage, Article, Product and so on) used by structured data, referenced through `@context`.',
      },
      {
        term: 'Rich result',
        description:
          'An enhanced search listing showing extras such as ratings, prices, FAQs or breadcrumbs. Valid structured data can make a page eligible.',
      },
    ],
  },
};
