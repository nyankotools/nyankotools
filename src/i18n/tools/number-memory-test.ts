import type { Locale } from '../../data/tools';

export interface NumberMemoryTestPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  levelLabel: string;
  bestLabel: string;
  digitsUnit: string;
  startLabel: string;
  idleText: string;
  memorizeText: string;
  answerLabel: string;
  answerHint: string;
  submitLabel: string;
  correctText: string;
  nextLabel: string;
  gameOverText: string;
  reachedLabel: string;
  correctAnswerLabel: string;
  yourAnswerLabel: string;
  newBestText: string;
  retryLabel: string;
  resetBestLabel: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
}

export const numberMemoryTestContent: Record<
  Locale,
  NumberMemoryTestPageContent
> = {
  ja: {
    title: '数字記憶テスト（桁数が増える短期記憶ゲーム）',
    description:
      '一瞬だけ表示される数字を覚えて入力する、短期記憶の無料テストです。正解するたびに桁数が1つ増え、何桁まで覚えられるかを測れます。ベスト記録も保存。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '数字記憶テスト（何桁まで覚えられる？）',
    introHtml:
      '画面に一瞬だけ表示される数字を覚えて、同じ数字を入力してください。正解すると桁数が1つ増え、間違えると終了です。何桁まで覚えられるかに挑戦しましょう。タイル型の記憶ゲームなら<a href="/tools/memory-match/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">神経衰弱</a>もあります。',
    levelLabel: '現在の桁数',
    bestLabel: 'ベスト',
    digitsUnit: '桁',
    startLabel: 'スタート',
    idleText: '「スタート」を押すと1桁の数字が表示されます',
    memorizeText: '数字を覚えてください',
    answerLabel: '覚えた数字',
    answerHint: '先頭の0も含めて入力してください',
    submitLabel: '答える',
    correctText: '正解です！',
    nextLabel: '次へ',
    gameOverText: '残念、不正解です',
    reachedLabel: '到達桁数',
    correctAnswerLabel: '正解',
    yourAnswerLabel: 'あなたの入力',
    newBestText: 'ベスト記録を更新しました！',
    retryLabel: 'もう一度挑戦',
    resetBestLabel: 'ベスト記録を消す',
    howToHeading: '使い方',
    howToSteps: [
      '「スタート」を押すと、数字が一瞬だけ表示されます。上のバーが消えるまでに覚えます。',
      '数字が消えたら、覚えた数字を入力欄に入れて「答える」を押します（Enterキーでも送信できます）。',
      '正解すると桁数が1つ増えます。間違えるとそこで終了し、到達桁数が表示されます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '桁数が増えるほど、表示時間も長くなります（1桁で1秒、1桁増えるごとに0.4秒延びます）。',
      '先頭が0の数字も出題されます。入力するときも0を省かないでください。',
      '全角数字で入力しても半角として判定します。数字以外の文字は無視されます。',
      'ベスト記録（到達桁数）はこのブラウザのlocalStorageにだけ保存され、サーバーには送信されません。ブラウザのデータを消すと記録も消えます。',
      '数字は毎回ランダムに作られます。簡易的な遊びのテストであり、医学的な診断ではありません。',
    ],
  },
  en: {
    title: 'Number Memory Test – How Many Digits Can You Recall?',
    description:
      'Memorize a number flashed on screen, then type it back. Each correct answer adds a digit. Find out how many digits you can remember. Runs in your browser.',
    h1: 'Number Memory Test (How Many Digits Can You Remember?)',
    introHtml:
      'A number flashes on screen for a moment. Memorize it, then type it back. Every correct answer adds one more digit, and one mistake ends the run. See how far you can get. Prefer cards? Try <a href="/en/tools/memory-match/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Memory Match</a>.',
    levelLabel: 'Current length',
    bestLabel: 'Best',
    digitsUnit: 'digits',
    startLabel: 'Start',
    idleText: 'Press "Start" to see a 1-digit number',
    memorizeText: 'Memorize the number',
    answerLabel: 'The number you remember',
    answerHint: 'Include any leading zeros',
    submitLabel: 'Submit',
    correctText: 'Correct!',
    nextLabel: 'Next',
    gameOverText: 'Not quite',
    reachedLabel: 'Reached',
    correctAnswerLabel: 'Answer',
    yourAnswerLabel: 'You typed',
    newBestText: 'New best!',
    retryLabel: 'Try again',
    resetBestLabel: 'Clear best score',
    howToHeading: 'How to use',
    howToSteps: [
      'Press "Start". A number appears briefly; memorize it before the bar runs out.',
      'When it disappears, type the number and press "Submit" (Enter works too).',
      'A correct answer adds one digit. A wrong answer ends the run and shows how far you got.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Longer numbers stay on screen longer: 1 second for one digit, plus 0.4 seconds for each extra digit.',
      'Numbers can start with 0. Keep leading zeros when you type your answer.',
      'Full-width digits are accepted and treated as normal digits. Other characters are ignored.',
      'Your best score is stored only in this browser (localStorage) and never sent anywhere. Clearing browser data erases it.',
      'Numbers are random every time. This is a casual game, not a medical test.',
    ],
  },
};
