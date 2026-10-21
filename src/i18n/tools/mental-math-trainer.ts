import type { Locale } from '../../data/tools';

export interface MentalMathTrainerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  opsLabel: string;
  opAdd: string;
  opSub: string;
  opMul: string;
  opDiv: string;
  digitsALabel: string;
  digitsBLabel: string;
  countLabel: string;
  limitLabel: string;
  /** {n} を数に置換する */
  countOption: string;
  limitNone: string;
  /** {n} を秒数に置換する */
  limitOption: string;
  /** {n} を桁数に置換する */
  digitsOption: string;
  startButton: string;
  answerLabel: string;
  answerButton: string;
  quitButton: string;
  retryButton: string;
  backButton: string;
  /** {n} {total} を置換する */
  progress: string;
  timeLabel: string;
  correctLabel: string;
  problemLabel: string;
  noLimitShort: string;
  /** フィードバック */
  feedbackCorrect: string;
  /** {answer} を置換する */
  feedbackWrong: string;
  feedbackInvalid: string;
  resultHeading: string;
  rankLabel: string;
  scoreLabel: string;
  accuracyLabel: string;
  timeResultLabel: string;
  avgLabel: string;
  bestLabel: string;
  noBest: string;
  /** {correct} {total} {time} を置換する */
  bestValue: string;
  newBest: string;
  /** {n} を置換する */
  scoreValue: string;
  avgValue: string;
  timeUp: string;
  finished: string;
  quit: string;
  started: string;
  errorOps: string;
  rankComments: Record<'S' | 'A' | 'B' | 'C' | 'D', string>;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const mentalMathTrainerContent: Record<
  Locale,
  MentalMathTrainerPageContent
