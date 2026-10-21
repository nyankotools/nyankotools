import type { Locale } from '../../data/tools';
import type { WallId } from '../../lib/tools/tax-wall-calculator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface TaxWallCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  sectionHeading: string;
  grossLabel: string;
  grossPlaceholder: string;
  wall106Label: string;
  wall106Hint: string;
  age40Label: string;
  spouseLabel: string;
  spouseOptions: {
    none: string;
    upTo9m: string;
    upTo9_5m: string;
    upTo10m: string;
  };
  spouseHint: string;
  rateLabel: string;
  rateOptions: { value: string; label: string }[];
  nationalLabel: string;
  nationalHint: string;
  error: string;
  resultHeading: string;
  statusLabel: string;
  statusDependent: string;
  statusEmployer: string;
  statusNational: string;
  resultSocialLabel: string;
  resultIncomeTaxLabel: string;
  resultResidentTaxLabel: string;
  resultTakeHomeLabel: string;
  resultMonthlyLabel: string;
  resultSpouseDeductionLabel: string;
  resultSpouseSavingLabel: string;
  resultHouseholdLabel: string;
  wallsHeading: string;
  wallLabels: Record<WallId, string>;
  wallExceeded: string;
  wallNotExceeded: string;
  wallNotApplicable: string;
  cliffsHeading: string;
  cliffTemplate: string;
  cliffNoRecoverTemplate: string;
  noCliffs: string;
  howToHeading: string;
  howToSteps: string[];
  disclaimer: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const taxWallCalculatorContent: Record<
  Locale,
  TaxWallCalculatorPageContent
