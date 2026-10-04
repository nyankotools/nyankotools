import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '生成されたデータは本番や実在の人物と無関係ですか？',
      answer:
        '架空のデータですが、氏名・住所・会社名は一般的な語の組み合わせで作っているため、偶然実在のものと一致する可能性があります。メールアドレスは example.com など例示用の予約ドメインだけなので実在のアドレスには届きませんが、本番データとして使うことは避けてください。',
    },
    {
      question: '同じデータをもう一度生成するにはどうすればよいですか？',
      answer:
        'シード欄に任意の文字列（例: test-1）を入力してください。同じシード・件数・項目・言語の組み合わせなら、毎回同じデータが生成されます。空欄にすると生成のたびに異なるデータになります。',
    },
    {
      question: 'CSVをExcelで開くと文字化けしませんか？',
      answer:
        'ダウンロードしたCSV・TSVは UTF-8（BOM付き）で保存するため、Excelでも日本語が文字化けしにくくなっています。コピーしたテキストを貼り付けて使う場合は、BOMは含まれません。',
    },
    {
      question: '電話番号や郵便番号は実在しますか？',
      answer:
        '日本語データの電話番号（070/080/090の携帯形式）と郵便番号はランダムな数字なので、実在の番号と偶然一致することがあります。英語データの電話番号は、北米で架空番号として確保されている 555-0100〜0199 の範囲です。',
    },
    {
      question: '一度に何件まで生成できますか？',
      answer:
        '最大1,000件です。大量のデータが必要な場合は、シードを変えて複数回生成するか、スクリプトで生成してください。',
    },
  ],
  en: [
    {
      question: 'Is the generated data unrelated to real people?',
      answer:
        'It is fictional, but names, addresses, and companies are built from common words, so a record can coincidentally match a real one. Emails only use reserved example domains such as example.com and never reach a real inbox. Still, avoid using the data as real production data.',
    },
    {
      question: 'How do I generate the same data again?',
      answer:
        'Enter any string in the seed field (for example test-1). The same seed with the same count, fields, and language always produces the same data. Leave the seed empty to get different data every time.',
    },
    {
      question: 'Will the CSV open correctly in Excel?',
      answer:
        'Downloaded CSV and TSV files are saved as UTF-8 with a BOM, which helps Excel display non-ASCII text correctly. Text you copy from the result box does not include the BOM.',
    },
    {
      question: 'Are the phone numbers and postal codes real?',
      answer:
        'English phone numbers use 555-0100 to 555-0199, the range reserved for fictional numbers in North America. Japanese phone numbers and postal codes are random digits, so one may coincidentally match a real number.',
    },
    {
      question: 'How many records can I generate at once?',
      answer:
        'Up to 1,000. If you need more, generate several batches with different seeds or use a script.',
    },
  ],
};