> = {
  ja: {
    title: '暗算トレーニング｜足し算・引き算・かけ算・わり算の無料ゲーム',
    description:
      '足し算・引き算・かけ算・わり算を桁数・問題数・制限時間を選んで解く暗算トレーニング。結果はランク判定され、設定ごとのベスト記録も保存。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '暗算トレーニング｜桁数・演算・制限時間を選んで解く計算ゲーム',
    introHtml:
      '出題される計算を頭の中で解き、答えを入力していく暗算の練習ツールです。演算（＋−×÷）と桁数、問題数、制限時間を選ぶと、最後に正解率でランク（S〜D）を判定します。ひき算の答えは負にならず、わり算は割り切れる問題だけが出ます。紙で解きたいときは <a href="/tools/math-drill-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">計算ドリル作成</a>で印刷用のプリントも作れます。',
    howToHeading: '使い方',
    howToSteps: [
      '「演算」「1つ目の桁数」「2つ目の桁数」「問題数」「制限時間」を選びます。',
      '「スタート」を押すと問題が表示されます。',
      '答えを入力して「回答」を押す（Enterキーでも可）と、次の問題に進みます。',
      '全問解くか制限時間になると、ランクと正解率、ベスト記録が表示されます。「もう一度」で同じ設定で再挑戦できます。',
    ],
    opsLabel: '演算',
    opAdd: '＋ たし算',
    opSub: '− ひき算',
    opMul: '× かけ算',
    opDiv: '÷ わり算',
    digitsALabel: '1つ目の桁数',
    digitsBLabel: '2つ目の桁数',
    countLabel: '問題数',
    limitLabel: '制限時間',
    countOption: '{n}問',
    limitNone: 'なし',
    limitOption: '{n}秒',
    digitsOption: '{n}桁',
    startButton: 'スタート',
    answerLabel: '答え',
    answerButton: '回答',
    quitButton: 'やめる',
    retryButton: 'もう一度',
    backButton: '設定に戻る',
    progress: '{n} / {total} 問',
    timeLabel: '残り時間',
    correctLabel: '正解',
    problemLabel: '問題',
    noLimitShort: '制限なし',
    feedbackCorrect: '正解！',
    feedbackWrong: '不正解（答えは {answer}）',
    feedbackInvalid: '数字で入力してください。',
    resultHeading: '結果',
    rankLabel: 'ランク',
    scoreLabel: '正解数',
    accuracyLabel: '正解率',
    timeResultLabel: '所要時間',
    avgLabel: '1問あたり',
    bestLabel: 'この設定のベスト',
    noBest: 'まだ記録がありません',
    bestValue: '{correct} / {total} 問・{time}',
    newBest: 'ベスト記録を更新しました！',
    scoreValue: '{correct} / {total} 問',
    avgValue: '{n} 秒',
    timeUp: '時間切れです。',
    finished: '全問終了です。',
    quit: '途中でやめました。',
    started: '開始しました。',
    errorOps: '演算を1つ以上選んでください。',
    rankComments: {
      S: 'お見事！素晴らしい成績です。',
      A: 'とても良い成績です。',
      B: '安定しています。もう一息です。',
      C: 'まずまずです。桁数を落として慣れるのも手です。',
      D: 'これから伸びます。簡単な設定から繰り返しましょう。',
    },
    notesHeading: '注意事項',
    notes: [
      '問題と答えはブラウザ内で作成・判定され、サーバーには何も送信されません。',
      'ランクは出題数に対する正解率で決まります（95%以上でS、85%以上でA、70%以上でB、50%以上でC、それ未満はD）。未回答の問題は不正解として数えます。',
      '1つ目の桁数は、たし算・ひき算・かけ算では1つ目の数、わり算ではわられる数の桁数です。わり算のわる数は2以上で、わられる数以下の桁数になります。',
      'ベスト記録は演算・桁数・問題数・制限時間の組み合わせごとに、正解数が多い順（同じなら時間が短い順）で、このブラウザのローカルストレージに保存されます。ブラウザのデータを消去したり別の端末を使ったりすると引き継がれません。',
      '制限時間を選ぶと、時間が来た時点で解いた分だけが採点されます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '暗算',
        description:
          '筆算や電卓を使わず、頭の中だけで計算することです。桁数を増やすほど、繰り上がりや繰り下がりを覚えておく力が必要になります。',
      },
    ],
  },
  en: {
    title: 'Mental Math Trainer – Free Arithmetic Practice Game',
    description:
      'Practice mental math with addition, subtraction, multiplication and division. Choose digits, question count and time limit, get a rank and your best score.',
    h1: 'Mental Math Trainer – Practice Arithmetic With Rank and Best Score',
    introHtml:
      'Solve arithmetic in your head and type the answers. Pick the operations (+ − × ÷), the number of digits, how many questions and an optional time limit, and you get a rank from S to D at the end. Subtraction never goes below zero and division always comes out even. Prefer paper? Make a printable worksheet with the <a href="/en/tools/math-drill-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Math Drill Generator</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose the "Operations", "First number digits", "Second number digits", "Questions" and "Time limit".',
      'Press "Start" and the first question appears.',
      'Type your answer and press "Answer" (or the Enter key) to move on to the next question.',
      'When you finish all questions or time runs out, you see your rank, accuracy and best score. Press "Try again" to retry with the same settings.',
    ],
    opsLabel: 'Operations',
    opAdd: '+ Addition',
    opSub: '− Subtraction',
    opMul: '× Multiplication',
    opDiv: '÷ Division',
    digitsALabel: 'First number digits',
    digitsBLabel: 'Second number digits',
    countLabel: 'Questions',
    limitLabel: 'Time limit',
    countOption: '{n}',
    limitNone: 'None',
    limitOption: '{n} s',
    digitsOption: '{n}',
    startButton: 'Start',
    answerLabel: 'Your answer',
    answerButton: 'Answer',
    quitButton: 'Quit',
    retryButton: 'Try again',
    backButton: 'Back to settings',
    progress: 'Question {n} of {total}',
    timeLabel: 'Time left',
    correctLabel: 'Correct',
    problemLabel: 'Question',
    noLimitShort: 'No limit',
    feedbackCorrect: 'Correct!',
    feedbackWrong: 'Wrong (answer: {answer})',
    feedbackInvalid: 'Please enter a number.',
    resultHeading: 'Result',
    rankLabel: 'Rank',
    scoreLabel: 'Correct answers',
    accuracyLabel: 'Accuracy',
    timeResultLabel: 'Time taken',
    avgLabel: 'Per question',
    bestLabel: 'Best for these settings',
    noBest: 'No record yet',
    bestValue: '{correct} of {total} in {time}',
    newBest: 'New best record!',
    scoreValue: '{correct} of {total}',
    avgValue: '{n} s',
    timeUp: 'Time is up.',
    finished: 'All questions done.',
    quit: 'You quit the round.',
    started: 'Started.',
    errorOps: 'Select at least one operation.',
    rankComments: {
      S: 'Excellent work!',
      A: 'A very good result.',
      B: 'Solid. Just a little more.',
      C: 'Decent. Try fewer digits to build speed.',
      D: 'Keep going. Start with easier settings and repeat.',
    },
    notesHeading: 'Notes',
    notes: [
      'Questions are generated and checked in your browser. Nothing is sent to a server.',
      'The rank is based on accuracy over all questions: 95% or more is S, 85% A, 70% B, 50% C, and anything lower is D. Unanswered questions count as wrong.',
      'For addition, subtraction and multiplication the first digits setting is the first number; for division it is the dividend. The divisor is at least 2 and never has more digits than the dividend.',
      'Best records are kept per combination of operations, digits, question count and time limit, ranked by correct answers and then by shorter time. They live in this browser’s local storage and are not carried over if you clear site data or switch devices.',
      'With a time limit, only the questions you solved before time ran out are scored.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Mental math',
        description:
          'Calculating in your head without paper or a calculator. More digits mean more carrying and borrowing to keep in mind.',
      },
    ],
  },
};
