import type { Locale } from '../../data/tools';

export interface PlaceholderImageGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  widthLabel: string;
  heightLabel: string;
  bgColorLabel: string;
  textColorLabel: string;
  textLabel: string;
  textPlaceholder: string;
  formatLabel: string;
  presetsLabel: string;
  previewLabel: string;
  download: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** {min} {max} を置換 */
  errorSizeTemplate: string;
  errorColor: string;
  errorEncode: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const placeholderImageGeneratorContent: Record<
  Locale,
  PlaceholderImageGeneratorPageContent
> = {
  ja: {
    title: 'ダミー画像生成｜サイズ・色を指定してプレースホルダー画像を作成',
    description:
      '幅・高さ・背景色・文字を指定して、ダミー画像（プレースホルダー画像）をその場で生成しPNG・JPEG・WebPでダウンロードできる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ダミー画像生成（プレースホルダー画像）',
    introHtml:
      'サイズと色を指定するだけで、デザインやテスト用のダミー画像を作成できます。既存の画像を変換したい場合は<a href="/tools/image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像変換</a>、色のコードを調べたい場合は<a href="/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カラーコード変換</a>もご利用ください。',
    widthLabel: '幅（px）',
    heightLabel: '高さ（px）',
    bgColorLabel: '背景色',
    textColorLabel: '文字色',
    textLabel: '表示する文字',
    textPlaceholder: '空欄の場合は「幅×高さ」を表示',
    formatLabel: '形式',
    presetsLabel: 'サイズのプリセット',
    previewLabel: 'プレビュー',
    download: 'ダウンロード',
    copy: '画像をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorSizeTemplate: '幅・高さは{min}〜{max}の整数で入力してください。',
    errorColor: '色は #RGB または #RRGGBB 形式で入力してください。',
    errorEncode:
      '画像の生成に失敗しました。サイズを小さくして再度お試しください。',
    notesHeading: '注意事項',
    notes: [
      '幅・高さは1〜4096pxの整数で指定します。',
      '色は #RGB または #RRGGBB 形式で指定します。文字を空欄にすると「幅×高さ」が表示されます。',
      'PNG・JPEG・WebPで書き出せます。JPEGは透過に対応していません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ダミー画像（プレースホルダー画像）',
        description:
          'Webデザインやアプリ開発で、本番の画像が用意できるまで場所を確保するために置く仮の画像です。レイアウトの確認やテストに使われます。',
      },
      {
        term: 'PNG / JPEG / WebP',
        description:
          'PNGは劣化のない形式、JPEGは写真向けの非可逆形式、WebPは同等画質でより軽量な形式です。単色のダミー画像はPNGでも小さく収まります。',
      },
    ],
  },
  en: {
    title:
      'Placeholder Image Generator – Create Dummy Images of Any Size and Color',
    description:
      'A free placeholder image generator. Set the width, height, background color, and text, then download a dummy image as PNG, JPEG, or WebP. Everything runs in your browser and nothing is sent to a server.',
    h1: 'Placeholder Image Generator',
    introHtml:
      'Set a size and colors to create a dummy image for mockups and testing. To convert an existing image, use the <a href="/en/tools/image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Converter</a>; to look up color codes, try the <a href="/en/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Color Converter</a>.',
    widthLabel: 'Width (px)',
    heightLabel: 'Height (px)',
    bgColorLabel: 'Background color',
    textColorLabel: 'Text color',
    textLabel: 'Text',
    textPlaceholder: 'Leave blank to show "width×height"',
    formatLabel: 'Format',
    presetsLabel: 'Size presets',
    previewLabel: 'Preview',
    download: 'Download',
    copy: 'Copy image',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorSizeTemplate:
      'Enter whole numbers from {min} to {max} for width and height.',
    errorColor: 'Enter colors as #RGB or #RRGGBB.',
    errorEncode: 'Could not generate the image. Try a smaller size.',
    notesHeading: 'Notes',
    notes: [
      'Width and height must be whole numbers from 1 to 4096 px.',
      'Colors are specified as #RGB or #RRGGBB. If the text is left empty, "width × height" is shown.',
      'You can export as PNG, JPEG or WebP. JPEG does not support transparency.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Placeholder image',
        description:
          'A temporary image used in web design and app development to reserve space until the final image is ready. Handy for checking layouts and testing.',
      },
      {
        term: 'PNG / JPEG / WebP',
        description:
          'PNG is lossless, JPEG is a lossy format suited to photos, and WebP offers similar quality at a smaller size. Flat-color placeholders stay small even as PNG.',
      },
    ],
  },
};
