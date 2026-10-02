import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface JsonTreeViewerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  treeLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchCount: string;
  searchTruncated: string;
  searchNone: string;
  showMore: string;
  expandAll: string;
  collapseAll: string;
  expandTruncated: string;
  pathStyleLabel: string;
  pathStyleJsonPath: string;
  pathStylePointer: string;
  pathStyleJavascript: string;
  selectedLabel: string;
  selectedHint: string;
  copyPath: string;
  copyValue: string;
  copied: string;
  copyFailed: string;
  emptyTree: string;
  errorInvalidJson: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const sampleText = `{
  "id": 1,
  "name": "Taro",
  "email": null,
  "active": true,
  "tags": ["admin", "dev"],
  "address": { "city": "Tokyo", "zip": "100-0001" },
  "orders": [
    { "id": 10, "price": 1200 },
    { "id": 11, "price": 800, "coupon": "SALE" }
  ]
}`;

export const jsonTreeViewerContent: Record<Locale, JsonTreeViewerPageContent> =
  {
    ja: {
      title: 'JSONツリービューア（折りたたみ表示・検索・パスコピー）',
      description:
        'JSONを折りたたみ可能なツリーで閲覧できる無料ツールです。キー・値の検索、各要素のパス（JSONPath・JSON Pointer）のコピーに対応。大きなAPIレスポンスの探索に。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: 'JSONツリービューア',
      introHtml:
        'JSONを貼り付けると、折りたたみ可能なツリーで中身をたどれます。キーや値で検索したり、要素をクリックしてそのパス（<code>$.orders[0].price</code> など）をコピーしたりできます。大きなAPIレスポンスの構造をつかみたいときに便利です。整形・圧縮だけなら <a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a>、パスでの抽出は <a href="/tools/json-path-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Path / JSON Pointerテスター</a> をご利用ください。',
      inputLabel: 'JSON',
      inputPlaceholder: '{"id": 1, "name": "Taro", "tags": ["a", "b"]}',
      sampleText,
      treeLabel: 'ツリー',
      searchLabel: 'キー・値を検索',
      searchPlaceholder: '例: price',
      searchCount: '{n}件一致',
      searchTruncated: '{n}件以上一致（先頭のみ表示）',
      searchNone: '一致なし',
      showMore: '残り{n}件を表示',
      expandAll: 'すべて展開',
      collapseAll: 'すべて折りたたむ',
      expandTruncated:
        '要素が多いため、一部のみ展開しました。必要な部分は個別に開いてください。',
      pathStyleLabel: 'パスの表記',
      pathStyleJsonPath: 'JSONPath',
      pathStylePointer: 'JSON Pointer',
      pathStyleJavascript: 'JavaScript',
      selectedLabel: '選択中のパス',
      selectedHint: 'ツリーの要素をクリックすると、そのパスが表示されます。',
      copyPath: 'パスをコピー',
      copyValue: '値をコピー',
      copied: 'コピーしました',
      copyFailed: 'コピーに失敗しました',
      emptyTree: 'JSONを入力するとツリーが表示されます。',
      errorInvalidJson:
        'JSONとして解釈できません。カンマ・引用符・括弧の対応を確認してください。',
      notesHeading: '注意事項',
      notes: [
        'ツリーの展開は、開いた要素の分だけ描画します。大きなJSONでも、閉じたままの部分は負荷になりません。',
        '「すべて展開」は表示が重くならないよう、一定数の要素までで止まります。続きは個別に開いてください。',
        '検索はキー名とプリミティブ値（文字列・数値・真偽値・null）の部分一致で、大文字小文字は区別しません。一致した要素は自動で展開されます。',
        'JSONの数値は JavaScript の数値として扱うため、非常に大きな整数は精度が落ちて表示されることがあります。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'JSONPath',
          description:
            'JSONの中の要素を指し示す記法です。$ がルートで、$.user.name や $.items[0] のように書きます。',
        },
        {
          term: 'JSON Pointer',
          description:
            'RFC 6901 で定められた、JSONの要素を指し示す記法です。/user/name や /items/0 のようにスラッシュ区切りで書き、ルートは空文字列です。',
        },
        {
          term: 'プリミティブ値',
          description:
            '文字列・数値・真偽値・nullのように、中に子要素を持たない値のことです。オブジェクトと配列はそれ以外（子を持つ値）です。',
        },
      ],
    },
    en: {
      title: 'JSON Tree Viewer (Collapsible Tree, Search & Copy Path)',
      description:
        'Explore JSON as a collapsible tree with key/value search and one-click path copying. Great for large API responses. Runs in your browser; nothing is uploaded.',
      h1: 'JSON Tree Viewer',
      introHtml:
        'Paste JSON and browse it as a collapsible tree. Search by key or value, or click any node to copy its path (such as <code>$.orders[0].price</code>). Handy for getting a feel for the structure of a large API response. To just pretty-print or minify, use the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a>; to extract values by path, try the <a href="/en/tools/json-path-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Path / JSON Pointer Tester</a>.',
      inputLabel: 'JSON',
      inputPlaceholder: '{"id": 1, "name": "Taro", "tags": ["a", "b"]}',
      sampleText,
      treeLabel: 'Tree',
      searchLabel: 'Search keys and values',
      searchPlaceholder: 'e.g. price',
      searchCount: '{n} matches',
      searchTruncated: '{n}+ matches (showing the first ones)',
      searchNone: 'No matches',
      showMore: 'Show {n} more',
      expandAll: 'Expand all',
      collapseAll: 'Collapse all',
      expandTruncated:
        'Only part of the tree was expanded because it has many nodes. Open the rest individually.',
      pathStyleLabel: 'Path notation',
      pathStyleJsonPath: 'JSONPath',
      pathStylePointer: 'JSON Pointer',
      pathStyleJavascript: 'JavaScript',
      selectedLabel: 'Selected path',
      selectedHint: 'Click a node in the tree to show its path.',
      copyPath: 'Copy path',
      copyValue: 'Copy value',
      copied: 'Copied',
      copyFailed: 'Copy failed',
      emptyTree: 'Enter JSON to see the tree.',
      errorInvalidJson:
        'This is not valid JSON. Check the commas, quotes, and brackets.',
      notesHeading: 'Notes',
      notes: [
        'Only the nodes you open are rendered, so collapsed parts of a large JSON add no load.',
        '"Expand all" stops after a fixed number of nodes to keep the page responsive. Open the rest individually.',
        'Search matches keys and primitive values (strings, numbers, booleans, null) by case-insensitive substring. Matching nodes are expanded automatically.',
        'JSON numbers are handled as JavaScript numbers, so very large integers may be shown with reduced precision.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'JSONPath',
          description:
            'A notation for pointing at an element inside JSON. $ is the root, as in $.user.name or $.items[0].',
        },
        {
          term: 'JSON Pointer',
          description:
            'A notation defined in RFC 6901 for pointing at an element in JSON, written with slashes as in /user/name or /items/0. The root is the empty string.',
        },
        {
          term: 'Primitive value',
          description:
            'A value with no children: a string, number, boolean, or null. Objects and arrays are the values that contain children.',
        },
      ],
    },
  };
