import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'テキスト差分比較ツールとの違いは何ですか？',
      answer:
        '差分比較は違いを表示するだけですが、このツールは差分の箇所ごとにAとBのどちらを採用するか選んで、1つのテキストに統合できます。結果は手で編集してコピー・ダウンロードもできます。',
    },
    {
      question: '行の一部分だけを取り込めますか？',
      answer:
        '比較は行単位のため、1行の一部だけを自動で取り込むことはできません。その場合は、近い方を選んだうえでマージ結果欄を直接編集してください。',
    },
    {
      question:
        'マージ結果を手で編集したあとに、採用を変えるとどうなりますか？',
      answer:
        'A・Bの入力や差分ごとの採用を変更すると、マージ結果は選択内容に従って作り直され、手での編集は失われます。手動の修正は最後に行い、必要ならコピーしてから選び直してください。',
    },
    {
      question: '入力したテキストは外部に送信されますか？',
      answer:
        'いいえ。すべてブラウザ内で処理され、入力したテキストがサーバーに送信されることはありません。',
    },
  ],
  en: [
    {
      question: 'How is this different from the text diff checker?',
      answer:
        'A diff checker only shows the differences. This tool lets you choose A or B for each difference and combine them into one text, which you can edit, copy, or download.',
    },
    {
      question: 'Can I take only part of a line?',
      answer:
        'Comparison is line-based, so part of a line cannot be taken automatically. Pick the closer side, then edit the merged result directly.',
    },
    {
      question:
        'What happens if I edit the merged result and then change a choice?',
      answer:
        'Changing A, B, or a per-difference choice rebuilds the merged result from your choices, discarding hand edits. Do manual fixes last, and copy the result before re-choosing if you need to keep it.',
    },
    {
      question: 'Is the text sent anywhere?',
      answer:
        'No. Everything is processed in your browser; the text you enter is never sent to a server.',
    },
  ],
};
