import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SubtitleConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  fileLabel: string;
  fileHint: string;
  encodingLabel: string;
  encodingAuto: string;
  encodingUtf8: string;
  encodingShiftJis: string;
  /** `{encoding}` を置換する。自動判定の結果表示 */
  detectedTemplate: string;
  /** `{count}` を置換する。文字化けの警告 */
  invalidTemplate: string;
  inputLabel: string;
  inputPlaceholder: string;
  formatLabel: string;
  formatSrt: string;
  formatVtt: string;
  offsetLabel: string;
  offsetHint: string;
  fpsFromLabel: string;
  fpsToLabel: string;
  fpsNone: string;
  fpsHint: string;
  outputLabel: string;
  /** `{from}` `{to}` `{count}` を置換する。結果の概要 */
  summaryTemplate: string;
  /** `{count}` を置換する。読み飛ばしたブロック */
  skippedTemplate: string;
  /** `{count}` を置換する。ずらした結果、消えた字幕 */
  droppedTemplate: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  downloadButton: string;
  clearButton: string;
  errorOffsetInvalid: string;
  errorOffsetOutOfRange: string;
  errorFpsPair: string;
  errorNoCues: string;
  errorReadFailed: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const subtitleConverterContent: Record<
  Locale,
  SubtitleConverterPageContent
