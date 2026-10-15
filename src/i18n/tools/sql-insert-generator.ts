import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export interface SqlInsertGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  modeAriaLabel: string;
  modeCsv: string;
  modeJson: string;
  dialectLabel: string;
  dialectOptions: SelectOption[];
  tableNameLabel: string;
  tableNamePlaceholder: string;
  delimiterLabel: string;
  delimiterOptions: SelectOption[];
  hasHeaderLabel: string;
  emptyAsNullLabel: string;
  multiRowLabel: string;
  createTableLabel: string;
  columnTypesHeading: string;
  columnTypesHint: string;
  /** `{name}` を置換して使うテンプレート */
  columnTypeAriaTemplate: string;
  inputLabel: string;
  inputPlaceholderCsv: string;
  inputPlaceholderJson: string;
  outputLabel: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  /** `{rows}` `{columns}` を置換して使うテンプレート */
  summaryTemplate: string;
  /** `{message}` を置換して使うテンプレート */
  errorTemplate: string;
  errorEmpty: string;
  errorUnterminatedQuote: string;
  /** `{line}` `{expectedColumns}` `{actualColumns}` を置換して使うテンプレート */
  errorColumnMismatchTemplate: string;
  /** `{name}` を置換して使うテンプレート */
  errorDuplicateColumnTemplate: string;
  errorNotArray: string;
  /** `{index}` を置換して使うテンプレート */
  errorNotObjectTemplate: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const sqlInsertGeneratorContent: Record<
  Locale,
  SqlInsertGeneratorPageContent
