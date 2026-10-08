import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '平均的な反応速度はどれくらいですか？',
      answer:
        '視覚刺激への反応は200〜250ミリ秒前後が一般的な目安です。ゲームなどに慣れた人は150〜200ミリ秒台に入ることもあります。100ミリ秒を切る値は、フライングや偶然の可能性が高いです。',
    },
    {
      question: '測定値には機器の遅延も含まれますか？',
      answer:
        '含まれます。モニターの表示遅延、マウスやキーボード、タッチ画面の入力遅延、ブラウザの処理時間が加わるため、純粋な反応速度より数十ミリ秒長く出ます。同じ機器で繰り返し比べる使い方に向いています。',
    },
    {
      question: 'フライングはどう判定されますか？',
      answer:
        '画面が赤い待機中に操作すると、フライングとなりその回は無効です。クリックするとやり直せます。緑になるまでの時間は1.5〜5秒の範囲で毎回ランダムなので、タイミングを予測しても当たりません。',
    },
    {
      question: 'スマホやキーボードでも測れますか？',
      answer:
        'はい。測定エリアのタップ、またはSpaceキーでも操作できます。ただしタッチ画面は入力遅延が大きいことがあり、マウスやキーボードと値が異なる場合があります。',
    },
  ],
  en: [
    {
      question: 'What is an average reaction time?',
      answer:
        'Visual reaction time is typically around 200–250 ms. Experienced gamers sometimes reach the 150–200 ms range. A result under 100 ms is most likely a false start or a lucky guess.',
    },
    {
      question: 'Does the result include hardware lag?',
      answer:
        'Yes. Display lag, input lag from the mouse, keyboard or touchscreen, and browser processing time are all included, so the number is tens of milliseconds above your pure reaction time. It works best for comparing results on the same setup.',
    },
    {
      question: 'How are false starts detected?',
      answer:
        'If you press while the screen is still red, it counts as a false start and that round is discarded; click to retry. The wait is a random 1.5 to 5 seconds each time, so you cannot predict the moment.',
    },
    {
      question: 'Can I use a phone or the keyboard?',
      answer:
        'Yes. You can tap the test area or press Space. Touchscreens often add more input lag, so results may differ from those on a mouse or keyboard.',
    },
  ],
};
