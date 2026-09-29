import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CssBoxShadowGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  shadowsHeading: string;
  offsetXLabel: string;
  offsetYLabel: string;
  blurLabel: string;
  spreadLabel: string;
  colorLabel: string;
  insetLabel: string;
  removeShadowButton: string;
  addShadowButton: string;
  maxShadowsHint: string;
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

export const cssBoxShadowGeneratorContent: Record<
  Locale,
  CssBoxShadowGeneratorPageContent
> = {
  ja: {
    title: 'CSS box-shadowジェネレーター（プレビュー付き・複数レイヤー対応）',
    description:
      'X/Yオフセット・ぼかし・広がり・色・inset（内側影）を調整するだけで、CSSの`box-shadow`をリアルタイムプレビューしながら生成できる無料ツールです。シャドウレイヤーは複数重ねて追加でき、生成したCSSはワンクリックでコピーできます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSS box-shadowジェネレーター',
    introHtml:
      'X/Yオフセット・ぼかし半径・広がり半径・色・内側影（inset）を調整すると、プレビューと生成されるCSSがリアルタイムに更新されます。シャドウレイヤーは1〜6個まで追加・削除でき、「シャドウを追加」ボタンを押すたびにオフセットとぼかしが段階的に広がるレイヤーが挿入されるため、影を重ねた立体的な表現も作れます。生成された<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">box-shadow</code>宣言はコピーボタンでそのままクリップボードにコピーできます。角丸との組み合わせには <a href="/tools/css-border-radius-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS border-radiusジェネレーター</a> もあわせてご利用ください。',
    shadowsHeading: 'シャドウレイヤー',
    offsetXLabel: 'X方向オフセット（px）',
    offsetYLabel: 'Y方向オフセット（px）',
    blurLabel: 'ぼかし半径（px）',
    spreadLabel: '広がり半径（px）',
    colorLabel: '色',
    insetLabel: '内側影（inset）',
    removeShadowButton: '削除',
    addShadowButton: 'シャドウを追加',
    maxShadowsHint: 'シャドウレイヤーは1〜6個まで設定できます。',
    previewHeading: 'プレビュー',
    cssHeading: '生成されたCSS',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '色の入力は`<input type="color">`の仕様上、6桁の16進数カラーコードのみ指定できます（アルファチャンネル非対応）。半透明の影（`rgba()`/`hsla()`）にしたい場合は、生成されたCSSの色部分を直接書き換えてご利用ください。',
      '広がり半径（spread-radius）にマイナスの値を指定すると、影がぼかし半径よりも縮小します。',
      '内側影（inset）を有効にすると、要素の外側ではなく内側に影が描画されます。',
      '複数のシャドウレイヤーを追加した場合、CSSの仕様上、先に指定したレイヤーほど手前（上）に重なって表示されます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'box-shadow',
        description:
          '要素に影を付けるCSSプロパティ。`box-shadow: X Y ぼかし 広がり 色;`の形式で指定し、カンマ区切りで複数の影を重ねることもできる。',
      },
      {
        term: 'オフセット（offset）',
        description:
          '影をずらす距離。X方向は正の値で右、負の値で左にずれ、Y方向は正の値で下、負の値で上にずれる。',
      },
      {
        term: 'ぼかし半径（blur-radius）',
        description:
          '影の輪郭をぼかす度合い。値が大きいほど影の境界がなめらかに広がる。0を指定すると輪郭がくっきりした影になる。',
      },
      {
        term: '広がり半径（spread-radius）',
        description:
          '影のサイズを拡大・縮小する値。正の値で影が要素より一回り大きくなり、負の値で影が要素より小さくなる。',
      },
      {
        term: '内側影（inset）',
        description:
          '`inset`キーワードを指定すると、影が要素の外側ではなく内側に描画され、くぼんだような表現になる。',
      },
    ],
  },
  en: {
    title: 'CSS Box-Shadow Generator with Live Preview (Multi-Layer)',
    description:
      'Build a CSS box-shadow with a live preview — adjust the X/Y offset, blur, spread, color, and inset for each shadow layer and copy the generated CSS instantly. Stack multiple shadow layers to create depth. Your data is processed in the browser and never sent to a server.',
    h1: 'CSS Box-Shadow Generator',
    introHtml:
      'Adjust the X/Y offset, blur radius, spread radius, color, and inset for each shadow layer — the preview and the generated CSS update instantly. You can add or remove between 1 and 6 shadow layers; clicking "Add shadow" inserts a new layer with progressively larger offset and blur, making it easy to build a layered, dimensional shadow. The generated <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">box-shadow</code> declaration can be copied to the clipboard with one click. Pairs well with the <a href="/en/tools/css-border-radius-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS Border-Radius Generator</a> for rounded, shadowed cards.',
    shadowsHeading: 'Shadow layers',
    offsetXLabel: 'X offset (px)',
    offsetYLabel: 'Y offset (px)',
    blurLabel: 'Blur radius (px)',
    spreadLabel: 'Spread radius (px)',
    colorLabel: 'Color',
    insetLabel: 'Inset',
    removeShadowButton: 'Remove',
    addShadowButton: 'Add shadow',
    maxShadowsHint: 'You can have between 1 and 6 shadow layers.',
    previewHeading: 'Preview',
    cssHeading: 'Generated CSS',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Because `<input type="color">` only accepts 6-digit hex colors, it has no alpha channel. For a semi-transparent shadow (`rgba()`/`hsla()`), edit the color in the generated CSS by hand.',
      'A negative spread radius shrinks the shadow smaller than the blur radius would otherwise produce.',
      'Enabling inset draws the shadow inside the element’s edge instead of outside it.',
      'When you stack multiple shadow layers, the CSS spec renders the layer listed first on top of the others.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'box-shadow',
        description:
          'The CSS property that adds a shadow to an element, written as `box-shadow: X Y blur spread color;`. Multiple shadows can be layered by separating them with commas.',
      },
      {
        term: 'Offset',
        description:
          'How far the shadow is shifted from the element. A positive X moves it right (negative left), and a positive Y moves it down (negative up).',
      },
      {
        term: 'Blur radius',
        description:
          "How soft the shadow's edge is. A larger value spreads the edge out more smoothly; 0 produces a sharp-edged shadow.",
      },
      {
        term: 'Spread radius',
        description:
          "How much the shadow's size is expanded or contracted. A positive value makes the shadow larger than the element; a negative value makes it smaller.",
      },
      {
        term: 'Inset',
        description:
          'The `inset` keyword draws the shadow inside the element’s edge instead of outside it, producing a carved-in look.',
      },
    ],
  },
};
