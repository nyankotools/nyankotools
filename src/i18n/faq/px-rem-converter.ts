import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'remとpxの換算の基準は何ですか？',
      answer:
        'remはhtml要素のfont-size（ベースフォントサイズ）を基準にした相対単位です。ブラウザの初期値は16pxなので、1remは16px、0.5remは8pxになります。',
    },
    {
      question: 'ベースフォントサイズを変えると入力済みの値はどうなりますか？',
      answer:
        'ベースフォントサイズを変更すると、すでに入力したpxとremの欄も新しい基準で再計算されます。プロジェクトの設定に合わせて先に基準を指定しておくと確実です。',
    },
    {
      question: 'remとemはどう違いますか？',
      answer:
        'remは常にhtml要素を基準にしますが、emはその要素の親（または自身）のfont-sizeを基準にするため、入れ子になると値が積み重なります。サイズの見通しを立てやすいのはremです。',
    },
  ],
  en: [
    {
      question: 'What is the baseline for converting rem to px?',
      answer:
        'rem is relative to the font-size of the html element (the base font size). Browsers default to 16px, so 1rem is 16px and 0.5rem is 8px.',
    },
    {
      question:
        'What happens to entered values when I change the base font size?',
      answer:
        'Both the px and rem fields are recalculated with the new base. Set the base to match your project first to avoid surprises.',
    },
    {
      question: 'How is rem different from em?',
      answer:
        'rem always refers to the html element, while em refers to the parent (or own) font-size, so values compound when nested. rem is easier to reason about.',
    },
  ],
};
