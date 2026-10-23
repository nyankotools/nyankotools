import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface BusinessCardMakerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  /** 表示名（姓名）の並び順。ja は姓名、en は名姓 */
  fnOrder: 'family-given' | 'given-family';
  /** 郵便番号の前に付ける記号（ja は〒） */
  postalPrefix: string;

  designHeading: string;
  orientationLabel: string;
  orientationLandscape: string;
  orientationPortrait: string;
  layoutLabel: string;
  layoutClassic: string;
  layoutCenter: string;
  layoutBand: string;
  fontLabel: string;
  fontSans: string;
  fontSerif: string;
  accentLabel: string;
  nameSizeLabel: string;
  bodySizeLabel: string;

  personHeading: string;
  familyNameLabel: string;
  givenNameLabel: string;
  readingLabel: string;
  companyLabel: string;
  departmentLabel: string;
  titleLabel: string;

  contactHeading: string;
  postalLabel: string;
  addressLabel: string;
  phoneLabel: string;
  mobileLabel: string;
  emailLabel: string;
  urlLabel: string;

  qrHeading: string;
  qrContentLabel: string;
  qrNone: string;
  qrVcard: string;
  qrUrl: string;
  qrSizeLabel: string;

  printHeading: string;
  modeLabel: string;
  modeA4: string;
  modeSingle: string;
  countLabel: string;
  cutLinesLabel: string;
  printButton: string;
  previewLabel: string;
  emptyMessage: string;

  /** {min} {max} を置き換える */
  errorNameSize: string;
  errorBodySize: string;
  errorQrSize: string;
  errorCount: string;
  errorAccent: string;
  warningQrEmpty: string;
  warningQrTooLong: string;
  /** {module} を置き換える（1マスの大きさ mm） */
  warningQrSmall: string;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const businessCardMakerContent: Record<
  Locale,
  BusinessCardMakerPageContent