> = {
  ja: {
    title: '年収の壁チェック｜106万・130万・160万の手取り逆転を試算',
    description:
      'パート・扶養向けに、年収の壁（106万円・130万円・160万円など）を超えたときの社会保険料・税金と手取りの逆転を試算します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '年収の壁チェック（手取り逆転シミュレーター）',
    introHtml:
      '本人の年収と配偶者の条件を入力すると、住民税・106万円・130万円・所得税（令和7年度税制改正後は160万円）・配偶者特別控除の各ラインを超えたかを判定し、年収を増やしたのに世帯の手取りが減る区間と、元の手取りに戻る年収を概算します。令和7年度税制改正後（令和7・8年分）の制度に基づく目安で、法的・税務上の助言ではありません。社会保険料を含む会社員の手取りは <a href="/tools/salary-take-home-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">会社員の手取り計算機</a> で確認できます。',
    numberLocale: 'ja-JP',
    sectionHeading: '本人と配偶者の条件',
    grossLabel: '本人の年間給与収入（円）',
    grossPlaceholder: '1000000',
    wall106Label: '勤務先は年収106万円から社会保険に加入する対象',
    wall106Hint:
      '従業員51人以上の会社などで、週20時間以上・月額賃金8.8万円以上などの要件を満たす場合にチェックします。チェックしないと、130万円まで扶養内として扱います。',
    age40Label: '40歳以上（介護保険料を含める）',
    spouseLabel: '配偶者（納税者）の合計所得金額',
    spouseOptions: {
      none: '配偶者控除を考えない',
      upTo9m: '900万円以下（給与収入1,095万円以下）',
      upTo9_5m: '900万円超950万円以下',
      upTo10m: '950万円超1,000万円以下',
    },
    spouseHint:
      '本人を配偶者控除・配偶者特別控除の対象にする納税者の所得区分です。1,000万円を超える場合は「配偶者控除を考えない」を選びます。',
    rateLabel: '配偶者の所得税率',
    rateOptions: [
      { value: '0.05', label: '5%' },
      { value: '0.1', label: '10%' },
      { value: '0.2', label: '20%' },
      { value: '0.23', label: '23%' },
      { value: '0.33', label: '33%' },
      { value: '0.4', label: '40%' },
      { value: '0.45', label: '45%' },
    ],
    nationalLabel: '国民健康保険料の年額（わかる場合・任意）',
    nationalHint:
      '130万円以上で社会保険に入らない場合の国民健康保険料です。空欄なら所得の約10%＋均等割で概算します（自治体で大きく異なります）。',
    error:
      '計算できませんでした（年収と国民健康保険料は0以上の数値を入力してください）',
    resultHeading: '指定した年収での試算',
    statusLabel: '社会保険の扱い',
    statusDependent: '配偶者の扶養（本人負担なし）',
    statusEmployer: '勤務先の社会保険に加入',
    statusNational: '国民健康保険・国民年金に加入',
    resultSocialLabel: '社会保険料（本人負担）',
    resultIncomeTaxLabel: '所得税（復興特別所得税を含む）',
    resultResidentTaxLabel: '住民税',
    resultTakeHomeLabel: '本人の年間手取り',
    resultMonthlyLabel: '月あたりの手取り',
    resultSpouseDeductionLabel: '配偶者控除・配偶者特別控除の額',
    resultSpouseSavingLabel: '配偶者側の税の軽減額（概算）',
    resultHouseholdLabel: '世帯の手取り（本人の手取り＋配偶者側の軽減額）',
    wallsHeading: '壁の判定',
    wallLabels: {
      'resident-tax': '住民税がかかり始める年収（非課税ライン）',
      'social-insurance': '106万円の壁（勤務先の社会保険に加入）',
      'spouse-deduction': '配偶者控除から配偶者特別控除に切り替わる年収',
      dependent: '130万円の壁（配偶者の扶養から外れる）',
      'income-tax': '所得税がかかり始める年収（社会保険料控除前の目安）',
      'spouse-special-full': '配偶者特別控除の満額（38万円）が減り始める年収',
      'spouse-special-end': '配偶者特別控除がなくなる年収',
    },
    wallExceeded: '超えている',
    wallNotExceeded: '超えていない',
    wallNotApplicable: '対象外',
    cliffsHeading: '手取り逆転チェック',
    cliffTemplate:
      '年収が{after}に達すると、世帯の手取りが最大{drop}減ります。{recover}まで稼ぐと元の手取り（{before}）に戻ります。',
    cliffNoRecoverTemplate:
      '年収が{after}に達すると、世帯の手取りが最大{drop}減ります。250万円までの範囲では元の手取りに戻りません。',
    noCliffs:
      '年収を増やして世帯の手取りが減る区間は、50万円〜250万円の範囲では見つかりませんでした。',
    howToHeading: '使い方',
    howToSteps: [
      '「本人の年間給与収入（円）」に、パートなどの年収（額面）を入力します。',
      '勤務先が106万円の壁の対象なら「勤務先は年収106万円から社会保険に加入する対象」にチェックします。',
      '配偶者控除を考えるときは「配偶者（納税者）の合計所得金額」と「配偶者の所得税率」を選びます。',
      '「壁の判定」と「手取り逆転チェック」で、年収を増やすと得か損かを確認します。',
    ],
    disclaimer:
      'この結果は令和7年度税制改正後の制度にもとづく概算の目安であり、法的・税務上の助言ではありません。実際の税額・社会保険料・扶養の可否は、勤務先・年金事務所・健康保険組合・税務署・お住まいの自治体で必ずご確認ください。',
    notesHeading: '注意事項',
    notes: [
      '令和7年度税制改正後（所得税は令和7・8年分、住民税は令和8年度）の制度に基づく概算です。所得税の壁は103万円から160万円（基礎控除95万円＋給与所得控除65万円）に、配偶者控除は年収123万円まで、配偶者特別控除の満額は年収160万円までに変わりました。制度の見直しがあると結果は変わります。',
      '社会保険の加入要件（従業員数・賃金・労働時間）は制度の拡大が予定されています。勤務先の条件や最新の要件は、勤務先・年金事務所・健康保険組合で確認してください。',
      '被扶養者の認定は健康保険組合ごとに運用が異なり、130万円の判定には残業代や交通費の扱いも関わります。60歳以上や障害のある方の基準（180万円未満）や、19〜22歳の特定親族特別控除（123万円）は本ツールでは扱いません。',
      '勤務先の家族手当・配偶者手当の支給条件（103万円や130万円などの独自の基準）は含まれていません。実際の損得は手当の有無で変わります。',
      '社会保険料は協会けんぽの平均的な率による概算で、国民健康保険料は所得の約10%（40歳以上は12%）＋均等割5万円の簡易な目安です。住民税は非課税ライン（年収110万円）以下で0円とし、調整控除などを簡略化しています。',
      '世帯の手取りは、本人の手取りに配偶者側の配偶者控除・配偶者特別控除による税の軽減額を加えた額で、配偶者の所得税率を使って概算しています。本ツールは法的・税務上の助言ではありません。実際の金額は勤務先や税務署、自治体で確認してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '年収の壁',
        description:
          '年収が一定額を超えると、税金や社会保険料の負担が増えたり、配偶者の控除・扶養から外れたりして、手取りが減る境目のことです。',
      },
      {
        term: '106万円の壁',
        description:
          '従業員51人以上などの勤務先で、週20時間以上・月額賃金8.8万円以上などの要件を満たすと、勤務先の厚生年金・健康保険に加入する目安の年収です。',
      },
      {
        term: '130万円の壁',
        description:
          '配偶者などの健康保険の被扶養者として認められる年収の基準です。超えると自分で国民健康保険・国民年金などに加入する負担が生じます。',
      },
      {
        term: '配偶者控除・配偶者特別控除',
        description:
          '納税者の所得から差し引ける控除です。令和7年分からは配偶者の合計所得が58万円以下（年収123万円まで）で配偶者控除、95万円以下（年収160万円まで）は配偶者特別控除も満額38万円で、133万円まで段階的に減ります。',
      },
    ],
  },
  en: {
    title: 'Japan Annual Income Wall Calculator: Take-Home Check',
    description:
      'Check Japan’s income walls (¥1.06M, ¥1.3M, ¥1.6M) for part-timers and dependents and see where take-home drops. Runs in your browser; nothing is uploaded.',
    h1: 'Japan Income Wall Checker (Take-Home Reversal Simulator)',
    introHtml:
      'Enter your annual pay and your spouse’s situation to see which Japanese “walls” you have crossed: resident tax, the ¥1.06 million social insurance wall, the ¥1.3 million dependent wall, the income tax wall (¥1.6 million after the 2025 tax reform), and the spousal deductions. The tool also finds the pay ranges where household take-home falls as income rises, and where it recovers. It reflects the rules after the FY2025 tax reform (2025 and 2026 income tax); it is a rough guide, not legal or tax advice. For a full employee net-pay estimate, use the <a href="/en/tools/salary-take-home-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Salary Take-Home Pay Calculator</a>.',
    numberLocale: 'en-US',
    sectionHeading: 'Your pay and your spouse',
    grossLabel: 'Your annual gross pay (JPY)',
    grossPlaceholder: '1000000',
    wall106Label:
      'My employer enrolls me in social insurance from ¥1.06 million',
    wall106Hint:
      'Check this if you work for a company with 51 or more employees and meet the weekly hours and monthly wage conditions. If unchecked, you stay a dependent until ¥1.3 million.',
    age40Label: 'Age 40 or older (include nursing care insurance)',
    spouseLabel: 'Spouse’s (taxpayer’s) total income',
    spouseOptions: {
      none: 'Ignore spousal deductions',
      upTo9m: '¥9 million or less (salary up to ¥10.95 million)',
      upTo9_5m: 'Over ¥9 million, up to ¥9.5 million',
      upTo10m: 'Over ¥9.5 million, up to ¥10 million',
    },
    spouseHint:
      'The income bracket of the taxpayer who claims you as a spouse. Choose “Ignore spousal deductions” if their total income exceeds ¥10 million.',
    rateLabel: 'Spouse’s income tax rate',
    rateOptions: [
      { value: '0.05', label: '5%' },
      { value: '0.1', label: '10%' },
      { value: '0.2', label: '20%' },
      { value: '0.23', label: '23%' },
      { value: '0.33', label: '33%' },
      { value: '0.4', label: '40%' },
      { value: '0.45', label: '45%' },
    ],
    nationalLabel: 'National Health Insurance premium per year (optional)',
    nationalHint:
      'Used when you earn ¥1.3 million or more and are not in employer insurance. If blank, it is estimated at about 10% of income plus a flat amount, which varies a lot by municipality.',
    error:
      'Could not calculate (enter pay and the insurance premium as numbers of 0 or greater)',
    resultHeading: 'Estimate at your pay',
    statusLabel: 'Insurance status',
    statusDependent: 'Dependent on spouse’s insurance (no premium)',
    statusEmployer: 'Enrolled in employer social insurance',
    statusNational: 'National Health Insurance and National Pension',
    resultSocialLabel: 'Insurance premiums (your share)',
    resultIncomeTaxLabel: 'Income tax (incl. reconstruction surtax)',
    resultResidentTaxLabel: 'Resident tax',
    resultTakeHomeLabel: 'Your annual take-home',
    resultMonthlyLabel: 'Monthly take-home',
    resultSpouseDeductionLabel: 'Spousal deduction amount',
    resultSpouseSavingLabel: 'Spouse’s tax saving (estimate)',
    resultHouseholdLabel: 'Household take-home (yours + spouse’s saving)',
    wallsHeading: 'Wall check',
    wallLabels: {
      'resident-tax': 'Resident tax starts (non-taxable limit)',
      'social-insurance': '¥1.06M wall (employer social insurance)',
      'spouse-deduction':
        'Spousal deduction switches to special spousal deduction',
      dependent: '¥1.3M wall (no longer a dependent)',
      'income-tax': 'Income tax starts (before insurance deduction)',
      'spouse-special-full': 'Full ¥380,000 special spousal deduction ends',
      'spouse-special-end': 'Special spousal deduction ends',
    },
    wallExceeded: 'Crossed',
    wallNotExceeded: 'Not crossed',
    wallNotApplicable: 'Not applicable',
    cliffsHeading: 'Take-home reversal check',
    cliffTemplate:
      'At {after}, household take-home falls by up to {drop}. You need to earn {recover} to get back to the earlier level ({before}).',
    cliffNoRecoverTemplate:
      'At {after}, household take-home falls by up to {drop}. It does not recover within the range up to ¥2.5 million.',
    noCliffs:
      'No range where household take-home falls as income rises was found between ¥500,000 and ¥2.5 million.',
    howToHeading: 'How to use',
    howToSteps: [
      'Enter your gross annual pay in "Your annual gross pay (JPY)".',
      'If your employer enrolls you from ¥1.06 million, check "My employer enrolls me in social insurance from ¥1.06 million".',
      'To include spousal deductions, choose "Spouse’s (taxpayer’s) total income" and "Spouse’s income tax rate".',
      'Read "Wall check" and "Take-home reversal check" to see whether earning more pays off.',
    ],
    disclaimer:
      'These results are rough estimates based on the rules after the FY2025 tax reform and are not legal or tax advice. Please confirm your actual tax, social insurance and dependent status with your employer, the pension office, your health insurer, the tax office and your local government.',
    notesHeading: 'Notes',
    notes: [
      'This is an estimate based on the rules after the FY2025 tax reform (2025 and 2026 income tax, FY2026 resident tax). The income tax wall moved from ¥1.03 million to ¥1.6 million (¥950,000 basic deduction plus ¥650,000 employment income deduction), the spousal deduction applies up to ¥1.23 million, and the full special spousal deduction up to ¥1.6 million. Results change if the rules change.',
      'Social insurance eligibility (company size, wages, working hours) is scheduled to expand. Check the current conditions with your employer, the pension office, or your health insurance society.',
      'Dependent status is decided by each health insurer, and overtime and commuting pay can matter for the ¥1.3 million test. The higher limit for people aged 60 or over or with disabilities, and the special deduction for dependents aged 19 to 22 (¥1.23 million), are not covered.',
      'Family or spouse allowances paid by your employer, which often use their own thresholds such as ¥1.03 million or ¥1.3 million, are not included. Whether earning more pays off can change depending on them.',
      'Social insurance uses average Kyokai Kenpo rates. National Health Insurance is a rough guess of about 10% of income (12% at 40 or older) plus a ¥50,000 flat amount. Resident tax is set to zero at or below ¥1.1 million and simplifies adjustments.',
      'Household take-home is your take-home plus your spouse’s tax saving from the spousal deductions, estimated with the spouse’s income tax rate. This is not legal or tax advice; confirm the real figures with your employer, tax office, or municipality.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Income wall',
        description:
          'A pay level where taxes or insurance premiums start, or where you lose a spouse’s deduction or dependent status, so take-home pay can fall even though you earn more.',
      },
      {
        term: '¥1.06 million wall',
        description:
          'Roughly the annual pay at which you must join your employer’s pension and health insurance, when the company has 51 or more employees and you meet the hours and monthly wage conditions.',
      },
      {
        term: '¥1.3 million wall',
        description:
          'The annual income limit for being a dependent on a spouse’s health insurance. Above it, you usually pay for National Health Insurance and the National Pension yourself.',
      },
      {
        term: 'Spousal deduction and special spousal deduction',
        description:
          'Deductions a taxpayer can take for a spouse. From 2025, a spouse with total income of ¥580,000 or less (pay up to ¥1.23 million) qualifies, and the full ¥380,000 applies up to ¥950,000 (pay up to ¥1.6 million), phasing out by ¥1.33 million.',
      },
    ],
  },
};
