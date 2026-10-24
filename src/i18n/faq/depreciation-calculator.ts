import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '定額法と定率法はどちらを選べばよいですか？',
      answer:
        '個人事業主は届出をしなければ定額法になります。法人は届出をしなければ原則として建物・建物附属設備・構築物（平成28年4月1日以後取得）以外は定率法です（令和8年時点）。定率法は初期の費用が大きく、定額法は毎年同じ額になります。平成10年4月1日以後に取得した建物は定額法のみです。選択は税務署や税理士に確認してください。',
    },
    {
      question: '償却保証額と改定償却率は何のためにありますか？',
      answer:
        '200%定率法では、年々償却費が小さくなって取得価額が回収できなくなるのを防ぐために、償却保証額（取得価額×保証率）が決められています。償却費がこれを下回った年から、その年の期首未償却残高に改定償却率をかけた同額を毎年償却して、最後に備忘価額1円を残します。',
    },
    {
      question: '期中に取得したときの月割りはどう計算しますか？',
      answer:
        '事業に使い始めた月から決算月までの月数を入力します。初年度の償却費は、1年分の償却費×月数÷12（1円未満切り捨て）です。たとえば9月に使い始めて3月決算なら7か月です。2年目からは通常の1年分で、償却が終わるまでの期間が1年延びます。',
    },
    {
      question: '10万円未満・20万円未満・40万円未満の違いは何ですか？',
      answer:
        '10万円未満は少額の減価償却資産として全額をその年の損金にできます。10万円以上20万円未満は、一括償却資産として3年で均等に損金にする方法を選べます。青色申告の中小企業者等（従業員400人以下）は、令和8年4月1日〜令和11年3月31日に取得して事業に使った40万円未満の資産を、年間300万円まで全額損金にできる特例があります（令和8年3月31日以前の取得は30万円未満・従業員500人以下）。取得日と事業供用日の両方が期間内であることなどの条件があります。最新の内容は国税庁の資料で確認してください。',
    },
    {
      question: '耐用年数が表にない資産はどう計算しますか？',
      answer:
        'このツールの資産リストは主要なものだけです。ほかの資産は、国税庁の耐用年数表で調べた年数を「その他」で入力してください。定額法は2〜50年、定率法は2〜20年の耐用年数に対応しています。中古資産や無形固定資産、リース資産の特例は含みません。',
    },
  ],
  en: [
    {
      question: 'Should I choose straight-line or declining balance?',
      answer:
        'Sole proprietors use straight-line unless they file a notice. Corporations default to declining balance for assets other than buildings, building fixtures and structures acquired from April 2016 (as of 2026). Declining balance expenses more in the early years, while straight-line gives the same amount every year. Buildings acquired on or after April 1, 1998 use straight-line only. Confirm the choice with the tax office or a tax accountant.',
    },
    {
      question: 'What are the guaranteed amount and the revised rate for?',
      answer:
        'With 200% declining balance, depreciation shrinks every year, so a guaranteed amount (cost x guarantee rate) prevents it from becoming too small. Once the yearly amount falls below it, the asset is depreciated by the same amount every year: the opening book value at that point times the revised rate, leaving ¥1 at the end.',
    },
    {
      question: 'How is a mid-year purchase prorated?',
      answer:
        'Enter the number of months from the month you started using the asset to the end of the fiscal year. First-year depreciation is the full-year amount x months / 12, rounded down to the yen. For example, starting in September with a March year end is 7 months. From the second year the full amount applies, and the schedule runs one year longer.',
    },
    {
      question:
        'What is the difference between ¥100,000, ¥200,000 and ¥400,000?',
      answer:
        'Under ¥100,000 is a small asset that can be expensed in full in the year of use. From ¥100,000 to under ¥200,000 you can choose the lump-sum method and expense it evenly over three years. Blue-return SMEs with 400 or fewer employees can expense assets under ¥400,000 up to ¥3 million a year if acquired and used between April 1, 2026 and March 31, 2029 (before that, the limit was ¥300,000 with 500 or fewer employees). Both dates must fall in the period. Check the latest National Tax Agency guidance.',
    },
    {
      question: 'What if my asset is not in the list?',
      answer:
        'The list covers common assets only. Look up the useful life in the National Tax Agency table and choose Other to enter it. Straight-line supports 2 to 50 years and declining balance supports 2 to 20 years. Special cases for used, intangible and leased assets are not covered.',
    },
  ],
};
