import type { Locale } from '../../data/tools';

export interface GradientWallpaperPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること */
  introHtml: string;
  typeLabel: string;
  typeOptions: { value: 'linear' | 'radial' | 'conic'; label: string }[];
  countLabel: string;
  stopsHeading: string;
  colorLabelTemplate: string;
  positionLabelTemplate: string;
  angleLabel: string;
  angleDisabledHint: string;
  presetsLabel: string;
  /** SIZE_PRESETS の id ごとの名前 */
  presetNames: Record<string, string>;
  widthLabel: string;
  heightLabel: string;
  noiseLabel: string;
  formatLabel: string;
  previewLabel: string;
  download: string;
  generating: string;
  done: string;
  /** {min} {max} を置換 */
  errorRangeTemplate: string;
  errorInteger: string;
  /** {max} を置換 */
  errorPixelsTemplate: string;
  errorEncode: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const gradientWallpaperContent: Record<
  Locale,
  GradientWallpaperPageContent
> = {
  ja: {
    title: 'グラデーション壁紙作成｜解像度指定でPNG・JPEG保存',
    description:
      'グラデーションの壁紙・背景画像を解像度指定でPNG・JPEGとして保存できる無料ツール。線形・放射・円錐、2〜5色、粒状ノイズに対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'グラデーション壁紙・背景画像ジェネレーター',
    introHtml:
      'スマホやPCの壁紙、スライドの背景に使えるグラデーション画像を、解像度を指定して作成できます。CSSのコードが欲しい場合は<a href="/tools/css-gradient-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSSグラデーションジェネレーター</a>、単色のダミー画像は<a href="/tools/placeholder-image-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ダミー画像生成</a>をご利用ください。',
    typeLabel: 'グラデーションの種類',
    typeOptions: [
      { value: 'linear', label: '線形' },
      { value: 'radial', label: '放射（円形）' },
      { value: 'conic', label: '円錐' },
    ],
    countLabel: '色の数',
    stopsHeading: '色と位置',
    colorLabelTemplate: '色{n}',
    positionLabelTemplate: '色{n}の位置（%）',
    angleLabel: '角度（°）',
    angleDisabledHint: '放射では角度は使いません',
    presetsLabel: '解像度のプリセット',
    presetNames: {
      phone: 'スマホ',
      'phone-hd': 'スマホ(高解像度)',
      tablet: 'タブレット',
      fhd: 'フルHD',
      qhd: 'WQHD',
      '4k': '4K',
      square: '正方形',
    },
    widthLabel: '幅（px）',
    heightLabel: '高さ（px）',
    noiseLabel: 'ノイズ（粒状感）',
    formatLabel: '形式',
    previewLabel: 'プレビュー',
    download: 'ダウンロード',
    generating: '生成中…',
    done: '保存しました',
    errorRangeTemplate: '幅・高さは{min}〜{max}の整数で入力してください。',
    errorInteger: '幅・高さは整数で入力してください。',
    errorPixelsTemplate:
      '画素数が多すぎます。幅×高さが{max}ピクセル以下になるようにしてください。',
    errorEncode: '画像の生成に失敗しました。解像度を下げて再度お試しください。',
    howToHeading: '使い方',
    howToSteps: [
      '「グラデーションの種類」と「色の数」を選び、各色と位置を調整します。',
      '「解像度のプリセット」から選ぶか、幅と高さを直接入力します。',
      '必要なら「ノイズ（粒状感）」を上げ、形式を選びます。',
      '「ダウンロード」を押すと、指定した解像度の画像が保存されます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '幅・高さは16〜8192pxで、幅×高さは約1677万ピクセル（4Kは約830万）までです。ブラウザのCanvas上限を避けるための制限です。',
      'プレビューは縮小表示です。ダウンロード時に指定した解像度で描き直します。',
      '帯状の段差（バンディング）が気になる場合は、ノイズを少し加えると目立ちにくくなります。',
      'JPEGは透過に対応せず、グラデーション画像ではPNGより軽くなることが多い一方、わずかに劣化します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'バンディング',
        description:
          'なめらかなはずのグラデーションに、色の段差が縞状に見える現象です。ごく小さなノイズを加えると目立たなくなります。',
      },
      {
        term: '円錐グラデーション',
        description:
          '中心を軸に、角度に沿って色が一周するグラデーションです。CSSのconic-gradientと同じ考え方で、色相環のような表現に向きます。',
      },
    ],
  },
  en: {
    title: 'Gradient Wallpaper Generator – Custom Resolution PNG',
    description:
      'Make gradient wallpapers and backgrounds at any resolution and save as PNG or JPEG. Linear, radial and conic, 2-5 colors, optional grain. Runs in your browser.',
    h1: 'Gradient Wallpaper & Background Image Generator',
    introHtml:
      'Create gradient images for phone or desktop wallpapers and slide backgrounds at the exact resolution you need. If you want CSS code instead, use the <a href="/en/tools/css-gradient-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS Gradient Generator</a>; for flat dummy images, try the <a href="/en/tools/placeholder-image-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Placeholder Image Generator</a>.',
    typeLabel: 'Gradient type',
    typeOptions: [
      { value: 'linear', label: 'Linear' },
      { value: 'radial', label: 'Radial' },
      { value: 'conic', label: 'Conic' },
    ],
    countLabel: 'Number of colors',
    stopsHeading: 'Colors and positions',
    colorLabelTemplate: 'Color {n}',
    positionLabelTemplate: 'Color {n} position (%)',
    angleLabel: 'Angle (°)',
    angleDisabledHint: 'Angle is not used for radial gradients',
    presetsLabel: 'Resolution presets',
    presetNames: {
      phone: 'Phone',
      'phone-hd': 'Phone (high-res)',
      tablet: 'Tablet',
      fhd: 'Full HD',
      qhd: 'QHD',
      '4k': '4K',
      square: 'Square',
    },
    widthLabel: 'Width (px)',
    heightLabel: 'Height (px)',
    noiseLabel: 'Noise (grain)',
    formatLabel: 'Format',
    previewLabel: 'Preview',
    download: 'Download',
    generating: 'Generating…',
    done: 'Saved',
    errorRangeTemplate:
      'Enter whole numbers from {min} to {max} for width and height.',
    errorInteger: 'Width and height must be whole numbers.',
    errorPixelsTemplate:
      'Too many pixels. Keep width × height at or below {max} pixels.',
    errorEncode: 'Could not generate the image. Try a lower resolution.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a "Gradient type" and the "Number of colors", then adjust each color and position.',
      'Pick one of the "Resolution presets", or type the width and height yourself.',
      'Raise "Noise (grain)" if you like, and choose a format.',
      'Press "Download" to save the image at the resolution you set.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Width and height must be 16 to 8192 px, and width × height is capped at about 16.7 million pixels (4K is about 8.3 million) to stay within browser canvas limits.',
      'The preview is scaled down. The image is redrawn at full resolution when you download it.',
      'If you see visible bands (banding), adding a little noise makes them much less noticeable.',
      'JPEG has no transparency and is often smaller than PNG for gradients, but it is slightly lossy.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Banding',
        description:
          'Visible stripes of color steps in what should be a smooth gradient. A tiny amount of noise hides them.',
      },
      {
        term: 'Conic gradient',
        description:
          'A gradient where colors sweep around a center point by angle, like CSS conic-gradient. Good for color-wheel style looks.',
      },
    ],
  },
};
