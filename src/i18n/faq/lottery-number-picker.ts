import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'このツールで選んだ番号は当たりやすいですか？',
      answer:
        'いいえ。ロトやナンバーズはどの番号の組み合わせも当せん確率が同じなので、ツールで選んでも確率は変わりませんし、当せんを保証するものでもありません。番号選びの手間を省く娯楽用ツールとしてご利用ください。',
    },
    {
      question: '各ゲームで選ばれる数字の範囲と個数は？',
      answer:
        'ロト6は1〜43から6個、ミニロトは1〜31から5個、ロト7は1〜37から7個を重複なしで選び、小さい順に表示します。ナンバーズ3・4は3桁・4桁の各桁を0〜9から重複ありで選びます。ボーナス数字は選びません。',
    },
    {
      question: 'ナンバーズの「ボックス」や「ミニ」には対応していますか？',
      answer:
        '対応していません。出力は各桁を0〜9から選んだ数字の並びだけです。ボックスで買う場合は、出た並びをそのまま使うか、購入窓口の指定に従って選んでください。',
    },
    {
      question: '選んだ番号は保存されますか？',
      answer:
        '保存されません。選んだ番号はブラウザ内で作られて画面に表示されるだけで、サーバーへ送信されることも、履歴として残ることもありません。必要な場合は「結果をコピー」でメモしてください。',
    },
    {
      question: 'ゲームの仕様が変わったらどうなりますか？',
      answer:
        '数字の範囲や個数は公式の仕様に合わせていますが、将来変更される可能性があります。購入前に公式サイトで最新の内容を確認してください。',
    },
  ],
  en: [
    {
      question: 'Are numbers picked here more likely to win?',
      answer:
        'No. In Loto and Numbers every combination has the same chance of winning, so picking with this tool does not change your odds and a win is never guaranteed. Use it as an entertainment shortcut when you cannot decide on numbers.',
    },
    {
      question: 'What range and how many numbers does each game use?',
      answer:
        'Loto 6 picks 6 unique numbers from 1–43, Mini Loto 5 from 1–31 and Loto 7 seven from 1–37, shown in ascending order. Numbers 3 and Numbers 4 pick 3 or 4 digits, each from 0–9 with repeats allowed. Bonus numbers are not drawn.',
    },
    {
      question: 'Does it support Box or Mini play for Numbers?',
      answer:
        'No. The output is just a sequence of digits from 0–9. If you play Box, use the digits as they come or follow the instructions at the point of sale.',
    },
    {
      question: 'Are my picked numbers saved?',
      answer:
        'No. Numbers are generated in your browser and only shown on screen; nothing is sent to a server or kept as history. If you need them, use "Copy result" to make a note.',
    },
    {
      question: 'What if the game rules change?',
      answer:
        'The ranges and counts follow the official rules at the time of writing, but they may change. Check the official lottery sites for the latest details before you buy.',
    },
  ],
};