> = {
  ja: {
    title: '字幕SRT⇔VTT変換・時間ずらし｜文字コード判定対応（ブラウザ完結）',
    description:
      '字幕ファイルをSRTとWebVTT（VTT）で相互変換し、全体の時間を前後にずらせる無料ツールです。フレームレート補正やShift_JIS・UTF-8の自動判定にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '字幕SRT⇔VTT変換・時間ずらしツール',
    introHtml:
      '字幕ファイル（.srt / .vtt）を読み込むか貼り付けると、SRTとWebVTTを相互に変換できます。全体のタイミングを秒単位で前後にずらしたり、23.976fpsと25fpsなどフレームレートの違いによるずれを補正したりもできます。Shift_JISの字幕ファイルも文字コードを自動判定して読み込み、UTF-8で保存します。処理はすべてブラウザ内で行われ、字幕は外部に送信されません。動画そのものの変換は<a href="/tools/media-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">動画・音声変換</a>をご利用ください。',
    fileLabel: '字幕ファイルを選択',
    fileHint:
      'SRT・VTTファイルを選択できます。ここにドラッグ＆ドロップすることもできます。下の欄に直接貼り付けても構いません。',
    encodingLabel: '文字コード',
    encodingAuto: '自動判定',
    encodingUtf8: 'UTF-8',
    encodingShiftJis: 'Shift_JIS',
    detectedTemplate: '{encoding} として読み込みました',
    invalidTemplate:
      '読み取れない文字が{count}個あります。文字コードを切り替えてお試しください。',
    inputLabel: '字幕テキスト',
    inputPlaceholder: '1\n00:00:01,000 --> 00:00:03,000\nこんにちは',
    formatLabel: '変換後の形式',
    formatSrt: 'SRT（.srt）',
    formatVtt: 'WebVTT（.vtt）',
    offsetLabel: '時間をずらす（秒）',
    offsetHint:
      '正の値で遅らせ、負の値で早めます（例: 1.5、-0.8）。空欄は0です。',
    fpsFromLabel: '元のフレームレート',
    fpsToLabel: '変換先のフレームレート',
    fpsNone: '補正しない',
    fpsHint:
      '字幕が作られた映像のfpsと、字幕を付けたい映像のfpsを両方選ぶと、時刻を比例して補正します。',
    outputLabel: '変換結果',
    summaryTemplate: '{from} → {to}・字幕{count}件',
    skippedTemplate: '解釈できなかったブロックが{count}件ありました。',
    droppedTemplate:
      '時間をずらした結果、0秒より前になった字幕を{count}件削除しました。',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    downloadButton: 'ダウンロード',
    clearButton: 'クリア',
    errorOffsetInvalid: '時間は数値で入力してください（例: 1.5、-0.8）',
    errorOffsetOutOfRange: '時間は-86400〜86400秒の範囲で指定してください',
    errorFpsPair:
      'フレームレートは「元」と「変換先」の両方を選ぶか、両方「補正しない」にしてください',
    errorNoCues:
      '字幕を読み取れませんでした。SRTまたはWebVTT形式か確認してください。',
    errorReadFailed: 'ファイルを読み込めませんでした',
    notesHeading: '注意点',
    notes: [
      '文字コードの自動判定は、BOMの有無とUTF-8として正しく読めるかで行い、読めなければShift_JISとして扱います。文字化けしたときは「文字コード」を手動で切り替えてください。',
      '保存はUTF-8（BOMなし）固定です。Shift_JISでの保存には対応していません。',
      'SRT→VTTでは時刻の区切りをカンマからピリオドに変え、WEBVTTヘッダを付けます。VTT→SRTでは位置指定（line・alignなど）、NOTE・STYLE・REGIONは失われ、連番が振り直されます。',
      'ずらした結果0秒より前になる字幕は、終了時刻も0秒以前なら削除し、途中から始まる場合は開始を0秒に合わせます。',
      '字幕内の装飾タグ（<i>・<b>・<v>など）や本文はそのまま保持し、変換しません。ASS・SSAなど他の形式には対応していません。',
      'すべての処理はブラウザ内で完結し、字幕がサーバーに送信されることはありません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '「字幕ファイルを選択」でSRT/VTTを読み込みます（ドラッグ＆ドロップや貼り付けも可能です）。',
      '文字化けする場合は「文字コード」を切り替えます。',
      '「変換後の形式」を選び、必要なら「時間をずらす（秒）」やフレームレートを指定します。',
      '「変換結果」を確認し、「コピー」または「ダウンロード」で保存します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'SRT',
        description:
          '連番・時間・本文を並べたシンプルな字幕形式。時刻の秒とミリ秒をカンマで区切ります。',
      },
      {
        term: 'WebVTT（VTT）',
        description:
          'Webの動画（HTMLのvideoタグ）向けの字幕形式。先頭にWEBVTTと書き、時刻のミリ秒をピリオドで区切ります。',
      },
      {
        term: 'フレームレート補正',
        description:
          '23.976fpsと25fpsのように映像の速さが違うと、字幕が徐々にずれます。時刻に比率をかけて合わせ直す処理です。',
      },
      {
        term: 'BOM',
        description:
          'ファイル先頭に付く文字コード判別用の目印。UTF-8やUTF-16のファイルに付くことがあります。',
      },
    ],
  },
  en: {
    title: 'SRT to VTT Converter – Shift Subtitle Timing Online',
    description:
      'Convert subtitles between SRT and WebVTT, shift all timings by seconds, fix frame rate drift, and read Shift_JIS or UTF-8 files. Runs in your browser.',
    h1: 'SRT ⇔ VTT Subtitle Converter and Timing Shifter',
    introHtml:
      'Load or paste a subtitle file (.srt or .vtt) and convert it between SRT and WebVTT. You can also shift every timestamp earlier or later by a number of seconds, or fix drift caused by a different frame rate, such as 23.976 fps versus 25 fps. Shift_JIS files are detected automatically and saved back as UTF-8. Everything runs in your browser, so your subtitles are never uploaded. To convert the video itself, use the <a href="/en/tools/media-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Video &amp; Audio Converter</a>.',
    fileLabel: 'Choose a subtitle file',
    fileHint:
      'Pick an SRT or VTT file, or drag and drop it here. You can also paste text into the box below.',
    encodingLabel: 'Character encoding',
    encodingAuto: 'Auto-detect',
    encodingUtf8: 'UTF-8',
    encodingShiftJis: 'Shift_JIS',
    detectedTemplate: 'Read as {encoding}',
    invalidTemplate:
      '{count} character(s) could not be read. Try switching the character encoding.',
    inputLabel: 'Subtitle text',
    inputPlaceholder: '1\n00:00:01,000 --> 00:00:03,000\nHello',
    formatLabel: 'Output format',
    formatSrt: 'SRT (.srt)',
    formatVtt: 'WebVTT (.vtt)',
    offsetLabel: 'Shift timing (seconds)',
    offsetHint:
      'A positive value delays the subtitles, a negative value moves them earlier (for example 1.5 or -0.8). Blank means 0.',
    fpsFromLabel: 'Original frame rate',
    fpsToLabel: 'Target frame rate',
    fpsNone: 'No adjustment',
    fpsHint:
      'Pick both the fps the subtitles were made for and the fps of your video, and every timestamp is scaled to match.',
    outputLabel: 'Result',
    summaryTemplate: '{from} → {to}, {count} cue(s)',
    skippedTemplate: '{count} block(s) could not be parsed and were skipped.',
    droppedTemplate:
      '{count} cue(s) ended up before 0:00 after shifting and were removed.',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    downloadButton: 'Download',
    clearButton: 'Clear',
    errorOffsetInvalid: 'Enter the shift as a number (for example 1.5 or -0.8)',
    errorOffsetOutOfRange: 'The shift must be between -86400 and 86400 seconds',
    errorFpsPair:
      'Choose both the original and the target frame rate, or set both to "No adjustment"',
    errorNoCues:
      'No subtitles were found. Check that the text is in SRT or WebVTT format.',
    errorReadFailed: 'The file could not be read',
    notesHeading: 'Notes',
    notes: [
      'Auto-detection checks for a BOM and whether the bytes are valid UTF-8; otherwise the file is read as Shift_JIS. If the text looks garbled, switch "Character encoding" manually.',
      'The output is always UTF-8 without a BOM. Saving as Shift_JIS is not supported.',
      'SRT to VTT changes the millisecond separator from a comma to a period and adds the WEBVTT header. VTT to SRT drops positioning settings (line, align and so on) and NOTE, STYLE and REGION blocks, and renumbers the cues.',
      'If shifting pushes a cue before 0:00, it is removed when its end is also at or before 0:00; a cue that straddles 0:00 has its start clamped to 0:00.',
      'Inline tags (<i>, <b>, <v> and so on) and the text itself are kept as they are. Other formats such as ASS and SSA are not supported.',
      'All processing happens in your browser; your subtitles are never sent to a server.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Load an SRT or VTT file with "Choose a subtitle file" (drag and drop or pasting also works).',
      'If the text looks garbled, change "Character encoding".',
      'Pick an "Output format" and, if needed, set "Shift timing (seconds)" or the frame rates.',
      'Check the "Result", then save it with "Copy" or "Download".',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'SRT',
        description:
          'A simple subtitle format made of a number, a time range and the text. Milliseconds are separated by a comma.',
      },
      {
        term: 'WebVTT (VTT)',
        description:
          'The subtitle format for web video (the HTML video element). The file starts with WEBVTT and milliseconds are separated by a period.',
      },
      {
        term: 'Frame rate adjustment',
        description:
          'When a video runs at a different speed, such as 23.976 fps versus 25 fps, subtitles slowly drift out of sync. Multiplying every timestamp by a ratio brings them back in line.',
      },
      {
        term: 'BOM',
        description:
          'A marker at the start of a file that identifies its text encoding. UTF-8 and UTF-16 files sometimes have one.',
      },
    ],
  },
};
