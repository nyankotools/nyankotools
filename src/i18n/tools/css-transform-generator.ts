import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CssTransformGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  presetsHeading: string;
  presetLabels: Record<string, string>;
  previewHeading: string;
  previewLabel: string;
  controlsHeading: string;
  groupLabels: Record<string, string>;
  controlLabels: Record<string, string>;
  resetButton: string;
  cssHeading: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cssTransformGeneratorContent: Record<
  Locale,
  CssTransformGeneratorPageContent
> = {
  ja: {
    title: 'CSS transformジェネレーター（rotate・scale・skew・3D対応）',
    description:
      'rotate・scale・skew・translate・3D回転（rotateX/Y）・perspective・transform-originを調整して、CSS transformをプレビューしながら生成できる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSS transformジェネレーター',
    introHtml:
      '移動・回転・拡大縮小・傾き・3D回転・奥行き（perspective）・変形の基準点を調整すると、プレビューと生成されるCSSがリアルタイムに更新されます。初期値のままの項目は出力から省略されるので、必要な変形だけのすっきりしたCSSが得られます。「3Dカードの傾き」「フリップ（裏返し）」などのプリセットから始めることもできます。アニメーションにする場合は <a href="/tools/css-animation-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSSアニメーションジェネレーター</a> もご利用ください。',
    presetsHeading: 'プリセット',
    presetLabels: {
      rotate45: '45度回転',
      zoom: '1.5倍に拡大',
      italic: '斜体風',
      tiltCard: '3Dカードの傾き',
      flip: 'フリップ（裏返し）',
      isometric: 'アイソメトリック',
    },
    previewHeading: 'プレビュー',
    previewLabel: '変形後のプレビュー（点線は変形前の位置）',
    controlsHeading: '変形の設定',
    groupLabels: {
      translate: '移動（translate）',
      rotate: '回転（rotate）',
      scale: '拡大縮小（scale）',
      skew: '傾き（skew）',
      depth: '奥行き',
      origin: '変形の基準点（transform-origin）',
    },
    controlLabels: {
      translateX: 'X方向の移動（px）',
      translateY: 'Y方向の移動（px）',
      translateZ: 'Z方向の移動（px）',
      rotateX: 'X軸の回転（deg）',
      rotateY: 'Y軸の回転（deg）',
      rotateZ: '回転 / Z軸（deg）',
      scaleX: '横の倍率',
      scaleY: '縦の倍率',
      skewX: 'X方向の傾き（deg）',
      skewY: 'Y方向の傾き（deg）',
      perspective: 'perspective（px、0で指定なし）',
      originX: '基準点X（%）',
      originY: '基準点Y（%）',
    },
    resetButton: 'リセット',
    cssHeading: '生成されたCSS',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    howToHeading: '使い方',
    howToSteps: [
      '「プリセット」から近い形を選ぶか、そのまま各スライダーを動かします。',
      '「移動」「回転」「拡大縮小」「傾き」などの数値を調整し、プレビューで確認します。',
      '3Dの奥行きを出したいときは「perspective」を設定し、X軸・Y軸の回転を加えます。',
      '「コピー」で生成されたCSSをコピーし、スタイルシートに貼り付けます。やり直すときは「リセット」を押します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '出力は`perspective()`関数を`transform`の先頭に置く書き方です。親要素に`perspective`プロパティを指定する方式とは、複数の子要素を並べた際の見え方が異なります。',
      '`transform`の関数は左から順に適用されるため、順番を入れ替えると結果が変わります。このツールは移動 → 回転 → 拡大縮小 → 傾きの順で出力します。',
      '`transform-origin`が初期値（50% 50%）の場合は出力を省略します。',
      '傾き（skew）は±89度までです。90度付近では要素が極端に伸びて見えなくなります。',
      '`transform`は要素の周囲のレイアウトには影響せず、見た目だけが変わります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'transform',
        description:
          '要素を移動・回転・拡大縮小・傾けるCSSプロパティ。複数の変形関数をスペース区切りで並べると、左から順に適用される。',
      },
      {
        term: 'perspective',
        description:
          '3D変形で奥行きの強さを決める値。小さいほど遠近感が強く、大きいほど平面に近い見た目になる。',
      },
      {
        term: 'transform-origin',
        description:
          '回転や拡大縮小の基準になる点。初期値は要素の中心（50% 50%）で、左上にすると左上を軸に回転する。',
      },
    ],
  },
  en: {
    title: 'CSS Transform Generator (Rotate, Scale, Skew, 3D)',
    description:
      'Build a CSS transform with live preview: rotate, scale, skew, translate, 3D rotateX/Y, perspective and transform-origin. Runs in your browser.',
    h1: 'CSS Transform Generator',
    introHtml:
      'Adjust translate, rotate, scale, skew, 3D rotation, perspective and the transform origin, and watch the preview and generated CSS update instantly. Properties left at their defaults are omitted, so you get only the CSS you need. Start from a preset such as a tilted 3D card or a flip. To animate the result, try the <a href="/en/tools/css-animation-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS Animation Generator</a>.',
    presetsHeading: 'Presets',
    presetLabels: {
      rotate45: 'Rotate 45deg',
      zoom: 'Zoom 1.5x',
      italic: 'Italic skew',
      tiltCard: 'Tilted 3D card',
      flip: 'Flip',
      isometric: 'Isometric',
    },
    previewHeading: 'Preview',
    previewLabel: 'Transformed preview (dashed outline shows the original)',
    controlsHeading: 'Transform settings',
    groupLabels: {
      translate: 'Translate',
      rotate: 'Rotate',
      scale: 'Scale',
      skew: 'Skew',
      depth: 'Depth',
      origin: 'Transform origin',
    },
    controlLabels: {
      translateX: 'Translate X (px)',
      translateY: 'Translate Y (px)',
      translateZ: 'Translate Z (px)',
      rotateX: 'Rotate X (deg)',
      rotateY: 'Rotate Y (deg)',
      rotateZ: 'Rotate / Z axis (deg)',
      scaleX: 'Scale X',
      scaleY: 'Scale Y',
      skewX: 'Skew X (deg)',
      skewY: 'Skew Y (deg)',
      perspective: 'Perspective (px, 0 = none)',
      originX: 'Origin X (%)',
      originY: 'Origin Y (%)',
    },
    resetButton: 'Reset',
    cssHeading: 'Generated CSS',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    howToHeading: 'How to use',
    howToSteps: [
      'Pick a starting point from "Presets", or just move the sliders.',
      'Tune the values under "Translate", "Rotate", "Scale" and "Skew" while checking the preview.',
      'For a 3D look, set "Perspective" and add a Rotate X or Rotate Y angle.',
      'Click "Copy" and paste the CSS into your stylesheet. Use "Reset" to start over.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The output puts the `perspective()` function at the start of `transform`. This looks different from setting the `perspective` property on a parent when several children are laid out side by side.',
      'Transform functions are applied from left to right, so reordering them changes the result. This tool always outputs translate, rotate, scale, then skew.',
      '`transform-origin` is omitted when it is the default (50% 50%).',
      'Skew is limited to +/-89 degrees; near 90 degrees the element stretches out of view.',
      '`transform` changes only how an element is painted; it does not affect the layout around it.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'transform',
        description:
          'The CSS property that moves, rotates, scales, or skews an element. Several functions can be listed with spaces and are applied from left to right.',
      },
      {
        term: 'perspective',
        description:
          'Sets how strong the depth effect is in 3D transforms. Smaller values give stronger perspective; larger values look flatter.',
      },
      {
        term: 'transform-origin',
        description:
          'The point that rotation and scaling are anchored to. The default is the element center (50% 50%); setting it to the top-left rotates around that corner.',
      },
    ],
  },
};
