import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

type CategoryId =
  | 'space'
  | 'tab'
  | 'nbsp'
  | 'wideSpace'
  | 'otherSpace'
  | 'newline'
  | 'control'
  | 'invisible';

interface CategoryLabel {
  label: string;
  /** 表示に使う記号の説明 */
  symbol: string;
}

export interface WhitespaceVisualizerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  showSpacesLabel: string;
  /** {total} を置換する */
  summaryFound: string;
  summaryNone: string;
  /** {lines} を置換する（行番号をカンマ区切りで入れる） */
  trailingFound: string;
  trailingNone: string;
  resultLabel: string;
  categories: Record<CategoryId, CategoryLabel>;
  countsLabel: string;
  findingsLabel: string;
  colSymbol: string;
  colCode: string;
  colName: string;
  colType: string;
  colCount: string;
  /** キーは「U+0009」形式（改行のみ CRLF）。ここに無い文字は種類名を表示する */
  charNames: Record<string, string>;
  copy: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const whitespaceVisualizerContent: Record<
  Locale,
  WhitespaceVisualizerPageContent
> = {
  ja: {
    title: '空白・不可視文字の可視化（タブ・全角スペース・改行の確認）',
    description:
      'タブ・全角スペース・ノーブレークスペース・改行（LF/CRLF）・制御文字・ゼロ幅文字を記号で表示し、種類ごとの件数を集計する無料ツールです。行末の余分な空白も確認できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '空白・不可視文字の可視化ツール',
    introHtml:
      'コピペしたテキストに、タブや全角スペース、ノーブレークスペース、CRLFの改行が混ざっていないかを目で確認できます。見えない文字を記号に置き換えて表示し、種類ごとの件数も数えます。見えない文字を削除したいときは <a href="/tools/zero-width-char-remover/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ゼロ幅文字の検出・除去</a> をご利用ください。',
    inputLabel: '入力',
    inputPlaceholder: '確認したいテキストを貼り付け',
    sampleText: 'name: Taro \n\tage:　 20\r\nnote:​hello\u0000',
    showSpacesLabel: '半角スペースも「·」で表示する',
    summaryFound: '空白・不可視文字を{total}個検出しました',
    summaryNone: '表示対象の文字は見つかりませんでした',
    trailingFound: '行末に空白がある行: {lines}',
    trailingNone: '行末に余分な空白がある行はありません',
    resultLabel: '可視化した結果',
    categories: {
      space: { label: '半角スペース', symbol: '·' },
      tab: { label: 'タブ', symbol: '→' },
      nbsp: { label: 'ノーブレークスペース', symbol: '°' },
      wideSpace: { label: '全角スペース', symbol: '□' },
      otherSpace: { label: 'その他の空白', symbol: '␣' },
      newline: { label: '改行', symbol: '↵ ␍ ¶ ⏎' },
      control: { label: '制御文字', symbol: '␀ ␡ ⟦XXXX⟧' },
      invisible: { label: '不可視文字', symbol: '⟦XXXX⟧' },
    },
    countsLabel: '種類ごとの件数',
    findingsLabel: '文字ごとの内訳',
    colSymbol: '記号',
    colCode: 'コードポイント',
    colName: '名称',
    colType: '種類',
    colCount: '個数',
    charNames: {
      'U+0020': '半角スペース',
      'U+0009': '水平タブ',
      'U+000A': '改行（LF）',
      'U+000D': '復帰（CR）',
      CRLF: '改行（CRLF）',
      'U+2028': '行区切り',
      'U+2029': '段落区切り',
      'U+00A0': 'ノーブレークスペース',
      'U+3000': '全角スペース',
      'U+2002': 'enスペース',
      'U+2003': 'emスペース',
      'U+2009': '細いスペース',
      'U+202F': '狭いノーブレークスペース',
      'U+0000': 'NUL（空文字）',
      'U+007F': 'DEL（削除）',
      'U+200B': 'ゼロ幅スペース',
      'U+200C': 'ゼロ幅非接合子',
      'U+200D': 'ゼロ幅接合子',
      'U+2060': 'ワードジョイナー',
      'U+FEFF': 'BOM / ゼロ幅非改行スペース',
      'U+00AD': 'ソフトハイフン',
      'U+200E': '左から右マーク',
      'U+200F': '右から左マーク',
      'U+3164': 'ハングルフィラー',
    },
    copy: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '改行記号（↵）のあとには、実際の改行も残して表示しています。CRLFは「␍↵」と表示します。',
      '結果の文字列は、記号に置き換えた確認用のテキストです。元のテキストとして使わないでください。',
      '見えない文字のうち、ゼロ幅スペースなどは「⟦200B⟧」のようにコードポイントで表示します。一部のフォントでは、記号が別の見た目で表示されることがあります。',
      '全角文字や絵文字は、通常の文字としてそのまま表示します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ノーブレークスペース（U+00A0）',
        description:
          '見た目は半角スペースと同じで、その位置で改行されない空白です。Webページからコピーすると混ざりやすく、半角スペースとして検索しても一致しない原因になります。',
      },
      {
        term: 'CRLFとLF',
        description:
          '改行を表す文字の違いです。Windowsでは復帰＋改行（CRLF）、macOSやLinuxでは改行（LF）が一般的で、混在するとgitの差分や一部のプログラムで問題になることがあります。',
      },
      {
        term: '制御文字',
        description:
          'U+0000〜U+001FやU+007F〜U+009Fにある、文字ではなく制御のための文字です。タブと改行以外は通常のテキストには不要で、データの破損や貼り付けミスで混ざることがあります。',
      },
    ],
  },
  en: {
    title: 'Whitespace & Invisible Character Viewer',
    description:
      'Show tabs, no-break and ideographic spaces, line breaks (LF/CRLF), control and zero-width characters as symbols, with counts. Runs in your browser.',
    h1: 'Whitespace & Invisible Character Visualizer',
    introHtml:
      'Check pasted text for stray tabs, ideographic spaces, no-break spaces or CRLF line endings. Hidden characters are replaced with visible symbols and counted by type. If you want to delete invisible characters instead, use the <a href="/en/tools/zero-width-char-remover/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Zero-Width Character Remover</a>.',
    inputLabel: 'Input',
    inputPlaceholder: 'Paste the text you want to inspect',
    sampleText: 'name: Taro \n\tage:　 20\r\nnote:​hello\u0000',
    showSpacesLabel: 'Also show regular spaces as "·"',
    summaryFound: 'Found {total} whitespace or invisible characters',
    summaryNone: 'No characters to display were found',
    trailingFound: 'Lines with trailing whitespace: {lines}',
    trailingNone: 'No lines have trailing whitespace',
    resultLabel: 'Visualized result',
    categories: {
      space: { label: 'Regular space', symbol: '·' },
      tab: { label: 'Tab', symbol: '→' },
      nbsp: { label: 'No-break space', symbol: '°' },
      wideSpace: { label: 'Ideographic space', symbol: '□' },
      otherSpace: { label: 'Other spaces', symbol: '␣' },
      newline: { label: 'Line break', symbol: '↵ ␍ ¶ ⏎' },
      control: { label: 'Control character', symbol: '␀ ␡ ⟦XXXX⟧' },
      invisible: { label: 'Invisible character', symbol: '⟦XXXX⟧' },
    },
    countsLabel: 'Count by type',
    findingsLabel: 'Breakdown by character',
    colSymbol: 'Symbol',
    colCode: 'Code point',
    colName: 'Name',
    colType: 'Type',
    colCount: 'Count',
    charNames: {
      'U+0020': 'Space',
      'U+0009': 'Tab',
      'U+000A': 'Line feed (LF)',
      'U+000D': 'Carriage return (CR)',
      CRLF: 'CRLF line break',
      'U+2028': 'Line separator',
      'U+2029': 'Paragraph separator',
      'U+00A0': 'No-break space',
      'U+3000': 'Ideographic space',
      'U+2002': 'En space',
      'U+2003': 'Em space',
      'U+2009': 'Thin space',
      'U+202F': 'Narrow no-break space',
      'U+0000': 'Null',
      'U+007F': 'Delete',
      'U+200B': 'Zero width space',
      'U+200C': 'Zero width non-joiner',
      'U+200D': 'Zero width joiner',
      'U+2060': 'Word joiner',
      'U+FEFF': 'BOM / zero width no-break space',
      'U+00AD': 'Soft hyphen',
      'U+200E': 'Left-to-right mark',
      'U+200F': 'Right-to-left mark',
      'U+3164': 'Hangul filler',
    },
    copy: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'A real line break is kept after each line-break symbol (↵), so the layout stays readable. CRLF is shown as "␍↵".',
      'The result is a review copy with symbols substituted. Do not use it as your original text.',
      'Invisible characters such as the zero-width space are shown by code point, like "⟦200B⟧". Some fonts draw the symbols differently.',
      'Wide characters and emoji are displayed as they are.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'No-break space (U+00A0)',
        description:
          'A space that looks like a regular one but never wraps to a new line. It often sneaks in when copying from web pages and makes searches for a regular space fail.',
      },
      {
        term: 'CRLF vs LF',
        description:
          'Two ways to mark a line end. Windows traditionally uses carriage return plus line feed (CRLF), while macOS and Linux use a line feed (LF). Mixing them can cause noisy git diffs and trouble in some programs.',
      },
      {
        term: 'Control characters',
        description:
          'Characters in U+0000 to U+001F and U+007F to U+009F that carry control instructions rather than text. Apart from tab and line breaks they are not needed in normal text and usually appear through data corruption or paste mistakes.',
      },
    ],
  },
};
