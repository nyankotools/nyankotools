import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'フォルダとファイルはどう区別されますか？',
      answer:
        '名前の末尾が「/」ならフォルダの目印としてそのまま表示します。ツリー図そのものには区別がないため、「src/」のように「/」を付けて書いてください。',
    },
    {
      question: '「階層が2段以上深くなっています」と表示されます。',
      answer:
        '前の行より2段以上深いインデントの行があります。たとえば「src/」の次の行を、いきなり4スペース（2段分）下げていないか確認してください。1段ずつ下げるとエラーが消えます。',
    },
    {
      question: 'コメントを付けるにはどう書きますか？',
      answer:
        '名前のあとに空白を入れて「# 説明」または「// 説明」と書きます。出力では全行の桁をそろえ、記号は「コメント記号」で切り替えられます。「C#」のように空白がない場合は名前として扱います。',
    },
    {
      question: '深い階層を省略して見せたいときは？',
      answer:
        '「表示する深さ」に数字を入れます。入力のルートを1として数え、それより深い階層を省いて、子を持つ項目の下に「...」を出します。0にすると全部を表示します。',
    },
    {
      question: 'ツリー図からインデントの文章に戻せますか？',
      answer:
        'はい。「変換方向」を「ツリー図 → インデント」にして、「├──」や「|--」形式のツリー図を貼ると、インデントまたは箇条書きに戻せます。tree コマンドの出力も使えますが、ファイル数などの集計行は削除してください。',
    },
  ],
  en: [
    {
      question: 'How are folders told apart from files?',
      answer:
        'A name ending in "/" is shown as written, which is the usual folder marker. A tree diagram has no other distinction, so write folders as "src/".',
    },
    {
      question: 'I get a "jumps down more than one level" error.',
      answer:
        'A line is indented two or more levels deeper than the line above it. For example, the line after "src/" may have been pushed in by 4 spaces (two levels). Indent one level at a time and the error goes away.',
    },
    {
      question: 'How do I add comments?',
      answer:
        'Put whitespace after the name and write "# note" or "// note". All comments are aligned to one column, and you can pick the marker in "Comment marker". A "#" with no space before it, as in "C#", stays part of the name.',
    },
    {
      question: 'How do I show only the top levels?',
      answer:
        'Enter a number in "Depth to show". The input root counts as level 1; deeper levels are hidden and "..." appears under items that have children. 0 shows everything.',
    },
    {
      question: 'Can I turn a tree diagram back into an indented list?',
      answer:
        'Yes. Set "Direction" to "Tree to indented list" and paste a tree in the "├──" or "|--" format. Output from the tree command works too, but delete its summary line (such as "3 directories, 5 files") first.',
    },
  ],
};
