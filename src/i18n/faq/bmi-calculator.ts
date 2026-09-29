import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'BMIはどのように計算されますか？',
      answer:
        '体重（kg）を身長（m）の2乗で割って求めます。たとえば身長170cm・体重65kgなら、65 ÷ (1.7 × 1.7) で約22.5です。',
    },
    {
      question: '判定基準は日本とWHOで違いますか？',
      answer:
        'このツールは日本肥満学会の基準（18.5未満が低体重、18.5以上25未満が普通体重、25以上を肥満1〜4度に分類）で判定します。WHOは25以上30未満を「Overweight」とするなど呼称が異なります。',
    },
    {
      question: 'BMIだけで健康状態を判断できますか？',
      answer:
        'できません。BMIは体脂肪率や筋肉量を考慮しない簡易的な指標で、筋肉量の多い人は高めに出ることがあります。健康面の判断は健康診断の結果や医師の助言を優先してください。',
    },
  ],
  en: [
    {
      question: 'How is BMI calculated?',
      answer:
        'BMI is weight in kilograms divided by height in meters squared. For example, 65 kg at 170 cm gives 65 ÷ (1.7 × 1.7) ≈ 22.5.',
    },
    {
      question: 'Do the categories differ between Japan and WHO?',
      answer:
        'This tool uses the Japan Society for the Study of Obesity criteria: under 18.5 is underweight, 18.5 to under 25 is normal, and 25 or above is obesity classes 1 to 4. WHO uses different labels, such as "overweight" for 25 to under 30.',
    },
    {
      question: 'Can BMI alone tell me if I am healthy?',
      answer:
        'No. BMI ignores body fat and muscle mass, so muscular people may score high. For health decisions, rely on medical checkups and advice from a doctor.',
    },
  ],
};
