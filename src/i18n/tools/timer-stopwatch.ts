import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface TimerStopwatchPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  modeLabel: string;
  modeStopwatch: string;
  modeTimer: string;
  modePomodoro: string;
  modeChallenge: string;

  startButton: string;
  pauseButton: string;
  resumeButton: string;
  resetButton: string;
  lapButton: string;
  skipButton: string;
  stopButton: string;
  soundLabel: string;

  lapHeading: string;
  /** {n} = ラップ番号 */
  lapNumber: string;
  lapSplitLabel: string;
  lapTotalLabel: string;

  hoursLabel: string;
  minutesLabel: string;
  secondsLabel: string;
  presetsLabel: string;
  /** {n} = 分 */
  presetFormat: string;
  presetMinutes: number[];
  invalidDuration: string;
  finishedText: string;

  workLabel: string;
  shortBreakLabel: string;
  longBreakLabel: string;
  longBreakEveryLabel: string;
  pomodoroSettingsLegend: string;
  invalidPomodoro: string;
  phaseLabels: { work: string; shortBreak: string; longBreak: string };
  /** {n} = 完了した作業回数 */
  roundsDone: string;
  phaseFinished: string;

  targetLabel: string;
  hideCountLabel: string;
  /** {target} = 目標秒数 */
  challengeHint: string;
  invalidTarget: string;
  /** {time} = 記録（秒）, {diff} = 目標との差（秒）, {judge} = 判定 */
  challengeResult: string;
  judgeLabels: {
    perfect: string;
    great: string;
    good: string;
    close: string;
    miss: string;
  };
  attemptHeading: string;
  attemptTargetLabel: string;
  attemptTimeLabel: string;
  attemptDiffLabel: string;
  attemptJudgeLabel: string;
  /** {n} = 何回目, {diff} = 目標との差（秒） */
  bestText: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const timerStopwatchContent: Record<Locale, TimerStopwatchPageContent> =
  {
    ja: {
      title: 'タイマー・ストップウォッチ・ポモドーロ・ぴったりチャレンジ',
      description:
        'ブラウザで使えるストップウォッチ（ラップ記録つき）、カウントダウンタイマー、ポモドーロタイマー、そしてカウントを隠して「ぴったり10秒」を狙うチャレンジゲームです。終了時のアラーム音に対応し、作業の時間管理や勉強・料理のタイマーに使えます。インストール不要で、データはサーバーに送信されません。',
      h1: 'タイマー・ストップウォッチ・ポモドーロ・ぴったりチャレンジ',
      introHtml:
        'インストール不要で使えるオンラインのストップウォッチ、カウントダウンタイマー、ポモドーロタイマーです。カウントを隠して目標の秒数ぴったりで止める「ぴったりチャレンジ」（ぴったり10秒ゲーム）も遊べます。ストップウォッチはラップタイムを記録でき、タイマーは終了時にアラーム音でお知らせします。ポモドーロは「25分作業＋5分休憩」のサイクルを自動で切り替え、集中力を保ちながら作業を進められます。時間はブラウザの時計で計測するため、タブを切り替えても大きくずれません。すべてブラウザ内で動作し、サーバーには何も送信されません。経過日数や期間の計算は <a href="/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">日付計算</a> もご利用ください。',

      modeLabel: 'モード',
      modeStopwatch: 'ストップウォッチ',
      modeTimer: 'タイマー',
      modePomodoro: 'ポモドーロ',
      modeChallenge: 'ぴったりチャレンジ',

      startButton: 'スタート',
      pauseButton: '一時停止',
      resumeButton: '再開',
      resetButton: 'リセット',
      lapButton: 'ラップ',
      skipButton: '次へスキップ',
      stopButton: 'ストップ',
      soundLabel: '終了時にアラーム音を鳴らす',

      lapHeading: 'ラップ',
      lapNumber: '{n}回目',
      lapSplitLabel: 'ラップ',
      lapTotalLabel: '経過',

      hoursLabel: '時間',
      minutesLabel: '分',
      secondsLabel: '秒',
      presetsLabel: 'よく使う時間',
      presetFormat: '{n}分',
      presetMinutes: [1, 3, 5, 10, 30],
      invalidDuration:
        '時間・分・秒は0以上の整数で、合計が1秒以上100時間未満になるように入力してください',
      finishedText: '時間になりました',

      workLabel: '作業（分）',
      shortBreakLabel: '短い休憩（分）',
      longBreakLabel: '長い休憩（分）',
      longBreakEveryLabel: '長い休憩までの作業回数',
      pomodoroSettingsLegend: 'サイクルの設定',
      invalidPomodoro:
        '作業は1〜180分、休憩は1〜60分、作業回数は2〜12回の整数で入力してください',
      phaseLabels: {
        work: '作業',
        shortBreak: '短い休憩',
        longBreak: '長い休憩',
      },
      roundsDone: '完了した作業: {n}回',
      phaseFinished: '次は「{phase}」です',

      targetLabel: '目標（秒）',
      hideCountLabel: 'カウントを隠す',
      challengeHint:
        '{target}秒ぴったりで止めてみましょう。スタートしたら心の中で数えて、ストップを押します',
      invalidTarget: '目標は1〜60の整数（秒）で入力してください',
      challengeResult: '{time}秒（目標との差 {diff}秒）― {judge}',
      judgeLabels: {
        perfect: 'ぴったり！',
        great: 'すばらしい！',
        good: 'おしい！',
        close: 'もう少し',
        miss: 'ざんねん',
      },
      attemptHeading: '記録',
      attemptTargetLabel: '目標',
      attemptTimeLabel: '記録',
      attemptDiffLabel: '差',
      attemptJudgeLabel: '判定',
      bestText: 'ベスト: {n}回目（差 {diff}秒）',

      notesHeading: '注意事項',
      notes: [
        '時間は端末の時計をもとに計測しているため、タブが裏にあっても終了時刻はほぼ正確です。ただしブラウザの省電力機能で、裏タブでは表示の更新やアラーム音が数秒遅れることがあります。',
        'アラーム音はブラウザの仕様上、スタートボタンを押したあとに限って鳴ります。端末がマナーモードや消音のときは聞こえません。',
        'ページを閉じる・再読み込みすると、計測中の時間やラップの記録、ぴったりチャレンジの記録は消えます。',
        'ぴったりチャレンジの記録は、ボタンを押した瞬間のブラウザの時計で測っています。画面の表示やクリック・タップの反応には端末ごとにわずかな遅れがあるため、1/100秒単位の差は端末や環境によって変わります。ゲームとしてお楽しみください。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'ポモドーロ・テクニック',
          description:
            '25分の作業と5分の休憩を1セットとして繰り返し、4セットごとに15〜30分の長い休憩をとる時間管理法です。短い区切りで集中を保つのが狙いで、時間は設定で変更できます。',
        },
        {
          term: 'ラップタイム',
          description:
            'ストップウォッチを止めずに、途中の区間ごとの時間を記録する機能です。「ラップ」は前回のラップからの区間時間、「経過」はスタートからの合計時間です。',
        },
        {
          term: 'ぴったりチャレンジ',
          description:
            'カウントを隠した状態で、体感だけで目標の秒数ぴったりに止められるかを競う遊びです。「ぴったり10秒」などの名前で知られ、目標との差が小さいほど高評価になります。',
        },
      ],
    },
    en: {
      title: 'Online Timer, Stopwatch, Pomodoro & Stop-at-10-Seconds Game',
      description:
        'A browser stopwatch with laps, a countdown timer, a Pomodoro timer, and a game of stopping at exactly 10 seconds with the count hidden. Nothing is uploaded.',
      h1: 'Timer, Stopwatch, Pomodoro and Exact-Time Challenge',
      introHtml:
        'A free online stopwatch, countdown timer, and Pomodoro timer that needs no installation. It also has an Exact-Time Challenge (the stop-at-10-seconds game) where the count is hidden and you try to stop right on the target. The stopwatch records lap times, the timer sounds an alarm when time is up, and the Pomodoro mode switches automatically between 25-minute work sessions and 5-minute breaks to help you stay focused. Time is measured with your device’s clock, so it stays accurate even if you switch tabs. Everything runs in your browser, and nothing is sent to a server. To calculate the days between dates, try the <a href="/en/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Date Calculator</a>.',

      modeLabel: 'Mode',
      modeStopwatch: 'Stopwatch',
      modeTimer: 'Timer',
      modePomodoro: 'Pomodoro',
      modeChallenge: 'Exact-time challenge',

      startButton: 'Start',
      pauseButton: 'Pause',
      resumeButton: 'Resume',
      resetButton: 'Reset',
      lapButton: 'Lap',
      skipButton: 'Skip to next',
      stopButton: 'Stop',
      soundLabel: 'Play an alarm sound when time is up',

      lapHeading: 'Laps',
      lapNumber: 'Lap {n}',
      lapSplitLabel: 'Lap',
      lapTotalLabel: 'Total',

      hoursLabel: 'Hours',
      minutesLabel: 'Minutes',
      secondsLabel: 'Seconds',
      presetsLabel: 'Quick presets',
      presetFormat: '{n} min',
      presetMinutes: [1, 3, 5, 10, 30],
      invalidDuration:
        'Hours, minutes, and seconds must be whole numbers of 0 or more, totaling at least 1 second and under 100 hours',
      finishedText: 'Time is up',

      workLabel: 'Work (min)',
      shortBreakLabel: 'Short break (min)',
      longBreakLabel: 'Long break (min)',
      longBreakEveryLabel: 'Work sessions before a long break',
      pomodoroSettingsLegend: 'Cycle settings',
      invalidPomodoro:
        'Work must be 1–180 minutes, breaks 1–60 minutes, and sessions before a long break 2–12 (whole numbers)',
      phaseLabels: {
        work: 'Work',
        shortBreak: 'Short break',
        longBreak: 'Long break',
      },
      roundsDone: 'Work sessions completed: {n}',
      phaseFinished: 'Next: {phase}',

      targetLabel: 'Target (seconds)',
      hideCountLabel: 'Hide the count',
      challengeHint:
        'Try to stop at exactly {target} seconds. Press Start, count in your head, then press Stop',
      invalidTarget: 'The target must be a whole number from 1 to 60 seconds',
      challengeResult: '{time} s ({diff} s from the target) — {judge}',
      judgeLabels: {
        perfect: 'Perfect!',
        great: 'Great!',
        good: 'So close!',
        close: 'Almost',
        miss: 'Missed',
      },
      attemptHeading: 'Results',
      attemptTargetLabel: 'Target',
      attemptTimeLabel: 'Time',
      attemptDiffLabel: 'Diff',
      attemptJudgeLabel: 'Result',
      bestText: 'Best: attempt {n} ({diff} s off)',

      notesHeading: 'Notes',
      notes: [
        'Time is measured from your device’s clock, so the end time stays nearly exact even in a background tab. Power saving in some browsers can delay the display and the alarm by a few seconds in background tabs.',
        'Browsers only allow the alarm sound after you press Start. You will not hear it if your device is muted.',
        'Closing or reloading the page clears the running time, the lap records, and the Exact-time challenge results.',
        'The challenge is timed with your browser’s clock at the moment you press each button. Display and click or tap latency differ slightly between devices, so differences of a hundredth of a second vary by device and environment. Enjoy it as a game.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'Pomodoro Technique',
          description:
            'A time-management method that repeats 25 minutes of work and a 5-minute break, with a longer 15–30 minute break after every four sessions. The short blocks help you stay focused; the lengths can be changed in the settings.',
        },
        {
          term: 'Lap time',
          description:
            'Recording intermediate times without stopping the stopwatch. “Lap” is the time since the previous lap, and “Total” is the time since the start.',
        },
        {
          term: 'Exact-time challenge',
          description:
            'A game where, with the count hidden, you try to stop on a target number of seconds by feel alone. Also known as the “stop at exactly 10 seconds” game; the smaller the difference from the target, the better the result.',
        },
      ],
    },
  };
