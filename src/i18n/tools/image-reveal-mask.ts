import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ImageRevealMaskPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{width}` `{height}` `{size}` を置換 */
  sourceInfoTemplate: string;
  /** `{width}` `{height}` を置換 */
  downscaledTemplate: string;
  colorLabel: string;
  opacityLabel: string;
  /** `{value}` を置換 */
  opacityValueTemplate: string;
  invertLabel: string;
  addShapeLabel: string;
  addButton: string;
  shapeNames: Record<
    | 'rect'
    | 'rounded'
    | 'circle'
    | 'ellipse'
    | 'triangle'
    | 'diamond'
    | 'star'
    | 'heart',
    string
  >;
  canvasLabel: string;
  canvasHint: string;
  touchModeLabel: string;
  touchModeEdit: string;
  touchModeScroll: string;
  touchModeHint: string;
  /** `{count}` を置換 */
  shapeCountTemplate: string;
  selectedLabel: string;
  noSelectionHint: string;
  duplicateButton: string;
  deleteButton: string;
  clearShapesButton: string;
  formatLabel: string;
  downloadButton: string;
  clearButton: string;
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

export const imageRevealMaskContent: Record<
  Locale,
  ImageRevealMaskPageContent
> = {
  ja: {
    title:
      '画像くり抜きマスク｜一部だけ見せる加工（スポットライト・クイズ画像）',
    description:
      '画像を単色で覆い、四角・円・星・ハートなどの形だけくり抜いて元画像を見せる無料ツール。図形の移動・拡大縮小・回転・複数配置に対応し、クイズ画像やスポットライト風の加工に。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '画像くり抜きマスクツール（一部だけ見せる加工）',
    introHtml:
      '画像を選ぶと全体が単色で覆われ、そこに追加した図形の部分だけが元画像のまま見える（くり抜かれる）画像を作れます。クイズの出題画像、ネタバレ防止、スポットライト風の加工などに便利です。図形はドラッグで移動、角のハンドルで拡大縮小、上の丸いハンドルで回転できます。画像はアップロードされず、すべてブラウザ内で処理されます。顔や個人情報を隠したい場合は<a href="/tools/image-blur-mosaic/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像モザイク・ぼかしツール</a>、切り抜きだけなら<a href="/tools/image-cropper/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像トリミングツール</a>をご利用ください。',
    dropLabel: '画像ファイルを選択',
    dropHint: 'ここに画像ファイルをドラッグ＆ドロップすることもできます',
    sourceInfoTemplate: '元画像: {width}×{height}px（{size}）',
    downscaledTemplate:
      '画像が大きいため {width}×{height}px に縮小して編集します。',
    colorLabel: '覆う色',
    opacityLabel: '覆いの濃さ',
    opacityValueTemplate: '{value}%',
    invertLabel: '反転する（図形の外側を見せ、内側を覆う）',
    addShapeLabel: '追加する図形',
    addButton: '図形を追加',
    shapeNames: {
      rect: '四角',
      rounded: '角丸四角',
      circle: '円',
      ellipse: '楕円',
      triangle: '三角',
      diamond: 'ひし形',
      star: '星',
      heart: 'ハート',
    },
    canvasLabel: '編集中の画像（図形をドラッグして移動）',
    canvasHint:
      '図形をドラッグで移動、四隅の四角いハンドルで拡大縮小（中心を基準に拡縮）、上の丸いハンドルで回転します。何もない場所をクリックすると選択が外れます。',
    touchModeLabel: 'スマホでの操作',
    touchModeEdit: '図形を操作',
    touchModeScroll: 'スクロール',
    touchModeHint:
      '「図形を操作」中は画像の上で指をなぞると図形を動かせ、ページはスクロールしません。スクロールしたいときは「スクロール」に切り替えてください。',
    shapeCountTemplate: '配置した図形: {count}個',
    selectedLabel: '選択中の図形の種類',
    noSelectionHint: '図形をクリックすると種類の変更や削除ができます。',
    duplicateButton: '複製',
    deleteButton: '削除',
    clearShapesButton: '図形をすべて削除',
    formatLabel: '保存形式',
    downloadButton: '加工した画像をダウンロード',
    clearButton: '画像をクリア',
    errorUnsupportedFile:
      '対応していないファイル形式です（PNG/JPEG/WebP/GIF/BMPのみ読み込めます）',
    errorLoadFailed:
      '画像を読み込めませんでした。ファイルが破損している可能性があります。',
    errorExportFailed:
      '画像の書き出しに失敗しました。別の保存形式をお試しください。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    notesHeading: '注意点',
    notes: [
      '図形を1つも置かないと、画像全体が覆われた状態になります。まず「図形を追加」で見せたい部分を作ってください。',
      '覆いの濃さを100%未満にすると、覆った部分から元の画像が透けて見えます。内容を完全に隠したい場合は100%にしてください。',
      '保存後の画像から元の画像を取り出すことはできませんが、元のファイルや公開済みの画像は別途管理してください。',
      '長辺が4096pxを超える画像は、編集と書き出しのために4096pxに縮小されます。',
      '写真の向き（EXIF）はブラウザの判定に従って補正されます。メタデータ（撮影位置など）は書き出し時に再エンコードされるため引き継がれません。',
      'GIFは先頭フレームのみが対象になり、アニメーションは保持されません。',
      'JPEGで保存すると透過部分は白で塗りつぶされます。',
      'すべての処理はブラウザ内で完結し、選択した画像がサーバーに送信されることはありません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '画像ファイルを選択します（ドラッグ＆ドロップも可能です）。',
      '「覆う色」と「覆いの濃さ」を決め、「図形を追加」で見せたい形を置きます。',
      '図形をドラッグして動かし、角のハンドルで大きさ、上の丸いハンドルで角度を調整します。複数の図形を置くこともできます。',
      '保存形式を選んで、加工した画像をダウンロードします。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'くり抜き（マスク）',
        description:
          '画像の一部を覆い、図形の部分だけ下の画像が見えるようにする加工。本ツールでは単色の覆いから図形の形を抜いています。',
      },
      {
        term: '反転',
        description:
          'くり抜く範囲を逆にする設定。図形の内側を覆い、外側を元画像のまま見せます。',
      },
    ],
  },
  en: {
    title: 'Image Reveal Mask – Show Only Cut-Out Shapes of a Photo',
    description:
      'Cover a photo with a solid color and cut out circles, stars or hearts to reveal the original. Move, resize and rotate shapes. Runs in your browser.',
    h1: 'Image Reveal Mask Tool (Show Only Part of a Photo)',
    introHtml:
      'Choose an image and it is covered with a solid color; every shape you add cuts a window that shows the original image through. It is handy for quiz pictures, spoiler protection, and spotlight-style edits. Drag a shape to move it, use the corner handles to resize, and the round handle on top to rotate. Your image is never uploaded; everything happens in your browser. To hide faces or personal info, use the <a href="/en/tools/image-blur-mosaic/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Blur & Mosaic</a> tool, or the <a href="/en/tools/image-cropper/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Cropper</a> if you only need a crop.',
    dropLabel: 'Choose an image file',
    dropHint: 'You can also drag and drop an image file here',
    sourceInfoTemplate: 'Original: {width}×{height}px ({size})',
    downscaledTemplate:
      'The image is large, so it is edited at a reduced size of {width}×{height}px.',
    colorLabel: 'Cover color',
    opacityLabel: 'Cover opacity',
    opacityValueTemplate: '{value}%',
    invertLabel: 'Invert (show outside the shapes, cover inside)',
    addShapeLabel: 'Shape to add',
    addButton: 'Add shape',
    shapeNames: {
      rect: 'Rectangle',
      rounded: 'Rounded rectangle',
      circle: 'Circle',
      ellipse: 'Ellipse',
      triangle: 'Triangle',
      diamond: 'Diamond',
      star: 'Star',
      heart: 'Heart',
    },
    canvasLabel: 'Image being edited (drag a shape to move it)',
    canvasHint:
      'Drag a shape to move it, use the square corner handles to resize and the round handle on top to rotate. Click an empty spot to deselect.',
    touchModeLabel: 'Touch mode',
    touchModeEdit: 'Edit shapes',
    touchModeScroll: 'Scroll',
    touchModeHint:
      'In Edit shapes mode, swiping on the image moves shapes and the page will not scroll. Switch to Scroll to move the page.',
    shapeCountTemplate: 'Shapes placed: {count}',
    selectedLabel: 'Selected shape type',
    noSelectionHint: 'Click a shape to change its type or delete it.',
    duplicateButton: 'Duplicate',
    deleteButton: 'Delete',
    clearShapesButton: 'Delete all shapes',
    formatLabel: 'Save as',
    downloadButton: 'Download edited image',
    clearButton: 'Clear image',
    errorUnsupportedFile:
      'Unsupported file type (only PNG, JPEG, WebP, GIF, and BMP can be opened)',
    errorLoadFailed: 'Could not load the image. The file may be corrupted.',
    errorExportFailed:
      'Could not export the image. Try a different save format.',
    errorFileTooLargeTemplate: 'This file exceeds the size limit ({max})',
    notesHeading: 'Notes',
    notes: [
      'With no shapes the whole image stays covered. Use "Add shape" first to make the part you want to show.',
      'If the cover opacity is below 100%, the original image shows through the covered area. Use 100% to hide it completely.',
      'The original cannot be recovered from the saved image, but keep track of your original file and of images you have already published.',
      'Images whose longer side exceeds 4096px are scaled down to 4096px for editing and export.',
      'Photo orientation (EXIF) is corrected following the browser. Metadata such as the shooting location is dropped because the image is re-encoded.',
      'For GIFs, only the first frame is used and animation is not preserved.',
      'Saving as JPEG fills transparent areas with white.',
      'All processing happens in your browser — the image you select is never sent to a server.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose an image file (drag & drop also works).',
      'Set the "Cover color" and "Cover opacity", then place the shape you want to reveal with "Add shape".',
      'Drag the shape to move it, resize with the corner handles and rotate with the round handle on top. You can place several shapes.',
      'Choose a save format and download the edited image.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Cut-out (mask)',
        description:
          'Covers part of an image so the picture underneath shows only through certain shapes. Here a solid cover has the shapes cut out of it.',
      },
      {
        term: 'Invert',
        description:
          'Reverses the cut-out area: the inside of the shapes is covered and the outside shows the original image.',
      },
    ],
  },
};
