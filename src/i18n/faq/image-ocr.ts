import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '画像はサーバーにアップロードされますか？',
      answer:
        'いいえ。文字認識はお使いのブラウザ内（WebAssembly）で実行され、画像も認識結果も外部に送信されません。認識エンジンと言語データもこのサイト自身から読み込み、外部のCDNは使いません。',
    },
    {
      question: '初回だけ認識が始まるまで時間がかかるのはなぜですか？',
      answer:
        '認識エンジンと言語データ（日本語・英語で合計数MB）を読み込むためです。一度読み込んだデータはブラウザに保存され、2回目以降は短時間で始まります。',
    },
    {
      question: '手書きや縦書きの文字も読み取れますか？',
      answer:
        '精度は大きく下がります。このツールは印刷された横書きの文字を想定しており、手書き、縦書き、装飾の強いフォント、小さな文字は誤認識や抜けが増えます。できるだけ解像度が高くコントラストのはっきりした画像をお使いください。',
    },
    {
      question: '認識結果に間違いが多いときはどうすればよいですか？',
      answer:
        '画像を拡大する、文字部分だけを切り抜く、傾きを直す、言語を日本語のみ・英語のみに絞るといった方法で改善することがあります。それでも完全な正確さは保証できないため、結果は原本と照らして確認してください。',
    },
    {
      question: '表やレイアウトも再現されますか？',
      answer:
        'いいえ。罫線や段組みは再現されず、読み取った文字が順に並ぶだけです。表の内容を扱う場合は、結果をコピーしたうえで別途整形してください。',
    },
  ],
  en: [
    {
      question: 'Is my image uploaded to a server?',
      answer:
        'No. Recognition runs inside your browser (WebAssembly), and neither the image nor the result is sent anywhere. The OCR engine and language data are also loaded from this site itself, not from an external CDN.',
    },
    {
      question: 'Why is the first run slower to start?',
      answer:
        'The OCR engine and language data (a few MB for English and Japanese) have to be loaded first. They are then saved in your browser, so later runs start much faster.',
    },
    {
      question: 'Can it read handwriting or vertical text?',
      answer:
        'Accuracy drops sharply. The tool is meant for printed, horizontal text; handwriting, vertical text, decorative fonts and small text produce more mistakes and gaps. Use an image with high resolution and clear contrast whenever you can.',
    },
    {
      question: 'What can I do if the result has many errors?',
      answer:
        'Enlarging the image, cropping to the text, straightening a tilted shot, or limiting the language to Japanese only or English only can help. Accuracy is never guaranteed, so check the result against the original.',
    },
    {
      question: 'Are tables and layout preserved?',
      answer:
        'No. Borders and columns are not reproduced; the recognized text is just listed in reading order. If you need a table, copy the result and format it separately.',
    },
  ],
};
