import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface RadialShapeOption {
  value: 'circle' | 'ellipse';
  label: string;
}

export interface CssGradientGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  typeLabel: string;
  typeLinear: string;
  typeRadial: string;
  angleLabel: string;
  angleValueTemplate: string;
  shapeLabel: string;
  shapeOptions: RadialShapeOption[];
  stopsHeading: string;
  colorLabel: string;
  positionLabel: string;
  removeStopButton: string;
  addStopButton: string;
  maxStopsHint: string;
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

export const cssGradientGeneratorContent: Record<
  Locale,
  CssGradientGeneratorPageContent
> = {
  ja: {
    title: 'CSSグラデーションジェネレーター（プレビュー付き・線形/円形）',
    description:
      '色とポジションを指定して、線形・円形のCSSグラデーションをプレビューしながら生成できる無料ツールです。カラーストップの追加・削除に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSSグラデーションジェネレーター',
    introHtml:
      'グラデーションの種類（線形/円形）を選び、角度や形状、カラーストップ（色と位置%）を調整すると、プレビューと生成されるCSSがリアルタイムに更新されます。カラーストップは2〜6個まで追加・削除でき、「カラーストップを追加」ボタンを押すと既存のカラーストップの間で最も広い隙間の中央に新しいカラーストップが挿入されます。生成された<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">background</code>宣言はコピーボタンでそのままクリップボードにコピーできます。カラーコードの形式変換には <a href="/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カラーコード変換</a> もあわせてご利用ください。',
    typeLabel: 'グラデーションの種類',
    typeLinear: '線形（linear-gradient）',
    typeRadial: '円形（radial-gradient）',
    angleLabel: '角度',
    angleValueTemplate: '{value}°',
    shapeLabel: '形状',
    shapeOptions: [
      { value: 'circle', label: '円（circle）' },
      { value: 'ellipse', label: '楕円（ellipse）' },
    ],
    stopsHeading: 'カラーストップ',
    colorLabel: '色',
    positionLabel: '位置（%）',
    removeStopButton: '削除',
    addStopButton: 'カラーストップを追加',
    maxStopsHint: 'カラーストップは2〜6個まで設定できます。',
    previewHeading: 'プレビュー',
    cssHeading: '生成されたCSS',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      'カラーストップの位置（%）が重複・逆転していても、CSSのグラデーションとして解釈可能な順序（位置の昇順）に自動的に並べ替えてから出力します。',
      '線形グラデーションの角度は、CSSの角度指定に準拠しています（0°は下から上、90°は左から右、180°は上から下）。',
      '円形グラデーションでは中心位置は常に要素の中央（デフォルト）で生成されます。中心位置をずらしたい場合は、生成されたCSSの`radial-gradient(...)`の形状の後に`at ...`を追記して調整してください。',
      '生成されるCSSは`background`プロパティへの指定です。背景画像と重ねたい場合などは、`background-image`に読み替えてご利用ください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'グラデーション（gradient）',
        description:
          '2色以上の色を滑らかに変化させながらつなぐ表現方法。CSSでは`background`などのプロパティに`linear-gradient()`や`radial-gradient()`という関数を指定して描画します。',
      },
      {
        term: '線形グラデーション（linear-gradient）',
        description:
          '指定した角度に沿って直線的に色が変化するグラデーション。CSSの`linear-gradient(90deg, 色1 0%, 色2 100%)`のように、角度とカラーストップのリストを指定します。',
      },
      {
        term: '円形グラデーション（radial-gradient）',
        description:
          '中心から外側に向かって円形または楕円形に色が広がるグラデーション。CSSの`radial-gradient(circle, 色1 0%, 色2 100%)`のように、形状とカラーストップのリストを指定します。',
      },
      {
        term: 'カラーストップ（color stop）',
        description:
          'グラデーションの中で「この位置にはこの色を置く」と指定する点。位置は0%〜100%のパーセンテージで表し、複数のカラーストップの間は自動的に滑らかに補間されます。',
      },
    ],
  },
  en: {
    title: 'CSS Gradient Generator with Live Preview (Linear & Radial)',
    description:
      'Build CSS linear and radial gradients with live preview: pick colors and stops, then copy the CSS. Runs in your browser; nothing is sent to a server.',
    h1: 'CSS Gradient Generator',
    introHtml:
      'Choose a gradient type (linear or radial), then adjust the angle or shape and each color stop (color and position %) — the preview and the generated CSS update instantly. You can add or remove between 2 and 6 color stops; clicking "Add color stop" inserts a new stop in the middle of the largest gap between existing stops. The generated <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">background</code> declaration can be copied to the clipboard with one click. To convert color code formats, also try the <a href="/en/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Color Converter</a>.',
    typeLabel: 'Gradient type',
    typeLinear: 'Linear (linear-gradient)',
    typeRadial: 'Radial (radial-gradient)',
    angleLabel: 'Angle',
    angleValueTemplate: '{value}°',
    shapeLabel: 'Shape',
    shapeOptions: [
      { value: 'circle', label: 'Circle' },
      { value: 'ellipse', label: 'Ellipse' },
    ],
    stopsHeading: 'Color stops',
    colorLabel: 'Color',
    positionLabel: 'Position (%)',
    removeStopButton: 'Remove',
    addStopButton: 'Add color stop',
    maxStopsHint: 'You can have between 2 and 6 color stops.',
    previewHeading: 'Preview',
    cssHeading: 'Generated CSS',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Color stops are automatically sorted by position (ascending) before being output, even if you enter overlapping or out-of-order positions.',
      "A linear gradient's angle follows the CSS angle convention (0deg points up, 90deg points right, 180deg points down).",
      'A radial gradient is always generated centered on the element (the default). To offset the center, add "at ..." after the shape in the generated `radial-gradient(...)` yourself.',
      'The generated CSS targets the `background` property. If you need to layer it with an image, use `background-image` instead.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Gradient',
        description:
          'A smooth transition between two or more colors. In CSS, it is drawn by giving a property such as `background` a `linear-gradient()` or `radial-gradient()` function.',
      },
      {
        term: 'linear-gradient',
        description:
          'A gradient whose colors change in a straight line along a given angle, e.g. `linear-gradient(90deg, color1 0%, color2 100%)` — an angle plus a list of color stops.',
      },
      {
        term: 'radial-gradient',
        description:
          'A gradient that spreads outward from a center point in a circle or ellipse, e.g. `radial-gradient(circle, color1 0%, color2 100%)` — a shape plus a list of color stops.',
      },
      {
        term: 'Color stop',
        description:
          'A point in a gradient that says "place this color at this position." Positions are given as a percentage (0% to 100%), and the color smoothly blends between consecutive stops.',
      },
    ],
  },
};
