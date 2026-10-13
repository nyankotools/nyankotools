import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CssTextShadowGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  presetsHeading: string;
  presetLabels: Record<string, string>;
  previewHeading: string;
  previewTextLabel: string;
  previewTextDefault: string;
  textColorLabel: string;
  backgroundColorLabel: string;
  fontSizeLabel: string;
  shadowsHeading: string;
  offsetXLabel: string;
  offsetYLabel: string;
  blurLabel: string;
  colorLabel: string;
  removeShadowButton: string;
  addShadowButton: string;
  maxShadowsHint: string;
  cssHeading: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cssTextShadowGeneratorContent: Record<
  Locale,
  CssTextShadowGeneratorPageContent
> = {
  ja: {
    title: 'CSS text-shadowジェネレーター（ネオン・縁取り・複数レイヤー対応）',
    description:
      'X/Yオフセット・ぼかし・色を調整して、CSSのtext-shadowをプレビューしながら生成できる無料ツールです。ネオン・縁取りなどのプリセットと複数レイヤーに対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSS text-shadowジェネレーター',
    introHtml:
      'X/Yオフセット・ぼかし半径・色を調整すると、入力したテキストのプレビューと生成されるCSSがリアルタイムに更新されます。影は最大8レイヤーまで重ねられ、「ネオン」「縁取り」「エンボス」などのプリセットから始めることもできます。生成された<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">text-shadow</code>宣言はコピーボタンでそのままコピーできます。要素の影には <a href="/tools/css-box-shadow-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS box-shadowジェネレーター</a> もご利用ください。',
    presetsHeading: 'プリセット',
    presetLabels: {
      soft: 'ソフトシャドウ',
      neon: 'ネオン',
      outline: '縁取り',
      emboss: 'エンボス',
      retro: 'レトロ',
      glow: 'グロー',
    },
    previewHeading: 'プレビュー',
    previewTextLabel: 'プレビューするテキスト',
    previewTextDefault: 'NyankoTools',
    textColorLabel: '文字色',
    backgroundColorLabel: '背景色',
    fontSizeLabel: '文字サイズ（px）',
    shadowsHeading: '影レイヤー',
    offsetXLabel: 'X方向オフセット（px）',
    offsetYLabel: 'Y方向オフセット（px）',
    blurLabel: 'ぼかし半径（px）',
    colorLabel: '影の色',
    removeShadowButton: '削除',
    addShadowButton: '影を追加',
    maxShadowsHint: '影レイヤーは1〜8個まで設定できます。',
    cssHeading: '生成されたCSS',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      'text-shadowにはbox-shadowのような広がり半径（spread）やinsetはありません。',
      '色の入力は`<input type="color">`の仕様上、6桁の16進数のみ指定できます（アルファチャンネル非対応）。半透明にしたい場合は、生成されたCSSの色部分を`rgba()`などに書き換えてください。',
      '複数の影を指定した場合、先に書いた影ほど手前に表示されます。',
      'ぼかしの大きいレイヤーを多数重ねると、描画が重くなることがあります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'text-shadow',
        description:
          'テキストに影を付けるCSSプロパティ。`text-shadow: X Y ぼかし 色;`の形式で指定し、カンマ区切りで複数の影を重ねられる。',
      },
      {
        term: 'オフセット（offset）',
        description:
          '影をずらす距離。X方向は正で右、負で左、Y方向は正で下、負で上にずれる。',
      },
      {
        term: 'ぼかし半径（blur-radius）',
        description:
          '影の輪郭をぼかす度合い。0ならくっきりした影になり、大きいほど広くなめらかに広がる。',
      },
    ],
  },
  en: {
    title: 'CSS Text-Shadow Generator (Neon & Outline Presets)',
    description:
      'Build a CSS text-shadow with live preview: adjust offset, blur, and color across multiple layers, or start from neon and outline presets. Runs in your browser.',
    h1: 'CSS Text-Shadow Generator',
    introHtml:
      'Adjust the X/Y offset, blur radius, and color of each layer and watch your sample text and the generated CSS update instantly. Stack up to 8 shadow layers, or start from a preset such as neon, outline, or emboss. The generated <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">text-shadow</code> declaration can be copied with one click. For shadows on boxes, try the <a href="/en/tools/css-box-shadow-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS Box-Shadow Generator</a>.',
    presetsHeading: 'Presets',
    presetLabels: {
      soft: 'Soft shadow',
      neon: 'Neon',
      outline: 'Outline',
      emboss: 'Emboss',
      retro: 'Retro',
      glow: 'Glow',
    },
    previewHeading: 'Preview',
    previewTextLabel: 'Preview text',
    previewTextDefault: 'NyankoTools',
    textColorLabel: 'Text color',
    backgroundColorLabel: 'Background color',
    fontSizeLabel: 'Font size (px)',
    shadowsHeading: 'Shadow layers',
    offsetXLabel: 'X offset (px)',
    offsetYLabel: 'Y offset (px)',
    blurLabel: 'Blur radius (px)',
    colorLabel: 'Shadow color',
    removeShadowButton: 'Remove',
    addShadowButton: 'Add shadow',
    maxShadowsHint: 'You can have between 1 and 8 shadow layers.',
    cssHeading: 'Generated CSS',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Unlike box-shadow, text-shadow has no spread radius and no inset keyword.',
      'The color picker only accepts 6-digit hex values (no alpha channel). For a semi-transparent shadow, edit the color in the generated CSS to `rgba()` or similar.',
      'When several shadows are listed, the first one is painted on top.',
      'Stacking many large-blur layers can make rendering slower.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'text-shadow',
        description:
          'The CSS property that adds a shadow to text, written as `text-shadow: X Y blur color;`. Multiple shadows can be layered with commas.',
      },
      {
        term: 'Offset',
        description:
          'How far the shadow is shifted. A positive X moves it right (negative left); a positive Y moves it down (negative up).',
      },
      {
        term: 'Blur radius',
        description:
          'How soft the shadow edge is. 0 gives a sharp shadow; larger values spread it wider and smoother.',
      },
    ],
  },
};
