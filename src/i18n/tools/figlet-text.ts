import type { Locale } from '../../data/tools';
import type { CommentStyle, FontId, Layout } from '../../lib/tools/figlet-text';

export interface FigletTextPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  initialText: string;
  sampleText: string;
  fontLabel: string;
  fonts: Record<FontId, string>;
  layoutLabel: string;
  layouts: Record<Layout, string>;
  commentLabel: string;
  comments: Record<CommentStyle, string>;
  outputLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  download: string;
  loadError: string;
  tooLong: string;
  /** {chars} に未対応の文字が入る */
  skippedFormat: string;
  emptyOutput: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const figletTextContent: Record<Locale, FigletTextPageContent> = {
  ja: {
    title: 'ASCIIアート文字（FIGlet風テキストバナー）生成',
    description:
      '英数字を大きなASCIIアート文字（FIGletのテキストバナー）に変換する無料ツールです。Standard・Slant・Doomなど7種の書体を選べ、コードのコメント形式でコピーもできます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ASCIIアート文字（テキストバナー）生成',
    introHtml:
      '英数字を入力すると、記号の組み合わせで描いた大きな文字（FIGlet形式のテキストバナー）に変換します。READMEやソースコードの見出し、ターミナルの起動メッセージに使えます。画像をASCIIアートにしたいときは<a href="/tools/image-ascii-art/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像→ASCIIアート変換</a>をご利用ください。',
    inputLabel: 'テキスト',
    inputPlaceholder: '変換したい英数字を入力（改行すると複数行になります）',
    initialText: 'Nyanko',
    sampleText: 'NyankoTools',
    fontLabel: '書体',
    fonts: {
      standard: 'Standard（標準）',
      small: 'Small（小さめ）',
      slant: 'Slant（斜体）',
      big: 'Big（太め）',
      mini: 'Mini（極小）',
      doom: 'Doom（角ばった太字）',
      block: 'Block（ブロック █）',
    },
    layoutLabel: '字間',
    layouts: {
      default: '書体の標準',
      full: '詰めない（広い）',
      fitted: '接するまで詰める',
      smush: '重ねて詰める',
    },
    commentLabel: 'コメント形式',
    comments: {
      none: 'なし',
      slash: '// 行コメント',
      hash: '# 行コメント',
      block: '/* ブロックコメント */',
      html: '<!-- HTMLコメント -->',
    },
    outputLabel: '結果',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    download: 'テキストファイルで保存',
    loadError: '書体の読み込みに失敗しました。ページを再読み込みしてください。',
    tooLong: '入力が長すぎるため、先頭の {max} 文字だけを変換しています。',
    skippedFormat:
      '対応していない文字は表示していません: {chars}（半角の英数字と記号のみ使えます）',
    emptyOutput: 'テキストを入力すると、ここにアート文字が表示されます。',
    notesHeading: '注意事項',
    notes: [
      '使えるのは半角の英数字と記号です。日本語・全角文字・絵文字は表示できないため、入力しても無視されます。',
      "Blockは英数字と一部の記号（! ? . , : - _ + = / ( ) ' * #）だけに対応し、英小文字は大文字と同じ字形になります。",
      '等幅フォントで表示・貼り付けることを前提にしています。比例フォント（メールの本文やチャットなど）では形が崩れることがあります。',
      'コメント形式を選ぶと、各行の先頭に // や # を付けたり、/* */ や <!-- --> で囲んだりします。アートの中に */ や --> があるとコメントが途中で閉じてしまうため、間に空白を入れています。',
      'Standard・Small・Slant・Big・Miniは、FIGletに同梱されている書体（作者: Glenn Chappell、Ian Chai ほか）、Doomは Frans P. de Vries 氏の書体です。いずれも書体の配布条件に従い、元のコメントを残して同梱しています。Blockは当サイトの自作です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'FIGlet',
        description:
          '文字を記号の組み合わせで描いた大きな文字（テキストバナー）に変換する、1991年から続くプログラムです。書体は .flf というファイルで配布され、世界中で多くの書体が作られています。',
      },
      {
        term: 'スマッシング（字間の詰め）',
        description:
          '隣り合う文字の端を重ねて、字間を詰める処理です。「重ねて詰める」では、/ と \\ のように重なった記号を、書体ごとの決まりに従って1つの記号にまとめます。書体によっては、重ねると形が崩れて読みづらくなることがあります。',
      },
    ],
  },
  en: {
    title: 'ASCII Art Text Generator (FIGlet-style Banner)',
    description:
      'Turn text into big ASCII art lettering (FIGlet-style banners) in 7 fonts, and copy it as a code comment. Runs in your browser; nothing is sent to a server.',
    h1: 'ASCII Art Text Generator (Text Banner)',
    introHtml:
      'Type some text and it is drawn as large lettering made of plain characters, in the FIGlet banner style. Handy for README headings, source-file headers and terminal splash messages. To turn a picture into ASCII art instead, use the <a href="/en/tools/image-ascii-art/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image to ASCII Art Converter</a>.',
    inputLabel: 'Text',
    inputPlaceholder:
      'Enter text to convert (a line break makes multiple lines)',
    initialText: 'Nyanko',
    sampleText: 'NyankoTools',
    fontLabel: 'Font',
    fonts: {
      standard: 'Standard',
      small: 'Small',
      slant: 'Slant',
      big: 'Big',
      mini: 'Mini (tiny)',
      doom: 'Doom (bold, angular)',
      block: 'Block (█)',
    },
    layoutLabel: 'Letter spacing',
    layouts: {
      default: 'Font default',
      full: 'Full width (wide)',
      fitted: 'Fitted (touching)',
      smush: 'Smushed (overlapping)',
    },
    commentLabel: 'Comment style',
    comments: {
      none: 'None',
      slash: '// line comment',
      hash: '# line comment',
      block: '/* block comment */',
      html: '<!-- HTML comment -->',
    },
    outputLabel: 'Result',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    download: 'Save as text file',
    loadError: 'Failed to load the font. Please reload the page.',
    tooLong:
      'The input is too long, so only the first {max} characters are converted.',
    skippedFormat:
      'These characters are not supported and were left out: {chars} (only ASCII letters, digits and symbols work)',
    emptyOutput: 'Enter some text and the lettering appears here.',
    notesHeading: 'Notes',
    notes: [
      'Only ASCII letters, digits and symbols are supported. Japanese, full-width characters and emoji cannot be drawn and are ignored.',
      "Block covers letters, digits and a few symbols (! ? . , : - _ + = / ( ) ' * #); lowercase letters use the same shapes as uppercase.",
      'The result is meant for a monospaced font. In proportional fonts (email bodies, chat apps) the shapes may fall apart.',
      'A comment style adds // or # to each line, or wraps the art in /* */ or <!-- -->. If the art contains */ or -->, a space is inserted so it cannot close the comment early.',
      'Standard, Small, Slant, Big and Mini are fonts bundled with FIGlet (by Glenn Chappell, Ian Chai and others) and Doom is by Frans P. de Vries. They are included under their distribution terms with the original comments kept. Block is our own design.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'FIGlet',
        description:
          'A program, around since 1991, that draws text as large lettering made of ordinary characters (a text banner). Fonts are distributed as .flf files, and many have been made by people around the world.',
      },
      {
        term: 'Smushing',
        description:
          'Overlapping the edges of neighbouring letters to tighten the spacing. In "Smushed" mode, characters that land on the same cell, such as / and \\, are merged into one according to each font\'s rules. Some fonts become hard to read when smushed.',
      },
    ],
  },
};
