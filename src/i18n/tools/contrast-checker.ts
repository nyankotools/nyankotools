import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface ContrastResultRow {
  id: 'normalAA' | 'normalAAA' | 'largeAA' | 'largeAAA';
  label: string;
}

export interface ContrastCheckerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  foregroundLabel: string;
  backgroundLabel: string;
  colorPlaceholder: string;
  foregroundPickerAriaLabel: string;
  backgroundPickerAriaLabel: string;
  swapLabel: string;
  colorError: string;
  ratioLabel: string;
  previewHeading: string;
  previewLargeText: string;
  previewNormalText: string;
  resultsHeading: string;
  results: ContrastResultRow[];
  pass: string;
  fail: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const contrastCheckerContent: Record<
  Locale,
  ContrastCheckerPageContent
> = {
  ja: {
    title: '色のコントラスト比チェッカー（WCAG）',
    description:
      '文字色と背景色のコントラスト比を計算し、WCAG（Web Content Accessibility Guidelines）のAA/AAA基準に適合するか判定できる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '色のコントラスト比チェッカー（WCAG）',
    introHtml:
      '文字色と背景色を入力すると、WCAG 2.x基準のコントラスト比をリアルタイムで計算し、レベルAA・AAAの通常テキスト・大きな文字それぞれに適合するかを判定します。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。カラーコードの形式変換には <a href="/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カラーコード変換</a> もあわせてご利用ください。',
    foregroundLabel: '文字色',
    backgroundLabel: '背景色',
    colorPlaceholder: '#333333',
    foregroundPickerAriaLabel: '文字色のカラーピッカー',
    backgroundPickerAriaLabel: '背景色のカラーピッカー',
    swapLabel: '文字色と背景色を入れ替え',
    colorError: '色の形式が正しくありません（例: #333333, rgb(51, 51, 51)）',
    ratioLabel: 'コントラスト比',
    previewHeading: 'プレビュー',
    previewLargeText: '大きな文字のサンプル',
    previewNormalText:
      'これは通常サイズの文字のサンプルです。実際の見え方を確認できます。',
    resultsHeading: '判定結果',
    results: [
      { id: 'normalAA', label: '通常テキスト・レベルAA（4.5:1以上）' },
      { id: 'normalAAA', label: '通常テキスト・レベルAAA（7:1以上）' },
      { id: 'largeAA', label: '大きな文字・レベルAA（3:1以上）' },
      { id: 'largeAAA', label: '大きな文字・レベルAAA（4.5:1以上）' },
    ],
    pass: '適合',
    fail: '不適合',
    notesHeading: '注意事項',
    notes: [
      '色は「#333333」のようなHEX形式、または「rgb(51, 51, 51)」「51, 51, 51」のようなRGB形式で入力できます。',
      '「大きな文字」の基準は、太字で18pt（24px）以上、または通常の太さで14pt（約18.66px）以上の文字を指します。',
      '判定はWCAG 2.x（2.0〜2.2共通）のコントラスト比の計算式に基づきます。次期WCAG 3で検討されているAPCAなど、新しい算出方式には対応していません。',
      '透明度（アルファ値）には対応していません。rgba()形式を入力した場合はアルファ値を無視して計算します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'コントラスト比',
        description:
          '2つの色の明るさの差を1:1〜21:1の数値で表したものです。値が大きいほど、文字と背景の色の差がはっきりしていて読みやすいことを示します。',
      },
      {
        term: 'WCAG（Web Content Accessibility Guidelines）',
        description:
          'W3Cが策定する、Webコンテンツをより多くの人にとって利用しやすくするための達成基準です。日本ではJIS X 8341-3の基礎にもなっています。',
      },
      {
        term: 'レベルAA / AAA',
        description:
          'WCAGの達成基準には3段階（A・AA・AAA）があります。多くのWebサイトはAAへの準拠を目標とし、AAAはより厳しい基準です。',
      },
      {
        term: '大きな文字（Large Text）',
        description:
          'WCAGにおいて、太字で18pt（24px）以上、または通常の太さで14pt（約18.66px）以上の文字のことです。大きな文字は小さな文字より視認性が高いため、コントラスト比の基準がやや緩やかになります。',
      },
    ],
  },
  en: {
    title: 'Color Contrast Checker (WCAG)',
    description:
      'A free tool that calculates the contrast ratio between text and background colors and checks it against the WCAG (Web Content Accessibility Guidelines) AA/AAA levels. Your data is processed in the browser and never sent to a server.',
    h1: 'Color Contrast Checker (WCAG)',
    introHtml:
      'Enter a text color and a background color to calculate the WCAG 2.x contrast ratio in real time, and see whether it meets level AA or AAA for normal text and large text. Everything happens in your browser, and nothing you type is ever sent to a server. Need to convert a color code format? Check out the <a href="/en/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Color Converter</a> as well.',
    foregroundLabel: 'Text color',
    backgroundLabel: 'Background color',
    colorPlaceholder: '#333333',
    foregroundPickerAriaLabel: 'Text color picker',
    backgroundPickerAriaLabel: 'Background color picker',
    swapLabel: 'Swap text and background colors',
    colorError: 'Invalid color format (e.g. #333333, rgb(51, 51, 51))',
    ratioLabel: 'Contrast ratio',
    previewHeading: 'Preview',
    previewLargeText: 'Sample large text',
    previewNormalText:
      'This is a sample of normal-sized text so you can check how it actually looks.',
    resultsHeading: 'Results',
    results: [
      { id: 'normalAA', label: 'Normal text, Level AA (4.5:1 or higher)' },
      { id: 'normalAAA', label: 'Normal text, Level AAA (7:1 or higher)' },
      { id: 'largeAA', label: 'Large text, Level AA (3:1 or higher)' },
      { id: 'largeAAA', label: 'Large text, Level AAA (4.5:1 or higher)' },
    ],
    pass: 'Pass',
    fail: 'Fail',
    notesHeading: 'Notes',
    notes: [
      'Colors can be entered in HEX format like "#333333", or RGB format like "rgb(51, 51, 51)" or "51, 51, 51".',
      '"Large text" means bold text at 18pt (24px) or larger, or regular-weight text at 14pt (about 18.66px) or larger.',
      'Results follow the contrast ratio formula shared by WCAG 2.0 through 2.2. Newer methods being explored for WCAG 3, such as APCA, are not supported.',
      'Transparency (alpha) is not supported. If you enter an rgba() value, the alpha component is ignored during calculation.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Contrast ratio',
        description:
          'A number from 1:1 to 21:1 representing the difference in brightness between two colors. A higher value means the text and background are more clearly distinguishable.',
      },
      {
        term: 'WCAG (Web Content Accessibility Guidelines)',
        description:
          'A set of success criteria published by the W3C for making web content more accessible to a wider range of people.',
      },
      {
        term: 'Level AA / AAA',
        description:
          'WCAG success criteria come in three levels: A, AA, and AAA. Most websites target AA conformance, while AAA is a stricter standard.',
      },
      {
        term: 'Large text',
        description:
          'In WCAG, text that is bold at 18pt (24px) or larger, or regular weight at 14pt (about 18.66px) or larger. Because large text is easier to read than small text, its contrast ratio requirement is slightly relaxed.',
      },
    ],
  },
};
