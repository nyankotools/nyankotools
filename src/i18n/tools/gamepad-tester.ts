import type { Locale } from '../../data/tools';

export interface GamepadTesterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  waitingMessage: string;
  padLabel: string;
  infoHeading: string;
  rowId: string;
  rowMapping: string;
  rowButtons: string;
  rowAxes: string;
  mappingStandard: string;
  mappingOther: string;
  buttonsHeading: string;
  axesHeading: string;
  stickLabel: string;
  axisLabel: string;
  deadzoneLabel: string;
  driftWarning: string;
  vibrationHeading: string;
  vibrateLabel: string;
  vibrationUnsupported: string;
  unsupported: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const gamepadTesterContent: Record<Locale, GamepadTesterPageContent> = {
  ja: {
    title: 'ゲームパッドテスト（ボタン・スティック・ドリフト確認）',
    description:
      'ゲームパッド（コントローラー）の全ボタン・スティック・トリガーが正しく反応するかをブラウザ上で確認できる無料ツールです。スティックのドリフト（勝手に傾く不具合）の確認や、バイブレーションのテストにも対応。入力はサーバーに送信されません。',
    h1: 'ゲームパッドテスト（ボタン・スティック確認）',
    introHtml:
      'PS5・PS4・Xbox・Switch Proなどのコントローラーをつないで、ボタンを押すと、どのボタンが反応しているかを確認できます。スティックの傾きやトリガーの押し込み量が数値で見られるので、ドリフト（触っていないのにスティックが傾く不具合）の見極めにも使えます。キーボードの確認は<a href="/tools/keyboard-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">キーボードテスト</a>をご利用ください。入力内容はブラウザの外には出ません。',
    waitingMessage:
      'ゲームパッドを接続し、いずれかのボタンを押してください（ブラウザはボタンが押されるまでゲームパッドを認識しません）。',
    padLabel: 'ゲームパッド',
    infoHeading: '接続情報',
    rowId: '名前',
    rowMapping: 'ボタン配置',
    rowButtons: 'ボタン数',
    rowAxes: '軸の数',
    mappingStandard: '標準（standard）',
    mappingOther: '標準外（ボタンは番号で表示）',
    buttonsHeading: 'ボタン',
    axesHeading: 'スティック・軸',
    stickLabel: 'スティック',
    axisLabel: '軸',
    deadzoneLabel: 'ドリフト判定のしきい値（デッドゾーン）',
    driftWarning:
      'スティックが中心からずれています。触っていないのにこの表示が続く場合は、ドリフトの可能性があります。',
    vibrationHeading: 'バイブレーション',
    vibrateLabel: '振動をテスト',
    vibrationUnsupported:
      'このコントローラーまたはブラウザは、振動のテストに対応していません。',
    unsupported: 'お使いのブラウザはGamepad APIに対応していません。',
    notesHeading: '注意事項',
    notes: [
      'ブラウザは、セキュリティ上の理由から、ボタンが押されるまでゲームパッドを認識しません。接続したあとでボタンを1つ押してください。',
      'ゲームパッドはタブがアクティブなときだけ読み取れます。別のタブやウィンドウに切り替えると、入力は止まります。',
      'ボタン名は「標準（standard）」配置のコントローラーの場合のみ、PlayStation／Xbox系の名前で表示します。それ以外のコントローラーでは番号で表示します。',
      'しきい値（デッドゾーン）は、スティックの傾きがこの値を超えたら「中心からずれている」と判定する目安です。この画面の判定にだけ使い、コントローラー本体には反映されません。',
      'バイブレーションは、Chromium系ブラウザと対応するコントローラーの組み合わせでのみ動作します。Bluetooth接続では動かない場合があります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ドリフト',
        description:
          'スティックに触れていないのに、入力が中心からずれたままになる不具合です。内部のセンサーの摩耗やほこりが主な原因です。',
      },
      {
        term: 'デッドゾーン',
        description:
          'スティックの中心付近で、小さな傾きを無視する範囲です。ゲームではドリフトによる意図しない動きを抑えるために使われます。',
      },
      {
        term: 'アナログトリガー',
        description:
          'LT/RT（L2/R2）のように、押し込んだ深さを0〜1の連続値で出力するボタンです。通常のボタンは押した・押していないの2値です。',
      },
    ],
  },
  en: {
    title: 'Gamepad Tester – Check Buttons, Sticks & Stick Drift',
    description:
      'Test your game controller online: check every button, stick and trigger, spot stick drift and try the rumble. Runs in your browser, nothing uploaded.',
    h1: 'Gamepad Tester (Buttons, Sticks & Drift)',
    introHtml:
      'Connect a PS5, PS4, Xbox or Switch Pro controller and press buttons to see which ones register. Stick positions and trigger pressure are shown as numbers, so you can tell whether a stick is drifting when you are not touching it. To test a keyboard instead, use the <a href="/en/tools/keyboard-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Keyboard Tester</a>. Nothing leaves your browser.',
    waitingMessage:
      'Connect a gamepad and press any button. Browsers do not detect a controller until a button is pressed.',
    padLabel: 'Gamepad',
    infoHeading: 'Connection info',
    rowId: 'Name',
    rowMapping: 'Button mapping',
    rowButtons: 'Buttons',
    rowAxes: 'Axes',
    mappingStandard: 'Standard',
    mappingOther: 'Non-standard (buttons shown by number)',
    buttonsHeading: 'Buttons',
    axesHeading: 'Sticks & axes',
    stickLabel: 'Stick',
    axisLabel: 'Axis',
    deadzoneLabel: 'Drift threshold (deadzone)',
    driftWarning:
      'A stick is off center. If this stays on while you are not touching it, the stick may be drifting.',
    vibrationHeading: 'Rumble',
    vibrateLabel: 'Test rumble',
    vibrationUnsupported:
      'This controller or browser does not support the rumble test.',
    unsupported: 'Your browser does not support the Gamepad API.',
    notesHeading: 'Notes',
    notes: [
      'For privacy, browsers do not expose a gamepad until a button is pressed. Press one button after connecting.',
      'Gamepad input is only read while this tab is active. Switching to another tab or window pauses it.',
      'Button names in PlayStation/Xbox style are shown only for controllers with the "standard" mapping. Other controllers show buttons by number.',
      'The threshold (deadzone) is the tilt beyond which a stick is flagged as off center. It only affects this page and is not written to the controller.',
      'Rumble works only with a supported controller in Chromium-based browsers, and may not work over Bluetooth.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Stick drift',
        description:
          'A fault where a stick reports input away from center even though it is not being touched, usually from worn internal sensors or dust.',
      },
      {
        term: 'Deadzone',
        description:
          'A range near the stick center where small tilts are ignored. Games use it to suppress unintended movement caused by drift.',
      },
      {
        term: 'Analog trigger',
        description:
          'A button such as LT/RT (L2/R2) that reports how far it is pressed as a value from 0 to 1. Ordinary buttons are just pressed or not pressed.',
      },
    ],
  },
};
