import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CssFilterGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  presetsHeading: string;
  presetLabels: Record<string, string>;
  previewHeading: string;
  previewSampleLabel: string;
  previewText: string;
  filtersHeading: string;
  filterLabels: Record<string, string>;
  resetButton: string;
  dropShadowHeading: string;
  dropShadowEnableLabel: string;
  offsetXLabel: string;
  offsetYLabel: string;
  blurLabel: string;
  colorLabel: string;
  cssHeading: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cssFilterGeneratorContent: Record<
  Locale,
  CssFilterGeneratorPageContent
> = {
  ja: {
    title: 'CSS filterジェネレーター（blur・grayscale・drop-shadow対応）',
    description:
      'blur・brightness・contrast・grayscale・hue-rotate・drop-shadowなどのCSS filterをスライダーで調整し、プレビューしながらコードを生成できる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSS filterジェネレーター',
    introHtml:
      'ぼかし・明るさ・コントラスト・グレースケール・色相回転・セピアなどのスライダーを動かすと、サンプル図形へのプレビューと生成される<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">filter</code>宣言がリアルタイムに更新されます。「ヴィンテージ」「モノクロ」などのプリセットから始めることもできます。要素の影には <a href="/tools/css-box-shadow-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS box-shadowジェネレーター</a> もご利用ください。',
    presetsHeading: 'プリセット',
    presetLabels: {
      vintage: 'ヴィンテージ',
      noir: 'モノクロ',
      dreamy: 'ドリーミー',
      vivid: 'ビビッド',
      invert: '反転',
      shadow: '影付き',
    },
    previewHeading: 'プレビュー',
    previewSampleLabel: 'フィルターを適用したサンプル図形',
    previewText: 'Nyanko',
    filtersHeading: 'フィルター',
    filterLabels: {
      blur: 'blur（ぼかし・px）',
      brightness: 'brightness（明るさ・%）',
      contrast: 'contrast（コントラスト・%）',
      grayscale: 'grayscale（グレースケール・%）',
      hueRotate: 'hue-rotate（色相回転・度）',
      invert: 'invert（反転・%）',
      opacity: 'opacity（不透明度・%）',
      saturate: 'saturate（彩度・%）',
      sepia: 'sepia（セピア・%）',
    },
    resetButton: 'すべて初期値に戻す',
    dropShadowHeading: 'drop-shadow',
    dropShadowEnableLabel: 'drop-shadowを使う',
    offsetXLabel: 'X方向オフセット（px）',
    offsetYLabel: 'Y方向オフセット（px）',
    blurLabel: 'ぼかし半径（px）',
    colorLabel: '影の色',
    cssHeading: '生成されたCSS',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '効果のない値（brightness 100% など）は出力から省略され、すべて初期値のときは `filter: none;` になります。',
      'filterは左から順に適用されるため、順序によって見た目が変わることがあります。このツールは表示順の固定です。',
      'プレビューはCSSだけで描いたサンプル図形です。実際の画像や要素では見え方が異なる場合があります。',
      'blur値が大きい要素や多数の要素に適用すると、描画が重くなることがあります。',
      '色の入力は6桁の16進数のみです（アルファ非対応）。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'filter',
        description:
          '要素にぼかしや色調補正などの視覚効果を加えるCSSプロパティ。`filter: blur(4px) grayscale(50%);`のように複数の関数をスペース区切りで指定する。',
      },
      {
        term: 'drop-shadow',
        description:
          '要素の透明部分を考慮して、見た目の輪郭に沿った影を付けるfilter関数。box-shadowと違い、透過PNGや図形の形に沿う。',
      },
      {
        term: 'hue-rotate',
        description:
          '色相環上で色を指定した角度だけ回転させるfilter関数。0〜360度で指定する。',
      },
    ],
  },
  en: {
    title: 'CSS Filter Generator (Blur, Grayscale, Drop-Shadow)',
    description:
      'Build CSS filter code with live preview: blur, brightness, contrast, grayscale, hue-rotate, sepia, drop-shadow and more, with presets. Runs in your browser.',
    h1: 'CSS Filter Generator',
    introHtml:
      'Move the sliders for blur, brightness, contrast, grayscale, hue rotation, sepia and more, and watch the sample shapes and the generated <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">filter</code> declaration update instantly. Start from a preset such as vintage or noir, then copy the CSS. For shadows on boxes, try the <a href="/en/tools/css-box-shadow-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS Box-Shadow Generator</a>.',
    presetsHeading: 'Presets',
    presetLabels: {
      vintage: 'Vintage',
      noir: 'Noir',
      dreamy: 'Dreamy',
      vivid: 'Vivid',
      invert: 'Invert',
      shadow: 'Drop shadow',
    },
    previewHeading: 'Preview',
    previewSampleLabel: 'Sample shapes with the filter applied',
    previewText: 'Nyanko',
    filtersHeading: 'Filters',
    filterLabels: {
      blur: 'blur (px)',
      brightness: 'brightness (%)',
      contrast: 'contrast (%)',
      grayscale: 'grayscale (%)',
      hueRotate: 'hue-rotate (deg)',
      invert: 'invert (%)',
      opacity: 'opacity (%)',
      saturate: 'saturate (%)',
      sepia: 'sepia (%)',
    },
    resetButton: 'Reset all',
    dropShadowHeading: 'drop-shadow',
    dropShadowEnableLabel: 'Use drop-shadow',
    offsetXLabel: 'X offset (px)',
    offsetYLabel: 'Y offset (px)',
    blurLabel: 'Blur radius (px)',
    colorLabel: 'Shadow color',
    cssHeading: 'Generated CSS',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Functions at their neutral value (such as brightness 100%) are left out, and when everything is neutral the output is `filter: none;`.',
      'Filters are applied left to right, so order can change the look. This tool uses a fixed order.',
      'The preview uses sample shapes drawn with CSS only. Real images and elements may look different.',
      'Large blur values or many filtered elements can slow down rendering.',
      'The color picker accepts 6-digit hex only (no alpha).',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'filter',
        description:
          'The CSS property that applies visual effects such as blur or color adjustments. Chain functions with spaces, e.g. `filter: blur(4px) grayscale(50%);`.',
      },
      {
        term: 'drop-shadow',
        description:
          'A filter function that casts a shadow following the visible outline, respecting transparent areas. Unlike box-shadow, it follows the shape of a transparent PNG or a shape.',
      },
      {
        term: 'hue-rotate',
        description:
          'A filter function that rotates colors around the hue wheel by the given angle, from 0 to 360 degrees.',
      },
    ],
  },
};
