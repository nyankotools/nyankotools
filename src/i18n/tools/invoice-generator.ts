import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface DocTypeContent {
  /** 種類の選択ボタンの表示 */
  label: string;
  /** 書類の表題 */
  title: string;
  numberLabel: string;
  dateLabel: string;
  /** null の書類には期限欄を出さない */
  dueLabel: string | null;
  subjectLabel: string;
  subjectPlaceholder: string;
  /** {subject} を入力値に置き換える */
  subjectFormat: string;
  totalLabel: string;
  lead: string;
  showBank: boolean;
}

export interface InvoiceGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  dateLocale: string;
  howToHeading: string;
  howToSteps: string[];
  docTypeLegend: string;
  docTypes: {
    invoice: DocTypeContent;
    quote: DocTypeContent;
    receipt: DocTypeContent;
    delivery: DocTypeContent;
  };
  sectionBasicHeading: string;
  sectionPartiesHeading: string;
  sectionItemsHeading: string;
  sectionOptionsHeading: string;
  previewHeading: string;
  documentNumberPlaceholder: string;
  recipientLabel: string;
  recipientPlaceholder: string;
  honorificLabel: string;
  honorifics: { value: string; label: string }[];
  issuerNameLabel: string;
  issuerNamePlaceholder: string;
  issuerAddressLabel: string;
  issuerAddressPlaceholder: string;
  issuerContactLabel: string;
  issuerContactPlaceholder: string;
  registrationLabel: string;
  registrationPlaceholder: string;
  errorRegistration: string;
  bankLabel: string;
  bankPlaceholder: string;
  notesInputLabel: string;
  notesInputPlaceholder: string;
  saveIssuerButton: string;
  clearIssuerButton: string;
  issuerSavedMessage: string;
  issuerClearedMessage: string;
  priceModeLegend: string;
  priceExclusive: string;
  priceInclusive: string;
  roundingLegend: string;
  roundingFloor: string;
  roundingRound: string;
  roundingCeil: string;
  itemsListLabel: string;
  itemNameLabel: string;
  itemNamePlaceholder: string;
  itemQuantityLabel: string;
  itemUnitPriceLabel: string;
  itemTaxRateLabel: string;
  taxRate10: string;
  taxRate8: string;
  taxRate0: string;
  itemAmountLabel: string;
  addItemButton: string;
  removeItemButton: string;
  errorNoItems: string;
  errorTooManyItems: string;
  errorInvalidItem: string;
  errorTooLarge: string;
  printButton: string;
  printHint: string;
  paperRegistrationPrefix: string;
  paperColName: string;
  paperColQuantity: string;
  paperColUnitExcl: string;
  paperColUnitIncl: string;
  paperColRate: string;
  paperColAmount: string;
  paperTaxableRow: string;
  paperTaxableRow0: string;
  paperTaxRow: string;
  paperSubtotalLabel: string;
  paperTaxTotalLabel: string;
  paperTotalLabel: string;
  paperTaxIncludedSuffix: string;
  paperReducedNote: string;
  paperBankHeading: string;
  paperNotesHeading: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const invoiceGeneratorContent: Record<
  Locale,
  InvoiceGeneratorPageContent
