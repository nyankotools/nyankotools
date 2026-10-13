import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CssGlassmorphismGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  modeLabel: string;
  modeGlass: string;
  modeNeu: string;
  presetLabel: string;
  presetLight: string;
  presetDark: string;
  presetTinted: string;
  presetFrosted: string;
  backgroundLabel: string;
  backgroundSunset: string;
  backgroundOcean: string;
  backgroundAurora: string;
  backgroundCandy: string;
  backgroundNight: string;
  colorLabel: string;
  opacityLabel: string;
  blurLabel: string;
  saturateLabel: string;
  borderOpacityLabel: string;
  shadowOpacityLabel: string;
  radiusLabel: string;
  shapeLabel: string;
  shapeFlat: string;
  shapePressed: string;
  shapeConcave: string;
  shapeConvex: string;
  lightLabel: string;
  lightTopLeft: string;
  lightTopRight: string;
  lightBottomLeft: string;
  lightBottomRight: string;
  distanceLabel: string;
  neuBlurLabel: string;
  intensityLabel: string;
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

export const cssGlassmorphismGeneratorContent: Record<
  Locale,
  CssGlassmorphismGeneratorPageContent
> = {
  ja: {
    title:
      'CSSグラスモーフィズム・ニューモーフィズムジェネレーター（プレビュー付き）',
    description:
      'すりガラス風のグラスモーフィズム（backdrop-filter）と、凹凸のあるニューモーフィズム（多層box-shadow）のCSSを、プレビューしながら生成する無料ツールです。質感プリセット付き。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSSグラスモーフィズム・ニューモーフィズムジェネレーター',
    introHtml:
      'すりガラスのような半透明カード（グラスモーフィズム）と、背景から浮き出る・へこむ質感のUI（ニューモーフィズム）のCSSを、スライダーで調整しながら生成できます。グラスは<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">backdrop-filter</code>によるぼかしと彩度、ニューモーフィズムは明暗2つの<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">box-shadow</code>で表現します。背景はCSSグラデーションを切り替えて見え方を確認できます。単純な影を細かく作りたいときは <a href="/tools/css-box-shadow-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS box-shadowジェネレーター</a> が便利です。',
    howToHeading: '使い方',
    howToSteps: [
      '「グラスモーフィズム」または「ニューモーフィズム」のモードを選びます。',
      '質感プリセットやスライダーで、ぼかし・透明度・影の強さなどを調整します。',
      'グラスは背景グラデーションを切り替えて見え方を確認します。',
      '生成されたCSSをコピーして、自分のスタイルシートに貼り付けます。',
    ],
    modeLabel: 'モード',
    modeGlass: 'グラスモーフィズム',
    modeNeu: 'ニューモーフィズム',
    presetLabel: '質感プリセット',
    presetLight: '明るいガラス',
    presetDark: '暗いガラス',
    presetTinted: '色付きガラス',
    presetFrosted: '曇りガラス',
    backgroundLabel: 'プレビュー背景',
    backgroundSunset: '夕焼け',
    backgroundOcean: '海',
    backgroundAurora: 'オーロラ',
    backgroundCandy: 'パステル',
    backgroundNight: '夜景',
    colorLabel: '基準色',
    opacityLabel: '背景の不透明度',
    blurLabel: 'ぼかし（blur）',
    saturateLabel: '彩度（saturate）',
    borderOpacityLabel: '枠線の不透明度',
    shadowOpacityLabel: '影の濃さ',
    radiusLabel: '角丸',
    shapeLabel: '形状',
    shapeFlat: '平ら',
    shapePressed: '凹み（押し込み）',
    shapeConcave: '凹面',
    shapeConvex: '凸面',
    lightLabel: '光の向き',
    lightTopLeft: '左上',
    lightTopRight: '右上',
    lightBottomLeft: '左下',
    lightBottomRight: '右下',
    distanceLabel: '影の距離',
    neuBlurLabel: '影のぼかし',
    intensityLabel: '明暗の強さ',
    previewHeading: 'プレビュー',
    cssHeading: '生成されたCSS',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '`backdrop-filter`は、要素の背後に何かが描画されていないと効果が見えません。背景が単色の場合はぼかしの違いがほとんど分かりません。',
      '生成CSSには古いSafari向けの`-webkit-backdrop-filter`も含めています。非対応ブラウザでは半透明の背景だけが適用されます。',
      'ニューモーフィズムは、親要素の背景色と要素の基準色を同じにしないと影が不自然になります。白に近い色や黒に近い色では明暗の差が出にくくなります。',
      'ニューモーフィズムはコントラストが低くなりやすいため、文字やボタンの視認性（アクセシビリティ）に注意してください。',
      'プレビュー背景は外部画像を使わず、CSSグラデーションのみを使用しています。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'グラスモーフィズム',
        description:
          '半透明の背景と背景のぼかしで、すりガラスのように見せるUIデザインの手法。`backdrop-filter`と薄い白い枠線で表現する。',
      },
      {
        term: 'ニューモーフィズム',
        description:
          '背景と同じ色の要素に、明るい影と暗い影を組み合わせて、浮き出ているように、またはへこんでいるように見せる手法。',
      },
      {
        term: 'backdrop-filter',
        description:
          '要素の背後にある内容に対してぼかしや彩度変更などのフィルターを適用するCSSプロパティ。要素自身には影響しない。',
      },
      {
        term: 'inset（内側影）',
        description:
          '`box-shadow`に`inset`を付けると影が内側に描かれ、へこんだ見た目になる。ニューモーフィズムの「凹み」で使う。',
      },
    ],
  },
  en: {
    title: 'CSS Glassmorphism & Neumorphism Generator',
    description:
      'Generate CSS for frosted-glass cards (backdrop-filter) and soft neumorphic UI (layered box-shadow) with a live preview and presets. Runs in your browser.',
    h1: 'CSS Glassmorphism & Neumorphism Generator',
    introHtml:
      'Create a frosted-glass card (glassmorphism) or a soft raised/pressed UI element (neumorphism) and tune it with sliders while you watch the preview. Glass uses <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">backdrop-filter</code> blur and saturation; neumorphism uses a light and a dark <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">box-shadow</code>. Switch between gradient backgrounds to see how the glass reads over different colors. For hand-tuned plain shadows, try the <a href="/en/tools/css-box-shadow-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS Box-Shadow Generator</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose Glassmorphism or Neumorphism mode.',
      'Pick a material preset, then adjust blur, opacity, and shadow strength with the sliders.',
      'For glass, switch the preview background to check how it looks over different colors.',
      'Copy the generated CSS and paste it into your stylesheet.',
    ],
    modeLabel: 'Mode',
    modeGlass: 'Glassmorphism',
    modeNeu: 'Neumorphism',
    presetLabel: 'Material preset',
    presetLight: 'Light glass',
    presetDark: 'Dark glass',
    presetTinted: 'Tinted glass',
    presetFrosted: 'Frosted',
    backgroundLabel: 'Preview background',
    backgroundSunset: 'Sunset',
    backgroundOcean: 'Ocean',
    backgroundAurora: 'Aurora',
    backgroundCandy: 'Pastel',
    backgroundNight: 'Night',
    colorLabel: 'Base color',
    opacityLabel: 'Background opacity',
    blurLabel: 'Blur',
    saturateLabel: 'Saturation',
    borderOpacityLabel: 'Border opacity',
    shadowOpacityLabel: 'Shadow strength',
    radiusLabel: 'Corner radius',
    shapeLabel: 'Shape',
    shapeFlat: 'Flat',
    shapePressed: 'Pressed',
    shapeConcave: 'Concave',
    shapeConvex: 'Convex',
    lightLabel: 'Light source',
    lightTopLeft: 'Top left',
    lightTopRight: 'Top right',
    lightBottomLeft: 'Bottom left',
    lightBottomRight: 'Bottom right',
    distanceLabel: 'Shadow distance',
    neuBlurLabel: 'Shadow blur',
    intensityLabel: 'Light/dark contrast',
    previewHeading: 'Preview',
    cssHeading: 'Generated CSS',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      '`backdrop-filter` only has a visible effect when something is painted behind the element. Over a flat solid color you will barely see the blur.',
      'The output includes `-webkit-backdrop-filter` for older Safari. In browsers without support, only the translucent background applies.',
      'For neumorphism, the parent background must use the same base color as the element or the shadows look off. Near-white and near-black colors leave little room for light/dark shades.',
      'Neumorphic UI tends to have low contrast, so check that text and buttons remain readable and accessible.',
      'The preview backgrounds are CSS gradients only; no external images are loaded.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Glassmorphism',
        description:
          'A UI style that mimics frosted glass using a translucent background and a blurred backdrop, usually with a thin light border.',
      },
      {
        term: 'Neumorphism',
        description:
          'A UI style where an element shares its background color and uses a light and a dark shadow to look extruded from, or pressed into, the surface.',
      },
      {
        term: 'backdrop-filter',
        description:
          'A CSS property that applies filters such as blur or saturate to whatever is rendered behind an element, without affecting the element itself.',
      },
      {
        term: 'inset shadow',
        description:
          'Adding `inset` to `box-shadow` draws the shadow inside the element, giving a pressed-in look. Used for the "Pressed" neumorphic shape.',
      },
    ],
  },
};
