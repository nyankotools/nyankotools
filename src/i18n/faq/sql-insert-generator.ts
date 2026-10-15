import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'カラムの型はどのように推定されますか？',
      answer:
        '列全体の値を見て判定します。すべて整数ならINT（桁数が多ければBIGINT）、小数を含めばDOUBLE、true/falseだけならBOOLEANです。それ以外や、先頭ゼロの値（郵便番号や電話番号など）は文字列になります。',
    },
    {
      question: '空欄はNULLと空文字列のどちらになりますか？',
      answer:
        "既定ではNULLです。「空欄をNULLにする」をオフにすると空文字列（''）になります。JSONではnullや存在しないキーがNULLになります。",
    },
    {
      question: 'SQL方言ごとに出力はどう変わりますか？',
      answer:
        "識別子の引用符（MySQLはバッククォート、SQL Serverは角括弧、他はダブルクォート）、型名、真偽値の書き方（SQLite・SQL Server・Oracleは1/0）が変わります。MySQLは文字列中のバックスラッシュもエスケープし、SQL Serverは文字列をN'…'形式、Oracleは複数行をINSERT ALLで出力します。",
    },
    {
      question: '大量の行を変換しても大丈夫ですか？',
      answer:
        '処理はブラウザ内で行うため、行数はブラウザのメモリ次第です。複数行VALUESは1,000行ごとに別のINSERT文へ分割するので、DB側の1文あたりの上限にも当たりにくくなっています。',
    },
  ],
  en: [
    {
      question: 'How are column types inferred?',
      answer:
        'The whole column is examined. All integers become INT (BIGINT for long ones), any decimal becomes DOUBLE, and only true/false becomes BOOLEAN. Anything else, including values with leading zeros such as ZIP or phone numbers, becomes text.',
    },
    {
      question: 'Do empty fields become NULL or an empty string?',
      answer:
        'NULL by default. Turn off "Treat empty fields as NULL" to get an empty string (\'\'). In JSON, null and missing keys become NULL.',
    },
    {
      question: 'How does the output differ between SQL dialects?',
      answer:
        "Identifier quoting (backticks for MySQL, square brackets for SQL Server, double quotes for the others), type names and boolean literals (1/0 for SQLite, SQL Server and Oracle) change. MySQL also escapes backslashes in strings, SQL Server uses N'…' literals, and Oracle emits multiple rows as INSERT ALL.",
    },
    {
      question: 'Can I convert a large number of rows?',
      answer:
        'Processing happens in your browser, so the limit is your browser memory. Multi-row VALUES are split into a new INSERT every 1,000 rows, which helps stay under per-statement limits on the database side.',
    },
  ],
};
