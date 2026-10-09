import type { Locale } from '../../data/tools';

interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface CharCounterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputPlaceholder: string;
  statCharacters: string;
  statCharactersNoSpaces: string;
  statWords: string;
  statLines: string;
  xHeading: string;
  xDescription: string;
  xPlanLabel: string;
  xPlanFree: string;
  xPlanPaid: string;
  xPlanCustom: string;
  xLimitLabel: string;
  xCountLabel: string;
  xRemainingLabel: string;
  xOverLabel: string;
  notesHeading: string;
  notes: string[];
  relatedHeading: string;
  relatedIntro: string;
  relatedLinks: RelatedLink[];
}

export const charCounterContent: Record<Locale, CharCounterPageContent> = {
  ja: {
    title: '文字数カウント',
    description:
      '入力したテキストの文字数・単語数・行数のほか、X（Twitter）の280字制限に対する重み付き文字数もリアルタイムで数える無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '文字数カウント',
    introHtml:
      'テキストを入力すると、文字数・空白を除いた文字数・単語数・行数をリアルタイムで自動表示します。原稿やSNS投稿の文字数制限の確認にご利用ください。全角・半角が混在した表記をそろえたい場合は<a href="/tools/zenkaku-hankaku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">全角/半角変換</a>、改行コードの違いを統一したい場合は<a href="/tools/line-ending-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">改行コード変換</a>もあわせてご利用ください。入力した内容はブラウザ内で処理され、サーバーに送信されることはありません。',
    inputPlaceholder: 'ここにテキストを入力してください',
    statCharacters: '文字数',
    statCharactersNoSpaces: '文字数(空白除く)',
    statWords: '単語数',
    statLines: '行数',
    xHeading: 'X（旧Twitter）の文字数',
    xDescription:
      'Xの数え方（半角=1、全角・絵文字=2、URLは長さによらず23）で、上限に対する文字数と残りを表示します。',
    xPlanLabel: 'アカウント',
    xPlanFree: '無料（280字）',
    xPlanPaid: '有料プラン・長文ポスト（25,000字）',
    xPlanCustom: '上限を指定',
    xLimitLabel: '上限',
    xCountLabel: 'Xでの文字数',
    xRemainingLabel: '残り',
    xOverLabel: '超過',
    notesHeading: '注意事項',
    notes: [
      '文字数はUnicodeのコードポイント単位で数え、全角・半角を区別せず1文字として扱います。複数の文字を組み合わせた絵文字などは、2文字以上として数えられることがあります。',
      '「文字数(空白除く)」は、スペース・タブ・改行などの空白文字をすべて除いた文字数です。',
      '単語数はブラウザの単語分割機能で数えるため、日本語の文章でも単語に近い単位で数えられます。ブラウザによって結果が異なる場合があります。',
      'X用の文字数は、半角英数字・記号を1、日本語などの全角文字と絵文字を2、URLを長さによらず23として数えます（http(s)://から始まるURLのみ対象で、example.comのようなスキームなしの表記は通常の文字として数えます）。仕様変更や例外（国旗・キーキャップ絵文字など）で、実際の投稿画面と差が出る場合があります。',
      'Xの公式ヘルプでは、無料アカウントの通常ポストは280字まで、長文ポストはBasic・Premium・Premium+の有料プラン加入者が作成でき上限は25,000字とされています（長文ポストの作成手順を説明した別のヘルプページには4,000字との記載も残っているため、実際の入力画面の表示も確認してください）。',
      'SNSや応募フォームなどは、独自のルール（URLや絵文字を特別な文字数として扱うなど）で文字数を数える場合があります。最終的な文字数は投稿先の表示で確認してください。',
    ],
    relatedHeading: '関連ツール',
    relatedIntro:
      '数えたテキストをさらに加工・変換したい場合は、以下のツールもあわせてご利用ください。',
    relatedLinks: [
      {
        href: '/tools/zenkaku-hankaku/',
        label: '全角/半角変換',
        description: '英数字・記号・カタカナの表記ゆれをそろえる',
      },
      {
        href: '/tools/line-ending-converter/',
        label: '改行コード変換',
        description: 'LF/CRLF/CRの改行コードを統一する',
      },
      {
        href: '/tools/text-list-tools/',
        label: '文字列の重複削除・ソート・シャッフル',
        description: '1行1項目のリストを整理する',
      },
      {
        href: '/tools/json-formatter/',
        label: 'JSON整形',
        description: 'JSONデータを整形・圧縮する',
      },
      {
        href: '/tools/markdown-preview/',
        label: 'Markdown⇔HTML変換',
        description: 'MarkdownとHTMLを相互変換する',
      },
      {
        href: '/tools/lorem-ipsum/',
        label: 'ダミーテキスト生成',
        description: 'Lorem ipsumや日本語のダミーテキストを生成する',
      },
      {
        href: '/tools/qr-generator/',
        label: 'QRコード生成',
        description: 'テキストからQRコードを生成する',
      },
      {
        href: '/tools/unix-timestamp/',
        label: 'Unixタイムスタンプ変換',
        description: 'Unixタイムスタンプと日時を相互変換する',
      },
    ],
  },
  en: {
    title: 'Character Counter',
    description:
      "Count characters, words, and lines in real time, plus your length against X's 280-character limit. Runs in your browser; nothing is sent to a server.",
    h1: 'Character Counter',
    introHtml:
      'Type or paste text below to see its character count, character count without spaces, word count and line count update in real time. Use it to check length limits for drafts and social media posts. To normalize mixed full-width and half-width text, try the <a href="/en/tools/zenkaku-hankaku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Full-width / Half-width Converter</a>; to unify line breaks, use the <a href="/en/tools/line-ending-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Line Ending Converter</a>. Your text is processed in the browser and never sent to a server.',
    inputPlaceholder: 'Type or paste your text here',
    statCharacters: 'Characters',
    statCharactersNoSpaces: 'Characters (no spaces)',
    statWords: 'Words',
    statLines: 'Lines',
    xHeading: 'X (Twitter) post length',
    xDescription:
      'Counts the way X does (half-width = 1, full-width and emoji = 2, any URL = 23) and shows your count against the limit.',
    xPlanLabel: 'Account',
    xPlanFree: 'Free (280)',
    xPlanPaid: 'Paid plans, long posts (25,000)',
    xPlanCustom: 'Custom limit',
    xLimitLabel: 'Limit',
    xCountLabel: 'Count on X',
    xRemainingLabel: 'Remaining',
    xOverLabel: 'Over by',
    notesHeading: 'Notes',
    notes: [
      'Characters are counted as Unicode code points, and full-width and half-width characters each count as one. Emoji made of several code points may count as two or more.',
      '"Characters (no spaces)" excludes all whitespace, including spaces, tabs and line breaks.',
      "Words are counted with the browser's word segmentation, so Japanese text is counted in word-like units too. Results can vary slightly between browsers.",
      'The X count weighs half-width letters, digits and symbols as 1, Japanese and other full-width characters and emoji as 2, and any URL as 23 (only URLs starting with http:// or https:// are detected; a bare domain like example.com counts as ordinary characters). Spec changes or edge cases such as flag and keycap emoji may cause small differences from the actual compose box.',
      "X's Help Center says free accounts can post up to 280 characters, while longer posts of up to 25,000 characters can be created by subscribers on any paid tier (Basic, Premium and Premium+). Another help page still mentions 4,000, so also check the limit shown in the compose box.",
      'Social networks and forms may count characters by their own rules, such as treating URLs or emoji specially. Check the final count on the destination.',
    ],
    relatedHeading: 'Related tools',
    relatedIntro:
      'If you want to further edit or convert the text you just counted, try one of these tools too.',
    relatedLinks: [
      {
        href: '/en/tools/zenkaku-hankaku/',
        label: 'Full-width / Half-width Converter',
        description:
          'normalize the width of alphanumerics, symbols, and katakana',
      },
      {
        href: '/en/tools/line-ending-converter/',
        label: 'Line Ending Converter',
        description: 'unify LF/CRLF/CR line endings',
      },
      {
        href: '/en/tools/text-list-tools/',
        label: 'Text List Deduplicate, Sort & Shuffle',
        description: 'clean up a newline-separated list',
      },
      {
        href: '/en/tools/json-formatter/',
        label: 'JSON Formatter',
        description: 'format and minify JSON data',
      },
      {
        href: '/en/tools/markdown-preview/',
        label: 'Markdown to HTML Converter',
        description: 'convert between Markdown and HTML',
      },
      {
        href: '/en/tools/lorem-ipsum/',
        label: 'Dummy Text Generator',
        description: 'generate Lorem ipsum or Japanese placeholder text',
      },
      {
        href: '/en/tools/qr-generator/',
        label: 'QR Code Generator',
        description: 'generate a QR code from text',
      },
      {
        href: '/en/tools/unix-timestamp/',
        label: 'Unix Timestamp Converter',
        description: 'convert between a Unix timestamp and a date',
      },
    ],
  },
};
