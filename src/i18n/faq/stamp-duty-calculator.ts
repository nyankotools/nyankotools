import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '契約金額がちょうど100万円の請負契約書の印紙代はいくらですか？',
      answer:
        '第2号文書（請負）は1万円以上100万円以下が200円なので、100万円ちょうどは200円です。100万1円からは400円になります。区分は超と以下で分かれているため、境界の金額に注意してください。',
    },
    {
      question: '電子契約書やPDFの領収書に収入印紙は必要ですか？',
      answer:
        '不要です。印紙税は紙の文書に課される税金で、PDFなどの電磁的記録は課税文書に当たりません。ただし、電子で締結した契約を紙に印刷して交付した場合、その紙が別の文書として課税されることがあります。',
    },
    {
      question: '領収書の印紙は何円から必要ですか？',
      answer:
        '売上代金の領収書（第17号の1）は5万円未満が非課税で、5万円以上100万円以下が200円です。消費税額が区分して記載されていれば、税抜の金額で判断します。たとえば税込5万円でも税抜が5万円未満なら非課税です。',
    },
    {
      question: '不動産売買や建設工事の契約書は安くなりますか？',
      answer:
        '令和9年3月31日までに作成される不動産譲渡契約書（第1号の1）と建設工事請負契約書（第2号）には軽減措置があります。たとえば1,000万円の不動産売買契約書は本則の1万円が5,000円になります。期限後は本則に戻ります。',
    },
    {
      question: '収入印紙を貼り忘れるとどうなりますか？',
      answer:
        '本来の印紙税額の3倍に相当する過怠税が課されます。税務調査の前に自分から申し出た場合は1.1倍に軽減されます。契約自体は無効になりませんが、気づいた時点で早めに対応してください。',
    },
  ],
  en: [
    {
      question:
        'What is the stamp duty on a work contract of exactly ¥1 million?',
      answer:
        'A No. 2 (work contract) document from ¥10,000 up to and including ¥1 million is ¥200, so exactly ¥1,000,000 is ¥200. From ¥1,000,001 it becomes ¥400. Brackets switch at over and up to, so watch the boundary amounts.',
    },
    {
      question: 'Do electronic contracts or PDF receipts need a revenue stamp?',
      answer:
        'No. Stamp duty applies to paper documents, and electronic records such as PDFs are not taxable documents. However, if you print an electronically signed contract and hand over the paper, that paper copy can be taxed as a separate document.',
    },
    {
      question: 'From what amount does a receipt need a stamp?',
      answer:
        'A receipt for sales proceeds (No. 17-1) is exempt under ¥50,000 and ¥200 from ¥50,000 up to ¥1 million. If consumption tax is shown separately, the pre-tax amount decides it, so a ¥50,000 tax-inclusive receipt can still be exempt.',
    },
    {
      question: 'Are real estate and construction contracts cheaper?',
      answer:
        'Yes, for documents created by March 31, 2027, real estate transfer contracts (No. 1-1) and construction work contracts (No. 2) get relief rates. A ¥10 million real estate contract drops from ¥10,000 to ¥5,000. After the deadline the standard rate returns.',
    },
    {
      question: 'What happens if I forget to attach the stamp?',
      answer:
        'An additional tax of three times the stamp duty is charged. If you report it yourself before an audit, it is reduced to 1.1 times. The contract itself stays valid, but it is best to deal with it as soon as you notice.',
    },
  ],
};
