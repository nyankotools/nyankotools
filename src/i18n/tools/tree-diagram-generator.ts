import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface TreeDiagramGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  directionLabel: string;
  directionForward: string;
  directionReverse: string;
  styleLabel: string;
  styleUnicode: string;
  styleAscii: string;
  indentLabel: string;
  indentAuto: string;
  indent2: string;
  indent4: string;
  indentTab: string;
  showRootLabel: string;
  maxDepthLabel: string;
  commentsLabel: string;
  commentMarkerLabel: string;
  commentMarkerHash: string;
  commentMarkerSlash: string;
  bulletsLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  download: string;
  inputLabelForward: string;
  inputLabelReverse: string;
  outputLabelForward: string;
  outputLabelReverse: string;
  sampleText: string;
  inputPlaceholder: string;
  /** {line} は行番号に置き換える */
  errorInconsistentIndent: string;
  errorSkippedLevel: string;
  errorBadFirstIndent: string;
  errorEmptyName: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const treeDiagramGeneratorContent: Record<
  Locale,
  TreeDiagramGeneratorPageContent
> = {
  ja: {
    title: 'ディレクトリツリー図 作成ツール（├── └── 変換）',
    description:
      'インデントや「- 」で書いたフォルダ構成を、READMEに貼れる「├──」「└──」のツリー図に変換する無料ツールです。ASCII表記、コメントの桁揃え、深さでの折りたたみ、逆変換に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ディレクトリツリー図 作成ツール（インデント → ├── └──）',
    introHtml:
      'スペース・タブ・「- 」の箇条書きで書いたフォルダ構成を、「├──」「└──」「│」のツリー図に変換します。READMEやドキュメントに貼れます。末尾が「/」の名前はフォルダとして扱い、「#」や「//」以降はコメントとして桁を揃えて表示します。表の整形は <a href="/tools/ascii-table-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">罫線表（ASCII・Unicode）作成ツール</a> をご利用ください。',
    directionLabel: '変換方向',
    directionForward: 'インデント → ツリー図',
    directionReverse: 'ツリー図 → インデント',
    styleLabel: '罫線の種類',
    styleUnicode: 'Unicode（├── └── │）',
    styleAscii: 'ASCII（|-- `-- |）',
    indentLabel: 'インデント幅',
    indentAuto: '自動判定',
    indent2: 'スペース2',
    indent4: 'スペース4',
    indentTab: 'タブ',
    showRootLabel: 'ルートを表示する',
    maxDepthLabel: '表示する深さ（0 = すべて）',
    commentsLabel: 'コメントを桁揃えする',
    commentMarkerLabel: 'コメント記号',
    commentMarkerHash: '#',
    commentMarkerSlash: '//',
    bulletsLabel: '行頭に「- 」を付ける',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    download: 'ダウンロード',
    inputLabelForward: 'インデントで書いた構成',
    inputLabelReverse: 'ツリー図',
    outputLabelForward: 'ツリー図',
    outputLabelReverse: 'インデントで書いた構成',
    sampleText:
      'my-app/\n  src/\n    index.ts # エントリーポイント\n    utils/\n      format.ts\n  package.json\n  README.md # 説明',
    inputPlaceholder:
      'my-app/\n  src/\n    index.ts # エントリーポイント\n  package.json',
    errorInconsistentIndent:
      '{line}行目: インデントの幅がそろっていません。「インデント幅」の設定と合っているか確認してください。',
    errorSkippedLevel:
      '{line}行目: 階層が2段以上深くなっています。1段ずつインデントしてください。',
    errorBadFirstIndent: '{line}行目: 最初の行はインデントできません。',
    errorEmptyName:
      '{line}行目: 名前が空です。コメントだけの行は削除してください。',
    howToHeading: '使い方',
    howToSteps: [
      '「変換方向」で「インデント → ツリー図」を選び、フォルダ構成をインデント付きで入力します。',
      '「罫線の種類」「ルートを表示する」「表示する深さ（0 = すべて）」などを調整します。',
      '右側に出たツリー図を「コピー」または「ダウンロード」して、READMEに貼ります。',
    ],
    notesHeading: '注意事項',
    notes: [
      'インデントは2・4スペース、タブ、ハイフン（-）やアスタリスク（*）の箇条書きに対応します。「自動判定」では、行頭のスペースが最も少ない行の幅を1段として扱います。',
      '階層が飛ぶ行（1段目の次にいきなり3段目など）、幅が割り切れないインデント、名前が空の行はエラーにします。空行は無視します。',
      '空白の後ろにある # や // 以降はコメントです。C# のように直前に空白がない記号は名前の一部として扱います。',
      '「表示する深さ」を指定すると、それより深い階層を省き、子を持つ項目の下に省略を示す点を表示します。数え方は入力のルートが1です。',
      '全角文字は半角2文字分として桁を揃えます。等幅フォントで表示してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ツリー図',
        description:
          'フォルダ構成を「├──」「└──」「│」で枝分かれして描く文字の図です。Linuxの tree コマンドの出力と同じ形式です。',
      },
      {
        term: 'ASCII表記',
        description:
          '「|--」「`--」「|」だけで描くツリー図です。罫線文字が崩れる環境でも安全に表示できます。',
      },
    ],
  },
  en: {
    title: 'Directory Tree Generator (Text Tree Diagram)',
    description:
      'Turn an indented folder list into a ├── └── tree for your README. Unicode or ASCII, aligned comments, depth folding, reverse. Runs in your browser.',
    h1: 'Directory Tree Diagram Generator (Indented List to ├── └──)',
    introHtml:
      'Write your folder structure with spaces, tabs or "- " bullets and get a "├──" / "└──" / "│" tree like the Linux tree command prints. A trailing "/" marks a folder, and a "#" or "//" comment is aligned in one column. Need a table instead? Try the <a href="/en/tools/ascii-table-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ASCII Table Generator</a>.',
    directionLabel: 'Direction',
    directionForward: 'Indented list to tree',
    directionReverse: 'Tree to indented list',
    styleLabel: 'Line style',
    styleUnicode: 'Unicode (├── └── │)',
    styleAscii: 'ASCII (|-- `-- |)',
    indentLabel: 'Indent width',
    indentAuto: 'Auto-detect',
    indent2: '2 spaces',
    indent4: '4 spaces',
    indentTab: 'Tab',
    showRootLabel: 'Show the root',
    maxDepthLabel: 'Depth to show (0 = all)',
    commentsLabel: 'Align comments',
    commentMarkerLabel: 'Comment marker',
    commentMarkerHash: '#',
    commentMarkerSlash: '//',
    bulletsLabel: 'Prefix lines with "- "',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    download: 'Download',
    inputLabelForward: 'Indented structure',
    inputLabelReverse: 'Tree diagram',
    outputLabelForward: 'Tree diagram',
    outputLabelReverse: 'Indented structure',
    sampleText:
      'my-app/\n  src/\n    index.ts # entry point\n    utils/\n      format.ts\n  package.json\n  README.md # docs',
    inputPlaceholder:
      'my-app/\n  src/\n    index.ts # entry point\n  package.json',
    errorInconsistentIndent:
      'Line {line}: the indent width is inconsistent. Check that it matches the "Indent width" setting.',
    errorSkippedLevel:
      'Line {line}: the nesting jumps down more than one level. Indent one level at a time.',
    errorBadFirstIndent: 'Line {line}: the first line cannot be indented.',
    errorEmptyName:
      'Line {line}: the name is empty. Remove lines that contain only a comment.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose "Indented list to tree" under "Direction", then type your folder structure with indentation.',
      'Adjust "Line style", "Show the root" and "Depth to show (0 = all)" as needed.',
      'Use "Copy" or "Download" on the tree shown on the right and paste it into your README.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Indents of 2 or 4 spaces, tabs, and hyphen or asterisk bullets are accepted. With "Auto-detect", the smallest leading-space width is treated as one level.',
      'Lines that skip a level, indents that do not divide evenly, and empty names are errors. Blank lines are ignored.',
      'Everything after a # or // that follows whitespace is a comment. A marker with no space before it, as in C#, stays part of the name.',
      'Setting "Depth to show" hides deeper levels and prints three dots under items that have children. The input root counts as level 1.',
      'Full-width characters count as two columns when aligning. View the result in a monospaced font.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Tree diagram',
        description:
          'A text drawing of a folder structure using "├──", "└──" and "│" branches, in the same format the Linux tree command prints.',
      },
      {
        term: 'ASCII style',
        description:
          'A tree drawn only with "|--", "`--" and "|". It stays readable in environments where box-drawing characters break.',
      },
    ],
  },
};
