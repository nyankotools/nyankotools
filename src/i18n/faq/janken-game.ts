import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'CPUはこちらの手を見てから出していませんか？',
      answer:
        'いいえ。CPUの手は、ボタンを押した瞬間にブラウザの暗号用乱数でグー・チョキ・パーから等確率に選びます。あなたの手や過去の勝負は参照しないので、長く遊べば勝率は3分の1ずつに近づきます。',
    },
    {
      question: 'あいこのとき、連勝はどうなりますか？',
      answer:
        'あいこでは連勝が途切れず、そのまま続きます。連勝が0に戻るのは負けたときだけです。あいこは通算の「あいこ」の数にだけ加算されます。',
    },
    {
      question: '最高連勝や通算成績はどこに保存されますか？',
      answer:
        'このブラウザの localStorage に保存され、サーバーには送信されません。ブラウザのデータを削除したり別の端末・別のブラウザで開いたりすると引き継がれません。プライベートブラウズなどで保存できない場合は、ページを開いている間だけ記録されます。',
    },
    {
      question: '成績を最初からやり直すには？',
      answer:
        '「成績をリセット」を押すと、現在の連勝・最高連勝・通算の勝ち負け・履歴がすべて消え、保存済みの記録も削除されます。元には戻せません。',
    },
  ],
  en: [
    {
      question: 'Does the CPU see my move before choosing?',
      answer:
        'No. The CPU picks rock, paper or scissors with equal probability from your browser’s cryptographic random generator at the moment you press a button. It ignores your move and your history, so over many rounds each outcome approaches one third.',
    },
    {
      question: 'What happens to my streak on a tie?',
      answer:
        'A tie does not break the streak; it simply carries on. The streak returns to 0 only when you lose. Ties are counted only in your total ties.',
    },
    {
      question: 'Where are my best streak and totals stored?',
      answer:
        'In this browser’s localStorage, and never sent to a server. Clearing site data or opening the page on another device or browser starts a new record. If storage is blocked, for example in private browsing, the record lasts only while the page is open.',
    },
    {
      question: 'How do I start over from zero?',
      answer:
        'Press "Reset record". It clears the current streak, best streak, totals and history, and deletes the saved record. This cannot be undone.',
    },
  ],
};
