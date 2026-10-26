import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ペグソリティアのルールは？',
      answer:
        '駒は縦または横に隣り合う駒を飛び越え、その先の空き穴に着地できます。飛び越えられた駒は盤から取り除かれます。斜めには動けません。最後に残る駒をできるだけ少なくするのが目的です。',
    },
    {
      question: '英国式と欧州式の違いは？',
      answer:
        '英国式は十字形の33穴、欧州式は四隅を1穴ずつ足して角を丸めた37穴です。どちらも中央だけを空けて開始します。欧州式は穴が多く、中央から始めて中央に1個だけ残す解は存在しません（総当たりで確認済み）。',
    },
    {
      question: '「完全クリア」と「クリア」の違いは？',
      answer:
        '英国式では、残りが1個でその駒が盤の中央にあれば完全クリアです。中央以外なら「クリア」として扱います。欧州式は中央に残す解が存在しないため、1個まで減らせば完全クリアです。2個以上残って動かせなくなった場合は、残数に応じた評価が表示されます。',
    },
    {
      question: '間違えたときは戻せますか？',
      answer:
        '「1手戻す」で直前の手から順に、何手でもさかのぼれます。戻した手数に応じて残数も元に戻ります。最初からやり直すなら「リセット」を使ってください。',
    },
    {
      question: 'キーボードでも操作できますか？',
      answer:
        'できます。盤面の各穴はボタンなので、Tabキーで移動してEnterまたはスペースで駒の選択と移動ができます。選べる駒・移動先は色と読み上げ用のラベルで区別されます。',
    },
  ],
  en: [
    {
      question: 'What are the rules of peg solitaire?',
      answer:
        'A peg jumps over an adjacent peg, up, down, left or right, and lands in the empty hole just beyond it. The peg that was jumped is removed. Diagonal jumps are not allowed. The goal is to finish with as few pegs as possible.',
    },
    {
      question:
        'What is the difference between the English and European boards?',
      answer:
        'The English board is a cross with 33 holes. The European board adds one hole at each corner of the cross for 37 holes. Both start with only the center empty, and on the European board it is impossible to end with a single peg in the center (confirmed by exhaustive search).',
    },
    {
      question: 'What counts as a perfect finish?',
      answer:
        'On the English board, one peg left in the center hole is a perfect finish, and one peg anywhere else counts as solved. The European board has no solution that ends in the center, so any single peg is a perfect finish there. If two or more pegs remain and nothing can jump, you get a rank based on how many are left.',
    },
    {
      question: 'Can I undo a mistake?',
      answer:
        'Yes. "Undo" takes back your latest jump, and you can keep pressing it to go back as far as the start. The captured pegs come back too. Use "Reset" to start over from the beginning.',
    },
    {
      question: 'Can I play with the keyboard?',
      answer:
        'Yes. Every hole is a button, so you can Tab to it and press Enter or Space to select a peg and jump. Selectable pegs and valid targets are marked by color and by screen reader labels.',
    },
  ],
};
