import type { Locale } from '../../data/tools';

export interface TextExtractorContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  typesLegend: string;
  typeEmail: string;
  typeUrl: string;
  typePhone: string;
  typeDate: string;
  typeIpv4: string;
  typePostal: string;
  typeHashtag: string;
  optionsLegend: string;
  uniqueLabel: string;
  ignoreCaseLabel: string;
  sortLabel: string;
  joinLabel: string;
  joinNewline: string;
  joinComma: string;
  joinTab: string;
  outputLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** {n} が件数に置き換わる */
  summaryTemplate: string;
  /** {n} が重複除去前の件数に置き換わる */
  summaryUniqueTemplate: string;
  emptyMessage: string;
  noTypeMessage: string;
  notesHeading: string;
  notes: string[];
}

export const textExtractorContent: Record<Locale, TextExtractorContent> = {
  ja: {
    title: 'メール・URL・電話番号の一括抽出',
    description:
      '文章からメールアドレス・URL・電話番号・日付・IPアドレス・郵便番号・ハッシュタグをまとめて抽出し、重複を除去できる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'メール・URL・電話番号などの一括抽出',
    introHtml:
      '長い文章やログ、メール本文から、メールアドレス・URL・電話番号・日付などだけを正規表現の知識なしで取り出せます。抽出したい種類を選ぶだけで、重複の除去や並べ替えもできます。独自のパターンで抽出したい場合は<a href="/tools/regex-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">正規表現テスター</a>、文字数の確認は<a href="/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字数カウント</a>をご利用ください。入力した内容はブラウザ内で処理され、サーバーに送信されることはありません。',
    inputLabel: '抽出元のテキスト',
    inputPlaceholder: 'ここにテキストを貼り付けてください',
    sampleText:
      'お問い合わせ: info@example.com / support@example.co.jp\nTEL 03-1234-5678、携帯 090-1234-5678\n〒150-0001 東京都渋谷区\n公開日: 2026年10月18日 詳細は https://example.com/news?id=1 まで\nサーバー 192.168.0.1 #お知らせ\n再送: info@example.com',
    typesLegend: '抽出する種類',
    typeEmail: 'メールアドレス',
    typeUrl: 'URL',
    typePhone: '電話番号',
    typeDate: '日付',
    typeIpv4: 'IPv4アドレス',
    typePostal: '郵便番号',
    typeHashtag: 'ハッシュタグ',
    optionsLegend: 'オプション',
    uniqueLabel: '重複を除去する',
    ignoreCaseLabel: '重複判定で大文字小文字を区別しない',
    sortLabel: '昇順に並べ替える',
    joinLabel: '区切り',
    joinNewline: '改行',
    joinComma: 'カンマ',
    joinTab: 'タブ',
    outputLabel: '抽出結果',
    copy: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    summaryTemplate: '{n}件を抽出しました',
    summaryUniqueTemplate: '（重複除去前は{n}件）',
    emptyMessage: '該当する文字列は見つかりませんでした',
    noTypeMessage: '抽出する種類を1つ以上選んでください',
    notesHeading: '注意事項',
    notes: [
      'メールアドレスは英数字と一部の記号で構成された一般的な形式のみを対象とし、日本語ドメインや引用符で囲まれたローカル部などの特殊な形式は抽出できません。',
      'URLはhttp:// または https://で始まるASCII文字の並びを対象にします。末尾の句読点や、対応する開き括弧のない閉じ括弧は除外されます。日本語の文字が出現した位置でURLは途切れます。',
      '電話番号はハイフン区切りの日本の番号（03-1234-5678など）、+81などの国際表記、ハイフンなしの携帯・IP電話（09012345678など）を対象にします。数字の並びだけでは判別できないため、ハイフンなしの固定電話は抽出しません。',
      '日付は2026-10-18、2026/10/18、2026.10.18、2026年10月18日の形式で、1900〜2099年のものが対象です。和暦や英語表記には対応していません。',
      '同じ位置が複数の種類に該当する場合は、URL、メール、日付、IPv4、電話番号、郵便番号、ハッシュタグの順に優先し、重複して数えません。',
      '正規表現による簡易的な抽出のため、取りこぼしや誤検出が起こりえます。重要な用途では結果を目視でも確認してください。',
    ],
  },
  en: {
    title: 'Extract Emails, URLs, Phone Numbers',
    description:
      'Extract emails, URLs, phone numbers, dates, IPs and hashtags from any text at once, with duplicate removal. Runs in your browser; nothing is uploaded.',
    h1: 'Extract Emails, URLs, Phone Numbers and Dates from Text',
    introHtml:
      'Paste an article, log or email body and pull out just the email addresses, URLs, phone numbers, dates and more, with no regex knowledge needed. Pick the kinds of data you want, then remove duplicates or sort the results. If you need a custom pattern, use the <a href="/en/tools/regex-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Regex Tester</a>; to check text length, try the <a href="/en/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Character Counter</a>. Your text is processed in the browser and never sent to a server.',
    inputLabel: 'Source text',
    inputPlaceholder: 'Paste your text here',
    sampleText:
      'Contact: info@example.com / support@example.co.jp\nTEL +81 3-1234-5678, mobile 090-1234-5678\nPosted 2026-10-18, details at https://example.com/news?id=1\nServer 192.168.0.1 #announcement\nResend: info@example.com',
    typesLegend: 'Data to extract',
    typeEmail: 'Email addresses',
    typeUrl: 'URLs',
    typePhone: 'Phone numbers',
    typeDate: 'Dates',
    typeIpv4: 'IPv4 addresses',
    typePostal: 'Japanese postal codes',
    typeHashtag: 'Hashtags',
    optionsLegend: 'Options',
    uniqueLabel: 'Remove duplicates',
    ignoreCaseLabel: 'Ignore letter case when comparing',
    sortLabel: 'Sort ascending',
    joinLabel: 'Separator',
    joinNewline: 'New line',
    joinComma: 'Comma',
    joinTab: 'Tab',
    outputLabel: 'Extracted results',
    copy: 'Copy results',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    summaryTemplate: '{n} found',
    summaryUniqueTemplate: ' ({n} before removing duplicates)',
    emptyMessage: 'Nothing matching was found',
    noTypeMessage: 'Select at least one kind of data to extract',
    notesHeading: 'Notes',
    notes: [
      'Email detection covers the common format of letters, digits and a few symbols. Internationalized domains and quoted local parts are not detected.',
      'URLs must start with "http://" or "https://" and are matched as a run of ASCII characters. Trailing punctuation and closing brackets without a matching opening bracket are dropped, and a URL ends where a non-ASCII character such as Japanese text begins.',
      'Phone numbers cover hyphenated Japanese numbers (such as 03-1234-5678), international forms like +81, and unhyphenated mobile or IP-phone numbers (such as 09012345678). Landline numbers without hyphens cannot be told apart from other digit strings and are not extracted.',
      'Dates are matched as "2026-10-18", "2026/10/18", "2026.10.18" or "2026年10月18日" for the years 1900 to 2099. Japanese era names and written-out month names are not supported.',
      'When one stretch of text could be several kinds, the priority is URL, email, date, IPv4, phone number, postal code, hashtag, so nothing is counted twice.',
      'Extraction uses simple regular expressions, so some items may be missed or wrongly matched. Check the results by eye for anything important.',
    ],
  },
};
