import type { Locale } from '../../data/tools';

export interface MouseTesterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  cpsHeading: string;
  durationLabel: string;
  durationOption: string;
  cpsPadIdle: string;
  cpsPadRunning: string;
  cpsPadDone: string;
  timeLeftLabel: string;
  clicksLabel: string;
  averageLabel: string;
  peakLabel: string;
  chatterLabel: string;
  chatterWarning: string;
  resetLabel: string;
  buttonsHeading: string;
  buttonsPad: string;
  buttons: Record<'left' | 'middle' | 'right' | 'back' | 'forward', string>;
  wheelUp: string;
  wheelDown: string;
  pollingHeading: string;
  pollingPad: string;
  pollingResult: string;
  pollingEstimate: string;
  pollingNone: string;
  pollingUnsupported: string;
  pollingHint: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const mouseTesterContent: Record<Locale, MouseTesterPageContent> = {
  ja: {
    title: 'マウステスト（クリック速度CPS・ポーリングレート測定）',
    description:
      'マウスのクリック速度（CPS）を測定し、全ボタンの反応・ダブルクリック誤作動（チャタリング）・ポーリングレート（Hz）の目安を確認できる無料ツールです。結果はブラウザ内で計算され、サーバーには送信されません。',
    h1: 'マウステスト（クリック速度・ポーリングレート）',
    introHtml:
      '5秒・10秒・30秒でクリック速度（CPS）を測定でき、左・右・中央・戻る・進むの全ボタンが反応するかも確認できます。クリックしていないのに二度押しになる「チャタリング」の検出や、マウスを動かして調べるポーリングレートの目安にも対応します。キーボードの確認は<a href="/tools/keyboard-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">キーボードテスト</a>、ゲームパッドは<a href="/tools/gamepad-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ゲームパッドテスト</a>をご利用ください。',
    cpsHeading: 'クリック速度（CPS）測定',
    durationLabel: '測定時間',
    durationOption: '{n}秒',
    cpsPadIdle: 'ここをクリックすると測定を開始します（左クリックのみ）',
    cpsPadRunning: '測定中：できるだけ速くクリックしてください',
    cpsPadDone: '測定終了。もう一度クリックすると、新しい測定を始めます',
    timeLeftLabel: '残り時間',
    clicksLabel: 'クリック数',
    averageLabel: '平均CPS',
    peakLabel: '最大CPS（1秒間）',
    chatterLabel: '極端に短い間隔のクリック',
    chatterWarning:
      '30ミリ秒未満の間隔のクリックが検出されました。1回押しただけで二度反応している（チャタリング）可能性があります。',
    resetLabel: 'リセット',
    buttonsHeading: 'ボタン・ホイールのテスト',
    buttonsPad: 'この領域で、各ボタンを押したりホイールを回したりしてください',
    buttons: {
      left: '左',
      middle: '中央（ホイール押し込み）',
      right: '右',
      back: '戻る',
      forward: '進む',
    },
    wheelUp: 'ホイール上',
    wheelDown: 'ホイール下',
    pollingHeading: 'ポーリングレートの目安',
    pollingPad: 'この領域の中で、マウスを円を描くように素早く動かしてください',
    pollingResult: '推定ポーリングレート',
    pollingEstimate: '約 {hz} Hz（測定値 {raw} Hz）',
    pollingNone: '測定中…',
    pollingUnsupported:
      'このブラウザは高頻度のマウスイベントを提供しないため、測定できません（Chrome・Edgeをお試しください）。',
    pollingHint:
      'ブラウザのタイマー精度やマウスの動かし方によって誤差が出る目安値です。',
    notesHeading: '注意事項',
    notes: [
      'CPSは、測定時間内のクリック数÷秒数の平均です。「最大CPS」は、1秒間にもっとも多くクリックできた回数です。',
      'クリックのテストは、左ボタンのみ対象です。右・中央・戻る・進むのボタンは、「ボタン・ホイールのテスト」で確認します。戻る・進むボタンは、ブラウザの履歴移動が起きないよう無効にしています。',
      'ポーリングレートは、マウスが1秒間に位置を報告する回数です。ここでの値は、ブラウザに届くイベントの間隔から推定した目安です。ブラウザ側の時刻精度（多くは0.1〜1ミリ秒）により、2000Hz以上の高いレートや、PCの負荷が高い状況では、正確に測れないことがあります。',
      'ポーリングレートの測定中は、マウスをできるだけ速く、連続して動かしてください。止まったり、ゆっくり動かしたりすると、正しい値になりません。',
      'タッチパッドやペンタブレットでは、ポーリングレートの測定値が異なる場合があります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'CPS（Clicks Per Second）',
        description:
          '1秒あたりのクリック回数です。一般的な人の連打は6〜8回程度、速い人で10回を超えます。ゲームの連打速度の目安として使われます。',
      },
      {
        term: 'ポーリングレート',
        description:
          'マウスがPCに位置情報を報告する頻度です。125Hzなら1秒に125回、1000Hzなら1秒に1000回です。高いほど動きが滑らかで、遅延が小さくなります。',
      },
      {
        term: 'チャタリング',
        description:
          'マウスのスイッチの劣化で、1回押しただけで2回以上のクリックとして認識される不具合です。ダブルクリックが勝手に起きる、ドラッグが途切れるなどの症状が出ます。',
      },
    ],
  },
  en: {
    title: 'Mouse Test – Click Speed (CPS) & Polling Rate Checker',
    description:
      'Measure mouse click speed (CPS), test every button, detect double-click chatter and estimate the polling rate. Runs in your browser; nothing is uploaded.',
    h1: 'Mouse Tester (Click Speed & Polling Rate)',
    introHtml:
      'Measure clicks per second (CPS) over 5, 10 or 30 seconds and check that the left, right, middle, back and forward buttons all register. It can also flag chatter, where one press counts as two, and give a rough polling rate from how you move the mouse. To test a keyboard or controller, use the <a href="/en/tools/keyboard-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Keyboard Tester</a> or the <a href="/en/tools/gamepad-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Gamepad Tester</a>.',
    cpsHeading: 'Click speed (CPS) test',
    durationLabel: 'Duration',
    durationOption: '{n} seconds',
    cpsPadIdle: 'Click here to start the test (left button only)',
    cpsPadRunning: 'Testing: click as fast as you can',
    cpsPadDone: 'Time is up. Click again to start a new test',
    timeLeftLabel: 'Time left',
    clicksLabel: 'Clicks',
    averageLabel: 'Average CPS',
    peakLabel: 'Peak CPS (1 second)',
    chatterLabel: 'Very short click intervals',
    chatterWarning:
      'Clicks less than 30 ms apart were detected. One press may be registering twice (chatter).',
    resetLabel: 'Reset',
    buttonsHeading: 'Button & wheel test',
    buttonsPad: 'Press each button and scroll the wheel in this area',
    buttons: {
      left: 'Left',
      middle: 'Middle (wheel click)',
      right: 'Right',
      back: 'Back',
      forward: 'Forward',
    },
    wheelUp: 'Wheel up',
    wheelDown: 'Wheel down',
    pollingHeading: 'Polling rate estimate',
    pollingPad: 'Move your mouse quickly in circles inside this area',
    pollingResult: 'Estimated polling rate',
    pollingEstimate: 'About {hz} Hz (measured {raw} Hz)',
    pollingNone: 'Measuring…',
    pollingUnsupported:
      'This browser does not provide high-frequency mouse events, so it cannot be measured (try Chrome or Edge).',
    pollingHint:
      'This is a rough value that can be off depending on browser timer precision and how you move the mouse.',
    notesHeading: 'Notes',
    notes: [
      'CPS is the number of clicks divided by the test duration. Peak CPS is the most clicks you managed in any single second.',
      'The click test counts the left button only. Check the right, middle, back and forward buttons in the button & wheel test, where back/forward do not trigger browser history navigation.',
      'Polling rate is how many times per second the mouse reports its position. The value here is estimated from the spacing of events reaching the browser. Because browser timestamps are usually 0.1–1 ms precise, rates of 2000 Hz and above, or a heavily loaded PC, may not be measured accurately.',
      'While measuring polling rate, move the mouse as fast and continuously as you can. Pauses or slow movement give wrong values.',
      'Touchpads and pen tablets can report different polling rates.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'CPS (Clicks Per Second)',
        description:
          'How many clicks you make per second. Typical rapid clicking is around 6–8, and fast clickers exceed 10. It is used as a yardstick for click speed in games.',
      },
      {
        term: 'Polling rate',
        description:
          'How often the mouse reports its position to the PC. At 125 Hz that is 125 times a second; at 1000 Hz, 1000 times. Higher means smoother movement and lower latency.',
      },
      {
        term: 'Click chatter',
        description:
          'A fault caused by worn switches where a single press registers as two or more clicks, causing accidental double clicks or broken drags.',
      },
    ],
  },
};
