import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface VideoToGifPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{resolution}` `{duration}` `{size}` を置換して使うテンプレート */
  sourceInfoTemplate: string;
  gifHeading: string;
  startLabel: string;
  endLabel: string;
  startPlaceholder: string;
  endPlaceholder: string;
  rangeHint: string;
  fpsLabel: string;
  /** `{fps}` を置換して使うテンプレート */
  fpsTemplate: string;
  widthLabel: string;
  widthHint: string;
  loopLabel: string;
  generateButton: string;
  cancelButton: string;
  clearButton: string;
  /** `{percent}` を置換して使うテンプレート */
  progressTemplate: string;
  progressLabel: string;
  previewAlt: string;
  /** `{width}` `{height}` `{frames}` `{size}` を置換して使うテンプレート */
  gifResultTemplate: string;
  downloadGifButton: string;
  frameHeading: string;
  frameTimeLabel: string;
  frameTimePlaceholder: string;
  frameTimeHint: string;
  extractButton: string;
  frameAlt: string;
  /** `{time}` `{width}` `{height}` `{size}` を置換して使うテンプレート */
  frameResultTemplate: string;
  downloadFrameButton: string;
  errorCanceled: string;
  errorUnsupportedFile: string;
  errorUnreadable: string;
  errorNoVideo: string;
  errorUnsupportedInput: string;
  errorFailed: string;
  /** `{max}` を置換して使うテンプレート */
  errorFileTooLargeTemplate: string;
  errorRangeInvalid: string;
  errorRangeOutOfRange: string;
  errorRangeOrder: string;
  /** `{max}` を置換して使うテンプレート */
  errorTooManyFramesTemplate: string;
  errorTooLarge: string;
  errorFrameTimeInvalid: string;
  errorFrameTimeOutOfRange: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const videoToGifContent: Record<Locale, VideoToGifPageContent> = {
  ja: {
    title:
      '動画をGIFに変換｜範囲・FPS・幅を指定／フレームをPNG保存（ブラウザ完結）',
    description:
      '動画の好きな範囲をアニメーションGIFに変換し、任意の時刻のフレームをPNGで保存できる無料ツールです。FPS・幅・くり返しを指定でき、データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '動画をGIFに変換・フレームをPNGで保存',
    introHtml:
      '動画ファイルから、開始・終了の時刻・FPS・幅を指定してアニメーションGIFを作れます。また、任意の時刻のフレーム（静止画）をPNGで保存することもできます。処理はブラウザ内で完結し、動画は外部に送信されません。動画そのものの形式変換や圧縮は<a href="/tools/media-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">動画・音声変換／トリミング／圧縮</a>、画像からGIFを作りたいときは<a href="/tools/gif-maker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">GIF作成</a>をご利用ください。',
    dropLabel: '動画ファイルを選択',
    dropHint: 'ここにファイルをドラッグ＆ドロップすることもできます',
    sourceInfoTemplate: '元ファイル: {resolution}・長さ {duration}（{size}）',
    gifHeading: 'GIFに変換',
    startLabel: '開始',
    endLabel: '終了',
    startPlaceholder: '例: 0:05',
    endPlaceholder: '例: 0:12',
    rangeHint:
      '「90」「1:30」「1:02:03.5」の形式で入力します。開始が空欄なら先頭から、終了が空欄なら開始から10秒間（動画の長さまで）をGIFにします。',
    fpsLabel: 'FPS（1秒あたりのコマ数）',
    fpsTemplate: '{fps} fps',
    widthLabel: '幅（px）',
    widthHint: '元の動画より大きくはなりません。縦横比は保たれます。',
    loopLabel: '無限にくり返す',
    generateButton: 'GIFを作成する',
    cancelButton: 'キャンセル',
    clearButton: 'クリア',
    progressTemplate: '変換中… {percent}%',
    progressLabel: '変換の進捗',
    previewAlt: '作成したGIFのプレビュー',
    gifResultTemplate: 'GIF: {width}×{height}px・{frames}コマ・{size}',
    downloadGifButton: 'GIFをダウンロード',
    frameHeading: 'フレーム（静止画）をPNGで保存',
    frameTimeLabel: '時刻',
    frameTimePlaceholder: '例: 0:12.5',
    frameTimeHint:
      '「90」「1:30」「1:02:03.5」の形式で入力します。元の解像度のまま保存されます。',
    extractButton: 'フレームを取り出す',
    frameAlt: '取り出したフレームのプレビュー',
    frameResultTemplate: '{time}のフレーム: {width}×{height}px・{size}',
    downloadFrameButton: 'PNGをダウンロード',
    errorCanceled: '変換をキャンセルしました。',
    errorUnsupportedFile: '動画ファイルを選択してください',
    errorUnreadable:
      'ファイルを読み込めませんでした。破損しているか、対応していない形式の可能性があります。',
    errorNoVideo: 'このファイルには映像がないため、GIFにはできません。',
    errorUnsupportedInput:
      'この動画の形式（コーデック）は、お使いのブラウザでは読み込めません。別のブラウザ（最新のChromeやEdgeなど）でお試しください。',
    errorFailed:
      '処理に失敗しました。ファイルが破損しているか、お使いのブラウザが対応していない可能性があります。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    errorRangeInvalid:
      '時刻の形式が正しくありません（例: 90、1:30、1:02:03.5）',
    errorRangeOutOfRange: '開始・終了の時刻が、動画の長さの範囲外です',
    errorRangeOrder: '終了は、開始より後の時刻にしてください',
    errorTooManyFramesTemplate:
      'コマ数が多すぎます（上限 {max} コマ）。範囲を短くするか、FPSを下げてください。',
    errorTooLarge:
      'GIFのデータ量が大きくなりすぎます。幅を小さくするか、範囲を短くするか、FPSを下げてください。',
    errorFrameTimeInvalid:
      '時刻の形式が正しくありません（例: 90、1:30、1:02:03.5）',
    errorFrameTimeOutOfRange: '時刻が、動画の長さの範囲外です',
    notesHeading: '注意点',
    notes: [
      'GIFは1コマごとに最大256色しか使えないため、グラデーションの多い映像では色が荒れたり、ファイルサイズが大きくなったりします。長さ・FPS・幅を抑えると小さくできます。',
      'コマ数は最大300コマ、動画ファイルは1GBまでです。長い動画は、使いたい範囲だけを指定してください。',
      '音声はGIFに含まれません。',
      '処理には映像のデコード機能（WebCodecs）を使うため、読み込める形式はブラウザによって異なります。最新のChromeやEdgeでの利用をおすすめします。',
      '変換中はこのタブを閉じたり、別のタブに切り替えたままにしたりしないでください。ブラウザによっては、バックグラウンドで処理が遅くなったり止まったりします。',
      'フレームのPNGは元の動画と同じ解像度で保存されます。指定した時刻に最も近い（その時刻以前の）コマが取り出されます。',
      'すべての処理はブラウザ内で完結し、選択した動画がサーバーに送信されることはありません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '動画ファイルを選択します（ドラッグ＆ドロップも可能です）。',
      'GIFにする範囲を「開始」「終了」に入力し、「FPS」「幅」を選びます。',
      '「GIFを作成する」を押し、プレビューを確認して「GIFをダウンロード」で保存します。',
      '静止画が欲しいときは、「フレーム」の「時刻」を入力して「フレームを取り出す」を押し、PNGを保存します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'FPS（フレームレート）',
        description:
          '1秒あたりに表示するコマ数。数字が大きいほど滑らかに動きますが、コマ数が増えるためGIFのサイズも大きくなります。GIFでは10〜15fps程度がよく使われます。',
      },
      {
        term: 'アニメーションGIF',
        description:
          '複数の静止画をつなげて動画のように見せる画像形式。音声は持てず、1コマあたり最大256色までという制限があります。',
      },
      {
        term: 'フレーム',
        description:
          '動画を構成する1枚1枚の静止画のこと。動画は多数のフレームを連続して表示しています。',
      },
      {
        term: 'WebCodecs',
        description:
          'ブラウザが備える、映像・音声の圧縮・展開を行うための標準API。本ツールはこれを使い、ブラウザ内で動画を読み込みます。',
      },
    ],
  },
  en: {
    title: 'Video to GIF Converter & Frame Extractor (PNG) – In-Browser',
    description:
      'Free tool to turn any part of a video into an animated GIF and save any frame as a PNG. Set FPS, width and looping. Runs in your browser, no upload.',
    h1: 'Video to GIF Converter and Frame Extractor',
    introHtml:
      'Pick a video, set the start and end times, FPS and width, and get an animated GIF. You can also save the frame at any time as a PNG still. Everything runs in your browser, so the video is never uploaded. To convert or compress the video itself, use the <a href="/en/tools/media-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Video &amp; Audio Converter</a>; to build a GIF from still images, use the <a href="/en/tools/gif-maker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">GIF Maker</a>.',
    dropLabel: 'Choose a video file',
    dropHint: 'You can also drag and drop a file here',
    sourceInfoTemplate: 'Original: {resolution}, duration {duration} ({size})',
    gifHeading: 'Convert to GIF',
    startLabel: 'Start',
    endLabel: 'End',
    startPlaceholder: 'e.g. 0:05',
    endPlaceholder: 'e.g. 0:12',
    rangeHint:
      'Enter times like "90", "1:30" or "1:02:03.5". An empty start means the beginning; an empty end means 10 seconds after the start (or the end of the video).',
    fpsLabel: 'FPS (frames per second)',
    fpsTemplate: '{fps} fps',
    widthLabel: 'Width (px)',
    widthHint: 'Never larger than the video. The aspect ratio is kept.',
    loopLabel: 'Loop forever',
    generateButton: 'Create GIF',
    cancelButton: 'Cancel',
    clearButton: 'Clear',
    progressTemplate: 'Converting… {percent}%',
    progressLabel: 'Conversion progress',
    previewAlt: 'Preview of the created GIF',
    gifResultTemplate: 'GIF: {width}×{height}px, {frames} frames, {size}',
    downloadGifButton: 'Download GIF',
    frameHeading: 'Save a frame as PNG',
    frameTimeLabel: 'Time',
    frameTimePlaceholder: 'e.g. 0:12.5',
    frameTimeHint:
      'Enter a time like "90", "1:30" or "1:02:03.5". The frame is saved at the original resolution.',
    extractButton: 'Extract frame',
    frameAlt: 'Preview of the extracted frame',
    frameResultTemplate: 'Frame at {time}: {width}×{height}px, {size}',
    downloadFrameButton: 'Download PNG',
    errorCanceled: 'Conversion canceled.',
    errorUnsupportedFile: 'Please choose a video file',
    errorUnreadable:
      'The file could not be read. It may be corrupted or in an unsupported format.',
    errorNoVideo: 'This file has no video track, so it cannot become a GIF.',
    errorUnsupportedInput:
      'Your browser cannot decode the format (codec) of this video. Try a different browser, such as the latest Chrome or Edge.',
    errorFailed:
      'Processing failed. The file may be corrupted or your browser may not support it.',
    errorFileTooLargeTemplate: 'The file exceeds the size limit ({max})',
    errorRangeInvalid:
      'The time format is invalid (examples: 90, 1:30, 1:02:03.5)',
    errorRangeOutOfRange:
      'The start or end time is outside the length of the video',
    errorRangeOrder: 'The end must be later than the start',
    errorTooManyFramesTemplate:
      'Too many frames (the limit is {max}). Shorten the range or lower the FPS.',
    errorTooLarge:
      'The GIF would be too large. Reduce the width, shorten the range, or lower the FPS.',
    errorFrameTimeInvalid:
      'The time format is invalid (examples: 90, 1:30, 1:02:03.5)',
    errorFrameTimeOutOfRange: 'The time is outside the length of the video',
    notesHeading: 'Notes',
    notes: [
      'A GIF frame can use at most 256 colors, so footage with gradients can look banded and the file can get large. Keeping the duration, FPS and width low makes it smaller.',
      'The limit is 300 frames, and video files up to 1 GB. For long videos, set only the range you need.',
      'GIFs have no sound; audio is not included.',
      'Decoding uses your browser’s WebCodecs support, so readable formats vary by browser. The latest Chrome or Edge is recommended.',
      'Keep this tab open and in the foreground while converting. Some browsers slow down or pause background tabs.',
      'The PNG is saved at the video’s original resolution. The frame shown at (or just before) the time you enter is used.',
      'All processing happens in your browser; the video you choose is never sent to a server.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a video file (drag and drop also works).',
      'Enter the "Start" and "End" times of the part you want, then pick "FPS" and "Width".',
      'Press "Create GIF", check the preview, and save it with "Download GIF".',
      'For a still image, enter a "Time" under "Save a frame as PNG", press "Extract frame", and download the PNG.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'FPS (frame rate)',
        description:
          'The number of frames shown per second. A higher value looks smoother but adds frames, so the GIF gets larger. 10–15 fps is common for GIFs.',
      },
      {
        term: 'Animated GIF',
        description:
          'An image format that chains still images so they play like a short video. It has no sound and is limited to 256 colors per frame.',
      },
      {
        term: 'Frame',
        description:
          'One still image of a video. A video is a sequence of many frames shown in quick succession.',
      },
      {
        term: 'WebCodecs',
        description:
          'A standard browser API for compressing and decompressing video and audio. This tool uses it to read videos inside your browser.',
      },
    ],
  },
};
