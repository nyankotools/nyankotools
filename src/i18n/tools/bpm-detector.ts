import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface BpmDetectorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{duration}` `{rate}` `{channels}` `{size}` を置換して使うテンプレート */
  sourceInfoTemplate: string;
  clearButton: string;
  analyzing: string;
  resultsHeading: string;
  bpmUnit: string;
  confidenceLabel: string;
  confidenceHigh: string;
  confidenceMedium: string;
  confidenceLow: string;
  /** `{half}` `{double}` を置換して使うテンプレート */
  alternativesTemplate: string;
  /** `{seconds}` を置換して使うテンプレート（長い曲は一部だけ解析した旨） */
  partialTemplate: string;
  disclaimer: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  errorUnsupportedFile: string;
  errorDecode: string;
  errorTooLong: string;
  /** `{max}` を置換して使うテンプレート */
  errorFileTooLargeTemplate: string;
  errorNoResult: string;
  errorFailed: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const bpmDetectorContent: Record<Locale, BpmDetectorPageContent> = {
  ja: {
    title: 'BPM検出｜音声ファイルのテンポ(BPM)を自動で測定（ブラウザ完結）',
    description:
      'MP3・WAV・M4Aなどの音声ファイルからBPM（テンポ）を自動で検出する無料ツールです。ビートを解析して推定し、半分・2倍のテンポ候補も表示。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '音声ファイルのBPM検出',
    introHtml:
      '音声ファイルを選ぶだけで、曲のBPM（1分あたりの拍数）を自動で推定します。音の立ち上がり（オンセット）を検出し、その周期性から拍の間隔を割り出す方式です。結果は目安なので、自分で拍を叩いて確かめたいときは<a href="/tools/metronome-bpm/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">BPM測定（タップテンポ）</a>、BPMからディレイやリバーブの時間を求めたいときは<a href="/tools/bpm-delay-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">BPMディレイ計算</a>もご利用ください。処理はすべてブラウザ内で行われ、ファイルは外部に送信されません。',
    dropLabel: '音声ファイルを選択',
    dropHint: 'ここにファイルをドラッグ＆ドロップすることもできます',
    sourceInfoTemplate:
      '元ファイル: 長さ {duration}・{rate} Hz・{channels}ch（{size}）',
    clearButton: 'クリア',
    analyzing: '解析中です…',
    resultsHeading: '検出結果',
    bpmUnit: 'BPM',
    confidenceLabel: '信頼度の目安',
    confidenceHigh: '高い（拍がはっきりしています）',
    confidenceMedium: '中程度（拍が少し不明瞭です）',
    confidenceLow: '低い（結果が外れている可能性があります）',
    alternativesTemplate: '半分のテンポなら {half}、2倍のテンポなら {double}',
    partialTemplate: '長い音声のため、中央付近の約{seconds}秒を解析しました。',
    disclaimer:
      '推定値はあくまで目安です。曲によっては半分や2倍のテンポを返したり、数BPMずれたりします。',
    copyButton: 'BPMをコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorUnsupportedFile: '音声ファイルを選択してください',
    errorDecode:
      'ファイルを読み込めませんでした。破損しているか、お使いのブラウザが対応していない形式の可能性があります。',
    errorTooLong:
      '音声が長すぎます（上限は20分です）。先に短く切り出してからお試しください。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    errorNoResult:
      'BPMを検出できませんでした。無音に近い、短すぎる（4秒未満）、または拍がはっきりしない音声の可能性があります。',
    errorFailed: '解析に失敗しました。メモリが足りない可能性があります。',
    notesHeading: '注意点',
    notes: [
      '検出結果は推定値で、正確さは保証できません。ドラムなどの拍がはっきりした曲は当たりやすい一方、アンビエント、ルバート（テンポが揺れる演奏）、拍子が頻繁に変わる曲、ライブ録音などは外れやすくなります。',
      '半分や2倍のテンポを返すことがあります（例: 実際は70 BPMの曲を140 BPMと判定）。画面には半分・2倍の候補も併記するので、曲に合うほうを選んでください。',
      '探索範囲は60〜200 BPMです。これより遅い・速い曲は、範囲内の倍数または約数として検出されます。',
      'テンポが曲の途中で変わる場合は、全体で最も目立つ周期を1つだけ返します。長い曲は中央付近の約90秒だけを解析します。',
      '読み込めるのは、お使いのブラウザがデコードできる形式です（MP3・WAV・M4A・OGGなど）。長さの上限は20分、ファイルサイズの上限は200MBです。',
      'すべての処理はブラウザ内で完結し、選択したファイルがサーバーに送信されることはありません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '音声ファイルを選択します（ドラッグ＆ドロップも可能です）。',
      '読み込みが終わると自動で解析され、「検出結果」にBPMと信頼度の目安が表示されます。',
      '半分・2倍の候補を見て曲に合うテンポを選び、「BPMをコピー」で控えます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'BPM',
        description:
          'Beats Per Minuteの略で、1分間の拍数を表すテンポの単位。120 BPMなら1拍が0.5秒です。',
      },
      {
        term: 'オンセット',
        description:
          '音が鳴り始める瞬間のこと。ドラムの打撃やギターのピッキングなど、音量が急に立ち上がる位置を指します。',
      },
      {
        term: '自己相関',
        description:
          '信号を少しずらして自分自身と重ねたときの一致度。一定間隔で繰り返す成分があると、その間隔で一致度が高くなるため、拍の周期の推定に使います。',
      },
      {
        term: 'ハーフ／ダブルテンポ',
        description:
          '実際のテンポの半分、または2倍で拍を数えてしまうこと。リズムの数え方の違いで起きる、BPM検出で最も多い取り違えです。',
      },
    ],
  },
  en: {
    title: 'BPM Detector – Find the Tempo of an Audio File Online',
    description:
      'Detect the BPM (tempo) of an MP3, WAV or M4A file by analyzing its beats right in your browser. Also shows half and double tempo. Free, no upload.',
    h1: 'BPM Detector for Audio Files',
    introHtml:
      'Choose an audio file and the tool estimates its BPM (beats per minute). It finds where sounds start (onsets) and measures how regularly they repeat to work out the beat interval. The result is an estimate, so to check it by ear, tap along with the <a href="/en/tools/metronome-bpm/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">BPM Tap Tempo</a> tool, or turn the BPM into delay times with the <a href="/en/tools/bpm-delay-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">BPM Delay Calculator</a>. Everything runs in your browser, so your file is never uploaded.',
    dropLabel: 'Choose an audio file',
    dropHint: 'You can also drag and drop a file here',
    sourceInfoTemplate:
      'Original: {duration}, {rate} Hz, {channels} ch ({size})',
    clearButton: 'Clear',
    analyzing: 'Analyzing…',
    resultsHeading: 'Detected tempo',
    bpmUnit: 'BPM',
    confidenceLabel: 'Confidence (rough guide)',
    confidenceHigh: 'High (the beat is clear)',
    confidenceMedium: 'Medium (the beat is a little unclear)',
    confidenceLow: 'Low (the result may be off)',
    alternativesTemplate: 'Half tempo: {half}. Double tempo: {double}',
    partialTemplate:
      'The audio is long, so about {seconds} seconds from the middle were analyzed.',
    disclaimer:
      'This is only an estimate. Depending on the track it may return half or double the tempo, or be off by a few BPM.',
    copyButton: 'Copy BPM',
    copied: 'Copied',
    copyFailed: 'Could not copy',
    errorUnsupportedFile: 'Please choose an audio file',
    errorDecode:
      'The file could not be read. It may be corrupted or in a format your browser cannot decode.',
    errorTooLong:
      'This audio is too long (the limit is 20 minutes). Trim it to a shorter clip first.',
    errorFileTooLargeTemplate: 'The file exceeds the size limit ({max})',
    errorNoResult:
      'No tempo could be detected. The audio may be nearly silent, shorter than 4 seconds, or have no clear beat.',
    errorFailed: 'Analysis failed. Your device may have run out of memory.',
    notesHeading: 'Notes',
    notes: [
      'The result is an estimate and its accuracy is not guaranteed. Tracks with a clear beat, such as drum-driven music, usually work well; ambient music, rubato playing, frequent meter changes and live recordings are more likely to be off.',
      'The tool can return half or double the real tempo (for example 140 BPM for a 70 BPM song). Half and double candidates are shown next to the result so you can pick the one that fits the song.',
      'The search range is 60 to 200 BPM. Slower or faster songs are reported as a multiple or fraction that falls inside this range.',
      'If the tempo changes during the song, only the single most prominent period is returned. For long tracks, only about 90 seconds from the middle are analyzed.',
      'Any format your browser can decode works (MP3, WAV, M4A, OGG and so on). The limits are 20 minutes of audio and a 200 MB file.',
      'All processing happens in your browser; the file you choose is never sent to a server.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose an audio file (drag and drop also works).',
      'Once it loads, the file is analyzed automatically and "Detected tempo" shows the BPM with a rough confidence level.',
      'Compare the half and double candidates, pick the one that fits the song, and note it down with "Copy BPM".',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'BPM',
        description:
          'Beats per minute, the unit of tempo. At 120 BPM each beat lasts 0.5 seconds.',
      },
      {
        term: 'Onset',
        description:
          'The moment a sound begins, such as a drum hit or a guitar pick, where the volume rises sharply.',
      },
      {
        term: 'Autocorrelation',
        description:
          'How well a signal matches a shifted copy of itself. If something repeats at a steady interval, the match is strongest at that interval, which is how the beat period is estimated.',
      },
      {
        term: 'Half / double tempo',
        description:
          'Counting the beat at half or twice the real tempo. It is the most common mistake in BPM detection and comes from different ways of counting the rhythm.',
      },
    ],
  },
};
