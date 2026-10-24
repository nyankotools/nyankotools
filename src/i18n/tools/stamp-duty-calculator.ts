import type { Locale } from '../../data/tools';
import type { DocTypeId } from '../../lib/tools/stamp-duty-calculator';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface DocTypeCopy {
  id: DocTypeId;
  /** select に表示する号と名称 */
  label: string;
  /** 選択中に表示する補足 */
  hint: string;
}

export interface StampDutyCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  sectionHeading: string;
  docLabel: string;
  docTypes: DocTypeCopy[];
  amountLabel: string;
  amountPlaceholder: string;
  amountHint: string;
  noAmountLabel: string;
  demandLabel: string;
  reliefLabel: string;
  reliefHint: string;
  dateLabel: string;
  error: string;
  resultTaxLabel: string;
  resultNormalLabel: string;
  resultSavingLabel: string;
  resultStatusLabel: string;
  statusNonTaxable: string;
  statusNoAmount: string;
  statusDemandBill: string;
  statusBracket: string;
  statusFixed: string;
  statusRelief: string;
  reliefExpiredMessage: string;
  nonTaxableNote: string;
  disclaimer: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const stampDutyCalculatorContent: Record<
  Locale,
  StampDutyCalculatorPageContent
> = {
  ja: {
    title: '印紙税額の計算｜契約書・領収書の収入印紙代（令和8年）',
    description:
      '契約書・領収書・手形などの文書の種類と記載金額から、収入印紙の税額を計算します。不動産譲渡・建設工事請負の軽減措置にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '印紙税額の計算（契約書・領収書の収入印紙代）',
    introHtml:
      '課税文書の種類（第1号〜第20号）と記載金額を選ぶと、必要な収入印紙の金額を表示します。不動産譲渡契約書・建設工事請負契約書の軽減措置（令和9年3月31日まで）、領収書（第17号）の5万円未満非課税、記載金額なしの文書にも対応しています。国税庁の印紙税額一覧表（令和8年4月1日現在）に基づく目安で、税務上の助言ではありません。請求書や領収書を作る場合は <a href="/tools/invoice-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">請求書ジェネレーター</a>、消費税の計算は <a href="/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">消費税計算</a> もご利用ください。',
    numberLocale: 'ja-JP',
    sectionHeading: '文書の種類と記載金額',
    docLabel: '文書の種類（号と名称）',
    docTypes: [
      {
        id: 'no1-real-estate',
        label: '第1号の1 不動産・地上権・土地賃借権の譲渡契約書',
        hint: '不動産売買契約書など。契約金額が記載金額です。',
      },
      {
        id: 'no1-other',
        label: '第1号の3・4 消費貸借契約書・運送契約書',
        hint: '金銭消費貸借契約書、運送契約書（傭船契約書を含む）など。',
      },
      {
        id: 'no2-construction',
        label: '第2号 請負契約書（建設工事）',
        hint: '建設工事請負契約書。軽減措置の対象です。',
      },
      {
        id: 'no2-other',
        label: '第2号 請負契約書（建設工事以外）',
        hint: '工事以外の請負契約書（制作・加工・修繕・業務委託で請負に当たるもの）。',
      },
      {
        id: 'no3',
        label: '第3号 約束手形・為替手形',
        hint: '手形金額が記載金額です。一覧払等の手形は10万円以上で一律200円です。',
      },
      {
        id: 'no4',
        label: '第4号 株券・社債券等',
        hint: '券面金額が記載金額です。',
      },
      {
        id: 'no5',
        label: '第5号 合併契約書・吸収分割契約書・新設分割計画書',
        hint: '定額（4万円）です。',
      },
      {
        id: 'no6',
        label: '第6号 定款（原本）',
        hint: '公証人の保存する原本のみ課税です。電子定款や謄本は課税されません。',
      },
      {
        id: 'no7',
        label: '第7号 継続的取引の基本契約書',
        hint: '契約期間が3か月以内で更新の定めがないものは対象外です。',
      },
      {
        id: 'no8',
        label: '第8号 預金証書・貯金証書',
        hint: '定額（200円）です。',
      },
      {
        id: 'no9',
        label: '第9号 倉荷証券・船荷証券・複合運送証券',
        hint: '定額（200円）です。',
      },
      {
        id: 'no10',
        label: '第10号 保険証券',
        hint: '定額（200円）です。',
      },
      {
        id: 'no11',
        label: '第11号 信用状',
        hint: '定額（200円）です。',
      },
      {
        id: 'no12',
        label: '第12号 信託行為に関する契約書',
        hint: '定額（200円）です。',
      },
      {
        id: 'no13',
        label: '第13号 債務の保証に関する契約書',
        hint: '定額（200円）です。身元保証に関する契約書は非課税です。',
      },
      {
        id: 'no14',
        label: '第14号 金銭・有価証券の寄託契約書',
        hint: '定額（200円）です。',
      },
      {
        id: 'no15',
        label: '第15号 債権譲渡・債務引受けに関する契約書',
        hint: '契約金額が1万円未満なら非課税、以上は200円です。',
      },
      {
        id: 'no16',
        label: '第16号 配当金領収証・配当金振込通知書',
        hint: '配当金額が3千円未満なら非課税、以上は200円です。',
      },
      {
        id: 'no17-sales',
        label: '第17号の1 売上代金の受取書（領収書）',
        hint: '商品の販売やサービスの対価の領収書です。税抜金額を記載金額とします。',
      },
      {
        id: 'no17-other',
        label: '第17号の2 売上代金以外の受取書（領収書）',
        hint: '貸付金の返済、保険金、損害賠償金などの受取書です。5万円以上は一律200円です。',
      },
      {
        id: 'no18',
        label: '第18号 預貯金通帳など',
        hint: '1年ごとに200円です（年額）。',
      },
      {
        id: 'no19',
        label: '第19号 保険料・掛金の通帳など',
        hint: '1年ごとに400円です（年額）。',
      },
      {
        id: 'no20',
        label: '第20号 判取帳',
        hint: '1年ごとに4,000円です（年額）。',
      },
    ],
    amountLabel: '記載金額（円・税抜）',
    amountPlaceholder: '10000000',
    amountHint:
      '消費税額が区分して記載されている場合、請負契約書・売買契約書・領収書では税抜の金額が記載金額になります。税抜の金額を入力してください。',
    noAmountLabel: '契約金額の記載がない（記載金額なし）',
    demandLabel: '一覧払等の手形（一覧払・日付後定期払など）',
    reliefLabel: '軽減措置を適用する',
    reliefHint:
      '不動産譲渡契約書は10万円超、建設工事請負契約書は100万円超の金額に適用されます。令和9年3月31日までに作成される文書が対象です。',
    dateLabel: '文書の作成日',
    error: '計算できませんでした（記載金額は0以上の数値で入力してください）',
    resultTaxLabel: '印紙税額（貼る収入印紙の額）',
    resultNormalLabel: '軽減措置がない場合の税額',
    resultSavingLabel: '軽減による差額',
    resultStatusLabel: '区分',
    statusNonTaxable: '非課税（印紙は不要）',
    statusNoAmount: '記載金額なし（一律200円）',
    statusDemandBill: '一覧払等の手形（一律200円）',
    statusBracket: '記載金額の区分で決まる税額',
    statusFixed: '定額の税額',
    statusRelief: '軽減措置を適用',
    reliefExpiredMessage:
      '文書の作成日が令和9年3月31日を過ぎているため、軽減措置は適用せず本則の税額で計算しています。',
    nonTaxableNote:
      '記載金額が非課税の基準未満でも、その文書が第3号〜第17号の別の号にも該当する場合は非課税になりません。該当する号がないか確認してください。',
    disclaimer:
      'この結果は国税庁の印紙税額一覧表（令和8年4月1日現在）にもとづく目安であり、法的・税務上の助言ではありません。文書が課税文書に当たるか、記載金額をいくらとみるかの判断は個別の事情で変わります。迷う場合は税務署にご確認ください。',
    notesHeading: '注意事項',
    notes: [
      '令和8年4月1日現在の国税庁の印紙税額一覧表に基づく目安です。軽減措置は令和9年3月31日までに作成される不動産譲渡契約書（第1号の1）と建設工事請負契約書（第2号）が対象で、期限が延長・変更される場合があります。',
      '区分の境界は表のとおり、超・以下・以上・未満を区別して判定します。たとえば第2号文書は100万円ちょうどなら200円、100万1円から400円になります。第1号は10万円以下が200円です。',
      '電子契約書（PDFなどの電磁的記録）は、紙の文書ではなく課税文書に当たらないため、収入印紙は不要です。電子メールで送る領収書のPDFや、クラウド上で締結する契約も同様です。ただし紙に出力して交付した原本は別の文書となり、課税文書に当たる場合があります。',
      '契約書に消費税額が区分して記載されている場合（第1号・第2号・第17号）は、税抜の金額が記載金額になります。区分されていないと税込の金額で判断されるため、入力する金額に注意してください。',
      '1通の文書が複数の号にまたがる場合（所属の決定）や、契約金額が変更・増減する場合の記載金額の考え方は、このツールでは扱いません。',
      '収入印紙を貼らなかった場合は、本来の印紙税額の3倍に相当する過怠税が課されます。税務調査より前に自分から申し出た場合は1.1倍に軽減されます。貼った印紙には消印も必要です。',
      '第6号の定款は、公証人の保存する原本だけが課税対象です。第13号の債務保証でも、身元保証に関する契約書は非課税です。第7号は契約期間が3か月以内で更新の定めがないものを除きます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '印紙税',
        description:
          '契約書や領収書などの課税文書を作成したときにかかる税金です。収入印紙を文書に貼り、消印をすることで納めます。',
      },
      {
        term: '記載金額',
        description:
          '文書に書かれた契約金額や受取金額のことで、印紙税額を決める基準です。消費税額が区分されていれば税抜の金額を使います。',
      },
      {
        term: '軽減措置',
        description:
          '不動産譲渡契約書と建設工事請負契約書について、本則より低い税額を適用する期限付きの特例です。令和9年3月31日までに作成される文書が対象です。',
      },
      {
        term: '過怠税',
        description:
          '収入印紙を貼らなかった場合などに課される税金です。本来の印紙税額の3倍（自分から申し出た場合は1.1倍）が目安です。',
      },
      {
        term: '課税文書',
        description:
          '印紙税法の別表で定められた第1号〜第20号の文書です。契約書や領収書でも、この表に当たらない文書や電子データは課税されません。',
      },
    ],
  },
  en: {
    title: 'Stamp Duty Calculator: Contracts and Receipts (Japan)',
    description:
      'Find the Japanese revenue stamp tax for contracts, receipts and bills by document type and amount, with the relief rates. Runs in your browser, no upload.',
    h1: 'Japan Stamp Duty Calculator for Contracts and Receipts',
    introHtml:
      'Pick the type of taxable document (No. 1 to No. 20) and its stated amount to see the revenue stamp you need to attach. It covers the temporary relief rates for real estate transfer and construction contracts (until March 31, 2027), the ¥50,000 exemption for receipts (No. 17), and documents with no stated amount. The figures follow the National Tax Agency table as of April 1, 2026 and are a guide only, not tax advice. To create an invoice or receipt, try the <a href="/en/tools/invoice-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Invoice Generator</a>, and for consumption tax see the <a href="/en/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Tax Calculator</a>.',
    numberLocale: 'en-US',
    sectionHeading: 'Document type and stated amount',
    docLabel: 'Document type (number and name)',
    docTypes: [
      {
        id: 'no1-real-estate',
        label:
          'No. 1-1 Real estate, superficies, or land lease transfer contract',
        hint: 'For example a real estate sales contract. The contract amount is the stated amount.',
      },
      {
        id: 'no1-other',
        label: 'No. 1-3/4 Loan contract or carriage contract',
        hint: 'Loan agreements for money, carriage contracts (including charter parties), and similar.',
      },
      {
        id: 'no2-construction',
        label: 'No. 2 Work contract (construction work)',
        hint: 'A construction work contract. The relief rates can apply.',
      },
      {
        id: 'no2-other',
        label: 'No. 2 Work contract (other than construction)',
        hint: 'Non-construction contracts for work, such as production, processing, repair or commissioned work that counts as a work contract.',
      },
      {
        id: 'no3',
        label: 'No. 3 Promissory note or bill of exchange',
        hint: 'The face amount is the stated amount. Demand bills are a flat ¥200 from ¥100,000.',
      },
      {
        id: 'no4',
        label: 'No. 4 Share or bond certificate',
        hint: 'The face value is the stated amount.',
      },
      {
        id: 'no5',
        label: 'No. 5 Merger or company split agreement',
        hint: 'Flat ¥40,000.',
      },
      {
        id: 'no6',
        label: 'No. 6 Articles of incorporation (original)',
        hint: 'Only the original kept by the notary is taxed. Electronic articles and certified copies are not.',
      },
      {
        id: 'no7',
        label: 'No. 7 Master contract for continuing transactions',
        hint: 'Excluded if the term is three months or less with no renewal clause.',
      },
      {
        id: 'no8',
        label: 'No. 8 Deposit certificate',
        hint: 'Flat ¥200.',
      },
      {
        id: 'no9',
        label: 'No. 9 Warehouse receipt, bill of lading, or similar',
        hint: 'Flat ¥200.',
      },
      {
        id: 'no10',
        label: 'No. 10 Insurance policy',
        hint: 'Flat ¥200.',
      },
      {
        id: 'no11',
        label: 'No. 11 Letter of credit',
        hint: 'Flat ¥200.',
      },
      {
        id: 'no12',
        label: 'No. 12 Trust agreement',
        hint: 'Flat ¥200.',
      },
      {
        id: 'no13',
        label: 'No. 13 Debt guarantee contract',
        hint: 'Flat ¥200. Employee identity guarantees are exempt.',
      },
      {
        id: 'no14',
        label: 'No. 14 Deposit contract for money or securities',
        hint: 'Flat ¥200.',
      },
      {
        id: 'no15',
        label: 'No. 15 Assignment of claims or assumption of debt',
        hint: 'Exempt under ¥10,000 and ¥200 from ¥10,000.',
      },
      {
        id: 'no16',
        label: 'No. 16 Dividend receipt or payment notice',
        hint: 'Exempt under ¥3,000 and ¥200 from ¥3,000.',
      },
      {
        id: 'no17-sales',
        label: 'No. 17-1 Receipt for sales proceeds',
        hint: 'A receipt for goods or services sold. Use the amount before consumption tax as the stated amount.',
      },
      {
        id: 'no17-other',
        label: 'No. 17-2 Receipt for other than sales proceeds',
        hint: 'Receipts for loan repayments, insurance payouts, damages, and so on. A flat ¥200 from ¥50,000.',
      },
      {
        id: 'no18',
        label: 'No. 18 Deposit passbook and similar',
        hint: '¥200 per year (annual amount).',
      },
      {
        id: 'no19',
        label: 'No. 19 Insurance premium or contribution passbook',
        hint: '¥400 per year (annual amount).',
      },
      {
        id: 'no20',
        label: 'No. 20 Receipt book (hantori-cho)',
        hint: '¥4,000 per year (annual amount).',
      },
    ],
    amountLabel: 'Stated amount (JPY, before tax)',
    amountPlaceholder: '10000000',
    amountHint:
      'When the consumption tax is shown separately on a work contract, sales contract or receipt, the amount before tax is the stated amount. Enter the pre-tax figure.',
    noAmountLabel: 'No contract amount is stated',
    demandLabel:
      'Demand bill (payable at sight or a fixed period after the date)',
    reliefLabel: 'Apply the relief rates',
    reliefHint:
      'The relief applies to amounts over ¥100,000 for real estate transfers and over ¥1 million for construction contracts. It covers documents created by March 31, 2027.',
    dateLabel: 'Date the document is created',
    error:
      'Could not calculate (enter the stated amount as a number of 0 or more)',
    resultTaxLabel: 'Stamp duty (revenue stamp to attach)',
    resultNormalLabel: 'Tax without the relief',
    resultSavingLabel: 'Saved by the relief',
    resultStatusLabel: 'Basis',
    statusNonTaxable: 'Exempt (no stamp needed)',
    statusNoAmount: 'No stated amount (flat ¥200)',
    statusDemandBill: 'Demand bill (flat ¥200)',
    statusBracket: 'Tax set by the stated amount bracket',
    statusFixed: 'Flat tax',
    statusRelief: 'Relief rates applied',
    reliefExpiredMessage:
      'The document date is after March 31, 2027, so the relief is not applied and the standard rate is used.',
    nonTaxableNote:
      'Even if the stated amount is below the exemption line, the document is not exempt if it also falls under another category from No. 3 to No. 17. Check whether another number applies.',
    disclaimer:
      'These results are a guide based on the National Tax Agency table as of April 1, 2026, not legal or tax advice. Whether a document is taxable and what counts as the stated amount depend on the details. If unsure, ask your local tax office.',
    notesHeading: 'Notes',
    notes: [
      'This is a guide based on the National Tax Agency stamp duty table as of April 1, 2026. The relief covers real estate transfer contracts (No. 1-1) and construction work contracts (No. 2) created by March 31, 2027, and the deadline may be extended or changed.',
      'Brackets follow the table exactly, distinguishing over, up to, at least and under. For a No. 2 document, ¥1,000,000 exactly is ¥200 and ¥1,000,001 is ¥400. For a No. 1 document, up to ¥100,000 is ¥200.',
      'Electronic contracts (PDFs and other electronic records) are not paper documents and are not taxable documents, so no revenue stamp is needed. The same goes for emailed PDF receipts and contracts signed in the cloud. A paper original printed and handed over is a separate document and may be taxable.',
      'When the consumption tax is shown separately on a No. 1, No. 2 or No. 17 document, the amount before tax is the stated amount. If it is not separated, the tax-inclusive amount is used, so check the figure you enter.',
      'Documents that cover several kinds of transactions or fall under multiple numbers, and how to state amounts that change under the contract, are not handled here.',
      'If a required stamp is not attached, an additional tax of three times the stamp duty is charged. If you report it yourself before an audit, it is reduced to 1.1 times. The stamp must also be canceled with a seal or signature.',
      'For No. 6, only the original articles kept by the notary are taxed. Among No. 13 guarantees, employee identity guarantees are exempt. For No. 7, contracts of three months or less with no renewal clause are excluded.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Stamp duty (inshizei)',
        description:
          'A tax on taxable documents such as contracts and receipts. You pay it by attaching a revenue stamp and canceling it.',
      },
      {
        term: 'Stated amount',
        description:
          'The contract or receipt amount written on the document, which decides the duty. When consumption tax is shown separately, the pre-tax amount is used.',
      },
      {
        term: 'Relief rates',
        description:
          'A time-limited special rate lower than the standard one for real estate transfer and construction work contracts. It covers documents created by March 31, 2027.',
      },
      {
        term: 'Additional tax (kataizei)',
        description:
          'The charge when a required stamp is not attached. It is about three times the stamp duty, or 1.1 times if you report it yourself.',
      },
      {
        term: 'Taxable document',
        description:
          'A document listed as No. 1 to No. 20 in the Stamp Tax Act schedule. Contracts and receipts outside the list, and electronic data, are not taxed.',
      },
    ],
  },
};
