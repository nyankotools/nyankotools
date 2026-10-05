import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ファイルはサーバーにアップロードされますか？',
      answer:
        'いいえ。ZIPの作成も解凍もブラウザの中だけで行い、ファイルは外部へ送信されません。ネットワークに接続していない状態でも動作します。',
    },
    {
      question: 'パスワード付きのZIPは作れますか？開けますか？',
      answer:
        'どちらも対応していません。パスワード付きZIPを読み込むと「開けません」と表示されます。内容を守りたい場合は、暗号化ツールで先にファイルを暗号化してからZIPにまとめてください。',
    },
    {
      question: '何MBまで扱えますか？',
      answer:
        '合計100MB・5,000ファイルまでです。すべてブラウザのメモリ上で処理する方式のため、それを超える大きさのものは扱えません。',
    },
    {
      question:
        'ZIPにまとめても、ファイルサイズがあまり小さくならないのはなぜですか？',
      answer:
        'JPEG・PNG・MP4・PDFなどは、すでに圧縮されているためです。これらはZIPにしてもほとんど小さくならず、複数ファイルを1つにまとめる目的で使うのが現実的です。',
    },
    {
      question: '解凍したZIPのファイル名が文字化けしませんか？',
      answer:
        'UTF-8のファイル名で作られたZIPは正しく表示されます。ただし、古い環境で作られた文字コード（Shift_JISなど）のZIPは、ファイル名が正しく表示されないことがあります。',
    },
  ],
  en: [
    {
      question: 'Are my files uploaded to a server?',
      answer:
        'No. Creating and opening ZIPs happens entirely in your browser, and the files are never sent anywhere. It works offline too.',
    },
    {
      question: 'Can it create or open password-protected ZIPs?',
      answer:
        'Neither is supported. A password-protected ZIP is reported as unable to open. To protect the contents, encrypt the files with an encryption tool first, then bundle them.',
    },
    {
      question: 'How large a ZIP can it handle?',
      answer:
        'Up to 100 MB in total and 5,000 files. Everything is held in browser memory, so anything larger cannot be processed.',
    },
    {
      question: 'Why does my ZIP barely get smaller than the original files?',
      answer:
        'JPEG, PNG, MP4 and PDF files are already compressed, so zipping them saves little. In that case ZIP is mainly useful for bundling several files into one.',
    },
    {
      question: 'Will file names in an extracted ZIP be garbled?',
      answer:
        'ZIPs that store UTF-8 file names display correctly. ZIPs made on older systems with a legacy encoding (such as Shift_JIS) may show unreadable names.',
    },
  ],
};
