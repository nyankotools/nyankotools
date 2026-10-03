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

export interface ImageMergerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  listLabel: string;
  moveUpButton: string;
  moveDownButton: string;
  removeButton: string;
  clearButton: string;
  /** {name} を置換する（読み上げ用のボタン名） */
  moveUpAria: string;
  moveDownAria: string;
  removeAria: string;
  directionLabel: string;
  directionOptions: SelectOption[];
  columnsLabel: string;
  gapLabel: string;
  marginLabel: string;
  fitLabel: string;
  alignLabel: string;
  alignOptions: SelectOption[];
  backgroundLabel: string;
  transparentLabel: string;
  previewLabel: string;
  formatLabel: string;
  qualityLabel: string;
  /** {width}, {height}, {count} を置換する */
  outputInfo: string;
  downloadButton: string;
  downloaded: string;
  /** {name} を置換する */
  errorNotImage: string;
  /** {name} を置換する */
  errorLoadFailed: string;
  /** {name}, {max} を置換する */
  errorTooLarge: string;
  /** {max} を置換する */
  errorTooMany: string;
  /** {max} を置換する */
  errorLayoutTooLarge: string;
  errorExportFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const imageMergerContent: Record<Locale, ImageMergerPageContent> = {
  ja: {
    title: '画像結合（縦・横・グリッドに並べて1枚に）',
    description:
      '複数の画像を、横並び・縦並び・グリッド状に並べて1枚の画像にまとめる無料ツールです。順番の入れ替え、間隔・余白・背景色の指定、大きさをそろえる設定に対応し、PNG・JPEG・WebPで保存できます。画像はブラウザ内で処理され、サーバーには送信されません。',
    h1: '画像結合（複数の画像を1枚にまとめる）',
    introHtml:
      '複数の画像を、横・縦・グリッドのいずれかで並べて1枚の画像にします。スクリーンショットの連結や、ビフォーアフターの比較画像づくりに便利です。ブラウザ内で処理され、画像はアップロードされません。結合後に大きさを変えたいときは <a href="/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像リサイズ・圧縮</a> もご利用ください。',
    dropLabel: '画像ファイルを選択（複数可）',
    dropHint:
      'ここに画像をドラッグ＆ドロップするか、ボタンから選択してください。あとから追加もできます。',
    listLabel: '結合する画像（この順に並びます）',
    moveUpButton: '↑ 上へ',
    moveDownButton: '↓ 下へ',
    removeButton: '削除',
    clearButton: 'すべて削除',
    moveUpAria: '{name} を前へ移動',
    moveDownAria: '{name} を後ろへ移動',
    removeAria: '{name} を削除',
    directionLabel: '並べ方',
    directionOptions: [
      { value: 'horizontal', label: '横に並べる', selected: true },
      { value: 'vertical', label: '縦に並べる' },
      { value: 'grid', label: 'グリッド状に並べる' },
    ],
    columnsLabel: '列数（グリッドのとき）',
    gapLabel: '画像の間隔（px）',
    marginLabel: '外側の余白（px）',
    fitLabel: '大きさをそろえる',
    alignLabel: '位置の揃え',
    alignOptions: [
      { value: 'start', label: '上・左に揃える' },
      { value: 'center', label: '中央に揃える', selected: true },
      { value: 'end', label: '下・右に揃える' },
    ],
    backgroundLabel: '背景色',
    transparentLabel: '背景を透明にする（PNG・WebPのみ）',
    previewLabel: 'プレビュー',
    formatLabel: '保存形式',
    qualityLabel: '画質',
    outputInfo: '出力サイズ: {width} × {height} px（{count}枚）',
    downloadButton: '結合した画像をダウンロード',
    downloaded: 'ダウンロードしました',
    errorNotImage:
      '「{name}」は画像として読み取れません。PNG・JPEG・WebP・GIF・BMPなどの画像ファイルを選んでください。',
    errorLoadFailed:
      '「{name}」を読み込めませんでした。ファイルが壊れていないか、対応している形式か確認してください。',
    errorTooLarge:
      '「{name}」は大きすぎます（1辺{max}pxまで、総画素数5,000万まで）。先に画像を縮小してください。',
    errorTooMany: '一度に結合できる画像は{max}枚までです。',
    errorLayoutTooLarge:
      '結合後の画像が大きすぎます（1辺{max}pxまで、総画素数5,000万まで）。画像の枚数や間隔を減らすか、大きさをそろえる設定を見直してください。',
    errorExportFailed:
      '画像を書き出せませんでした。お使いのブラウザがこの保存形式に対応していない可能性があります。別の形式をお試しください。',
    howToHeading: '使い方',
    howToSteps: [
      '画像ファイルを枠内にドラッグ＆ドロップするか、ボタンから複数選びます。',
      '「結合する画像」の一覧で、「↑ 上へ」「↓ 下へ」を使って並べる順番を整えます。不要な画像は「削除」で外せます。',
      '「並べ方」で横・縦・グリッドを選び、「画像の間隔」「外側の余白」「背景色」などを調整します。プレビューで仕上がりを確認できます。',
      '「保存形式」を選び、「結合した画像をダウンロード」で保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '一度に結合できるのは50枚までです。結合後の画像は、1辺16384px・総画素数5,000万までです。',
      '「大きさをそろえる」をオフにすると画像は元のサイズのまま並び、サイズの違う画像のすき間は背景色で塗られます。オンにすると、横並びは高さ、縦並びは幅にそろえて拡大・縮小します。',
      '「JPEG」は透明を扱えないため、「背景を透明にする」を選んでも白で塗りつぶされます。透明を残したいときは「PNG」または「WebP」を選んでください。',
      'GIFやアニメーションWebPは、最初の1コマだけが使われます。スマートフォンの写真の向き（EXIF）は自動で反映されます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'グリッド',
        description:
          '画像を格子状（行と列）に並べる配置です。列数を決めると、画像は左から右、上から下の順に並びます。',
      },
      {
        term: 'アスペクト比（縦横比）',
        description:
          '画像の幅と高さの比率です。比率の違う画像を並べると、そろえきれない部分にすき間ができるため、「大きさをそろえる」で調整します。',
      },
      {
        term: 'EXIF',
        description:
          '写真に埋め込まれる撮影情報です。スマートフォンの写真は、向きの情報もここに入っており、ブラウザが自動で正しい向きに直します。',
      },
    ],
  },
  en: {
    title: 'Image Merger: Combine Images Side by Side or in a Grid',
    description:
      'Combine images side by side, stacked, or in a grid. Reorder, set spacing and background, save as PNG, JPEG, or WebP. Runs in your browser; nothing is uploaded.',
    h1: 'Image Merger (Combine Multiple Images Into One)',
    introHtml:
      'Arrange several images horizontally, vertically, or in a grid and save them as a single image. It is handy for stitching screenshots together or making before-and-after comparisons. Everything runs in your browser and nothing is uploaded. To change the size after merging, try the <a href="/en/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Resizer</a>.',
    dropLabel: 'Choose image files (multiple allowed)',
    dropHint:
      'Drag and drop images here, or pick them with the button. You can add more later.',
    listLabel: 'Images to merge (in this order)',
    moveUpButton: '↑ Up',
    moveDownButton: '↓ Down',
    removeButton: 'Remove',
    clearButton: 'Remove all',
    moveUpAria: 'Move {name} earlier',
    moveDownAria: 'Move {name} later',
    removeAria: 'Remove {name}',
    directionLabel: 'Layout',
    directionOptions: [
      { value: 'horizontal', label: 'Side by side', selected: true },
      { value: 'vertical', label: 'Stacked' },
      { value: 'grid', label: 'Grid' },
    ],
    columnsLabel: 'Columns (for grid)',
    gapLabel: 'Gap between images (px)',
    marginLabel: 'Outer margin (px)',
    fitLabel: 'Match sizes',
    alignLabel: 'Alignment',
    alignOptions: [
      { value: 'start', label: 'Top / left' },
      { value: 'center', label: 'Center', selected: true },
      { value: 'end', label: 'Bottom / right' },
    ],
    backgroundLabel: 'Background color',
    transparentLabel: 'Transparent background (PNG and WebP only)',
    previewLabel: 'Preview',
    formatLabel: 'Format',
    qualityLabel: 'Quality',
    outputInfo: 'Output size: {width} × {height} px ({count} images)',
    downloadButton: 'Download merged image',
    downloaded: 'Downloaded',
    errorNotImage:
      '"{name}" cannot be read as an image. Choose an image such as PNG, JPEG, WebP, GIF, or BMP.',
    errorLoadFailed:
      'Could not load "{name}". Check that the file is not corrupted and is in a supported format.',
    errorTooLarge:
      '"{name}" is too large (up to {max} px per side and 50 million pixels in total). Shrink it first.',
    errorTooMany: 'You can merge up to {max} images at a time.',
    errorLayoutTooLarge:
      'The merged image is too large (up to {max} px per side and 50 million pixels in total). Use fewer images, a smaller gap, or review the "Match sizes" setting.',
    errorExportFailed:
      'Could not export the image. Your browser may not support this format. Try another one.',
    howToHeading: 'How to use',
    howToSteps: [
      'Drag and drop image files into the box, or pick several with the button.',
      'In the "Images to merge" list, use "↑ Up" and "↓ Down" to set the order. Drop unwanted images with "Remove".',
      'Choose side by side, stacked, or grid under "Layout", then adjust "Gap between images", "Outer margin", "Background color", and more. The preview shows the result.',
      'Choose a "Format" and click "Download merged image" to save it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'You can merge up to 50 images at a time. The merged image can be up to 16384 px per side and 50 million pixels in total.',
      'With "Match sizes" off, images keep their original size and any gaps caused by different sizes are filled with the background color. With it on, images are scaled to the same height (side by side) or the same width (stacked).',
      '"JPEG" cannot hold transparency, so the background is filled with white even if "Transparent background" is checked. Choose "PNG" or "WebP" to keep transparency.',
      'For GIF and animated WebP, only the first frame is used. The orientation stored in smartphone photos (EXIF) is applied automatically.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Grid',
        description:
          'A layout that arranges images in rows and columns. Once you set the number of columns, images fill from left to right, then top to bottom.',
      },
      {
        term: 'Aspect ratio',
        description:
          'The ratio of an image width to its height. Images with different ratios leave gaps when placed together, so use "Match sizes" to adjust.',
      },
      {
        term: 'EXIF',
        description:
          'Shooting information embedded in a photo. Smartphone photos store their orientation here, and the browser rotates them correctly for you.',
      },
    ],
  },
};
