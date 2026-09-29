import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'パスワードを解除するとPDFはどう変わりますか？',
      answer:
        '解除後のPDFは各ページを画像化して作り直すため、文字の選択・検索ができなくなり、ファイルサイズが大きくなることがあります。ダウンロードされるPDFにはパスワードは掛かりません。',
    },
    {
      question: 'パスワードを知らないPDFの保護を外せますか？',
      answer:
        'できません。パスワードを知っているPDFの保護を解除するための機能で、パスワードの解析や回避は行いません。',
    },
    {
      question: 'できる操作は何ですか？',
      answer:
        'ページの回転、不要なページの削除、順番の入れ替えができます。複数ファイルの結合や範囲指定の抽出は、PDF結合・分割・ページ抽出ツールをご利用ください。',
    },
  ],
  en: [
    {
      question: 'How does the PDF change after unlocking?',
      answer:
        'The unlocked PDF is rebuilt from page images, so text can no longer be selected or searched and the file may grow. The downloaded PDF has no password.',
    },
    {
      question:
        'Can it remove protection from a PDF I do not know the password for?',
      answer:
        'No. It only unlocks PDFs when you already know the password; it does not crack or bypass passwords.',
    },
    {
      question: 'What operations are available?',
      answer:
        'You can rotate pages, delete pages and reorder them. To merge files or extract page ranges, use the PDF merge/split tool.',
    },
  ],
};
