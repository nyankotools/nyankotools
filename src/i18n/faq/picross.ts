import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '出題される問題は、本当に解が1通りですか？',
      answer:
        'はい。問題を作るたびに、行と列のヒントを満たす絵の数を数え上げて、ちょうど1つであることを確認してから出題しています。そのため、当てずっぽうに頼らず論理だけで解けます。',
    },
    {
      question: '数字の読み方を教えてください',
      answer:
        '数字は、その行（列）に黒マスが何個ずつ連続しているかを、上（左）から順に表します。たとえば「2 1」は、黒が2個続いたかたまりと1個のかたまりがこの順にあり、間に白が1マス以上あることを意味します。「0」はその行（列）に黒がないことを表します。',
    },
    {
      question: '自分で作った問題の解が複数あると言われました',
      answer:
        '絵によっては、同じヒントになる別の絵が存在することがあります（たとえば斜めに並んだ2マスなど）。その場合も遊べますが、答えが元の絵と違う形で完成することがあります。マスを足したり消したりすると、1通りになることが多いです。',
    },
    {
      question: '画像を読み込むと真っ黒や真っ白になってしまいます',
      answer:
        '画像は選んだ盤面の大きさに縮小し、暗い部分を黒マスにします。写真など全体が暗い・明るい画像は、ほぼ全面が同じ色になることがあります。背景が白く、黒い図形がはっきりしたロゴやイラストで試してみてください。',
    },
    {
      question: '15×15 で問題が表示されるまで時間がかかることはありますか？',
      answer:
        '解が1通りの絵になるまで、内部で絵の作成と判定を繰り返しています。多くの場合は一瞬で終わりますが、端末によってはわずかに待つことがあります。',
    },
  ],
  en: [
    {
      question: 'Do the puzzles really have exactly one solution?',
      answer:
        'Yes. Before a puzzle is shown, the tool counts the pictures that satisfy the row and column clues and confirms there is exactly one. You can therefore solve it by logic alone, with no guessing.',
    },
    {
      question: 'How do I read the numbers?',
      answer:
        'Each number is the length of an unbroken run of black squares in that row or column, listed from top (or left). For example "2 1" means a run of two black squares and then a run of one, with at least one white square between them. "0" means the line has no black squares.',
    },
    {
      question: 'My own puzzle says it has more than one solution. Why?',
      answer:
        'Some pictures share their clues with a different picture (two squares placed diagonally, for instance). You can still play it, but it may be completed with a picture different from the one you drew. Adding or removing a few squares usually makes the solution unique.',
    },
    {
      question: 'My image loads as all black or all white. What can I do?',
      answer:
        'The image is shrunk to the chosen board size and dark areas become black squares. A photo that is dark or bright overall can end up nearly one color. Try a logo or illustration with a white background and clear black shapes.',
    },
    {
      question: 'Can a 15×15 puzzle take a while to appear?',
      answer:
        'The tool repeatedly makes and checks pictures until it finds one with a single solution. It is usually instant, but on some devices you may wait briefly.',
    },
  ],
};
