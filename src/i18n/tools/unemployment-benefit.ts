import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

/** 結果表示の文言。テンプレートの {n} などは page の script で置換する */
export interface UnemploymentBenefitResultFormat {
  /** {n} */
  days: string;
  restrictionNone: string;
  /** {n} */
  restrictionMonths: string;
  /** {n} */
  waiting: string;
  validityBase: string;
  /** {n} */
  validityExtra: string;
  clampMin: string;
  /** {amount} */
  clampMax: string;
  /** {months} 必要な被保険者期間（月） */
  notEligible: string;
  /** {percent} */
  rateValue: string;
}

export interface UnemploymentBenefitPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  disclaimer: string;
  numberLocale: string;
  ageLabel: string;
  wageLabel: string;
  wageHint: string;
  insuredYearsLabel: string;
  insuredMonthsLabel: string;
  insuredHint: string;
  reasonLabel: string;
  reasonSelf: string;
  reasonCompany: string;
  reasonContractEnd: string;
  reasonJustified: string;
  repeatedLabel: string;
  repeatedHint: string;
  errorAge: string;
  errorWage: string;
  errorPeriod: string;
  errorAgeService: string;
  resultFormat: UnemploymentBenefitResultFormat;
  resultDailyLabel: string;
  resultWageDailyLabel: string;
  resultRateLabel: string;
  resultDaysLabel: string;
  resultTotalLabel: string;
  resultPerCertificationLabel: string;
  resultWaitingLabel: string;
  resultRestrictionLabel: string;
  resultValidityLabel: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const unemploymentBenefitContent: Record<
  Locale,
  UnemploymentBenefitPageContent
