import type { Locale } from '../../data/tools';
import type { ColorGroup } from '../../lib/tools/japanese-traditional-colors';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface JapaneseTraditionalColorsPageContent {
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
  /** {count} を置換する */
  countText: string;
  noResults: string;
  copyHex: string;
  /** {name}, {hex} を置換する */
  copyHexAria: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const japaneseTraditionalColorsContent: Record<
  Locale,
  JapaneseTraditionalColorsPageContent
> = {
  ja: {
    title: '日本の伝統色・和色一覧（カラーコード検索・コピー）',
    description:
      '紅・藍色・桜色など日本の伝統色（和色）260色以上を、色名・読み・HEX・RGBで一覧表示。名前やカラーコードで検索し、クリックでHEXをコピーできます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '日本の伝統色・和色一覧（カラーコード検索・コピー）',
    introHtml:
      '日本の伝統色（和色）の色名・読み・HEX・RGBを一覧で確認できます。色名やカラーコードで検索し、色のカードを押すとHEXをコピーできます。ブラウザ内で処理され、サーバーには送信されません。HEXをRGB・HSLに変換したいときは <a href="/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カラーコード変換</a>、選んだ色から配色を作るときは <a href="/tools/color-palette-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カラーパレット生成</a> をご利用ください。',
    searchLabel: '色名・読み・カラーコードで検索',
    searchPlaceholder: '例: 桜、さくら、sakura、#e60012',
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
    countText: '{count}色を表示中',
    noResults: '一致する色がありません。別のキーワードをお試しください。',
    copyHex: 'HEXをコピー',
    copyHexAria: '{name}（{hex}）のHEXをコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '伝統色は資料や流派によって色味が異なります。ここに載せたHEXは代表的な近似値で、画面の設定によっても見え方が変わります。',
      '印刷物に使う場合は、画面の色と仕上がりが異なることがあります。必要に応じて色見本で確認してください。',
      '読みはひらがなで表示しています。検索ではカタカナやローマ字でも一致します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '伝統色（和色）',
        description:
          '日本で古くから使われてきた色の名前です。染料や植物、自然の景色にちなんだ名前が多く、「桜色」「藍色」などがあります。',
      },
      {
        term: 'HEX（16進数カラーコード）',
        description:
          '「#e60012」のように#と6桁の16進数で色を表す形式です。CSSやデザインツールにそのまま貼り付けて使えます。',
      },
    ],
  },
  en: {
    title: 'Japanese Traditional Colors (Wa-iro) with HEX Codes',
    description:
      'Browse 260+ traditional Japanese colors with names, HEX and RGB codes. Search by name or code and click to copy. Runs in your browser; nothing is uploaded.',
    h1: 'Japanese Traditional Colors: Names, HEX & RGB Codes',
    introHtml:
      'Look up traditional Japanese colors (wa-iro) with their Japanese names, readings, HEX and RGB values. Search by name or color code and click a card to copy its HEX. Everything runs in your browser and nothing is uploaded. To convert a code to RGB or HSL, use the <a href="/en/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Color Converter</a>, or build a scheme from a color with the <a href="/en/tools/color-palette-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Color Palette Generator</a>.',
    searchLabel: 'Search by name, reading, or color code',
    searchPlaceholder: 'e.g. sakura, 桜, #e60012',
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
    countText: 'Showing {count} colors',
    noResults: 'No matching colors. Try another keyword.',
    copyHex: 'Copy HEX',
    copyHexAria: 'Copy HEX of {name} ({hex})',
    copied: 'Copied',
    copyFailed: 'Failed to copy',
    notesHeading: 'Notes',
    notes: [
      'Traditional colors vary between sources and schools. The HEX values here are common approximations, and your display settings change how they look.',
      'Printed results can differ from the screen. Check against a physical color swatch when it matters.',
      'Readings are shown in hiragana. Search also matches katakana and romaji.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Traditional colors (wa-iro)',
        description:
          'Names of colors used in Japan since ancient times. Many come from dyes, plants and scenery, such as sakura-iro (cherry blossom) and ai-iro (indigo).',
      },
      {
        term: 'HEX color code',
        description:
          'A notation like "#e60012": a # followed by six hexadecimal digits. You can paste it directly into CSS or design tools.',
      },
    ],
  },
};
