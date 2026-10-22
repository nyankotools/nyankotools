import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface AsciiTableGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  delimiterLabel: string;
  delimiterAuto: string;
  delimiterComma: string;
  delimiterTab: string;
  delimiterSemicolon: string;
  styleLabel: string;
  styleAscii: string;
  styleSingle: string;
  styleRounded: string;
  styleDouble: string;
  alignLabel: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  headerLabel: string;
  rowSeparatorsLabel: string;
  wideBorderLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  outputLabel: string;
  inputPlaceholder: string;
  unterminatedQuoteError: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const asciiTableGeneratorContent: Record<
  Locale,
  AsciiTableGeneratorPageContent
> = {
  ja: {
    title: '罫線表（ASCII・Unicode）作成ツール',
    description:
      'CSV・TSV・Excelの表から、READMEやコードコメントに貼れる罫線表（ASCII／Unicode罫線）を作成できる無料ツールです。全角文字の幅をそろえて整形します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '罫線表（ASCII・Unicode）作成ツール',
    introHtml:
      'CSVやTSV（Excelからコピーした表）を貼り付けると、「+---+」や「┌─┬─┐」の罫線で囲んだテキストの表に整形します。READMEやコードコメント、メールに貼るのに便利です。GitHub向けの表が必要な場合は <a href="/tools/csv-markdown-table/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSV/TSV→Markdownテーブル変換</a> をご利用ください。',
    delimiterLabel: '区切り文字',
    delimiterAuto: '自動判定',
    delimiterComma: 'カンマ（,）',
    delimiterTab: 'タブ',
    delimiterSemicolon: 'セミコロン（;）',
    styleLabel: '罫線の種類',
    styleAscii: 'ASCII（+ - |）',
    styleSingle: 'Unicode 単線',
    styleRounded: 'Unicode 角丸',
    styleDouble: 'Unicode 二重線',
    alignLabel: '列の配置',
    alignLeft: '左揃え',
    alignCenter: '中央揃え',
    alignRight: '右揃え',
    headerLabel: '1行目を見出しにする',
    rowSeparatorsLabel: '全行の間に線を引く',
    wideBorderLabel: '罫線を全角幅（幅2）として整形',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: 'CSV / TSV',
    outputLabel: '罫線表',
    inputPlaceholder: '名前,年齢,職業\n田中,30,エンジニア\nSmith,25,デザイナー',
    unterminatedQuoteError:
      'ダブルクォートが閉じられていません。引用符の対応を確認してください。',
    notesHeading: '注意事項',
    notes: [
      '全角文字は半角2文字分の幅として数えて整形します。等幅フォントで表示してください。プロポーショナルフォントでは罫線がずれます。',
      'フォントによっては、全角文字の幅が半角のちょうど2倍にならず、罫線が少しずれることがあります。Unicode罫線は、フォントによっては文字幅が異なる場合があります。',
      '「1行目を見出しにする」をオンにすると、1行目の下に区切り線を引きます。「全行の間に線を引く」をオンにすると、すべての行の間に線を引きます。',
      '「罫線を全角幅（幅2）として整形」をオンにすると、罫線を幅2として数えて整形します。罫線が全角幅で表示されるフォントで右端が揃うようになりますが、半角幅で表示されるフォントに貼ると逆にずれます。列の幅が奇数になる場合は空白を1つ足して偶数にします。対象はUnicode単線と角丸です。角丸の角（╭╮╰╯）は半角幅で表示されるフォントが多く、角丸では全体が揃わないことがあります。二重線・ASCII罫線は変わりません（二重線は、MSゴシックなどでも半角幅で表示されるため、オフのまま使ってください）。',
      'セル内の改行は、複数行のセルとして表示します。列数が足りない行は空のセルで補い、空行は無視します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ASCII罫線',
        description:
          '「+」「-」「|」だけで枠を描く表記です。どの環境でも崩れにくく、コードコメントやプレーンテキストのメールに向いています。',
      },
      {
        term: 'Unicode罫線（Box Drawing）',
        description:
          '「┌」「─」「│」などの罫線専用の文字です。ASCII罫線より見た目はきれいですが、等幅フォントでないと幅がそろわないことがあります。',
      },
      {
        term: '等幅フォント',
        description:
          'すべての半角文字が同じ幅になるフォントです。罫線表は等幅フォントで表示したときに、列がそろって見えます。',
      },
    ],
  },
  en: {
    title: 'ASCII Table Generator (Unicode Box Drawing)',
    description:
      'Make a text table with ASCII or Unicode box-drawing borders from CSV, TSV or Excel cells. Handles full-width text. Runs in your browser; nothing is uploaded.',
    h1: 'ASCII Table Generator with Unicode Box Drawing',
    introHtml:
      'Paste CSV or TSV — including cells copied from Excel — and get a plain-text table drawn with "+---+" or "┌─┬─┐" borders. Handy for READMEs, code comments and emails. For GitHub-style tables, use the <a href="/en/tools/csv-markdown-table/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSV/TSV to Markdown Table Converter</a>.',
    delimiterLabel: 'Delimiter',
    delimiterAuto: 'Auto-detect',
    delimiterComma: 'Comma (,)',
    delimiterTab: 'Tab',
    delimiterSemicolon: 'Semicolon (;)',
    styleLabel: 'Border style',
    styleAscii: 'ASCII (+ - |)',
    styleSingle: 'Unicode single line',
    styleRounded: 'Unicode rounded',
    styleDouble: 'Unicode double line',
    alignLabel: 'Column alignment',
    alignLeft: 'Left',
    alignCenter: 'Center',
    alignRight: 'Right',
    headerLabel: 'Use the first row as header',
    rowSeparatorsLabel: 'Line between every row',
    wideBorderLabel: 'Treat box lines as double-width',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabel: 'CSV / TSV',
    outputLabel: 'Text table',
    inputPlaceholder: 'Name,Age,Role\nTanaka,30,Engineer\nSmith,25,Designer',
    unterminatedQuoteError:
      'A double quote is not closed. Check that every quote has a matching pair.',
    notesHeading: 'Notes',
    notes: [
      'Full-width characters count as two columns wide. View the table in a monospaced font; a proportional font will misalign the borders.',
      'Some fonts do not draw full-width characters at exactly twice the width of half-width ones, and Unicode box-drawing characters can vary in width, so borders may be slightly off.',
      'With "Use the first row as header" on, a line is drawn under the first row. With "Line between every row" on, a line is drawn between all rows.',
      'Turning on "Treat box lines as double-width" counts each box-drawing character as two columns. The borders then line up in fonts that draw these characters wide, but drift in fonts that draw them narrow. If a column width would be odd, one space is added to make it even. Only the Unicode single line and rounded styles are affected. Rounded corners (╭╮╰╯) are drawn narrow in many fonts, so the rounded style may not line up completely. Double line and ASCII styles are unchanged (in fonts such as MS Gothic, double lines are drawn narrow, so leave the option off for them).',
      'A line break inside a cell becomes a multi-line cell. Rows with fewer columns are filled with empty cells, and blank lines are ignored.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'ASCII table',
        description:
          'A table whose frame is drawn with just "+", "-" and "|". It survives almost any environment, which makes it a good fit for code comments and plain-text email.',
      },
      {
        term: 'Unicode box drawing',
        description:
          'Dedicated line-drawing characters such as "┌", "─" and "│". They look cleaner than ASCII borders but may not line up unless a monospaced font is used.',
      },
      {
        term: 'Monospaced font',
        description:
          'A font where every half-width character has the same width. Text tables only look aligned when shown in one.',
      },
    ],
  },
};
