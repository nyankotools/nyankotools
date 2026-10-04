import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '電気代はどのように計算していますか？',
      answer:
        '「消費電力（W）÷1,000×使用時間（h）」で電力量（kWh）を求め、これに電気料金の単価（円/kWh）を掛けています。たとえば500Wのエアコンを1日8時間使うと1日4kWhで、単価31円なら1日124円、30日で3,720円です。',
    },
    {
      question: '消費電力が分からないときはどうすればよいですか？',
      answer:
        '本体のラベルや取扱説明書の「定格消費電力」を確認してください。分からない場合は、「家電の目安から選ぶ」で代表的なワット数を入れられます。電圧(V)と電流(A)しか分からないときは、掛け算した値（W）を入力します。',
    },
    {
      question:
        'エアコンや冷蔵庫の電気代が実際の請求額と合わないのはなぜですか？',
      answer:
        'エアコンは室温や設定温度、冷蔵庫は庫内の温度や扉の開閉で消費電力が変動し、常に定格値で動いているわけではありません。ここでの結果は定格や平均的なワット数で試算した目安で、待機電力や基本料金も含みません。',
    },
    {
      question: '電気料金の単価はいくらを入力すればよいですか？',
      answer:
        '検針票の「電力量料金単価」に、燃料費調整額と再エネ賦課金の1kWhあたりの額を加えた実質単価を入れると、実際の請求に近づきます。目安が分からなければ、既定の31円/kWh前後で試算できます。',
    },
  ],
  en: [
    {
      question: 'How is the electricity cost calculated?',
      answer:
        'Energy in kWh is power in watts divided by 1,000, times hours of use. That is multiplied by your rate per kWh. For example, a 500 W air conditioner running 8 hours a day uses 4 kWh a day; at 0.17 per kWh that is 0.68 a day, or 20.40 over 30 days.',
    },
    {
      question: 'What if I do not know the wattage of my appliance?',
      answer:
        'Check the rating label or manual for the rated power. If you cannot find it, pick a typical appliance from the list to fill in a common wattage. If you only know volts and amps, multiply them to get watts.',
    },
    {
      question:
        'Why does my real bill differ from the estimate for an air conditioner or fridge?',
      answer:
        'Those appliances cycle on and off and change their draw with room temperature, settings, and door openings, so they rarely run at the rated wattage all the time. The estimate uses a rated or average figure and excludes standby power and fixed charges.',
    },
    {
      question: 'Which electricity rate should I enter?',
      answer:
        'Use the per-kWh price from your bill, including delivery charges and fees, so the result is close to what you actually pay. If you are unsure, the default is a typical household rate you can adjust.',
    },
  ],
};
