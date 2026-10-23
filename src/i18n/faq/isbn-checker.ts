import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ISBN-10の末尾の「X」は何ですか？',
      answer:
        'ISBN-10のチェックデジットは11で割った余りから求めるため、余りが10になる場合だけ数字ではなくローマ数字の10を表す「X」を使います。小文字のxで入力しても大文字として扱います。',
    },
    {
      question: 'ISBN-10とISBN-13はどう変換しますか？',
      answer:
        'ISBN-10の先頭9桁の前に978を付け、ISBN-13としてチェックデジットを計算し直します。逆にISBN-13からISBN-10へは、978の次の9桁にISBN-10のチェックデジットを付けます。979始まりのISBN-13には対応するISBN-10がありません。',
    },
    {
      question: '桁数が足りないコードを入れるとどうなりますか？',
      answer:
        '9桁（ISBN-10）、12桁（ISBN-13・JAN）、7桁（JAN-8）は、チェックデジットが未入力のものとして末尾を計算して補います。それ以外の桁数はエラーになります。',
    },
    {
      question: 'チェックデジットが正しければ実在する本や商品ですか？',
      answer:
        'いいえ。チェックデジットは入力ミスや読み取りミスを見つけるための数字で、実在するかどうかは確認できません。登録状況は国立国会図書館やGS1などの情報で調べてください。',
    },
  ],
  en: [
    {
      question: 'What does the "X" at the end of an ISBN-10 mean?',
      answer:
        'The ISBN-10 check digit is derived from a remainder when dividing by 11. When the remainder is 10, the Roman numeral X is used instead of a digit. Lowercase x is accepted and treated as uppercase.',
    },
    {
      question: 'How are ISBN-10 and ISBN-13 converted?',
      answer:
        'To go from ISBN-10 to ISBN-13, put 978 before the first 9 digits and recalculate the check digit. To go back, take the 9 digits after 978 and add the ISBN-10 check digit. ISBN-13 numbers starting with 979 have no ISBN-10 equivalent.',
    },
    {
      question: 'What happens if I enter a code without its last digit?',
      answer:
        'Inputs of 9 digits (ISBN-10), 12 digits (ISBN-13 / EAN-13), or 7 digits (EAN-8) are treated as having no check digit, and the tool calculates it. Any other length produces an error.',
    },
    {
      question: 'Does a valid check digit mean the book or product exists?',
      answer:
        'No. The check digit only detects typing and scanning errors; it cannot tell whether the code has been assigned. Look the code up in a library catalogue or GS1 database to confirm that.',
    },
  ],
};
