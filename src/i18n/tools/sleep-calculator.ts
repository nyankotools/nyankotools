import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SleepCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  modeLabel: string;
  modeWake: string;
  modeBed: string;
  wakeTimeLabel: string;
  bedTimeLabel: string;
  nowButton: string;
  latencyLabel: string;
  latencyUnit: string;
  latencyHint: string;

  resultHeadingWake: string;
  resultHeadingBed: string;
  /** {n} = number of cycles */
  cyclesFormat: string;
  /** {h} = hours */
  sleepFormat: string;
  previousDay: string;
  nextDay: string;
  sameDay: string;
  disclaimer: string;

  errorTime: string;
  errorLatency: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const sleepCalculatorContent: Record<
  Locale,
  SleepCalculatorPageContent
> = {
  ja: {
    title: '睡眠計算機（90分周期で就寝・起床時刻を逆算）',
    description:
      '起きたい時刻から就寝時刻を、寝る時刻から起床時刻を90分周期で計算する無料の睡眠計算ツール。入眠までの時間も設定でき、6〜9時間の候補を表示します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '睡眠計算機（睡眠サイクル計算）',
    introHtml:
      '起きたい時刻を入力すると何時に寝ればよいか、寝る時刻（「今すぐ寝る（現在時刻）」ボタンで現在時刻）を入力すると何時に起きればよいかを、睡眠サイクル（約90分）をもとに計算します。入眠までにかかる時間（既定15分）を加味した、4〜6サイクル（6〜9時間）の候補を一覧表示します。計算はブラウザ内で行われ、入力内容がサーバーに送信されることはありません。日数や年齢の計算には <a href="/tools/age-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">年齢計算機</a> もご利用ください。',

    modeLabel: '計算の方向',
    modeWake: '起きたい時刻から就寝時刻を知る',
    modeBed: '寝る時刻から起床時刻を知る',
    wakeTimeLabel: '起床時刻',
    bedTimeLabel: '就寝時刻（布団に入る時刻）',
    nowButton: '今すぐ寝る（現在時刻）',
    latencyLabel: '入眠までの時間',
    latencyUnit: '分',
    latencyHint: '0〜120分の整数。布団に入ってから眠るまでの目安です。',

    resultHeadingWake: '布団に入る時刻の候補',
    resultHeadingBed: '起きる時刻の候補',
    cyclesFormat: '{n}サイクル',
    sleepFormat: '睡眠 {h}時間',
    previousDay: '前日',
    nextDay: '翌日',
    sameDay: '同日',
    disclaimer:
      '睡眠サイクルの長さには個人差があります。あくまで目安であり、医療上のアドバイスではありません。',

    errorTime: '時刻を入力してください（例: 07:00）',
    errorLatency: '入眠までの時間は0〜120分の整数で入力してください',

    notesHeading: '注意事項',
    notes: [
      '睡眠サイクルを90分とする考え方はあくまで目安で、実際の長さは個人や日によって異なります（おおむね80〜110分程度）。',
      '結果は医学的な診断や個別の健康アドバイスではありません。不眠や日中の強い眠気が続く場合は医師にご相談ください。',
      '時刻は24時間表記で、日付をまたぐ場合は「前日」「翌日」と表示します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '睡眠サイクル',
        description:
          'ノンレム睡眠とレム睡眠が一巡する周期のことで、成人でおよそ90分前後とされます。一晩に4〜6回ほど繰り返されます。',
      },
      {
        term: '入眠潜時',
        description:
          '布団に入ってから実際に眠りに落ちるまでの時間です。このツールでは「入眠までの時間」として設定でき、既定は15分です。',
      },
    ],
  },
  en: {
    title: 'Sleep Calculator: Bedtime & Wake-Up Time',
    description:
      'Find the best bedtime for your wake-up time, or when to wake up if you sleep now, using 90-minute sleep cycles. Runs in your browser; nothing is uploaded.',
    h1: 'Sleep Calculator (Sleep Cycle Calculator)',
    introHtml:
      'Enter the time you want to wake up to see when to go to bed, or enter the time you plan to sleep (or tap "Sleep now (current time)") to see when to wake up. The results are based on roughly 90-minute sleep cycles and your time to fall asleep (15 minutes by default), and list options for 4 to 6 cycles (6 to 9 hours). Everything is calculated in your browser, and nothing you enter is sent to a server. Need to work out an age or a date difference? Try the <a href="/en/tools/age-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Age Calculator</a>.',

    modeLabel: 'Calculate',
    modeWake: 'Bedtime for a wake-up time',
    modeBed: 'Wake-up time for a bedtime',
    wakeTimeLabel: 'Wake-up time',
    bedTimeLabel: 'Bedtime (when you get into bed)',
    nowButton: 'Sleep now (current time)',
    latencyLabel: 'Time to fall asleep',
    latencyUnit: 'min',
    latencyHint:
      'A whole number from 0 to 120. How long it usually takes you to drift off after lying down.',

    resultHeadingWake: 'Suggested bedtimes',
    resultHeadingBed: 'Suggested wake-up times',
    cyclesFormat: '{n} cycles',
    sleepFormat: '{h} h of sleep',
    previousDay: 'previous day',
    nextDay: 'next day',
    sameDay: 'same day',
    disclaimer:
      'Sleep cycle length varies from person to person. These times are estimates only and are not medical advice.',

    errorTime: 'Enter a time (for example 07:00)',
    errorLatency: 'Time to fall asleep must be a whole number from 0 to 120',

    notesHeading: 'Notes',
    notes: [
      'The 90-minute cycle is a rule of thumb. Real cycles vary by person and by night, typically from about 80 to 110 minutes.',
      'Results are not a medical diagnosis or personal health advice. If you have ongoing insomnia or heavy daytime sleepiness, talk to a doctor.',
      'Times use the 24-hour clock. When a result falls on another day, it is labeled "previous day" or "next day".',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Sleep cycle',
        description:
          'One full pass through non-REM and REM sleep, lasting about 90 minutes in adults. A night usually contains four to six of them.',
      },
      {
        term: 'Sleep latency',
        description:
          'The time between lying down and actually falling asleep. You can set it as "Time to fall asleep"; the default is 15 minutes.',
      },
    ],
  },
};