> = {
  ja: {
    title: '名刺作成（印刷用・QRコード付き・A4面付け）',
    description:
      '91×55mmの名刺を縦横・3種類のレイアウトで作成し、vCardのQRコードを入れてA4に10面付けで実寸印刷できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '名刺作成（印刷用・QRコード付き・A4面付け）',
    introHtml:
      '名前・会社名・連絡先を入力すると、91×55mmの名刺を実寸でプレビューし、A4用紙に10面付けして印刷できます。連絡先を読み取るだけで追加できるvCardのQRコードも入れられます。入力した個人情報はブラウザ内だけで処理され、サーバーには送信されません。QRコードだけを作りたいときは <a href="/tools/vcard-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">vCard作成</a> もご利用ください。',

    fnOrder: 'family-given',
    postalPrefix: '〒',

    designHeading: 'デザイン',
    orientationLabel: '向き',
    orientationLandscape: '横向き（91×55mm）',
    orientationPortrait: '縦向き（55×91mm）',
    layoutLabel: 'レイアウト',
    layoutClassic: 'クラシック（左揃え）',
    layoutCenter: 'センター（上部を中央揃え）',
    layoutBand: 'サイドバンド（左に色の帯）',
    fontLabel: '書体',
    fontSans: 'ゴシック体',
    fontSerif: '明朝体',
    accentLabel: 'アクセントカラー',
    nameSizeLabel: '氏名の文字サイズ（mm）',
    bodySizeLabel: '本文の文字サイズ（mm）',

    personHeading: '名前・所属',
    familyNameLabel: '姓',
    givenNameLabel: '名',
    readingLabel: 'ふりがな・ローマ字',
    companyLabel: '会社・組織名',
    departmentLabel: '部署',
    titleLabel: '役職',

    contactHeading: '住所・連絡先',
    postalLabel: '郵便番号',
    addressLabel: '住所',
    phoneLabel: '電話番号',
    mobileLabel: '携帯電話',
    emailLabel: 'メールアドレス',
    urlLabel: 'WebサイトURL',

    qrHeading: 'QRコード',
    qrContentLabel: 'QRコードの内容',
    qrNone: '入れない',
    qrVcard: '連絡先（vCard）',
    qrUrl: 'WebサイトのURLのみ',
    qrSizeLabel: 'QRコードの大きさ（mm）',

    printHeading: '印刷',
    modeLabel: '印刷方法',
    modeA4: 'A4用紙に10面付け',
    modeSingle: '名刺1枚のサイズで印刷',
    countLabel: '印刷する枚数（A4）',
    cutLinesLabel: '裁断用の枠線を印刷する',
    printButton: '印刷する',
    previewLabel: '実寸プレビュー',
    emptyMessage: '名前や連絡先を入力すると印刷できます。',

    errorNameSize: '氏名の文字サイズは{min}〜{max}mmで入力してください',
    errorBodySize: '本文の文字サイズは{min}〜{max}mmで入力してください',
    errorQrSize: 'QRコードの大きさは{min}〜{max}mmで入力してください',
    errorCount: '枚数は{min}〜{max}の整数で入力してください',
    errorAccent: 'アクセントカラーは #rrggbb の形式で指定してください',
    warningQrEmpty:
      'QRコードにする情報が入力されていないため、QRコードは表示していません。',
    warningQrTooLong:
      '内容が多すぎてQRコードにできません。項目を減らすか、「QRコードの内容」を「WebサイトのURLのみ」にしてください。',
    warningQrSmall:
      'QRコードの1マスが約{module}mmと細かく、印刷後に読み取れない場合があります。「QRコードの大きさ（mm）」を大きくするか、項目を減らしてください。',

    howToHeading: '使い方',
    howToSteps: [
      '「向き」「レイアウト」を選び、名前・会社名・住所・連絡先を入力します。実寸のプレビューで配置を確認できます。',
      '「QRコードの内容」で連絡先（vCard）かURLを選びます。QRコードが細かすぎるときは「QRコードの大きさ（mm）」を大きくします。',
      '「印刷方法」と「印刷する枚数（A4）」を決めて「印刷する」を押します。印刷ダイアログでは倍率を100%（実際のサイズ）にし、まず普通紙に試し刷りしてください。',
    ],
    notesHeading: '注意事項',
    notes: [
      '印刷ダイアログの倍率は100%（実際のサイズ）、余白はなしまたは既定にしてください。拡大縮小や用紙に合わせる設定を使うと名刺の寸法がずれます。プリンターによっては縁の数mmが印刷されないため、先に普通紙で試し刷りして位置を確かめてください。',
      '「A4用紙に10面付け」は、91×55mmの名刺を隙間なく並べます。ミシン目入りの名刺用紙を使う場合は、用紙の面の位置が数mmずれることがあるため、「裁断用の枠線を印刷する」をオフにして試し刷りで重ね合わせてください。',
      '文字が名刺からはみ出す場合は、「氏名の文字サイズ（mm）」「本文の文字サイズ（mm）」を小さくするか、項目を減らしてください。はみ出した部分は印刷されません。',
      'QRコードの余白は名刺の面積を優先して標準より狭くしています。連絡先の項目が多いとQRコードが細かくなり、読み取りにくくなります。印刷後にスマートフォンで読み取れるか確認してください。',
      'QRコードには入力した個人情報がそのまま含まれます。名刺を配る前に、載せてよい情報か確認してください。入力内容はブラウザ内だけで処理され、保存や送信は行われません。ページを閉じると消えます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '面付け',
        description:
          '印刷用紙1枚に複数の名刺を並べて配置することです。ここではA4用紙に91×55mmの名刺を10面（横向きは2列×5行、縦向きは5列×2行）並べます。',
      },
      {
        term: 'vCardのQRコード',
        description:
          '氏名・会社名・電話番号などの連絡先データをQRコードにしたものです。スマートフォンのカメラで読み取ると、連絡先アプリに登録する操作に進めます。',
      },
    ],
  },
  en: {
    title: 'Business Card Maker (Printable, A4 Sheet, with QR)',
    description:
      'Make a 91 × 55 mm business card with a vCard QR code and print it life-size, 10 per A4 sheet. Runs in your browser; nothing you type is uploaded.',
    h1: 'Business Card Maker: Print 10 per A4 Sheet with a QR Code',
    introHtml:
      'Enter your name, company and contact details to preview a 91 × 55 mm business card at true size, then print ten of them on one A4 sheet. You can add a vCard QR code that saves your contact when scanned. Everything you type is processed in your browser and never sent to a server. If you only need the QR code or a .vcf file, try the <a href="/en/tools/vcard-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">vCard Generator</a>.',

    fnOrder: 'given-family',
    postalPrefix: '',

    designHeading: 'Design',
    orientationLabel: 'Orientation',
    orientationLandscape: 'Landscape (91 × 55 mm)',
    orientationPortrait: 'Portrait (55 × 91 mm)',
    layoutLabel: 'Layout',
    layoutClassic: 'Classic (left-aligned)',
    layoutCenter: 'Centered (centered header)',
    layoutBand: 'Side band (colored bar on the left)',
    fontLabel: 'Typeface',
    fontSans: 'Sans-serif',
    fontSerif: 'Serif',
    accentLabel: 'Accent color',
    nameSizeLabel: 'Name font size (mm)',
    bodySizeLabel: 'Body font size (mm)',

    personHeading: 'Name and organization',
    familyNameLabel: 'Last name',
    givenNameLabel: 'First name',
    readingLabel: 'Pronunciation / romanization',
    companyLabel: 'Company / organization',
    departmentLabel: 'Department',
    titleLabel: 'Job title',

    contactHeading: 'Address and contact',
    postalLabel: 'Postal code',
    addressLabel: 'Address',
    phoneLabel: 'Phone',
    mobileLabel: 'Mobile',
    emailLabel: 'Email address',
    urlLabel: 'Website URL',

    qrHeading: 'QR code',
    qrContentLabel: 'QR code content',
    qrNone: 'No QR code',
    qrVcard: 'Contact (vCard)',
    qrUrl: 'Website URL only',
    qrSizeLabel: 'QR code size (mm)',

    printHeading: 'Print',
    modeLabel: 'Print method',
    modeA4: '10 cards on an A4 sheet',
    modeSingle: 'One card-sized page',
    countLabel: 'Number of cards (A4)',
    cutLinesLabel: 'Print cut-line borders',
    printButton: 'Print',
    previewLabel: 'Life-size preview',
    emptyMessage: 'Enter a name or contact detail to enable printing.',

    errorNameSize: 'Name font size must be between {min} and {max} mm.',
    errorBodySize: 'Body font size must be between {min} and {max} mm.',
    errorQrSize: 'QR code size must be between {min} and {max} mm.',
    errorCount: 'Enter a whole number of cards from {min} to {max}.',
    errorAccent: 'Enter the accent color as #rrggbb.',
    warningQrEmpty:
      'The QR code is hidden because there is nothing to put in it yet.',
    warningQrTooLong:
      'There is too much data for a QR code. Remove some fields or set "QR code content" to "Website URL only".',
    warningQrSmall:
      'Each QR module is only about {module} mm, so it may not scan once printed. Increase "QR code size (mm)" or remove some fields.',

    howToHeading: 'How to use',
    howToSteps: [
      'Choose the "Orientation" and "Layout", then enter your name, company, address and contact details. The life-size preview shows the result.',
      'Pick contact (vCard) or URL under "QR code content". If the QR code looks too dense, raise "QR code size (mm)".',
      'Set the "Print method" and "Number of cards (A4)", then press "Print". In the print dialog use a scale of 100% (actual size) and test on plain paper first.',
    ],
    notesHeading: 'Notes',
    notes: [
      'In the print dialog set the scale to 100% (actual size) and the margins to None or Default. Fit-to-page or custom scaling changes the card size. Some printers cannot print the last few millimetres of the edge, so print a test on plain paper first.',
      '"10 cards on an A4 sheet" places 91 × 55 mm cards edge to edge. Perforated business-card paper can differ by a few millimetres, so turn off "Print cut-line borders" and hold a test print against the sheet before using it.',
      'If text runs past the card, reduce "Name font size (mm)" and "Body font size (mm)" or remove some fields. Anything outside the card is not printed.',
      'The quiet zone around the QR code is narrower than standard to save space. A contact with many fields makes a dense code that is harder to read, so scan your printed card with a phone to check.',
      'The QR code contains your details as plain text, so make sure you are happy to share them before handing out cards. What you type stays in your browser, is never saved or sent, and disappears when you close the page.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Imposition',
        description:
          'Arranging several copies of a design on one sheet for printing and cutting. Here ten 91 × 55 mm cards are laid out on A4: 2 columns × 5 rows for landscape cards, 5 × 2 for portrait cards.',
      },
      {
        term: 'vCard QR code',
        description:
          'A QR code that holds contact data such as name, company and phone numbers. Scanning it with a phone camera offers to save the contact.',
      },
    ],
  },
};
