import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'PFCバランスはどのくらいにすればよいですか？',
      answer:
        '日本人の食事摂取基準（2020年版）の目標量は、18歳以上でタンパク質13〜20%・脂質20〜30%・炭水化物50〜65%です。筋力トレーニングをする方はタンパク質を多めにする高タンパク型もよく使われます。目的や体調に合わせて調整してください。',
    },
    {
      question: 'PFCのカロリー換算はどうなっていますか？',
      answer:
        'タンパク質は1gあたり4kcal、脂質は9kcal、炭水化物は4kcalで計算しています。例えば2,000kcalでバランス型（P15・F25・C60）なら、タンパク質75g・脂質約56g・炭水化物300gです。',
    },
    {
      question: '体重あたりのタンパク質量はどれくらいが目安ですか？',
      answer:
        '一般的な推奨量は体重1kgあたり約0.8g以上で、筋力トレーニングをする方は1.2〜2.0g程度がよく目安にされます。この計算機では、決めた比率から得られるタンパク質量が体重1kgあたり何gになるかと、体重別の目安量を表示します。腎臓に持病のある方などは医師に相談してください。',
    },
    {
      question: '合計が100%にならない比率を入力するとどうなりますか？',
      answer:
        '「自分で指定」では、P・F・Cの合計が100%でないと計算せずエラーを表示します。端数が出る場合は、3つの合計がちょうど100になるように調整してください。',
    },
    {
      question: '減量中のカロリーはどこまで減らしてよいですか？',
      answer:
        '目安は維持カロリーの10〜20%減です。目標カロリーが基礎代謝量を下回ると警告を表示します。極端な制限は筋肉量の低下や体調不良につながるおそれがあるため、避けてください。',
    },
  ],
  en: [
    {
      question: 'What macro split should I use?',
      answer:
        'Japan’s dietary reference intakes (2020) suggest 13–20% protein, 20–30% fat, and 50–65% carbohydrate for adults. People who lift weights often choose a higher-protein split. Adjust to your goal and how you feel.',
    },
    {
      question: 'How are macros converted to calories?',
      answer:
        'Protein and carbohydrate count as 4 kcal per gram, and fat as 9 kcal per gram. For example, 2,000 kcal at a balanced 15/25/60 split gives 75 g of protein, about 56 g of fat, and 300 g of carbohydrate.',
    },
    {
      question: 'How much protein per kilogram of body weight is typical?',
      answer:
        'The common minimum is about 0.8 g per kg of body weight, and people who strength train often aim for 1.2–2.0 g/kg. This tool shows how many g/kg your chosen split gives and a reference table by weight. If you have kidney problems, check with a doctor first.',
    },
    {
      question: 'What happens if my custom percentages do not add up to 100?',
      answer:
        'With the custom split, P, F, and C must total exactly 100%. Otherwise the tool shows an error instead of a result, so adjust the numbers until they sum to 100.',
    },
    {
      question: 'How far below maintenance can I go when cutting?',
      answer:
        'A common range is 10–20% below maintenance calories. The tool warns you when your target drops below your BMR, since extreme restriction can cost muscle and harm your health.',
    },
  ],
};
