import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'JSONL（NDJSON）とは何ですか？通常のJSONと何が違いますか？',
      answer:
        '1行に1つのJSON値を書き、改行で区切る形式です。NDJSONやJSON Linesとも呼ばれ、全体を読み込まなくても1行ずつ処理できるため、ログや機械学習の学習データ、BigQueryなどのインポートでよく使われます。',
    },
    {
      question: 'JSONLの途中に空行があっても変換できますか？',
      answer:
        'はい。空行は読み飛ばします。不正な行がある場合は、空行を含めた元の行番号でエラーを表示するので、元データの該当箇所をすぐ探せます。',
    },
    {
      question: 'JSONL→CSVで行ごとにキーが違う場合はどうなりますか？',
      answer:
        'すべての行のキーを出現順にまとめた列を作り、その行に無いキーのセルは空にします。ネストしたオブジェクトや配列はJSON文字列としてセルに入ります。各行がオブジェクトでない場合はエラーになります。',
    },
    {
      question: 'CSV→JSONLで数値は数値になりますか？',
      answer:
        'いいえ。CSVの値はすべて文字列として出力します。数値や真偽値として使いたい場合は、取り込み側で型を変換してください。',
    },
  ],
  en: [
    {
      question: 'What is JSONL (NDJSON) and how does it differ from JSON?',
      answer:
        'It stores one JSON value per line, separated by newlines. Also called NDJSON or JSON Lines, it can be processed line by line without loading the whole file, so it is common for logs, machine-learning datasets and BigQuery imports.',
    },
    {
      question: 'Can it convert JSONL that contains blank lines?',
      answer:
        'Yes. Blank lines are skipped. If a line is invalid, the error reports its original line number (blank lines included) so you can find it in your source data.',
    },
    {
      question:
        'What happens to JSONL to CSV when the keys differ between lines?',
      answer:
        'Columns are the union of all keys in order of first appearance, and cells for keys a line does not have are left empty. Nested objects and arrays go into the cell as JSON strings. If a line is not an object, an error is shown.',
    },
    {
      question: 'Are numbers kept as numbers in CSV to JSONL?',
      answer:
        'No. Every CSV value is output as a string. Convert types on the consuming side if you need numbers or booleans.',
    },
  ],
};
