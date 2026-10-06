import type { Locale } from '../../data/tools';
import type { RecipeOp } from '../../lib/tools/data-recipe-builder';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface DataRecipeBuilderPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  recipeLabel: string;
  addStepLabel: string;
  addStep: string;
  emptyRecipe: string;
  clearRecipe: string;
  moveUp: string;
  moveDown: string;
  removeStep: string;
  stepOutputLabel: string;
  outputLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** {n} は手順番号、{op} は手順名に置き換える */
  stepInvalid: string;
  unsupported: string;
  nonUtf8Notice: string;
  maxSteps: string;
  ops: Record<RecipeOp, string>;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const dataRecipeBuilderContent: Record<
  Locale,
  DataRecipeBuilderPageContent
> = {
  ja: {
    title: '多段エンコード/デコード・ハッシュ変換チェーン',
    description:
      'Base64・URL・16進数・HTML・Unicodeエスケープ・MD5/SHA-256などの変換を、好きな順番で連続して適用できる無料ツールです。手順ごとの途中結果も確認できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '多段エンコード/デコード・ハッシュ変換チェーン（レシピ）',
    introHtml:
      '変換の手順（レシピ）を上から順に並べると、入力テキストに順番に適用して結果を表示します。Base64デコード → URLデコードや、テキスト → Base64 → SHA-256のような複数段の処理を1回で行えます。1つの変換だけなら <a href="/tools/base64/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Base64エンコード/デコード</a> や <a href="/tools/hash-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ハッシュ生成</a> が手軽です。',
    inputLabel: '入力',
    inputPlaceholder: '変換したいテキストを入力',
    recipeLabel: 'レシピ（上から順に適用）',
    addStepLabel: '追加する変換',
    addStep: '追加',
    emptyRecipe: '手順がありません。変換を選んで「追加」を押してください。',
    clearRecipe: 'すべて削除',
    moveUp: '上へ',
    moveDown: '下へ',
    removeStep: '削除',
    stepOutputLabel: '出力',
    outputLabel: '最終結果',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    stepInvalid:
      '手順{n}（{op}）で変換できませんでした。直前の出力がこの変換に合う形式か確認してください。',
    unsupported:
      'お使いのブラウザはこの変換（ハッシュ計算）に対応していません。ブラウザを最新版に更新してください。',
    nonUtf8Notice:
      '結果にUTF-8の文字として読めないバイトが含まれています（表示は � に置き換わります）。内容を確認するには、末尾に「16進数エンコード」を追加してください。',
    maxSteps: '手順は最大20個までです。',
    ops: {
      'base64-encode': 'Base64エンコード',
      'base64-decode': 'Base64デコード',
      'url-encode': 'URLエンコード',
      'url-decode': 'URLデコード',
      'hex-encode': '16進数エンコード',
      'hex-decode': '16進数デコード',
      'html-escape': 'HTMLエスケープ',
      'html-unescape': 'HTMLアンエスケープ',
      'unicode-escape': 'Unicodeエスケープ（\\uXXXX）',
      'unicode-unescape': 'Unicodeアンエスケープ',
      md5: 'MD5ハッシュ',
      sha1: 'SHA-1ハッシュ',
      sha256: 'SHA-256ハッシュ',
      sha512: 'SHA-512ハッシュ',
      rot13: 'ROT13',
      reverse: '文字列を反転',
      uppercase: '大文字に変換',
      lowercase: '小文字に変換',
    },
    howToHeading: '使い方',
    howToSteps: [
      '「入力」に、変換したいテキストを入力します。',
      '「追加する変換」から変換を選び、「追加」を押します。必要な数だけ繰り返します。',
      '「上へ」「下へ」で順番を入れ替え、「削除」で不要な手順を外します。各手順の「出力」で途中結果を確認できます。',
      '「最終結果」を確認し、「コピー」で取り出します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '手順の間は、直前の出力をそのまま次の入力として渡します。エンコード系の変換はUTF-8のテキストとして扱います。',
      'Base64デコードはBase64URL（- と _）・改行・パディング無しの文字列も受け付けます。16進数デコードは空白・カンマ・0xを含む表記も受け付けます。',
      'Base64やURLエンコードは暗号化ではありません。MD5・SHA-1は衝突が見つかっており、パスワード保存などセキュリティ用途には向きません。',
      '大文字小文字変換・文字列反転・ROT13・HTML/Unicodeエスケープは、直前の出力をUTF-8のテキストとして読みます。UTF-8として不正なバイトは � に置き換わるため、バイナリを扱うときや、Base64デコード後にUTF-8として読めない結果が出るときは「16進数エンコード」や「Base64エンコード」の後に繋いでください。',
      '手順の内容は画面を閉じると消えます（保存や共有URLには対応していません）。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'レシピ',
        description:
          '変換の手順を順番に並べたものです。各手順の出力が次の手順の入力になるので、複数の変換を1回の操作でまとめて行えます。',
      },
      {
        term: 'ハッシュ',
        description:
          '任意のデータから固定長の値を計算する一方向の変換です。元のデータに戻すことはできません。同じ入力からは必ず同じ値になるため、改ざん検出などに使われます。',
      },
      {
        term: 'ROT13',
        description:
          'アルファベットを13文字ずらす簡易な置換です。もう一度適用すると元に戻りますが、暗号としての強度はありません。',
      },
    ],
  },
  en: {
    title: 'Multi-Step Encode/Decode & Hash Chain (Recipe Builder)',
    description:
      'Chain Base64, URL, hex, HTML escape, MD5/SHA-256 and more in any order and see each step result. Runs in your browser; nothing is sent to a server.',
    h1: 'Multi-Step Encode / Decode & Hash Chain (Recipe Builder)',
    introHtml:
      'Line up conversion steps (a recipe) and they are applied to your input from top to bottom. Do multi-stage jobs such as Base64 decode → URL decode, or text → Base64 → SHA-256, in one go. For a single conversion, the <a href="/en/tools/base64/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Base64 Encoder/Decoder</a> or the <a href="/en/tools/hash-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Hash Generator</a> is quicker.',
    inputLabel: 'Input',
    inputPlaceholder: 'Enter text to convert',
    recipeLabel: 'Recipe (applied top to bottom)',
    addStepLabel: 'Operation to add',
    addStep: 'Add',
    emptyRecipe: 'No steps yet. Pick an operation and press "Add".',
    clearRecipe: 'Remove all',
    moveUp: 'Up',
    moveDown: 'Down',
    removeStep: 'Remove',
    stepOutputLabel: 'Output',
    outputLabel: 'Final result',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    stepInvalid:
      'Step {n} ({op}) could not be applied. Check that the previous output has the format this operation expects.',
    unsupported:
      'Your browser does not support this operation (hash calculation). Please update to a recent version.',
    nonUtf8Notice:
      'The result contains bytes that are not valid UTF-8 text (shown as �). Add "Hex encode" at the end to inspect it.',
    maxSteps: 'A recipe can have up to 20 steps.',
    ops: {
      'base64-encode': 'Base64 encode',
      'base64-decode': 'Base64 decode',
      'url-encode': 'URL encode',
      'url-decode': 'URL decode',
      'hex-encode': 'Hex encode',
      'hex-decode': 'Hex decode',
      'html-escape': 'HTML escape',
      'html-unescape': 'HTML unescape',
      'unicode-escape': 'Unicode escape (\\uXXXX)',
      'unicode-unescape': 'Unicode unescape',
      md5: 'MD5 hash',
      sha1: 'SHA-1 hash',
      sha256: 'SHA-256 hash',
      sha512: 'SHA-512 hash',
      rot13: 'ROT13',
      reverse: 'Reverse text',
      uppercase: 'To uppercase',
      lowercase: 'To lowercase',
    },
    howToHeading: 'How to use',
    howToSteps: [
      'Enter the text to convert in "Input".',
      'Pick an operation under "Operation to add" and press "Add". Repeat for as many steps as you need.',
      'Reorder with "Up" / "Down" and drop unwanted steps with "Remove". Each step shows its intermediate "Output".',
      'Check the "Final result" and take it with "Copy".',
    ],
    notesHeading: 'Notes',
    notes: [
      'Each step passes its output straight to the next step as input. Encoding operations treat text as UTF-8.',
      'Base64 decode also accepts Base64URL (- and _), line breaks and missing padding. Hex decode accepts spaces, commas and 0x prefixes.',
      'Base64 and URL encoding are not encryption. MD5 and SHA-1 have known collisions and are unsuitable for security uses such as password storage.',
      'Case conversion, reverse, ROT13 and HTML/Unicode escaping read the previous output as UTF-8 text. Invalid UTF-8 bytes become �, so for binary data, or when a Base64 decode yields non-UTF-8 bytes, put "Hex encode" or "Base64 encode" before them.',
      'The recipe is lost when you close the page (saving and share links are not supported).',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Recipe',
        description:
          'An ordered list of conversion steps. Each step output becomes the next step input, so several conversions run in a single action.',
      },
      {
        term: 'Hash',
        description:
          'A one-way function that turns any data into a fixed-length value. It cannot be reversed, and the same input always gives the same value, which is why it is used to detect tampering.',
      },
      {
        term: 'ROT13',
        description:
          'A simple substitution that shifts each letter by 13. Applying it twice restores the original, but it offers no real security.',
      },
    ],
  },
};
