import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface PxRemConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  baseFontSizeLabel: string;
  baseFontSizeHint: string;
  pxLabel: string;
  remLabel: string;
  pxPlaceholder: string;
  remPlaceholder: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  errorInvalidPx: string;
  errorInvalidRem: string;
  errorInvalidBaseFontSize: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const pxRemConverterContent: Record<Locale, PxRemConverterPageContent> =
  {
    ja: {
      title: 'px⇔rem変換ツール｜ベースフォントサイズ指定対応',
      description:
        'pxとremの値をリアルタイムに相互変換する無料ツールです。ベースフォントサイズ（デフォルト16px）を自由に指定でき、CSSのフォントサイズ・余白などの単位換算に使えます。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: 'px⇔rem変換ツール',
      introHtml:
        'ベースフォントサイズ（通常はhtml要素のfont-size、デフォルト16px）を指定したうえで、pxまたはremのどちらかの欄に数値を入力すると、もう一方の欄にリアルタイムに変換結果を表示します。CSSのfont-size・margin・paddingなどをpx指定からrem指定に置き換える際の換算に便利です。CSSの単位そのものについては <a href="/tools/css-gradient-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSSグラデーションジェネレーター</a> など他のCSS系ツールもあわせてご利用ください。',
      baseFontSizeLabel: 'ベースフォントサイズ（px）',
      baseFontSizeHint:
        '通常はhtml要素に設定されているfont-size（多くのブラウザの初期値は16px）を指定します。',
      pxLabel: 'px',
      remLabel: 'rem',
      pxPlaceholder: '16',
      remPlaceholder: '1',
      copyButton: 'コピー',
      copied: 'コピーしました',
      copyFailed: 'コピーに失敗しました',
      errorInvalidPx: 'pxの値が数値として無効です',
      errorInvalidRem: 'remの値が数値として無効です',
      errorInvalidBaseFontSize:
        'ベースフォントサイズは0より大きい数値で指定してください',
      notesHeading: '注意事項',
      notes: [
        'remはベースフォントサイズ（通常はhtml要素のfont-size）を基準にした相対単位です。ベースフォントサイズを変更すると、同じrem値でも実際のpxサイズが変わります。',
        'ベースフォントサイズを変更すると、既に入力済みのpx・rem欄の値も新しいベースフォントサイズで再計算されます。',
        '計算結果は小数第5位で丸めて表示します。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'rem（root em）',
          description:
            'ルート要素（html要素）のfont-sizeを基準とする相対単位。ブラウザの初期設定では1rem=16pxですが、html要素のfont-sizeを変更するとその倍率に応じて実際のサイズも変わります。親要素のフォントサイズに影響される em と異なり、常にルート要素を基準にするため、入れ子になったコンポーネントでもサイズが予測しやすいという利点があります。',
        },
        {
          term: 'px（pixel）',
          description:
            '画面上の1ピクセルを基準とする絶対単位（CSSピクセル）。ユーザーがブラウザの文字サイズ設定を変更しても、px指定の要素サイズは変化しません。',
        },
        {
          term: 'ベースフォントサイズ',
          description:
            'rem・emなどの相対単位の基準となるフォントサイズ。remの場合はhtml要素に設定されたfont-sizeを指します。ブラウザの初期値は16pxですが、CSSで変更することも、ユーザーがブラウザ設定で変更することもできます。',
        },
      ],
    },
    en: {
      title: 'px to rem Converter | Custom Base Font Size',
      description:
        'Convert between px and rem instantly with this free tool. Set a custom base font size (16px by default) to match your CSS, useful for converting font sizes, margins, and padding. Your data is processed in the browser and never sent to a server.',
      h1: 'px to rem Converter',
      introHtml:
        'Set a base font size (usually the font-size on the html element, 16px by default), then type a value into either the px or rem field and the other field updates instantly. Handy when converting CSS font-size, margin, or padding values from px to rem. See also the other CSS tools such as the <a href="/en/tools/css-gradient-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS Gradient Generator</a>.',
      baseFontSizeLabel: 'Base font size (px)',
      baseFontSizeHint:
        "Usually the font-size set on the html element (16px in most browsers' default stylesheet).",
      pxLabel: 'px',
      remLabel: 'rem',
      pxPlaceholder: '16',
      remPlaceholder: '1',
      copyButton: 'Copy',
      copied: 'Copied',
      copyFailed: 'Copy failed',
      errorInvalidPx: 'The px value is not a valid number',
      errorInvalidRem: 'The rem value is not a valid number',
      errorInvalidBaseFontSize:
        'The base font size must be a number greater than 0',
      notesHeading: 'Notes',
      notes: [
        'rem is relative to the base font size (usually the font-size on the html element). Changing the base font size changes the actual px size for the same rem value.',
        'Changing the base font size recalculates whatever values are already entered in the px and rem fields.',
        'Results are rounded to 5 decimal places.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'rem (root em)',
          description:
            "A relative unit based on the font-size of the root element (the html element). By default 1rem equals 16px in most browsers, but changing the html element's font-size scales it accordingly. Unlike em, which depends on the parent element's font size, rem always refers to the root element, making sizes more predictable in nested components.",
        },
        {
          term: 'px (pixel)',
          description:
            "An absolute unit (a CSS pixel) based on a single pixel on screen. Elements sized in px don't change even if the user adjusts their browser's text size setting.",
        },
        {
          term: 'Base font size',
          description:
            "The font size that relative units like rem and em are based on. For rem, it's the font-size set on the html element — 16px by default in most browsers, but it can be changed in CSS or by the user in their browser settings.",
        },
      ],
    },
  };
