import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface VideoMergerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  limitsTemplate: string;
  listHeading: string;
  listEmpty: string;
  /** `{resolution}` `{duration}` `{size}` `{audio}` を置換して使うテンプレート */
  itemInfoTemplate: string;
  itemHasAudio: string;
  itemNoAudio: string;
  /** `{name}` を置換して使うテンプレート */
  moveUpAria: string;
  moveDownAria: string;
  removeAria: string;
  moveUpButton: string;
  moveDownButton: string;
  removeButton: string;
  /** `{count}` `{duration}` `{size}` `{resolution}` を置換して使うテンプレート */
  summaryTemplate: string;
  formatLabel: string;
  formatMp4: string;
  formatWebm: string;
  qualityLabel: string;
  qualityHigh: string;
  qualityMedium: string;
  qualityLow: string;
  qualityVeryLow: string;
  heightLabel: string;
  heightOriginal: string;
  /** `{height}` を置換して使うテンプレート */
  heightTemplate: string;
  removeAudioLabel: string;
  audioNote: string;
  mergeButton: string;
  cancelButton: string;
  clearButton: string;
  loading: string;
  /** `{percent}` を置換して使うテンプレート */
  progressTemplate: string;
  progressLabel: string;
  resultsHeading: string;
  /** `{size}` `{duration}` を置換して使うテンプレート */
  resultInfoTemplate: string;
  downloadButton: string;
  errorCanceled: string;
  errorUnsupportedFile: string;
  /** `{name}` を置換して使うテンプレート */
  errorUnreadableTemplate: string;
  /** `{name}` を置換して使うテンプレート */
  errorNoVideoTemplate: string;
  errorUnsupportedInput: string;
  errorUnsupportedOutput: string;
  errorFailed: string;
  /** `{max}` を置換して使うテンプレート */
  errorFileTooLargeTemplate: string;
  /** `{max}` を置換して使うテンプレート */
  errorTooManyTemplate: string;
  /** `{max}` を置換して使うテンプレート */
  errorTotalTooLargeTemplate: string;
  /** `{max}` を置換して使うテンプレート */
  errorTotalTooLongTemplate: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const videoMergerContent: Record<Locale, VideoMergerPageContent> = {
  ja: {
    title: '動画結合｜複数の動画をつなげて1本に（MP4・WebM）',
    description:
      '複数の動画を順番につなげて1本のMP4・WebMにできる無料ツールです。並べ替えに対応し、解像度とfpsは先頭の動画に自動で揃えます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '動画結合（複数の動画をつなげて1本にする）',
    introHtml:
      '複数の動画ファイルを選び、好きな順番に並べて1本の動画につなげます。解像度とフレームレートは先頭の動画に揃えられ、サイズの違う動画は縦横比を保ったまま黒い余白つきで収められます。音声がない動画が混ざっても、その部分は無音で補うので映像と音声はずれません。処理にはブラウザの動画エンコード機能（WebCodecs）を使うため、ファイルは外部に送信されません。1本の動画の倍速・スローは<a href="/tools/video-speed-changer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">動画の再生速度変更</a>、形式変換やトリミングは<a href="/tools/media-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">動画・音声変換</a>、音声だけの結合は<a href="/tools/audio-merger/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">音声ファイル結合・フェード</a>をご利用ください。',
    dropLabel: '動画ファイルを追加（複数選択可）',
    dropHint: 'ここにファイルをドラッグ＆ドロップして追加することもできます',
    limitsTemplate:
      '上限: {count}本まで・1本 {file}まで・合計 {total}まで・合計の長さ {duration}まで',
    listHeading: '結合する動画（上から順につながります）',
    listEmpty: 'まだ動画が追加されていません。',
    itemInfoTemplate: '{resolution}・長さ {duration}・{size}・{audio}',
    itemHasAudio: '音声あり',
    itemNoAudio: '音声なし（無音で補います）',
    moveUpAria: '{name} を上へ移動',
    moveDownAria: '{name} を下へ移動',
    removeAria: '{name} を削除',
    moveUpButton: '上へ',
    moveDownButton: '下へ',
    removeButton: '削除',
    summaryTemplate:
      '{count}本・合計の長さ {duration}・合計 {size}（出力サイズ: {resolution}）',
    formatLabel: '出力形式',
    formatMp4: 'MP4（H.264/AAC）',
    formatWebm: 'WebM（VP9/Opus）',
    qualityLabel: '品質',
    qualityHigh: '高（容量大）',
    qualityMedium: '標準',
    qualityLow: '低（容量小）',
    qualityVeryLow: '最低（容量最小）',
    heightLabel: '解像度（高さの上限）',
    heightOriginal: '先頭の動画のサイズのまま',
    heightTemplate: '{height}p 以下に縮小',
    removeAudioLabel: '音声を削除する（映像のみにする）',
    audioNote:
      '音声は48kHzのステレオに揃えます。音声のない動画の区間は無音になります。すべての動画に音声がない場合は、映像だけの動画になります。',
    mergeButton: '結合する',
    cancelButton: 'キャンセル',
    clearButton: 'クリア',
    loading: '動画を読み込み中…',
    progressTemplate: '結合中… {percent}%',
    progressLabel: '結合の進捗',
    resultsHeading: '結合結果',
    resultInfoTemplate: '出力: {size}・長さ {duration}',
    downloadButton: 'ダウンロード',
    errorCanceled: '結合をキャンセルしました。',
    errorUnsupportedFile: '動画ファイルを選択してください',
    errorUnreadableTemplate:
      '「{name}」を読み込めませんでした。破損しているか、対応していない形式の可能性があります。',
    errorNoVideoTemplate:
      '「{name}」には映像がありません。動画ファイルを選んでください。',
    errorUnsupportedInput:
      'いずれかの動画の音声・映像の形式（コーデック）は、お使いのブラウザでは読み込めません。別のブラウザ（最新のChromeやEdgeなど）でお試しください。',
    errorUnsupportedOutput:
      'お使いのブラウザは、選んだ出力形式のエンコードに対応していません。別の出力形式を選ぶか、最新のChromeやEdgeでお試しください。',
    errorFailed:
      '結合に失敗しました。ファイルが破損しているか、お使いのブラウザが対応していない可能性があります。',
    errorFileTooLargeTemplate:
      '1本あたりのファイルサイズの上限（{max}）を超えています',
    errorTooManyTemplate: '結合できる動画は{max}本までです',
    errorTotalTooLargeTemplate: '合計のファイルサイズが上限（{max}）を超えます',
    errorTotalTooLongTemplate: '合計の長さが上限（{max}）を超えます',
    notesHeading: '注意点',
    notes: [
      '先頭の動画の解像度（幅×高さ）とフレームレートが出力の基準になります。他の動画はこのサイズに収めるため、縦横比が違うと黒い余白が付き、フレームレートが違うとコマを間引いたり繰り返したりします。出力に使いたい動画を先頭に置いてください。',
      '音声のない動画が混ざっている場合は、その区間を無音で補います。一方、すべての動画に音声がなければ出力にも音声は付きません。音声の形式が違う動画は、48kHzのステレオに揃えて結合します。',
      'すべての動画を再エンコードして結合するため、画質・音質は元より劣化します。「高」を選ぶと劣化を抑えられますが、容量は大きくなります。',
      '負荷を抑えるため、結合できるのは10本まで、1本あたり300MBまで、合計600MBまで、合計の長さ10分までです。出力はいったんメモリ上に作られるため、長い動画や高解像度の動画では時間がかかったり、メモリ不足で失敗したりします。',
      '結合中はこのタブを閉じたり、別のタブに切り替えたままにしたりしないでください。ブラウザによっては、バックグラウンドで処理が遅くなったり止まったりします。',
      '選べる出力形式や読み込める入力形式はブラウザによって異なります。MP4（H.264）の出力はChrome・Edge・Safariで、WebMの出力はChrome・Edgeで動作しやすく、Firefoxではエンコード機能が限られることがあります。',
      '字幕・チャプター・複数の音声トラックなどは引き継がれません。トランジション（クロスフェード）やテロップ追加には対応していません。',
      'すべての処理はブラウザ内で完結し、選択したファイルがサーバーに送信されることはありません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '「動画ファイルを追加（複数選択可）」から動画を選びます（ドラッグ＆ドロップも可能です）。',
      '一覧の「上へ」「下へ」ボタンで順番を入れ替えます。先頭の動画のサイズとfpsが出力の基準になります。',
      '「出力形式」「品質」を選びます。音声が不要なら「音声を削除する（映像のみにする）」にチェックします。',
      '「結合する」を押し、完了したら「ダウンロード」で保存します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'fps（フレームレート）',
        description:
          '1秒あたりに表示するコマ数。本ツールは先頭の動画のfpsに全体を揃え、fpsの違う動画はコマを間引いたり繰り返したりして合わせます。',
      },
      {
        term: 'レターボックス（黒い余白）',
        description:
          '縦横比の違う映像を、切り取らずに収めるために上下または左右に付ける黒い帯。本ツールでは先頭の動画と縦横比が違う動画に付きます。',
      },
      {
        term: '再エンコード',
        description:
          '動画を一度展開してから、もう一度圧縮し直すこと。形式や解像度の違う動画をつなぐために必要ですが、そのぶん画質は少し劣化します。',
      },
      {
        term: 'WebCodecs',
        description:
          'ブラウザが備える、映像・音声の圧縮・展開を行うための標準API。本ツールはこれを使い、ブラウザ内で結合を行います。',
      },
    ],
  },
  en: {
    title: 'Video Merger: Join Multiple Videos Online (MP4/WebM)',
    description:
      'Join several videos into one MP4 or WebM, reorder the clips, and match the first video’s size and frame rate. Free, runs in your browser, nothing is uploaded.',
    h1: 'Video Merger (Join Multiple Videos into One)',
    introHtml:
      'Pick several video files, put them in the order you like, and join them into a single video. The resolution and frame rate follow the first clip, and clips of a different size are fitted in with black bars so nothing is cropped. If some clips have no sound, those parts are filled with silence so the audio stays in sync. It uses your browser’s built-in video encoder (WebCodecs), so your files are never uploaded. To speed up or slow down a single clip, use the <a href="/en/tools/video-speed-changer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Video Speed Changer</a>; to convert formats or trim, use the <a href="/en/tools/media-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Video & Audio Converter</a>; to join audio files only, use the <a href="/en/tools/audio-merger/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Audio Merger</a>.',
    dropLabel: 'Add video files (multiple allowed)',
    dropHint: 'You can also drag and drop files here to add them',
    limitsTemplate:
      'Limits: up to {count} clips, {file} per clip, {total} in total, {duration} total length',
    listHeading: 'Videos to merge (joined from top to bottom)',
    listEmpty: 'No videos added yet.',
    itemInfoTemplate: '{resolution}, {duration}, {size}, {audio}',
    itemHasAudio: 'with audio',
    itemNoAudio: 'no audio (filled with silence)',
    moveUpAria: 'Move {name} up',
    moveDownAria: 'Move {name} down',
    removeAria: 'Remove {name}',
    moveUpButton: 'Up',
    moveDownButton: 'Down',
    removeButton: 'Remove',
    summaryTemplate:
      '{count} clips, total length {duration}, {size} in total (output size: {resolution})',
    formatLabel: 'Output format',
    formatMp4: 'MP4 (H.264/AAC)',
    formatWebm: 'WebM (VP9/Opus)',
    qualityLabel: 'Quality',
    qualityHigh: 'High (larger file)',
    qualityMedium: 'Medium',
    qualityLow: 'Low (smaller file)',
    qualityVeryLow: 'Lowest (smallest file)',
    heightLabel: 'Resolution (max height)',
    heightOriginal: 'Same size as the first video',
    heightTemplate: 'Shrink to {height}p or less',
    removeAudioLabel: 'Remove audio (video only)',
    audioNote:
      'Audio is converted to 48 kHz stereo. Clips without audio become silent sections. If none of the clips has audio, the result is video only.',
    mergeButton: 'Merge',
    cancelButton: 'Cancel',
    clearButton: 'Clear',
    loading: 'Loading videos…',
    progressTemplate: 'Merging… {percent}%',
    progressLabel: 'Merge progress',
    resultsHeading: 'Result',
    resultInfoTemplate: 'Output: {size}, duration {duration}',
    downloadButton: 'Download',
    errorCanceled: 'Merge canceled.',
    errorUnsupportedFile: 'Please choose a video file',
    errorUnreadableTemplate:
      '"{name}" could not be read. It may be corrupted or in an unsupported format.',
    errorNoVideoTemplate:
      '"{name}" has no video track. Please choose a video file.',
    errorUnsupportedInput:
      'Your browser cannot decode the audio or video format (codec) of one of the files. Try a different browser, such as the latest Chrome or Edge.',
    errorUnsupportedOutput:
      'Your browser cannot encode the selected output format. Choose another format, or try the latest Chrome or Edge.',
    errorFailed:
      'Merging failed. A file may be corrupted or your browser may not support it.',
    errorFileTooLargeTemplate:
      'The file exceeds the per-clip size limit ({max})',
    errorTooManyTemplate: 'You can merge up to {max} clips',
    errorTotalTooLargeTemplate:
      'The total file size would exceed the limit ({max})',
    errorTotalTooLongTemplate:
      'The total length would exceed the limit ({max})',
    notesHeading: 'Notes',
    notes: [
      'The resolution (width × height) and frame rate of the first video set the output. Other clips are fitted to that size, so a different aspect ratio gets black bars, and a different frame rate means frames are dropped or repeated. Put the clip you want to base the output on first.',
      'Clips without audio are filled with silence for their length. If none of the clips has audio, the result has no audio either. Clips with different audio formats are converted to 48 kHz stereo before joining.',
      'Every clip is re-encoded, so some quality is lost. "High" keeps the loss small but makes a larger file.',
      'To keep things manageable, you can merge up to 10 clips, 300 MB per clip, 600 MB in total, and 10 minutes in total length. The output is built in memory, so long or high-resolution videos can take a while or fail when memory runs out.',
      'Keep this tab open and in the foreground while merging. Some browsers slow down or pause background tabs.',
      'Available input and output formats vary by browser. MP4 (H.264) output works best in Chrome, Edge and Safari, WebM output in Chrome and Edge, and Firefox may have limited encoding support.',
      'Subtitles, chapters and extra audio tracks are not carried over. Transitions such as cross-fades and text overlays are not supported.',
      'All processing happens in your browser; the files you choose are never sent to a server.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose videos with "Add video files (multiple allowed)" (drag and drop also works).',
      'Use the "Up" and "Down" buttons in the list to set the order. The first video sets the output size and frame rate.',
      'Pick the "Output format" and "Quality". If you do not need sound, check "Remove audio (video only)".',
      'Press "Merge", then save the result with "Download" when it finishes.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'fps (frame rate)',
        description:
          'The number of frames shown per second. This tool matches everything to the first video’s fps, dropping or repeating frames in clips with a different rate.',
      },
      {
        term: 'Letterbox (black bars)',
        description:
          'Black bars added above and below, or at the sides, so a video with a different aspect ratio fits without being cropped. Clips whose aspect ratio differs from the first video get them here.',
      },
      {
        term: 'Re-encoding',
        description:
          'Decoding a video and compressing it again. It is needed to join clips of different formats or sizes, at the cost of a small quality loss.',
      },
      {
        term: 'WebCodecs',
        description:
          'A standard browser API for compressing and decompressing video and audio. This tool uses it to merge files inside your browser.',
      },
    ],
  },
};
