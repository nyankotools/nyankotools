import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface WordSearchGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  wordsLabel: string;
  wordsPlaceholder: string;
  /** 初期表示で入れておく語（改行区切り） */
  defaultWords: string;
  sizeLabel: string;
  /** {min} {max} を置換して表示する */
  sizeHint: string;
  difficultyLabel: string;
  difficultyEasy: string;
  difficultyNormal: string;
  difficultyHard: string;
  /** 難易度ごとの説明（選択中の難易度のものだけ表示する） */
  difficultyHintEasy: string;
  difficultyHintNormal: string;
  difficultyHintHard: string;
  generate: string;
  showAnswer: string;
  showWordList: string;
  download: string;
  print: string;
  /** canvas の代替テキスト。{size} を置換する */
  puzzleLabel: string;
  /** キャンバス内の単語リスト見出し。{count} を置換する */
  listTitle: string;
  /** {placed} {total} を置換する */
  placed: string;
  /** {words} を置換する */
  unplaced: string;
  /** {count} {max} を置換する */
  ignored: string;
  empty: string;
  downloaded: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const wordSearchGeneratorContent: Record<
  Locale,
  WordSearchGeneratorPageContent
> = {
  ja: {
    title:
      'ワードサーチ（言葉探し）作成｜好きな言葉で作れる・印刷とPNG保存に対応',
    description:
      '入力した言葉をマス目に隠して、ワードサーチ（言葉探し・文字探し）パズルを自動で作成する無料ツールです。マス数と難易度を選び、答え表示・PNG保存・印刷に対応。授業の教材やイベント、子どもの遊びに使えます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ワードサーチ作成｜好きな言葉で言葉探しパズルを作る',
    introHtml:
      '探してほしい言葉を1行に1語ずつ入力して「パズルを作る」を押すと、文字のマス目の中に言葉を隠したワードサーチ（言葉探し）を作成します。答えの表示、PNG画像での保存、そのまま印刷にも対応しているので、授業の教材や誕生日会・イベントの配布物に使えます。同じように印刷できる遊びには <a href="/tools/maze-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">迷路ジェネレーター</a> もあります。',
    howToHeading: '使い方',
    howToSteps: [
      '「探す言葉」に、隠したい言葉を1行に1語ずつ入力します（2文字以上、最大50語）。',
      '「マス数」と「難易度」を選び、「パズルを作る」を押します。',
      '「答えを表示」にチェックを入れると、隠した言葉の位置が色付きで分かります。',
      '「PNGで保存」で画像として保存するか、「印刷」で印刷します。答えを表示した状態で保存・印刷すると答え付きになります。',
    ],
    wordsLabel: '探す言葉（1行に1語）',
    wordsPlaceholder: 'ねこ\nいぬ\nうさぎ',
    defaultWords: 'ねこ\nいぬ\nうさぎ\nさかな\nくま\nとり\nかめ\nきつね',
    sizeLabel: 'マス数（縦横同じ）',
    sizeHint: '{min}〜{max}マスで指定できます。',
    difficultyLabel: '難易度',
    difficultyEasy: 'かんたん',
    difficultyNormal: 'ふつう',
    difficultyHard: 'むずかしい',
    difficultyHintEasy:
      'かんたん: 言葉は「右向き」と「下向き」だけに並びます。小さな子どもでも探しやすい配置です。',
    difficultyHintNormal:
      'ふつう: 右向き・下向きに加えて、斜め（右下・右上）にも言葉が並びます。',
    difficultyHintHard:
      'むずかしい: 上下左右と斜めの8方向に、逆向き（右から左・下から上など）も含めて並びます。',
    generate: 'パズルを作る',
    showAnswer: '答えを表示',
    showWordList: '探す言葉の一覧を表示',
    download: 'PNGで保存',
    print: '印刷',
    puzzleLabel: '{size}×{size}マスのワードサーチ。',
    listTitle: '探す言葉（{count}語）',
    placed: '{placed}/{total}語を配置しました。',
    unplaced:
      '配置できなかった言葉: {words}。マス数を増やすか、言葉の数や長さを減らしてください。',
    ignored:
      '{count}語は2文字未満、または上限（{max}語）を超えたため除外しました。',
    empty: '探す言葉を入力してください（1行に1語、2文字以上）。',
    downloaded: 'PNG画像を保存しました。',
    notesHeading: '注意事項',
    notes: [
      'パズルの作成・答えの計算・画像の生成はすべて端末のブラウザ上で行い、入力した言葉がサーバーに送信されることはありません。',
      '言葉は1行に1語で入力します（カンマ・読点区切りも使えます）。空白は取り除かれ、英字は大文字に統一されます。2文字未満の語と、51語目以降は除外されます。',
      'マス数は8〜25です。マス数より長い言葉は置けません。言葉が多いのにマス数が小さいと、置ききれない言葉が出ます（作成後のメッセージに表示されます）。',
      'ひらがな・カタカナ・英字の言葉なら、空いたマスは同じ文字種の文字で埋めます。漢字などを含む場合は、入力した言葉に使われている文字で埋めます。',
      '空きマスを埋めた結果、言葉と同じ並びが別の場所にできたときは、できるだけ埋め直して避けますが、言葉どうしが交差して偶然できる並びまでは避けられない場合があります。',
      '「パズルを作る」を押すたびに別の配置になり、同じパズルを後から再現することはできません。必要なパズルはPNG保存か印刷で残してください。',
      '濁点・半濁点つきの文字や小さな文字（ゃ・っ など）も、それぞれ1文字として1マスを使います。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ワードサーチ（言葉探し）',
        description:
          '文字を敷き詰めたマス目の中から、指定された言葉を探し出すパズルです。言葉は縦・横・斜めに一直線に並んでおり、見つけた言葉を線で囲んだり丸をつけたりして遊びます。',
      },
      {
        term: '逆向き配置',
        description:
          '言葉が右から左、下から上のように、読む向きと反対に並ぶことです。見つけにくくなるため、「むずかしい」だけで使います。',
      },
      {
        term: 'フィラー（埋め草）',
        description:
          '言葉を置いた後、残りのマスを埋める文字のことです。言葉と同じ文字種の文字をランダムに選んでいます。',
      },
    ],
  },
  en: {
    title: 'Word Search Maker – Printable Puzzles from Your Words',
    description:
      'Make a word search from your own words. Pick grid size and difficulty, show the answer key, save a PNG or print it. Runs in your browser; nothing is uploaded.',
    h1: 'Word Search Generator – Make a Puzzle from Your Own Words',
    introHtml:
      'Type the words to hide, one per line, and press “Generate puzzle”. The tool hides them in a grid of letters and gives you a word search you can print or save as a PNG, with an answer key on request. Good for classroom worksheets, party handouts and kids’ activities. For another printable activity, try <a href="/en/tools/maze-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">the Maze Generator</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Enter the words to hide in "Words to find", one per line (at least 2 letters, up to 50 words).',
      'Choose the "Grid size" and "Difficulty", then press "Generate puzzle".',
      'Tick "Show answer" to highlight where each word is hidden.',
      'Use "Save as PNG" to download an image or "Print" to print it. Whatever is shown, including the answer highlights if they are on, is what gets saved or printed.',
    ],
    wordsLabel: 'Words to find (one per line)',
    wordsPlaceholder: 'CAT\nDOG\nRABBIT',
    defaultWords: 'CAT\nDOG\nRABBIT\nFISH\nBEAR\nBIRD\nTURTLE\nFOX',
    sizeLabel: 'Grid size (square)',
    sizeHint: 'Choose from {min} to {max} cells.',
    difficultyLabel: 'Difficulty',
    difficultyEasy: 'Easy',
    difficultyNormal: 'Normal',
    difficultyHard: 'Hard',
    difficultyHintEasy:
      'Easy: words run only left to right or top to bottom, which is easiest to spot.',
    difficultyHintNormal:
      'Normal: words also run diagonally (down-right and up-right) in addition to across and down.',
    difficultyHintHard:
      'Hard: words run in all 8 directions, including backwards (right to left, bottom to top, and the reverse diagonals).',
    generate: 'Generate puzzle',
    showAnswer: 'Show answer',
    showWordList: 'Show the word list',
    download: 'Save as PNG',
    print: 'Print',
    puzzleLabel: 'A {size} by {size} word search puzzle.',
    listTitle: 'Words to find ({count})',
    placed: '{placed} of {total} words placed.',
    unplaced:
      'Could not place: {words}. Increase the grid size or use fewer or shorter words.',
    ignored:
      '{count} word(s) were skipped because they are shorter than 2 letters or beyond the {max}-word limit.',
    empty: 'Enter at least one word of 2 or more letters, one per line.',
    downloaded: 'The PNG image has been saved.',
    notesHeading: 'Notes',
    notes: [
      'Generating the puzzle, computing the answer and creating the image all happen in your browser. The words you type are never sent to a server.',
      'Enter one word per line (commas also work as separators). Spaces are removed and letters are converted to upper case. Words shorter than 2 letters and everything past the 50th word are skipped.',
      'The grid can be 8 to 25 cells. A word longer than the grid cannot be placed, and a small grid with many words may leave some out; those are named in the message shown after generation.',
      'For words in Latin letters, hiragana or katakana, the empty cells are filled with letters of the same kind. Otherwise (for example kanji) they are filled with characters taken from your words.',
      'The filler is re-rolled to avoid creating an extra copy of a word elsewhere, but a copy that happens to be formed by overlapping words may still occur.',
      'Every press of "Generate puzzle" makes a different layout and the same puzzle cannot be recreated later, so save it as a PNG or print it if you want to keep it.',
      'Accented letters and other characters each use one cell.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Word search',
        description:
          'A puzzle in which you find listed words hidden in a grid of letters. Each word runs in a straight line (across, down or diagonally), and solvers circle or highlight each one they find.',
      },
      {
        term: 'Backwards placement',
        description:
          'A word written against the reading direction, such as right to left or bottom to top. It is harder to spot, so it is used only on Hard.',
      },
      {
        term: 'Filler letters',
        description:
          'The random letters that fill the cells left over after the words are placed. They are chosen from the same kind of characters as your words.',
      },
    ],
  },
};
