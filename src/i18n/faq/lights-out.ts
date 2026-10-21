import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ライツアウトの配置は必ず解けますか？',
      answer:
        'はい。すべて消灯した盤面からランダムにマスを押して配置を作っているので、同じマスを逆に押していけば必ず消灯できます。完成済みの配置が出ることもありません。',
    },
    {
      question: 'ヒントはどうやって最短手順を求めていますか？',
      answer:
        '「マスを押す／押さない」を0と1で表した連立方程式を、GF(2)（排他的論理和の世界）でガウスの消去法により解いています。4×4や5×5のように解が複数ある盤面では、押すマスの数が最も少ない解を選びます。',
    },
    {
      question: '同じマスを2回押すとどうなりますか？',
      answer:
        '元に戻ります。1回押すと反転し、2回押すともう一度反転するためです。最短手順では同じマスを2回押すことはなく、押す順番も結果に影響しません。',
    },
    {
      question: '盤面サイズによって難しさは変わりますか？',
      answer:
        '変わります。3×3は短い手数で終わりますが、5×5以上は押すマスの組み合わせが多くなります。4×4と5×5は解が複数あることがあり、押さないマスが残る最短手順もあります。',
    },
  ],
  en: [
    {
      question: 'Is every Lights Out board solvable?',
      answer:
        'Yes. Boards are made by pressing random cells on an all-off board, so pressing the same cells again always turns every light off. A board that is already solved is never dealt.',
    },
    {
      question: 'How does the hint find a shortest solution?',
      answer:
        'It writes "press or not" for each cell as 0 or 1 and solves the resulting equations over GF(2) (XOR arithmetic) with Gaussian elimination. When a board has several solutions, as 4×4 and 5×5 can, it picks the one with the fewest presses.',
    },
    {
      question: 'What happens if I press the same cell twice?',
      answer:
        'The board returns to how it was, because each press flips the same lights again. A shortest solution never presses a cell twice, and the order of presses does not change the result.',
    },
    {
      question: 'Does the board size change the difficulty?',
      answer:
        'Yes. 3×3 is quick, while 5×5 and larger have many more combinations of cells to press. 4×4 and 5×5 can have more than one solution, so some shortest solutions leave certain cells unpressed.',
    },
  ],
};
