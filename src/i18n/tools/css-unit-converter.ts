import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CssUnitConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  valueLabel: string;
  valuePlaceholder: string;
  unitLabel: string;
  contextHeading: string;
  rootFontSizeLabel: string;
  parentFontSizeLabel: string;
  viewportWidthLabel: string;
  viewportHeightLabel: string;
  contextHint: string;
  resultHeading: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  errorInvalidValue: string;
  errorInvalidContext: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cssUnitConverterContent: Record<
  Locale,
  CssUnitConverterPageContent
> = {
  ja: {
    title: 'CSS単位換算ツール｜px・rem・em・vw・vh・pt変換',
    description:
      'px・rem・em・%・vw・vh・vmin・vmax・ch・pt・cm・mm・inをまとめて換算する無料ツールです。画面幅・画面高・ルート／親フォントサイズを指定して相互変換できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSS単位換算ツール',
    introHtml:
      '値と単位を入力すると、px・rem・em・vw・vh・pt などCSSの主要な単位に一括換算します。vw・vh は画面サイズ、rem・em はフォントサイズを基準にするため、基準値を指定して計算できます。remだけを換算したい場合は<a href="/tools/px-rem-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">px⇔rem変換ツール</a>、可変フォントサイズの式は<a href="/tools/css-clamp-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS clamp()計算ツール</a>も便利です。',
    valueLabel: '値',
    valuePlaceholder: '16',
    unitLabel: '単位',
    contextHeading: '基準値',
    rootFontSizeLabel: 'ルートフォントサイズ（px）',
    parentFontSizeLabel: '親フォントサイズ（px）',
    viewportWidthLabel: '画面幅（px）',
    viewportHeightLabel: '画面高さ（px）',
    contextHint:
      'remはルート、em・%・chは親のフォントサイズ、vw・vmin・vmaxは画面幅と画面高さを基準に計算します。',
    resultHeading: '換算結果',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorInvalidValue: '値が数値として無効です',
    errorInvalidContext: '基準値は0より大きい数値で指定してください',
    notesHeading: '注意事項',
    notes: [
      'chは「0」の文字幅で、フォントによって異なります。このツールでは親フォントサイズの0.5倍で近似しています。',
      'pt・pc・cm・mm・inはCSS仕様に基づく固定比率（1in=96px=72pt=2.54cm）で換算します。実際の印刷サイズや画面上の物理サイズとは一致しない場合があります。',
      'vw・vhはスクロールバーを含む画面サイズが基準です。モバイルブラウザのアドレスバーが動的に変わる環境ではsvh・dvhなど別の単位が必要になることがあります（このツールの対象外）。',
      '計算結果は小数第5位で丸めて表示します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'vw・vh・vmin・vmax',
        description:
          'ビューポート（表示領域）の幅・高さの1%を1とする単位。vminは幅と高さの小さい方、vmaxは大きい方の1%です。',
      },
      {
        term: 'rem と em',
        description:
          'remはルート（html要素）のfont-sizeが基準、emはその要素の親のfont-sizeが基準です（font-size以外のプロパティでは要素自身のfont-size）。',
      },
      {
        term: 'ch',
        description:
          '使用中のフォントにおける「0」の幅を1とする単位。等幅フォントでは文字数に近い幅を指定できます。',
      },
    ],
  },
  en: {
    title: 'CSS Unit Converter | px, rem, em, vw, vh, pt',
    description:
      'Convert CSS units between px, rem, em, vw, vh, vmin, ch, pt and more using your viewport and font sizes. Runs in your browser; nothing is sent to a server.',
    h1: 'CSS Unit Converter',
    introHtml:
      'Enter a value and a unit to see it converted to px, rem, em, vw, vh, pt and the other common CSS units at once. vw and vh depend on the viewport and rem and em depend on font sizes, so set those reference values to match your layout. For rem alone, try the <a href="/en/tools/px-rem-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">px to rem Converter</a>; for fluid type scales, see the <a href="/en/tools/css-clamp-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS clamp() Calculator</a>.',
    valueLabel: 'Value',
    valuePlaceholder: '16',
    unitLabel: 'Unit',
    contextHeading: 'Reference values',
    rootFontSizeLabel: 'Root font size (px)',
    parentFontSizeLabel: 'Parent font size (px)',
    viewportWidthLabel: 'Viewport width (px)',
    viewportHeightLabel: 'Viewport height (px)',
    contextHint:
      'rem uses the root font size; em, % and ch use the parent font size; vw, vh, vmin and vmax use the viewport size.',
    resultHeading: 'Results',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorInvalidValue: 'The value is not a valid number',
    errorInvalidContext: 'Reference values must be numbers greater than 0',
    notesHeading: 'Notes',
    notes: [
      'ch is the width of the "0" glyph and varies by font. This tool approximates it as 0.5 times the parent font size.',
      'pt, pc, cm, mm and in use the fixed CSS ratios (1in = 96px = 72pt = 2.54cm). They may not match real printed or physical on-screen sizes.',
      'vw and vh are based on the viewport including the scrollbar. On mobile browsers with a dynamic address bar you may need svh or dvh instead, which this tool does not cover.',
      'Results are rounded to 5 decimal places.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'vw, vh, vmin, vmax',
        description:
          'Units equal to 1% of the viewport width or height. vmin is 1% of the smaller dimension and vmax is 1% of the larger one.',
      },
      {
        term: 'rem vs em',
        description:
          "rem is relative to the root (html) font-size, while em is relative to the parent's font-size (or the element's own font-size for properties other than font-size).",
      },
      {
        term: 'ch',
        description:
          'A unit equal to the width of the "0" glyph in the current font. With monospace fonts it roughly maps to a number of characters.',
      },
    ],
  },
};
