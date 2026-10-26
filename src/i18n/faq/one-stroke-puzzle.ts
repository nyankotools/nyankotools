import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '一筆書きできる図形かどうかは、どう見分けますか？',
      answer:
        '全体がつながっていて、線が奇数本集まる頂点（奇点）が0個または2個なら一筆書きできます（オイラーの定理）。このツールの問題は、この条件を満たすものだけを生成しています。',
    },
    {
      question: '途中で行き止まりになったらどうすればいいですか？',
      answer:
        '「1手戻す」で直前の線を取り消せます。奇点が2個の図形では、始点が奇点でないと完成できないので、「リセット」して別の頂点から始めてみてください。',
    },
    {
      question: 'ヒントはどんな基準で次の一手を決めていますか？',
      answer:
        '進んだ後に残りの線がまだ一筆で通れるかを調べ、通れる手だけを示します。通ると元に戻れなくなる橋は、他に選べる線があるうちは避けます（フルーリーのアルゴリズムの考え方）。',
    },
    {
      question: 'ドラッグしなくても遊べますか？',
      answer:
        'はい。頂点を順番にクリック（タップ）しても進めます。キーボードでは頂点にフォーカスしてEnterまたはSpaceを押します。',
    },
  ],
  en: [
    {
      question: 'How can I tell whether a figure can be drawn in one stroke?',
      answer:
        'It must be connected and have either 0 or 2 odd vertices (vertices where an odd number of lines meet), according to Euler’s theorem. Every puzzle here is generated to meet that condition.',
    },
    {
      question: 'What should I do if I reach a dead end?',
      answer:
        'Use "Undo" to take back the last line. If the figure has 2 odd dots you must start at one of them, so try "Reset" and begin from a different dot.',
    },
    {
      question: 'How does the hint choose the next move?',
      answer:
        'It checks that the remaining lines can still be covered in one stroke after the move, and only suggests such moves. Bridges that would strand you are avoided while another choice exists, in the spirit of Fleury’s algorithm.',
    },
    {
      question: 'Can I play without dragging?',
      answer:
        'Yes. You can click or tap the dots one after another. With a keyboard, focus a dot and press Enter or Space.',
    },
  ],
};
