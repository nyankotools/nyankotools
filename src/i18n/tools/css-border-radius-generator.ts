import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CssBorderRadiusGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  cornersHeading: string;
  linkCornersLabel: string;
  unitLabel: string;
  topLeftLabel: string;
  topRightLabel: string;
  bottomRightLabel: string;
  bottomLeftLabel: string;
  previewHeading: string;
  cssHeading: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cssBorderRadiusGeneratorContent: Record<
  Locale,
  CssBorderRadiusGeneratorPageContent
> = {
  ja: {
    title: 'CSS border-radiusジェネレーター（プレビュー付き）',
    description:
      '4つの角の丸みを調整して、CSSのborder-radiusをプレビューしながら生成できる無料ツールです。px/%切替・連動モード対応で、ワンクリックでコピーできます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSS border-radiusジェネレーター',
    introHtml:
      '左上・右上・右下・左下の4つの角の丸みを調整すると、プレビューと生成されるCSSがリアルタイムに更新されます。「4隅を連動させる」を有効にすると1つの数値で4隅すべてをまとめて操作でき、無効にすると角ごとに個別の値を指定できます。単位はpx（ピクセル）と%（要素サイズに対する割合、正円・楕円のボタンやアイコンに便利）を切り替えられます。生成された<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">border-radius</code>宣言はコピーボタンでそのままクリップボードにコピーできます。影を付けたい場合は <a href="/tools/css-box-shadow-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS box-shadowジェネレーター</a> もあわせてご利用ください。',
    cornersHeading: '角の丸み',
    linkCornersLabel: '4隅を連動させる',
    unitLabel: '単位',
    topLeftLabel: '左上',
    topRightLabel: '右上',
    bottomRightLabel: '右下',
    bottomLeftLabel: '左下',
    previewHeading: 'プレビュー',
    cssHeading: '生成されたCSS',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '単位を切り替えると、既存の入力値は新しい単位の上限（px: 500、%: 50）に合わせてクランプされます。',
      '%指定は要素の幅・高さに対する割合です。4隅すべてを50%にすると、正方形の要素は円に、長方形の要素は楕円になります。',
      'CSSの仕様上、`border-radius`は`左上 右上 右下 左下`の順で指定します。4隅がすべて同じ値の場合は単一の値に短縮されます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'border-radius',
        description:
          '要素の角を丸めるCSSプロパティ。4隅の値を空白区切りで指定すると`左上 右上 右下 左下`の順で適用され、1つの値だけ指定すると4隅すべてに同じ値が適用される。',
      },
      {
        term: 'px（ピクセル）',
        description:
          '画面上の絶対的な長さを表す単位。要素のサイズが変わっても角の丸みの大きさは固定される。',
      },
      {
        term: '%（パーセント）',
        description:
          '要素の幅・高さに対する相対的な割合を表す単位。要素のサイズが変わると角の丸みもそれに応じて拡大・縮小する。',
      },
    ],
  },
  en: {
    title: 'CSS Border-Radius Generator with Live Preview',
    description:
      'Build a CSS border-radius with live preview: adjust each corner or link them, switch px/%, and copy the CSS. Runs in your browser; nothing is sent to a server.',
    h1: 'CSS Border-Radius Generator',
    introHtml:
      'Adjust the top-left, top-right, bottom-right, and bottom-left corner radius — the preview and the generated CSS update instantly. Enable "Link corners" to control all four corners with a single value, or disable it to set each corner independently. Switch the unit between px (pixels) and % (relative to the element size, handy for circular or pill-shaped buttons and icons). The generated <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">border-radius</code> declaration can be copied to the clipboard with one click. Pairs well with the <a href="/en/tools/css-box-shadow-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS Box-Shadow Generator</a> for rounded, shadowed cards.',
    cornersHeading: 'Corner radius',
    linkCornersLabel: 'Link corners',
    unitLabel: 'Unit',
    topLeftLabel: 'Top-left',
    topRightLabel: 'Top-right',
    bottomRightLabel: 'Bottom-right',
    bottomLeftLabel: 'Bottom-left',
    previewHeading: 'Preview',
    cssHeading: 'Generated CSS',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Switching the unit clamps existing values to the new unit’s maximum (px: 500, %: 50).',
      'A % value is relative to the element’s width and height. Setting all four corners to 50% turns a square element into a circle, and a rectangular one into an ellipse.',
      'Per the CSS spec, `border-radius` values are listed in the order top-left, top-right, bottom-right, bottom-left. When all four corners match, the declaration is shortened to a single value.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'border-radius',
        description:
          'The CSS property that rounds an element’s corners. Four space-separated values apply in the order top-left, top-right, bottom-right, bottom-left; a single value applies to all four corners.',
      },
      {
        term: 'px (pixel)',
        description:
          'An absolute length unit on screen. The corner radius stays a fixed size regardless of the element’s dimensions.',
      },
      {
        term: '% (percent)',
        description:
          'A unit relative to the element’s width and height. The corner radius scales up or down as the element’s size changes.',
      },
    ],
  },
};
