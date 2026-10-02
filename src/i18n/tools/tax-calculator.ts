import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface TaxCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  section1Heading: string;
  modeLegend: string;
  modeExclusive: string;
  modeInclusive: string;
  rateLegend: string;
  rateStandard: string;
  rateReduced: string;
  rateCustom: string;
  rateCustomPlaceholder: string;
  amountLabel: string;
  amountPlaceholder: string;
  roundingLegend: string;
  roundingFloor: string;
  roundingRound: string;
  roundingCeil: string;
  errorTax: string;
  resultExcludedLabel: string;
  resultTaxLabel: string;
  resultIncludedLabel: string;
  section2Heading: string;
  originalPriceLabel: string;
  originalPricePlaceholder: string;
  discountTypeLegend: string;
  discountTypePercent: string;
  discountTypeAmount: string;
  discountValueLabel: string;
  discountValuePlaceholder: string;
  discountRoundingLegend: string;
  errorDiscount: string;
  resultDiscountAmountLabel: string;
  resultDiscountPriceLabel: string;
  resultDiscountRateLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const taxCalculatorContent: Record<Locale, TaxCalculatorPageContent> = {
  ja: {
    title: '消費税・割引計算機（税込/税抜換算・セール価格計算）',
    description:
      '消費税の税込/税抜金額を相互に変換し、割引率や割引額からセール後の価格も計算できる無料ツールです。標準税率10%・軽減税率8%・カスタム税率に対応し、端数処理方式も選択できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '消費税・割引計算機',
    introHtml:
      '税抜・税込のどちらかの金額を入力するだけで、消費税額ともう一方の金額を計算します。標準税率（10%）・軽減税率（8%）・カスタム税率を切り替え可能です。あわせて、割引率または割引額からセール後の価格も計算できます。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。時給・月給から金額を計算したい場合は <a href="/tools/hourly-wage-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">時給・日給・月給換算＆残業代計算機</a> もあわせてご利用ください。',
    numberLocale: 'ja-JP',
    section1Heading: '1. 税込/税抜金額の計算',
    modeLegend: '入力する金額',
    modeExclusive: '税抜金額',
    modeInclusive: '税込金額',
    rateLegend: '税率',
    rateStandard: '標準税率（10%）',
    rateReduced: '軽減税率（8%）',
    rateCustom: 'カスタム',
    rateCustomPlaceholder: '例: 5',
    amountLabel: '金額（円）',
    amountPlaceholder: '1000',
    roundingLegend: '消費税額の端数処理',
    roundingFloor: '切り捨て',
    roundingRound: '四捨五入',
    roundingCeil: '切り上げ',
    errorTax: '計算できませんでした（金額・税率は0以上の値を入力してください）',
    resultExcludedLabel: '税抜金額',
    resultTaxLabel: '消費税額',
    resultIncludedLabel: '税込金額',
    section2Heading: '2. 割引後の価格計算',
    originalPriceLabel: '元の価格（円）',
    originalPricePlaceholder: '5000',
    discountTypeLegend: '割引の指定方法',
    discountTypePercent: '割引率（%）',
    discountTypeAmount: '割引額（円）',
    discountValueLabel: '割引の値',
    discountValuePlaceholder: '20',
    discountRoundingLegend: '割引額の端数処理',
    errorDiscount:
      '計算できませんでした（元の価格は0より大きく、割引率は0〜100%、割引額は元の価格以下で入力してください）',
    resultDiscountAmountLabel: '割引額',
    resultDiscountPriceLabel: '割引後の価格',
    resultDiscountRateLabel: '割引率',
    notesHeading: '注意事項',
    notes: [
      '消費税額に小数点以下の端数が出る場合の処理方法（切り捨て・四捨五入・切り上げ）は、実際のレシートや請求書の表示と異なる場合があります。事業者ごとに採用している方式が異なるためです。',
      '割引の計算は消費税の計算とは連動せず、割引率・割引額それぞれ単独の結果を表示します。割引後にさらに消費税を加算する場合は、割引後の価格を「1. 税込/税抜金額の計算」の税抜金額として入力してください。',
      '本ツールは概算のシミュレーションであり、実際の税務処理・価格表示の根拠資料としては利用できません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '税抜金額と税込金額',
        description:
          '税抜金額は消費税を含まない商品・サービスの価格、税込金額は消費税を加えた実際の支払額です。日本では「総額表示」が原則のため、消費者向けの価格表示は税込金額で行うのが基本です。',
      },
      {
        term: '標準税率と軽減税率',
        description:
          '2019年10月から消費税は10%（標準税率）ですが、飲食料品（酒類・外食を除く）や新聞などは8%の軽減税率が適用されます。同じ店舗でもテイクアウトは8%、店内飲食は10%になるなど対象の判定には注意が必要です。',
      },
      {
        term: '消費税額の端数処理',
        description:
          '消費税額に小数点以下の端数が出た場合の処理方法（切り捨て・四捨五入・切り上げ）は、法律上どの方式でも認められており、事業者が選択できます。レシートの表示額と本ツールの計算結果が数円ずれる場合は、採用している端数処理方式の違いによるものです。',
      },
    ],
  },
  en: {
    title: 'Consumption Tax & Discount Calculator',
    description:
      'Convert Japanese consumption tax between tax-included and tax-excluded prices and calculate discounts, with 10%, 8%, and custom rates. Runs in your browser.',
    h1: 'Consumption Tax & Discount Calculator',
    introHtml:
      'Enter either the tax-excluded or tax-included price and this tool calculates the tax amount and the other price for you. Switch between the 10% standard rate, 8% reduced rate, or a custom rate. You can also calculate the discounted price from a discount rate or a discount amount. Everything happens in your browser, and nothing you type is ever sent to a server. If you want to work out a price from an hourly or monthly wage, try the <a href="/en/tools/hourly-wage-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Hourly Wage Converter & Overtime Pay Calculator</a> as well.',
    numberLocale: 'en-US',
    section1Heading: '1. Tax-included / tax-excluded price',
    modeLegend: "Amount you're entering",
    modeExclusive: 'Tax-excluded price',
    modeInclusive: 'Tax-included price',
    rateLegend: 'Tax rate',
    rateStandard: 'Standard rate (10%)',
    rateReduced: 'Reduced rate (8%)',
    rateCustom: 'Custom',
    rateCustomPlaceholder: 'e.g. 5',
    amountLabel: 'Amount (JPY)',
    amountPlaceholder: '1000',
    roundingLegend: 'Tax amount rounding',
    roundingFloor: 'Round down',
    roundingRound: 'Round to nearest',
    roundingCeil: 'Round up',
    errorTax: 'Could not calculate (amount and tax rate must be 0 or greater)',
    resultExcludedLabel: 'Tax-excluded price',
    resultTaxLabel: 'Tax amount',
    resultIncludedLabel: 'Tax-included price',
    section2Heading: '2. Discounted price',
    originalPriceLabel: 'Original price (JPY)',
    originalPricePlaceholder: '5000',
    discountTypeLegend: 'How to specify the discount',
    discountTypePercent: 'Discount rate (%)',
    discountTypeAmount: 'Discount amount (JPY)',
    discountValueLabel: 'Discount rate (%)',
    discountValuePlaceholder: '20',
    discountRoundingLegend: 'Discount amount rounding',
    errorDiscount:
      'Could not calculate (original price must be greater than 0, discount rate must be 0-100%, and discount amount must not exceed the original price)',
    resultDiscountAmountLabel: 'Discount amount',
    resultDiscountPriceLabel: 'Discounted price',
    resultDiscountRateLabel: 'Discount rate',
    notesHeading: 'Notes',
    notes: [
      'The rounding method for fractional tax amounts (round down / round to nearest / round up) may not match an actual receipt or invoice, since businesses can each choose their own method.',
      'The discounted price calculation is independent of the consumption tax calculation and shows the result of the discount rate or discount amount alone. If you want to add consumption tax on top of the discounted price, enter the discounted price as the tax-excluded amount in section 1 above.',
      'This tool provides a rough simulation only and cannot be used as a basis for actual tax procedures or price displays.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Tax-excluded and tax-included prices',
        description:
          'A tax-excluded price doesn\'t include Japan\'s consumption tax, while a tax-included price adds it in as the amount actually paid. Japan requires consumer-facing prices to be displayed tax-included (so-called "total display"), so tax-included is the default for prices shown to shoppers.',
      },
      {
        term: 'Standard and reduced tax rates',
        description:
          "Japan's consumption tax has been 10% (the standard rate) since October 2019, but food and beverages (excluding alcohol and dine-in restaurant meals) and newspapers qualify for an 8% reduced rate. Even at the same store, takeout can be 8% while eating in is 10%, so check carefully what applies.",
      },
      {
        term: 'Rounding the tax amount',
        description:
          "When the tax amount has a fractional yen, Japanese law allows rounding down, to the nearest yen, or up — the method is up to each business. If a receipt's amount differs from this tool's result by a yen or two, it's usually just a difference in rounding method.",
      },
    ],
  },
};