> = {
  ja: {
    title: '失業保険（基本手当）の計算｜日額・給付日数・給付制限',
    description:
      '離職理由・年齢・被保険者期間・月額賃金から、失業保険（雇用保険の基本手当）の日額・給付日数・総額の目安、待期期間、自己都合の給付制限を計算。ブラウザ内で処理します。',
    h1: '失業保険（基本手当）の日額・給付日数計算',
    introHtml:
      '離職時の年齢、離職前6か月の月額賃金、雇用保険の被保険者期間、離職理由（自己都合・会社都合・契約満了・正当な理由のある自己都合）を入力すると、基本手当日額、所定給付日数、受け取れる総額の目安、待期期間、自己都合の給付制限（現行は原則1か月）を計算します。賃金日額の上限・下限と給付率（50〜80%、60〜64歳は45〜80%）は毎年8月に改定されるため、基準年を明記しています。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。退職後の手取りは <a href="/tools/salary-take-home-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">手取り計算機</a>、退職前の有給の確認は <a href="/tools/paid-leave-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">有給休暇の付与日数計算</a> もご利用ください。',
    disclaimer:
      'この結果は雇用保険制度にもとづく概算の目安であり、法的助言ではありません。実際の受給資格・基本手当日額・給付日数はハローワークが決定します。離職票の離職理由コードや個別の事情で変わるため、必ず管轄のハローワークでご確認ください。',
    numberLocale: 'ja-JP',
    ageLabel: '離職時の年齢',
    wageLabel: '離職前6か月の月額賃金（平均）',
    wageHint:
      '離職前6か月に毎月決まって支払われた賃金（税引前・残業代や通勤手当を含み、賞与は除く）の1か月平均です。',
    insuredYearsLabel: '被保険者期間（年）',
    insuredMonthsLabel: '被保険者期間（月）',
    insuredHint:
      '雇用保険に加入していた期間の合計です（離職票や雇用保険被保険者証で確認できます）。例: 8年6か月なら 8年・6か月。',
    reasonLabel: '離職理由',
    reasonSelf: '自己都合（転職・一身上の都合など）',
    reasonCompany: '会社都合（倒産・解雇・雇止めなど。特定受給資格者）',
    reasonContractEnd:
      '契約期間の満了で更新されなかった（特定理由離職者・更新を希望した場合）',
    reasonJustified: '正当な理由のある自己都合（病気・介護・通勤困難など）',
    repeatedLabel: '過去5年以内に自己都合で3回以上離職している',
    repeatedHint:
      '自己都合の場合のみ関係します。該当すると給付制限が1か月から3か月に延びます。',
    errorAge:
      '離職時の年齢は15〜64歳で入力してください（65歳以上は対象外です）',
    errorWage: '月額賃金は0より大きい数値で入力してください',
    errorPeriod:
      '被保険者期間は1か月以上で、年は0〜60、月は0〜11の整数で入力してください',
    errorAgeService:
      '年齢に対して被保険者期間が長すぎます。入力を見直してください',
    resultFormat: {
      days: '{n}日',
      restrictionNone: 'なし',
      restrictionMonths: '約{n}か月',
      waiting: '{n}日',
      validityBase: '離職日の翌日から1年',
      validityExtra: '離職日の翌日から1年と{n}日',
      clampMin: '賃金日額が下限額で計算されています。',
      clampMax: '賃金日額が上限額（{amount}）で頭打ちになっています。',
      notEligible:
        'この離職理由では、被保険者期間が{months}か月以上必要です。入力した期間では基本手当の受給資格がありません。',
      rateValue: '{percent}%',
    },
    resultDailyLabel: '基本手当日額',
    resultWageDailyLabel: '賃金日額（上下限適用後）',
    resultRateLabel: '給付率',
    resultDaysLabel: '所定給付日数',
    resultTotalLabel: '基本手当の総額（目安）',
    resultPerCertificationLabel: '失業認定1回あたりの目安',
    resultWaitingLabel: '待期期間',
    resultRestrictionLabel: '給付制限',
    resultValidityLabel: '受給期間',
    howToHeading: '使い方',
    howToSteps: [
      '「離職時の年齢」と「離職前6か月の月額賃金（平均）」を入力します（賞与を除いた税引前の額）。',
      '「被保険者期間（年）」と「被保険者期間（月）」に、雇用保険に加入していた期間を入力します。',
      '「離職理由」を選びます。自己都合の場合は、該当すれば「過去5年以内に自己都合で3回以上離職している」にチェックします。',
      '基本手当日額・所定給付日数・総額の目安、待期期間と給付制限を確認します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '基準年: 基本手当日額の上限（賃金日額の上限 × 給付率）は令和8年8月1日現在の額（30歳未満7,450円、30〜44歳8,270円、45〜59歳9,110円、60〜64歳7,830円）です。賃金日額の下限（3,203円）と給付率の区切り（5,480円・13,490円、60〜64歳は12,120円）も令和8年8月1日現在の値で、毎年8月1日に改定されます。',
      '日額は厚生労働省が公表する計算式にもとづく概算です。賃金日額は月額賃金を6倍して180で割った簡易値のため、ハローワークが決定する日額と数円〜数十円違う場合があります。',
      '賃金日額は、離職前6か月の賃金合計 ÷ 180（賞与を除く）で求めます。このツールは月額の平均を6倍して計算するため、離職前の月ごとの差は反映していません。',
      '被保険者期間は、離職前2年間（特定受給資格者・特定理由離職者は1年間）に賃金支払の基礎となった日数が11日以上ある月を1か月として数えます。このツールは入力した期間をそのまま使い、期間の数え方は検証しません。',
      '待期期間7日は全員に共通です。自己都合の給付制限は、令和7年4月1日以降の離職で原則1か月、5年以内に3回以上自己都合離職した場合は3か月です。離職前1年以内または離職期間中に教育訓練を受けると給付制限が解除されることがあり、重責解雇の場合は別に3か月の制限があります。',
      '契約期間の満了で更新されなかった場合の特定理由離職者は、離職日が令和9年（2027年）3月31日までのときに限り、特定受給資格者と同じ給付日数になります。それ以降の扱いは制度改正を確認してください。',
      '対象外: 65歳以上（高年齢求職者給付金）、障害者など就職困難者、日雇労働被保険者、短期雇用特例被保険者、受給期間の延長、再就職手当・傷病手当などの付随給付。不正受給には返還や納付が命じられます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '賃金日額・基本手当日額',
        description:
          '賃金日額は離職前6か月の賃金合計（賞与を除く）を180で割った額です。基本手当日額は賃金日額に給付率（50〜80%、60〜64歳は45〜80%）をかけた、1日あたりの給付額で、賃金が低いほど高い率になります。',
      },
      {
        term: '特定受給資格者・特定理由離職者',
        description:
          '特定受給資格者は倒産・解雇など、再就職の準備をする時間がないまま離職した人です。特定理由離職者は契約期間の満了で更新されなかった人や、病気・介護など正当な理由で自己都合離職した人です。給付日数が手厚くなったり、被保険者期間が6か月で足りたりします。',
      },
      {
        term: '待期期間・給付制限',
        description:
          '待期期間は求職申込み後の7日間で、基本手当は支給されません。給付制限は自己都合などで離職した場合に待期のあとさらに一定期間支給されない仕組みで、現行は原則1か月です。',
      },
      {
        term: '所定給付日数',
        description:
          '基本手当を受け取れる最大の日数で、離職理由・年齢・被保険者期間で決まります（90〜360日）。実際の支給は4週間に1度の失業認定を受けた日分で、就職すれば残りは受け取れません。',
      },
    ],
  },
  en: {
    title: 'Unemployment Benefit Calculator (Japan Basic Allowance)',
    description:
      "Estimate Japan's unemployment insurance basic allowance: daily amount, benefit days and waiting period by age, insured period and reason. Runs in your browser.",
    h1: 'Unemployment Benefit Calculator for Japan (Basic Allowance)',
    introHtml:
      'Enter your age at separation, your average monthly pay over the last six months, your employment insurance period and the reason you left (resigned, laid off, contract not renewed, or resigned for a justified reason). The tool estimates the daily basic allowance of Japan\'s employment insurance, the number of benefit days, the total you could receive, the 7-day waiting period and the benefit restriction after resigning (currently one month in most cases). The wage limits and benefit rates (50-80%, or 45-80% for ages 60-64) are revised every August, so the basis year is stated. Everything runs in your browser and nothing you type is sent to a server. For take-home pay see the <a href="/en/tools/salary-take-home-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Take-Home Pay Calculator</a>, and to check unused leave before you quit see the <a href="/en/tools/paid-leave-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Paid Leave Calculator</a>.',
    disclaimer:
      "These results are rough estimates based on Japan's employment insurance rules and are not legal advice. Hello Work decides your actual eligibility, daily amount and benefit days, and the reason code on your separation notice or personal circumstances can change them. Please confirm with your local Hello Work office.",
    numberLocale: 'en-US',
    ageLabel: 'Age at separation',
    wageLabel: 'Average monthly pay, last 6 months',
    wageHint:
      'The average of the regular monthly pay you received in the six months before leaving, before tax, including overtime and commuting allowance but excluding bonuses.',
    insuredYearsLabel: 'Insured period (years)',
    insuredMonthsLabel: 'Insured period (months)',
    insuredHint:
      'Total time you were covered by employment insurance (see your separation notice or insurance certificate). For example, 8 years 6 months is 8 years and 6 months.',
    reasonLabel: 'Reason for leaving',
    reasonSelf: 'Resigned (career change, personal reasons)',
    reasonCompany:
      'Laid off or company went under (dismissal, bankruptcy, non-renewal)',
    reasonContractEnd:
      'Fixed-term contract ended and was not renewed (you wanted renewal)',
    reasonJustified:
      'Resigned for a justified reason (illness, caregiving, hard commute)',
    repeatedLabel: 'Resigned 3 or more times in the past 5 years',
    repeatedHint:
      'Only matters if you resigned. If it applies, the benefit restriction is 3 months instead of 1.',
    errorAge: 'Enter an age from 15 to 64 (age 65 and over is not covered)',
    errorWage: 'Enter a monthly pay greater than 0',
    errorPeriod:
      'The insured period must be at least 1 month: whole years 0-60 and months 0-11',
    errorAgeService:
      'The insured period is too long for that age. Please check your input',
    resultFormat: {
      days: '{n} days',
      restrictionNone: 'None',
      restrictionMonths: 'About {n} months',
      waiting: '{n} days',
      validityBase: '1 year from the day after you leave',
      validityExtra: '1 year and {n} days from the day after you leave',
      clampMin: 'The daily wage was raised to the lower limit.',
      clampMax: 'The daily wage is capped at the upper limit ({amount}).',
      notEligible:
        'For this reason you need at least {months} months of insured period. The period you entered does not qualify for the basic allowance.',
      rateValue: '{percent}%',
    },
    resultDailyLabel: 'Daily basic allowance',
    resultWageDailyLabel: 'Daily wage (after limits)',
    resultRateLabel: 'Benefit rate',
    resultDaysLabel: 'Benefit days',
    resultTotalLabel: 'Total allowance (estimate)',
    resultPerCertificationLabel: 'Per certification (about 4 weeks)',
    resultWaitingLabel: 'Waiting period',
    resultRestrictionLabel: 'Benefit restriction',
    resultValidityLabel: 'Claim window',
    howToHeading: 'How to use',
    howToSteps: [
      'Enter "Age at separation" and "Average monthly pay, last 6 months" (before tax, excluding bonuses).',
      'Enter how long you were insured under "Insured period (years)" and "Insured period (months)".',
      'Choose "Reason for leaving". If you resigned, tick "Resigned 3 or more times in the past 5 years" when it applies.',
      'Read the daily allowance, benefit days, total estimate, waiting period and benefit restriction.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Basis year: the upper limits of the daily allowance (daily wage cap x rate) are the amounts in force from 1 August 2026: 7,450 yen under 30, 8,270 yen for 30-44, 9,110 yen for 45-59 and 7,830 yen for 60-64. The lower limit of the daily wage (3,203 yen) and the rate breakpoints (5,480 and 13,490 yen; 12,120 yen for ages 60-64) are also the values from 1 August 2026. All are revised every 1 August.',
      'The daily amount is an estimate based on the formulas published by the Ministry of Health, Labour and Welfare. Because the daily wage is simplified (monthly pay x 6 / 180), the amount Hello Work decides can differ by a few to a few dozen yen.',
      'The daily wage is the total pay over the last six months (excluding bonuses) divided by 180. This tool multiplies your monthly average by 6, so month-to-month differences before leaving are not reflected.',
      'An insured month is a month with 11 or more paid days. The period is counted over the last 2 years (1 year for laid-off workers and specified reasons). This tool uses the period you enter as is and does not verify how it was counted.',
      'The 7-day waiting period applies to everyone. For resignations on or after 1 April 2025 the benefit restriction is normally 1 month, or 3 months if you resigned 3 or more times in 5 years. Taking approved training can lift it, and dismissal for serious misconduct carries a separate 3-month restriction.',
      'A worker whose fixed-term contract was not renewed gets the same benefit days as a laid-off worker only if the separation date is on or before 31 March 2027. Check for rule changes after that.',
      'Not covered: age 65 and over (lump-sum payment for older workers), workers with disabilities who have difficulty finding work, daily workers, seasonal workers, claim window extensions, and add-ons such as reemployment or sickness allowances. Fraudulent claims must be repaid with penalties.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Daily wage and daily basic allowance',
        description:
          'The daily wage is your total pay over the last six months (excluding bonuses) divided by 180. The daily basic allowance is that amount times the benefit rate (50-80%, or 45-80% for ages 60-64); lower earners get a higher rate.',
      },
      {
        term: 'Specified qualifying job losers and specified reasons',
        description:
          'Specified qualifying job losers are people who lost their jobs through bankruptcy or dismissal without time to prepare. Specified-reason leavers include people whose fixed-term contract was not renewed and people who resigned for a justified reason such as illness or caregiving. They can get more benefit days and qualify with 6 months of insurance.',
      },
      {
        term: 'Waiting period and benefit restriction',
        description:
          'The waiting period is the first 7 days after you register for job seeking, with no payment. The benefit restriction is a further period without payment after waiting if you resigned, currently 1 month in most cases.',
      },
      {
        term: 'Benefit days',
        description:
          'The maximum number of days you can be paid (90 to 360), set by the reason for leaving, age and insured period. You are paid for days certified every four weeks, and the rest is not paid once you find work.',
      },
    ],
  },
};
