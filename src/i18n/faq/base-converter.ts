import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '負の数はどのように変換されますか？',
      answer:
        '選択したビット幅の2の補数表現で変換します。たとえば8bitで10進数の「-1」は、2進数で「11111111」、16進数で「FF」になります。ビット幅を変えると同じ値でも表示が変わります。',
    },
    {
      question: '0xや0bなどのプレフィックスは付けて入力できますか？',
      answer:
        'はい。16進数の「0x」、2進数の「0b」、8進数の「0o」を付けたまま入力できます。大文字・小文字はどちらでも構いません。',
    },
    {
      question: '64bitの大きな数値でも正確に変換できますか？',
      answer:
        '内部でBigIntを使って計算するため、64bitの範囲でも桁落ちなく正確に変換できます。JavaScriptの通常のNumber型で扱うと丸め誤差が出る大きな値でも問題ありません。',
    },
  ],
  en: [
    {
      question: 'How are negative numbers converted?',
      answer:
        "They are converted using two's complement at the selected bit width. For example, decimal -1 at 8 bits becomes 11111111 in binary and FF in hex. Changing the bit width changes the representation of the same value.",
    },
    {
      question: 'Can I enter values with prefixes such as 0x or 0b?',
      answer:
        'Yes. You can enter hexadecimal with "0x", binary with "0b" and octal with "0o". Letters can be upper or lower case.',
    },
    {
      question: 'Can it convert large 64-bit values accurately?',
      answer:
        'Yes. The tool uses BigInt internally, so values across the full 64-bit range are converted exactly, without the rounding errors that regular JavaScript numbers would introduce.',
    },
  ],
};
