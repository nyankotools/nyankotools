import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface Json5ConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeAriaLabel: string;
  modeJson5ToJson: string;
  modeJsonToJson5: string;
  indentLabel: string;
  indentOption2: string;
  indentOption4: string;
  indentOptionTab: string;
  indentOptionCompact: string;
  nonFiniteLabel: string;
  nonFiniteNull: string;
  nonFiniteString: string;
  quoteLabel: string;
  quoteSingle: string;
  quoteDouble: string;
  unquoteKeys: string;
  trailingComma: string;
  copy: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  outputLabel: string;
  inputPlaceholderJson5ToJson: string;
  inputPlaceholderJsonToJson5: string;
  sampleText: string;
  errorPrefix: string;
  /** {line} と {column} を置き換える */
  errorLocation: string;
  /** コード別の説明。{found} は問題の文字に置き換える */
  errorMessages: Record<
    | 'unexpectedChar'
    | 'unexpectedEnd'
    | 'invalidNumber'
    | 'invalidEscape'
    | 'unterminatedString'
    | 'unterminatedComment'
    | 'tooDeep',
    string
  >;
  /** {count} を置き換える */
  nonFiniteWarning: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const sample = `{
  // 設定ファイル風の例
  name: 'nyanko',
  port: 0x1F90,
  ratio: .5,
  tags: ['a', 'b',],
  /* ブロックコメント */
  limit: Infinity,
}`;

const sampleEn = `{
  // config-style example
  name: 'nyanko',
  port: 0x1F90,
  ratio: .5,
  tags: ['a', 'b',],
  /* block comment */
  limit: Infinity,
}`;

