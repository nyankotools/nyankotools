import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface Option {
  value: string;
  label: string;
}

export interface QueryStringJsonPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること */
  introHtml: string;
  directionLabel: string;
  directionOptions: Option[];
  inferLabel: string;
  plusLabel: string;
  arrayLabel: string;
  arrayOptions: Option[];
  encodeLabel: string;
  encodeOptions: Option[];
  spacePlusLabel: string;
  leadingLabel: string;
  indentLabel: string;
  indentOptions: Option[];
  inputLabel: string;
  outputLabel: string;
  sampleButton: string;
  sampleQuery: string;
  sampleJson: string;
  inputPlaceholderQuery: string;
  inputPlaceholderJson: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** {message} は JSON.parse のエラーメッセージ */
  errorParse: string;
  errorNotObject: string;
  errorDepth: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const link =
  'class="text-blue-700 underline hover:no-underline dark:text-blue-400"';

export const queryStringJsonContent: Record<
  Locale,
  QueryStringJsonPageContent
> = {
  ja: {
    title: 'クエリ文字列⇔JSON変換（a[b][c]・b[]・b[0]対応）',
    description:
      'URLのクエリ文字列とJSONを相互に変換できる無料ツールです。a[b][c]のネスト、b[]・b[0]・繰り返しの配列表記、型推論、エンコードに対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'クエリ文字列⇔JSON変換',
    introHtml: `<code>a=1&amp;b[]=2&amp;b[]=3</code> のようなクエリ文字列をJSONに、JSONをクエリ文字列に変換します。先頭の <code>?</code> や完全なURLを貼り付けても、クエリ部分だけを取り出します。URLを部品ごとに分解・編集したいときは <a href="/tools/url-parser/" ${link}>URLパーサー</a> を、JSONを整えるときは <a href="/tools/json-formatter/" ${link}>JSON整形</a> をご利用ください。`,
    directionLabel: '変換方向',
    directionOptions: [
      { value: 'q2j', label: 'クエリ文字列 → JSON' },
      { value: 'j2q', label: 'JSON → クエリ文字列' },
    ],
    inferLabel: '数値・true/false・null を型変換する',
    plusLabel: '+ をスペースとして解釈する',
    arrayLabel: '配列の表記',
    arrayOptions: [
      { value: 'bracket', label: 'b[]=1&b[]=2' },
      { value: 'index', label: 'b[0]=1&b[1]=2' },
      { value: 'repeat', label: 'b=1&b=2（繰り返し）' },
    ],
    encodeLabel: 'エンコード',
    encodeOptions: [
      { value: 'brackets', label: '括弧[]以外をエンコード' },
      { value: 'full', label: 'すべてエンコード' },
      { value: 'none', label: 'エンコードしない' },
    ],
    spacePlusLabel: 'スペースを + にする',
    leadingLabel: '先頭に ? を付ける',
    indentLabel: 'インデント幅',
    indentOptions: [
      { value: '2', label: '半角スペース2個' },
      { value: '4', label: '半角スペース4個' },
      { value: 'tab', label: 'タブ' },
      { value: '0', label: 'なし（1行）' },
    ],
    inputLabel: '入力',
    outputLabel: '変換結果',
    sampleButton: 'サンプルを入力',
    sampleQuery:
      '?name=Taro&tags[]=a&tags[]=b&user[address][city]=Tokyo&age=30&q=hello+world',
    sampleJson: `{
  "name": "Taro",
  "tags": ["a", "b"],
  "user": { "address": { "city": "Tokyo" } },
  "age": 30,
  "q": "hello world"
}`,
    inputPlaceholderQuery: 'a=1&b[]=2&b[]=3',
    inputPlaceholderJson: '{"a": 1, "b": [2, 3]}',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorParse: 'JSONの構文エラー: {message}',
    errorNotObject:
      'クエリ文字列にできるのはオブジェクトのJSONだけです。{ ... } の形式で入力してください。',
    errorDepth: 'ネストが深すぎて処理できません。',
    howToHeading: '使い方',
    howToSteps: [
      '「変換方向」でクエリ文字列からJSON、またはJSONからクエリ文字列を選びます。',
      '「入力」欄に変換元を貼り付けます。URL全体を貼ってもかまいません。',
      '配列の表記や型変換などのオプションを必要に応じて切り替えます。',
      '「変換結果」欄に結果が表示されるので、「コピー」で取り出します。',
    ],
    notesHeading: '注意事項',
    notes: [
      'クエリ文字列にはJSONのような型がないため、既定ではすべて文字列として出力します。数値や真偽値にしたいときは型変換をオンにします（007 や 1e3、15桁を超える整数は精度を守るため文字列のままです）。',
      'クエリ文字列の読み込みでは、b[] ・ b[0] ・ b=1&b=2 のどの配列表記も自動で判別します。JSONからの出力時だけ表記を選べます。',
      'オブジェクトを含む配列は、構造を保つため常に b[0][name] の添字表記で出力します。空の配列と空のオブジェクトは表現できないため出力されません。',
      'null は b のように = なしで出力し、型変換をオンにすると null に戻ります。',
      '括弧付きキーの解釈は qs（Node.js）や PHP の記法に準じますが、実装ごとに細部が異なるため、実際の送信先の仕様も確認してください。',
      '入力したデータはブラウザ内で処理され、サーバーには送信されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'クエリ文字列',
        description:
          'URLの ? の後ろに続く、key=value を & でつないだ部分です。Webフォームの送信や検索条件の受け渡しに使われます。',
      },
      {
        term: 'パーセントエンコード',
        description:
          'URLで使えない文字や特別な意味を持つ文字を、%E3%81%82 のように % と16進数で表す方式です。フォームの形式ではスペースを + で表すこともあります。',
      },
      {
        term: 'プロトタイプ汚染',
        description:
          '__proto__ などの特殊なキーを悪用して、オブジェクトの共通の性質を書き換える攻撃です。クエリ文字列のネスト解析でよく問題になります。このツールはプロトタイプを持たないオブジェクトで処理するため影響を受けません。',
      },
    ],
  },
  en: {
    title: 'Query String to JSON Converter (and JSON to Query String)',
    description:
      'Convert URL query strings to JSON and back. Supports a[b][c] nesting, b[] / b[0] / repeated-key arrays, type inference and encoding. Runs in your browser.',
    h1: 'Query String ⇔ JSON Converter',
    introHtml: `Turn a query string such as <code>a=1&amp;b[]=2&amp;b[]=3</code> into JSON, or JSON back into a query string. You can paste a leading <code>?</code> or a full URL and only the query part is used. To split and edit a single URL, use the <a href="/en/tools/url-parser/" ${link}>URL Parser</a>; to tidy the JSON, use the <a href="/en/tools/json-formatter/" ${link}>JSON Formatter</a>.`,
    directionLabel: 'Direction',
    directionOptions: [
      { value: 'q2j', label: 'Query string → JSON' },
      { value: 'j2q', label: 'JSON → Query string' },
    ],
    inferLabel: 'Convert numbers, true/false and null',
    plusLabel: 'Treat + as a space',
    arrayLabel: 'Array style',
    arrayOptions: [
      { value: 'bracket', label: 'b[]=1&b[]=2' },
      { value: 'index', label: 'b[0]=1&b[1]=2' },
      { value: 'repeat', label: 'b=1&b=2 (repeated key)' },
    ],
    encodeLabel: 'Encoding',
    encodeOptions: [
      { value: 'brackets', label: 'Encode all except [ ]' },
      { value: 'full', label: 'Encode everything' },
      { value: 'none', label: 'No encoding' },
    ],
    spacePlusLabel: 'Write spaces as +',
    leadingLabel: 'Add a leading ?',
    indentLabel: 'Indent',
    indentOptions: [
      { value: '2', label: '2 spaces' },
      { value: '4', label: '4 spaces' },
      { value: 'tab', label: 'Tab' },
      { value: '0', label: 'None (single line)' },
    ],
    inputLabel: 'Input',
    outputLabel: 'Result',
    sampleButton: 'Insert sample',
    sampleQuery:
      '?name=Taro&tags[]=a&tags[]=b&user[address][city]=Tokyo&age=30&q=hello+world',
    sampleJson: `{
  "name": "Taro",
  "tags": ["a", "b"],
  "user": { "address": { "city": "Tokyo" } },
  "age": 30,
  "q": "hello world"
}`,
    inputPlaceholderQuery: 'a=1&b[]=2&b[]=3',
    inputPlaceholderJson: '{"a": 1, "b": [2, 3]}',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorParse: 'Invalid JSON: {message}',
    errorNotObject:
      'Only a JSON object can become a query string. Enter it in the form { ... }.',
    errorDepth: 'The JSON is nested too deeply to process.',
    howToHeading: 'How to use',
    howToSteps: [
      'Pick query string to JSON, or JSON to query string, in "Direction".',
      'Paste the source into "Input". A full URL works too.',
      'Switch options such as array style or type conversion if you need them.',
      'The output appears in "Result"; take it with "Copy".',
    ],
    notesHeading: 'Notes',
    notes: [
      'A query string has no types, so by default every value is output as a string. Turn on type conversion to get numbers and booleans (007, 1e3 and integers over 15 digits stay strings to avoid losing precision).',
      'When reading a query string, b[], b[0] and b=1&b=2 are all recognized automatically. You only choose the style when writing one from JSON.',
      'Arrays that contain objects always use b[0][name] indexes so the structure survives. Empty arrays and empty objects cannot be represented and are omitted.',
      'null is written without an equals sign, as in b, and comes back as null when type conversion is on.',
      'Bracket keys follow the conventions of qs (Node.js) and PHP, but details differ between implementations, so check what your target server expects.',
      'Your data is processed in the browser and is never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Query string',
        description:
          'The part of a URL after the ?, made of key=value pairs joined by &. It carries form submissions and search filters.',
      },
      {
        term: 'Percent-encoding',
        description:
          'Writing characters that are unsafe or reserved in URLs as % plus hex digits, such as %E3%81%82. In form encoding a space may also appear as +.',
      },
      {
        term: 'Prototype pollution',
        description:
          'An attack that abuses special keys such as __proto__ to alter shared object behavior, a classic risk when parsing nested query strings. This tool builds results with prototype-less objects, so it is not affected.',
      },
    ],
  },
};
