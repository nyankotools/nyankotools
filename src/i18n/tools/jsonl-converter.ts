import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export interface JsonlConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  modeLabel: string;
  modeOptions: SelectOption[];
  delimiterLabel: string;
  delimiterOptions: SelectOption[];
  copyButton: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  /** モード（jsonlToJson 等）ごとの入力例 */
  placeholders: Record<string, string>;
  outputLabel: string;
  /** `{message}` を置換して使うテンプレート */
  errorTemplate: string;
  errorUnterminatedQuote: string;
  /** `{line}` `{expectedColumns}` `{actualColumns}` を置換して使うテンプレート */
  errorColumnMismatchTemplate: string;
  errorNotArray: string;
  /** `{index}` を置換して使うテンプレート */
  errorNotObjectTemplate: string;
  /** `{line}` `{message}` を置換して使うテンプレート */
  errorInvalidLineTemplate: string;
  /** `{line}` を置換して使うテンプレート */
  errorNotObjectLineTemplate: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const jsonlConverterContent: Record<Locale, JsonlConverterPageContent> =
  {
    ja: {
      title: 'JSONL（NDJSON）⇔JSON/CSV変換',
      description:
        'JSONL（NDJSON・JSON Lines）とJSON配列、CSVを相互に変換できる無料ツールです。ログ分析や機械学習データの整形に便利。空行の読み飛ばしや不正な行の行番号表示に対応。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: 'JSONL（NDJSON）⇔JSON/CSV変換ツール',
      introHtml:
        'JSONL（1行1JSONの形式。NDJSON・JSON Linesとも）とJSON配列、CSVを相互に変換します。ログ分析や機械学習の学習データ、BigQueryなどへのインポート用データの整形に便利です。JSONとCSVだけを変換したい場合は <a href="/tools/csv-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSV⇔JSON変換</a> もご利用ください。',
      modeLabel: '変換方向',
      modeOptions: [
        { value: 'jsonlToJson', label: 'JSONL → JSON配列' },
        { value: 'jsonToJsonl', label: 'JSON配列 → JSONL' },
        { value: 'jsonlToCsv', label: 'JSONL → CSV' },
        { value: 'csvToJsonl', label: 'CSV → JSONL' },
      ],
      delimiterLabel: '区切り文字',
      delimiterOptions: [
        { value: ',', label: 'カンマ ( , )' },
        { value: 'tab', label: 'タブ' },
      ],
      copyButton: 'コピー',
      copied: 'コピーしました',
      copyFailed: 'コピーに失敗しました',
      inputLabel: '入力',
      placeholders: {
        jsonlToJson:
          '{"name": "Taro", "age": 30}\n{"name": "Hanako", "age": 25}',
        jsonToJsonl:
          '[{"name": "Taro", "age": 30}, {"name": "Hanako", "age": 25}]',
        jsonlToCsv:
          '{"name": "Taro", "age": 30}\n{"name": "Hanako", "age": 25}',
        csvToJsonl: 'name,age\nTaro,30\nHanako,25',
      },
      outputLabel: '結果',
      errorTemplate: 'エラー: {message}',
      errorUnterminatedQuote: '引用符（"）が閉じられていません。',
      errorColumnMismatchTemplate:
        '{line}行目: 列数がヘッダーと一致しません（ヘッダー: {expectedColumns}列、データ: {actualColumns}列）',
      errorNotArray: 'JSONは配列である必要があります（例: [{"a": 1}]）。',
      errorNotObjectTemplate:
        '{index}番目の要素: 配列の各要素はオブジェクトである必要があります（例: {"a": 1}）。',
      errorInvalidLineTemplate:
        '{line}行目: JSONとして読み取れません（{message}）',
      errorNotObjectLineTemplate:
        '{line}行目: CSVに変換するには、各行がオブジェクトである必要があります（例: {"a": 1}）。',
      notesHeading: '注意事項',
      notes: [
        'JSONLは1行に1つのJSON値を書く形式です。空行は読み飛ばされ、不正な行があると元の行番号つきでエラーになります。',
        'JSONL→CSVでは、各行がオブジェクトである必要があります。全行のキーを出現順にまとめて列にし、無いキーのセルは空になります。ネストした値はJSON文字列としてセルに入ります。',
        'CSV→JSONLでは、1行目をヘッダー（キー）として使い、すべての値が文字列として出力されます。数値や真偽値には変換されません。',
        'JSON配列→JSONLは、JSONの最上位が配列である場合のみ対応しています。',
        '数値はJavaScriptの数値として読み込まれるため、非常に大きな整数（約16桁を超えるID等）は精度が落ち、1.0は1のように表記が変わることがあります。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'JSONL（JSON Lines）',
          description:
            '1行に1つのJSON値を書き、改行で区切るテキスト形式です。ファイル全体を読み込まなくても1行ずつ処理でき、追記もしやすいため、ログや大量データの受け渡しに使われます。',
        },
        {
          term: 'NDJSON',
          description:
            'Newline Delimited JSON の略で、JSONLとほぼ同じ形式を指します。1行1JSONで、改行（\\n）で区切ります。',
        },
        {
          term: 'JSON配列',
          description:
            '[ ] で囲み、要素をカンマで区切るJSONの形式です。全体で1つのJSON値になるため、ストリーム処理には向きません。',
        },
      ],
    },
    en: {
      title: 'JSONL (NDJSON) to JSON / CSV Converter',
      description:
        'Convert JSONL (NDJSON) to and from a JSON array or CSV for log analysis and ML data. Skips blank lines. Runs in your browser; nothing is sent to a server.',
      h1: 'JSONL (NDJSON) ⇔ JSON / CSV Converter',
      introHtml:
        'Convert JSONL (one JSON value per line, also called NDJSON or JSON Lines) to and from a JSON array or CSV. It is handy for preparing log data, machine-learning datasets and BigQuery imports. If you only need JSON and CSV, try the <a href="/en/tools/csv-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSV to JSON Converter</a>.',
      modeLabel: 'Direction',
      modeOptions: [
        { value: 'jsonlToJson', label: 'JSONL → JSON array' },
        { value: 'jsonToJsonl', label: 'JSON array → JSONL' },
        { value: 'jsonlToCsv', label: 'JSONL → CSV' },
        { value: 'csvToJsonl', label: 'CSV → JSONL' },
      ],
      delimiterLabel: 'Delimiter',
      delimiterOptions: [
        { value: ',', label: 'Comma ( , )' },
        { value: 'tab', label: 'Tab' },
      ],
      copyButton: 'Copy',
      copied: 'Copied',
      copyFailed: 'Copy failed',
      inputLabel: 'Input',
      placeholders: {
        jsonlToJson:
          '{"name": "Taro", "age": 30}\n{"name": "Hanako", "age": 25}',
        jsonToJsonl:
          '[{"name": "Taro", "age": 30}, {"name": "Hanako", "age": 25}]',
        jsonlToCsv:
          '{"name": "Taro", "age": 30}\n{"name": "Hanako", "age": 25}',
        csvToJsonl: 'name,age\nTaro,30\nHanako,25',
      },
      outputLabel: 'Result',
      errorTemplate: 'Error: {message}',
      errorUnterminatedQuote: 'An opening double quote (") is never closed.',
      errorColumnMismatchTemplate:
        "Line {line}: column count doesn't match the header (header: {expectedColumns}, data: {actualColumns}).",
      errorNotArray: 'The JSON must be an array (e.g. [{"a": 1}]).',
      errorNotObjectTemplate:
        'Item {index}: each array element must be an object (e.g. {"a": 1}).',
      errorInvalidLineTemplate: 'Line {line}: not valid JSON ({message})',
      errorNotObjectLineTemplate:
        'Line {line}: each line must be an object to convert to CSV (e.g. {"a": 1}).',
      notesHeading: 'Notes',
      notes: [
        'JSONL has one JSON value per line. Blank lines are skipped, and an invalid line is reported with its original line number.',
        'JSONL to CSV requires every line to be an object. Columns are the union of all keys in order of first appearance, and missing keys leave the cell empty. Nested values are placed in the cell as JSON strings.',
        'CSV to JSONL uses the first row as the header (keys), and every value is output as a string. Numbers and booleans are not converted.',
        'JSON array to JSONL only works when the top level of the JSON is an array.',
        'Numbers are read as JavaScript numbers, so very large integers (IDs beyond about 16 digits) lose precision and 1.0 is written as 1.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'JSONL (JSON Lines)',
          description:
            'A text format with one JSON value per line, separated by newlines. It can be processed line by line without loading the whole file and is easy to append to, so it is used for logs and large datasets.',
        },
        {
          term: 'NDJSON',
          description:
            'Short for Newline Delimited JSON, essentially the same format as JSONL: one JSON value per line, separated by a newline (\\n).',
        },
        {
          term: 'JSON array',
          description:
            'A JSON value wrapped in [ ] with comma-separated elements. The whole file is a single JSON value, so it is not suited to stream processing.',
        },
      ],
    },
  };
