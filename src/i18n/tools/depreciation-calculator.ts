import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface AssetOption {
  /** 耐用年数（年）。手入力は 'custom' */
  value: string;
  label: string;
}

export interface DepreciationCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  basisLine: string;
  disclaimer: string;
  sectionHeading: string;
  costLabel: string;
  costHint: string;
  assetLabel: string;
  assetOptions: AssetOption[];
  lifeLabel: string;
  lifeHint: string;
  methodLabel: string;
  methodStraight: string;
  methodDeclining: string;
  methodHint: string;
  monthsLabel: string;
  monthsHint: string;
  startYearLabel: string;
  startYearHint: string;
  errorCost: string;
  errorLife: string;
  errorMonths: string;
  errorYear: string;
  errorDeclining: string;
  resultRateLabel: string;
  resultRevisedLabel: string;
  resultGuaranteeLabel: string;
  resultFirstYearLabel: string;
  resultTotalLabel: string;
  resultYearsLabel: string;
  yearsUnit: string;
  notApplicable: string;
  scheduleHeading: string;
  headYear: string;
  headOpening: string;
  headDepreciation: string;
  headClosing: string;
  headNote: string;
  noteRevisedStart: string;
  noteRevised: string;
  noteMemorandum: string;
  smallHeading: string;
  dateLabel: string;
  dateHint: string;
  smeLabel: string;
  smeHint: string;
  judgeExpense: string;
  judgeLumpSum: string;
  judgeSmeOld: string;
  judgeSmeNew: string;
  judgeNone: string;
  judgeDateError: string;
  lumpSumLine: string;
  ratesHeading: string;
  ratesLifeHead: string;
  ratesStraightHead: string;
  ratesDecliningHead: string;
  ratesRevisedHead: string;
  ratesGuaranteeHead: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const depreciationCalculatorContent: Record<
  Locale,
  DepreciationCalculatorPageContent
