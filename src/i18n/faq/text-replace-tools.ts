import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '重複削除・ソートはできますか？',
      answer:
        'このツールでは行いません。重複行の削除・並べ替え・シャッフル・空行の削除は「文字列の重複削除・ソート・シャッフル」ツールをご利用ください。こちらは置換と、行番号・抽出・前後への文字追加などの行の加工に特化しています。',
    },
    {
      question: '置換後に、一致した部分を並べ替えて使えますか？',
      answer:
        '「正規表現を使う」をオンにし、検索側で (\\w+)=(\\d+) のようにかっこで囲むと、置換後の文字列で $2:$1 のように参照して並べ替えられます。$& は一致した部分全体です。',
    },
    {
      question: '「.」や「(」を含む文字列をそのまま置換するには？',
      answer:
        '「正規表現を使う」をオフのままにしてください。オフのときは記号もそのままの文字として検索・置換されるため、エスケープは不要です。',
    },
    {
      question: '行番号を付けたあと、消すこともできますか？',
      answer:
        'はい。「行番号を消す」で、行頭の「1. 」「2) 」「3: 」「4、」「5 」などを取り除けます。ただし「100 apples」のように数字から始まる本文も行番号とみなされることがあるため、結果を確認してください。',
    },
    {
      question: '入力したテキストは外部に送信されますか？',
      answer:
        'いいえ。すべてブラウザ内で処理され、入力したテキストがサーバーに送信されることはありません。',
    },
  ],
  en: [
    {
      question: 'Can it remove duplicates or sort lines?',
      answer:
        'Not here. For removing duplicate lines, sorting, shuffling, or deleting empty lines, use the "Text List Deduplicate, Sort & Shuffle" tool. This one focuses on find & replace and line edits such as numbering, filtering, and adding prefixes or suffixes.',
    },
    {
      question: 'Can I rearrange the matched parts in the replacement?',
      answer:
        'Turn on "Use regular expression", wrap parts of the pattern in parentheses such as (\\w+)=(\\d+), and refer to them in the replacement as $2:$1. $& stands for the whole match.',
    },
    {
      question: 'How do I replace text that contains "." or "("?',
      answer:
        'Leave "Use regular expression" off. When it is off, symbols are searched and replaced as plain characters, so no escaping is needed.',
    },
    {
      question: 'Can I remove line numbers after adding them?',
      answer:
        'Yes. "Remove line numbers" strips leading numbers such as "1. ", "2) ", "3: " or "4 ". Text that really starts with a number, like "100 apples", can be treated as a line number too, so check the result.',
    },
    {
      question: 'Is the text I enter sent anywhere?',
      answer:
        'No. Everything is processed in your browser, and the text you enter is never sent to a server.',
    },
  ],
};
