import type { Locale } from '../../data/tools';
import type { EntityCategory } from '../../lib/tools/html-entity-list';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface HtmlEntityListPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  searchLabel: string;
  searchPlaceholder: string;
  categoryLabel: string;
  categoryAll: string;
  categories: Record<EntityCategory, string>;
  /** {count} を置換する */
  countText: string;
  noResults: string;
  copyNamed: string;
  copyDecimal: string;
  copyHex: string;
  copyChar: string;
  /** {value}, {name} を置換する */
  copyAria: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const htmlEntityListContent: Record<Locale, HtmlEntityListPageContent> =
  {
    ja: {
      title: 'HTMLエンティティ一覧（名前・数値参照の検索とコピー）',
      description:
        '&copy; や &nbsp; などHTMLの文字参照を、名前・10進・16進の数値参照つきで一覧表示。記号・ギリシャ文字・矢印・数学記号・通貨を検索してコピーできます。サーバーには送信されません。',
      h1: 'HTMLエンティティ一覧（名前・数値参照の検索とコピー）',
      introHtml:
        'HTMLの文字参照（エンティティ）の名前、10進・16進の数値参照、実際の文字を一覧で確認できます。名前・コード・文字で検索し、ボタンを押すとその形式でコピーできます。ブラウザ内で処理され、サーバーには送信されません。文字列をまとめて変換したいときは <a href="/tools/html-escape/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTMLエスケープ・アンエスケープ</a> をご利用ください。',
      searchLabel: '名前・コード・文字で検索',
      searchPlaceholder: '例: copy、&amp;、169、&#xA9;、€',
      categoryLabel: 'カテゴリ',
      categoryAll: 'すべて',
      categories: {
        basic: '基本・ASCII記号',
        symbols: '記号・その他',
        currency: '通貨',
        latin: 'ラテン文字（アクセント付き）',
        latinExt: 'ラテン拡張',
        greek: 'ギリシャ文字',
        punctuation: '約物・空白',
        arrows: '矢印',
        math: '数学記号',
        shapes: '図形・記号',
      },
      countText: '{count}件を表示中',
      noResults:
        '一致するエンティティがありません。別のキーワードをお試しください。',
      copyNamed: '名前',
      copyDecimal: '10進',
      copyHex: '16進',
      copyChar: '文字',
      copyAria: '{name}の{value}をコピー',
      copied: 'コピーしました',
      copyFailed: 'コピーに失敗しました',
      notesHeading: '注意事項',
      notes: [
        '収録しているのはよく使う文字参照の一部です。HTML標準には2,000以上の名前付き参照があります。',
        '名前付き参照は大文字小文字を区別します（&Aacute; は Á、&aacute; は á）。',
        '文字の見え方はフォントによって変わり、フォントに含まれない文字は表示されないことがあります。',
        '空白や制御文字（&nbsp; など）は見えないため、一覧では代わりの記号で表示しています。コピーされるのは実際の文字です。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: '名前付き文字参照',
          description:
            '「&copy;」のように&と;で名前を囲んで文字を表す書き方です。覚えやすい反面、収録されていない文字には使えません。',
        },
        {
          term: '数値文字参照',
          description:
            '「&#169;」（10進）や「&#xA9;」（16進）のようにUnicodeのコードポイントで文字を表す書き方です。どの文字にも使えます。',
        },
      ],
    },
    en: {
      title: 'HTML Entity List: Names & Numeric Codes (Copy)',
      description:
        'Search HTML entities like &copy; by name, decimal or hex code: symbols, Greek letters, arrows, math and currency. Click to copy. Runs in your browser.',
      h1: 'HTML Entity List: Named & Numeric Character References',
      introHtml:
        'Look up HTML character entities with their names, decimal and hex numeric references, and the actual characters. Search by name, code or character, then click a button to copy that form. Everything runs in your browser and nothing is uploaded. To convert whole strings, use the <a href="/en/tools/html-escape/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTML Escape / Unescape</a> tool.',
      searchLabel: 'Search by name, code, or character',
      searchPlaceholder: 'e.g. copy, &amp;, 169, &#xA9;, €',
      categoryLabel: 'Category',
      categoryAll: 'All',
      categories: {
        basic: 'Basic & ASCII symbols',
        symbols: 'Symbols & misc',
        currency: 'Currency',
        latin: 'Latin letters (accented)',
        latinExt: 'Latin extended',
        greek: 'Greek letters',
        punctuation: 'Punctuation & spaces',
        arrows: 'Arrows',
        math: 'Math symbols',
        shapes: 'Shapes & signs',
      },
      countText: 'Showing {count} entities',
      noResults: 'No matching entities. Try another keyword.',
      copyNamed: 'Name',
      copyDecimal: 'Decimal',
      copyHex: 'Hex',
      copyChar: 'Char',
      copyAria: 'Copy {value} for {name}',
      copied: 'Copied',
      copyFailed: 'Failed to copy',
      notesHeading: 'Notes',
      notes: [
        'This list covers commonly used entities only. The HTML standard defines more than 2,000 named references.',
        'Named references are case-sensitive: &Aacute; is Á and &aacute; is á.',
        'How a character looks depends on the font, and characters missing from the font may not render.',
        'Spaces and control characters (such as &nbsp;) are invisible, so the list shows a stand-in symbol. The copied text is the real character.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'Named character reference',
          description:
            'A character written as a name between & and ;, such as "&copy;". Easy to remember, but only available for characters that have a name.',
        },
        {
          term: 'Numeric character reference',
          description:
            'A character written by its Unicode code point, in decimal ("&#169;") or hex ("&#xA9;"). It works for any character.',
        },
      ],
    },
  };
