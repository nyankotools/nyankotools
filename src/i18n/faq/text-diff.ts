import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '行の中の変更箇所だけをハイライトできますか？',
      answer:
        'できません。比較は行単位で行われ、変更された行全体が追加（緑）または削除（赤）として表示されます。1行の中の一部分だけを強調する機能はありません。',
    },
    {
      question: '大きなファイルを比較しても問題ありませんか？',
      answer:
        '数千行を超えるような非常に長いテキストでは、ブラウザの処理が重くなる場合があります。大きなファイルは分割して比較してください。',
    },
    {
      question: '比較したテキストは外部に送信されますか？',
      answer:
        'いいえ。すべてブラウザ内で処理され、入力したテキストがサーバーに送信されることはありません。設定ファイルの比較にも安心して使えます。',
    },
  ],
  en: [
    {
      question: 'Can it highlight only the changed part within a line?',
      answer:
        'No. Comparison is line-based, and a changed line appears as a whole as added (green) or removed (red).',
    },
    {
      question: 'Is it fine to compare large files?',
      answer:
        'Very long texts, several thousand lines or more, may slow the browser down. Split large files into parts.',
    },
    {
      question: 'Is the compared text sent anywhere?',
      answer:
        'No. It is processed entirely in your browser, so it is safe for comparing configuration files.',
    },
  ],
};
