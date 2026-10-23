import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface FetchToCurlPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleCode: string;
  multilineLabel: string;
  outputLabel: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  errorSyntax: string;
  errorNoRequest: string;
  errorNoUrl: string;
  /** `{option}` を置換して使うテンプレート */
  warnUnsupportedOptionTemplate: string;
  /** `{expr}` を置換して使うテンプレート */
  warnUnresolvedTemplate: string;
  /** `{count}` を置換して使うテンプレート */
  warnMultipleRequestsTemplate: string;
  /** `{method}` を置換して使うテンプレート */
  warnBodyNotAllowedTemplate: string;
  warnCredentials: string;
  warnBodyObject: string;
  /** `{url}` を置換して使うテンプレート */
  warnRelativeUrlTemplate: string;
  /** `{name}` を置換して使うテンプレート */
  warnFileReferenceTemplate: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const fetchToCurlContent: Record<Locale, FetchToCurlPageContent> = {
  ja: {
    title: 'Fetch/Axios→cURL変換（JavaScriptのコードをcurlコマンドに）',
    description:
      'fetch()・axiosのJavaScriptコードをcurlコマンドに変換する無料ツールです。method・headers・body・JSON.stringify・FormDataに対応。コードは実行せず解析のみ。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Fetch/Axios→cURL変換',
    introHtml:
      'fetch() や axios のコードを貼り付けると、同じリクエストを送る <code>curl</code> コマンドに変換します。ブラウザの開発者ツールでコピーしたfetchのコードや、ドキュメントのサンプルコードをターミナルで試したいときに便利です。コードは実行（eval）せず、文字列・オブジェクト・同じコード内の変数などのリテラルだけを読み取るため、通信も行いません。逆方向の変換は <a href="/tools/curl-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">cURL→Fetch/Axios変換</a> をご利用ください。',
    inputLabel: 'fetch / axios のコード',
    inputPlaceholder: `fetch("https://api.example.com/users", {\n  method: "POST",\n  body: JSON.stringify({ name: "Taro" }),\n});`,
    sampleCode: `const response = await fetch("https://api.example.com/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_TOKEN",
  },
  body: JSON.stringify({ name: "Taro", age: 20 }),
});`,
    multilineLabel: 'オプションごとに改行する',
    outputLabel: '変換結果（curlコマンド）',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorSyntax:
      'コードを解析できませんでした。括弧や引用符が閉じているか確認し、fetch() または axios の呼び出しを含めてください。',
    errorNoRequest:
      'fetch() または axios の呼び出しが見つかりません。fetch(...)、axios(...)、axios.get(...) などを含めてください。',
    errorNoUrl:
      'URLが見つかりません。呼び出しの最初の引数にURLを指定してください。',
    warnUnsupportedOptionTemplate:
      '未対応のオプション {option} は無視しました。',
    warnUnresolvedTemplate:
      '値を特定できない式 {expr} は、プレースホルダ <{expr}> のまま出力しました。実際の値に置き換えてください。',
    warnMultipleRequestsTemplate:
      'リクエストが複数あります。最初の1件のみ変換し、残り {count} 件は無視しました。',
    warnBodyNotAllowedTemplate:
      'メソッドが {method} のためボディを付けられず、fetchでは実行時エラーになります。メソッドかボディを見直してください。',
    warnCredentials:
      'credentials: "include"（withCredentials）はcurlでは表せません。Cookieを送る場合は -b オプションなどで追加してください。',
    warnBodyObject:
      'fetchのbodyにオブジェクトをそのまま渡すと "[object Object]" が送られます。JSON.stringify() で文字列にする必要があります。',
    warnRelativeUrlTemplate:
      'URL（{url}）が相対パスです。curlで使うにはホスト名を含む完全なURLに置き換えてください。',
    warnFileReferenceTemplate:
      'ファイル（{name}）は @ファイル名 の形で出力しました。実際のファイルパスに置き換えてください。',
    howToHeading: '使い方',
    howToSteps: [
      '「fetch / axios のコード」欄にコードを貼り付けます（関数やasync関数の中のコードもそのまま貼れます）。',
      '必要に応じて「オプションごとに改行する」を切り替えます。',
      '「変換結果」のcurlコマンドを「コピー」して、ターミナルに貼り付けます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '対応しているのは fetch(url, init)、axios(config)、axios.get / post / put / patch / delete / head / options / request の呼び出しです。method・headers・body・credentials・redirect・referrer、axiosの baseURL・params・data・auth・timeout などを変換します。それ以外のオプションは無視し、画面に警告を表示します。',
      'コードは評価（実行）せず、文字列・数値・オブジェクト・配列・テンプレートリテラル、同じコード内の const / let / var で宣言した値、JSON.stringify や new URLSearchParams / FormData / Headers などだけを読み取ります。関数呼び出しの結果（トークン取得関数など）や外部の変数は値を特定できないため、<名前> の形のプレースホルダで出力します。',
      'axios.create() で作ったインスタンスや、リクエストを組み立てる独自関数、ES Modulesの別ファイルにある値は追跡できません。複数のリクエストがあるコードでは最初の1件だけを変換します。',
      "curlコマンドはシェルの単一引用符（'）で囲んで出力するため、macOS・Linuxのシェルでそのまま使えます。Windowsのコマンドプロンプトでは引用符の扱いが異なるため、PowerShellやGit Bashで実行してください。トークンなどの機密情報が含まれる場合は、コマンドを共有・公開する前に必ず確認してください。",
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'fetch',
        description:
          'ブラウザやNode.js（18以降）に標準で備わるHTTPリクエストのAPIです。fetch(URL, { method, headers, body }) の形で呼び出します。',
      },
      {
        term: 'axios',
        description:
          'HTTPリクエストを行うJavaScriptライブラリです。axios.post(URL, データ, 設定) のように書き、オブジェクトを渡すと自動でJSONとして送信します。',
      },
      {
        term: 'cURL',
        description:
          'URLを指定してHTTPなどの通信を行うコマンドラインツールです。-X でメソッド、-H でヘッダー、--data-raw でボディを指定します。',
      },
      {
        term: 'FormData',
        description:
          'フォームの項目やファイルをmultipart/form-data形式で送るためのオブジェクトです。curlでは -F オプションに対応します。',
      },
    ],
  },
  en: {
    title: 'Fetch / Axios to cURL Converter',
    description:
      'Convert JavaScript fetch() and axios code to a curl command. Handles method, headers, JSON bodies, and FormData. The code is parsed, never run, in your browser.',
    h1: 'Fetch / Axios to cURL Converter',
    introHtml:
      'Paste a <code>fetch()</code> or axios call and get the equivalent <code>curl</code> command. Handy for trying a sample from the docs, or the Copy as fetch output from your browser DevTools, in a terminal. The code is never run (no eval): the tool only reads literals such as strings, objects, and variables declared in the same snippet, and it makes no request. For the opposite direction, use the <a href="/en/tools/curl-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">cURL to Fetch / Axios Converter</a>.',
    inputLabel: 'fetch / axios code',
    inputPlaceholder: `fetch("https://api.example.com/users", {\n  method: "POST",\n  body: JSON.stringify({ name: "Taro" }),\n});`,
    sampleCode: `const response = await fetch("https://api.example.com/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_TOKEN",
  },
  body: JSON.stringify({ name: "Taro", age: 20 }),
});`,
    multilineLabel: 'Put each option on its own line',
    outputLabel: 'Result (curl command)',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorSyntax:
      'Could not parse the code. Check that brackets and quotes are closed and that it contains a fetch() or axios call.',
    errorNoRequest:
      'No fetch() or axios call found. Include something like fetch(...), axios(...), or axios.get(...).',
    errorNoUrl: 'No URL found. Pass the URL as the first argument of the call.',
    warnUnsupportedOptionTemplate: 'Ignored unsupported option {option}.',
    warnUnresolvedTemplate:
      'The value of {expr} could not be determined, so it was left as the placeholder <{expr}>. Replace it with the real value.',
    warnMultipleRequestsTemplate:
      'Multiple requests found. Only the first one was converted; the other {count} were ignored.',
    warnBodyNotAllowedTemplate:
      'The method is {method}, which cannot have a body; fetch will throw at runtime. Review the method or the body.',
    warnCredentials:
      'credentials: "include" (withCredentials) has no curl equivalent. If you need to send cookies, add them with -b.',
    warnBodyObject:
      'Passing an object directly as the fetch body sends "[object Object]". Convert it to a string with JSON.stringify().',
    warnRelativeUrlTemplate:
      'The URL ({url}) is a relative path. Replace it with a full URL that includes the host to use it with curl.',
    warnFileReferenceTemplate:
      'The file ({name}) was written as @filename. Replace it with the real file path.',
    howToHeading: 'How to use',
    howToSteps: [
      'Paste your code into the "fetch / axios code" box (code inside a function or async function works as-is).',
      'Toggle "Put each option on its own line" if you prefer a one-line command.',
      'Click "Copy" on the curl command in the result and paste it into your terminal.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Supported calls are fetch(url, init), axios(config), and axios.get / post / put / patch / delete / head / options / request. It converts method, headers, body, credentials, redirect, and referrer, plus axios baseURL, params, data, auth, and timeout. Any other option is ignored and a warning is shown.',
      'The code is never evaluated. Only strings, numbers, objects, arrays, template literals, values declared with const / let / var in the same snippet, and JSON.stringify, new URLSearchParams / FormData / Headers are read. Results of function calls (such as a token getter) or outside variables cannot be known, so they are written as <name> placeholders.',
      'Instances from axios.create(), custom wrapper functions that build the request, and values defined in other files cannot be followed. If the code has several requests, only the first one is converted.',
      'The curl command is quoted with single quotes, so it works as-is in macOS and Linux shells. The Windows Command Prompt handles quotes differently; use PowerShell or Git Bash. If the code contains tokens or other secrets, check the command before you share or publish it.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'fetch',
        description:
          'The built-in HTTP request API in browsers and Node.js 18+. You call it as fetch(url, { method, headers, body }).',
      },
      {
        term: 'axios',
        description:
          'A JavaScript HTTP client library. You write axios.post(url, data, config), and objects are sent as JSON automatically.',
      },
      {
        term: 'cURL',
        description:
          'A command-line tool for transferring data over HTTP and other protocols from a URL. -X sets the method, -H a header, and --data-raw the body.',
      },
      {
        term: 'FormData',
        description:
          'An object for sending form fields and files as multipart/form-data. In curl it corresponds to the -F option.',
      },
    ],
  },
};
