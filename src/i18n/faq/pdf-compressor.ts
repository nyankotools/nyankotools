import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '圧縮するとPDFの文字は選択・検索できなくなりますか？',
      answer:
        'はい。各ページを画像として再圧縮するため、圧縮後は文字の選択・検索・コピーができなくなり、リンクやしおり、フォームも失われます。',
    },
    {
      question: 'どんなPDFで圧縮効果が高いですか？',
      answer:
        '写真やスキャン画像が中心のPDFでは効果が大きくなります。文字中心のPDFは、画像化することで元より大きくなることがあります。',
    },
    {
      question: 'PDFファイルはサーバーに送られますか？',
      answer:
        'いいえ。すべてブラウザ内で処理され、ファイルが端末の外に出ることはありません。',
    },
  ],
  en: [
    {
      question: 'Will text remain selectable after compression?',
      answer:
        'No. Each page is re-compressed as an image, so text can no longer be selected, searched or copied, and links, bookmarks and forms are lost.',
    },
    {
      question: 'Which PDFs compress best?',
      answer:
        'PDFs made mostly of photos or scans shrink the most. Text-based PDFs may even become larger after being converted to images.',
    },
    {
      question: 'Is my PDF uploaded to a server?',
      answer:
        'No. Everything is processed in your browser and the file never leaves your device.',
    },
  ],
};
