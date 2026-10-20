import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CssButtonGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  kindLabel: string;
  kindButton: string;
  kindToggle: string;
  kindTriangle: string;
  kindArrow: string;
  presetLabel: string;
  /** キーは `${kind}-${presetId}` */
  presetNames: Record<string, string>;
  colorLabel: string;
  colorHexLabel: string;
  buttonStyleLabel: string;
  styleSolid: string;
  styleOutline: string;
  styleSoft: string;
  hoverLabel: string;
  hoverNone: string;
  hoverColor: string;
  hoverLift: string;
  hoverBoth: string;
  directionLabel: string;
  directionUp: string;
  directionRight: string;
  directionDown: string;
  directionLeft: string;
  labelLabel: string;
  labelDefault: string;
  sizeLabel: string;
  radiusLabel: string;
  thicknessLabel: string;
  previewHeading: string;
  previewHint: string;
  contrastHeading: string;
  contrastNormal: string;
  contrastHover: string;
  contrastPass: string;
  contrastFail: string;
  contrastTextNote: string;
  contrastShapeNote: string;
  htmlHeading: string;
  cssHeading: string;
  copyHtmlButton: string;
  copyCssButton: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cssButtonGeneratorContent: Record<
  Locale,
  CssButtonGeneratorPageContent
> = {
  ja: {
    title:
      'CSSボタン・トグルスイッチ・三角形ジェネレーター（ホバー対応・HTML+CSSコピー）',
    description:
      'CSSボタン、JS不要のトグルスイッチ、border方式の三角形、矢印を、テーマ色・角丸・サイズ・ホバー効果を指定してプレビューしながら生成。HTMLとCSSをコピーでき、コントラスト比も確認できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSSボタン・トグルスイッチ・三角形ジェネレーター',
    introHtml:
      'ボタン、トグルスイッチ、三角形、矢印といったUI部品のHTMLとCSSを、テーマ色や角丸、サイズ、ホバー時の動きを選ぶだけで生成します。プレビューにはホバーやチェックの切り替えが実際に反映されます。トグルスイッチは<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">checkbox</code>と<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">label</code>だけで動き、JavaScriptは不要です。出力のクラス名は<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">nk-</code>で始まるので、既存のCSSと衝突しにくくなっています。影を細かく調整したいときは <a href="/tools/css-box-shadow-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS box-shadowジェネレーター</a>、角丸だけを作り込みたいときは <a href="/tools/css-border-radius-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS border-radiusジェネレーター</a> も使えます。',
    howToHeading: '使い方',
    howToSteps: [
      '「部品の種類」からボタン・トグルスイッチ・三角形・矢印のいずれかを選びます。',
      '「テーマ色」を指定し、プリセットや「ホバー時の動き」、サイズなどを調整します。',
      'プレビューにマウスを重ねる、またはスイッチをクリックして動きを確認します。',
      '「HTMLをコピー」「CSSをコピー」で、それぞれ自分のコードに貼り付けます。',
    ],
    kindLabel: '部品の種類',
    kindButton: 'ボタン',
    kindToggle: 'トグルスイッチ',
    kindTriangle: '三角形',
    kindArrow: '矢印',
    presetLabel: 'プリセット',
    presetNames: {
      'button-solid': '塗りつぶし',
      'button-outline': '枠線のみ',
      'button-soft': '淡色',
      'button-pill': '丸型（浮き上がり）',
      'toggle-round': '丸型',
      'toggle-square': '角型',
      'triangle-up': '上向き',
      'triangle-down': '下向き',
      'triangle-left': '左向き',
      'triangle-right': '右向き',
      'arrow-right': '右矢印',
      'arrow-down': '下矢印',
      'arrow-thick': '太い矢印',
    },
    colorLabel: 'テーマ色',
    colorHexLabel: 'テーマ色（#RRGGBB）',
    buttonStyleLabel: 'ボタンのスタイル',
    styleSolid: '塗りつぶし',
    styleOutline: '枠線のみ',
    styleSoft: '淡色',
    hoverLabel: 'ホバー時の動き',
    hoverNone: 'なし',
    hoverColor: '色が変わる',
    hoverLift: '浮き上がる',
    hoverBoth: '色＋浮き上がり',
    directionLabel: '向き',
    directionUp: '上',
    directionRight: '右',
    directionDown: '下',
    directionLeft: '左',
    labelLabel: 'ラベル文字',
    labelDefault: 'ボタン',
    sizeLabel: 'サイズ',
    radiusLabel: '角丸',
    thicknessLabel: '線の太さ',
    previewHeading: 'プレビュー',
    previewHint: 'マウスを重ねるとホバーの動きを確認できます。',
    contrastHeading: 'コントラスト比（簡易）',
    contrastNormal: '通常時',
    contrastHover: 'ホバー時',
    contrastPass: '基準を満たしています',
    contrastFail: '基準に届いていません',
    contrastTextNote: '文字と背景の比率。WCAG AAの目安は4.5以上です。',
    contrastShapeNote: '白背景との比率。図形・UI部品の目安は3以上です。',
    htmlHeading: 'HTML',
    cssHeading: 'CSS',
    copyHtmlButton: 'HTMLをコピー',
    copyCssButton: 'CSSをコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      'コントラスト比は文字色・背景色から計算した簡易表示です。実際の画面では、周囲の背景色や文字の太さも合わせて確認してください。',
      '三角形はborderを使う方式です。幅・高さを0にして線の太さで形を作るため、中に文字を入れたり、背景色を付けたりすることはできません。',
      '三角形と矢印の浮き上がりには`translate`プロパティを使っています。古いブラウザでは浮き上がらず、色の変化のみになります。',
      'トグルスイッチの入力欄は画面外に隠していますが、キーボードのフォーカスと操作はそのまま使えます。状態を取得するときは`input`のchecked属性を参照してください。',
      'ラベルや色はHTML・CSSに書き出す前に検証・エスケープしています。#RRGGBB形式以外の色は、初期色に置き換わります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'border方式の三角形',
        description:
          '幅と高さが0の要素に太いborderを引き、隣り合う辺の斜めの接合部を利用して三角形を作る方法。不要な辺を透明にする。',
      },
      {
        term: ':hover',
        description:
          'マウスポインターが要素の上にあるときに適用される疑似クラス。タッチ操作では挙動が端末ごとに異なる。',
      },
      {
        term: ':focus-visible',
        description:
          'キーボード操作などでフォーカスされたときだけ枠を表示する疑似クラス。ボタンとトグルスイッチに設定している。',
      },
      {
        term: 'コントラスト比',
        description:
          '2色の明るさの差を1〜21で表した値。WCAG 2.xでは、通常の文字は4.5以上、図形やUI部品は3以上が目安。',
      },
    ],
  },
  en: {
    title: 'CSS Button & Toggle Switch Generator',
    description:
      'Generate CSS buttons, pure-CSS toggle switches, triangles and arrows with hover effects and a live preview. Copy the HTML and CSS. Runs in your browser.',
    h1: 'CSS Button, Toggle Switch & Triangle Generator',
    introHtml:
      'Pick a button, toggle switch, triangle, or arrow, then set the theme color, corner radius, size, and hover behavior to get ready-to-paste HTML and CSS. The preview reacts to hover and clicks just like the real thing. The toggle switch is a plain <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">checkbox</code> plus <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">label</code>, so it needs no JavaScript. Generated class names start with <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">nk-</code> to avoid clashing with your existing styles. For finer shadow control, try the <a href="/en/tools/css-box-shadow-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS Box-Shadow Generator</a>, or the <a href="/en/tools/css-border-radius-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS Border-Radius Generator</a> for custom corners.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a button, toggle switch, triangle, or arrow under "Component type".',
      'Set the "Theme color", then adjust the preset, "Hover effect", size, and other options.',
      'Hover over the preview, or click the switch, to check how it behaves.',
      'Use "Copy HTML" and "Copy CSS" to paste each into your own code.',
    ],
    kindLabel: 'Component type',
    kindButton: 'Button',
    kindToggle: 'Toggle switch',
    kindTriangle: 'Triangle',
    kindArrow: 'Arrow',
    presetLabel: 'Preset',
    presetNames: {
      'button-solid': 'Solid',
      'button-outline': 'Outline',
      'button-soft': 'Soft',
      'button-pill': 'Pill (lift)',
      'toggle-round': 'Round',
      'toggle-square': 'Square',
      'triangle-up': 'Up',
      'triangle-down': 'Down',
      'triangle-left': 'Left',
      'triangle-right': 'Right',
      'arrow-right': 'Right arrow',
      'arrow-down': 'Down arrow',
      'arrow-thick': 'Thick arrow',
    },
    colorLabel: 'Theme color',
    colorHexLabel: 'Theme color (#RRGGBB)',
    buttonStyleLabel: 'Button style',
    styleSolid: 'Solid',
    styleOutline: 'Outline',
    styleSoft: 'Soft',
    hoverLabel: 'Hover effect',
    hoverNone: 'None',
    hoverColor: 'Color change',
    hoverLift: 'Lift up',
    hoverBoth: 'Color + lift',
    directionLabel: 'Direction',
    directionUp: 'Up',
    directionRight: 'Right',
    directionDown: 'Down',
    directionLeft: 'Left',
    labelLabel: 'Label text',
    labelDefault: 'Button',
    sizeLabel: 'Size',
    radiusLabel: 'Corner radius',
    thicknessLabel: 'Line thickness',
    previewHeading: 'Preview',
    previewHint: 'Hover over it to see the hover effect.',
    contrastHeading: 'Contrast ratio (quick check)',
    contrastNormal: 'Normal',
    contrastHover: 'Hover',
    contrastPass: 'Meets the guideline',
    contrastFail: 'Below the guideline',
    contrastTextNote:
      'Text against its background. The WCAG AA guideline is 4.5 or higher.',
    contrastShapeNote:
      'The shape against a white background. The guideline for UI graphics is 3 or higher.',
    htmlHeading: 'HTML',
    cssHeading: 'CSS',
    copyHtmlButton: 'Copy HTML',
    copyCssButton: 'Copy CSS',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'The contrast ratio is a quick calculation from the text and background colors. In a real layout, also check the surrounding background and font weight.',
      'Triangles use the border technique: a zero-size element whose thick borders form the shape. You cannot put text inside them or give them a background color.',
      'The lift effect on triangles and arrows uses the `translate` property. In older browsers they will only change color and will not lift.',
      'The toggle switch input is visually hidden but still reachable by keyboard. Read its state from the checked property of the `input`.',
      'Colors and labels are validated and escaped before they are written into the HTML and CSS. Anything other than a #RRGGBB color is replaced with the default.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Border triangle',
        description:
          'A technique that gives a zero-size element thick borders and makes the unwanted sides transparent, leaving the diagonal join as a triangle.',
      },
      {
        term: ':hover',
        description:
          'A pseudo-class applied while the pointer is over an element. On touch screens its behavior varies by device.',
      },
      {
        term: ':focus-visible',
        description:
          'A pseudo-class that shows an outline only when focus is set by keyboard-style interaction. Applied to the button and the toggle switch.',
      },
      {
        term: 'Contrast ratio',
        description:
          'A value from 1 to 21 describing the luminance difference between two colors. WCAG 2.x suggests 4.5 for normal text and 3 for graphics and UI components.',
      },
    ],
  },
};
