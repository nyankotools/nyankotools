import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'WCAGのAAとAAAの違いは何ですか？',
      answer:
        '通常のテキストでは、AAはコントラスト比4.5:1以上、AAAは7:1以上が必要です。大きな文字ではAAが3:1以上、AAAが4.5:1以上です。多くのサイトはまずAAの達成を目標にします。',
    },
    {
      question: '「大きな文字」とはどのくらいのサイズですか？',
      answer:
        'WCAGでは、通常の太さで18pt（約24px）以上、または太字で14pt（約18.66px）以上の文字を大きな文字とみなします。大きな文字は基準が緩やかです。',
    },
    {
      question: '画像内の文字やロゴにも適用されますか？',
      answer:
        'ロゴや装飾的な要素はWCAGのコントラスト基準の対象外ですが、ボタンやアイコンなど機能を持つUI要素には3:1以上が求められます。このツールは文字色と背景色の2色間の比を計算します。',
    },
  ],
  en: [
    {
      question: 'What is the difference between WCAG AA and AAA?',
      answer:
        'For normal text, AA requires a contrast ratio of at least 4.5:1 and AAA requires 7:1. For large text, AA requires 3:1 and AAA requires 4.5:1. Most sites aim for AA first.',
    },
    {
      question: 'What counts as "large text"?',
      answer:
        'Under WCAG, large text is at least 18pt (about 24px) at regular weight, or at least 14pt (about 18.66px) in bold. The requirements are lower for large text.',
    },
    {
      question: 'Does it apply to logos and text in images?',
      answer:
        'Logos and purely decorative elements are exempt, but functional UI components such as buttons and icons need at least 3:1. This tool calculates the ratio between two colors.',
    },
  ],
};
