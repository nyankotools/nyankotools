import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface JwtGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  headerLabel: string;
  payloadLabel: string;
  secretLabel: string;
  secretPlaceholder: string;
  secretFormatLabel: string;
  secretFormatText: string;
  secretFormatHex: string;
  algorithmLabel: string;
  timestampsButton: string;
  resultLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  invalidHeader: string;
  invalidPayload: string;
  invalidHex: string;
  emptySecretWarning: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const jwtGeneratorContent: Record<Locale, JwtGeneratorPageContent> = {
  ja: {
    title: 'JWT生成・署名（HS256/HS384/HS512）',
    description:
      'ヘッダー・ペイロード・秘密鍵からHMAC署名付きのJWT（JSON Web Token）を生成できる無料ツールです。HS256・HS384・HS512に対応し、API認証のデバッグや学習に使えます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'JWT生成・署名（HS256/HS384/HS512）',
    introHtml:
      'ヘッダーとペイロードのJSONと秘密鍵から、HMAC署名付きのJWTを生成します。認証APIのテストトークン作成や、JWTの仕組みの学習に使えます。ブラウザ内で処理され、鍵やトークンがサーバーに送信されることはありません。生成したトークンの中身は <a href="/tools/jwt-decoder/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JWTデコーダー</a> で確認できます。',
    headerLabel: 'ヘッダー（JSON）',
    payloadLabel: 'ペイロード（JSON）',
    secretLabel: '秘密鍵',
    secretPlaceholder: 'your-256-bit-secret',
    secretFormatLabel: '鍵の形式',
    secretFormatText: 'テキスト（UTF-8）',
    secretFormatHex: '16進数',
    algorithmLabel: 'アルゴリズム',
    timestampsButton: 'iat（現在）と exp（1時間後）を設定',
    resultLabel: '生成されたJWT',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    invalidHeader: 'ヘッダーがJSONオブジェクトとして正しくありません。',
    invalidPayload: 'ペイロードがJSONオブジェクトとして正しくありません。',
    invalidHex: '鍵が正しい16進数ではありません（偶数桁の0-9・a-fで入力）。',
    emptySecretWarning:
      '秘密鍵が空です。空の鍵で署名したトークンは誰でも偽造できるため、検証用途以外では使わないでください。',
    notesHeading: '注意事項',
    notes: [
      'ヘッダーの alg は選択したアルゴリズムで自動的に上書きされます。typ が無い場合は JWT が補われます。',
      'JSONは整形されずに1行へ詰めて署名します。入力の空白や改行は署名に含まれません。',
      '対応するのはHMAC方式（HS256/384/512）のみです。RS256やES256など公開鍵方式には対応していません。',
      '本番の秘密鍵は入力せず、検証用の鍵で試してください。JWTのペイロードは暗号化されず誰でも読めるため、機密情報を入れないでください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'JWT（JSON Web Token）',
        description:
          'ヘッダー・ペイロード・署名をBase64URLでエンコードし、ドットで連結したトークンです。認証情報の受け渡しによく使われます。',
      },
      {
        term: 'HS256 / HS384 / HS512',
        description:
          '共有の秘密鍵とSHA-2のHMACで署名する方式です。署名と検証に同じ鍵を使います。',
      },
      {
        term: 'iat / exp',
        description:
          'それぞれ発行日時と有効期限を表す標準クレームで、UNIX秒（1970年からの秒数）で指定します。',
      },
    ],
  },
  en: {
    title: 'JWT Generator & Signer (HS256/HS384/HS512)',
    description:
      'Generate HMAC-signed JWTs (HS256, HS384, HS512) from a header, payload and secret to debug API auth. Runs in your browser; nothing is sent to a server.',
    h1: 'JWT Generator & Signer (HS256/HS384/HS512)',
    introHtml:
      'Builds an HMAC-signed JWT from header and payload JSON and a secret key. Use it to create test tokens for an authenticated API or to learn how JWTs work. Everything runs in your browser, and your key and token are never sent to a server. To inspect a token, use the <a href="/en/tools/jwt-decoder/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JWT Decoder</a>.',
    headerLabel: 'Header (JSON)',
    payloadLabel: 'Payload (JSON)',
    secretLabel: 'Secret key',
    secretPlaceholder: 'your-256-bit-secret',
    secretFormatLabel: 'Key format',
    secretFormatText: 'Text (UTF-8)',
    secretFormatHex: 'Hex',
    algorithmLabel: 'Algorithm',
    timestampsButton: 'Set iat (now) and exp (+1 hour)',
    resultLabel: 'Generated JWT',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    invalidHeader: 'The header is not a valid JSON object.',
    invalidPayload: 'The payload is not a valid JSON object.',
    invalidHex:
      'The key is not valid hex (use an even number of 0-9 and a-f characters).',
    emptySecretWarning:
      'The secret key is empty. Anyone can forge a token signed with an empty key, so use it only for testing.',
    notesHeading: 'Notes',
    notes: [
      'The header "alg" is always overwritten with the selected algorithm, and "typ" is set to JWT if it is missing.',
      'The JSON is compacted to one line before signing, so spaces and line breaks you type are not part of the signature.',
      'Only HMAC algorithms (HS256/384/512) are supported. Public-key algorithms such as RS256 and ES256 are not.',
      'Prefer a test key over a production secret. A JWT payload is not encrypted and can be read by anyone, so do not put sensitive data in it.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'JWT (JSON Web Token)',
        description:
          'A token made of a header, a payload and a signature, each Base64URL-encoded and joined with dots. It is commonly used to pass authentication information.',
      },
      {
        term: 'HS256 / HS384 / HS512',
        description:
          'Signing methods that use HMAC with SHA-2 and a shared secret key. The same key is used to sign and to verify.',
      },
      {
        term: 'iat / exp',
        description:
          'Standard claims for the issued-at time and the expiration time, given as UNIX seconds since 1970.',
      },
    ],
  },
};
