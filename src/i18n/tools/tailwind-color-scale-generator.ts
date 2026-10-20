import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface TailwindColorScaleGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  pickerAriaLabel: string;
  hexLabel: string;
  hexPlaceholder: string;
  hexError: string;
  nameLabel: string;
  namePlaceholder: string;
  keepBaseLabel: string;
  scaleHeading: string;
  swatchAction: string;
  baseBadge: string;
  formatLabel: string;
  formats: { css: string; theme: string; config: string };
  copy: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const tailwindColorScaleGeneratorContent: Record<
  Locale,
  TailwindColorScaleGeneratorPageContent
> = {
  ja: {
    title: 'Tailwindカラースケール生成（50〜950の11段階）',
    description:
      '基準色から Tailwind CSS 風の50〜950の11段階カラースケールを生成し、CSS変数・Tailwind v4 の @theme・tailwind.config.js 形式でコピーできる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Tailwindカラースケール生成（50〜950の11段階）',
    introHtml:
      '基準色を1色選ぶだけで、Tailwind CSS のように 50・100・200…900・950 の11段階に明度を振ったカラースケールを作れます。CSS変数、Tailwind v4 の <code>@theme</code>、v3 の <code>tailwind.config.js</code> 形式でそのままコピーできます。ブラウザ内で処理され、サーバーには送信されません。色相の関係から配色を作るなら <a href="/tools/color-palette-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">配色パレットジェネレーター</a>、色の形式変換は <a href="/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カラーコード変換</a> をお使いください。',
    howToHeading: '使い方',
    howToSteps: [
      'カラーピッカーかHEX欄で基準色を決め、色名を入力します。',
      '11段階のスケールが表示されます。色をクリックするとHEXをコピーできます。',
      '出力形式（CSS変数・Tailwind v4・Tailwind v3）を選んでコピーします。',
    ],
    pickerAriaLabel: '基準色のカラーピッカー',
    hexLabel: '基準色（HEX）',
    hexPlaceholder: '#3b82f6',
    hexError: 'HEXの形式が正しくありません（例: #3b82f6）',
    nameLabel: '色名',
    namePlaceholder: 'brand',
    keepBaseLabel: '基準色を最も近い段階にそのまま配置する',
    scaleHeading: 'カラースケール',
    swatchAction: 'をコピー',
    baseBadge: '基準',
    formatLabel: '出力形式',
    formats: {
      css: 'CSS変数',
      theme: 'Tailwind v4（@theme）',
      config: 'Tailwind v3（config）',
    },
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '色相と彩度は基準色のまま、HSLの明度だけを段階ごとの固定値に振って計算しています。Tailwind CSS 公式のパレットとは一致しません。',
      'HSLの明度は見た目の明るさと一致しないため、黄色や緑は同じ段階でも青や紫より明るく見えます。文字色に使う前にコントラストを確認してください。',
      '基準色を最も近い段階にそのまま配置する設定では、その段階だけ入力どおりのHEXになり、前後の段階との明度差が不揃いになることがあります。',
      '色名は英小文字・数字・ハイフンに自動で整形されます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'カラースケール',
        description:
          '1つの色相を明るい色から暗い色まで段階的に並べたものです。背景は50〜100、ボーダーは200〜300、文字は700〜900のように使い分けます。',
      },
      {
        term: 'HSLの明度',
        description:
          '色の明るさを0〜100%で表す値です。0%で黒、100%で白になり、50%付近が最も鮮やかな色です。',
      },
      {
        term: '@theme',
        description:
          'Tailwind CSS v4 でデザイントークンを定義するCSSのディレクティブです。--color-名前-段階 の形で書くと、bg-名前-500 のようなユーティリティが使えます。',
      },
    ],
  },
  en: {
    title: 'Tailwind Color Scale Generator (50-950 Shades)',
    description:
      'Generate an 11-step 50-950 color scale from one base color and copy it as CSS variables, a Tailwind v4 @theme block or tailwind.config.js. Runs in your browser.',
    h1: 'Tailwind Color Scale Generator (50-950 Shades)',
    introHtml:
      'Pick one base color and get a Tailwind-style scale with 11 shades: 50, 100, 200 through 900 and 950. Copy it as CSS variables, a Tailwind v4 <code>@theme</code> block or a v3 <code>tailwind.config.js</code> snippet. Everything runs in your browser, and nothing is sent to a server. For hue-based color schemes, use the <a href="/en/tools/color-palette-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Color Palette Generator</a>. To convert color formats, try the <a href="/en/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Color Converter</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a base color with the color picker or the HEX field, then enter a color name.',
      'The 11-step scale appears. Click a swatch to copy its HEX.',
      'Pick an output format (CSS variables, Tailwind v4 or Tailwind v3) and copy it.',
    ],
    pickerAriaLabel: 'Base color picker',
    hexLabel: 'Base color (HEX)',
    hexPlaceholder: '#3b82f6',
    hexError: 'Invalid HEX format (e.g. #3b82f6)',
    nameLabel: 'Color name',
    namePlaceholder: 'brand',
    keepBaseLabel: 'Place the base color as-is on the closest step',
    scaleHeading: 'Color scale',
    swatchAction: ': copy',
    baseBadge: 'base',
    formatLabel: 'Output format',
    formats: {
      css: 'CSS variables',
      theme: 'Tailwind v4 (@theme)',
      config: 'Tailwind v3 (config)',
    },
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Hue and saturation stay the same as your base color; only HSL lightness is set to a fixed value per step. The result does not match the official Tailwind CSS palette.',
      'HSL lightness is not the same as perceived brightness, so yellows and greens look lighter than blues and purples at the same step. Check the contrast before using a step for text.',
      'When the base color is placed as-is, only that step uses your exact HEX, so the lightness gap to neighboring steps can be uneven.',
      'The color name is automatically cleaned up to lowercase letters, digits and hyphens.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Color scale',
        description:
          'One hue arranged from light to dark in steps. Typically 50-100 for backgrounds, 200-300 for borders and 700-900 for text.',
      },
      {
        term: 'HSL lightness',
        description:
          'A 0-100% value for how light a color is. 0% is black, 100% is white, and the most vivid colors sit around 50%.',
      },
      {
        term: '@theme',
        description:
          'The Tailwind CSS v4 directive for defining design tokens in CSS. Writing --color-name-step makes utilities such as bg-name-500 available.',
      },
    ],
  },
};
