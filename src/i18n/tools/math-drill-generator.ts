import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface MathDrillGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  opsLabel: string;
  opAdd: string;
  opSub: string;
  opMul: string;
  opDiv: string;
  digitsALabel: string;
  digitsBLabel: string;
  countLabel: string;
  columnsLabel: string;
  layoutLabel: string;
  layoutHorizontal: string;
  layoutVertical: string;
  paperLabel: string;
  paperA4: string;
  paperB5: string;
  paperLetter: string;
  seedLabel: string;
  regenerateButton: string;
  allowNegativeLabel: string;
  headerLabel: string;
  titleLabel: string;
  modeLabel: string;
  modeProblems: string;
  modeAnswers: string;
  printButton: string;

  /** プリント上の文言 */
  defaultTitle: string;
  answerSuffix: string;
  nameLabel: string;
  dateLabel: string;
  scoreLabel: string;
  /** {count} {pages} を置き換える */
  summary: string;
  /** {min} {max} を置き換える */
  errorOps: string;
  errorDigits: string;
  errorCount: string;
  errorSeed: string;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const mathDrillGeneratorContent: Record<
  Locale,
  MathDrillGeneratorPageContent
> = {
  ja: {
    title: '計算ドリル作成（たし算・ひき算・かけ算・わり算・印刷用）',
    description:
      'たし算・ひき算・かけ算・わり算の計算ドリルを、桁数・問題数・筆算か横書きかを指定して作成できます。答えシートも別に印刷可能。シード指定で同じ問題を再現できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '計算ドリル作成（答え付き・印刷用）',
    introHtml:
      'たし算・ひき算・かけ算・わり算を選び、桁数と問題数を決めるだけで、印刷用の計算プリントを作ります。横書きと筆算の形式に対応し、同じ問題の「答え」シートも別に印刷できます。ブラウザ内で作成され、設定がサーバーに送信されることはありません。マス目の紙が必要なときは <a href="/tools/graph-paper-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">方眼紙・罫線・原稿用紙の作成</a> もご利用ください。',

    opsLabel: '計算の種類',
    opAdd: 'たし算',
    opSub: 'ひき算',
    opMul: 'かけ算',
    opDiv: 'わり算',
    digitsALabel: '1つ目の数の桁数',
    digitsBLabel: '2つ目の数の桁数',
    countLabel: '問題数',
    columnsLabel: '列数',
    layoutLabel: '式の形',
    layoutHorizontal: '横書き（12 + 34 =）',
    layoutVertical: '筆算',
    paperLabel: '用紙サイズ',
    paperA4: 'A4',
    paperB5: 'B5',
    paperLetter: 'レター（Letter）',
    seedLabel: 'シード（同じ値なら同じ問題）',
    regenerateButton: '問題を作り直す',
    allowNegativeLabel: 'ひき算の答えが負になってもよい',
    headerLabel: '題名・名前欄をつける',
    titleLabel: '題名',
    modeLabel: '表示・印刷する内容',
    modeProblems: '問題',
    modeAnswers: '答え',
    printButton: '印刷する',

    defaultTitle: '計算ドリル',
    answerSuffix: '（答え）',
    nameLabel: 'なまえ',
    dateLabel: 'ひづけ',
    scoreLabel: 'てん',
    summary: '{count}問 / {pages}ページ',
    errorOps: '計算の種類を1つ以上選んでください',
    errorDigits: '桁数は{min}〜{max}の整数で入力してください',
    errorCount: '問題数は{min}〜{max}の整数で入力してください',
    errorSeed: 'シードは{min}〜{max}の整数で入力してください',

    howToHeading: '使い方',
    howToSteps: [
      '「計算の種類」を選び、「1つ目の数の桁数」「2つ目の数の桁数」「問題数」を指定します。',
      '「式の形」（横書き・筆算）、「列数」、「用紙サイズ」を選びます。気に入らなければ「問題を作り直す」を押します。',
      '「表示・印刷する内容」を「問題」にして「印刷する」を押し、続けて「答え」に切り替えて印刷すると、答えシートができます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '印刷ダイアログでは、倍率を100%（実際のサイズ）にし、ページに合わせる・用紙に合わせて縮小はオフにしてください。',
      'わり算は割り切れる問題だけを作ります。1つ目の数がわられる数、2つ目の数がわる数です（わる数は2以上で、わられる数以下の桁数になります）。',
      'ひき算は、初期設定では答えが負にならないよう大きいほうの数を先に置きます。そのため、1つ目の数が2つ目の数より小さい設定でも、数が入れ替わることがあります。',
      '桁数が小さく組み合わせが少ない設定では、同じ問題が重なることがあります。',
      '「答え」シートは、「問題」シートと同じ「シード」・設定から作った同じ問題の答えです。設定を変えると問題も変わるので、答えを印刷するまで設定は変えないでください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '筆算',
        description:
          '数を位ごとにそろえて縦に書いて計算する方法です。桁数が増えたときの繰り上がり・繰り下がりを間違えにくく、学校でも使われます。',
      },
      {
        term: 'シード',
        description:
          '乱数の出発点となる数値です。同じシードと同じ設定なら、いつでもまったく同じ問題が作られるので、問題用紙と答えシートを別々のタイミングで印刷できます。',
      },
    ],
  },
  en: {
    title: 'Math Drill Generator: Printable Worksheets with Answers',
    description:
      'Make printable math drill worksheets for addition, subtraction, multiplication and division, with an answer sheet. Runs in your browser.',
    h1: 'Printable Math Drill Generator with Answer Sheet',
    introHtml:
      'Pick addition, subtraction, multiplication or division, set the number of digits and problems, and get a printable practice sheet. Choose side-by-side or vertical (column) format, and print a matching answer sheet separately. Everything is generated in your browser, and your settings are never sent to a server. Need blank squared paper instead? Try the <a href="/en/tools/graph-paper-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Graph Paper Generator</a>.',

    opsLabel: 'Operations',
    opAdd: 'Addition',
    opSub: 'Subtraction',
    opMul: 'Multiplication',
    opDiv: 'Division',
    digitsALabel: 'Digits in first number',
    digitsBLabel: 'Digits in second number',
    countLabel: 'Number of problems',
    columnsLabel: 'Columns',
    layoutLabel: 'Format',
    layoutHorizontal: 'Side by side (12 + 34 =)',
    layoutVertical: 'Vertical (column)',
    paperLabel: 'Paper size',
    paperA4: 'A4',
    paperB5: 'B5',
    paperLetter: 'US Letter',
    seedLabel: 'Seed (same value, same problems)',
    regenerateButton: 'Shuffle problems',
    allowNegativeLabel: 'Allow negative subtraction results',
    headerLabel: 'Add title and name line',
    titleLabel: 'Title',
    modeLabel: 'Show and print',
    modeProblems: 'Problems',
    modeAnswers: 'Answers',
    printButton: 'Print',

    defaultTitle: 'Math Drill',
    answerSuffix: ' (Answers)',
    nameLabel: 'Name',
    dateLabel: 'Date',
    scoreLabel: 'Score',
    summary: 'Problems: {count} / Pages: {pages}',
    errorOps: 'Select at least one operation.',
    errorDigits: 'Digits must be a whole number from {min} to {max}.',
    errorCount: 'Problems must be a whole number from {min} to {max}.',
    errorSeed: 'Seed must be a whole number from {min} to {max}.',

    howToHeading: 'How to use',
    howToSteps: [
      'Choose the "Operations", then set "Digits in first number", "Digits in second number" and "Number of problems".',
      'Pick a "Format" (side by side or vertical), the "Columns" and the "Paper size". Press "Shuffle problems" for a different set.',
      'With "Show and print" set to "Problems", press "Print". Then switch it to "Answers" and print again to get the answer sheet.',
    ],
    notesHeading: 'Notes',
    notes: [
      'In the print dialog, set the scale to 100% (actual size) and turn off fit to page or shrink to fit.',
      'Division only uses problems that divide evenly. The first number is the dividend and the second is the divisor (at least 2, and never longer than the dividend).',
      'By default, subtraction puts the larger number first so the result is never negative. If the first number has fewer digits than the second, the two numbers may be swapped.',
      'With few digits there are only so many combinations, so the same problem can appear more than once.',
      'The "Answers" sheet is built from the same "Seed" and settings as the "Problems" sheet. Changing any setting changes the problems, so keep them unchanged until the answers are printed.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Vertical (column) format',
        description:
          'Writing the numbers one above the other, lined up by place value, and working column by column. It makes carrying and borrowing easier to follow with larger numbers.',
      },
      {
        term: 'Seed',
        description:
          'The starting number of the random generator. The same seed with the same settings always produces the same problems, so you can print the problems and the answers at different times.',
      },
    ],
  },
};
