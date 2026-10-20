import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CssSpecificityErrors {
  empty: string;
  unclosedBracket: string;
  unclosedParen: string;
  unclosedString: string;
  unexpectedChar: string;
  emptyName: string;
  danglingCombinator: string;
  unmatchedParen: string;
  emptyAttribute: string;
}

export interface CssSpecificityCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  parentLabel: string;
  parentPlaceholder: string;
  parentErrorTemplate: string;
  resultHeading: string;
  emptyResult: string;
  lineTemplate: string;
  winnerBadge: string;
  winnerSummary: string;
  tieSummary: string;
  errors: CssSpecificityErrors;
  errorDetailTemplate: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cssSpecificityCalculatorContent: Record<
  Locale,
  CssSpecificityCalculatorPageContent
> = {
  ja: {
    title: 'CSS詳細度（specificity）計算機｜セレクタを比較して勝敗を判定',
    description:
      '複数のCSSセレクタを1行ずつ入力して詳細度(a, b, c)を計算し、どれが優先されるかを判定する無料ツールです。:is()・:where()・:not()・:has()や疑似要素、ネストの&にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSS詳細度（specificity）計算機',
    introHtml:
      'CSSセレクタの詳細度を(a, b, c)の形で計算し、複数のセレクタを比べてどのルールが勝つかを調べます。1行に1つずつセレクタを入力してください。同じ詳細度なら後に書いた方が優先されます。正規表現の調査には<a href="/tools/regex-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">正規表現テスター</a>もご利用ください。',
    inputLabel: 'セレクタ（1行に1つ）',
    inputPlaceholder:
      '例:\n#nav .item a:hover\nul li.active > a\n:where(.card) p',
    sampleText:
      '#nav .item a:hover\nul li.active > a\n:is(#main, .box) p::first-line\n:where(.card) p\na:not(.disabled, #x)\ninput[type="text"]:focus',
    parentLabel: '親セレクタ（&用・任意）',
    parentPlaceholder: '例: .card',
    parentErrorTemplate: '親セレクタが不正です: {message}',
    resultHeading: '結果',
    emptyResult: 'セレクタを入力すると詳細度が表示されます',
    lineTemplate: '{line}行目',
    winnerBadge: '勝ち',
    winnerSummary: '{line}行目のセレクタ {spec} が最も優先されます。',
    tieSummary:
      '{line}行目のセレクタ {spec} が最も優先されます（同じ詳細度のセレクタが複数あるため、後に書かれたものが勝ちます）。',
    errors: {
      empty: 'セレクタが空です（カンマの前後や括弧の中を確認してください）',
      unclosedBracket: '属性セレクタの ] が閉じていません',
      unclosedParen: '括弧 ) が閉じていません',
      unclosedString: '引用符が閉じていません',
      unexpectedChar: 'セレクタに使えない文字があります',
      emptyName: '#・.・: の後に名前がありません',
      danglingCombinator: '結合子（> + ~）の前後にセレクタがありません',
      unmatchedParen: '対応する開き括弧がありません',
      emptyAttribute: '属性セレクタ [ ] の中が空です',
    },
    errorDetailTemplate: '{message}（{char}）',
    copyButton: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    howToHeading: '使い方',
    howToSteps: [
      '比べたいセレクタを1行に1つずつ入力します（サンプルを挿入して試せます）。',
      '各行の詳細度(a, b, c)と、一番優先されるセレクタが表示されます。',
      'CSSネストの&を使うときは、親セレクタを入力すると&が親の詳細度として計算されます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '詳細度は(a, b, c)で表し、aはIDセレクタ、bはクラス・属性・疑似クラス、cは要素（タイプ）と疑似要素の数です。左の桁が大きい方が優先され、桁をまたいだ繰り上がりはありません（例: クラス11個でも1個のIDには勝てません）。',
      ':is()・:not()・:has()は引数の中で最も大きい詳細度になり、:where()は常に0です。:nth-child(… of S)は疑似クラス分の1に、Sの最大詳細度を足します。',
      '疑似要素（::before など）は要素と同じcに数えます。ユニバーサルセレクタ(*)と結合子（> + ~ と空白）は0です。',
      'カンマ区切りのセレクタは、それぞれが独立したルールとして扱われますが、このツールでは1行に書かれた場合の最大値を表示します。',
      'インラインstyle属性は(a, b, c)より上位にあたり、どのセレクタにも勝ちます。!importantの付いた宣言は、通常の宣言より優先され、詳細度とは別の段階で比較されます。このツールは詳細度のみを計算し、これらは対象外です。',
      'CSSネストの&は、親セレクタを:is()で包んだものとして計算します。&を含まないネスト内のセレクタには、先頭に暗黙の&が付くものとして親の詳細度を加えます。',
      'カスケードレイヤー（@layer）や読み込み順、継承は考慮しません。実際の優先順位はブラウザの開発者ツールでも確認してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '詳細度（specificity）',
        description:
          '複数のCSSルールが同じ要素に当たったとき、どのルールを適用するかを決める重みです。セレクタの種類ごとに数えた(a, b, c)を左の桁から順に比べます。',
      },
      {
        term: ':where()',
        description:
          ':is()と同じく引数のいずれかに一致する要素を選びますが、詳細度は常に0です。ライブラリの既定スタイルを上書きされやすくしたいときに使われます。',
      },
      {
        term: 'カスケード',
        description:
          '宣言の出どころ・!important・レイヤー・詳細度・記述順を順に比べて、最終的に適用する値を決める仕組みです。詳細度はその一段階にすぎません。',
      },
    ],
  },
  en: {
    title: 'CSS Specificity Calculator | Compare Selectors Online',
    description:
      'Calculate CSS specificity (a, b, c) for many selectors at once and see which rule wins. Handles :is(), :where(), :not(), :has(). Runs in your browser.',
    h1: 'CSS Specificity Calculator and Selector Comparison',
    introHtml:
      'Work out the specificity of CSS selectors as (a, b, c) and compare several at once to see which rule wins. Enter one selector per line. When specificity is equal, the one written last wins. For text patterns, try the <a href="/en/tools/regex-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Regex Tester</a>.',
    inputLabel: 'Selectors (one per line)',
    inputPlaceholder:
      'e.g.\n#nav .item a:hover\nul li.active > a\n:where(.card) p',
    sampleText:
      '#nav .item a:hover\nul li.active > a\n:is(#main, .box) p::first-line\n:where(.card) p\na:not(.disabled, #x)\ninput[type="text"]:focus',
    parentLabel: 'Parent selector (for &, optional)',
    parentPlaceholder: 'e.g. .card',
    parentErrorTemplate: 'The parent selector is invalid: {message}',
    resultHeading: 'Result',
    emptyResult: 'Enter selectors to see their specificity',
    lineTemplate: 'Line {line}',
    winnerBadge: 'Wins',
    winnerSummary: 'The selector on line {line}, {spec}, takes priority.',
    tieSummary:
      'The selector on line {line}, {spec}, takes priority (several selectors share the top specificity, so the one written last wins).',
    errors: {
      empty: 'Empty selector (check around commas and inside parentheses)',
      unclosedBracket: 'The attribute selector is missing its closing ]',
      unclosedParen: 'A closing parenthesis ) is missing',
      unclosedString: 'A quote is not closed',
      unexpectedChar: 'This character is not allowed in a selector',
      emptyName: 'There is no name after #, . or :',
      danglingCombinator:
        'A combinator (> + ~) has no selector on one of its sides',
      unmatchedParen: 'A closing bracket has no matching opening one',
      emptyAttribute: 'The attribute selector [ ] is empty',
    },
    errorDetailTemplate: '{message} ({char})',
    copyButton: 'Copy results',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    howToHeading: 'How to use',
    howToSteps: [
      'Enter the selectors you want to compare, one per line (insert the sample to try it).',
      'Each line shows its specificity (a, b, c), and the winning selector is highlighted.',
      'If you use the nesting selector &, enter a parent selector so & counts as the parent specificity.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Specificity is written (a, b, c): a counts ID selectors, b counts classes, attributes and pseudo-classes, and c counts type selectors and pseudo-elements. Columns are compared from the left and never carry over (eleven classes still lose to one ID).',
      ':is(), :not() and :has() take the highest specificity among their arguments, while :where() is always 0. :nth-child(... of S) adds 1 for the pseudo-class plus the highest specificity in S.',
      'Pseudo-elements such as ::before count in c like type selectors. The universal selector (*) and combinators (> + ~ and whitespace) count as 0.',
      'Comma-separated selectors are really independent rules, but this tool shows the highest value when you put them on one line.',
      'Inline style attributes outrank any (a, b, c) value, and declarations marked !important are compared in a separate step before specificity. This tool only calculates selector specificity and does not model either.',
      'The nesting selector & is calculated as the parent wrapped in :is(). A nested selector without & gets an implicit leading &, so the parent specificity is added.',
      'Cascade layers (@layer), source order and inheritance are not considered. Check the final result in your browser dev tools as well.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Specificity',
        description:
          'A weight that decides which CSS rule applies when several match the same element. It is counted per selector type as (a, b, c) and compared column by column from the left.',
      },
      {
        term: ':where()',
        description:
          'Like :is() it matches any of its arguments, but its specificity is always 0. It is often used so that default styles are easy to override.',
      },
      {
        term: 'Cascade',
        description:
          'The process that decides the final value by comparing origin, !important, layers, specificity and source order in turn. Specificity is only one step of it.',
      },
    ],
  },
};
