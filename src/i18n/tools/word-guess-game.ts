import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface WordGuessGamePageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  boardLabel: string;
  /** {n} {letter} {state} を置換する、升目1つの読み上げ用 */
  tileLabel: string;
  tileEmpty: string;
  stateCorrect: string;
  statePresent: string;
  stateAbsent: string;
  keyboardLabel: string;
  enterKey: string;
  backspaceKey: string;
  newGame: string;
  giveUp: string;
  copyResult: string;
  copied: string;
  copyFailed: string;
  attemptsLabel: string;
  /** {n} {max} を置換して表示する */
  attemptsValue: string;
  /** ゲーム開始時の案内 */
  started: string;
  /** {n} を置換して表示する（n は使った回数） */
  won: string;
  /** {word} を置換して表示する */
  lost: string;
  /** {word} を置換して表示する */
  gaveUp: string;
  errorLength: string;
  errorChars: string;
  errorUnknown: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const wordGuessGameContent: Record<Locale, WordGuessGamePageContent> = {
  ja: {
    title: '英単語5文字当てゲーム｜6回で当てる無料ブラウザゲーム',
    description:
      '6回以内に5文字の英単語を当てる言葉ゲーム。文字の位置と有無を色で教えてくれるので、推理しながら英語の語彙も鍛えられます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '英単語5文字当てゲーム｜6回で隠れた単語を推理する',
    introHtml:
      '隠れた5文字の英単語を、6回以内に当てるゲームです。単語を入力するたびに、1文字ずつ、位置も合っていれば緑、単語に含まれるが位置が違えば黄、含まれなければ灰の色で教えてくれます。ヒントを手がかりに候補を絞り込みましょう。文字を1つずつ当てる <a href="/tools/hangman/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ハングマン</a> や、数字で推理する <a href="/tools/hit-and-blow/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">数当てゲーム</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '画面のキーまたはキーボードで、5文字の英単語を入力します。',
      '「Enter」で送信すると、1文字ずつ色がつきます。緑は位置も正解、黄は単語に含まれるが位置が違う、灰は含まれない文字です。',
      '色のヒントをもとに、6回までに答えを当てましょう。画面下のキーにも判定結果が反映されます。',
      '分からなくなったら「ギブアップ」で答えを見られます。「新しいゲーム」で次の単語に進み、終了後は「結果をコピー」で結果を貼り付けられます。',
    ],
    boardLabel: '推測の盤面',
    tileLabel: '{n}回目 {letter} {state}',
    tileEmpty: '空',
    stateCorrect: '位置も正解',
    statePresent: '位置が違う',
    stateAbsent: '含まれない',
    keyboardLabel: 'キーボード',
    enterKey: 'Enter',
    backspaceKey: '削除',
    newGame: '新しいゲーム',
    giveUp: 'ギブアップ',
    copyResult: '結果をコピー',
    copied: '結果をコピーしました。',
    copyFailed: 'コピーできませんでした。',
    attemptsLabel: '回数',
    attemptsValue: '{n} / {max}',
    started: '新しい単語です。5文字の英単語を入力して Enter を押してください。',
    won: '正解です！{n}回で当たりました。',
    lost: 'ゲームオーバー。答えは {word} でした。',
    gaveUp: 'ギブアップしました。答えは {word} でした。',
    errorLength: '5文字の英単語を入力してください。',
    errorChars: 'アルファベット（a〜z）だけで入力してください。',
    errorUnknown:
      'この単語は内蔵リストにありません。別の単語を試してください。',
    notesHeading: '注意事項',
    notes: [
      '答えは、このページに内蔵した手書きの単語リスト（出題用の約1,200語）から選ばれます。回答として受け付けるのはそれに加えた約2,900語で、リストにない単語はエラーになります（回数には数えません）。通信は行わず、サーバーには何も送信されません。',
      '同じ文字を重ねた単語は、答えに含まれる個数の分だけ黄色や緑になります。たとえば答えに E が1つしかなければ、EE を含む推測でも色がつく E は1つだけです。',
      '大文字・小文字は区別せず、全角で入力した文字も使えます。ページを再読み込みすると新しい単語になり、途中経過は保存されません。',
      '直前の答えは続けて出ないようにしています。結果のコピーは、色を絵文字にした升目のみで、答えの文字は含まれません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '5文字当てゲーム',
        description:
          '隠れた5文字の単語を、色のヒントを頼りに限られた回数で当てる言葉ゲームです。位置と文字の有無の両方から候補を絞り込みます。',
      },
    ],
  },
  en: {
    title: '5-Letter Word Guessing Game – Free Online, 6 Tries',
    description:
      'Guess the hidden five-letter English word in six tries. Colored tiles show which letters fit. Runs in your browser and nothing is sent to a server.',
    h1: '5-Letter Word Guessing Game – Find the Hidden Word in 6 Tries',
    introHtml:
      'Guess the hidden five-letter English word in six tries. After each guess every tile turns green (right letter, right spot), yellow (in the word, wrong spot) or gray (not in the word). Use the clues to narrow down the possibilities. For other word and logic games, try <a href="/en/tools/hangman/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Hangman</a> or <a href="/en/tools/hit-and-blow/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Hit and Blow</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Type a five-letter English word with the on-screen keys or your keyboard.',
      'Press "Enter" to submit. Each tile gets a color: green means the right spot, yellow means it is in the word but in another spot, and gray means it is not in the word.',
      'Use the clues to find the answer within six tries. The keys at the bottom show what you have learned about each letter.',
      'Press "Give up" to reveal the answer, or "New game" for another word. When the game ends, "Copy result" copies your colored grid.',
    ],
    boardLabel: 'Guess board',
    tileLabel: 'Guess {n}: {letter} {state}',
    tileEmpty: 'empty',
    stateCorrect: 'correct spot',
    statePresent: 'wrong spot',
    stateAbsent: 'not in the word',
    keyboardLabel: 'Keyboard',
    enterKey: 'Enter',
    backspaceKey: 'Delete',
    newGame: 'New game',
    giveUp: 'Give up',
    copyResult: 'Copy result',
    copied: 'Result copied.',
    copyFailed: 'Could not copy.',
    attemptsLabel: 'Tries',
    attemptsValue: '{n} / {max}',
    started: 'A new word is ready. Type five letters and press Enter.',
    won: 'You got it! Tries used: {n}.',
    lost: 'Game over. The word was {word}.',
    gaveUp: 'You gave up. The word was {word}.',
    errorLength: 'Enter a five-letter word.',
    errorChars: 'Use letters from a to z only.',
    errorUnknown: 'That word is not in the built-in list. Try another one.',
    notesHeading: 'Notes',
    notes: [
      'The answer comes from a built-in, hand-written list of about 1,200 words. About 2,900 words in total are accepted as guesses, and a word outside the list shows an error without using up a try. Nothing is fetched or sent to a server.',
      'Repeated letters are colored only as many times as they appear in the answer. If the answer has one E, a guess with two Es colors just one of them.',
      'Upper and lower case are treated the same, and full-width letters are accepted too. Reloading the page starts a new word, and progress is not saved.',
      'The word you just played is not repeated right away. "Copy result" copies only a grid of colored emoji and never the letters of the answer.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: '5-letter word game',
        description:
          'A word game where you find a hidden five-letter word in a limited number of tries, using color clues about each letter and its position.',
      },
    ],
  },
};
