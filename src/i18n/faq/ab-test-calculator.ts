import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'p値が0.05未満なら、Bが勝ったと言えますか？',
      answer:
        'p値が0.05未満なら「偶然だけで説明しにくい差」とは言えますが、Bが必ず勝つ・差が事業上十分大きい、とまでは言えません。p値は「Bが勝つ確率」ではなく、差がないと仮定したときにこの程度の差が出る確率です。差の大きさは信頼区間で確認してください。',
    },
    {
      question: '両側検定と片側検定はどちらを使えばよいですか？',
      answer:
        '迷ったら両側検定を使ってください。片側検定は「BがAより高いか」だけを調べるため、p値が両側の半分になって有意になりやすい反面、Bが悪化した場合を見逃します。片側を使うなら、テストを始める前に決めておく必要があります。',
    },
    {
      question: '必要サンプルサイズはどう決まりますか？',
      answer:
        '現在のコンバージョン率、検出したい最小の改善、有意水準（通常5%）、検出力（通常80%）から計算します。改善が小さいほど、またコンバージョン率が低いほど、必要な訪問数は大きく増えます。たとえば5%を6%にする場合は各群約8,100訪問が目安です。',
    },
    {
      question: '途中で有意になったらテストを止めてもよいですか？',
      answer:
        'おすすめしません。結果を何度も確認して有意になった時点で止めると、実際には差がなくても有意と判定される確率が大きく上がります。サンプルサイズ計算で人数を決め、その人数に達してから1回だけ判定してください。',
    },
    {
      question: '訪問数が少ないときの結果は信頼できますか？',
      answer:
        'このツールは正規近似を使うため、期待度数（訪問数×コンバージョン率など）が5未満のセルがあると精度が下がり、警告を表示します。その場合は訪問数を増やしてから再確認するか、フィッシャーの正確確率検定など別の方法を検討してください。',
    },
  ],
  en: [
    {
      question: 'If the p-value is below 0.05, can I say B won?',
      answer:
        'A p-value below 0.05 means the difference is hard to explain by chance alone. It does not mean B is a sure winner or that the gap is big enough to matter. The p-value is not the probability that B is better; it is how likely a gap this large would be if there were no real difference. Check the confidence interval for the size of the effect.',
    },
    {
      question: 'Should I use a one-sided or two-sided test?',
      answer:
        'Use the two-sided test when in doubt. A one-sided test only asks whether B is higher than A, so its p-value is half as large and it becomes significant more easily, but it misses cases where B is worse. If you use one-sided, decide that before the test starts.',
    },
    {
      question: 'How is the required sample size determined?',
      answer:
        'It depends on your current conversion rate, the smallest lift you want to detect, the significance level (usually 5%), and the power (usually 80%). Smaller lifts and lower conversion rates need many more visitors; going from 5% to 6% takes roughly 8,100 visitors per group.',
    },
    {
      question: 'Can I stop the test as soon as it turns significant?',
      answer:
        'It is not recommended. Looking at the results repeatedly and stopping the moment they look significant greatly raises the chance of a false positive. Fix the sample size in advance and judge once after reaching it.',
    },
    {
      question: 'Can I trust the result when there are few visitors?',
      answer:
        "The tool uses a normal approximation, which loses accuracy when an expected count (visitors times the conversion rate, and so on) is below 5, and it shows a warning in that case. Collect more visitors or consider an exact method such as Fisher's exact test.",
    },
  ],
};
