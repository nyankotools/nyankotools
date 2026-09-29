import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'どの文字種を変換できますか？',
      answer:
        '英数字・記号・カタカナ・スペースの4種類を選んで、全角と半角を相互に変換できます。ひらがなや漢字は変換の対象ではありません。',
    },
    {
      question: '半角カタカナの濁点はどう変換されますか？',
      answer:
        '半角カタカナの「ｶﾞ」のように濁点・半濁点が別の文字になっているものは、全角に変換すると「ガ」の1文字にまとめられます。逆に全角の「ガ」は半角では2文字になり、文字数が増えます。',
    },
    {
      question: 'フォーム入力の表記ゆれを統一するにはどう使いますか？',
      answer:
        '電話番号や郵便番号、メールアドレスなどの入力データを半角に統一しておくと、検索や重複チェックがしやすくなります。変換後の文字数は文字数カウントで確認できます。',
    },
  ],
  en: [
    {
      question: 'Which character types can be converted?',
      answer:
        'You can choose among alphanumerics, symbols, katakana and spaces, converting between full-width and half-width. Hiragana and kanji are not affected.',
    },
    {
      question: 'How are half-width katakana with dakuten handled?',
      answer:
        'Half-width "ｶﾞ" (two characters) is merged into full-width "ガ" (one character), and the reverse conversion produces two characters, so the length changes.',
    },
    {
      question: 'How can I use it to standardize form input?',
      answer:
        'Normalizing phone numbers, postal codes and emails to half-width makes searching and duplicate checks easier. Use the character counter to check the resulting length.',
    },
  ],
};
