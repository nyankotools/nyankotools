import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export interface CsvJsonConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  modeAriaLabel: string;
  modeCsvToJson: string;
  modeJsonToCsv: string;
  delimiterLabel: string;
  delimiterOptions: SelectOption[];
  copyButton: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  inputPlaceholderCsvToJson: string;
  inputPlaceholderJsonToCsv: string;
  outputLabel: string;
  /** `{message}` を置換して使うテンプレート */
  errorTemplate: string;
  errorUnterminatedQuote: string;
  /** `{line}` `{expectedColumns}` `{actualColumns}` を置換して使うテンプレート */
  errorColumnMismatchTemplate: string;
  errorNotArray: string;
  /** `{index}` を置換して使うテンプレート */
  errorNotObjectTemplate: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const csvJsonConverterContent: Record<
  Locale,
  CsvJsonConverterPageContent
> = {
  ja: {
    title: 'CSV⇔JSON変換',
    description:
      'CSVとJSONを相互に変換できる無料ツールです。スプレッドシートからエクスポートしたCSVをAPI用のJSONに変換したい時などに便利。カンマ・タブ区切りや引用符付きフィールドにも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSV⇔JSON変換ツール',
    introHtml:
      'CSVを入力するとJSON配列に、JSON配列を入力するとCSVに変換します。ヘッダー行をキーとして使うので、ExcelやスプレッドシートからエクスポートしたデータをそのままAPI用のJSONに変換したい時などに便利です。変換後のJSONをさらに整形・検証したい場合は <a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a> もあわせてご利用ください。',
    modeAriaLabel: '変換方向',
    modeCsvToJson: 'CSV→JSON',
    modeJsonToCsv: 'JSON→CSV',
    delimiterLabel: '区切り文字',
    delimiterOptions: [
      { value: ',', label: 'カンマ ( , )' },
      { value: 'tab', label: 'タブ' },
    ],
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: '入力',
    inputPlaceholderCsvToJson: 'name,age\nTaro,30\nHanako,25',
    inputPlaceholderJsonToCsv:
      '[{"name": "Taro", "age": 30}, {"name": "Hanako", "age": 25}]',
    outputLabel: '結果',
    errorTemplate: 'エラー: {message}',
    errorUnterminatedQuote: '引用符（"）が閉じられていません。',
    errorColumnMismatchTemplate:
      '{line}行目: 列数がヘッダーと一致しません（ヘッダー: {expectedColumns}列、データ: {actualColumns}列）',
    errorNotArray: 'JSONは配列である必要があります（例: [{"a": 1}]）。',
    errorNotObjectTemplate:
      '{index}番目の要素: 配列の各要素はオブジェクトである必要があります（例: {"a": 1}）。',
    notesHeading: '注意事項',
    notes: [
      'CSVの1行目はヘッダー（キー）として扱われます。データ行の列数がヘッダーと異なるとエラーになります。',
      'CSVからJSONへの変換では、すべての値が文字列として出力されます。数値や真偽値には変換されません。',
      'JSONからCSVへの変換は、オブジェクトの配列のみ対応しています。ネストしたオブジェクトや配列を含む値は、JSON文字列としてセルに入ります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'CSV',
        description:
          'Comma-Separated Values の略で、カンマ（または他の区切り文字）で列を区切ってデータを表現するテキスト形式です。Excelやスプレッドシートのエクスポート形式として広く使われています。',
      },
      {
        term: 'JSON',
        description:
          'JavaScript Object Notation の略で、データをキーと値の組み合わせで表現するテキスト形式です。APIのやり取りや設定ファイルなど、幅広い場面で使われています。',
      },
      {
        term: 'ヘッダー行',
        description:
          'CSVの1行目に置かれる、各列の名前を表す行です。このツールはヘッダー行の値をJSONのキーとして使用します。',
      },
      {
        term: '引用符（クオート）',
        description:
          'CSVでフィールドの値にカンマや改行を含める場合、ダブルクォート（"）でフィールド全体を囲みます。値中のダブルクォートは2つ並べる（""）ことでエスケープします。',
      },
    ],
  },
  en: {
    title: 'CSV to JSON Converter',
    description:
      'Free online tool to convert between CSV and JSON, handy for turning a spreadsheet export into JSON for an API. Supports comma/tab delimiters and quoted fields. Your data is processed in the browser and never sent to a server.',
    h1: 'CSV ⇔ JSON Converter',
    introHtml:
      'Paste CSV to convert it to a JSON array, or paste a JSON array to convert it to CSV. The header row is used as the JSON keys, which is handy when you want to turn a spreadsheet export straight into JSON for an API. To further format or validate the resulting JSON, try the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a> as well.',
    modeAriaLabel: 'Direction',
    modeCsvToJson: 'CSV→JSON',
    modeJsonToCsv: 'JSON→CSV',
    delimiterLabel: 'Delimiter',
    delimiterOptions: [
      { value: ',', label: 'Comma ( , )' },
      { value: 'tab', label: 'Tab' },
    ],
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabel: 'Input',
    inputPlaceholderCsvToJson: 'name,age\nTaro,30\nHanako,25',
    inputPlaceholderJsonToCsv:
      '[{"name": "Taro", "age": 30}, {"name": "Hanako", "age": 25}]',
    outputLabel: 'Result',
    errorTemplate: 'Error: {message}',
    errorUnterminatedQuote: 'An opening double quote (") is never closed.',
    errorColumnMismatchTemplate:
      "Line {line}: column count doesn't match the header (header: {expectedColumns}, data: {actualColumns}).",
    errorNotArray: 'The JSON must be an array (e.g. [{"a": 1}]).',
    errorNotObjectTemplate:
      'Item {index}: each array element must be an object (e.g. {"a": 1}).',
    notesHeading: 'Notes',
    notes: [
      'The first CSV row is treated as the header (keys). A data row with a different number of columns causes an error.',
      'When converting CSV to JSON, every value is output as a string. Numbers and booleans are not converted.',
      'JSON to CSV only supports arrays of objects. Nested objects and arrays are placed in the cell as JSON strings.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'CSV',
        description:
          'Short for Comma-Separated Values, a text format that separates columns with a comma (or another delimiter). Widely used as the export format for spreadsheets like Excel.',
      },
      {
        term: 'JSON',
        description:
          'Short for JavaScript Object Notation, a text format for representing data as key-value pairs. It is widely used for APIs and configuration files.',
      },
      {
        term: 'Header row',
        description:
          "The first row of a CSV file, containing the name of each column. This tool uses the header row's values as the JSON keys.",
      },
      {
        term: 'Quoting',
        description:
          'When a CSV field contains a comma or a newline, the whole field is wrapped in double quotes ("). A double quote inside the value is escaped by doubling it ("").',
      },
    ],
  },
};
