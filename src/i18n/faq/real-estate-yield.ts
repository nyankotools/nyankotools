import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '表面利回りと実質利回りは何が違いますか？',
      answer:
        '表面利回りは満室時の年間家賃を物件価格で割っただけの値です。実質利回りは空室や管理費・修繕費・税金などを引いたNOIを、物件価格に購入諸費用を足した額で割るため、通常は表面利回りより低くなります。',
    },
    {
      question: '購入時の諸費用はどのくらい見込めばよいですか？',
      answer:
        '仲介手数料・登記費用・不動産取得税・ローン手数料・火災保険などで、中古物件では物件価格の6〜10%程度が一例です。物件や融資条件で大きく変わるため、見積書で確認した値を入力してください。',
    },
    {
      question: 'キャッシュフローがマイナスの場合はどういう意味ですか？',
      answer:
        '家賃収入から経費とローン返済を引くと手元のお金が減る、つまり毎月持ち出しになるという意味です。空室や金利上昇で悪化しやすいため、空室率を高めにして確認する使い方もあります。',
    },
    {
      question: '返済額はどのように計算していますか？',
      answer:
        '借入額（物件価格＋諸費用−自己資金）を、金利一定の元利均等返済として計算しています。ボーナス返済や変動金利の見直し、繰り上げ返済は反映しません。',
    },
  ],
  en: [
    {
      question: 'What is the difference between gross yield and net yield?',
      answer:
        'Gross yield is just annual rent at full occupancy divided by the price. Net yield divides NOI, which is rent after vacancy, management, repairs and taxes, by the price plus closing costs, so it is normally lower.',
    },
    {
      question: 'How much should I allow for closing costs?',
      answer:
        'Agent fees, registration, acquisition tax, loan fees and insurance often come to around 6 to 10% of the price for a resale property in Japan. It varies widely, so enter the figure from your actual quote.',
    },
    {
      question: 'What does negative cash flow mean?',
      answer:
        'After expenses and the loan payment, you pay out of pocket every month. It tends to worsen with vacancies or rate increases, so some people try a higher vacancy rate to see how much margin they have.',
    },
    {
      question: 'How is the loan payment calculated?',
      answer:
        'The loan is price plus closing costs minus your own funds, repaid in level monthly payments at a fixed rate. Bonus payments, variable-rate resets and prepayments are not modeled.',
    },
  ],
};
