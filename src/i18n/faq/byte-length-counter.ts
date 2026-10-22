import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '日本語1文字は何バイトですか？',
      answer:
        'UTF-8ではひらがな・カタカナ・漢字・全角記号は3バイト、半角英数字は1バイト、絵文字は4バイトです。Shift_JISでは全角文字が2バイト、半角英数字と半角カナが1バイトです。UTF-16ではほとんどの文字が2バイト、絵文字などは4バイトです。',
    },
    {
      question:
        'Shift_JISで表現できない文字（絵文字など）はどう数えられますか？',
      answer:
        'Shift_JISに存在しない文字は、実際に変換すると「?」などに置き換わる（または変換エラーになる）ため、このツールでは「?」1バイトとして数え、該当する文字を一覧に表示します。保存前に文字を置き換えるか、UTF-8を使うかご検討ください。',
    },
    {
      question:
        'DBのVARCHAR(255)など、文字数で制限される場合はどうなりますか？',
      answer:
        'MySQLのVARCHAR(n)やPostgreSQLのvarchar(n)は文字数で制限されるため、バイト数は関係しません。一方、Oracleのバイト指定の列や、MySQLのインデックス長（バイト単位）などはバイトで制限されます。仕様を確認し、バイトで制限される場合にこのツールをお使いください。',
    },
    {
      question: '上限を超える位置はどう確認しますか？',
      answer:
        '「上限バイト数のチェック」で文字コードと上限を指定すると、上限に収まる部分と超過する部分が分かれて表示され、何文字目から超えるかも示されます。マルチバイト文字の途中では区切らず、その文字を含めると超える場合は手前までを「収まる部分」とします。',
    },
    {
      question: '入力したテキストは保存・送信されますか？',
      answer:
        'いいえ。バイト数の計算はすべてブラウザ内で行われ、入力内容がサーバーへ送信されたり保存されたりすることはありません。',
    },
  ],
  en: [
    {
      question: 'How many bytes is a Japanese character?',
      answer:
        'In UTF-8, hiragana, katakana, kanji and full-width symbols take 3 bytes, ASCII takes 1 and emoji take 4. In Shift_JIS, full-width characters take 2 bytes and ASCII and half-width katakana take 1. In UTF-16, most characters take 2 bytes and emoji take 4.',
    },
    {
      question: 'How are characters that Shift_JIS cannot represent counted?',
      answer:
        'Characters missing from Shift_JIS, such as emoji, become "?" (or cause an error) when actually converted. This tool counts each one as a 1-byte "?" and lists the affected characters so you can replace them or switch to UTF-8.',
    },
    {
      question: 'What if my database limits characters, like VARCHAR(255)?',
      answer:
        'MySQL VARCHAR(n) and PostgreSQL varchar(n) limit characters, not bytes, so byte length does not matter there. Byte-based limits apply to things like Oracle byte-semantics columns and MySQL index key length. Check which one your system uses, and use this tool when the limit is in bytes.',
    },
    {
      question: 'How do I find where the limit is exceeded?',
      answer:
        'In the byte limit check, pick an encoding and a limit. The text is split into the part that fits and the part that goes over, and the character number where it goes over is shown. Multi-byte characters are never cut in half; if a character does not fit, the fitting part ends just before it.',
    },
    {
      question: 'Is my text saved or sent anywhere?',
      answer:
        'No. Byte counting happens entirely in your browser, and your text is never sent to or stored on a server.',
    },
  ],
};
