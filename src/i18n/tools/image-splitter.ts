import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ImageSplitterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  presetLabel: string;
  presetInstagram: string;
  presetRow3: string;
  presetCol3: string;
  presetGrid2: string;
  rowsLabel: string;
  colsLabel: string;
  reverseLabel: string;
  reverseHint: string;
  formatLabel: string;
  qualityLabel: string;
  previewLabel: string;
  /** {srcWidth}, {srcHeight}, {count}, {tileWidth}, {tileHeight} を置換する */
  outputInfo: string;
  downloadButton: string;
  working: string;
  downloaded: string;
  errorNotImage: string;
  /** {max} を置換する */
  errorTooLarge: string;
  /** {max} を置換する */
  errorTooManyTiles: string;
  errorGridTooFine: string;
  errorZipTooLarge: string;
  errorLoadFailed: string;
  errorExportFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const imageSplitterContent: Record<Locale, ImageSplitterPageContent> = {
  ja: {
    title: '画像分割（Instagram 9分割・グリッド分割・ZIP出力）',
    description:
      '画像を行×列で等分割し、ZIPでまとめて保存できる無料ツールです。Instagramの9分割（3×3）や横3分割のほか、2×2・自由な分割数に対応。画像はブラウザ内で処理され、サーバーには送信されません。',
    h1: '画像分割（Instagram 9分割・グリッド分割をZIPで保存）',
    introHtml:
      '1枚の画像を、行数×列数で同じ大きさのタイルに分割し、PNG・JPEG・WebPのZIPにまとめて保存します。Instagramのプロフィールを飾る3×3の9分割、横に3枚並べるカルーセル、パズルや素材づくりに使えます。ブラウザ内で処理され、画像はアップロードされません。正方形にそろえてから分割したいときは <a href="/tools/image-padding/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像に余白を追加・正方形にする</a>、分割後にZIPを確認したいときは <a href="/tools/zip-tool/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ZIP圧縮・解凍</a> をご利用ください。',
    dropLabel: '画像ファイルを選択',
    dropHint:
      'ここに画像をドラッグ＆ドロップするか、ボタンから選択してください。',
    presetLabel: 'よく使う分割',
    presetInstagram: '3×3（9分割）',
    presetRow3: '横に3分割（3×1）',
    presetCol3: '縦に3分割（1×3）',
    presetGrid2: '2×2（4分割）',
    rowsLabel: '行数（縦の分割数）',
    colsLabel: '列数（横の分割数）',
    reverseLabel: 'Instagram投稿順の番号にする（右下が1番）',
    reverseHint:
      'Instagramは最後に投稿した画像が左上に並ぶため、1番から順に投稿すると元の絵の通りに並びます。',
    formatLabel: '保存形式',
    qualityLabel: '画質',
    previewLabel: 'プレビュー（分割線）',
    outputInfo:
      '元画像: {srcWidth} × {srcHeight} px → {count}枚（1枚あたり約 {tileWidth} × {tileHeight} px）',
    downloadButton: '分割した画像をZIPでダウンロード',
    working: '分割しています…',
    downloaded: 'ダウンロードしました',
    errorNotImage:
      '画像として読み取れません。PNG・JPEG・WebP・GIF・BMPなどの画像ファイルを選んでください。',
    errorTooLarge:
      '画像が大きすぎます（1辺{max}pxまで、総画素数5,000万まで）。先に画像を縮小してください。',
    errorTooManyTiles: '分割数が多すぎます。行数×列数は{max}枚までです。',
    errorGridTooFine:
      '分割数が画像のピクセル数を超えています。行数・列数を減らしてください。',
    errorZipTooLarge:
      '分割した画像の合計が大きすぎてZIPにできません（100MBまで）。画像を縮小するか、画質を下げてください。',
    errorLoadFailed:
      '画像を読み込めませんでした。ファイルが壊れていないか、対応している形式か確認してください。',
    errorExportFailed:
      '画像を書き出せませんでした。お使いのブラウザがこの保存形式に対応していない可能性があります。別の形式をお試しください。',
    howToHeading: '使い方',
    howToSteps: [
      '画像ファイルを枠内にドラッグ＆ドロップするか、ボタンから選びます。',
      '「よく使う分割」を選ぶか、「行数（縦の分割数）」と「列数（横の分割数）」を入力します。プレビューの分割線で確認できます。',
      'Instagramに順に投稿したいときは「Instagram投稿順の番号にする」にチェックします。',
      '「保存形式」を選び、「分割した画像をZIPでダウンロード」で保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '画像は縦横それぞれ均等に分割されます。割り切れないときは、端数のピクセルが各タイルに散らされます（タイル同士の大きさは最大1pxだけ異なります）。',
      '3×3のきれいな正方形タイルにしたいときは、先に正方形の画像にそろえてから分割してください。',
      'ファイル名には、分割数に合わせた番号が付きます（例: photo_1.png〜photo_9.png）。「Instagram投稿順」では右下が1番になります。',
      '「JPEG」は透明を扱えないため、透明な部分は白で保存されます。透明を残したいときは「PNG」または「WebP」を選んでください。',
      '分割数は行×列で100枚まで、読み込める画像は1辺16384px・総画素数5,000万までです。GIFやアニメーションWebPは最初の1コマだけが対象です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'グリッド分割',
        description:
          '画像を縦横の線で碁盤の目のように区切り、同じ大きさの小さな画像（タイル）に分けることです。',
      },
      {
        term: '9分割（3×3）',
        description:
          '3行3列の9枚に分けるInstagramの定番レイアウトです。プロフィールのフィードに並べると1枚の大きな絵に見えます。',
      },
      {
        term: 'ZIP',
        description:
          '複数のファイルを1つにまとめるアーカイブ形式です。分割した画像を1ファイルでまとめて保存できます。',
      },
    ],
  },
  en: {
    title: 'Image Splitter (Instagram Grid, Split into Tiles, ZIP)',
    description:
      'Split an image into equal rows and columns and save all tiles as one ZIP. Ideal for the Instagram 3x3 grid. Runs in your browser; nothing is uploaded.',
    h1: 'Image Splitter: Split a Photo into a Grid and Save as ZIP',
    introHtml:
      'Cut one image into equal tiles by rows and columns, then save them as PNG, JPEG or WebP files in a single ZIP. Use it for the Instagram 3x3 profile grid, three-panel carousels, puzzles and asset sheets. Everything runs in your browser and nothing is uploaded. To make the image square first, use <a href="/en/tools/image-padding/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Padding</a>; to inspect the result, open it in the <a href="/en/tools/zip-tool/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ZIP Tool</a>.',
    dropLabel: 'Choose an image file',
    dropHint: 'Drag and drop an image here, or pick one with the button.',
    presetLabel: 'Common grids',
    presetInstagram: '3×3 (9 tiles)',
    presetRow3: '3 across (3×1)',
    presetCol3: '3 down (1×3)',
    presetGrid2: '2×2 (4 tiles)',
    rowsLabel: 'Rows (vertical splits)',
    colsLabel: 'Columns (horizontal splits)',
    reverseLabel: 'Number in Instagram posting order (bottom-right is 1)',
    reverseHint:
      'Instagram shows the newest post at the top-left, so posting in this order rebuilds the original picture.',
    formatLabel: 'Format',
    qualityLabel: 'Quality',
    previewLabel: 'Preview (split lines)',
    outputInfo:
      'Source: {srcWidth} × {srcHeight} px → {count} tiles (about {tileWidth} × {tileHeight} px each)',
    downloadButton: 'Download tiles as ZIP',
    working: 'Splitting…',
    downloaded: 'Downloaded',
    errorNotImage:
      'This file cannot be read as an image. Choose an image such as PNG, JPEG, WebP, GIF, or BMP.',
    errorTooLarge:
      'The image is too large (up to {max} px per side and 50 million pixels in total). Shrink it first.',
    errorTooManyTiles: 'Too many tiles. Rows × columns can be at most {max}.',
    errorGridTooFine:
      'The grid is finer than the image has pixels. Reduce the rows or columns.',
    errorZipTooLarge:
      'The tiles add up to too much data for one ZIP (100 MB max). Shrink the image or lower the quality.',
    errorLoadFailed:
      'Could not load the image. Check that the file is not corrupted and is in a supported format.',
    errorExportFailed:
      'Could not export the image. Your browser may not support this format. Try another one.',
    howToHeading: 'How to use',
    howToSteps: [
      'Drag and drop an image file into the box, or pick one with the button.',
      'Pick one of the "Common grids", or enter "Rows (vertical splits)" and "Columns (horizontal splits)". The split lines show in the preview.',
      'To post to Instagram in order, tick "Number in Instagram posting order".',
      'Choose a "Format" and click "Download tiles as ZIP" to save them.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The image is split evenly in both directions. When it does not divide exactly, the leftover pixels are spread across the tiles, so tile sizes differ by at most 1 px.',
      'For perfectly square tiles in a 3×3 grid, make the image square first and then split it.',
      'Files are numbered to match the tile count (for example photo_1.png to photo_9.png). With "Instagram posting order", the bottom-right tile is number 1.',
      '"JPEG" cannot hold transparency, so transparent areas are saved as white. Choose "PNG" or "WebP" to keep transparency.',
      'Up to 100 tiles (rows × columns) are supported, and images up to 16384 px per side and 50 million pixels in total can be loaded. For GIF and animated WebP, only the first frame is used.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Grid split',
        description:
          'Dividing an image with horizontal and vertical lines into equal small images (tiles), like a checkerboard.',
      },
      {
        term: '3×3 grid (9 tiles)',
        description:
          'The classic Instagram layout of three rows and three columns. Placed in the profile feed, the nine tiles read as one large picture.',
      },
      {
        term: 'ZIP',
        description:
          'An archive format that bundles many files into one, so all tiles can be saved together.',
      },
    ],
  },
};
