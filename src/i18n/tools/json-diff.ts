import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface JsonDiffPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  leftLabel: string;
  rightLabel: string;
  samplePlaceholder: string;
  sampleLeft: string;
  sampleRight: string;
  ignoreArrayOrderLabel: string;
  resultLabel: string;
  noDifferences: string;
  /** `{added}` `{removed}` `{changed}` を置換して使うテンプレート */
  summaryTemplate: string;
  addedLabel: string;
  removedLabel: string;
  changedLabel: string;
  errorInvalidLeft: string;
  errorInvalidRight: string;
  errorTooDeep: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const jsonDiffContent: Record<Locale, JsonDiffPageContent> = {
  ja: {
    title: 'JSON差分比較（2つのJSONの違いをキー単位で表示）',
    description:
      '2つのJSONを構造的に比較し、追加・削除・変更された箇所をパスつきで一覧表示する無料ツールです。キーの順序は無視、配列の並び順を無視する比較にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'JSON差分比較',
    introHtml:
      '2つのJSONを貼り付けると、どのキーが追加・削除・変更されたかを <code>$.user.name</code> のようなパスつきで一覧表示します。テキスト比較と違い、キーの並び順や整形（インデント）の違いは差分になりません。API仕様の変更確認や、設定ファイルの比較に便利です。行単位で比べたい場合は <a href="/tools/text-diff/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">テキスト差分</a> をご利用ください。',
    leftLabel: '変更前のJSON',
    rightLabel: '変更後のJSON',
    samplePlaceholder: '{"id": 1, "name": "Taro"}',
    sampleLeft: `{
  "id": 1,
  "name": "Taro",
  "tags": ["a", "b"],
  "address": { "city": "Tokyo" }
}`,
    sampleRight: `{
  "name": "Taro Yamada",
  "id": 1,
  "tags": ["a", "b", "c"],
  "address": { "city": "Osaka", "zip": "530-0001" }
}`,
    ignoreArrayOrderLabel: '配列の並び順を無視する',
    resultLabel: '差分',
    noDifferences: '差分はありません（2つのJSONは同じ内容です）。',
    summaryTemplate: '追加 {added} 件・削除 {removed} 件・変更 {changed} 件',
    addedLabel: '追加',
    removedLabel: '削除',
    changedLabel: '変更',
    errorInvalidLeft: '「変更前のJSON」がJSONとして解釈できません。',
    errorInvalidRight: '「変更後のJSON」がJSONとして解釈できません。',
    errorTooDeep: 'ネストが深すぎて比較できません。',
    notesHeading: '注意事項',
    notes: [
      'オブジェクトはキーの順序を無視して比較します。配列は、既定では同じ位置（添字）の要素どうしを比べます。',
      '「配列の並び順を無視する」をオンにすると、同じ値の要素を対応づけて比較します。対応づけられなかった要素は、要素の一部だけが違う場合でも、削除・追加として表示されます。',
      '数値は JavaScript の数値として比較します。1 と 1.0 は同じ値、1 と "1"（文字列）は別の値です。',
      '比較は貼り付けた2つのJSONだけを対象に、すべてブラウザ内で行います。トークンなどの機密情報を含むJSONも外部には送信されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'パス',
        description:
          '差分のある値の位置を表す記法です。$ がルート、.name がキー、[0] が配列の添字を表します。',
      },
      {
        term: '構造的な比較',
        description:
          '文字列として比べるのではなく、JSONの構造（オブジェクト・配列・値）として比べる方法です。キーの順序や空白、改行の違いは差分になりません。',
      },
      {
        term: '配列の添字',
        description:
          '配列の要素の位置を表す番号です。先頭が0で、[0] は1番目の要素を指します。',
      },
    ],
  },
  en: {
    title: 'JSON Diff (Compare Two JSON Files Key by Key)',
    description:
      'Compare two JSON documents and list every added, removed, and changed value with its path. Ignores key order. Runs in your browser; nothing is uploaded.',
    h1: 'JSON Diff',
    introHtml:
      'Paste two JSON documents and see which keys were added, removed, or changed, listed with paths such as <code>$.user.name</code>. Unlike a text diff, differences in key order or indentation do not count. Useful for checking an API change or comparing config files. For a line-by-line comparison, use the <a href="/en/tools/text-diff/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Text Diff</a> tool.',
    leftLabel: 'Original JSON',
    rightLabel: 'Modified JSON',
    samplePlaceholder: '{"id": 1, "name": "Taro"}',
    sampleLeft: `{
  "id": 1,
  "name": "Taro",
  "tags": ["a", "b"],
  "address": { "city": "Tokyo" }
}`,
    sampleRight: `{
  "name": "Taro Yamada",
  "id": 1,
  "tags": ["a", "b", "c"],
  "address": { "city": "Osaka", "zip": "530-0001" }
}`,
    ignoreArrayOrderLabel: 'Ignore array order',
    resultLabel: 'Differences',
    noDifferences: 'No differences — the two JSON documents are identical.',
    summaryTemplate: '{added} added, {removed} removed, {changed} changed',
    addedLabel: 'Added',
    removedLabel: 'Removed',
    changedLabel: 'Changed',
    errorInvalidLeft: 'The "Original JSON" is not valid JSON.',
    errorInvalidRight: 'The "Modified JSON" is not valid JSON.',
    errorTooDeep: 'The JSON is nested too deeply to compare.',
    notesHeading: 'Notes',
    notes: [
      'Objects are compared without regard to key order. Arrays are compared item by item at the same position (index) by default.',
      'With "Ignore array order" on, items with the same value are matched up. Items that cannot be matched are reported as removed and added, even if only part of the item differs.',
      'Numbers are compared as JavaScript numbers: 1 and 1.0 are the same, but 1 and "1" (a string) are different.',
      'Only the two pasted JSON documents are compared, entirely in your browser. JSON that contains tokens or other secrets is never sent anywhere.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Path',
        description:
          'Notation for where a changed value lives. $ is the root, .name is a key, and [0] is an array index.',
      },
      {
        term: 'Structural comparison',
        description:
          'Comparing JSON as a structure of objects, arrays, and values rather than as text. Differences in key order, spaces, or line breaks do not count.',
      },
      {
        term: 'Array index',
        description:
          'The number that gives an array element its position. It starts at 0, so [0] is the first element.',
      },
    ],
  },
};
