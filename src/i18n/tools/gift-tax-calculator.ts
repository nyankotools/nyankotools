import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface GiftTaxCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  basisLine: string;
  sectionHeading: string;
  specialLabel: string;
  specialHint: string;
  generalLabel: string;
  generalHint: string;
  error: string;
  notApplicable: string;
  rateFormat: string;
  resultPayableLabel: string;
  resultCalculatedLabel: string;
  resultEffectiveLabel: string;
  resultTotalLabel: string;
  resultDeductionLabel: string;
  resultTaxableLabel: string;
  resultSpecialRateLabel: string;
  resultGeneralRateLabel: string;
  resultSpecialShareLabel: string;
  resultGeneralShareLabel: string;
  zeroNote: string;
  compareHeading: string;
  compareAllSpecialLabel: string;
  compareAllGeneralLabel: string;
  compareSpecialBetter: string;
  compareGeneralBetter: string;
  compareSame: string;
  tableHeading: string;
  tableSpecialCaption: string;
  tableGeneralCaption: string;
  tableHeadRange: string;
  tableHeadRate: string;
  tableHeadDeduction: string;
  rangeUpTo: string;
  rangeBetween: string;
  rangeOver: string;
  disclaimer: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const giftTaxCalculatorContent: Record<
  Locale,
  GiftTaxCalculatorPageContent
