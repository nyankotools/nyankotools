import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '小麦粉・砂糖・油の大さじ1は何gですか？',
      answer:
        'このツールの目安では、小麦粉（薄力粉）と上白糖は大さじ1＝約9g、グラニュー糖は約13g、油は約13.5g、塩は約18g、バターは約13.5g、はちみつは約21gです。同じ大さじ1でも食材の比重で重さが変わります。',
    },
    {
      question: '日本と米国でカップの量はどう違いますか？',
      answer:
        '日本の1カップは200ml、米国の1カップは約240ml、メートル法のカップは250mlです。海外のレシピを使うときは「1カップの量」を切り替えてください。米1合は180mlで、1カップとは異なります。',
    },
    {
      question: '換算した重さが手持ちの計量値と少し違うのはなぜですか？',
      answer:
        '比重は一般に流通している目安値で、粉のふるい方や詰め方、バターの温度、米の品種などで実際の値は数%〜1割ほど変わります。参考資料によっても数値が異なるため、お菓子作りなどでは g で量るのが確実です。',
    },
    {
      question: '表にない食材はどう換算すればよいですか？',
      answer:
        '水に近いもの（だし・酒・酢・ジュースなど）は「水・酒・酢」を選べば概ね合います。それ以外は、食材の1mlあたりの重さ（比重）が分からないと換算できないため、近い食材で代用するか、実際に量ってください。',
    },
  ],
  en: [
    {
      question: 'How many grams is 1 tablespoon of flour, sugar or oil?',
      answer:
        'With the values used here, 1 tablespoon is about 9 g for flour and white sugar, 13 g for granulated sugar, 13.5 g for oil and butter, 18 g for salt, and 21 g for honey. The same spoon holds different weights because each ingredient has a different density.',
    },
    {
      question: 'How does a Japanese cup differ from a US cup?',
      answer:
        'A Japanese cup is 200 ml, a US cup is about 240 ml, and a metric cup is 250 ml. When following an overseas recipe, change "Cup size" to match. One gō of rice is 180 ml, which is not the same as a cup.',
    },
    {
      question: 'Why is the converted weight slightly different from my scale?',
      answer:
        'Densities are commonly quoted approximations. Sifting and packing flour, the temperature of butter, and the rice variety can shift the real weight by a few percent up to about 10%. Sources also vary, so weigh in grams for baking.',
    },
    {
      question: 'What if my ingredient is not in the list?',
      answer:
        'Liquids close to water, such as broth, sake, vinegar, or juice, are fine with "Water, sake, vinegar". For anything else, the density is needed for the conversion, so use a similar ingredient from the list or weigh it.',
    },
  ],
};
