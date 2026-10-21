import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface BonusTakeHomePageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  sectionHeading: string;
  bonusLabel: string;
  bonusPlaceholder: string;
  previousSalaryLabel: string;
  previousSalaryHint: string;
  previousSalaryPlaceholder: string;
  dependentsLabel: string;
  dependentsHint: string;
  paidLabel: string;
  paidHint: string;
  age40Label: string;
  error: string;
  resultTakeHomeLabel: string;
  resultRatioLabel: string;
  resultSocialInsuranceLabel: string;
  resultHealthLabel: string;
  resultNursingLabel: string;
  resultPensionLabel: string;
  resultEmploymentLabel: string;
  resultIncomeTaxLabel: string;
  resultRateLabel: string;
  resultStandardBonusLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const bonusTakeHomeContent: Record<Locale, BonusTakeHomePageContent> = {
  ja: {
    title: '賞与（ボーナス）の手取り計算｜社会保険料・源泉所得税を試算',
    description:
      'ボーナスの額面と前月の給与から、社会保険料と源泉所得税（算出率の表）を差し引いた賞与の手取り額を試算します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '賞与（ボーナス）の手取り計算',
    introHtml:
      '賞与の額面、前月の給与、扶養親族等の数を入力すると、社会保険料（健康保険・介護保険・厚生年金・雇用保険）と源泉所得税（賞与に対する源泉徴収税額の算出率の表・甲欄）を差し引いた手取りの目安を計算します。令和7年分の区分に基づく概算です。月給や年収の手取りは <a href="/tools/salary-take-home-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">会社員の手取り計算機</a> をご利用ください。',
    numberLocale: 'ja-JP',
    sectionHeading: '賞与・給与の入力',
    bonusLabel: '賞与の額面（円）',
    bonusPlaceholder: '1000000',
    previousSalaryLabel: '前月の給与の額面（円）',
    previousSalaryHint:
      '源泉徴収税額の算出率を決めるために使います。前月の社会保険料を概算で差し引いた額で、算出率の表を引きます。',
    previousSalaryPlaceholder: '300000',
    dependentsLabel: '扶養親族等の数（0〜7人以上）',
    dependentsHint:
      '源泉控除対象配偶者と扶養親族の合計人数です（甲欄）。8人以上でも7人として扱います。',
    paidLabel: '今年度すでに支給された賞与の合計（円）',
    paidHint:
      '4月〜翌3月に今回より前に支給された賞与の額です。健康保険・介護保険の年度上限（573万円）の判定に使います。',
    age40Label: '40歳以上（介護保険料を含める）',
    error:
      '計算できませんでした（前月の給与は1円以上、賞与・扶養人数・支給済み賞与は0以上の数値を入力してください）',
    resultTakeHomeLabel: '賞与の手取り額（目安）',
    resultRatioLabel: '額面に対する手取りの割合',
    resultSocialInsuranceLabel: '社会保険料の合計（本人負担分）',
    resultHealthLabel: '健康保険料',
    resultNursingLabel: '介護保険料',
    resultPensionLabel: '厚生年金保険料',
    resultEmploymentLabel: '雇用保険料',
    resultIncomeTaxLabel: '源泉所得税（復興特別所得税を含む）',
    resultRateLabel: '適用した算出率',
    resultStandardBonusLabel: '標準賞与額（1,000円未満切り捨て）',
    notesHeading: '注意事項',
    notes: [
      '社会保険料は協会けんぽの平均的な本人負担率（健康保険約4.955%、介護保険約0.795%、厚生年金9.15%、雇用保険0.55%）で計算しています。加入する健康保険組合・都道府県・業種によって料率は異なります。',
      '健康保険・介護保険は標準賞与額（賞与の1,000円未満を切り捨てた額）に料率を掛け、年度（4月〜翌3月）の累計573万円を上限とします。厚生年金は1回の支給につき150万円が上限です。雇用保険は賞与の額面に料率を掛けています。',
      '源泉所得税は、前月の社会保険料等控除後の給与と扶養親族等の数から賞与に対する源泉徴収税額の算出率の表（甲欄）で率を求め、社会保険料控除後の賞与に掛けて算出します。復興特別所得税を含んだ率です。',
      '本ツールの算出率の表は令和7年分の区分に基づく近似値で、国税庁の公表表を完全に再現したものではありません。実際の控除額は会社の給与計算に従うため、必ず賞与明細で確認してください。税務上の助言ではありません。',
      '前月に支払われた給与がない場合、賞与の額が前月給与の10倍を超える場合、乙欄（扶養控除等申告書の未提出）の場合などは別の計算方法になるため、本ツールでは扱いません。',
      '前月の社会保険料は、前月の給与の額面から簡易に概算しています。実際の標準報酬月額による控除額とは異なる場合があります。',
      '住民税は賞与から天引きされず、毎月の給与から差し引かれるため、この結果には含まれません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '標準賞与額',
        description:
          '賞与の額面から1,000円未満を切り捨てた額で、健康保険・介護保険・厚生年金の保険料の計算の基礎になります。健康保険は年度累計573万円、厚生年金は1回150万円が上限です。',
      },
      {
        term: '賞与に対する源泉徴収税額の算出率の表',
        description:
          '賞与から天引きする所得税を求めるため、国税庁が公表している表です。前月の社会保険料等控除後の給与と扶養親族等の数から税率を求め、社会保険料控除後の賞与に掛けます。',
      },
      {
        term: '甲欄・乙欄',
        description:
          '扶養控除等申告書を提出している主たる勤務先の給与には甲欄、提出していない場合や副業先の給与には乙欄を使います。このツールは甲欄だけを扱います。',
      },
      {
        term: '復興特別所得税',
        description:
          '東日本大震災の復興財源として所得税額に2.1%が上乗せされる税金です。賞与の算出率にはあらかじめ含まれています。',
      },
    ],
  },
  en: {
    title: 'Japan Bonus Take-Home Pay Calculator (Net Bonus)',
    description:
      'Estimate your net bonus in Japan after social insurance and withholding income tax, from the gross bonus and last month’s pay. Runs in your browser, no upload.',
    h1: 'Japan Bonus Take-Home Pay Calculator',
    introHtml:
      'Enter your gross bonus, last month’s salary, and number of dependents. The tool deducts social insurance (health, nursing care, pension, employment) and withholding income tax using an approximation of the NTA bonus withholding rate table (Column A), then shows a rough net bonus. It is an estimate; actual amounts follow your payroll. For regular monthly or annual pay, use the <a href="/en/tools/salary-take-home-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Salary Take-Home Pay Calculator</a>.',
    numberLocale: 'en-US',
    sectionHeading: 'Bonus and salary',
    bonusLabel: 'Gross bonus (JPY)',
    bonusPlaceholder: '1000000',
    previousSalaryLabel: 'Last month’s gross salary (JPY)',
    previousSalaryHint:
      'Used to pick the withholding rate. The tool subtracts estimated social insurance from it, then looks up the rate table.',
    previousSalaryPlaceholder: '300000',
    dependentsLabel: 'Number of dependents (0 to 7 or more)',
    dependentsHint:
      'Your spouse and dependents counted for withholding (Column A). Eight or more are treated as seven.',
    paidLabel: 'Bonuses already paid this fiscal year (JPY)',
    paidHint:
      'Bonuses paid earlier between April and the following March. Used for the annual health insurance cap of ¥5.73 million.',
    age40Label: 'Age 40 or older (include nursing care insurance)',
    error:
      'Could not calculate (enter last month’s salary of at least ¥1; bonus, dependents, and bonuses already paid must be 0 or greater)',
    resultTakeHomeLabel: 'Estimated net bonus',
    resultRatioLabel: 'Net as a share of gross',
    resultSocialInsuranceLabel: 'Total social insurance (your share)',
    resultHealthLabel: 'Health insurance',
    resultNursingLabel: 'Nursing care insurance',
    resultPensionLabel: 'Employees’ pension',
    resultEmploymentLabel: 'Employment insurance',
    resultIncomeTaxLabel:
      'Withholding income tax (incl. reconstruction surtax)',
    resultRateLabel: 'Withholding rate applied',
    resultStandardBonusLabel: 'Standard bonus amount (rounded down to ¥1,000)',
    notesHeading: 'Notes',
    notes: [
      'Social insurance uses typical Japan Health Insurance Association (Kyokai Kenpo) employee rates: about 4.955% health, 0.795% nursing care, 9.15% pension, and 0.55% employment insurance. Your insurer, prefecture, and industry may use different rates.',
      'Health and nursing care premiums apply to the standard bonus amount (the bonus rounded down to ¥1,000), capped at ¥5.73 million per fiscal year (April to March). The pension premium is capped at ¥1.5 million per payment. Employment insurance applies to the gross bonus.',
      'Withholding tax is found by looking up your rate in an approximation of the bonus withholding rate table (Column A), using last month’s salary after social insurance and your number of dependents, and multiplying it by the bonus after social insurance. The rate already includes the reconstruction surtax.',
      'The rate table here is an approximation based on the 2025 brackets, not an exact copy of the National Tax Agency table. Actual deductions follow your employer’s payroll, so check your bonus payslip. This is not tax advice.',
      'Special cases are not covered: no salary paid last month, a bonus more than ten times last month’s salary, and Column B (no dependent declaration filed).',
      'Last month’s social insurance is roughly estimated from the gross salary, so it can differ from the amount based on your actual standard monthly remuneration.',
      'Resident tax is not taken from bonuses; it is deducted from monthly pay, so it is not included in this result.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Standard bonus amount',
        description:
          'The gross bonus rounded down to ¥1,000, used as the base for health, nursing care, and pension premiums. Health insurance is capped at ¥5.73 million per fiscal year and pension at ¥1.5 million per payment.',
      },
      {
        term: 'Bonus withholding rate table',
        description:
          'A table published by the National Tax Agency for withholding income tax on bonuses. The rate is chosen from last month’s salary after social insurance and the number of dependents, then applied to the bonus after social insurance.',
      },
      {
        term: 'Column A and Column B',
        description:
          'Column A applies to pay from the main employer where you filed a dependent declaration; Column B applies when you have not filed one or for a second job. This tool covers Column A only.',
      },
      {
        term: 'Reconstruction surtax',
        description:
          'A 2.1% surtax on income tax that funds reconstruction after the Great East Japan Earthquake. It is already built into the bonus withholding rates.',
      },
    ],
  },
};
