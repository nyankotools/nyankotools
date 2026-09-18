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
  intro: string;
  inputPlaceholder: string;
  statCharacters: string;
  statCharactersNoSpaces: string;
  statWords: string;
  statLines: string;
  relatedHeading: string;
  relatedIntro: string;
  relatedLinks: RelatedLink[];
}

export const charCounterContent: Record<Locale, CharCounterPageContent> = {
  ja: {
    title: '文字数カウント',
    description:
      '入力したテキストの文字数・単語数・行数をリアルタイムで数える無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '文字数カウント',
    intro: 'テキストを入力すると、文字数・単語数・行数を自動で表示します。',
    inputPlaceholder: 'ここにテキストを入力してください',
    statCharacters: '文字数',
    statCharactersNoSpaces: '文字数(空白除く)',
    statWords: '単語数',
    statLines: '行数',
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
      'A free tool that counts the characters, words, and lines of your text in real time. Your data is processed in the browser and never sent to a server.',
    h1: 'Character Counter',
    intro:
      'Type or paste text below to automatically see its character, word, and line counts.',
    inputPlaceholder: 'Type or paste your text here',
    statCharacters: 'Characters',
    statCharactersNoSpaces: 'Characters (no spaces)',
    statWords: 'Words',
    statLines: 'Lines',
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
