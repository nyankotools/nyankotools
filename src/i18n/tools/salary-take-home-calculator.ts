import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SalaryTakeHomeCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  sectionHeading: string;
  grossLabel: string;
  grossPlaceholder: string;
  age40Label: string;
  socialInsuranceLabel: string;
  socialInsuranceHint: string;
  socialInsurancePlaceholder: string;
  otherDeductionsLabel: string;
  otherDeductionsPlaceholder: string;
  error: string;
  resultAnnualLabel: string;
  resultMonthlyLabel: string;
  resultRatioLabel: string;
  resultSocialInsuranceLabel: string;
  resultTotalTaxLabel: string;
  resultSalaryIncomeLabel: string;
  resultIncomeTaxLabel: string;
  resultReconstructionTaxLabel: string;
  resultResidentTaxLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const salaryTakeHomeCalculatorContent: Record<
  Locale,
  SalaryTakeHomeCalculatorPageContent
> = {
  ja: {
    title: '会社員の手取り計算機（年収から手取り額・月収を試算）',
    description:
      '額面年収から社会保険料・所得税・住民税を差し引いた会社員の手取り額（年間・月間）を簡易試算する無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '会社員の手取り計算機（年収から手取りを試算）',
    introHtml:
      '額面の年収を入力すると、社会保険料（健康保険・厚生年金・雇用保険）、所得税・復興特別所得税、住民税を概算し、年間と月間の手取り額の目安を計算します。令和7・8年分の税制に基づく簡易シミュレーションです。フリーランスの場合は <a href="/tools/freelance-income-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">フリーランス手取り計算機</a>、寄付で税金が軽くなる額を知りたい場合は <a href="/tools/furusato-nozei-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ふるさと納税の上限額試算</a> をご利用ください。',
    numberLocale: 'ja-JP',
    sectionHeading: '給与・控除の入力',
    grossLabel: '額面の年収（賞与込み・円）',
    grossPlaceholder: '5000000',
    age40Label: '40歳以上（介護保険料を含める）',
    socialInsuranceLabel: '社会保険料の年間額（わかる場合のみ・円）',
    socialInsuranceHint:
      '空欄の場合は年収から概算します。給与明細や源泉徴収票の「社会保険料等の金額」を入力すると精度が上がります。',
    socialInsurancePlaceholder: '概算する',
    otherDeductionsLabel:
      '基礎控除以外の所得控除の合計（配偶者控除・扶養控除・生命保険料控除等）（円）',
    otherDeductionsPlaceholder: '0',
    error:
      '計算できませんでした（年収・社会保険料・その他の所得控除は0以上の値を入力してください）',
    resultAnnualLabel: '手取り額（年間の目安）',
    resultMonthlyLabel: '手取り額（月あたりの目安）',
    resultRatioLabel: '額面に対する手取りの割合',
    resultSocialInsuranceLabel: '社会保険料（本人負担分）',
    resultTotalTaxLabel: '税金の合計（所得税＋復興特別所得税＋住民税）',
    resultSalaryIncomeLabel: '給与所得（給与所得控除後）',
    resultIncomeTaxLabel: '所得税額',
    resultReconstructionTaxLabel: '復興特別所得税',
    resultResidentTaxLabel: '住民税（所得割＋均等割）',
    notesHeading: '注意事項',
    notes: [
      '本ツールは、給与収入のみの会社員（正社員）を前提とした簡易シミュレーションです。副業収入や年の途中での入退社、賞与の多寡による月ごとの差は考慮していません。',
      '社会保険料は協会けんぽの平均的な料率（健康保険の本人負担約4.955%、介護保険約0.795%、厚生年金9.15%、雇用保険0.55%）で概算しています。健康保険組合や都道府県、会社の業種によって料率は異なるため、給与明細の実額がわかる場合は「社会保険料の年間額」に入力してください。',
      '令和7・8年分の給与所得控除（最低保障65万円）・所得税の基礎控除（令和7年度税制改正後）・住民税の基礎控除（43万円）をもとに計算しています。税制改正により、翌年以降は数値が変更される場合があります。',
      '扶養控除・配偶者控除・生命保険料控除・住宅ローン控除などは個別に反映していません。所得控除に当たるものは「その他の所得控除」にまとめて入力できますが、税額控除である住宅ローン控除は反映できません。',
      '住民税は前年の所得をもとに翌年度に課税されるため、実際の毎月の手取りは前年と今年の収入差で変わります。本ツールは同じ収入が続いた場合の目安です。',
      '住民税の調整控除は基礎控除分のみを考慮し、均等割は5,000円で計算しています。自治体ごとの差や、低所得の場合の非課税判定は考慮していません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '額面と手取り',
        description:
          '額面は社会保険料や税金を引かれる前の給与の総額、手取りはそこから社会保険料・所得税・住民税を引いて実際に受け取れる金額です。一般に手取りは額面の75〜85%前後になります。',
      },
      {
        term: '給与所得控除',
        description:
          '給与収入から差し引ける、会社員向けの「必要経費」にあたる控除です。令和7年分から最低保障額が65万円に引き上げられ、年収190万円以下は65万円、年収850万円超は195万円が上限になります。',
      },
      {
        term: '社会保険料',
        description:
          '健康保険・厚生年金・雇用保険（40歳以上は介護保険を含む）の本人負担分で、会社と労使折半（雇用保険は別の割合）です。全額が所得控除となり、税金の計算でも差し引かれます。',
      },
      {
        term: '復興特別所得税',
        description:
          '東日本大震災からの復興財源に充てるため、2013年から2037年まで所得税額に2.1%上乗せして課税される税金です。',
      },
      {
        term: '住民税の所得割・均等割',
        description:
          '住民税は、課税所得に応じた「所得割」（約10%）と、所得にかかわらず定額の「均等割」（約5,000円）の合計です。前年の所得をもとに6月から翌年5月にかけて給与天引き（特別徴収）されるのが一般的です。',
      },
    ],
  },
  en: {
    title: 'Japan Salary Take-Home Pay Calculator (Gross to Net)',
    description:
      'Estimate your annual and monthly take-home pay in Japan from gross salary: social insurance, income tax, and resident tax. Runs in your browser, no upload.',
    h1: 'Japan Salary Take-Home Pay Calculator',
    introHtml:
      'Enter your gross annual salary and this tool estimates social insurance (health, pension, employment), income tax with the reconstruction surtax, and resident tax, then shows a rough annual and monthly take-home figure. It is a simplified simulation based on the 2025–2026 tax rules. If you are self-employed, try the <a href="/en/tools/freelance-income-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Freelancer Take-Home Pay Calculator</a>; to find how much you can donate through hometown tax, use the <a href="/en/tools/furusato-nozei-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Furusato Nozei Limit Calculator</a>.',
    numberLocale: 'en-US',
    sectionHeading: 'Salary and deductions',
    grossLabel: 'Gross annual salary, bonuses included (JPY)',
    grossPlaceholder: '5000000',
    age40Label: 'Age 40 or older (include nursing care insurance)',
    socialInsuranceLabel:
      'Annual social insurance premiums, if known (JPY, optional)',
    socialInsuranceHint:
      'Leave blank to estimate from your salary. Entering the amount from your payslip or year-end tax statement improves accuracy.',
    socialInsurancePlaceholder: 'Estimate',
    otherDeductionsLabel:
      'Other income deductions besides the basic deduction (spouse, dependents, life insurance, etc.) (JPY)',
    otherDeductionsPlaceholder: '0',
    error:
      'Could not calculate (salary, social insurance, and other deductions must be 0 or greater)',
    resultAnnualLabel: 'Estimated annual take-home pay',
    resultMonthlyLabel: 'Estimated monthly take-home pay',
    resultRatioLabel: 'Take-home as a share of gross',
    resultSocialInsuranceLabel: 'Social insurance (your share)',
    resultTotalTaxLabel:
      'Total tax (income tax + reconstruction surtax + resident tax)',
    resultSalaryIncomeLabel: 'Employment income (after salary deduction)',
    resultIncomeTaxLabel: 'Income tax',
    resultReconstructionTaxLabel: 'Reconstruction surtax',
    resultResidentTaxLabel: 'Resident tax (income levy + per-capita levy)',
    notesHeading: 'Notes',
    notes: [
      'This is a simplified simulation for a full-time employee whose only income is salary. Side income, changing jobs mid-year, and month-to-month differences caused by bonuses are not considered.',
      'Social insurance is estimated with typical Japan Health Insurance Association (Kyokai Kenpo) rates: about 4.955% health insurance, 0.795% nursing care insurance, 9.15% employees’ pension, and 0.55% employment insurance. Rates differ by insurer, prefecture, and industry, so enter the actual annual amount from your payslip if you know it.',
      'Calculated with the 2025–2026 salary income deduction (minimum ¥650,000), the post-reform income tax basic deduction, and the ¥430,000 resident tax basic deduction. These figures can change in later tax years.',
      'Dependent, spouse, and life insurance deductions are not applied individually. Income deductions can be entered together under "other income deductions", but tax credits such as the housing loan deduction cannot be reflected.',
      'Resident tax is billed the following year on the previous year’s income, so your actual monthly take-home changes with the gap between last year’s and this year’s earnings. This tool assumes the same income continues.',
      'The resident tax adjustment credit only accounts for the basic deduction, and the per-capita levy is fixed at ¥5,000. Municipal differences and the low-income exemption are not considered.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Gross vs. take-home pay',
        description:
          'Gross pay is your total salary before social insurance and taxes; take-home pay is what you actually receive after those are deducted. Take-home is typically about 75–85% of gross.',
      },
      {
        term: 'Salary income deduction',
        description:
          'A deduction, similar to business expenses, subtracted from employees’ salary. From 2025 the minimum is ¥650,000 (salary up to ¥1.9 million), and it is capped at ¥1.95 million for salary above ¥8.5 million.',
      },
      {
        term: 'Social insurance',
        description:
          'Your share of health insurance, employees’ pension, and employment insurance (plus nursing care insurance from age 40). Health and pension are split equally with your employer. The full amount is deductible when calculating tax.',
      },
      {
        term: 'Reconstruction surtax',
        description:
          'A surtax to fund reconstruction after the 2011 Great East Japan Earthquake, levied at 2.1% of the income tax amount from 2013 through 2037.',
      },
      {
        term: 'Resident tax income levy and per-capita levy',
        description:
          'Resident tax combines an income-based levy (about 10% of taxable income) and a flat per-capita levy (about ¥5,000). It is based on the previous year’s income and is usually withheld from salary from June to May.',
      },
    ],
  },
};
