import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '100gあたりの単価はどう計算しますか？',
      answer:
        '「価格 ÷ 内容量 × 100」です。たとえば500gで398円なら 398 ÷ 500 × 100 = 79.6円、1kg（1000g）で698円なら 69.8円で、後者が約14%安くなります。kgやLを選んだ場合は、g・mlに換算してから計算します。',
    },
    {
      question: '6本パックなど、複数入りの商品はどう入力しますか？',
      answer:
        '「内容量」に1本あたりの量、「個数・パック数」に本数を入れてください。500mlが6本で598円なら、内容量500・単位ml・個数6で、合計3000mlとして100mlあたり約19.9円と計算します。',
    },
    {
      question: '税込と税抜の商品が混ざっていても比べられますか？',
      answer:
        '商品ごとに「税込」「税抜（10%）」「税抜（8%）」を選べます。税抜を選んだ価格は税込に換算してから単価を求めるため、同じ条件で比較できます。軽減税率の食品と標準税率の日用品を比べるときにも使えます。',
    },
    {
      question: '重さの商品と容量の商品を比べられますか？',
      answer:
        'できません。gとmlでは密度が違うため、換算せず別の種類として扱います。最初に入力した商品の種類（重さ・容量・個数）に合わない商品は比較から外れ、理由が画面に表示されます。',
    },
  ],
  en: [
    {
      question: 'How is the price per 100 g calculated?',
      answer:
        'It is price divided by size, times 100. A 500 g pack at 3.98 comes to 0.80 per 100 g, while a 1 kg pack at 6.98 is 0.70 per 100 g, about 14% cheaper. Sizes entered in kg or L are converted to g or ml first.',
    },
    {
      question: 'How do I enter a multipack such as 6 bottles?',
      answer:
        'Put the size of one item in "Size" and the number of items in "Packs / count". Six 500 ml bottles for 5.98 are 500 ml with a count of 6, so 3000 ml in total and about 0.20 per 100 ml.',
    },
    {
      question: 'Can I mix tax-included and tax-excluded prices?',
      answer:
        'Yes. Choose "Tax included", "Excl. 10% tax" or "Excl. 8% tax" for each product. Tax-excluded prices are converted to tax-included before the unit price is found, so every product is compared on the same basis.',
    },
    {
      question:
        'Can I compare a product sold by weight with one sold by volume?',
      answer:
        'No. Grams and milliliters are different kinds of measure because density varies, so they are not converted. Products whose type differs from the first one you entered (weight, volume or count) are left out, and the reason is shown.',
    },
  ],
};
