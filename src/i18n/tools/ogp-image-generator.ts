import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SelectOption {
  value: string;
  label: string;
  selected?: boolean;
}

export interface OgpImageGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  titleLabel: string;
  titlePlaceholder: string;
  defaultTitle: string;
  subtitleLabel: string;
  subtitlePlaceholder: string;
  siteLabel: string;
  sitePlaceholder: string;
  sizeLabel: string;
  sizeOptions: SelectOption[];
  backgroundLabel: string;
  backgroundOptions: SelectOption[];
  color1Label: string;
  color2Label: string;
  textColorLabel: string;
  fontLabel: string;
  fontOptions: SelectOption[];
  alignLabel: string;
  alignOptions: SelectOption[];
  previewLabel: string;
  downloadButton: string;
  downloaded: string;
  errorExportFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const ogpImageGeneratorContent: Record<
  Locale,
  OgpImageGeneratorPageContent
> = {
  ja: {
    title: 'OGP画像ジェネレーター',
    description:
      'タイトル・サブタイトル・サイト名を入力して、SNSシェア用のOGP画像（1200×630）をPNGで作成できる無料ツールです。背景色やグラデーション、文字色を調整可能。画像はブラウザ内で生成され、サーバーには送信されません。',
    h1: 'OGP画像ジェネレーター（1200×630 PNG）',
    introHtml:
      'ブログやWebページをSNSでシェアしたときに表示されるOGP画像を、タイトルを入力するだけで作成できます。長いタイトルは枠に収まるよう文字サイズを自動で調整します。画像はブラウザ内で生成され、入力内容はサーバーに送信されません。作った画像は <a href="/tools/meta-tag-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">メタタグ生成</a> のOGP設定に指定してください。',
    titleLabel: 'タイトル',
    titlePlaceholder: '記事やページのタイトル',
    defaultTitle: 'OGP画像をブラウザで作ろう',
    subtitleLabel: 'サブタイトル（任意）',
    subtitlePlaceholder: '補足の説明文',
    siteLabel: 'サイト名（任意）',
    sitePlaceholder: '例: example.com',
    sizeLabel: '画像サイズ',
    sizeOptions: [
      { value: 'ogp', label: '1200×630（OGP・Facebook）', selected: true },
      { value: 'x', label: '1200×675（X・16:9）' },
      { value: 'square', label: '1080×1080（正方形）' },
    ],
    backgroundLabel: '背景',
    backgroundOptions: [
      { value: 'gradient', label: 'グラデーション', selected: true },
      { value: 'solid', label: '単色' },
    ],
    color1Label: '背景色1',
    color2Label: '背景色2（グラデーションの終点）',
    textColorLabel: '文字色',
    fontLabel: 'フォント',
    fontOptions: [
      { value: 'sans', label: 'ゴシック体', selected: true },
      { value: 'serif', label: '明朝体' },
    ],
    alignLabel: '文字の配置',
    alignOptions: [
      { value: 'left', label: '左揃え', selected: true },
      { value: 'center', label: '中央揃え' },
    ],
    previewLabel: 'プレビュー',
    downloadButton: 'PNG画像をダウンロード',
    downloaded: 'ダウンロードしました',
    errorExportFailed: 'PNGを書き出せませんでした。',
    howToHeading: '使い方',
    howToSteps: [
      '「タイトル」を入力します。必要なら「サブタイトル（任意）」と「サイト名（任意）」も入力します。',
      '「画像サイズ」を選び、「背景」と色、「フォント」、「文字の配置」を調整します。',
      'プレビューで文字が読みやすいか確認します。',
      '「PNG画像をダウンロード」ボタンで保存し、サイトにアップロードしてOGP画像として指定します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '文字は、お使いの端末にあるフォントで描画されます。端末によってゴシック体・明朝体の見た目が少し変わります。',
      'タイトルが長い場合は文字サイズを小さくして収めます。それでも収まらないときは、末尾を省略記号（…）で省略します。',
      'SNSでは画像の端が切り取られて表示されることがあります。重要な文字は端に寄せすぎないよう、短いタイトルにするのがおすすめです。',
      '作った画像を使うには、サイトにアップロードして、og:image のメタタグにそのURLを指定する必要があります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'OGP',
        description:
          'Open Graph Protocolの略で、WebページをSNSなどでシェアしたときに表示されるタイトル・説明・画像を指定する仕組みです。',
      },
      {
        term: 'og:image',
        description:
          'OGPで、シェア時に表示する画像のURLを指定するメタタグです。1200×630pxが推奨サイズとされています。',
      },
      {
        term: 'Twitterカード（Xカード）',
        description:
          'Xでリンクを共有したときの表示形式を指定する仕組みです。大きな画像付きのカードは、16:9に近い比率の画像がきれいに表示されます。',
      },
    ],
  },
  en: {
    title: 'OGP / Social Image Generator',
    description:
      'Create a social share (OGP) image as PNG from a title and site name. Pick gradient or solid colors. Runs in your browser; nothing is uploaded.',
    h1: 'OGP Image Generator (1200×630 PNG)',
    introHtml:
      'Create the Open Graph image shown when your blog post or page is shared on social media, just by typing a title. Long titles are shrunk automatically to fit. The image is generated in your browser and nothing you type is sent to a server. Set the finished image in the OGP section of the <a href="/en/tools/meta-tag-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Meta Tag Generator</a>.',
    titleLabel: 'Title',
    titlePlaceholder: 'Title of your article or page',
    defaultTitle: 'Make your OGP image in the browser',
    subtitleLabel: 'Subtitle (optional)',
    subtitlePlaceholder: 'A short description',
    siteLabel: 'Site name (optional)',
    sitePlaceholder: 'e.g. example.com',
    sizeLabel: 'Image size',
    sizeOptions: [
      { value: 'ogp', label: '1200×630 (OGP / Facebook)', selected: true },
      { value: 'x', label: '1200×675 (X / 16:9)' },
      { value: 'square', label: '1080×1080 (square)' },
    ],
    backgroundLabel: 'Background',
    backgroundOptions: [
      { value: 'gradient', label: 'Gradient', selected: true },
      { value: 'solid', label: 'Solid color' },
    ],
    color1Label: 'Background color 1',
    color2Label: 'Background color 2 (gradient end)',
    textColorLabel: 'Text color',
    fontLabel: 'Font',
    fontOptions: [
      { value: 'sans', label: 'Sans-serif', selected: true },
      { value: 'serif', label: 'Serif' },
    ],
    alignLabel: 'Text alignment',
    alignOptions: [
      { value: 'left', label: 'Left', selected: true },
      { value: 'center', label: 'Center' },
    ],
    previewLabel: 'Preview',
    downloadButton: 'Download PNG',
    downloaded: 'Downloaded',
    errorExportFailed: 'Could not export the PNG.',
    howToHeading: 'How to use',
    howToSteps: [
      'Enter the "Title". Optionally add a "Subtitle (optional)" and a "Site name (optional)".',
      'Choose the "Image size", then adjust the "Background", colors, "Font", and "Text alignment".',
      'Check the preview to make sure the text is easy to read.',
      'Click "Download PNG", upload the image to your site, and set it as the OGP image.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Text is drawn with fonts installed on your device, so the sans-serif and serif looks vary slightly between devices.',
      'A long title is shrunk to fit. If it still does not fit, the end is cut off with an ellipsis.',
      'Social platforms sometimes crop the edges of the image. Keep titles short and avoid putting important text too close to the edges.',
      'To use the image, upload it to your site and point the og:image meta tag at its URL.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'OGP',
        description:
          'Short for Open Graph Protocol, a way to specify the title, description, and image shown when a web page is shared on social media.',
      },
      {
        term: 'og:image',
        description:
          'The OGP meta tag that sets the URL of the image shown when a page is shared. 1200×630 px is the commonly recommended size.',
      },
      {
        term: 'X card (Twitter card)',
        description:
          'A way to control how a link looks when shared on X. Large-image cards display best with images close to a 16:9 ratio.',
      },
    ],
  },
};
