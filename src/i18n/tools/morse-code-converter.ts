import type { Locale } from '../../data/tools';

export interface MorseCodeConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  directionLabel: string;
  modeEncode: string;
  modeDecode: string;
  swapLabel: string;
  codeLabel: string;
  codeInternational: string;
  codeWabun: string;
  symbolLabel: string;
  symbolAscii: string;
  symbolFullwidth: string;
  separatorLabel: string;
  separatorSlash: string;
  separatorSpace: string;
  inputLabelEncode: string;
  inputLabelDecode: string;
  placeholderEncodeInternational: string;
  placeholderEncodeWabun: string;
  placeholderDecode: string;
  outputLabelEncode: string;
  outputLabelDecode: string;
  sampleText: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** `{chars}` を置換する */
  unsupportedMessage: string;
  /** `{codes}` を置換する */
  unknownMessage: string;
  playHeading: string;
  playHint: string;
  wpmLabel: string;
  frequencyLabel: string;
  volumeLabel: string;
  useSoundLabel: string;
  useLightLabel: string;
  lightWarning: string;
  /** `{wpm}` を置換する */
  lightLimited: string;
  reducedMotion: string;
  lampLabel: string;
  playLabel: string;
  stopLabel: string;
  playingStatus: string;
  finishedStatus: string;
  nothingToPlay: string;
  nothingSelected: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const morseCodeConverterContent: Record<
  Locale,
  MorseCodeConverterPageContent
