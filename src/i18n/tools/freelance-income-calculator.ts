import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface FreelanceIncomeCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  sectionHeading: string;
  revenueLabel: string;
  revenuePlaceholder: string;
  expensesLabel: string;
  expensesPlaceholder: string;
  blueReturnLegend: string;
  blueReturnNone: string;
  blueReturn10: string;
  blueReturn55: string;
  blueReturn65: string;
  socialInsuranceLabel: string;
  socialInsurancePlaceholder: string;
  otherDeductionsLabel: string;
  otherDeductionsPlaceholder: string;
  error: string;
  resultNetIncomeLabel: string;
  resultTotalTaxLabel: string;
  resultEffectiveTaxRateLabel: string;
  resultBusinessIncomeLabel: string;
  resultTaxableIncomeTaxLabel: string;
  resultIncomeTaxLabel: string;
  resultReconstructionTaxLabel: string;
  resultTaxableResidentTaxLabel: string;
  resultResidentTaxLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const freelanceIncomeCalculatorContent: Record<
  Locale,
  FreelanceIncomeCalculatorPageContent
> = {
  ja: {
    title:
      'フリーランス手取り計算機（個人事業主の所得税・住民税簡易シミュレーション）',
    description:
      '年間の売上・必要経費・青色申告特別控除・社会保険料から、フリーランス（個人事業主）の所得税・復興特別所得税・住民税と手取り額を簡易試算する無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'フリーランス手取り計算機',
    introHtml:
      '年間の売上・必要経費・青色申告特別控除・社会保険料の支払額を入力すると、事業所得から所得税・復興特別所得税・住民税を概算し、手取り額の目安を計算します。事業所得のみを前提とした簡易シミュレーションです。消費税額や割引後の価格を先に計算したい場合は <a href="/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">消費税・割引計算機</a> もあわせてご利用ください。',
    numberLocale: 'ja-JP',
    sectionHeading: '収入・控除の入力',
    revenueLabel: '年間の売上・報酬（円）',
    revenuePlaceholder: '6000000',
    expensesLabel: '年間の必要経費（円）',
    expensesPlaceholder: '1000000',
    blueReturnLegend: '青色申告特別控除',
    blueReturnNone: 'なし（白色申告）',
    blueReturn10: '10万円',
    blueReturn55: '55万円',
    blueReturn65: '65万円（e-Taxまたは電子帳簿保存）',
    socialInsuranceLabel:
      '社会保険料の年間支払額（国民年金・国民健康保険等）（円）',
    socialInsurancePlaceholder: '500000',
    otherDeductionsLabel:
      '基礎控除以外の所得控除の合計（配偶者控除・生命保険料控除等）（円）',
    otherDeductionsPlaceholder: '0',
    error:
      '計算できませんでした（売上・経費・社会保険料・その他の所得控除は0以上の値を入力してください）',
    resultNetIncomeLabel: '手取り額（年間の目安）',
    resultTotalTaxLabel: '税金の合計（所得税＋復興特別所得税＋住民税）',
    resultEffectiveTaxRateLabel: '実効税率（売上に対する税負担割合）',
    resultBusinessIncomeLabel: '事業所得（青色申告特別控除後）',
    resultTaxableIncomeTaxLabel: '課税所得金額（所得税）',
    resultIncomeTaxLabel: '所得税額',
    resultReconstructionTaxLabel: '復興特別所得税',
    resultTaxableResidentTaxLabel: '課税所得金額（住民税）',
    resultResidentTaxLabel: '住民税（所得割＋均等割）',
    notesHeading: '注意事項',
    notes: [
      '本ツールは、給与所得など事業所得以外の収入がないフリーランス（個人事業主）を前提とした簡易シミュレーションです。複数の所得がある場合の正確な税額は税理士や税務署にご確認ください。',
      '令和7・8年分の所得税の税率区分と基礎控除額（令和7年度税制改正後。合計所得金額に応じて58万円に最大37万円の特例加算、住民税は43万円）をもとに計算しています。特例加算のうち132万円超の区分は令和7・8年分の時限措置で、令和9年分以後は58万円になる予定です。税制改正により、翌年以降は数値が変更される場合があります。課税所得は1,000円未満を切り捨てています。',
      '住民税の調整控除は考慮していないため、住民税は実際より高めに出る傾向があり、実際の税額と数千円程度以上ずれることがあります。',
      '個人事業税、消費税（インボイス制度を含む）、ふるさと納税、iDeCo・小規模企業共済等掛金控除は考慮していません。必要に応じて「その他の所得控除」欄にまとめて入力してください。',
      '社会保険料（国民年金・国民健康保険等）は世帯構成や自治体によって金額が大きく異なるため、年間の実際の支払額（見込み額）をご自身で入力してください。',
      '住民税の均等割は自治体により金額がやや異なりますが、本ツールでは目安として5,000円で計算しています。所得が一定の非課税限度額（自治体・扶養人数により異なり、単身者でおおむね38万〜45万円程度）を下回る場合は均等割・所得割ともに非課税となりますが、本ツールはこの非課税判定を考慮していないため、低所得の場合は実際より税額を高く見積もることがあります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '事業所得',
        description:
          'フリーランス（個人事業主）の売上から必要経費を差し引いた金額です。ここからさらに青色申告特別控除や各種所得控除を差し引いたものが、税額計算のもとになる課税所得金額です。',
      },
      {
        term: '青色申告特別控除',
        description:
          '青色申告（複式簿記による帳簿付け等の要件を満たした確定申告）を行う事業者が受けられる特別控除です。e-Taxでの申告または電子帳簿保存を行うと65万円、それ以外の青色申告は55万円、簡易な記帳の場合は10万円が事業所得から控除されます。白色申告の場合は控除がありません。',
      },
      {
        term: '基礎控除',
        description:
          'すべての納税者が対象となる所得控除です。所得税は令和7年分から58万円に引き上げられ、合計所得金額655万円以下なら特例加算で最大95万円（132万円以下）まで増えます。住民税は合計所得金額2,400万円以下で43万円です。どちらも合計所得金額が大きいと逓減・消失します。',
      },
      {
        term: '復興特別所得税',
        description:
          '東日本大震災からの復興財源に充てるため、2013年から2037年まで所得税額に2.1%上乗せして課税される税金です。',
      },
      {
        term: '住民税の所得割・均等割',
        description:
          '住民税は、課税所得金額に応じて課税される「所得割」（道府県民税4%＋市町村民税6%＝合計10%が目安）と、所得金額にかかわらず定額で課税される「均等割」（自治体により多少異なりますが5,000円程度）の合計で計算されます。',
      },
    ],
  },
  en: {
    title: 'Freelancer Take-Home Pay Calculator (Japan)',
    description:
      "Estimate a Japanese freelancer's (sole proprietor) income tax, reconstruction surtax, and resident tax from annual revenue, expenses, the blue-return deduction, and social insurance payments, and see a rough take-home pay figure. Your data is processed in the browser and never sent to a server.",
    h1: 'Freelancer Take-Home Pay Calculator',
    introHtml:
      'Enter your annual revenue, necessary expenses, blue-return special deduction, and social insurance payments, and this tool estimates Japan\'s income tax, reconstruction surtax, and resident tax on your business income, along with a rough take-home pay figure. This is a simplified simulation that assumes business income is your only source of income. To work out consumption tax or a discounted price first, try the <a href="/en/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Consumption Tax & Discount Calculator</a> as well.',
    numberLocale: 'en-US',
    sectionHeading: 'Income and deductions',
    revenueLabel: 'Annual revenue (JPY)',
    revenuePlaceholder: '6000000',
    expensesLabel: 'Annual necessary expenses (JPY)',
    expensesPlaceholder: '1000000',
    blueReturnLegend: 'Blue-return special deduction',
    blueReturnNone: 'None (white-return filing)',
    blueReturn10: '¥100,000',
    blueReturn55: '¥550,000',
    blueReturn65: '¥650,000 (e-Tax or electronic bookkeeping)',
    socialInsuranceLabel:
      'Annual social insurance payments (national pension, national health insurance, etc.) (JPY)',
    socialInsurancePlaceholder: '500000',
    otherDeductionsLabel:
      'Other income deductions besides the basic deduction (spousal deduction, life insurance premium deduction, etc.) (JPY)',
    otherDeductionsPlaceholder: '0',
    error:
      'Could not calculate (revenue, expenses, social insurance, and other deductions must all be 0 or greater)',
    resultNetIncomeLabel: 'Estimated annual take-home pay',
    resultTotalTaxLabel:
      'Total tax (income tax + reconstruction surtax + resident tax)',
    resultEffectiveTaxRateLabel: 'Effective tax rate (tax ÷ revenue)',
    resultBusinessIncomeLabel: 'Business income (after blue-return deduction)',
    resultTaxableIncomeTaxLabel: 'Taxable income (income tax)',
    resultIncomeTaxLabel: 'Income tax',
    resultReconstructionTaxLabel: 'Reconstruction surtax',
    resultTaxableResidentTaxLabel: 'Taxable income (resident tax)',
    resultResidentTaxLabel: 'Resident tax (income levy + per-capita levy)',
    notesHeading: 'Notes',
    notes: [
      'This tool assumes a freelancer (sole proprietor) whose only income is business income, with no salary or other income sources. If you have multiple income sources, consult a tax accountant or your local tax office for an accurate figure.',
      "Calculated using Japan's income tax brackets and basic deductions for tax years 2025-2026 (as amended by the FY2025 tax reform: ¥580,000 plus a special addition of up to ¥370,000 depending on total income; ¥430,000 for resident tax). The additions for total income above ¥1.32 million are temporary measures for 2025-2026 and are scheduled to end from tax year 2027. These figures can change in later tax years due to tax reform. Taxable income is rounded down to the nearest ¥1,000.",
      'The resident tax adjustment credit is not taken into account, so resident tax tends to come out higher than reality, and real amounts can differ from this tool by a few thousand yen or more.',
      'The local business tax (個人事業税), consumption tax (including the invoice system), the furusato nozei hometown tax donation program, and the iDeCo/small enterprise mutual aid premium deduction are not included. Enter any of these under "other income deductions" if relevant.',
      'Social insurance payments (national pension, national health insurance, etc.) vary widely by household and municipality, so enter your own actual (or estimated) annual payment amount.',
      'The resident tax per-capita levy varies slightly by municipality; this tool uses a typical estimate of ¥5,000. If your income is below a municipality-specific tax-exempt threshold (roughly ¥380,000–¥450,000 for a single person, varying by municipality and dependents), both the per-capita and income-based levies are actually waived — this tool does not apply that exemption, so it may overestimate tax at low income levels.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Business income',
        description:
          "A freelancer's (sole proprietor's) revenue minus necessary expenses. Subtracting the blue-return special deduction and other income deductions from this figure gives the taxable income used to calculate tax.",
      },
      {
        term: 'Blue-return special deduction',
        description:
          "A special deduction available to businesses that file a blue return (a tax return that meets bookkeeping requirements such as double-entry accounting). It's ¥650,000 when filed via e-Tax or with electronic bookkeeping records, ¥550,000 for other blue returns, and ¥100,000 for simplified bookkeeping. A white-return filing gets no deduction.",
      },
      {
        term: 'Basic deduction',
        description:
          'A deduction available to every taxpayer. For income tax it is ¥580,000 from 2025, rising up to ¥950,000 (total income of ¥1.32 million or less) through special additions for total income up to ¥6.55 million. For resident tax it is ¥430,000 when total income is ¥24 million or less. Both phase out and disappear at higher income levels.',
      },
      {
        term: 'Reconstruction surtax',
        description:
          'A surtax added to fund reconstruction after the 2011 Great East Japan Earthquake, levied at 2.1% of the income tax amount from 2013 through 2037.',
      },
      {
        term: 'Resident tax income levy and per-capita levy',
        description:
          "Japan's resident tax combines an income-based levy (roughly 10% of taxable income: 4% prefectural + 6% municipal) with a flat per-capita levy (around ¥5,000, varying slightly by municipality) charged regardless of income.",
      },
    ],
  },
};
