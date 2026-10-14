import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

/** 結果表示の文言。[単数形, 複数形] の組は件数が1のとき前者を使う */
export interface PaidLeaveResultFormat {
  /** {y} {m} {d} {w}（{mm} {dd} は0埋め） */
  date: string;
  weekdayLabels: string[];
  days: [string, string];
  /** {y} {m} */
  serviceYearsMonths: string;
  /** {y} */
  serviceYears: string;
  /** {m} */
  serviceMonths: string;
  categoryFull: string;
  /** {days} 週の所定労働日数 */
  categoryProportional: string;
  /** {days} {date} */
  currentValue: string;
  currentNone: string;
  /** {days} {date} {relative} */
  nextValue: string;
  nextNone: string;
  /** {days} 日数 */
  relativeFuture: string;
  relativeToday: string;
  statusCurrent: string;
  statusNext: string;
  mandatoryYes: string;
  mandatoryNo: string;
  /** {days} 現在の付与日数が10日以上のときの注意 */
  mandatoryCurrent: string;
  /** {days} 現在の付与日数が10日未満のときの注意 */
  mandatoryNotApplicable: string;
}

export interface PaidLeaveCalculatorPageContent {
  resultFormat: PaidLeaveResultFormat;
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  disclaimer: string;
  hireLabel: string;
  daysLabel: string;
  daysOption: string;
  hoursLabel: string;
  hoursUnit: string;
  hoursHint: string;
  referenceLabel: string;
  errorInvalidDate: string;
  errorHours: string;
  categoryLabel: string;
  currentLabel: string;
  nextLabel: string;
  maxHeldLabel: string;
  scheduleLabel: string;
  colService: string;
  colGrantDate: string;
  colDays: string;
  colExpiry: string;
  colMandatory: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const paidLeaveCalculatorContent: Record<
  Locale,
  PaidLeaveCalculatorPageContent
> = {
  ja: {
    resultFormat: {
      date: '{y}年{m}月{d}日（{w}）',
      weekdayLabels: ['日', '月', '火', '水', '木', '金', '土'],
      days: ['{n}日', '{n}日'],
      serviceYearsMonths: '{y}年{m}か月',
      serviceYears: '{y}年',
      serviceMonths: '{m}か月',
      categoryFull: '通常付与（週5日以上、または週30時間以上）',
      categoryProportional: '比例付与（週{days}日）',
      currentValue: '{days}（{date}付与）',
      currentNone: 'まだ付与されていません',
      nextValue: '{date}に{days}（{relative}）',
      nextNone: '-',
      relativeFuture: 'あと{days}',
      relativeToday: '本日',
      statusCurrent: '現在',
      statusNext: '次回',
      mandatoryYes: '対象',
      mandatoryNo: '-',
      mandatoryCurrent:
        '現在の付与日数は10日以上のため、付与日から1年以内に5日の取得が使用者に義務づけられています（年次有給休暇の時季指定義務）。',
      mandatoryNotApplicable:
        '現在の付与日数は10日未満のため、年5日の取得義務の対象ではありません。',
    },
    title: '有給休暇の付与日数計算（入社日・勤務形態から）',
    description:
      '入社日と週の所定労働日数から、年次有給休暇の付与日・付与日数を法定表で計算します。パート・アルバイトの比例付与、年5日取得義務、時効2年にも対応。ブラウザ内で処理します。',
    h1: '有給休暇の付与日数計算',
    introHtml:
      '入社日と週の所定労働日数（必要なら週の所定労働時間）を入力すると、労働基準法39条の法定表にもとづいて、有給休暇の付与日（入社6か月後、以後1年ごと）と付与日数、時効で消える日、年5日の取得義務の対象になる回を一覧で表示します。週4日以下で週30時間未満のパート・アルバイトは比例付与の表で計算します。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。日付どうしの日数は <a href="/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">日数計算機</a>、営業日の数え方は <a href="/tools/business-day-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">営業日計算</a> もご利用ください。',
    disclaimer:
      'この結果は労働基準法の法定最低基準にもとづく一般的な目安であり、法的助言ではありません。就業規則や雇用契約で法定を上回る日数を定めている場合があります。実際の付与日数は勤務先の規定や労働条件通知書、社労士・労働基準監督署などでご確認ください。',
    hireLabel: '入社日',
    daysLabel: '週の所定労働日数',
    daysOption: '週{n}日',
    hoursLabel: '週の所定労働時間（任意）',
    hoursUnit: '時間',
    hoursHint:
      '週の所定労働日数が4日以下でも、週の所定労働時間が30時間以上なら通常付与になります。わからなければ空欄で構いません。',
    referenceLabel: '基準日',
    errorInvalidDate: '実在する日付（1900〜2100年）を入力してください',
    errorHours: '週の所定労働時間は0より大きく168以下の数値で入力してください',
    categoryLabel: '付与区分',
    currentLabel: '現在の付与日数',
    nextLabel: '次回の付与',
    maxHeldLabel: '基準日時点の最大保有日数',
    scheduleLabel: '付与スケジュール',
    colService: '継続勤務',
    colGrantDate: '付与日',
    colDays: '付与日数',
    colExpiry: '時効で消える日',
    colMandatory: '年5日取得義務',
    howToHeading: '使い方',
    howToSteps: [
      '「入社日」を入力します。',
      '「週の所定労働日数」を選びます。週30時間以上働く場合は「週の所定労働時間（任意）」も入力します。',
      '「基準日」（初期値は今日）を変えると、その日時点の付与日数と次回の付与日を確認できます。',
      '付与スケジュールの表で、各付与日の日数・時効で消える日・年5日取得義務の対象かを確認します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '法定の最低基準による計算です。会社の規定で法定より多く付与されることがあり、その場合は就業規則が優先されます。法的助言ではありません。',
      '付与には、雇入れから6か月（以後は1年ごと）の間の全労働日の8割以上出勤していることが必要です。この計算は8割以上出勤している前提で、欠勤の多い年の扱いは反映していません。',
      '付与日数が10日以上の労働者には、付与日から1年以内に5日取得させる義務が使用者にあります（比例付与でも10日以上なら対象）。',
      '年次有給休暇の時効は付与日から2年です。未消化分は翌年度に繰り越せ、基準日時点の最大保有日数は、時効にかかっていない付与分を使い切っていない場合の合計です。',
      '勤務形態が途中で変わった場合は、各付与日時点の所定労働日数・時間で日数が決まります。この計算は全期間で同じ勤務形態と仮定しています。週の所定労働日数が不定期な場合は、年間の所定労働日数にもとづく表（週4日は169〜216日、週3日は121〜168日など）で判断します。',
      '付与日は入社日から6か月後の同じ日、以後1年ごとの同じ日で計算しています。該当日がない月（8月31日入社の6か月後など）は、期間が月末に満了するため翌月1日を付与日としています。雇入れの日から継続勤務の期間を通算するため、休職や育休の期間も在籍していれば勤続に含まれます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '比例付与',
        description:
          '週の所定労働日数が4日以下かつ週の所定労働時間が30時間未満の労働者について、所定労働日数に応じて付与日数を減らす制度です（年間の所定労働日数が216日以下の場合も対象）。週4日で入社6か月後は7日、週1日なら1日と定められています。',
      },
      {
        term: '年5日の取得義務',
        description:
          '年10日以上の有給休暇が付与される労働者に対して、使用者が付与日から1年以内に、時季を指定して5日取得させなければならない義務です。労働者が自分で取得した日数や計画的付与の日数は5日から差し引かれます。',
      },
      {
        term: '全労働日の8割出勤',
        description:
          '有給休暇が付与される条件の一つで、付与日の直前の1年間（初回は6か月間）の全労働日のうち8割以上出勤していることが必要です。業務上の傷病による休業や産前産後休業、育児・介護休業などは出勤したものとして扱われます。',
      },
    ],
  },
  en: {
    resultFormat: {
      date: '{w}, {y}-{mm}-{dd}',
      weekdayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      days: ['{n} day', '{n} days'],
      serviceYearsMonths: '{y} yr {m} mo',
      serviceYears: '{y} yr',
      serviceMonths: '{m} mo',
      categoryFull: 'Standard grant (5+ days per week, or 30+ hours per week)',
      categoryProportional: 'Proportional grant ({days} days per week)',
      currentValue: '{days} (granted {date})',
      currentNone: 'Not granted yet',
      nextValue: '{days} on {date} ({relative})',
      nextNone: '-',
      relativeFuture: 'in {days}',
      relativeToday: 'today',
      statusCurrent: 'Now',
      statusNext: 'Next',
      mandatoryYes: 'Yes',
      mandatoryNo: '-',
      mandatoryCurrent:
        'The current grant is 10 days or more, so the employer must have you take 5 days within one year of the grant date.',
      mandatoryNotApplicable:
        'The current grant is under 10 days, so the 5-day requirement does not apply.',
    },
    title: 'Japan Paid Leave Calculator (Days Granted by Hire Date)',
    description:
      'Find your annual paid leave days in Japan from your hire date and weekly schedule, with part-time proportional grants and the 5-day rule. Runs in your browser.',
    h1: 'Paid Leave Days Calculator (Japan)',
    introHtml:
      'Enter your hire date and the number of scheduled working days per week (and weekly hours if needed) to see when annual paid leave is granted under Article 39 of Japan\'s Labor Standards Act: six months after hire, then every year. The schedule shows the days granted each time, the date unused days expire, and which grants trigger the 5-day usage requirement. Part-timers working 4 days or fewer and under 30 hours a week use the proportional table. Everything runs in your browser and nothing you type is sent to a server. To count days between dates, try the <a href="/en/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Date Calculator</a> or the <a href="/en/tools/business-day-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Business Day Calculator</a>.',
    disclaimer:
      "These results are a general guide based on the statutory minimums in Japan's Labor Standards Act and are not legal advice. Your employer may grant more than the minimum. Check your company rules, employment contract, or a labor consultant for the actual number of days.",
    hireLabel: 'Hire date',
    daysLabel: 'Scheduled days per week',
    daysOption: '{n} per week',
    hoursLabel: 'Scheduled hours per week (optional)',
    hoursUnit: 'hours',
    hoursHint:
      'Even if you work 4 days a week or fewer, 30 or more scheduled hours per week counts as the standard grant. Leave blank if you do not know.',
    referenceLabel: 'Reference date',
    errorInvalidDate: 'Enter a date that exists (between 1900 and 2100)',
    errorHours: 'Enter weekly hours greater than 0 and up to 168',
    categoryLabel: 'Grant type',
    currentLabel: 'Current grant',
    nextLabel: 'Next grant',
    maxHeldLabel: 'Maximum days held on the reference date',
    scheduleLabel: 'Grant schedule',
    colService: 'Service',
    colGrantDate: 'Grant date',
    colDays: 'Days granted',
    colExpiry: 'Expires on',
    colMandatory: '5-day requirement',
    howToHeading: 'How to use',
    howToSteps: [
      'Enter your "Hire date".',
      'Choose "Scheduled days per week". If you work 30 hours a week or more, also fill in "Scheduled hours per week (optional)".',
      'Change the "Reference date" (today by default) to see the grant and next grant date as of that day.',
      'Read the grant schedule table for the days granted, the expiry date, and whether the 5-day requirement applies.',
    ],
    notesHeading: 'Notes',
    notes: [
      'This uses the statutory minimums. Your company may grant more under its work rules, and those rules take priority. This is not legal advice.',
      'A grant requires attendance on at least 80% of all working days in the preceding period (the first 6 months, then each year). This tool assumes you meet that and does not model years with many absences.',
      'Employers must have workers who are granted 10 or more days take 5 of them within one year of the grant date. This also applies to proportional grants of 10 days or more.',
      'Paid leave expires 2 years after the grant date. Unused days carry over, and the maximum held is the sum of grants that have not expired, assuming none were used.',
      'If your work pattern changed over time, each grant is based on the schedule at that grant date. This tool assumes the same pattern throughout. For irregular schedules, the statute uses annual scheduled days (169-216 for 4 days a week, 121-168 for 3, and so on).',
      'Grant dates are the same day of the month six months (then each year) after hire. If that month has no such day (for example six months after August 31), the period ends on the last day of the month, so the grant date is the 1st of the next month. Continuous service counts from the hire date, including time on leave while still employed.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Proportional grant',
        description:
          'For workers scheduled 4 days or fewer per week and under 30 hours per week, the days granted are reduced by schedule (also applies if annual scheduled days are 216 or fewer). At six months, a 4-day worker gets 7 days and a 1-day worker gets 1.',
      },
      {
        term: '5-day usage requirement',
        description:
          'For workers granted 10 or more days a year, the employer must set the timing and have them take 5 days within one year of the grant date. Days taken on your own or under a planned-leave scheme count toward the 5.',
      },
      {
        term: '80% attendance rule',
        description:
          'A condition for the grant: attendance on at least 80% of all working days in the preceding year (6 months for the first grant). Work-related injury leave, maternity leave, and childcare or family-care leave are treated as attended.',
      },
    ],
  },
};
