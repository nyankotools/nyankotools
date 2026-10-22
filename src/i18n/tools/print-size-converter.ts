import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface PrintSizeConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  valueLabel: string;
  valuePlaceholder: string;
  unitLabel: string;
  dpiLabel: string;
  dpiHint: string;
  resultHeading: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  errorInvalidValue: string;
  errorInvalidDpi: string;
  paperHeading: string;
  paperHint: string;
  paperColName: string;
  paperColMm: string;
  paperColPx: string;
  paperColPt: string;
  aSeriesCaption: string;
  bSeriesCaption: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const printSizeConverterContent: Record<
  Locale,
  PrintSizeConverterPageContent
> = {
  ja: {
    title: '印刷サイズ換算ツール｜mm・pt・px・DPI変換とA判B判一覧',
    description:
      'DPIを指定してmm・cm・inch・pt・pxを相互に換算する無料ツールです。A0〜A10・B0〜B10の用紙サイズ一覧と、指定DPIでのピクセル数も確認できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '印刷サイズ換算ツール（mm・pt・px・DPI）',
    introHtml:
      '値と単位、DPI（解像度）を入力すると、mm・cm・inch・pt・px に一括換算します。下の用紙サイズ一覧では、A判・B判の寸法を指定したDPIでのピクセル数で確認できます。ディスプレイ側のインチ・解像度は<a href="/tools/screen-size-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画面サイズ計算ツール</a>、CSSの単位は<a href="/tools/css-unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS単位換算ツール</a>が便利です。',
    valueLabel: '値',
    valuePlaceholder: '210',
    unitLabel: '単位',
    dpiLabel: 'DPI（解像度）',
    dpiHint:
      'pxとの換算に使います。印刷用の画像は300dpi、Web表示は72〜96dpiが目安です。mm・cm・inch・ptの間の換算にはDPIは影響しません。',
    resultHeading: '換算結果',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorInvalidValue: '値が数値として無効です',
    errorInvalidDpi: 'DPIは0より大きい数値で指定してください',
    paperHeading: '用紙サイズ一覧',
    paperHint:
      '縦×横ではなく「短辺×長辺」で表示しています。pxは上のDPIで換算した値です。',
    paperColName: '判型',
    paperColMm: 'サイズ（mm）',
    paperColPx: 'サイズ（px）',
    paperColPt: 'サイズ（pt）',
    aSeriesCaption: 'A判（ISO 216）',
    bSeriesCaption: 'B判（JIS P 0138）',
    notesHeading: '注意事項',
    notes: [
      '1inch=25.4mm=72pt の固定比率で換算します。ptはDTPのポイント（1/72インチ）で、CSSのpt（1/72インチ）と同じです。',
      'pxはDPIで決まる論理的な画素数です。画面上の物理サイズはディスプレイの実際の解像度で変わります。',
      'B判はJIS規格（B5=182×257mm）です。ISO規格のB判（B5=176×250mm）とは寸法が異なります。',
      'ピクセル数は四捨五入した整数、他の単位は小数第4位（pxは第2位）で丸めて表示します。印刷用の塗り足し（通常3mm）は含みません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'DPI',
        description:
          '1インチ（25.4mm）あたりのドット数。同じ用紙サイズでもDPIが高いほどピクセル数が増え、細かく印刷できます。',
      },
      {
        term: 'pt（ポイント）',
        description:
          'DTPで使う長さの単位で、1pt=1/72インチ（約0.3528mm）。文字サイズの指定によく使われます。',
      },
      {
        term: 'A判・B判',
        description:
          'A判は面積1㎡のA0を半分に切るごとに番号が増える国際規格。B判は面積1.5㎡のB0が基準で、日本ではJIS規格のB判が一般的です。',
      },
    ],
  },
  en: {
    title: 'Print Size Converter | mm, pt, px, DPI & Paper Sizes',
    description:
      'Convert mm, cm, inches, pt and px using any DPI, with an A0-A10 and B0-B10 paper size chart in pixels. Runs in your browser; nothing is sent to a server.',
    h1: 'Print Size Converter (mm, pt, px, DPI)',
    introHtml:
      'Enter a value, a unit and a DPI (resolution) to convert between mm, cm, inches, pt and px at once. The paper size chart below shows A-series and B-series dimensions in pixels at your chosen DPI. For display sizes, try the <a href="/en/tools/screen-size-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Screen Size Calculator</a>; for CSS units, see the <a href="/en/tools/css-unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS Unit Converter</a>.',
    valueLabel: 'Value',
    valuePlaceholder: '210',
    unitLabel: 'Unit',
    dpiLabel: 'DPI (resolution)',
    dpiHint:
      'Used for px conversion. 300 dpi is typical for print and 72-96 dpi for screens. DPI has no effect on conversions between mm, cm, inches and pt.',
    resultHeading: 'Results',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorInvalidValue: 'The value is not a valid number',
    errorInvalidDpi: 'DPI must be a number greater than 0',
    paperHeading: 'Paper size chart',
    paperHint:
      'Sizes are shown as short side x long side. Pixel sizes use the DPI set above.',
    paperColName: 'Size',
    paperColMm: 'Size (mm)',
    paperColPx: 'Size (px)',
    paperColPt: 'Size (pt)',
    aSeriesCaption: 'A series (ISO 216)',
    bSeriesCaption: 'B series (JIS P 0138)',
    notesHeading: 'Notes',
    notes: [
      'Conversions use the fixed ratios 1 inch = 25.4 mm = 72 pt. The pt here is the DTP point (1/72 inch), the same as the CSS pt.',
      'px is the logical pixel count determined by the DPI. The physical size on screen depends on the real resolution of the display.',
      'The B series is the Japanese JIS standard (B5 = 182 x 257 mm), which differs from the ISO B series (B5 = 176 x 250 mm).',
      'Pixel counts are rounded to whole numbers; other units are rounded to 4 decimals (px to 2). Print bleed (usually 3 mm) is not included.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'DPI',
        description:
          'Dots per inch (25.4 mm). At the same paper size, a higher DPI means more pixels and finer print detail.',
      },
      {
        term: 'pt (point)',
        description:
          'A typographic length unit equal to 1/72 inch (about 0.3528 mm), commonly used for font sizes.',
      },
      {
        term: 'A and B series',
        description:
          'The A series starts from A0 (1 square meter) and halves with each number. The B series starts from B0 (1.5 square meters); Japan commonly uses the JIS B series.',
      },
    ],
  },
};
