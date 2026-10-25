import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '階級の境界値のデータはどちらの階級に入りますか？',
      answer:
        '「下限以上・上限未満」（左閉右開）の階級に入ります。たとえば階級幅10で開始値0なら、ちょうど10のデータは「0〜10」ではなく「10〜20」に数えられます。最大値が階級の上限と一致する場合も、その値を含む階級が最後に追加されます。',
    },
    {
      question: '階級幅はどう決めればよいですか？',
      answer:
        '空欄にすると、データ数からスタージェスの公式で階級数の目安を求め、範囲をそれで割ったキリのよい幅が自動で選ばれます。山の形が粗すぎる・細かすぎると感じたら、階級幅を手動で小さく・大きくして見比べてください。',
    },
    {
      question: '開始値を指定するとデータが減るのはなぜですか？',
      answer:
        '開始値より小さいデータは、どの階級にも入らないため集計から除かれます。除いた件数は表の上に表示されます。全データを含めたいときは、開始値を空欄にするか最小値以下にしてください。',
    },
    {
      question: '階級数が多すぎるというエラーになります。',
      answer:
        '階級は最大200までです。階級幅が小さすぎるか、外れ値のせいで範囲が広がっている可能性があります。階級幅を大きくするか、開始値を調整してください。',
    },
  ],
  en: [
    {
      question: 'Which bin does a value on a boundary go into?',
      answer:
        'Bins include their lower bound and exclude their upper bound. With a width of 10 and a start of 0, the value 10 is counted in the 10 to 20 bin, not 0 to 10. If the maximum sits exactly on a boundary, a final bin is added to hold it.',
    },
    {
      question: 'How should I choose the bin width?',
      answer:
        "Leave it blank and the tool uses Sturges' rule to estimate the number of bins, then picks a round width for your data range. If the shape looks too coarse or too noisy, try a smaller or larger width by hand and compare.",
    },
    {
      question: 'Why do some values disappear when I set a start value?',
      answer:
        'Values below the start value fall into no bin and are left out of the counts. The number left out is shown above the table. To keep everything, leave the start blank or set it at or below the minimum.',
    },
    {
      question: 'I get a "too many bins" error.',
      answer:
        'Up to 200 bins are allowed. Your bin width may be too small, or an outlier may be stretching the range. Use a larger bin width or adjust the start value.',
    },
  ],
};
