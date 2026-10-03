import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface GifMakerPageContent {
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
  widthLabel: string;
  delayLabel: string;
  backgroundLabel: string;
  loopLabel: string;
  pingpongLabel: string;
  generateButton: string;
  previewLabel: string;
  /** {current}, {total} を置換する */
  progress: string;
  /** {width}, {height}, {frames}, {size} を置換する */
  resultInfo: string;
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
  errorNeedImages: string;
  errorFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const gifMakerContent: Record<Locale, GifMakerPageContent> = {
  ja: {
    title: 'GIF作成（連番画像からアニメーションGIFを作る）',
    description:
      '複数の画像を並べて、パラパラ漫画のようなアニメーションGIFを作る無料ツールです。表示時間・サイズ・背景色・くり返しの指定に対応し、画像はブラウザ内で処理されるためサーバーには送信されません。',
    h1: 'GIF作成（連番画像からアニメーションGIFを作る）',
    introHtml:
      '複数の画像を順番につなげて、アニメーションGIFを作ります。パラパラ漫画やスタンプ風の動く画像、連番で書き出した画像のGIF化に便利です。ブラウザ内で処理され、画像はアップロードされません。GIFで使う画像の大きさをそろえたいときは <a href="/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像リサイズ・圧縮</a> もご利用ください。',
    dropLabel: '画像ファイルを選択（複数可）',
    dropHint:
      'ここに画像をドラッグ＆ドロップするか、ボタンから選択してください。ファイル名の順には並べ替えないので、一覧で順番を整えてください。',
    listLabel: 'コマ（この順に再生されます）',
    moveUpButton: '↑ 上へ',
    moveDownButton: '↓ 下へ',
    removeButton: '削除',
    clearButton: 'すべて削除',
    moveUpAria: '{name} を前へ移動',
    moveDownAria: '{name} を後ろへ移動',
    removeAria: '{name} を削除',
    widthLabel: 'GIFの幅（px）',
    delayLabel: '1コマの表示時間（ミリ秒）',
    backgroundLabel: '背景色',
    loopLabel: 'ループ再生する',
    pingpongLabel: '往復再生する',
    generateButton: 'GIFを作成',
    previewLabel: 'プレビュー',
    progress: '作成中… {current} / {total} コマ',
    resultInfo: '{width} × {height} px・{frames}コマ・{size}',
    downloadButton: 'GIFをダウンロード',
    downloaded: 'ダウンロードしました',
    errorNotImage:
      '「{name}」は画像として読み取れません。PNG・JPEG・WebP・GIF・BMPなどの画像ファイルを選んでください。',
    errorLoadFailed:
      '「{name}」を読み込めませんでした。ファイルが壊れていないか、対応している形式か確認してください。',
    errorTooLarge:
      '「{name}」は大きすぎます（1辺{max}pxまで、総画素数5,000万まで）。先に画像を縮小してください。',
    errorTooMany: '一度に使えるコマは{max}枚までです。',
    errorNeedImages: '画像を1枚以上追加してください。',
    errorFailed:
      'GIFを作成できませんでした。コマ数やサイズを減らして、もう一度お試しください。',
    howToHeading: '使い方',
    howToSteps: [
      '画像ファイルを枠内にドラッグ＆ドロップするか、ボタンから複数選びます。',
      '「コマ」の一覧で、「↑ 上へ」「↓ 下へ」を使って再生する順番を整えます。不要なコマは「削除」で外せます。',
      '「GIFの幅」「1コマの表示時間」「背景色」を決め、必要なら「ループ再生する」「往復再生する」を選びます。',
      '「GIFを作成」を押し、プレビューを確認したら「GIFをダウンロード」で保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '使えるコマは100枚まで、GIFの幅は16〜1200pxまでです。コマ数や幅が大きいほど、作成に時間がかかりファイルも大きくなります。',
      'GIFは1コマ256色までのため、写真は色数が減って階調が粗くなります。ファイルサイズは、幅を小さくするかコマ数を減らすと抑えられます。',
      '最初の画像の縦横比にGIFの大きさを合わせます。縦横比の違う画像は、中央に収めて余白を背景色で埋めます。',
      '透明は扱わず、透明部分は背景色で塗られます。GIFやアニメーションWebPを読み込んだ場合は、最初の1コマだけが使われます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'アニメーションGIF',
        description:
          '複数の画像（コマ）を1つのファイルにまとめ、順番に切り替えて動いて見せる画像形式です。音は出せず、SNSやチャットで手軽に使えます。',
      },
      {
        term: '256色の制限',
        description:
          'GIFは1コマで使える色が最大256色です。写真のように色数の多い画像は、近い色にまとめる「減色」が行われ、グラデーションが段になって見えることがあります。',
      },
      {
        term: 'ループ再生',
        description:
          '最後のコマまで再生したあと、最初に戻ってくり返す設定です。オフにすると、1回だけ再生して止まります。',
      },
      {
        term: '往復再生',
        description:
          '最後のコマまで再生したあと、同じ順番を逆向きにたどって最初に戻る再生方法です。両端のコマは重ねずに折り返すため、コマが4枚なら1→2→3→4→3→2の順になります。始めと終わりが同じ姿勢の動きなどを、つなぎ目なく見せたいときに使います。',
      },
    ],
  },
  en: {
    title: 'GIF Maker (Create an Animated GIF from Images)',
    description:
      'Turn several images into an animated GIF, like a flip book. Set the frame delay, size, background color, and looping. Runs in your browser; nothing is uploaded.',
    h1: 'GIF Maker (Create an Animated GIF from Images)',
    introHtml:
      'Join several images in order to make an animated GIF. It works for flip-book animations, sticker-style moving images, and turning an image sequence into a GIF. Everything runs in your browser and nothing is uploaded. To make your source images the same size first, try the <a href="/en/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Resizer</a>.',
    dropLabel: 'Choose image files (multiple allowed)',
    dropHint:
      'Drag and drop images here, or pick them with the button. Files are not sorted by name, so set the order in the list.',
    listLabel: 'Frames (played in this order)',
    moveUpButton: '↑ Up',
    moveDownButton: '↓ Down',
    removeButton: 'Remove',
    clearButton: 'Remove all',
    moveUpAria: 'Move {name} earlier',
    moveDownAria: 'Move {name} later',
    removeAria: 'Remove {name}',
    widthLabel: 'GIF width (px)',
    delayLabel: 'Frame delay (ms)',
    backgroundLabel: 'Background color',
    loopLabel: 'Loop forever',
    pingpongLabel: 'Play forward and back (ping-pong)',
    generateButton: 'Create GIF',
    previewLabel: 'Preview',
    progress: 'Creating… frame {current} of {total}',
    resultInfo: '{width} × {height} px · {frames} frames · {size}',
    downloadButton: 'Download GIF',
    downloaded: 'Downloaded',
    errorNotImage:
      '"{name}" cannot be read as an image. Choose an image such as PNG, JPEG, WebP, GIF, or BMP.',
    errorLoadFailed:
      'Could not load "{name}". Check that the file is not corrupted and is in a supported format.',
    errorTooLarge:
      '"{name}" is too large (up to {max} px per side and 50 million pixels in total). Shrink it first.',
    errorTooMany: 'You can use up to {max} frames at a time.',
    errorNeedImages: 'Add at least one image.',
    errorFailed:
      'Could not create the GIF. Try again with fewer frames or a smaller size.',
    howToHeading: 'How to use',
    howToSteps: [
      'Drag and drop image files into the box, or pick several with the button.',
      'In the "Frames" list, use "↑ Up" and "↓ Down" to set the playback order. Drop unwanted frames with "Remove".',
      'Set "GIF width", "Frame delay", and "Background color", and choose "Loop forever" or "Play forward and back (ping-pong)" if you need them.',
      'Click "Create GIF", check the preview, then click "Download GIF" to save it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'You can use up to 100 frames, and the GIF width can be 16 to 1200 px. More frames and a larger width take longer to create and make a bigger file.',
      'A GIF frame holds at most 256 colors, so photos lose some color depth and look coarser. Use a smaller width or fewer frames to keep the file small.',
      'The GIF takes the aspect ratio of the first image. Images with a different ratio are centered and the leftover space is filled with the background color.',
      'Transparency is not preserved; transparent areas are filled with the background color. For GIF and animated WebP inputs, only the first frame is used.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Animated GIF',
        description:
          'An image format that bundles several images (frames) into one file and switches between them to look like motion. It has no sound and is easy to share on social media and chat.',
      },
      {
        term: '256-color limit',
        description:
          'A GIF frame can use at most 256 colors. Colorful images such as photos are reduced to similar colors ("color quantization"), which can make gradients look banded.',
      },
      {
        term: 'Looping',
        description:
          'Going back to the first frame after the last one and playing again. With looping off, the animation plays once and stops.',
      },
      {
        term: 'Ping-pong playback',
        description:
          'Playing to the last frame and then back through the same frames in reverse. The end frames are not repeated, so four frames play as 1, 2, 3, 4, 3, 2. It makes motions that start and end in the same pose look seamless.',
      },
    ],
  },
};
