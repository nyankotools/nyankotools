import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface MemoryMatchPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  difficultyLabel: string;
  difficultyEasy: string;
  difficultyNormal: string;
  difficultyHard: string;
  newGame: string;
  boardLabel: string;
  /** {n} を置換して表示する */
  cardFaceDown: string;
  /** {n} {value} を置換して表示する */
  cardFaceUp: string;
  /** {n} {value} を置換して表示する */
  cardMatched: string;
  movesLabel: string;
  timeLabel: string;
  pairsLabel: string;
  /** {matched} {total} を置換して表示する */
  pairsValue: string;
  bestHeading: string;
  bestNone: string;
  /** {moves} {time} を置換して表示する */
  bestValue: string;
  resetRecords: string;
  recordsCleared: string;
  /** {moves} {time} を置換して表示する */
  completed: string;
  newBestMoves: string;
  newBestTime: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const memoryMatchContent: Record<Locale, MemoryMatchPageContent> = {
  ja: {
    title:
      '神経衰弱ゲーム｜無料で遊べる記憶力ゲーム・手数と時間のベスト記録付き',
    description:
      'ブラウザで遊べる神経衰弱（記憶力ゲーム）。絵文字のカードを2枚ずつめくってペアを揃えます。12枚・16枚・30枚の3段階で、手数とクリア時間のベスト記録を端末に保存。スマホ対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '神経衰弱｜絵文字のペアを揃える記憶力ゲーム',
    introHtml:
      'カードを2枚ずつめくって、同じ絵文字のペアを揃えていく神経衰弱です。枚数を選び、できるだけ少ない手数・短い時間でクリアを目指しましょう。ベスト記録はこの端末に保存されます。ほかのゲームでは <a href="/tools/sudoku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">数独</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '難易度（簡単・普通・難しい）を選びます。選ぶとすぐに新しいゲームが始まります。',
      'カードをクリック（タップ）して1枚めくり、続けてもう1枚めくります。同じ絵柄ならそのまま残ります。',
      '違う絵柄だった場合は、少し見えたあとで裏返ります。位置を覚えながら進めます。',
      'すべてのペアを揃えるとクリアです。「新しいゲーム」でカードを配り直せます。',
    ],
    difficultyLabel: '難易度',
    difficultyEasy: '簡単（12枚）',
    difficultyNormal: '普通（16枚）',
    difficultyHard: '難しい（30枚）',
    newGame: '新しいゲーム',
    boardLabel: '神経衰弱の盤面',
    cardFaceDown: 'カード{n} 裏向き',
    cardFaceUp: 'カード{n} {value}',
    cardMatched: 'カード{n} {value} 揃いました',
    movesLabel: '手数',
    timeLabel: '時間',
    pairsLabel: 'ペア',
    pairsValue: '{matched} / {total}',
    bestHeading: 'ベスト記録',
    bestNone: '記録なし',
    bestValue: '{moves} 手・{time}',
    resetRecords: '記録をリセット',
    recordsCleared: 'ベスト記録をリセットしました。',
    completed: 'クリア！ {moves} 手・{time} でした。',
    newBestMoves: '手数のベスト記録を更新しました。',
    newBestTime: 'タイムのベスト記録を更新しました。',
    notesHeading: '注意事項',
    notes: [
      'カードの配置は端末のブラウザ上で毎回ランダムに作られ、サーバーには送信されません。',
      '「手数」は2枚をめくるごとに1手と数えます。「時間」は最初の1枚をめくった瞬間から全ペアが揃うまでです。',
      'ベスト記録は難易度ごとに、このブラウザのローカルストレージへ保存されます。ブラウザのデータを消去したり、別の端末・ブラウザを使ったりすると引き継がれません。シークレットモードなど保存できない環境では、そのページを開いている間だけの記録になります。',
      'ゲームの途中経過は保存されません。ページを再読み込みすると新しいゲームになります。',
      '絵文字の見た目は、お使いのOS・ブラウザによって異なります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '神経衰弱',
        description:
          '裏向きに並べたカードを2枚ずつめくり、同じ絵柄のペアを揃えていくカードゲームです。どこに何があるかを記憶する力が試されます。「ペアマッチング」「メモリーゲーム」とも呼ばれます。',
      },
      {
        term: 'ワーキングメモリ',
        description:
          '情報を短い間だけ頭に保持しながら処理する記憶の働きです。神経衰弱では、めくったカードの位置と絵柄を覚えておくときに使われます。',
      },
    ],
  },
  en: {
    title: 'Memory Match Game – Free Card Matching with Best Time',
    description:
      'Play memory match in your browser. Flip emoji cards, find every pair, and save your best moves and time. Nothing is uploaded.',
    h1: 'Memory Match – Flip Cards and Find the Emoji Pairs',
    introHtml:
      'Flip two cards at a time and match the pairs. Pick a board size and try to clear it in as few moves and as little time as you can. Your best records are saved on this device. Looking for another game? Try <a href="/en/tools/sudoku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Sudoku</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a difficulty (Easy, Medium or Hard). A new game starts as soon as you pick one.',
      'Click or tap a card to flip it, then flip a second one. If the pictures match, they stay face up.',
      'If they do not match, they flip back after a short moment. Remember where each picture is.',
      'Match every pair to win. Press “New game” to deal again.',
    ],
    difficultyLabel: 'Difficulty',
    difficultyEasy: 'Easy (12 cards)',
    difficultyNormal: 'Medium (16 cards)',
    difficultyHard: 'Hard (30 cards)',
    newGame: 'New game',
    boardLabel: 'Memory match board',
    cardFaceDown: 'Card {n}, face down',
    cardFaceUp: 'Card {n}, {value}',
    cardMatched: 'Card {n}, {value}, matched',
    movesLabel: 'Moves',
    timeLabel: 'Time',
    pairsLabel: 'Pairs',
    pairsValue: '{matched} / {total}',
    bestHeading: 'Best records',
    bestNone: 'No record yet',
    bestValue: '{moves} moves · {time}',
    resetRecords: 'Reset records',
    recordsCleared: 'Best records have been reset.',
    completed: 'Cleared! {moves} moves in {time}.',
    newBestMoves: 'New best for moves.',
    newBestTime: 'New best time.',
    notesHeading: 'Notes',
    notes: [
      'The card layout is shuffled in your browser every game and never sent to a server.',
      'A move is counted each time you flip two cards. The timer starts when you flip the first card and stops when the last pair is matched.',
      'Best records are stored per difficulty in this browser’s local storage. They are not carried over if you clear site data or switch browsers or devices. In private windows or other environments that cannot store data, records last only while the page is open.',
      'Game progress is not saved. Reloading the page starts a new game.',
      'How emoji look depends on your operating system and browser.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Memory match (Concentration)',
        description:
          'A card game where face-down cards are flipped two at a time and you try to find pairs with the same picture. It tests how well you remember where each card is. Also called Pairs, Pelmanism or Concentration.',
      },
      {
        term: 'Working memory',
        description:
          'The ability to hold information in mind for a short time while using it. In memory match, you rely on it to keep track of the pictures you have just seen and where they were.',
      },
    ],
  },
};
