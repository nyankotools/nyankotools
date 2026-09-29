import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'LF・CRLF・CRはそれぞれどのOSで使われますか？',
      answer:
        'LFはLinuxやmacOS、CRLFはWindows、CRは古いMac OSで使われてきた改行コードです。混在するとGitの差分に無関係な変更が出るため、統一しておくと安全です。',
    },
    {
      question: '貼り付けたテキストの改行コードが判定できないのはなぜですか？',
      answer:
        'ブラウザの仕様で、テキスト欄に貼り付けや入力をした改行は自動でLFに変換されます。既存ファイルの改行コードを正確に判定・変換したいときは、「ファイルを読み込む」から読み込んでください。',
    },
    {
      question: 'Shift_JISのファイルも変換できますか？',
      answer:
        '読み込んだファイルはUTF-8として扱うため、Shift_JISなどのファイルは文字化けすることがあります。文字コードの変換が必要な場合は、文字コード変換ツールを先にお使いください。',
    },
  ],
  en: [
    {
      question: 'Which systems use LF, CRLF and CR?',
      answer:
        'LF is used on Linux and macOS, CRLF on Windows, and CR by classic Mac OS. Mixed endings cause noisy Git diffs, so it is safer to standardize.',
    },
    {
      question: "Why can't it detect the line endings of pasted text?",
      answer:
        'Browsers normalize line breaks in text fields to LF. To detect and convert the endings of an existing file accurately, load it with the file input.',
    },
    {
      question: 'Can I convert Shift_JIS files?',
      answer:
        'Loaded files are read as UTF-8, so Shift_JIS files may be garbled. Convert the character encoding first with the encoding converter.',
    },
  ],
};
