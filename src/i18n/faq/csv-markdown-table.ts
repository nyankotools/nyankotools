import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'Excelの表をそのままMarkdownテーブルにできますか？',
      answer:
        'はい。Excelの範囲をコピーして入力欄に貼り付けると、タブ区切り（TSV）として自動判定されます。区切り文字が合わない場合は、プルダウンで手動指定してください。',
    },
    {
      question: 'セルの中に「|」や改行があるとどうなりますか？',
      answer:
        'Markdownのテーブルが崩れないよう、「|」は「\\|」に、セル内の改行は「<br>」に置き換えて出力します。',
    },
    {
      question: '見出し行がないCSVも変換できますか？',
      answer:
        '「1行目を見出しにする」のチェックを外すと、空の見出し行を補ったテーブルになります。Markdownのテーブルは見出し行が必須のため、この形で出力します。',
    },
    {
      question: '日本語を含む表で列の幅がずれます。',
      answer:
        '全角文字を半角2文字分として数えて整形していますが、実際の表示幅はフォントによって異なります。Markdownを表示した時の見た目には影響しないので、そのまま使えます。気になる場合は「列幅をそろえて整形する」を外してください。',
    },
  ],
  en: [
    {
      question: 'Can I turn a table copied from Excel into a Markdown table?',
      answer:
        'Yes. Copy the range in Excel and paste it into the input box; it is detected as tab-separated (TSV) automatically. If the delimiter is guessed wrong, pick it manually from the dropdown.',
    },
    {
      question: 'What happens to "|" or line breaks inside a cell?',
      answer:
        'To keep the Markdown table intact, "|" is written as "\\|" and a line break inside a cell becomes "<br>".',
    },
    {
      question: 'Can I convert CSV that has no header row?',
      answer:
        'Turn off "Use the first row as header" and an empty header row is added. Markdown tables require a header row, so this is the form the output takes.',
    },
    {
      question: 'Columns look misaligned when the table contains Japanese.',
      answer:
        'Padding counts full-width characters as two columns wide, but the real width depends on the font. This only affects how the raw text looks; the rendered table is unaffected. Turn off "Pad columns to equal width" if it bothers you.',
    },
  ],
};
