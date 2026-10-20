import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface PixelArtEditorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  toolLabel: string;
  toolPen: string;
  toolEraser: string;
  toolFill: string;
  toolPicker: string;
  paletteLabel: string;
  customColorLabel: string;
  addColorButton: string;
  sizeLabel: string;
  sizeHint: string;
  gridLabel: string;
  canvasLabel: string;
  canvasHint: string;
  zoomLabel: string;
  undoButton: string;
  redoButton: string;
  clearButton: string;
  scaleLabel: string;
  /** `{width}` `{height}` を置換 */
  exportInfoTemplate: string;
  downloadButton: string;
  errorExportFailed: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const pixelArtEditorContent: Record<Locale, PixelArtEditorPageContent> =
  {
    ja: {
      title: 'ドット絵エディタ｜ブラウザで描いてPNG書き出し【無料】',
      description:
        'ブラウザで描けるドット絵エディタ。ペン・消しゴム・塗りつぶし・スポイトとパレットで8〜64マスのドット絵を作成し、拡大率を指定して透過PNGで保存できます。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: 'ドット絵エディタ（描いてPNG書き出し）',
      introHtml:
        'マス目をタップ・ドラッグしてドット絵を描けるエディタです。パレットから色を選び、ペン・消しゴム・塗りつぶし・スポイトで描画し、拡大率を指定して透過PNGとして保存できます。スマホのタッチ操作にも対応しています。描いた絵や作成データはサーバーに送信されません。既存の画像をドット絵風にしたいときは<a href="/tools/image-pixelart-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像ドット絵化・モザイク・減色ツール</a>をご利用ください。',
      toolLabel: '描画ツール',
      toolPen: 'ペン',
      toolEraser: '消しゴム',
      toolFill: '塗りつぶし',
      toolPicker: 'スポイト',
      paletteLabel: 'パレット',
      customColorLabel: '好きな色を選ぶ',
      addColorButton: 'パレットに追加',
      sizeLabel: 'キャンバスサイズ（マス）',
      sizeHint:
        'サイズを変えると左上を基準に絵が引き継がれます（小さくすると外側が切り取られます）。「元に戻す」で戻せます。',
      gridLabel: 'グリッド線を表示',
      canvasLabel: 'ドット絵のキャンバス（タップ・ドラッグで描画）',
      zoomLabel: '表示倍率',
      canvasHint:
        'キャンバス上では指で画面がスクロールしません。スクロールしたいときはキャンバスの外側をなぞってください。',
      undoButton: '元に戻す',
      redoButton: 'やり直す',
      clearButton: 'すべて消去',
      scaleLabel: '書き出しの拡大率',
      exportInfoTemplate: '出力サイズ: {width}×{height}px',
      downloadButton: 'PNGをダウンロード',
      errorExportFailed: 'PNGの書き出しに失敗しました。',
      notesHeading: '注意点',
      notes: [
        '作成中の絵はこのページを閉じたりリロードしたりすると消えます。必要なときは先にPNGで保存してください。',
        '書き出すPNGは、塗っていないマスが透明になります。背景色が必要な場合は画像編集ソフトなどで合成してください。',
        '拡大はニアレストネイバー（補間なし）で行うため、拡大してもドットの輪郭はぼやけません。',
        'キャンバスサイズは8〜64マス、拡大率は1〜32倍です。出力は最大でも2048px四方に収まります。',
        'アニメーションGIFの作成には対応していません。静止画のPNGのみ書き出せます。',
        'Ctrl（Macは⌘）+ Z で元に戻す、Ctrl + Y（またはCtrl + Shift + Z）でやり直せます。履歴は直近100操作まで保持されます。',
        'すべての処理はブラウザ内で完結し、描いた絵がサーバーに送信されることはありません。',
      ],
      howToHeading: '使い方',
      howToSteps: [
        '「キャンバスサイズ（マス）」を選びます。',
        '「パレット」から色を選び、「ペン」「塗りつぶし」などのツールで描きます。',
        '間違えたら「元に戻す」を押します。',
        '「書き出しの拡大率」を選んで、「PNGをダウンロード」を押します。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'ドット絵（ピクセルアート）',
          description:
            '小さな正方形のマス（ドット）を並べて描く絵。解像度が低く、1マスずつ色を決めるのが特徴です。',
        },
        {
          term: 'ニアレストネイバー',
          description:
            '拡大時に補間せず、元のマスの色をそのまま大きくする方式。ドット絵を拡大してもくっきり保てます。',
        },
        {
          term: 'スポイト',
          description:
            'キャンバス上のマスをクリックして、その色を現在の描画色として取り出すツールです。',
        },
      ],
    },
    en: {
      title: 'Pixel Art Editor - Draw and Export PNG Online',
      description:
        'Draw pixel art in your browser with a pen, eraser, fill, color picker and palette on an 8 to 64 px grid, then export a scaled PNG. Nothing leaves your device.',
      h1: 'Pixel Art Editor (Draw and Export as PNG)',
      introHtml:
        'Tap or drag on the grid to draw pixel art. Pick colors from the palette, use the pen, eraser, fill and color picker, then save the result as a transparent PNG at the scale you choose. It works with touch screens too. Your artwork is never uploaded. To turn an existing photo into pixel art, try the <a href="/en/tools/image-pixelart-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Pixelate, Mosaic & Color Reduction Tool</a>.',
      toolLabel: 'Drawing tool',
      toolPen: 'Pen',
      toolEraser: 'Eraser',
      toolFill: 'Fill',
      toolPicker: 'Picker',
      paletteLabel: 'Palette',
      customColorLabel: 'Pick any color',
      addColorButton: 'Add to palette',
      sizeLabel: 'Canvas size (cells)',
      sizeHint:
        'Changing the size keeps your drawing anchored at the top-left; shrinking crops the outside. You can revert it with Undo.',
      gridLabel: 'Show grid lines',
      canvasLabel: 'Pixel art canvas (tap or drag to draw)',
      zoomLabel: 'Zoom',
      canvasHint:
        'The page will not scroll when you swipe on the canvas. To scroll, swipe on the area outside it.',
      undoButton: 'Undo',
      redoButton: 'Redo',
      clearButton: 'Clear all',
      scaleLabel: 'Export scale',
      exportInfoTemplate: 'Output size: {width}×{height}px',
      downloadButton: 'Download PNG',
      errorExportFailed: 'Could not export the PNG.',
      notesHeading: 'Notes',
      notes: [
        'Your drawing is lost if you close or reload this page. Save it as a PNG first if you want to keep it.',
        'In the exported PNG, cells you did not paint are transparent. If you need a background color, add it in an image editor.',
        'Scaling uses nearest-neighbor (no smoothing), so the pixel edges stay sharp when enlarged.',
        'The canvas is 8 to 64 cells and the scale is 1x to 32x, so the output never exceeds 2048 px on a side.',
        'Animated GIFs are not supported; only still PNG images can be exported.',
        'Press Ctrl (⌘ on Mac) + Z to undo and Ctrl + Y (or Ctrl + Shift + Z) to redo. The last 100 actions are kept.',
        'Everything runs in your browser; your artwork is never sent to a server.',
      ],
      howToHeading: 'How to use',
      howToSteps: [
        'Choose a "Canvas size (cells)".',
        'Pick a color from the "Palette" and draw with tools such as "Pen" and "Fill".',
        'Press "Undo" if you make a mistake.',
        'Choose an "Export scale" and press "Download PNG".',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'Pixel art',
          description:
            'Artwork made from small square cells (pixels) at a low resolution, where each cell is colored by hand.',
        },
        {
          term: 'Nearest-neighbor',
          description:
            'A scaling method that enlarges each original cell without blending colors, so pixel art stays crisp.',
        },
        {
          term: 'Color picker',
          description:
            'A tool that takes the color of a cell you click on the canvas and makes it your current drawing color.',
        },
      ],
    },
  };
