import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SvgPathViewerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  inputLabel: string;
  sampleText: string;
  controlsLabel: string;
  previewHeading: string;
  previewLabel: string;
  legendStart: string;
  legendAnchor: string;
  legendControl: string;
  legendImplicit: string;
  segmentsHeading: string;
  segmentsHint: string;
  selectButton: string;
  relativeBadge: string;
  commandNames: Record<string, string>;
  optimizeHeading: string;
  precisionLabel: string;
  absoluteLabel: string;
  optimizeButton: string;
  copyButton: string;
  optimizedStats: string;
  copied: string;
  copyFailed: string;
  errors: Record<string, string>;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const codeClass =
  'class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800"';
const linkClass =
  'class="text-blue-700 underline hover:no-underline dark:text-blue-400"';

export const svgPathViewerContent: Record<Locale, SvgPathViewerPageContent> = {
  ja: {
    title: 'SVGパスビューア（d属性をコマンド別に分解・可視化）',
    description:
      'SVGのpath要素のd属性をコマンド（M/L/H/V/C/S/Q/T/A/Z）ごとに分解し、始点・終点・制御点を図に重ねて表示する無料ツール。座標の編集や小数桁の削減もできます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'SVGパスビューア',
    introHtml: `SVGの <code ${codeClass}>d</code> 属性（パスデータ）を<strong>コマンド別に分解</strong>し、<strong>始点・終点・制御点</strong>を図形に重ねて表示します。相対コマンドは絶対座標に換算して一覧にし、S / T の暗黙の制御点も確認できます。座標の手動編集や小数桁の削減（最適化）にも対応。SVGファイル全体を軽くしたいときは <a href="/tools/svg-optimizer/" ${linkClass}>SVG最適化ツール</a>、波形の生成は <a href="/tools/svg-wave-generator/" ${linkClass}>SVG波・ブロブジェネレーター</a> もご利用ください。`,
    howToHeading: '使い方',
    howToSteps: [
      '「パスデータ（d属性）」にSVGのpathのdの値を貼り付けます。「サンプルを挿入」で試すこともできます。',
      '図とコマンド一覧を見ながら、「選択」を押して該当セグメントを強調表示します。一覧の数値を書き換えると、パスデータと図に反映されます。',
      '「小数桁数」を決めて「最適化する」を押すと、パスデータが短くなります。「パスデータをコピー」で取り出せます。',
    ],
    inputLabel: 'パスデータ（d属性）',
    sampleText: 'サンプルを挿入',
    controlsLabel: '制御点を表示',
    previewHeading: 'プレビュー',
    previewLabel: 'パスと制御点のプレビュー',
    legendStart: '始点',
    legendAnchor: '終点（アンカー）',
    legendControl: '制御点',
    legendImplicit: '自動計算された制御点（S / T）',
    segmentsHeading: 'コマンド一覧',
    segmentsHint:
      '数値を書き換えるとパスデータに反映されます。円弧のフラグ（large・sweep）は0か1です。',
    selectButton: '選択',
    relativeBadge: '相対',
    commandNames: {
      M: '移動 (Move)',
      L: '直線 (Line)',
      H: '水平線 (Horizontal)',
      V: '垂直線 (Vertical)',
      C: '3次ベジェ (Cubic)',
      S: '滑らかな3次ベジェ (Smooth cubic)',
      Q: '2次ベジェ (Quadratic)',
      T: '滑らかな2次ベジェ (Smooth quadratic)',
      A: '円弧 (Arc)',
      Z: '閉じる (Close)',
    },
    optimizeHeading: '最適化（小数桁の削減）',
    precisionLabel: '小数桁数',
    absoluteLabel: '絶対座標に変換する',
    optimizeButton: '最適化する',
    copyButton: 'パスデータをコピー',
    optimizedStats: '{before}文字 → {after}文字（{percent}%削減）',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errors: {
      empty: 'パスデータを入力してください。',
      'invalid-char': '{position}文字目に、パスで使えない文字があります。',
      'must-start-with-move':
        'パスデータは M または m で始める必要があります（{position}文字目）。',
      'missing-args': '{position}文字目付近で、コマンドの数値が足りません。',
      'invalid-flag':
        '{position}文字目の円弧フラグ（large / sweep）は0か1にしてください。',
      'unexpected-number': '{position}文字目に、コマンドのない数値があります。',
    },
    notesHeading: '注意事項',
    notes: [
      '対応コマンドは M・L・H・V・C・S・Q・T・A・Z（大文字は絶対、小文字は相対）です。コマンドを省略した繰り返し（M の後の暗黙の L を含む）も展開して表示します。',
      '図の表示範囲は始点・終点・制御点が収まる大きさに自動調整します。円弧は端点だけを描画範囲に含めるため、円弧の膨らみが範囲外に出ることがあります。',
      '小数桁の削減は座標を丸めるため、図形がわずかに変わります。相対コマンドを多く含むパスでは誤差が積み重なることがあるので、気になる場合は「絶対座標に変換する」を使ってください。',
      '最適化後は区切りを詰めて（例: 0.5 を .5、10 -5 を 10-5）書き出します。SVGの仕様どおりですが、ごく古いソフトでは読めないことがあります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'パスデータ（d属性）',
        description:
          'SVGのpath要素の形を決める文字列。M（移動）やC（曲線）などのコマンドと座標を並べて書く。',
      },
      {
        term: '制御点',
        description:
          'ベジェ曲線の曲がり方を決める点。曲線そのものは通らず、曲線を引っ張る向きと強さを表す。',
      },
      {
        term: '相対コマンド・絶対コマンド',
        description:
          '大文字のコマンドは原点基準の絶対座標、小文字は現在位置からの差分（相対座標）で指定する。',
      },
      {
        term: '円弧（Aコマンド）',
        description:
          '半径・回転・large-arc/sweepのフラグ・終点で楕円の弧を描くコマンド。フラグの組み合わせで4通りの弧から選ぶ。',
      },
    ],
  },
  en: {
    title: 'SVG Path Viewer – Visualize and Edit the d Attribute',
    description:
      'Break an SVG path d attribute into commands and see start, end and control points drawn on the shape. Edit coordinates or trim decimals. Runs in your browser.',
    h1: 'SVG Path Viewer',
    introHtml: `Paste the <code ${codeClass}>d</code> attribute of an SVG path and it is <strong>split into commands</strong>, with <strong>start, end and control points</strong> drawn over the shape. Relative commands are converted to absolute coordinates in the list, and the implicit control points of S and T are shown too. You can edit coordinates by hand or reduce decimal places to shorten the data. To shrink a whole SVG file, use the <a href="/en/tools/svg-optimizer/" ${linkClass}>SVG Optimizer</a>; for wave shapes, try the <a href="/en/tools/svg-wave-generator/" ${linkClass}>SVG Wave & Blob Generator</a>.`,
    howToHeading: 'How to use',
    howToSteps: [
      'Paste the d value of your path into "Path data (d attribute)", or press "Insert sample" to try it.',
      'Press "Select" on a row to highlight that segment in the preview. Change a number in the list and the path data and the preview follow.',
      'Choose "Decimal places" and press "Optimize" to shorten the path data, then take it with "Copy path data".',
    ],
    inputLabel: 'Path data (d attribute)',
    sampleText: 'Insert sample',
    controlsLabel: 'Show control points',
    previewHeading: 'Preview',
    previewLabel: 'Preview of the path with control points',
    legendStart: 'Start point',
    legendAnchor: 'End point (anchor)',
    legendControl: 'Control point',
    legendImplicit: 'Computed control point (S / T)',
    segmentsHeading: 'Commands',
    segmentsHint:
      'Edit a number to update the path data. Arc flags (large, sweep) must be 0 or 1.',
    selectButton: 'Select',
    relativeBadge: 'relative',
    commandNames: {
      M: 'Move',
      L: 'Line',
      H: 'Horizontal line',
      V: 'Vertical line',
      C: 'Cubic Bézier',
      S: 'Smooth cubic Bézier',
      Q: 'Quadratic Bézier',
      T: 'Smooth quadratic Bézier',
      A: 'Elliptical arc',
      Z: 'Close path',
    },
    optimizeHeading: 'Optimize (reduce decimals)',
    precisionLabel: 'Decimal places',
    absoluteLabel: 'Convert to absolute coordinates',
    optimizeButton: 'Optimize',
    copyButton: 'Copy path data',
    optimizedStats: '{before} → {after} characters ({percent}% smaller)',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errors: {
      empty: 'Enter some path data.',
      'invalid-char': 'Character {position} is not valid in path data.',
      'must-start-with-move':
        'Path data must start with M or m (character {position}).',
      'missing-args': 'A command is missing numbers near character {position}.',
      'invalid-flag':
        'The arc flag (large / sweep) at character {position} must be 0 or 1.',
      'unexpected-number':
        'There is a number without a command at character {position}.',
    },
    notesHeading: 'Notes',
    notes: [
      'Supported commands are M, L, H, V, C, S, Q, T, A and Z (uppercase is absolute, lowercase is relative). Repeated commands with the letter omitted, including the implicit L after M, are expanded in the list.',
      'The preview area fits the start, end and control points. For arcs only the end points are counted, so the bulge of an arc can extend past the frame.',
      'Reducing decimals rounds the coordinates, so the shape changes slightly. In paths with many relative commands the rounding errors can add up; use "Convert to absolute coordinates" if that matters.',
      'The optimized output packs separators (for example .5 for 0.5 and 10-5 for 10 -5). This is valid SVG, but very old software may not read it.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Path data (d attribute)',
        description:
          'The string that defines the shape of an SVG path element: commands such as M (move) and C (curve) followed by coordinates.',
      },
      {
        term: 'Control point',
        description:
          'A point that shapes a Bézier curve. The curve does not pass through it; it sets the direction and strength of the pull.',
      },
      {
        term: 'Relative / absolute commands',
        description:
          'Uppercase commands use absolute coordinates; lowercase commands use offsets from the current point.',
      },
      {
        term: 'Elliptical arc (A command)',
        description:
          'Draws part of an ellipse from radii, rotation, the large-arc and sweep flags and an end point. The flags pick one of four possible arcs.',
      },
    ],
  },
};
