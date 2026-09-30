import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ページ範囲はどのように指定しますか？',
      answer:
        'カンマ区切りでページ番号を指定します。「1-3」は1〜3ページ、「8-」は8ページ目から最後までを表します。指定した順にページが並びます。',
    },
    {
      question: '結合したPDFの品質は落ちますか？',
      answer:
        'ページを画像に変換せずにそのまま組み合わせるため、文字や画質は元のまま維持されます。',
    },
    {
      question: 'パスワード付きのPDFも扱えますか？',
      answer:
        'パスワードで保護されたPDFはそのままでは扱えません。先にPDFページ回転・削除・並び替えツールでパスワードを解除してから使ってください。',
    },
  ],
  en: [
    {
      question: 'How do I specify page ranges?',
      answer:
        'Separate page numbers with commas. "1-3" means pages 1 to 3, and "8-" means page 8 through the end. Pages appear in the order you list them.',
    },
    {
      question: 'Does merging reduce quality?',
      answer:
        'Pages are combined as they are, without being converted to images, so text and quality are preserved.',
    },
    {
      question: 'Can I use password-protected PDFs?',
      answer:
        'Password-protected PDFs cannot be processed directly. Unlock them first with the PDF page editor.',
    },
  ],
};
