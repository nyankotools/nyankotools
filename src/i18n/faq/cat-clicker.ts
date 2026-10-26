import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '進行状況はどこに保存されますか？',
      answer:
        'このブラウザのlocalStorageにだけ保存され、サーバーには送信されません。別のブラウザや端末とは共有されず、ブラウザのデータを消去すると失われます。保存できない環境でも遊べますが、ページを閉じると消えます。',
    },
    {
      question: 'ページを閉じている間も「さかな」は増えますか？',
      answer:
        '次に開いたとき、閉じていた時間ぶんの毎秒の増加量をまとめて加算します。ただし上限は8時間分で、それ以上放置しても増える量は変わりません。ブラウザが動き続けているわけではなく、経過時間から計算しています。',
    },
    {
      question: 'アップグレードの価格はどう変わりますか？',
      answer:
        '買うたびに約15%ずつ高くなります（基本価格×1.15のレベル乗、小数点以下は切り上げ）。クリック力を上げるものと、毎秒の自動加算を上げるものがあり、組み合わせて育てます。',
    },
    {
      question: '端末の時計を進めると、すぐに増やせますか？',
      answer:
        '時計を進めても加算できるのは最大8時間分までです。時計を戻した場合は加算されません。ひとり遊び用のゲームなので、ズルを厳密に防ぐ仕組みはありません。',
    },
  ],
  en: [
    {
      question: 'Where is my progress stored?',
      answer:
        "Only in this browser's localStorage; nothing is sent to a server. It is not shared with other browsers or devices and is lost if you clear browser data. The game still works without storage, but progress disappears when you close the page.",
    },
    {
      question: 'Do I keep earning fish while the page is closed?',
      answer:
        'When you open the page again, the time you were away is converted into fish at your per-second rate. It is capped at 8 hours, so longer absences add nothing more. Nothing actually runs in the background; the amount is calculated from the elapsed time.',
    },
    {
      question: 'How do upgrade prices grow?',
      answer:
        'Each purchase makes that upgrade about 15% more expensive (base price × 1.15 to the power of its level, rounded up). Some upgrades raise your per-click gain and others raise your automatic per-second gain, so mix them.',
    },
    {
      question: 'Can I cheat by changing my device clock?',
      answer:
        'Moving the clock forward only gives you up to 8 hours of idle earnings, and moving it back gives nothing. It is a single-player toy, so there is no strict anti-cheat.',
    },
  ],
};
