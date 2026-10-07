import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '1920×1080のアスペクト比はいくつですか？',
      answer:
        '16:9です。幅と高さを最大公約数（120）で割ると16:9になります。このツールに幅と高さを入力すると、約分した比率が表示されます。',
    },
    {
      question: '計算結果が小数になる場合はどうなりますか？',
      answer:
        '四捨五入した整数を結果として表示し、厳密値も併記します。動画では偶数サイズが必要なコーデックもあるため、用途に合わせて調整してください。',
    },
    {
      question: '1366×768が16:9と表示されないのはなぜですか？',
      answer:
        '1366×768は厳密には683:384で、16:9（1.7778）とわずかに差があります。このツールでは約分した厳密な比率を表示し、あわせて近い代表的な比率として16:9を示します。',
    },
    {
      question: '縦長（9:16など）の比率も計算できますか？',
      answer:
        'はい。プリセットに9:16・3:4・2:3などの縦長比率を用意しています。カスタムなら任意の比率を入力できます。',
    },
  ],
  en: [
    {
      question: 'What is the aspect ratio of 1920×1080?',
      answer:
        'It is 16:9. Dividing both sides by their greatest common divisor (120) gives 16:9. Enter a width and height and the tool shows the simplified ratio.',
    },
    {
      question: 'What happens when the result is not a whole number?',
      answer:
        'The result is rounded to the nearest integer and the exact value is shown alongside it. Some video codecs need even dimensions, so adjust the result for your use case.',
    },
    {
      question: 'Why is 1366×768 not shown as 16:9?',
      answer:
        'Strictly, 1366×768 reduces to 683:384, which is slightly different from 16:9 (1.7778). The tool shows the exact simplified ratio and also lists 16:9 as the closest common ratio.',
    },
    {
      question: 'Can I calculate portrait ratios such as 9:16?',
      answer:
        'Yes. The presets include portrait ratios such as 9:16, 3:4 and 2:3, and the custom option accepts any ratio you type.',
    },
  ],
};
