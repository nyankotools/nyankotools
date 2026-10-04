import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'CPSの平均はどれくらいが普通ですか？',
      answer:
        '通常のクリック連打では1秒あたり6〜8回程度、慣れた人で10回前後が目安です。ジッタークリックやバタフライクリックなどの連打法では、10回を超えることもあります。測定時間が短いほど、瞬間的に高い値が出やすくなります。',
    },
    {
      question: 'ポーリングレートの測定値が実際と合いません。',
      answer:
        'この測定は、ブラウザに届く移動イベントの間隔から推定した目安です。ブラウザの時刻精度や、マウスの動かし方、PCの負荷で誤差が出ます。特に2000Hz以上の高いレートは正確に測れないことがあります。正確に知りたい場合は、マウスメーカーの設定ソフトで確認してください。',
    },
    {
      question:
        '1回クリックしただけで2回反応する（チャタリング）か確認できますか？',
      answer:
        'CPS測定で、30ミリ秒未満の間隔のクリックが検出されると警告します。人が同じボタンを30ミリ秒以内に押し直すことはまずないため、検出された場合はスイッチの劣化が疑われます。ゆっくり1回ずつクリックして、それでも警告が出るかを確認してみてください。',
    },
    {
      question: '操作内容は保存・送信されますか？',
      answer:
        'いいえ。クリックやマウスの動きは、画面に結果を表示するためだけに使われ、サーバーへの送信や保存は行われません。',
    },
  ],
  en: [
    {
      question: 'What is a normal average CPS?',
      answer:
        'Ordinary rapid clicking is around 6–8 clicks per second, and practiced clickers reach about 10. Techniques such as jitter or butterfly clicking can exceed 10. Shorter tests tend to show higher peak values.',
    },
    {
      question: 'The polling rate I see does not match my mouse.',
      answer:
        "The measurement is estimated from the spacing of movement events reaching the browser, so browser timestamp precision, how you move the mouse and PC load all affect it. Rates of 2000 Hz and above may not be measured accurately. For an exact figure, check the mouse maker's configuration software.",
    },
    {
      question: 'Can I check whether one click registers twice (chatter)?',
      answer:
        'During the CPS test, the tool warns if it sees clicks less than 30 ms apart. People almost never press the same button again within 30 ms, so a detection suggests worn switches. Try clicking slowly, one click at a time, and see whether the warning still appears.',
    },
    {
      question: 'Are my clicks or movements saved or sent anywhere?',
      answer:
        'No. Clicks and mouse movement are only used to show results on screen and are never uploaded or stored.',
    },
  ],
};
