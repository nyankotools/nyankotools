import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface MemeGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  topTextLabel: string;
  topTextPlaceholder: string;
  bottomTextLabel: string;
  bottomTextPlaceholder: string;
  defaultTopText: string;
  defaultBottomText: string;
  sizeLabel: string;
  autoFitLabel: string;
  uppercaseLabel: string;
  colorLabel: string;
  strokeColorLabel: string;
  strokeWidthLabel: string;
  previewLabel: string;
  formatLabel: string;
  qualityLabel: string;
  /** {width}, {height} を置換する */
  outputInfo: string;
  /** 最小サイズでも文字が収まらないときの警告 */
  overflowWarning: string;
  downloadButton: string;
  downloaded: string;
  errorNotImage: string;
  /** {max} を置換する */
  errorTooLarge: string;
  errorLoadFailed: string;
  errorExportFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const memeGeneratorContent: Record<Locale, MemeGeneratorPageContent> = {
  ja: {
    title: 'ミーム画像ジェネレーター｜上下に縁取り文字を入れる',
    description:
      '好きな画像の上下に、縁取り付きの太字キャプションを入れてミーム画像を作れる無料ツールです。幅に合わせた自動縮小・折り返し、PNG・JPEG保存に対応。画像はブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ミーム画像ジェネレーター（上下に縁取り文字を入れる）',
    introHtml:
      '画像の上と下に、白い太字＋黒の縁取りのキャプションを入れる定番のミーム形式の画像を作ります。長い文章は画像の幅に合わせて自動で折り返し、収まらないときは文字サイズを縮めます。画像はブラウザ内で処理され、アップロードされません。好きな位置に文字を置きたいときは <a href="/tools/image-text-overlay/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像への文字入れ・透かし</a> もご利用ください。',
    dropLabel: '画像ファイルを選択',
    dropHint:
      'ここに画像をドラッグ＆ドロップするか、ボタンから選択してください。',
    topTextLabel: '上の文字',
    topTextPlaceholder: '例: 上に入れる文字',
    bottomTextLabel: '下の文字',
    bottomTextPlaceholder: '例: 下に入れる文字',
    defaultTopText: 'ここに上の文字',
    defaultBottomText: 'ここに下の文字',
    sizeLabel: '文字サイズ（最大・px）',
    autoFitLabel: '幅に合わせて自動で縮小・折り返し',
    uppercaseLabel: '英字を大文字にする',
    colorLabel: '文字色',
    strokeColorLabel: '縁取りの色',
    strokeWidthLabel: '縁取りの太さ（px）',
    previewLabel: 'プレビュー',
    formatLabel: '保存形式',
    qualityLabel: '画質',
    outputInfo: '出力サイズ: {width} × {height} px',
    overflowWarning:
      '文字が長すぎて画像に収まりません。文字数を減らすか、画像を大きくしてください。',
    downloadButton: 'ミーム画像をダウンロード',
    downloaded: 'ダウンロードしました',
    errorNotImage:
      '画像として読み取れません。PNG・JPEG・WebP・GIF・BMPなどの画像ファイルを選んでください。',
    errorTooLarge:
      '画像が大きすぎます（1辺{max}pxまで、総画素数5,000万まで）。先に画像を縮小してください。',
    errorLoadFailed:
      '画像を読み込めませんでした。ファイルが壊れていないか、対応している形式か確認してください。',
    errorExportFailed:
      '画像を書き出せませんでした。お使いのブラウザがこの保存形式に対応していない可能性があります。別の形式をお試しください。',
    howToHeading: '使い方',
    howToSteps: [
      '画像ファイルを枠内にドラッグ＆ドロップするか、ボタンから選びます。',
      '「上の文字」「下の文字」にキャプションを入力します。長い文章は自動で折り返されます。',
      '「文字サイズ（最大・px）」「文字色」「縁取りの色」「縁取りの太さ（px）」を調整します。「幅に合わせて自動で縮小・折り返し」をオフにすると、指定サイズのまま折り返します。',
      '「保存形式」を選び、「ミーム画像をダウンロード」で保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '書体はお使いの端末に入っている太字フォントから選ばれます（英字はImpact、日本語はゴシック体の太字が基本）。端末によって見た目が少し異なります。外部フォントは読み込みません。',
      '「文字サイズ（最大・px）」は元の画像のピクセル数での指定です。自動縮小がオンのときは、この大きさを上限に、画像の幅と上下それぞれ約3割の高さに収まる最大の大きさが選ばれます。',
      '日本語は1文字ごと、英語は単語ごとに折り返します。長すぎる英単語は途中で割れます。',
      '「JPEG」は透明を扱えないため、透明部分は白で塗りつぶされます。GIFやアニメーションWebPは、最初の1コマだけが対象です。',
      '素材にする画像の著作権や肖像権にご注意ください。作った画像は元の画像とは別のファイルとして保存され、元の画像は変更されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ミーム画像',
        description:
          'インターネット上で広まる、画像に短い文章を組み合わせたネタ画像です。画像の上下に太字の白文字を入れる形式が定番です。',
      },
      {
        term: 'Impact（インパクト）',
        description:
          'ミーム画像で定番になっている、太く詰まった英字フォントです。縁取りと組み合わせると、どんな背景でも読みやすくなります。',
      },
      {
        term: '縁取り（ストローク）',
        description:
          '文字の輪郭に付ける線です。明るい写真でも暗い写真でも文字が埋もれず、読みやすくなります。',
      },
    ],
  },
  en: {
    title: 'Meme Generator: Add Top and Bottom Text to Image',
    description:
      'Make a meme by adding bold, outlined top and bottom captions to any image. Text wraps and shrinks to fit; save as PNG or JPEG. Runs in your browser.',
    h1: 'Meme Generator (Top and Bottom Text on Any Image)',
    introHtml:
      'Create the classic meme format: bold white text with a black outline at the top and bottom of an image. Long captions wrap to the image width and shrink to fit. Everything runs in your browser and nothing is uploaded. If you want to place text anywhere on the image, use <a href="/en/tools/image-text-overlay/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Add Text or Watermark to Image</a>.',
    dropLabel: 'Choose an image file',
    dropHint: 'Drag and drop an image here, or pick one with the button.',
    topTextLabel: 'Top text',
    topTextPlaceholder: 'e.g. WHEN THE CODE WORKS',
    bottomTextLabel: 'Bottom text',
    bottomTextPlaceholder: 'e.g. ON THE FIRST TRY',
    defaultTopText: 'TOP TEXT',
    defaultBottomText: 'BOTTOM TEXT',
    sizeLabel: 'Max font size (px)',
    autoFitLabel: 'Auto-shrink and wrap to fit',
    uppercaseLabel: 'Uppercase letters',
    colorLabel: 'Text color',
    strokeColorLabel: 'Outline color',
    strokeWidthLabel: 'Outline width (px)',
    previewLabel: 'Preview',
    formatLabel: 'Format',
    qualityLabel: 'Quality',
    outputInfo: 'Output size: {width} × {height} px',
    overflowWarning:
      'The text is too long to fit on the image. Shorten it or use a larger image.',
    downloadButton: 'Download meme',
    downloaded: 'Downloaded',
    errorNotImage:
      'This file cannot be read as an image. Choose an image such as PNG, JPEG, WebP, GIF, or BMP.',
    errorTooLarge:
      'The image is too large (up to {max} px per side and 50 million pixels in total). Shrink it first.',
    errorLoadFailed:
      'Could not load the image. Check that the file is not corrupted and is in a supported format.',
    errorExportFailed:
      'Could not export the image. Your browser may not support this format. Try another one.',
    howToHeading: 'How to use',
    howToSteps: [
      'Drag and drop an image file into the box, or pick one with the button.',
      'Type your captions in "Top text" and "Bottom text". Long lines wrap automatically.',
      'Adjust "Max font size (px)", "Text color", "Outline color", and "Outline width (px)". Turn off "Auto-shrink and wrap to fit" to keep the size you set and only wrap.',
      'Choose a "Format" and click "Download meme" to save it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Fonts come from the bold fonts installed on your device (Impact for Latin letters, a bold gothic face for Japanese), so the look varies a little between devices. No web fonts are loaded.',
      '"Max font size (px)" is in pixels of the original image. With auto-shrink on, it is the upper limit; the largest size that fits the image width and about 30% of the height for each caption is used.',
      'Japanese text wraps per character and English text wraps per word. A single word that is too long is split in the middle.',
      '"JPEG" cannot hold transparency, so transparent areas are filled with white. For GIF and animated WebP, only the first frame is used.',
      'Mind the copyright and portrait rights of the image you use. The meme is saved as a new file; your original image is not changed.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Meme image',
        description:
          'An image paired with a short caption that spreads online. Bold white text at the top and bottom is the classic layout.',
      },
      {
        term: 'Impact font',
        description:
          'A thick, condensed typeface that became the standard for memes. Paired with an outline, it stays readable on any background.',
      },
      {
        term: 'Outline (stroke)',
        description:
          'A line drawn around the edge of the letters. It keeps text readable on both bright and dark photos.',
      },
    ],
  },
};
