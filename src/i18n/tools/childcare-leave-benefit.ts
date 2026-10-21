import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ChildcareLeaveBenefitPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  modeLabel: string;
  modeChildcare: string;
  modeMaternity: string;
  modeSick: string;
  error: string;
  // 育児休業給付金
  childcareHeading: string;
  wageLabel: string;
  wageHint: string;
  leaveDaysLabel: string;
  leaveDaysHint: string;
  supportLabel: string;
  supportHint: string;
  resultChildcareTotalLabel: string;
  resultWageDailyLabel: string;
  resultMonthlyFirstLabel: string;
  resultMonthlyAfterLabel: string;
  resultBenefitFirstLabel: string;
  resultBenefitAfterLabel: string;
  resultSupportLabel: string;
  limitUpperNote: string;
  limitLowerNote: string;
  // 出産手当金
  maternityHeading: string;
  standardMonthlyLabel: string;
  standardMonthlyHint: string;
  multipleLabel: string;
  delayLabel: string;
  delayHint: string;
  resultMaternityTotalLabel: string;
  resultStandardDailyLabel: string;
  resultBenefitDailyLabel: string;
  resultMaternityDaysLabel: string;
  // 傷病手当金
  sickHeading: string;
  absentLabel: string;
  absentHint: string;
  resultSickTotalLabel: string;
  resultPaidDaysLabel: string;
  sickCapNote: string;
  // 共通
  basisLine: string;
  disclaimer: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const childcareLeaveBenefitContent: Record<
  Locale,
  ChildcareLeaveBenefitPageContent
