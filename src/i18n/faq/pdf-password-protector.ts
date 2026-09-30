import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'パスワードを忘れたらPDFを開けますか？',
      answer:
        '開けません。このツールではパスワードを復元できないため、必ず控えを安全な場所に保管してください。',
    },
    {
      question: 'どの方式で暗号化されますか？',
      answer:
        '「開くためのパスワード」を設定し、AES-256で暗号化して保存します。ファイルもパスワードもブラウザ内で処理され、端末の外には出ません。',
    },
    {
      question: 'すでにパスワード付きのPDFにも使えますか？',
      answer:
        'いいえ。すでにパスワードで保護されているPDFは処理できません。先に保護を解除してから利用してください。',
    },
  ],
  en: [
    {
      question: 'What if I forget the password?',
      answer:
        'You will not be able to open the PDF, and this tool cannot recover the password. Keep a copy in a safe place.',
    },
    {
      question: 'What encryption is used?',
      answer:
        'An open password is set and the PDF is encrypted with AES-256. The file and password are processed in your browser and never leave your device.',
    },
    {
      question: 'Does it work on PDFs that are already protected?',
      answer:
        'No. PDFs that already have a password cannot be processed. Remove the existing protection first.',
    },
  ],
};