> = {
  ja: {
    title: '請求書・見積書・領収書・納品書作成（インボイス対応・PDF出力）',
    description:
      '請求書・見積書・領収書・納品書を無料で作成し、印刷またはPDFで保存できます。登録番号（T+13桁）の表示、税率ごとの消費税額の集計（10%・8%）、端数処理の選択に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '請求書・見積書・領収書・納品書作成',
    introHtml:
      '宛先・明細・発行者情報を入力するだけで、インボイス制度（適格請求書）の記載事項に沿った請求書・見積書・領収書・納品書を作れます。税率（10%・8%）ごとの対価の額と消費税額は自動で集計され、完成した書類はブラウザの印刷機能でPDFとして保存できます。入力内容はブラウザ内だけで処理され、サーバーには送信されません。税込・税抜の計算だけを手早く確かめたいときは <a href="/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">消費税・割引計算機</a> もご利用ください。',
    numberLocale: 'ja-JP',
    dateLocale: 'ja-JP',
    howToHeading: '使い方',
    howToSteps: [
      '「書類の種類」で請求書・見積書・領収書・納品書のいずれかを選びます。',
      '宛先・発行者情報（登録番号・振込先を含む）と、品名・数量・単価・税率の明細を入力します。単価が税込か税抜か、端数処理もここで選びます。',
      '下のプレビューで税率ごとの集計と合計を確認します。',
      '「印刷 / PDFで保存」を押し、印刷画面の送信先でPDFへの保存を選ぶと、PDFファイルとして保存できます。',
    ],
    docTypeLegend: '書類の種類',
    docTypes: {
      invoice: {
        label: '請求書',
        title: '請求書',
        numberLabel: '請求書番号',
        dateLabel: '請求日',
        dueLabel: '支払期限',
        subjectLabel: '件名',
        subjectPlaceholder: '例: 2026年10月分 ウェブサイト制作費',
        subjectFormat: '件名: {subject}',
        totalLabel: 'ご請求金額',
        lead: '下記の通りご請求申し上げます。',
        showBank: true,
      },
      quote: {
        label: '見積書',
        title: '御見積書',
        numberLabel: '見積番号',
        dateLabel: '見積日',
        dueLabel: '有効期限',
        subjectLabel: '件名',
        subjectPlaceholder: '例: ウェブサイト制作のお見積り',
        subjectFormat: '件名: {subject}',
        totalLabel: 'お見積金額',
        lead: '下記の通りお見積り申し上げます。',
        showBank: false,
      },
      receipt: {
        label: '領収書',
        title: '領収書',
        numberLabel: '領収書番号',
        dateLabel: '領収日',
        dueLabel: null,
        subjectLabel: '但し書き',
        subjectPlaceholder: '例: お品代として',
        subjectFormat: '但し {subject}',
        totalLabel: '領収金額',
        lead: '上記、正に領収いたしました。',
        showBank: false,
      },
      delivery: {
        label: '納品書',
        title: '納品書',
        numberLabel: '納品書番号',
        dateLabel: '納品日',
        dueLabel: null,
        subjectLabel: '件名',
        subjectPlaceholder: '例: 2026年10月分 納品物',
        subjectFormat: '件名: {subject}',
        totalLabel: '合計金額',
        lead: '下記の通り納品いたします。',
        showBank: false,
      },
    },
    sectionBasicHeading: '1. 書類の情報',
    sectionPartiesHeading: '2. 宛先・発行者',
    sectionItemsHeading: '3. 明細',
    sectionOptionsHeading: '4. 計算方法・備考',
    previewHeading: 'プレビュー（印刷されるのはこの部分です）',
    documentNumberPlaceholder: '例: 2026-001',
    recipientLabel: '宛先',
    recipientPlaceholder: '例: 株式会社サンプル',
    honorificLabel: '敬称',
    honorifics: [
      { value: '御中', label: '御中' },
      { value: '様', label: '様' },
      { value: '', label: 'なし' },
    ],
    issuerNameLabel: '発行者名（会社名・屋号・氏名）',
    issuerNamePlaceholder: '例: にゃんこ制作所',
    issuerAddressLabel: '発行者の住所',
    issuerAddressPlaceholder: '例: 〒100-0001 東京都千代田区千代田1-1',
    issuerContactLabel: '電話・メールなど',
    issuerContactPlaceholder: '例: info@example.com',
    registrationLabel: '適格請求書発行事業者の登録番号',
    registrationPlaceholder: 'T1234567890123',
    errorRegistration:
      '登録番号は「T」に続く13桁の数字で入力してください（例: T1234567890123）',
    bankLabel: '振込先',
    bankPlaceholder: '例: ○○銀行 △△支店 普通 1234567 ニャンコセイサクジョ',
    notesInputLabel: '備考',
    notesInputPlaceholder: '例: 振込手数料はご負担ください。',
    saveIssuerButton: '発行者情報をこのブラウザに保存',
    clearIssuerButton: '保存した発行者情報を削除',
    issuerSavedMessage: '発行者情報をこのブラウザに保存しました',
    issuerClearedMessage: '保存した発行者情報を削除しました',
    priceModeLegend: '単価の入力',
    priceExclusive: '税抜で入力',
    priceInclusive: '税込で入力',
    roundingLegend: '端数処理（金額・消費税額）',
    roundingFloor: '切り捨て',
    roundingRound: '四捨五入',
    roundingCeil: '切り上げ',
    itemsListLabel: '明細の行',
    itemNameLabel: '品名',
    itemNamePlaceholder: '例: ウェブサイト制作費',
    itemQuantityLabel: '数量',
    itemUnitPriceLabel: '単価（円）',
    itemTaxRateLabel: '税率',
    taxRate10: '10%',
    taxRate8: '8%（軽減）',
    taxRate0: '非課税・免税',
    itemAmountLabel: '金額',
    addItemButton: '行を追加',
    removeItemButton: '削除',
    errorNoItems: '明細を1行以上入力してください',
    errorTooManyItems: '明細は50行までです',
    errorInvalidItem:
      '{n}行目: 数量は0以上、単価は数値で入力してください（値引きは単価をマイナスにします）',
    errorTooLarge: '金額が大きすぎます（1件・合計とも100億円まで）',
    printButton: '印刷 / PDFで保存',
    printHint:
      '印刷画面で「ヘッダーとフッター」をオフにすると、日付やURLが入らずきれいに仕上がります。',
    paperRegistrationPrefix: '登録番号',
    paperColName: '品名',
    paperColQuantity: '数量',
    paperColUnitExcl: '単価（税抜）',
    paperColUnitIncl: '単価（税込）',
    paperColRate: '税率',
    paperColAmount: '金額',
    paperTaxableRow: '{rate}%対象',
    paperTaxableRow0: '非課税・免税',
    paperTaxRow: '消費税（{rate}%）',
    paperSubtotalLabel: '小計（税抜）',
    paperTaxTotalLabel: '消費税合計',
    paperTotalLabel: '合計（税込）',
    paperTaxIncludedSuffix: '（税込）',
    paperReducedNote: '※は軽減税率（8%）対象です。',
    paperBankHeading: 'お振込先',
    paperNotesHeading: '備考',
    notesHeading: '注意事項',
    notes: [
      '消費税額は、適格請求書の要件に合わせて税率ごとに合計した対価の額に対して1回だけ端数処理して求めます（明細1行ごとには税額を計算しません）。端数処理の方式は、ここで選んだものを使います。',
      '登録番号は、Tに続く13桁の数字という形式だけを確認します。実際に登録されているかは、国税庁の適格請求書発行事業者公表サイトで確認してください。',
      '本ツールは書式と計算の補助であり、記載内容の正しさや税務上の取り扱いを保証するものではありません。取引内容によって必要な記載事項が変わるため、重要な書類は税理士や国税庁の案内で確認してください。',
      '領収書は、受取金額が5万円以上のときに収入印紙が必要になる場合があります。PDFなどの電子データで渡す場合は印紙税は不要ですが、紙に印刷して渡す場合は必要になることがあります。',
      '発行者情報の保存は、この端末のブラウザの中だけに保存されます（サーバーには送信されません）。共有のパソコンでは、使用後に保存した発行者情報を削除してください。宛先・明細などは保存されないため、ページを閉じると消えます。',
      '消費税の標準税率10%・軽減税率8%（2026年10月時点）と、適格請求書等保存方式（インボイス制度）を前提にしています。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '適格請求書（インボイス）',
        description:
          '売手が買手に、税率ごとの対価の額や消費税額などを正確に伝えるための請求書です。発行者の氏名または名称と登録番号、取引年月日、取引内容（軽減税率の対象品目である旨を含む）、税率ごとに区分して合計した対価の額と適用税率、税率ごとの消費税額、受領者の氏名または名称が記載事項です。',
      },
      {
        term: '登録番号',
        description:
          '適格請求書発行事業者として登録されると付与される、「T」から始まる13桁の番号です。法人は「T＋法人番号」、個人事業主は別途付与される番号になります。',
      },
      {
        term: '軽減税率',
        description:
          '飲食料品（外食・酒類を除く）や定期購読の新聞などに適用される8%の税率です。インボイスでは、軽減税率の対象品目であることがわかるよう「※」などの記載が必要です。',
      },
      {
        term: '御中と様',
        description:
          '会社や部署などの組織宛ては「御中」、個人宛ては「様」を付けるのが一般的です。担当者名を書く場合は「会社名 御中 担当者名 様」のように、御中と様を重ねないようにします。',
      },
    ],
  },
  en: {
    title: 'Invoice, Quotation, Receipt & Delivery Note Generator (PDF)',
    description:
      'Create an invoice, quotation, receipt or delivery note and save it as PDF. Japan qualified invoice layout with per-rate tax totals. Runs in your browser.',
    h1: 'Invoice, Quotation, Receipt & Delivery Note Generator',
    introHtml:
      'Fill in the recipient, line items and your details to produce an invoice, quotation, receipt or delivery note that follows Japan’s qualified invoice (invoice system) layout, with the amount and consumption tax subtotalled per rate (10% / 8%). When you are done, use your browser’s print dialog to save it as a PDF. Everything is processed in your browser and nothing you enter is sent to a server. To quickly check a tax-included or tax-excluded price, try the <a href="/en/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Consumption Tax & Discount Calculator</a>.',
    numberLocale: 'en-US',
    dateLocale: 'en-US',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose the document type: invoice, quotation, receipt or delivery note.',
      'Enter the recipient, your details (including registration number and bank account) and the line items with quantity, unit price and tax rate. Pick whether unit prices include tax and how to round.',
      'Check the per-rate subtotals and the total in the preview below.',
      'Press “Print / Save as PDF” and choose saving as a PDF as the destination in the print dialog.',
    ],
    docTypeLegend: 'Document type',
    docTypes: {
      invoice: {
        label: 'Invoice',
        title: 'INVOICE',
        numberLabel: 'Invoice no.',
        dateLabel: 'Invoice date',
        dueLabel: 'Due date',
        subjectLabel: 'Subject',
        subjectPlaceholder: 'e.g. Website production, October 2026',
        subjectFormat: 'Subject: {subject}',
        totalLabel: 'Amount due',
        lead: 'We are pleased to invoice you as follows.',
        showBank: true,
      },
      quote: {
        label: 'Quotation',
        title: 'QUOTATION',
        numberLabel: 'Quotation no.',
        dateLabel: 'Quotation date',
        dueLabel: 'Valid until',
        subjectLabel: 'Subject',
        subjectPlaceholder: 'e.g. Website production estimate',
        subjectFormat: 'Subject: {subject}',
        totalLabel: 'Quoted total',
        lead: 'We are pleased to quote as follows.',
        showBank: false,
      },
      receipt: {
        label: 'Receipt',
        title: 'RECEIPT',
        numberLabel: 'Receipt no.',
        dateLabel: 'Date received',
        dueLabel: null,
        subjectLabel: 'For',
        subjectPlaceholder: 'e.g. Payment for goods',
        subjectFormat: 'For: {subject}',
        totalLabel: 'Amount received',
        lead: 'Received with thanks the amount above.',
        showBank: false,
      },
      delivery: {
        label: 'Delivery note',
        title: 'DELIVERY NOTE',
        numberLabel: 'Delivery note no.',
        dateLabel: 'Delivery date',
        dueLabel: null,
        subjectLabel: 'Subject',
        subjectPlaceholder: 'e.g. Deliverables, October 2026',
        subjectFormat: 'Subject: {subject}',
        totalLabel: 'Total',
        lead: 'The items below have been delivered.',
        showBank: false,
      },
    },
    sectionBasicHeading: '1. Document details',
    sectionPartiesHeading: '2. Recipient and issuer',
    sectionItemsHeading: '3. Line items',
    sectionOptionsHeading: '4. Calculation and notes',
    previewHeading: 'Preview (this part is what gets printed)',
    documentNumberPlaceholder: 'e.g. 2026-001',
    recipientLabel: 'Recipient',
    recipientPlaceholder: 'e.g. Sample Inc.',
    honorificLabel: 'Honorific',
    honorifics: [{ value: '', label: 'None' }],
    issuerNameLabel: 'Issuer name (company, trade name or person)',
    issuerNamePlaceholder: 'e.g. Nyanko Studio',
    issuerAddressLabel: 'Issuer address',
    issuerAddressPlaceholder: 'e.g. 1-1 Chiyoda, Chiyoda-ku, Tokyo 100-0001',
    issuerContactLabel: 'Phone, email, etc.',
    issuerContactPlaceholder: 'e.g. info@example.com',
    registrationLabel: 'Qualified invoice issuer registration number',
    registrationPlaceholder: 'T1234567890123',
    errorRegistration:
      'The registration number must be “T” followed by 13 digits (e.g. T1234567890123)',
    bankLabel: 'Bank account for payment',
    bankPlaceholder: 'e.g. Sample Bank, Branch 001, Ordinary 1234567',
    notesInputLabel: 'Notes',
    notesInputPlaceholder: 'e.g. Bank transfer fees are borne by the payer.',
    saveIssuerButton: 'Save issuer details in this browser',
    clearIssuerButton: 'Delete saved issuer details',
    issuerSavedMessage: 'Saved the issuer details in this browser',
    issuerClearedMessage: 'Deleted the saved issuer details',
    priceModeLegend: 'Unit prices are entered',
    priceExclusive: 'Excluding tax',
    priceInclusive: 'Including tax',
    roundingLegend: 'Rounding (amounts and tax)',
    roundingFloor: 'Round down',
    roundingRound: 'Round to nearest',
    roundingCeil: 'Round up',
    itemsListLabel: 'Line items',
    itemNameLabel: 'Description',
    itemNamePlaceholder: 'e.g. Website production',
    itemQuantityLabel: 'Qty',
    itemUnitPriceLabel: 'Unit price (JPY)',
    itemTaxRateLabel: 'Tax rate',
    taxRate10: '10%',
    taxRate8: '8% (reduced)',
    taxRate0: 'Exempt / non-taxable',
    itemAmountLabel: 'Amount',
    addItemButton: 'Add line',
    removeItemButton: 'Remove',
    errorNoItems: 'Enter at least one line item',
    errorTooManyItems: 'Up to 50 line items are supported',
    errorInvalidItem:
      'Line {n}: quantity must be 0 or more and the unit price must be a number (use a negative unit price for a discount)',
    errorTooLarge:
      'The amount is too large (each line and the total must be within 10 billion yen)',
    printButton: 'Print / Save as PDF',
    printHint:
      'Turn off “Headers and footers” in the print dialog to keep the date and URL off the page.',
    paperRegistrationPrefix: 'Registration no.',
    paperColName: 'Description',
    paperColQuantity: 'Qty',
    paperColUnitExcl: 'Unit price (excl. tax)',
    paperColUnitIncl: 'Unit price (incl. tax)',
    paperColRate: 'Tax rate',
    paperColAmount: 'Amount',
    paperTaxableRow: 'Subject to {rate}%',
    paperTaxableRow0: 'Exempt / non-taxable',
    paperTaxRow: 'Consumption tax ({rate}%)',
    paperSubtotalLabel: 'Subtotal (excl. tax)',
    paperTaxTotalLabel: 'Total consumption tax',
    paperTotalLabel: 'Total (incl. tax)',
    paperTaxIncludedSuffix: ' (incl. tax)',
    paperReducedNote: '* Subject to the 8% reduced tax rate.',
    paperBankHeading: 'Bank account',
    paperNotesHeading: 'Notes',
    notesHeading: 'Notes',
    notes: [
      'To match the qualified invoice rules, consumption tax is calculated once on the total of each tax rate (not line by line) and rounded with the method you choose.',
      'The registration number is only checked for its format (“T” followed by 13 digits). To confirm it is actually registered, use the National Tax Agency’s public lookup site for qualified invoice issuers.',
      'This tool helps with layout and arithmetic and does not guarantee that the contents are correct or tax compliant. Required entries depend on the transaction, so check important documents with a tax accountant or the National Tax Agency guidance.',
      'A receipt for 50,000 yen or more may need a revenue stamp. Documents delivered as electronic data such as a PDF do not, but a printed paper copy may.',
      'Saved issuer details stay in this browser on this device only and are never sent to a server. On a shared computer, delete the saved issuer details when you are done. The recipient and line items are not saved and disappear when you close the page.',
      'Based on Japan’s 10% standard and 8% reduced consumption tax rates (as of October 2026) and the qualified invoice system.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Qualified invoice',
        description:
          'An invoice under Japan’s invoice system that tells the buyer the amount and consumption tax for each tax rate. It must show the issuer’s name and registration number, the transaction date, the items (marking reduced-rate items), the total per tax rate with the applicable rate, the tax amount per rate, and the recipient’s name.',
      },
      {
        term: 'Registration number',
        description:
          'A 13-digit number starting with “T” given to registered qualified invoice issuers. For a corporation it is “T” plus its corporate number; sole proprietors receive a separate number.',
      },
      {
        term: 'Reduced tax rate',
        description:
          'The 8% rate applied to food and non-alcoholic beverages (excluding dining out) and subscription newspapers, among others. Invoices must make clear which items are reduced-rate, for example with an asterisk.',
      },
    ],
  },
};
