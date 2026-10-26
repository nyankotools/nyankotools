import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SimonGamePageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  startButton: string;
  restartButton: string;
  soundLabel: string;
  boardLabel: string;
  /** {n} {color} {symbol} を置換して表示する */
  panelLabel: string;
  /** パネル名（赤・青・緑・黄の順） */
  colorNames: string[];
  roundLabel: string;
  bestLabel: string;
  statusIdle: string;
  statusWatch: string;
  statusYourTurn: string;
  /** {round} を置換して表示する */
  statusRoundClear: string;
  /** {score} を置換して表示する */
  statusGameOver: string;
  statusNewBest: string;
  keyHint: string;
  noAudioNote: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const simonGameContent: Record<Locale, SimonGamePageContent> = {
  ja: {
    title: '色と音の記憶ゲーム｜光と音の順番を覚えて再現する無料ゲーム',
    description:
      '4色のパネルが光る順番と音を覚えて、同じ順番にタップして再現する記憶力ゲーム。ラウンドごとに1つずつ増え、キーボードの1〜4でも操作可能。ベスト記録は端末に保存。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '色と音の記憶ゲーム｜光る順番を覚えて再現しよう',
    introHtml:
      '4色のパネルが光と音で示す順番を覚え、同じ順番に押して再現するゲームです。クリアするたびに順番が1つずつ長くなります。どこまで覚えられるか挑戦してみましょう。ベスト記録はこの端末に保存されます。ほかの記憶ゲームでは <a href="/tools/memory-match/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">神経衰弱</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '「スタート」を押すと、パネルが光と音で順番を示します。',
      '順番をよく見て、同じ順番にパネルをクリック（タップ）します。キーボードの 1〜4 でも押せます。',
      '全部合っていれば、順番が1つ増えて次のラウンドへ進みます。',
      '間違えるとゲームオーバーです。音が不要なときは「効果音を鳴らす」のチェックを外します。',
    ],
    startButton: 'スタート',
    restartButton: 'もう一度',
    soundLabel: '効果音を鳴らす',
    boardLabel: '色と音のパネル',
    panelLabel: 'パネル{n} {color} {symbol}',
    colorNames: ['赤', '青', '緑', '黄'],
    roundLabel: 'ラウンド',
    bestLabel: 'ベスト',
    statusIdle: '「スタート」を押してください。',
    statusWatch: '順番をよく見てください…',
    statusYourTurn: 'あなたの番です。同じ順番に押してください。',
    statusRoundClear: 'ラウンド{round}クリア！ 次へ進みます…',
    statusGameOver: 'ゲームオーバー。{score} ラウンドまでクリアしました。',
    statusNewBest: 'ベスト記録を更新しました。',
    keyHint: 'キーボードの 1〜4 でもパネルを押せます。',
    noAudioNote: 'このブラウザでは音を鳴らせないため、光だけでプレイできます。',
    notesHeading: '注意事項',
    notes: [
      '順番は端末のブラウザ上で毎回ランダムに作られ、サーバーには送信されません。',
      '音はスタートを押したあとにブラウザ内で生成します。端末がマナーモードや音量ゼロだと聞こえないことがあります。',
      'パネルには色だけでなく番号（1〜4）と記号（▲●■◆）も表示しているので、色の区別が難しい場合も遊べます。',
      'ベスト記録（クリアしたラウンド数）はこのブラウザのローカルストレージに保存されます。データを消去したり別の端末・ブラウザを使ったりすると引き継がれません。保存できない環境では、ページを開いている間だけの記録になります。',
      'ラウンドが進むほど光る速さが少しずつ上がります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ワーキングメモリ',
        description:
          '情報を短い間だけ頭に保持しながら処理する記憶の働きです。このゲームでは、光った順番を覚えたまま入力するときに使われます。',
      },
      {
        term: 'メモリースパン',
        description:
          '一度に覚えて正しく再現できる項目数のことです。このゲームでは、ベスト記録のラウンド数がおおよその目安になります。',
      },
    ],
  },
  en: {
    title: 'Color & Sound Memory Game – Repeat the Sequence',
    description:
      'Watch four colored panels light up with tones, then repeat the sequence. It grows each round. Play by tap or keys 1-4. Nothing is uploaded.',
    h1: 'Color & Sound Memory Game – Repeat the Light Sequence',
    introHtml:
      'Four colored panels flash and play tones in a pattern. Remember it and repeat it in the same order. Every round adds one more step, so see how far you can go. Your best round is saved on this device. Want another memory game? Try <a href="/en/tools/memory-match/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Memory Match</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Press "Start". The panels show the sequence with light and sound.',
      'Repeat the same order by clicking or tapping the panels. You can also press keys 1 to 4.',
      'If every step is right, the sequence grows by one and the next round begins.',
      'One mistake ends the game. To play silently, uncheck "Play sounds".',
    ],
    startButton: 'Start',
    restartButton: 'Play again',
    soundLabel: 'Play sounds',
    boardLabel: 'Color and sound panels',
    panelLabel: 'Panel {n}, {color}, {symbol}',
    colorNames: ['red', 'blue', 'green', 'yellow'],
    roundLabel: 'Round',
    bestLabel: 'Best',
    statusIdle: 'Press "Start" to begin.',
    statusWatch: 'Watch the sequence…',
    statusYourTurn: 'Your turn. Repeat the sequence.',
    statusRoundClear: 'Round {round} cleared! Get ready…',
    statusGameOver: 'Game over. You cleared {score} rounds.',
    statusNewBest: 'New best record.',
    keyHint: 'You can also press keys 1 to 4 to hit the panels.',
    noAudioNote:
      'Sound is not available in this browser, so only lights are used.',
    notesHeading: 'Notes',
    notes: [
      'The sequence is generated randomly in your browser each game and is never sent to a server.',
      'Sounds are generated in the browser after you press Start. You may hear nothing if your device is muted or the volume is at zero.',
      'Each panel shows a number (1-4) and a symbol (▲ ● ■ ◆) as well as a color, so the game is playable if colors are hard to tell apart.',
      'Your best record (rounds cleared) is stored in this browser’s local storage. It is not carried over if you clear site data or switch browsers or devices. Where storage is unavailable, it lasts only while the page is open.',
      'The lights get a little faster as the rounds go on.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Working memory',
        description:
          'The ability to hold information in mind for a short time while using it. Here you rely on it to remember the order of the lights while you enter it.',
      },
      {
        term: 'Memory span',
        description:
          'The number of items you can remember and repeat correctly in one go. In this game, your best round is a rough indicator.',
      },
    ],
  },
};
