import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'clamp()の推奨値（vwを含む式）はどう計算されていますか？',
      answer:
        '傾き=(最大サイズ−最小サイズ)÷(最大幅−最小幅)、切片=最小サイズ−傾き×最小幅として、「切片 + 傾き×100vw」を推奨値にしています。最小幅で最小サイズ、最大幅で最大サイズになります。',
    },
    {
      question: 'remとpxのどちらで出力すべきですか？',
      answer:
        'ユーザーがブラウザの文字サイズ設定を変えたときに追従するため、通常はrem出力がおすすめです。remはベースフォントサイズ（通常16px）で換算されます。',
    },
    {
      question: '推奨値にvwだけでなく切片も入っているのはなぜですか？',
      answer:
        'vwだけだとブラウザのズームや文字拡大に追従しにくくなります。rem（またはpx）の切片を足すことで、拡大時の読みやすさを保ちつつ画面幅に応じて変化させられます。',
    },
    {
      question: '最小サイズを最大サイズより大きくできますか？',
      answer:
        'できます。画面が広いほど小さくなる設定の場合、clamp()の最小値と最大値は小さい方・大きい方に自動で入れ替えて出力します。',
    },
  ],
  en: [
    {
      question: 'How is the preferred value (the part with vw) calculated?',
      answer:
        'slope = (max size - min size) / (max width - min width), intercept = min size - slope x min width. The preferred value is "intercept + slope x 100vw", giving the min size at the min width and the max size at the max width.',
    },
    {
      question: 'Should I output rem or px?',
      answer:
        "rem is usually better because it follows the user's browser text-size setting. rem values are converted with the base font size (normally 16px).",
    },
    {
      question:
        'Why does the preferred value include an intercept, not just vw?',
      answer:
        'A vw-only value does not react well to browser zoom or text enlargement. Adding a rem (or px) intercept keeps text readable when zoomed while still scaling with the viewport.',
    },
    {
      question: 'Can the min size be larger than the max size?',
      answer:
        'Yes. For text that shrinks on wider screens, the first and last clamp() arguments are swapped automatically so the smaller value comes first.',
    },
  ],
};
