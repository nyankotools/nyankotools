import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface JwtDecoderPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  headerLabel: string;
  payloadLabel: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  claimsHeading: string;
  claimsColumnClaim: string;
  claimsColumnUnixSeconds: string;
  claimsColumnDate: string;
  signatureLabel: string;
  errorInvalidBase64: string;
  errorInvalidJson: string;
  errorInvalidFormat: string;
  notesHeading: string;
  noteSignatureNotVerified: string;
  noteSensitivePayload: string;
  noteTimeClaimsBeforeCode: string;
  noteTimeClaimsAfterCode: string;
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const jwtDecoderContent: Record<Locale, JwtDecoderPageContent> = {
  ja: {
    title: 'JWTデコーダー（ヘッダー・ペイロード確認）',
    description:
      'JWT（JSON Web Token）をブラウザ上でデコードし、ヘッダーとペイロードを整形して表示する無料ツールです。exp・iat・nbfなどの日時クレームも人が読める日時形式に変換します。署名の検証は行いません。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'JWTデコーダー',
    introHtml:
      'JWT（JSON Web Token）を貼り付けると、ヘッダーとペイロードをJSON形式で整形して表示します。<code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">exp</code> <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">iat</code> <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">nbf</code> などの日時クレームは人が読める形式でも表示します。署名の検証は行わないため、トークンの正当性の確認には使えません。ペイロード部分はただのJSONなので、整形結果をさらに詳しく見たい場合は <a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a> もあわせてご利用ください。',
    inputLabel: 'JWT',
    inputPlaceholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....',
    headerLabel: 'ヘッダー',
    payloadLabel: 'ペイロード',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    claimsHeading: '日時クレーム',
    claimsColumnClaim: 'クレーム',
    claimsColumnUnixSeconds: 'UNIX秒',
    claimsColumnDate: '日時（ローカルタイムゾーン）',
    signatureLabel: '署名（未検証）',
    errorInvalidBase64:
      'Base64URLとして不正な文字列のためデコードできませんでした。',
    errorInvalidJson: 'JSONとして解析できませんでした。',
    errorInvalidFormat:
      'JWTの形式が正しくありません。「ヘッダー.ペイロード.署名」の3つがドットで区切られている必要があります。',
    notesHeading: '注意点',
    noteSignatureNotVerified:
      'このツールは署名の検証を行いません。ヘッダーとペイロードはBase64URLをデコードしてJSONとして表示しているだけで、トークンが正規の発行元によって作られたものかどうかは保証されません。',
    noteSensitivePayload:
      'JWTのペイロードには機密情報が含まれる場合があります。すべての処理はブラウザ内で完結しており、入力したトークンがサーバーに送信されることはありませんが、本番環境の実際のトークンを扱う際は取り扱いにご注意ください。',
    noteTimeClaimsBeforeCode: '日時クレーム（',
    noteTimeClaimsAfterCode:
      '）はUNIX秒（1970年1月1日からの秒数）として解釈し、お使いの端末のローカルタイムゾーンで表示します。',
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'JWT（JSON Web Token）',
        description:
          'ユーザー情報や権限などの「クレーム」をJSON形式で表現し、電子署名を付けてやり取りするためのトークン形式です。ログイン後の認証トークンやAPIのアクセストークンとしてよく使われます。「ヘッダー.ペイロード.署名」の3つをドット区切りで連結し、それぞれBase64URLでエンコードした文字列です。',
      },
      {
        term: 'ヘッダー（Header）',
        description:
          '使用している署名アルゴリズム（`alg`、例: HS256, RS256）やトークンの種類（`typ`、通常は"JWT"）を表すJSONです。',
      },
      {
        term: 'ペイロード（Payload）',
        description:
          '実際に運びたいデータ（クレーム）が入ったJSONです。`sub`（対象ユーザー）、`iat`（発行日時）、`exp`（有効期限）、`nbf`（有効開始日時）などは仕様で意味が定義された「登録済みクレーム」ですが、アプリケーション独自のクレームを含めることもできます。',
      },
      {
        term: '署名（Signature）',
        description:
          'ヘッダーとペイロードが改ざんされていないことを検証するための値です。秘密鍵や公開鍵を使って計算されるため、鍵を知らない第三者は正しい署名を作れません。このツールは署名を検証せず、内容の確認のみを行います。',
      },
      {
        term: 'Base64URL',
        description:
          'Base64エンコードの一種で、URLやファイル名で問題になりやすい `+` `/` `=` をそれぞれ `-` `_`（と省略）に置き換えたものです。JWTの各セグメントはこの形式でエンコードされています。',
      },
    ],
  },
  en: {
    title: 'JWT Decoder (Header & Payload Viewer)',
    description:
      'Decode a JWT in your browser and view the header and payload as JSON, with exp/iat/nbf as dates. Signature is not verified. Nothing is sent to a server.',
    h1: 'JWT Decoder',
    introHtml:
      'Paste a JWT (JSON Web Token) to see its header and payload formatted as JSON. Time-based claims such as <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">exp</code> <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">iat</code> <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">nbf</code> are also shown as human-readable dates. The signature is not verified, so this tool cannot confirm whether a token is authentic. The payload is just JSON, so for a closer look at the formatted result, also try the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a> tool.',
    inputLabel: 'JWT',
    inputPlaceholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....',
    headerLabel: 'Header',
    payloadLabel: 'Payload',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    claimsHeading: 'Time-based claims',
    claimsColumnClaim: 'Claim',
    claimsColumnUnixSeconds: 'Unix seconds',
    claimsColumnDate: 'Date (local time zone)',
    signatureLabel: 'Signature (not verified)',
    errorInvalidBase64: 'Could not decode: not a valid Base64URL string.',
    errorInvalidJson: 'Could not parse the decoded value as JSON.',
    errorInvalidFormat:
      'This does not look like a valid JWT. It must be three parts — header, payload, and signature — separated by dots.',
    notesHeading: 'Notes',
    noteSignatureNotVerified:
      'This tool does not verify the signature. It only decodes the header and payload from Base64URL and displays them as JSON — it cannot confirm that a token was actually issued by a trusted source.',
    noteSensitivePayload:
      'A JWT payload can contain sensitive information. Everything runs entirely in your browser and the token you enter is never sent to a server, but still handle real production tokens with care.',
    noteTimeClaimsBeforeCode: 'Time-based claims (',
    noteTimeClaimsAfterCode:
      " are interpreted as Unix seconds (seconds since January 1, 1970) and shown in your device's local time zone.",
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'JWT (JSON Web Token)',
        description:
          'A token format that represents "claims" such as user info or permissions as JSON and attaches a digital signature. Commonly used as an authentication token after login or as an API access token. It is three parts — header, payload, and signature — joined by dots, each Base64URL-encoded.',
      },
      {
        term: 'Header',
        description:
          'JSON describing the signing algorithm in use (`alg`, e.g. HS256, RS256) and the token type (`typ`, usually "JWT").',
      },
      {
        term: 'Payload',
        description:
          'The JSON containing the actual data (claims) being carried. `sub` (subject), `iat` (issued at), `exp` (expiration), and `nbf` (not before) are "registered claims" with a defined meaning in the spec, but applications can also include their own custom claims.',
      },
      {
        term: 'Signature',
        description:
          'A value used to verify that the header and payload have not been tampered with. It is computed using a secret or private key, so a third party without that key cannot produce a valid signature. This tool does not verify the signature — it only decodes the contents.',
      },
      {
        term: 'Base64URL',
        description:
          'A variant of Base64 encoding where `+`, `/`, and `=` — characters that cause problems in URLs and filenames — are replaced with `-`, `_`, and omitted, respectively. Each segment of a JWT is encoded this way.',
      },
    ],
  },
};
