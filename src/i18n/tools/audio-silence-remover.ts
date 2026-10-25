import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface AudioSilenceRemoverPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{duration}` `{size}` `{rate}` `{channels}` を置換して使うテンプレート */
  sourceInfoTemplate: string;
  waveformHeading: string;
  waveformLabel: string;
  waveformLegend: string;
  thresholdLabel: string;
  thresholdHint: string;
  minSilenceLabel: string;
  minSilenceHint: string;
  modeLabel: string;
  modeCut: string;
  modeShorten: string;
  paddingLabel: string;
  paddingHint: string;
  shortenLabel: string;
  shortenHint: string;
  /** `{count}` `{cuts}` を置換して使うテンプレート */
  analysisTemplate: string;
  /** `{before}` `{after}` `{removed}` `{percent}` を置換して使うテンプレート */
  summaryTemplate: string;
  processButton: string;
  clearButton: string;
  processing: string;
  resultsHeading: string;
  /** `{before}` `{after}` `{removed}` `{percent}` `{size}` を置換して使うテンプレート */
  resultInfoTemplate: string;
  downloadButton: string;
  errorUnsupportedFile: string;
  errorDecode: string;
  errorTooLong: string;
  /** `{max}` を置換して使うテンプレート */
  errorFileTooLargeTemplate: string;
  errorThresholdInvalid: string;
  errorThresholdOutOfRange: string;
  errorMinSilenceInvalid: string;
  errorMinSilenceOutOfRange: string;
  errorPaddingInvalid: string;
  errorPaddingOutOfRange: string;
  errorShortenInvalid: string;
  errorShortenOutOfRange: string;
  errorNothingToCut: string;
  errorAllSilent: string;
  errorFailed: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const audioSilenceRemoverContent: Record<
  Locale,
  AudioSilenceRemoverPageContent
> = {
  ja: {
    title: '音声の無音カット｜無音区間を自動検出して削除・短縮しWAV保存',
    description:
      '音声ファイルの無音区間を波形で確認しながら自動検出し、しきい値(dB)・最小無音長・残す余白を指定してカットまたは短縮できる無料ツールです。処理前後の長さも表示。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '音声の無音区間を検出してカット・短縮',
    introHtml:
      '録音した音声ファイルから、声や音が途切れた無音の部分を見つけて取り除けます。波形に無音区間（カット対象）が色付きで表示されるので、しきい値や最小無音長を調整しながら確認でき、処理の前後で長さがどれだけ短くなるかも分かります。会議・講義・ナレーションの録音整理に便利です。処理はすべてブラウザ内で行われ、ファイルは外部に送信されません。速度を変えたい場合は<a href="/tools/audio-speed-changer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">音声の速度・ピッチ変更</a>、複数ファイルをつなぐ場合は<a href="/tools/audio-merger/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">音声ファイル結合</a>をご利用ください。',
    dropLabel: '音声ファイルを選択',
    dropHint: 'ここにファイルをドラッグ＆ドロップすることもできます',
    sourceInfoTemplate:
      '元ファイル: 長さ {duration}・{rate} Hz・{channels}ch（{size}）',
    waveformHeading: '波形と無音区間',
    waveformLabel: '音声の波形。赤く塗られた部分がカット対象の無音区間です。',
    waveformLegend:
      '青: 音の大きさ（dBの対数表示）／赤の帯: カットされる無音／橙の線: しきい値',
    thresholdLabel: 'しきい値（dB）',
    thresholdHint:
      '-100〜0。この音量以下を無音とみなします。小さいほど厳密（-60）、大きいほど無音扱いが増えます（-30）。',
    minSilenceLabel: '最小無音長（秒）',
    minSilenceHint:
      '0.05〜60。この長さ以上続く無音だけを対象にします。短い息継ぎを残したいときは長めに。',
    modeLabel: '無音の処理',
    modeCut: '無音をカット（余白だけ残す）',
    modeShorten: '無音を短縮（指定の長さに詰める）',
    paddingLabel: '残す余白（秒）',
    paddingHint:
      '0〜5。無音の前後に残す時間です。0だと音の直前・直後でスパッと切れます。',
    shortenLabel: '短縮後の無音長（秒）',
    shortenHint:
      '0〜10。長い無音をこの長さまで詰めます。「無音を短縮」のときだけ使います。',
    analysisTemplate: '検出した無音: {count}か所（カット対象 {cuts}か所）',
    summaryTemplate:
      '処理前 {before} → 処理後 {after}（{removed} 短縮・{percent}% 削減）',
    processButton: '無音を除去する',
    clearButton: 'クリア',
    processing: '処理中です。長い音声は少し時間がかかります…',
    resultsHeading: '処理結果',
    resultInfoTemplate:
      '処理前 {before} → 処理後 {after}（{removed} 短縮・{percent}% 削減）・WAV {size}',
    downloadButton: 'ダウンロード',
    errorUnsupportedFile: '音声ファイルを選択してください',
    errorDecode:
      'ファイルを読み込めませんでした。破損しているか、お使いのブラウザが対応していない形式の可能性があります。',
    errorTooLong:
      '音声が長すぎます（上限は10分です）。先に短く切り出してからお試しください。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    errorThresholdInvalid: 'しきい値は数値で入力してください（例: -40）',
    errorThresholdOutOfRange: 'しきい値は-100〜0の範囲で指定してください',
    errorMinSilenceInvalid: '最小無音長は数値で入力してください（例: 0.5）',
    errorMinSilenceOutOfRange: '最小無音長は0.05〜60秒の範囲で指定してください',
    errorPaddingInvalid: '残す余白は数値で入力してください（例: 0.1）',
    errorPaddingOutOfRange: '残す余白は0〜5秒の範囲で指定してください',
    errorShortenInvalid: '短縮後の無音長は数値で入力してください（例: 0.3）',
    errorShortenOutOfRange: '短縮後の無音長は0〜10秒の範囲で指定してください',
    errorNothingToCut:
      'カットできる無音がありません。しきい値を大きく、または最小無音長を短くしてお試しください。',
    errorAllSilent:
      '全体が無音と判定され、何も残りません。しきい値を小さくしてお試しください。',
    errorFailed: '処理に失敗しました。メモリが足りない可能性があります。',
    notesHeading: '注意点',
    notes: [
      '無音の判定は、10ミリ秒ごとの最大音量がしきい値以下かどうかで行います。BGMや環境ノイズが入っている録音では、ノイズの音量より少し大きいしきい値にしないと無音と判定されません。',
      '波形は音量をdB（対数）で表示しています。小さな音も見えやすい反面、実際の振幅とは見た目の比率が異なります。',
      '「無音をカット」では、ファイルの先頭と末尾の無音は音のある側の余白だけを残して削除します。余白を0にすると、音の直前・直後で切れるため不自然に聞こえることがあります。',
      'つなぎ目には2ミリ秒の短いフェードを入れてプチ音を防いでいますが、背景に一定の音が流れている録音ではつなぎ目が分かる場合があります。',
      '出力はWAV（16bit PCM）で、元の形式より容量が大きくなります。MP3などに圧縮したい場合は、保存したWAVを動画・音声変換ツールで変換してください。',
      '読み込めるのは、お使いのブラウザがデコードできる形式です。長さの上限は10分、ファイルサイズの上限は200MBです。',
      'すべての処理はブラウザ内で完結し、選択したファイルがサーバーに送信されることはありません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '音声ファイルを選択します（ドラッグ＆ドロップも可能です）。',
      '波形を見ながら「しきい値（dB）」と「最小無音長（秒）」を調整し、赤い帯がカットしたい無音に重なるようにします。',
      '「無音の処理」を選び、「残す余白（秒）」などを指定します。処理前後の長さが表示されます。',
      '「無音を除去する」を押して試聴し、問題なければ「ダウンロード」でWAVを保存します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'dB（デシベル）',
        description:
          '音の大きさを対数で表す単位。デジタル音声では最大音量を0dBとし、それより小さい音を-20dB、-40dBのように負の値で表します。',
      },
      {
        term: 'しきい値',
        description:
          '無音かどうかを分ける音量の境目。これ以下の音量が続く部分を無音として扱います。',
      },
      {
        term: '余白（マージン）',
        description:
          '無音を削るときに、音の前後へあえて残しておく短い時間。語頭・語尾が欠けたり、つなぎが不自然になったりするのを防ぎます。',
      },
      {
        term: 'WAV',
        description:
          '音声を圧縮せずに記録するファイル形式。音質は劣化しませんが、容量は大きくなります。',
      },
    ],
  },
  en: {
    title: 'Audio Silence Remover – Cut Silent Parts Online',
    description:
      'Detect and cut silence in audio with a waveform view. Set the threshold in dB, minimum length and padding, then save as WAV. Runs in your browser, no upload.',
    h1: 'Audio Silence Remover: Detect and Cut Silent Parts',
    introHtml:
      'Find the silent gaps in a recording and remove or shorten them. The waveform highlights the parts that will be cut, so you can tune the threshold and minimum silence length and see how much shorter the audio gets before and after. Handy for tidying up meetings, lectures, voice-overs and podcasts. Everything runs in your browser, so your file is never uploaded. To change the tempo, use the <a href="/en/tools/audio-speed-changer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Audio Speed &amp; Pitch Changer</a>; to join several files, try the <a href="/en/tools/audio-merger/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Audio Merger</a>.',
    dropLabel: 'Choose an audio file',
    dropHint: 'You can also drag and drop a file here',
    sourceInfoTemplate:
      'Original: {duration}, {rate} Hz, {channels} ch ({size})',
    waveformHeading: 'Waveform and silence',
    waveformLabel:
      'Audio waveform. The red shaded parts are the silent sections that will be cut.',
    waveformLegend:
      'Blue: loudness (logarithmic dB scale) / red band: silence to be cut / orange line: threshold',
    thresholdLabel: 'Threshold (dB)',
    thresholdHint:
      '-100 to 0. Anything at or below this level counts as silence. Lower is stricter (-60); higher treats more as silence (-30).',
    minSilenceLabel: 'Minimum silence length (seconds)',
    minSilenceHint:
      '0.05 to 60. Only silences at least this long are affected. Use a longer value to keep short breaths.',
    modeLabel: 'How to handle silence',
    modeCut: 'Cut silence (keep only padding)',
    modeShorten: 'Shorten silence (to a set length)',
    paddingLabel: 'Padding to keep (seconds)',
    paddingHint:
      '0 to 5. Time kept on each side of the sound. With 0, the audio is cut right at the start and end of the sound.',
    shortenLabel: 'Shortened silence length (seconds)',
    shortenHint:
      '0 to 10. Long silences are shortened to this length. Only used with "Shorten silence (to a set length)".',
    analysisTemplate: 'Silences found: {count} (to be cut: {cuts})',
    summaryTemplate:
      'Before {before} → after {after} ({removed} shorter, {percent}% less)',
    processButton: 'Remove silence',
    clearButton: 'Clear',
    processing: 'Processing. Long recordings may take a moment…',
    resultsHeading: 'Result',
    resultInfoTemplate:
      'Before {before} → after {after} ({removed} shorter, {percent}% less), WAV {size}',
    downloadButton: 'Download',
    errorUnsupportedFile: 'Please choose an audio file',
    errorDecode:
      'The file could not be read. It may be corrupted or in a format your browser cannot decode.',
    errorTooLong:
      'This audio is too long (the limit is 10 minutes). Trim it to a shorter clip first.',
    errorFileTooLargeTemplate: 'The file exceeds the size limit ({max})',
    errorThresholdInvalid: 'Enter the threshold as a number (for example -40)',
    errorThresholdOutOfRange: 'Threshold must be between -100 and 0',
    errorMinSilenceInvalid:
      'Enter the minimum silence length as a number (for example 0.5)',
    errorMinSilenceOutOfRange:
      'Minimum silence length must be between 0.05 and 60 seconds',
    errorPaddingInvalid: 'Enter the padding as a number (for example 0.1)',
    errorPaddingOutOfRange: 'Padding must be between 0 and 5 seconds',
    errorShortenInvalid:
      'Enter the shortened length as a number (for example 0.3)',
    errorShortenOutOfRange:
      'Shortened silence length must be between 0 and 10 seconds',
    errorNothingToCut:
      'There is no silence to cut. Raise the threshold or shorten the minimum silence length and try again.',
    errorAllSilent:
      'The whole file counts as silence, so nothing would be left. Lower the threshold and try again.',
    errorFailed: 'Processing failed. Your device may have run out of memory.',
    notesHeading: 'Notes',
    notes: [
      'Silence is judged per 10 ms: a slice counts as silent when its peak level is at or below the threshold. Recordings with background music or room noise need a threshold a little above the noise level, or nothing will be detected.',
      'The waveform uses a logarithmic dB scale so quiet sounds stay visible. The heights are therefore not proportional to the real amplitude.',
      '"Cut silence (keep only padding)" keeps padding only on the side next to sound; silence at the very start or end of the file is removed up to the padding. With padding set to 0 the cuts land right at the edge of the sound, which can feel abrupt.',
      'A 2 ms fade is applied at each cut to avoid clicks, but a steady background sound can still make the joins noticeable.',
      'The output is 16-bit PCM WAV, so it is larger than the original. To compress it to MP3 or similar, run the saved WAV through the converter tool.',
      'Any format your browser can decode works. The limits are 10 minutes of audio and a 200 MB file.',
      'All processing happens in your browser; the file you choose is never sent to a server.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose an audio file (drag and drop also works).',
      'Watching the waveform, adjust "Threshold (dB)" and "Minimum silence length (seconds)" until the red bands cover the silences you want to remove.',
      'Pick "How to handle silence" and set "Padding to keep (seconds)" or the shortened length. The lengths before and after are shown.',
      'Press "Remove silence", listen to the result, and save the WAV with "Download".',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'dB (decibel)',
        description:
          'A logarithmic unit for loudness. In digital audio the maximum level is 0 dB, and quieter sounds are negative values such as -20 dB or -40 dB.',
      },
      {
        term: 'Threshold',
        description:
          'The level that separates sound from silence. Stretches that stay at or below it are treated as silent.',
      },
      {
        term: 'Padding (margin)',
        description:
          'A short amount of silence deliberately kept before and after the sound when removing silence. It stops word beginnings and endings from being clipped and keeps the joins natural.',
      },
      {
        term: 'WAV',
        description:
          'A file format that stores audio uncompressed. There is no quality loss, but the files are large.',
      },
    ],
  },
};
