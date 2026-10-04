import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ゲームパッドをつないだのに認識されません。',
      answer:
        'ブラウザは、ボタンが押されるまでゲームパッドを認識しません。接続後にボタンを1つ押してください。それでも反応しない場合は、USBケーブルを替える、Bluetoothの再ペアリング、他のアプリ（Steamなど）がコントローラーを占有していないかの確認をお試しください。',
    },
    {
      question: 'ドリフトかどうかはどうやって見分けますか？',
      answer:
        'スティックに触れずに置いた状態で、「スティック・軸」の値が0.00から大きくずれたままなら、ドリフトの可能性があります。値が±0.10程度までなら個体差や経年によるもので、多くのゲームのデッドゾーンで吸収されます。',
    },
    {
      question: '入力内容は保存・送信されますか？',
      answer:
        'いいえ。ボタンやスティックの値は画面の表示にだけ使われ、サーバーへの送信や保存はされません。',
    },
    {
      question: 'ボタン名が番号（#0, #1…）で表示されます。',
      answer:
        '「標準（standard）」配置として認識されたコントローラーだけ、A/B/X/YやL1/R1などの名前で表示します。それ以外のコントローラーは機種ごとに番号の割り当てが異なるため、番号で表示します。',
    },
  ],
  en: [
    {
      question: 'My gamepad is connected but not detected.',
      answer:
        'Browsers do not expose a gamepad until a button is pressed, so press any button after connecting. If it still does not appear, try another USB cable, re-pair the Bluetooth connection, or check that another app such as Steam is not holding the controller.',
    },
    {
      question: 'How can I tell if a stick is drifting?',
      answer:
        'Leave the stick untouched and look at the "Sticks & axes" values. If they stay well away from 0.00, the stick may be drifting. Values up to about ±0.10 are normal wear or unit variation and are absorbed by the deadzone in most games.',
    },
    {
      question: 'Is my input saved or sent anywhere?',
      answer:
        'No. Button and stick values are only used to draw the display and are never uploaded or stored.',
    },
    {
      question: 'Buttons are shown as numbers (#0, #1…).',
      answer:
        'Names such as A/B/X/Y and L1/R1 are shown only for controllers recognized with the "standard" mapping. Other controllers number their buttons differently per model, so they are shown by number.',
    },
  ],
};
