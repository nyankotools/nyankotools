import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '履歴書の証明写真は何mmで作ればよいですか？',
      answer:
        '一般的な履歴書の写真欄は縦40mm×横30mmです。書式によって縦45mm×横34mmのものもあるので、提出先の書式で写真欄の大きさを確認して、サイズを選んでください。',
    },
    {
      question: '背景を白や青に変えることはできますか？',
      answer:
        '人物と背景を自動で分けることはできません。変えられるのは、写真が枠に収まらず余白ができた部分の色だけです。背景を揃えたいときは、無地の壁の前で撮影してください。',
    },
    {
      question: 'どの解像度で保存すればよいですか？',
      answer:
        '一般的なプリントでは300dpiで十分です。ネットプリントなどで高精細な出力が必要なときは600dpiを選べますが、元の写真の画素数が足りないと粗くなります。',
    },
    {
      question: '撮影した写真は保存・送信されますか？',
      answer:
        'いいえ。撮影も加工もブラウザ内で完結し、サーバーへの送信や保存はされません。ダウンロードするまで端末の外には出ません。',
    },
  ],
  en: [
    {
      question: 'What size should a Japanese resume photo be?',
      answer:
        'The photo box on a typical Japanese resume is 30 mm wide by 40 mm tall. Some formats use 34 × 45 mm, so check the box on your form and pick that size.',
    },
    {
      question: 'Can I change the background to white or blue?',
      answer:
        'No, the tool cannot separate a person from the background. It only fills margins that appear when the photo does not cover the frame. For a uniform background, shoot in front of a plain wall.',
    },
    {
      question: 'Which resolution should I save at?',
      answer:
        '300 dpi is enough for ordinary prints. Pick 600 dpi for high-detail print services, but a low-pixel source photo will still look rough.',
    },
    {
      question: 'Is my photo saved or uploaded?',
      answer:
        'No. Shooting and editing happen entirely in your browser, and nothing is sent or stored. The photo only leaves your device when you download it.',
    },
  ],
};
