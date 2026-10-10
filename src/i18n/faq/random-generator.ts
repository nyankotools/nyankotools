import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'パスワード生成ツールとはどう違いますか？',
      answer:
        'このツールは、テストデータやサンプルID、くじ引きの番号など「ランダムな値をたくさん」作る用途向けです。好きな文字だけを使った文字列、範囲指定の整数・小数、重複なしの抽選番号を最大1000件まとめて作れます。パスワードや鍵の用途には、強度の目安も表示する「パスワード生成」を使ってください。',
    },
    {
      question: '生成される乱数は予測できませんか？',
      answer:
        'ブラウザの暗号用乱数（crypto.getRandomValues）を使い、範囲の端に偏りが出ないように引き直しをしています。Math.random() のような予測しやすい乱数は使っていません。',
    },
    {
      question: '「重複させない」とは何が重複しないことですか？',
      answer:
        'ランダム文字列では、生成した文字列どうしが同じにならないことを指します。整数では、範囲内から同じ数を2回引かないこと（宝くじ・抽選番号のような取り出し）を指します。1つの文字列の中で同じ文字が繰り返されるのは問題ありません。',
    },
    {
      question: 'ひらがな・カタカナ・漢字の文字列も作れますか？',
      answer:
        '作れます。「使う文字」でひらがな（71字）・カタカナ（71字）・教育漢字（小学校の1026字）・常用漢字（2136字）を選べます。複数を同時に選ぶと、その文字をまとめた中から等しい確率で選びます。常用漢字の範囲外の漢字（人名用漢字など）が必要な場合は、「追加する文字」に入力してください。',
    },
    {
      question: '小数の乱数は、どのように選ばれますか？',
      answer:
        '指定した桁数の刻み（例: 2桁なら0.01刻み）の値の中から、一様な確率で1つを選びます。最小値・最大値も出る可能性があります。範囲の端が刻みに合わない場合（0.005など）は、範囲内に収まる最も近い刻みの値だけが対象です。',
    },
  ],
  en: [
    {
      question: 'How is this different from the Password Generator?',
      answer:
        'This tool is for producing lots of random values: test data, sample IDs, raffle numbers. You can use only your own characters, draw integers or decimals from a range, or pick numbers with no repeats, up to 1,000 at a time. For passwords and keys, use the Password Generator, which also shows a strength estimate.',
    },
    {
      question: 'Are the generated values unpredictable?',
      answer:
        'They come from your browser’s cryptographic generator (crypto.getRandomValues), with re-draws so the ends of a range are not favored. Predictable generators such as Math.random() are not used.',
    },
    {
      question: 'What does "No duplicates" apply to?',
      answer:
        'For strings, it means no two generated strings are identical. For integers, it means each number in the range is drawn at most once, like picking raffle numbers. A single string may still repeat a character inside itself.',
    },
    {
      question: 'Can I generate hiragana, katakana or kanji strings?',
      answer:
        'Yes. Under "Characters" you can choose hiragana (71), katakana (71), kyoiku kanji (1,026 taught in elementary school) and joyo kanji (2,136 in common use). When you combine several sets, every character in the combined set is equally likely. For kanji outside the joyo list, such as those used in names, type them into "Extra characters".',
    },
    {
      question: 'How are random decimals chosen?',
      answer:
        'One value is chosen uniformly from the steps of the chosen precision (for example 0.01 for two places). The minimum and maximum can both appear. If a range end does not fall on a step, such as 0.005, only the steps inside the range are used.',
    },
  ],
};
