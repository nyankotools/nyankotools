import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '4本線と5本線の違いは何ですか？',
      answer:
        '4本線は「2桁の数字・乗数・許容差」、5本線は「3桁の数字・乗数・許容差」です。5本線は精密抵抗（±1%など）に多く使われます。6本線は5本線に温度係数の帯が1本加わります。',
    },
    {
      question: '色帯はどちらの端から読めばよいですか？',
      answer:
        '金・銀（許容差）の帯が右に来る向きで、左端から読みます。許容差の帯は他の帯より少し離れていることが多く、その反対側が1本目です。分からないときはテスターで実測してください。',
    },
    {
      question: '金や銀が乗数に来るとどうなりますか？',
      answer:
        '金は×0.1、銀は×0.01です。たとえば緑・青・金・金は56×0.1=5.6Ω（±5%）になります。10Ω未満の抵抗にも使われます。',
    },
    {
      question: '入力した抵抗値が色帯で表せないと言われます。',
      answer:
        '4本線は有効数字2桁、5・6本線は3桁までです。たとえば4.75kΩは5本線なら表せますが、4本線では表せません。「近い標準値を入力する」で、E系列の近い値に置き換えられます。',
    },
    {
      question: 'E系列の最も近い値はどう決めていますか？',
      answer:
        '入力値との比率（対数）が最も小さい標準値を選びます。たとえば4.8kΩのE24なら4.7kΩが最も近く、差は約-2.1%です。上下の値も合わせて表示します。',
    },
  ],
  en: [
    {
      question: 'What is the difference between 4-band and 5-band resistors?',
      answer:
        'A 4-band resistor has two digits, a multiplier and a tolerance band; a 5-band resistor has three digits, a multiplier and a tolerance band. 5-band parts are common for precision resistors (±1% and tighter). A 6-band resistor adds a temperature coefficient band.',
    },
    {
      question: 'Which end do I start reading from?',
      answer:
        'Hold the resistor with the gold or silver tolerance band on the right and read from the left. The tolerance band is often spaced slightly apart from the others, and the first band is at the opposite end. If it is unclear, measure with a multimeter.',
    },
    {
      question: 'What happens when gold or silver is the multiplier?',
      answer:
        'Gold means ×0.1 and silver means ×0.01. For example green, blue, gold, gold is 56 × 0.1 = 5.6 Ω at ±5%. This is how resistors below 10 Ω are marked.',
    },
    {
      question: 'Why does it say my resistance cannot be shown in bands?',
      answer:
        'Four-band resistors carry 2 significant digits and 5- or 6-band resistors carry 3. For example 4.75 kΩ works with 5 bands but not with 4. "Use the nearest standard value" swaps in the closest E series value.',
    },
    {
      question: 'How is the nearest E series value chosen?',
      answer:
        'The tool picks the standard value with the smallest ratio (logarithmic) distance to your input. For 4.8 kΩ in E24, 4.7 kΩ is nearest, about -2.1% away. The neighbors above and below are shown too.',
    },
  ],
};
