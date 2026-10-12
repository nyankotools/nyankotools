import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CrosswordGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  wordsLabel: string;
  wordsPlaceholder: string;
  /** 初期表示で入れておく「答え:ヒント」（改行区切り）。共通の文字が多く、毎回全語が配置できる組み合わせにする */
  defaultWords: string;
  generate: string;
  showAnswer: string;
  download: string;
  print: string;
  /** canvas の代替テキスト。{width} {height} を置換する */
  puzzleLabel: string;
  acrossTitle: string;
  downTitle: string;
  /** ヒントの後ろに付ける文字数表記。{n} を置換する */
  clueLength: string;
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

export const crosswordGeneratorContent: Record<
  Locale,
  CrosswordGeneratorPageContent
> = {
  ja: {
    title:
      'クロスワード作成｜答えとヒントを入れるだけで自動配置・印刷とPNG保存に対応',
    description:
      '答えの言葉とヒントを入力するだけで、クロスワードパズルを自動で作成する無料ツールです。言葉を文字で交差させて配置し、タテ・ヨコのカギと番号を付けます。答え表示・PNG保存・印刷に対応。授業やイベントの教材に使えます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'クロスワード作成｜答えとヒントから自動でパズルを作る',
    introHtml:
      '「答え:ヒント」の形で1行に1問ずつ入力して「パズルを作る」を押すと、言葉どうしを文字で交差させたクロスワードを自動で作成します。タテのカギ・ヨコのカギと番号付きのヒント一覧も一緒に出力され、答えの表示、PNG画像での保存、印刷に対応しています。ヒントなしで言葉を隠すだけなら <a href="/tools/word-search-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ワードサーチ作成</a> もあります。',
    howToHeading: '使い方',
    howToSteps: [
      '「答えとヒント」に、「答え:ヒント」の形で1行に1問ずつ入力します（答えは2〜20文字、最大30語）。',
      '「パズルを作る」を押すと、言葉を交差させた盤面とカギの一覧が表示されます。',
      '「答えを表示」にチェックを入れると、各マスに答えの文字が入ります。',
      '「PNGで保存」で画像として保存するか、「印刷」で印刷します。答えを表示した状態で保存・印刷すると答え付きになります。',
    ],
    wordsLabel: '答えとヒント（1行に1問、「答え:ヒント」の形）',
    wordsPlaceholder: 'ねこ:ニャーと鳴くペット\nいぬ:ワンと鳴くペット',
    defaultWords: [
      'らくご:着物姿で座布団に座り、一人で話す日本の伝統芸',
      'だいこん:おでんに入っている白い野菜',
      'ごりら:胸をたたく、森にすむ大きなサル',
      'くじら:海にすむ、世界最大の哺乳類',
      'めだか:小川や田んぼにいる小さな淡水魚',
      'らんく:順位や等級のこと',
    ].join('\n'),
    generate: 'パズルを作る',
    showAnswer: '答えを表示',
    download: 'PNGで保存',
    print: '印刷',
    puzzleLabel: '縦{height}マス・横{width}マスのクロスワード。',
    acrossTitle: 'ヨコのカギ',
    downTitle: 'タテのカギ',
    clueLength: '（{n}文字）',
    placed: '{placed}/{total}語を配置しました。',
    unplaced:
      '他の言葉と同じ文字を共有できず、配置できなかった言葉: {words}。同じ文字を含む言葉を増やすか、言葉を入れ替えてください。',
    ignored:
      '{count}語は2〜20文字の範囲外、または上限（{max}語）を超えたため除外しました。',
    empty: '「答え:ヒント」を入力してください（1行に1問、答えは2文字以上）。',
    downloaded: 'PNG画像を保存しました。',
    notesHeading: '注意事項',
    notes: [
      'パズルの作成・答えの計算・画像の生成はすべて端末のブラウザ上で行い、入力した言葉やヒントがサーバーに送信されることはありません。',
      '入力は1行に1問で、答えとヒントは、最初に現れるコロン（:）・カンマ（,）・読点（、）・タブのいずれかで区切ります。ヒントは省略でき、100文字までです。空白は取り除かれ、英字は大文字に統一されます。',
      '答えは2〜20文字、語数は30語までです。範囲外の語と31語目以降は除外されます。',
      '言葉は同じ文字を共有する場所で交差させて並べます。他のどの言葉とも文字を共有できない言葉は配置できず、作成後のメッセージに表示されます。',
      '「パズルを作る」を押すたびに別の配置になり、同じパズルを後から再現することはできません。必要なパズルはPNG保存か印刷で残してください。',
      '濁点・半濁点つきの文字や小さな文字（ゃ・っ など）も、それぞれ1文字として1マスを使います。伸ばす音「ー」もマスを使います。',
      '同じ答えを2回入力したときは、最初のヒントだけが使われます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'クロスワード',
        description:
          'ヒントをもとに言葉を考え、タテ・ヨコに文字を交差させながら盤面を埋めていくパズルです。交差するマスの文字は、タテの言葉とヨコの言葉の両方に共通します。',
      },
      {
        term: 'カギ',
        description:
          'クロスワードで言葉を答えるためのヒントのことです。盤面の番号と対応しており、ヨコ方向のものを「ヨコのカギ」、タテ方向のものを「タテのカギ」と呼びます。',
      },
      {
        term: '交差',
        description:
          'タテの言葉とヨコの言葉が、1つのマスを共有して重なることです。クロスワードでは、すべての言葉が他の言葉と交差してつながるように並べます。',
      },
    ],
  },
  en: {
    title: 'Crossword Maker – Printable Crosswords from Your Own Clues',
    description:
      'Make a crossword from your own answers and clues. Numbered Across and Down clues, answer key, PNG and print. Runs in your browser; nothing is uploaded.',
    h1: 'Crossword Generator – Make a Crossword from Your Own Words and Clues',
    introHtml:
      'Enter one “answer:clue” pair per line and press “Generate puzzle”. The tool interlocks your words into a crossword grid and lists numbered Across and Down clues, with an answer key on request and PNG or print output. Great for classroom worksheets, quizzes and party games. If you only want to hide words without clues, try <a href="/en/tools/word-search-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">the Word Search Generator</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Enter one "answer:clue" pair per line in "Answers and clues" (answers of 2 to 20 letters, up to 30 words).',
      'Press "Generate puzzle" to see the interlocked grid and the list of clues.',
      'Tick "Show answer" to fill in the letters of every answer.',
      'Use "Save as PNG" to download an image or "Print" to print it. Whatever is shown, including the answers if they are on, is what gets saved or printed.',
    ],
    wordsLabel: 'Answers and clues (one per line, as "answer:clue")',
    wordsPlaceholder: 'CAT:A pet that meows\nDOG:A pet that barks',
    defaultWords: [
      'EARTH:The planet we live on',
      'SHEEP:A woolly farm animal that says baa',
      'BIKE:Two wheels and pedals',
      'TREE:It has a trunk, branches and leaves',
      'SHIP:A large boat that crosses the sea',
      'BIRD:It has feathers and can fly',
    ].join('\n'),
    generate: 'Generate puzzle',
    showAnswer: 'Show answer',
    download: 'Save as PNG',
    print: 'Print',
    puzzleLabel: 'A crossword puzzle, {width} cells wide and {height} tall.',
    acrossTitle: 'Across',
    downTitle: 'Down',
    clueLength: ' ({n})',
    placed: '{placed} of {total} words placed.',
    unplaced:
      'Could not place (no letter in common with the other words): {words}. Add words that share letters, or replace them.',
    ignored:
      '{count} word(s) were skipped because they are not 2 to 20 letters long or are beyond the {max}-word limit.',
    empty:
      'Enter at least one "answer:clue" line (answers need 2 or more letters).',
    downloaded: 'The PNG image has been saved.',
    notesHeading: 'Notes',
    notes: [
      'Generating the puzzle, computing the answers and creating the image all happen in your browser. Your words and clues are never sent to a server.',
      'Enter one entry per line. The answer and the clue are separated at the first colon, comma or tab. The clue is optional and is limited to 100 characters. Spaces are removed from answers and letters are converted to upper case.',
      'Answers must be 2 to 20 letters and there can be up to 30 of them. Anything outside that range and everything past the 30th word is skipped.',
      'Words are interlocked where they share a letter. A word that has no letter in common with any other word cannot be placed; it is named in the message shown after generation.',
      'Every press of "Generate puzzle" makes a different layout and the same puzzle cannot be recreated later, so save it as a PNG or print it if you want to keep it.',
      'Accented letters and other characters each use one cell.',
      'If the same answer is entered twice, only the first clue is used.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Crossword',
        description:
          'A puzzle in which you work out words from clues and write them across and down so that they interlock. A cell where two words cross holds one letter shared by both.',
      },
      {
        term: 'Across / Down clues',
        description:
          'The numbered hints that tell you what to write. An Across clue refers to a word that reads left to right, a Down clue to a word that reads top to bottom, starting at the numbered cell.',
      },
      {
        term: 'Interlocking',
        description:
          'Two words sharing one cell where an across word and a down word cross. A crossword generator places every word so that it crosses at least one other word.',
      },
    ],
  },
};
