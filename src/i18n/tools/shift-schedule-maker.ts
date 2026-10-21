import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ShiftScheduleMakerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  /** Intl.DateTimeFormat に渡すロケール */
  dateLocale: string;

  membersLabel: string;
  membersDefault: string;
  membersHint: string;
  yearLabel: string;
  monthLabel: string;
  perDayLabel: string;
  maxConsecutiveLabel: string;
  closedLabel: string;
  offsLabel: string;
  offsPlaceholder: string;
  offsHint: string;

  printButton: string;
  copyCsvButton: string;
  downloadCsvButton: string;
  copied: string;
  copyFailed: string;

  /** {year} {month} を置き換える */
  scheduleTitle: string;
  warningHeading: string;
  /** {date} {required} {assigned} {off} {streak} を置き換える */
  warningShortage: string;
  noWarnings: string;
  issueHeading: string;
  /** {detail} を置き換える */
  issueBadLine: string;
  issueUnknownMember: string;
  issueBadDay: string;
  issueOutOfRange: string;

  tableHeading: string;
  tableCaption: string;
  legend: string;
  nameHeader: string;
  totalHeader: string;
  workMark: string;
  offMark: string;
  closedText: string;
  summaryHeading: string;
  summaryWorkDays: string;
  summaryMaxStreak: string;
  /** {spread} を置き換える */
  summarySpread: string;
  dailyHeading: string;
  dailyNobody: string;
  csvFilename: string;

  errorNoMembers: string;
  /** {max} を置き換える */
  errorTooMany: string;
  /** {min} {max} を置き換える */
  errorYear: string;
  /** {max} を置き換える */
  errorPerDay: string;
  /** {max} を置き換える */
  errorMaxConsecutive: string;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const shiftScheduleMakerContent: Record<
  Locale,
  ShiftScheduleMakerPageContent
