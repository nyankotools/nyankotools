import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface RouletteDicePageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeRoulette: string;
  modeLots: string;
  modeDice: string;
  itemsLabel: string;
  itemsPlaceholder: string;
  itemNameHeader: string;
  weightHeader: string;
  itemNamePlaceholder: string;
  weightLabel: string;
  removeItem: string;
  addItem: string;
  resetWeights: string;
  bulkSummary: string;
  bulkHint: string;
  /** 重みの書き方の説明 */
  weightHint: string;
  defaultItems: string;
  /** {count} を置換して表示する */
  itemsInfo: string;
  /** {max} を置換して表示する */
  tooManyItems: string;
  needItems: string;
  removeWinnerLabel: string;
  spin: string;
  /** {item} を置換して表示する */
  rouletteResult: string;
  allRemoved: string;
  lotsCountLabel: string;
  lotsDraw: string;
  /** {count} を置換して表示する */
  lotsResult: string;
  diceCountLabel: string;
  diceSidesLabel: string;
  diceModifierLabel: string;
  diceRoll: string;
  /** {total} {sum} {modifier} を置換して表示する（modifier は「+3」のような符号付き。0 のときは空） */
  diceResult: string;
  diceCountError: string;
  diceSidesError: string;
  diceModifierError: string;
  copy: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const rouletteDiceContent: Record<Locale, RouletteDicePageContent> = {
  ja: {
    title: 'ルーレット・抽選・サイコロ｜名前や項目から1つ選ぶ無料ツール',
    description:
      '項目を入力して回すルーレット、重複なしで当選者を選ぶくじ引き、1D6や2D6+3などのダイスロールができる無料ツールです。乱数はブラウザの暗号用乱数を使用。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ルーレット・抽選・サイコロ',
    introHtml:
      'ランチの店決めや順番決め、プレゼント企画の当選者選びに使える、ルーレット・抽選・サイコロのツールです。項目を1行に1つずつ入力して回すだけ。サイコロはTRPGで使う多面ダイス（D4〜D100）にも対応しています。パスワード用のランダム文字列は <a href="/tools/password-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">パスワード生成</a> をご利用ください。',
    modeLabel: '使い方を選ぶ',
    modeRoulette: 'ルーレット',
    modeLots: '抽選（複数人）',
    modeDice: 'サイコロ',
    itemsLabel: '項目と重み',
    itemsPlaceholder: '項目を1行に1つずつ入力',
    itemNameHeader: '項目',
    weightHeader: '重み',
    itemNamePlaceholder: '項目名',
    weightLabel: '重み',
    removeItem: '項目を削除',
    addItem: '項目を追加',
    resetWeights: '重みをすべて1に戻す',
    bulkSummary: 'まとめて入力・貼り付け',
    bulkHint:
      '1行に1項目で入力・貼り付けできます。重みは行末に「*3」のように書きます（例: 大当たり*1、はずれ*9）。',
    weightHint:
      '重みが大きい項目ほど当たりやすくなります（初期値は1）。右下の％が、その項目の当たる確率です。',
    defaultItems: 'ラーメン\nカレー\n寿司\nうどん\nハンバーガー',
    itemsInfo: '{count}件',
    tooManyItems: '項目は{max}件までです。',
    needItems: '項目を入力してください。',
    removeWinnerLabel: '当たった項目は次から除外する',
    spin: 'ルーレットを回す',
    rouletteResult: '結果: {item}',
    allRemoved: 'すべての項目が選ばれました。項目を入力し直してください。',
    lotsCountLabel: '当選数',
    lotsDraw: '抽選する',
    lotsResult: '{count}件が当選しました',
    diceCountLabel: 'ダイスの数',
    diceSidesLabel: '面の数',
    diceModifierLabel: '補正値',
    diceRoll: 'サイコロを振る',
    diceResult: '合計 {total}（出目の合計 {sum}{modifier}）',
    diceCountError: 'ダイスの数は1〜100の整数で入力してください。',
    diceSidesError: '面の数は2〜1000の整数で入力してください。',
    diceModifierError: '補正値は整数で入力してください。',
    copy: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '乱数にはブラウザの暗号用乱数（crypto.getRandomValues）を使い、偏りが出ないように抽選しています。ルーレットの回転は演出で、結果は回す前に決まっています。',
      '本ツールの結果は、公正さを第三者に証明できるものではありません。懸賞・景品表示法の対象となる抽選や金銭の絡む抽選には使わないでください。',
      '行末に「*3」のように重みを書くと、重みに比例した確率になります（重みを書かない行は1）。ホイールの扇形の大きさと、下に表示される確率にも反映されます。抽選モードも同じ重みで、重複なしに選びます。同じ項目を複数行に入力しても、その分だけ当たりやすくなります。',
      '項目は最大100件までです。ホイールには長い項目名は先頭だけ表示され、結果には全文が表示されます。',
      'ダイスは最大100個、面の数は2〜1000、補正値は整数で指定できます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ダイスロール（2D6+3 など）',
        description:
          'TRPGなどの表記で、「6面ダイスを2個振って合計し、3を足す」ことを 2D6+3 と書きます。このツールでは、ダイスの数・面の数・補正値を分けて指定します。',
      },
      {
        term: '暗号用乱数',
        description:
          '予測しにくさを重視した乱数です。ブラウザが提供する crypto.getRandomValues を使っており、Math.random() よりも偏りや予測のリスクが小さくなります。',
      },
    ],
  },
  en: {
    title: 'Roulette, Random Picker & Dice Roller – Pick From a List',
    description:
      'Spin a roulette wheel, draw winners without repeats, or roll dice like 2d6+3. Runs in your browser; nothing is sent to a server.',
    h1: 'Roulette, Random Picker & Dice Roller',
    introHtml:
      'Decide where to eat, who goes first, or who wins a giveaway. Enter one item per line and spin. The dice roller supports tabletop RPG dice from d4 to d100. For random strings such as passwords, see the <a href="/en/tools/password-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Password Generator</a>.',
    modeLabel: 'Choose a mode',
    modeRoulette: 'Roulette',
    modeLots: 'Draw winners',
    modeDice: 'Dice',
    itemsLabel: 'Items and weights',
    itemsPlaceholder: 'Enter one item per line',
    itemNameHeader: 'Item',
    weightHeader: 'Weight',
    itemNamePlaceholder: 'Item name',
    weightLabel: 'Weight',
    removeItem: 'Remove item',
    addItem: 'Add item',
    resetWeights: 'Reset all weights to 1',
    bulkSummary: 'Bulk entry / paste',
    bulkHint:
      'Enter or paste one item per line. Add a weight at the end of a line, such as "*3" (for example Jackpot*1, Miss*9).',
    weightHint:
      'The larger an item’s weight, the more likely it is to win (default 1). The percentage below each weight is its chance.',
    defaultItems: 'Ramen\nCurry\nSushi\nUdon\nBurger',
    itemsInfo: '{count} item(s)',
    tooManyItems: 'You can enter up to {max} items.',
    needItems: 'Enter at least one item.',
    removeWinnerLabel: 'Remove each winner from the next spin',
    spin: 'Spin the wheel',
    rouletteResult: 'Result: {item}',
    allRemoved: 'Every item has been picked. Enter the items again.',
    lotsCountLabel: 'Number of winners',
    lotsDraw: 'Draw',
    lotsResult: '{count} winner(s) drawn',
    diceCountLabel: 'Number of dice',
    diceSidesLabel: 'Sides',
    diceModifierLabel: 'Modifier',
    diceRoll: 'Roll the dice',
    diceResult: 'Total {total} (dice sum {sum}{modifier})',
    diceCountError: 'Enter a whole number of dice from 1 to 100.',
    diceSidesError: 'Enter a whole number of sides from 2 to 1000.',
    diceModifierError: 'Enter the modifier as a whole number.',
    copy: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Randomness comes from your browser’s cryptographic generator (crypto.getRandomValues) and is drawn without bias. The wheel animation is only a show: the result is decided before it spins.',
      'The result cannot be proven fair to a third party. Do not use this tool for giveaways governed by sweepstakes law or for any draw involving money.',
      'Add a weight such as "*3" at the end of a line to make the chance proportional to it (lines without one count as 1). The wheel segment sizes and the percentages shown below the list follow the weights, and Draw mode uses the same weights without repeats. Entering the same item on several lines also makes it more likely to win.',
      'Up to 100 items are supported. Long names are shortened on the wheel, but the result shows the full text.',
      'You can roll up to 100 dice with 2 to 1000 sides and a whole-number modifier.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Dice notation (such as 2d6+3)',
        description:
          'Tabletop RPG shorthand: 2d6+3 means roll two six-sided dice, add them up, then add 3. This tool takes the number of dice, the sides and the modifier as separate fields.',
      },
      {
        term: 'Cryptographic randomness',
        description:
          'Random numbers designed to be hard to predict. The tool uses the browser’s crypto.getRandomValues, which has less bias and predictability risk than Math.random().',
      },
    ],
  },
};
