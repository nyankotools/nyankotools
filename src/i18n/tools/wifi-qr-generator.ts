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

export interface WifiQrGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  ssidLabel: string;
  ssidPlaceholder: string;
  securityLabel: string;
  securityOptions: SelectOption[];
  passwordLabel: string;
  showPasswordLabel: string;
  hiddenLabel: string;
  levelLabel: string;
  levelOptions: SelectOption[];
  sizeLabel: string;
  sizeOptions: SelectOption[];
  downloadButton: string;
  downloaded: string;
  errorSsidEmpty: string;
  errorPasswordEmpty: string;
  errorTooLong: string;
  warnPasswordShort: string;
  warnPasswordLong: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const wifiQrGeneratorContent: Record<
  Locale,
  WifiQrGeneratorPageContent
> = {
  ja: {
    title: 'Wi-Fi QRコード生成（SSID・パスワード）',
    description:
      'SSIDとパスワードからWi-Fi接続用のQRコードを無料で作成できます。WPA・WEP・パスワードなし、隠しSSIDに対応しPNGで保存可能。入力内容はブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Wi-Fi QRコード生成',
    introHtml:
      'SSID・パスワード・暗号化方式を入力すると、スマートフォンで読み取るだけでWi-Fiに接続できるQRコードを作成します。ブラウザ内で処理され、パスワードがサーバーに送信されることはありません。URLなど一般的なQRコードを作りたい場合は <a href="/tools/qr-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">QRコード生成</a> をご利用ください。',
    ssidLabel: 'SSID（ネットワーク名）',
    ssidPlaceholder: 'MyHomeWiFi',
    securityLabel: '暗号化方式',
    securityOptions: [
      { value: 'WPA', label: 'WPA / WPA2 / WPA3', selected: true },
      { value: 'WEP', label: 'WEP' },
      { value: 'nopass', label: 'パスワードなし' },
    ],
    passwordLabel: 'パスワード',
    showPasswordLabel: 'パスワードを表示する',
    hiddenLabel: '隠しSSID（ステルス）のネットワーク',
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
    errorSsidEmpty: 'SSIDを入力してください。',
    errorPasswordEmpty: 'パスワードを入力してください。',
    errorTooLong:
      '入力が長すぎてQRコードを生成できません。誤り訂正レベルを下げてください。',
    warnPasswordShort:
      'WPAのパスワードは通常8文字以上です。短いと接続できない場合があります。',
    warnPasswordLong:
      'WPAのパスワードは通常63文字までです。長すぎると接続できない場合があります。',
    notesHeading: '注意事項',
    notes: [
      'QRコードにはパスワードがそのまま含まれます。読み取った人は誰でもWi-Fiに接続できるため、印刷して掲示する場所や共有先に注意してください。',
      'SSIDやパスワードに含まれる「\\」「;」「,」「:」「"」は、読み取り側で正しく解釈されるよう自動でエスケープします。',
      '読み取りの対応状況は端末やアプリによって異なります。生成後は実際のスマートフォンで接続できるか確認することをおすすめします。',
      'QRコードは株式会社デンソーウェーブの登録商標です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'SSID',
        description:
          'Wi-Fiネットワークの名前です。ルーターの設定画面や本体のラベルで確認できます。',
      },
      {
        term: 'WPA / WEP',
        description:
          'Wi-Fiの暗号化方式です。WEPは古く安全性が低いため、可能な限りWPA2やWPA3を使用してください。',
      },
      {
        term: '隠しSSID',
        description:
          'ネットワーク名を周囲に公開しない設定です。接続側がSSIDを直接指定する必要があり、QRコードにもその旨が含まれます。',
      },
    ],
  },
  en: {
    title: 'Wi-Fi QR Code Generator (SSID & Password)',
    description:
      'Create a Wi-Fi QR code from your SSID and password. Supports WPA, WEP, open and hidden networks, with PNG download. Runs in your browser; nothing is uploaded.',
    h1: 'Wi-Fi QR Code Generator',
    introHtml:
      'Enter your SSID, password and security type to make a QR code that lets guests join your Wi-Fi just by scanning it. Everything runs in your browser, so your password is never sent to a server. Need a QR code for a link or plain text? Use the <a href="/en/tools/qr-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">QR Code Generator</a>.',
    ssidLabel: 'SSID (network name)',
    ssidPlaceholder: 'MyHomeWiFi',
    securityLabel: 'Security type',
    securityOptions: [
      { value: 'WPA', label: 'WPA / WPA2 / WPA3', selected: true },
      { value: 'WEP', label: 'WEP' },
      { value: 'nopass', label: 'None (open network)' },
    ],
    passwordLabel: 'Password',
    showPasswordLabel: 'Show password',
    hiddenLabel: 'Hidden network (SSID not broadcast)',
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
    errorSsidEmpty: 'Enter the SSID.',
    errorPasswordEmpty: 'Enter the password.',
    errorTooLong:
      'The input is too long to generate a QR code. Try lowering the error correction level.',
    warnPasswordShort:
      'WPA passwords are normally at least 8 characters. A shorter one may not connect.',
    warnPasswordLong:
      'WPA passwords are normally at most 63 characters. A longer one may not connect.',
    notesHeading: 'Notes',
    notes: [
      'The QR code contains the password as plain text. Anyone who scans it can join your network, so be careful where you print, post or share it.',
      'The characters \\ ; , : and " in the SSID or password are escaped automatically so scanners read them correctly.',
      'Scanning support varies by device and app. After generating, test that a real phone can connect.',
      'QR Code is a registered trademark of DENSO WAVE INCORPORATED in Japan and in other countries.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'SSID',
        description:
          'The name of a Wi-Fi network. You can find it in the router settings or on its label.',
      },
      {
        term: 'WPA / WEP',
        description:
          'Wi-Fi encryption standards. WEP is outdated and weak, so use WPA2 or WPA3 whenever you can.',
      },
      {
        term: 'Hidden SSID',
        description:
          'A setting where the network name is not broadcast. Devices must be told the SSID directly, and the QR code carries a flag for that.',
      },
    ],
  },
};
