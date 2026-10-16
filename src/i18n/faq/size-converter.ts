import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '海外ブランドの服は日本サイズのどれを選べばいいですか？',
      answer:
        '一般的にUS・EUのS・M・Lは日本の同じ表記より大きめです。レディースならUSの4がほぼ日本の9号（M）です。ただしブランドごとの差が大きいため、換算結果はあくまで目安とし、商品ページの実寸（着丈・身幅など）で最終確認してください。',
    },
    {
      question:
        '靴のサイズはメンズとレディースで同じ数値でも同じ大きさですか？',
      answer:
        '同じではありません。USサイズはメンズとレディースで付け方が異なり、同じ足長ならレディースの方がUSの数値が1大きくなります。このツールでは「レディース靴」「メンズ靴」を分けて換算しています。',
    },
    {
      question: '指輪のサイズは日本とアメリカでどう違いますか？',
      answer:
        '日本は1号＝内径13mmを基準に1号ごとに約0.32mm大きくなり、USは内径約11.63mm＋0.8128mm×サイズで決まります。目安として日本の9号がUS 5、日本の13号がUS 7前後です。ヨーロッパは内周（mm）がそのままサイズになります。',
    },
    {
      question: '換算結果が実際のサイズ表と合わないのはなぜですか？',
      answer:
        'このツールは広く使われる一般的な対応表に基づく目安です。ブランド・素材・生産国で寸法は変わり、特にイタリアやアメリカのブランドは対応表と異なることがあります。購入前にブランド公式のサイズ表を確認してください。',
    },
  ],
  en: [
    {
      question: 'Which Japanese size should I pick for an overseas brand?',
      answer:
        'US and EU S/M/L labels generally run larger than the same Japanese labels. For women’s clothing, a US 4 is roughly a Japanese size 9 (M). Brands vary a lot, so use the result as a guide and check the product’s actual measurements before buying.',
    },
    {
      question:
        'Are men’s and women’s shoe sizes the same for the same number?',
      answer:
        'No. US numbering differs between men’s and women’s shoes: for the same foot length, the women’s US number is 1 higher. This tool converts women’s and men’s shoes separately.',
    },
    {
      question: 'How do Japanese and US ring sizes differ?',
      answer:
        'Japan starts at 13 mm inner diameter for size 1 and adds about 0.32 mm per size, while the US uses roughly 11.63 mm + 0.8128 mm × size. As a guide, Japan 9 is about US 5 and Japan 13 about US 7. Europe uses the inner circumference in millimeters as the size.',
    },
    {
      question: 'Why does the result differ from the size chart I have?',
      answer:
        'The tool follows widely used general conversion charts. Measurements change with brand, material and country of manufacture, and Italian or American brands in particular can differ. Check the brand’s official size chart before you buy.',
    },
  ],
};
