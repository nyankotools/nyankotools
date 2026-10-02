import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ImageBackgroundRemoverPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  /** AI切り抜きではないことを、操作の前に示す注意書き */
  scopeNotice: string;
  dropLabel: string;
  dropHint: string;
  colorLabel: string;
  colorHint: string;
  undoButton: string;
  zoomInButton: string;
  zoomOutButton: string;
  zoomFitButton: string;
  zoomLabel: string;
  modeLabel: string;
  modeGlobalLabel: string;
  modeContiguousLabel: string;
  toleranceLabel: string;
  erodeLabel: string;
  defringeLabel: string;
  outlineWidthLabel: string;
  outlineColorLabel: string;
  previewLabel: string;
  /** {width}, {height} を置換する */
  outputInfo: string;
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

export const imageBackgroundRemoverContent: Record<
  Locale,
  ImageBackgroundRemoverPageContent
> = {
  ja: {
    title: '画像の背景透過（輪郭付き）',
    description:
      '単色の背景を指定して透過PNGにする無料ツールです。許容値の調整、縁に残る背景色の除去、好きな色・太さの輪郭（縁取り）の追加に対応。画像はブラウザ内で処理され、サーバーには送信されません。',
    h1: '画像の背景透過（縁の白残りを除去・輪郭付き）',
    introHtml:
      '白やグリーンバックなどの単色背景を指定して、透明なPNGにします。背景が残るときは許容値、縁に背景色が残るときは縁の処理で調整でき、ステッカー風の輪郭（縁取り）も付けられます。ブラウザ内で処理され、画像はアップロードされません。透過PNGの大きさを変えたいときは <a href="/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像リサイズ・圧縮</a> もご利用ください。',
    scopeNotice:
      'このツールは「背景色を指定して透過する」方式で、AIによる自動切り抜きは行いません。単色で均一な背景の画像に向いています。',
    dropLabel: '画像ファイルを選択',
    dropHint:
      'ここに画像をドラッグ＆ドロップするか、ボタンから選択してください。',
    colorLabel: '背景色',
    colorHint:
      'プレビューをクリックすると、その位置の色が背景として追加され、これまでの指定と合わせて透過されます（スポイト）。読み込み直後は画像の左上の色だけが指定されています。',
    undoButton: '一つ前に戻る',
    zoomInButton: '拡大',
    zoomOutButton: '縮小',
    zoomFitButton: '画面に合わせる',
    zoomLabel: 'プレビューの表示倍率',
    modeLabel: '透過する範囲',
    modeGlobalLabel: '画像全体',
    modeContiguousLabel: 'つながった領域だけ',
    toleranceLabel: '許容値',
    erodeLabel: '縁を削る',
    defringeLabel: '縁の色をなじませる',
    outlineWidthLabel: '輪郭の太さ',
    outlineColorLabel: '輪郭の色',
    previewLabel: 'プレビュー（市松模様の部分が透明）',
    outputInfo: '出力サイズ: {width} × {height} px',
    downloadButton: '透過PNGをダウンロード',
    downloaded: 'ダウンロードしました',
    errorNotImage:
      '画像として読み取れません。PNG・JPEG・WebP・GIF・BMPなどの画像ファイルを選んでください。',
    errorTooLarge:
      '画像が大きすぎます（総画素数{max}まで）。先に画像を縮小してください。',
    errorLoadFailed:
      '画像を読み込めませんでした。ファイルが壊れていないか、対応している形式か確認してください。',
    errorExportFailed:
      'PNGを書き出せませんでした。画像が大きすぎるか、ブラウザの制限の可能性があります。',
    howToHeading: '使い方',
    howToSteps: [
      '画像ファイルを枠内にドラッグ＆ドロップするか、ボタンから選びます。',
      '「背景色」を確認します。透過したい色が残っているときは、プレビューのその部分をクリックして追加します（何か所でも続けて追加できます）。間違えたときは「一つ前に戻る」で取り消せます。細かい部分は「拡大」で大きくして指定できます。',
      '背景が残るときは「許容値」を上げ、前景まで消えるときは下げます。「透過する範囲」で、画像全体の同色を消すか、つながった領域だけを消すかを選べます。',
      '縁に背景色が残るときは「縁を削る」「縁の色をなじませる」で調整します。輪郭を付けたいときは「輪郭の太さ」と「輪郭の色」を設定します。',
      '「透過PNGをダウンロード」で保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '背景色との色の近さで透明にするため、前景に背景と似た色（白い背景に白い服など）があると、その部分も透明になることがあります。その場合は「許容値」を下げるか、「つながった領域だけ」を選んでください。',
      '背景がグラデーションや写真のように均一でない画像は、きれいに透過できないことがあります。AIによる被写体の自動認識は行いません。',
      '輪郭を付けると、輪郭の太さの分だけ四辺に余白が加わり、出力サイズが大きくなります。',
      '総画素数が1,600万（4000×4000程度）を超える画像は処理できません。ブラウザ内で処理するため、大きな画像では少し時間がかかります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '許容値',
        description:
          '背景色とどのくらい近い色までを背景とみなすかの幅です。大きいほど広い範囲の色が透明になります。',
      },
      {
        term: 'デフリンジ',
        description:
          '切り抜いた縁に残る、背景色が混ざったピクセル（白い縁取りなど）を取り除く処理です。このツールでは、縁を内側に削ることと、縁の色を内側の色に置き換えることで行います。',
      },
      {
        term: 'アルファチャンネル',
        description:
          '画像の各ピクセルの透明度を表すデータです。PNGやWebPは対応しており、背景を透明にして保存できます。JPEGは対応していません。',
      },
    ],
  },
  en: {
    title: 'Image Background Remover (With Outline)',
    description:
      'Make a solid-color background transparent as a PNG, clean up leftover edge color, and add an outline. Runs in your browser; nothing is uploaded.',
    h1: 'Image Background Remover (No White Halo, With Outline)',
    introHtml:
      'Pick a solid background such as white or a green screen and turn it into a transparent PNG. Tune the tolerance when background remains, use the edge options when the background color lingers on the edges, and add a sticker-style outline. Everything runs in your browser and nothing is uploaded. To resize the transparent PNG afterward, try the <a href="/en/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Resizer</a>.',
    scopeNotice:
      'This tool removes a background by the color you specify and does not use AI cutout. It works best on images with a solid, even background.',
    dropLabel: 'Choose an image file',
    dropHint: 'Drag and drop an image here, or pick one with the button.',
    colorLabel: 'Background color',
    colorHint:
      'Click the preview to add the color at that point as a background; it is made transparent together with your earlier picks (eyedropper). Right after loading, only the top-left corner color is picked.',
    undoButton: 'Undo last pick',
    zoomInButton: 'Zoom in',
    zoomOutButton: 'Zoom out',
    zoomFitButton: 'Fit to screen',
    zoomLabel: 'Preview zoom',
    modeLabel: 'Area to remove',
    modeGlobalLabel: 'Whole image',
    modeContiguousLabel: 'Connected area only',
    toleranceLabel: 'Tolerance',
    erodeLabel: 'Shrink edges',
    defringeLabel: 'Blend edge colors',
    outlineWidthLabel: 'Outline width',
    outlineColorLabel: 'Outline color',
    previewLabel: 'Preview (the checkerboard is transparent)',
    outputInfo: 'Output size: {width} × {height} px',
    downloadButton: 'Download transparent PNG',
    downloaded: 'Downloaded',
    errorNotImage:
      'This file cannot be read as an image. Choose an image such as PNG, JPEG, WebP, GIF, or BMP.',
    errorTooLarge:
      'The image is too large (up to {max} pixels in total). Shrink it first.',
    errorLoadFailed:
      'Could not load the image. Check that the file is not corrupted and is in a supported format.',
    errorExportFailed:
      'Could not export the PNG. The image may be too large, or the browser may be limiting it.',
    howToHeading: 'How to use',
    howToSteps: [
      'Drag and drop an image file into the box, or pick one with the button.',
      'Check the "Background color". If a color you want gone is still there, click that spot in the preview to add it (you can keep adding). Use "Undo last pick" to take back a mistake, and "Zoom in" to pick small areas precisely.',
      'If background remains, raise the "Tolerance"; if the subject starts disappearing, lower it. "Area to remove" lets you clear the same color across the whole image, or only the connected area.',
      'If the background color lingers on the edges, adjust "Shrink edges" and "Blend edge colors". To add an outline, set the "Outline width" and "Outline color".',
      'Click "Download transparent PNG" to save it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Pixels become transparent by how close they are to the background color, so parts of the subject with a similar color (such as white clothes on a white background) may disappear too. Lower the "Tolerance" or choose "Connected area only" in that case.',
      'Images whose background is not even, such as gradients or photographs, may not come out cleanly. There is no AI subject detection.',
      'Adding an outline adds padding of the outline width on all four sides, so the output becomes larger.',
      'Images over 16 million pixels in total (about 4000×4000) cannot be processed. Large images take a little longer because everything runs in your browser.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Tolerance',
        description:
          'How close a color may be to the background color and still count as background. A higher value makes a wider range of colors transparent.',
      },
      {
        term: 'Defringing',
        description:
          'Removing the pixels along a cutout edge that still carry the background color, such as a white halo. This tool does it by shrinking the edges and by replacing edge colors with colors from inside the subject.',
      },
      {
        term: 'Alpha channel',
        description:
          'Data that stores the transparency of each pixel. PNG and WebP support it, so the background can be saved as transparent. JPEG does not.',
      },
    ],
  },
};
