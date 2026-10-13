import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'animationとtransitionはどう使い分けますか？',
      answer:
        'transitionはホバーなど「状態が変わった時」に2つの値の間を補間するもので、開始・終了の2点だけを扱います。animationは@keyframesで途中経過を複数指定でき、繰り返しや往復、自動再生ができます。ロード時の演出やループにはanimationが向いています。',
    },
    {
      question: 'fill-modeのforwardsとbackwardsの違いは何ですか？',
      answer:
        'forwardsはアニメーション終了後も最後のキーフレームの状態を保持します。backwardsは遅延（delay）の間も最初のキーフレームの状態を適用します。両方必要な場合はbothを指定します。',
    },
    {
      question: 'cubic-bezierのyを範囲外にするとどうなりますか？',
      answer:
        'y1・y2を0〜1の外にすると、動きが目標を行き過ぎてから戻るオーバーシュートになります。x1・x2はCSSの仕様上0〜1に限られます。',
    },
    {
      question: 'prefers-reduced-motionは入れたほうがよいですか？',
      answer:
        '動きの多い表示が苦手な人のために、入れることをおすすめします。このツールでは出力に@media (prefers-reduced-motion: reduce)ブロックを含め、その場合はanimation: noneにします。ループや大きな動きのアニメーションで特に有効です。',
    },
  ],
  en: [
    {
      question: 'When should I use animation instead of transition?',
      answer:
        'A transition interpolates between two values when a state changes, such as on hover, so it only handles a start and an end. An animation uses @keyframes with any number of steps and can loop, alternate, and play automatically. Use animation for load-in effects and loops.',
    },
    {
      question:
        'What is the difference between fill-mode forwards and backwards?',
      answer:
        'forwards keeps the last keyframe applied after the animation ends. backwards applies the first keyframe during the delay. Use both when you need each behavior.',
    },
    {
      question: 'What happens if I set cubic-bezier y values outside 0–1?',
      answer:
        'Values of y1 or y2 outside 0–1 make the motion overshoot its target and then settle back. x1 and x2 must stay within 0–1 per the CSS specification.',
    },
    {
      question: 'Should I add prefers-reduced-motion?',
      answer:
        'It is recommended for visitors who are sensitive to motion. With this option, the output includes an @media (prefers-reduced-motion: reduce) block that sets animation: none, which matters most for loops and large movements.',
    },
  ],
};
