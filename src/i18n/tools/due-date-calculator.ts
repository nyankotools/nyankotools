import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface MilestoneText {
  name: string;
  description: string;
}

/** 結果表示の文言。[単数形, 複数形] の組は、件数が1のとき前者を使う（日本語は同じ文言） */
export interface DueDateResultFormat {
  /** {y} {m} {d} {w}（{mm} {dd} は0埋め） */
  date: string;
  weekdayLabels: string[];
  weeks: [string, string];
  days: [string, string];
  /** {weeks} {days} */
  gestation: string;
  /** {n} */
  month: string;
  /** {days} */
  dueIn: string;
  dueToday: string;
  /** {days} */
  dueOver: string;
  beforeStart: string;
  overdue: string;
  /** {days} の数え方 */
  relativeDays: [string, string];
  /** {days} */
  relativeFuture: string;
  /** {days} */
  relativePast: string;
  relativeToday: string;
  /** {week} {date} {name} {relative} */
  milestoneLine: string;
  milestones: Record<string, MilestoneText>;
}

export interface DueDateCalculatorPageContent {
  resultFormat: DueDateResultFormat;
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  disclaimer: string;
  modeLabel: string;
  modeLmp: string;
  modeOvulation: string;
  modeDue: string;
  dateLabelLmp: string;
  dateLabelOvulation: string;
  dateLabelDue: string;
  cycleLabel: string;
  cycleUnit: string;
  cycleHint: string;
  referenceLabel: string;
  errorInvalidDate: string;
  errorCycle: string;
  dueDateLabel: string;
  ovulationLabel: string;
  startLabel: string;
  currentLabel: string;
  monthLabel: string;
  milestonesLabel: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const dueDateCalculatorContent: Record<
  Locale,
  DueDateCalculatorPageContent
> = {
  ja: {
    resultFormat: {
      date: '{y}年{m}月{d}日（{w}）',
      weekdayLabels: ['日', '月', '火', '水', '木', '金', '土'],
      weeks: ['{n}週', '{n}週'],
      days: ['{n}日', '{n}日'],
      gestation: '妊娠{weeks}{days}',
      month: '妊娠{n}ヶ月',
      dueIn: '予定日まであと{days}',
      dueToday: '本日が出産予定日です',
      dueOver: '予定日を{days}過ぎています',
      beforeStart: '基準日が起点日より前のため、妊娠週数は計算されません',
      overdue:
        '42週0日以降（過期産の区分）にあたります。医療機関の指示に従ってください',
      relativeDays: ['{n}日', '{n}日'],
      relativeFuture: 'あと{days}',
      relativePast: '{days}前',
      relativeToday: '本日',
      milestoneLine: '妊娠{week}週 {date}：{name}（{relative}）',
      milestones: {
        week4: {
          name: '生理予定日ごろ',
          description: '妊娠検査薬で判定できるようになる時期の目安',
        },
        week12: {
          name: '妊娠12週の区切り',
          description:
            '流産のリスクが下がるとされる一つの目安。区切り方は資料により異なります',
        },
        week16: {
          name: '安定期の目安',
          description: '一般に16週ごろから。時期や体調には個人差があります',
        },
        week22: {
          name: '早産期の始まり',
          description: '22週0日〜36週6日の出産は「早産」に分類されます',
        },
        week28: {
          name: '妊娠後期の始まり',
          description: '28週0日以降が妊娠後期とされます',
        },
        week37: {
          name: '正期産の始まり',
          description: '37週0日〜41週6日の出産は「正期産」です',
        },
        week40: {
          name: '出産予定日',
          description: '40週0日。実際に出産する人は予定日前後に多くいます',
        },
        week42: {
          name: '過期産の始まり',
          description: '42週0日以降の出産は「過期産」に分類されます',
        },
      },
    },
    title: '出産予定日計算（妊娠週数・妊娠月数・安定期の目安）',
    description:
      '最終月経日・排卵日・分娩予定日のいずれかから、出産予定日と現在の妊娠週数・妊娠月数・安定期や正期産などの節目を無料で計算できます。月経周期の補正にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '出産予定日・妊娠週数計算',
    introHtml:
      '最終月経の開始日、排卵日、または分娩予定日を入力すると、出産予定日（ネーゲレ式の280日）、基準日時点の妊娠週数・日数・妊娠月数、安定期・正期産などの主な節目の日付をまとめて計算します。月経周期が28日でない場合は周期を入力すると補正できます。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。日付どうしの日数を数えたいときは <a href="/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">日数計算機</a>、別の健康指標は <a href="/tools/bmi-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">BMI計算機</a> もご利用ください。',
    disclaimer:
      'この結果は一般的な計算式による目安であり、医療上の診断・判断の代わりにはなりません。実際の予定日は超音波検査などをもとに医療機関が決定します。体調や妊娠の経過については、必ず医師・助産師にご相談ください。',
    modeLabel: '計算の起点',
    modeLmp: '最終月経の開始日',
    modeOvulation: '排卵日（受精日）',
    modeDue: '分娩予定日（逆算）',
    dateLabelLmp: '最終月経の開始日',
    dateLabelOvulation: '排卵日（受精日）',
    dateLabelDue: '分娩予定日',
    cycleLabel: '月経周期',
    cycleUnit: '日',
    cycleHint:
      '標準は28日。21〜45日の範囲で入力すると、28日との差だけ予定日を補正します。',
    referenceLabel: '基準日（現在の週数を確認する日）',
    errorInvalidDate: '実在する日付（1900〜2100年）を入力してください',
    errorCycle: '月経周期は21〜45日の整数で入力してください',
    dueDateLabel: '出産予定日',
    ovulationLabel: '排卵（受精）推定日',
    startLabel: '妊娠0週0日',
    currentLabel: '基準日時点の妊娠週数',
    monthLabel: '妊娠月数',
    milestonesLabel: '主な節目',
    howToHeading: '使い方',
    howToSteps: [
      '「計算の起点」で、わかっている日付の種類（最終月経・排卵日・分娩予定日）を選びます。',
      '日付を入力します。最終月経から計算するときは、必要なら月経周期も入力します。',
      '基準日（初期値は今日）を変えると、その日時点の妊娠週数を確認できます。',
      '出産予定日・妊娠週数・節目の日付が表示されます。結果は目安として参考にしてください。',
    ],
    notesHeading: '注意事項',
    notes: [
      'この結果は計算上の目安であり、医療上の診断・判断を代替するものではありません。実際の出産予定日や妊娠週数は、超音波検査などをもとに医療機関が決定します。',
      '最終月経から計算する場合、月経周期が28日と異なると、その差の日数だけ予定日をずらして補正します（周期が不規則な場合は目安になりにくくなります）。',
      '排卵日（受精日）から計算する場合は、予定日 = 排卵日 + 266日（妊娠0週0日 = 排卵日の14日前）として計算します。体外受精などの場合は移植日・採卵日の扱いが異なるため、医療機関の案内に従ってください。',
      '妊娠月数は4週ごとに1ヶ月として数える一般的な方法で、妊娠10ヶ月（36〜39週）で頭打ちにしています。安定期などの時期には個人差があります。',
      'このページは入力内容をブラウザ内だけで処理し、保存や送信を行いません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ネーゲレ式',
        description:
          '最終月経の開始日から出産予定日を求める代表的な方法で、「月数を3減らして（または9足して）日数に7を足す」と表現されます。月経周期が28日であることを前提に、最終月経開始日の280日後（40週0日）を予定日とします。本ツールは日数を直接足す方法で計算するため、まれに1日ずれることがあります。',
      },
      {
        term: '妊娠週数・妊娠0週0日',
        description:
          '最終月経の開始日（周期補正後）を妊娠0週0日として数える方法です。実際の受精はその約2週間後のため、受精の時点ですでに妊娠2週0日にあたります。',
      },
      {
        term: '正期産・早産・過期産',
        description:
          '出産時期による分類で、37週0日〜41週6日が正期産、22週0日〜36週6日が早産、42週0日以降が過期産とされます。',
      },
      {
        term: '安定期',
        description:
          '一般に妊娠16週ごろ〜を指して使われる通称で、医学的に明確に定義された用語ではありません。時期や体調には個人差があるため、目安として捉えてください。',
      },
    ],
  },
  en: {
    resultFormat: {
      date: '{w}, {y}-{mm}-{dd}',
      weekdayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      weeks: ['{n} week', '{n} weeks'],
      days: ['{n} day', '{n} days'],
      gestation: '{weeks}, {days}',
      month: 'Month {n}',
      dueIn: '{days} until the due date',
      dueToday: 'Today is the estimated due date',
      dueOver: '{days} past the due date',
      beforeStart:
        'The reference date is before the start date, so no gestational age is shown',
      overdue:
        "This is 42 weeks 0 days or later (the post-term range). Follow your healthcare provider's guidance.",
      relativeDays: ['{n} day', '{n} days'],
      relativeFuture: 'in {days}',
      relativePast: '{days} ago',
      relativeToday: 'today',
      milestoneLine: 'Week {week}, {date}: {name} ({relative})',
      milestones: {
        week4: {
          name: 'Around the expected period',
          description: 'Roughly when a home pregnancy test can detect it',
        },
        week12: {
          name: 'Week 12 checkpoint',
          description:
            'A common checkpoint after which the risk of miscarriage is said to drop; definitions vary by source',
        },
        week16: {
          name: 'Often called the "stable period"',
          description:
            'A popular Japanese term for around week 16 onward; it varies by person',
        },
        week22: {
          name: 'Preterm range begins',
          description: 'Births from 22w0d to 36w6d are classed as preterm',
        },
        week28: {
          name: 'Third trimester begins',
          description: 'The third trimester starts at 28w0d',
        },
        week37: {
          name: 'Full term begins',
          description: 'Births from 37w0d to 41w6d are classed as term',
        },
        week40: {
          name: 'Estimated due date',
          description: '40w0d. Many births happen in the days around this date',
        },
        week42: {
          name: 'Post-term begins',
          description: 'Births at 42w0d or later are classed as post-term',
        },
      },
    },
    title: 'Due Date Calculator (Pregnancy Week, Trimester, Milestones)',
    description:
      'Estimate your due date and pregnancy week from your last period, ovulation date or a known due date, with cycle adjustment. Runs in your browser.',
    h1: 'Due Date & Pregnancy Week Calculator',
    introHtml:
      'Enter the first day of your last period, your ovulation date, or a known due date to get the estimated due date (Naegele\'s rule, 280 days), your current gestational age in weeks and days, the pregnancy month, and the dates of key milestones such as the start of full term. If your cycle is not 28 days long, enter its length to adjust the result. Everything runs in your browser and nothing you type is sent to a server. To count days between any two dates, try the <a href="/en/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Date Calculator</a>, or check another health metric with the <a href="/en/tools/bmi-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">BMI Calculator</a>.',
    disclaimer:
      'These results are estimates from standard formulas and are not a substitute for medical advice or diagnosis. Your actual due date is set by your healthcare provider, usually from an ultrasound. Please consult your doctor or midwife about your health and the course of your pregnancy.',
    modeLabel: 'Calculate from',
    modeLmp: 'First day of last period',
    modeOvulation: 'Ovulation / conception date',
    modeDue: 'Known due date (work backward)',
    dateLabelLmp: 'First day of last period',
    dateLabelOvulation: 'Ovulation / conception date',
    dateLabelDue: 'Due date',
    cycleLabel: 'Cycle length',
    cycleUnit: 'days',
    cycleHint:
      'The standard is 28 days. Enter a value from 21 to 45 and the due date shifts by the difference from 28.',
    referenceLabel: 'Reference date (day to check the current week)',
    errorInvalidDate: 'Enter a date that exists (between 1900 and 2100)',
    errorCycle: 'Enter a whole-number cycle length from 21 to 45 days',
    dueDateLabel: 'Estimated due date',
    ovulationLabel: 'Estimated ovulation / conception',
    startLabel: 'Week 0, day 0',
    currentLabel: 'Gestational age on the reference date',
    monthLabel: 'Pregnancy month',
    milestonesLabel: 'Key milestones',
    howToHeading: 'How to use',
    howToSteps: [
      'Under "Calculate from", choose which date you know: last period, ovulation, or due date.',
      'Enter the date. When calculating from your last period, also enter your cycle length if it is not 28 days.',
      'Change the reference date (today by default) to see the gestational age on any day.',
      'The due date, gestational age, and milestone dates appear. Treat them as estimates only.',
    ],
    notesHeading: 'Notes',
    notes: [
      'These results are estimates only and do not replace medical advice or diagnosis. Your provider sets the actual due date and gestational age, usually using ultrasound.',
      'When calculating from your last period, a cycle length other than 28 days shifts the due date by the difference. Irregular cycles make the estimate less reliable.',
      "When calculating from ovulation, the due date is ovulation + 266 days (week 0 day 0 is 14 days before ovulation). For IVF or other assisted conception, dating works differently, so follow your clinic's guidance.",
      'The pregnancy month counts 4 weeks per month and tops out at month 10 (weeks 36-39). Terms like the "stable period" vary from person to person.',
      'Your input is processed only in your browser and is never saved or sent anywhere.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: "Naegele's rule",
        description:
          'The classic way to estimate a due date from the first day of the last menstrual period: subtract 3 months and add 7 days, assuming a 28-day cycle. It is equivalent to adding 280 days (40 weeks). This tool adds days directly, so it can differ by a day in some years.',
      },
      {
        term: 'Gestational age',
        description:
          'Pregnancy is dated from the first day of the last period (adjusted for cycle length), which is week 0 day 0. Conception happens about two weeks later, so a newly conceived pregnancy is already at about 2 weeks 0 days.',
      },
      {
        term: 'Preterm, term, post-term',
        description:
          'Classification by timing of birth: term is 37w0d to 41w6d, preterm is 22w0d to 36w6d (before 37 weeks), and post-term is 42w0d or later.',
      },
      {
        term: 'Stable period',
        description:
          'An informal Japanese term for roughly week 16 onward, when many people feel the early-pregnancy risks have eased. It is not a precise medical definition and varies by person.',
      },
    ],
  },
};
