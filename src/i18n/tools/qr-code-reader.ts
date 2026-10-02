import type { Locale } from '../../data/tools';

export interface QrCodeReaderPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  cameraHeading: string;
  startCamera: string;
  stopCamera: string;
  cameraLabel: string;
  defaultCamera: string;
  videoAriaLabel: string;
  placeholder: string;
  scanning: string;
  fileHeading: string;
  fileHint: string;
  resultHeading: string;
  resultEmpty: string;
  historyHeading: string;
  copy: string;
  copied: string;
  copyFailed: string;
  openLink: string;
  noCodeFound: string;
  kinds: Record<
    'url' | 'wifi' | 'email' | 'tel' | 'sms' | 'geo' | 'vcard' | 'text',
    string
  >;
  wifiSsid: string;
  wifiPassword: string;
  wifiSecurity: string;
  wifiHidden: string;
  yes: string;
  no: string;
  errors: {
    'permission-denied': string;
    'not-found': string;
    'in-use': string;
    constraints: string;
    insecure: string;
    unsupported: string;
    unknown: string;
  };
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const qrCodeReaderContent: Record<Locale, QrCodeReaderPageContent> = {
  ja: {
    title: 'QRコードリーダー（カメラ・画像から読み取り）',
    description:
      'スマホやPCのカメラ、または画像ファイルからQRコードを読み取る無料ツールです。URL・Wi-Fi・メールなどの内容を自動判別し、コピーも可能。カメラ映像・画像はブラウザ内で処理され、サーバーには送信されません。',
    h1: 'QRコードリーダー',
    introHtml:
      'カメラをかざす、または画像ファイルを選ぶだけで、QRコードの中身を読み取ります。URLやWi-Fi情報などは種類を自動で判別します。読み取りはすべてこのページの中で行われ、映像も画像も外部に送信されません。QRコードを作りたいときは<a href="/tools/qr-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">QRコード生成</a>をご利用ください。',
    cameraHeading: 'カメラで読み取る',
    startCamera: 'カメラを開始',
    stopCamera: 'カメラを停止',
    cameraLabel: 'カメラ',
    defaultCamera: '既定（背面カメラ優先）',
    videoAriaLabel: 'QRコード読み取り用のカメラ映像',
    placeholder: '「カメラを開始」を押して、QRコードを映してください。',
    scanning: 'QRコードを探しています…',
    fileHeading: '画像から読み取る',
    fileHint:
      'QRコードの写真やスクリーンショットを選択、またはここにドラッグ＆ドロップ',
    resultHeading: '読み取り結果',
    resultEmpty: 'まだ読み取っていません。',
    historyHeading: '今回の履歴',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーできませんでした',
    openLink: 'リンクを開く',
    noCodeFound: '画像からQRコードを読み取れませんでした。',
    kinds: {
      url: 'URL',
      wifi: 'Wi-Fi',
      email: 'メール',
      tel: '電話番号',
      sms: 'SMS',
      geo: '位置情報',
      vcard: '連絡先（vCard）',
      text: 'テキスト',
    },
    wifiSsid: 'ネットワーク名（SSID）',
    wifiPassword: 'パスワード',
    wifiSecurity: '暗号化方式',
    wifiHidden: 'ステルスSSID',
    yes: 'はい',
    no: 'いいえ',
    errors: {
      'permission-denied':
        'カメラの使用が許可されていません。アドレスバーの鍵（サイト設定）アイコンから許可してから、もう一度お試しください。画像ファイルからも読み取れます。',
      'not-found': 'カメラが見つかりませんでした。接続を確認してください。',
      'in-use':
        'カメラを開始できませんでした。他のアプリやタブが使用中の可能性があります。',
      constraints:
        '指定したカメラを使用できません。別のカメラをお試しください。',
      insecure: 'この環境ではカメラを利用できません（HTTPS接続が必要です）。',
      unsupported: 'お使いのブラウザはカメラの取得に対応していません。',
      unknown: 'カメラを開始できませんでした。',
    },
    howToHeading: '使い方',
    howToSteps: [
      '「カメラを開始」を押し、ブラウザのカメラ使用許可で「許可」を選びます。',
      '映像の中にQRコードが入るように映すと、自動で読み取って結果に表示されます。',
      'カメラが使えない場合は、QRコードを含む画像ファイルを選択（またはドラッグ＆ドロップ）します。',
      '結果の「コピー」で内容をコピーできます。URLは内容を確認してから「リンクを開く」を押してください。',
    ],
    notesHeading: '注意点',
    notes: [
      '読み取ったURLは、自動では開きません。偽サイトへの誘導（QRコードを使ったフィッシング）もあるため、内容を確認してから開いてください。',
      'お使いのブラウザがバーコード検出（BarcodeDetector）に対応している場合は、QRコードのほかに一般的なバーコード（JANなど）も読み取れます。非対応のブラウザではQRコードのみ読み取れます。',
      'カメラ映像・画像は保存されず、解析もすべてブラウザ内で行われます。カメラはページを離れる・停止すると止まります。',
      '汚れ・反射・ピントのずれ、極端に小さいQRコードは読み取れないことがあります。コード全体が明るく映るよう調整してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'QRコード',
        description:
          '縦横に情報を持つ二次元バーコードです。URL・テキスト・Wi-Fi接続情報などを格納でき、一部が汚れても誤り訂正で読み取れます。',
      },
      {
        term: 'フィッシング（QRコード）',
        description:
          '本物そっくりの偽サイトへQRコードで誘導し、ID・パスワードやカード情報を盗む手口です。読み取った後はURLのドメインを確認してから開きましょう。',
      },
    ],
  },
  en: {
    title: 'QR Code Reader – Scan from Camera or Image',
    description:
      'Scan QR codes with your camera or an image file. Detects URLs and Wi-Fi, and lets you copy the result. Runs in your browser; nothing is uploaded.',
    h1: 'QR Code Reader',
    introHtml:
      'Point your camera at a QR code or pick an image file to read what is inside. URLs, Wi-Fi details and similar content are recognized automatically. Everything is decoded on this page, and no video or image is sent anywhere. Need to make one instead? Try the <a href="/en/tools/qr-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">QR Code Generator</a>.',
    cameraHeading: 'Scan with camera',
    startCamera: 'Start camera',
    stopCamera: 'Stop camera',
    cameraLabel: 'Camera',
    defaultCamera: 'Default (rear camera preferred)',
    videoAriaLabel: 'Camera view for scanning QR codes',
    placeholder: 'Press "Start camera" and show a QR code to the camera.',
    scanning: 'Looking for a QR code…',
    fileHeading: 'Scan from an image',
    fileHint:
      'Choose a photo or screenshot of a QR code, or drag & drop it here',
    resultHeading: 'Result',
    resultEmpty: 'Nothing scanned yet.',
    historyHeading: 'History (this visit)',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Could not copy',
    openLink: 'Open link',
    noCodeFound: 'No QR code could be read from that image.',
    kinds: {
      url: 'URL',
      wifi: 'Wi-Fi',
      email: 'Email',
      tel: 'Phone number',
      sms: 'SMS',
      geo: 'Location',
      vcard: 'Contact (vCard)',
      text: 'Text',
    },
    wifiSsid: 'Network name (SSID)',
    wifiPassword: 'Password',
    wifiSecurity: 'Security',
    wifiHidden: 'Hidden network',
    yes: 'Yes',
    no: 'No',
    errors: {
      'permission-denied':
        'Camera access was blocked. Allow it from the site settings icon in the address bar, then try again. You can also scan from an image file.',
      'not-found': 'No camera was found. Check that it is connected.',
      'in-use':
        'Could not start the camera. Another app or tab may be using it.',
      constraints: 'That camera cannot be used. Try another one.',
      insecure:
        'The camera is unavailable here (an HTTPS connection is required).',
      unsupported: 'Your browser does not support camera access.',
      unknown: 'Could not start the camera.',
    },
    howToHeading: 'How to use',
    howToSteps: [
      'Press "Start camera" and choose "Allow" when the browser asks for camera access.',
      'Show the QR code to the camera; it is read automatically and appears under Result.',
      'No camera? Choose (or drag & drop) an image file that contains a QR code.',
      'Use "Copy" to copy the content. For URLs, check the address before pressing "Open link".',
    ],
    notesHeading: 'Notes',
    notes: [
      'Scanned URLs are never opened automatically. QR codes are used for phishing, so check the address before you open it.',
      'If your browser supports the BarcodeDetector API, common barcodes (such as EAN/UPC) can be read in addition to QR codes. Other browsers read QR codes only.',
      'Video and images are not stored, and all decoding happens in your browser. The camera stops when you press Stop or leave the page.',
      'Dirty, glared, blurry or very small codes may fail to scan. Make sure the whole code is lit and in focus.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'QR code',
        description:
          'A two-dimensional barcode that holds data in both directions. It can store URLs, text, Wi-Fi details and more, and error correction lets it be read even when partly damaged.',
      },
      {
        term: 'QR phishing (quishing)',
        description:
          'A scam that sends you to a convincing fake site through a QR code to steal passwords or card details. After scanning, check the domain before opening the link.',
      },
    ],
  },
};
