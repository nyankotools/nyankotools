import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface TimeCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  section1Heading: string;
  startLabel: string;
  endLabel: string;
  breakLabel: string;
  minutesUnit: string;
  rowLabel: string;
  /** `{n}` を行番号に置換 */
  ariaStartTemplate: string;
  ariaEndTemplate: string;
  ariaBreakTemplate: string;
  ariaRemoveTemplate: string;
  addRowButton: string;
  removeRowButton: string;
  errorWork: string;
  totalWorkLabel: string;
  totalWorkDecimalLabel: string;
  hoursSuffix: string;
  copyButton: string;
  copiedMessage: string;
  section2Heading: string;
  baseTimeLabel: string;
  operationLegend: string;
  operationAdd: string;
  operationSubtract: string;
  deltaHoursLabel: string;
  deltaMinutesLabel: string;
  hoursUnit: string;
  errorAddSub: string;
  resultTimeLabel: string;
  nextDay: string;
  previousDay: string;
  /** `{n}` を日数に置換 */
  nextDaysTemplate: string;
  previousDaysTemplate: string;
  section3Heading: string;
  hmToDecimalHeading: string;
  decimalToHmHeading: string;
  convHoursLabel: string;
  convMinutesLabel: string;
  convDecimalLabel: string;
  resultDecimalLabel: string;
  resultHmLabel: string;
  errorConv: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const timeCalculatorContent: Record<Locale, TimeCalculatorPageContent> =
  {
    ja: {
      title: '時間計算ツール｜勤務時間の合計・時刻の足し算引き算・小数時間換算',
      description:
        '出勤・退勤時刻と休憩から勤務時間を計算して合計し、時刻の足し算・引き算や、時間（h:mm）と小数時間（7.75時間など）の換算もできる無料ツールです。日またぎの勤務にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: '時間計算ツール（勤務時間の合計・時刻の加減算・小数時間換算）',
      introHtml:
        '出勤・退勤・休憩から勤務時間を計算して合計したり、時刻に時間を足し引きしたり、7:45と7.75時間を相互に換算したりできます。時給に掛ける勤務時間を求めたいときは<a href="/tools/hourly-wage-calculator/">時給・日給・月給換算＆残業代計算機</a>と合わせてどうぞ。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。',
      howToHeading: '使い方',
      howToSteps: [
        '「勤務時間の合計」で、出勤・退勤時刻と休憩（分）を入力します。複数日ぶんは「行を追加」で増やせます。',
        '実働時間の合計が「時間:分」と小数時間で表示されます。コピーボタンで結果を取り出せます。',
        '時刻の足し算・引き算は、基準の時刻と加減する時間を入力します。',
        '時間と小数時間の換算は、「時間・分」または「小数時間」を入力します。',
      ],
      section1Heading: '1. 勤務時間の合計',
      startLabel: '出勤',
      endLabel: '退勤',
      breakLabel: '休憩',
      minutesUnit: '分',
      rowLabel: '{n}行目',
      ariaStartTemplate: '{n}行目の出勤時刻',
      ariaEndTemplate: '{n}行目の退勤時刻',
      ariaBreakTemplate: '{n}行目の休憩（分）',
      ariaRemoveTemplate: '{n}行目を削除',
      addRowButton: '行を追加',
      removeRowButton: '削除',
      errorWork:
        '計算できない行があります（出勤・退勤を両方入力し、休憩は0分以上で勤務時間以内にしてください）',
      totalWorkLabel: '実働合計',
      totalWorkDecimalLabel: '小数時間',
      hoursSuffix: '時間',
      copyButton: '合計をコピー',
      copiedMessage: 'コピーしました',
      section2Heading: '2. 時刻の足し算・引き算',
      baseTimeLabel: '基準の時刻',
      operationLegend: '計算',
      operationAdd: '足す',
      operationSubtract: '引く',
      deltaHoursLabel: '時間',
      deltaMinutesLabel: '分',
      hoursUnit: '時間',
      errorAddSub:
        '計算できませんでした（基準の時刻を入力し、時間・分は0以上にしてください）',
      resultTimeLabel: '結果の時刻',
      nextDay: '翌日',
      previousDay: '前日',
      nextDaysTemplate: '{n}日後',
      previousDaysTemplate: '{n}日前',
      section3Heading: '3. 時間（h:mm）と小数時間の換算',
      hmToDecimalHeading: '時間・分 → 小数時間',
      decimalToHmHeading: '小数時間 → 時間・分',
      convHoursLabel: '時間',
      convMinutesLabel: '分',
      convDecimalLabel: '小数時間',
      resultDecimalLabel: '小数時間',
      resultHmLabel: '時間:分',
      errorConv: '0以上の数値を入力してください',
      notesHeading: '注意事項',
      notes: [
        '退勤が出勤より前の時刻の場合は、翌日にまたぐ勤務として計算します（例: 22:00〜6:00は8時間）。出勤と退勤が同じ時刻のときは0分です。',
        '休憩は分単位で入力します。休憩が拘束時間（退勤−出勤）を超える行はエラーになります。',
        '小数時間は小数第2位で四捨五入した値を表示します（20分は0.33時間）。逆方向の換算は分単位に四捨五入されるため、端数が出る場合があります。',
        '給与計算の際は、会社の丸め規則（15分単位の切り捨てなど）に従ってください。本ツールは目安の計算です。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: '実働時間と拘束時間',
          description:
            '拘束時間は出勤から退勤までの全体の長さで、実働時間は拘束時間から休憩を除いた実際に働いた時間です。給与や残業の計算には一般に実働時間を使います。',
        },
        {
          term: '小数時間（時間の10進換算）',
          description:
            '「7時間45分」を「7.75時間」のように、分を小数で表した時間です。時給に掛け算するときなどに使います。60分を1とするため、30分は0.5、15分は0.25になります。',
        },
      ],
    },
    en: {
      title: 'Time Calculator: Work Hours, Add Time, Decimal Hours',
      description:
        'Total work hours from start, end and break times, add or subtract time, and convert h:mm to decimal hours. Runs in your browser.',
      h1: 'Time Calculator: Work Hours, Time Add/Subtract & Decimal Hours',
      introHtml:
        'Total your work hours from start, end and break times, add or subtract hours and minutes from a clock time, and convert between 7:45 and 7.75 hours. To turn the hours into pay, pair it with the <a href="/en/tools/hourly-wage-calculator/">Hourly Wage Converter & Overtime Pay Calculator</a>. Everything runs in your browser, and nothing you type is sent to a server.',
      howToHeading: 'How to use',
      howToSteps: [
        'In "Work hours total", enter the start time, end time and break (minutes). Use "Add row" for more days.',
        'The total worked time appears as h:mm and as decimal hours. Use the copy button to grab it.',
        'To add or subtract time, enter a starting time and the hours and minutes to add or remove.',
        'To convert between formats, enter hours and minutes, or a decimal number of hours.',
      ],
      section1Heading: '1. Work hours total',
      startLabel: 'Start',
      endLabel: 'End',
      breakLabel: 'Break',
      minutesUnit: 'min',
      rowLabel: 'Row {n}',
      ariaStartTemplate: 'Row {n} start time',
      ariaEndTemplate: 'Row {n} end time',
      ariaBreakTemplate: 'Row {n} break (minutes)',
      ariaRemoveTemplate: 'Remove row {n}',
      addRowButton: 'Add row',
      removeRowButton: 'Remove',
      errorWork:
        'Some rows cannot be calculated (fill in both start and end, and keep the break between 0 minutes and the shift length)',
      totalWorkLabel: 'Total worked',
      totalWorkDecimalLabel: 'Decimal hours',
      hoursSuffix: 'hrs',
      copyButton: 'Copy total',
      copiedMessage: 'Copied',
      section2Heading: '2. Add or subtract time',
      baseTimeLabel: 'Starting time',
      operationLegend: 'Operation',
      operationAdd: 'Add',
      operationSubtract: 'Subtract',
      deltaHoursLabel: 'Hours',
      deltaMinutesLabel: 'Minutes',
      hoursUnit: 'hrs',
      errorAddSub:
        'Could not calculate (enter a starting time, and use 0 or more for hours and minutes)',
      resultTimeLabel: 'Resulting time',
      nextDay: 'next day',
      previousDay: 'previous day',
      nextDaysTemplate: '{n} days later',
      previousDaysTemplate: '{n} days earlier',
      section3Heading: '3. Convert between h:mm and decimal hours',
      hmToDecimalHeading: 'Hours & minutes to decimal',
      decimalToHmHeading: 'Decimal to hours & minutes',
      convHoursLabel: 'Hours',
      convMinutesLabel: 'Minutes',
      convDecimalLabel: 'Decimal hours',
      resultDecimalLabel: 'Decimal hours',
      resultHmLabel: 'Hours:minutes',
      errorConv: 'Enter a number that is 0 or more',
      notesHeading: 'Notes',
      notes: [
        'If the end time is earlier than the start time, the shift is treated as running past midnight (22:00 to 6:00 is 8 hours). If start and end are the same, the result is 0 minutes.',
        'Breaks are entered in minutes. A row whose break is longer than the shift (end minus start) shows an error.',
        'Decimal hours are rounded to two places (20 minutes shows as 0.33 hours). Converting back rounds to the nearest minute, so small differences can appear.',
        "For payroll, follow your employer's rounding rules (for example, rounding down to 15 minutes). This tool gives a plain calculation.",
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'Worked time vs. shift length',
          description:
            'Shift length is the full span from clock-in to clock-out; worked time is that span minus breaks. Pay and overtime are usually based on worked time.',
        },
        {
          term: 'Decimal hours',
          description:
            'Time written with minutes as a decimal fraction of an hour, such as 7.75 hours for 7 hours 45 minutes. It is handy for multiplying by an hourly rate: 30 minutes is 0.5 and 15 minutes is 0.25.',
        },
      ],
    },
  };
