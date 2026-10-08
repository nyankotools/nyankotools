import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '人数が割り切れないとき、余りはどうなりますか？',
      answer:
        '余りは各チームに1人ずつ振り分けます。たとえば10人を3チームに分けると、4人・3人・3人になり、チームの人数の差は最大1人です。人数が多いチームがどれになるかもランダムです。',
    },
    {
      question:
        '「1チームの人数」で分けると、指定した人数にならないことがあるのはなぜですか？',
      answer:
        '人数を指定した場合は、チーム数を「人数 ÷ 指定人数」の切り上げで決め、全員をなるべく均等に分けます。10人を3人ずつにすると、3・3・2・2人の4チームになります。1人だけ余るチームができないようにするためです。',
    },
    {
      question: '同じ名前の人が名簿にいる場合はどうなりますか？',
      answer:
        '同じ名前が複数行にあっても、別々の1人として数えて振り分けます。同姓同名を区別したいときは、「田中A」「田中B」のように名前を書き分けてください。',
    },
    {
      question: '特定の2人を同じチームにしたり、別のチームにしたりできますか？',
      answer:
        '条件指定には対応していません。完全にランダムに振り分けます。条件を付けたいときは、結果が条件に合うまで「もう一度シャッフル」を押してください。',
    },
    {
      question: '貼り付けた名簿は外部に送信されますか？',
      answer:
        'いいえ。シャッフルも結果の表示もすべてブラウザ内で行い、名簿をサーバーに送信することはありません。',
    },
  ],
  en: [
    {
      question: 'What happens when the names do not divide evenly?',
      answer:
        'The leftovers are spread one per team. Splitting 10 people into 3 teams gives 4, 3 and 3, so sizes differ by at most one. Which teams get the extra person is random too.',
    },
    {
      question:
        'Why does "People per team" sometimes give smaller teams than I entered?',
      answer:
        'The team count is the number of names divided by your size, rounded up, and everyone is then spread as evenly as possible. Ten people at 3 per team become four teams of 3, 3, 2 and 2, which avoids leaving one person alone in a tiny team.',
    },
    {
      question: 'How are duplicate names handled?',
      answer:
        'Each line counts as a separate person, even when two lines are identical. To tell people with the same name apart, write them differently, such as "Sam A" and "Sam B".',
    },
    {
      question: 'Can I keep two people together or apart?',
      answer:
        'No, the split is fully random and has no constraints. If you need a particular condition, press "Shuffle again" until the result meets it.',
    },
    {
      question: 'Is my name list sent anywhere?',
      answer:
        'No. Shuffling and display all happen in your browser, and the list is never sent to a server.',
    },
  ],
};
