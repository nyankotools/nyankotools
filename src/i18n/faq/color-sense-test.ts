import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'この色彩感覚テストで色覚異常かどうか分かりますか？',
      answer:
        '分かりません。これは娯楽用のゲームで、色覚検査や診断の代わりにはなりません。モニターや部屋の明るさにも大きく左右されます。色の見え方が気になる場合は、眼科などで正式な検査を受けてください。',
    },
    {
      question: '正解するたびに何が難しくなりますか？',
      answer:
        'タイルの数が増え（2×2から最大7×7）、あわせて通常のタイルと違うタイルの明るさの差が小さくなります。差は最初は約22%、最終的には約1.5%まで縮みます。',
    },
    {
      question: '間違えるとどうなりますか？',
      answer:
        '残り時間が3秒減り、同じ問題のままもう一度選べます。時間を使い切るとゲーム終了で、それまでの正解数がスコアになります。',
    },
    {
      question: '点数が日によって、端末によって違うのはなぜですか？',
      answer:
        'モニターの明るさ・色温度・ナイトモード、部屋の照明、疲れの度合いなどで色の見え方が変わるためです。問題の色も毎回ランダムです。他の人と比べるより、同じ環境での自己ベスト更新を目安にしてください。',
    },
    {
      question: 'ベストスコアはどこに保存されますか？',
      answer:
        'お使いのブラウザの localStorage にだけ保存されます。サーバーには送信されず、別のブラウザや端末とは共有されません。「記録を消去」で削除でき、ブラウザのサイトデータを消しても消えます。',
    },
  ],
  en: [
    {
      question:
        'Can this test tell me whether I have a color vision deficiency?',
      answer:
        'No. It is a game for fun and is not a color vision test or a diagnosis. Your monitor and room lighting affect the result a lot. If you are concerned about how you see colors, get a proper examination from an eye-care professional.',
    },
    {
      question: 'What gets harder as I answer correctly?',
      answer:
        'The grid grows from 2×2 up to 7×7, and the lightness difference between the odd tile and the others shrinks from about 22% at the start to about 1.5% at the limit.',
    },
    {
      question: 'What happens when I pick the wrong tile?',
      answer:
        'Three seconds are taken off the clock and you can try the same round again. When the time runs out, the game ends and your number of correct answers is the score.',
    },
    {
      question: 'Why does my score differ between days or devices?',
      answer:
        'Screen brightness, color temperature, night mode, room lighting and tiredness all change how colors look, and the colors are random each round. Rather than comparing with others, use your personal best on the same setup as a guide.',
    },
    {
      question: 'Where is my best score stored?',
      answer:
        'Only in your browser’s localStorage. It is not sent to a server and is not shared with other browsers or devices. You can remove it with "Clear record", and clearing site data in your browser also removes it.',
    },
  ],
};
