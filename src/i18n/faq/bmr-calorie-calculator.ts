import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '基礎代謝量と消費カロリーは何が違いますか？',
      answer:
        '基礎代謝量は安静にしているだけで消費するエネルギーです。1日の消費カロリー（維持カロリー）は、それに仕事や運動などの活動量を加味したもので、基礎代謝量に活動係数（1.2〜1.9）を掛けて求めます。',
    },
    {
      question: 'どの計算式を選べばよいですか？',
      answer:
        '迷ったらMifflin-St Jeor式（初期値）がおすすめです。ハリス・ベネディクト式（改良版）はやや高めに出る傾向があります。日本人の基準値は厚生労働省の「日本人の食事摂取基準」にもとづく年齢区分ごとの値を体重に掛けるもので、18歳以上が対象です。',
    },
    {
      question: '減量するには何kcalまで減らせばよいですか？',
      answer:
        '目安として、維持カロリーの10〜20%減が緩やかな減量の範囲です。ただし基礎代謝量を大きく下回る摂取は、筋肉量の低下や体調不良につながるおそれがあります。極端な制限は避け、不安な場合は医師や管理栄養士に相談してください。',
    },
    {
      question: '結果が実際の体感と違うのはなぜですか？',
      answer:
        'どの式も年齢・性別・身長・体重だけで平均的な値を推定しているため、筋肉量や体脂肪率、体質による個人差は反映されません。結果は目安として使い、体重の変化を見ながら調整してください。',
    },
  ],
  en: [
    {
      question: 'What is the difference between BMR and daily calories burned?',
      answer:
        'BMR is the energy you burn just by staying at rest. Your daily calorie needs (TDEE) add the energy from work and exercise, and are found by multiplying BMR by an activity factor from 1.2 to 1.9.',
    },
    {
      question: 'Which equation should I choose?',
      answer:
        'If unsure, use Mifflin-St Jeor (the default). The revised Harris-Benedict equation tends to give slightly higher numbers. The Japanese option multiplies your weight by an age-group value from Japan’s dietary reference intakes and applies to adults 18 and over.',
    },
    {
      question: 'How many calories should I cut to lose weight?',
      answer:
        'A common range for gradual weight loss is 10–20% below your maintenance calories. Eating far below your BMR can cost muscle and harm your health, so avoid extreme cuts and talk to a doctor or dietitian if you are unsure.',
    },
    {
      question: 'Why does the result not match how my body behaves?',
      answer:
        'Every equation estimates an average from age, sex, height, and weight only, so muscle mass, body fat, and genetics are not reflected. Treat the result as a starting point and adjust based on how your weight changes.',
    },
  ],
};