> = {
  ja: {
    title: '贈与税計算｜暦年課税の基礎控除・特例税率・一般税率',
    description:
      '年間の贈与額から暦年課税の贈与税を計算します。基礎控除110万円、特例税率と一般税率の速算表、両方ある場合の按分計算に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '贈与税の計算（暦年課税・特例税率と一般税率）',
    introHtml:
      '1年間（1月1日〜12月31日）にもらった贈与額を入力すると、基礎控除110万円を引いた課税価格、速算表の該当行、贈与税額、実効税率を表示します。親や祖父母など直系尊属から18歳以上の人への贈与は特例税率、それ以外は一般税率です。両方ある場合は国税庁の按分計算で求めます。令和8年時点の制度による概算です。退職金の税金は <a href="/tools/retirement-allowance-tax/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">退職金の税金計算</a>、消費税は <a href="/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">消費税・割引計算機</a> をご利用ください。',
    numberLocale: 'ja-JP',
    basisLine:
      '基準: 令和8年（2026年）時点の暦年課税（国税庁タックスアンサー No.4408）。基礎控除は受贈者1人につき年間110万円。',
    sectionHeading: '受贈者1人の年間贈与額',
    specialLabel: '特例税率の対象になる贈与の合計（円）',
    specialHint:
      '直系尊属（父母・祖父母など）から、贈与を受けた年の1月1日時点で18歳以上の子・孫などへの贈与。複数の人からの分は合計します。',
    generalLabel: '一般税率の対象になる贈与の合計（円）',
    generalHint:
      '兄弟姉妹・夫婦・親族以外、または18歳未満の子・孫への贈与など、特例税率に当てはまらない贈与。複数の人からの分は合計します。',
    error:
      '計算できませんでした（贈与額は0円以上1兆円以下の数値で入力してください）',
    notApplicable: '該当なし',
    rateFormat: '税率{rate}%・控除額{deduction}',
    resultPayableLabel: '贈与税額（納付額の目安・100円未満切り捨て）',
    resultCalculatedLabel: '算出税額（100円未満切り捨て前）',
    resultEffectiveLabel: '実効税率（納付額÷贈与額）',
    resultTotalLabel: '年間贈与額の合計',
    resultDeductionLabel: '基礎控除額',
    resultTaxableLabel: '基礎控除後の課税価格（1,000円未満切り捨て）',
    resultSpecialRateLabel: '適用する特例税率',
    resultGeneralRateLabel: '適用する一般税率',
    resultSpecialShareLabel: '特例贈与財産分の税額',
    resultGeneralShareLabel: '一般贈与財産分の税額',
    zeroNote: '基礎控除の範囲内のため、贈与税はかかりません。',
    compareHeading: '特例税率と一般税率の比較',
    compareAllSpecialLabel: '全額が特例税率だった場合',
    compareAllGeneralLabel: '全額が一般税率だった場合',
    compareSpecialBetter:
      '特例税率のほうが一般税率より {amount} 税額が少なくなります。',
    compareGeneralBetter:
      '一般税率のほうが特例税率より {amount} 税額が少なくなります。',
    compareSame: '特例税率と一般税率で税額は同じです。',
    tableHeading: '速算表（基礎控除後の課税価格に適用）',
    tableSpecialCaption: '特例税率',
    tableGeneralCaption: '一般税率',
    tableHeadRange: '基礎控除後の課税価格',
    tableHeadRate: '税率',
    tableHeadDeduction: '控除額',
    rangeUpTo: '{high}以下',
    rangeBetween: '{low}超〜{high}以下',
    rangeOver: '{low}超',
    disclaimer:
      'この結果は令和8年時点の制度にもとづく概算の目安であり、法的・税務上の助言ではありません。個別の判断は税務署や税理士にご確認ください。',
    notesHeading: '注意事項',
    notes: [
      '令和8年時点の暦年課税の概算です。基礎控除は受贈者1人につき年間110万円で、1月1日〜12月31日にもらった贈与の合計額から引きます。税制改正で変わる場合があります。',
      '課税価格（基礎控除後の額）は1,000円未満を切り捨て、税額は速算表で課税価格×税率−控除額として求めます。納付額は100円未満を切り捨てるため、算出税額と納付額の目安を分けて表示しています。',
      '特例税率と一般税率の贈与が両方ある場合は、国税庁の方法に従い、課税価格全体に各税率を当てはめた税額を、基礎控除前の財産の価額の割合で按分して足し合わせます。按分後の各税額は1円未満を切り捨てています。',
      '特例税率は、贈与者が直系尊属（父母・祖父母など）で、受贈者が贈与を受けた年の1月1日時点で18歳以上の場合です。それ以外の贈与は一般税率です。',
      '対象外の制度: 相続時精算課税（2,500万円の特別控除、令和6年以降は年110万円の基礎控除あり）、住宅取得等資金・教育資金・結婚子育て資金の非課税特例、婚姻期間20年以上の配偶者への居住用不動産の贈与の配偶者控除（2,000万円）。いずれも計算に含めていません。',
      '暦年課税で贈与した財産は、令和6年1月以降の贈与から相続開始前7年以内（従来は3年以内）の分が相続税の対象に加算される場合があります。これは相続側の計算で、このツールには含みません。',
      '申告期限は、贈与を受けた年の翌年2月1日から3月15日までです。基礎控除以下でも、特例の適用を受ける場合などは申告が必要になることがあります。税務上の助言ではありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '暦年課税',
        description:
          '1月1日から12月31日までの1年間に贈与を受けた財産の合計額に対して、基礎控除110万円を引いて課税する方式です。',
      },
      {
        term: '特例税率（特例贈与財産）',
        description:
          '直系尊属から、贈与を受けた年の1月1日時点で18歳以上の子・孫などへの贈与に使う、税率が低めの速算表です。',
      },
      {
        term: '一般税率（一般贈与財産）',
        description:
          '特例税率に当てはまらない贈与に使う速算表です。同じ課税価格でも特例税率より税額が多くなることがあります。',
      },
      {
        term: '速算表',
        description:
          '課税価格に税率をかけ、控除額を引くだけで税額が出せるようにした表です。累進課税を簡単に計算するために使います。',
      },
      {
        term: '相続時精算課税',
        description:
          '贈与時は2,500万円までの特別控除で贈与税がかからず、相続時にまとめて精算する制度です。暦年課税とは別の制度で、このツールの対象外です。',
      },
    ],
  },
  en: {
    title: 'Japan Gift Tax Calculator (Annual Gift Tax Estimate)',
    description:
      'Estimate Japanese gift tax under calendar-year taxation with the ¥1.1M basic deduction, special and general rates, and split calculation. Runs in your browser.',
    h1: 'Japan Gift Tax Calculator (Calendar-Year Taxation)',
    introHtml:
      'Enter the gifts one person received in a calendar year. The tool subtracts the ¥1.1 million basic deduction, shows the matching row of the rate table, the gift tax, and the effective rate. Gifts from a parent or grandparent to someone aged 18 or older use the special rate; all others use the general rate. If you have both, the tool uses the National Tax Agency proration method. This is an estimate under the 2026 rules. For retirement pay, see the <a href="/en/tools/retirement-allowance-tax/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Retirement Allowance Tax Calculator</a>; for consumption tax, use the <a href="/en/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Consumption Tax & Discount Calculator</a>.',
    numberLocale: 'en-US',
    basisLine:
      'Basis: calendar-year gift taxation as of 2026 (National Tax Agency Tax Answer No. 4408). The basic deduction is ¥1.1 million per recipient per year.',
    sectionHeading: 'Gifts received by one person in a year',
    specialLabel: 'Gifts taxed at the special rate (JPY)',
    specialHint:
      'Gifts from a direct ancestor (parent, grandparent) to a child or grandchild who is 18 or older on January 1 of the year. Add up gifts from several donors.',
    generalLabel: 'Gifts taxed at the general rate (JPY)',
    generalHint:
      'Gifts that do not qualify for the special rate, such as gifts from a spouse, sibling, or other relative, or to a recipient under 18. Add up gifts from several donors.',
    error: 'Could not calculate (enter gift amounts from 0 to 1 trillion yen)',
    notApplicable: 'Not applicable',
    rateFormat: '{rate}% rate, deduction {deduction}',
    resultPayableLabel: 'Gift tax (estimated payment, rounded down to ¥100)',
    resultCalculatedLabel: 'Calculated tax (before rounding to ¥100)',
    resultEffectiveLabel: 'Effective rate (tax / gifts)',
    resultTotalLabel: 'Total gifts in the year',
    resultDeductionLabel: 'Basic deduction applied',
    resultTaxableLabel:
      'Taxable amount after deduction (rounded down to ¥1,000)',
    resultSpecialRateLabel: 'Special rate row used',
    resultGeneralRateLabel: 'General rate row used',
    resultSpecialShareLabel: 'Tax on special-rate gifts',
    resultGeneralShareLabel: 'Tax on general-rate gifts',
    zeroNote:
      'The gifts are within the basic deduction, so no gift tax is due.',
    compareHeading: 'Special rate vs general rate',
    compareAllSpecialLabel: 'If all gifts used the special rate',
    compareAllGeneralLabel: 'If all gifts used the general rate',
    compareSpecialBetter:
      'The special rate saves {amount} compared with the general rate.',
    compareGeneralBetter:
      'The general rate is {amount} lower than the special rate.',
    compareSame: 'The tax is the same under both rates.',
    tableHeading: 'Rate tables (applied to the amount after the deduction)',
    tableSpecialCaption: 'Special rate',
    tableGeneralCaption: 'General rate',
    tableHeadRange: 'Taxable amount',
    tableHeadRate: 'Rate',
    tableHeadDeduction: 'Deduction',
    rangeUpTo: 'Up to {high}',
    rangeBetween: 'Over {low} to {high}',
    rangeOver: 'Over {low}',
    disclaimer:
      'These results are rough estimates based on the 2026 rules and are not legal or tax advice. Please confirm individual cases with the tax office or a tax accountant.',
    notesHeading: 'Notes',
    notes: [
      'This is an estimate of calendar-year gift tax under the 2026 rules. The basic deduction is ¥1.1 million per recipient per year, subtracted from all gifts received between January 1 and December 31. Tax reform can change this.',
      'The taxable amount after the deduction is rounded down to ¥1,000, and tax is "amount x rate - deduction" from the quick-calculation table. The payment is rounded down to ¥100, so the tool shows both the calculated tax and the estimated payment.',
      'When you have both special-rate and general-rate gifts, the tool follows the National Tax Agency method: it applies each rate table to the whole taxable amount, then splits each result by the share of gifts (before the deduction) and adds the parts. Each part is rounded down to ¥1.',
      'The special rate applies when the donor is a direct ancestor (parent, grandparent) and the recipient is 18 or older on January 1 of the year of the gift. All other gifts use the general rate.',
      'Not covered: settlement-taxation (the ¥25 million special exemption), tax-exempt gifts for housing funds, education funds, and marriage and child-rearing funds, and the ¥20 million spousal exemption for a residence given after 20 years of marriage.',
      'For gifts made from January 2024, assets given within seven years before death (previously three) may be added back to the inheritance tax base. That is an inheritance-side calculation and is not included here.',
      'The filing period runs from February 1 to March 15 of the year after the gift. A return may be needed even within the basic deduction if you claim a special exemption. This is not tax advice.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Calendar-year taxation',
        description:
          'The default gift tax method. All gifts received in one calendar year are added up, the ¥1.1 million basic deduction is subtracted, and the rest is taxed.',
      },
      {
        term: 'Special rate (special gift property)',
        description:
          'A lower-rate table for gifts from a direct ancestor to a child or grandchild who is 18 or older on January 1 of the gift year.',
      },
      {
        term: 'General rate (general gift property)',
        description:
          'The rate table for gifts that do not qualify for the special rate. It can produce more tax than the special rate for the same amount.',
      },
      {
        term: 'Quick-calculation table',
        description:
          'A table where you multiply the taxable amount by a rate and subtract a fixed deduction to get the tax, a shortcut for progressive tax brackets.',
      },
      {
        term: 'Settlement taxation',
        description:
          'An alternative system with a ¥25 million special exemption on gifts, where the gifts are settled together with inheritance tax. It is separate from calendar-year taxation and not covered here.',
      },
    ],
  },
};
