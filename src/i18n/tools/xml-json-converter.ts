import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface XmlJsonConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeAriaLabel: string;
  modeXmlToJson: string;
  modeJsonToXml: string;
  indentLabel: string;
  indentOption2: string;
  indentOption4: string;
  parseValuesLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  outputLabel: string;
  inputPlaceholderXmlToJson: string;
  inputPlaceholderJsonToXml: string;
  syntaxErrorPrefix: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const xmlJsonConverterContent: Record<
  Locale,
  XmlJsonConverterPageContent
> = {
  ja: {
    title: 'XML⇔JSON変換',
    description:
      'XMLとJSONを相互に変換できる無料ツールです。属性は「@_」付きのキー、テキストは「#text」で表現します。タグの閉じ忘れなどの構文エラーは行・列つきで表示。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'XML⇔JSON変換ツール',
    introHtml:
      'XMLを入力するとJSONに、JSONを入力するとXMLに変換します。APIのXMLレスポンスやRSS、設定ファイルをJSONで扱いたい時に便利です。変換後のJSONを整形・検証したい場合は <a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a> もご利用ください。',
    modeAriaLabel: '変換方向',
    modeXmlToJson: 'XML→JSON',
    modeJsonToXml: 'JSON→XML',
    indentLabel: 'インデント幅',
    indentOption2: '半角スペース2個',
    indentOption4: '半角スペース4個',
    parseValuesLabel: '数値・true/falseをJSONの型に変換する',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: '入力',
    outputLabel: '結果',
    inputPlaceholderXmlToJson:
      '<user id="1">\n  <name>Taro</name>\n  <tag>a</tag>\n  <tag>b</tag>\n</user>',
    inputPlaceholderJsonToXml:
      '{"user": {"@_id": "1", "name": "Taro", "tag": ["a", "b"]}}',
    syntaxErrorPrefix: '構文エラー',
    notesHeading: '注意事項',
    notes: [
      '属性は「@_」を付けたキー（例: "@_id"）、属性と同じ要素内のテキストは「#text」キーで表します。JSON→XMLでも同じ表記を使います。',
      '同名の子要素が複数あると配列になります。1つだけの場合は配列にならないため、要素数が変わるデータでは結果の形が変わる点に注意してください。',
      'XMLのコメント・処理命令・XML宣言は変換時に失われます。JSON→XMLではXML宣言を付けません。',
      'JSONのルートが複数のキーまたは配列の場合は、ルート要素として <root> を補います。',
      '既定では値をすべて文字列として扱います（郵便番号の先頭の0などを保つため）。チェックを入れると数値・true/falseをJSONの型に変換します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'XML',
        description:
          'タグで囲んで階層構造を表すデータ記述形式です。RSSやSOAP、Androidのレイアウト、各種設定ファイルなどで使われています。',
      },
      {
        term: 'JSON',
        description:
          'JavaScript Object Notation の略で、データをキーと値の組み合わせで表現するテキスト形式です。APIのやり取りで広く使われています。',
      },
      {
        term: '属性',
        description:
          'XMLで <user id="1"> の id="1" のように、開始タグの中に書く付加情報です。JSONには対応する概念がないため、このツールでは「@_」付きのキーで表します。',
      },
    ],
  },
  en: {
    title: 'XML to JSON Converter',
    description:
      'Convert between XML and JSON online, with attributes as "@_" keys and syntax errors shown by line and column. Runs in your browser; nothing is sent to a server.',
    h1: 'XML ⇔ JSON Converter',
    introHtml:
      'Paste XML to convert it to JSON, or paste JSON to convert it to XML — handy for XML API responses, RSS feeds, and config files. To further format or validate the JSON, try the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a> as well.',
    modeAriaLabel: 'Direction',
    modeXmlToJson: 'XML→JSON',
    modeJsonToXml: 'JSON→XML',
    indentLabel: 'Indent',
    indentOption2: '2 spaces',
    indentOption4: '4 spaces',
    parseValuesLabel: 'Convert numbers and true/false to JSON types',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabel: 'Input',
    outputLabel: 'Result',
    inputPlaceholderXmlToJson:
      '<user id="1">\n  <name>Taro</name>\n  <tag>a</tag>\n  <tag>b</tag>\n</user>',
    inputPlaceholderJsonToXml:
      '{"user": {"@_id": "1", "name": "Taro", "tag": ["a", "b"]}}',
    syntaxErrorPrefix: 'Syntax error',
    notesHeading: 'Notes',
    notes: [
      'Attributes are keys prefixed with "@_" (e.g. "@_id"), and text inside an element that also has attributes uses the "#text" key. The same notation is used for JSON→XML.',
      'Repeated child elements with the same name become an array, but a single one does not, so the shape of the result can change when the number of elements varies.',
      'XML comments, processing instructions, and the XML declaration are lost. JSON→XML does not add an XML declaration.',
      'If the JSON root has several keys or is an array, a <root> element is added.',
      'By default all values stay strings (to keep leading zeros such as in postal codes). Check the box to convert numbers and true/false to JSON types.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'XML',
        description:
          'A data format that represents structure with nested tags. It is used for RSS, SOAP, Android layouts, and many config files.',
      },
      {
        term: 'JSON',
        description:
          'Short for JavaScript Object Notation, a text format for representing data as key-value pairs. It is widely used for APIs.',
      },
      {
        term: 'Attribute',
        description:
          'Extra information written inside a start tag, like id="1" in <user id="1">. JSON has no equivalent, so this tool represents attributes as keys prefixed with "@_".',
      },
    ],
  },
};
