import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'SQLのエスケープだけでSQLインジェクションは防げますか？',
      answer:
        '防げません。このツールのSQLエスケープは学習・表示用です。本番のアプリケーションでは、SQL文を文字列連結で作らず、プレースホルダー（パラメータ化クエリ）で値を渡してください。',
    },
    {
      question: 'SQLの「標準」と「MySQL」の方式はどう違いますか？',
      answer:
        "標準SQLは単一引用符を2つ重ねて（''）表します。MySQLはそれに加えて、バックスラッシュ（\\'、\\n、\\\\ など）も使えます。使うデータベースに合わせて選んでください。",
    },
    {
      question: 'シェルのエスケープはなぜ全体を単一引用符で囲むのですか？',
      answer:
        "単一引用符の中では、$・`・バックスラッシュなどがすべて文字として扱われるためです。文字列中の単一引用符だけは「'\\''」のように引用符を一度閉じて書き直します。bash・zshなどのPOSIX系シェル向けです。",
    },
    {
      question: '正規表現のエスケープで、どの文字が対象ですか？',
      answer:
        '. * + ? ^ $ { } ( ) | [ ] \\ / - が対象です。この結果を new RegExp() に渡すと、元の文字列にそのまま一致するパターンになります。',
    },
    {
      question: 'JSON文字列のアンエスケープで両端の二重引用符は必要ですか？',
      answer:
        'どちらでも構いません。"..." のように囲まれていれば外側の引用符を取り除いてから変換します。囲まれていなくても、中身だけを入力して変換できます。',
    },
  ],
  en: [
    {
      question: 'Does SQL escaping alone prevent SQL injection?',
      answer:
        'No. The SQL escaping here is for learning and display. In real applications, do not build SQL by string concatenation; pass values through placeholders (parameterized queries).',
    },
    {
      question:
        'What is the difference between the standard and MySQL SQL styles?',
      answer:
        "Standard SQL writes a single quote as two single quotes (''). MySQL also accepts backslash escapes such as \\', \\n and \\\\. Pick the one that matches your database.",
    },
    {
      question: 'Why is the shell output wrapped in single quotes?',
      answer:
        "Inside single quotes, characters such as $, ` and backslash are all taken literally. A single quote inside the text is written by closing the quote, adding an escaped quote, and reopening: '\\''. This targets POSIX-style shells like bash and zsh.",
    },
    {
      question: 'Which characters does regex escaping cover?',
      answer:
        'It covers . * + ? ^ $ { } ( ) | [ ] \\ / and -. Passing the result to new RegExp() gives a pattern that matches the original text literally.',
    },
    {
      question:
        'Do I need the surrounding double quotes to unescape a JSON string?',
      answer:
        'No, either works. If the input is wrapped like "...", the outer quotes are removed before converting. You can also paste just the contents without quotes.',
    },
  ],
};
