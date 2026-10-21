import type { Locale } from '../../data/tools';
import type {
  PriceUnit,
  TaxMode,
  UnitDimension,
} from '../../lib/tools/unit-price-comparator';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SampleRow {
  name: string;
  price: string;
  quantity: string;
  count: string;
  unit: PriceUnit;
  taxMode: TaxMode;
}

export interface UnitPriceComparatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  currency: string;

  rowLegend: string;
  nameLabel: string;
  namePlaceholder: string;
  priceLabel: string;
  quantityLabel: string;
  countLabel: string;
  countPlaceholder: string;
  unitLabel: string;
  units: Record<PriceUnit, string>;
  taxLabel: string;
  taxModes: Record<TaxMode, string>;
  sampleRows: SampleRow[];
  rowCount: number;
  clearButton: string;

  resultHeading: string;
  /** 比較の基準（重さ・容量は100あたり、個数は1個あたり） */
  basisLabels: Record<UnitDimension, string>;
  defaultItemName: string;
  cheapestBadge: string;
  diffText: string;
  summaryText: string;
  summaryTieText: string;
  tooFewText: string;
  invalidRowText: string;
  mismatchRowText: string;
  copyButton: string;
  copied: string;
  copyFailed: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const unitPriceComparatorContent: Record<
  Locale,
  UnitPriceComparatorPageContent
