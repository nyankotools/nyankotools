import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface XmlFormatterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  outputLabel: string;
  inputPlaceholder: string;
  indentLabel: string;
  indentOption2: string;
  indentOption4: string;
  indentOptionTab: string;
  indentOptionMin: string;
  breakAttributesLabel: string;
  removeCommentsLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  syntaxErrorPrefix: string;
  /** {line} {column} を置き換えて表示する */
  errorLocationTemplate: string;
  errorExcerptLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const xmlFormatterContent: Record<Locale, XmlFormatterPageContent> = {
  ja: {
    title: 'XML整形・構文チェック（ミニファイ対応）',
    description:
      'XMLをインデント整形・ミニファイ・構文チェックできる無料ツールです。エラーは行・列つきで表示し、宣言・コメント・CDATAも保持します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'XML整形・構文チェックツール',
    introHtml:
      '1行に潰れたXMLを読みやすく整形したり、逆に空白を削ってミニファイしたりできます。タグの閉じ忘れなどの構文エラーは行・列つきで表示します。JSONと相互に変換したい場合は <a href="/tools/xml-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">XML⇔JSON変換</a>、JSONの整形は <a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a> をご利用ください。',
    inputLabel: '入力（XML）',
    outputLabel: '結果',
    inputPlaceholder:
      '<?xml version="1.0"?><users><user id="1"><name>Taro</name></user></users>',
    indentLabel: 'インデント',
    indentOption2: '半角スペース2個',
    indentOption4: '半角スペース4個',
    indentOptionTab: 'タブ',
    indentOptionMin: 'ミニファイ（空白を削除）',
    breakAttributesLabel: '属性を1つずつ改行する',
    removeCommentsLabel: 'コメントを削除する',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    syntaxErrorPrefix: '構文エラー',
    errorLocationTemplate: '{line}行目 {column}列目',
    errorExcerptLabel: '該当行',
    notesHeading: '注意事項',
    notes: [
      'テキストを含む要素（<p>Hello <b>world</b></p> のような混在コンテンツ）は、空白が意味を持つため中身を整形せず、1行のまま保ちます。',
      '要素だけで構成される部分の要素間の空白（改行・インデント）は、整形時に作り直され、ミニファイ時に削除されます。',
      'XML宣言・コメント・CDATA・処理命令・DOCTYPE・属性・名前空間は保持します。属性値の外側にある余分な空白だけが1つに揃います。',
      '構文チェックは整形式（タグの対応や属性の引用符など）の確認です。XSDやDTDによるスキーマ検証は行いません。',
      '外部エンティティやDTDの参照は取得せず、通信は一切行いません。エラーの行・列は、入力の中の最初に問題が見つかった位置です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '整形式（well-formed）',
        description:
          'XMLの構文規則（タグが正しく入れ子で閉じている、ルート要素が1つ、属性値が引用符で囲まれている、など）を満たしている状態です。',
      },
      {
        term: '混在コンテンツ',
        description:
          'ひとつの要素の中にテキストと子要素が混ざっている状態です。文章の途中の空白が意味を持つため、整形で改行を入れないようにします。',
      },
      {
        term: 'CDATA',
        description:
          '<![CDATA[ … ]]> で囲んだ部分を、タグや記号のエスケープなしにそのままテキストとして扱うための書き方です。',
      },
    ],
  },
  en: {
    title: 'XML Formatter & Validator - Beautify, Minify',
    description:
      'Format, minify and validate XML online with line and column error positions. Runs in your browser; nothing is uploaded to a server.',
    h1: 'XML Formatter & Validator',
    introHtml:
      'Pretty-print squashed XML, or strip the whitespace to minify it. Syntax errors such as an unclosed tag are shown with their line and column. To convert to JSON use the <a href="/en/tools/xml-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">XML ⇔ JSON Converter</a>, and for JSON itself try the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a>.',
    inputLabel: 'Input (XML)',
    outputLabel: 'Result',
    inputPlaceholder:
      '<?xml version="1.0"?><users><user id="1"><name>Taro</name></user></users>',
    indentLabel: 'Indent',
    indentOption2: '2 spaces',
    indentOption4: '4 spaces',
    indentOptionTab: 'Tab',
    indentOptionMin: 'Minify (remove whitespace)',
    breakAttributesLabel: 'Put each attribute on its own line',
    removeCommentsLabel: 'Remove comments',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    syntaxErrorPrefix: 'Syntax error',
    errorLocationTemplate: 'line {line}, column {column}',
    errorExcerptLabel: 'Line',
    notesHeading: 'Notes',
    notes: [
      'Elements that contain text (mixed content such as <p>Hello <b>world</b></p>) are kept on one line and their contents are not reformatted, because whitespace is significant there.',
      'Whitespace between elements (line breaks and indentation) is rebuilt when formatting and removed when minifying.',
      'The XML declaration, comments, CDATA, processing instructions, DOCTYPE, attributes, and namespaces are preserved. Only extra spaces between attributes inside a tag are normalized.',
      'The check covers well-formedness (matching tags, quoted attribute values, and so on). It does not validate against an XSD or DTD.',
      'External entities and DTD references are never fetched, and nothing is sent anywhere. The reported line and column point to the first problem found.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Well-formed',
        description:
          'XML that follows the syntax rules: tags are properly nested and closed, there is exactly one root element, and attribute values are quoted.',
      },
      {
        term: 'Mixed content',
        description:
          'An element that contains both text and child elements. Whitespace inside the text can matter, so the formatter does not add line breaks there.',
      },
      {
        term: 'CDATA',
        description:
          'A section written as <![CDATA[ … ]]> whose contents are treated as plain text, so tags and symbols need no escaping.',
      },
    ],
  },
};
