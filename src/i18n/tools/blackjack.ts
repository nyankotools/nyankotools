import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface BlackjackPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  entertainmentNote: string;
  chipsLabel: string;
  bestLabel: string;
  betLabel: string;
  /** {amount} を置換して表示する */
  betOption: string;
  deal: string;
  hit: string;
  stand: string;
  doubleDown: string;
  resetChips: string;
  dealerLabel: string;
  playerLabel: string;
  /** {total} を置換して表示する */
  totalText: string;
  /** {total} を置換して表示する（A を 11 として数えている手） */
  softTotalText: string;
  hiddenCard: string;
  /** {suit} {rank} を置換して表示する */
  cardLabel: string;
  suitS: string;
  suitH: string;
  suitD: string;
  suitC: string;
  statusBetting: string;
  statusPlayer: string;
  /** {amount} を置換して表示する（払い戻されたチップ数。ベット込み） */
  resultBlackjack: string;
  resultWin: string;
  resultDealerBust: string;
  resultPush: string;
  resultLose: string;
  resultBust: string;
  broke: string;
  resetDone: string;
  boardLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const blackjackContent: Record<Locale, BlackjackPageContent> = {
  ja: {
    title: 'ブラックジャック｜無料でCPUディーラーと対戦・仮想チップ',
    description:
      'ブラウザで遊べるブラックジャックです。ヒット・スタンド・ダブルダウンでCPUディーラーと対戦。使うのは換金できない仮想チップだけで、娯楽・練習用です。登録不要、データはサーバーに送信されません。',
    h1: 'ブラックジャック｜CPUディーラーと仮想チップで対戦',
    introHtml:
      'カードの合計を21に近づけ、ディーラーより高い手を作れば勝ちです。ヒット・スタンド・ダブルダウンが使え、ブラックジャックは3:2（ベットの1.5倍の儲け）で払い戻されます。使うのは換金できない仮想チップだけで、<strong>娯楽・ルール練習用のゲーム</strong>です（現実のお金や賞品とは一切関係ありません）。もっと手軽な運試しなら <a href="/tools/coin-toss/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">コイントス</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      'ベット額（10・50・100・500）を選び、「配る」を押します。あなたとディーラーに2枚ずつ配られます（ディーラーの1枚は伏せられます）。',
      '合計が21を超えない範囲で、「ヒット」で1枚引くか、「スタンド」で止めます。最初の2枚の時点では「ダブルダウン」でベットを2倍にして1枚だけ引くこともできます。',
      'あなたがスタンドするとディーラーが17以上になるまで引き、勝敗が決まります。勝つとチップが増えます。',
      'もう一度遊ぶときは「配る」を押します。チップがなくなったら「チップをリセット」で1,000枚から再開できます。',
    ],
    entertainmentNote:
      'これは娯楽・ルール練習用のゲームです。チップに金銭的な価値はなく、換金・景品との交換もできません。',
    chipsLabel: 'チップ',
    bestLabel: '最高記録',
    betLabel: 'ベット額',
    betOption: '{amount}',
    deal: '配る',
    hit: 'ヒット',
    stand: 'スタンド',
    doubleDown: 'ダブルダウン',
    resetChips: 'チップをリセット',
    dealerLabel: 'ディーラー',
    playerLabel: 'あなた',
    totalText: '合計 {total}',
    softTotalText: '合計 {total}（Aを11として計算）',
    hiddenCard: '伏せられたカード',
    cardLabel: '{suit}の{rank}',
    suitS: 'スペード',
    suitH: 'ハート',
    suitD: 'ダイヤ',
    suitC: 'クラブ',
    statusBetting: 'ベット額を選んで「配る」を押してください。',
    statusPlayer: 'ヒットかスタンドを選んでください。',
    resultBlackjack: 'ブラックジャック！ 3:2で {amount} 枚が戻りました。',
    resultWin: 'あなたの勝ちです。{amount} 枚が戻りました。',
    resultDealerBust:
      'ディーラーがバースト。あなたの勝ちで {amount} 枚が戻りました。',
    resultPush: '引き分けです。ベットの {amount} 枚が戻りました。',
    resultLose: 'ディーラーの勝ちです。ベットは戻りません。',
    resultBust: 'バースト（21超え）。ベットは戻りません。',
    broke:
      'チップがなくなりました。「チップをリセット」で1,000枚から再開できます。',
    resetDone: 'チップを1,000枚にリセットしました。',
    boardLabel: 'ブラックジャックのテーブル',
    notesHeading: '注意事項',
    notes: [
      '娯楽・ルール練習用のゲームです。仮想チップに金銭的な価値はなく、換金や景品との交換はできません。実際の賭け事を勧めるものではありません。',
      '操作はすべてブラウザ上で処理され、サーバーには何も送信されません。チップ数と最高記録だけが、この端末のブラウザ（localStorage）に保存されます。保存できない環境では、ページを開いている間だけの記録になります。',
      'カードは6デッキ（312枚）を、ブラウザの安全な乱数（crypto.getRandomValues）でシャッフルして使います。山札が52枚を下回ると、次の配札の前にシャッフルし直します。',
      'ルール: ディーラーはソフト17（Aを11として17）を含め、17以上でスタンドします。ブラックジャックは3:2、勝ちは1:1、引き分けはベットが戻ります。ダブルダウンは最初の2枚のときだけで、手持ちのチップがベット額以上あるときに使えます。',
      'スプリット（同じ数字の2枚を2手に分ける）、インシュランス、サレンダーはありません。ディーラーがブラックジャックのときは、配札の時点で勝負が決まります。',
      '伏せられたディーラーのカードは、スタンドするか勝負が決まるまで見られません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ブラックジャック（ナチュラル）',
        description:
          '最初の2枚がAと10点札（10・J・Q・K）で、合計が21になった手です。通常の21より強く、このツールでは3:2（ベットの1.5倍の儲け）で払い戻されます。',
      },
      {
        term: 'ヒット／スタンド',
        description:
          'ヒットはカードをもう1枚引くこと、スタンドは引くのをやめてその手で勝負することです。',
      },
      {
        term: 'ダブルダウン',
        description:
          '最初の2枚を見たあとにベットを2倍にし、カードを1枚だけ引いてスタンドする選択です。合計が11前後のときに使われます。',
      },
      {
        term: 'ソフトハンド／バースト',
        description:
          'Aを11として数えている手がソフトハンドです。合計が21を超えるとバーストで、その時点で負けになります。',
      },
    ],
  },
  en: {
    title: 'Blackjack vs Dealer – Free Browser Game, Virtual Chips',
    description:
      'Play blackjack against a computer dealer in your browser. Hit, stand or double down with virtual chips that have no cash value. For fun only; nothing is sent.',
    h1: 'Blackjack – Play the Dealer with Virtual Chips',
    introHtml:
      'Get closer to 21 than the dealer without going over. You can hit, stand or double down, and a blackjack pays 3:2. The game uses virtual chips that cannot be cashed out, so it is <strong>just for fun and for practicing the rules</strong>, with no real money or prizes involved. Looking for something simpler? Try <a href="/en/tools/coin-toss/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Coin Toss</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a bet (10, 50, 100 or 500) and press "Deal". You and the dealer each get two cards, and one dealer card stays face down.',
      'Press "Hit" to draw a card or "Stand" to stop, without going over 21. With your first two cards you can also "Double down" to double your bet and take exactly one more card.',
      'When you stand, the dealer draws until reaching 17 or more, and the round is settled. Winning adds chips.',
      'Press "Deal" to play again. If you run out of chips, press "Reset chips" to start over with 1,000.',
    ],
    entertainmentNote:
      'This is a game for fun and for practicing the rules. Chips have no monetary value and cannot be cashed out or exchanged for prizes.',
    chipsLabel: 'Chips',
    bestLabel: 'Best',
    betLabel: 'Bet',
    betOption: '{amount}',
    deal: 'Deal',
    hit: 'Hit',
    stand: 'Stand',
    doubleDown: 'Double down',
    resetChips: 'Reset chips',
    dealerLabel: 'Dealer',
    playerLabel: 'You',
    totalText: 'Total {total}',
    softTotalText: 'Total {total} (soft, ace as 11)',
    hiddenCard: 'Face-down card',
    cardLabel: '{rank} of {suit}',
    suitS: 'spades',
    suitH: 'hearts',
    suitD: 'diamonds',
    suitC: 'clubs',
    statusBetting: 'Choose a bet and press "Deal".',
    statusPlayer: 'Hit or stand?',
    resultBlackjack: 'Blackjack! It pays 3:2, so you get {amount} chips back.',
    resultWin: 'You win. {amount} chips returned.',
    resultDealerBust: 'The dealer busts. You win and get {amount} chips back.',
    resultPush: 'Push. Your bet of {amount} chips is returned.',
    resultLose: 'The dealer wins. Your bet is lost.',
    resultBust: 'Bust (over 21). Your bet is lost.',
    broke:
      'You are out of chips. Press "Reset chips" to start again with 1,000.',
    resetDone: 'Chips reset to 1,000.',
    boardLabel: 'Blackjack table',
    notesHeading: 'Notes',
    notes: [
      'This is a game for fun and for practicing the rules. Virtual chips have no monetary value and cannot be cashed out or exchanged for prizes. It does not encourage real gambling.',
      'Everything runs in your browser and nothing is sent to a server. Only your chip count and best record are saved in this browser (localStorage). If storage is unavailable, they last only while the page is open.',
      'The cards come from a six-deck shoe (312 cards) shuffled with the browser’s secure random source (crypto.getRandomValues). When fewer than 52 cards remain, the shoe is reshuffled before the next deal.',
      'Rules: the dealer stands on every 17, including soft 17 (an ace counted as 11). Blackjack pays 3:2, a win pays 1:1, and a push returns your bet. You can double down only on your first two cards, and only if you have at least as many chips as your bet.',
      'There is no splitting, insurance or surrender. If the dealer has blackjack, the round is decided as soon as the cards are dealt.',
      'The dealer’s face-down card stays hidden until you stand or the round ends.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Blackjack (natural)',
        description:
          'An ace plus a ten-value card (10, J, Q or K) as your first two cards, totaling 21. It beats any other 21 and pays 3:2 here, meaning a profit of 1.5 times your bet.',
      },
      {
        term: 'Hit / Stand',
        description:
          'Hit means taking one more card. Stand means stopping and keeping your current hand.',
      },
      {
        term: 'Double down',
        description:
          'After seeing your first two cards, you double your bet, take exactly one more card, and stand. It is commonly used with a total around 11.',
      },
      {
        term: 'Soft hand / Bust',
        description:
          'A soft hand counts an ace as 11. If your total goes over 21 you bust and lose immediately.',
      },
    ],
  },
};