> = {
  ja: {
    title: '減価償却計算機｜定額法・定率法の年別償却費と少額資産の判定',
    description:
      '取得価額と耐用年数から定額法・200%定率法の年別償却費を計算。償却率・改定償却率・保証率、月割（期中取得）、少額減価償却資産の判定に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '減価償却計算機（定額法・定率法・少額資産の判定）',
    introHtml:
      '取得価額と耐用年数を入力すると、定額法または200%定率法（平成24年4月1日以後取得）の年別の償却費・未償却残高を表にします。期中に取得した場合の月割計算、償却保証額と改定償却率の切り替わり、10万円未満・20万円未満・中小企業者等の特例といった少額減価償却資産の判定もできます。令和8年時点の制度による概算です。償却資産の取得に消費税がかかる場合は <a href="/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">消費税・割引計算機</a>、印紙税は <a href="/tools/stamp-duty-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">印紙税額の計算</a> をご利用ください。',
    numberLocale: 'ja-JP',
    basisLine:
      '基準: 令和8年（2026年）時点。償却率は国税庁「減価償却資産の償却率表」（平成24年4月1日以後取得の定額法・200%定率法）、耐用年数は「減価償却資産の耐用年数等に関する省令」の別表にもとづきます。',
    disclaimer:
      'この結果は令和8年時点の制度にもとづく概算の目安であり、法的・税務上の助言ではありません。実際の資産の耐用年数や償却方法の選択は、税務署や税理士にご確認ください。',
    sectionHeading: '資産の条件',
    costLabel: '取得価額（円）',
    costHint:
      '税抜経理なら税抜、税込経理なら税込の金額です。購入代金のほか、引取運賃・据付費・手数料など事業に使うまでの費用を含めます。',
    assetLabel: '資産の種類（主要な資産の耐用年数）',
    assetOptions: [
      { value: '4', label: 'パソコン（サーバー用を除く）: 4年' },
      { value: '6', label: '普通自動車（新車・一般用）: 6年' },
      { value: '4', label: '軽自動車（貨物用を除く）: 4年' },
      { value: '5', label: 'ソフトウェア（自社利用）: 5年' },
      { value: '5', label: '複写機・コピー機: 5年' },
      { value: '15', label: '事務机・いす（金属製）: 15年' },
      { value: '8', label: '事務机・いす（その他）: 8年' },
      { value: '6', label: '冷暖房用機器（エアコンなど）: 6年' },
      { value: '6', label: '電気冷蔵庫・洗濯機: 6年' },
      { value: '24', label: '木造の事務所用建物: 24年（定額法のみ）' },
      { value: '22', label: '木造の住宅用建物: 22年（定額法のみ）' },
      {
        value: '50',
        label: '鉄筋コンクリート造の事務所用建物: 50年（定額法のみ）',
      },
      {
        value: '47',
        label: '鉄筋コンクリート造の住宅用建物: 47年（定額法のみ）',
      },
      { value: 'custom', label: 'その他（耐用年数を入力）' },
    ],
    lifeLabel: '耐用年数（年）',
    lifeHint:
      '2〜50年。資産の種類を選ぶと自動で入ります。その他を選ぶと自分で入力できます。',
    methodLabel: '償却方法',
    methodStraight: '定額法',
    methodDeclining: '定率法（200%）',
    methodHint:
      '定率法は耐用年数2〜20年の資産だけ計算できます。平成10年4月1日以後に取得した建物は定額法のみです。',
    monthsLabel: '初年度の償却月数（月）',
    monthsHint:
      '事業に使い始めた月から決算月までの月数です。通年（12か月）なら12、決算月の前月に使い始めたなら2のように入力します。',
    startYearLabel: '初年度の事業年度（西暦）',
    startYearHint: '表の「年度」の見出しに使います。計算結果には影響しません。',
    errorCost:
      '取得価額は2円以上100億円以下の整数で入力してください（備忘価額1円を残すため）',
    errorLife: '耐用年数は2〜50の整数で入力してください',
    errorMonths: '初年度の償却月数は1〜12の整数で入力してください',
    errorYear: '事業年度は1900〜2200の整数で入力してください',
    errorDeclining:
      '定率法の償却率表は耐用年数2〜20年のみ収録しています。この耐用年数では定額法を選んでください',
    resultRateLabel: '償却率',
    resultRevisedLabel: '改定償却率',
    resultGuaranteeLabel: '償却保証額（取得価額×保証率）',
    resultFirstYearLabel: '初年度の償却費',
    resultTotalLabel: '償却総額（備忘価額1円を除く）',
    resultYearsLabel: '償却が終わるまでの期間',
    yearsUnit: '{years}年間',
    notApplicable: '該当なし',
    scheduleHeading: '年別の償却費と未償却残高',
    headYear: '年度',
    headOpening: '期首残高',
    headDepreciation: '償却費',
    headClosing: '期末残高',
    headNote: '備考',
    noteRevisedStart: '改定償却率に切り替え',
    noteRevised: '改定償却率',
    noteMemorandum: '備忘価額1円を残す',
    smallHeading: '少額減価償却資産の判定',
    dateLabel: '取得して事業に使い始めた日',
    dateHint:
      '取得価額と合わせて、使える扱いの判定に使います。特例は取得日と事業供用日の両方が適用期間内であることが必要なため、同じ日として判定します。',
    smeLabel: '中小企業者等（青色申告）である',
    smeHint:
      '資本金1億円以下などの中小企業者等（常時使用する従業員が、令和8年4月1日以後の取得は400人以下、それ以前は500人以下）で青色申告をしている場合に、中小企業者等の特例を判定します。',
    judgeExpense:
      '10万円未満のため、少額の減価償却資産として全額を使用した事業年度の損金（必要経費）にできます。',
    judgeLumpSum:
      '10万円以上20万円未満のため、一括償却資産として3年間で均等に損金にする方法を選べます（通常の減価償却との選択）。',
    judgeSmeOld:
      '中小企業者等の少額減価償却資産の特例（30万円未満）の対象になり得ます（令和8年3月31日以前の取得、従業員500人以下）。年間の合計は300万円までで、青色申告などの要件があります。',
    judgeSmeNew:
      '令和8年度改正後の中小企業者等の少額減価償却資産の特例（40万円未満）の対象になり得ます（令和8年4月1日〜令和11年3月31日に取得し事業に使った分、従業員400人以下）。年間の合計は300万円までで、青色申告などの要件があります。',
    judgeNone:
      '少額の特例には当てはまらないため、通常の減価償却（上の表）が基本です。',
    judgeDateError: '日付を正しく入力してください',
    lumpSumLine: '一括償却資産の場合: 毎年 {each}（最終年は {last}）',
    ratesHeading: '償却率表（平成24年4月1日以後取得）',
    ratesLifeHead: '耐用年数',
    ratesStraightHead: '定額法の償却率',
    ratesDecliningHead: '定率法の償却率',
    ratesRevisedHead: '改定償却率',
    ratesGuaranteeHead: '保証率',
    notesHeading: '注意事項',
    notes: [
      '令和8年（2026年）時点の概算です。償却率は国税庁の「減価償却資産の償却率表」（平成24年4月1日以後取得の定額法・200%定率法）に合わせています。税制改正や省令の改正で変わる場合があります。',
      '定額法は取得価額×償却率を毎年同額で償却し、最後の年は備忘価額1円を残して打ち切ります。償却率は1÷耐用年数を小数第4位で切り上げた値です。',
      '200%定率法は、期首未償却残高×償却率（2÷耐用年数）で償却します。この額が償却保証額（取得価額×保証率）を下回った年から、その時点の期首未償却残高（改定取得価額）に改定償却率をかけた同額を毎年償却し、最後の年に備忘価額1円を残します。',
      '期中に取得した場合は、初年度のみ年間の償却費を月数÷12で月割りします。2年目以降は通常の1年分です。端数は1円未満を切り捨てています。',
      '平成24年3月以前取得の250%定率法・200%定率法(旧)は非対応です（この表は平成24年4月1日以後の取得用です）。平成19年3月31日以前の取得（旧定額法・旧定率法）、無形固定資産・リース資産・中古資産の耐用年数、特別償却・圧縮記帳、法人税の償却限度額と実際の償却額の差は計算に含めていません。',
      '少額減価償却資産の判定は、10万円未満（全額損金算入）、10万円以上20万円未満（一括償却資産の3年均等）、中小企業者等の特例（令和8年3月31日以前の取得は30万円未満、令和8年4月1日〜令和11年3月31日の取得は40万円未満）を、取得価額と取得日から目安として判定します。貸付けの用に供する資産などは対象外になる場合があります。',
      '中小企業者等の特例は、令和8年度改正で令和8年4月1日以後の取得分から取得価額40万円未満に引き上げられ、適用期限は令和11年3月31日までに延長、対象は常時使用する従業員400人以下（従来500人以下）となりました。年間の合計上限は300万円のままです。青色申告であること、取得日と事業供用日の両方が期間内であること、貸付けの用に供する資産でないことなどの要件があります。実際の適用は国税庁の最新情報や税理士で確認してください。',
      '耐用年数は資産の種類や用途、構造で異なります。リストにない資産は、国税庁の耐用年数表で調べて「その他」に入力してください。法的・税務上の助言ではありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '定額法',
        description:
          '取得価額に償却率をかけた同額を、耐用年数のあいだ毎年償却する方法です。毎年の費用が一定で、計算が簡単です。',
      },
      {
        term: '200%定率法',
        description:
          '未償却残高に定額法の2倍の償却率をかけて償却する方法です。初期の償却費が大きく、年々小さくなります。平成24年4月1日以後に取得した資産に使います。',
      },
      {
        term: '償却保証額・改定償却率',
        description:
          '定率法で償却費が小さくなりすぎないための仕組みです。償却費が償却保証額（取得価額×保証率）を下回ったら、その時点の残高に改定償却率をかけた額で償却を続けます。',
      },
      {
        term: '備忘価額',
        description:
          '償却が終わっても帳簿に残す1円です。資産が残っていることを記録するために、平成19年4月1日以後の取得では1円を残します。',
      },
      {
        term: '一括償却資産',
        description:
          '取得価額が10万円以上20万円未満の資産を、個別に管理せずまとめて3年間で均等に損金にする方法です。月割はしません。',
      },
      {
        term: '中小企業者等の少額減価償却資産の特例',
        description:
          '青色申告をする中小企業者等が、一定額未満の資産を取得した年に全額を損金にできる特例です。取得価額は40万円未満（令和8年3月31日以前の取得は30万円未満）、年間の合計は300万円までで、令和11年3月31日までの取得が対象です。適用条件は国税庁の最新情報で確認してください。',
      },
    ],
  },
  en: {
    title: 'Japan Depreciation Calculator (Straight-Line & 200% DB)',
    description:
      'Calculate yearly depreciation for Japanese tax: straight-line and 200% declining balance, monthly proration, and small-asset checks. Runs in your browser.',
    h1: 'Japan Depreciation Calculator (Straight-Line, 200% Declining Balance)',
    introHtml:
      'Enter the acquisition cost and useful life to get a yearly schedule of depreciation and book value under straight-line or the 200% declining balance method (assets acquired on or after April 1, 2012). It handles monthly proration for mid-year purchases, the switch from the guaranteed amount to the revised rate, and the small-asset checks (under ¥100,000, under ¥200,000, and the SME special rule, now under ¥400,000 for assets acquired from April 1, 2026). This is an estimate under the 2026 rules. For consumption tax on the purchase, use the <a href="/en/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Consumption Tax & Discount Calculator</a>; for stamp duty, see the <a href="/en/tools/stamp-duty-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Stamp Duty Calculator</a>.',
    numberLocale: 'en-US',
    basisLine:
      'Basis: 2026 rules. Rates follow the National Tax Agency depreciation rate table (straight-line and 200% declining balance for assets acquired on or after April 1, 2012); useful lives follow the Ministry of Finance ordinance tables.',
    disclaimer:
      'These results are rough estimates based on the 2026 rules and are not legal or tax advice. Please confirm the useful life and depreciation method for your actual assets with the tax office or a tax accountant.',
    sectionHeading: 'Asset details',
    costLabel: 'Acquisition cost (JPY)',
    costHint:
      'Use the tax-exclusive amount if you account excluding consumption tax, or the tax-inclusive amount if you account including it. Include freight, installation and fees needed to put the asset to use.',
    assetLabel: 'Asset type (common useful lives)',
    assetOptions: [
      { value: '4', label: 'Personal computer (not a server): 4 years' },
      { value: '6', label: 'Standard car (new, general use): 6 years' },
      { value: '4', label: 'Light car (not for cargo): 4 years' },
      { value: '5', label: 'Software for internal use: 5 years' },
      { value: '5', label: 'Copier: 5 years' },
      { value: '15', label: 'Office desk or chair (metal): 15 years' },
      { value: '8', label: 'Office desk or chair (other): 8 years' },
      {
        value: '6',
        label: 'Heating and cooling units (air conditioner): 6 years',
      },
      { value: '6', label: 'Refrigerator or washing machine: 6 years' },
      {
        value: '24',
        label: 'Wooden office building: 24 years (straight-line only)',
      },
      {
        value: '22',
        label: 'Wooden residential building: 22 years (straight-line only)',
      },
      {
        value: '50',
        label:
          'Reinforced concrete office building: 50 years (straight-line only)',
      },
      {
        value: '47',
        label:
          'Reinforced concrete residential building: 47 years (straight-line only)',
      },
      { value: 'custom', label: 'Other (enter the useful life)' },
    ],
    lifeLabel: 'Useful life (years)',
    lifeHint:
      '2 to 50 years. Choosing an asset type fills this in. Choose Other to type your own.',
    methodLabel: 'Depreciation method',
    methodStraight: 'Straight-line',
    methodDeclining: '200% declining balance',
    methodHint:
      'Declining balance works for useful lives of 2 to 20 years. Buildings acquired on or after April 1, 1998 use straight-line only.',
    monthsLabel: 'Months in service in the first year',
    monthsHint:
      'Months from the month you started using the asset to the end of the fiscal year. Use 12 for a full year, or 2 if you started the month before year end.',
    startYearLabel: 'First fiscal year (Gregorian)',
    startYearHint:
      'Used only for the Year column in the table. It does not change the result.',
    errorCost:
      'Enter the cost as a whole number from ¥2 to ¥10 billion (¥1 is kept as the memorandum value)',
    errorLife: 'Enter the useful life as a whole number from 2 to 50',
    errorMonths: 'Enter the first-year months as a whole number from 1 to 12',
    errorYear: 'Enter the fiscal year as a whole number from 1900 to 2200',
    errorDeclining:
      'The declining balance rate table covers useful lives of 2 to 20 years only. Use straight-line for this useful life.',
    resultRateLabel: 'Depreciation rate',
    resultRevisedLabel: 'Revised rate',
    resultGuaranteeLabel: 'Guaranteed amount (cost x guarantee rate)',
    resultFirstYearLabel: 'First-year depreciation',
    resultTotalLabel: 'Total depreciation (excluding the ¥1 memorandum value)',
    resultYearsLabel: 'Years until fully depreciated',
    yearsUnit: '{years} years',
    notApplicable: 'Not applicable',
    scheduleHeading: 'Yearly depreciation and book value',
    headYear: 'Year',
    headOpening: 'Opening value',
    headDepreciation: 'Depreciation',
    headClosing: 'Closing value',
    headNote: 'Note',
    noteRevisedStart: 'Switch to revised rate',
    noteRevised: 'Revised rate',
    noteMemorandum: 'Keeps ¥1 memorandum value',
    smallHeading: 'Small-asset check',
    dateLabel: 'Date acquired and put into use',
    dateHint:
      'Used with the cost to decide which treatments are available. The SME rule needs both the acquisition and the start of use to fall in the period, so one date is used for both.',
    smeLabel: 'Small or medium-sized business filing a blue return',
    smeHint:
      'Check this if you are an SME (capital of ¥100 million or less, for example; 400 or fewer regular employees for assets acquired from April 1, 2026, 500 or fewer before) filing a blue return, to test the SME special rule.',
    judgeExpense:
      'Under ¥100,000, so this is a small asset that can be expensed in full in the year it is put into use.',
    judgeLumpSum:
      'From ¥100,000 up to under ¥200,000, so you can choose the lump-sum method and expense it evenly over three years (instead of regular depreciation).',
    judgeSmeOld:
      'The SME special rule for small assets (under ¥300,000) may apply (assets acquired on or before March 31, 2026, 500 or fewer employees). There is an annual total cap of ¥3 million and conditions such as a blue return.',
    judgeSmeNew:
      'The SME special rule as revised in 2026 (under ¥400,000) may apply (assets acquired and used from April 1, 2026 to March 31, 2029, 400 or fewer employees). There is an annual total cap of ¥3 million and conditions such as a blue return.',
    judgeNone:
      'No small-asset treatment applies here, so regular depreciation (the table above) is the default.',
    judgeDateError: 'Enter a valid date',
    lumpSumLine: 'Lump-sum method: {each} per year ({last} in the last year)',
    ratesHeading: 'Rate table (assets acquired on or after April 1, 2012)',
    ratesLifeHead: 'Useful life',
    ratesStraightHead: 'Straight-line rate',
    ratesDecliningHead: 'Declining rate',
    ratesRevisedHead: 'Revised rate',
    ratesGuaranteeHead: 'Guarantee rate',
    notesHeading: 'Notes',
    notes: [
      'This is an estimate under the 2026 rules. The rates match the National Tax Agency depreciation rate table (straight-line and 200% declining balance) for assets acquired on or after April 1, 2012. Tax reform or ordinance changes can alter them.',
      'Straight-line depreciates cost x rate each year and stops at the last year, leaving ¥1 as the memorandum value. The rate is 1 divided by the useful life, rounded up at the fourth decimal place.',
      'The 200% declining balance method depreciates opening book value x rate (2 divided by the useful life). From the first year in which that amount falls below the guaranteed amount (cost x guarantee rate), it depreciates the same amount every year: the opening book value at that point times the revised rate. The last year leaves ¥1.',
      'For a mid-year purchase, only the first year is prorated by months / 12. Later years use a full year. Amounts are rounded down to the yen.',
      'Not covered: the 250% and old 200% declining balance methods for assets acquired before April 2012 (this table is for April 1, 2012 or later), pre-2007 methods, intangible, leased and used assets, special depreciation, deferred gains, and the gap between the corporate-tax limit and the amount actually booked.',
      'The small-asset check tests under ¥100,000 (expense in full), ¥100,000 to under ¥200,000 (lump-sum over three years), and the SME special rule (under ¥300,000 for assets acquired by March 31, 2026; under ¥400,000 for assets acquired and used from April 1, 2026 to March 31, 2029). Assets used for leasing and similar can be excluded.',
      'The 2026 tax reform raised the SME special rule to under ¥400,000 for assets acquired on or after April 1, 2026, extended it to March 31, 2029, and lowered the employee limit to 400 or fewer (previously 500). The ¥3 million annual cap is unchanged. You need a blue return, both the acquisition and the start of use must fall in the period, and leased assets are excluded. Confirm the current rule with the National Tax Agency or a tax accountant.',
      'Useful lives depend on the asset type, use and structure. For assets not in the list, look up the National Tax Agency useful life table and choose Other. This is not legal or tax advice.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Straight-line method',
        description:
          'Depreciates the same amount (cost x rate) every year over the useful life. The yearly expense is constant and easy to calculate.',
      },
      {
        term: '200% declining balance',
        description:
          'Applies a rate twice the straight-line rate to the remaining book value, so depreciation is larger early on and shrinks each year. Used for assets acquired on or after April 1, 2012.',
      },
      {
        term: 'Guaranteed amount and revised rate',
        description:
          'A safeguard so declining balance depreciation does not become too small. Once the yearly amount falls below the guaranteed amount (cost x guarantee rate), depreciation continues at the book value at that point times the revised rate.',
      },
      {
        term: 'Memorandum value',
        description:
          'The ¥1 left on the books after depreciation ends, to record that the asset still exists. It applies to assets acquired on or after April 1, 2007.',
      },
      {
        term: 'Lump-sum depreciable assets',
        description:
          'Assets costing from ¥100,000 up to under ¥200,000 that you pool and expense evenly over three years, without monthly proration.',
      },
      {
        term: 'SME special rule for small assets',
        description:
          'A special rule that lets blue-return SMEs expense assets under a set amount in the year of purchase. The limit is under ¥400,000 (¥300,000 for assets acquired by March 31, 2026), with a ¥3 million annual cap, for assets acquired by March 31, 2029. Check the National Tax Agency for current conditions.',
      },
    ],
  },
};