> = {
  ja: {
    title: 'シフト表・当番表作成（自動割当・希望休・印刷用）',
    description:
      'メンバー名と年月を入れるだけで、シフト表・当番表を自動作成。希望休・連勤上限・土日祝休みに対応し、担当回数を均等に割り当てます。印刷・CSV出力も可能。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'シフト表・当番表の作成（自動割当・印刷用）',
    introHtml:
      'メンバー名・対象の年月・1日の必要人数を入れると、担当回数がなるべく均等になるようにシフト表（メンバー×日付の表）を自動で作ります。希望休と連勤の上限を守り、人数が足りない日は警告で知らせます。そのまま印刷したり、CSVでExcelに取り込めます。入力内容はブラウザ内だけで処理され、サーバーには送信されません。月の日付や祝日を確認したいときは <a href="/tools/calendar-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カレンダー生成</a> もご利用ください。',
    dateLocale: 'ja-JP',

    membersLabel: 'メンバー（1行に1人）',
    membersDefault: '田中\n佐藤\n鈴木\n高橋\n伊藤',
    membersHint: '名簿の順が同じ条件のときの優先順になります。',
    yearLabel: '年',
    monthLabel: '月',
    perDayLabel: '1日の必要人数',
    maxConsecutiveLabel: '連勤の上限（日）',
    closedLabel: '土日祝は休みにする（割り当てない）',
    offsLabel: '希望休（1行に1人）',
    offsPlaceholder: '田中: 3, 10, 15-17\n佐藤: 1, 2',
    offsHint:
      '「名前: 日付」の形式で、日付はカンマ区切り（連続する日は 15-17 のように範囲指定）です。',

    printButton: '印刷する',
    copyCsvButton: 'CSVをコピー',
    downloadCsvButton: 'CSVをダウンロード',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',

    scheduleTitle: '{year}年{month}月 シフト表',
    warningHeading: '警告',
    warningShortage:
      '{date}: 必要{required}人に対して{assigned}人しか割り当てられません（希望休 {off}人・連勤上限 {streak}人）',
    noWarnings: 'すべての日で必要人数を満たしています。',
    issueHeading: '希望休の入力について',
    issueBadLine: '名前と日付の区切り（:）がない行を無視しました: {detail}',
    issueUnknownMember: 'メンバーにいない名前を無視しました: {detail}',
    issueBadDay: '読み取れない日付を無視しました: {detail}',
    issueOutOfRange: 'この月にない日付を無視しました: {detail}',

    tableHeading: 'シフト表',
    tableCaption: 'メンバー×日付のシフト表',
    legend: '○ = 出勤・担当、休 = 希望休、網掛けの列 = 休みの日（土日祝）',
    nameHeader: '名前',
    totalHeader: '計',
    workMark: '○',
    offMark: '休',
    closedText: '休み',
    summaryHeading: '担当日数',
    summaryWorkDays: '担当日数',
    summaryMaxStreak: '最大連勤',
    summarySpread: '担当日数の差は最大で{spread}日です。',
    dailyHeading: '日別の担当',
    dailyNobody: '（担当なし）',
    csvFilename: 'shift-schedule-{year}-{month}.csv',

    errorNoMembers: 'メンバー名を1人以上入力してください',
    errorTooMany: 'メンバーは{max}人までです',
    errorYear: '年は{min}〜{max}の整数で入力してください',
    errorPerDay: '1日の必要人数は1〜{max}の整数で入力してください',
    errorMaxConsecutive: '連勤の上限は1〜{max}の整数で入力してください',

    howToHeading: '使い方',
    howToSteps: [
      '「メンバー（1行に1人）」に名前を入力し、年・月と「1日の必要人数」「連勤の上限（日）」を指定します。',
      '休ませたい日があれば「希望休（1行に1人）」に「田中: 3, 10」のように入力します。',
      '「土日祝は休みにする（割り当てない）」を必要に応じて切り替え、警告が出た日は条件を見直します。',
      '「印刷する」で印刷、「CSVをコピー」または「CSVをダウンロード」で表計算ソフトに取り込めます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '割り当ては、担当日数が少ない人を優先し、同じなら最後に担当した日が古い人から選ぶ方式です。乱数は使わないため、同じ入力なら必ず同じ結果になります。',
      '最適な組み合わせを探索するのではなく、日付順に決めていく簡易的な方法です。条件が厳しいと、人数が足りない日が警告に出ることがあります。',
      '1人の勤務時間・夜勤の回数・職種ごとの人数配分・曜日ごとの必要人数の違いなどは扱いません。',
      '祝日は2000〜2099年の範囲で日本の祝日法のルールから計算しており、今後の法改正は反映されません。それ以外の年は土日のみが休みになります。',
      '31日分の表は幅が広いため、印刷時は用紙を横向きにし、倍率を縮小してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ラウンドロビン',
        description:
          '順番に回していく割り当て方式です。このツールでは、担当日数が同じ人の中で、最後に担当した日が最も古い人から順に選びます。',
      },
      {
        term: '連勤',
        description:
          '休みを挟まずに連続して担当する日が続くことです。「連勤の上限」を超える割り当ては行いません。',
      },
    ],
  },
  en: {
    title: 'Shift Schedule Maker (Auto-Assign, Printable)',
    description:
      'Make a printable monthly shift or duty roster in your browser. Auto-assigns fairly, honors days off and a max streak, and exports CSV.',
    h1: 'Shift Schedule & Duty Roster Maker (Printable)',
    introHtml:
      'Enter your team, a month and how many people you need each day, and the tool builds a members-by-dates roster with workloads spread as evenly as possible. It respects requested days off and a maximum streak of working days, and warns you about days it cannot fully staff. Print it or export CSV for a spreadsheet. Everything runs in your browser, and nothing you enter is sent to a server. To look up the days of a month first, try the <a href="/en/tools/calendar-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Calendar Generator</a>.',
    dateLocale: 'en-US',

    membersLabel: 'Members (one per line)',
    membersDefault: 'Alice\nBob\nCarol\nDave\nEve',
    membersHint:
      'When everything else is equal, earlier names are picked first.',
    yearLabel: 'Year',
    monthLabel: 'Month',
    perDayLabel: 'People needed per day',
    maxConsecutiveLabel: 'Max consecutive working days',
    closedLabel: 'Weekends and Japanese holidays off (no assignments)',
    offsLabel: 'Requested days off (one member per line)',
    offsPlaceholder: 'Alice: 3, 10, 15-17\nBob: 1, 2',
    offsHint:
      'Use "Name: days". Separate days with commas, and write a run of days as a range such as 15-17.',

    printButton: 'Print',
    copyCsvButton: 'Copy CSV',
    downloadCsvButton: 'Download CSV',
    copied: 'Copied',
    copyFailed: 'Copy failed',

    scheduleTitle: 'Shift schedule, {month} {year}',
    warningHeading: 'Warnings',
    warningShortage:
      '{date}: needs {required} but only {assigned} could be assigned ({off} on requested leave, {streak} at the streak limit)',
    noWarnings: 'Every day has the required number of people.',
    issueHeading: 'About the days-off input',
    issueBadLine: 'Ignored a line with no ":" between name and days: {detail}',
    issueUnknownMember:
      'Ignored a name that is not in the member list: {detail}',
    issueBadDay: 'Ignored a day that could not be read: {detail}',
    issueOutOfRange: 'Ignored a day that is not in this month: {detail}',

    tableHeading: 'Roster',
    tableCaption: 'Shift roster: members by dates',
    legend:
      '○ = working, Off = requested day off, shaded column = closed day (weekend/holiday)',
    nameHeader: 'Name',
    totalHeader: 'Total',
    workMark: '○',
    offMark: 'Off',
    closedText: 'Closed',
    summaryHeading: 'Workload',
    summaryWorkDays: 'Days worked',
    summaryMaxStreak: 'Longest streak',
    summarySpread: 'The difference in days worked is at most {spread}.',
    dailyHeading: 'Daily assignments',
    dailyNobody: '(nobody)',
    csvFilename: 'shift-schedule-{year}-{month}.csv',

    errorNoMembers: 'Enter at least one member name.',
    errorTooMany: 'Up to {max} members are supported.',
    errorYear: 'Enter a whole-number year from {min} to {max}.',
    errorPerDay:
      'People needed per day must be a whole number from 1 to {max}.',
    errorMaxConsecutive:
      'Max consecutive days must be a whole number from 1 to {max}.',

    howToHeading: 'How to use',
    howToSteps: [
      'Enter names under "Members (one per line)", then set the year, month, "People needed per day" and "Max consecutive working days".',
      'If someone needs days off, add a line such as "Alice: 3, 10" under "Requested days off (one member per line)".',
      'Toggle "Weekends and Japanese holidays off (no assignments)" if needed, and adjust the settings for any day that shows a warning.',
      'Press "Print" to print, or "Copy CSV" / "Download CSV" to use the roster in a spreadsheet.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Assignment favors whoever has worked the fewest days, then whoever worked longest ago. No randomness is used, so the same input always gives the same roster.',
      'It decides day by day rather than searching for the optimal roster, so tight constraints can leave some days understaffed and flagged as warnings.',
      'Shift hours, night-shift counts, roles and different headcounts for different weekdays are not handled.',
      'Japanese holidays are calculated under current law for 2000–2099 only and do not reflect future changes. For other years only weekends are closed.',
      'A 31-day table is wide. When printing, use landscape orientation and scale it down.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Round-robin',
        description:
          'Taking turns in order. Here, among people with the same number of days worked, the one who worked longest ago is chosen first.',
      },
      {
        term: 'Consecutive working days',
        description:
          'A run of working days with no day off in between. The tool never assigns more days in a row than the limit you set.',
      },
    ],
  },
};
