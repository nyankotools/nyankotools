import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface RsaEncryptorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeEncrypt: string;
  modeDecrypt: string;
  keyLabelEncrypt: string;
  keyLabelDecrypt: string;
  keyPlaceholderEncrypt: string;
  keyPlaceholderDecrypt: string;
  inputLabelEncrypt: string;
  inputLabelDecrypt: string;
  inputPlaceholderEncrypt: string;
  inputPlaceholderDecrypt: string;
  /** {bits} {max} を置換する */
  keyInfo: string;
  /** {length} {max} を置換する */
  lengthInfo: string;
  runEncrypt: string;
  runDecrypt: string;
  running: string;
  outputLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  emptyKey: string;
  emptyInput: string;
  invalidPem: string;
  needPublicKey: string;
  needPrivateKey: string;
  unsupportedKey: string;
  /** {length} {max} を置換する */
  tooLong: string;
  invalidFormat: string;
  decryptFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const rsaEncryptorContent: Record<Locale, RsaEncryptorPageContent> = {
  ja: {
    title: 'RSA暗号化・復号（RSA-OAEP）｜PEM公開鍵・秘密鍵',
    description:
      'PEM形式の公開鍵でRSA-OAEP（SHA-256）暗号化し、秘密鍵で復号できる無料ツールです。平文の上限バイト数も表示。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'RSA暗号化・復号（RSA-OAEP）',
    introHtml:
      '公開鍵（PEM）でテキストをRSA-OAEP暗号化してBase64にし、対応する秘密鍵（PEM）で復号します。暗号化にはブラウザ標準のWeb Crypto APIを使い、処理はすべてブラウザ内で完結します。入力したテキストや鍵がサーバーに送信されることはありません。鍵ペアは <a href="/tools/keypair-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">鍵ペア生成</a> で作れます。パスワードで暗号化したい場合は <a href="/tools/crypto-encryptor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">テキスト暗号化・復号（AES）</a> をご利用ください。',
    modeLabel: 'モード',
    modeEncrypt: '暗号化',
    modeDecrypt: '復号',
    keyLabelEncrypt: '公開鍵（PEM）',
    keyLabelDecrypt: '秘密鍵（PEM）',
    keyPlaceholderEncrypt:
      '-----BEGIN PUBLIC KEY-----\n…\n-----END PUBLIC KEY-----',
    keyPlaceholderDecrypt:
      '-----BEGIN PRIVATE KEY-----\n…\n-----END PRIVATE KEY-----',
    inputLabelEncrypt: '暗号化するテキスト',
    inputLabelDecrypt: '暗号文（Base64）',
    inputPlaceholderEncrypt: '暗号化したいテキストを入力',
    inputPlaceholderDecrypt: '暗号化されたBase64文字列を貼り付け',
    keyInfo:
      'RSA {bits}ビットの鍵です。暗号化できるテキストは最大 {max} バイトです。',
    lengthInfo: '入力: {length} / {max} バイト（UTF-8）',
    runEncrypt: '暗号化する',
    runDecrypt: '復号する',
    running: '処理中…',
    outputLabel: '結果',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    emptyKey: '鍵（PEM）を入力してください。',
    emptyInput: 'テキストを入力してください。',
    invalidPem:
      'PEM形式の鍵として読み込めませんでした。「-----BEGIN …-----」から「-----END …-----」までを欠けなく貼り付けてください。',
    needPublicKey:
      '暗号化には公開鍵（BEGIN PUBLIC KEY）が必要です。秘密鍵が入力されています。',
    needPrivateKey:
      '復号には秘密鍵（BEGIN PRIVATE KEY）が必要です。公開鍵が入力されています。',
    unsupportedKey:
      'この鍵は使えません。RSAの公開鍵（SPKI）または秘密鍵（PKCS#8）のPEMを入力してください。EC・Ed25519の鍵や「BEGIN RSA PRIVATE KEY」形式は非対応です。',
    tooLong:
      'テキストが長すぎます（{length}バイト）。この鍵で暗号化できるのは最大 {max} バイトです。短くするか、「テキスト暗号化・復号（AES）」をご利用ください。',
    invalidFormat:
      '暗号文の形式が正しくありません。この鍵に対応する公開鍵で暗号化したBase64文字列を、欠けや余分な文字なく貼り付けてください。',
    decryptFailed:
      '復号できませんでした。鍵が暗号化に使った公開鍵と対応していないか、暗号文が改ざん・破損している可能性があります。',
    howToHeading: '使い方',
    howToSteps: [
      '「暗号化」か「復号」を選びます。',
      '暗号化は公開鍵、復号は秘密鍵のPEMを鍵欄に貼り付けます。',
      'テキスト（復号では暗号文）を入力し、「暗号化する」または「復号する」を押します。',
      '結果を「コピー」して使います。',
    ],
    notesHeading: '注意事項',
    notes: [
      '平文の上限は鍵のビット数 ÷ 8 − 66 バイトです（RSA-2048で190バイト、3072で318バイト、4096で446バイト）。日本語は1文字3バイトで数えます。長いデータは、AESで暗号化して、そのAES鍵だけをRSAで暗号化する方法（ハイブリッド暗号）が一般的です。',
      '対応する鍵は、RSAの公開鍵（BEGIN PUBLIC KEY、SPKI）と秘密鍵（BEGIN PRIVATE KEY、PKCS#8）です。OAEPのハッシュはSHA-256固定のため、SHA-1など別設定の他ツールの暗号文は復号できないことがあります。',
      '秘密鍵は他人に見せないでください。本番で使う秘密鍵を入力するのは避け、動作確認やテスト用の鍵で使うのが安全です。入力内容はこのページ内にのみ保持され、送信・保存されません。',
      '暗号化のたびにOAEPのランダム値が加わるため、同じ入力でも毎回異なる暗号文になります。どれも秘密鍵で復号できます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'RSA-OAEP',
        description:
          'RSA暗号にパディング（OAEP）を組み合わせた方式です。ランダム値を加えるため、同じテキストでも毎回違う暗号文になり、安全性が高まります。',
      },
      {
        term: '公開鍵・秘密鍵',
        description:
          '公開鍵は暗号化専用で、公開して構いません。秘密鍵は復号に使う鍵で、持ち主だけが保管します。',
      },
      {
        term: 'PEM（SPKI・PKCS#8）',
        description:
          '鍵をBase64のテキストで表した形式です。公開鍵は「BEGIN PUBLIC KEY」（SPKI）、秘密鍵は「BEGIN PRIVATE KEY」（PKCS#8）で始まります。',
      },
    ],
  },
  en: {
    title: 'RSA Encrypt & Decrypt Online (RSA-OAEP, PEM Keys)',
    description:
      'Encrypt text with a PEM public key (RSA-OAEP, SHA-256) and decrypt it with the private key. Shows the size limit. Runs in your browser; nothing is uploaded.',
    h1: 'RSA Encrypt & Decrypt (RSA-OAEP)',
    introHtml:
      'Encrypts text with an RSA public key (PEM) using RSA-OAEP into Base64, and decrypts it with the matching private key (PEM). It uses the browser built-in Web Crypto API and everything stays in your browser. Your text and keys are never sent to a server. Create a key pair with the <a href="/en/tools/keypair-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Key Pair Generator</a>. To encrypt with a password instead, use the <a href="/en/tools/crypto-encryptor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Text Encryptor &amp; Decryptor (AES)</a>.',
    modeLabel: 'Mode',
    modeEncrypt: 'Encrypt',
    modeDecrypt: 'Decrypt',
    keyLabelEncrypt: 'Public key (PEM)',
    keyLabelDecrypt: 'Private key (PEM)',
    keyPlaceholderEncrypt:
      '-----BEGIN PUBLIC KEY-----\n…\n-----END PUBLIC KEY-----',
    keyPlaceholderDecrypt:
      '-----BEGIN PRIVATE KEY-----\n…\n-----END PRIVATE KEY-----',
    inputLabelEncrypt: 'Text to encrypt',
    inputLabelDecrypt: 'Ciphertext (Base64)',
    inputPlaceholderEncrypt: 'Enter the text to encrypt',
    inputPlaceholderDecrypt: 'Paste the encrypted Base64 string',
    keyInfo:
      'This is an RSA {bits}-bit key. You can encrypt up to {max} bytes of text.',
    lengthInfo: 'Input: {length} / {max} bytes (UTF-8)',
    runEncrypt: 'Encrypt',
    runDecrypt: 'Decrypt',
    running: 'Working…',
    outputLabel: 'Result',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    emptyKey: 'Enter a key (PEM).',
    emptyInput: 'Enter some text.',
    invalidPem:
      'Could not read the key as PEM. Paste everything from "-----BEGIN …-----" to "-----END …-----" with nothing missing.',
    needPublicKey:
      'Encryption needs a public key (BEGIN PUBLIC KEY), but a private key was entered.',
    needPrivateKey:
      'Decryption needs a private key (BEGIN PRIVATE KEY), but a public key was entered.',
    unsupportedKey:
      'This key cannot be used. Enter an RSA public key (SPKI) or private key (PKCS#8) in PEM. EC and Ed25519 keys and the "BEGIN RSA PRIVATE KEY" format are not supported.',
    tooLong:
      'The text is too long ({length} bytes). This key can encrypt at most {max} bytes. Shorten it, or use the Text Encryptor & Decryptor (AES).',
    invalidFormat:
      'The ciphertext format is not valid. Paste the Base64 string produced with the public key matching this private key, with nothing missing or added.',
    decryptFailed:
      'Could not decrypt. The key may not match the public key used to encrypt, or the ciphertext may have been altered or corrupted.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose "Encrypt" or "Decrypt".',
      'Paste a public key (to encrypt) or a private key (to decrypt) in PEM into the key field.',
      'Enter the text (the ciphertext when decrypting) and press "Encrypt" or "Decrypt".',
      'Press "Copy" to copy the result.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The plaintext limit is key bits ÷ 8 − 66 bytes (190 bytes for RSA-2048, 318 for 3072, 446 for 4096). Japanese characters count as 3 bytes each. For longer data, the usual approach is to encrypt it with AES and encrypt only the AES key with RSA (hybrid encryption).',
      'Supported keys are RSA public keys (BEGIN PUBLIC KEY, SPKI) and private keys (BEGIN PRIVATE KEY, PKCS#8). The OAEP hash is fixed to SHA-256, so ciphertext from other tools using SHA-1 or another setting may not decrypt.',
      'Never share a private key. Avoid entering a private key used in production; use throwaway keys for testing. What you enter stays on this page and is neither sent nor stored.',
      'OAEP adds random data on every encryption, so the same input gives a different ciphertext each time. All of them decrypt with the private key.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'RSA-OAEP',
        description:
          'RSA encryption combined with OAEP padding. Random data is mixed in, so the same text encrypts differently every time, which makes it more secure.',
      },
      {
        term: 'Public key and private key',
        description:
          'The public key only encrypts and can be shared freely. The private key decrypts and must be kept by its owner alone.',
      },
      {
        term: 'PEM (SPKI, PKCS#8)',
        description:
          'A Base64 text format for keys. Public keys start with "BEGIN PUBLIC KEY" (SPKI) and private keys with "BEGIN PRIVATE KEY" (PKCS#8).',
      },
    ],
  },
};
