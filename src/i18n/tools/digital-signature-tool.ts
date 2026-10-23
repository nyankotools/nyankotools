import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface DigitalSignatureToolPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeSign: string;
  modeVerify: string;
  algorithmLabel: string;
  groupRsa: string;
  groupEc: string;
  hashLabel: string;
  messageLabel: string;
  messagePlaceholder: string;
  privateKeyLabel: string;
  publicKeyLabel: string;
  signatureInputLabel: string;
  signatureOutputLabel: string;
  signButton: string;
  verifyButton: string;
  copy: string;
  copied: string;
  copyFailed: string;
  resultValid: string;
  resultInvalid: string;
  errorInvalidPem: string;
  errorWrongKindSign: string;
  errorWrongKindVerify: string;
  errorKeyImport: string;
  errorInvalidSignature: string;
  errorFailed: string;
  errorEmptyKey: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const digitalSignatureToolContent: Record<
  Locale,
  DigitalSignatureToolPageContent
> = {
  ja: {
    title: 'デジタル署名の作成・検証（RSA-PSS・ECDSA）',
    description:
      'RSA-PSSとECDSA（P-256/384/521）でテキストのデジタル署名を作成・検証する無料ツールです。PEM鍵を貼り付けるだけ。処理はブラウザ内で完結し、鍵は送信されません。',
    h1: 'デジタル署名の作成・検証（RSA-PSS・ECDSA）',
    introHtml:
      'テキストにデジタル署名を付けたり、署名が正しいかを確認したりします。秘密鍵（PKCS#8のPEM）で署名し、公開鍵（SPKIのPEM）で検証します。処理はブラウザ標準のWeb Crypto APIで行い、鍵やメッセージがサーバーに送信されることはありません。鍵は <a href="/tools/keypair-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">キーペア生成</a> で作れます。RS256などJWTの署名は <a href="/tools/jwt-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JWT生成</a> では扱わないため、RSA署名はこちらのRSA-PSSでお試しください（JWTのRS256はPKCS#1 v1.5方式で、RSA-PSSとは別物です）。',
    modeLabel: '操作',
    modeSign: '署名を作成',
    modeVerify: '署名を検証',
    algorithmLabel: 'アルゴリズム',
    groupRsa: 'RSA',
    groupEc: 'ECDSA（楕円曲線）',
    hashLabel: 'ハッシュ',
    messageLabel: 'メッセージ',
    messagePlaceholder: '署名・検証するテキスト（UTF-8として扱います）',
    privateKeyLabel: '秘密鍵（PKCS#8 PEM）',
    publicKeyLabel: '公開鍵（SPKI PEM）',
    signatureInputLabel: '署名（Base64）',
    signatureOutputLabel: '生成された署名（Base64）',
    signButton: '署名する',
    verifyButton: '検証する',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    resultValid:
      '署名は有効です。メッセージは改ざんされておらず、対応する秘密鍵で署名されています。',
    resultInvalid:
      '署名が一致しません。メッセージ・署名・公開鍵・アルゴリズム・ハッシュのいずれかが違う可能性があります。',
    errorInvalidPem:
      'PEMとして読み取れません。-----BEGIN PRIVATE KEY----- または -----BEGIN PUBLIC KEY----- で始まるブロックを貼り付けてください。',
    errorWrongKindSign:
      '署名には秘密鍵（BEGIN PRIVATE KEY）が必要です。公開鍵が貼り付けられています。',
    errorWrongKindVerify:
      '検証には公開鍵（BEGIN PUBLIC KEY）が必要です。秘密鍵が貼り付けられています。',
    errorKeyImport:
      '選んだアルゴリズムの鍵として読み込めません。鍵の種類（RSAか楕円曲線か、曲線の種類）とアルゴリズムが合っているか確認してください。',
    errorInvalidSignature: '署名がBase64として正しくありません。',
    errorFailed: '処理に失敗しました。入力を確認してください。',
    errorEmptyKey: '鍵を入力してください。',
    howToHeading: '使い方',
    howToSteps: [
      '「署名を作成」か「署名を検証」を選びます。',
      '「アルゴリズム」と「ハッシュ」を選び、「メッセージ」を入力します。',
      '署名するときは「秘密鍵（PKCS#8 PEM）」を貼り付けて「署名する」を押し、Base64の署名をコピーします。',
      '検証するときは「公開鍵（SPKI PEM）」と「署名（Base64）」を貼り付けて「検証する」を押します。',
    ],
    notesHeading: '注意事項',
    notes: [
      'PEMの中身から鍵の種類は判別できないため、選んだアルゴリズムで読み込みます。合わない場合は読み込みエラーになります。',
      'ECDSAの署名は、Web Cryptoのr||s連結形式（IEEE P1363）で出力・検証します。OpenSSLなどが出すDER形式の署名とは互換性がないため、DER形式の署名はそのままでは検証できません。',
      'RSA-PSSのソルト長は、選んだハッシュのバイト数（SHA-256なら32）に固定しています。',
      '署名と検証で同じハッシュを選ばないと検証に失敗します。ECDSAは曲線に合わせたハッシュ（P-256はSHA-256、P-384はSHA-384、P-521はSHA-512）が既定です。',
      'メッセージはUTF-8のバイト列として署名します。改行コードや末尾の空白が違うと別のメッセージになります。',
      '秘密鍵は他人に見せないでください。このツールは鍵をサーバーに送信・保存しませんが、本番用の重要な鍵は管理された環境で扱うことをおすすめします。',
      'パスフレーズで暗号化されたPEM（ENCRYPTED PRIVATE KEY）やRSA PRIVATE KEY形式、Ed25519には対応していません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'デジタル署名',
        description:
          '秘密鍵の持ち主だけが作れ、公開鍵で誰でも検証できる印です。メッセージが改ざんされていないことと、署名者を確認できます。',
      },
      {
        term: 'RSA-PSS',
        description:
          'RSAの署名方式の一つで、ランダムなソルトを加えるため署名のたびに値が変わります。従来のPKCS#1 v1.5（RS256）より新しい設計です。',
      },
      {
        term: 'ECDSA',
        description:
          '楕円曲線を使う署名方式です。RSAより短い鍵で同等の強度を得られます。署名はrとsの2つの数値で、このツールでは連結して扱います。',
      },
      {
        term: 'PEM / SPKI / PKCS#8',
        description:
          'PEMはBase64とヘッダ行で鍵を表すテキスト形式です。公開鍵はSPKI、秘密鍵はPKCS#8という構造で格納します。',
      },
    ],
  },
  en: {
    title: 'Digital Signature Tool (RSA-PSS, ECDSA)',
    description:
      'Create and verify digital signatures with RSA-PSS or ECDSA (P-256/384/521) from PEM keys. Runs in your browser; keys and messages are never sent to a server.',
    h1: 'Digital Signature Tool: Sign and Verify (RSA-PSS, ECDSA)',
    introHtml:
      'Sign a text message and check whether a signature is valid. Sign with a private key (PKCS#8 PEM) and verify with a public key (SPKI PEM). It uses the browser built-in Web Crypto API, so your keys and messages are never sent to a server. You can create keys with the <a href="/en/tools/keypair-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Key Pair Generator</a>. The <a href="/en/tools/jwt-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JWT Generator</a> does not cover RS256; for RSA signatures use RSA-PSS here (JWT RS256 uses PKCS#1 v1.5, which is a different scheme).',
    modeLabel: 'Action',
    modeSign: 'Create signature',
    modeVerify: 'Verify signature',
    algorithmLabel: 'Algorithm',
    groupRsa: 'RSA',
    groupEc: 'ECDSA (elliptic curve)',
    hashLabel: 'Hash',
    messageLabel: 'Message',
    messagePlaceholder: 'Text to sign or verify (treated as UTF-8)',
    privateKeyLabel: 'Private key (PKCS#8 PEM)',
    publicKeyLabel: 'Public key (SPKI PEM)',
    signatureInputLabel: 'Signature (Base64)',
    signatureOutputLabel: 'Generated signature (Base64)',
    signButton: 'Sign',
    verifyButton: 'Verify',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    resultValid:
      'The signature is valid. The message was not altered and was signed with the matching private key.',
    resultInvalid:
      'The signature does not match. The message, signature, public key, algorithm, or hash may be different.',
    errorInvalidPem:
      'Could not read the PEM. Paste a block starting with "-----BEGIN PRIVATE KEY-----" or "-----BEGIN PUBLIC KEY-----".',
    errorWrongKindSign:
      'Signing needs a private key (BEGIN PRIVATE KEY), but a public key was pasted.',
    errorWrongKindVerify:
      'Verifying needs a public key (BEGIN PUBLIC KEY), but a private key was pasted.',
    errorKeyImport:
      'The key could not be loaded for the selected algorithm. Check that the key type (RSA or elliptic curve, and the curve) matches the algorithm.',
    errorInvalidSignature: 'The signature is not valid Base64.',
    errorFailed: 'The operation failed. Check your input.',
    errorEmptyKey: 'Enter a key.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose "Create signature" or "Verify signature".',
      'Pick an "Algorithm" and "Hash", then enter the "Message".',
      'To sign, paste the "Private key (PKCS#8 PEM)", press "Sign", and copy the Base64 signature.',
      'To verify, paste the "Public key (SPKI PEM)" and the "Signature (Base64)", then press "Verify".',
    ],
    notesHeading: 'Notes',
    notes: [
      'A PEM does not reveal its key type, so the key is loaded with the algorithm you select. A mismatch shows a key-loading error.',
      'ECDSA signatures use the Web Crypto r||s concatenated format (IEEE P1363). They are not compatible with the DER-encoded signatures produced by OpenSSL and similar tools, so a DER signature cannot be verified as-is.',
      'The RSA-PSS salt length is fixed to the hash size in bytes (32 for SHA-256).',
      'Signing and verifying must use the same hash. For ECDSA the default matches the curve (P-256 uses SHA-256, P-384 uses SHA-384, P-521 uses SHA-512).',
      'The message is signed as UTF-8 bytes. A different line ending or trailing space makes it a different message.',
      'Do not share your private key. This tool neither sends nor stores keys, but important production keys are best handled in a controlled environment.',
      'Passphrase-encrypted PEM (ENCRYPTED PRIVATE KEY), the RSA PRIVATE KEY format, and Ed25519 are not supported.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Digital signature',
        description:
          'A proof that only the private-key holder can create and anyone can check with the public key. It shows the message was not altered and who signed it.',
      },
      {
        term: 'RSA-PSS',
        description:
          'An RSA signature scheme that adds a random salt, so the signature differs every time. A newer design than the older PKCS#1 v1.5 (RS256).',
      },
      {
        term: 'ECDSA',
        description:
          'A signature scheme using elliptic curves, giving comparable strength to RSA with shorter keys. A signature is two numbers, r and s, which this tool handles concatenated.',
      },
      {
        term: 'PEM / SPKI / PKCS#8',
        description:
          'PEM is a text format that wraps Base64 data in header lines. Public keys are stored as SPKI and private keys as PKCS#8.',
      },
    ],
  },
};
