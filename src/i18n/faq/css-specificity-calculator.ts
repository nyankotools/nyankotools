import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'CSSの詳細度(a, b, c)はどう数えますか？',
      answer:
        'aはIDセレクタ、bはクラス・属性セレクタ・疑似クラス、cは要素セレクタと疑似要素の数です。左の桁から順に比べ、桁の繰り上がりはありません。例えば #a は (1,0,0)、ul li.red は (0,1,2) です。',
    },
    {
      question: ':is()・:not()・:has()・:where()の詳細度はどうなりますか？',
      answer:
        ':is()・:not()・:has()は引数に並べたセレクタのうち最も大きい詳細度になります。:where()は引数に何を書いても0です。例えば :is(#a, .b) は (1,0,0)、:where(#a) は (0,0,0) です。',
    },
    {
      question: '同じ詳細度のセレクタが複数あるときはどちらが勝ちますか？',
      answer:
        '詳細度が同じ場合は、CSSの中で後に書かれたルールが勝ちます。このツールでも入力の下の行を後に書かれたものとして扱い、同点なら下の行を勝ちにしています。',
    },
    {
      question: 'インラインstyleや!importantは計算されますか？',
      answer:
        'いいえ。インラインstyleはセレクタの詳細度より上位、!importantは詳細度とは別の段階で比較されるため、このツールの計算対象外です。注意事項に概要を載せています。',
    },
    {
      question: '「不正なセレクタ」と表示されるのはどんなときですか？',
      answer:
        '括弧・属性セレクタ・引用符が閉じていない、#や.の後に名前がない、結合子（> + ~）の前後が空、波括弧など使えない文字を含む、といった場合です。該当する行だけにエラーを表示し、他の行は計算します。',
    },
  ],
  en: [
    {
      question: 'How is CSS specificity (a, b, c) counted?',
      answer:
        'a counts ID selectors, b counts classes, attribute selectors and pseudo-classes, and c counts type selectors and pseudo-elements. Columns are compared from the left with no carry-over. For example, #a is (1,0,0) and ul li.red is (0,1,2).',
    },
    {
      question:
        'What is the specificity of :is(), :not(), :has() and :where()?',
      answer:
        ':is(), :not() and :has() take the highest specificity among their arguments. :where() is always 0 no matter what is inside. For example, :is(#a, .b) is (1,0,0) while :where(#a) is (0,0,0).',
    },
    {
      question: 'Which selector wins when specificity is equal?',
      answer:
        'The rule written later in the CSS wins. This tool treats lower lines as written later, so on a tie the lowest of the tied lines is marked as the winner.',
    },
    {
      question: 'Are inline styles and !important included?',
      answer:
        'No. Inline styles outrank selector specificity and !important is compared in a separate step, so neither is part of the calculation. The notes explain how they fit in.',
    },
    {
      question: 'When does a line show an invalid selector error?',
      answer:
        'When a bracket, attribute selector or quote is not closed, a # or . has no name, a combinator (> + ~) has nothing beside it, or the line contains characters such as braces. Only that line shows an error; the other lines are still calculated.',
    },
  ],
};
