import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface WithholdingTaxCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  howToHeading: string;
  howToSteps: string[];
  sectionHeading: string;
  modeLabel: string;
  modeExcl: string;
  modeIncl: string;
  modeNetExcl: string;
  modeNetIncl: string;
  modeHint: string;
  amountLabel: string;
  amountPlaceholder: string;
  judicialLabel: string;
  judicialHint: string;
  error: string;
  inexactNote: string;
  bandLow: string;
  bandHigh: string;
  resultWithholdingLabel: string;
  resultPaymentLabel: string;
  resultInvoiceTotalLabel: string;
  resultTargetLabel: string;
  resultConsumptionLabel: string;
  resultConsumptionNone: string;
  resultTaxBaseLabel: string;
  resultBandLabel: string;
  resultRateLabel: string;
  disclaimer: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const withholdingTaxCalculatorContent: Record<
  Locale,
  WithholdingTaxCalculatorPageContent
> = {
  ja: {
    title: '源泉徴収税額の計算｜報酬・原稿料・デザイン料（10.21%）',
    description:
      '報酬・原稿料・デザイン料・講演料の源泉徴収税額（10.21%・100万円超は20.42%）と振込額を計算します。消費税の区分や手取りからの逆算にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '源泉徴収税額の計算（報酬・原稿料・デザイン料）',
    introHtml:
      'フリーランスや個人への報酬・料金にかかる源泉徴収税額（復興特別所得税を含む）と、差引支払額（振込額）、請求額の内訳を計算します。消費税を請求書で区分している場合・していない場合、手取りから請求額を逆算する場合、司法書士等の報酬（1万円控除）に対応しています。令和8年時点の制度にもとづく目安で、税務上の助言ではありません。請求書づくりは <a href="/tools/invoice-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">請求書ジェネレーター</a> をご利用ください。',
    numberLocale: 'ja-JP',
    howToHeading: '使い方',
    howToSteps: [
      '「入力する金額」で、税抜報酬・税込金額・手取りのどれを入力するかを選びます。',
      '「金額（円）」に金額を入力します。',
      '司法書士・土地家屋調査士等への報酬の場合は「司法書士・土地家屋調査士等の報酬として計算する」にチェックします。',
      '源泉徴収税額、差引支払額（振込額）、請求額の内訳が表示されます。',
    ],
    sectionHeading: '金額の入力',
    modeLabel: '入力する金額',
    modeExcl: '税抜報酬（請求書で消費税を区分して記載）',
    modeIncl: '税込金額（消費税の区分なし）',
    modeNetExcl: '手取り（振込額）から逆算・消費税を区分',
    modeNetIncl: '手取り（振込額）から逆算・消費税の区分なし',
    modeHint:
      '請求書などで報酬と消費税が明確に区分されていれば、消費税を除いた金額が源泉徴収の対象になります。区分されていないと、消費税を含む金額全体が対象です。',
    amountLabel: '金額（円）',
    amountPlaceholder: '100000',
    judicialLabel: '司法書士・土地家屋調査士等の報酬として計算する',
    judicialHint:
      '司法書士・土地家屋調査士・海事代理士などへの報酬は、1回の支払ごとに1万円を差し引いた金額に税率をかけます。100万円を超えるかの判定も控除後の金額で行います。',
    error:
      '計算できませんでした（金額は0以上1兆円以下の数値で入力してください）',
    inexactNote:
      '入力した手取りちょうどになる請求額はありません。手取りが入力額以上になる最小の請求額を表示しています。',
    bandLow: '100万円以下（10.21%）',
    bandHigh: '100万円超の部分あり（20.42%）',
    resultWithholdingLabel: '源泉徴収税額',
    resultPaymentLabel: '差引支払額（振込額）',
    resultInvoiceTotalLabel: '請求額（報酬＋区分した消費税）',
    resultTargetLabel: '報酬額（源泉徴収の対象額）',
    resultConsumptionLabel: '消費税額（10%）',
    resultConsumptionNone: '区分なし（報酬額に含む）',
    resultTaxBaseLabel: '税率を適用する金額（控除後）',
    resultBandLabel: '適用される税率',
    resultRateLabel: '請求額に対する源泉徴収の割合',
    disclaimer:
      'この結果は令和8年時点の制度にもとづく目安であり、税務上の助言ではありません。源泉徴収の要否や対象額は支払内容によって異なります。個別の判断は税務署または税理士にご相談ください。',
    notesHeading: '注意事項',
    notes: [
      '令和8年時点の制度による目安です。税率は、支払金額が100万円以下なら10.21%、100万円を超える部分は20.42%（復興特別所得税2.1%を含む）で、100万円を超える場合の税額は（支払金額−100万円）×20.42%＋102,100円です。1円未満は切り捨てます（国税庁 タックスアンサー No.2795）。',
      '源泉徴収が必要になる主な報酬は、原稿料・講演料・デザイン料・翻訳料・イラスト料などの個人への支払い、弁護士・税理士・司法書士などの報酬、プロスポーツ選手やモデルなどへの報酬です。法人への支払いは原則として対象外ですが、例外もあります。',
      '賞金や、報酬の種類・金額によっては源泉徴収が不要または計算方法が異なる場合があります。このツールは、源泉徴収が必要な報酬であることを前提に金額だけを計算します。',
      '消費税は、請求書などで報酬と消費税が明確に区分されていれば、消費税を除いた金額を源泉徴収の対象にできます。区分されていなければ、消費税を含めた金額が対象です。このツールは消費税10%（1円未満切り捨て）で計算します。',
      '手取りからの逆算は、手取りが入力額以上になる最小の請求額を求めます。1円単位の端数の関係で、手取りがちょうど一致しない金額では近い値を表示します。',
      '源泉徴収した税額は、支払った月の翌月10日までに納付します。支払調書の提出や、受け取る側の確定申告での精算は、このツールの対象外です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '源泉徴収',
        description:
          '報酬を支払う側が、支払うときに所得税を差し引いて国に納める仕組みです。受け取る側は、差し引かれた後の金額を受け取り、確定申告で精算します。',
      },
      {
        term: '復興特別所得税',
        description:
          '東日本大震災の復興財源として、所得税額に2.1%が上乗せされる税金です。報酬の源泉徴収では所得税の10%に1.021をかけた10.21%になります。',
      },
      {
        term: '区分記載',
        description:
          '請求書などで、報酬の額と消費税の額を分けて書くことです。分けて書かれていれば、消費税を除いた金額を源泉徴収の対象にできます。',
      },
      {
        term: '手取り契約',
        description:
          '源泉徴収後に受け取る金額（手取り）を先に決めて、請求額を逆算する契約です。請求額は手取りより大きくなります。',
      },
    ],
  },
  en: {
    title: 'Japan Withholding Tax Calculator for Fees (10.21%)',
    description:
      'Calculate Japanese withholding tax (10.21%, 20.42% above ¥1M) on fees for writing, design and lectures, with consumption tax handling and net-pay reverse math.',
    h1: 'Japan Withholding Tax Calculator for Freelance Fees',
    introHtml:
      'Calculate the withholding income tax (including the 2.1% reconstruction surtax) on fees paid to freelancers and individuals in Japan, plus the amount actually transferred and a breakdown of the invoice. It handles invoices that list consumption tax separately or not, working backwards from a net amount, and judicial scrivener fees (¥10,000 deduction). Based on the rules as of 2026 (Reiwa 8) as a rough guide, not tax advice. To make an invoice, use the <a href="/en/tools/invoice-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Invoice Generator</a>.',
    numberLocale: 'en-US',
    howToHeading: 'How to use',
    howToSteps: [
      'Pick what you are entering under "Amount to enter": the fee before tax, the amount including tax, or the net amount.',
      'Type the number into "Amount (JPY)".',
      'For fees paid to judicial scriveners, land and house surveyors and similar professionals, tick "Calculate as a judicial scrivener / land and house surveyor fee".',
      'The withholding tax, the amount transferred and the invoice breakdown appear below.',
    ],
    sectionHeading: 'Enter an amount',
    modeLabel: 'Amount to enter',
    modeExcl: 'Fee before tax (consumption tax listed separately)',
    modeIncl: 'Amount including tax (not listed separately)',
    modeNetExcl: 'Work back from the net amount, tax listed separately',
    modeNetIncl: 'Work back from the net amount, tax not listed separately',
    modeHint:
      'If the invoice clearly separates the fee from consumption tax, withholding applies to the amount without consumption tax. If it does not, the whole amount including consumption tax is the base.',
    amountLabel: 'Amount (JPY)',
    amountPlaceholder: '100000',
    judicialLabel:
      'Calculate as a judicial scrivener / land and house surveyor fee',
    judicialHint:
      'For fees paid to judicial scriveners, land and house surveyors, maritime agents and similar professionals, ¥10,000 is subtracted per payment before the rate is applied. The ¥1 million threshold is also checked after that deduction.',
    error: 'Could not calculate (enter a number from 0 up to ¥1 trillion)',
    inexactNote:
      'No invoice amount gives exactly that net amount. The smallest invoice amount whose net is at least the one you entered is shown.',
    bandLow: '¥1 million or less (10.21%)',
    bandHigh: 'Includes the part above ¥1 million (20.42%)',
    resultWithholdingLabel: 'Withholding tax',
    resultPaymentLabel: 'Amount transferred (net)',
    resultInvoiceTotalLabel: 'Invoice total (fee plus listed consumption tax)',
    resultTargetLabel: 'Fee (withholding base)',
    resultConsumptionLabel: 'Consumption tax (10%)',
    resultConsumptionNone: 'Not listed (included in the fee)',
    resultTaxBaseLabel: 'Amount the rate is applied to (after deduction)',
    resultBandLabel: 'Rate applied',
    resultRateLabel: 'Withholding as a share of the invoice',
    disclaimer:
      'These results are a rough guide based on the rules as of 2026 (Reiwa 8) and are not tax advice. Whether and how much to withhold depends on the nature of the payment. Please ask your tax office or a tax accountant about your case.',
    notesHeading: 'Notes',
    notes: [
      'A rough guide based on the rules as of 2026 (Reiwa 8). The rate is 10.21% for payments up to ¥1 million; above that it is (payment − ¥1,000,000) × 20.42% + ¥102,100 (the rates include the 2.1% reconstruction surtax). Fractions under ¥1 are dropped (National Tax Agency Tax Answer No. 2795).',
      'Fees that usually need withholding include manuscript, lecture, design, translation and illustration fees paid to individuals, fees for lawyers, tax accountants and judicial scriveners, and fees for professional athletes and models. Payments to companies are generally exempt, with exceptions.',
      'Some prizes and other payments need no withholding or use a different method depending on type and amount. This tool assumes the payment is subject to withholding and only calculates the amount.',
      'If an invoice clearly separates the fee from consumption tax, you can withhold on the amount excluding consumption tax. If not, the amount including consumption tax is the base. This tool uses 10% consumption tax, rounded down to the yen.',
      'Working back from a net amount finds the smallest invoice amount whose net is at least what you entered. Because of yen rounding, some net amounts cannot be hit exactly, and a close value is shown.',
      'Withheld tax is due by the 10th of the month after payment. Payment statements and the recipient’s tax return are not covered by this tool.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Withholding tax',
        description:
          'The payer deducts income tax when paying a fee and remits it to the government. The recipient receives the amount after deduction and settles the difference in a tax return.',
      },
      {
        term: 'Reconstruction surtax',
        description:
          'A 2.1% surtax on income tax that funds reconstruction after the Great East Japan Earthquake. For fees, 10% × 1.021 gives the 10.21% rate.',
      },
      {
        term: 'Separate listing',
        description:
          'Writing the fee and the consumption tax as separate amounts on an invoice. When listed this way, the amount without consumption tax can be used as the withholding base.',
      },
      {
        term: 'Net-pay contract',
        description:
          'An agreement that fixes the amount received after withholding, so the invoice amount is worked out backwards. The invoice is larger than the net amount.',
      },
    ],
  },
};
