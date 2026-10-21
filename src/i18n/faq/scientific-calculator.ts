import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '0.1+0.2 が 0.30000000000000004 にならないのはなぜですか？',
      answer:
        'JavaScriptの数値は2進の浮動小数点なので、内部では0.1+0.2が0.30000000000000004になります。この電卓は結果を有効12桁に丸めて表示するため、0.3と表示されます。12桁を超える精度が必要な計算（大きな整数の厳密な計算など）には向きません。',
    },
    {
      question: 'sin(30) が 0.5 にならず -0.988 になります。',
      answer:
        '角度の単位がラジアンになっているためです。sin(30) を30度として計算するには「度 (DEG)」に切り替え、Enterか＝を押し直してください。ラジアンのまま30度を扱うなら sin(30*π/180) と書きます。',
    },
    {
      question: '階乗はいくつまで計算できますか？',
      answer:
        '0以上の整数で170!までです。171!以上は結果がJavaScriptで扱える最大値を超えるため「計算できません」と表示します。小数や負数の階乗も計算できません。',
    },
    {
      question: '「ans」とは何ですか？',
      answer:
        '直前に計算に成功した結果を呼び出す変数です。たとえば 12*5 を計算したあとに ans/3 と入力すると20になります。エラーになった計算では更新されません。',
    },
    {
      question: '2π や 3(4+5) のように掛け算を省略できますか？',
      answer:
        'できます。数字・定数・かっこが続く場合は掛け算として扱います。なお、べき乗は右から先に計算します（2^3^2 は 2^9 = 512）。意図と違うときはかっこで順序を指定してください。',
    },
  ],
  en: [
    {
      question: 'Why does 0.1+0.2 show 0.3 instead of 0.30000000000000004?',
      answer:
        'JavaScript stores numbers as binary floating point, so 0.1+0.2 is really 0.30000000000000004 internally. This calculator rounds results to 12 significant digits, so you see 0.3. It is not suited to work that needs more than 12 digits, such as exact arithmetic on very large integers.',
    },
    {
      question: 'Why does sin(30) give -0.988 instead of 0.5?',
      answer:
        'The angle unit is set to radians. Switch to "Degrees (DEG)" and press Enter or = again to treat 30 as 30 degrees. In radian mode, write sin(30*π/180) instead.',
    },
    {
      question: 'How large a factorial can it calculate?',
      answer:
        'Whole numbers from 0 up to 170!. From 171! the result exceeds the largest number JavaScript can represent, so the tool shows a "cannot calculate" message. Factorials of decimals or negative numbers are not supported.',
    },
    {
      question: 'What is "ans"?',
      answer:
        'A variable holding the last successful result. After calculating 12*5, typing ans/3 gives 20. A calculation that ends in an error does not update it.',
    },
    {
      question: 'Can I leave out the multiplication sign, as in 2π or 3(4+5)?',
      answer:
        'Yes. A number, constant or parenthesis directly followed by another is treated as multiplication. Powers are evaluated right to left (2^3^2 is 2^9 = 512), so add parentheses if you want a different order.',
    },
  ],
};