> = {
  ja: {
    title: '単価比較ツール（100gあたり・容量違いでどれがお得か）',
    description:
      '価格と内容量から100gあたり・100mlあたりの単価を比べ、容量違いの商品でどれが一番お得か判定します。3商品以上・個数やパック数・税込税抜に対応。ブラウザ内で処理され、サーバーには送信されません。',
    h1: '単価比較ツール（容量違いの商品でお得なのはどれ？）',
    introHtml:
      '価格と内容量を入力すると、100gあたり・100mlあたり（個数なら1個あたり）の単価を計算して、いちばん安い商品に印をつけます。最安との差も「％割高」で表示します。kgとg、Lとmlのように単位が混ざっていても自動で換算します。6本パックのような個数・パック数や、税抜価格の商品を税込に直して比べることもできます。入力内容はブラウザ内で処理され、サーバーには送信されません。消費税の計算は <a href="/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">消費税計算機</a>、単位の換算は <a href="/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">単位変換ツール</a> もご利用ください。',
    numberLocale: 'ja-JP',
    currency: 'JPY',

    rowLegend: '商品{n}',
    nameLabel: '商品名（任意）',
    namePlaceholder: '例: 大パック',
    priceLabel: '価格',
    quantityLabel: '内容量',
    countLabel: '個数・パック数',
    countPlaceholder: '1',
    unitLabel: '単位',
    units: { g: 'g', kg: 'kg', ml: 'ml', l: 'L', piece: '個・枚・本' },
    taxLabel: '価格の税',
    taxModes: {
      included: '税込',
      excl10: '税抜（10%）',
      excl8: '税抜（8%）',
    },
    sampleRows: [
      {
        name: '小パック',
        price: '198',
        quantity: '200',
        count: '',
        unit: 'g',
        taxMode: 'included',
      },
      {
        name: '大パック',
        price: '398',
        quantity: '500',
        count: '',
        unit: 'g',
        taxMode: 'included',
      },
      {
        name: '徳用',
        price: '698',
        quantity: '1',
        count: '',
        unit: 'kg',
        taxMode: 'included',
      },
    ],
    rowCount: 5,
    clearButton: '入力をクリア',

    resultHeading: '比較結果',
    basisLabels: {
      weight: '100gあたり',
      volume: '100mlあたり',
      count: '1個あたり',
    },
    defaultItemName: '商品{n}',
    cheapestBadge: '最安',
    diffText: '最安より {percent}% 割高',
    summaryText: '{name}がいちばんお得です（{basis} {price}）',
    summaryTieText: '{name}が同率で最安です（{basis} {price}）',
    tooFewText: '価格と内容量を入力した商品を2つ以上用意してください',
    invalidRowText:
      '商品{n}: 価格と内容量（と個数）は0より大きい数値で入力してください',
    mismatchRowText:
      '商品{n}: 単位の種類（重さ・容量・個数）がほかの商品と違うため比較から外しました',
    copyButton: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',

    notesHeading: '注意事項',
    notes: [
      '比較は最初に入力した商品の単位の種類（重さ・容量・個数）にそろえます。種類が違う商品は比較から外れ、理由が表示されます。',
      '税抜を選んだ商品は、その税率で税込に換算してから比べます。税込・税抜が混ざった商品も同じ条件で比較できます。',
      'ml と g は同じ100として扱うだけで、密度の違い（水と油など）は考慮しません。重さと容量の商品どうしは比べられません。',
      '単価だけでなく、使い切れる量・保存期間・品質も考えて選んでください。大容量は単価が安くても、余らせると割高になります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '単価',
        description:
          '商品を同じ量（100gや1個など）に換算したときの価格です。内容量が違う商品でも、単価なら公平に比べられます。',
      },
      {
        term: 'グラム単価・ユニットプライス',
        description:
          'スーパーの値札などに書かれる「100gあたりいくら」の表示です。計算式は「価格 ÷ 内容量 × 100」です。',
      },
    ],
  },
  en: {
    title: 'Unit Price Comparator (Price per 100 g / 100 ml)',
    description:
      'Compare 3+ products by price per 100 g, 100 ml or item, with pack counts and tax options. Runs in your browser; nothing is sent to a server.',
    h1: 'Unit Price Comparator: Which Size Is the Better Deal?',
    introHtml:
      'Enter each product\'s price and size, and the tool works out the price per 100 g, per 100 ml, or per item and marks the cheapest one. It also shows how much more every other option costs than the cheapest. Mixed units such as kg and g, or L and ml, are converted automatically. You can enter a multipack (for example 6 bottles) and adjust for tax if a price excludes it. Everything is calculated in your browser, and nothing you type is sent to a server. For sales tax, try the <a href="/en/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Tax Calculator</a>; to convert units, try the <a href="/en/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unit Converter</a>.',
    numberLocale: 'en-US',
    currency: 'USD',

    rowLegend: 'Product {n}',
    nameLabel: 'Name (optional)',
    namePlaceholder: 'e.g. Large pack',
    priceLabel: 'Price',
    quantityLabel: 'Size',
    countLabel: 'Packs / count',
    countPlaceholder: '1',
    unitLabel: 'Unit',
    units: { g: 'g', kg: 'kg', ml: 'ml', l: 'L', piece: 'pcs' },
    taxLabel: 'Tax on price',
    taxModes: {
      included: 'Tax included',
      excl10: 'Excl. 10% tax',
      excl8: 'Excl. 8% tax',
    },
    sampleRows: [
      {
        name: 'Small pack',
        price: '1.98',
        quantity: '200',
        count: '',
        unit: 'g',
        taxMode: 'included',
      },
      {
        name: 'Large pack',
        price: '3.98',
        quantity: '500',
        count: '',
        unit: 'g',
        taxMode: 'included',
      },
      {
        name: 'Bulk',
        price: '6.98',
        quantity: '1',
        count: '',
        unit: 'kg',
        taxMode: 'included',
      },
    ],
    rowCount: 5,
    clearButton: 'Clear all',

    resultHeading: 'Comparison',
    basisLabels: {
      weight: 'per 100 g',
      volume: 'per 100 ml',
      count: 'per item',
    },
    defaultItemName: 'Product {n}',
    cheapestBadge: 'Cheapest',
    diffText: '{percent}% more than the cheapest',
    summaryText: '{name} is the best value ({price} {basis})',
    summaryTieText: '{name} tie for the best value ({price} {basis})',
    tooFewText: 'Enter a price and size for at least two products',
    invalidRowText:
      'Product {n}: price, size and count must be numbers greater than 0',
    mismatchRowText:
      'Product {n}: its unit type (weight, volume or count) differs from the others, so it was left out',
    copyButton: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',

    notesHeading: 'Notes',
    notes: [
      'Products are compared in the unit type of the first one you fill in (weight, volume or count). Products of another type are left out, and the reason is shown.',
      'Prices marked as excluding tax are converted to tax-included at that rate before comparing, so mixed tax-included and tax-excluded prices can be compared fairly.',
      'Milliliters and grams are each simply scaled to 100; density (water versus oil, for example) is not considered, and weight cannot be compared with volume.',
      'Unit price is not the only factor. Consider how much you will really use, shelf life and quality, because a bulk pack you cannot finish is not a bargain.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Unit price',
        description:
          'The price converted to a common amount, such as 100 g or one item. It lets you compare products of different sizes fairly.',
      },
      {
        term: 'Price per 100 g',
        description:
          'The unit price shown on many shelf labels. The formula is price divided by size, multiplied by 100.',
      },
    ],
  },
};
