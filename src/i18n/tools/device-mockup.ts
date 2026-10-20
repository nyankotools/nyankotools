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

export interface DeviceMockupPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  deviceLabel: string;
  deviceOptions: SelectOption[];
  landscapeLabel: string;
  landscapeHint: string;
  fitLabel: string;
  fitOptions: SelectOption[];
  bodyColorLabel: string;
  transparentLabel: string;
  backgroundColorLabel: string;
  shadowLabel: string;
  paddingLabel: string;
  outputWidthLabel: string;
  previewLabel: string;
  /** {width}, {height} を置換する */
  outputInfo: string;
  downloadButton: string;
  downloaded: string;
  errorNotImage: string;
  /** {max} を置換する */
  errorTooLarge: string;
  /** {max} を置換する */
  errorOutputTooLarge: string;
  errorLoadFailed: string;
  errorExportFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const deviceMockupContent: Record<Locale, DeviceMockupPageContent> = {
  ja: {
    title: 'デバイスモックアップ作成｜スクショをスマホ・PC枠に合成',
    description:
      'スクリーンショットをスマホ・タブレット・ノートPC・ブラウザウィンドウの枠にはめ込み、モックアップ画像をPNGで作成します。透明背景・影付き。画像は外部に送信されません。',
    h1: 'デバイスモックアップ作成（スクショをスマホ・PC枠に合成）',
    introHtml:
      'アプリやWebサイトのスクリーンショットを、スマートフォン・タブレット・ノートPC・ブラウザウィンドウの汎用的な枠にはめ込んで、紹介用のモックアップ画像を作ります。本体の色・影・余白・背景の透明化を調整でき、PNGで保存できます。枠は特定メーカーの製品ではなく、自作の汎用デザインです。画像はブラウザ内で処理され、アップロードされません。画像に飾りの枠だけを付けたいときは <a href="/tools/image-frame-maker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像に枠・フレームを付ける</a> もご利用ください。',
    dropLabel: 'スクリーンショットを選択',
    dropHint:
      'ここに画像をドラッグ＆ドロップするか、ボタンから選択してください。',
    deviceLabel: 'デバイス',
    deviceOptions: [
      { value: 'phone', label: 'スマートフォン', selected: true },
      { value: 'tablet', label: 'タブレット' },
      { value: 'laptop', label: 'ノートPC' },
      { value: 'browser', label: 'ブラウザウィンドウ' },
    ],
    landscapeLabel: '横向きにする',
    landscapeHint: 'スマートフォンとタブレットだけで使えます。',
    fitLabel: '画像のはめ込み',
    fitOptions: [
      { value: 'cover', label: '画面いっぱいに切り抜く', selected: true },
      { value: 'contain', label: '全体を収める（余白は黒）' },
    ],
    bodyColorLabel: '本体の色',
    transparentLabel: '背景を透明にする',
    backgroundColorLabel: '背景色',
    shadowLabel: '影を付ける',
    paddingLabel: '周囲の余白（デバイス幅に対する%）',
    outputWidthLabel: '出力幅（px）',
    previewLabel: 'プレビュー',
    outputInfo: '出力: {width} × {height} px（PNG）',
    downloadButton: 'モックアップをPNGでダウンロード',
    downloaded: 'ダウンロードしました',
    errorNotImage:
      '画像として読み取れません。PNG・JPEG・WebP・GIF・BMPなどの画像ファイルを選んでください。',
    errorTooLarge:
      '画像が大きすぎます（1辺{max}pxまで、総画素数5,000万まで）。先に画像を縮小してください。',
    errorOutputTooLarge:
      '出力画像が大きすぎます（1辺{max}pxまで、総画素数5,000万まで）。出力幅を小さくしてください。',
    errorLoadFailed:
      '画像を読み込めませんでした。ファイルが壊れていないか、対応している形式か確認してください。',
    errorExportFailed:
      '画像を書き出せませんでした。ブラウザのメモリが足りない可能性があります。出力幅を小さくしてお試しください。',
    howToHeading: '使い方',
    howToSteps: [
      'スクリーンショットを枠内にドラッグ＆ドロップするか、ボタンから選びます。',
      '「デバイス」でスマートフォン・タブレット・ノートPC・ブラウザウィンドウから選びます。',
      '「画像のはめ込み」「本体の色」「背景を透明にする」などを調整し、プレビューで確認します。',
      '「モックアップをPNGでダウンロード」で保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '枠は特定メーカーの製品を再現したものではなく、本ツール独自の汎用デザインです。ノッチやカメラ位置も簡略化しています。',
      '「画面いっぱいに切り抜く」は、画面の縦横比に合わせて画像の中央を切り抜きます。画面の端を残したいときは「全体を収める（余白は黒）」を選んでください。',
      '「背景を透明にする」をチェックすると、PNGの背景が透明になります。資料やスライドにそのまま重ねて使えます。',
      '出力サイズは「出力幅（px）」で決まります。GIFやアニメーションWebPは最初の1コマだけが対象です。読み込める画像は1辺16384px・総画素数5,000万までです。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'モックアップ',
        description:
          '完成イメージを伝えるための見本画像です。アプリ紹介やストア掲載、資料用に、画面を実機の枠に入れて見せるときによく使われます。',
      },
      {
        term: 'ベゼル',
        description:
          '画面のまわりにある縁の部分です。ここでは本体の色で描かれ、太さはデバイスごとに決まっています。',
      },
      {
        term: 'ノッチ・ダイナミックアイランド',
        description:
          'スマートフォンの画面上部にあるカメラ用の切り欠きや丸い領域のことです。このツールでは角丸の黒い部品として簡略的に表します。',
      },
    ],
  },
  en: {
    title: 'Device Mockup Generator: Phone, Laptop & Browser Frames',
    description:
      'Put a screenshot into a phone, tablet, laptop or browser mockup and save it as PNG. Transparent background and shadow options. Runs in your browser.',
    h1: 'Device Mockup Generator (Screenshot in a Phone or Laptop Frame)',
    introHtml:
      'Drop an app or website screenshot into a generic phone, tablet, laptop or browser-window frame and get a presentation-ready mockup. Change the device color, shadow, padding and transparent background, then save it as a PNG. The frames are original generic designs, not copies of any brand’s products. Everything runs in your browser, so your screenshot is never uploaded. If you only want a decorative border, try <a href="/en/tools/image-frame-maker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Frame Maker</a>.',
    dropLabel: 'Choose a screenshot',
    dropHint: 'Drag and drop an image here, or pick one with the button.',
    deviceLabel: 'Device',
    deviceOptions: [
      { value: 'phone', label: 'Phone', selected: true },
      { value: 'tablet', label: 'Tablet' },
      { value: 'laptop', label: 'Laptop' },
      { value: 'browser', label: 'Browser window' },
    ],
    landscapeLabel: 'Landscape',
    landscapeHint: 'Available for the phone and tablet only.',
    fitLabel: 'Image fit',
    fitOptions: [
      { value: 'cover', label: 'Fill the screen (crop)', selected: true },
      { value: 'contain', label: 'Fit inside (black bars)' },
    ],
    bodyColorLabel: 'Device color',
    transparentLabel: 'Transparent background',
    backgroundColorLabel: 'Background color',
    shadowLabel: 'Drop shadow',
    paddingLabel: 'Outer padding (% of the device width)',
    outputWidthLabel: 'Output width (px)',
    previewLabel: 'Preview',
    outputInfo: 'Output: {width} × {height} px (PNG)',
    downloadButton: 'Download mockup as PNG',
    downloaded: 'Downloaded',
    errorNotImage:
      'This file cannot be read as an image. Choose an image such as PNG, JPEG, WebP, GIF, or BMP.',
    errorTooLarge:
      'The image is too large (up to {max} px per side and 50 million pixels in total). Shrink it first.',
    errorOutputTooLarge:
      'The output would be too large (up to {max} px per side and 50 million pixels in total). Reduce the output width.',
    errorLoadFailed:
      'Could not load the image. Check that the file is not corrupted and is in a supported format.',
    errorExportFailed:
      'Could not export the image. Your browser may be out of memory. Try a smaller output width.',
    howToHeading: 'How to use',
    howToSteps: [
      'Drag and drop a screenshot into the box, or pick one with the button.',
      'Choose a phone, tablet, laptop or browser window under "Device".',
      'Adjust "Image fit", "Device color", "Transparent background" and the other options while checking the preview.',
      'Click "Download mockup as PNG" to save it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The frames are original generic designs, not replicas of any manufacturer’s products. Notches and camera positions are simplified.',
      '"Fill the screen (crop)" crops the center of your image to the screen’s aspect ratio. Choose "Fit inside (black bars)" to keep the whole image.',
      'Tick "Transparent background" to get a PNG with a transparent backdrop, ready to drop onto slides or documents.',
      'The output size is set by "Output width (px)". For GIF and animated WebP, only the first frame is used. Images up to 16384 px per side and 50 million pixels in total can be loaded.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Mockup',
        description:
          'A sample image that shows how a finished product will look, such as an app screen inside a device frame for a store page or a slide deck.',
      },
      {
        term: 'Bezel',
        description:
          'The border around a screen. Here it is drawn in the device color, and its width is fixed for each device.',
      },
      {
        term: 'Notch / Dynamic Island',
        description:
          'The cutout or pill-shaped area at the top of a phone screen that holds the camera. This tool draws a simplified black rounded shape instead.',
      },
    ],
  },
};
