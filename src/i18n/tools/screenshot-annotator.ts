import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ScreenshotAnnotatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{width}` `{height}` `{size}` を置換 */
  sourceInfoTemplate: string;
  toolLabel: string;
  toolArrow: string;
  toolRect: string;
  toolBadge: string;
  toolText: string;
  toolErase: string;
  colorLabel: string;
  widthLabel: string;
  textInputLabel: string;
  textInputPlaceholder: string;
  defaultText: string;
  canvasLabel: string;
  canvasHint: string;
  touchModeLabel: string;
  touchModeDraw: string;
  touchModeScroll: string;
  touchModeHint: string;
  /** `{count}` を置換 */
  countTemplate: string;
  undoButton: string;
  clearAnnotationsButton: string;
  clearImageButton: string;
  downloadButton: string;
  copyButton: string;
  copySuccess: string;
  copyFailed: string;
  errorUnsupportedFile: string;
  errorLoadFailed: string;
  errorExportFailed: string;
  /** `{max}` を置換 */
  errorFileTooLargeTemplate: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const screenshotAnnotatorContent: Record<
  Locale,
  ScreenshotAnnotatorPageContent
> = {
  ja: {
    title:
      'スクリーンショット注釈ツール｜矢印・枠・番号・文字を追加してPNG保存',
    description:
      'スクリーンショットを貼り付け（Ctrl+V）やドラッグ＆ドロップで読み込み、矢印・枠・自動連番の番号・テキストを書き込んでPNGで保存。マニュアルや手順書づくりに。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'スクリーンショット注釈ツール（矢印・枠・番号・テキスト）',
    introHtml:
      '画像を貼り付ける（Ctrl+V）か、ファイルを選んで、矢印・枠・番号バッジ・テキストを書き込めます。番号は追加するたびに自動で1, 2, 3…と振られるので、手順書やマニュアルの作成に便利です。画像はアップロードされず、すべてブラウザ内で処理されます。個人情報を隠したいときは先に<a href="/tools/image-blur-mosaic/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像モザイク・ぼかしツール</a>で加工してください。',
    dropLabel: '画像ファイルを選択',
    dropHint:
      'ここに画像をドラッグ＆ドロップするか、ページ上で Ctrl+V（⌘+V）で貼り付けることもできます',
    sourceInfoTemplate: '元画像: {width}×{height}px（{size}）',
    toolLabel: '書き込みの種類',
    toolArrow: '矢印',
    toolRect: '枠',
    toolBadge: '番号',
    toolText: 'テキスト',
    toolErase: '削除',
    colorLabel: '色',
    widthLabel: '線の太さ',
    textInputLabel: 'テキストの内容',
    textInputPlaceholder: '例: ここをクリック',
    defaultText: 'ここをクリック',
    canvasLabel: '編集中の画像',
    canvasHint:
      '矢印・枠は画像の上をドラッグ、番号・テキストはクリック（タップ）した位置に入ります。「削除」では書き込みをクリックして1つずつ消せます。',
    touchModeLabel: 'スマホでの操作',
    touchModeDraw: '書き込む',
    touchModeScroll: 'スクロール',
    touchModeHint:
      '「書き込む」中は画像の上で指をなぞっても、ページはスクロールしません。スクロールしたいときは「スクロール」に切り替えてください。',
    countTemplate: '書き込み: {count}件',
    undoButton: '1つ元に戻す',
    clearAnnotationsButton: '書き込みをすべて消す',
    clearImageButton: '画像をクリア',
    downloadButton: 'PNGをダウンロード',
    copyButton: '画像をコピー',
    copySuccess: '画像をクリップボードにコピーしました',
    copyFailed:
      'コピーできませんでした。お使いのブラウザは画像のコピーに対応していない可能性があります。ダウンロードをご利用ください。',
    errorUnsupportedFile:
      '対応していないファイル形式です（PNG/JPEG/WebP/GIF/BMPのみ読み込めます）',
    errorLoadFailed:
      '画像を読み込めませんでした。ファイルが破損している可能性があります。',
    errorExportFailed: 'PNGの書き出しに失敗しました。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    notesHeading: '注意点',
    notes: [
      '書き込みは保存するPNGに直接描き込まれます。保存後に矢印や文字だけを動かしたり消したりすることはできません。必要なら元の画像も残しておいてください。',
      '番号は追加した順に1から振られます。途中の番号を「削除」で消すと、残りの番号が振り直されます。',
      'ページを再読み込みしたり別の画像を読み込んだりすると、書き込みは破棄されます。',
      '保存は常にPNGです。GIFは先頭フレームのみが対象で、アニメーションは保持されません。',
      '画像のコピーは、ブラウザが画像のクリップボード書き込みに対応している場合のみ使えます。',
      'すべての処理はブラウザ内で完結し、選択した画像がサーバーに送信されることはありません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '画像ファイルを選択するか、ドラッグ＆ドロップ、または Ctrl+V で貼り付けます。',
      '「書き込みの種類」（矢印・枠・番号・テキスト）と「色」「線の太さ」を選びます。',
      '画像の上をドラッグ（矢印・枠）またはクリック（番号・テキスト）して書き込みます。間違えたら「1つ元に戻す」を押します。',
      '「PNGをダウンロード」で保存するか、「画像をコピー」で貼り付け用にコピーします。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '番号バッジ',
        description:
          '円の中に数字を入れた目印。手順書で「①この操作をして、②次にここを押す」のように順序を示すときに使います。',
      },
      {
        term: 'アノテーション（注釈）',
        description:
          '画像の上に重ねる矢印・枠・文字などの書き込みの総称。スクリーンショットの説明を分かりやすくします。',
      },
    ],
  },
  en: {
    title: 'Screenshot Annotation Tool: Arrows, Boxes, Numbers, Text',
    description:
      'Paste or drop a screenshot, add arrows, boxes, auto-numbered badges and text, then save it as PNG. Runs in your browser; nothing is uploaded.',
    h1: 'Screenshot Annotation Tool (Arrows, Boxes, Numbers, Text)',
    introHtml:
      'Paste an image with Ctrl+V or choose a file, then draw arrows and boxes or drop numbered badges and text labels on it. Badges are numbered 1, 2, 3… automatically, which makes step-by-step guides and bug reports easy to follow. Your image is never uploaded; everything happens in your browser. To hide personal details first, use the <a href="/en/tools/image-blur-mosaic/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Blur & Mosaic Tool</a>.',
    dropLabel: 'Choose an image file',
    dropHint:
      'You can also drag and drop an image here, or paste one with Ctrl+V (⌘+V) anywhere on the page',
    sourceInfoTemplate: 'Original: {width}×{height}px ({size})',
    toolLabel: 'Annotation type',
    toolArrow: 'Arrow',
    toolRect: 'Box',
    toolBadge: 'Number',
    toolText: 'Text',
    toolErase: 'Delete',
    colorLabel: 'Color',
    widthLabel: 'Line width',
    textInputLabel: 'Text to add',
    textInputPlaceholder: 'e.g. Click here',
    defaultText: 'Click here',
    canvasLabel: 'Image being edited',
    canvasHint:
      'Drag on the image to draw an arrow or box; click (tap) to place a number or text. With Delete, click an annotation to remove it.',
    touchModeLabel: 'Touch mode',
    touchModeDraw: 'Draw',
    touchModeScroll: 'Scroll',
    touchModeHint:
      'In Draw mode, swiping on the image draws and the page will not scroll. Switch to Scroll to move the page.',
    countTemplate: 'Annotations: {count}',
    undoButton: 'Undo last',
    clearAnnotationsButton: 'Remove all annotations',
    clearImageButton: 'Clear image',
    downloadButton: 'Download PNG',
    copyButton: 'Copy image',
    copySuccess: 'Image copied to the clipboard',
    copyFailed:
      'Could not copy. Your browser may not support copying images. Please use Download instead.',
    errorUnsupportedFile:
      'Unsupported file type (only PNG, JPEG, WebP, GIF, and BMP can be opened)',
    errorLoadFailed: 'Could not load the image. The file may be corrupted.',
    errorExportFailed: 'Could not export the PNG.',
    errorFileTooLargeTemplate: 'This file exceeds the size limit ({max})',
    notesHeading: 'Notes',
    notes: [
      'Annotations are drawn straight into the saved PNG. You cannot move or delete an arrow or label after saving, so keep the original image if you may need it.',
      'Badges are numbered from 1 in the order you add them. If you remove one in the middle with Delete, the remaining badges are renumbered.',
      'Annotations are discarded when you reload the page or load another image.',
      'The output is always PNG. For GIFs only the first frame is used and animation is not preserved.',
      'Copying an image works only in browsers that allow writing images to the clipboard.',
      'All processing happens in your browser — the image you select is never sent to a server.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose an image file, drag and drop it, or paste it with Ctrl+V.',
      'Pick an "Annotation type" (arrow, box, number, or text), then set the "Color" and "Line width".',
      'Drag on the image (arrow, box) or click it (number, text) to annotate. Press "Undo last" if you make a mistake.',
      'Save it with "Download PNG", or use "Copy image" to paste it elsewhere.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Number badge',
        description:
          'A circle with a number inside, used in guides to show order, such as "1. do this, 2. then press here".',
      },
      {
        term: 'Annotation',
        description:
          'Arrows, boxes, text and other marks drawn over an image to explain what it shows.',
      },
    ],
  },
};
