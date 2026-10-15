import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'シミュレーション結果は実際の見え方と同じですか？',
      answer:
        '標準的な変換モデル（Machado et al. 2009）による近似です。色覚は個人差が大きく、同じ型でも見え方は異なります。あくまでデザイン確認の目安としてお使いください。',
    },
    {
      question: 'P型・D型・T型の違いは何ですか？',
      answer:
        '色を感じる3種類の錐体のうち、赤に関わるものがP型（1型）、緑に関わるものがD型（2型）、青に関わるものがT型（3型）です。日本ではP型・D型が大多数で、T型や全色盲はまれです。',
    },
    {
      question: '「程度」を下げるとどうなりますか？',
      answer:
        '元の色と完全な2色覚の見え方の間を線形に補間し、軽度の色弱に近い見え方を表示します。100%が完全な2色覚で、全色盲には影響しません。',
    },
    {
      question: 'アップロードした画像はサーバーに送られますか？',
      answer:
        'いいえ。画像はブラウザ内のCanvasで処理され、外部には一切送信されません。',
    },
  ],
  en: [
    {
      question: 'Is the simulation the same as what people actually see?',
      answer:
        'It is an approximation from a standard model (Machado et al. 2009). Color vision varies a lot between individuals, even within one type, so treat it as a guide for design checks.',
    },
    {
      question: 'What is the difference between protan, deutan and tritan?',
      answer:
        'Of the three cone types, protan affects the red cone, deutan the green cone, and tritan the blue cone. Protan and deutan are by far the most common; tritan and total color blindness are rare.',
    },
    {
      question: 'What does lowering "Severity" do?',
      answer:
        'It linearly interpolates between the original color and full dichromacy to approximate milder color vision deficiency. 100% is full dichromacy, and it has no effect on achromatopsia.',
    },
    {
      question: 'Is my image uploaded to a server?',
      answer:
        'No. The image is processed with a canvas in your browser and never leaves your device.',
    },
  ],
};