export const json5ConverterContent: Record<Locale, Json5ConverterPageContent> =
  {
    ja: {
      title: 'JSON5⇔JSON変換｜コメント・末尾カンマ対応',
      description:
        'JSON5やJavaScriptのオブジェクトリテラルをJSONに、JSONをJSON5に変換できる無料ツールです。コメント・末尾カンマ・クォート無しキー・16進数に対応し、エラーは行と列つきで表示。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: 'JSON5⇔JSON変換ツール',
      introHtml:
        'コメントや末尾カンマ、クォート無しのキー、シングルクォートの文字列、16進数、Infinity・NaN を含むJSON5（JavaScriptのオブジェクトリテラル風の記述）を、標準のJSONに変換します。逆にJSONをJSON5へ変換して、キーのクォート省略やシングルクォートで読みやすく整えることもできます。変換後のJSONの検証・整形には <a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a> もご利用ください。',
      modeAriaLabel: '変換方向',
      modeJson5ToJson: 'JSON5→JSON',
      modeJsonToJson5: 'JSON→JSON5',
      indentLabel: 'インデント',
      indentOption2: '半角スペース2個',
      indentOption4: '半角スペース4個',
      indentOptionTab: 'タブ',
      indentOptionCompact: '圧縮（改行なし）',
      nonFiniteLabel: 'Infinity・NaN の扱い',
      nonFiniteNull: 'null にする',
      nonFiniteString: '文字列にする',
      quoteLabel: '文字列の引用符',
      quoteSingle: 'シングルクォート',
      quoteDouble: 'ダブルクォート',
      unquoteKeys: 'キーのクォートを省略',
      trailingComma: '末尾カンマを付ける',
      copy: 'コピー',
      copied: 'コピーしました',
      copyFailed: 'コピーに失敗しました',
      inputLabel: '入力',
      outputLabel: '結果',
      inputPlaceholderJson5ToJson:
        "{\n  name: 'Taro', // コメント\n  age: 30,\n}",
      inputPlaceholderJsonToJson5: '{"name": "Taro", "age": 30}',
      sampleText: sample,
      errorPrefix: '構文エラー',
      errorLocation: '{line}行目 {column}列目',
      errorMessages: {
        unexpectedChar: '予期しない文字「{found}」があります。',
        unexpectedEnd: '入力が途中で終わっています。',
        invalidNumber: '数値の書き方が正しくありません。',
        invalidEscape: '文字列内のエスケープシーケンスが正しくありません。',
        unterminatedString:
          '文字列が閉じられていません（途中に改行があるときは、行末に「\\」が必要です）。',
        unterminatedComment: 'コメント「/*」が「*/」で閉じられていません。',
        tooDeep: 'ネストが深すぎます。',
      },
      nonFiniteWarning:
        'Infinity・NaN が{count}個含まれています。JSONでは表せないため置き換えました。',
      notesHeading: '注意事項',
      notes: [
        'JSON5のコメントはJSONに書けないため、JSONへ変換すると失われます。16進数は10進数に、シングルクォートはダブルクォートに置き換わります。',
        'JSONにはInfinityとNaNがないため、「JSON5→JSON」では null または文字列に置き換えます。「JSON→JSON5」の入力にはそのまま書けて、出力にも保持されます。',
        '2^53 を超える整数は、JavaScriptの数値の精度の都合で正確に表せず、丸められることがあります。',
        '同じキーが複数あるときは、最後の値が使われます。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'JSON5',
          description:
            'JSONを拡張し、コメント・末尾カンマ・クォート無しキー・シングルクォート・16進数などを書けるようにした形式です。人が手で書く設定ファイル向けで、JSONはJSON5の部分集合です。',
        },
        {
          term: '末尾カンマ',
          description:
            '配列やオブジェクトの最後の要素のあとに付けるカンマです。要素の追加や並べ替えで差分が小さくなりますが、標準のJSONでは構文エラーになります。',
        },
        {
          term: 'プロトタイプ汚染',
          description:
            '"__proto__" のようなキーを悪用して、JavaScriptのオブジェクトの共通の土台（プロトタイプ）を書き換える攻撃です。このツールは通常のデータとして安全に扱います。',
        },
      ],
    },
    en: {
      title: 'JSON5 to JSON Converter',
      description:
        'Convert JSON5 or JS object literals to JSON and back. Handles comments, trailing commas, unquoted keys and hex. Runs in your browser; nothing is uploaded.',
      h1: 'JSON5 ⇔ JSON Converter',
      introHtml:
        'Paste JSON5 (JavaScript-style object literals with comments, trailing commas, unquoted keys, single-quoted strings, hex numbers, Infinity and NaN) to get plain JSON. Or go the other way and turn JSON into tidy JSON5 with unquoted keys and single quotes. To validate or pretty-print the resulting JSON, use the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a>.',
      modeAriaLabel: 'Direction',
      modeJson5ToJson: 'JSON5→JSON',
      modeJsonToJson5: 'JSON→JSON5',
      indentLabel: 'Indent',
      indentOption2: '2 spaces',
      indentOption4: '4 spaces',
      indentOptionTab: 'Tab',
      indentOptionCompact: 'Compact (no line breaks)',
      nonFiniteLabel: 'Infinity / NaN',
      nonFiniteNull: 'Replace with null',
      nonFiniteString: 'Replace with a string',
      quoteLabel: 'String quotes',
      quoteSingle: 'Single quotes',
      quoteDouble: 'Double quotes',
      unquoteKeys: 'Unquote keys when possible',
      trailingComma: 'Add trailing commas',
      copy: 'Copy',
      copied: 'Copied',
      copyFailed: 'Copy failed',
      inputLabel: 'Input',
      outputLabel: 'Result',
      inputPlaceholderJson5ToJson:
        "{\n  name: 'Taro', // comment\n  age: 30,\n}",
      inputPlaceholderJsonToJson5: '{"name": "Taro", "age": 30}',
      sampleText: sampleEn,
      errorPrefix: 'Syntax error',
      errorLocation: 'line {line}, column {column}',
      errorMessages: {
        unexpectedChar: 'Unexpected character "{found}".',
        unexpectedEnd: 'Unexpected end of input.',
        invalidNumber: 'Invalid number.',
        invalidEscape: 'Invalid escape sequence in a string.',
        unterminatedString:
          'Unterminated string (a line break inside a string needs a backslash at the end of the line).',
        unterminatedComment: 'Unterminated block comment: missing "*/".',
        tooDeep: 'Nesting is too deep.',
      },
      nonFiniteWarning:
        '{count} Infinity/NaN value(s) were replaced because JSON cannot represent them.',
      notesHeading: 'Notes',
      notes: [
        'JSON has no comments, so JSON5 comments are lost when converting to JSON. Hex numbers become decimal and single quotes become double quotes.',
        'JSON has no Infinity or NaN, so "JSON5→JSON" replaces them with null or a string. In "JSON→JSON5" they are accepted as input and kept in the output.',
        'Integers beyond 2^53 cannot be represented exactly by JavaScript numbers and may be rounded.',
        'If a key appears more than once, the last value wins.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'JSON5',
          description:
            'An extension of JSON that allows comments, trailing commas, unquoted keys, single-quoted strings, hex numbers and more. It targets hand-written config files, and every valid JSON document is also valid JSON5.',
        },
        {
          term: 'Trailing comma',
          description:
            'A comma after the last item of an array or object. It keeps diffs small when you add or reorder items, but plain JSON rejects it.',
        },
        {
          term: 'Prototype pollution',
          description:
            'An attack that abuses keys such as "__proto__" to modify the shared prototype of JavaScript objects. This tool treats such keys as ordinary data.',
        },
      ],
    },
  };
