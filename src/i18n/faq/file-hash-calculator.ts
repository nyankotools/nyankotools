import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ファイルはサーバーにアップロードされますか？',
      answer:
        'いいえ。ファイルはブラウザのメモリに読み込んで計算するだけで、外部へは送信されません。ネットワークに接続していない状態でも動作します。',
    },
    {
      question: 'ダウンロードしたファイルが正しいか確認するにはどうしますか？',
      answer:
        '配布元のページに記載されているハッシュ値（SHA-256など）を「照合」欄に貼り付けてください。桁数から種類を自動で判定し、一致・不一致を表示します。',
    },
    {
      question: '大きなファイルは計算できますか？',
      answer:
        '1ファイルあたり256MBまでです。ファイル全体をメモリに読み込んで計算する方式のため、それを超えるファイルは計算できません。',
    },
    {
      question: 'MD5とSHA-256のどちらを見ればよいですか？',
      answer:
        '配布元が公開しているものに合わせてください。改ざんの検出が目的なら、SHA-256以上を公開しているものを選ぶのが安全です。MD5は転送中の破損チェック程度に考えてください。',
    },
    {
      question: '同じ内容なのに別のハッシュ値になるのはなぜですか？',
      answer:
        'ハッシュ値はバイト列そのものから計算されます。改行コードの違い、文字コードの違い、メタデータの更新など、見た目では分からない差でも値は変わります。',
    },
  ],
  en: [
    {
      question: 'Are my files uploaded to a server?',
      answer:
        'No. Files are only read into your browser’s memory to be hashed and are never sent anywhere. The tool keeps working even without a network connection.',
    },
    {
      question: 'How do I check that a downloaded file is correct?',
      answer:
        'Paste the hash (such as SHA-256) shown on the download page into the compare field. The algorithm is detected from the length, and a match or mismatch is shown.',
    },
    {
      question: 'Can I hash large files?',
      answer:
        'Files up to 256 MB each. The whole file is loaded into memory to be hashed, so anything larger cannot be calculated.',
    },
    {
      question: 'Should I look at MD5 or SHA-256?',
      answer:
        'Match whatever the publisher provides. If your goal is detecting tampering, prefer a source that publishes SHA-256 or stronger; treat MD5 as a check for corruption in transit.',
    },
    {
      question: 'Why does what looks like the same file give a different hash?',
      answer:
        'A hash is computed from the exact bytes. Differences you cannot see, such as line endings, text encoding, or updated metadata, change the value.',
    },
  ],
};
