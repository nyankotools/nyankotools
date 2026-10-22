import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '特定商取引法に基づく表記は、どんなサイトで必要ですか？',
      answer:
        'インターネットなどで商品・権利・サービスを消費者に販売する「通信販売」を行う事業者は、広告に所定の事項を表示する必要があります。個人のハンドメイド販売やデジタルコンテンツの販売も対象になり得ます。該当するかどうかはこのツールでは判断できないため、消費者庁の案内などで確認してください。',
    },
    {
      question: '個人事業者は自宅の住所や電話番号を載せなくてもよいですか？',
      answer:
        '所在地や電話番号は、消費者から請求があったときに遅滞なく開示する旨を表示し、実際にそのとおり対応できる体制がある場合に、ページ上の記載を省略できる運用が認められています。チェックボックスで定型文を出力できますが、省略が認められる条件や連絡手段（メールなど）は、必ずご自身で確認してください。',
    },
    {
      question: '返品の記載がないと、返品は一切できないのですか？',
      answer:
        '通信販売にはクーリング・オフ制度はありません。ただし、返品の可否や条件を表示していない場合、購入者は商品を受け取った日から8日以内であれば、送料自己負担で返品できるのが原則です。返品を受けない場合は、その旨を目立つ形で表示する必要があります。',
    },
    {
      question: 'このツールの出力はそのまま公開してよいですか？',
      answer:
        'そのまま公開しないでください。出力は一般的なひな形であり、法的助言ではありません。「○○」の部分や例文は自分の条件に書き換え、定期購入やデジタルコンテンツなど販売形態に応じた追加項目も確認したうえで、公開してください。',
    },
  ],
  en: [
    {
      question: 'Who needs a tokushoho notice?',
      answer:
        'Businesses that sell goods, rights or services to consumers in Japan by mail order, including online sales, must show certain items in their advertising. Handmade goods sold by individuals and digital content can count too. This tool cannot tell you whether you are covered, so check the Consumer Affairs Agency guidance.',
    },
    {
      question:
        'Can a sole proprietor leave out a home address and phone number?',
      answer:
        'Practice allows the address and phone number to be left off the page if the notice says they will be disclosed without delay on request, and the seller can actually do so. The checkboxes output that standard wording, but you must confirm the conditions and the contact channel (such as email) yourself.',
    },
    {
      question: 'If I do not state a return policy, are returns impossible?',
      answer:
        'No. Online sales in Japan have no cooling-off period, but if you do not state your return terms, the buyer can generally return the goods within 8 days of receipt at their own cost. If you do not accept returns, say so clearly on the page.',
    },
    {
      question: 'Is the generated text ready to publish as is?',
      answer:
        'No. It is a general template, not legal advice. Replace every ○○ and sample sentence with your own terms, and check whether your business needs more items, such as for subscriptions or digital content, before you publish.',
    },
    {
      question: 'Why is the output in Japanese even on the English page?',
      answer:
        'The notice is read by Japanese consumers, so it should be written in Japanese for sales aimed at Japan. The English page only explains the form, so type your entries in Japanese.',
    },
  ],
};
