import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface HangmanPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  categoryLabel: string;
  categoryAll: string;
  /** カテゴリID -> 表示名 */
  categoryNames: Record<string, string>;
  lettersLabel: string;
  newWord: string;
  giveUp: string;
  missesLabel: string;
  /** {n} {max} を置換して表示する */
  missesValue: string;
  wrongLettersLabel: string;
  wrongLettersNone: string;
  wordLabel: string;
  /** {length} {category} を置換して表示する */
  started: string;
  /** {word} {n} を置換して表示する（n はミスの回数） */
  won: string;
  /** {word} を置換して表示する */
  lost: string;
  /** {word} を置換して表示する */
  gaveUp: string;
  meaningLabel: string;
  /** 画面外の読み上げ用。{letter} を置換して表示する */
  letterHit: string;
  letterMiss: string;
  /** {letter} を置換して表示する */
  letterRepeat: string;
  errorInvalid: string;
  /** 絵の読み上げ用。{n} を置換して表示する */
  figureLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const categoryNamesJa: Record<string, string> = {
  animals: '動物',
  food: '食べ物',
  nature: '自然',
  school: '学校',
  home: '家',
  travel: '旅行',
  jobs: '仕事',
  body: '体',
};

const categoryNamesEn: Record<string, string> = {
  animals: 'Animals',
  food: 'Food',
  nature: 'Nature',
  school: 'School',
  home: 'Home',
  travel: 'Travel',
  jobs: 'Jobs',
  body: 'Body',
};

export const hangmanContent: Record<Locale, HangmanPageContent> = {
  ja: {
    title: 'ハングマン（英単語当てゲーム）｜カテゴリ別・無料ブラウザゲーム',
    description:
      '文字を1つずつ推測して英単語を当てるハングマン。動物・食べ物・自然などカテゴリを選んで出題でき、英語の語彙学習にも使えます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ハングマン｜カテゴリ別に英単語を当てる文字当てゲーム',
    introHtml:
      '伏せられた英単語を、アルファベットを1文字ずつ選んで当てるゲームです。外れが6回になる前に全部の文字を見つけられればクリア。動物・食べ物・旅行などのカテゴリを選べるので、英単語の復習にも向いています。ほかのゲームでは <a href="/tools/hit-and-blow/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">数当てゲーム</a> や <a href="/tools/sudoku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">数独</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '「カテゴリ」で出題する単語のジャンルを選びます。変更すると新しい単語が始まります。',
      '画面のキーまたはキーボードでアルファベットを選びます。単語に含まれていれば、その文字がすべて表示されます。',
      '含まれていない文字を選ぶと絵が1つ進みます。6回外れるとゲームオーバーです。',
      '全部の文字が出ればクリアです。分からなくなったら「ギブアップ」で答えを見られ、「新しい単語」で次の問題に進めます。',
    ],
    categoryLabel: 'カテゴリ',
    categoryAll: 'すべて',
    categoryNames: categoryNamesJa,
    lettersLabel: 'アルファベット',
    newWord: '新しい単語',
    giveUp: 'ギブアップ',
    missesLabel: 'ミス',
    missesValue: '{n} / {max}',
    wrongLettersLabel: '外れた文字',
    wrongLettersNone: 'なし',
    wordLabel: '答えの単語',
    started: '新しい単語です（{length}文字・{category}）。',
    won: '正解です！答えは {word}。ミスは{n}回でした。',
    lost: 'ゲームオーバー。答えは {word} でした。',
    gaveUp: 'ギブアップしました。答えは {word} でした。',
    meaningLabel: '意味',
    letterHit: '{letter} は含まれています。',
    letterMiss: '{letter} は含まれていません。',
    letterRepeat: '{letter} はすでに選んでいます。',
    errorInvalid: 'アルファベット（a〜z）を1文字だけ入力してください。',
    figureLabel: 'ハングマンの絵（ミス {n} 回）',
    notesHeading: '注意事項',
    notes: [
      '出題する単語は、このページに内蔵した短い英単語リスト（8カテゴリ・約240語）からランダムに選ばれます。通信は行わず、サーバーには何も送信されません。',
      '単語は中学〜高校レベルの一般的な名詞が中心です。大文字・小文字は区別せず、全角で入力した文字も使えます。',
      '直前に出た単語は、続けて出ないようにしています。ページを再読み込みすると新しい単語になり、途中経過は保存されません。',
      'ミスの上限は6回です。ヒント機能はありません。日本語ページでは、ゲーム終了後に答えの日本語の意味も表示します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ハングマン',
        description:
          '伏せられた単語の文字を1つずつ推測して当てる言葉遊びです。外れるたびに絵が描き足され、完成する前に単語を当てれば勝ちになります。',
      },
    ],
  },
  en: {
    title: 'Hangman Word Game – Free Online, Pick a Category',
    description:
      'Play Hangman in your browser. Guess the hidden English word one letter at a time and pick a category like animals, food or travel. Nothing is sent to a server.',
    h1: 'Hangman – Guess the Hidden English Word by Category',
    introHtml:
      'Guess the hidden word one letter at a time. Every wrong letter adds a part to the drawing, and you lose after six misses. Pick a category such as animals, food or travel to practice everyday English vocabulary. For other games, try <a href="/en/tools/hit-and-blow/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Hit and Blow</a> or <a href="/en/tools/sudoku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Sudoku</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a word topic in "Category". Changing it starts a new word.',
      'Pick a letter with the on-screen keys or your keyboard. If it is in the word, every copy of it is revealed.',
      'A letter that is not in the word adds a part to the drawing. Six misses and the game is over.',
      'Reveal every letter to win. If you get stuck, press "Give up" to see the answer, or "New word" to move on to the next one.',
    ],
    categoryLabel: 'Category',
    categoryAll: 'All',
    categoryNames: categoryNamesEn,
    lettersLabel: 'Letters',
    newWord: 'New word',
    giveUp: 'Give up',
    missesLabel: 'Misses',
    missesValue: '{n} / {max}',
    wrongLettersLabel: 'Wrong letters',
    wrongLettersNone: 'None',
    wordLabel: 'Hidden word',
    started: 'A new word has started ({length} letters, {category}).',
    won: 'You got it! The word was {word}, with {n} misses.',
    lost: 'Game over. The word was {word}.',
    gaveUp: 'You gave up. The word was {word}.',
    meaningLabel: '',
    letterHit: '{letter} is in the word.',
    letterMiss: '{letter} is not in the word.',
    letterRepeat: 'You already picked {letter}.',
    errorInvalid: 'Enter a single letter from a to z.',
    figureLabel: 'Hangman drawing ({n} misses)',
    notesHeading: 'Notes',
    notes: [
      'Words come from a short built-in list of about 240 everyday English words in 8 categories. Nothing is fetched or sent to a server.',
      'The words are mostly common nouns at a school level. Upper and lower case are treated the same, and full-width letters are accepted too.',
      'The word you just played is not repeated right away. Reloading the page starts a new word, and progress is not saved.',
      'You are allowed six misses. There is no hint button.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Hangman',
        description:
          'A word-guessing game where you pick letters one at a time. Each wrong letter adds a part to a drawing, and you win if you find the word before the drawing is finished.',
      },
    ],
  },
};
