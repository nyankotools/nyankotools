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
    title: 'JSON→TypeScript型生成（interface・typeを自動作成）',
    description:
      'JSONからTypeScriptのinterface・type定義を自動生成する無料ツールです。ネストしたオブジェクトや配列、省略可能なプロパティ、ユニオン型に対応。APIレスポンスの型づけに。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'JSON→TypeScript型生成',
    introHtml:
      'JSONを貼り付けると、その形に合う TypeScript の <code>interface</code>（または <code>type</code>）を生成します。APIのレスポンス例から型定義を起こしたいときに便利です。ネストしたオブジェクトは別の型として切り出し、配列内で欠けているキーは省略可能（<code>?</code>）にします。JSONの検証・整形は <a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a> もご利用ください。',
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
    styleLabel: '宣言の形式',
    styleInterfaceLabel: 'interface',
    styleTypeLabel: 'type',
    exportLabel: 'exportを付ける',
    outputLabel: 'TypeScriptの型定義',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorInvalidJson:
      'JSONとして解釈できません。カンマ・引用符・括弧の対応を確認してください。',
    errorTooDeep: 'ネストが深すぎて処理できません。',
    notesHeading: '注意事項',
    notes: [
      '型は貼り付けたJSONの値から推測します。サンプルに現れない値（別の型になりうるフィールドなど）は反映されないため、生成結果は仕様に合わせて調整してください。',
      '配列は全要素の型を1つにまとめます。要素ごとに値の型が違えば (number | string)[] のようなユニオン型に、キーが一部の要素にしかなければ省略可能（?）になります。',
      '空の配列は要素の型が分からないため unknown[]、null の値は null 型になります。実際に取りうる型（例: string | null）は手で書き換えてください。',
      'JSONの数値はすべて number 型です。非常に大きな整数は JavaScript では精度が落ちる点にご注意ください。',
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
    ],
  },
  en: {
    title: 'JSON to TypeScript Converter (Generate Interfaces & Types)',
    description:
      'Generate TypeScript interfaces or types from JSON, with nested objects, arrays, optional properties, and unions. Runs in your browser; nothing is uploaded.',
    h1: 'JSON to TypeScript Converter',
    introHtml:
      'Paste JSON and get matching TypeScript <code>interface</code> (or <code>type</code>) definitions. Handy for turning an API response example into types. Nested objects become their own types, and keys missing from some array items become optional (<code>?</code>). To validate or pretty-print the JSON first, use the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a>.',
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
    styleLabel: 'Declaration style',
    styleInterfaceLabel: 'interface',
    styleTypeLabel: 'type',
    exportLabel: 'Add export',
    outputLabel: 'TypeScript definitions',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorInvalidJson:
      'This is not valid JSON. Check the commas, quotes, and brackets.',
    errorTooDeep: 'The JSON is nested too deeply to process.',
    notesHeading: 'Notes',
    notes: [
      'Types are inferred from the values in the JSON you paste. Fields that could hold other types but do not in your sample are not reflected, so adjust the result to match your spec.',
      'All items of an array are merged into one type. Mixed value types become a union such as (number | string)[], and keys present in only some items become optional (?).',
      'An empty array becomes unknown[] because its element type is unknown, and a null value becomes the null type. Edit these by hand to the types the field can really take (for example string | null).',
      'Every JSON number becomes number. Be aware that very large integers lose precision in JavaScript.',
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
    ],
  },
};
