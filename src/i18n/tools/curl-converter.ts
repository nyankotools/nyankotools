import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CurlConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleCommand: string;
  formatLabel: string;
  formatFetchLabel: string;
  formatAxiosLabel: string;
  outputLabel: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  errorNotCurl: string;
  errorNoUrl: string;
  errorUnclosedQuote: string;
  /** `{option}` を置換して使うテンプレート */
  warnUnsupportedOptionTemplate: string;
  /** `{value}` を置換して使うテンプレート */
  warnFileReferenceTemplate: string;
  warnInsecure: string;
  /** `{url}` を置換して使うテンプレート */
  warnMultipleUrlsTemplate: string;
  /** `{method}` を置換して使うテンプレート */
  warnBodyNotAllowedTemplate: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const curlConverterContent: Record<Locale, CurlConverterPageContent> = {
  ja: {
    title: 'cURL→Fetch/Axios変換（curlコマンドをJavaScriptコードに）',
    description:
      'curlコマンドをfetch・axiosのJavaScriptコードに変換する無料ツールです。ヘッダー・JSON・フォーム・Basic認証に対応。ブラウザの「cURLとしてコピー」の貼り付けにも使えます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'cURL→Fetch/Axios変換',
    introHtml:
      'curlコマンドを貼り付けると、同じリクエストを行う <code>fetch</code> または <code>axios</code> のコードに変換します。APIドキュメントのcurl例や、ブラウザの開発者ツールからコピーしたcURLコマンドをそのままコードに移したいときに便利です。コマンドを解析するだけで、実際の通信は行いません。リクエストボディのJSONを確認・整形したい場合は <a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a> もあわせてご利用ください。',
    inputLabel: 'curlコマンド',
    inputPlaceholder: `curl -X POST https://api.example.com/users -H 'Content-Type: application/json' -d '{"name":"Taro"}'`,
    sampleCommand: `curl -X POST 'https://api.example.com/users' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer YOUR_TOKEN' \\
  -d '{"name":"Taro","age":20}'`,
    formatLabel: '出力形式',
    formatFetchLabel: 'fetch',
    formatAxiosLabel: 'axios',
    outputLabel: '変換結果（JavaScript）',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorNotCurl:
      'curlコマンドとして解釈できません。「curl」で始まるコマンドを貼り付けてください。',
    errorNoUrl:
      'URLが見つかりません。コマンドにリクエスト先のURLを含めてください。',
    errorUnclosedQuote: '引用符（\' または "）が閉じられていません。',
    warnUnsupportedOptionTemplate:
      '未対応のオプション {option} は無視しました。',
    warnFileReferenceTemplate:
      'ファイル参照（{value}）は読み込めないため、中身を自分で差し替えてください。',
    warnInsecure:
      '-k / --insecure（証明書検証の無効化）はfetch・axiosでは指定できないため無視しました。',
    warnMultipleUrlsTemplate:
      'URLが複数あります。最初のURL（{url}）のみ変換しました。',
    warnBodyNotAllowedTemplate:
      'メソッドが {method} のためボディを付けられず、fetchでは実行時エラーになります。メソッドかボディを見直してください。',
    howToHeading: '使い方',
    howToSteps: [
      '「curlコマンド」欄にコマンドを貼り付けます（複数行・行末の「\\」にも対応）。',
      '「出力形式」でfetchまたはaxiosを選びます。',
      '「変換結果」のコードを「コピー」して、プロジェクトに貼り付けます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '変換できるのは主要なオプション（-X・-H・-d / --data-*・--json・-F・-u・-A・-e・-b・-G・-I・--url）です。それ以外のオプションは無視し、画面に警告を表示します。',
      '-d @ファイル名 や -F の @ファイル名 のようなファイル参照は、ブラウザ上で読み込めないため変換結果で自分で差し替える必要があります。',
      'Cookie・User-Agent・Referer ヘッダーは、ブラウザ上のfetch・axiosでは設定できません（Node.jsでは設定できます）。ブラウザで使う場合は、サーバー側のCORS設定も必要です。',
      '本ツールはコマンドの解析とコード生成のみを行い、curlの実行やAPIへのリクエストは一切行いません。入力内容はサーバーに送信されませんが、トークンなどの機密情報を含むコマンドは、生成コードを共有・公開する前に必ず確認してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'cURL',
        description:
          'URLを指定してHTTPなどの通信を行うコマンドラインツールです。APIドキュメントのリクエスト例としてよく使われます。',
      },
      {
        term: 'fetch',
        description:
          'ブラウザやNode.js（18以降）に標準で備わるHTTPリクエストのAPIです。追加のライブラリなしで使え、Promiseベースで書けます。',
      },
      {
        term: 'axios',
        description:
          'HTTPリクエストを行うJavaScriptライブラリです。JSONの自動変換やBasic認証の指定がしやすく、ブラウザとNode.jsの両方で動作します。',
      },
      {
        term: 'CORS',
        description:
          'ブラウザが別オリジンへのリクエストを許可するかどうかを、サーバー側のヘッダーで制御する仕組みです。curlでは問題なく通るリクエストも、ブラウザのfetch・axiosではCORSの設定が不足していて失敗することがあります。',
      },
    ],
  },
  en: {
    title: 'cURL to Fetch / Axios Converter',
    description:
      'Convert curl commands to JavaScript fetch or axios code, with headers, JSON, form data, and basic auth. Runs in your browser; nothing is sent to a server.',
    h1: 'cURL to Fetch / Axios Converter',
    introHtml:
      'Paste a curl command and get the equivalent <code>fetch</code> or <code>axios</code> code. Handy for turning the curl examples in API docs, or a curl command copied from your browser DevTools, into working JavaScript. The command is only parsed — no request is ever made. To inspect or pretty-print a JSON request body, try the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a> as well.',
    inputLabel: 'curl command',
    inputPlaceholder: `curl -X POST https://api.example.com/users -H 'Content-Type: application/json' -d '{"name":"Taro"}'`,
    sampleCommand: `curl -X POST 'https://api.example.com/users' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer YOUR_TOKEN' \\
  -d '{"name":"Taro","age":20}'`,
    formatLabel: 'Output format',
    formatFetchLabel: 'fetch',
    formatAxiosLabel: 'axios',
    outputLabel: 'Result (JavaScript)',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorNotCurl:
      'This does not look like a curl command. Paste a command that starts with "curl".',
    errorNoUrl: 'No URL found. Include the request URL in the command.',
    errorUnclosedQuote: 'A quote (\' or ") is not closed.',
    warnUnsupportedOptionTemplate: 'Ignored unsupported option {option}.',
    warnFileReferenceTemplate:
      'File reference ({value}) cannot be read in the browser; replace it with the real content in the result.',
    warnInsecure:
      'Ignored -k / --insecure (disabling certificate checks); it cannot be expressed in fetch or axios.',
    warnMultipleUrlsTemplate:
      'Multiple URLs found. Only the first one ({url}) was converted.',
    warnBodyNotAllowedTemplate:
      'The method is {method}, which cannot have a body; fetch will throw at runtime. Review the method or the body.',
    howToHeading: 'How to use',
    howToSteps: [
      'Paste your command into the "curl command" box (multi-line commands with a trailing "\\" work too).',
      'Pick fetch or axios under "Output format".',
      'Click "Copy" on the result and paste the code into your project.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The main options are converted: -X, -H, -d / --data-*, --json, -F, -u, -A, -e, -b, -G, -I, and --url. Any other option is ignored and a warning is shown.',
      'File references such as -d @filename or -F field=@filename cannot be read in the browser, so you need to replace them in the result yourself.',
      'The Cookie, User-Agent, and Referer headers cannot be set from fetch or axios in a browser (Node.js allows them). In a browser you also need the right CORS settings on the server.',
      'This tool only parses the command and generates code; it never runs curl or calls any API. Your input is not sent to a server, but if the command contains tokens or other secrets, check the generated code before you share or publish it.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'cURL',
        description:
          'A command-line tool for transferring data over HTTP and other protocols from a URL. API documentation often uses it for request examples.',
      },
      {
        term: 'fetch',
        description:
          'The built-in HTTP request API in browsers and Node.js 18+. It needs no extra library and is Promise-based.',
      },
      {
        term: 'axios',
        description:
          'A JavaScript HTTP client library that works in both the browser and Node.js. It makes automatic JSON handling and basic auth easy.',
      },
      {
        term: 'CORS',
        description:
          'A mechanism where the server uses response headers to say whether a browser may call it from another origin. A request that works with curl can still fail in browser fetch or axios if CORS is not configured.',
      },
    ],
  },
};
