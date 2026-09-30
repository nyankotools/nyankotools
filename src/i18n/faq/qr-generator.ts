import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '誤り訂正レベルとは何ですか？どれを選べばよいですか？',
      answer:
        'QRコードの一部が汚れたり欠けたりしても読み取れるようにする冗長データの量です。レベルを上げると読み取りに強くなりますが、入力できる文字数は減ります。通常のURLなら中程度で十分です。',
    },
    {
      question: '長い文章を入力すると生成できないのはなぜですか？',
      answer:
        '入力できる文字数は誤り訂正レベルによって変わります。長いテキストやURLで生成できないときは、誤り訂正レベルを下げるか、内容を短縮してください。',
    },
    {
      question: '作成したQRコードは商用利用できますか？',
      answer:
        '生成したQRコード自体は自由に利用できます。なお「QRコード」は株式会社デンソーウェーブの登録商標です。印刷物に使う場合は、実際にスマートフォンで読み取れるか確認しておくと安心です。',
    },
  ],
  en: [
    {
      question: 'What is the error correction level and which should I choose?',
      answer:
        'It is the amount of redundant data that lets a QR code be read even if part is dirty or damaged. Higher levels are more robust but hold less data. A medium level is fine for ordinary URLs.',
    },
    {
      question: "Why can't I generate a code from long text?",
      answer:
        'Capacity depends on the error correction level. If long text or a URL fails, lower the level or shorten the content.',
    },
    {
      question: 'Can I use the QR codes commercially?',
      answer:
        'The generated codes are yours to use. "QR Code" is a registered trademark of Denso Wave Inc. When printing, test that a smartphone can actually scan it.',
    },
  ],
};
