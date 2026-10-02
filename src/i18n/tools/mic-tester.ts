import type { Locale } from '../../data/tools';

export interface MicTesterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  micLabel: string;
  defaultDevice: string;
  echoLabel: string;
  noiseLabel: string;
  agcLabel: string;
  startLabel: string;
  stopLabel: string;
  idleMessage: string;
  levelHeading: string;
  levelLabel: string;
  peakLabel: string;
  clipping: string;
  noSignal: string;
  infoHeading: string;
  rowDevice: string;
  rowSampleRate: string;
  rowChannels: string;
  none: string;
  recordHeading: string;
  recordLabel: string;
  stopRecordLabel: string;
  recording: string;
  recordedLabel: string;
  downloadLabel: string;
  playbackAriaLabel: string;
  recorderUnsupported: string;
  recordLimit: string;
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

export const micTesterContent: Record<Locale, MicTesterPageContent> = {
  ja: {
    title: 'マイクテスト（入力レベル確認・録音して聞き返す）',
    description:
      'マイクが正しく音を拾えているかをブラウザ上で確認できる無料ツールです。入力レベルのリアルタイム表示、音割れの検出、録音して聞き返す機能に対応。音声はブラウザ内で処理され、サーバーには送信・保存されません。',
    h1: 'マイクテスト（入力レベル確認・録音）',
    introHtml:
      'Web会議や配信の前に、マイクが音を拾っているか・音量は適切か・音が割れていないかを確認できます。録音して聞き返せるので、相手にどう聞こえるかも確かめられます。音声はこのページの外には出ません。カメラも一緒に確認する場合は<a href="/tools/webcam-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Webカメラ動作確認</a>をご利用ください。',
    micLabel: 'マイク',
    defaultDevice: '既定のデバイス',
    echoLabel: 'エコーキャンセル',
    noiseLabel: 'ノイズ抑制',
    agcLabel: '自動音量調整',
    startLabel: 'マイクテストを開始',
    stopLabel: 'テストを停止',
    idleMessage:
      '「マイクテストを開始」を押して、マイクに向かって話してみてください。',
    levelHeading: '入力レベル',
    levelLabel: 'マイクの入力レベル',
    peakLabel: 'ピーク',
    clipping:
      '音が割れています。マイクから離れるか、入力音量を下げてください。',
    noSignal:
      'しばらく音が検出されていません。マイクのミュートや、選択したデバイスを確認してください。',
    infoHeading: '取得できた情報',
    rowDevice: 'マイク名',
    rowSampleRate: 'サンプルレート',
    rowChannels: 'チャンネル数',
    none: '取得できません',
    recordHeading: '録音して聞き返す',
    recordLabel: '録音を開始',
    stopRecordLabel: '録音を停止',
    recording: '録音中',
    recordedLabel: '録音した音声',
    downloadLabel: '録音をダウンロード',
    playbackAriaLabel: '録音した音声の再生',
    recorderUnsupported: 'お使いのブラウザは録音に対応していません。',
    recordLimit: '録音は5分で自動的に停止します。',
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
      '「マイク」から確認したいデバイスを選びます（そのままなら既定のマイク）。',
      '「マイクテストを開始」を押し、ブラウザの許可画面で「許可」を選びます。',
      'マイクに向かって話し、入力レベルのメーターが動くか、音が割れていないかを確認します。',
      '「録音を開始」で録音し、「録音を停止」後に再生して聞こえ方を確認します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '初回は、ブラウザからマイクの使用許可を求められます。許可しない場合はテストできません。',
      '再生時のハウリングを防ぐため、ライブでの音声は出力しません。聞こえ方の確認は「録音して聞き返す」をご利用ください（イヤホンの使用をおすすめします）。',
      'エコーキャンセル・ノイズ抑制・自動音量調整は、ブラウザの音声処理です。オフにするとマイクの素の音に近くなり、入力レベルを正確に見られます。切り替えると、テストが実行中なら取り直されます。',
      '録音は5分で自動停止します。録音した音声はこのブラウザ内にだけあり、ページを閉じる・やり直すと破棄されます。保存したい場合はダウンロードしてください。',
      'スマホでは、他のアプリの通話中や、ブラウザがバックグラウンドの状態ではマイクが使えないことがあります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'dBFS（デシベル）',
        description:
          'デジタル音声の音量を、最大値（0 dBFS）を基準にして表した単位です。小さな音ほど大きな負の値になります。会話では目安として -30〜-12 dBFS 程度に収まると、小さすぎず割れにくい音量です。',
      },
      {
        term: '音割れ（クリッピング）',
        description:
          '入力が大きすぎて、波形が上限に張り付いてしまう現象です。音が歪んで聞こえるため、マイクを離す、入力音量を下げるなどで避けます。',
      },
      {
        term: 'エコーキャンセル・ノイズ抑制',
        description:
          'スピーカーの音がマイクに回り込む反響（エコー）や、周囲の雑音を減らすブラウザの音声処理です。通話には便利ですが、音楽や楽器の録音では音質が変わることがあります。',
      },
    ],
  },
  en: {
    title: 'Microphone Test – Check Input Level & Record Playback',
    description:
      'Test your microphone online: see the live input level, detect clipping, and record and play back a clip. Runs in your browser; audio is never uploaded.',
    h1: 'Microphone Test (Input Level & Recording)',
    introHtml:
      'Before a video call or stream, check that your microphone picks up sound, that the volume is right and that it is not distorting. You can record a clip and play it back to hear what others will hear. Audio never leaves this page. To check your camera as well, use the <a href="/en/tools/webcam-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Webcam & Microphone Test</a>.',
    micLabel: 'Microphone',
    defaultDevice: 'Default device',
    echoLabel: 'Echo cancellation',
    noiseLabel: 'Noise suppression',
    agcLabel: 'Auto gain control',
    startLabel: 'Start microphone test',
    stopLabel: 'Stop test',
    idleMessage:
      'Press "Start microphone test" and speak into your microphone.',
    levelHeading: 'Input level',
    levelLabel: 'Microphone input level',
    peakLabel: 'Peak',
    clipping:
      'The sound is distorting (clipping). Move away from the microphone or lower the input volume.',
    noSignal:
      'No sound has been detected for a while. Check whether the microphone is muted and that the right device is selected.',
    infoHeading: 'Detected information',
    rowDevice: 'Microphone name',
    rowSampleRate: 'Sample rate',
    rowChannels: 'Channels',
    none: 'Not available',
    recordHeading: 'Record and play back',
    recordLabel: 'Start recording',
    stopRecordLabel: 'Stop recording',
    recording: 'Recording',
    recordedLabel: 'Recorded audio',
    downloadLabel: 'Download recording',
    playbackAriaLabel: 'Play the recorded audio',
    recorderUnsupported: 'Your browser does not support recording.',
    recordLimit: 'Recording stops automatically after 5 minutes.',
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
      'Choose the device to check under "Microphone" (the default microphone if you leave it as is).',
      'Press "Start microphone test" and choose "Allow" in the browser prompt.',
      'Speak into the microphone and check that the level meter moves and the sound is not distorting.',
      'Press "Start recording", then "Stop recording", and play the clip back to hear how you sound.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The first time, your browser asks for permission to use the microphone. You cannot test without allowing it.',
      'To avoid feedback, live audio is not played back. Use "Record and play back" to hear how you sound (headphones are recommended).',
      'Echo cancellation, noise suppression and auto gain control are processing done by the browser. Turning them off gives you a rawer signal and a more accurate level. Changing them restarts a running test.',
      'Recording stops automatically after 5 minutes. The recording lives only in this browser and is discarded when you close or redo it; download it if you want to keep it.',
      'On phones, the microphone may be unavailable during a call in another app or while the browser is in the background.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'dBFS (decibels)',
        description:
          'A unit that expresses digital audio volume relative to the maximum value (0 dBFS). Quieter sounds are larger negative numbers. For speech, roughly -30 to -12 dBFS is loud enough without being likely to distort.',
      },
      {
        term: 'Clipping',
        description:
          'When the input is so loud that the waveform is flattened at its upper limit, causing distortion. Avoid it by moving away from the microphone or lowering the input volume.',
      },
      {
        term: 'Echo cancellation & noise suppression',
        description:
          'Browser processing that reduces echo (speaker sound feeding back into the microphone) and background noise. It helps on calls but can change the sound when recording music or instruments.',
      },
    ],
  },
};
