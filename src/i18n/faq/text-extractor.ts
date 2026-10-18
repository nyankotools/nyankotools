import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '正規表現を書かずにメールアドレスやURLだけを取り出せますか？',
      answer:
        'はい。抽出したい種類（メールアドレス・URL・電話番号・日付・IPv4・郵便番号・ハッシュタグ）にチェックを入れるだけで、テキストから該当する文字列を取り出せます。独自のパターンで抽出したい場合は正規表現テスターをご利用ください。',
    },
    {
      question: '同じメールアドレスが複数あるときは1件にまとめられますか？',
      answer:
        '「重複を除去する」をオンにすると、最初に出てきたものだけが残ります。大文字小文字だけが違うアドレスを同じものとして扱うかは「重複判定で大文字小文字を区別しない」で切り替えられます。結果の下に重複除去前の件数も表示されます。',
    },
    {
      question: '文章の末尾に付いた句点や括弧はURLに含まれますか？',
      answer:
        '含まれません。URLの末尾にある「.」「,」「!」などの句読点と、対応する開き括弧のない「)」は取り除きます。また、URLの直後に日本語が続く場合は、日本語の文字が出現した位置でURLを終わらせます。',
    },
    {
      question: '電話番号や日付はどんな書き方に対応していますか？',
      answer:
        '電話番号は03-1234-5678のようなハイフン区切りと、+81を使った国際表記、09012345678のようなハイフンなしの携帯番号に対応します。日付は2026-10-18、2026/10/18、2026.10.18、2026年10月18日の形式です。和暦や英語の月名は対応していません。',
    },
    {
      question: '貼り付けたテキストは送信・保存されますか？',
      answer:
        'いいえ。抽出はすべてブラウザ内で行われ、入力した内容がサーバーへ送信されたり保存されたりすることはありません。',
    },
  ],
  en: [
    {
      question: 'Can I pull out emails and URLs without writing a regex?',
      answer:
        'Yes. Tick the kinds of data you want (emails, URLs, phone numbers, dates, IPv4 addresses, postal codes, hashtags) and the matching strings are listed from your text. For a custom pattern, use the Regex Tester instead.',
    },
    {
      question: 'How do I merge repeated email addresses into one?',
      answer:
        'Turn on "Remove duplicates" and only the first occurrence is kept. "Ignore letter case when comparing" controls whether addresses that differ only in capitalization count as the same. The number found before removing duplicates is shown under the results.',
    },
    {
      question: 'Is punctuation after a URL included in the result?',
      answer:
        'No. Trailing punctuation such as ".", "," or "!" and a closing ")" without a matching "(" are stripped. If Japanese text follows a URL directly, the URL ends where the Japanese characters begin.',
    },
    {
      question: 'Which phone number and date formats are supported?',
      answer:
        'Phone numbers can be hyphenated Japanese numbers like 03-1234-5678, international forms with +81, or unhyphenated mobile numbers like 09012345678. Dates can be 2026-10-18, 2026/10/18, 2026.10.18 or 2026年10月18日. Era names and written-out month names are not supported.',
    },
    {
      question: 'Is my pasted text sent or stored anywhere?',
      answer:
        'No. Extraction happens entirely in your browser, and your text is never sent to or stored on a server.',
    },
  ],
};
