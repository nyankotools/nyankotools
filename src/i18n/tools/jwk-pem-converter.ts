import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface JwkPemConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  outputLabel: string;
  detectedPemToJwk: string;
  detectedJwkToPem: string;
  keyPublic: string;
  keyPrivate: string;
  copy: string;
  copied: string;
  copyFailed: string;
  download: string;
  clear: string;
  errorInvalidPem: string;
  errorUnsupportedLabel: string;
  errorInvalidJson: string;
  errorUnsupportedKty: string;
  errorInvalidKey: string;
  errorUnsupported: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const jwkPemConverterContent: Record<
  Locale,
  JwkPemConverterPageContent
> = {
  ja: {
    title: 'JWK⇔PEM変換（RSA・EC・Ed25519）',
    description:
      'JWKとPEM（SPKI公開鍵・PKCS#8秘密鍵）を相互に変換する無料ツールです。RSA・EC・Ed25519に対応。鍵はブラウザ内で処理され、サーバーには送信されません。',
    h1: 'JWK⇔PEM変換（RSA・EC・Ed25519）',
    introHtml:
      'JWK（JSON Web Key）とPEM（公開鍵はSPKI、秘密鍵はPKCS#8）を相互に変換します。入力の形から変換方向を自動で判定し、処理はブラウザ標準のWeb Crypto APIだけで行うため、鍵がサーバーに送信されることはありません。鍵の新規作成は <a href="/tools/keypair-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">キーペア生成</a>、JWTの中身の確認は <a href="/tools/jwt-decoder/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JWTデコーダー</a> をご利用ください。',
    inputLabel: 'PEMまたはJWK',
    inputPlaceholder:
      '-----BEGIN PUBLIC KEY----- … または {"kty":"EC","crv":"P-256",…}',
    outputLabel: '変換結果',
    detectedPemToJwk: 'PEM → JWK に変換しました',
    detectedJwkToPem: 'JWK → PEM に変換しました',
    keyPublic: '（公開鍵）',
    keyPrivate: '（秘密鍵）',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    download: 'ファイルで保存',
    clear: 'クリア',
    errorInvalidPem:
      'PEMまたはJWKとして読み取れません。「-----BEGIN …-----」で始まるPEM、または { で始まるJWKを貼り付けてください。',
    errorUnsupportedLabel:
      'このPEMのラベルには対応していません。「PUBLIC KEY」（SPKI）または「PRIVATE KEY」（PKCS#8）のPEMを使ってください。',
    errorInvalidJson: 'JWKのJSONとして読み取れません。',
    errorUnsupportedKty:
      'この鍵の種類には対応していません。対応はRSA、EC（P-256/P-384/P-521）、OKP（Ed25519）です。',
    errorInvalidKey:
      '鍵として読み取れません。内容が欠けている、壊れている、または対応外の鍵の可能性があります。',
    errorUnsupported:
      'お使いのブラウザはこの鍵の種類（主にEd25519）に対応していません。ブラウザを最新版に更新してください。',
    howToHeading: '使い方',
    howToSteps: [
      '「PEMまたはJWK」欄に、変換したい鍵を貼り付けます。',
      '入力がPEMかJWKかを自動で判定し、「変換結果」欄に反対の形式が表示されます。',
      'コピーするか、ファイルとして保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '秘密鍵を貼り付けると画面上に平文で表示されます。共有端末や画面共有中は使わないでください。入力内容はこのブラウザ内でのみ処理され、保存もされません。',
      '対応するPEMは BEGIN PUBLIC KEY（SPKI）と BEGIN PRIVATE KEY（PKCS#8）のみです。BEGIN RSA PRIVATE KEY（PKCS#1）や BEGIN EC PRIVATE KEY（SEC1）、パスフレーズで暗号化されたPEMは扱えません。OpenSSLで事前にPKCS#8へ変換してください。',
      '対応する鍵はRSA、EC（P-256/P-384/P-521）、Ed25519です。secp256k1など、ブラウザのWeb Crypto APIが扱えない曲線には対応していません。Ed25519は新しめのブラウザでのみ使えます。',
      'JWK→PEMでは、dを含む場合は秘密鍵（PKCS#8）、含まない場合は公開鍵（SPKI）を出力します。alg・use・kidなどのメタ情報はPEMに含まれないため失われます。JWKS（keysの配列）は先頭の鍵だけを変換します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'JWK',
        description:
          '暗号鍵をJSONで表す形式（RFC 7517）です。kty（鍵の種類）とn・e・x・y・dなどの数値をBase64URLで持ちます。JWTの署名検証用公開鍵の配布（JWKS）などに使われます。',
      },
      {
        term: 'PEM / SPKI / PKCS#8',
        description:
          'PEMはDER形式のバイナリをBase64とヘッダ行で包んだテキスト形式です。公開鍵はSPKI（SubjectPublicKeyInfo）、秘密鍵はPKCS#8という構造で格納します。',
      },
      {
        term: 'kty / crv',
        description:
          'JWKの鍵の種類を示す項目です。ktyはRSA・EC・OKPのいずれかで、ECとOKPではcrvに曲線名（P-256、Ed25519など）が入ります。',
      },
    ],
  },
  en: {
    title: 'JWK to PEM Converter (RSA, EC, Ed25519)',
    description:
      'Convert JWK to PEM (SPKI / PKCS#8) and PEM back to JWK for RSA, EC, and Ed25519 keys. Runs in your browser; keys are never sent to a server.',
    h1: 'JWK to PEM Converter (RSA, EC, Ed25519)',
    introHtml:
      'Converts between JWK (JSON Web Key) and PEM (SPKI for public keys, PKCS#8 for private keys). The direction is detected from what you paste, and everything runs on the browser built-in Web Crypto API, so your keys are never sent to a server. To create a new key, use the <a href="/en/tools/keypair-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Key Pair Generator</a>; to inspect a token, use the <a href="/en/tools/jwt-decoder/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JWT Decoder</a>.',
    inputLabel: 'PEM or JWK',
    inputPlaceholder:
      '-----BEGIN PUBLIC KEY----- … or {"kty":"EC","crv":"P-256",…}',
    outputLabel: 'Result',
    detectedPemToJwk: 'Converted PEM to JWK',
    detectedJwkToPem: 'Converted JWK to PEM',
    keyPublic: '(public key)',
    keyPrivate: '(private key)',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    download: 'Save as file',
    clear: 'Clear',
    errorInvalidPem:
      'Could not read this as PEM or JWK. Paste a PEM starting with "-----BEGIN …-----" or a JWK starting with {.',
    errorUnsupportedLabel:
      'This PEM label is not supported. Use a "PUBLIC KEY" (SPKI) or "PRIVATE KEY" (PKCS#8) PEM.',
    errorInvalidJson: 'Could not parse this as JWK JSON.',
    errorUnsupportedKty:
      'This key type is not supported. Supported: RSA, EC (P-256/P-384/P-521), and OKP (Ed25519).',
    errorInvalidKey:
      'Could not read this as a key. It may be incomplete, corrupted, or of an unsupported type.',
    errorUnsupported:
      'Your browser does not support this key type (mainly Ed25519). Update your browser.',
    howToHeading: 'How to use',
    howToSteps: [
      'Paste the key you want to convert into the "PEM or JWK" field.',
      'The tool detects whether it is PEM or JWK and shows the other format in "Result".',
      'Copy it or save it as a file.',
    ],
    notesHeading: 'Notes',
    notes: [
      'A pasted private key is shown in plain text on screen. Do not use this on a shared device or while screen sharing. Input is processed only in this browser and is not stored.',
      'Only BEGIN PUBLIC KEY (SPKI) and BEGIN PRIVATE KEY (PKCS#8) PEM are supported. BEGIN RSA PRIVATE KEY (PKCS#1), BEGIN EC PRIVATE KEY (SEC1), and passphrase-encrypted PEM are not; convert them to PKCS#8 with OpenSSL first.',
      'Supported keys are RSA, EC (P-256/P-384/P-521), and Ed25519. Curves the browser Web Crypto API cannot handle, such as secp256k1, are not supported. Ed25519 works only in recent browsers.',
      'For JWK to PEM, a JWK with d produces a private key (PKCS#8) and one without produces a public key (SPKI). Metadata such as alg, use, and kid is lost because PEM cannot carry it. For a JWKS (a keys array), only the first key is converted.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'JWK',
        description:
          'A JSON representation of a cryptographic key (RFC 7517). It holds kty (key type) and values such as n, e, x, y, and d as Base64URL. Public keys for verifying JWTs are often published as a JWKS.',
      },
      {
        term: 'PEM / SPKI / PKCS#8',
        description:
          'PEM wraps DER binary data in Base64 and header lines. Public keys are stored as SPKI (SubjectPublicKeyInfo) and private keys as PKCS#8.',
      },
      {
        term: 'kty / crv',
        description:
          'JWK fields that identify the key type. kty is RSA, EC, or OKP; for EC and OKP, crv names the curve (P-256, Ed25519, and so on).',
      },
    ],
  },
};
