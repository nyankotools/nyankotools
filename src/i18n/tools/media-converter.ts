import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface MediaConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{duration}` `{size}` `{resolution}` を置換して使うテンプレート */
  sourceInfoVideoTemplate: string;
  /** `{duration}` `{size}` を置換して使うテンプレート */
  sourceInfoAudioTemplate: string;
  formatLabel: string;
  formatGroupVideo: string;
  formatGroupAudio: string;
  formatMp4: string;
  formatWebm: string;
  formatMp3: string;
  formatM4a: string;
  formatOgg: string;
  formatWav: string;
  qualityLabel: string;
  qualityHigh: string;
  qualityMedium: string;
  qualityLow: string;
  qualityVeryLow: string;
  /** WAV は非圧縮のため品質設定が効かない旨 */
  qualityWavHint: string;
  heightLabel: string;
  heightOriginal: string;
  /** `{height}` を置換して使うテンプレート */
  heightTemplate: string;
  removeAudioLabel: string;
  trimLabel: string;
  trimStartLabel: string;
  trimEndLabel: string;
  trimPlaceholderStart: string;
  trimPlaceholderEnd: string;
  trimHint: string;
  convertButton: string;
  cancelButton: string;
  clearButton: string;
  /** `{percent}` を置換して使うテンプレート */
  progressTemplate: string;
  progressLabel: string;
  resultsHeading: string;
  /** `{size}` `{ratio}` を置換して使うテンプレート */
  resultSizeTemplate: string;
  downloadButton: string;
  errorCanceled: string;
  errorUnsupportedFile: string;
  errorUnreadable: string;
  errorUnsupportedInput: string;
  errorUnsupportedOutput: string;
  errorNoAudio: string;
  errorFailed: string;
  /** `{max}` を置換して使うテンプレート */
  errorFileTooLargeTemplate: string;
  errorTrimInvalid: string;
  errorTrimOutOfRange: string;
  errorTrimOrder: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const mediaConverterContent: Record<Locale, MediaConverterPageContent> =
  {
    ja: {
      title:
        '動画・音声変換／トリミング／圧縮｜MP4・WebM・MP3に変換（ブラウザ完結）',
      description:
        '動画や音声ファイルをMP4・WebM・MP3・M4A・OGG・WAVに変換し、必要な部分だけ切り出し、画質や解像度を下げて容量を圧縮できる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: '動画・音声の変換・トリミング・圧縮',
      introHtml:
        '動画や音声ファイルを選び、出力形式・品質・解像度を指定して変換できます。開始・終了の時刻を入れれば必要な部分だけ切り出せ、動画から音声だけ（MP3など）を取り出すこともできます。処理にはブラウザの動画・音声エンコード機能（WebCodecs）を使うため、ファイルは外部に送信されません。画像の変換は<a href="/tools/image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像形式変換</a>をご利用ください。',
      dropLabel: '動画・音声ファイルを選択',
      dropHint: 'ここにファイルをドラッグ＆ドロップすることもできます',
      sourceInfoVideoTemplate:
        '元ファイル: 動画 {resolution}・長さ {duration}（{size}）',
      sourceInfoAudioTemplate: '元ファイル: 音声・長さ {duration}（{size}）',
      formatLabel: '出力形式',
      formatGroupVideo: '動画',
      formatGroupAudio: '音声のみ',
      formatMp4: 'MP4（H.264/AAC）',
      formatWebm: 'WebM（VP9/Opus）',
      formatMp3: 'MP3',
      formatM4a: 'M4A（AAC）',
      formatOgg: 'OGG（Opus）',
      formatWav: 'WAV（非圧縮）',
      qualityLabel: '品質',
      qualityHigh: '高（容量大）',
      qualityMedium: '標準',
      qualityLow: '低（容量小）',
      qualityVeryLow: '最低（容量最小）',
      qualityWavHint: 'WAVは非圧縮のため、品質の設定は影響しません。',
      heightLabel: '解像度（高さの上限）',
      heightOriginal: '元のサイズ',
      heightTemplate: '{height}p 以下に縮小',
      removeAudioLabel: '音声を削除する（映像のみにする）',
      trimLabel: 'トリミング（切り出し）',
      trimStartLabel: '開始',
      trimEndLabel: '終了',
      trimPlaceholderStart: '例: 0:10',
      trimPlaceholderEnd: '例: 1:30',
      trimHint:
        '「90」「1:30」「1:02:03.5」の形式で入力します。両方空欄なら全体を変換します。',
      convertButton: '変換する',
      cancelButton: 'キャンセル',
      clearButton: 'クリア',
      progressTemplate: '変換中… {percent}%',
      progressLabel: '変換の進捗',
      resultsHeading: '変換結果',
      resultSizeTemplate: '出力: {size}（元ファイルの {ratio}%）',
      downloadButton: 'ダウンロード',
      errorCanceled: '変換をキャンセルしました。',
      errorUnsupportedFile: '動画・音声ファイルを選択してください',
      errorUnreadable:
        'ファイルを読み込めませんでした。破損しているか、対応していない形式の可能性があります。',
      errorUnsupportedInput:
        'このファイルの音声・映像の形式（コーデック）は、お使いのブラウザでは読み込めません。別のブラウザ（最新のChromeやEdgeなど）でお試しください。',
      errorUnsupportedOutput:
        'お使いのブラウザは、選んだ出力形式のエンコードに対応していません。別の出力形式を選ぶか、最新のChromeやEdgeでお試しください。',
      errorNoAudio:
        'このファイルには音声がないため、音声形式には変換できません。',
      errorFailed:
        '変換に失敗しました。ファイルが破損しているか、お使いのブラウザが対応していない可能性があります。',
      errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
      errorTrimInvalid:
        'トリミングの時刻の形式が正しくありません（例: 90、1:30、1:02:03.5）',
      errorTrimOutOfRange: 'トリミングの時刻が、ファイルの長さの範囲外です',
      errorTrimOrder: 'トリミングの終了は、開始より後の時刻にしてください',
      notesHeading: '注意点',
      notes: [
        '変換はお使いのパソコン・スマートフォンの性能に依存します。長い動画や高解像度の動画は、時間がかかったりメモリ不足で失敗したりすることがあります。',
        '変換中はこのタブを閉じたり、別のタブに切り替えたままにしたりしないでください。ブラウザによっては、バックグラウンドで処理が遅くなったり止まったりします。',
        '動画・音声のエンコードにはブラウザの機能（WebCodecs）を使うため、選べる出力形式や読み込める入力形式はブラウザによって異なります。MP4（H.264）の出力はChrome・Edge・Safariで、WebMの出力はChrome・Edgeで動作しやすく、Firefoxではエンコード機能が限られることがあります。',
        '変換は再エンコードを伴うため、画質・音質は元より劣化します。「高」を選ぶと劣化を抑えられますが、容量は大きくなります。',
        '同じ形式のまま容量を小さくしたい場合は、出力形式を元と同じにして「品質」を下げるか、解像度の上限を下げてください。',
        'ファイルサイズの上限は1GBです。出力はいったんメモリ上に作られるため、大きなファイルはメモリを多く消費します。',
        '字幕・複数の音声トラック・チャプターなどは引き継がれません。主な映像と音声のみが出力されます。',
        'すべての処理はブラウザ内で完結し、選択したファイルがサーバーに送信されることはありません。',
      ],
      howToHeading: '使い方',
      howToSteps: [
        '動画または音声ファイルを選択します（ドラッグ＆ドロップも可能です）。',
        '「出力形式」「品質」を選びます。動画は「解像度（高さの上限）」を下げると容量を小さくできます。',
        '必要な部分だけを残したい場合は、「トリミング（切り出し）」の「開始」「終了」に時刻を入力します。',
        '「変換する」を押し、完了したら「ダウンロード」で保存します。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'コーデック',
          description:
            '映像や音声のデータを圧縮・展開する方式。H.264、VP9、AAC、Opusなどがあります。同じ「MP4」でも中身のコーデックは異なることがあります。',
        },
        {
          term: 'コンテナ（ファイル形式）',
          description:
            '映像・音声・字幕などをひとつのファイルにまとめる入れ物。MP4、WebM、MKV、MOVなどがあり、コンテナごとに格納できるコーデックが決まっています。',
        },
        {
          term: 'ビットレート',
          description:
            '1秒あたりのデータ量（bps）。高いほど高画質・高音質になりますが、ファイルサイズも大きくなります。本ツールでは「品質」の設定でビットレートが決まります。',
        },
        {
          term: 'WebCodecs',
          description:
            'ブラウザが備える、映像・音声の圧縮・展開を行うための標準API。本ツールはこれを使い、ブラウザ内で変換を行います。',
        },
      ],
    },
    en: {
      title: 'Video & Audio Converter, Trimmer & Compressor (MP4, MP3)',
      description:
        'Free tool to convert video and audio to MP4, WebM, MP3 or WAV, trim clips, and compress files by lowering quality. Runs in your browser, no upload.',
      h1: 'Video & Audio Converter, Trimmer and Compressor',
      introHtml:
        'Choose a video or audio file, then pick an output format, quality, and resolution. Enter start and end times to keep only the part you need, or extract just the audio (for example as MP3) from a video. It uses your browser’s built-in video and audio encoders (WebCodecs), so your file is never uploaded. To convert pictures instead, use the <a href="/en/tools/image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Format Converter</a>.',
      dropLabel: 'Choose a video or audio file',
      dropHint: 'You can also drag and drop a file here',
      sourceInfoVideoTemplate:
        'Original: video {resolution}, duration {duration} ({size})',
      sourceInfoAudioTemplate: 'Original: audio, duration {duration} ({size})',
      formatLabel: 'Output format',
      formatGroupVideo: 'Video',
      formatGroupAudio: 'Audio only',
      formatMp4: 'MP4 (H.264/AAC)',
      formatWebm: 'WebM (VP9/Opus)',
      formatMp3: 'MP3',
      formatM4a: 'M4A (AAC)',
      formatOgg: 'OGG (Opus)',
      formatWav: 'WAV (uncompressed)',
      qualityLabel: 'Quality',
      qualityHigh: 'High (larger file)',
      qualityMedium: 'Medium',
      qualityLow: 'Low (smaller file)',
      qualityVeryLow: 'Lowest (smallest file)',
      qualityWavHint: 'WAV is uncompressed, so quality has no effect.',
      heightLabel: 'Resolution (max height)',
      heightOriginal: 'Original size',
      heightTemplate: 'Shrink to {height}p or less',
      removeAudioLabel: 'Remove audio (video only)',
      trimLabel: 'Trim (cut out a section)',
      trimStartLabel: 'Start',
      trimEndLabel: 'End',
      trimPlaceholderStart: 'e.g. 0:10',
      trimPlaceholderEnd: 'e.g. 1:30',
      trimHint:
        'Enter times like "90", "1:30" or "1:02:03.5". Leave both empty to convert the whole file.',
      convertButton: 'Convert',
      cancelButton: 'Cancel',
      clearButton: 'Clear',
      progressTemplate: 'Converting… {percent}%',
      progressLabel: 'Conversion progress',
      resultsHeading: 'Result',
      resultSizeTemplate: 'Output: {size} ({ratio}% of the original)',
      downloadButton: 'Download',
      errorCanceled: 'Conversion canceled.',
      errorUnsupportedFile: 'Please choose a video or audio file',
      errorUnreadable:
        'The file could not be read. It may be corrupted or in an unsupported format.',
      errorUnsupportedInput:
        'Your browser cannot decode the audio or video format (codec) of this file. Try a different browser, such as the latest Chrome or Edge.',
      errorUnsupportedOutput:
        'Your browser cannot encode the selected output format. Choose another format, or try the latest Chrome or Edge.',
      errorNoAudio:
        'This file has no audio, so it cannot be converted to an audio format.',
      errorFailed:
        'Conversion failed. The file may be corrupted or your browser may not support it.',
      errorFileTooLargeTemplate: 'The file exceeds the size limit ({max})',
      errorTrimInvalid:
        'The trim time format is invalid (examples: 90, 1:30, 1:02:03.5)',
      errorTrimOutOfRange: 'The trim time is outside the length of the file',
      errorTrimOrder: 'The trim end must be later than the start',
      notesHeading: 'Notes',
      notes: [
        'Speed depends on your device. Long or high-resolution videos can take a while or fail when memory runs out.',
        'Keep this tab open and in the foreground while converting. Some browsers slow down or pause background tabs.',
        'Encoding uses your browser’s WebCodecs support, so available input and output formats vary by browser. MP4 (H.264) output works best in Chrome, Edge and Safari, WebM output in Chrome and Edge, and Firefox may have limited encoding support.',
        'Converting re-encodes the media, so some quality is lost. "High" keeps the loss small but makes a larger file.',
        'To shrink a file without changing its format, choose the same output format as the original and lower the quality or the maximum resolution.',
        'The file size limit is 1 GB. The output is built in memory, so large files use a lot of RAM.',
        'Subtitles, extra audio tracks and chapters are not carried over. Only the main video and audio are written.',
        'All processing happens in your browser; the file you choose is never sent to a server.',
      ],
      howToHeading: 'How to use',
      howToSteps: [
        'Choose a video or audio file (drag and drop also works).',
        'Pick the "Output format" and "Quality". For video, lowering "Resolution (max height)" makes the file smaller.',
        'To keep only a section, enter times in "Start" and "End" under "Trim (cut out a section)".',
        'Press "Convert", then save the result with "Download" when it finishes.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'Codec',
          description:
            'The method used to compress and decompress video or audio data, such as H.264, VP9, AAC or Opus. Two files that are both "MP4" can contain different codecs.',
        },
        {
          term: 'Container (file format)',
          description:
            'A wrapper that bundles video, audio and subtitles into one file, such as MP4, WebM, MKV or MOV. Each container supports only certain codecs.',
        },
        {
          term: 'Bitrate',
          description:
            'The amount of data per second (bps). A higher bitrate means better quality but a larger file. In this tool, the "Quality" setting decides the bitrate.',
        },
        {
          term: 'WebCodecs',
          description:
            'A standard browser API for compressing and decompressing video and audio. This tool uses it to convert files inside your browser.',
        },
      ],
    },
  };
