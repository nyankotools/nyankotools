import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface TextToSpeechPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  textLabel: string;
  textPlaceholder: string;
  sampleText: string;
  voiceLabel: string;
  voiceLocalOnly: string;
  voiceLoading: string;
  rateLabel: string;
  pitchLabel: string;
  volumeLabel: string;
  speak: string;
  pause: string;
  resume: string;
  stop: string;
  speaking: string;
  finished: string;
  unsupported: string;
  noLocalVoice: string;
  emptyText: string;
  speakError: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const textToSpeechContent: Record<Locale, TextToSpeechPageContent> = {
  ja: {
    title: 'テキスト読み上げ（ブラウザ内蔵の音声で朗読）',
    description:
      '入力したテキストを、端末に内蔵された音声で読み上げる無料ツールです。声・速度・高さ・音量を指定でき、クラウド音声は使いません。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'テキスト読み上げ（ブラウザ内蔵の音声）',
    introHtml:
      'テキストを入力して「読み上げ」を押すと、お使いの端末・ブラウザに内蔵された音声で朗読します。声の種類、速度、高さ、音量を調整できます。インターネット上の音声サービス（クラウド音声）は使わず、端末内の音声だけを一覧に表示するため、入力したテキストがサーバーに送信されることはありません。',
    textLabel: '読み上げるテキスト',
    textPlaceholder: 'ここに読み上げたい文章を入力',
    sampleText:
      'こんにちは。これはテキスト読み上げのサンプルです。声の種類や速度を変えて試してみてください。',
    voiceLabel: '声（端末内の音声）',
    voiceLocalOnly: '端末内蔵の音声のみ表示しています',
    voiceLoading: '音声を読み込み中…',
    rateLabel: '速度',
    pitchLabel: '高さ',
    volumeLabel: '音量',
    speak: '読み上げ',
    pause: '一時停止',
    resume: '再開',
    stop: '停止',
    speaking: '読み上げ中…',
    finished: '読み上げが終わりました',
    unsupported:
      'お使いのブラウザは音声合成（Web Speech API）に対応していないため、このツールは使えません。',
    noLocalVoice:
      '端末内で使える音声が見つかりませんでした。このツールはクラウド音声を使わないため、読み上げできません。OSの設定で音声（日本語など）を追加するか、別のブラウザをお試しください。',
    emptyText: 'テキストを入力してください',
    speakError: '読み上げ中にエラーが発生しました',
    notesHeading: '注意事項',
    notes: [
      '使える声は端末・OS・ブラウザによって異なります。Windows・macOS・iOSでは標準で日本語の声が入っていることが多い一方、環境によっては日本語の声が無い場合があります。',
      'ChromeのGoogle音声やEdgeのOnline（Natural）音声などのクラウド音声は、テキストが外部サーバーに送られる可能性があるため、一覧に表示せず使用しません。',
      '読み上げた音声をファイルとして保存することはできません（ブラウザの音声合成は出力を取り出せないため）。',
      '「高さ」は声によっては効かないことがあります。速度・高さ・音量の効き方も声ごとに異なります。',
      '長い文章は文の区切りごとに順番に読み上げます。ページを閉じる・再読み込みすると読み上げは止まります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Web Speech API（音声合成）',
        description:
          'ブラウザに用意された、テキストを音声で読み上げる標準機能です。実際に声を作るのはOSやブラウザ側の音声エンジンで、このツールはそれを呼び出しているだけです。',
      },
      {
        term: 'ローカル音声／クラウド音声',
        description:
          'ローカル音声は端末内の音声エンジンで読み上げるため、テキストが外部に出ません。クラウド音声はインターネット上のサーバーで音声を作るため、テキストが送信されます。このツールはローカル音声のみを使います。',
      },
    ],
  },
  en: {
    title: 'Text to Speech (Read Aloud with Built-in Browser Voices)',
    description:
      'Free text-to-speech that reads your text aloud with voices built into your device. Adjust speed, pitch and volume. No cloud voices, nothing sent to a server.',
    h1: 'Text to Speech (Built-in Browser Voices)',
    introHtml:
      'Type or paste some text and press Read aloud to hear it spoken by a voice built into your device and browser. You can adjust the voice, speed, pitch and volume. Online (cloud) voices are never used and are not listed, so your text is not sent to any server.',
    textLabel: 'Text to read',
    textPlaceholder: 'Type or paste the text you want read aloud',
    sampleText:
      'Hello! This is a sample of text to speech. Try changing the voice and the speed.',
    voiceLabel: 'Voice (on-device)',
    voiceLocalOnly: 'Only voices built into your device are listed',
    voiceLoading: 'Loading voices…',
    rateLabel: 'Speed',
    pitchLabel: 'Pitch',
    volumeLabel: 'Volume',
    speak: 'Read aloud',
    pause: 'Pause',
    resume: 'Resume',
    stop: 'Stop',
    speaking: 'Reading aloud…',
    finished: 'Finished reading',
    unsupported:
      'Your browser does not support speech synthesis (the Web Speech API), so this tool cannot be used.',
    noLocalVoice:
      'No on-device voice was found. This tool never uses cloud voices, so it cannot read aloud. Install a voice in your OS settings or try another browser.',
    emptyText: 'Enter some text',
    speakError: 'An error occurred while reading aloud',
    notesHeading: 'Notes',
    notes: [
      'Available voices depend on your device, OS and browser. Some environments have no voice for a given language.',
      'Cloud voices such as Chrome’s Google voices or Edge’s Online (Natural) voices may send your text to an external server, so they are hidden and never used.',
      'The spoken audio cannot be saved as a file, because browser speech synthesis does not expose its output.',
      'Pitch has no effect on some voices, and how speed, pitch and volume sound varies by voice.',
      'Long text is read sentence by sentence. Closing or reloading the page stops the reading.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Web Speech API (speech synthesis)',
        description:
          'A standard browser feature that speaks text aloud. The voice itself is produced by the speech engine in your OS or browser; this tool only calls it.',
      },
      {
        term: 'Local voice / cloud voice',
        description:
          'A local voice is produced by an engine on your device, so the text never leaves it. A cloud voice is generated on an internet server, so the text is sent there. This tool uses local voices only.',
      },
    ],
  },
};
