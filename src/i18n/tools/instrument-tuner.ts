import type { Locale } from '../../data/tools';

export interface InstrumentTunerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  instrumentLabel: string;
  instruments: Record<
    | 'chromatic'
    | 'guitar'
    | 'guitar-drop-d'
    | 'guitar-half-down'
    | 'bass'
    | 'bass-5'
    | 'ukulele',
    string
  >;
  a4Label: string;
  startLabel: string;
  stopLabel: string;
  idleMessage: string;
  listening: string;
  meterLabel: string;
  stringsLabel: string;
  /** 弦ボタンの名前。`{note}` を音名で置換する */
  stringButtonLabel: string;
  autoHint: string;
  fixedHint: string;
  stateInTune: string;
  stateLow: string;
  stateHigh: string;
  detectedLabel: string;
  centsUnit: string;
  errors: {
    'permission-denied': string;
    'not-found': string;
    'in-use': string;
    constraints: string;
    insecure: string;
    unsupported: string;
    unknown: string;
  };
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const instrumentTunerContent: Record<
  Locale,
  InstrumentTunerPageContent
> = {
  ja: {
    title: '楽器チューナー（ギター・ベース・ウクレレ）',
    description:
      'マイクの音からピッチを検出してチューニングできる無料のオンラインチューナー。ギター・ベース・ウクレレのプリセットと半音階に対応し、音名・周波数・セントのずれをメーターで確認できます。音声はブラウザ内で処理され、サーバーには送信されません。',
    h1: '楽器チューナー（ギター・ベース・ウクレレ）',
    introHtml:
      'マイクで拾った音の高さ（ピッチ）を調べて、音名とずれ（セント）をメーターで表示するチューナーです。ギター・ベース・ウクレレの弦に合わせたプリセットのほか、すべての音を調べられる半音階モードもあります。テンポを合わせたいときは<a href="/tools/metronome-bpm/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">メトロノーム</a>も使えます。音声はこのページ内で解析するだけで、録音も外部への送信もしません。',
    instrumentLabel: '楽器・チューニング',
    instruments: {
      chromatic: '半音階（すべての音）',
      guitar: 'ギター（標準 E A D G B E）',
      'guitar-drop-d': 'ギター（ドロップD）',
      'guitar-half-down': 'ギター（半音下げ）',
      bass: 'ベース（4弦）',
      'bass-5': 'ベース（5弦）',
      ukulele: 'ウクレレ（G C E A）',
    },
    a4Label: '基準ピッチ（A4）',
    startLabel: 'マイクを開始',
    stopLabel: '停止',
    idleMessage:
      '「マイクを開始」を押して、チューニングしたい弦を1本ずつ弾いてください。',
    listening: '音を待っています…',
    meterLabel: 'チューニングのずれ',
    stringsLabel: '弦',
    stringButtonLabel: '{note}の弦を基準にする',
    autoHint: '弾いた音に最も近い弦を自動で選んでいます。',
    fixedHint: '選んだ弦を基準にしています。もう一度押すと自動に戻ります。',
    stateInTune: '合っています',
    stateLow: '低い（締める）',
    stateHigh: '高い（緩める）',
    detectedLabel: '検出した周波数',
    centsUnit: 'セント',
    errors: {
      'permission-denied':
        'マイクの使用が許可されていません。アドレスバーの鍵（サイト設定）アイコンから許可してから、もう一度お試しください。',
      'not-found': 'マイクが見つかりません。接続を確認してください。',
      'in-use':
        'マイクを開始できません。ほかのアプリがマイクを使用していないか確認してください。',
      constraints: 'このマイクでは開始できませんでした。',
      insecure: 'この環境ではマイクを利用できません（HTTPS接続が必要です）。',
      unsupported: 'お使いのブラウザはマイクの取得に対応していません。',
      unknown: 'マイクを開始できませんでした。',
    },
    howToHeading: '使い方',
    howToSteps: [
      '「楽器・チューニング」を選びます。どの音か分からないときは「半音階」を選びます。',
      '「マイクを開始」を押し、ブラウザのマイク許可を承認します。',
      'チューニングしたい弦を1本だけ、開放弦で弾きます。音名とメーターが表示されます。',
      'メーターが中央（±5セント以内）になるようにペグを回します。「低い」なら締め、「高い」なら緩めます。',
    ],
    notesHeading: '注意事項',
    notes: [
      'マイクの許可が必要です。許可しても録音は行わず、音声はこのページ内でピッチの解析にだけ使われます。',
      '周囲の音や、ほかの弦の響きが入ると検出が乱れます。静かな場所で、1本ずつ弾いてください。',
      'ピッチはブラウザの音声処理から求めるため、専用のクリップ式チューナーに比べると精度が落ちる場合があります。低音（ベースの低い弦など）は特に揺れやすくなります。',
      '内蔵マイクや安価なマイクでは、小さな音や低い音を拾いにくいことがあります。アンプやスピーカーから音を出す場合は、ハウリングに注意してください。',
      'エレキギターやベースを使う場合は、アンプやスピーカーの音をマイクで拾ってください。オーディオインターフェースにつなげる場合は、そちらを入力デバイスに選んでください。',
      '基準ピッチ（A4）は、一般的には440Hzです。合奏の相手がいる場合は、相手の基準に合わせてください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ピッチ（音高）',
        description:
          '音の高さのことで、1秒間の振動の回数（周波数, Hz）で表します。A4（ラの音）は一般に440Hzで、1オクターブ上がると周波数は2倍になります。',
      },
      {
        term: 'セント',
        description:
          '音の高さのずれを表す単位で、半音を100セントとします。±5セント以内なら、ほとんどの人は音がずれていると感じません。',
      },
      {
        term: '基準ピッチ（A4）',
        description:
          'チューニングの基準とするA4の周波数です。一般的な440Hzのほか、オーケストラなどでは442Hzが使われることもあります。',
      },
      {
        term: '開放弦',
        description:
          '指で押さえずに弾く弦のことです。チューニングは開放弦の音を基準に合わせます。',
      },
      {
        term: 'ドロップD',
        description:
          'ギターの一番低い6弦を全音（2フレット分）下げてDに合わせるチューニングです。ほかの弦は標準と同じです。',
      },
    ],
  },
  en: {
    title: 'Online Instrument Tuner (Guitar, Bass, Ukulele)',
    description:
      'Free online tuner using your microphone. Presets for guitar, bass and ukulele plus a chromatic mode, with note and cents meter. Runs in your browser.',
    h1: 'Online Instrument Tuner (Guitar, Bass & Ukulele)',
    introHtml:
      'A tuner that listens to your microphone, finds the pitch and shows the note and how many cents sharp or flat it is on a meter. Choose a preset for guitar, bass or ukulele strings, or use chromatic mode to check any note. To keep time while you practise, try the <a href="/en/tools/metronome-bpm/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Metronome</a>. Audio is analysed on this page only; nothing is recorded or sent anywhere.',
    instrumentLabel: 'Instrument / tuning',
    instruments: {
      chromatic: 'Chromatic (any note)',
      guitar: 'Guitar (standard E A D G B E)',
      'guitar-drop-d': 'Guitar (drop D)',
      'guitar-half-down': 'Guitar (half step down)',
      bass: 'Bass (4-string)',
      'bass-5': 'Bass (5-string)',
      ukulele: 'Ukulele (G C E A)',
    },
    a4Label: 'Reference pitch (A4)',
    startLabel: 'Start microphone',
    stopLabel: 'Stop',
    idleMessage:
      'Press "Start microphone", then play the string you want to tune, one at a time.',
    listening: 'Listening for a note…',
    meterLabel: 'Tuning offset',
    stringsLabel: 'Strings',
    stringButtonLabel: 'Use the {note} string as the target',
    autoHint:
      'The string closest to the note you play is picked automatically.',
    fixedHint:
      'The string you chose is the target. Press it again to go back to automatic.',
    stateInTune: 'In tune',
    stateLow: 'Flat (tighten)',
    stateHigh: 'Sharp (loosen)',
    detectedLabel: 'Detected frequency',
    centsUnit: 'cents',
    errors: {
      'permission-denied':
        'Microphone access was blocked. Allow it from the site settings icon in the address bar, then try again.',
      'not-found': 'No microphone was found. Check that it is connected.',
      'in-use':
        'Could not start the microphone. Check that no other app is using it.',
      constraints: 'This microphone could not be started.',
      insecure:
        'The microphone is unavailable here (an HTTPS connection is required).',
      unsupported: 'Your browser does not support microphone access.',
      unknown: 'Could not start the microphone.',
    },
    howToHeading: 'How to use',
    howToSteps: [
      'Choose the "Instrument / tuning". If you are not sure which note you are on, choose "Chromatic".',
      'Press "Start microphone" and allow microphone access in your browser.',
      'Pluck one open string at a time. The note name and the meter appear.',
      'Turn the tuning peg until the meter sits in the centre (within ±5 cents). Tighten if it says "Flat", loosen if it says "Sharp".',
    ],
    notesHeading: 'Notes',
    notes: [
      'Microphone permission is required. Nothing is recorded; the sound is only used to work out the pitch on this page.',
      'Background noise and the ringing of other strings can throw off detection. Use a quiet place and play one string at a time.',
      'The pitch is worked out from browser audio, so it can be less accurate than a dedicated clip-on tuner. Low notes, such as the low strings of a bass, are the least steady.',
      'Built-in or cheap microphones can miss quiet or low notes. If you play through an amp or speaker, watch out for feedback.',
      'With an electric guitar or bass, point the microphone at the amp or speaker. If you use an audio interface, pick it as the input device.',
      'The reference pitch (A4) is normally 440 Hz. If you play with others, match their reference.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Pitch',
        description:
          'How high or low a sound is, measured as its frequency in Hz (vibrations per second). The A above middle C (A4) is normally 440 Hz, and each octave up doubles the frequency.',
      },
      {
        term: 'Cent',
        description:
          'A unit for small differences in pitch: a semitone is 100 cents. Most people cannot hear an error within ±5 cents.',
      },
      {
        term: 'Reference pitch (A4)',
        description:
          'The frequency assigned to A4, which everything else is tuned from. It is usually 440 Hz, though some orchestras use 442 Hz.',
      },
      {
        term: 'Open string',
        description:
          'A string played without pressing it against a fret. Tuning is done by matching the open strings.',
      },
      {
        term: 'Drop D',
        description:
          'A guitar tuning where the lowest (6th) string is lowered a whole step to D, with the other strings unchanged from standard.',
      },
    ],
  },
};
