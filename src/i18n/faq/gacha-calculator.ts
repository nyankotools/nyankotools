import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '排出率3%で100回引けば必ず当たりますか？',
      answer:
        '必ずではありません。1回以上当たる確率は 1-(0.97の100乗) で約95.2%です。残りの約4.8%は100回引いても出ません。天井がある場合のみ、その回数で確実に排出されます。',
    },
    {
      question: '「ピックアップ合計」の排出率はどう入力しますか？',
      answer:
        '狙う1体だけの確率を入力してください。例えばピックアップ2体で合計1.5%なら、どちらでもよい場合は1.5%、特定の1体だけなら通常は0.75%です。仕様はゲームごとに異なるため、公式の提供割合で確認してください。',
    },
    {
      question: '期待回数まで引けば当たりますか？',
      answer:
        '期待回数は平均値で、そこまでに当たる確率は約63%（天井なしの場合）です。半数が当たる回数や90%・99%に届く回数は、結果欄の「目標の確率に届くまでの回数」で確認できます。',
    },
    {
      question: '天井を入力すると何が変わりますか？',
      answer:
        '天井の回数に達すると確率が100%になり、期待回数や必要石数も天井で頭打ちになります。天井まで引く場合の石数は「1回あたりの石数×天井回数」で表示されます。',
    },
  ],
  en: [
    {
      question: 'Will 100 pulls at a 3% rate guarantee a drop?',
      answer:
        'No. The chance of at least one drop is 1 - 0.97^100, about 95.2%, so roughly 4.8% of players still get nothing. Only a pity cap guarantees a drop at that pull.',
    },
    {
      question: 'How do I enter a combined featured rate?',
      answer:
        'Enter the rate for the single unit you want. If two featured units share 1.5% and either is fine, use 1.5%; for one specific unit it is usually 0.75%. Rules differ per game, so check the official rates.',
    },
    {
      question: 'Am I sure to win if I pull the expected number of times?',
      answer:
        'The expected pulls is just an average. Without pity, your chance of having a drop by then is only about 63%. See "Pulls needed to reach a target chance" for the pulls to reach 50%, 90%, and 99%.',
    },
    {
      question: 'What does entering a pity cap change?',
      answer:
        'At the pity pull the chance becomes 100%, and the expected pulls and gems are capped there too. The gems to reach pity are shown as gems per pull times the pity count.',
    },
  ],
};
