import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '損益分岐点はどのように計算していますか？',
      answer:
        '損益分岐点の販売数量は「固定費÷（販売単価−1個あたりの変動費）」、損益分岐点売上高は「固定費÷限界利益率」です。たとえば単価1,000円・変動費400円・固定費30万円なら、1個あたり600円の限界利益で500個、売上高50万円が損益分岐点になります。',
    },
    {
      question: '「損益分岐点が存在しない」と表示されるのはなぜですか？',
      answer:
        '変動費が販売単価以上だと、1個売るたびに赤字が増える（または利益が出ない）ため、固定費を回収できないからです。単価を上げるか変動費を下げて、販売単価が変動費を上回るようにしてください。',
    },
    {
      question: '変動費と固定費はどう分ければよいですか？',
      answer:
        '販売数量に応じて増える費用（仕入れ・材料費・配送料・決済手数料など）が変動費、数量に関係なく毎期かかる費用（家賃・正社員の給与・減価償却費など）が固定費です。広告費や外注費のように判断が分かれるものは、実態に合わせて近い方へ分類します。',
    },
    {
      question: '安全余裕率はどう見ればよいですか？',
      answer:
        '予想売上が損益分岐点売上高を何％上回っているかを示します。たとえば20%なら、売上が2割減ってもまだ黒字ということです。マイナスの場合は、予想数量では赤字になることを表します。',
    },
  ],
  en: [
    {
      question: 'How is the break-even point calculated?',
      answer:
        'Break-even units are fixed costs divided by (selling price − variable cost per unit); break-even sales are fixed costs divided by the contribution margin ratio. For example, with a price of 1,000, variable cost of 400, and fixed costs of 300,000, each unit contributes 600, so you break even at 500 units and 500,000 in sales.',
    },
    {
      question: 'Why does it say there is no break-even point?',
      answer:
        'If variable cost is equal to or higher than the selling price, every sale adds no margin or even a loss, so fixed costs can never be recovered. Raise the price or cut the variable cost until the price is above the variable cost.',
    },
    {
      question: 'How do I split costs into fixed and variable?',
      answer:
        'Variable costs rise with each unit sold, such as materials, shipping, and payment fees. Fixed costs stay the same regardless of volume, such as rent, salaried staff, and depreciation. For mixed items like advertising or contractors, put them in whichever group fits your business better.',
    },
    {
      question: 'How should I read the margin of safety?',
      answer:
        'It shows how far expected sales are above break-even sales, as a percentage of expected sales. A 20% margin means sales could drop by 20% before you stop making a profit. A negative value means the expected volume is below break-even.',
    },
  ],
};
