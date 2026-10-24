import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface GifSplitterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  originalLabel: string;
  /** {width}, {height}, {frames}, {duration}, {loop} を置換する */
  fileInfo: string;
  loopInfinite: string;
  loopNone: string;
  /** {n} を置換する */
  loopTimes: string;
  framesLabel: string;
  /** {selected}, {total} を置換する */
  selectedCount: string;
  selectAllButton: string;
  selectNoneButton: string;
  /** {n} を置換する（読み上げ用のチェックボックス名） */
  includeAria: string;
  /** {n}, {delay} を置換する */
  frameCaption: string;
  zipHeading: string;
  zipButton: string;
  gifHeading: string;
  modeLabel: string;
  modeSpeed: string;
  modeFixed: string;
  valueLabelSpeed: string;
  valueLabelFixed: string;
  loopLabel: string;
  gifButton: string;
  previewLabel: string;
  /** {frames}, {duration}, {size} を置換する */
  resultInfo: string;
  downloadButton: string;
  /** {current}, {total} を置換する */
  progressFrames: string;
  progressGif: string;
  zipDone: string;
  downloaded: string;
  errorNotGif: string;
  errorTruncated: string;
  errorCorrupt: string;
  errorTooLarge: string;
  /** {max} を置換する */
  errorTooMany: string;
  errorNoFrames: string;
  errorNoSelection: string;
  errorFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const gifSplitterContent: Record<Locale, GifSplitterPageContent> = {
  ja: {
    title: 'GIF分解・フレーム抽出・速度変更',
    description:
      'アニメーションGIFを1コマずつに分解してPNG連番のZIPで保存し、表示時間（速度）を一括変更してGIFを作り直せる無料ツールです。処理はブラウザ内で完結し、ファイルはサーバーに送信されません。',
    h1: 'GIF分解・フレーム抽出・速度変更',
    introHtml:
      'アニメーションGIFを1コマずつの画像に分解し、PNGの連番としてZIPで保存できます。表示時間を倍率や固定ミリ秒でまとめて変え、GIFとして保存し直すことも可能です。ブラウザ内で処理され、ファイルはアップロードされません。画像からGIFを作るときは <a href="/tools/gif-maker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">GIF作成</a>、動画から作るときは <a href="/tools/video-to-gif/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">動画→GIF変換</a> をご利用ください。',
    dropLabel: 'GIFファイルを選択',
    dropHint:
      'ここにGIFファイルをドラッグ＆ドロップするか、ボタンから選択してください。',
    originalLabel: '元のGIF',
    fileInfo: '{width} × {height} px・{frames}コマ・合計{duration}秒・{loop}',
    loopInfinite: '無限ループ',
    loopNone: 'ループなし（1回）',
    loopTimes: '{n}回ループ',
    framesLabel: 'コマ一覧',
    selectedCount: '{selected} / {total} コマを選択中',
    selectAllButton: '全選択',
    selectNoneButton: '全解除',
    includeAria: 'コマ{n}を含める',
    frameCaption: '{n}・{delay}ms',
    zipHeading: 'PNG連番で保存',
    zipButton: '選択したコマをZIPで保存',
    gifHeading: '表示時間を変えてGIFを作り直す',
    modeLabel: '表示時間の変更方法',
    modeSpeed: '倍率で変更',
    modeFixed: '固定のミリ秒にそろえる',
    valueLabelSpeed: '速度の倍率（2で2倍速、0.5で半分の速さ）',
    valueLabelFixed: '1コマの表示時間（ミリ秒）',
    loopLabel: 'ループ再生する',
    gifButton: '選択したコマでGIFを作成',
    previewLabel: 'プレビュー',
    resultInfo: '{frames}コマ・合計{duration}秒・{size}',
    downloadButton: 'GIFをダウンロード',
    progressFrames: 'PNGを作成中… {current} / {total} コマ',
    progressGif: 'GIFを作成中…',
    zipDone: 'ZIPを保存しました',
    downloaded: 'ダウンロードしました',
    errorNotGif:
      'GIFファイルとして読み取れません。拡張子が .gif のアニメーションGIFを選んでください。',
    errorTruncated:
      'ファイルが途中で終わっているようです。ダウンロードや転送に失敗していないか確認してください。',
    errorCorrupt: 'GIFのデータが壊れているため、読み込めませんでした。',
    errorTooLarge:
      'GIFが大きすぎます（ファイル50MBまで、1コマ400万画素まで、全コマ合計4,000万画素まで）。',
    errorTooMany: 'コマ数が多すぎます（{max}コマまで）。',
    errorNoFrames: 'このGIFには画像のコマが含まれていません。',
    errorNoSelection: 'コマを1つ以上選択してください。',
    errorFailed:
      '処理に失敗しました。コマ数を減らすか、もう一度お試しください。',
    howToHeading: '使い方',
    howToSteps: [
      'GIFファイルを枠内にドラッグ＆ドロップするか、ボタンから選びます。コマが一覧に並びます。',
      '「コマ一覧」で、保存や再編集に使うコマを確認します。不要なコマはチェックを外し、「全選択」「全解除」も使えます。',
      'PNG連番で保存するなら、「選択したコマをZIPで保存」を押します。',
      '速度を変えるなら「表示時間の変更方法」と値を決めて「選択したコマでGIFを作成」を押し、プレビューを確認して「GIFをダウンロード」で保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '読み込めるのはファイル50MBまでのGIFで、1コマ400万画素まで・300コマまで・全コマ合計4,000万画素までです。上限を超えるGIFはエラーになります。',
      '各コマは、前のコマとの差分ではなく、完成した1枚の画像（元のGIFの大きさ）として書き出します。透明な部分は、PNGでは透明のまま保存されます。',
      '表示時間が0〜10ミリ秒のコマは、ブラウザと同じく100ミリ秒として扱います。作り直すGIFの表示時間は、20〜10,000ミリ秒の範囲に収め、10ミリ秒単位に丸めます。',
      '作り直したGIFは、各コマを256色以内に減色し直すため、元のGIFと色が少し変わることがあります。透明も保持されます。',
      '途中で切れたGIFや壊れたGIFは読み込まず、エラーを表示します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'フレーム（コマ）',
        description:
          'アニメーションGIFを構成する1枚1枚の画像です。これを順番に切り替えて動いて見せます。',
      },
      {
        term: '処分方法（disposal method）',
        description:
          '次のコマを描く前に、いまのコマをどう扱うかの指定です。そのまま残す、元の背景に戻す、直前の状態に戻す、などがあります。このツールは指定どおりに重ねて、各コマを完成した1枚の画像に直してから保存します。',
      },
      {
        term: 'PNG連番',
        description:
          'frame-001.png、frame-002.png のように番号を付けて並べたPNG画像の組です。動画編集ソフトやスプライトシートの素材として使えます。',
      },
      {
        term: '倍率と固定ミリ秒',
        description:
          '倍率は、元の表示時間の比率でまとめて速くしたり遅くしたりする方法です。固定ミリ秒は、すべてのコマを同じ表示時間にそろえる方法です。',
      },
    ],
  },
  en: {
    title: 'GIF Splitter: Extract Frames & Change GIF Speed',
    description:
      'Split an animated GIF into frames, save them as a PNG sequence in a ZIP, or change the frame delay and re-save the GIF. Runs in your browser; no upload.',
    h1: 'GIF Splitter: Extract Frames & Change GIF Speed',
    introHtml:
      'Break an animated GIF into individual images and save them as a numbered PNG sequence in a ZIP. You can also change the frame delay in bulk, by a speed factor or a fixed number of milliseconds, and save the GIF again. Everything runs in your browser and the file is never uploaded. To build a GIF from images, use the <a href="/en/tools/gif-maker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">GIF Maker</a>; to make one from a video, use <a href="/en/tools/video-to-gif/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Video to GIF</a>.',
    dropLabel: 'Choose a GIF file',
    dropHint: 'Drag and drop a GIF file here, or pick one with the button.',
    originalLabel: 'Original GIF',
    fileInfo: '{width} × {height} px · {frames} frames · {duration} s · {loop}',
    loopInfinite: 'loops forever',
    loopNone: 'no loop (plays once)',
    loopTimes: 'loops {n} times',
    framesLabel: 'Frames',
    selectedCount: '{selected} of {total} frames selected',
    selectAllButton: 'Select all',
    selectNoneButton: 'Select none',
    includeAria: 'Include frame {n}',
    frameCaption: '{n} · {delay} ms',
    zipHeading: 'Save as a PNG sequence',
    zipButton: 'Save selected frames as ZIP',
    gifHeading: 'Change the delay and rebuild the GIF',
    modeLabel: 'How to change the delay',
    modeSpeed: 'By speed factor',
    modeFixed: 'Set a fixed number of ms',
    valueLabelSpeed: 'Speed factor (2 = twice as fast, 0.5 = half speed)',
    valueLabelFixed: 'Delay per frame (ms)',
    loopLabel: 'Loop',
    gifButton: 'Create GIF from selected frames',
    previewLabel: 'Preview',
    resultInfo: '{frames} frames · {duration} s · {size}',
    downloadButton: 'Download GIF',
    progressFrames: 'Creating PNGs… frame {current} of {total}',
    progressGif: 'Creating the GIF…',
    zipDone: 'ZIP saved',
    downloaded: 'Downloaded',
    errorNotGif:
      'This file cannot be read as a GIF. Choose an animated GIF (.gif).',
    errorTruncated:
      'The file seems to end early. Check that the download or transfer did not fail.',
    errorCorrupt: 'The GIF data is damaged and could not be read.',
    errorTooLarge:
      'This GIF is too large (up to 50 MB, 4 million pixels per frame, and 40 million pixels across all frames).',
    errorTooMany: 'Too many frames (up to {max}).',
    errorNoFrames: 'This GIF contains no image frames.',
    errorNoSelection: 'Select at least one frame.',
    errorFailed: 'Processing failed. Try again, or use fewer frames.',
    howToHeading: 'How to use',
    howToSteps: [
      'Drag and drop a GIF file into the box, or pick one with the button. The frames appear in a list.',
      'In "Frames", check which frames you want to keep. Uncheck the ones you do not need, or use "Select all" and "Select none".',
      'To save a PNG sequence, click "Save selected frames as ZIP".',
      'To change the speed, choose "How to change the delay" and a value, click "Create GIF from selected frames", check the preview, then click "Download GIF".',
    ],
    notesHeading: 'Notes',
    notes: [
      'Files up to 50 MB can be opened, with at most 4 million pixels per frame, 300 frames, and 40 million pixels across all frames. GIFs over a limit show an error.',
      'Each frame is saved as a finished full-size image (the GIF canvas size), not as a diff from the previous frame. Transparent areas stay transparent in the PNGs.',
      'Frames with a delay of 0 to 10 ms are treated as 100 ms, as browsers do. Delays in the rebuilt GIF are kept between 20 and 10,000 ms and rounded to 10 ms steps.',
      'The rebuilt GIF reduces every frame to 256 colors or fewer, so colors can shift slightly from the original. Transparency is kept.',
      'Truncated or damaged GIFs are rejected with an error rather than opened partially.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Frame',
        description:
          'One of the images that make up an animated GIF. They are shown one after another to create the motion.',
      },
      {
        term: 'Disposal method',
        description:
          'An instruction for what to do with the current frame before the next one is drawn: leave it, restore the background, or restore the previous state. This tool applies them as specified and turns each frame into a finished image before saving.',
      },
      {
        term: 'PNG sequence',
        description:
          'A set of PNG images with numbered names such as frame-001.png and frame-002.png. It is handy as source material for video editors and sprite sheets.',
      },
      {
        term: 'Speed factor vs. fixed milliseconds',
        description:
          'A speed factor speeds up or slows down the animation in proportion to the original delays. A fixed delay gives every frame the same display time.',
      },
    ],
  },
};
