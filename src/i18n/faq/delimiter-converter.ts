import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '改行区切りのリストをカンマ区切りにするにはどうしますか？',
      answer:
        '入力の区切りを「改行」、出力の区切りを「カンマ」にします。SQLのIN句などに使うなら、空要素の除去とシングルクォートの付与も併せて設定してください。',
    },
    {
      question: 'スペース区切りで複数のスペースが続く場合はどうなりますか？',
      answer:
        '連続した半角・全角スペースは1つの区切りとして扱うため、空の項目は生まれません。1つずつ区切りたい場合は、任意の文字列に半角スペース1つを指定してください。',
    },
    {
      question: '引用符で囲まれた項目内のカンマも区切られますか？',
      answer:
        'はい。単純にカンマで分割するため、"a,b" のような項目も分かれます。引用符内のカンマを保護したい場合は、CSVを扱うツールを使ってください。',
    },
    {
      question: '項目の中に引用符が含まれている場合はどうなりますか？',
      answer:
        '引用符を付与するとき、項目内の同じ引用符は2つ重ねてエスケープします。例えば say "hi" はダブルクォート指定で "say ""hi""" になります。',
    },
  ],
  en: [
    {
      question:
        'How do I turn a list with one item per line into comma-separated values?',
      answer:
        'Set the input delimiter to Newline and the output delimiter to Comma. For a SQL IN clause, also remove empty items and add single quotes.',
    },
    {
      question: 'What happens when there are several spaces in a row?',
      answer:
        'A run of half-width or full-width spaces counts as one separator, so no empty items are created. To split on every single space, use a custom delimiter of one space.',
    },
    {
      question: 'Are commas inside quoted items split too?',
      answer:
        'Yes. The tool splits plainly on commas, so an item like "a,b" is separated. Use a CSV-aware tool if you need to protect commas inside quotes.',
    },
    {
      question: 'What if an item already contains a quote character?',
      answer:
        'When quoting, a matching quote inside an item is doubled to escape it. For example, say "hi" becomes "say ""hi""" with double quotes.',
    },
  ],
};
