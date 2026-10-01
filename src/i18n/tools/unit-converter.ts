import type { Locale } from '../../data/tools';
import type { UnitCategory } from '../../lib/tools/unit-converter';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface UnitConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;

  categoryLabel: string;
  categoryNames: Record<UnitCategory, string>;
  valueLabel: string;
  fromLabel: string;
  toLabel: string;
  swapLabel: string;
  resultLabel: string;
  allUnitsHeading: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  error: string;
  /** 単位ID → 表示名 */
  unitNames: Record<string, string>;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const categoryNamesJa: Record<UnitCategory, string> = {
  length: '長さ',
  mass: '重さ',
  area: '面積',
  volume: '体積',
  temperature: '温度',
  data: 'データ容量',
};

const categoryNamesEn: Record<UnitCategory, string> = {
  length: 'Length',
  mass: 'Weight',
  area: 'Area',
  volume: 'Volume',
  temperature: 'Temperature',
  data: 'Data size',
};

export const unitConverterContent: Record<Locale, UnitConverterPageContent> = {
  ja: {
    title: '単位変換（長さ・重さ・面積・体積・温度・データ容量）',
    description:
      '長さ・重さ・面積・体積・温度・データ容量の単位を相互に変換する無料ツールです。尺・坪・畳・合・貫などの尺貫法、インチ・ポンド、KBとKiBの違いにも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '単位変換（長さ・重さ・面積・体積・温度・データ容量）',
    introHtml:
      '数値と単位を選ぶだけで、長さ・重さ・面積・体積・温度・データ容量を一括で変換します。m・kg・インチ・ポンドといった一般的な単位に加え、尺・寸・間、貫・匁、坪・畳、合・升、大さじ・小さじといった日本の単位や、KB（1000バイト）とKiB（1024バイト）の違いにも対応しています。選んだ単位以外の全単位への換算結果も一覧で確認でき、すべてブラウザ内で計算されるため入力内容が送信されることはありません。px と rem の変換は <a href="/tools/px-rem-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">px・rem変換</a>、2進数・16進数などの変換は <a href="/tools/base-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">進数変換</a> をご利用ください。',
    numberLocale: 'ja-JP',

    categoryLabel: '種類',
    categoryNames: categoryNamesJa,
    valueLabel: '変換する値',
    fromLabel: '変換前の単位',
    toLabel: '変換後の単位',
    swapLabel: '単位を入れ替え',
    resultLabel: '変換結果',
    allUnitsHeading: 'ほかの単位への換算',
    copyButton: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    error: '変換できませんでした（数値を正しく入力してください）',
    unitNames: {
      mm: 'ミリメートル (mm)',
      cm: 'センチメートル (cm)',
      m: 'メートル (m)',
      km: 'キロメートル (km)',
      in: 'インチ (in)',
      ft: 'フィート (ft)',
      yd: 'ヤード (yd)',
      mi: 'マイル (mi)',
      shaku: '尺（しゃく）',
      sun: '寸（すん）',
      ken: '間（けん）',
      mg: 'ミリグラム (mg)',
      g: 'グラム (g)',
      kg: 'キログラム (kg)',
      t: 'トン (t)',
      oz: 'オンス (oz)',
      lb: 'ポンド (lb)',
      monme: '匁（もんめ）',
      kan: '貫（かん）',
      cm2: '平方センチメートル (cm²)',
      m2: '平方メートル (m²)',
      a: 'アール (a)',
      ha: 'ヘクタール (ha)',
      km2: '平方キロメートル (km²)',
      in2: '平方インチ (in²)',
      ft2: '平方フィート (ft²)',
      acre: 'エーカー (ac)',
      tsubo: '坪（つぼ）',
      jo: '畳（1.62m²）',
      ml: 'ミリリットル (mL)',
      l: 'リットル (L)',
      m3: '立方メートル (m³)',
      tspJp: '小さじ（5mL）',
      tbspJp: '大さじ（15mL）',
      cupJp: 'カップ（200mL）',
      go: '合（ごう）',
      sho: '升（しょう）',
      tspUs: 'ティースプーン（米）',
      tbspUs: 'テーブルスプーン（米）',
      flozUs: '液量オンス（米）',
      cupUs: 'カップ（米）',
      galUs: 'ガロン（米）',
      c: '摂氏 (°C)',
      f: '華氏 (°F)',
      k: 'ケルビン (K)',
      bit: 'ビット (bit)',
      B: 'バイト (B)',
      KB: 'キロバイト (KB / 1000B)',
      MB: 'メガバイト (MB / 1000²B)',
      GB: 'ギガバイト (GB / 1000³B)',
      TB: 'テラバイト (TB / 1000⁴B)',
      PB: 'ペタバイト (PB / 1000⁵B)',
      KiB: 'キビバイト (KiB / 1024B)',
      MiB: 'メビバイト (MiB / 1024²B)',
      GiB: 'ギビバイト (GiB / 1024³B)',
      TiB: 'テビバイト (TiB / 1024⁴B)',
    },

    notesHeading: '注意事項',
    notes: [
      '尺貫法の換算は計量法の定義（1尺 = 10/33 m、1貫 = 3.75 kg、1坪 = 400/121 m²、1合 = 180.39 mL）に基づきます。',
      '畳1枚の広さは地域や住宅の種類（江戸間・京間・団地間など）で異なります。ここでは不動産表示規約で用いられる1畳 = 1.62 m² として換算しています。',
      'カップ・スプーンは日本の計量カップ（200mL）・計量スプーン（小さじ5mL・大さじ15mL）と、アメリカの規格を別々に収録しています。国や用途によって容量が異なる点にご注意ください。',
      '結果は有効数字10桁で丸めて表示します。10¹⁵以上・10⁻⁶未満の値は指数表記（例: 1.5×10^20）になります。',
      '温度は絶対零度（-273.15℃）より低い値は変換できません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '尺貫法',
        description:
          '日本で古くから使われてきた単位系で、長さは尺・寸・間、重さは貫・匁、面積は坪、体積は合・升などで表します。現在は取引・証明での使用が制限されていますが、不動産や木材、酒・米の計量では今も使われています。',
      },
      {
        term: 'KBとKiBの違い',
        description:
          'KB（キロバイト）は SI接頭辞に従い1000バイト、KiB（キビバイト）は2進接頭辞で1024バイトです。ストレージの製品表記は1000倍（KB・MB・GB）が一般的ですが、OSによっては1024倍で計算して表示するため、同じ容量でも数値が異なって見えます。',
      },
      {
        term: '華氏（°F）と摂氏（°C）',
        description:
          '摂氏は水の凝固点を0℃、沸点を100℃とする温度目盛りです。華氏は主にアメリカで使われ、水の凝固点が32°F、沸点が212°Fにあたります。換算式は °F = °C × 9/5 + 32 です。',
      },
    ],
  },
  en: {
    title: 'Unit Converter (Length, Weight, Area, Volume, Data, Temp)',
    description:
      'Convert length, weight, area, volume, temperature, and data size, including KB vs KiB and Japanese units. Runs in your browser; nothing is sent to a server.',
    h1: 'Unit Converter: Length, Weight, Area, Volume, Temperature & Data Size',
    introHtml:
      'Pick a category, type a value, and choose your units to convert length, weight, area, volume, temperature, or data size instantly. It covers everyday metric and imperial units (meters, inches, pounds, gallons, °F), the difference between KB (1,000 bytes) and KiB (1,024 bytes), and traditional Japanese units such as shaku, tsubo, and tatami. You also get a table of the value in every other unit of that category. Everything is calculated in your browser, and nothing you type is sent to a server. For CSS pixel and rem conversion, use the <a href="/en/tools/px-rem-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">px / rem Converter</a>; for binary and hex, use the <a href="/en/tools/base-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Number Base Converter</a>.',
    numberLocale: 'en-US',

    categoryLabel: 'Category',
    categoryNames: categoryNamesEn,
    valueLabel: 'Value',
    fromLabel: 'From',
    toLabel: 'To',
    swapLabel: 'Swap units',
    resultLabel: 'Result',
    allUnitsHeading: 'In other units',
    copyButton: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    error: 'Could not convert (enter a valid number)',
    unitNames: {
      mm: 'Millimeter (mm)',
      cm: 'Centimeter (cm)',
      m: 'Meter (m)',
      km: 'Kilometer (km)',
      in: 'Inch (in)',
      ft: 'Foot (ft)',
      yd: 'Yard (yd)',
      mi: 'Mile (mi)',
      shaku: 'Shaku (Japanese foot)',
      sun: 'Sun (1/10 shaku)',
      ken: 'Ken (6 shaku)',
      mg: 'Milligram (mg)',
      g: 'Gram (g)',
      kg: 'Kilogram (kg)',
      t: 'Metric ton (t)',
      oz: 'Ounce (oz)',
      lb: 'Pound (lb)',
      monme: 'Momme (3.75 g)',
      kan: 'Kan (3.75 kg)',
      cm2: 'Square centimeter (cm²)',
      m2: 'Square meter (m²)',
      a: 'Are (a)',
      ha: 'Hectare (ha)',
      km2: 'Square kilometer (km²)',
      in2: 'Square inch (in²)',
      ft2: 'Square foot (ft²)',
      acre: 'Acre (ac)',
      tsubo: 'Tsubo (about 3.31 m²)',
      jo: 'Tatami mat (1.62 m²)',
      ml: 'Milliliter (mL)',
      l: 'Liter (L)',
      m3: 'Cubic meter (m³)',
      tspJp: 'Japanese teaspoon (5 mL)',
      tbspJp: 'Japanese tablespoon (15 mL)',
      cupJp: 'Japanese cup (200 mL)',
      go: 'Gō (about 180 mL)',
      sho: 'Shō (about 1.8 L)',
      tspUs: 'Teaspoon (US)',
      tbspUs: 'Tablespoon (US)',
      flozUs: 'Fluid ounce (US)',
      cupUs: 'Cup (US)',
      galUs: 'Gallon (US)',
      c: 'Celsius (°C)',
      f: 'Fahrenheit (°F)',
      k: 'Kelvin (K)',
      bit: 'Bit (bit)',
      B: 'Byte (B)',
      KB: 'Kilobyte (KB, 1000 B)',
      MB: 'Megabyte (MB, 1000² B)',
      GB: 'Gigabyte (GB, 1000³ B)',
      TB: 'Terabyte (TB, 1000⁴ B)',
      PB: 'Petabyte (PB, 1000⁵ B)',
      KiB: 'Kibibyte (KiB, 1024 B)',
      MiB: 'Mebibyte (MiB, 1024² B)',
      GiB: 'Gibibyte (GiB, 1024³ B)',
      TiB: 'Tebibyte (TiB, 1024⁴ B)',
    },

    notesHeading: 'Notes',
    notes: [
      'Traditional Japanese units follow their legal definitions (1 shaku = 10/33 m, 1 kan = 3.75 kg, 1 tsubo = 400/121 m², 1 gō = 180.39 mL).',
      'The size of a tatami mat varies by region and building type. This tool uses 1 mat = 1.62 m², the figure used in Japanese real estate listings.',
      'Cups and spoons are listed separately for Japan (200 mL cup, 5 mL teaspoon, 15 mL tablespoon) and the US, because their volumes differ by country.',
      'Results are rounded to 10 significant digits. Values of 10¹⁵ or more, or below 10⁻⁶, are shown in exponent form (for example 1.5×10^20).',
      'Temperatures below absolute zero (−273.15 °C) cannot be converted.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Shakkanhō (traditional Japanese units)',
        description:
          'The traditional Japanese system of measurement: shaku, sun, and ken for length, kan and momme for weight, tsubo for area, and gō and shō for volume. Its official use in commerce is restricted today, but it is still common for real estate, lumber, sake, and rice.',
      },
      {
        term: 'KB vs KiB',
        description:
          'KB (kilobyte) follows the SI prefix and means 1,000 bytes, while KiB (kibibyte) uses the binary prefix and means 1,024 bytes. Drives are usually sold in 1,000-based units, but some operating systems report sizes in 1,024-based units, so the same capacity can show different numbers.',
      },
      {
        term: 'Fahrenheit and Celsius',
        description:
          'Celsius sets water’s freezing point at 0 °C and boiling point at 100 °C. Fahrenheit, mainly used in the US, puts them at 32 °F and 212 °F. The conversion is °F = °C × 9/5 + 32.',
      },
    ],
  },
};
