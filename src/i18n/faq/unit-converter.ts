import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'KBとKiBは何が違いますか？',
      answer:
        'KB（キロバイト）は1000バイト、KiB（キビバイト）は1024バイトです。HDDやSSDの容量表記は1000倍が一般的で、WindowsなどOSの表示は1024倍で計算されることがあるため、同じ容量でも数値が小さく見えることがあります。このツールでは両方を別の単位として変換できます。',
    },
    {
      question: '1坪は何平方メートル、何畳ですか？',
      answer:
        '1坪は 400/121 m²（約3.3058 m²）です。畳は1畳 = 1.62 m² で換算しており、1坪は約2.04畳になります。ただし実際の畳の大きさは江戸間・京間などで異なるため、あくまで不動産表示に使われる目安の値です。',
    },
    {
      question: '大さじ・小さじ・カップの量は日本とアメリカで同じですか？',
      answer:
        '違います。日本は大さじ15mL・小さじ5mL・1カップ200mLですが、アメリカは大さじ約14.8mL・小さじ約4.9mL・1カップ約236.6mLです。レシピの出どころに合わせて、日本（「Japanese」）とアメリカ（「米」）のどちらの単位かを選んでください。',
    },
    {
      question: '結果が「1.5×10^20」のような表記になるのはなぜですか？',
      answer:
        '桁数が非常に大きい（10¹⁵以上）または非常に小さい（10⁻⁶未満）値は、見づらくなるため指数表記で表示しています。「×10^20」は10の20乗を掛けるという意味です。',
    },
  ],
  en: [
    {
      question: 'What is the difference between KB and KiB?',
      answer:
        'A KB (kilobyte) is 1,000 bytes and a KiB (kibibyte) is 1,024 bytes. Drive makers use 1,000-based units while some operating systems report 1,024-based sizes, which is why a drive can look smaller than advertised. This tool converts both as separate units.',
    },
    {
      question: 'How many square meters and tatami mats is one tsubo?',
      answer:
        'One tsubo is 400/121 m² (about 3.31 m²). With 1 tatami mat = 1.62 m², that is about 2.04 mats. Real mat sizes vary by region (Edo-ma, Kyō-ma, and so on), so 1.62 m² is only the figure used in real estate listings.',
    },
    {
      question: 'Are Japanese and US cups and spoons the same size?',
      answer:
        'No. Japan uses a 15 mL tablespoon, a 5 mL teaspoon, and a 200 mL cup, while the US uses about 14.8 mL, 4.9 mL, and 236.6 mL. Pick the Japanese or US unit to match where your recipe comes from.',
    },
    {
      question: 'Why is my result shown like 1.5×10^20?',
      answer:
        'Very large values (10¹⁵ or more) and very small ones (below 10⁻⁶) are shown in exponent form so they stay readable. "×10^20" means multiplied by 10 to the power of 20.',
    },
  ],
};
