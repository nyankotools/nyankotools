import type { Locale } from '../../data/tools';

export interface MailtoLinkGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  kindLabel: string;
  kindMailto: string;
  kindTel: string;
  kindSms: string;
  toLabel: string;
  toHint: string;
  ccLabel: string;
  bccLabel: string;
  subjectLabel: string;
  bodyLabel: string;
  phoneLabel: string;
  phoneHint: string;
  extLabel: string;
  smsNumbersLabel: string;
  smsNumbersHint: string;
  smsBodyLabel: string;
  smsStyleLabel: string;
  smsStyleStandard: string;
  smsStyleIos: string;
  anchorLabelLabel: string;
  anchorLabelDefaultMailto: string;
  anchorLabelDefaultTel: string;
  anchorLabelDefaultSms: string;
  hrefHeading: string;
  htmlHeading: string;
  copyHrefButton: string;
  copyHtmlButton: string;
  tryLink: string;
  copied: string;
  copyFailed: string;
  errorInvalidPhone: string;
  errorInvalidExt: string;
  errorEmptyPhone: string;
  warnInvalidEmail: string;
  warnTooLong: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const mailtoLinkGeneratorContent: Record<
  Locale,
  MailtoLinkGeneratorPageContent
> = {
  ja: {
    title: 'mailto・tel・SMSリンク生成（件名・本文・CC付き、エンコード済み）',
    description:
      'メールのmailtoリンク、電話のtelリンク、SMSリンクを、件名・本文・CC/BCCを入力するだけで生成。URLエンコード済みのhrefとHTMLアンカーをコピーできます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'mailto・tel・SMSリンク生成ツール',
    introHtml:
      '宛先・件名・本文を入力すると、URLエンコード済みの<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">mailto:</code>リンクを作ります。改行は<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">%0D%0A</code>に変換されるので、エンコードの知識は不要です。電話の<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">tel:</code>リンクとSMSリンクも作れ、hrefの文字列とHTMLのaタグをそのままコピーできます。エンコードそのものを確認したいときは <a href="/tools/url-encode/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">URLエンコード・デコード</a> も使えます。',
    howToHeading: '使い方',
    howToSteps: [
      '「リンクの種類」でメール・電話・SMSのいずれかを選びます。',
      '宛先や件名、本文（メールの場合）、電話番号などを入力します。',
      '「リンクを試す」でメーラーや電話アプリが開くか確認します。',
      '「hrefをコピー」または「HTMLをコピー」で、自分のページに貼り付けます。',
    ],
    kindLabel: 'リンクの種類',
    kindMailto: 'メール',
    kindTel: '電話',
    kindSms: 'SMS',
    toLabel: '宛先（To）',
    toHint: '複数ある場合はカンマまたは改行で区切ります。',
    ccLabel: 'CC',
    bccLabel: 'BCC',
    subjectLabel: '件名',
    bodyLabel: '本文',
    phoneLabel: '電話番号',
    phoneHint:
      '国際形式（+81 3-1234-5678）がおすすめです。全角の数字・ハイフンは半角にします。',
    extLabel: '内線番号（任意）',
    smsNumbersLabel: '宛先の電話番号',
    smsNumbersHint:
      '複数ある場合はカンマまたは改行で区切ります。空欄でも作れます。',
    smsBodyLabel: '本文',
    smsStyleLabel: '本文の区切り方',
    smsStyleStandard: '標準（?body=）',
    smsStyleIos: 'iOS向け（&body=）',
    anchorLabelLabel: 'リンクの表示文字',
    anchorLabelDefaultMailto: 'メールで問い合わせる',
    anchorLabelDefaultTel: '電話をかける',
    anchorLabelDefaultSms: 'SMSを送る',
    hrefHeading: 'href（リンク文字列）',
    htmlHeading: 'HTML（aタグ）',
    copyHrefButton: 'hrefをコピー',
    copyHtmlButton: 'HTMLをコピー',
    tryLink: 'リンクを試す',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorInvalidPhone:
      '電話番号は数字と + - . ( ) だけで入力してください（+ は先頭のみ）。',
    errorInvalidExt: '内線番号は数字だけで入力してください。',
    errorEmptyPhone: '電話番号を入力してください。',
    warnInvalidEmail: 'メールアドレスの形式が正しくない可能性があります: ',
    warnTooLong:
      'リンクが長すぎます（{length}文字）。環境によっては切れるため、本文を短くしてください。',
    notesHeading: '注意事項',
    notes: [
      'mailtoリンクは、閲覧者の環境に設定されたメールアプリ（またはWebメールの関連付け）が開きます。設定がない環境では何も起きないことがあります。',
      '本文や件名の長さの上限は、ブラウザやメールアプリによって異なります。2000文字を超えるリンクは切れる場合があるため、警告を出します。',
      '改行は、RFC 6068に沿って%0D%0Aで書き出します。本文のHTML書式やファイル添付はmailtoでは指定できません。',
      'SMSリンクの本文の区切りは、標準のRFC 5724では「?body=」ですが、古いiOSでは「&body=」が必要な場合がありました。端末によって挙動が異なるため、実機で確認してください。また、AndroidとiOSで複数宛先の扱いも違います。',
      '電話番号の先頭の0を使う国内形式は、海外からのアクセスではつながりません。サイトを海外の人も見る場合は、+81のような国際形式を使ってください。',
      'メールアドレスのドメインに日本語などを使う場合は、事前にpunycode（xn--）へ変換しておくのが安全です。このツールは変換しません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'mailto',
        description:
          'メールの新規作成画面を開くURLスキーム。宛先のあとに「?」で件名や本文などのヘッダーを続ける。仕様はRFC 6068。',
      },
      {
        term: 'tel',
        description:
          '電話アプリで発信画面を開くURLスキーム。仕様はRFC 3966。内線は「;ext=」で付ける。',
      },
      {
        term: 'sms',
        description:
          'SMS作成画面を開くURLスキーム。仕様はRFC 5724。本文は「body」で指定する。',
      },
      {
        term: 'パーセントエンコード',
        description:
          'URLで使えない文字や特別な意味を持つ文字を、%と16進数に置き換える方式。改行はCRLFの%0D%0Aにする。',
      },
    ],
  },
  en: {
    title: 'mailto, tel & SMS Link Generator (Subject, Body, CC)',
    description:
      'Generate mailto, tel and SMS links with subject, body, CC and BCC. Get a properly URL-encoded href and an HTML anchor tag to copy. Runs in your browser.',
    h1: 'mailto, tel & SMS Link Generator',
    introHtml:
      'Enter the recipient, subject and body to get a properly encoded <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">mailto:</code> link. Line breaks become <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">%0D%0A</code> automatically, so you do not need to know URL encoding. It also builds <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">tel:</code> and SMS links, and gives you both the plain href and a ready-to-paste anchor tag. To inspect the encoding itself, use the <a href="/en/tools/url-encode/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">URL Encoder / Decoder</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose email, phone or SMS under "Link type".',
      'Fill in the recipient, subject and body (for email), the phone number, and so on.',
      'Press "Try the link" to check that your mail or phone app opens.',
      'Use "Copy href" or "Copy HTML" and paste it into your page.',
    ],
    kindLabel: 'Link type',
    kindMailto: 'Email',
    kindTel: 'Phone',
    kindSms: 'SMS',
    toLabel: 'To',
    toHint: 'Separate multiple addresses with commas or line breaks.',
    ccLabel: 'CC',
    bccLabel: 'BCC',
    subjectLabel: 'Subject',
    bodyLabel: 'Body',
    phoneLabel: 'Phone number',
    phoneHint:
      'International format (+81 3-1234-5678) works best. Full-width digits and hyphens are converted.',
    extLabel: 'Extension (optional)',
    smsNumbersLabel: 'Recipient phone numbers',
    smsNumbersHint:
      'Separate multiple numbers with commas or line breaks. Can be left empty.',
    smsBodyLabel: 'Message',
    smsStyleLabel: 'Body separator',
    smsStyleStandard: 'Standard (?body=)',
    smsStyleIos: 'iOS style (&body=)',
    anchorLabelLabel: 'Link text',
    anchorLabelDefaultMailto: 'Email us',
    anchorLabelDefaultTel: 'Call us',
    anchorLabelDefaultSms: 'Send an SMS',
    hrefHeading: 'href (link string)',
    htmlHeading: 'HTML (anchor tag)',
    copyHrefButton: 'Copy href',
    copyHtmlButton: 'Copy HTML',
    tryLink: 'Try the link',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorInvalidPhone:
      'Use only digits and + - . ( ) in the phone number (+ only at the start).',
    errorInvalidExt: 'The extension must contain digits only.',
    errorEmptyPhone: 'Enter a phone number.',
    warnInvalidEmail: 'These may not be valid email addresses: ',
    warnTooLong:
      'The link is very long ({length} characters) and may be cut off in some environments. Shorten the body.',
    notesHeading: 'Notes',
    notes: [
      'A mailto link opens whatever mail app (or web mail handler) the visitor has set up. If none is configured, nothing may happen.',
      'Length limits for the subject and body vary by browser and mail app. Links over 2,000 characters can be truncated, so a warning is shown.',
      'Line breaks are written as %0D%0A, following RFC 6068. mailto cannot carry HTML formatting or file attachments.',
      'RFC 5724 uses "?body=" for the SMS message, but older iOS versions needed "&body=". Behavior differs by device, so test on real phones. Android and iOS also handle multiple recipients differently.',
      'Domestic numbers starting with 0 will not connect when dialed from abroad. If visitors from other countries may see the page, use the international format such as +81.',
      'If an email domain uses non-ASCII characters, convert it to punycode (xn--) first. This tool does not do that for you.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'mailto',
        description:
          'A URL scheme that opens a new email draft. Headers such as subject and body follow the address after "?". Defined in RFC 6068.',
      },
      {
        term: 'tel',
        description:
          'A URL scheme that opens the dialer. Defined in RFC 3966; an extension is added with ";ext=".',
      },
      {
        term: 'sms',
        description:
          'A URL scheme that opens a new text message. Defined in RFC 5724; the message goes in the "body" parameter.',
      },
      {
        term: 'Percent-encoding',
        description:
          'Replacing characters that are unsafe or special in URLs with % and hex digits. A line break becomes CRLF, written %0D%0A.',
      },
    ],
  },
};
