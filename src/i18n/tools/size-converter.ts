import type { Locale } from '../../data/tools';
import type { SizeCategory, SizeColumn } from '../../lib/tools/size-converter';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SizeConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  categoryLabel: string;
  categoryNames: Record<SizeCategory, string>;
  fromLabel: string;
  valueLabel: string;
  resultHeading: string;
  /** 列ID → 表示名 */
  columnNames: Record<SizeColumn, string>;
  /** カテゴリごとの列名の上書き */
  columnNameOverrides: Partial<
    Record<SizeCategory, Partial<Record<SizeColumn, string>>>
  >;
  empty: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const sizeConverterContent: Record<Locale, SizeConverterPageContent> = {
  ja: {
    title: 'サイズ変換（服・靴・指輪：日本・US・EU・UK）',
    description:
      '服・靴・指輪のサイズを日本・US・EU・UKで相互に変換できる無料のサイズ換算表ツールです。海外通販や個人輸入のサイズ選びに。メンズ・レディース対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'サイズ変換（服・靴・指輪：日本・US・EU・UK）',
    introHtml:
      'レディース服・メンズ服・レディース靴・メンズ靴・指輪のサイズを、日本・US・EU・UKの間で換算します。海外通販や個人輸入でサイズ表記が分からないときの目安にご利用ください。長さや重さなどの単位換算は <a href="/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">単位変換</a> をご利用ください。',

    categoryLabel: '種類',
    categoryNames: {
      'womens-clothing': 'レディース服',
      'mens-clothing': 'メンズ服（トップス・スーツ）',
      'womens-shoes': 'レディース靴',
      'mens-shoes': 'メンズ靴',
      ring: '指輪',
    },
    fromLabel: '基準にするサイズ体系',
    valueLabel: 'サイズ',
    resultHeading: '換算結果',
    columnNames: {
      jp: '日本（号）',
      alpha: '日本の表記',
      bust: 'バスト（cm）',
      chest: 'チェスト（cm）',
      cm: '日本（足長 cm）',
      us: 'US',
      uk: 'UK',
      eu: 'EU',
      circumference: '内周（mm）',
      diameter: '内径（mm）',
    },
    columnNameOverrides: {
      'mens-clothing': {
        us: 'US（チェスト inch）',
        uk: 'UK（チェスト inch）',
      },
      ring: { uk: 'UK（アルファベット）', eu: 'EU（内周 mm）' },
    },
    empty: '該当するサイズがありません。',

    notesHeading: '注意事項',
    notes: [
      '表示される値はあくまで一般的な目安です。ブランド・メーカー・生産国によってサイズ感は異なり、同じ表記でも実寸が違うことがあります。購入前に商品ページの実寸表を必ず確認してください。',
      'レディース服は日本のJIS規格（Aタイプ・レギュラー身長）の号数を基準に、US（号数−5）・UK（号数−1）・EU（号数＋27）へ換算しています。',
      'メンズ服はUS・UKのチェスト（胸囲 inch）を基準にしており、EUはその値＋10です。日本のS・M・L表記は目安で、海外のS・M・Lより一回り小さめな傾向があります。',
      '靴は足長（cm）を基準にした換算です。靴の内寸や足幅（ワイズ）は考慮していません。レディースとメンズでUSサイズの付け方が異なるため、同じ足長でもUSの数値は1違います。',
      '指輪は日本のJIS規格（1号＝内径13mm、1号ごとに内径＋約0.32mm）を基準に、US・UK・EUの内周基準サイズへ換算しています。指の太さは時間帯や気温でも変わるため、実際の購入では計測をおすすめします。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '号（日本の服・指輪サイズ）',
        description:
          '日本の服のサイズ表記で、レディース服では5号・7号・9号などの奇数で表します（9号がM相当）。指輪では1号ごとに内径が約0.32mm大きくなる別の号数体系です。',
      },
      {
        term: 'ワイズ（足幅）',
        description:
          '靴の足囲・足幅を示す指標で、日本ではE・EE・3Eなどで表します。このツールは足長のみを基準としており、ワイズは換算できません。',
      },
      {
        term: 'パリ・ポイント',
        description:
          'EU（ヨーロッパ）の靴サイズに使われる単位で、1ポイントは約6.67mm（2/3cm）です。靴の内寸（ラスト長）を基準にするため、足長にゆとりを加えた値で換算します。',
      },
    ],
  },
  en: {
    title: 'Size Converter (Clothing, Shoes & Rings: JP, US, EU, UK)',
    description:
      'Convert clothing, shoe and ring sizes between Japan, US, EU and UK. Women’s and men’s charts for overseas shopping. Runs in your browser; nothing is sent.',
    h1: 'Size Converter (Clothing, Shoes & Rings: JP, US, EU, UK)',
    introHtml:
      'Convert women’s and men’s clothing, women’s and men’s shoes and ring sizes between Japan, the US, the EU and the UK. Use it as a rough guide when you shop abroad or order from Japan. For length, weight and other unit conversions, try the <a href="/en/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unit Converter</a>.',

    categoryLabel: 'Category',
    categoryNames: {
      'womens-clothing': 'Women’s clothing',
      'mens-clothing': 'Men’s clothing (tops & suits)',
      'womens-shoes': 'Women’s shoes',
      'mens-shoes': 'Men’s shoes',
      ring: 'Ring',
    },
    fromLabel: 'Convert from',
    valueLabel: 'Size',
    resultHeading: 'Converted sizes',
    columnNames: {
      jp: 'Japan (gō)',
      alpha: 'Japan (letter)',
      bust: 'Bust (cm)',
      chest: 'Chest (cm)',
      cm: 'Japan (foot length, cm)',
      us: 'US',
      uk: 'UK',
      eu: 'EU',
      circumference: 'Inner circumference (mm)',
      diameter: 'Inner diameter (mm)',
    },
    columnNameOverrides: {
      'mens-clothing': { us: 'US (chest, in)', uk: 'UK (chest, in)' },
      ring: { uk: 'UK (letter)', eu: 'EU (circumference, mm)' },
    },
    empty: 'No matching size.',

    notesHeading: 'Notes',
    notes: [
      'Values are general guides only. Fit varies by brand, maker and country of manufacture, and the same label can mean different measurements. Always check the size chart on the product page before buying.',
      'Women’s clothing is based on the Japanese JIS size number (type A, regular height) and converted as US = number − 5, UK = number − 1, EU = number + 27.',
      'Men’s clothing is based on the US/UK chest size in inches, with EU = chest + 10. Japanese S/M/L labels are approximate and tend to run a size smaller than Western S/M/L.',
      'Shoes are converted from foot length (cm). Inner length and width are not considered. Women’s and men’s US sizes are numbered differently, so the same foot length differs by 1 in US size.',
      'Rings are based on the JIS standard (size 1 = 13 mm inner diameter, about +0.32 mm per size) and converted to US, UK and EU circumference-based sizes. Finger size changes with time of day and temperature, so measuring is recommended.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Gō (Japanese clothing and ring size)',
        description:
          'The Japanese size number. Women’s clothing uses odd numbers such as 5, 7 and 9 (9 is roughly M). Ring sizes use a separate scale where each step adds about 0.32 mm of inner diameter.',
      },
      {
        term: 'Width (foot width)',
        description:
          'A measure of shoe girth and width, written as E, EE, 3E and so on in Japan. This tool converts by foot length only and cannot convert width.',
      },
      {
        term: 'Paris point',
        description:
          'The unit behind EU shoe sizes: one point is about 6.67 mm (2/3 cm). It is based on the inner length of the shoe, so the foot length plus allowance is used for conversion.',
      },
    ],
  },
};
