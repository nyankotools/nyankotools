import type { Locale } from '../../data/tools';
import type {
  ParcelGroup,
  ServiceId,
} from '../../lib/tools/parcel-size-checker';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface ServiceCopy {
  id: ServiceId;
  name: string;
  /** サービスごとの条件の要約と注意 */
  note: string;
}

export interface ParcelSizeCheckerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  sectionHeading: string;
  lengthLabel: string;
  widthLabel: string;
  heightLabel: string;
  weightLabel: string;
  inputHint: string;
  error: string;
  summaryHeading: string;
  summarySumLabel: string;
  summaryLongestLabel: string;
  summaryShortestLabel: string;
  resultsHeading: string;
  groupLabels: Record<ParcelGroup, string>;
  services: ServiceCopy[];
  statusFit: string;
  statusNoFit: string;
  /** {size} を区分の数字に置き換える */
  tierFormat: string;
  decidedBySum: string;
  decidedByWeight: string;
  /** 以下の理由文は {limit} と {actual} を置き換える */
  reasonSum: string;
  reasonLongest: string;
  reasonMiddle: string;
  reasonThickness: string;
  reasonWeight: string;
  disclaimer: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const parcelSizeCheckerContent: Record<
  Locale,
  ParcelSizeCheckerPageContent
> = {
  ja: {
    title: '宅配サイズ判定｜3辺合計・重量でヤマト・ゆうパックの区分（令和8年）',
    description:
      '荷物の縦・横・高さと重さから、宅急便・ゆうパックのサイズ区分と、ネコポス・ゆうパケット・レターパックなど薄型サービスの利用可否を判定。上限を超えた理由も表示します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '宅配サイズ判定（3辺合計・重量でヤマト・ゆうパックの区分を確認）',
    introHtml:
      '荷物の縦・横・高さ（cm）と重さ（kg）を入力すると、ヤマト運輸の宅急便・日本郵便のゆうパック・佐川急便の飛脚宅配便のサイズ区分（60〜200サイズ）と、ネコポス・宅急便コンパクト・ゆうパケット・レターパック・定形外郵便に収まるかを一覧で判定します。収まらないときは、3辺合計・最長辺・厚さ・重量のどの上限を超えたかを表示します。区分表は令和8年時点の各社公式の条件にもとづく目安で、料金は計算しません。長さの単位換算は <a href="/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">単位変換</a> もご利用ください。',
    numberLocale: 'ja-JP',
    sectionHeading: '荷物の大きさと重さ',
    lengthLabel: '縦（cm）',
    widthLabel: '横（cm）',
    heightLabel: '高さ・厚さ（cm）',
    weightLabel: '重さ（kg）',
    inputHint:
      '梱包後の外寸と重さを入力してください。辺の順番は自由で、最も長い辺・中間・最も短い辺（厚さ）は自動で判断します。',
    error:
      '判定できませんでした（縦・横・高さ・重さは0より大きい数値で入力してください）',
    summaryHeading: '入力した荷物',
    summarySumLabel: '3辺合計',
    summaryLongestLabel: '最も長い辺',
    summaryShortestLabel: '最も短い辺（厚さ）',
    resultsHeading: 'サービス別の判定',
    groupLabels: {
      yamato: 'ヤマト運輸',
      jp: '日本郵便',
      sagawa: '佐川急便',
    },
    services: [
      {
        id: 'yamato-takkyubin',
        name: '宅急便',
        note: '3辺合計と重量の両方で区分が決まり、大きいほうの区分になります。最大は3辺合計200cm以内・30kg以内です。',
      },
      {
        id: 'yamato-compact',
        name: '宅急便コンパクト',
        note: '専用BOX（外寸 縦25×横20×厚さ5cm）に入ることが条件です。専用BOXの購入が必要で、薄型専用BOXは別の寸法です。',
      },
      {
        id: 'yamato-nekopos',
        name: 'ネコポス',
        note: '31.2×22.8cm以内、厚さ3.5cm以内、1kg以内です。提供状況や取り扱い窓口は変更されることがあるため、公式サイトで確認してください。',
      },
      {
        id: 'yupack',
        name: 'ゆうパック',
        note: '3辺合計で60〜170サイズが決まり、重量は全区分で25kg以内です。最大は3辺合計170cm以内です。',
      },
      {
        id: 'yupacket',
        name: 'ゆうパケット',
        note: '3辺合計60cm以内、長辺34cm以内、厚さ3cm以内、1kg以内です。',
      },
      {
        id: 'yupacket-plus',
        name: 'ゆうパケットプラス',
        note: '専用箱（外寸 縦24×横17×高さ7.5cm）に入ることが条件で、2kg以内です。専用箱の購入が必要です。',
      },
      {
        id: 'letterpack-light',
        name: 'レターパックライト',
        note: 'A4ファイルサイズ（34×24.8cm）以内、厚さ3cm以内、4kg以内です。',
      },
      {
        id: 'letterpack-plus',
        name: 'レターパックプラス',
        note: 'A4ファイルサイズ（34×24.8cm）以内、4kg以内です。厚さの数値制限はありませんが、封が確実にできる必要があります。',
      },
      {
        id: 'teikeigai-standard',
        name: '定形外郵便（規格内）',
        note: '長辺34cm以内、短辺25cm以内、厚さ3cm以内、1kg以内です。',
      },
      {
        id: 'teikeigai-irregular',
        name: '定形外郵便（規格外）',
        note: '3辺合計90cm以内、最長辺60cm以内、4kg以内です。',
      },
      {
        id: 'sagawa-hikyaku',
        name: '飛脚宅配便',
        note: '3辺合計と重量の両方で区分が決まり、大きいほうの区分になります（60・80・100・140・160サイズ。120サイズはありません）。最大は3辺合計160cm以内・30kg以内です。',
      },
      {
        id: 'sagawa-large',
        name: '飛脚ラージサイズ宅配便',
        note: '飛脚宅配便に収まらない荷物（3辺合計160cm超または30kg超）が対象で、上限は3辺合計260cm以内・50kg以内です。2個以上の同時発送も対象になるため、ここでは1個の寸法・重量の上限だけを確認しています。',
      },
    ],
    statusFit: '◯ 利用できます',
    statusNoFit: '× 利用できません',
    tierFormat: '{size}サイズ',
    decidedBySum: '3辺合計で決まりました',
    decidedByWeight:
      '重量で決まりました（3辺合計だけならもっと小さい区分です）',
    reasonSum: '3辺合計 {actual}cm が上限の {limit}cm を超えています',
    reasonLongest: '最も長い辺 {actual}cm が上限の {limit}cm を超えています',
    reasonMiddle: '中間の辺 {actual}cm が上限の {limit}cm を超えています',
    reasonThickness:
      '厚さ（最も短い辺）{actual}cm が上限の {limit}cm を超えています',
    reasonWeight: '重量 {actual}kg が上限の {limit}kg を超えています',
    disclaimer:
      'この結果は令和8年時点のヤマト運輸・日本郵便・佐川急便の公式サイトに掲載された寸法・重量の条件にもとづく目安です。サービス内容や条件は改定されるため、発送前に必ず各社の公式サイトで最新の条件を確認してください。実際の区分は窓口やドライバーの計測で決まります。',
    notesHeading: '注意事項',
    notes: [
      '令和8年時点で確認できた各社の条件にもとづく目安です。サイズ区分、上限、サービス自体の提供状況（特にネコポスなどの薄型サービス）は改定されることがあります。',
      '区分表の上限は、その値ちょうどを含めて判定しています。たとえば宅急便の60サイズは3辺合計60cmちょうど・2kgちょうどまで、60.1cmや2.01kgからは80サイズです。',
      '宅急便は3辺合計と重量の両方から区分が決まり、大きいほうが適用されます。ゆうパックは3辺合計だけで区分が決まり、重量は25kgまでです。',
      '入力するのは梱包後の外寸と重さです。緩衝材や箱の膨らみも含めて測ってください。実際の集荷や窓口では計測値で区分が決まります。',
      '宅急便コンパクトやゆうパケットプラスは専用の箱を使うことが条件です。ここでは外寸が専用箱に収まるかだけを確認しているため、専用箱の購入や、箱がきちんと閉じられることは別途確認してください。',
      '長さの上限や禁制品、配達できない地域、国際郵便、大型荷物（引越し便など）、佐川急便の飛脚宅配便・飛脚ラージサイズ宅配便以外のサービスやほかの運送会社は対象外です。料金も計算しません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '3辺合計',
        description:
          '荷物の縦・横・高さを足した長さです。梱包後の外寸で測り、宅急便やゆうパックのサイズ区分の基準になります。',
      },
      {
        term: 'サイズ区分（60サイズなど）',
        description:
          '3辺合計の上限を表す呼び方です。宅急便は60〜200、ゆうパックは60〜170サイズがあり、数字が大きいほど大きな荷物です。',
      },
      {
        term: '薄型サービス',
        description:
          'ネコポス・ゆうパケット・レターパックなど、厚さの上限が数センチの小さな荷物向けのサービスです。サイズ区分ではなく、各辺と厚さ、重量の上限で利用可否が決まります。',
      },
      {
        term: '専用BOX・専用箱',
        description:
          '宅急便コンパクトやゆうパケットプラスで、決められた箱を購入して使う方式です。箱の外寸に収まり、封ができることが条件です。',
      },
      {
        term: '定形外郵便',
        description:
          '定形郵便物に当てはまらない大きさの郵便物です。規格内と規格外に分かれ、それぞれ寸法と重量の上限があります。',
      },
    ],
  },
  en: {
    title: 'Parcel Size Checker: Japan Takkyubin and Yu-Pack Sizes',
    description:
      'Enter length, width, height and weight to see which Yamato, Japan Post and Letter Pack service fits. Shows which limit you exceed. Runs in your browser.',
    h1: 'Parcel Size Checker for Yamato and Japan Post (Size Class and Limits)',
    introHtml:
      'Enter the length, width and height (cm) and weight (kg) of your parcel to see its size class for Yamato Takkyubin, Japan Post Yu-Pack and Sagawa Hikyaku Takuhaibin (60 to 200), and whether it fits slim services such as Nekopos, Takkyubin Compact, Yu-Packet, Letter Pack and non-standard-size mail. If it does not fit, the tool shows which limit you exceed: the sum of three sides, longest side, thickness or weight. The tables follow each company\'s published conditions as of 2026 and are a guide only; no prices are calculated. To convert lengths between units, use the <a href="/en/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unit Converter</a>.',
    numberLocale: 'en-US',
    sectionHeading: 'Parcel size and weight',
    lengthLabel: 'Length (cm)',
    widthLabel: 'Width (cm)',
    heightLabel: 'Height / thickness (cm)',
    weightLabel: 'Weight (kg)',
    inputHint:
      'Enter the packed outer dimensions and weight. The order of the sides does not matter; the longest, middle and shortest (thickness) sides are worked out automatically.',
    error:
      'Could not check (enter length, width, height and weight as numbers greater than 0)',
    summaryHeading: 'Your parcel',
    summarySumLabel: 'Sum of three sides',
    summaryLongestLabel: 'Longest side',
    summaryShortestLabel: 'Shortest side (thickness)',
    resultsHeading: 'Result by service',
    groupLabels: {
      yamato: 'Yamato Transport',
      jp: 'Japan Post',
      sagawa: 'Sagawa Express',
    },
    services: [
      {
        id: 'yamato-takkyubin',
        name: 'Takkyubin (standard parcel)',
        note: 'Both the sum of three sides and the weight set the class, and the larger one applies. The maximum is 200 cm total and 30 kg.',
      },
      {
        id: 'yamato-compact',
        name: 'Takkyubin Compact',
        note: 'Must fit the special box (outer size 25 x 20 x 5 cm). You need to buy the box; the slim box has different dimensions.',
      },
      {
        id: 'yamato-nekopos',
        name: 'Nekopos',
        note: 'Up to 31.2 x 22.8 cm, 3.5 cm thick and 1 kg. Availability and drop-off points can change, so check the official site.',
      },
      {
        id: 'yupack',
        name: 'Yu-Pack',
        note: 'The sum of three sides sets the class from 60 to 170, and every class allows up to 25 kg. The maximum is 170 cm total.',
      },
      {
        id: 'yupacket',
        name: 'Yu-Packet',
        note: 'Up to 60 cm total, 34 cm longest side, 3 cm thick and 1 kg.',
      },
      {
        id: 'yupacket-plus',
        name: 'Yu-Packet Plus',
        note: 'Must fit the special box (outer size 24 x 17 x 7.5 cm) and weigh 2 kg or less. You need to buy the box.',
      },
      {
        id: 'letterpack-light',
        name: 'Letter Pack Light',
        note: 'Up to A4 file size (34 x 24.8 cm), 3 cm thick and 4 kg.',
      },
      {
        id: 'letterpack-plus',
        name: 'Letter Pack Plus',
        note: 'Up to A4 file size (34 x 24.8 cm) and 4 kg. There is no numeric thickness limit, but the envelope must close securely.',
      },
      {
        id: 'teikeigai-standard',
        name: 'Non-standard-size mail (within standard)',
        note: 'Up to 34 cm long, 25 cm wide, 3 cm thick and 1 kg.',
      },
      {
        id: 'teikeigai-irregular',
        name: 'Non-standard-size mail (oversize)',
        note: 'Up to 90 cm total, 60 cm longest side and 4 kg.',
      },
      {
        id: 'sagawa-hikyaku',
        name: 'Hikyaku Takuhaibin',
        note: 'The class is set by both the three-side sum and the weight, and the larger class applies (sizes 60, 80, 100, 140 and 160; there is no size 120). The maximum is 160 cm total and 30 kg.',
      },
      {
        id: 'sagawa-large',
        name: 'Hikyaku Large-Size Takuhaibin',
        note: 'For parcels that do not fit Hikyaku Takuhaibin (over 160 cm total or over 30 kg). The limit is 260 cm total and 50 kg. Sending two or more pieces also qualifies, but this tool only checks the limits of a single piece.',
      },
    ],
    statusFit: 'OK: fits',
    statusNoFit: 'No: does not fit',
    tierFormat: 'Size {size}',
    decidedBySum: 'Set by the sum of three sides',
    decidedByWeight:
      'Set by weight (the three-side sum alone would be a smaller class)',
    reasonSum: 'Sum of three sides {actual} cm is over the {limit} cm limit',
    reasonLongest: 'Longest side {actual} cm is over the {limit} cm limit',
    reasonMiddle: 'Middle side {actual} cm is over the {limit} cm limit',
    reasonThickness:
      'Thickness (shortest side) {actual} cm is over the {limit} cm limit',
    reasonWeight: 'Weight {actual} kg is over the {limit} kg limit',
    disclaimer:
      "These results are a guide based on the size and weight conditions published by Yamato Transport, Japan Post and Sagawa Express as of 2026. Services and conditions change, so check each company's official site before you ship. The class actually applied is decided by measurement at the counter or by the driver.",
    notesHeading: 'Notes',
    notes: [
      "This is a guide based on each company's conditions as confirmed in 2026. Size classes, limits and whether a service is offered at all (especially slim services such as Nekopos) can change.",
      'Each limit includes the value itself. For Takkyubin, size 60 allows exactly 60 cm total and exactly 2 kg, while 60.1 cm or 2.01 kg moves up to size 80.',
      'Takkyubin sets the class from both the three-side sum and the weight, and the larger class applies. Yu-Pack sets the class from the three-side sum only, with a 25 kg weight limit.',
      'Enter the outer dimensions and weight after packing, including cushioning and any bulging of the box. The class is decided by the measured values at pickup or at the counter.',
      'Takkyubin Compact and Yu-Packet Plus require the dedicated box. This tool only checks whether the outer size fits the box, so buying the box and closing it properly are up to you.',
      'Prohibited items, undeliverable areas, international mail, oversized freight (such as moving services) and Sagawa services other than Hikyaku Takuhaibin and other carriers are not covered. Prices are not calculated either.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Sum of three sides',
        description:
          'Length plus width plus height of the parcel. Measure the packed outer size; it is the basis of the Takkyubin and Yu-Pack size classes.',
      },
      {
        term: 'Size class (such as size 60)',
        description:
          'A name for the three-side sum limit. Takkyubin runs from 60 to 200 and Yu-Pack from 60 to 170; a bigger number means a bigger parcel.',
      },
      {
        term: 'Slim services',
        description:
          'Services such as Nekopos, Yu-Packet and Letter Pack for small, thin parcels with a thickness limit of a few centimeters. Eligibility depends on each side, thickness and weight rather than a size class.',
      },
      {
        term: 'Special box',
        description:
          'The dedicated box you buy for Takkyubin Compact or Yu-Packet Plus. The parcel must fit its outer size and close securely.',
      },
      {
        term: 'Non-standard-size mail (teikeigai)',
        description:
          'Mail that does not fit the standard-size letter categories. It splits into within-standard and oversize, each with its own size and weight limits.',
      },
    ],
  },
};
