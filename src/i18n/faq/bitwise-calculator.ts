import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '負の数を入力するとビット列はどうなりますか？',
      answer:
        '2の補数で表します。たとえば8bitで-1と入力すると11111111（0xFF）、-128なら10000000（0x80）になります。結果の符号付き10進の欄では、最上位ビットが1の値を負数として読み替えた値を確認できます。',
    },
    {
      question: '論理右シフトと算術右シフトは何が違いますか？',
      answer:
        '空いた上位ビットの埋め方が違います。論理右シフトは常に0で埋め、算術右シフトは符号ビットで埋めます。8bitで0x80（-128）を1ビット右にずらすと、論理では0x40（64）、算術では0xC0（-64）です。',
    },
    {
      question: '64bitの値でも正確に計算できますか？',
      answer:
        'できます。内部ではJavaScriptのBigIntを使うため、2の53乗を超える値でも丸め誤差は出ません。64bitの最大値は18446744073709551615（0xFFFFFFFFFFFFFFFF）です。',
    },
    {
      question: 'シフト量にビット幅以上の値を入れるとどうなりますか？',
      answer:
        '左シフトと論理右シフトは結果が0になり、算術右シフトは符号ビットで全体が埋まります。ローテートはビット幅で割った余りだけ回転します。C言語などではこの場合の動作が未定義なので、実際のコードで使う前に言語の仕様を確認してください。',
    },
  ],
  en: [
    {
      question: 'How are negative numbers turned into bits?',
      answer:
        'They use two’s complement. In 8 bits, -1 becomes 11111111 (0xFF) and -128 becomes 10000000 (0x80). The signed decimal row shows the value read as negative whenever the top bit is 1.',
    },
    {
      question: 'What is the difference between >> and >>>?',
      answer:
        'They fill the vacated top bits differently. A logical shift (>>>) always fills with 0; an arithmetic shift (>>) copies the sign bit. In 8 bits, shifting 0x80 (-128) right by 1 gives 0x40 (64) logically and 0xC0 (-64) arithmetically.',
    },
    {
      question: 'Is 64-bit math exact?',
      answer:
        'Yes. The tool uses JavaScript BigInt, so values above 2^53 are not rounded. The largest 64-bit value is 18446744073709551615 (0xFFFFFFFFFFFFFFFF).',
    },
    {
      question: 'What happens if the shift count is larger than the bit width?',
      answer:
        'Shift left and logical shift right return 0, and arithmetic shift right fills everything with the sign bit. Rotates use the count modulo the bit width. In C and some other languages this case is undefined, so check your language rules before relying on it.',
    },
  ],
};
