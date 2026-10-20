import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface AudioSpeedChangerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{duration}` `{size}` `{rate}` `{channels}` を置換して使うテンプレート */
  sourceInfoTemplate: string;
  modeLabel: string;
  modeIndependent: string;
  modeLinked: string;
  speedLabel: string;
  speedHint: string;
  semitonesLabel: string;
  semitonesHint: string;
  processButton: string;
  clearButton: string;
  processing: string;
  resultsHeading: string;
  /** `{duration}` `{size}` を置換して使うテンプレート */
  resultInfoTemplate: string;
  downloadButton: string;
  errorUnsupportedFile: string;
  errorDecode: string;
  errorTooLong: string;
  /** `{max}` を置換して使うテンプレート */
  errorFileTooLargeTemplate: string;
  errorSpeedInvalid: string;
  errorSpeedOutOfRange: string;
  errorSemitonesInvalid: string;
  errorSemitonesOutOfRange: string;
  errorFailed: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const audioSpeedChangerContent: Record<
  Locale,
  AudioSpeedChangerPageContent
> = {
  ja: {
    title:
      '音声の速度・ピッチ変更｜再生速度とキーを変えてWAV保存（ブラウザ完結）',
    description:
      '音声ファイルの再生速度を0.25〜4倍に、ピッチ（キー）を半音単位で変更し、試聴してWAVで保存できる無料ツールです。ピッチを保ったまま速度だけ変えることも可能。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '音声の速度・ピッチ（キー）変更',
    introHtml:
      '音声ファイルを選び、速度とピッチ（キー）を指定して変換できます。ピッチを保ったまま速くする・遅くする、速度はそのままキーだけ上げ下げする、といった使い方ができ、変換結果はその場で試聴してWAVで保存できます。処理はすべてブラウザ内で行われ、ファイルは外部に送信されません。MP3などへの形式変換や切り出しは<a href="/tools/media-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">動画・音声変換</a>をご利用ください。',
    dropLabel: '音声ファイルを選択',
    dropHint: 'ここにファイルをドラッグ＆ドロップすることもできます',
    sourceInfoTemplate:
      '元ファイル: 長さ {duration}・{rate} Hz・{channels}ch（{size}）',
    modeLabel: 'ピッチの扱い',
    modeIndependent: 'ピッチを保って速度だけ変える',
    modeLinked: '速度に合わせてピッチも変える（テープ風）',
    speedLabel: '速度（倍率）',
    speedHint: '0.25〜4。1で等倍、2で2倍速、0.5で半分の速さです。',
    semitonesLabel: 'ピッチ（半音）',
    semitonesHint:
      '-12〜12。+12で1オクターブ上、-12で1オクターブ下です。「ピッチを保って速度だけ変える」のときだけ使えます。',
    processButton: '変換する',
    clearButton: 'クリア',
    processing: '変換中です。長い音声は少し時間がかかります…',
    resultsHeading: '変換結果',
    resultInfoTemplate: '出力: 長さ {duration}・WAV {size}',
    downloadButton: 'ダウンロード',
    errorUnsupportedFile: '音声ファイルを選択してください',
    errorDecode:
      'ファイルを読み込めませんでした。破損しているか、お使いのブラウザが対応していない形式の可能性があります。',
    errorTooLong:
      '音声が長すぎます（上限は10分です）。先に短く切り出してからお試しください。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    errorSpeedInvalid: '速度は数値で入力してください（例: 1.5）',
    errorSpeedOutOfRange: '速度は0.25〜4の範囲で指定してください',
    errorSemitonesInvalid: 'ピッチは数値で入力してください（例: -2）',
    errorSemitonesOutOfRange: 'ピッチは-12〜12の範囲で指定してください',
    errorFailed: '変換に失敗しました。メモリが足りない可能性があります。',
    notesHeading: '注意点',
    notes: [
      '「ピッチを保って速度だけ変える」は、波形を細かく切って重ね直す簡易的な方式（WSOLA）です。±20%程度の変化は自然に聞こえますが、極端な速度では声や楽器の音が少し濁ったり、音が揺れたりします。',
      'ピッチ（キー）の変更は、時間の伸縮とリサンプルを組み合わせて行います。±12半音（1オクターブ）が上限で、大きく変えるほど音質は劣化します。',
      '「速度に合わせてピッチも変える（テープ風）」は、カセットテープやレコードの回転数を変えたときと同じ変化です。速くすると高く、遅くすると低くなります。',
      '出力はWAV（16bit PCM）で、元の形式より容量が大きくなります。MP3などに圧縮したい場合は、保存したWAVを動画・音声変換ツールで変換してください。',
      '読み込めるのは、お使いのブラウザがデコードできる形式です（MP3・WAV・M4A・OGGなど）。長さの上限は10分、ファイルサイズの上限は200MBです。',
      'すべての処理はブラウザ内で完結し、選択したファイルがサーバーに送信されることはありません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '音声ファイルを選択します（ドラッグ＆ドロップも可能です）。',
      '「ピッチの扱い」を選び、「速度（倍率）」と「ピッチ（半音）」を入力します。',
      '「変換する」を押すと、下にプレーヤーが表示されるので再生して確認します。',
      '問題なければ「ダウンロード」でWAVを保存します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ピッチ（キー）',
        description:
          '音の高さ。曲のキーを上げ下げするときは、ピッチを半音単位で動かします。',
      },
      {
        term: '半音',
        description:
          'ピアノの隣り合う鍵盤（白鍵と黒鍵）の音程差。12半音で1オクターブ、周波数は2倍になります。',
      },
      {
        term: 'タイムストレッチ',
        description:
          'ピッチを変えずに音の長さ（再生速度）だけを変える処理。本ツールでは波形の類似した位置で重ね合わせるWSOLA方式を使っています。',
      },
      {
        term: 'WAV',
        description:
          '音声を圧縮せずに記録するファイル形式。音質は劣化しませんが、容量は大きくなります。',
      },
    ],
  },
  en: {
    title: 'Audio Speed & Pitch Changer – Change Tempo and Key Online',
    description:
      'Change audio speed from 0.25x to 4x and shift pitch by semitones, with or without keeping pitch. Preview and save as WAV. Runs in your browser, no upload.',
    h1: 'Audio Speed and Pitch (Key) Changer',
    introHtml:
      'Pick an audio file, then set the speed and pitch (key). Speed it up or slow it down without changing the pitch, shift the key without changing the tempo, or change both together like a tape deck. You can listen to the result right away and save it as a WAV file. Everything runs in your browser, so your file is never uploaded. To convert to MP3 or trim a clip, use the <a href="/en/tools/media-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Video &amp; Audio Converter</a>.',
    dropLabel: 'Choose an audio file',
    dropHint: 'You can also drag and drop a file here',
    sourceInfoTemplate:
      'Original: {duration}, {rate} Hz, {channels} ch ({size})',
    modeLabel: 'Pitch handling',
    modeIndependent: 'Keep the pitch, change only the speed',
    modeLinked: 'Change pitch along with speed (tape style)',
    speedLabel: 'Speed (multiplier)',
    speedHint: '0.25 to 4. 1 is normal, 2 is twice as fast, 0.5 is half speed.',
    semitonesLabel: 'Pitch (semitones)',
    semitonesHint:
      '-12 to 12. +12 is one octave up, -12 one octave down. Only used with "Keep the pitch, change only the speed".',
    processButton: 'Convert',
    clearButton: 'Clear',
    processing: 'Converting. Long recordings may take a moment…',
    resultsHeading: 'Result',
    resultInfoTemplate: 'Output: {duration}, WAV {size}',
    downloadButton: 'Download',
    errorUnsupportedFile: 'Please choose an audio file',
    errorDecode:
      'The file could not be read. It may be corrupted or in a format your browser cannot decode.',
    errorTooLong:
      'This audio is too long (the limit is 10 minutes). Trim it to a shorter clip first.',
    errorFileTooLargeTemplate: 'The file exceeds the size limit ({max})',
    errorSpeedInvalid: 'Enter the speed as a number (for example 1.5)',
    errorSpeedOutOfRange: 'Speed must be between 0.25 and 4',
    errorSemitonesInvalid: 'Enter the pitch as a number (for example -2)',
    errorSemitonesOutOfRange: 'Pitch must be between -12 and 12',
    errorFailed: 'Conversion failed. Your device may have run out of memory.',
    notesHeading: 'Notes',
    notes: [
      '"Keep the pitch, change only the speed" uses a simple method (WSOLA) that cuts the waveform into small pieces and overlaps them again. Changes within about ±20% sound natural, but at extreme speeds voices and instruments can sound a little smeared or wobbly.',
      'Pitch (key) changes combine time stretching with resampling. The range is limited to ±12 semitones (one octave), and larger shifts lower the sound quality.',
      '"Change pitch along with speed (tape style)" behaves like changing the speed of a cassette tape or record: faster means higher, slower means lower.',
      'The output is 16-bit PCM WAV, so it is larger than the original. To compress it to MP3 or similar, run the saved WAV through the converter tool.',
      'Any format your browser can decode works (MP3, WAV, M4A, OGG and so on). The limits are 10 minutes of audio and a 200 MB file.',
      'All processing happens in your browser; the file you choose is never sent to a server.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose an audio file (drag and drop also works).',
      'Pick "Pitch handling", then enter "Speed (multiplier)" and "Pitch (semitones)".',
      'Press "Convert". A player appears below so you can listen to the result.',
      'If it sounds right, save the WAV with "Download".',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Pitch (key)',
        description:
          'How high or low a sound is. To transpose a song up or down, you shift the pitch in semitone steps.',
      },
      {
        term: 'Semitone',
        description:
          'The interval between two neighboring piano keys (white and black). 12 semitones make one octave, which doubles the frequency.',
      },
      {
        term: 'Time stretching',
        description:
          'Changing how long a sound lasts without changing its pitch. This tool uses WSOLA, which overlaps pieces of the waveform at points where they match.',
      },
      {
        term: 'WAV',
        description:
          'A file format that stores audio uncompressed. There is no quality loss, but the files are large.',
      },
    ],
  },
};
