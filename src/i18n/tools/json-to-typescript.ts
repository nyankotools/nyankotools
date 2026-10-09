import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface JsonToTypeScriptPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  languageLabel: string;
  languages: { id: string; label: string }[];
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  rootNameLabel: string;
  styleLabel: string;
  styleInterfaceLabel: string;
  styleTypeLabel: string;
  exportLabel: string;
  outputLabel: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  errorInvalidJson: string;
  errorTooDeep: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const jsonToTypeScriptContent: Record<
  Locale,
  JsonToTypeScriptPageContent
> = {
  ja: {
    title: 'JSON→型定義生成（TypeScript・C#・Go・Python・Java）',
    description:
      'JSONからTypeScriptのinterface・type、C#のクラス、Goの構造体、Pythonのdataclass、Javaのrecordを自動生成する無料ツールです。ネストしたオブジェクトや配列、省略可能なプロパティ、null許容に対応。APIレスポンスの型づけに。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'JSON→型定義生成（TypeScript・C#・Go・Python・Java）',
    introHtml:
      'JSONを貼り付けると、その形に合う型定義を TypeScript（<code>interface</code> / <code>type</code>）、C#（クラス）、Go（構造体）、Python（<code>dataclass</code>）、Java（<code>record</code>）のいずれかで生成します。APIのレスポンス例から型やモデルクラスを起こしたいときに便利です。ネストしたオブジェクトは別の型として切り出し、配列内で欠けているキーは省略可能（TypeScriptなら <code>?</code>）にします。JSONの検証・整形は <a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a> もご利用ください。',
    languages: [
      { id: 'typescript', label: 'TypeScript' },
      { id: 'csharp', label: 'C#' },
      { id: 'go', label: 'Go' },
      { id: 'python', label: 'Python' },
      { id: 'java', label: 'Java' },
    ],
    languageLabel: '出力する言語',
    inputLabel: 'JSON',
    inputPlaceholder: '{"id": 1, "name": "Taro", "tags": ["a", "b"]}',
    sampleText: `{
  "id": 1,
  "name": "Taro",
  "email": null,
  "tags": ["admin", "dev"],
  "address": { "city": "Tokyo", "zip": "100-0001" },
  "orders": [
    { "id": 10, "price": 1200 },
    { "id": 11, "price": 800, "coupon": "SALE" }
  ]
}`,
    rootNameLabel: 'ルートの型名',
    styleLabel: 'TypeScriptの宣言形式',
    styleInterfaceLabel: 'interface',
    styleTypeLabel: 'type',
    exportLabel: 'exportを付ける',
    outputLabel: '生成した型定義',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorInvalidJson:
      'JSONとして解釈できません。カンマ・引用符・括弧の対応を確認してください。',
    errorTooDeep: 'ネストが深すぎて処理できません。',
    notesHeading: '注意事項',
    notes: [
      '型は貼り付けたJSONの値から推測します。サンプルに現れない値（別の型になりうるフィールドなど）は反映されないため、生成結果は仕様に合わせて調整してください。',
      '配列は全要素の型を1つにまとめます。キーが一部の要素にしかなければ省略可能になります（TypeScriptは ?、C#は T?、Goはポインタと omitempty、Pythonは「T | None = None」、Javaは参照型）。',
      '要素ごとに値の型が違う配列は、TypeScriptでは (number | string)[] のようなユニオン型になります。C#・Go・Python・Javaには同等の型がないため object / any / Any / Object になります。',
      '空の配列は要素の型が分からないため、TypeScriptでは unknown[]、他の言語では object / any / Any / Object のリストになります。null の値も同様です。実際に取りうる型は手で書き換えてください。',
      'C#・Go・Python・Java では、小数点のない数値を整数型（long / int64 / int）、小数点のある数値を浮動小数点型（double / float64 / float）にします。サンプルで 1 と書かれていても実際は小数になりうる項目は、手で直してください。TypeScript はすべて number です。',
      'キー名が各言語の命名規則と異なる場合（例: user_id）は、プロパティ名を変換し、元のキー名を C# は [JsonPropertyName]、Go は json タグ、Java は @JsonProperty（Jackson）、Python はコメントに残します。Python の dataclass は JSON のキー名を自動では対応付けないため、読み込み時に変換が必要です。',
      'Python の出力は型ヒントに「|」を使うため Python 3.10 以降、Java の出力は record を使うため Java 16 以降が前提です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'interface',
        description:
          'オブジェクトの形（プロパティの名前と型）を表すTypeScriptの型定義です。継承や宣言のマージができます。',
      },
      {
        term: 'type（型エイリアス）',
        description:
          '型に別名を付ける構文です。オブジェクトの形のほか、ユニオン型やタプルなども表せます。オブジェクトの形ならinterfaceとほぼ同じ用途で使えます。',
      },
      {
        term: 'ユニオン型',
        description:
          '「stringまたはnumber」のように、複数の型のどれかを取りうることを表す型です。string | number と書きます。',
      },
      {
        term: '省略可能プロパティ',
        description:
          'プロパティ名の後ろに ? を付けた、値がなくてもよいプロパティです。型としては T | undefined を取ります。',
      },
      {
        term: 'dataclass / record',
        description:
          'データを保持するだけのクラスを簡潔に書く構文です。Python の dataclass と Java の record が該当し、コンストラクタなどを自動で用意してくれます。',
      },
    ],
  },
  en: {
    title: 'JSON to Types Converter (TypeScript, C#, Go, Python, Java)',
    description:
      'Generate TypeScript types, C# classes, Go structs, Python dataclasses, or Java records from JSON, with nesting and optional fields. Runs in your browser.',
    h1: 'JSON to Types Converter (TypeScript, C#, Go, Python, Java)',
    introHtml:
      'Paste JSON and get matching type definitions as TypeScript (<code>interface</code> / <code>type</code>), C# classes, Go structs, Python <code>dataclass</code>es, or Java <code>record</code>s. Handy for turning an API response example into types or model classes. Nested objects become their own types, and keys missing from some array items become optional (<code>?</code> in TypeScript). To validate or pretty-print the JSON first, use the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a>.',
    languages: [
      { id: 'typescript', label: 'TypeScript' },
      { id: 'csharp', label: 'C#' },
      { id: 'go', label: 'Go' },
      { id: 'python', label: 'Python' },
      { id: 'java', label: 'Java' },
    ],
    languageLabel: 'Output language',
    inputLabel: 'JSON',
    inputPlaceholder: '{"id": 1, "name": "Taro", "tags": ["a", "b"]}',
    sampleText: `{
  "id": 1,
  "name": "Taro",
  "email": null,
  "tags": ["admin", "dev"],
  "address": { "city": "Tokyo", "zip": "100-0001" },
  "orders": [
    { "id": 10, "price": 1200 },
    { "id": 11, "price": 800, "coupon": "SALE" }
  ]
}`,
    rootNameLabel: 'Root type name',
    styleLabel: 'TypeScript declaration style',
    styleInterfaceLabel: 'interface',
    styleTypeLabel: 'type',
    exportLabel: 'Add export',
    outputLabel: 'Generated types',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorInvalidJson:
      'This is not valid JSON. Check the commas, quotes, and brackets.',
    errorTooDeep: 'The JSON is nested too deeply to process.',
    notesHeading: 'Notes',
    notes: [
      'Types are inferred from the values in the JSON you paste. Fields that could hold other types but do not in your sample are not reflected, so adjust the result to match your spec.',
      'All items of an array are merged into one type. Keys present in only some items become optional (? in TypeScript, T? in C#, a pointer with omitempty in Go, "T | None = None" in Python, a reference type in Java).',
      'Arrays with mixed value types become a union such as (number | string)[] in TypeScript. C#, Go, Python, and Java have no equivalent, so they use object / any / Any / Object.',
      'An empty array has no known element type, so it becomes unknown[] in TypeScript and a list of object / any / Any / Object elsewhere. A null value is handled the same way. Edit these by hand to the types the field can really take.',
      'For C#, Go, Python, and Java, numbers without a decimal point become integer types (long / int64 / int) and numbers with one become floating-point types (double / float64 / float). If a field written as 1 in your sample can really be fractional, fix it by hand. TypeScript uses number for everything.',
      'When a key does not match the naming convention of the language (for example user_id), the property name is converted and the original key is kept in [JsonPropertyName] for C#, a json tag for Go, @JsonProperty (Jackson) for Java, and a comment for Python. A Python dataclass does not map JSON keys by itself, so convert them when loading.',
      'The Python output uses "|" in type hints, so it needs Python 3.10 or later; the Java output uses records, so it needs Java 16 or later.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'interface',
        description:
          'A TypeScript declaration that describes the shape of an object (property names and types). It supports extending and declaration merging.',
      },
      {
        term: 'type alias',
        description:
          'A name for a type. It can describe object shapes as well as unions, tuples, and more. For plain object shapes it is used almost like an interface.',
      },
      {
        term: 'Union type',
        description:
          'A type that can be one of several types, such as "string or number". Written string | number.',
      },
      {
        term: 'Optional property',
        description:
          'A property marked with ? after its name, which may be absent. Its type includes undefined.',
      },
      {
        term: 'dataclass / record',
        description:
          'A concise way to write a class that only holds data. Python has dataclass and Java has record; both generate the constructor and related boilerplate for you.',
      },
    ],
  },
};
