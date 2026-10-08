import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '座席表の前と後ろはどちらですか？',
      answer:
        '座席表の1行目が前（教卓側）で、画面の上に「前（教卓側）」と表示されます。固定席の「行」も上から数えます。',
    },
    {
      question: '特定の人の席を動かさないようにできますか？',
      answer:
        '「固定席」に「名前@行,列」の形式で1行に1人ずつ入力します（例: 青木@1,1）。固定された人はシャッフルされず、残りの人が空いている席にランダムに座ります。',
    },
    {
      question: '離したい組み合わせが指定通りにならないことはありますか？',
      answer:
        '席が少ない、固定席が近すぎるなどで条件を満たせない場合があります。最大5000回やり直しても見つからなければエラーを表示します。その場合は条件を減らすか、席数を増やしてください。「離す」は上下左右に隣り合わないことで、斜めはオプションで含められます。',
    },
    {
      question: '人数より席が多いときはどうなりますか？',
      answer:
        '余った席は空席として表示され、空席の位置もランダムに決まります。逆に席が人数より少ないとエラーになります。',
    },
    {
      question: '同じ名前の人がいる場合は？',
      answer:
        '座席表では固定席や離したい組み合わせを名前で指定するため、同名はエラーになります。「田中A」「田中B」のように区別してください。発表順では同名のままでも使えます。',
    },
  ],
  en: [
    {
      question: 'Which side of the chart is the front of the room?',
      answer:
        'Row 1, at the top of the chart, is the front of the room, and a “Front of the room” label is shown above it. Row numbers in fixed seats are counted from the top as well.',
    },
    {
      question: 'Can I keep certain people in the same seat?',
      answer:
        'Add them under “Fixed seats”, one per line as “Name@row,column” (e.g. Alice@1,1). Pinned people are not shuffled, and everyone else is placed randomly in the remaining seats.',
    },
    {
      question: 'What if the “keep apart” pairs cannot be satisfied?',
      answer:
        'It can happen when there are few seats or fixed seats are already too close. The tool retries up to 5,000 times and then shows an error; remove some conditions or add seats. “Apart” means not directly next to each other, and diagonals can be included with the option.',
    },
    {
      question: 'What happens when there are more seats than people?',
      answer:
        'The extra seats are shown as empty, and where they fall is random too. If there are fewer seats than people, an error is shown.',
    },
    {
      question: 'What if two people have the same name?',
      answer:
        'In a seating chart, fixed seats and pairs are matched by name, so duplicates are rejected. Make them unique, e.g. “Sam A” and “Sam B”. Speaking order accepts duplicates.',
    },
  ],
};
