import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface JsonSchemaGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  draftLabel: string;
  titleLabel: string;
  requiredLabel: string;
  noAdditionalLabel: string;
  formatLabel: string;
  outputLabel: string;
  copyButton: string;
  downloadButton: string;
  copied: string;
  copyFailed: string;
  errorInvalidJson: string;
  errorTooDeep: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const sampleText = `{
  "id": 1,
  "name": "Taro",
  "email": "taro@example.com",
  "createdAt": "2026-10-01T09:00:00Z",
  "score": 4.5,
  "tags": ["admin", "dev"],
  "address": { "city": "Tokyo", "zip": "100-0001" },
  "orders": [
    { "id": 10, "price": 1200 },
    { "id": 11, "price": 800, "coupon": "SALE" }
  ]
}`;

export const jsonSchemaGeneratorContent: Record<
  Locale,
  JsonSchemaGeneratorPageContent
> = {
  ja: {
    title: 'JSON Schema生成（JSONからスキーマを自動作成）',
    description:
      'JSONのサンプルからJSON Schema（draft 2020-12 / 2019-09 / 07）を自動生成する無料ツールです。required・additionalProperties・日付やメールのformat推測に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'JSON Schema生成',
    introHtml:
      'JSONのサンプルを貼り付けると、その形に合う JSON Schema を生成します。APIレスポンスやデータファイルの検証用スキーマの下書きに便利です。配列内のオブジェクトは1つのスキーマに統合し、一部の要素にしかないキーは <code>required</code> から外します。型定義が欲しい場合は <a href="/tools/json-to-types/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON→TypeScript型生成</a> をご利用ください。',
    inputLabel: 'JSON',
    inputPlaceholder: '{"id": 1, "name": "Taro", "tags": ["a", "b"]}',
    sampleText,
    draftLabel: 'ドラフト',
    titleLabel: 'タイトル（任意）',
    requiredLabel: '全データにあるキーを required にする',
    noAdditionalLabel: 'additionalProperties: false を付ける',
    formatLabel: '日付・メール・URLなどの format を推測する',
    outputLabel: 'JSON Schema',
    copyButton: 'コピー',
    downloadButton: '.jsonでダウンロード',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorInvalidJson:
      'JSONとして解釈できません。カンマ・引用符・括弧の対応を確認してください。',
    errorTooDeep: 'ネストが深すぎて処理できません。',
    notesHeading: '注意事項',
    notes: [
      'スキーマは貼り付けたJSONの値から推測します。サンプルに現れない取りうる値（列挙値・文字数や数値の範囲・パターンなど）は反映されないため、仕様に合わせて手で追記してください。',
      'サンプルに全部の要素で現れたキーだけを required にします。サンプルが1件だけだと、本来は省略可能なキーも required になる点にご注意ください。',
      '値が1.0のように小数点以下が0の数値は、JSON上は整数として扱われるため integer になります。',
      'format は値の見た目（日付・日時・メール・URL・UUID）から推測します。同じ位置の値が揃って同じ形式のときだけ付けます。',
      '空の配列は要素の型が分からないため、items を付けず何でも許すスキーマになります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'JSON Schema',
        description:
          'JSONデータの構造（キー・型・必須項目など）を、JSON自身で記述して検証するための仕様です。APIの入力チェックや設定ファイルの補完などに使われます。',
      },
      {
        term: 'required',
        description:
          'オブジェクトに必ず含まれていなければならないキーの一覧です。ここにないキーは省略してもかまいません。',
      },
      {
        term: 'additionalProperties',
        description:
          'properties に書いていないキーを許すかどうかを決める指定です。false にすると、定義にないキーが含まれたデータは不正になります。',
      },
      {
        term: 'format',
        description:
          'date-time・email・uri・uuid など、文字列の形式を表す注釈です。検証ツールによっては形式チェックまで行います。',
      },
    ],
  },
  en: {
    title: 'JSON Schema Generator (Create a Schema from JSON)',
    description:
      'Generate a JSON Schema (draft 2020-12, 2019-09, or 07) from a JSON sample, with required keys and format detection. Runs in your browser; nothing is uploaded.',
    h1: 'JSON Schema Generator',
    introHtml:
      'Paste a JSON sample and get a matching JSON Schema. Useful as a starting point for validating API responses or data files. Objects inside arrays are merged into one schema, and keys found in only some items are left out of <code>required</code>. If you want type definitions instead, try the <a href="/en/tools/json-to-types/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON to TypeScript Converter</a>.',
    inputLabel: 'JSON',
    inputPlaceholder: '{"id": 1, "name": "Taro", "tags": ["a", "b"]}',
    sampleText,
    draftLabel: 'Draft',
    titleLabel: 'Title (optional)',
    requiredLabel: 'Mark keys present in every object as required',
    noAdditionalLabel: 'Add additionalProperties: false',
    formatLabel: 'Detect formats (date, email, URL, ...)',
    outputLabel: 'JSON Schema',
    copyButton: 'Copy',
    downloadButton: 'Download .json',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorInvalidJson:
      'This is not valid JSON. Check the commas, quotes, and brackets.',
    errorTooDeep: 'The JSON is nested too deeply to process.',
    notesHeading: 'Notes',
    notes: [
      'The schema is inferred from the values in your sample. Constraints that are not visible in the sample (enums, length or numeric ranges, patterns) are not generated, so add them by hand to match your spec.',
      'Only keys that appear in every object of the sample become required. With a single sample, keys that are really optional will also be marked required.',
      'A number such as 1.0 is an integer in JSON, so it is typed as integer.',
      'Formats are guessed from how values look (date, date-time, email, URL, UUID) and are added only when every value at that position has the same format.',
      'An empty array has no known element type, so it gets no items keyword and accepts anything.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'JSON Schema',
        description:
          'A specification for describing the structure of JSON data (keys, types, required fields) in JSON itself, so the data can be validated. It is used for API input checks and editor autocompletion of config files.',
      },
      {
        term: 'required',
        description:
          'The list of keys an object must contain. Keys not listed here may be omitted.',
      },
      {
        term: 'additionalProperties',
        description:
          'Controls whether keys not listed under properties are allowed. Set to false, data with undeclared keys is invalid.',
      },
      {
        term: 'format',
        description:
          'An annotation for string formats such as date-time, email, uri, and uuid. Some validators also enforce it.',
      },
    ],
  },
};
