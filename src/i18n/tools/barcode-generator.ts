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

export interface BarcodeGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  formatLabel: string;
  formatOptions: SelectOption[];
  widthLabel: string;
  heightLabel: string;
  displayValue: string;
  downloadButton: string;
  downloaded: string;
  errorInvalid: string;
  formatHints: Record<string, string>;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const barcodeGeneratorContent: Record<
  Locale,
  BarcodeGeneratorPageContent
> = {
  ja: {
    title: 'バーコード生成',
    description:
      'CODE128・EAN-13・EAN-8・UPC・CODE39・ITFのバーコードを無料で作成し、PNG画像でダウンロードできるツールです。バーの太さや高さも調整可能。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'バーコード生成（CODE128・EAN-13ほか）',
    introHtml:
      '文字列や商品コードを入力して、バーコードをその場で生成しPNG画像として保存できます。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。二次元コードが必要な場合は <a href="/tools/qr-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">QRコード生成</a> をご利用ください。',
    inputLabel: 'バーコードにする文字列',
    inputPlaceholder: '例: 4901234567894',
    formatLabel: 'バーコードの規格',
    formatOptions: [
      {
        value: 'CODE128',
        label: 'CODE128（英数字・記号、汎用）',
        selected: true,
      },
      { value: 'EAN13', label: 'EAN-13（JAN 13桁）' },
      { value: 'EAN8', label: 'EAN-8（JAN 8桁）' },
      { value: 'UPC', label: 'UPC-A（12桁）' },
      { value: 'CODE39', label: 'CODE39（英大文字・数字・記号）' },
      { value: 'ITF', label: 'ITF（偶数桁の数字）' },
    ],
    widthLabel: 'バーの太さ（1〜4）',
    heightLabel: 'バーの高さ（px）',
    displayValue: '下に文字列を表示する',
    downloadButton: 'PNG画像をダウンロード',
    downloaded: 'ダウンロードしました',
    errorInvalid:
      'この規格では入力した文字列をバーコードにできません。下の入力条件を確認してください。',
    formatHints: {
      CODE128: '半角の英数字・記号（ASCII）が使えます。',
      EAN13:
        '数字12桁（チェックデジットは自動付与）または13桁（チェックデジットが正しいもの）。',
      EAN8: '数字7桁（チェックデジットは自動付与）または8桁（チェックデジットが正しいもの）。',
      UPC: '数字11桁（チェックデジットは自動付与）または12桁（チェックデジットが正しいもの）。',
      CODE39:
        '英数字と「- . $ / + % スペース」が使えます（小文字は大文字に変換）。',
      ITF: '数字のみ、桁数は偶数にしてください。',
    },
    notesHeading: '注意事項',
    notes: [
      '規格ごとに入力できる文字や桁数が決まっています。条件を満たさない場合はバーコードを表示せずエラーを表示します。',
      'JANコード（EAN-13・EAN-8）を商品に実際に使うには、GS1などで事業者コードの登録が必要です。このツールは任意の数字からバーコード画像を作るだけで、コードの取得・登録はできません。',
      '印刷して使う場合は、読み取り機で実際に読めるか確認してください。バーが細すぎる・余白（クワイエットゾーン）が足りない場合は読み取れないことがあります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'CODE128',
        description:
          '半角の英数字や記号を幅広く表せる汎用のバーコード規格です。物流や社内管理など、商品コード以外の用途でよく使われます。',
      },
      {
        term: 'JANコード（EAN）',
        description:
          '日本の商品に付けられる標準のバーコードで、国際規格ではEANと呼ばれます。13桁（EAN-13）と8桁（EAN-8）があり、最後の1桁は入力ミスを検出するためのチェックデジットです。',
      },
      {
        term: 'チェックデジット',
        description:
          'コードの末尾に付ける検査用の数字です。他の桁から計算して求めるため、読み取りや入力の誤りを機械的に見つけられます。',
      },
      {
        term: 'クワイエットゾーン',
        description:
          'バーコードの左右に必要な余白のことです。余白が足りないとスキャナがバーコードの範囲を認識できず、読み取りに失敗することがあります。',
      },
    ],
  },
  en: {
    title: 'Free Barcode Generator',
    description:
      'Create CODE128, EAN-13, EAN-8, UPC-A, CODE39, and ITF barcodes and download them as PNG. Runs in your browser; nothing is sent to a server.',
    h1: 'Barcode Generator (CODE128, EAN-13 and more)',
    introHtml:
      'Enter text or a product code to generate a barcode instantly and save it as a PNG image. Everything happens in your browser, and nothing you type is sent to a server. Need a two-dimensional code instead? Try the <a href="/en/tools/qr-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">QR Code Generator</a>.',
    inputLabel: 'Text to encode',
    inputPlaceholder: 'e.g. 4901234567894',
    formatLabel: 'Barcode format',
    formatOptions: [
      {
        value: 'CODE128',
        label: 'CODE128 (alphanumeric, general purpose)',
        selected: true,
      },
      { value: 'EAN13', label: 'EAN-13 (13 digits)' },
      { value: 'EAN8', label: 'EAN-8 (8 digits)' },
      { value: 'UPC', label: 'UPC-A (12 digits)' },
      { value: 'CODE39', label: 'CODE39 (uppercase, digits, symbols)' },
      { value: 'ITF', label: 'ITF (even number of digits)' },
    ],
    widthLabel: 'Bar width (1-4)',
    heightLabel: 'Bar height (px)',
    displayValue: 'Show text below the bars',
    downloadButton: 'Download PNG',
    downloaded: 'Downloaded',
    errorInvalid:
      'This text cannot be encoded in the selected format. Check the input rules below.',
    formatHints: {
      CODE128: 'Accepts ASCII letters, digits, and symbols.',
      EAN13:
        '12 digits (check digit added automatically) or 13 digits with a valid check digit.',
      EAN8: '7 digits (check digit added automatically) or 8 digits with a valid check digit.',
      UPC: '11 digits (check digit added automatically) or 12 digits with a valid check digit.',
      CODE39:
        'Accepts letters, digits, and "- . $ / + % space" (lowercase is converted to uppercase).',
      ITF: 'Digits only, and the number of digits must be even.',
    },
    notesHeading: 'Notes',
    notes: [
      'Each format restricts which characters and how many digits are allowed. If the input does not fit, no barcode is shown and an error is displayed instead.',
      'To use EAN-13 / EAN-8 (JAN) codes on real products you must register a company prefix with GS1 or a similar body. This tool only draws a barcode image from any digits; it cannot issue or register codes.',
      'If you print the barcode, test it with an actual scanner. Bars that are too thin or a missing quiet zone can make it unreadable.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'CODE128',
        description:
          'A general-purpose barcode format that can encode a wide range of ASCII letters, digits, and symbols. Common in logistics and internal inventory rather than retail product codes.',
      },
      {
        term: 'EAN / JAN',
        description:
          'The standard retail product barcode (called JAN in Japan). It comes in 13-digit (EAN-13) and 8-digit (EAN-8) forms, and the last digit is a check digit that detects entry errors.',
      },
      {
        term: 'Check digit',
        description:
          'A verification digit appended to a code and calculated from the other digits, so scanners and software can automatically detect a misread or mistyped code.',
      },
      {
        term: 'Quiet zone',
        description:
          'The blank margin required on both sides of a barcode. Without enough margin a scanner may not detect where the barcode begins and ends, and fail to read it.',
      },
    ],
  },
};
