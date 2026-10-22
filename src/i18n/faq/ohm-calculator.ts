import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'オームの法則の計算は、何を入力すれば残りが求まりますか？',
      answer:
        '電圧V・電流I・抵抗R・電力Pのうち、どれか2つがわかれば残りの2つを求められます。V=I×R、P=V×I をもとに、たとえば抵抗と電力から電圧を求めるときは V=√(P×R) になります。',
    },
    {
      question: 'mA や kΩ はどう入力すればよいですか？',
      answer:
        '数値のあとに接頭辞を付けます。20mA は 20m、4.7kΩ は 4.7k、1MΩ は 1M です。小文字の m はミリ、大文字の M はメガで区別されます。5V や 100Ω のように単位記号を付けても読み取れます。',
    },
    {
      question:
        '並列にした抵抗の合成値が一番小さい抵抗より小さくなるのはなぜですか？',
      answer:
        '並列では電流の通り道が増えるため、全体として電流が流れやすくなります。合成抵抗は 1/R = 1/R1 + 1/R2 + … で求まり、必ずどの抵抗よりも小さくなります。同じ値の抵抗を2本並列にすると半分です。',
    },
    {
      question: 'LEDの抵抗値が計算値ぴったりの市販品にならないのはなぜですか？',
      answer:
        '市販の抵抗は E24 などの標準値しかありません。このツールは計算値以上で最も近い E24 の値を示し、その抵抗を使ったときの実際の電流も表示します。電流が計算値より少し小さくなる向きなので、LEDを守る側に丸めています。',
    },
    {
      question: '交流や、コイル・コンデンサのある回路にも使えますか？',
      answer:
        '直流回路と、交流の実効値で見た抵抗だけの回路向けです。コイルやコンデンサを含む回路ではインピーダンスや力率が関わるため、このツールの結果は当てはまりません。',
    },
  ],
  en: [
    {
      question: "Which two values do I need for Ohm's law?",
      answer:
        'Any two of voltage, current, resistance and power are enough to find the other two. The formulas are V = I x R and P = V x I; for example, from resistance and power the voltage is V = sqrt(P x R).',
    },
    {
      question: 'How do I enter mA or kilohms?',
      answer:
        'Add a prefix after the number: 20m for 20 mA, 4.7k for 4.7 kilohms, 1M for 1 megohm. Lowercase m is milli and uppercase M is mega. Unit symbols such as 5V or 100Ω are accepted too.',
    },
    {
      question:
        'Why is parallel resistance smaller than the smallest resistor?',
      answer:
        'Each added branch gives current another path, so the whole group conducts more easily. The total comes from 1/R = 1/R1 + 1/R2 + ... and is always below every individual value. Two equal resistors in parallel give half.',
    },
    {
      question: 'Why is the LED resistor not exactly the calculated value?',
      answer:
        'Stocked resistors come in standard steps such as E24. The tool shows the nearest E24 value at or above the calculated one and the real current with it. Rounding up lowers the current slightly, which errs on the side of protecting the LED.',
    },
    {
      question: 'Does it work for AC or circuits with coils and capacitors?',
      answer:
        'It is meant for DC circuits and purely resistive AC loads using RMS values. Coils and capacitors bring in impedance and power factor, so these formulas do not apply to them.',
    },
  ],
};
