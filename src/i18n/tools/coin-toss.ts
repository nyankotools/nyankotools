import type { Locale } from '../../data/tools';

export interface CoinTossPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  headsLabel: string;
  tailsLabel: string;
  countLabel: string;
  countHint: string;
  countError: string;
  toss: string;
  /** {side} を置換して表示する */
  resultSingle: string;
  /** {count} {heads} {tails} を置換して表示する */
  resultMulti: string;
  sequenceLabel: string;
  statsHeading: string;
  statsEmpty: string;
  /** {total} {heads} {headsPct} {tails} {tailsPct} を置換して表示する */
  statsLine: string;
  /** {side} {length} を置換して表示する */
  currentStreak: string;
  /** {side} {length} を置換して表示する */
  longestStreak: string;
  historyLabel: string;
  historyEmpty: string;
  clearHistory: string;
  copy: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
}

export const coinTossContent: Record<Locale, CoinTossPageContent> = {
  ja: {
    title: 'コイントス｜表か裏かをオンラインで決める無料ツール',
    description:
      'コイントスを無料でオンライン実行。表か裏かを暗号用乱数で決め、3Dのコインが回転します。連続で投げる回数の指定、履歴・連続記録の確認も可能。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'コイントス（表か裏か）',
    introHtml:
      'ボタンを押すだけで、表か裏かを公平に決められるコイントスです。順番決めや二択の判断に。連続で投げる回数を指定でき、履歴と表裏の割合、連続記録も確認できます。3つ以上から選ぶときは <a href="/tools/roulette-dice/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ルーレット・抽選・サイコロ</a> をご利用ください。',
    headsLabel: '表',
    tailsLabel: '裏',
    countLabel: '連続で投げる回数',
    countHint: '1〜10回。投げる回数と同じ枚数のコインが並んで表示されます。',
    countError: '回数は1〜10の整数で入力してください。',
    toss: 'コインを投げる',
    resultSingle: '結果: {side}',
    resultMulti: '{count}回投げました: 表 {heads}回・裏 {tails}回',
    sequenceLabel: '投げた順',
    statsHeading: '集計',
    statsEmpty: 'まだ投げていません。',
    statsLine:
      '合計 {total}回（表 {heads}回 {headsPct}%、裏 {tails}回 {tailsPct}%）',
    currentStreak: '現在の連続: {side} {length}回',
    longestStreak: '最長の連続: {side} {length}回',
    historyLabel: '履歴（古い順）',
    historyEmpty: '履歴はありません。',
    clearHistory: '履歴をクリア',
    copy: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '乱数にはブラウザの暗号用乱数（crypto.getRandomValues）を使い、表と裏が偏りなく同じ確率（50%）で出ます。コインの回転は演出で、結果は投げる前に決まっています。',
      '少ない回数では、表や裏が続くのは自然なことです。投げるたびの結果は前の結果と無関係です。',
      '履歴は最新の1000回分までをこのページ上に保持し、ページを閉じたりリロードしたりすると消えます。',
      'OSの「視覚効果を減らす」設定がオンの場合、コインは回転せずにすぐ結果が表示されます。',
      '本ツールの結果は、公正さを第三者に証明できるものではありません。懸賞や金銭の絡む決定には使わないでください。',
    ],
  },
  en: {
    title: 'Coin Toss – Online Heads or Tails Coin Flipper',
    description:
      'Flip a coin online and get heads or tails from cryptographic randomness. Flip several times in a row and track history and streaks. Runs in your browser only.',
    h1: 'Coin Toss: Heads or Tails',
    introHtml:
      'Press the button and let a fair coin settle it: who goes first, or any yes-or-no choice. Flip once or many times in a row, then check your history, the heads and tails split and your streaks. To choose among three or more options, use the <a href="/en/tools/roulette-dice/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Roulette, Random Picker &amp; Dice Roller</a>.',
    headsLabel: 'Heads',
    tailsLabel: 'Tails',
    countLabel: 'Flips in a row',
    countHint:
      'From 1 to 10. As many coins as the number of flips are shown side by side.',
    countError: 'Enter a whole number of flips from 1 to 10.',
    toss: 'Flip the coin',
    resultSingle: 'Result: {side}',
    resultMulti: '{count} flips: {heads} heads, {tails} tails',
    sequenceLabel: 'Order flipped',
    statsHeading: 'Statistics',
    statsEmpty: 'No flips yet.',
    statsLine:
      '{total} flips total ({heads} heads, {headsPct}%; {tails} tails, {tailsPct}%)',
    currentStreak: 'Current streak: {length} × {side}',
    longestStreak: 'Longest streak: {length} × {side}',
    historyLabel: 'History (oldest first)',
    historyEmpty: 'No history.',
    clearHistory: 'Clear history',
    copy: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Randomness comes from your browser’s cryptographic generator (crypto.getRandomValues), so heads and tails each come up with exactly 50% probability. The spinning coin is only a show: the result is decided before it spins.',
      'Streaks of heads or tails are normal over a small number of flips. Each flip is independent of the ones before it.',
      'The last 1000 flips are kept on this page only. Closing or reloading the page clears them.',
      'If your operating system has "reduce motion" turned on, the coin does not spin and the result appears immediately.',
      'The result cannot be proven fair to a third party. Do not use it for sweepstakes or any decision involving money.',
    ],
  },
};
