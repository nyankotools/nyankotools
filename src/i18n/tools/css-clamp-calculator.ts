import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CssClampCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  minSizeLabel: string;
  maxSizeLabel: string;
  minViewportLabel: string;
  maxViewportLabel: string;
  baseFontSizeLabel: string;
  unitLabel: string;
  unitRem: string;
  unitPx: string;
  resultLabel: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  previewLabel: string;
  previewTemplate: string;
  errorInvalidNumber: string;
  errorInvalidSize: string;
  errorInvalidViewport: string;
  errorInvalidRange: string;
  errorInvalidBase: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cssClampCalculatorContent: Record<
  Locale,
  CssClampCalculatorPageContent
> = {
  ja: {
    title: 'CSS clamp()計算機｜流動タイポグラフィのfont-sizeを自動計算',
    description:
      '最小・最大フォントサイズと、その適用範囲の画面幅からCSSのclamp()式（fluid typography）を算出する無料ツールです。rem/px出力に対応し、指定幅での実サイズも確認できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSS clamp()計算機（流動タイポグラフィ）',
    introHtml:
      '画面幅に応じてなめらかに拡大・縮小するfont-sizeを、clamp(最小, 推奨値, 最大)の形で生成します。最小・最大サイズと、それぞれに対応する画面幅を入力してください。remへの換算には<a href="/tools/px-rem-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">px⇔rem変換ツール</a>、画面幅の確認には<a href="/tools/viewport-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ビューポートチェッカー</a>もご利用ください。',
    minSizeLabel: '最小サイズ（px）',
    maxSizeLabel: '最大サイズ（px）',
    minViewportLabel: '最小サイズになる画面幅（px）',
    maxViewportLabel: '最大サイズになる画面幅（px）',
    baseFontSizeLabel: 'ベースフォントサイズ（px、rem換算用）',
    unitLabel: '出力単位',
    unitRem: 'rem',
    unitPx: 'px',
    resultLabel: 'CSS',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    previewLabel: '確認する画面幅（px）',
    previewTemplate: '{width}px のとき：{size}px（{rem}rem）',
    errorInvalidNumber: '数値として無効な入力があります',
    errorInvalidSize: 'サイズは0以上の数値で指定してください',
    errorInvalidViewport: '画面幅は0以上の数値で指定してください',
    errorInvalidRange: '最小の画面幅は最大の画面幅より小さい値にしてください',
    errorInvalidBase: 'ベースフォントサイズは0より大きい数値で指定してください',
    howToHeading: '使い方',
    howToSteps: [
      '最小サイズ・最大サイズ（px）を入力します。',
      'それぞれのサイズに対応する画面幅（px）を入力します。',
      '出力単位（rem / px）を選び、表示されたclamp()式をコピーしてCSSに貼り付けます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '推奨値はvw単位と切片の組み合わせ（例: 0.8333rem + 0.8333vw）で、画面幅が最小〜最大の間で最小サイズから最大サイズへ線形に変化します。範囲外ではclamp()の最小値・最大値で止まります。',
      'rem出力ではベースフォントサイズ（html要素のfont-size、通常16px）で換算します。ユーザーがブラウザの文字サイズを変更した場合も追従するため、アクセシビリティの面ではrem出力がおすすめです。',
      'vwのみで文字サイズを決めるとブラウザのズームに追従しない場合があるため、推奨値にはrem（またはpx）の切片を含めています。',
      '最小サイズが最大サイズより大きい場合（画面が広いほど小さくなる設定）も、clamp()の引数を自動で入れ替えて出力します。',
      '計算結果は小数第4位で丸めています。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'clamp()',
        description:
          'CSSの比較関数で、clamp(最小値, 推奨値, 最大値)の形で値を範囲内に収めます。推奨値が最小値を下回れば最小値、最大値を上回れば最大値が使われます。',
      },
      {
        term: '流動タイポグラフィ（fluid typography）',
        description:
          '画面幅に応じて文字サイズを連続的に変化させる手法。メディアクエリで段階的に切り替える方法と違い、途中の画面幅でも自然なサイズになります。',
      },
      {
        term: 'vw',
        description:
          'ビューポート（表示領域）の幅の1%を表すCSSの単位。100vwが画面幅いっぱいです。',
      },
    ],
  },
  en: {
    title: 'CSS clamp() Calculator | Fluid Typography Generator',
    description:
      'Generate a CSS clamp() expression for fluid font sizes from min/max sizes and viewport widths, in rem or px. Runs in your browser.',
    h1: 'CSS clamp() Calculator for Fluid Typography',
    introHtml:
      'Build a font-size that scales smoothly with the viewport, written as clamp(min, preferred, max). Enter the minimum and maximum sizes and the viewport widths where each applies. You may also like the <a href="/en/tools/px-rem-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">px to rem Converter</a> and the <a href="/en/tools/viewport-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Viewport Checker</a>.',
    minSizeLabel: 'Min size (px)',
    maxSizeLabel: 'Max size (px)',
    minViewportLabel: 'Viewport width at min size (px)',
    maxViewportLabel: 'Viewport width at max size (px)',
    baseFontSizeLabel: 'Base font size (px, for rem conversion)',
    unitLabel: 'Output unit',
    unitRem: 'rem',
    unitPx: 'px',
    resultLabel: 'CSS',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    previewLabel: 'Viewport width to check (px)',
    previewTemplate: 'At {width}px: {size}px ({rem}rem)',
    errorInvalidNumber: 'One of the inputs is not a valid number',
    errorInvalidSize: 'Sizes must be numbers of 0 or more',
    errorInvalidViewport: 'Viewport widths must be numbers of 0 or more',
    errorInvalidRange:
      'The min viewport width must be smaller than the max viewport width',
    errorInvalidBase: 'The base font size must be a number greater than 0',
    howToHeading: 'How to use',
    howToSteps: [
      'Enter the minimum and maximum sizes in px.',
      'Enter the viewport width (px) that each size applies to.',
      'Choose the output unit (rem or px), then copy the clamp() expression into your CSS.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The preferred value combines an intercept with a vw term (e.g. 0.8333rem + 0.8333vw), so the size changes linearly between the two viewport widths and stops at the min/max outside that range.',
      "rem output is converted using the base font size (the html font-size, usually 16px). It respects the user's browser text-size setting, so rem is the better choice for accessibility.",
      'Sizing text with vw alone can ignore browser zoom, so the preferred value always includes a rem (or px) intercept.',
      'If the min size is larger than the max size (text shrinks on wider screens), the first and last clamp() arguments are swapped automatically.',
      'Results are rounded to 4 decimal places.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'clamp()',
        description:
          'A CSS math function, clamp(min, preferred, max), that keeps a value within a range. If the preferred value is below the min, the min is used; if above the max, the max is used.',
      },
      {
        term: 'Fluid typography',
        description:
          'Font sizes that change continuously with the viewport width. Unlike stepping sizes with media queries, intermediate widths get a naturally interpolated size.',
      },
      {
        term: 'vw',
        description:
          'A CSS unit equal to 1% of the viewport width. 100vw is the full width of the viewport.',
      },
    ],
  },
};
