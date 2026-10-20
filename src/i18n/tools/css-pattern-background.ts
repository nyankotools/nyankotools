import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CssPatternBackgroundPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  presetLabel: string;
  /** キーはプリセットID */
  presetNames: Record<string, string>;
  kindLabel: string;
  kindStripe: string;
  kindDot: string;
  kindCheck: string;
  modeLabel: string;
  modeCss: string;
  modeSvg: string;
  baseColorLabel: string;
  baseColorHexLabel: string;
  patternColorLabel: string;
  patternColorHexLabel: string;
  sizeLabel: string;
  angleLabel: string;
  ratioLabel: string;
  previewHeading: string;
  cssHeading: string;
  svgHeading: string;
  svgCssHeading: string;
  copyButton: string;
  copySvgButton: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cssPatternBackgroundContent: Record<
  Locale,
  CssPatternBackgroundPageContent
> = {
  ja: {
    title: 'CSSパターン背景ジェネレーター（ストライプ・ドット・チェック）',
    description:
      'ストライプ・水玉（ドット）・チェック柄の背景を、色・サイズ・角度を指定してプレビューしながら生成。グラデーション方式のCSSとSVG（data URI）をコピーできます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSSパターン背景ジェネレーター',
    introHtml:
      '繰り返しの模様（ストライプ、ドット、チェック）を背景に敷くためのCSSとSVGを生成します。画像ファイルを用意せず、<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">repeating-linear-gradient</code>などのグラデーションだけで描くCSSと、そのまま貼り付けられるSVGの両方を出力できます。なめらかな色の変化を作りたいときは <a href="/tools/css-gradient-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSSグラデーションジェネレーター</a>、波形の区切りには <a href="/tools/svg-wave-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">SVG波形ジェネレーター</a> も使えます。',
    howToHeading: '使い方',
    howToSteps: [
      '「パターンの種類」でストライプ・ドット・チェックのいずれかを選びます（プリセットから始めることもできます）。',
      '「背景色」と「パターンの色」、「サイズ」「角度」「太さ・直径」を調整し、プレビューで確かめます。',
      '「出力形式」でCSSかSVGを選びます。',
      '「コピー」ボタンで、表示されたコードを自分のスタイルシートに貼り付けます。',
    ],
    presetLabel: 'プリセット',
    presetNames: {
      diagonal: '斜めストライプ',
      horizontal: '横ストライプ',
      polka: '水玉',
      'dots-fine': '細かいドット',
      checker: 'チェック',
    },
    kindLabel: 'パターンの種類',
    kindStripe: 'ストライプ',
    kindDot: 'ドット',
    kindCheck: 'チェック',
    modeLabel: '出力形式',
    modeCss: 'CSS（グラデーション）',
    modeSvg: 'SVG（data URI）',
    baseColorLabel: '背景色',
    baseColorHexLabel: '背景色（#RRGGBB）',
    patternColorLabel: 'パターンの色',
    patternColorHexLabel: 'パターンの色（#RRGGBB）',
    sizeLabel: 'サイズ',
    angleLabel: '角度',
    ratioLabel: '太さ・直径',
    previewHeading: 'プレビュー',
    cssHeading: 'CSS',
    svgHeading: 'SVG',
    svgCssHeading: 'CSS（data URIとして指定）',
    copyButton: 'コピー',
    copySvgButton: 'SVGをコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      'チェックの「サイズ」は1マスの大きさです。CSSではその2倍の大きさで繰り返します。',
      '「角度」はCSSの linear-gradient と同じ向きです（0度が上向き、時計回り）。ストライプのみに効きます。',
      'SVGは幅・高さを100%にしているため、背景に使うと指定した領域全体に模様が広がります。模様の大きさはpx単位で固定です。',
      '`conic-gradient`を使うチェックは、ごく古いブラウザでは表示されません。その場合はSVG形式を使ってください。',
      '色は#RRGGBB（#RGBも可）のみ受け付け、それ以外は初期色に置き換えます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'repeating-linear-gradient',
        description:
          '指定した色の並びを、決めた幅ごとに繰り返す線形グラデーション。色の境目を同じ位置に置くと、はっきりした縞になる。',
      },
      {
        term: 'conic-gradient',
        description:
          '中心点のまわりを角度で色分けするグラデーション。4分割で色を交互に置くとチェック柄を1枚で描ける。',
      },
      {
        term: 'data URI',
        description:
          '画像などのデータをURLの形で直接書き込む方式。SVGの場合は文字列のまま埋め込めるので、別ファイルを読み込む必要がない。',
      },
    ],
  },
  en: {
    title: 'CSS Pattern Background Generator (Stripes, Dots, Checks)',
    description:
      'Generate repeating CSS and SVG pattern backgrounds: stripes, polka dots and checkerboards. Set colors, size and angle, preview live, and copy the code.',
    h1: 'CSS Pattern Background Generator',
    introHtml:
      'Create repeating backgrounds such as stripes, polka dots, and checks without any image file. Output either pure CSS built from gradients like <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">repeating-linear-gradient</code>, or an SVG you can paste in as a data URI. For smooth color blends, try the <a href="/en/tools/css-gradient-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS Gradient Generator</a>; for wavy section dividers, see the <a href="/en/tools/svg-wave-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">SVG Wave Generator</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Pick stripes, dots, or checks under "Pattern type" (or start from a preset).',
      'Adjust "Background color", "Pattern color", "Size", "Angle", and "Thickness / diameter", and check the preview.',
      'Choose CSS or SVG under "Output format".',
      'Use the "Copy" button to paste the code into your stylesheet.',
    ],
    presetLabel: 'Presets',
    presetNames: {
      diagonal: 'Diagonal stripes',
      horizontal: 'Horizontal stripes',
      polka: 'Polka dots',
      'dots-fine': 'Fine dots',
      checker: 'Checkerboard',
    },
    kindLabel: 'Pattern type',
    kindStripe: 'Stripes',
    kindDot: 'Dots',
    kindCheck: 'Checks',
    modeLabel: 'Output format',
    modeCss: 'CSS (gradients)',
    modeSvg: 'SVG (data URI)',
    baseColorLabel: 'Background color',
    baseColorHexLabel: 'Background color (#RRGGBB)',
    patternColorLabel: 'Pattern color',
    patternColorHexLabel: 'Pattern color (#RRGGBB)',
    sizeLabel: 'Size',
    angleLabel: 'Angle',
    ratioLabel: 'Thickness / diameter',
    previewHeading: 'Preview',
    cssHeading: 'CSS',
    svgHeading: 'SVG',
    svgCssHeading: 'CSS (as a data URI)',
    copyButton: 'Copy',
    copySvgButton: 'Copy SVG',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'For checks, "Size" is the width of one square. The CSS repeats at twice that size.',
      '"Angle" follows the CSS linear-gradient convention (0 degrees points up, clockwise). It only affects stripes.',
      'The SVG is set to 100% width and height, so as a background it fills the whole area. The pattern itself has a fixed pixel size.',
      'Checks use `conic-gradient`, which very old browsers do not render. Use the SVG output there.',
      'Only #RRGGBB colors (and #RGB) are accepted; anything else is replaced with the default.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'repeating-linear-gradient',
        description:
          'A linear gradient that repeats its color stops at a fixed length. Putting two stops at the same position gives a hard edge, which makes crisp stripes.',
      },
      {
        term: 'conic-gradient',
        description:
          'A gradient that changes color by angle around a center point. Alternating colors across four quadrants draws a checkerboard in one layer.',
      },
      {
        term: 'data URI',
        description:
          'A way to write data such as an image directly into a URL. SVG can be embedded as plain text, so no separate file needs to be loaded.',
      },
    ],
  },
};
