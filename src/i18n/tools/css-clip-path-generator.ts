import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CssClipPathGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  shapeLabel: string;
  shapePolygon: string;
  shapeCircle: string;
  shapeEllipse: string;
  shapeInset: string;
  presetLabel: string;
  presetCustom: string;
  presetNames: Record<string, string>;
  snapLabel: string;
  pointsHeading: string;
  pointLabel: string;
  addPointButton: string;
  removePointLabel: string;
  xLabel: string;
  yLabel: string;
  radiusLabel: string;
  rxLabel: string;
  ryLabel: string;
  cxLabel: string;
  cyLabel: string;
  topLabel: string;
  rightLabel: string;
  bottomLabel: string;
  leftLabel: string;
  roundLabel: string;
  previewHeading: string;
  previewHint: string;
  cssHeading: string;
  prefixLabel: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cssClipPathGeneratorContent: Record<
  Locale,
  CssClipPathGeneratorPageContent
> = {
  ja: {
    title: 'CSS clip-pathジェネレーター（ドラッグで多角形を編集）',
    description:
      'CSSのclip-pathをドラッグ操作で作れる無料ツールです。多角形（polygon）の頂点を動かし、円・楕円・inset、三角形・星・吹き出しなどのプリセットにも対応。プレビューを見ながらコードをコピーできます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSS clip-pathジェネレーター',
    introHtml:
      '要素を好きな形に切り抜く<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">clip-path</code>のコードを、プレビュー上の頂点をドラッグするだけで作れます。多角形（polygon）のほか、円（circle）・楕円（ellipse）・長方形（inset）に対応し、三角形・六角形・星・矢印・吹き出しなどのプリセットから始めることもできます。座標はすべて%指定なので、要素のサイズが変わっても形が崩れません。角丸や影は <a href="/tools/css-border-radius-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS border-radiusジェネレーター</a> や <a href="/tools/css-box-shadow-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS box-shadowジェネレーター</a> もご利用ください。',
    howToHeading: '使い方',
    howToSteps: [
      '「図形」で polygon・circle・ellipse・inset のいずれかを選びます。',
      'polygonでは「プリセット」から形を選び、プレビュー上の頂点をドラッグして調整します（「頂点を追加」で増やせます）。',
      'circle・ellipse・insetは数値で大きさと位置を指定します。',
      '「コピー」で clip-path のCSSをコピーします。',
    ],
    shapeLabel: '図形',
    shapePolygon: 'polygon（多角形）',
    shapeCircle: 'circle（円）',
    shapeEllipse: 'ellipse（楕円）',
    shapeInset: 'inset（長方形）',
    presetLabel: 'プリセット',
    presetCustom: 'カスタム',
    presetNames: {
      triangle: '三角形',
      trapezoid: '台形',
      parallelogram: '平行四辺形',
      rhombus: 'ひし形',
      pentagon: '五角形',
      hexagon: '六角形',
      octagon: '八角形',
      star: '星',
      arrow: '矢印',
      chevron: 'シェブロン',
      message: '吹き出し',
      cross: '十字',
    },
    snapLabel: '5%刻みにスナップ',
    pointsHeading: '頂点',
    pointLabel: '頂点',
    addPointButton: '頂点を追加',
    removePointLabel: '削除',
    xLabel: 'X（%）',
    yLabel: 'Y（%）',
    radiusLabel: '半径（%）',
    rxLabel: '横半径（%）',
    ryLabel: '縦半径（%）',
    cxLabel: '中心X（%）',
    cyLabel: '中心Y（%）',
    topLabel: '上（%）',
    rightLabel: '右（%）',
    bottomLabel: '下（%）',
    leftLabel: '左（%）',
    roundLabel: '角丸（%）',
    previewHeading: 'プレビュー',
    previewHint:
      '点線の枠が元の要素です。polygonでは頂点をドラッグするか、フォーカスして矢印キーで動かせます。',
    cssHeading: '生成されたCSS',
    prefixLabel: '-webkit- 付きも出力する',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '座標は要素の左上を0%、右下を100%とした割合です。要素の幅・高さが変わると、形もそれに合わせて伸縮します。',
      'clip-pathで切り抜かれた部分は表示されないだけでなく、クリックなどのポインター操作も受け付けません。',
      'ボックスシャドウや枠線も切り抜かれます。影を残したい場合は、外側の要素にfilter: drop-shadow()を指定してください。',
      '頂点は最大24個、最小3個です。頂点の数が異なる多角形同士はアニメーションで滑らかに変形しません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'clip-path',
        description:
          '要素の表示領域を図形で切り抜くCSSプロパティ。切り抜かれた外側は描画されず、ポインター操作も無効になる。',
      },
      {
        term: 'polygon()',
        description:
          '頂点の座標を順に並べて多角形を指定するclip-pathの関数。各頂点は「X座標 Y座標」の形で、%やpxで指定する。',
      },
      {
        term: 'inset()',
        description:
          '要素の上・右・下・左の各辺から内側へ切り詰めた長方形を指定する関数。round を付けると角が丸くなる。',
      },
    ],
  },
  en: {
    title: 'CSS clip-path Generator – Drag to Edit Polygons',
    description:
      'Build a CSS clip-path by dragging polygon points, with circle, ellipse and inset too. Presets included. Runs in your browser; nothing is sent to a server.',
    h1: 'CSS clip-path Generator',
    introHtml:
      'Create <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">clip-path</code> code by dragging the points right on the preview. It supports polygon, circle, ellipse and inset, and you can start from presets such as a triangle, hexagon, star, arrow or speech bubble. Every coordinate is a percentage, so the shape scales with the element. For rounded corners and shadows, see the <a href="/en/tools/css-border-radius-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS Border-Radius Generator</a> and the <a href="/en/tools/css-box-shadow-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS Box-Shadow Generator</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Pick polygon, circle, ellipse or inset in "Shape".',
      'For polygon, choose a form from "Preset", then drag the points on the preview to adjust it ("Add point" adds more).',
      'For circle, ellipse and inset, enter the size and position as numbers.',
      'Press "Copy" to copy the clip-path CSS.',
    ],
    shapeLabel: 'Shape',
    shapePolygon: 'polygon',
    shapeCircle: 'circle',
    shapeEllipse: 'ellipse',
    shapeInset: 'inset',
    presetLabel: 'Preset',
    presetCustom: 'Custom',
    presetNames: {
      triangle: 'Triangle',
      trapezoid: 'Trapezoid',
      parallelogram: 'Parallelogram',
      rhombus: 'Rhombus',
      pentagon: 'Pentagon',
      hexagon: 'Hexagon',
      octagon: 'Octagon',
      star: 'Star',
      arrow: 'Arrow',
      chevron: 'Chevron',
      message: 'Speech bubble',
      cross: 'Cross',
    },
    snapLabel: 'Snap to 5% steps',
    pointsHeading: 'Points',
    pointLabel: 'Point',
    addPointButton: 'Add point',
    removePointLabel: 'Remove',
    xLabel: 'X (%)',
    yLabel: 'Y (%)',
    radiusLabel: 'Radius (%)',
    rxLabel: 'Radius X (%)',
    ryLabel: 'Radius Y (%)',
    cxLabel: 'Center X (%)',
    cyLabel: 'Center Y (%)',
    topLabel: 'Top (%)',
    rightLabel: 'Right (%)',
    bottomLabel: 'Bottom (%)',
    leftLabel: 'Left (%)',
    roundLabel: 'Corner radius (%)',
    previewHeading: 'Preview',
    previewHint:
      'The dashed frame is the original element. For polygon, drag a point, or focus it and use the arrow keys.',
    cssHeading: 'Generated CSS',
    prefixLabel: 'Also output -webkit- prefix',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Coordinates are percentages of the element, with the top-left at 0% and the bottom-right at 100%. The shape stretches with the element’s width and height.',
      'The clipped-away area is not only hidden; it also stops receiving clicks and other pointer events.',
      'Box shadows and borders are clipped too. To keep a shadow, apply filter: drop-shadow() to a wrapping parent element.',
      'A polygon needs 3 to 24 points. Polygons with different point counts cannot be animated smoothly into each other.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'clip-path',
        description:
          'The CSS property that crops an element to a shape. Anything outside the shape is not painted and no longer receives pointer events.',
      },
      {
        term: 'polygon()',
        description:
          'A clip-path function that lists vertex coordinates in order to define a polygon. Each vertex is written as "x y" in % or px.',
      },
      {
        term: 'inset()',
        description:
          'A function that defines a rectangle by cutting in from the top, right, bottom and left edges. Add round to round its corners.',
      },
    ],
  },
};
