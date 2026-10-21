import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface HitAndBlowPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  digitsLabel: string;
  /** {n} を桁数に置換して表示する */
  digitsOption: string;
  repeatLabel: string;
  guessLabel: string;
  guessButton: string;
  newGame: string;
  giveUp: string;
  /** {digits} を置換して表示する */
  guessHint: string;
  errorEmpty: string;
  errorNonDigit: string;
  /** {digits} を置換して表示する */
  errorLength: string;
  errorRepeat: string;
  /** {digits} {rule} を置換して表示する */
  started: string;
  ruleNoRepeat: string;
  ruleRepeat: string;
  /** {n} を置換して表示する */
  won: string;
  /** {answer} を置換して表示する */
  gaveUp: string;
  /** {n} {total} を置換して表示する（回数と、組み合わせの総数） */
  progress: string;
  historyHeading: string;
  historyEmpty: string;
  colNumber: string;
  colGuess: string;
  colHit: string;
  colBlow: string;
  answerLabel: string;
  answerHidden: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const hitAndBlowContent: Record<Locale, HitAndBlowPageContent> = {
  ja: {
    title:
      '数当てゲーム（Hit & Blow）｜桁数・重複あり/なしを選べる無料ブラウザゲーム',
    description:
      '隠された3〜5桁の数字を、Hit（位置も数字も一致）とBlow（数字のみ一致）のヒントから推理する数当てゲーム。数字の重複あり／なしを選べ、推測履歴の確認とギブアップに対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '数当てゲーム（Hit & Blow）｜Hit と Blow のヒントで隠れた数字を当てる',
    introHtml:
      'コンピューターが決めた数字を、推測の結果に出る Hit（数字も位置も一致）と Blow（数字は合っているが位置が違う）のヒントから当てるゲームです。桁数は3〜5桁、数字の重複ありとなしを選べます。何回で当てられるか挑戦してみてください。ほかのゲームでは <a href="/tools/minesweeper/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">マインスイーパー</a> や <a href="/tools/sudoku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">数独</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '桁数（3〜5）と、同じ数字を使うかどうか「数字の重複を許可」を選びます。設定を変えると新しいゲームが始まります。',
      '「予想する数字」に桁数ぶんの数字を入力して「推測する」を押します。Hit と Blow の数が履歴に表示されます。',
      'Hit は数字も位置も合っている桁の数、Blow は数字は合っているが位置が違う桁の数です。履歴を手がかりに絞り込みます。',
      'すべての桁が Hit になればクリアです。分からなくなったら「ギブアップ」で答えを見られ、「新しいゲーム」でやり直せます。',
    ],
    digitsLabel: '桁数',
    digitsOption: '{n}桁',
    repeatLabel: '数字の重複を許可',
    guessLabel: '予想する数字',
    guessButton: '推測する',
    newGame: '新しいゲーム',
    giveUp: 'ギブアップ',
    guessHint: '{digits}桁の数字を入力します（先頭が0でもかまいません）。',
    errorEmpty: '数字を入力してください。',
    errorNonDigit: '0〜9の数字だけを入力してください。',
    errorLength: '{digits}桁の数字を入力してください。',
    errorRepeat: 'この設定では同じ数字を2回使えません。',
    started: '新しいゲームを始めました（{digits}桁・{rule}）。',
    ruleNoRepeat: '重複なし',
    ruleRepeat: '重複あり',
    won: '正解です！{n}回で当てました。',
    gaveUp: 'ギブアップしました。答えは {answer} でした。',
    progress: '{n}回目まで終了（答えの候補は全 {total} 通り）',
    historyHeading: '推測の履歴',
    historyEmpty: 'まだ推測していません。',
    colNumber: '回',
    colGuess: '予想',
    colHit: 'Hit',
    colBlow: 'Blow',
    answerLabel: '答え',
    answerHidden: '?',
    notesHeading: '注意事項',
    notes: [
      '答えはページを開いた端末の中で乱数から作られ、サーバーには何も送信されません。ページを再読み込みすると新しいゲームになります。',
      '重複なしの場合、答えには0〜9の異なる数字だけが使われます。重複ありの場合は、同じ数字が何度出てくることもあります。',
      '重複ありのときの Blow は、同じ数字を二重に数えないように判定します。たとえば答えが1123で予想が1111なら、Hit は2、Blow は0です。',
      '答えの先頭は0になることもあります（0123 など）。0から始まる数字もそのまま入力してください。全角の数字も入力できます。',
      '桁数が多いほど、また重複を許可するほど答えの候補は増えて難しくなります。履歴は画面上の表で確認でき、ゲームの途中経過は保存されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Hit（ヒット）',
        description:
          '予想した数字のうち、答えと数字も位置も一致している桁の数です。桁数と同じ数になれば正解です。',
      },
      {
        term: 'Blow（ブロー）',
        description:
          '予想した数字のうち、答えに含まれているが位置が違う桁の数です。同じ数字は答えに含まれる個数までしか数えません。',
      },
    ],
  },
  en: {
    title: 'Hit and Blow Number Guessing Game – Free Online',
    description:
      'Play Hit and Blow in your browser: guess a hidden 3–5 digit number from Hit and Blow clues, with or without repeated digits. Nothing is sent to a server.',
    h1: 'Hit and Blow – Guess the Hidden Number from Hit and Blow Clues',
    introHtml:
      'The computer picks a secret number and you have to find it. After each guess you get a Hit count (right digit in the right place) and a Blow count (right digit in the wrong place). Choose 3 to 5 digits, with or without repeated digits, and see how few guesses you need. For other games, try <a href="/en/tools/minesweeper/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Minesweeper</a> or <a href="/en/tools/sudoku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Sudoku</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose the number of digits (3 to 5) and whether to turn on "Allow repeated digits". Changing a setting starts a new game.',
      'Type a number into "Your guess" and press "Guess". The Hit and Blow counts appear in the history.',
      'A Hit is a digit that is correct and in the right position; a Blow is a digit that is in the secret number but in a different position. Use the history to narrow things down.',
      'You win when every digit is a Hit. If you get stuck, press "Give up" to see the answer, or "New game" to start over.',
    ],
    digitsLabel: 'Digits',
    digitsOption: '{n} digits',
    repeatLabel: 'Allow repeated digits',
    guessLabel: 'Your guess',
    guessButton: 'Guess',
    newGame: 'New game',
    giveUp: 'Give up',
    guessHint: 'Enter {digits} digits. A leading 0 is allowed.',
    errorEmpty: 'Enter a number.',
    errorNonDigit: 'Use only the digits 0 to 9.',
    errorLength: 'Enter exactly {digits} digits.',
    errorRepeat: 'Repeated digits are not allowed with the current setting.',
    started: 'A new game has started ({digits} digits, {rule}).',
    ruleNoRepeat: 'no repeats',
    ruleRepeat: 'repeats allowed',
    won: 'Correct! You found it in {n} guesses.',
    gaveUp: 'You gave up. The answer was {answer}.',
    progress: '{n} guesses so far ({total} possible answers in total)',
    historyHeading: 'Guess history',
    historyEmpty: 'No guesses yet.',
    colNumber: '#',
    colGuess: 'Guess',
    colHit: 'Hit',
    colBlow: 'Blow',
    answerLabel: 'Answer',
    answerHidden: '?',
    notesHeading: 'Notes',
    notes: [
      'The secret number is generated randomly in your browser and nothing is sent to a server. Reloading the page starts a new game.',
      'Without repeats, the secret uses ten different digits (0 to 9) at most once each. With repeats, the same digit can appear several times.',
      'With repeats on, Blows are counted so that the same digit is never counted twice. For example, if the answer is 1123 and you guess 1111, you get 2 Hits and 0 Blows.',
      'The secret number can start with 0 (for example 0123). Enter leading zeros as they are. Full-width digits are accepted too.',
      'More digits, or allowing repeats, means more possible answers and a harder game. The history table shows all your guesses; progress is not saved between visits.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Hit',
        description:
          'The number of digits in your guess that are correct and in the right position. When it equals the number of digits, you have won.',
      },
      {
        term: 'Blow',
        description:
          'The number of digits in your guess that appear in the secret number but in a different position. A digit is never counted more times than it occurs in the answer.',
      },
    ],
  },
};
