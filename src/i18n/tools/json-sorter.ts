import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface Option {
  value: string;
  label: string;
}

export interface JsonSorterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること */
  introHtml: string;
  modeLabel: string;
  modeOptions: Option[];
  orderLabel: string;
  orderOptions: Option[];
  recursiveLabel: string;
  indentLabel: string;
  indentOptions: Option[];
  inputLabel: string;
  outputLabel: string;
  sampleText: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** {message} は JSON.parse のエラーメッセージ */
  errorParse: string;
  errorDepth: string;
  errorNotObject: string;
  /** {path} は問題のキー */
  errorInvalidPath: string;
  errorConflict: string;
  errorIndexTooLarge: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const sample = `{
  "name": "Taro",
  "address": { "zip": "100-0001", "city": "Tokyo" },
  "tags": ["b", "a"],
  "id": 12345678901234567890
}`;

export const jsonSorterContent: Record<Locale, JsonSorterPageContent> = {
  ja: {
    title: 'JSONキーソート・フラット化（flatten/unflatten）ツール',
    description:
      'JSONのキーを昇順・降順に再帰ソートしたり、a.b[0] 形式にフラット化して元に戻したりできる無料ツールです。配列の順序は保持。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'JSONキーソート・フラット化',
    introHtml:
      'JSONのキーを並べ替えたり、ネストを <code>a.b[0]</code> 形式の1階層に変換（flatten）して元の構造に戻したり（unflatten）できます。JSON差分の前処理にも便利です。整形だけならば <a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a>、差分確認は <a href="/tools/json-diff/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON差分比較</a> をご利用ください。',
    modeLabel: 'モード',
    modeOptions: [
      { value: 'sort', label: 'キーソート' },
      { value: 'flatten', label: 'フラット化（flatten）' },
      { value: 'unflatten', label: '復元（unflatten）' },
    ],
    orderLabel: '並び順',
    orderOptions: [
      { value: 'asc', label: '昇順（A→Z）' },
      { value: 'desc', label: '降順（Z→A）' },
    ],
    recursiveLabel: 'ネストしたオブジェクトも再帰的に並べ替える',
    indentLabel: 'インデント幅',
    indentOptions: [
      { value: '2', label: '半角スペース2個' },
      { value: '4', label: '半角スペース4個' },
      { value: 'tab', label: 'タブ' },
      { value: '0', label: 'なし（1行）' },
    ],
    inputLabel: '入力',
    outputLabel: '結果',
    sampleText: sample,
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorParse: 'JSONの構文エラー: {message}',
    errorDepth: 'ネストが深すぎて処理できません。',
    errorNotObject:
      '復元できるのはオブジェクトのJSONだけです。キーが a.b[0] 形式のオブジェクトを入力してください。',
    errorInvalidPath: 'キー「{path}」はパスとして解釈できません。',
    errorConflict:
      'キー「{path}」が他のキーと矛盾しています（値と子要素の両方がある、または配列とオブジェクトが混在しています）。',
    errorIndexTooLarge:
      'キー「{path}」の配列インデックスが大きすぎます（上限は100000）。',
    howToHeading: '使い方',
    howToSteps: [
      '「モード」でキーソート・フラット化・復元のいずれかを選びます。',
      'キーソートでは並び順と再帰の有無を選び、「入力」欄にJSONを貼り付けます。',
      '「結果」欄に変換後のJSONが表示されるので、「コピー」で取り出します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '数値は入力の表記のまま出力するため、桁数の多い整数（例: 12345678901234567890）も丸められません。',
      'キーの並べ替えはUTF-16コード単位の辞書順です。10 は 2 より前に来ます。配列の要素順は変更しません。',
      'フラット化では、ドット・括弧・空白を含むキーや数字だけのキーは ["a.b"] のようにブラケット表記になります。復元時に ["0"] はオブジェクトのキー、[0] は配列の添字として扱います（a.0 はオブジェクトのキー "0"）。',
      '空の配列 [] と空のオブジェクト {} は値としてそのまま残ります。ルートがスカラーや空の場合はフラット化されません。',
      '復元で飛んだ添字がある場合は null で埋めます（添字の上限は100000）。同じ JSON 内に同名キーがあると最後の値が使われます。',
      '入力したJSONはブラウザ内で処理され、サーバーには送信されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'フラット化（flatten）',
        description:
          '入れ子になったJSONを、a.b[0] のようなパスをキーにした1階層のオブジェクトに変換することです。環境変数や翻訳ファイル、CSVへの変換前処理でよく使われます。',
      },
      {
        term: '復元（unflatten）',
        description:
          'フラット化されたキー（a.b[0] 形式）を解釈して、元の入れ子構造に戻すことです。',
      },
      {
        term: 'プロトタイプ汚染',
        description:
          '__proto__ などの特殊なキーを悪用して、オブジェクトの共通の性質を書き換える攻撃です。このツールは Map を使って処理するため影響を受けません。',
      },
    ],
  },
  en: {
    title: 'JSON Key Sorter & Flatten / Unflatten Tool',
    description:
      'Sort JSON keys recursively, flatten nested JSON into a.b[0] paths, or unflatten it back. Array order is kept. Runs in your browser; nothing is uploaded.',
    h1: 'JSON Key Sorter & Flatten / Unflatten',
    introHtml:
      'Sort the keys of a JSON document, flatten nested data into single-level <code>a.b[0]</code> paths, or rebuild the original structure. Handy for normalizing JSON before a comparison. For plain pretty-printing use the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a>; to see what changed, try the <a href="/en/tools/json-diff/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Diff</a>.',
    modeLabel: 'Mode',
    modeOptions: [
      { value: 'sort', label: 'Sort keys' },
      { value: 'flatten', label: 'Flatten' },
      { value: 'unflatten', label: 'Unflatten' },
    ],
    orderLabel: 'Order',
    orderOptions: [
      { value: 'asc', label: 'Ascending (A-Z)' },
      { value: 'desc', label: 'Descending (Z-A)' },
    ],
    recursiveLabel: 'Sort nested objects recursively',
    indentLabel: 'Indent',
    indentOptions: [
      { value: '2', label: '2 spaces' },
      { value: '4', label: '4 spaces' },
      { value: 'tab', label: 'Tab' },
      { value: '0', label: 'None (single line)' },
    ],
    inputLabel: 'Input',
    outputLabel: 'Result',
    sampleText: sample,
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorParse: 'Invalid JSON: {message}',
    errorDepth: 'The JSON is nested too deeply to process.',
    errorNotObject:
      'Only a JSON object can be unflattened. Enter an object whose keys look like a.b[0].',
    errorInvalidPath: 'The key "{path}" is not a valid path.',
    errorConflict:
      'The key "{path}" conflicts with another key (it is both a value and a parent, or mixes array and object).',
    errorIndexTooLarge:
      'The array index in key "{path}" is too large (the limit is 100000).',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose sort, flatten or unflatten in "Mode".',
      'For sorting, pick the order and whether to recurse, then paste your JSON into "Input".',
      'The converted JSON appears in "Result"; take it with "Copy".',
    ],
    notesHeading: 'Notes',
    notes: [
      'Numbers are written exactly as typed, so long integers such as 12345678901234567890 are not rounded.',
      'Keys are ordered by UTF-16 code units, so 10 comes before 2. The order of array elements is never changed.',
      'When flattening, keys containing dots, brackets or spaces, and digit-only keys, use bracket notation with a JSON-quoted key. When unflattening, a quoted key in brackets is always an object key and bare digits in brackets, like [0], are an array index (a.0 means the object key 0).',
      'Empty arrays [] and empty objects {} stay as values. A scalar or empty root is returned unchanged.',
      'Skipped array indexes are filled with null when unflattening (maximum index 100000). If a key is duplicated, the last value wins.',
      'Your JSON is processed in the browser and is never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Flatten',
        description:
          'Converting nested JSON into a single-level object whose keys are paths such as a.b[0]. Common before exporting to env vars, translation files or CSV.',
      },
      {
        term: 'Unflatten',
        description:
          'The reverse of flattening: parsing keys like a.b[0] and rebuilding the original nested structure.',
      },
      {
        term: 'Prototype pollution',
        description:
          'An attack that abuses special keys such as __proto__ to alter shared object behavior. This tool builds results with Map, so it is not affected.',
      },
    ],
  },
};
