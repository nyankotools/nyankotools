import type { Locale } from '../../data/tools';
import type {
  CommentStyle,
  FrameAlign,
  FrameStyle,
} from '../../lib/tools/text-box-frame';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface TextBoxFramePageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  outputLabel: string;
  styleLabel: string;
  styleNames: Record<FrameStyle, string>;
  alignLabel: string;
  alignNames: Record<FrameAlign, string>;
  paddingXLabel: string;
  paddingYLabel: string;
  tailLabel: string;
  wideBorderLabel: string;
  commentLabel: string;
  commentNames: Record<CommentStyle, string>;
  copy: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const textBoxFrameContent: Record<Locale, TextBoxFramePageContent> = {
  ja: {
    title: 'テキスト枠囲み・吹き出し作成｜罫線・ASCIIアート風に装飾',
    description:
      'テキストを罫線（Unicode）・ASCII・吹き出しで囲む無料ツールです。全角幅を考慮して整形し、コードコメントやREADMEの装飾にそのまま貼り付けられます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'テキスト枠囲み・吹き出しジェネレーター',
    introHtml:
      '入力したテキストを、罫線・ASCII文字・吹き出しで囲みます。全角文字は幅2として揃えるので、日本語でも右端がずれません。「コメント」を選べば、<code>//</code> や <code>/* */</code> 付きでコードにそのまま貼れます。表を作りたいときは <a href="/tools/ascii-table-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ASCII表ジェネレーター</a> をご利用ください。',
    inputLabel: '囲むテキスト',
    inputPlaceholder: 'ここにテキストを入力（複数行可）',
    sampleText: 'TODO: 設定ファイルの読み込みを\n非同期にする',
    outputLabel: '結果',
    styleLabel: '枠のスタイル',
    styleNames: {
      ascii: 'ASCII（+ - |）',
      single: '単線（┌─┐）',
      rounded: '角丸（╭─╮）',
      double: '二重線（╔═╗）',
      heavy: '太線（┏━┓）',
      hash: 'シャープ（#）',
      star: 'アスタリスク（*）',
      speech: '吹き出し（セリフ）',
      thought: '吹き出し（考え事）',
    },
    alignLabel: '行の揃え',
    alignNames: { left: '左', center: '中央', right: '右' },
    paddingXLabel: '左右の余白',
    paddingYLabel: '上下の余白',
    tailLabel: '吹き出しのしっぽ',
    wideBorderLabel: '罫線を全角幅（幅2）として整形',
    commentLabel: 'コメント',
    commentNames: {
      none: 'なし',
      slash: '// 行コメント',
      hash: '# 行コメント',
      dash: '-- 行コメント',
      block: '/* */ ブロック',
    },
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '全角文字・絵文字は幅2、半角は幅1として揃えます。表示するフォントによっては全角が半角2文字分にならず、右端がずれることがあります。コードに貼る場合は、等幅フォントのエディタで確認してください。',
      '罫線文字（┌─┐など）は、一部のフォントや環境では全角幅で表示されて枠が崩れます。崩れるときは「ASCII」スタイルを使ってください。',
      '「罫線を全角幅（幅2）として整形」をオンにすると、罫線を幅2として数えて整形します。罫線が全角幅で表示されるフォントで右端が揃うようになりますが、半角幅で表示されるフォントに貼ると逆にずれます。また、内側の幅が奇数になる場合は右に空白を1つ足して偶数にします。罫線を使わないASCII・#・*・吹き出しスタイルには影響しません。',
      '余白と「しっぽ」は、枠のスタイルに応じて使われます。左右・上下の余白は吹き出しでは使われず、しっぽは吹き出しだけに付きます。',
      'ブロックコメントでは、本文中の */ がコメントを閉じてしまわないよう、* / に置き換えます。',
      'タブは4つの半角スペースに置き換えます。結合文字やゼロ幅文字は幅0として数えます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '罫線文字',
        description:
          '表や枠を描くためのUnicode文字（─ │ ┌ ┐ など）です。もともと日本語の文字コードにあった記号で、等幅フォントでは隙間なくつながります。',
      },
      {
        term: '全角と半角の幅',
        description:
          '等幅フォントでは、全角文字は半角文字2文字分の幅で表示されます。文字数ではなく表示幅で空白を足すことで、枠の右端が揃います。',
      },
    ],
  },
  en: {
    title: 'Text Box & Speech Bubble Generator – ASCII & Unicode',
    description:
      'Wrap text in a Unicode box, ASCII border or speech bubble. Handles wide CJK characters and adds comment prefixes. Runs in your browser; nothing is uploaded.',
    h1: 'Text Box and Speech Bubble Generator',
    introHtml:
      'Wrap any text in a box or speech bubble made of Unicode line characters, plain ASCII or symbols. Wide characters such as Japanese count as two columns, so the right edge stays straight. Pick a "Comment" style to paste the result straight into code as <code>//</code> or <code>/* */</code>. To draw a table instead, see the <a href="/en/tools/ascii-table-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ASCII Table Generator</a>.',
    inputLabel: 'Text to wrap',
    inputPlaceholder: 'Type your text here (multiple lines allowed)',
    sampleText: 'TODO: load the config file\nasynchronously',
    outputLabel: 'Result',
    styleLabel: 'Frame style',
    styleNames: {
      ascii: 'ASCII (+ - |)',
      single: 'Single line (┌─┐)',
      rounded: 'Rounded (╭─╮)',
      double: 'Double line (╔═╗)',
      heavy: 'Heavy line (┏━┓)',
      hash: 'Hash (#)',
      star: 'Asterisk (*)',
      speech: 'Speech bubble',
      thought: 'Thought bubble',
    },
    alignLabel: 'Line alignment',
    alignNames: { left: 'Left', center: 'Center', right: 'Right' },
    paddingXLabel: 'Horizontal padding',
    paddingYLabel: 'Vertical padding',
    tailLabel: 'Bubble tail',
    wideBorderLabel: 'Treat box lines as double-width',
    commentLabel: 'Comment',
    commentNames: {
      none: 'None',
      slash: '// line comment',
      hash: '# line comment',
      dash: '-- line comment',
      block: '/* */ block comment',
    },
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Fullwidth characters and emoji count as two columns and halfwidth characters as one. Some fonts do not draw fullwidth characters at exactly twice the width, so the right edge can drift. If you paste into code, check it in a monospace editor.',
      'In some fonts and environments, box-drawing characters (┌─┐ and so on) are drawn at double width and the frame breaks. If that happens, use the ASCII style.',
      'Turning on "Treat box lines as double-width" counts each box-drawing character as two columns. The right edge then lines up in fonts that draw these characters wide, but it drifts in fonts that draw them narrow. If the inner width would be odd, one space is added on the right to make it even. The ASCII, #, * and bubble styles do not use box-drawing characters and are not affected.',
      'Padding and the tail depend on the frame style. Horizontal and vertical padding are ignored for bubbles, and the tail applies to bubbles only.',
      'In block comments, */ inside your text is changed to * / so it cannot close the comment early.',
      'Tabs are replaced with four spaces. Combining and zero-width characters count as zero columns.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Box-drawing characters',
        description:
          'Unicode characters for drawing frames and tables (─ │ ┌ ┐ and so on). In a monospace font they join up without gaps.',
      },
      {
        term: 'Fullwidth vs. halfwidth',
        description:
          'In a monospace font, a fullwidth character takes the width of two halfwidth ones. Padding by display width instead of character count is what keeps the right edge of the frame aligned.',
      },
    ],
  },
};
