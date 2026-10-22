import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '実際のクレジットカード番号を入力しても安全ですか？',
      answer:
        '計算はブラウザの中だけで行い、番号を送信・保存することはありません。ただし、実カード番号の入力は推奨しません。動作確認には、ページ内のテスト用番号を使ってください。',
    },
    {
      question: 'Luhnチェックに合格すれば、カードは使えますか？',
      answer:
        'いいえ。Luhnチェックは入力ミスを見つけるための計算で、カードの実在・有効期限・利用可否は分かりません。偶然通る番号も10回に1回程度あります。',
    },
    {
      question: 'ブランドはどうやって判定していますか？',
      answer:
        '先頭の桁（IIN/BIN）の範囲で判定しています。たとえばVisaは4から始まり、Mastercardは51〜55と2221〜2720、JCBは3528〜3589です。簡易判定なので、確定には決済事業者の判定を使ってください。',
    },
    {
      question: 'Luhnの検査桁はどう計算しますか？',
      answer:
        '検査桁を除いた数字を右端から1桁おきに2倍し、9を超えたら9を引いて全部足します。その合計に足して10の倍数になる数字が検査桁です。不合格のときは、計算結果の検査桁も表示します。',
    },
  ],
  en: [
    {
      question: 'Is it safe to enter a real credit card number?',
      answer:
        'The calculation runs only in your browser and nothing is sent or stored. Even so, entering real card numbers is not recommended; use the test numbers on this page instead.',
    },
    {
      question: 'If a number passes the Luhn check, can the card be used?',
      answer:
        'No. The Luhn check only catches typing mistakes. It cannot tell whether the card exists, has expired or can be charged, and about one random number in ten passes by chance.',
    },
    {
      question: 'How is the card brand detected?',
      answer:
        'By the leading digits (IIN/BIN). For example Visa starts with 4, Mastercard with 51-55 or 2221-2720, and JCB with 3528-3589. It is a simple lookup, so rely on your payment provider for the final answer.',
    },
    {
      question: 'How is the Luhn check digit calculated?',
      answer:
        'Double every second digit from the right (excluding the check digit), subtract 9 from any result above 9, and add everything up. The check digit is the number that brings the total to a multiple of 10. When a number fails, the expected check digit is shown.',
    },
  ],
};
