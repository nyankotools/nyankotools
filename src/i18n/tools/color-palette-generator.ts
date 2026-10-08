import type { Locale } from '../../data/tools';
import type { HarmonyType } from '../../lib/tools/color-palette-generator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ColorPaletteGeneratorPageContent {
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
  harmonyLabel: string;
  harmonies: Record<HarmonyType, string>;
  paletteHeading: string;
  swatchAction: string;
  cssLabel: string;
  jsonLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const colorPaletteGeneratorContent: Record<
  Locale,
  ColorPaletteGeneratorPageContent
> = {
  ja: {
    title: '配色パレットジェネレーター（補色・類似色・トライアド）',
    description:
      '基準色から補色・類似色・トライアド・分裂補色・テトラードなどの配色パレットを自動生成し、HEXコードやCSS変数・JSONでコピーできる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '配色パレットジェネレーター（補色・類似色・トライアド）',
    introHtml:
      '基準色を1色選ぶだけで、補色・類似色・トライアド・分裂補色・テトラード・スクエア・モノクロマティックの配色を作れます。色のHEXコードはクリックでコピーでき、パレット全体をCSS変数やJSONとして書き出せます。ブラウザ内で処理され、サーバーには送信されません。色の形式変換は <a href="/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カラーコード変換</a>、色の組み合わせの見やすさは <a href="/tools/contrast-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">コントラスト比チェッカー</a> で確認できます。',
    howToHeading: '使い方',
    howToSteps: [
      'カラーピッカーかHEX欄で基準色を決めます。',
      '配色の種類（補色・トライアドなど）を選びます。',
      '表示された色をクリックしてHEXをコピー、またはCSS変数・JSONをまとめてコピーします。',
    ],
    pickerAriaLabel: '基準色のカラーピッカー',
    hexLabel: '基準色（HEX）',
    hexPlaceholder: '#3b82f6',
    hexError: 'HEXの形式が正しくありません（例: #3b82f6）',
    harmonyLabel: '配色の種類',
    harmonies: {
      complementary: '補色（2色）',
      analogous: '類似色（3色）',
      triadic: 'トライアド（3色）',
      'split-complementary': '分裂補色（3色）',
      tetradic: 'テトラード（4色）',
      square: 'スクエア（4色）',
      monochromatic: 'モノクロマティック（5色）',
    },
    paletteHeading: 'パレット',
    swatchAction: 'をコピー',
    cssLabel: 'CSS変数',
    jsonLabel: 'JSON',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '配色はHSL色空間で色相を回転させて計算しています。見た目の明るさは色によって異なるため、実際の使用前にコントラストを確認してください。',
      '類似色は基準色の前後30度、モノクロマティックは基準色の色相・彩度のまま明度を5段階に変えた色です。',
      '彩度のないグレー系の色では、色相を回転しても同じ色になります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '補色',
        description:
          '色相環で正反対（180度）に位置する色の組み合わせです。強いコントラストを生みます。',
      },
      {
        term: '類似色',
        description:
          '色相環で隣り合う色の組み合わせです。まとまりがあり穏やかな印象になります。',
      },
      {
        term: 'トライアド',
        description:
          '色相環を3等分（120度ずつ）した3色の組み合わせです。バランスよく華やかになります。',
      },
      {
        term: '分裂補色',
        description:
          '基準色と、その補色の両隣（150度・210度）の色を組み合わせた配色です。補色より穏やかなコントラストになります。',
      },
      {
        term: 'テトラード / スクエア',
        description:
          'テトラードは色相環上の長方形（0・60・180・240度）、スクエアは正方形（0・90・180・270度）を成す4色の配色です。',
      },
    ],
  },
  en: {
    title: 'Color Palette Generator (Complementary, Analogous, Triadic)',
    description:
      'Generate complementary, analogous, triadic and other color schemes from one base color. Copy HEX, CSS variables or JSON. Runs entirely in your browser.',
    h1: 'Color Palette Generator (Complementary, Analogous, Triadic)',
    introHtml:
      'Pick one base color and get a matching palette: complementary, analogous, triadic, split-complementary, tetradic, square or monochromatic. Click any swatch to copy its HEX code, or export the whole palette as CSS variables or JSON. Everything runs in your browser, and nothing is sent to a server. Need to convert formats? Use the <a href="/en/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Color Converter</a>. To check whether the colors are readable together, try the <a href="/en/tools/contrast-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Contrast Checker</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a base color with the color picker or the HEX field.',
      'Select a harmony type such as complementary or triadic.',
      'Click a swatch to copy its HEX, or copy the CSS variables or JSON for the whole palette.',
    ],
    pickerAriaLabel: 'Base color picker',
    hexLabel: 'Base color (HEX)',
    hexPlaceholder: '#3b82f6',
    hexError: 'Invalid HEX format (e.g. #3b82f6)',
    harmonyLabel: 'Harmony type',
    harmonies: {
      complementary: 'Complementary (2)',
      analogous: 'Analogous (3)',
      triadic: 'Triadic (3)',
      'split-complementary': 'Split-complementary (3)',
      tetradic: 'Tetradic (4)',
      square: 'Square (4)',
      monochromatic: 'Monochromatic (5)',
    },
    paletteHeading: 'Palette',
    swatchAction: ': copy',
    cssLabel: 'CSS variables',
    jsonLabel: 'JSON',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Schemes are calculated by rotating the hue in the HSL color space. Perceived brightness differs between hues, so check the contrast before using a palette.',
      'Analogous colors sit 30 degrees either side of the base color. Monochromatic keeps the base hue and saturation and varies lightness in five steps.',
      'Gray colors have no saturation, so rotating the hue gives the same color.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Complementary',
        description:
          'Two colors directly opposite each other (180 degrees) on the color wheel. They create strong contrast.',
      },
      {
        term: 'Analogous',
        description:
          'Colors that sit next to each other on the color wheel. They feel cohesive and calm.',
      },
      {
        term: 'Triadic',
        description:
          'Three colors spaced evenly (120 degrees apart) around the color wheel. Balanced and vibrant.',
      },
      {
        term: 'Split-complementary',
        description:
          'A base color plus the two colors on either side of its complement (150 and 210 degrees). Softer contrast than a plain complement.',
      },
      {
        term: 'Tetradic / Square',
        description:
          'Four-color schemes: tetradic forms a rectangle on the wheel (0, 60, 180, 240 degrees), square forms a square (0, 90, 180, 270 degrees).',
      },
    ],
  },
};
