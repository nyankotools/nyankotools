import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '.envのコメントはどう扱われますか？',
      answer:
        '# から始まる行と、引用符のない値の「 #」以降はコメントとして無視され、JSONには含まれません。値の中に # を含めたい場合は、ダブルクォートかシングルクォートで囲んでください。',
    },
    {
      question: 'ダブルクォートとシングルクォートの違いは何ですか？',
      answer:
        'ダブルクォートの値では \\n や \\" などのエスケープを解釈します。シングルクォートの値は中身をそのまま扱います。どちらも閉じ引用符までの複数行の値を読み込めます。',
    },
    {
      question: 'ネストしたJSONを.envに変換できますか？',
      answer:
        'いいえ。.envはフラットなKEY=VALUEの形式なので、オブジェクトや配列を含むJSONはエラーになります。事前にキーを平坦化してから変換してください。',
    },
    {
      question: 'PORT=3000 が文字列の "3000" になります。',
      answer:
        '既定では値をすべて文字列として扱います。「数値・true/falseをJSONの型に変換する」にチェックを入れると 3000 が数値になります。0123 のような先頭0の値や、安全に表せない大きな整数は文字列のままです。',
    },
  ],
  en: [
    {
      question: 'How are comments in a .env file handled?',
      answer:
        'Lines starting with # and anything after " #" in an unquoted value are ignored and not included in the JSON. To keep a # inside a value, wrap the value in double or single quotes.',
    },
    {
      question: 'What is the difference between double and single quotes?',
      answer:
        'Double-quoted values interpret escapes such as \\n and \\". Single-quoted values are taken literally. Both can span several lines up to the closing quote.',
    },
    {
      question: 'Can I convert nested JSON to .env?',
      answer:
        'No. A .env file is flat KEY=VALUE lines, so JSON containing objects or arrays is reported as an error. Flatten the keys first, then convert.',
    },
    {
      question: 'Why is PORT=3000 a string "3000" in the JSON?',
      answer:
        'By default every value stays a string. Check "Convert numbers and true/false to JSON types" to get 3000 as a number. Values with leading zeros such as 0123 and integers too large to represent safely stay strings.',
    },
  ],
};
