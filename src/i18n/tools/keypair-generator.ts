import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface KeypairGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  algorithmLabel: string;
  groupRsa: string;
  groupEc: string;
  groupEd: string;
  generate: string;
  generating: string;
  publicKeyLabel: string;
  privateKeyLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  download: string;
  unsupported: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const keypairGeneratorContent: Record<
  Locale,
  KeypairGeneratorPageContent
> = {
  ja: {
    title: 'キーペア生成（RSA・ECDSA・Ed25519）',
    description:
      'RSA（2048/3072/4096ビット）・ECDSA（P-256/P-384/P-521）・Ed25519の公開鍵・秘密鍵のペアをPEM形式で生成する無料ツールです。鍵はブラウザ内で作られ、サーバーには送信されません。',
    h1: 'キーペア生成（RSA・ECDSA・Ed25519）',
    introHtml:
      '公開鍵と秘密鍵のペアを、PEM形式（公開鍵はSPKI、秘密鍵はPKCS#8）で生成します。鍵の生成にはブラウザ標準のWeb Crypto APIを使い、処理はすべてブラウザ内で完結します。生成した鍵がサーバーに送信されることはありません。パスワードによる暗号化は <a href="/tools/crypto-encryptor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">テキスト暗号化・復号</a> をご利用ください。',
    algorithmLabel: 'アルゴリズム',
    groupRsa: 'RSA',
    groupEc: 'ECDSA（楕円曲線）',
    groupEd: 'Ed25519',
    generate: '鍵ペアを生成',
    generating: '生成中…',
    publicKeyLabel: '公開鍵（PUBLIC KEY）',
    privateKeyLabel: '秘密鍵（PRIVATE KEY）',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    download: '.pemで保存',
    unsupported:
      'お使いのブラウザはこのアルゴリズムに対応していません。ブラウザを最新版に更新するか、別のアルゴリズムを選んでください。',
    howToHeading: '使い方',
    howToSteps: [
      '「アルゴリズム」から、用途に合う方式を選びます。',
      '「鍵ペアを生成」を押します（RSA-4096は数秒かかることがあります）。',
      '公開鍵と秘密鍵を、コピーまたは .pem ファイルとして保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '秘密鍵は他人に渡さず、安全な場所に保管してください。画面を閉じると鍵は消え、同じ鍵を再生成することはできません。',
      '本番環境で使う鍵は、生成した端末の安全性も含めて検討してください。重要な用途では、管理された環境（OpenSSL・ssh-keygen・HSMなど）での生成をおすすめします。',
      '秘密鍵はパスフレーズで保護されていない平文のPEMです。',
      'Ed25519は新しめのブラウザでのみ使えます。未対応の場合はエラーを表示します。',
      '出力はSPKI／PKCS#8形式のPEMです。OpenSSH形式（id_ed25519 など）では出力しません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'RSA',
        description:
          '大きな整数の素因数分解の難しさを利用する公開鍵暗号です。広く対応していますが、鍵が長く、2048ビット以上が目安です。',
      },
      {
        term: 'ECDSA',
        description:
          '楕円曲線を使う署名方式です。RSAより短い鍵で同等の強度を得られます。P-256が最も広く使われています。',
      },
      {
        term: 'Ed25519',
        description:
          '楕円曲線Curve25519を使う署名方式です。鍵が短く高速で、SSHやJWTなどで採用が増えています。',
      },
      {
        term: 'PEM / SPKI / PKCS#8',
        description:
          'PEMはBase64とヘッダ行で鍵を表すテキスト形式です。公開鍵はSPKI、秘密鍵はPKCS#8という構造で格納します。',
      },
    ],
  },
  en: {
    title: 'Key Pair Generator (RSA, ECDSA, Ed25519)',
    description:
      'Generate RSA, ECDSA, or Ed25519 public/private key pairs in PEM format. Keys are created in your browser and never sent to a server.',
    h1: 'Key Pair Generator (RSA, ECDSA, Ed25519)',
    introHtml:
      'Generates a public/private key pair as PEM (SPKI for the public key, PKCS#8 for the private key). It uses the browser built-in Web Crypto API and everything stays in your browser. The generated keys are never sent to a server. To protect text with a password, use the <a href="/en/tools/crypto-encryptor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Text Encryptor &amp; Decryptor</a>.',
    algorithmLabel: 'Algorithm',
    groupRsa: 'RSA',
    groupEc: 'ECDSA (elliptic curve)',
    groupEd: 'Ed25519',
    generate: 'Generate key pair',
    generating: 'Generating…',
    publicKeyLabel: 'Public key',
    privateKeyLabel: 'Private key',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    download: 'Save as .pem',
    unsupported:
      'Your browser does not support this algorithm. Update your browser or choose a different algorithm.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose an algorithm that fits your use case.',
      'Click "Generate key pair" (RSA-4096 can take a few seconds).',
      'Copy the public and private keys, or save them as .pem files.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Keep the private key secret and store it somewhere safe. The keys disappear when you close the page and the same pair cannot be regenerated.',
      'For production keys, consider the security of the device that generated them. For important uses, generate keys in a controlled environment (OpenSSL, ssh-keygen, an HSM, etc.).',
      'The private key is plain PEM with no passphrase protection.',
      'Ed25519 works only in recent browsers. An error is shown if it is not supported.',
      'Output is SPKI / PKCS#8 PEM. The OpenSSH format (e.g. id_ed25519) is not produced.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'RSA',
        description:
          'A public-key cipher based on the difficulty of factoring large integers. Widely supported, but keys are long; 2048 bits or more is the usual baseline.',
      },
      {
        term: 'ECDSA',
        description:
          'A signature scheme using elliptic curves. It gives comparable strength to RSA with much shorter keys. P-256 is the most common curve.',
      },
      {
        term: 'Ed25519',
        description:
          'A signature scheme on the Curve25519 curve. Keys are short and operations are fast, and it is increasingly used for SSH and JWT.',
      },
      {
        term: 'PEM / SPKI / PKCS#8',
        description:
          'PEM is a text format that wraps Base64 data in header lines. Public keys are stored as SPKI and private keys as PKCS#8.',
      },
    ],
  },
};
