import type { Locale } from '../../data/tools';
import type { ScaleId } from '../../lib/tools/gpa-calculator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface GpaCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  scaleLabel: string;
  scaleNames: Record<ScaleId, string>;
  scaleNotes: Record<ScaleId, string>;
  coursesHeading: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  creditsLabel: string;
  creditsPlaceholder: string;
  gradeLabel: string;
  gradeUnselected: string;
  rowLabel: string;
  removeRow: string;
  addRow: string;
  clearAll: string;
  maxRowsNotice: string;
  resultHeading: string;
  gpaLabel: string;
  totalCreditsLabel: string;
  earnedCreditsLabel: string;
  gradePointsLabel: string;
  countedLabel: string;
  emptyResult: string;
  ungradedNotice: string;
  invalidNotice: string;
  copy: string;
  copied: string;
  copyFailed: string;
  tableHeading: string;
  tableGradeHeading: string;
  tablePointHeading: string;
  tableEarnedHeading: string;
  earnedYes: string;
  earnedNo: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const gpaCalculatorContent: Record<Locale, GpaCalculatorPageContent> = {
  ja: {
    title: 'GPA計算ツール｜4.0・4.3・日本の大学の成績評価に対応',
    description:
      '科目ごとの単位数と評価（S・A・B・C・D、A+〜F）を入力するだけでGPAを計算する無料ツールです。日本の大学の4段階、4.0・4.3スケールを切り替え可能。合計・取得単位も表示。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'GPA計算ツール（4.0・4.3・日本の大学）',
    introHtml:
      '科目ごとの単位数と評価を入力すると、単位数で重みづけしたGPA（グレード・ポイント・アベレージ）を計算します。日本の大学でよく使われるS・A・B・C・Dの4段階と、海外の4.0・4.3スケールを切り替えられます。成績は端末の外に送信されず、保存もされません。平均や標準偏差などの集計は <a href="/tools/statistics-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">偏差値・平均・標準偏差計算機</a> をご利用ください。',
    scaleLabel: 'スケール',
    scaleNames: {
      'jp-4': '日本の大学（S・A・B・C・D、4.0満点）',
      'us-4': '4.0スケール（A〜F）',
      'us-4-plus': '4.0スケール（A+〜F、＋－あり）',
      'us-43': '4.3スケール（A+ = 4.3）',
    },
    scaleNotes: {
      'jp-4':
        'S（秀）4.0・A（優）3.0・B（良）2.0・C（可）1.0・D（不可）0 の4段階の例です。大学によって S を 4.5 とするなど異なります。',
      'us-4':
        'A = 4.0・B = 3.0・C = 2.0・D = 1.0・F = 0 の最も単純な4.0スケールです。＋－は区別しません。',
      'us-4-plus':
        '＋－ありの4.0スケールです。A+ と A はどちらも 4.0、A- = 3.7、B+ = 3.3 のように 0.3 〜 0.4 刻みで下がります。',
      'us-43':
        'A+ = 4.3 とする4.3スケールです。A = 4.0 以下は4.0スケール（＋－あり）と同じです。',
    },
    coursesHeading: '科目',
    subjectLabel: '科目名（任意）',
    subjectPlaceholder: '例: 経済学入門',
    creditsLabel: '単位数',
    creditsPlaceholder: '例: 2',
    gradeLabel: '評価',
    gradeUnselected: '未選択',
    rowLabel: '科目 {n}',
    removeRow: '削除',
    addRow: '科目を追加',
    clearAll: 'すべてクリア',
    maxRowsNotice: '科目は最大 {max} 件までです。',
    resultHeading: '結果',
    gpaLabel: 'GPA',
    totalCreditsLabel: 'GPA算入単位数',
    earnedCreditsLabel: '取得単位数',
    gradePointsLabel: '単位×ポイントの合計',
    countedLabel: '算入した科目数',
    emptyResult: '単位数と評価を入力すると、ここにGPAが表示されます。',
    ungradedNotice:
      '評価が未選択（または現在のスケールにない評価）の {count} 科目（{credits} 単位）は、GPAの計算から除外しています。',
    invalidNotice:
      '単位数が読めない {count} 科目は除外しています。0〜999 の数値を入力してください。',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    tableHeading: '評価とグレードポイントの対応表',
    tableGradeHeading: '評価',
    tablePointHeading: 'ポイント',
    tableEarnedHeading: '単位',
    earnedYes: '取得できる',
    earnedNo: '取得できない',
    howToHeading: '使い方',
    howToSteps: [
      '「スケール」で、通っている大学や国に近い評価尺度を選びます。',
      '科目ごとに「単位数」を入力し、「評価」を選びます。科目が足りないときは「科目を追加」を押します。',
      '下の「結果」にGPA・GPA算入単位数・取得単位数が表示されます。「コピー」で結果をまとめてコピーできます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '評価とグレードポイントの対応は、大学・学部・国によって異なります。表示している尺度はあくまで代表的な例です。正式なGPAは、所属する大学の規程と成績証明書で確認してください。',
      'F・不可などの単位が取得できない科目も、GPAの分母（算入単位数）には含めます。再履修したときの扱い（初回の成績を残すか、置き換えるか）も大学によって違うため、必要に応じて科目を調整してください。',
      '単位数が 0 の行と、何も入力していない行は計算に含めません。評価が未選択の行も、GPAの計算からは除外します（結果の下に件数を表示します）。',
      '合格・不合格のみの科目（P/NP など）や、評価がつかない科目は、評価を未選択のままにするか、行を削除してください。',
      'GPAは単位数で重みづけした平均で、小数点以下第3位を四捨五入して第2位まで表示します。',
      '入力した成績はこのブラウザ内でのみ処理され、サーバーには送信されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'GPA（グレード・ポイント・アベレージ）',
        description:
          '各科目の評価をグレードポイント（例: A = 3.0）に置き換え、単位数で重みづけして平均した値です。計算式は 「Σ（単位数 × グレードポイント）÷ Σ 単位数」です。奨学金・留学・大学院入試の成績基準に使われます。',
      },
      {
        term: 'グレードポイント',
        description:
          '評価（S・A・B など）に対応づけられた点数のことです。4.0満点の大学が多いものの、4.3や4.5満点、＋－を区別する大学もあります。',
      },
      {
        term: '算入単位と取得単位',
        description:
          '算入単位はGPAの分母になる単位数で、不可・F の科目も含みます。取得単位は卒業に数えられる単位数で、不可・F の科目は含みません。',
      },
    ],
  },
  en: {
    title: 'GPA Calculator – 4.0, 4.3 and Japanese University Scales',
    description:
      'Calculate your GPA from course credits and letter grades. Switch between 4.0, 4.3 and Japanese university scales. Runs in your browser only.',
    h1: 'GPA Calculator (4.0 / 4.3 / Japanese University Scale)',
    introHtml:
      'Enter the credits and grade for each course to get your credit-weighted GPA. Switch between a 4.0 scale, a 4.0 scale with plus and minus grades, a 4.3 scale, and the S/A/B/C/D grades used by many Japanese universities. Nothing you enter leaves your device or is stored. For averages and standard deviations of other data, try the <a href="/en/tools/statistics-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Statistics Calculator</a>.',
    scaleLabel: 'Scale',
    scaleNames: {
      'jp-4': 'Japanese university (S, A, B, C, D; 4.0 max)',
      'us-4': '4.0 scale (A to F)',
      'us-4-plus': '4.0 scale with plus/minus (A+ to F)',
      'us-43': '4.3 scale (A+ = 4.3)',
    },
    scaleNotes: {
      'jp-4':
        'An example four-step scale: S 4.0, A 3.0, B 2.0, C 1.0, D (fail) 0. Some universities use different values, such as S = 4.5.',
      'us-4':
        'The simplest 4.0 scale: A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0. Plus and minus grades are not distinguished.',
      'us-4-plus':
        'A 4.0 scale with plus and minus grades. A+ and A are both 4.0, then A- = 3.7, B+ = 3.3 and so on in steps of 0.3 to 0.4.',
      'us-43':
        'A 4.3 scale where A+ = 4.3. From A = 4.0 downward it matches the 4.0 scale with plus/minus grades.',
    },
    coursesHeading: 'Courses',
    subjectLabel: 'Course name (optional)',
    subjectPlaceholder: 'e.g. Intro to Economics',
    creditsLabel: 'Credits',
    creditsPlaceholder: 'e.g. 3',
    gradeLabel: 'Grade',
    gradeUnselected: 'Not selected',
    rowLabel: 'Course {n}',
    removeRow: 'Remove',
    addRow: 'Add course',
    clearAll: 'Clear all',
    maxRowsNotice: 'You can add up to {max} courses.',
    resultHeading: 'Result',
    gpaLabel: 'GPA',
    totalCreditsLabel: 'Graded credits',
    earnedCreditsLabel: 'Earned credits',
    gradePointsLabel: 'Total grade points',
    countedLabel: 'Courses counted',
    emptyResult: 'Enter credits and grades to see your GPA here.',
    ungradedNotice:
      '{count} course(s) ({credits} credits) have no grade, or a grade that is not on the current scale, and are left out of the GPA.',
    invalidNotice:
      '{count} course(s) with unreadable credits are left out. Enter a number from 0 to 999.',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    tableHeading: 'Grade-to-point table',
    tableGradeHeading: 'Grade',
    tablePointHeading: 'Points',
    tableEarnedHeading: 'Credits',
    earnedYes: 'Earned',
    earnedNo: 'Not earned',
    howToHeading: 'How to use',
    howToSteps: [
      'Pick the grading scale closest to your school under "Scale".',
      'For each course, enter its "Credits" and choose a "Grade". Press "Add course" if you need more rows.',
      'The GPA, graded credits and earned credits appear under "Result". Use "Copy" to copy them together.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The mapping from grades to points differs between schools, departments and countries. The scales shown are common examples only. Check your institution’s rules and official transcript for the real figure.',
      'Courses you failed (F or fail) still count in the GPA denominator (graded credits), even though they earn no credits. How retaken courses are handled also varies, so adjust the rows if needed.',
      'Rows with 0 credits and rows with nothing entered are ignored. Rows with no grade selected are also left out of the GPA; the count is shown under the result.',
      'For pass/fail courses (such as P/NP) or courses without a grade, leave the grade unselected or remove the row.',
      'GPA is the credit-weighted average, rounded to two decimal places.',
      'Everything you type is processed in this browser only and is never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'GPA (grade point average)',
        description:
          'Each course grade is converted to grade points (for example A = 3.0), weighted by credits, and averaged: sum of (credits × grade points) divided by sum of credits. It is used in scholarship, study-abroad and graduate admission criteria.',
      },
      {
        term: 'Grade points',
        description:
          'The numeric value attached to a grade such as S, A or B. Many schools use a 4.0 maximum, but 4.3 and 4.5 maximums and plus/minus grades also exist.',
      },
      {
        term: 'Graded credits vs. earned credits',
        description:
          'Graded credits form the denominator of the GPA and include failed courses. Earned credits count toward graduation and exclude failed courses.',
      },
    ],
  },
};