> = {
  ja: {
    title: 'モールス信号変換（和文・欧文）と音・光での再生',
    description:
      '英数字と、カタカナ・濁点・長音を含む和文を、モールス信号に双方向で変換します。速度（WPM）と周波数を決めて、音や光で再生もできます。入力はブラウザ内で処理され、サーバーには送信されません。',
    h1: 'モールス信号変換（和文・欧文対応）',
    introHtml:
      '文字をモールス信号に、モールス信号を文字に変換します。欧文（英字・数字）と和文（カタカナ・濁点・半濁点・長音・句読点）に対応し、結果は音や画面の光で再生できます。かなとローマ字の相互変換は<a href="/tools/romaji-kana-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ローマ字⇔ひらがな変換</a>をご利用ください。入力した内容は、このページの外へは送信されません。',
    directionLabel: '変換の向き',
    modeEncode: '文字 → モールス',
    modeDecode: 'モールス → 文字',
    swapLabel: '入力と出力を入れ替え',
    codeLabel: '符号の種類',
    codeInternational: '欧文（英字・数字）',
    codeWabun: '和文（カタカナ）',
    symbolLabel: '符号の表記',
    symbolAscii: '. と -',
    symbolFullwidth: '・ と －',
    separatorLabel: '単語の区切り',
    separatorSlash: 'スラッシュ（ / ）',
    separatorSpace: '空白3つ',
    inputLabelEncode: '文字（入力）',
    inputLabelDecode: 'モールス信号（入力）',
    placeholderEncodeInternational: '例: HELLO WORLD',
    placeholderEncodeWabun: '例: ニホンゴ（ひらがな・カタカナ）',
    placeholderDecode: '例: .... . .-.. .-.. --- / .-- --- .-. .-.. -..',
    outputLabelEncode: 'モールス信号（出力）',
    outputLabelDecode: '文字（出力）',
    sampleText: 'HELLO WORLD',
    copy: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーできませんでした',
    unsupportedMessage:
      '変換できない文字があります（結果では □ になります）: {chars}',
    unknownMessage:
      '解読できない符号があります（結果では □ になります）: {codes}',
    playHeading: '音・光で再生',
    playHint:
      '変換結果（「モールス → 文字」のときは入力したモールス信号）を、実際の速さで再生します。',
    wpmLabel: '速度（WPM）',
    frequencyLabel: '音の高さ（Hz）',
    volumeLabel: '音量',
    useSoundLabel: '音で再生',
    useLightLabel: '光で再生（画面の点滅）',
    lightWarning:
      '光の再生は画面が点滅します。光の刺激で体調が悪くなることがある方は使用しないでください。点滅が毎秒3回を超えないよう、速度を抑えて再生します。',
    lightLimited: '光で再生するため、速度は最大{wpm} WPMに抑えて再生します。',
    reducedMotion:
      'お使いの環境では「視覚効果を減らす」設定が有効なため、光での再生は使えません。',
    lampLabel: '光の再生表示',
    playLabel: '再生',
    stopLabel: '停止',
    playingStatus: '再生中…',
    finishedStatus: '再生が終わりました',
    nothingToPlay: '再生できるモールス信号がありません',
    nothingSelected: '「音で再生」か「光で再生」を選んでください',
    howToHeading: '使い方',
    howToSteps: [
      '「変換の向き」と「符号の種類」（欧文・和文）を選びます。',
      '入力欄に文字（またはモールス信号）を入れると、結果がすぐに表示されます。',
      '結果は「結果をコピー」で取り出せます。「符号の表記」で「. と -」と「・ と －」を、「単語の区切り」で区切りを切り替えられます。',
      '「音・光で再生」で速度と音の高さを決め、「再生」を押すと符号を鳴らして確認できます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '和文モールスはカタカナで送ります。ひらがな・半角カナも変換しますが、小書き文字（ッ・ャなど）は大きい文字と同じ符号になり、漢字・英字は変換できません。',
      '濁点（゛）・半濁点（゜）は、直前の文字とは別の符号（..、..--.）です。ガはカと゛の2文字分で送ります。',
      '解読では、文字の間を半角スペース、単語の間を「/」または空白2つ以上で区切ってください。全角の・と－の表記も受け付けます。',
      '音の再生は、ボタンを押したときに始まります（ブラウザは、ユーザー操作なしの音声再生を許可しません）。他のタブへ移るかページを離れると止まります。',
      '光の再生は、点滅が毎秒3回を超えないよう最大7 WPMに制限しています。画面の設定で「視覚効果を減らす」が有効な場合は使えません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'モールス符号',
        description:
          '短点（・）と長点（－）の組み合わせで文字を表す符号です。長点は短点の3倍の長さで、符号の間は短点1つ分、文字の間は3つ分、単語の間は7つ分あけて送ります。',
      },
      {
        term: '和文モールス',
        description:
          '日本語のカタカナを送るための符号で、「イ」が「・－」、「ロ」が「・－・－」のように、いろは順に近い形で割り当てられています。濁点・半濁点・長音・句読点には専用の符号があります。',
      },
      {
        term: 'WPM',
        description:
          'Words Per Minute の略で、1分間に何語送るかを表す速さの単位です。「PARIS」という語を基準にしていて、短点1つの長さは 1.2 ÷ WPM 秒になります。',
      },
      {
        term: 'SOS',
        description:
          '「・・・ －－－ ・・・」の符号で、国際的に知られる遭難信号です。「SOS」と入力すると、この符号に変換されます。',
      },
    ],
  },
  en: {
    title: 'Morse Code Translator with Sound & Light Playback',
    description:
      'Translate text to Morse code and back, including Japanese Wabun kana. Play it as sound or light at a chosen speed (WPM). Runs in your browser.',
    h1: 'Morse Code Translator (English & Japanese Wabun)',
    introHtml:
      'Convert text to Morse code and decode Morse back into text. It supports international Morse (letters, digits, punctuation) and Japanese Wabun Morse (katakana with dakuten, the long-vowel mark and Japanese punctuation), and plays the result as a beep or a flashing light. To convert between Japanese kana and romaji first, use the <a href="/en/tools/romaji-kana-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Romaji ⇔ Kana Converter</a>. Nothing you type leaves this page.',
    directionLabel: 'Direction',
    modeEncode: 'Text → Morse',
    modeDecode: 'Morse → Text',
    swapLabel: 'Swap input and output',
    codeLabel: 'Code type',
    codeInternational: 'International (letters, digits)',
    codeWabun: 'Japanese Wabun (katakana)',
    symbolLabel: 'Symbols',
    symbolAscii: '. and -',
    symbolFullwidth: '・ and －',
    separatorLabel: 'Word separator',
    separatorSlash: 'Slash ( / )',
    separatorSpace: 'Three spaces',
    inputLabelEncode: 'Text (input)',
    inputLabelDecode: 'Morse code (input)',
    placeholderEncodeInternational: 'e.g. HELLO WORLD',
    placeholderEncodeWabun: 'e.g. ニホンゴ (hiragana or katakana)',
    placeholderDecode: 'e.g. .... . .-.. .-.. --- / .-- --- .-. .-.. -..',
    outputLabelEncode: 'Morse code (output)',
    outputLabelDecode: 'Text (output)',
    sampleText: 'HELLO WORLD',
    copy: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Could not copy',
    unsupportedMessage:
      'Some characters cannot be converted and appear as □ in the result: {chars}',
    unknownMessage:
      'Some codes could not be decoded and appear as □ in the result: {codes}',
    playHeading: 'Play as sound or light',
    playHint:
      'Plays the converted result (or the Morse code you typed, when decoding) at real speed.',
    wpmLabel: 'Speed (WPM)',
    frequencyLabel: 'Tone (Hz)',
    volumeLabel: 'Volume',
    useSoundLabel: 'Play sound',
    useLightLabel: 'Play light (screen flash)',
    lightWarning:
      'Light playback flashes the screen. Do not use it if flashing light can affect your health. It plays slowly enough to stay at or below 3 flashes per second.',
    lightLimited: 'Light playback is limited to {wpm} WPM.',
    reducedMotion:
      'Light playback is unavailable because your system is set to reduce motion.',
    lampLabel: 'Light playback indicator',
    playLabel: 'Play',
    stopLabel: 'Stop',
    playingStatus: 'Playing…',
    finishedStatus: 'Playback finished',
    nothingToPlay: 'There is no Morse code to play',
    nothingSelected: 'Turn on "Play sound" or "Play light"',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose the "Direction" and the "Code type" (international or Wabun).',
      'Type text (or Morse code) in the input box and the result appears immediately.',
      'Use "Copy result" to take it away. You can also switch to ・ and － symbols or to space-separated words.',
      'In "Play as sound or light", set the speed and tone, then press "Play" to hear or see the code.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Wabun Morse is sent in katakana. Hiragana and half-width kana are converted too, small kana (ッ, ャ and so on) use the same code as the full-size kana, and kanji and Latin letters cannot be converted.',
      'Dakuten (゛) and handakuten (゜) have their own codes (.. and ..--.), sent after the base kana. For example ガ is sent as カ followed by ゛.',
      'To decode, separate letters with a single space and words with "/" or two or more spaces. The ・ and － symbols are accepted as well.',
      'Sound starts when you press a button, because browsers do not allow sound without a user action. It stops if you switch tabs or leave the page.',
      'Light playback is limited to 7 WPM so it never flashes more than 3 times per second, and it is unavailable when your system is set to reduce motion.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Morse code',
        description:
          'A code that writes letters as dots and dashes. A dash lasts three dots; the gap is one dot inside a letter, three between letters and seven between words.',
      },
      {
        term: 'Wabun Morse',
        description:
          'The Morse code for Japanese kana. For example イ is ・－ and ロ is ・－・－. Dakuten, handakuten, the long-vowel mark and Japanese punctuation have their own codes.',
      },
      {
        term: 'WPM',
        description:
          'Words per minute, the unit of sending speed, based on the word "PARIS". One dot lasts 1.2 ÷ WPM seconds.',
      },
      {
        term: 'SOS',
        description:
          'The well-known international distress signal, ・・・ －－－ ・・・. Typing "SOS" converts to this pattern.',
      },
    ],
  },
};
