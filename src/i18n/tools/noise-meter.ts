import type { Locale } from '../../data/tools';

export interface NoiseMeterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  startLabel: string;
  stopLabel: string;
  idleMessage: string;
  currentLabel: string;
  maxLabel: string;
  avgLabel: string;
  unit: string;
  meterAriaLabel: string;
  resetLabel: string;
  graphHeading: string;
  graphAriaLabel: string;
  graphHint: string;
  offsetHeading: string;
  offsetLabel: string;
  offsetHint: string;
  referenceLabel: string;
  applyReferenceLabel: string;
  referenceHint: string;
  tableHeading: string;
  tableRangeHeader: string;
  tableLevelHeader: string;
  tableExampleHeader: string;
  currentBandPrefix: string;
  bands: Record<
    | 'very-quiet'
    | 'quiet'
    | 'calm'
    | 'normal'
    | 'loud'
    | 'very-loud'
    | 'extreme',
    { range: string; level: string; example: string }
  >;
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

export const noiseMeterContent: Record<Locale, NoiseMeterPageContent> = {
  ja: {
    title: '騒音計（マイクで音量dBを測る・目安）',
    description:
      'スマホやPCのマイクで周囲の騒音レベル（dB）をおおまかに測れる無料の簡易騒音計です。現在値・最大・平均とグラフ、騒音の目安表つき。音声はブラウザ内で処理され、録音も送信もされません。',
    h1: '騒音計（マイクで音量dBを測る）',
    introHtml:
      '周囲の音の大きさを、マイクの入力からdBの目安として表示します。部屋の静かさの確認や、音の大きさの比較に使えます。計測値は校正した騒音計とは異なる「目安」です（下の「校正オフセット」で調整できます）。音声は保存も送信もされません。マイク自体の動作確認は<a href="/tools/mic-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">マイクテスト</a>をご利用ください。',
    startLabel: '計測を開始',
    stopLabel: '計測を停止',
    idleMessage:
      '「計測を開始」を押し、ブラウザの許可画面でマイクを許可してください。',
    currentLabel: '現在',
    maxLabel: '最大',
    avgLabel: '平均',
    unit: 'dB（目安）',
    meterAriaLabel: '現在の騒音レベル',
    resetLabel: '最大・平均をリセット',
    graphHeading: '直近30秒の推移',
    graphAriaLabel: '騒音レベルの推移グラフ',
    graphHint: '縦軸は 0〜130 dB（目安）です。',
    offsetHeading: '校正オフセット',
    offsetLabel: 'オフセット（dB）',
    offsetHint:
      'マイクの入力レベル（dBFS）にこの値を足して表示します。機種ごとに感度が違うため、正確な騒音計や騒音計アプリと見比べて合わせてください。',
    referenceLabel: '基準の騒音計の値（dB）',
    applyReferenceLabel: '現在の音に合わせる',
    referenceHint:
      '別の騒音計が示す値を入力し、同じ音を測りながら押すと、オフセットが自動で決まります。',
    tableHeading: '騒音レベルの目安',
    tableRangeHeader: '目安dB',
    tableLevelHeader: '感じ方',
    tableExampleHeader: '例',
    currentBandPrefix: '現在の区分',
    bands: {
      'very-quiet': {
        range: '〜30',
        level: 'ほとんど無音',
        example: '木の葉の触れ合う音、深夜の静かな部屋',
      },
      quiet: {
        range: '30〜40',
        level: '非常に静か',
        example: '図書館、静かな住宅地の夜',
      },
      calm: {
        range: '40〜50',
        level: '静か',
        example: '静かなオフィス、エアコンの室内機',
      },
      normal: {
        range: '50〜60',
        level: '普通',
        example: '静かな会話、家庭用の掃除機の遠く',
      },
      loud: {
        range: '60〜70',
        level: 'やや騒がしい',
        example: '通常の会話、にぎやかなオフィス',
      },
      'very-loud': {
        range: '70〜85',
        level: '騒がしい',
        example: '走行中の電車内、掃除機、交通量の多い道路',
      },
      extreme: {
        range: '85〜',
        level: '非常にうるさい',
        example: 'ガード下、工事現場、ライブ会場（長時間は聴覚に注意）',
      },
    },
    errors: {
      'permission-denied':
        'マイクの使用が許可されていません。アドレスバーの鍵（サイト設定）アイコンから許可してから、もう一度お試しください。',
      'not-found': 'マイクが見つかりませんでした。接続を確認してください。',
      'in-use':
        'マイクを開始できませんでした。他のアプリ（Zoom・Teams等）やタブが使用中の可能性があります。',
      constraints:
        '指定した設定に対応していません。別のマイクや設定でお試しください。',
      insecure: 'この環境ではマイクを利用できません（HTTPS接続が必要です）。',
      unsupported: 'お使いのブラウザはマイクの取得に対応していません。',
      unknown: 'マイクを開始できませんでした。',
    },
    howToHeading: '使い方',
    howToSteps: [
      '「計測を開始」を押し、ブラウザの許可画面でマイクを「許可」します。',
      '測りたい場所にスマホ・PCを置き、現在・最大・平均とグラフを確認します。',
      '必要なら、基準になる騒音計の値を入れて「現在の音に合わせる」を押し、校正オフセットを合わせます。',
      '「最大・平均をリセット」で測り直し、「計測を停止」で終了します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '表示は「目安」です。マイクの感度・端末・OSの音声処理で値が大きく変わるため、法令上の騒音測定や機器の性能証明には使えません。',
      '初期のオフセット（90 dB）は、会話の音声がおよそ 60 dB になるよう置いた仮の値です。正確な値が必要なときは基準の騒音計に合わせて調整してください。',
      'エコーキャンセル・ノイズ抑制・自動音量調整は、正しく測るためすべてオフにして取得します。ただし端末側で処理が残る場合があります。',
      '音声は音量の計算だけに使われ、録音も保存もサーバーへの送信もしません。ページを閉じる・停止するとマイクも解放されます。',
      '極端に大きな音や非常に静かな音は、マイクの性能の限界で正しく測れません。目安では 30〜90 dB 程度が比較的信頼できる範囲です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'dB（デシベル）・dBFS',
        description:
          '音の大きさを対数で表す単位です。dBFS はデジタル音声の最大値を 0 とした相対値で、マイクの感度が分からないと実際の音圧（dB SPL）には変換できません。そこで校正オフセットを足して目安にしています。',
      },
      {
        term: '平均（Leq・等価騒音レベル）',
        description:
          '変動する騒音を、同じエネルギーを持つ一定の音に置き換えたときのレベルです。単純な平均より大きな音の影響を受けやすくなります。このツールの「平均」はこの方式で計算します。',
      },
      {
        term: '校正オフセット',
        description:
          'マイク入力（dBFS）を、実際の音圧に近い目安のdBへそろえるために足す値です。基準の騒音計と同じ音を測って合わせます。',
      },
    ],
  },
  en: {
    title: 'Noise Meter – Measure Sound Level (dB) With Your Mic',
    description:
      'A simple online sound level meter that shows an approximate dB reading from your mic, with max, average, a graph and a noise guide. Nothing is recorded.',
    h1: 'Noise Meter (Approximate Sound Level in dB)',
    introHtml:
      'See how loud your surroundings are as an approximate dB reading from your microphone. Handy for checking how quiet a room is or comparing places. The reading is an estimate, not a calibrated instrument; you can tune it with the calibration offset below. Audio is neither saved nor uploaded. To check the microphone itself, use the <a href="/en/tools/mic-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Microphone Test</a>.',
    startLabel: 'Start measuring',
    stopLabel: 'Stop measuring',
    idleMessage:
      'Press "Start measuring" and allow microphone access in the browser prompt.',
    currentLabel: 'Now',
    maxLabel: 'Max',
    avgLabel: 'Average',
    unit: 'dB (approx.)',
    meterAriaLabel: 'Current noise level',
    resetLabel: 'Reset max and average',
    graphHeading: 'Last 30 seconds',
    graphAriaLabel: 'Noise level graph',
    graphHint: 'The vertical axis spans 0 to 130 dB (approx.).',
    offsetHeading: 'Calibration offset',
    offsetLabel: 'Offset (dB)',
    offsetHint:
      'This value is added to the microphone input level (dBFS) to get the displayed number. Sensitivity differs between devices, so compare against a reliable sound level meter and adjust.',
    referenceLabel: 'Reference meter reading (dB)',
    applyReferenceLabel: 'Match current sound',
    referenceHint:
      'Enter what another sound level meter shows for the same sound, then press the button while measuring to set the offset automatically.',
    tableHeading: 'Noise level guide',
    tableRangeHeader: 'Approx. dB',
    tableLevelHeader: 'Feels like',
    tableExampleHeader: 'Examples',
    currentBandPrefix: 'Current level',
    bands: {
      'very-quiet': {
        range: 'Under 30',
        level: 'Nearly silent',
        example: 'Rustling leaves, a quiet room late at night',
      },
      quiet: {
        range: '30-40',
        level: 'Very quiet',
        example: 'A library, a quiet suburb at night',
      },
      calm: {
        range: '40-50',
        level: 'Quiet',
        example: 'A quiet office, an air conditioner indoors',
      },
      normal: {
        range: '50-60',
        level: 'Moderate',
        example: 'A quiet conversation, a distant vacuum cleaner',
      },
      loud: {
        range: '60-70',
        level: 'Somewhat noisy',
        example: 'Normal conversation, a busy office',
      },
      'very-loud': {
        range: '70-85',
        level: 'Noisy',
        example: 'Inside a moving train, a vacuum cleaner, heavy traffic',
      },
      extreme: {
        range: '85+',
        level: 'Very loud',
        example:
          'Under an elevated railway, a construction site, a live concert (protect your hearing)',
      },
    },
    errors: {
      'permission-denied':
        'Microphone access was blocked. Allow it from the site settings icon in the address bar, then try again.',
      'not-found': 'No microphone was found. Check that it is connected.',
      'in-use':
        'Could not start the microphone. Another app (Zoom, Teams, etc.) or tab may be using it.',
      constraints:
        'That setting is not supported. Try another microphone or setting.',
      insecure:
        'The microphone is unavailable here (an HTTPS connection is required).',
      unsupported: 'Your browser does not support microphone access.',
      unknown: 'Could not start the microphone.',
    },
    howToHeading: 'How to use',
    howToSteps: [
      'Press "Start measuring" and choose "Allow" in the browser prompt.',
      'Place your phone or PC where you want to measure and watch the current, max and average values and the graph.',
      'If needed, enter a reference meter reading and press "Match current sound" to set the calibration offset.',
      'Press "Reset max and average" to measure again, and "Stop measuring" when you are done.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The numbers are approximate. Microphone sensitivity, the device and OS audio processing change the result a lot, so this is not suitable for legal noise measurement or proving equipment performance.',
      'The default offset (90 dB) is a placeholder chosen so that normal speech reads about 60 dB. Adjust it against a reference meter if you need better accuracy.',
      'Echo cancellation, noise suppression and auto gain control are all turned off for measuring, though some devices still apply processing of their own.',
      'Audio is used only to calculate the level. Nothing is recorded, saved or uploaded, and the microphone is released when you stop or close the page.',
      'Very loud or very quiet sounds are beyond what a typical microphone can capture accurately. Roughly 30 to 90 dB is the most reliable range.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'dB and dBFS',
        description:
          'Decibels express loudness on a logarithmic scale. dBFS is relative to the maximum value of digital audio (0). Without knowing the microphone sensitivity it cannot be converted to real sound pressure (dB SPL), so a calibration offset is added to give an estimate.',
      },
      {
        term: 'Average (Leq)',
        description:
          'The equivalent continuous sound level: the steady level that carries the same energy as the varying noise. Loud moments weigh more than in a plain average. The "Average" here is calculated this way.',
      },
      {
        term: 'Calibration offset',
        description:
          'The value added to the microphone level (dBFS) so that it approximates the real sound level in dB. You set it by measuring the same sound with a reference meter.',
      },
    ],
  },
};
