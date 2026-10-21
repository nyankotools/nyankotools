import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '賃貸の初期費用は家賃の何ヶ月分が目安ですか？',
      answer:
        '一般的に家賃の4〜6ヶ月分が目安といわれます。敷金・礼金が各1ヶ月、仲介手数料、前家賃、保証料、火災保険、鍵交換に引越し費用が加わるためです。敷金礼金なしの物件では少なくなります。',
    },
    {
      question: '仲介手数料はどのように計算していますか？',
      answer:
        '家賃（管理費を除く）に入力した月数と消費税10%（1.1倍）を掛けています。宅建業法上の上限は貸主・借主の合計で家賃1ヶ月分（税別）で、借主が全額負担するか半額かは契約によります。',
    },
    {
      question: '家賃の目安「月収の1/3」とは何ですか？',
      answer:
        '額面の月収の3分の1を家賃の上限とする経験則です。手取りに対する割合ではなく、あくまで目安です。生活費や貯蓄の状況によって無理のない金額は変わるため、余裕のある目安として1/4も表示します。',
    },
    {
      question: '敷金は初期費用に含まれますか？',
      answer:
        '入居時に支払うため総額に含めています。ただし退去時に原状回復費用を差し引いて戻る可能性があるため、「敷金を除いた総額」も別に表示します。礼金は戻りません。',
    },
  ],
  en: [
    {
      question: 'How many months of rent are upfront costs in Japan?',
      answer:
        'Roughly four to six months of rent is common. A deposit and key money of one month each, the agent fee, prepaid rent, guarantee fee, insurance, lock change and moving add up. Properties with no deposit or key money cost less.',
    },
    {
      question: 'How is the agent fee calculated?',
      answer:
        'It is rent (excluding the management fee) times the months you enter times 1.1 for 10% consumption tax. The legal cap is one month of rent plus tax in total; whether the tenant pays all or half depends on the contract.',
    },
    {
      question: 'What is the "one-third of monthly income" rent rule?',
      answer:
        'It is a rule of thumb that rent should be at most one-third of your gross monthly income. It is only a guide, so a one-quarter figure is shown as a more comfortable target. Your own expenses and savings matter more.',
    },
    {
      question: 'Is the security deposit counted in the total?',
      answer:
        'Yes, because you pay it at move-in. Part or all of it may come back after restoration costs are deducted, so a total excluding the deposit is shown separately. Key money is never refunded.',
    },
  ],
};
