import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '「ぴったり10秒」のようなゲームで遊べますか？',
      answer:
        'はい。「ぴったりチャレンジ」モードで、目標の秒数（1〜60秒、初期値は10秒）を決め、スタートしてから心の中で数えてストップを押します。「カウントを隠す」をオンにすると経過時間が「??:??.??」と表示されず、体感だけで挑戦できます。止めると記録と目標との差、判定が表示され、何回分かの記録と最も近かった回が一覧に残ります。',
    },
    {
      question: 'タブを切り替えたり、画面を閉じたりしても計測は続きますか？',
      answer:
        '別のタブに切り替えても計測は続き、終了時刻は端末の時計で判定するためほぼ正確です。ただしブラウザの省電力機能で、裏タブでは表示更新やアラーム音が数秒遅れることがあります。ページを閉じる・再読み込みすると計測は消えます。',
    },
    {
      question: 'アラーム音が鳴らないのはなぜですか？',
      answer:
        'ブラウザは、ユーザーの操作がないページで音を鳴らすことを制限しています。スタートボタンを押してから計測を始めると鳴ります。「終了時にアラーム音を鳴らす」がオフでないか、端末やタブがミュートでないかも確認してください。',
    },
    {
      question: 'ポモドーロタイマーの作業・休憩の時間を変えられますか？',
      answer:
        '変えられます。作業（1〜180分）、短い休憩・長い休憩（各1〜60分）、長い休憩までの作業回数（2〜12回）を設定できます。初期値は、一般的な25分作業・5分休憩・15分の長い休憩・4回ごとです。',
    },
    {
      question: 'ストップウォッチのラップと経過の違いは何ですか？',
      answer:
        '「ラップ」は前回のラップを押してからの区間時間、「経過」はスタートしてからの合計時間です。たとえば1周目が1分、2周目が1分30秒なら、2回目の行はラップ1:30、経過2:30と表示されます。',
    },
  ],
  en: [
    {
      question: 'Can I play a “stop at exactly 10 seconds” game?',
      answer:
        'Yes. In the Exact-time challenge mode, set a target (1–60 seconds, 10 by default), press Start, count in your head, and press Stop. With “Hide the count” on, the elapsed time shows as “??:??.??” so you rely on feel alone. When you stop, you see your time, the difference from the target, and a rating, and the results list keeps your attempts and highlights the closest one.',
    },
    {
      question: 'Does it keep running if I switch tabs or lock the screen?',
      answer:
        'Yes, it keeps running in another tab, and the end time is checked against your device clock, so it stays nearly exact. Power saving in some browsers can delay the display and the alarm by a few seconds in background tabs. Closing or reloading the page clears the timer.',
    },
    {
      question: 'Why does the alarm sound not play?',
      answer:
        'Browsers restrict sound on pages the user has not interacted with. The alarm works once you press Start. Also check that “Play an alarm sound” is on and that your device or tab is not muted.',
    },
    {
      question: 'Can I change the Pomodoro work and break lengths?',
      answer:
        'Yes. You can set work (1–180 minutes), short and long breaks (1–60 minutes each), and how many work sessions come before a long break (2–12). The defaults are the common 25-minute work, 5-minute break, and 15-minute long break every four sessions.',
    },
    {
      question:
        'What is the difference between Lap and Total on the stopwatch?',
      answer:
        '“Lap” is the time since you pressed Lap last, and “Total” is the time since the start. If the first lap took 1:00 and the second 1:30, the second row shows Lap 1:30 and Total 2:30.',
    },
  ],
};
