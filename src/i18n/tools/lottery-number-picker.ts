import type { Locale } from '../../data/tools';

interface GameLabel {
  label: string;
  rule: string;
}

export interface LotteryNumberPickerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  gameLabel: string;
  games: {
    loto6: GameLabel;
    miniloto: GameLabel;
    loto7: GameLabel;
    numbers3: GameLabel;
    numbers4: GameLabel;
  };
  countLabel: string;
  /** {max} を置換して表示する */
  countHint: string;
  /** {max} を置換して表示する */
  countError: string;
  generate: string;
  /** {count} を置換して表示する */
  resultTitle: string;
  /** 口ごとのラベル。{n} を置換して表示する */
  ticketLabel: string;
  disclaimer: string;
  copy: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
}

export const lotteryNumberPickerContent: Record<
  Locale,
  LotteryNumberPickerPageContent
> = {
  ja: {
    title: 'ロト・ナンバーズ番号ランダム選出｜ロト6・ミニロト・ロト7対応',
    description:
      'ロト6・ミニロト・ロト7・ナンバーズ3/4の番号をランダムに選ぶ娯楽用ツールです。複数口を一括生成できます。番号を選んでも当せん確率は変わりません。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ロト・ナンバーズ番号ランダム選出',
    introHtml:
      '番号選びに迷ったときの、ロト6・ミニロト・ロト7・ナンバーズ3/4の番号ランダム選出ツールです。ロト系は重複なしの昇順、ナンバーズは各桁0〜9で選びます。<strong>娯楽用であり、当せんを保証するものではありません。どの番号でも当せん確率は同じです。</strong>好きな項目の中から選びたいときは<a href="/tools/roulette-dice/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ルーレット・抽選・サイコロ</a> もご利用ください。',
    gameLabel: '種類',
    games: {
      loto6: { label: 'ロト6', rule: '1〜43から6個' },
      miniloto: { label: 'ミニロト', rule: '1〜31から5個' },
      loto7: { label: 'ロト7', rule: '1〜37から7個' },
      numbers3: { label: 'ナンバーズ3', rule: '3桁（各桁0〜9）' },
      numbers4: { label: 'ナンバーズ4', rule: '4桁（各桁0〜9）' },
    },
    countLabel: '口数',
    countHint: '1〜{max}口まで一度に生成できます。',
    countError: '口数は1〜{max}の整数で入力してください。',
    generate: '番号を選ぶ',
    resultTitle: '{count}口分の番号',
    ticketLabel: '{n}口目',
    disclaimer:
      '娯楽用です。番号を選んでも当せん確率は変わらず、当せんを保証するものではありません。購入は無理のない範囲で、公式の販売窓口でお願いします。',
    copy: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '娯楽用のツールです。どの番号の組み合わせも当せん確率は同じで、本ツールで選んだ番号が当たりやすくなることはありません。当せんは保証されません。',
      'ロト6は1〜43から6個、ミニロトは1〜31から5個、ロト7は1〜37から7個を、重複なしで選び昇順で表示します。ナンバーズ3/4は各桁0〜9を重複ありで選び、並びはそのままです。ボックスやミニなどの買い方には対応していません。',
      'ゲームの仕様は変更されることがあります。購入前に、必ず公式サイト（みずほ銀行・宝くじ公式サイト）で最新の内容を確認してください。',
      '乱数にはブラウザの暗号用乱数（crypto.getRandomValues）を使っています。選んだ番号は保存されません。ページを閉じる・再読み込みすると消えます。',
      '宝くじの購入は、無理のない範囲で行ってください。',
    ],
  },
  en: {
    title: 'Japan Loto Number Picker: Loto 6, Mini Loto, Loto 7, Numbers',
    description:
      'Pick random numbers for Japan’s Loto 6, Mini Loto, Loto 7 and Numbers 3/4, just for fun. Choosing numbers does not change your odds. Runs in your browser only.',
    h1: 'Random Number Picker for Japan Loto 6, Mini Loto, Loto 7 and Numbers',
    introHtml:
      'Can’t decide which numbers to play? Pick random numbers for Japan’s Loto 6, Mini Loto, Loto 7 and Numbers 3/4. Loto games give unique numbers in ascending order, and Numbers games give digits from 0 to 9. <strong>This is for entertainment only: it does not guarantee a win, and every combination has the same odds.</strong> To draw from your own list instead, try the <a href="/en/tools/roulette-dice/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Roulette, Random Picker &amp; Dice Roller</a>.',
    gameLabel: 'Game',
    games: {
      loto6: { label: 'Loto 6', rule: '6 numbers from 1–43' },
      miniloto: { label: 'Mini Loto', rule: '5 numbers from 1–31' },
      loto7: { label: 'Loto 7', rule: '7 numbers from 1–37' },
      numbers3: { label: 'Numbers 3', rule: '3 digits (each 0–9)' },
      numbers4: { label: 'Numbers 4', rule: '4 digits (each 0–9)' },
    },
    countLabel: 'Number of tickets',
    countHint: 'Generate 1 to {max} tickets at once.',
    countError: 'Enter a whole number of tickets from 1 to {max}.',
    generate: 'Pick numbers',
    resultTitle: 'Numbers for {count} ticket(s)',
    ticketLabel: 'Ticket {n}',
    disclaimer:
      'For entertainment only. Choosing numbers does not change your odds and a win is never guaranteed. Please play within your means and buy through official sellers.',
    copy: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'This tool is for entertainment. Every combination has the same chance of winning, and numbers picked here are no more likely to win. A win is never guaranteed.',
      'Loto 6 picks 6 numbers from 1–43, Mini Loto 5 from 1–31 and Loto 7 seven from 1–37, without repeats and shown in ascending order. Numbers 3/4 pick each digit from 0–9 with repeats allowed and keep the drawn order. Box, Mini and other play styles are not supported.',
      'Game rules can change. Check the latest details on the official lottery sites before you buy.',
      'Randomness comes from your browser’s cryptographic generator (crypto.getRandomValues). Picked numbers are not saved and disappear when you close or reload the page.',
      'Please buy lottery tickets only within your means.',
    ],
  },
};
