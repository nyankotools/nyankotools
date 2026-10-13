import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '27インチのモニターの幅と高さは何cmですか？',
      answer:
        '縦横比が16:9なら幅は約59.8cm、高さは約33.6cmです。対角サイズ27インチは68.58cmで、縦横比から幅と高さを計算しています。縦横比が16:10なら幅約58.2cm、高さ約36.3cmになります。',
    },
    {
      question: 'PPIはどう計算しますか？ 何PPIあれば十分ですか？',
      answer:
        '解像度の対角画素数（√(横² + 縦²)）を対角インチで割ります。27インチ・4Kなら約163PPI、フルHDなら約82PPIです。一般に、パソコンのモニターは100PPI前後、スマホは300PPI以上だと細かく見えます。',
    },
    {
      question: '視聴距離の目安はどのように求めていますか？',
      answer:
        '視力1.0（1分角）で1画素が見分けにくくなる距離（ドットピッチ×約3438）と、画面全体を見渡しやすい対角の1.0〜1.5倍を表示します。個人差があるため、あくまで概算としてお使いください。',
    },
    {
      question: '画面の縦横比と解像度の縦横比が違うとどうなりますか？',
      answer:
        '画面の物理サイズは入力した縦横比から、PPIは解像度の対角画素数から計算します。両者が異なる場合は差を表示します。画素が正方形でない特殊な表示ではPPIが縦横で異なるため、概算になります。',
    },
  ],
  en: [
    {
      question: 'What are the width and height of a 27-inch monitor in cm?',
      answer:
        'For a 16:9 screen it is about 59.8 cm wide and 33.6 cm tall. The 27-inch diagonal is 68.58 cm, and the width and height follow from the aspect ratio. A 16:10 screen of the same diagonal is about 58.2 cm by 36.3 cm.',
    },
    {
      question: 'How is PPI calculated, and how much is enough?',
      answer:
        'Divide the diagonal pixel count, √(width² + height²), by the diagonal in inches. A 27-inch 4K screen is about 163 PPI and a 27-inch Full HD screen about 82 PPI. As a rough guide, desktop monitors around 100 PPI and phones above 300 PPI look sharp.',
    },
    {
      question: 'How is the viewing distance estimated?',
      answer:
        'It shows the distance where one pixel subtends one arcminute (20/20 vision, dot pitch × about 3438) and a comfortable range of 1.0 to 1.5 times the diagonal. Vision and habits vary, so treat the values as estimates.',
    },
    {
      question: 'What if the screen ratio and the resolution ratio differ?',
      answer:
        'The physical size comes from the ratio you enter, while PPI comes from the diagonal pixel count of the resolution. When they differ the tool shows the gap. With non-square pixels the horizontal and vertical PPI differ, so the value is approximate.',
    },
  ],
};
