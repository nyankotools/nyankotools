import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface UrlParserPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  baseLabel: string;
  basePlaceholder: string;
  baseHint: string;
  partsHeading: string;
  partProtocol: string;
  partUsername: string;
  partPassword: string;
  partHostname: string;
  partPort: string;
  partPathname: string;
  partHash: string;
  paramsHeading: string;
  paramKey: string;
  paramValue: string;
  paramsEmpty: string;
  paramRemove: string;
  paramUp: string;
  paramDown: string;
  paramAdd: string;
  paramSort: string;
  duplicateKeys: string;
  plusForSpace: string;
  resolvedNotice: string;
  missingSchemeNotice: string;
  outputLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  errorEmpty: string;
  errorInvalid: string;
  errorInvalidBase: string;
  errorBuild: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const urlParserContent: Record<Locale, UrlParserPageContent> = {
  ja: {
    title: 'URLパーサー・クエリパラメータ編集',
    description:
      'URLをプロトコル・ホスト・パス・クエリ・ハッシュに分解し、クエリパラメータの追加・削除・並べ替え・編集をして再組み立てできる無料ツールです。重複キーや相対URLにも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'URLパーサー・クエリパラメータ編集',
    introHtml:
      'URLを貼り付けると、プロトコル・ホスト・パス・クエリ・ハッシュに分解します。クエリパラメータは行ごとに編集・削除・並べ替えができ、結果のURLがその場で組み立て直されます。パラメータ値のエンコードだけ行いたい場合は <a href="/tools/url-encode/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">URLエンコード/デコード</a> もご利用ください。',
    inputLabel: 'URL',
    inputPlaceholder: 'https://example.com/path?key=value#section',
    baseLabel: 'ベースURL（相対URLの解決用・任意）',
    basePlaceholder: 'https://example.com/dir/',
    baseHint: '入力が「/path?x=1」のような相対URLのときに使います。',
    partsHeading: 'URLの構成要素',
    partProtocol: 'プロトコル（スキーム）',
    partUsername: 'ユーザー名',
    partPassword: 'パスワード',
    partHostname: 'ホスト名',
    partPort: 'ポート',
    partPathname: 'パス',
    partHash: 'ハッシュ（#以降）',
    paramsHeading: 'クエリパラメータ',
    paramKey: 'キー',
    paramValue: '値',
    paramsEmpty: 'クエリパラメータはありません。',
    paramRemove: '削除',
    paramUp: '上へ',
    paramDown: '下へ',
    paramAdd: 'パラメータを追加',
    paramSort: 'キーで並べ替え',
    duplicateKeys: '重複しているキー: ',
    plusForSpace: 'スペースを「+」で表す（既定は「%20」）',
    resolvedNotice: 'ベースURLで解決した絶対URLを元に組み立てています。',
    missingSchemeNotice:
      'プロトコル（https:// など）がないため、ホスト名が空になっています。先頭に https:// を付けて試してください。',
    outputLabel: '組み立てたURL',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorEmpty: 'URLを入力してください。',
    errorInvalid:
      'URLとして解釈できませんでした。「https://」などのプロトコルから始まる形式か確認してください。相対URLの場合はベースURLを指定します。',
    errorInvalidBase:
      'ベースURLが正しくありません。「https://」から始まる絶対URLを指定してください。',
    errorBuild:
      '編集内容からURLを組み立てられませんでした。プロトコル・ホスト名・ポート番号を確認してください。',
    howToHeading: '使い方',
    howToSteps: [
      '「URL」欄に分解したいURLを貼り付けます。相対URLの場合は「ベースURL」も入力します。',
      '構成要素やクエリパラメータの行を編集します。追加・削除・並べ替えもできます。',
      '「組み立てたURL」を確認し、「コピー」で取り出します。',
    ],
    notesHeading: '注意事項',
    notes: [
      'URLにトークンやパスワードが含まれることがありますが、入力内容はブラウザ内でのみ処理され、送信されません。',
      '再組み立て時、クエリは正規化されます（例: 日本語はパーセントエンコード、スペースは既定で「%20」）。元の表記と文字列が変わる場合があります。',
      'ブラウザ標準のURL解析に従います。localhost:8080/x のようにプロトコルのない文字列は、localhostというスキームとして解釈されることがあります。',
      'プロトコルを http と https のような同種のものに変更することはできますが、特殊なスキーム（http・https・ftp・file・ws・wss）と、それ以外のスキーム間の変更はできません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'クエリ文字列',
        description:
          'URLの「?」から「#」の手前までの部分です。「key=value」を「&」でつないだ形式で、同じキーを複数回指定することもできます。',
      },
      {
        term: 'フラグメント（ハッシュ）',
        description:
          'URLの「#」以降の部分です。ページ内の位置などを示し、サーバーには送信されません。',
      },
      {
        term: '相対URL',
        description:
          '「/path」や「../a」のようにプロトコルやホストを省略したURLです。基準となるベースURLと組み合わせて絶対URLに解決されます。',
      },
    ],
  },
  en: {
    title: 'URL Parser & Query String Editor',
    description:
      'Split a URL into protocol, host, path, query and hash, edit query parameters and rebuild it. Runs in your browser.',
    h1: 'URL Parser & Query String Editor',
    introHtml:
      'Paste a URL to split it into protocol, host, path, query and hash. Edit, delete or reorder each query parameter and the final URL is rebuilt instantly. If you only need to escape a value, use the <a href="/en/tools/url-encode/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">URL Encoder/Decoder</a>.',
    inputLabel: 'URL',
    inputPlaceholder: 'https://example.com/path?key=value#section',
    baseLabel: 'Base URL (optional, for relative URLs)',
    basePlaceholder: 'https://example.com/dir/',
    baseHint: 'Used when the input is a relative URL such as "/path?x=1".',
    partsHeading: 'URL components',
    partProtocol: 'Protocol (scheme)',
    partUsername: 'Username',
    partPassword: 'Password',
    partHostname: 'Hostname',
    partPort: 'Port',
    partPathname: 'Path',
    partHash: 'Hash (after #)',
    paramsHeading: 'Query parameters',
    paramKey: 'Key',
    paramValue: 'Value',
    paramsEmpty: 'This URL has no query parameters.',
    paramRemove: 'Remove',
    paramUp: 'Up',
    paramDown: 'Down',
    paramAdd: 'Add parameter',
    paramSort: 'Sort by key',
    duplicateKeys: 'Duplicate keys: ',
    plusForSpace: 'Write spaces as "+" (default is "%20")',
    resolvedNotice: 'Rebuilt from the absolute URL resolved against the base.',
    missingSchemeNotice:
      'The host is empty because the URL has no scheme (such as https://). Try adding https:// at the start.',
    outputLabel: 'Rebuilt URL',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorEmpty: 'Enter a URL.',
    errorInvalid:
      'Could not parse this as a URL. Start with a scheme such as "https://", or give a base URL if it is relative.',
    errorInvalidBase:
      'The base URL is not valid. Use an absolute URL that starts with "https://" or similar.',
    errorBuild:
      'Could not rebuild a URL from these edits. Check the protocol, hostname and port.',
    howToHeading: 'How to use',
    howToSteps: [
      'Paste the URL into the "URL" field. For a relative URL, also fill in the base URL.',
      'Edit the components or query parameter rows. You can also add, remove and reorder them.',
      'Check the "Rebuilt URL" and press "Copy".',
    ],
    notesHeading: 'Notes',
    notes: [
      'URLs often contain tokens or passwords. What you enter is processed only in your browser and is never sent anywhere.',
      'The query is normalized when rebuilt (non-ASCII text is percent-encoded and spaces become "%20" by default), so the text may differ from your original.',
      "Parsing follows the browser's built-in URL rules. A string without a scheme such as localhost:8080/x may be read as having the scheme localhost.",
      'You can switch between special schemes (http, https, ftp, file, ws, wss), but not between a special and a non-special scheme.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Query string',
        description:
          'The part of a URL from "?" up to "#". It is a list of key=value pairs joined by "&", and the same key may appear more than once.',
      },
      {
        term: 'Fragment (hash)',
        description:
          'The part after "#". It points to a position in the page and is never sent to the server.',
      },
      {
        term: 'Relative URL',
        description:
          'A URL such as "/path" or "../a" with the scheme and host omitted. It is resolved against a base URL to form an absolute URL.',
      },
    ],
  },
};
