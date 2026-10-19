import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface HtpasswdGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  usersLabel: string;
  usersHint: string;
  usersPlaceholder: string;
  algorithmLabel: string;
  algorithmBcrypt: string;
  algorithmSha1: string;
  costLabel: string;
  costHint: string;
  generateButton: string;
  working: string;
  /** {line} を行番号に置き換える */
  issueMissingColon: string;
  issueEmptyUsername: string;
  issueInvalidUsername: string;
  issueEmptyPassword: string;
  issueDuplicateUsername: string;
  issuePasswordTooLong: string;
  /** {n} を上限数に置き換える */
  truncated: string;
  noUsers: string;
  outputLabel: string;
  headersLabel: string;
  headersHint: string;
  copy: string;
  copied: string;
  copyFailed: string;
  download: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const htpasswdGeneratorContent: Record<
  Locale,
  HtpasswdGeneratorPageContent
> = {
  ja: {
    title: '.htpasswd生成（Basic認証・bcrypt/SHA-1）',
    description:
      'ユーザー名とパスワードからBasic認証用の.htpasswdをbcryptまたはSHA-1で生成。複数ユーザーとAuthorizationヘッダーにも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '.htpasswd生成（Basic認証用・bcrypt/SHA-1）',
    introHtml:
      'ApacheのBasic認証に使う .htpasswd の行を、ユーザー名とパスワードから生成します。複数ユーザーをまとめて作成でき、確認用の Authorization ヘッダーも出力します。ブラウザ内で処理され、パスワードがサーバーに送信されることはありません。認証の設定自体は <a href="/tools/htaccess-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">.htaccess生成</a> や、単体のハッシュ生成・照合は <a href="/tools/bcrypt-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">bcryptハッシュ生成・照合</a> をご利用ください。',
    howToHeading: '使い方',
    howToSteps: [
      '「ユーザーとパスワード」に、「ユーザー名:パスワード」の形式で1行ずつ入力します。',
      '「ハッシュ方式」を選びます（通常はbcrypt）。bcryptでは「コスト」も選べます。',
      '「生成する」を押し、出力された .htpasswd の内容を「コピー」または「ダウンロード」します。',
      'サーバー上のWeb公開ディレクトリの外に .htpasswd として置き、.htaccess の AuthUserFile にそのパスを指定します。',
    ],
    usersLabel: 'ユーザーとパスワード',
    usersHint:
      '1行に1ユーザー、「ユーザー名:パスワード」の形式です。パスワードに「:」を含めても構いませんが、ユーザー名には使えません。',
    usersPlaceholder: 'alice:password1\nbob:password2',
    algorithmLabel: 'ハッシュ方式',
    algorithmBcrypt: 'bcrypt（推奨）',
    algorithmSha1: 'SHA-1（{SHA}形式・非推奨）',
    costLabel: 'コスト',
    costHint:
      '値が1増えると計算時間が約2倍になります。ユーザー数が多いと時間がかかります。',
    generateButton: '生成する',
    working: '計算中…',
    issueMissingColon:
      '{line}行目: 「:」がありません（ユーザー名:パスワード）。',
    issueEmptyUsername: '{line}行目: ユーザー名が空です。',
    issueInvalidUsername:
      '{line}行目: ユーザー名の前後に空白、または制御文字があります。',
    issueEmptyPassword: '{line}行目: パスワードが空です。',
    issueDuplicateUsername: '{line}行目: 同じユーザー名が重複しています。',
    issuePasswordTooLong:
      '{line}行目: bcryptは72バイトまでのため、パスワードが長すぎます。',
    truncated:
      '一度に処理できるのは{n}ユーザーまでです。残りは処理していません。',
    noUsers: '有効なユーザーがありません。',
    outputLabel: '.htpasswd の内容',
    headersLabel: 'Authorization ヘッダー（動作確認用）',
    headersHint:
      'curl -H や API クライアントで、認証が通るかを確認するときに使えます。',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    download: 'ダウンロード',
    notesHeading: '注意事項',
    notes: [
      'bcryptは$2y$形式で出力します。Apacheの標準的なbcrypt形式です（$2b$と計算結果は同じです）。Apache 2.4以降で利用できます。',
      'SHA-1はソルトがなく高速に計算できるため、総当たりに弱い方式です。bcryptに対応していない古い環境でだけ使ってください。',
      'bcryptは先頭72バイトまでのパスワードに対応します。72バイトを超える行はエラーになります。',
      'Basic認証はパスワードをBase64にするだけで、暗号化ではありません。必ずHTTPSと併用してください。',
      'ここで入力するのは、本番で使っているパスワードではなくテスト用の値をおすすめします。入力内容は保存・送信されませんが、画面共有などにご注意ください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '.htpasswd',
        description:
          'Basic認証のユーザー名とパスワードのハッシュを「ユーザー名:ハッシュ」の形で1行ずつ保存するファイルです。Web公開ディレクトリの外に置くのが基本です。',
      },
      {
        term: 'Basic認証',
        description:
          'HTTPの標準的な認証方式です。ブラウザが「ユーザー名:パスワード」をBase64にして Authorization ヘッダーで送ります。',
      },
      {
        term: '{SHA}形式',
        description:
          'パスワードのSHA-1をBase64にして、先頭に{SHA}を付けたhtpasswdの形式です。ソルトがなく、現在は推奨されません。',
      },
    ],
  },
  en: {
    title: 'Htpasswd Generator (bcrypt, SHA-1) for Basic Auth',
    description:
      'Generate .htpasswd lines with bcrypt or SHA-1 for multiple users, plus Authorization: Basic headers. Runs in your browser; nothing is sent to a server.',
    h1: 'Htpasswd Generator for Basic Auth (bcrypt / SHA-1)',
    introHtml:
      'Create the lines of an Apache .htpasswd file from usernames and passwords. Add several users at once and get matching Authorization headers for testing. Everything runs in your browser, and your passwords are never sent to a server. To write the auth rules themselves, see the <a href="/en/tools/htaccess-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">.htaccess Generator</a>; for a single hash or a check, use the <a href="/en/tools/bcrypt-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Bcrypt Hash Generator</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Enter one "username:password" pair per line in "Users and passwords".',
      'Pick a "Hash algorithm" (bcrypt is the usual choice). With bcrypt you can also set the "Cost".',
      'Click "Generate", then "Copy" or "Download" the .htpasswd content.',
      'Save it as .htpasswd on the server outside the public web root, and point AuthUserFile in your .htaccess to that path.',
    ],
    usersLabel: 'Users and passwords',
    usersHint:
      'One user per line as username:password. The password may contain a colon, but the username cannot.',
    usersPlaceholder: 'alice:password1\nbob:password2',
    algorithmLabel: 'Hash algorithm',
    algorithmBcrypt: 'bcrypt (recommended)',
    algorithmSha1: 'SHA-1 ({SHA} format, not recommended)',
    costLabel: 'Cost',
    costHint:
      'Each +1 roughly doubles the computation time. Many users take longer.',
    generateButton: 'Generate',
    working: 'Working…',
    issueMissingColon: 'Line {line}: no ":" found (use username:password).',
    issueEmptyUsername: 'Line {line}: the username is empty.',
    issueInvalidUsername:
      'Line {line}: the username has leading/trailing spaces or control characters.',
    issueEmptyPassword: 'Line {line}: the password is empty.',
    issueDuplicateUsername: 'Line {line}: this username is a duplicate.',
    issuePasswordTooLong:
      "Line {line}: the password is over bcrypt's 72-byte limit.",
    truncated:
      'Up to {n} users can be processed at once. The rest were skipped.',
    noUsers: 'No valid users to process.',
    outputLabel: '.htpasswd content',
    headersLabel: 'Authorization headers (for testing)',
    headersHint:
      'Handy for checking that authentication works with curl -H or an API client.',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    download: 'Download',
    notesHeading: 'Notes',
    notes: [
      'bcrypt hashes are written in the $2y$ form, the standard bcrypt prefix for Apache (same result as $2b$). Apache 2.4 or later supports it.',
      'SHA-1 has no salt and is fast to compute, so it is weak against brute force. Use it only for old environments without bcrypt support.',
      'bcrypt handles passwords up to 72 bytes. Lines over that limit are reported as errors.',
      'Basic auth only Base64-encodes the password; it is not encryption. Always use it over HTTPS.',
      'Prefer test values over real production passwords. Nothing you type is stored or sent, but be careful when sharing your screen.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: '.htpasswd',
        description:
          'A file that stores one "username:hash" line per user for Basic authentication. It should be kept outside the public web root.',
      },
      {
        term: 'Basic authentication',
        description:
          'A standard HTTP auth scheme. The browser Base64-encodes "username:password" and sends it in the Authorization header.',
      },
      {
        term: '{SHA} format',
        description:
          "An htpasswd format that stores the Base64 of the password's SHA-1 prefixed with {SHA}. It has no salt and is no longer recommended.",
      },
    ],
  },
};
