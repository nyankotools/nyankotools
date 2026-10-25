import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ファイルはサーバーにアップロードされますか？',
      answer:
        'いいえ。ファイルはブラウザのメモリに読み込んでSHA-256を計算するだけで、外部へは送信されません。',
    },
    {
      question: 'どうやって重複を見つけていますか？',
      answer:
        'まずファイルサイズが同じものを候補にし、その候補だけSHA-256を計算します。サイズとハッシュ値の両方が一致したファイルを、中身が同じ重複として扱います。',
    },
    {
      question: '重複ファイルを自動で削除できますか？',
      answer:
        'できません。ブラウザからは選んだファイルを削除できないため、表示されたパスを見てご自身で整理してください。結果はコピーやCSVで保存できます。',
    },
    {
      question: '大きなファイルや大量のファイルでも使えますか？',
      answer:
        '1ファイルあたり256MBまでです。ファイル全体をメモリに読み込んで計算するため、同サイズのファイルが大量にあると時間がかかります。進捗は画面に表示されます。',
    },
    {
      question: 'ファイル名が違うのに重複になるのはなぜですか？',
      answer:
        '判定に使うのは中身だけで、名前や更新日時は見ていません。中身が1バイトも違わなければ、名前が違っても重複として表示されます。',
    },
  ],
  en: [
    {
      question: 'Are my files uploaded to a server?',
      answer:
        'No. Files are only read into your browser’s memory to compute SHA-256 and are never sent anywhere.',
    },
    {
      question: 'How are duplicates detected?',
      answer:
        'Files of the same size become candidates, and only those candidates are hashed with SHA-256. Files with both the same size and the same hash are treated as duplicates.',
    },
    {
      question: 'Can it delete the duplicates for me?',
      answer:
        'No. A browser page cannot delete files you picked, so use the listed paths to clean up yourself. You can copy the results or save them as CSV.',
    },
    {
      question: 'Does it work with very large files or many files?',
      answer:
        'Each file can be up to 256 MB. Whole files are read into memory to be hashed, so many same-sized files take a while; progress is shown on screen.',
    },
    {
      question: 'Why are files with different names reported as duplicates?',
      answer:
        'Only the contents are compared; names and modified dates are ignored. If every byte matches, the files are shown as duplicates whatever they are called.',
    },
  ],
};
