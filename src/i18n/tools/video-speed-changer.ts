import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface VideoSpeedChangerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{resolution}` `{duration}` `{size}` を置換して使うテンプレート */
  sourceInfoTemplate: string;
  speedLabel: string;
  speedPresetsLabel: string;
  speedHint: string;
  /** `{speed}` `{duration}` を置換して使うテンプレート */
  speedResultTemplate: string;
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
  pitchNote: string;
  convertButton: string;
  cancelButton: string;
  clearButton: string;
  /** `{percent}` を置換して使うテンプレート */
  progressTemplate: string;
  progressLabel: string;
  resultsHeading: string;
  /** `{size}` `{duration}` を置換して使うテンプレート */
  resultSizeTemplate: string;
  downloadButton: string;
  errorCanceled: string;
  errorUnsupportedFile: string;
  errorUnreadable: string;
  errorNoVideo: string;
  errorUnsupportedInput: string;
  errorUnsupportedOutput: string;
  errorFailed: string;
  /** `{max}` を置換して使うテンプレート */
  errorFileTooLargeTemplate: string;
  /** `{min}` `{max}` を置換して使うテンプレート */
  errorSpeedTemplate: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const videoSpeedChangerContent: Record<
  Locale,
  VideoSpeedChangerPageContent
> = {
  ja: {
    title: '動画の再生速度変更（倍速・スロー）｜0.25〜4倍をブラウザで',
    description:
      '動画の再生速度を0.25倍〜4倍に変更して、倍速・スロー動画を作れる無料ツールです。MP4・WebMで保存でき、データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '動画の再生速度変更（倍速・スロー）',
    introHtml:
      '動画を選んで速度を指定するだけで、倍速動画やスローモーション動画を作れます。0.25倍から4倍まで指定でき、映像と音声の長さが速度に合わせて変わります。処理にはブラウザの動画エンコード機能（WebCodecs）を使うため、ファイルは外部に送信されません。形式の変換やトリミングは<a href="/tools/media-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">動画・音声変換</a>、音声だけの速度変更は<a href="/tools/audio-speed-changer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">音声の速度・ピッチ変更</a>をご利用ください。',
    dropLabel: '動画ファイルを選択',
    dropHint: 'ここにファイルをドラッグ＆ドロップすることもできます',
    sourceInfoTemplate: '元ファイル: {resolution}・長さ {duration}（{size}）',
    speedLabel: '再生速度',
    speedPresetsLabel: '速度のプリセット',
    speedHint:
      '0.25〜4 の倍率を入力します（例: 2 で2倍速、0.5 で半分の速さ）。',
    speedResultTemplate: '出力の長さ: {duration}（{speed}倍速）',
    formatLabel: '出力形式',
    formatMp4: 'MP4（H.264/AAC）',
    formatWebm: 'WebM（VP9/Opus）',
    qualityLabel: '品質',
    qualityHigh: '高（容量大）',
    qualityMedium: '標準',
    qualityLow: '低（容量小）',
    qualityVeryLow: '最低（容量最小）',
    heightLabel: '解像度（高さの上限）',
    heightOriginal: '元のサイズ',
    heightTemplate: '{height}p 以下に縮小',
    removeAudioLabel: '音声を削除する（映像のみにする）',
    pitchNote:
      '音声は速度に合わせて再生されるため、倍速では音が高く、スローでは低くなります（ピッチは保持されません）。',
    convertButton: '変換する',
    cancelButton: 'キャンセル',
    clearButton: 'クリア',
    progressTemplate: '変換中… {percent}%',
    progressLabel: '変換の進捗',
    resultsHeading: '変換結果',
    resultSizeTemplate: '出力: {size}・長さ {duration}',
    downloadButton: 'ダウンロード',
    errorCanceled: '変換をキャンセルしました。',
    errorUnsupportedFile: '動画ファイルを選択してください',
    errorUnreadable:
      'ファイルを読み込めませんでした。破損しているか、対応していない形式の可能性があります。',
    errorNoVideo:
      'このファイルには映像がありません。動画ファイルを選んでください。',
    errorUnsupportedInput:
      'このファイルの音声・映像の形式（コーデック）は、お使いのブラウザでは読み込めません。別のブラウザ（最新のChromeやEdgeなど）でお試しください。',
    errorUnsupportedOutput:
      'お使いのブラウザは、選んだ出力形式のエンコードに対応していません。別の出力形式を選ぶか、最新のChromeやEdgeでお試しください。',
    errorFailed:
      '変換に失敗しました。ファイルが破損しているか、お使いのブラウザが対応していない可能性があります。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    errorSpeedTemplate:
      '再生速度は {min}〜{max} の数値で入力してください（例: 2、0.5）',
    notesHeading: '注意点',
    notes: [
      '音声のピッチは保持されません。再生速度に連動して、倍速では高く、スローでは低くなります（声が高く／低く聞こえます）。ピッチを保ったまま変えたい場合は、音声だけを取り出して音声の速度・ピッチ変更ツールで処理してください。',
      '速度変更のために動画を再エンコードするため、画質・音質は元より劣化します。「高」を選ぶと劣化を抑えられますが、容量は大きくなります。',
      '倍速時は出力が60fpsを超えないようにコマを間引きます。スロー時はコマを補間しないため、動きがカクついて見えることがあります。',
      '変換はお使いのパソコン・スマートフォンの性能に依存します。長い動画や高解像度の動画は、時間がかかったりメモリ不足で失敗したりすることがあります。',
      '変換中はこのタブを閉じたり、別のタブに切り替えたままにしたりしないでください。ブラウザによっては、バックグラウンドで処理が遅くなったり止まったりします。',
      '選べる出力形式や読み込める入力形式はブラウザによって異なります。MP4（H.264）の出力はChrome・Edge・Safariで、WebMの出力はChrome・Edgeで動作しやすく、Firefoxではエンコード機能が限られることがあります。',
      'ファイルサイズの上限は1GBです。出力はいったんメモリ上に作られるため、大きなファイルはメモリを多く消費します。字幕・複数の音声トラックなどは引き継がれません。',
      'すべての処理はブラウザ内で完結し、選択したファイルがサーバーに送信されることはありません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '動画ファイルを選択します（ドラッグ＆ドロップも可能です）。',
      '「再生速度」に倍率を入力するか、プリセットのボタンで選びます。',
      '「出力形式」「品質」を選びます。音声が不要なら「音声を削除する（映像のみにする）」にチェックします。',
      '「変換する」を押し、完了したら「ダウンロード」で保存します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ピッチ',
        description:
          '音の高さのこと。音声を速く再生するとピッチも上がり、遅く再生すると下がります。このツールはピッチを補正しません。',
      },
      {
        term: 'fps（フレームレート）',
        description:
          '1秒あたりに表示するコマ数。倍速にするとコマの間隔が詰まるため、そのままではfpsが上がります。本ツールは60fpsを上限にコマを間引きます。',
      },
      {
        term: 'WebCodecs',
        description:
          'ブラウザが備える、映像・音声の圧縮・展開を行うための標準API。本ツールはこれを使い、ブラウザ内で変換を行います。',
      },
    ],
  },
  en: {
    title: 'Video Speed Changer: Fast Forward & Slow Motion Online',
    description:
      'Speed up or slow down a video from 0.25x to 4x and save it as MP4 or WebM. Free, runs in your browser, and your video is never uploaded.',
    h1: 'Video Speed Changer (Fast Forward & Slow Motion)',
    introHtml:
      'Choose a video and set a speed to make a fast-forward or slow-motion clip. Pick anything from 0.25x to 4x, and the video and audio are re-timed to match. It uses your browser’s built-in video encoder (WebCodecs), so the file is never uploaded. To change the format or trim a clip, use the <a href="/en/tools/media-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Video & Audio Converter</a>; to change the speed of audio alone, use the <a href="/en/tools/audio-speed-changer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Audio Speed & Pitch Changer</a>.',
    dropLabel: 'Choose a video file',
    dropHint: 'You can also drag and drop a file here',
    sourceInfoTemplate: 'Original: {resolution}, duration {duration} ({size})',
    speedLabel: 'Playback speed',
    speedPresetsLabel: 'Speed presets',
    speedHint:
      'Enter a multiplier from 0.25 to 4 (for example 2 for double speed, 0.5 for half speed).',
    speedResultTemplate: 'Output length: {duration} ({speed}x speed)',
    formatLabel: 'Output format',
    formatMp4: 'MP4 (H.264/AAC)',
    formatWebm: 'WebM (VP9/Opus)',
    qualityLabel: 'Quality',
    qualityHigh: 'High (larger file)',
    qualityMedium: 'Medium',
    qualityLow: 'Low (smaller file)',
    qualityVeryLow: 'Lowest (smallest file)',
    heightLabel: 'Resolution (max height)',
    heightOriginal: 'Original size',
    heightTemplate: 'Shrink to {height}p or less',
    removeAudioLabel: 'Remove audio (video only)',
    pitchNote:
      'Audio is played back at the new speed, so it sounds higher when sped up and lower when slowed down (pitch is not preserved).',
    convertButton: 'Convert',
    cancelButton: 'Cancel',
    clearButton: 'Clear',
    progressTemplate: 'Converting… {percent}%',
    progressLabel: 'Conversion progress',
    resultsHeading: 'Result',
    resultSizeTemplate: 'Output: {size}, duration {duration}',
    downloadButton: 'Download',
    errorCanceled: 'Conversion canceled.',
    errorUnsupportedFile: 'Please choose a video file',
    errorUnreadable:
      'The file could not be read. It may be corrupted or in an unsupported format.',
    errorNoVideo: 'This file has no video track. Please choose a video file.',
    errorUnsupportedInput:
      'Your browser cannot decode the audio or video format (codec) of this file. Try a different browser, such as the latest Chrome or Edge.',
    errorUnsupportedOutput:
      'Your browser cannot encode the selected output format. Choose another format, or try the latest Chrome or Edge.',
    errorFailed:
      'Conversion failed. The file may be corrupted or your browser may not support it.',
    errorFileTooLargeTemplate: 'The file exceeds the size limit ({max})',
    errorSpeedTemplate:
      'Enter a playback speed between {min} and {max} (for example 2 or 0.5)',
    notesHeading: 'Notes',
    notes: [
      'Audio pitch is not preserved. It follows the playback speed, so voices sound higher when sped up and lower in slow motion. To change speed while keeping the pitch, extract the audio and use the audio speed and pitch tool instead.',
      'The video is re-encoded to change its speed, so some quality is lost. "High" keeps the loss small but makes a larger file.',
      'When speeding up, frames are dropped so the output stays at or below 60 fps. When slowing down, no frames are interpolated, so motion can look choppy.',
      'Speed depends on your device. Long or high-resolution videos can take a while or fail when memory runs out.',
      'Keep this tab open and in the foreground while converting. Some browsers slow down or pause background tabs.',
      'Available input and output formats vary by browser. MP4 (H.264) output works best in Chrome, Edge and Safari, WebM output in Chrome and Edge, and Firefox may have limited encoding support.',
      'The file size limit is 1 GB. The output is built in memory, so large files use a lot of RAM. Subtitles and extra audio tracks are not carried over.',
      'All processing happens in your browser; the file you choose is never sent to a server.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a video file (drag and drop also works).',
      'Enter a multiplier in "Playback speed", or pick one of the preset buttons.',
      'Pick the "Output format" and "Quality". If you do not need sound, check "Remove audio (video only)".',
      'Press "Convert", then save the result with "Download" when it finishes.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Pitch',
        description:
          'How high or low a sound is. Playing audio faster raises its pitch and playing it slower lowers it. This tool does not correct the pitch.',
      },
      {
        term: 'fps (frame rate)',
        description:
          'The number of frames shown per second. Speeding a video up packs the frames closer together and raises the fps, so this tool drops frames to stay at 60 fps or below.',
      },
      {
        term: 'WebCodecs',
        description:
          'A standard browser API for compressing and decompressing video and audio. This tool uses it to convert files inside your browser.',
      },
    ],
  },
};
