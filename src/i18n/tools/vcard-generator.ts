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

export interface VcardGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  /** FN（表示名）の並び順。ja は姓名、en は名姓 */
  fnOrder: 'family-given' | 'given-family';
  nameHeading: string;
  familyNameLabel: string;
  familyNamePlaceholder: string;
  givenNameLabel: string;
  givenNamePlaceholder: string;
  organizationLabel: string;
  organizationPlaceholder: string;
  titleLabel: string;
  titlePlaceholder: string;
  contactHeading: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneTypeLabel: string;
  phoneTypes: SelectOption[];
  emailLabel: string;
  emailPlaceholder: string;
  urlLabel: string;
  urlPlaceholder: string;
  addressHeading: string;
  addressTypeLabel: string;
  addressTypes: SelectOption[];
  postalCodeLabel: string;
  postalCodePlaceholder: string;
  regionLabel: string;
  regionPlaceholder: string;
  cityLabel: string;
  cityPlaceholder: string;
  streetLabel: string;
  streetPlaceholder: string;
  countryLabel: string;
  countryPlaceholder: string;
  noteLabel: string;
  levelLabel: string;
  levelOptions: SelectOption[];
  previewHeading: string;
  emptyMessage: string;
  vcardTextLabel: string;
  downloadVcfButton: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  downloadQrButton: string;
  downloadedVcf: string;
  downloadedQr: string;
  warningEmail: string;
  warningUrl: string;
  warningTooLong: string;
  warningDense: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const vcardGeneratorContent: Record<Locale, VcardGeneratorPageContent> =
  {
    ja: {
      title: 'vCard作成（連絡先.vcf・QRコード）',
      description:
        '名前・電話・メール・住所・会社名を入力して、vCard（.vcf）ファイルと名刺用QRコードを作成します。vCard 3.0形式で、スマホの連絡先に追加できます。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: 'vCard作成（連絡先.vcf・QRコード）',
      introHtml:
        '連絡先を入力すると、スマートフォンやメールソフトに取り込める vCard（.vcf）ファイルと、読み取るだけで連絡先を追加できるQRコードを作成します。入力内容はブラウザ内でのみ処理され、サーバーには送信されません。QRコードの誤り訂正レベルなどの詳細は <a href="/tools/qr-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">QRコード生成</a> もご覧ください。',
      howToHeading: '使い方',
      howToSteps: [
        '名前・会社名・電話番号・メール・住所などを入力します（空欄の項目は出力されません）。',
        '右側のプレビューでvCardの内容とQRコードを確認します。',
        '「.vcfをダウンロード」でファイルを保存するか、「QRコードをPNGで保存」でQR画像を保存します。',
      ],
      fnOrder: 'family-given',
      nameHeading: '名前・所属',
      familyNameLabel: '姓',
      familyNamePlaceholder: '山田',
      givenNameLabel: '名',
      givenNamePlaceholder: '太郎',
      organizationLabel: '会社・組織名',
      organizationPlaceholder: '株式会社サンプル',
      titleLabel: '役職',
      titlePlaceholder: 'エンジニア',
      contactHeading: '電話・メール・URL',
      phoneLabel: '電話番号',
      phonePlaceholder: '090-1234-5678',
      phoneTypeLabel: '電話の種類',
      phoneTypes: [
        { value: 'CELL', label: '携帯', selected: true },
        { value: 'WORK', label: '勤務先' },
        { value: 'HOME', label: '自宅' },
        { value: 'FAX', label: 'FAX' },
      ],
      emailLabel: 'メールアドレス',
      emailPlaceholder: 'taro@example.com',
      urlLabel: 'WebサイトURL',
      urlPlaceholder: 'https://example.com/',
      addressHeading: '住所',
      addressTypeLabel: '住所の種類',
      addressTypes: [
        { value: 'WORK', label: '勤務先', selected: true },
        { value: 'HOME', label: '自宅' },
      ],
      postalCodeLabel: '郵便番号',
      postalCodePlaceholder: '100-0001',
      regionLabel: '都道府県',
      regionPlaceholder: '東京都',
      cityLabel: '市区町村',
      cityPlaceholder: '千代田区',
      streetLabel: '番地・建物名',
      streetPlaceholder: '千代田1-1',
      countryLabel: '国',
      countryPlaceholder: '日本',
      noteLabel: 'メモ',
      levelLabel: 'QRの誤り訂正レベル',
      levelOptions: [
        { value: 'L', label: '低（約7%復元・容量大）' },
        { value: 'M', label: '中（約15%復元）', selected: true },
        { value: 'Q', label: '高（約25%復元）' },
        { value: 'H', label: '最高（約30%復元）' },
      ],
      previewHeading: 'プレビュー',
      emptyMessage: '項目を入力するとここにvCardとQRコードが表示されます。',
      vcardTextLabel: 'vCardの内容',
      downloadVcfButton: '.vcfをダウンロード',
      copyButton: 'vCardをコピー',
      copied: 'コピーしました',
      copyFailed: 'コピーに失敗しました',
      downloadQrButton: 'QRコードをPNGで保存',
      downloadedVcf: '.vcfを保存しました',
      downloadedQr: 'QRコードを保存しました',
      warningEmail:
        'メールアドレスの形式が正しくない項目があります。そのまま出力しています。',
      warningUrl:
        'URLが http:// または https:// で始まる形式ではない項目があります。そのまま出力しています。',
      warningTooLong:
        '内容が多すぎてQRコードにできません。メモや項目を減らすか、誤り訂正レベルを下げてください（.vcfは保存できます）。',
      warningDense:
        'QRコードが細かく、読み取りにくい場合があります。項目を減らすか、誤り訂正レベルを下げると読み取りやすくなります。',
      notesHeading: '注意事項',
      notes: [
        '出力はvCard 3.0形式（UTF-8・改行はCRLF）です。日本語を含む場合、機種やアプリによっては文字化けすることがあるため、取り込み後に表示を確認してください。',
        'QRコード用のデータは折り返しなしで出力しています。QRの読み取りに対応する連絡先アプリは機種により異なり、項目が一部欠けて取り込まれる場合があります。',
        'QRコードには入力した個人情報がそのまま含まれます。画像を公開・印刷する前に、載せてよい情報か確認してください。',
        'ふりがな・写真・複数の住所には対応していません。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'vCard（.vcf）',
          description:
            '連絡先を保存・交換するための標準的なファイル形式です。拡張子は .vcf で、スマートフォンやメールソフトに取り込めます。',
        },
        {
          term: 'N と FN',
          description:
            'N は姓・名などを分けて持つ項目、FN は表示用のフルネームです。vCard 3.0 ではどちらも必須のため、名前が空のときは組織名を表示名に使います。',
        },
        {
          term: '行の折り返し',
          description:
            'vCardでは1行を75オクテット以内に収め、超えた分は改行の直後に半角スペースを付けて続けます。.vcfファイルはこの規則に従って折り返します。',
        },
      ],
    },
    en: {
      title: 'vCard Generator (.vcf & QR Code)',
      description:
        'Create a vCard (.vcf) contact file and a scannable QR code from a name, phones, email, address and company. vCard 3.0; runs in your browser, nothing uploaded.',
      h1: 'vCard Generator (.vcf file & QR code)',
      introHtml:
        'Enter your contact details to get a vCard (.vcf) file you can import into a phone or mail app, plus a QR code that adds the contact when scanned. Everything is processed in your browser and nothing is sent to a server. For more on QR error correction, see the <a href="/en/tools/qr-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">QR Code Generator</a>.',
      howToHeading: 'How to use',
      howToSteps: [
        'Fill in the name, company, phone numbers, email, address and so on. Empty fields are left out.',
        'Check the vCard text and the QR code in the preview.',
        'Click "Download .vcf" to save the file, or "Save QR code as PNG" to save the image.',
      ],
      fnOrder: 'given-family',
      nameHeading: 'Name and organization',
      familyNameLabel: 'Last name',
      familyNamePlaceholder: 'Smith',
      givenNameLabel: 'First name',
      givenNamePlaceholder: 'Alex',
      organizationLabel: 'Company / organization',
      organizationPlaceholder: 'Example Inc.',
      titleLabel: 'Job title',
      titlePlaceholder: 'Engineer',
      contactHeading: 'Phone, email and website',
      phoneLabel: 'Phone number',
      phonePlaceholder: '+1 555 123 4567',
      phoneTypeLabel: 'Phone type',
      phoneTypes: [
        { value: 'CELL', label: 'Mobile', selected: true },
        { value: 'WORK', label: 'Work' },
        { value: 'HOME', label: 'Home' },
        { value: 'FAX', label: 'Fax' },
      ],
      emailLabel: 'Email address',
      emailPlaceholder: 'alex@example.com',
      urlLabel: 'Website URL',
      urlPlaceholder: 'https://example.com/',
      addressHeading: 'Address',
      addressTypeLabel: 'Address type',
      addressTypes: [
        { value: 'WORK', label: 'Work', selected: true },
        { value: 'HOME', label: 'Home' },
      ],
      postalCodeLabel: 'Postal code',
      postalCodePlaceholder: '94105',
      regionLabel: 'State / region',
      regionPlaceholder: 'CA',
      cityLabel: 'City',
      cityPlaceholder: 'San Francisco',
      streetLabel: 'Street address',
      streetPlaceholder: '1 Market St',
      countryLabel: 'Country',
      countryPlaceholder: 'USA',
      noteLabel: 'Note',
      levelLabel: 'QR error correction level',
      levelOptions: [
        { value: 'L', label: 'Low (~7% recovery, most data)' },
        { value: 'M', label: 'Medium (~15% recovery)', selected: true },
        { value: 'Q', label: 'High (~25% recovery)' },
        { value: 'H', label: 'Highest (~30% recovery)' },
      ],
      previewHeading: 'Preview',
      emptyMessage: 'Fill in a field and the vCard and QR code appear here.',
      vcardTextLabel: 'vCard text',
      downloadVcfButton: 'Download .vcf',
      copyButton: 'Copy vCard',
      copied: 'Copied',
      copyFailed: 'Could not copy',
      downloadQrButton: 'Save QR code as PNG',
      downloadedVcf: '.vcf saved',
      downloadedQr: 'QR code saved',
      warningEmail:
        'Some email addresses do not look valid. They are included as entered.',
      warningUrl:
        'Some URLs do not start with http:// or https://. They are included as entered.',
      warningTooLong:
        'There is too much data for a QR code. Remove some fields or the note, or lower the error correction level (the .vcf can still be saved).',
      warningDense:
        'This QR code is dense and may be hard to scan. Remove some fields or lower the error correction level to make it easier to read.',
      notesHeading: 'Notes',
      notes: [
        'The output is vCard 3.0 in UTF-8 with CRLF line breaks. Some devices and apps garble non-ASCII text, so check the contact after importing it.',
        'The QR code data is not line-folded. Contact apps differ in how well they read vCard QR codes, so some fields may be missing after a scan.',
        'The QR code contains your personal details as plain text. Check that you are happy to share them before publishing or printing the image.',
        'Phonetic names, photos and multiple addresses are not supported.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'vCard (.vcf)',
          description:
            'A standard file format for storing and exchanging contacts. It uses the .vcf extension and can be imported by phones and mail apps.',
        },
        {
          term: 'N and FN',
          description:
            'N holds the name split into parts, and FN is the full display name. Both are required in vCard 3.0, so the organization name is used as the display name when no personal name is given.',
        },
        {
          term: 'Line folding',
          description:
            'vCard lines must stay within 75 octets; longer lines continue on the next line, which starts with a single space. The .vcf file is folded this way.',
        },
      ],
    },
  };
