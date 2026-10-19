import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'セルの中で改行したり、縦線（|）を入力したりできますか？',
      answer:
        'できます。セル内の改行はShift+Enterで入力でき、出力では br タグ（<br>）になります。縦線（|）はバックスラッシュ付き（\\|）にエスケープされるので、表が崩れません。',
    },
    {
      question: '既存のMarkdownテーブルを編集できますか？',
      answer:
        '入力欄に貼り付けて読み込みボタンを押すと、表に展開されます。区切り行の「:--」「:-:」「--:」から列の配置も復元します。区切り行が無い場合は、縦線を含む行を表とみなして1行目を見出しにします。',
    },
    {
      question: '日本語を含む表で、列の幅がずれて見えます。',
      answer:
        '全角文字を半角2文字分として数えて整形していますが、実際の表示幅はフォントによって異なります。レンダリング後の表の見た目には影響しません。気になる場合は、列幅をそろえない出力に切り替えてください。',
    },
    {
      question: '見出し行を消したり、見出しなしの表にしたりできますか？',
      answer:
        'Markdownのテーブルは見出し行が必須のため、見出し行は削除できません。見出しを使いたくない場合は、見出しのセルを空にしたまま使ってください。',
    },
  ],
  en: [
    {
      question: 'Can I add line breaks or pipe characters inside a cell?',
      answer:
        'Yes. Press Shift+Enter for a line break, which is written as a br tag (<br>) in the output. A pipe (|) is escaped with a backslash (\\|) so the table does not break.',
    },
    {
      question: 'Can I edit a Markdown table I already have?',
      answer:
        'Paste it into the box and press the load button to turn it into a grid. Column alignment is restored from the colons in the separator row. Without a separator row, lines containing a pipe are treated as rows and the first becomes the header.',
    },
    {
      question: 'Columns look misaligned when the table contains Japanese.',
      answer:
        'Padding counts full-width characters as two columns wide, but the real width depends on the font. It only affects the raw text, not the rendered table. Turn off column padding if it bothers you.',
    },
    {
      question: 'Can I remove the header row?',
      answer:
        'No. Markdown tables require a header row, so it cannot be deleted. If you do not want a visible header, leave the header cells empty.',
    },
  ],
};
