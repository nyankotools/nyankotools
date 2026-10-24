import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '1pipはいくらになりますか？',
      answer:
        '円ペアは1通貨あたり0.01円なので、10万通貨なら1,000円、1万通貨なら100円です。円ペア以外は0.0001（クォート通貨）に通貨数を掛け、そのクォート通貨の円レートで換算します。たとえばEUR/USDを1万通貨、ドル円150円なら、1pipは1ドル、約150円です。',
    },
    {
      question: '必要証拠金はどう計算しますか？',
      answer:
        '取引通貨数にエントリーレートを掛けた取引額を円に換算し、レバレッジで割ります。ドル円150円で10万通貨をレバレッジ25倍で買うと、取引額1,500万円の4%で60万円です。会社によって証拠金の計算に使うレートが異なるため、実際の額は少し違うことがあります。',
    },
    {
      question: 'クロス円以外の通貨ペアの損益はどう円に換算しますか？',
      answer:
        'まずクォート通貨建てで損益を求め、入力した「クォート通貨/円レート」を掛けて円にします。EUR/USDならドル円のレートを入力します。実際は決済時のレートで換算されることが多く、入力値との差の分だけ、結果は目安になります。',
    },
    {
      question: '売りのときのpipsの正負は？',
      answer:
        '売りは、決済レートがエントリーレートより低いほど利益です。エントリー150.00円、決済149.50円なら+50pips、決済150.50円なら-50pipsになります。買いはその逆です。',
    },
    {
      question: 'スプレッドやスワップは含まれますか？',
      answer:
        '含まれません。このツールはレートの差だけで損益を求めます。実際の取引ではスプレッドで約定レートが不利になり、保有日数に応じたスワップポイントや手数料も加わるため、実損益はそれらの分だけ変わります。',
    },
  ],
  en: [
    {
      question: 'How much is one pip worth?',
      answer:
        "For yen pairs one pip is 0.01 yen per unit, so 100,000 units is 1,000 yen and 10,000 units is 100 yen. For other pairs, multiply 0.0001 by the units to get the value in the quote currency, then convert it with that currency's yen rate. For 10,000 units of EUR/USD with USD/JPY at 150, one pip is 1 USD, about 150 yen.",
    },
    {
      question: 'How is required margin calculated?',
      answer:
        'Multiply the units by the entry rate to get the position value, convert it into yen and divide by the leverage. Buying 100,000 USD/JPY at 150 with 25x leverage is a 15 million yen position, so the margin is 4% of that, 600,000 yen. Brokers may use a different reference rate, so the real figure can differ a little.',
    },
    {
      question: 'How is profit on a non-yen pair converted to yen?',
      answer:
        'The profit is first found in the quote currency and then multiplied by the quote/JPY rate you enter. For EUR/USD, enter the USD/JPY rate. Brokers usually convert at the rate when you close, so the result is an estimate to the extent your input differs from it.',
    },
    {
      question: 'How are pips signed for a short trade?',
      answer:
        'A sell trade profits when the exit rate is below the entry rate. Entry at 150.00 and exit at 149.50 is +50 pips, while an exit at 150.50 is -50 pips. A buy trade is the opposite.',
    },
    {
      question: 'Are spread and swap included?',
      answer:
        'No. This tool uses only the difference between the two rates. In real trading the spread makes your fill worse, and swap points and commissions are added depending on the holding period, so actual results differ by those amounts.',
    },
  ],
};
