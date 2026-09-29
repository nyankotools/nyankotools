import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'OGP画像のおすすめサイズはありますか？',
      answer:
        '横1200px×縦630px程度（アスペクト比1.91:1）が推奨です。X（旧Twitter）のsummary_large_imageカードもほぼ同じ比率を想定しています。',
    },
    {
      question: '未入力の項目はどうなりますか？',
      answer:
        '入力した項目に対応するタグだけが出力され、空のcontent属性を持つタグは生成されません。不要なタグを手作業で削除する必要はありません。',
    },
    {
      question: 'シェアプレビューは実際の表示と同じですか？',
      answer:
        '同じではありません。通信を行わない設計のため、画像は読み込まずURLを表示するだけです。実際の見た目は、公開後に各SNSの公式デバッグツールで確認してください。',
    },
  ],
  en: [
    {
      question: 'What is the recommended OGP image size?',
      answer:
        'About 1200 × 630 px (aspect ratio 1.91:1). The Twitter/X summary_large_image card expects roughly the same ratio.',
    },
    {
      question: 'What happens to fields I leave empty?',
      answer:
        'Only tags for filled-in fields are output; tags with empty content attributes are never generated.',
    },
    {
      question: 'Does the share preview match the real appearance?',
      answer:
        "Not exactly. Because the tool makes no network requests, it only shows the image URL without loading it. Check the real result with each platform's official debugger after publishing.",
    },
  ],
};
