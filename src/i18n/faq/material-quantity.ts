import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ロス率はどれくらい見ておけばよいですか？',
      answer:
        '初期値は10%です。無地の壁紙や直線貼りのタイルなら5〜10%、柄合わせが必要な壁紙や斜め貼りの床材では10〜15%以上が目安です。DIYで不慣れな場合や、廃番になりやすい材料は多めに見ておくと安心です。',
    },
    {
      question: 'ドアや窓の面積はどう引かれますか？',
      answer:
        '壁紙と塗料では、ドアと窓の「数×1枚の面積」を壁の総面積から引きます。タイルや床材は床面積で計算するため控除しません。引いた結果が0以下になる場合はエラーになります。',
    },
    {
      question: '壁紙のロール数は面積だけで正確に分かりますか？',
      answer:
        'このツールは「ロスを含む面積÷1ロールの面積」の概算です。実際は巾（ストリップ）ごとに天井高で切り出すため、1ロールから取れる枚数は端数が出ます。柄物や高い天井では、ロス率を大きくして余裕を持たせてください。',
    },
    {
      question: '塗料の缶数は何を基準に決まりますか？',
      answer:
        '壁の面積×塗り回数÷塗れる面積（㎡/L）で必要な量（L）を求め、1缶の容量で割って切り上げます。塗れる面積は製品ごとに違うので、缶のラベルにある値を入力してください。',
    },
  ],
  en: [
    {
      question: 'How much waste allowance should I add?',
      answer:
        'The default is 10%. Plain wallpaper or tiles laid straight usually need 5-10%, while patterned wallpaper or diagonal layouts need 10-15% or more. Add extra if you are new to DIY or the product may be discontinued.',
    },
    {
      question: 'How are doors and windows deducted?',
      answer:
        'For wallpaper and paint, the number of doors and windows times their area is subtracted from the total wall area. Tile and flooring use the floor area, so nothing is deducted. If the deduction leaves no area, an error is shown.',
    },
    {
      question: 'Is the wallpaper roll count exact?',
      answer:
        'It is an estimate: area including waste divided by the area of one roll. Real rolls are cut into strips of ceiling height, so leftovers are wasted per strip. For patterned paper or tall ceilings, raise the waste allowance.',
    },
    {
      question: 'How is the number of paint cans decided?',
      answer:
        'Wall area x coats / coverage (m² per L) gives the liters needed, which is divided by the can size and rounded up. Coverage varies by product, so enter the figure printed on the label.',
    },
  ],
};
