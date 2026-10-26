import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '精度はどのように計算されますか？',
      answer:
        '命中数 ÷（命中数＋ミス数）で計算します。的の外をクリックするとミスとして数えられ、的はそのまま残るので、当てるまで続けられます。速さだけ追って雑にクリックすると精度が下がります。',
    },
    {
      question: '平均時間にはどこからどこまでの時間が含まれますか？',
      answer:
        '的が表示された時点から、その的への命中クリックが届くまでの時間です。モニターの表示遅延やマウス・タッチ画面の入力遅延も含まれるため、同じ環境で繰り返して比べる使い方に向いています。',
    },
    {
      question: 'ベスト記録はどこに保存されますか？',
      answer:
        'このブラウザのlocalStorageにだけ保存され、サーバーには送信されません。別のブラウザや端末とは共有されず、ブラウザのデータを消去すると失われます。保存できない環境では、ページを開いている間だけ記録されます。',
    },
    {
      question: 'スマホやタブレットでも練習できますか？',
      answer:
        'はい。的をタップして練習できます。ただし画面が小さいと練習エリアも狭くなり、マウスとは難しさが変わるため、記録の比較は同じ端末で行ってください。',
    },
  ],
  en: [
    {
      question: 'How is accuracy calculated?',
      answer:
        'Accuracy is hits ÷ (hits + misses). A click outside the target counts as a miss and the target stays put, so you keep trying until you hit it. Clicking sloppily for speed lowers your accuracy.',
    },
    {
      question: 'What does the average time measure?',
      answer:
        'It runs from the moment a target appears to the click that hits it. Display lag and input lag from your mouse or touchscreen are included, so it is best for comparing runs on the same setup.',
    },
    {
      question: 'Where is my best score stored?',
      answer:
        "Only in this browser's localStorage; nothing is sent to a server. It is not shared with other browsers or devices and is lost if you clear browser data. If storage is unavailable, it is kept only while the page is open.",
    },
    {
      question: 'Can I practice on a phone or tablet?',
      answer:
        'Yes, just tap the targets. A smaller screen means a smaller play area, so the difficulty differs from a mouse setup. Compare scores on the same device.',
    },
  ],
};