> = {
  ja: {
    title: 'CSV/JSON→SQL INSERT文生成',
    description:
      'CSVまたはJSONからSQLのINSERT文（必要ならCREATE TABLE付き）を生成する無料ツール。MySQL・PostgreSQL・SQLite・SQL Server・Oracleに対応し、カラムの型を自動推定。複数行VALUESにも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSV/JSON→SQL INSERT文生成ツール',
    introHtml:
      'CSVまたはJSON配列を貼り付けると、テーブル名とSQL方言に合わせたINSERT文を生成します。数値・真偽値・文字列を自動判定し、CREATE TABLE文も出力できます。生成したSQLの整形は <a href="/tools/sql-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">SQL整形</a>、元データの形式変換は <a href="/tools/csv-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSV⇔JSON変換</a> もご利用ください。',
    modeAriaLabel: '入力形式',
    modeCsv: 'CSV',
    modeJson: 'JSON',
    dialectLabel: 'SQL方言',
    dialectOptions: [
      { value: 'mysql', label: 'MySQL' },
      { value: 'postgresql', label: 'PostgreSQL' },
      { value: 'sqlite', label: 'SQLite' },
      { value: 'sqlserver', label: 'SQL Server' },
      { value: 'oracle', label: 'Oracle' },
    ],
    tableNameLabel: 'テーブル名',
    tableNamePlaceholder: 'my_table',
    delimiterLabel: '区切り文字',
    delimiterOptions: [
      { value: ',', label: 'カンマ ( , )' },
      { value: 'tab', label: 'タブ' },
    ],
    hasHeaderLabel: '1行目をカラム名として使う',
    emptyAsNullLabel: '空欄をNULLにする',
    multiRowLabel: '複数行VALUESにまとめる',
    createTableLabel: 'CREATE TABLE文も出力する',
    columnTypesHeading: 'カラムの型',
    columnTypesHint:
      '空欄なら推定した型（薄字）を使います。型は直接入力するか、候補から選べます。INSERT文の値の書き方は変わりません。',
    columnTypeAriaTemplate: '{name} の型',
    inputLabel: '入力',
    inputPlaceholderCsv: 'id,name,age\n1,Taro,30\n2,Hanako,25',
    inputPlaceholderJson:
      '[{"id": 1, "name": "Taro"}, {"id": 2, "name": "Hanako"}]',
    outputLabel: 'SQL',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    summaryTemplate: '{rows}行・{columns}',
    errorTemplate: 'エラー: {message}',
    errorEmpty: 'データ行がありません。',
    errorUnterminatedQuote: '引用符（"）が閉じられていません。',
    errorColumnMismatchTemplate:
      '{line}行目: 列数がヘッダーと一致しません（ヘッダー: {expectedColumns}列、データ: {actualColumns}列）',
    errorDuplicateColumnTemplate: 'カラム名「{name}」が重複しています。',
    errorNotArray:
      'JSONはオブジェクトの配列である必要があります（例: [{"a": 1}]）。',
    errorNotObjectTemplate:
      '{index}番目の要素: 配列の各要素はオブジェクトである必要があります（例: {"a": 1}）。',
    notesHeading: '注意事項',
    notes: [
      '型の推定は列全体の値から行います。すべて整数ならINT/BIGINT、小数を含めばDOUBLE、true/falseだけならBOOLEAN、それ以外は文字列です。先頭ゼロの値（007など）や、18桁を超える整数は文字列として扱います。',
      'テーブル名・カラム名は常に引用符で囲みます（MySQLはバッククォート、SQL Serverは角括弧、PostgreSQL・SQLite・Oracleはダブルクォート）。SQL Serverの文字列はNプレフィックス付き（N文字列）で出力します。「schema.table」はドットで分割してそれぞれ引用します。',
      'JSONでは、ネストしたオブジェクト・配列はJSON文字列として挿入します。キーが無い行はNULLになります。数値は一度JavaScriptの数値として読み込むため、桁数の大きい値は精度が落ちることがあります。',
      '複数行VALUESは1,000行ごとに別のINSERT文へ分割します（SQL Serverの1文あたり上限に合わせています）。Oracleは複数行VALUESが使えないためINSERT ALL形式で出力し、空文字列がNULLとして扱われる点にもご注意ください。生成したSQLは本番DBへ流す前に、必ずテスト環境で確認してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'INSERT文',
        description:
          'テーブルに新しい行を追加するSQL文です。INSERT INTO テーブル名 (カラム…) VALUES (値…) の形で書きます。',
      },
      {
        term: '複数行VALUES',
        description:
          '1つのINSERT文にVALUES句を複数並べて、まとめて行を追加する書き方です。1行ずつ実行するより高速になりやすい一方、1文が長くなりすぎるとDBの上限に当たることがあります。',
      },
      {
        term: 'SQL方言',
        description:
          'DBごとの文法の違いです。識別子の引用符（MySQLはバッククォート、PostgreSQLとSQLiteはダブルクォート）や、真偽値・型の名前が異なります。',
      },
      {
        term: 'NULL',
        description:
          '「値が存在しない」ことを表すSQLの特別な値です。空文字列とは別物として扱われます。',
      },
    ],
  },
  en: {
    title: 'CSV/JSON to SQL INSERT Generator',
    description:
      'Generate SQL INSERT statements from CSV or JSON for MySQL, PostgreSQL, SQLite, SQL Server and Oracle. Runs in your browser; nothing is uploaded.',
    h1: 'CSV/JSON to SQL INSERT Generator',
    introHtml:
      'Paste CSV or a JSON array to get INSERT statements for your table name and SQL dialect. Numbers, booleans and strings are detected automatically, and a CREATE TABLE statement can be included. To tidy the generated SQL, use the <a href="/en/tools/sql-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">SQL Formatter</a>; to reshape the source data first, try the <a href="/en/tools/csv-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSV ⇔ JSON Converter</a>.',
    modeAriaLabel: 'Input format',
    modeCsv: 'CSV',
    modeJson: 'JSON',
    dialectLabel: 'SQL dialect',
    dialectOptions: [
      { value: 'mysql', label: 'MySQL' },
      { value: 'postgresql', label: 'PostgreSQL' },
      { value: 'sqlite', label: 'SQLite' },
      { value: 'sqlserver', label: 'SQL Server' },
      { value: 'oracle', label: 'Oracle' },
    ],
    tableNameLabel: 'Table name',
    tableNamePlaceholder: 'my_table',
    delimiterLabel: 'Delimiter',
    delimiterOptions: [
      { value: ',', label: 'Comma ( , )' },
      { value: 'tab', label: 'Tab' },
    ],
    hasHeaderLabel: 'First row is the column names',
    emptyAsNullLabel: 'Treat empty fields as NULL',
    multiRowLabel: 'Combine rows into one multi-row VALUES',
    createTableLabel: 'Also output CREATE TABLE',
    columnTypesHeading: 'Column types',
    columnTypesHint:
      'Leave a field empty to use the inferred type (shown in gray). Type a value or pick a suggestion. How values are written in the INSERT statements does not change.',
    columnTypeAriaTemplate: 'Type of {name}',
    inputLabel: 'Input',
    inputPlaceholderCsv: 'id,name,age\n1,Taro,30\n2,Hanako,25',
    inputPlaceholderJson:
      '[{"id": 1, "name": "Taro"}, {"id": 2, "name": "Hanako"}]',
    outputLabel: 'SQL',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    summaryTemplate: '{rows} rows · {columns}',
    errorTemplate: 'Error: {message}',
    errorEmpty: 'There are no data rows.',
    errorUnterminatedQuote: 'An opening double quote (") is never closed.',
    errorColumnMismatchTemplate:
      "Line {line}: column count doesn't match the header (header: {expectedColumns}, data: {actualColumns}).",
    errorDuplicateColumnTemplate: 'The column name "{name}" appears twice.',
    errorNotArray: 'The JSON must be an array of objects (e.g. [{"a": 1}]).',
    errorNotObjectTemplate:
      'Item {index}: each array element must be an object (e.g. {"a": 1}).',
    notesHeading: 'Notes',
    notes: [
      'Types are inferred from the whole column: all integers become INT/BIGINT, any decimal becomes DOUBLE, only true/false becomes BOOLEAN, and everything else is text. Values with leading zeros (such as 007) and integers longer than 18 digits are kept as text.',
      'Table and column names are always quoted (backticks for MySQL, square brackets for SQL Server, double quotes for PostgreSQL, SQLite and Oracle). SQL Server strings are written as N-prefixed (national) literals. "schema.table" is split at the dot and each part is quoted.',
      'In JSON, nested objects and arrays are inserted as JSON strings, and missing keys become NULL. Numbers are first read as JavaScript numbers, so very large values may lose precision.',
      'Multi-row VALUES are split into a new INSERT every 1,000 rows (the SQL Server per-statement limit). Oracle has no multi-row VALUES, so INSERT ALL is used, and Oracle treats an empty string as NULL. Always try the generated SQL on a test database before running it against production.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'INSERT statement',
        description:
          'An SQL statement that adds new rows to a table, written as INSERT INTO table (columns…) VALUES (values…).',
      },
      {
        term: 'Multi-row VALUES',
        description:
          'Listing several value tuples in one INSERT to add many rows at once. It is usually faster than one statement per row, but an overly long statement can hit database limits.',
      },
      {
        term: 'SQL dialect',
        description:
          'The syntax differences between databases, such as identifier quoting (backticks in MySQL, double quotes in PostgreSQL and SQLite) and the names of types and boolean literals.',
      },
      {
        term: 'NULL',
        description:
          'The special SQL value meaning "no value". It is distinct from an empty string.',
      },
    ],
  },
};
