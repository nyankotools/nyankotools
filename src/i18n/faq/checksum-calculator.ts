import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'CRC-32とSHA-256はどう使い分けますか？',
      answer:
        'CRC-32は通信やファイルの偶発的な破損を素早く検出する用途向けです。意図的な改ざんは検出できないため、安全性が必要な場合はSHA-256などの暗号ハッシュを使ってください。',
    },
    {
      question: '他のツールとCRC-16の値が合いません。',
      answer:
        'CRC-16には多項式や初期値の異なる派生が多数あります。このツールでは ARC・CCITT-FALSE・XMODEM の3種を表示するので、相手のツールと同じ種類の値を比べてください。',
    },
    {
      question: 'テキストのチェックサムが他の環境と違うのはなぜですか？',
      answer:
        'テキストはUTF-8のバイト列として計算します。Shift_JISなど別の文字コードや、改行コード（LF/CRLF）の違いがあると値が変わります。',
    },
    {
      question: '大きなファイルも計算できますか？',
      answer:
        '1ファイルあたり1GBまで計算できます。4MBずつ順に読み込むため、ファイル全体をメモリに載せることはありません。ファイルはサーバーに送信されません。',
    },
    {
      question: 'Fletcher-32の末尾が奇数バイトのときはどうなりますか？',
      answer:
        '16ビット単位で計算するため、最後に1バイト余る場合は上位を0で埋めた1ワードとして扱います。実装によって扱いが異なることがあります。',
    },
  ],
  en: [
    {
      question: 'When should I use CRC-32 instead of SHA-256?',
      answer:
        'CRC-32 is for quickly catching accidental corruption in transfers or files. It cannot detect deliberate tampering, so use a cryptographic hash such as SHA-256 where security matters.',
    },
    {
      question: 'My CRC-16 value does not match another tool.',
      answer:
        'CRC-16 has many variants with different polynomials and initial values. This tool shows ARC, CCITT-FALSE, and XMODEM, so compare against the same variant in the other tool.',
    },
    {
      question: 'Why does a text checksum differ from another environment?',
      answer:
        'Text is checksummed as UTF-8 bytes. A different encoding such as Shift_JIS, or different line endings (LF vs CRLF), changes the value.',
    },
    {
      question: 'Can I checksum large files?',
      answer:
        'Yes, up to 1 GB per file. The file is read in 4 MB chunks, so it is never loaded into memory all at once, and it is never uploaded.',
    },
    {
      question: 'How does Fletcher-32 handle an odd number of bytes?',
      answer:
        'It works on 16-bit words, so a single leftover byte is treated as a word padded with zeros. Other implementations may handle this differently.',
    },
  ],
};
