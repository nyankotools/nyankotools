import type { Locale } from '../../data/tools';
import type { MidiKind } from '../../lib/tools/midi-tester';

export interface MidiTesterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  connectLabel: string;
  statusIdle: string;
  statusConnecting: string;
  statusConnected: string;
  unsupportedError: string;
  insecureError: string;
  deniedError: string;
  genericError: string;
  inputsHeading: string;
  outputsHeading: string;
  noInputs: string;
  noOutputs: string;
  /** 接続状態の表示 */
  portConnected: string;
  portDisconnected: string;
  outputSelectLabel: string;
  channelLabel: string;
  sendTestLabel: string;
  sendTestNote: string;
  sentMessage: string;
  logHeading: string;
  logEmpty: string;
  showClockLabel: string;
  clearLabel: string;
  copyLabel: string;
  copiedMessage: string;
  copyFailedMessage: string;
  channelText: string;
  portStateLog: string;
  kindLabels: Record<MidiKind, string>;
  /** `{note}` 音名、`{num}` ノート番号、`{value}` 値 */
  noteDetail: string;
  /** `{controller}` 番号、`{name}` 名称、`{value}` 値 */
  controllerDetail: string;
  /** `{value}` 値 */
  valueDetail: string;
  /** `{bend}` 符号付きの値 */
  bendDetail: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const midiTesterContent: Record<Locale, MidiTesterPageContent> = {
  ja: {
    title: 'MIDIデバイステスター（接続機器とメッセージ確認）',
    description:
      'MIDIキーボードやコントローラの接続と入力をブラウザで確認する無料ツール。ノートon/off・CC・ピッチベンド・プログラムチェンジをリアルタイム表示。Chrome・Edge対応。データは外部に送信されません。',
    h1: 'MIDIデバイステスター（Web MIDIで接続・入力を確認）',
    introHtml:
      'MIDIキーボードやパッドコントローラをPCにつなぎ、認識されているか、鍵盤やノブの操作がどんなMIDIメッセージとして届くかを確認できます。ノート名での演奏を試したいときは<a href="/tools/virtual-piano/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">バーチャルピアノ</a>も使えます。受信内容はこのページ内で表示するだけで、サーバーには送信されません。',
    connectLabel: 'MIDI機器に接続',
    statusIdle:
      '「MIDI機器に接続」を押すと、ブラウザがMIDI機器へのアクセス許可を確認します。',
    statusConnecting: '接続しています…',
    statusConnected: '接続しました。機器を操作するとログに表示されます。',
    unsupportedError:
      'お使いのブラウザはWeb MIDIに対応していません。Chrome・Edge・Operaなどの最新版（PC・Android）でお試しください。Safari（iPhone・iPad含む）は非対応です。',
    insecureError:
      'Web MIDIはHTTPS（または localhost）のページでのみ使えます。アドレスが https:// で始まっているか確認してください。',
    deniedError:
      'MIDI機器へのアクセスが許可されませんでした。アドレスバーのサイト設定からMIDIを許可して、もう一度「MIDI機器に接続」を押してください。',
    genericError: 'MIDIへの接続に失敗しました。',
    inputsHeading: '入力ポート',
    outputsHeading: '出力ポート',
    noInputs: '入力ポートは見つかりません。',
    noOutputs: '出力ポートは見つかりません。',
    portConnected: '接続中',
    portDisconnected: '切断',
    outputSelectLabel: '送信先の出力ポート',
    channelLabel: 'チャンネル',
    sendTestLabel: 'テストノートを送信',
    sendTestNote: 'C4（ノート60）を約0.5秒鳴らすメッセージを送ります。',
    sentMessage: 'テストノートを送信しました。',
    logHeading: 'メッセージログ',
    logEmpty: 'まだメッセージを受信していません。',
    showClockLabel: 'MIDIクロックなど連続メッセージも表示',
    clearLabel: 'ログを消去',
    copyLabel: 'ログをコピー',
    copiedMessage: 'コピーしました',
    copyFailedMessage: 'コピーできませんでした',
    channelText: 'ch{ch}',
    portStateLog: '{name}: {state}',
    kindLabels: {
      noteOff: 'ノートオフ',
      noteOn: 'ノートオン',
      polyPressure: 'ポリプレッシャー',
      controlChange: 'コントロールチェンジ',
      programChange: 'プログラムチェンジ',
      channelPressure: 'チャンネルプレッシャー',
      pitchBend: 'ピッチベンド',
      sysex: 'システムエクスクルーシブ',
      timeCode: 'MTCクォーターフレーム',
      songPosition: 'ソングポジション',
      songSelect: 'ソングセレクト',
      tuneRequest: 'チューンリクエスト',
      clock: 'MIDIクロック',
      start: 'スタート',
      continue: 'コンティニュー',
      stop: 'ストップ',
      activeSensing: 'アクティブセンシング',
      reset: 'システムリセット',
      unknown: '不明',
    },
    noteDetail: '{note}（{num}）ベロシティ {value}',
    controllerDetail: 'CC{controller} {name} = {value}',
    valueDetail: '値 {value}',
    bendDetail: '{bend}',
    howToHeading: '使い方',
    howToSteps: [
      'MIDI機器をUSBなどでPCにつなぎます（先に電源を入れておきます）。',
      '「MIDI機器に接続」を押し、ブラウザの確認で許可します。',
      '「入力ポート」に機器名が出ているのを確認し、鍵盤・ノブ・ペダルを操作して「メッセージログ」を見ます。',
      '出力ポートがあれば「テストノートを送信」で機器側の音源を鳴らせます。',
    ],
    notesHeading: '注意事項',
    notes: [
      'Web MIDIに対応しているのは主にChrome・Edge・Operaなどのブラウザです。FirefoxはMIDIのアクセス許可の仕組みが異なり、使えない場合があります。Safari（iPhone・iPad含む）は非対応です。',
      'HTTPSのページでのみ動作します。接続時にブラウザが許可を求めます。拒否した場合はサイト設定から許可し直してください。',
      '他のアプリ（DAWなど）が機器を占有していると、ブラウザから見えないことがあります。その場合は他のアプリを閉じてから接続し直してください。',
      'ログは新しい順に最大200件までです。それより古いものは自動的に消えます。',
      'MIDIクロックやアクティブセンシングは大量に届くため、初期設定では表示しません。',
      'システムエクスクルーシブ（SysEx）は種類だけを表示します。SysExの送受信の権限は要求しません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Web MIDI',
        description:
          'ブラウザからMIDI機器を読み書きするための仕組みです。ページがMIDI機器の一覧を取得し、メッセージを受け取ったり送ったりできます。',
      },
      {
        term: 'ベロシティ',
        description:
          '鍵盤を叩く強さを0〜127で表した値です。ノートオンの値が大きいほど強く弾いたことになります。ベロシティ0のノートオンは、ノートオフとして扱うのが一般的です。',
      },
      {
        term: 'コントロールチェンジ（CC）',
        description:
          'ノブ・スライダー・ペダルなどの操作を伝えるメッセージです。番号ごとに役割があり、たとえばCC1はモジュレーション、CC7は音量、CC64はサスティンペダルです。',
      },
      {
        term: 'ピッチベンド',
        description:
          '音程を滑らかに変化させるホイールの操作です。値は14ビットの0〜16383で、中央の8192が変化なしです。このページでは中央を0とした符号付きの値（-8192〜8191）で表示します。',
      },
    ],
  },
  en: {
    title: 'MIDI Device Tester (Web MIDI Monitor)',
    description:
      'Test MIDI keyboards and controllers in your browser. See connected ports and live notes, CC, pitch bend and program change messages. Chrome/Edge, HTTPS only.',
    h1: 'MIDI Device Tester: Check Connections and Messages with Web MIDI',
    introHtml:
      'Plug in a MIDI keyboard or pad controller to check that the browser sees it and exactly which MIDI messages your keys, knobs and pedals send. To play notes without hardware, try the <a href="/en/tools/virtual-piano/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Virtual Piano</a>. Messages are only shown on this page and never sent to a server.',
    connectLabel: 'Connect MIDI devices',
    statusIdle:
      'Press "Connect MIDI devices" and your browser will ask for permission to use MIDI.',
    statusConnecting: 'Connecting…',
    statusConnected:
      'Connected. Play your device and messages will appear in the log.',
    unsupportedError:
      'Your browser does not support Web MIDI. Try the latest Chrome, Edge or Opera on desktop or Android. Safari (including iPhone and iPad) is not supported.',
    insecureError:
      'Web MIDI only works on HTTPS pages (or localhost). Check that the address starts with https://.',
    deniedError:
      'MIDI access was not allowed. Allow MIDI in the site settings next to the address bar, then press "Connect MIDI devices" again.',
    genericError: 'Could not connect to MIDI.',
    inputsHeading: 'Input ports',
    outputsHeading: 'Output ports',
    noInputs: 'No input ports found.',
    noOutputs: 'No output ports found.',
    portConnected: 'connected',
    portDisconnected: 'disconnected',
    outputSelectLabel: 'Output port to send to',
    channelLabel: 'Channel',
    sendTestLabel: 'Send test note',
    sendTestNote: 'Sends a C4 (note 60) for about half a second.',
    sentMessage: 'Test note sent.',
    logHeading: 'Message log',
    logEmpty: 'No messages received yet.',
    showClockLabel: 'Also show MIDI clock and other frequent messages',
    clearLabel: 'Clear log',
    copyLabel: 'Copy log',
    copiedMessage: 'Copied',
    copyFailedMessage: 'Could not copy',
    channelText: 'ch{ch}',
    portStateLog: '{name}: {state}',
    kindLabels: {
      noteOff: 'Note Off',
      noteOn: 'Note On',
      polyPressure: 'Poly Pressure',
      controlChange: 'Control Change',
      programChange: 'Program Change',
      channelPressure: 'Channel Pressure',
      pitchBend: 'Pitch Bend',
      sysex: 'System Exclusive',
      timeCode: 'MTC Quarter Frame',
      songPosition: 'Song Position',
      songSelect: 'Song Select',
      tuneRequest: 'Tune Request',
      clock: 'MIDI Clock',
      start: 'Start',
      continue: 'Continue',
      stop: 'Stop',
      activeSensing: 'Active Sensing',
      reset: 'System Reset',
      unknown: 'Unknown',
    },
    noteDetail: '{note} ({num}) velocity {value}',
    controllerDetail: 'CC{controller} {name} = {value}',
    valueDetail: 'value {value}',
    bendDetail: '{bend}',
    howToHeading: 'How to use',
    howToSteps: [
      'Connect your MIDI device to the computer (USB, for example) and turn it on first.',
      'Press "Connect MIDI devices" and allow access in the browser prompt.',
      'Check that your device is listed under "Input ports", then play keys, turn knobs or press pedals and watch the "Message log".',
      'If an output port is listed, press "Send test note" to sound the device.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Web MIDI is mainly available in Chrome, Edge, Opera and other Chromium-based browsers. Firefox handles MIDI permission differently and may not work. Safari (including iPhone and iPad) is not supported.',
      'It only works on HTTPS pages, and the browser asks for permission when you connect. If you refused, allow MIDI again in the site settings.',
      'If another app such as a DAW has taken over the device, the browser may not see it. Close the other app and connect again.',
      'The log keeps the newest 200 messages, newest first. Older ones are dropped automatically.',
      'MIDI clock and active sensing arrive in large numbers, so they are hidden by default.',
      'System Exclusive (SysEx) messages are shown by type only. This page does not request SysEx permission.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Web MIDI',
        description:
          'The browser API for talking to MIDI devices. A page can list the connected ports and receive or send MIDI messages.',
      },
      {
        term: 'Velocity',
        description:
          'How hard a key was struck, from 0 to 127. A Note On with velocity 0 is conventionally treated as a Note Off.',
      },
      {
        term: 'Control Change (CC)',
        description:
          'A message for knobs, sliders and pedals. Each number has a role: CC1 is modulation, CC7 is volume and CC64 is the sustain pedal.',
      },
      {
        term: 'Pitch bend',
        description:
          'The wheel that glides the pitch up and down. The raw value is 14-bit (0 to 16383) with 8192 meaning no bend; this page shows it centred on 0 (-8192 to 8191).',
      },
    ],
  },
};