> = {
  ja: {
    title: '育児休業給付金・出産手当金・傷病手当金の計算｜支給額の目安',
    description:
      '育児休業給付金（67%・50%）、出産手当金、傷病手当金の支給額を月給や標準報酬月額から概算します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '育児休業給付金・出産手当金・傷病手当金の計算',
    introHtml:
      '休業前の賃金や標準報酬月額を入力すると、育児休業給付金（休業開始から180日目までは賃金日額の67%、181日目以降は50%）、出産手当金、傷病手当金（いずれも標準報酬日額の3分の2）の支給額の目安を計算します。現行制度に基づく概算で、法的な助言ではありません。育休中も含めた月々の手取りは <a href="/tools/salary-take-home-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">会社員の手取り計算機</a> もご利用ください。',
    numberLocale: 'ja-JP',
    modeLabel: '計算する給付',
    modeChildcare: '育児休業給付金',
    modeMaternity: '出産手当金',
    modeSick: '傷病手当金',
    error:
      '計算できませんでした（金額は1円以上、日数は整数で入力してください。育児休業の日数は1日以上です）',
    childcareHeading: '育児休業給付金の入力',
    wageLabel: '休業前6か月の賃金の月平均（円）',
    wageHint:
      '休業開始前の6か月間に支払われた賃金（残業代や通勤手当を含み、賞与を除く）の月平均です。額面で入力してください。',
    leaveDaysLabel: '育児休業の日数',
    leaveDaysHint:
      '休業開始日から終了日までの暦日数です。180日を超えた分は50%で計算します。',
    supportLabel: '出生後休業支援給付金（13%上乗せ）を受ける',
    supportHint:
      '子の出生後8週間以内に、両親がそれぞれ14日以上の育児休業を取るなどの条件を満たすと、最大28日分が加算されます。',
    resultChildcareTotalLabel: '支給額の合計（目安）',
    resultWageDailyLabel: '休業開始時賃金日額（上限・下限適用後）',
    resultMonthlyFirstLabel: '1か月（30日）あたり・67%の期間',
    resultMonthlyAfterLabel: '1か月（30日）あたり・50%の期間',
    resultBenefitFirstLabel: '育児休業給付金（180日目まで・67%）',
    resultBenefitAfterLabel: '育児休業給付金（181日目以降・50%）',
    resultSupportLabel: '出生後休業支援給付金',
    limitUpperNote: '賃金日額が上限を超えているため、上限額で計算しています。',
    limitLowerNote:
      '賃金日額が下限を下回っているため、下限額で計算しています。',
    maternityHeading: '出産手当金の入力',
    standardMonthlyLabel: '標準報酬月額（円）',
    standardMonthlyHint:
      '加入している健康保険の標準報酬月額です（給与明細や保険証で確認できます）。支給開始日以前の継続した12か月の平均が基準になるため、不明なときは月給の額面を入れた概算で構いません。',
    multipleLabel: '多胎妊娠（双子など）',
    delayLabel: '出産が予定日より遅れた日数',
    delayHint:
      '遅れた日数は産前の対象日数に加算されます。予定日どおり、または早まった場合は0のままにしてください。',
    resultMaternityTotalLabel: '出産手当金の合計（目安）',
    resultStandardDailyLabel: '標準報酬日額',
    resultBenefitDailyLabel: '支給日額（3分の2）',
    resultMaternityDaysLabel: '支給日数（産前＋産後56日）',
    sickHeading: '傷病手当金の入力',
    absentLabel: '連続して仕事を休んだ日数',
    absentHint:
      '最初の3日間（待期）を含む日数です。待期を除いた日数分が支給の対象になります。',
    resultSickTotalLabel: '傷病手当金の合計（目安）',
    resultPaidDaysLabel: '支給の対象日数（待期の3日を除く）',
    sickCapNote:
      '支給期間の上限（支給開始日から通算1年6か月）を超える分は含めていません。',
    basisLine:
      '令和8年8月1日改定の雇用保険の賃金日額の上限（16,540円）・下限（3,203円）に基づく概算です。',
    disclaimer:
      '法的な助言ではありません。実際の支給額は、ハローワーク・健康保険組合・協会けんぽの審査で決まります。',
    howToHeading: '使い方',
    howToSteps: [
      '「計算する給付」から、育児休業給付金・出産手当金・傷病手当金のどれかを選びます。',
      '育児休業給付金は「休業前6か月の賃金の月平均（円）」と「育児休業の日数」を入力します。',
      '出産手当金と傷病手当金は「標準報酬月額（円）」と、出産手当金なら「出産が予定日より遅れた日数」、傷病手当金なら「連続して仕事を休んだ日数」を入力します。',
      '支給額の合計と内訳が表示されます。実際の額は申請先で確認してください。',
    ],
    notesHeading: '注意事項',
    notes: [
      '育児休業給付金は、休業開始時賃金日額（休業前6か月の賃金総額÷180）×支給日数×67%（181日目以降は50%）で計算します。賃金日額には上限16,540円・下限3,203円（令和8年8月1日改定）があり、この額は毎年8月に見直されます。',
      '出生後休業支援給付金は、賃金日額の13%を最大28日分上乗せする制度です（令和7年4月開始）。給付率が67%と合わせて80%になり、育児休業中は社会保険料が免除されるため手取りがほぼ変わらない水準になります。両親とも14日以上の育児休業を取るなどの条件があり、本ツールは条件を満たすものとして計算します。',
      '育児休業中に会社から賃金が支払われる場合は、その額に応じて給付金が減額・支給されないことがあります。このツールは賃金の支払いがない前提です。',
      '出産手当金は、標準報酬日額（標準報酬月額÷30、10円未満四捨五入）の3分の2を、出産日以前42日（多胎は98日）と出産日の翌日以後56日の範囲で、会社を休んだ日について支給します。出産が遅れた場合はその日数が産前に加算されます。出産日が早まった場合や、休んでいない日、会社から給与が出ている日は対象外または減額になります。',
      '傷病手当金は、連続して3日間休んだ後の4日目以降について、標準報酬日額の3分の2を支給します。支給期間は支給開始日から通算1年6か月で、このツールでは548日を上限として概算しています。会社から給与が出ている日は減額されます。',
      '出産手当金・傷病手当金は協会けんぽなどの健康保険に加入している被保険者が対象で、国民健康保険には原則ありません。標準報酬日額は直近12か月の標準報酬月額の平均が基準ですが、このツールでは入力した標準報酬月額だけで計算しています。',
      '支給額は課税されません（所得税・住民税はかかりません）。育児休業給付金の期間中の社会保険料は免除されますが、出産手当金・傷病手当金の期間中の社会保険料は原則免除されない点に注意してください（産前産後休業中は免除されます）。',
      '上限額・基準年は制度改定で変わります。ツールは令和8年8月改定の賃金日額の上限・下限に基づく概算で、法的な助言ではありません。最新の額はハローワークや加入している健康保険の案内で確認してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '休業開始時賃金日額',
        description:
          '育児休業給付金の計算の基礎になる日額で、休業開始前6か月の賃金総額（賞与を除く）を180で割った額です。毎年8月に見直される上限と下限があります。',
      },
      {
        term: '標準報酬月額・標準報酬日額',
        description:
          '健康保険の保険料や給付の計算に使う、給与を区切って等級に当てはめた月額です。標準報酬日額はこれを30で割り、10円未満を四捨五入した額です。',
      },
      {
        term: '出生後休業支援給付金',
        description:
          '子の出生後の一定期間に両親がともに育児休業を取ったときに、賃金日額の13%を最大28日分上乗せする給付です。育児休業給付金の67%と合わせて80%になります。',
      },
      {
        term: '待期期間',
        description:
          '傷病手当金で、支給の対象にならない最初の連続3日間です。この間は有給休暇や公休でも数えますが、手当は4日目から出ます。',
      },
    ],
  },
  en: {
    title: 'Childcare Leave, Maternity & Sickness Benefit Calculator',
    description:
      'Estimate Japan’s childcare leave benefit (67% / 50%), maternity allowance and sickness allowance from your pay. Runs in your browser, nothing is uploaded.',
    h1: 'Japan Childcare Leave, Maternity & Sickness Benefit Calculator',
    introHtml:
      'Enter your pay before leave or your standard monthly remuneration to estimate the childcare leave benefit (67% of daily wage for the first 180 days, 50% after that), the maternity allowance, and the sickness allowance (two-thirds of the standard daily remuneration for both). It is a rough estimate under current rules and not legal advice. To see monthly take-home pay while you work, try the <a href="/en/tools/salary-take-home-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Salary Take-Home Pay Calculator</a>.',
    numberLocale: 'en-US',
    modeLabel: 'Benefit to calculate',
    modeChildcare: 'Childcare leave benefit',
    modeMaternity: 'Maternity allowance',
    modeSick: 'Sickness allowance',
    error:
      'Could not calculate (enter amounts of at least ¥1 and whole numbers of days; childcare leave must be at least 1 day)',
    childcareHeading: 'Childcare leave benefit',
    wageLabel: 'Average monthly pay in the 6 months before leave (JPY)',
    wageHint:
      'Gross pay for the six months before leave started, averaged per month. Include overtime and commuting allowance, exclude bonuses.',
    leaveDaysLabel: 'Days of childcare leave',
    leaveDaysHint:
      'Calendar days from the first to the last day of leave. Days beyond 180 are calculated at 50%.',
    supportLabel: 'Add the post-birth leave support benefit (+13%)',
    supportHint:
      'If both parents take at least 14 days of leave soon after birth, up to 28 days get an extra 13%. Tick this only if you meet the conditions.',
    resultChildcareTotalLabel: 'Estimated total benefit',
    resultWageDailyLabel: 'Daily wage at leave start (after cap and floor)',
    resultMonthlyFirstLabel: 'Per 30 days, at 67%',
    resultMonthlyAfterLabel: 'Per 30 days, at 50%',
    resultBenefitFirstLabel: 'Childcare benefit (up to day 180, 67%)',
    resultBenefitAfterLabel: 'Childcare benefit (day 181 on, 50%)',
    resultSupportLabel: 'Post-birth leave support benefit',
    limitUpperNote:
      'Your daily wage is above the upper limit, so the upper limit is used.',
    limitLowerNote:
      'Your daily wage is below the lower limit, so the lower limit is used.',
    maternityHeading: 'Maternity allowance',
    standardMonthlyLabel: 'Standard monthly remuneration (JPY)',
    standardMonthlyHint:
      'The grade-based monthly amount used by your health insurance (see your payslip or insurance notice). The real basis is the average of the last 12 months, so a rough figure from your gross monthly pay is fine for an estimate.',
    multipleLabel: 'Multiple birth (twins or more)',
    delayLabel: 'Days the birth was after the due date',
    delayHint:
      'Late days are added to the pre-birth period. Leave at 0 if the birth was on time or early.',
    resultMaternityTotalLabel: 'Estimated total allowance',
    resultStandardDailyLabel: 'Standard daily remuneration',
    resultBenefitDailyLabel: 'Daily allowance (two-thirds)',
    resultMaternityDaysLabel: 'Days covered (pre-birth plus 56 after)',
    sickHeading: 'Sickness allowance',
    absentLabel: 'Consecutive days off work',
    absentHint:
      'Include the first 3 waiting days. The allowance covers the days after that.',
    resultSickTotalLabel: 'Estimated total allowance',
    resultPaidDaysLabel: 'Days paid (excluding the 3 waiting days)',
    sickCapNote:
      'Days beyond the maximum payment period (1.5 years from the first payment) are not included.',
    basisLine:
      'Rough estimate based on the daily wage cap (¥16,540) and floor (¥3,203) for employment insurance, revised 1 August 2026.',
    disclaimer:
      'This is not legal advice. The actual amount is decided by Hello Work and your health insurer.',
    howToHeading: 'How to use',
    howToSteps: [
      'Pick a benefit under "Benefit to calculate": childcare leave, maternity, or sickness.',
      'For childcare leave, enter "Average monthly pay in the 6 months before leave (JPY)" and "Days of childcare leave".',
      'For maternity and sickness, enter "Standard monthly remuneration (JPY)", then "Days the birth was after the due date" or "Consecutive days off work".',
      'The total and breakdown appear below. Confirm the real amount with the office that handles your claim.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The childcare leave benefit is the daily wage at leave start (total pay for the 6 months before leave ÷ 180) × paid days × 67% (50% from day 181). The daily wage has an upper limit of ¥16,540 and a lower limit of ¥3,203 (revised 1 August 2026); these are reviewed every August.',
      'The post-birth leave support benefit adds 13% of the daily wage for up to 28 days (started April 2025). Together with the 67% it comes to 80%, and since social insurance premiums are waived during leave, take-home pay stays close to normal. It requires conditions such as both parents taking at least 14 days of leave. This tool assumes you meet them.',
      'If your employer pays wages during leave, the benefit may be reduced or stopped. This tool assumes no wages are paid.',
      'The maternity allowance is two-thirds of the standard daily remuneration (standard monthly remuneration ÷ 30, rounded to the nearest ¥10) for days off work within 42 days before the birth (98 for multiple births) and 56 days after. Late days are added to the pre-birth period. Days you did not take off, or days your employer paid wages, are excluded or reduced.',
      'The sickness allowance pays two-thirds of the standard daily remuneration from the fourth consecutive day off, after a 3-day waiting period. The payment period is 1.5 years from the first payment; this tool caps it at 548 days. Days with wages from your employer are reduced.',
      'The maternity and sickness allowances are for employees insured by employee health insurance such as Kyokai Kenpo, and generally not for National Health Insurance. The real basis is the average of the last 12 months of standard remuneration, but this tool uses only the figure you enter.',
      'These benefits are not taxed (no income tax or resident tax). Social insurance premiums are waived during childcare leave and during pre/postnatal leave, but generally not while receiving the sickness allowance.',
      'Caps and the base year change with reforms. This tool is an estimate using the 1 August 2026 wage limits and is not legal advice. Check the latest figures with Hello Work or your health insurer.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Daily wage at leave start',
        description:
          'The base for the childcare leave benefit: total pay for the 6 months before leave (excluding bonuses) divided by 180. It has an upper and lower limit revised every August.',
      },
      {
        term: 'Standard monthly / daily remuneration',
        description:
          'Health insurance puts your pay into a grade to get a standard monthly amount used for premiums and benefits. The standard daily amount is that divided by 30, rounded to the nearest ¥10.',
      },
      {
        term: 'Post-birth leave support benefit',
        description:
          'An extra 13% of the daily wage for up to 28 days when both parents take leave soon after birth. With the 67% benefit it totals 80%.',
      },
      {
        term: 'Waiting period',
        description:
          'The first 3 consecutive days of absence for the sickness allowance, which are not paid. Paid leave or days off still count; payment starts on day 4.',
      },
    ],
  },
};
