import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SelectOption {
  value: string;
  label: string;
  selected?: boolean;
}

export interface QrGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  levelLabel: string;
  levelOptions: SelectOption[];
  sizeLabel: string;
  sizeOptions: SelectOption[];
  downloadButton: string;
  downloaded: string;
  errorTooLong: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const qrGeneratorContent: Record<Locale, QrGeneratorPageContent> = {
  ja: {
    title: 'QRコード生成',
    description:
      'URLやテキストを入力するだけで無料でQRコードを作成できるツールです。誤り訂正レベルや画像サイズを選んでPNG画像としてダウンロードできます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'QRコード生成',
    introHtml:
      'URLやテキストを入力すると、その場でQRコードを生成しプレビューできます。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。入力できる文字数の目安を先に確認したい場合は <a href="/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字数カウント</a> もあわせてご利用ください。',
    inputLabel: 'テキスト / URL',
    inputPlaceholder: 'https://example.com',
    levelLabel: '誤り訂正レベル',
    levelOptions: [
      { value: 'L', label: '低（約7%復元）' },
      { value: 'M', label: '中（約15%復元）', selected: true },
      { value: 'Q', label: '高（約25%復元）' },
      { value: 'H', label: '最高（約30%復元）' },
    ],
    sizeLabel: 'ダウンロード画像サイズ',
    sizeOptions: [
      { value: '256', label: '小（256px）' },
      { value: '512', label: '中（512px）', selected: true },
      { value: '1024', label: '大（1024px）' },
      { value: '2048', label: '特大（2048px）' },
    ],
    downloadButton: 'PNG画像をダウンロード',
    downloaded: 'ダウンロードしました',
    errorTooLong:
      '入力が長すぎてQRコードを生成できません。文字数を減らすか、誤り訂正レベルを下げてください。',
    notesHeading: '注意事項',
    notes: [
      '入力できる文字数は誤り訂正レベルによって変わります。長い文章やURLを入力すると、誤り訂正レベルが高いままでは生成できない場合があるので、その際は誤り訂正レベルを下げてください。',
      '生成後は実際にスマートフォンのカメラなどで読み取れるか確認することをおすすめします。',
      'QRコードは株式会社デンソーウェーブの登録商標です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'QRコード',
        description:
          '白黒の格子模様でデータを表現する二次元コードです。URLや文字列などをスマートフォンのカメラで素早く読み取れます。',
      },
      {
        term: '誤り訂正レベル',
        description:
          'QRコードの一部が汚れたり欠けたりしても読み取れるように、どれだけ復元用のデータを持たせるかの度合いです。レベルを上げるほど破損に強くなりますが、その分QRコードの模様は細かくなります。',
      },
      {
        term: 'クワイエットゾーン',
        description:
          'QRコードの周囲に必要な余白のことです。この余白が狭すぎたり切れたりすると、カメラがコードの範囲を正しく認識できず読み取りに失敗することがあります。',
      },
    ],
  },
  en: {
    title: 'Free QR Code Generator',
    description:
      'Create a QR code from a URL or text, choose error correction and size, and download a PNG. Runs in your browser; nothing is sent to a server.',
    h1: 'QR Code Generator',
    introHtml:
      'Enter a URL or text and instantly preview the generated QR code. Everything happens in your browser, and nothing you type is ever sent to a server. Want to check how many characters you\'re about to enter? Try the <a href="/en/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Character Counter</a> as well.',
    inputLabel: 'Text / URL',
    inputPlaceholder: 'https://example.com',
    levelLabel: 'Error correction level',
    levelOptions: [
      { value: 'L', label: 'Low (~7% recovery)' },
      { value: 'M', label: 'Medium (~15% recovery)', selected: true },
      { value: 'Q', label: 'High (~25% recovery)' },
      { value: 'H', label: 'Highest (~30% recovery)' },
    ],
    sizeLabel: 'Download image size',
    sizeOptions: [
      { value: '256', label: 'Small (256px)' },
      { value: '512', label: 'Medium (512px)', selected: true },
      { value: '1024', label: 'Large (1024px)' },
      { value: '2048', label: 'Extra large (2048px)' },
    ],
    downloadButton: 'Download PNG',
    downloaded: 'Downloaded',
    errorTooLong:
      'The input is too long to generate a QR code. Try shortening it or lowering the error correction level.',
    notesHeading: 'Notes',
    notes: [
      'How much text fits depends on the error correction level. If a long text or URL fails to generate, try lowering the error correction level.',
      'After generating, we recommend testing that the code actually scans with a smartphone camera.',
      'QR Code is a registered trademark of DENSO WAVE INCORPORATED in Japan and in other countries.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'QR code',
        description:
          'A two-dimensional barcode made of a black-and-white grid that encodes data. It can be scanned quickly with a smartphone camera to read a URL or text.',
      },
      {
        term: 'Error correction level',
        description:
          'How much redundant data the QR code carries so it can still be read even if part of it is smudged or damaged. A higher level tolerates more damage, but makes the pattern denser.',
      },
      {
        term: 'Quiet zone',
        description:
          "The blank margin required around a QR code. If this margin is too narrow or gets cropped, a camera may fail to recognize the code's boundaries and cannot scan it.",
      },
    ],
  },
};
