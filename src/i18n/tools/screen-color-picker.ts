import type { Locale } from '../../data/tools';

export interface ScreenColorPickerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  pickButton: string;
  pickHint: string;
  unsupportedNotice: string;
  pickFailed: string;
  imageHeading: string;
  imageLabel: string;
  imageHint: string;
  imageCanvasLabel: string;
  imageLoadFailed: string;
  resultHeading: string;
  resultEmpty: string;
  swatchLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  historyHeading: string;
  historyItemLabel: string;
  clearHistory: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const screenColorPickerContent: Record<
  Locale,
  ScreenColorPickerPageContent
> = {
  ja: {
    title:
      '画面の色をスポイトで取得（HEX・RGB・HSL）｜スクリーンカラーピッカー',
    description:
      '画面上の好きな場所の色をスポイトで拾い、HEX・RGB・HSLのカラーコードを表示・コピーできる無料ツールです。非対応ブラウザでは画像を読み込んでクリックで取得。データは送信されません。',
    h1: '画面の色をスポイトで取得（スクリーンカラーピッカー）',
    introHtml:
      'ブラウザのスポイト（EyeDropper API）で、画面上の任意の場所の色をそのままHEX・RGB・HSLで取り出せます。他のウィンドウやデスクトップの色も対象です。スポイトに対応しないブラウザ（Firefox・Safariなど）では、画像を読み込んでクリックした位置の色を取得する方式に切り替えて使えます。実物の色をカメラで確認したいときは<a href="/tools/camera-color-picker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カメラ映像からカラーコード抽出</a>、形式変換は<a href="/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カラーコード変換</a>をご利用ください。',
    pickButton: '画面から色を取得',
    pickHint:
      '押すとスポイトが起動します。取りたい場所をクリックすると色が確定し、Escでキャンセルできます。',
    unsupportedNotice:
      'お使いのブラウザは画面スポイト（EyeDropper API）に対応していません。下の「画像を読み込む」から画像を選び、クリックして色を取得してください。',
    pickFailed: '色を取得できませんでした。もう一度お試しください。',
    imageHeading: '画像から色を取得',
    imageLabel: '画像を読み込む',
    imageHint:
      '画像ファイルを選ぶか、ここにドラッグ＆ドロップします。表示された画像をクリックすると、その位置の色を取得します。',
    imageCanvasLabel: '読み込んだ画像（クリックした位置の色を取得します）',
    imageLoadFailed:
      '画像を読み込めませんでした。別のファイルをお試しください。',
    resultHeading: '取得した色',
    resultEmpty: '色を取得すると、ここにHEX・RGB・HSLが表示されます。',
    swatchLabel: '取得した色の見本',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーできませんでした',
    historyHeading: '履歴',
    historyItemLabel: 'この色を表示',
    clearHistory: '履歴を消去',
    howToHeading: '使い方',
    howToSteps: [
      '「画面から色を取得」を押すとスポイトが起動します（対応ブラウザのみ）。',
      '画面上で色を取りたい場所をクリックすると、「取得した色」にHEX・RGB・HSLが表示されます。',
      '非対応ブラウザでは「画像を読み込む」で画像を選び、画像上の取りたい位置をクリックします。',
      '各形式の「コピー」を押してコピーします。過去に取得した色は「履歴」から呼び出せます。',
    ],
    notesHeading: '注意点',
    notes: [
      'スポイト（EyeDropper API）は主にChrome・Edgeなど Chromium 系ブラウザで利用でき、Firefox・Safariでは使えません。HTTPS接続が必要です。',
      '画面上の色はディスプレイのカラープロファイルや夜間モードなどの影響を受ける場合があります。画像方式は画像データそのものの色を読みます。',
      '履歴はこのページを開いている間だけメモリ上に保持され、保存も送信もされません（最大30件）。ページを閉じるか再読み込みすると消えます。',
      '実物の色をカメラで調べたい場合は、兄弟ツールのカメラ映像からカラーコード抽出が向いています。このツールは画面上・画像上の色が対象です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'EyeDropper API',
        description:
          'ブラウザから画面上の任意の位置の色を取得するための仕組みです。ユーザーが操作して選んだ1色だけが返され、画面の内容が勝手に読まれることはありません。',
      },
      {
        term: 'HSL',
        description:
          '色相（0〜360度）・彩度・明度で色を表す形式です。同系色で少し明るくするなど、調整が直感的にできます。',
      },
    ],
  },
  en: {
    title: 'Screen Color Picker – Eyedropper for HEX, RGB, HSL',
    description:
      'Pick any color on your screen with the browser eyedropper and copy its HEX, RGB and HSL codes. Falls back to clicking an image. Runs locally; nothing is sent.',
    h1: 'Screen Color Picker (Eyedropper)',
    introHtml:
      'Use the browser’s eyedropper (EyeDropper API) to grab the color of any pixel on your screen as HEX, RGB and HSL, even from other windows or your desktop. In browsers without it (Firefox, Safari), switch to loading an image and clicking to read its colors. To check a real-world object, use the <a href="/en/tools/camera-color-picker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Camera Color Picker</a>; to convert between formats, try the <a href="/en/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Color Converter</a>.',
    pickButton: 'Pick color from screen',
    pickHint:
      'Starts the eyedropper. Click any spot on your screen to lock its color, or press Esc to cancel.',
    unsupportedNotice:
      'Your browser does not support the screen eyedropper (EyeDropper API). Choose a file under "Load image" below and click the image to pick a color.',
    pickFailed: 'Could not pick a color. Please try again.',
    imageHeading: 'Pick from an image',
    imageLabel: 'Load image',
    imageHint:
      'Choose an image file or drag and drop it here, then click the displayed image to read the color at that point.',
    imageCanvasLabel: 'Loaded image (click to pick the color at that point)',
    imageLoadFailed: 'Could not load the image. Try a different file.',
    resultHeading: 'Picked color',
    resultEmpty: 'Pick a color and its HEX, RGB and HSL will appear here.',
    swatchLabel: 'Picked color swatch',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    historyHeading: 'History',
    historyItemLabel: 'Show this color',
    clearHistory: 'Clear history',
    howToHeading: 'How to use',
    howToSteps: [
      'Press "Pick color from screen" to start the eyedropper (supported browsers only).',
      'Click the spot you want on your screen; its HEX, RGB and HSL appear under "Picked color".',
      'In browsers without the eyedropper, choose a file under "Load image" and click the spot you want on the image.',
      'Press "Copy" next to any format. Earlier colors can be recalled from "History".',
    ],
    notesHeading: 'Notes',
    notes: [
      'The eyedropper (EyeDropper API) works in Chromium browsers such as Chrome and Edge, not in Firefox or Safari, and requires HTTPS.',
      'Screen colors can be affected by your display’s color profile or night mode. Image mode reads the color stored in the image data itself.',
      'History is kept in memory only while this page is open (up to 30 colors). Nothing is saved or sent, and it disappears when you close or reload the page.',
      'To measure a real object with your camera, use the sibling Camera Color Picker. This tool works on colors on your screen or in an image.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'EyeDropper API',
        description:
          'A browser feature for reading the color of any point on screen. Only the single color you choose is returned; the page cannot read the rest of your screen.',
      },
      {
        term: 'HSL',
        description:
          'A way to describe color by hue (0-360 degrees), saturation and lightness. It makes tweaks like a slightly lighter shade of the same color intuitive.',
      },
    ],
  },
};
