import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '作った書類をPDFで保存するにはどうしますか？',
      answer:
        '「印刷 / PDFで保存」を押すと印刷画面が開きます。送信先（プリンター）で「PDFに保存」を選んで保存してください。印刷されるのはプレビュー部分だけで、入力欄や説明文は含まれません。',
    },
    {
      question: 'インボイス制度（適格請求書）に対応していますか？',
      answer:
        '発行者の登録番号、税率ごとに区分した対価の額と消費税額、軽減税率の対象品目への「※」表示など、適格請求書の記載事項に沿ったレイアウトにしています。ただし記載内容が要件を満たすかは取引によって異なるため、最終的な確認はご自身でお願いします。',
    },
    {
      question: '消費税の端数はどう計算されますか？',
      answer:
        '明細1行ごとではなく、税率（10%・8%）ごとに合計した金額に対して消費税額を1回だけ計算し、選んだ方式（切り捨て・四捨五入・切り上げ）で端数処理します。インボイスの「税率ごとに1回の端数処理」というルールに合わせています。',
    },
    {
      question: '値引きや割引は入力できますか？',
      answer:
        '明細の単価をマイナスにすると値引き行として扱われ、同じ税率の合計から差し引かれます。例えば「値引き」という品名で単価を -1,000 と入力します。',
    },
    {
      question: '入力した会社名や住所は保存されますか？',
      answer:
        '宛先や明細はページを閉じると消えます。発行者情報だけは、「発行者情報をこのブラウザに保存」を押したときに限り、この端末のブラウザの中に保存されます。サーバーには送信されません。',
    },
  ],
  en: [
    {
      question: 'How do I save the document as a PDF?',
      answer:
        'Press “Print / Save as PDF” to open the print dialog, then choose “Save as PDF” as the destination. Only the preview is printed; the input fields and explanations are left out.',
    },
    {
      question: 'Does it support Japan’s invoice system (qualified invoices)?',
      answer:
        'The layout follows the qualified invoice entries: the issuer’s registration number, the amount and consumption tax per tax rate, and an asterisk for reduced-rate items. Whether a particular document meets the requirements depends on the transaction, so please do the final check yourself.',
    },
    {
      question: 'How is consumption tax rounded?',
      answer:
        'Tax is not calculated line by line. It is calculated once on the total for each tax rate (10% and 8%) and rounded with the method you choose (down, nearest or up), in line with the invoice rule of one rounding per tax rate.',
    },
    {
      question: 'Can I add a discount line?',
      answer:
        'Enter a negative unit price and the line is treated as a discount that is subtracted from the total of the same tax rate. For example, use “Discount” as the description and -1,000 as the unit price.',
    },
    {
      question: 'Are the names and addresses I enter stored?',
      answer:
        'The recipient and line items disappear when you close the page. Issuer details are saved in your browser on this device only when you press “Save issuer details in this browser”, and are never sent to a server.',
    },
  ],
};
