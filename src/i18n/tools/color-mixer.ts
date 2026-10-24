import type { Locale } from '../../data/tools';
import type { MixSpace } from '../../lib/tools/color-mixer';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ColorMixerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  colorALabel: string;
  colorBLabel: string;
  pickerAAriaLabel: string;
  pickerBAriaLabel: string;
  hexPlaceholder: string;
  hexError: string;
  ratioLabel: string;
  spaceLabel: string;
  spaces: Record<MixSpace, string>;
  stepsLabel: string;
  mixedHeading: string;
  stepsHeading: string;
  swatchAction: string;
  cssLabel: string;
  listLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const colorMixerContent: Record<Locale, ColorMixerPageContent> = {
  ja: {
    title: '色ミキサー（2色の混色・中間色を生成）',
    description:
      '2色を割合を指定して混ぜ、RGBまたはOKLabで混色結果と中間色N段を生成します。HEXやCSS変数でコピーできる無料ツール。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '色ミキサー（2色の混色・中間色を生成）',
    introHtml:
      '2つの色を好きな割合で混ぜた色と、2色の間をなめらかにつなぐ中間色を作れます。混ぜ方はRGB（数値をそのまま平均）とOKLab（見た目の明るさが自然につながる）から選べます。結果はクリックでHEXをコピーでき、CSS変数としてもまとめて書き出せます。ブラウザ内で処理され、サーバーには送信されません。配色の提案は <a href="/tools/color-palette-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">配色パレットジェネレーター</a>、OKLabなど色空間の変換は <a href="/tools/color-space-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">色空間変換</a> が使えます。',
    howToHeading: '使い方',
    howToSteps: [
      '「色A」と「色B」をカラーピッカーかHEX欄で決めます。',
      '「色Bの割合」のスライダーで混ぜる割合を決め、「混色方法」を選びます。',
      '「中間色の数」を指定すると、2色の間の色が等間隔に並びます。',
      '色をクリックしてHEXをコピー、またはCSS変数・HEX一覧をまとめてコピーします。',
    ],
    colorALabel: '色A',
    colorBLabel: '色B',
    pickerAAriaLabel: '色Aのカラーピッカー',
    pickerBAriaLabel: '色Bのカラーピッカー',
    hexPlaceholder: '#3b82f6',
    hexError: 'HEXの形式が正しくありません（例: #3b82f6）',
    ratioLabel: '色Bの割合',
    spaceLabel: '混色方法',
    spaces: {
      rgb: 'RGB（数値をそのまま平均）',
      oklab: 'OKLab（見た目が自然）',
    },
    stepsLabel: '中間色の数',
    mixedHeading: '混色結果',
    stepsHeading: '中間色',
    swatchAction: 'をコピー',
    cssLabel: 'CSS変数',
    listLabel: 'HEX一覧',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      'RGBの混色はsRGBの数値をそのまま線形に補間します。補色同士を混ぜると、くすんだ灰色寄りの色になりやすい点に注意してください。',
      'OKLabの混色は知覚的な明るさに基づく色空間で補間するため、明るさの変化がなめらかになります。結果はsRGBの範囲に丸められます。',
      '中間色の数には両端の色A・色Bも含まれます（2〜21段）。色Bの割合は混色結果にだけ使われます。',
      '実際の絵の具や印刷インクの混色とは結果が異なります。画面上の色の計算です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'OKLab',
        description:
          '人間の見た目の明るさ・色の差に近くなるよう設計された色空間です。2色の間を補間したときに、明るさや色味がなめらかに変化します。',
      },
      {
        term: '中間色',
        description:
          '2つの色の間を等間隔でつなぐ色のことです。グラデーションの途中の色として使えます。',
      },
      {
        term: '加法混色',
        description:
          '光の三原色（赤・緑・青）の値を足し合わせる混色です。ディスプレイの色はこちらの考え方で、絵の具のような減法混色とは結果が違います。',
      },
    ],
  },
  en: {
    title: 'Color Mixer - Blend Two Colors, Generate Mid Shades',
    description:
      'Mix two colors by ratio in RGB or OKLab and generate N intermediate shades. Copy HEX or CSS variables. Runs in your browser; nothing is uploaded.',
    h1: 'Color Mixer: Blend Two Colors and Generate Intermediate Shades',
    introHtml:
      'Blend two colors at any ratio and generate the shades that step smoothly between them. Choose RGB (plain averaging of the values) or OKLab (perceptually even lightness). Click a result to copy its HEX code, or export the steps as CSS variables. Everything runs in your browser, and nothing is sent to a server. For harmonious schemes, try the <a href="/en/tools/color-palette-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Color Palette Generator</a>; to convert to OKLab and other spaces, use the <a href="/en/tools/color-space-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Color Space Converter</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Set "Color A" and "Color B" with the color pickers or the HEX fields.',
      'Drag "Ratio of color B" to set the mix, and pick a "Mix method".',
      'Set "Number of steps" to get evenly spaced colors between the two.',
      'Click a color to copy its HEX, or copy all steps as CSS variables or a HEX list.',
    ],
    colorALabel: 'Color A',
    colorBLabel: 'Color B',
    pickerAAriaLabel: 'Color A picker',
    pickerBAriaLabel: 'Color B picker',
    hexPlaceholder: '#3b82f6',
    hexError: 'Invalid HEX format (e.g. #3b82f6)',
    ratioLabel: 'Ratio of color B',
    spaceLabel: 'Mix method',
    spaces: {
      rgb: 'RGB (plain average)',
      oklab: 'OKLab (perceptually even)',
    },
    stepsLabel: 'Number of steps',
    mixedHeading: 'Mixed color',
    stepsHeading: 'Intermediate shades',
    swatchAction: ': copy',
    cssLabel: 'CSS variables',
    listLabel: 'HEX list',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'RGB mixing interpolates the sRGB values linearly. Mixing opposite colors tends to give a dull, grayish result.',
      'OKLab mixing interpolates in a perceptual color space, so lightness changes more smoothly. Results are clipped to the sRGB range.',
      'The number of steps includes both ends, color A and color B (2 to 21). The ratio only affects the mixed color.',
      'This is an on-screen calculation and will not match physically mixing paints or printing inks.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'OKLab',
        description:
          'A color space designed to match how people see lightness and color differences. Interpolating in it keeps lightness and hue changes smooth.',
      },
      {
        term: 'Intermediate shades',
        description:
          'Colors placed at even intervals between two endpoints. Useful as the in-between stops of a gradient.',
      },
      {
        term: 'Additive mixing',
        description:
          'Mixing by adding red, green and blue light values. Screens work this way, which differs from subtractive mixing with paints.',
      },
    ],
  },
};
