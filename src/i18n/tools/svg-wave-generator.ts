import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SvgWaveGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  kindLabel: string;
  kindWave: string;
  kindBlob: string;
  heightLabel: string;
  amplitudeLabel: string;
  wavesLabel: string;
  sideLabel: string;
  sideBottom: string;
  sideTop: string;
  pointsLabel: string;
  randomnessLabel: string;
  seedLabel: string;
  randomButton: string;
  colorLabel: string;
  previewHeading: string;
  svgHeading: string;
  cssHeading: string;
  copySvgButton: string;
  copyCssButton: string;
  downloadButton: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const codeClass =
  'class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800"';
const linkClass =
  'class="text-blue-700 underline hover:no-underline dark:text-blue-400"';

export const svgWaveGeneratorContent: Record<
  Locale,
  SvgWaveGeneratorPageContent
> = {
  ja: {
    title: 'SVG波・ブロブジェネレーター（セクション区切りの背景を作成）',
    description:
      'セクション区切りの波形や、有機的なブロブ（ゆるい丸）をSVGで作れる無料ツールです。山の数・振幅・ランダム性・色を調整し、シード値で同じ形を再現できます。SVGコードとCSS背景をコピー、SVGファイルのダウンロードも可能。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'SVG波・ブロブジェネレーター',
    introHtml: `Webページのセクション区切りに使える<strong>波形</strong>と、背景装飾に使える<strong>ブロブ（有機的な図形）</strong>をSVGで作ります。山の数・振幅・ランダム性・色を調整するだけで、<code ${codeClass}>&lt;svg&gt;</code>コードやCSSの背景画像を出力できます。シード値を覚えておけば、同じ形をいつでも再現できます。グラデーションの背景は <a href="/tools/css-gradient-generator/" ${linkClass}>CSSグラデーションジェネレーター</a>、SVGの軽量化は <a href="/tools/svg-optimizer/" ${linkClass}>SVG最適化ツール</a> もご利用ください。`,
    howToHeading: '使い方',
    howToSteps: [
      '「形」で波かブロブを選びます。',
      '山の数・波の大きさ・ランダム性・色などを調整します。気に入る形が出るまで「ランダム生成」を押します。',
      '「SVGをコピー」またはCSSをコピーして貼り付けるか、「SVGをダウンロード」で保存します。',
    ],
    kindLabel: '形',
    kindWave: '波（セクション区切り）',
    kindBlob: 'ブロブ（有機的な図形）',
    heightLabel: '高さ（px）',
    amplitudeLabel: '波の大きさ（%）',
    wavesLabel: '山の数',
    sideLabel: '塗りつぶす側',
    sideBottom: '下側',
    sideTop: '上側',
    pointsLabel: '頂点数',
    randomnessLabel: 'ランダム性（%）',
    seedLabel: 'シード',
    randomButton: 'ランダム生成',
    colorLabel: '色',
    previewHeading: 'プレビュー',
    svgHeading: 'SVGコード',
    cssHeading: 'CSS（背景画像）',
    copySvgButton: 'SVGをコピー',
    copyCssButton: 'CSSをコピー',
    downloadButton: 'SVGをダウンロード',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '波は横1440pxを基準にしたviewBoxで、preserveAspectRatio="none"により横幅いっぱいに引き伸ばして使う想定です。引き伸ばすため、縦横比は表示サイズに合わせて変わります。',
      '同じシード・同じ設定なら、いつでも同じ形になります。ランダム性を0%にすると、シードに関係なく規則的な波・円になります。',
      '山の数は1〜8、ブロブの頂点数は3〜16、高さは100〜600pxの範囲です。範囲外の値は自動で丸められます。',
      'CSS背景はSVGをdata URIとして埋め込みます。色を変えたい場合は、このツールで再生成してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ブロブ（blob）',
        description:
          '円をゆがめたような、角のない有機的な形。背景の装飾やアバターの枠などに使われる。',
      },
      {
        term: 'シード（seed）',
        description:
          '乱数の出発点となる数値。同じシードからは必ず同じ乱数列が作られるため、ランダムな形でも再現できる。',
      },
      {
        term: 'viewBox',
        description:
          'SVGの座標系の範囲を指定する属性。表示サイズに関係なく、この範囲が拡大縮小されて描画される。',
      },
      {
        term: 'ベジェ曲線',
        description:
          '制御点で形を決める滑らかな曲線。SVGのpathではCコマンドで3次ベジェ曲線を描く。',
      },
    ],
  },
  en: {
    title: 'SVG Wave & Blob Generator – Dividers and Shapes',
    description:
      'Generate SVG wave dividers and organic blobs. Adjust waves, amplitude, randomness and color; reproduce with a seed. Runs in your browser; nothing is uploaded.',
    h1: 'SVG Wave & Blob Generator',
    introHtml: `Create a <strong>wave</strong> for section dividers or an organic <strong>blob</strong> for background decoration as SVG. Tweak the number of waves, amplitude, randomness and color, then copy the <code ${codeClass}>&lt;svg&gt;</code> code or a CSS background image. Keep the seed to bring back the exact same shape later. For gradient backgrounds, try the <a href="/en/tools/css-gradient-generator/" ${linkClass}>CSS Gradient Generator</a>, and to slim down SVG files see the <a href="/en/tools/svg-optimizer/" ${linkClass}>SVG Optimizer</a>.`,
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a wave or a blob in "Shape".',
      'Adjust the waves, amplitude, randomness and color. Press "Randomize" until you like the result.',
      'Press "Copy SVG" or copy the CSS, or save the file with "Download SVG".',
    ],
    kindLabel: 'Shape',
    kindWave: 'Wave (section divider)',
    kindBlob: 'Blob (organic shape)',
    heightLabel: 'Height (px)',
    amplitudeLabel: 'Wave size (%)',
    wavesLabel: 'Number of waves',
    sideLabel: 'Fill side',
    sideBottom: 'Bottom',
    sideTop: 'Top',
    pointsLabel: 'Points',
    randomnessLabel: 'Randomness (%)',
    seedLabel: 'Seed',
    randomButton: 'Randomize',
    colorLabel: 'Color',
    previewHeading: 'Preview',
    svgHeading: 'SVG code',
    cssHeading: 'CSS (background image)',
    copySvgButton: 'Copy SVG',
    copyCssButton: 'Copy CSS',
    downloadButton: 'Download SVG',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Waves use a 1440px-wide viewBox with preserveAspectRatio set to none, so they are meant to be stretched to the full width. The aspect ratio therefore follows the size you display it at.',
      'The same seed and settings always give the same shape. At 0% randomness you get a regular wave or circle regardless of the seed.',
      'Waves range from 1 to 8, blob points from 3 to 16 and height from 100 to 600px. Out-of-range values are rounded automatically.',
      'The CSS background embeds the SVG as a data URI. To change the color, generate it again with this tool.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Blob',
        description:
          'A rounded, corner-free organic shape, like a distorted circle. Used for background decoration and avatar frames.',
      },
      {
        term: 'Seed',
        description:
          'The starting number of a random sequence. The same seed always produces the same sequence, so a random shape can be reproduced.',
      },
      {
        term: 'viewBox',
        description:
          'The SVG attribute that defines the coordinate area. That area is scaled to fit whatever size the SVG is displayed at.',
      },
      {
        term: 'Bézier curve',
        description:
          'A smooth curve defined by control points. In an SVG path, the C command draws a cubic Bézier curve.',
      },
    ],
  },
};
