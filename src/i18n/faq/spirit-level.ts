import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'PCで使えますか？',
      answer:
        '多くのPCには傾きセンサーがないため、値が取得できず使えません。スマホやタブレット、傾きセンサー搭載の2-in-1 PCでお試しください。非対応の場合は、その旨のメッセージが表示されます。',
    },
    {
      question: 'iPhoneで動かないときはどうすればよいですか？',
      answer:
        'iOSでは「センサーを開始」を押したときに表示される「動きと向き」の許可を選ぶ必要があります。一度拒否した場合は、Safariを完全に終了して開き直すか、サイト設定から許可し直してください。',
    },
    {
      question: '水平を示しているのに、実際は少し傾いています。',
      answer:
        '端末のセンサー誤差や、ケース・カメラの出っ張りによるずれが考えられます。端末を180°回して置き直し、値が逆の符号になるか確認してください。ずれが一定なら「現在の位置をゼロ点にする」で補正できます。',
    },
    {
      question: '「置いて測る」と「立てて測る」は何が違いますか？',
      answer:
        '「置いて測る」は画面を上にして、左右と前後の2方向の傾きを気泡で表示します。「立てて測る」は壁や柱に端末の辺を当てて、左右（画面内の回転）のずれだけを測ります。縦でも横でも、最寄りの向きからのずれを表示します。',
    },
    {
      question: '傾斜率（%）と角度（°）はどう違いますか？',
      answer:
        '角度は面の傾きそのもの、傾斜率は水平100に対して何上がるかの割合です。排水の勾配や坂道の表示では傾斜率がよく使われ、45°で100%、1°で約1.7%です。',
    },
  ],
  en: [
    {
      question: 'Does it work on a PC?',
      answer:
        'Most PCs have no tilt sensor, so no readings arrive and it cannot be used. Try a phone, a tablet, or a 2-in-1 PC with a sensor. On unsupported devices a message explains this.',
    },
    {
      question: 'What if it does not work on my iPhone?',
      answer:
        'iOS requires you to allow "Motion & Orientation" access when you press "Start sensor". If you declined once, fully quit Safari and reopen the page, or allow it again in the site settings.',
    },
    {
      question: 'It says level, but the surface is slightly tilted.',
      answer:
        'The phone’s sensor can be off by a bit, and a case or camera bump can stop it sitting flush. Turn the phone 180 degrees and check that the reading flips sign. If the offset is constant, use "Set current position as zero" to correct it.',
    },
    {
      question:
        'What is the difference between "Lay flat" and "Stand upright"?',
      answer:
        '"Lay flat" puts the phone face up and shows the left-right and front-back tilt with a bubble. "Stand upright" holds an edge of the phone against a wall or post and measures only the left-right (in-screen rotation) error, relative to the nearest vertical or horizontal edge.',
    },
    {
      question: 'How do slope (%) and angle (°) differ?',
      answer:
        'The angle is the tilt itself, and the slope is how much the surface rises per 100 units of horizontal run. Slope is common for drainage and road grades: 45° is 100%, and 1° is about 1.7%.',
    },
  ],
};
