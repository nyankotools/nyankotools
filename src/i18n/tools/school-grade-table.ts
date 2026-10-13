import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SchoolGradeFormat {
  /** {y} {m} {d}（{mm} {dd} は0埋め） */
  date: string;
  /** {from} {to} */
  range: string;
  /** {y} */
  entry: string;
  /** {y} */
  graduation: string;
  /** {n} */
  age: string;
  /** {y} */
  birthSchoolYear: string;
  /** {y1} {y2} */
  calendarYears: string;
  /** {y} */
  baseYearOption: string;
}

export interface SchoolGradeTableContent {
  format: SchoolGradeFormat;
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  baseYearLabel: string;
  baseYearHint: string;
  baseYearAriaLabel: string;
  birthSectionHeading: string;
  birthLabel: string;
  yearPlaceholder: string;
  monthPlaceholder: string;
  dayPlaceholder: string;
  birthYearAriaLabel: string;
  birthMonthAriaLabel: string;
  birthDayAriaLabel: string;
  yearUnit: string;
  monthUnit: string;
  dayUnit: string;
  errorInvalidDate: string;
  errorInvalidYear: string;
  resultGradeLabel: string;
  resultCohortLabel: string;
  resultBornTypeLabel: string;
  earlyBorn: string;
  lateBorn: string;
  milestonesLabel: string;
  milestoneStageHeader: string;
  milestoneEntryHeader: string;
  milestoneGraduationHeader: string;
  gradeSectionHeading: string;
  gradeSelectLabel: string;
  reverseRangeLabel: string;
  reverseCalendarLabel: string;
  reverseAgeLabel: string;
  tableHeading: string;
  tableGradeHeader: string;
  tableRangeHeader: string;
  tableAgeHeader: string;
  /** 学校段階の表示名 */
  stageNames: Record<
    | 'kindergarten'
    | 'elementary'
    | 'junior-high'
    | 'high-school'
    | 'university',
    string
  >;
  /** 学校段階ごとの学年名（先頭が1年） */
  gradeNames: Record<
    | 'kindergarten'
    | 'elementary'
    | 'junior-high'
    | 'high-school'
    | 'university',
    string[]
  >;
  statusPreschool: string;
  statusUnborn: string;
  statusGraduated: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const linkClass =
  'text-blue-700 underline hover:no-underline dark:text-blue-400';

export const schoolGradeTableContent: Record<Locale, SchoolGradeTableContent> =
  {
    ja: {
      format: {
        date: '{y}年{m}月{d}日',
        range: '{from} 〜 {to}',
        entry: '{y}年4月',
        graduation: '{y}年3月',
        age: '{n}歳',
        birthSchoolYear: '{y}年度生まれ',
        calendarYears:
          '{y1}年4月2日〜12月31日生まれ（遅生まれ）と、{y2}年1月1日〜4月1日生まれ（早生まれ）',
        baseYearOption: '{y}年度',
      },
      title: '学年早見表（生まれ年⇔学年・卒業年・早生まれ対応）',
      description:
        '生年月日から学年・入学年・卒業年を、学年から該当する生まれ年を調べられる学年早見表です。早生まれ（1月1日〜4月1日生まれ）に対応し、基準年度も変更できます。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: '学年早見表（生まれ年⇔学年）',
      introHtml: `生年月日を入力すると、基準年度での学年と、幼稚園・小学校・中学校・高校・大学の入学年・卒業年を表示します。逆に学年を選べば、その学年に当たる生年月日の範囲を確認できます。4月2日〜翌年4月1日生まれが同じ学年になる日本の学校制度（4月始まり）が前提で、早生まれ・遅生まれにも対応しています。基準年度は今日の日付から自動で算出されるため、毎年の更新は不要です。年齢そのものを知りたい場合は <a href="/tools/age-calculator/" class="${linkClass}">年齢計算機</a>、西暦と和暦の変換は <a href="/tools/japanese-era-converter/" class="${linkClass}">和暦⇔西暦変換</a> をご利用ください。`,
      baseYearLabel: '基準年度',
      baseYearHint:
        '4月〜翌年3月が1年度です。初期値は今日の日付から算出した年度です。',
      baseYearAriaLabel: '基準年度（西暦）',
      birthSectionHeading: '生年月日から学年を調べる',
      birthLabel: '生年月日',
      yearPlaceholder: '2015',
      monthPlaceholder: '2',
      dayPlaceholder: '1',
      birthYearAriaLabel: '生年（西暦）',
      birthMonthAriaLabel: '生まれ月',
      birthDayAriaLabel: '生まれた日',
      yearUnit: '年',
      monthUnit: '月',
      dayUnit: '日',
      errorInvalidDate: '実在する日付（西暦1年〜9999年）を入力してください。',
      errorInvalidYear: '基準年度は1〜9999の整数で入力してください。',
      resultGradeLabel: '基準年度の学年',
      resultCohortLabel: '学年の基準となる年度',
      resultBornTypeLabel: '早生まれ・遅生まれ',
      earlyBorn: '早生まれ（1月1日〜4月1日生まれ）',
      lateBorn: '遅生まれ（4月2日〜12月31日生まれ）',
      milestonesLabel: '入学・卒業の年（標準的に進学した場合）',
      milestoneStageHeader: '学校',
      milestoneEntryHeader: '入学',
      milestoneGraduationHeader: '卒業',
      gradeSectionHeading: '学年から生まれ年を調べる',
      gradeSelectLabel: '学年',
      reverseRangeLabel: '該当する生年月日の範囲',
      reverseCalendarLabel: '西暦の生まれ年',
      reverseAgeLabel: '年度初め（4月1日）時点の年齢',
      tableHeading: '学年早見表',
      tableGradeHeader: '学年',
      tableRangeHeader: '生まれた日の範囲',
      tableAgeHeader: '4月1日時点の年齢',
      stageNames: {
        kindergarten: '幼稚園',
        elementary: '小学校',
        'junior-high': '中学校',
        'high-school': '高校',
        university: '大学（4年制）',
      },
      gradeNames: {
        kindergarten: ['年少', '年中', '年長'],
        elementary: [
          '小学1年',
          '小学2年',
          '小学3年',
          '小学4年',
          '小学5年',
          '小学6年',
        ],
        'junior-high': ['中学1年', '中学2年', '中学3年'],
        'high-school': ['高校1年', '高校2年', '高校3年'],
        university: ['大学1年', '大学2年', '大学3年', '大学4年'],
      },
      statusPreschool: '未就学（幼稚園に入園する前）',
      statusUnborn: 'この年度にはまだ生まれていません',
      statusGraduated: '大学（4年制）卒業後の年度です',
      notesHeading: '注意事項',
      notes: [
        '日本の学校制度（4月始まり・4月2日〜翌年4月1日生まれが同学年）を前提にしています。他国の学年制度（9月始まりなど）には当てはまりません。',
        '浪人・留年・飛び級・早期入学・就学猶予、大学の修業年限（医学部6年など）や大学院は考慮せず、標準的に進学した場合の学年を表示します。',
        '幼稚園は3歳児から入る年少・年中・年長の3年間として表示しています。保育園・認定こども園の学年名とは呼び方が異なる場合があります。',
        '年度は4月1日〜翌年3月31日です。1月〜3月は前年の年度として扱われるため、基準年度は暦年と1年ずれることがあります。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: '早生まれ・遅生まれ',
          description:
            '1月1日〜4月1日に生まれた人を早生まれ、4月2日〜12月31日に生まれた人を遅生まれと呼びます。早生まれは同じ暦年に生まれた遅生まれの人より1学年上になります。',
        },
        {
          term: '4月1日生まれが早生まれになる理由',
          description:
            '「年齢計算ニ関スル法律」により、年齢は誕生日の前日の終了時に加算されます。4月1日生まれの人は3月31日の終了時に満年齢が上がるため、前年4月2日以降に生まれた子と同じ学年になります。',
        },
        {
          term: '年度',
          description:
            '4月1日から翌年3月31日までの1年間です。学校の学年は年度ごとに進級し、「2026年度」は2026年4月〜2027年3月を指します。',
        },
      ],
    },
    en: {
      format: {
        date: '{y}-{mm}-{dd}',
        range: '{from} to {to}',
        entry: 'April {y}',
        graduation: 'March {y}',
        age: 'Age {n}',
        birthSchoolYear: 'School-year cohort {y}',
        calendarYears:
          'Born Apr 2 - Dec 31, {y1} (late-born), and Jan 1 - Apr 1, {y2} (early-born)',
        baseYearOption: 'FY {y}',
      },
      title: 'Japanese School Grade Chart (Birth Year to Grade)',
      description:
        'Look up the Japanese school grade, entry and graduation year from a date of birth, or birth dates for a grade. Handles early-born kids. Runs in your browser.',
      h1: 'Japanese School Grade Chart (Birth Date to Grade)',
      introHtml: `Enter a date of birth to see which grade a child is in for a chosen school year, plus the entry and graduation years for kindergarten, elementary, junior high, high school, and university in Japan. You can also pick a grade and see which birth dates belong to it. This assumes Japan's school system, where the school year starts in April and children born from April 2 through April 1 of the next year share a grade. Early-born (hayaumare) children are handled. The school year defaults to the one containing today's date, so there is nothing to update each year. To work out exact age, try the <a href="/en/tools/age-calculator/" class="${linkClass}">Age Calculator</a>, or convert years with the <a href="/en/tools/japanese-era-converter/" class="${linkClass}">Japanese Era Converter</a>.`,
      baseYearLabel: 'School year (April start)',
      baseYearHint:
        'A school year runs from April to the following March. The default is the school year containing today.',
      baseYearAriaLabel: 'School year (calendar year it starts in)',
      birthSectionHeading: 'Find the grade from a birth date',
      birthLabel: 'Date of birth',
      yearPlaceholder: '2015',
      monthPlaceholder: '2',
      dayPlaceholder: '1',
      birthYearAriaLabel: 'Birth year',
      birthMonthAriaLabel: 'Birth month',
      birthDayAriaLabel: 'Birth day',
      yearUnit: '-',
      monthUnit: '-',
      dayUnit: '',
      errorInvalidDate: 'Enter a date that exists (year 1 to 9999).',
      errorInvalidYear:
        'Enter the school year as a whole number from 1 to 9999.',
      resultGradeLabel: 'Grade in the chosen school year',
      resultCohortLabel: 'School-year cohort',
      resultBornTypeLabel: 'Early-born or late-born',
      earlyBorn: 'Early-born (hayaumare: Jan 1 - Apr 1)',
      lateBorn: 'Late-born (Apr 2 - Dec 31)',
      milestonesLabel: 'Entry and graduation (on a standard path)',
      milestoneStageHeader: 'School',
      milestoneEntryHeader: 'Entry',
      milestoneGraduationHeader: 'Graduation',
      gradeSectionHeading: 'Find the birth year from a grade',
      gradeSelectLabel: 'Grade',
      reverseRangeLabel: 'Birth dates in this grade',
      reverseCalendarLabel: 'Calendar birth years',
      reverseAgeLabel: 'Age at the start of the school year (April 1)',
      tableHeading: 'Grade chart',
      tableGradeHeader: 'Grade',
      tableRangeHeader: 'Birth dates',
      tableAgeHeader: 'Age on April 1',
      stageNames: {
        kindergarten: 'Kindergarten',
        elementary: 'Elementary school',
        'junior-high': 'Junior high school',
        'high-school': 'High school',
        university: 'University (4 years)',
      },
      gradeNames: {
        kindergarten: [
          'Kindergarten year 1 (nenshou)',
          'Kindergarten year 2 (nenchuu)',
          'Kindergarten year 3 (nenchou)',
        ],
        elementary: [
          'Elementary 1',
          'Elementary 2',
          'Elementary 3',
          'Elementary 4',
          'Elementary 5',
          'Elementary 6',
        ],
        'junior-high': ['Junior high 1', 'Junior high 2', 'Junior high 3'],
        'high-school': ['High school 1', 'High school 2', 'High school 3'],
        university: [
          'University year 1',
          'University year 2',
          'University year 3',
          'University year 4',
        ],
      },
      statusPreschool: 'Before kindergarten',
      statusUnborn: 'Not yet born in this school year',
      statusGraduated: 'After a standard 4-year university course',
      notesHeading: 'Notes',
      notes: [
        "This chart follows Japan's school system: the year starts in April, and children born Apr 2 through Apr 1 of the next year share a grade. It does not apply to systems that start in September, such as those in the US or Europe.",
        'Results assume a standard path. Repeated years, skipped grades, deferred entry, longer courses (such as 6-year medical programs), and graduate school are not taken into account.',
        'Kindergarten is shown as the three years nenshou, nenchuu, and nenchou starting at age 3. Nursery schools and certified child centers may use different names.',
        'A school year runs from April 1 to March 31. January through March belong to the previous school year, so it can differ from the calendar year by one.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'Hayaumare (early-born)',
          description:
            'Children born from January 1 to April 1 are called hayaumare (early-born), and those born from April 2 to December 31 are late-born. An early-born child is one grade above a late-born child with the same birth year.',
        },
        {
          term: 'Why April 1 birthdays are early-born',
          description:
            "Under Japan's age-calculation law, a person's age increases at the end of the day before their birthday. Someone born on April 1 therefore turns a year older on March 31, so they join the grade of children born from April 2 of the previous year.",
        },
        {
          term: 'School year (nendo)',
          description:
            'The period from April 1 to March 31 of the next year. School grades advance each school year, and "FY 2026" means April 2026 through March 2027.',
        },
      ],
    },
  };
