import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'コードフォーマッタとは何が違いますか？',
      answer:
        'このツールは各行の先頭にあるタブ・スペースだけを置き換えます。括弧の位置や改行、行中の空白は整形しないので、差分を最小限に抑えてインデント文字だけを揃えたいときに向いています。',
    },
    {
      question: 'タブとスペースが混在した行はどう変換されますか？',
      answer:
        '行頭の空白をタブストップ（指定した幅の倍数の桁）に合わせて桁数に換算し、その桁数をもとにタブまたはスペースへ変換します。見た目のインデントの深さは保たれます。',
    },
    {
      question: '2スペースを4スペースに変えるにはどうしますか？',
      answer:
        '「スペースの幅を変更」を選び、変換前を2、変換後を4に設定します。2スペース単位の深さごとに4スペースへ置き換わり、2で割り切れない端数のスペースはそのまま残ります。',
    },
    {
      question: '文字列の中のタブやスペースも変換されますか？',
      answer:
        '行の途中にある空白は変換されません。ただし複数行の文字列やヒアドキュメントの2行目以降のように、行頭にある空白は文字列の一部でもインデントとして変換される点に注意してください。',
    },
  ],
  en: [
    {
      question: 'How is this different from a code formatter?',
      answer:
        'It only replaces the tabs and spaces at the start of each line. Braces, line breaks and whitespace inside a line are not reformatted, so the diff stays small when you only want consistent indentation.',
    },
    {
      question: 'How are lines that mix tabs and spaces handled?',
      answer:
        'The leading whitespace is measured in columns using tab stops (multiples of the width you set), then rewritten as tabs or spaces from that column count. The visual depth stays the same.',
    },
    {
      question: 'How do I change 2-space indentation to 4 spaces?',
      answer:
        'Choose "Change space width", set the current width to 2 and the new width to 4. Each 2-space level becomes 4 spaces, and any odd leftover space is kept as it is.',
    },
    {
      question: 'Are tabs and spaces inside strings converted?',
      answer:
        'Whitespace in the middle of a line is never changed. However, leading whitespace on the continuation lines of a multi-line string or heredoc is converted like any other indentation.',
    },
  ],
};
