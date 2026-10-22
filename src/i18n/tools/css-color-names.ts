import type { Locale } from '../../data/tools';
import type { ColorGroup } from '../../lib/tools/css-color-names';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CssColorNamesPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  searchLabel: string;
  searchPlaceholder: string;
  groupLabel: string;
  groupAll: string;
  groups: Record<ColorGroup, string>;
  copyModeLabel: string;
  copyModeName: string;
  copyModeHex: string;
  copyModeRgb: string;
  /** {count} を置換する */
  countText: string;
  noResults: string;
  /** {name}, {value} を置換する */
  copyAria: string;
  copyTitle: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cssColorNamesContent: Record<Locale, CssColorNamesPageContent> = {
  ja: {
    title: 'CSSカラー名一覧（148色・HEX・RGB・検索・コピー）',
    description:
      'CSSで使える色名キーワード148色（red・tomato・rebeccapurple など）をHEX・RGBつきで一覧表示。色名やカラーコードで検索し、クリックでコピーできます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSSカラー名一覧（148色・HEX・RGB・検索・コピー）',
    introHtml:
      'CSSで使える色名キーワード148色を、HEXとRGBつきで確認できます。色名やカラーコードで検索し、色のカードを押すと色名・HEX・RGBのいずれかをコピーできます。ブラウザ内で処理され、サーバーには送信されません。HEXをRGB・HSLに変換したいときは <a href="/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カラーコード変換</a>、和風の色名が欲しいときは <a href="/tools/japanese-traditional-colors/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">日本の伝統色・和色一覧</a> をご利用ください。',
    searchLabel: '色名・カラーコードで検索',
    searchPlaceholder: '例: blue、dark slate、#663399',
    groupLabel: '色の系統',
    groupAll: 'すべて',
    groups: {
      red: '赤・ピンク系',
      orange: '橙・茶系',
      yellow: '黄系',
      green: '緑系',
      blue: '青系',
      purple: '紫系',
      neutral: '白・灰・黒',
    },
    copyModeLabel: 'コピーする値',
    copyModeName: '色名',
    copyModeHex: 'HEX',
    copyModeRgb: 'RGB',
    countText: '{count}色を表示中',
    noResults: '一致する色がありません。別のキーワードをお試しください。',
    copyAria: '{name}の{value}をコピー',
    copyTitle: 'クリックでコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '掲載しているのはCSS Color Module Level 4 の色名キーワード148色です。transparent と currentColor は色の値ではないため含めていません。',
      'gray と grey のように綴り違いの別名は、同じ色の別の名前として両方を載せています。',
      '系統の分類は色相・彩度から自動で決めた目安です。境界付近の色は見た目の印象と一致しない場合があります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'CSSの色名キーワード',
        description:
          '「color: tomato;」のように、色を英単語で指定できるCSSの値です。ブラウザが対応するHEX値に置き換えて描画します。',
      },
      {
        term: 'rebeccapurple',
        description:
          'CSS Color Module Level 4 で追加された色名で、#663399 を表します。',
      },
    ],
  },
  en: {
    title: 'CSS Color Names List (148 Colors with HEX & RGB)',
    description:
      'Browse all 148 CSS named colors, from red to rebeccapurple, with HEX and RGB values. Search and click to copy. Runs in your browser; nothing is uploaded.',
    h1: 'CSS Color Names: All 148 Named Colors with HEX & RGB',
    introHtml:
      'See all 148 CSS named colors with their HEX and RGB values. Search by name or color code, then click a card to copy the name, HEX or RGB. Everything runs in your browser and nothing is uploaded. To convert a code to RGB or HSL, use the <a href="/en/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Color Converter</a>, or browse Japanese-style color names in <a href="/en/tools/japanese-traditional-colors/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Japanese Traditional Colors</a>.',
    searchLabel: 'Search by name or color code',
    searchPlaceholder: 'e.g. blue, dark slate, #663399',
    groupLabel: 'Color family',
    groupAll: 'All',
    groups: {
      red: 'Red & pink',
      orange: 'Orange & brown',
      yellow: 'Yellow',
      green: 'Green',
      blue: 'Blue',
      purple: 'Purple',
      neutral: 'White, gray & black',
    },
    copyModeLabel: 'Value to copy',
    copyModeName: 'Name',
    copyModeHex: 'HEX',
    copyModeRgb: 'RGB',
    countText: 'Showing {count} colors',
    noResults: 'No matching colors. Try another keyword.',
    copyAria: 'Copy {value} of {name}',
    copyTitle: 'Click to copy',
    copied: 'Copied',
    copyFailed: 'Failed to copy',
    notesHeading: 'Notes',
    notes: [
      'The list covers the 148 named color keywords in CSS Color Module Level 4. transparent and currentColor are not color values, so they are left out.',
      'Alternate spellings such as gray and grey are listed separately, since both name the same color.',
      'The color families are an automatic guess from hue and saturation. Colors near a boundary may not match how they look to you.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'CSS named color',
        description:
          'A color written as an English keyword, as in "color: tomato;". The browser maps it to a fixed HEX value.',
      },
      {
        term: 'rebeccapurple',
        description:
          'A named color added in CSS Color Module Level 4. It stands for #663399.',
      },
    ],
  },
};
