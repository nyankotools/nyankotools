import type { Locale } from '../../data/tools';
import type { VisionTypeId } from '../../lib/tools/color-blindness-simulator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ColorBlindnessSimulatorContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  visionLabels: Record<VisionTypeId, string>;
  visionHints: Record<VisionTypeId, string>;
  originalLabel: string;
  severityLabel: string;
  severityNote: string;
  colorHeading: string;
  colorALabel: string;
  colorBLabel: string;
  colorPickerLabel: string;
  contrastLabel: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  colorErrorTemplate: string;
  imageHeading: string;
  dropLabel: string;
  dropHint: string;
  /** `{width}` `{height}` `{size}` を置換 */
  sourceInfoTemplate: string;
  downloadButton: string;
  clearButton: string;
  previewScaledNote: string;
  errorUnsupportedFile: string;
  errorConversionFailed: string;
  /** `{max}` を置換 */
  errorFileTooLargeTemplate: string;
  errorTooManyPixels: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const colorBlindnessSimulatorContent: Record<
  Locale,
  ColorBlindnessSimulatorContent
> = {
  ja: {
    title:
      '色覚シミュレーター（P型・D型・T型・全色盲）画像・カラーコードの見え方確認',
    description:
      '画像やカラーコードが、P型（1型）・D型（2型）・T型（3型）・全色盲の人にどう見えるかを無料でシミュレーション。デザインの色の見分けやすさ確認に。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '色覚シミュレーター（色覚多様性の見え方確認）',
    introHtml:
      '画像を読み込むか、カラーコードを入力するだけで、P型（1型）・D型（2型）・T型（3型）・全色盲の見え方を並べて確認できます。グラフや地図、ボタンの色が見分けられるかのチェックにお使いください。色の組み合わせ自体を考えたい場合は<a href="/tools/color-palette-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カラーパレット生成</a>も便利です。',
    visionLabels: {
      protanopia: 'P型（1型・赤を感じにくい）',
      deuteranopia: 'D型（2型・緑を感じにくい）',
      tritanopia: 'T型（3型・青を感じにくい）',
      achromatopsia: '全色盲（色が見えない）',
    },
    visionHints: {
      protanopia: '赤が暗く、赤と緑・茶の区別がつきにくくなります',
      deuteranopia: '赤と緑・茶・オレンジの区別がつきにくくなります',
      tritanopia: '青と緑、黄とピンクの区別がつきにくくなります',
      achromatopsia: '明るさの違いだけで見える状態です',
    },
    originalLabel: '元の色・画像',
    severityLabel: '程度（P・D・T型）',
    severityNote:
      '100%が完全な2色覚です。小さくすると軽度の色弱（異常3色覚）に近い見え方になります。全色盲には影響しません。',
    colorHeading: 'カラーコードで確認',
    colorALabel: '色A（文字色など）',
    colorBLabel: '色B（背景色など）',
    colorPickerLabel: 'カラーピッカー',
    contrastLabel: 'コントラスト比',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    colorErrorTemplate:
      '{label}はカラーコード（例: #e53935）で入力してください',
    imageHeading: '画像で確認',
    dropLabel: '画像ファイルを選択',
    dropHint: 'ここに画像ファイルをドラッグ＆ドロップすることもできます',
    sourceInfoTemplate: '元画像: {width}×{height}px（{size}）',
    downloadButton: 'PNGで保存',
    clearButton: 'クリア',
    previewScaledNote:
      'プレビューは軽量化のため縮小表示です。保存時は元のサイズで処理します。',
    errorUnsupportedFile:
      '対応していないファイル形式です（PNG/JPEG/WebP/GIF/BMPのみ）',
    errorConversionFailed:
      '処理に失敗しました。ファイルが破損しているか、お使いのブラウザが対応していない可能性があります。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    errorTooManyPixels: '画像の画素数が多すぎます（上限は約4,000万画素）',
    notesHeading: '注意点',
    notes: [
      '結果は研究で使われる標準的な変換モデル（Machado et al. 2009）による近似です。実際の見え方は個人差が大きく、すべての人に当てはまるわけではありません。',
      '色弱の程度は人によって異なります。「程度（P・D・T型）」を下げると軽度の見え方を確認できますが、線形補間による目安です。',
      'ディスプレイの色設定や環境光によっても見え方は変わります。',
      'デザインの最終確認は、色だけに頼らず形・模様・ラベルでも情報が伝わるかを併せて確認してください。',
      '画像はサイズ上限25MB・約4,000万画素までです。保存時は元のサイズで処理するため、大きな画像では数秒かかることがあります。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '「カラーコードで確認」に色を入力するか、「画像で確認」で画像ファイルを選びます（ドラッグ＆ドロップも可能です）。',
      '「程度（P・D・T型）」のスライダーで、見え方の強さを調整します。',
      'P型・D型・T型・全色盲の見え方を、元の色・画像と見比べます。',
      '画像は「PNGで保存」で、見え方ごとに保存できます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'P型・D型・T型',
        description:
          '色を感じる3種類の錐体のうち、どれが働きにくいかによる分類です。P型（1型）は赤、D型（2型）は緑、T型（3型）は青を感じる錐体に特徴があります。日本ではP型・D型が大多数です。',
      },
      {
        term: '2色覚・異常3色覚',
        description:
          '3種類の錐体のうち1つが機能しないのが2色覚、機能はするが感度がずれているのが異常3色覚です。異常3色覚の方が程度は軽い傾向があります。',
      },
      {
        term: '全色盲',
        description:
          '色の区別がほとんどできず、明るさの違いだけで見える状態です。非常にまれです。',
      },
      {
        term: 'コントラスト比',
        description:
          '2色の明るさの比（1〜21）。WCAGでは通常の文字で4.5以上が推奨です。色の違いが見分けにくくても、明るさの差があれば読めます。',
      },
    ],
  },
  en: {
    title: 'Color Blindness Simulator: Protanopia & Deuteranopia',
    description:
      'See how an image or color code looks with protanopia, deuteranopia, tritanopia or total color blindness. Runs in your browser; nothing is uploaded.',
    h1: 'Color Blindness Simulator',
    introHtml:
      'Load an image or type a color code to compare how it appears with protanopia, deuteranopia, tritanopia, and achromatopsia. Use it to check whether chart lines, map colors, or button states can still be told apart. For choosing color combinations, see the <a href="/en/tools/color-palette-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Color Palette Generator</a>.',
    visionLabels: {
      protanopia: 'Protanopia (red-blind)',
      deuteranopia: 'Deuteranopia (green-blind)',
      tritanopia: 'Tritanopia (blue-blind)',
      achromatopsia: 'Achromatopsia (no color)',
    },
    visionHints: {
      protanopia: 'Reds look dark; red, green and brown are hard to separate',
      deuteranopia: 'Red, green, brown and orange are hard to separate',
      tritanopia: 'Blue and green, yellow and pink are hard to separate',
      achromatopsia: 'Only differences in brightness are visible',
    },
    originalLabel: 'Original',
    severityLabel: 'Severity (protan, deutan, tritan)',
    severityNote:
      '100% is full dichromacy. Lower values approximate milder anomalous trichromacy. It does not affect achromatopsia.',
    colorHeading: 'Check a color code',
    colorALabel: 'Color A (e.g. text)',
    colorBLabel: 'Color B (e.g. background)',
    colorPickerLabel: 'Color picker',
    contrastLabel: 'Contrast ratio',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Failed to copy',
    colorErrorTemplate: '{label}: enter a color code such as #e53935',
    imageHeading: 'Check an image',
    dropLabel: 'Choose an image file',
    dropHint: 'You can also drag and drop an image file here',
    sourceInfoTemplate: 'Original: {width}×{height}px ({size})',
    downloadButton: 'Save as PNG',
    clearButton: 'Clear',
    previewScaledNote:
      'The preview is scaled down to stay fast. The saved file is processed at full size.',
    errorUnsupportedFile:
      'Unsupported file type (only PNG, JPEG, WebP, GIF, and BMP)',
    errorConversionFailed:
      'Processing failed. The file may be corrupted, or your browser may not support this format.',
    errorFileTooLargeTemplate: 'This file exceeds the size limit ({max})',
    errorTooManyPixels:
      'This image has too many pixels (limit: about 40 megapixels)',
    notesHeading: 'Notes',
    notes: [
      'Results are an approximation from a standard simulation model (Machado et al. 2009). Real perception varies a lot between people, so this does not match everyone.',
      'The degree of color vision deficiency differs by person. Lowering "Severity (protan, deutan, tritan)" shows milder cases, as a linear interpolation estimate.',
      'Your display settings and ambient light also change how colors look.',
      'For a final design check, make sure information is also conveyed by shape, pattern, or labels, not by color alone.',
      'Images are limited to 25 MB and about 40 megapixels. The saved file is processed at full size, so large images can take a few seconds.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Type colors under "Check a color code", or choose an image file under "Check an image" (drag & drop also works).',
      'Adjust the "Severity (protan, deutan, tritan)" slider.',
      'Compare each simulated view with the original.',
      'For images, click "Save as PNG" under each view to download it.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Protan, deutan, tritan',
        description:
          'Types of color vision deficiency named by which of the three cone cells is affected: protan (red), deutan (green), or tritan (blue). Protan and deutan are by far the most common.',
      },
      {
        term: 'Dichromacy and anomalous trichromacy',
        description:
          'In dichromacy one of the three cone types is missing; in anomalous trichromacy it works but with shifted sensitivity. Anomalous trichromacy is usually milder.',
      },
      {
        term: 'Achromatopsia',
        description:
          'Almost no color discrimination, so the world is seen by brightness alone. It is very rare.',
      },
      {
        term: 'Contrast ratio',
        description:
          'The brightness ratio between two colors (1 to 21). WCAG recommends at least 4.5 for body text. Text stays readable when brightness differs, even if the hues look alike.',
      },
    ],
  },
};
