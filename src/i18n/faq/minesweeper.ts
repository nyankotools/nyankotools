import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '最初の1手で地雷を踏むことはありますか？',
      answer:
        'ありません。最初に開いたマスとその周囲8マスには地雷を置かず、地雷は最初の1手のあとに配置されます。そのため、最初のクリックで負けることはなく、多くの場合は周囲に地雷のない広い範囲が開きます。',
    },
    {
      question: 'スマホやタブレットで旗はどうやって立てますか？',
      answer:
        'マスを長押しすると旗を立てたり外したりできます。長押しが難しいときは、「操作モード」を「旗」に切り替えると、タップだけで旗を立てられます。掘りたいときは「掘る」に戻してください。',
    },
    {
      question: '数字をクリックすると周りのマスが開くのはなぜですか？',
      answer:
        '開いた数字の周囲に、その数字と同じ数の旗が立っているときは、残りのマスをまとめて開く操作（チョード）が働きます。旗の数が合っていないときは何も起きません。旗の位置が間違っていると、地雷を開いて負けになります。',
    },
    {
      question:
        'カスタムで指定できる地雷の数の上限はなぜ決まっているのですか？',
      answer:
        '最初の1手を必ず安全にするため、最初に開くマスとその周囲9マスには地雷を置けません。そのため、地雷の数はマス数から9を引いた数までに制限しています。列数は5〜30、行数は5〜24の範囲です。',
    },
    {
      question: 'ベストタイムは保存されますか？',
      answer:
        '初級・中級・上級ごとの最短クリア時間が、このブラウザのローカルストレージに保存されます。カスタムの盤面は記録されません。「記録をリセット」で消せます。ブラウザのデータを消去すると記録も消えます。',
    },
  ],
  en: [
    {
      question: 'Can I hit a mine on my first move?',
      answer:
        'No. The first cell you open and its 8 neighbors never contain a mine, because mines are placed after your first move. You cannot lose on the first click, and it usually opens a larger area with no adjacent mines.',
    },
    {
      question: 'How do I place a flag on a phone or tablet?',
      answer:
        'Long-press a cell to place or remove a flag. If long-pressing is awkward, switch "Mode" to "Flag" and just tap. Switch back to "Dig" when you want to open cells.',
    },
    {
      question: 'Why does clicking a number open the cells around it?',
      answer:
        'When an opened number has exactly that many flags around it, clicking it opens all its remaining neighbors at once (chording). If the flag count does not match, nothing happens. If a flag is in the wrong place, you will open a mine and lose.',
    },
    {
      question: 'Why is the mine count limited in Custom games?',
      answer:
        'To keep the first move safe, mines cannot be placed on the first cell or its 8 neighbors, so the number of mines is capped at the number of cells minus 9. Columns can be 5 to 30 and rows 5 to 24.',
    },
    {
      question: 'Are best times saved?',
      answer:
        'Yes. The fastest clear time for each of Beginner, Intermediate and Expert is saved in this browser’s local storage. Custom boards are not recorded. "Reset records" clears them, and so does clearing your browser data.',
    },
  ],
};
