import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SampleBook {
  title: string;
  price: number;
}

export interface JsonPathTesterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  jsonDataLabel: string;
  queryFormatLabel: string;
  modeJsonPathLabel: string;
  modePointerLabel: string;
  queryLabel: string;
  jsonPathHintHtml: string;
  pointerHintHtml: string;
  jsonPathPlaceholder: string;
  pointerPlaceholder: string;
  resultColumnIndex: string;
  resultColumnPath: string;
  resultColumnValue: string;
  notesHeading: string;
  note1Html: string;
  note2: string;
  note3Html: string;
  noteClientSideOnly: string;
  /** `{message}` を置換して使うテンプレート */
  errorInvalidJsonTemplate: string;
  /** `{message}` を置換して使うテンプレート */
  errorInvalidJsonPathTemplate: string;
  pointerErrorInvalidFormat: string;
  /** `{path}` を置換して使うテンプレート */
  pointerErrorTrailingDashTemplate: string;
  /** `{path}` `{token}` を置換して使うテンプレート */
  pointerErrorInvalidArrayIndexTemplate: string;
  /** `{path}` `{length}` を置換して使うテンプレート */
  pointerErrorIndexOutOfRangeTemplate: string;
  /** `{path}` `{key}` を置換して使うテンプレート */
  pointerErrorKeyNotFoundTemplate: string;
  /** `{path}` を置換して使うテンプレート */
  pointerErrorNotTraversableTemplate: string;
  /** `{pointer}` を置換して使うテンプレート */
  pointerLineTemplate: string;
  /** `{count}` を置換して使うテンプレート（1件の場合） */
  statusMatchSingularTemplate: string;
  /** `{count}` を置換して使うテンプレート（複数件の場合） */
  statusMatchPluralTemplate: string;
  statusPointerMatch: string;
  rootLabel: string;
  sampleBooks: SampleBook[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const jsonPathTesterContent: Record<Locale, JsonPathTesterPageContent> =
  {
    ja: {
      title: 'JSON Path / JSON Pointerテスター（オンライン検証）',
      description:
        'JSONPathやJSON Pointer（RFC 6901）のクエリをブラウザ上でその場に検証できる無料ツールです。JSONデータとクエリを入力するだけで、マッチした値と絶対パスを一覧表示します。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: 'JSON Path / JSON Pointerテスター',
      introHtml:
        'JSONデータとクエリ（JSONPathまたはJSON Pointer）を入力すると、マッチした値とその絶対パスを一覧表示します。APIレスポンスから特定の値を取り出すクエリの動作確認や、jq・各種JSONPathライブラリに渡す式の事前検証に便利です。JSON自体の整形や構文チェックをしたい場合は <a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a> もあわせてご利用ください。',
      jsonDataLabel: 'JSONデータ',
      queryFormatLabel: 'クエリ形式',
      modeJsonPathLabel: 'JSONPath',
      modePointerLabel: 'JSON Pointer（RFC 6901）',
      queryLabel: 'クエリ',
      jsonPathHintHtml: '例: <code>$.store.book[*].title</code>',
      pointerHintHtml: '例: <code>/store/book/0/title</code>',
      jsonPathPlaceholder: '$.store.book[*].title',
      pointerPlaceholder: '/store/book/0/title',
      resultColumnIndex: '#',
      resultColumnPath: 'パス',
      resultColumnValue: '値',
      notesHeading: '注意点',
      note1Html:
        'JSONPathは <a href="https://github.com/s3u/JSONPath" target="_blank" rel="noopener noreferrer" class="text-blue-700 underline hover:no-underline dark:text-blue-400">jsonpath-plus</a> ライブラリの実装に準拠します。フィルタ式（<code>[?(@.price&gt;10)]</code>）や再帰下降（<code>..</code>）を含む拡張構文に対応しますが、実装によって細部の挙動が異なる場合があります。',
      note2:
        'JSON Pointerは1箇所だけを指す記法のため、常に単一の結果（またはエラー）になります。複数の値をまとめて取得したい場合はJSONPathを使用してください。',
      note3Html:
        'JSON Pointerの先頭に <code>#</code> が付いた形式（例: OpenAPI/JSON Schemaの<code>$ref: "#/components/schemas/Foo"</code>）も、その <code>#</code> を読み飛ばして解釈します。',
      noteClientSideOnly:
        'すべての処理はブラウザ内で完結しており、入力したJSONやクエリがサーバーに送信されることはありません。',
      errorInvalidJsonTemplate: 'JSONの構文エラー: {message}',
      errorInvalidJsonPathTemplate: 'JSONPathが不正です: {message}',
      pointerErrorInvalidFormat:
        'JSON Pointerは空文字列か "/" から始まる必要があります。',
      pointerErrorTrailingDashTemplate:
        '"{path}": "-" は末尾への追加位置を指すため、既存の値を参照できません。',
      pointerErrorInvalidArrayIndexTemplate:
        '"{path}": 配列のインデックスが不正です（"{token}"）。',
      pointerErrorIndexOutOfRangeTemplate:
        '"{path}": インデックスが範囲外です（配列の長さ: {length}）。',
      pointerErrorKeyNotFoundTemplate:
        '"{path}": キー "{key}" が見つかりません。',
      pointerErrorNotTraversableTemplate:
        '"{path}": これ以上たどれません（オブジェクトでも配列でもない値です）。',
      pointerLineTemplate: 'Pointer: {pointer}',
      statusMatchSingularTemplate: '{count}件マッチしました。',
      statusMatchPluralTemplate: '{count}件マッチしました。',
      statusPointerMatch: '1件マッチしました。',
      rootLabel: '(ルート)',
      sampleBooks: [
        { title: '吾輩は猫である', price: 800 },
        { title: '坊っちゃん', price: 700 },
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'JSONPath',
          description:
            'JSONデータの中から特定の値を指し示すためのクエリ言語です。`$.store.book[0].title` のように、XPathのJSON版に近い記法でオブジェクトや配列の階層をたどれます。`$` はルート、`.` はプロパティ、`[*]` はワイルドカード（すべての要素）、`..` は再帰下降（階層を問わず一致するものをすべて検索）を表します。',
        },
        {
          term: 'JSON Pointer',
          description:
            'RFC 6901で定義された、JSON内の1箇所を指し示すためのシンプルな記法です。`/store/book/0/title` のように "/" 区切りでキーや配列インデックスをたどります。JSONPathと異なり複数マッチやワイルドカードには対応せず、常に1箇所だけを指します。キーに含まれる "/" は "~1"、"~" は "~0" としてエスケープします。',
        },
        {
          term: 'フィルタ式',
          description:
            'JSONPathで `[?(@.price > 10)]` のように条件付きで要素を絞り込む記法です。`@` は現在たどっている要素自身を表します。',
        },
      ],
    },
    en: {
      title: 'JSON Path / JSON Pointer Tester (Online Validator)',
      description:
        'A free tool for testing JSONPath and JSON Pointer (RFC 6901) queries live in your browser. Enter your JSON data and a query to see every matched value and its absolute path. Your data is processed in the browser and never sent to a server.',
      h1: 'JSON Path / JSON Pointer Tester',
      introHtml:
        'Enter some JSON data and a query (JSONPath or JSON Pointer) to see every matched value along with its absolute path. Handy for checking a query before pulling a value out of an API response, or for validating an expression before passing it to jq or a JSONPath library. To format or validate JSON itself, also try the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a> tool.',
      jsonDataLabel: 'JSON data',
      queryFormatLabel: 'Query format',
      modeJsonPathLabel: 'JSONPath',
      modePointerLabel: 'JSON Pointer (RFC 6901)',
      queryLabel: 'Query',
      jsonPathHintHtml: 'e.g. <code>$.store.book[*].title</code>',
      pointerHintHtml: 'e.g. <code>/store/book/0/title</code>',
      jsonPathPlaceholder: '$.store.book[*].title',
      pointerPlaceholder: '/store/book/0/title',
      resultColumnIndex: '#',
      resultColumnPath: 'Path',
      resultColumnValue: 'Value',
      notesHeading: 'Notes',
      note1Html:
        'JSONPath follows the <a href="https://github.com/s3u/JSONPath" target="_blank" rel="noopener noreferrer" class="text-blue-700 underline hover:no-underline dark:text-blue-400">jsonpath-plus</a> library implementation. Extended syntax such as filter expressions (<code>[?(@.price&gt;10)]</code>) and recursive descent (<code>..</code>) is supported, though exact behavior can vary between implementations.',
      note2:
        'A JSON Pointer always points to exactly one location, so it always produces a single result (or an error). Use JSONPath if you need to collect multiple values at once.',
      note3Html:
        'A JSON Pointer with a leading <code>#</code> (the URI fragment form used in OpenAPI/JSON Schema, e.g. <code>$ref: "#/components/schemas/Foo"</code>) is also accepted — the <code>#</code> is simply stripped.',
      noteClientSideOnly:
        'Everything runs entirely in your browser — the JSON and query you enter are never sent to a server.',
      errorInvalidJsonTemplate: 'Invalid JSON: {message}',
      errorInvalidJsonPathTemplate: 'Invalid JSONPath: {message}',
      pointerErrorInvalidFormat:
        'A JSON Pointer must be empty or start with "/".',
      pointerErrorTrailingDashTemplate:
        '"{path}": "-" points to the append position and cannot be dereferenced.',
      pointerErrorInvalidArrayIndexTemplate:
        '"{path}": invalid array index ("{token}").',
      pointerErrorIndexOutOfRangeTemplate:
        '"{path}": index out of range (array length: {length}).',
      pointerErrorKeyNotFoundTemplate: '"{path}": key "{key}" not found.',
      pointerErrorNotTraversableTemplate:
        '"{path}": cannot go further (the value is neither an object nor an array).',
      pointerLineTemplate: 'Pointer: {pointer}',
      statusMatchSingularTemplate: '{count} match found.',
      statusMatchPluralTemplate: '{count} matches found.',
      statusPointerMatch: '1 match found.',
      rootLabel: '(root)',
      sampleBooks: [
        { title: 'The Great Gatsby', price: 12 },
        { title: 'Moby Dick', price: 15 },
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'JSONPath',
          description:
            'A query language for pointing to specific values inside JSON data, similar to XPath for XML. `$.store.book[0].title` walks down the object/array hierarchy: `$` is the root, `.` accesses a property, `[*]` is a wildcard (every element), and `..` is recursive descent (matches at any depth).',
        },
        {
          term: 'JSON Pointer',
          description:
            'A simple notation defined in RFC 6901 for pointing to a single location in JSON. `/store/book/0/title` walks down keys and array indices separated by "/". Unlike JSONPath it has no wildcards and always points to exactly one location. A literal "/" in a key is escaped as "~1" and "~" as "~0".',
        },
        {
          term: 'Filter expression',
          description:
            'A JSONPath syntax for narrowing down elements with a condition, such as `[?(@.price > 10)]`. `@` refers to the element currently being examined.',
        },
      ],
    },
  };
