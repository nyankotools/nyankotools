import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CryptoEncryptorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeEncrypt: string;
  modeDecrypt: string;
  inputLabel: string;
  inputPlaceholderEncrypt: string;
  inputPlaceholderDecrypt: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  showPassword: string;
  runEncrypt: string;
  runDecrypt: string;
  running: string;
  outputLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  emptyPassword: string;
  emptyInput: string;
  invalidFormat: string;
  wrongPassword: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cryptoEncryptorContent: Record<
  Locale,
  CryptoEncryptorPageContent
> = {
  ja: {
    title: 'テキスト暗号化・復号（AES-256-GCM）',
    description:
      'テキストをパスワードでAES-256-GCM暗号化し、Base64文字列にして共有できる無料ツールです。同じパスワードでの復号にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'テキスト暗号化・復号（AES-256-GCM）',
    introHtml:
      'テキストをパスワードで暗号化し、コピーして共有できるBase64文字列にします。復号も同じ画面でできます。暗号化にはブラウザ標準のWeb Crypto APIを使い、処理はすべてブラウザ内で完結します。入力したテキストやパスワードがサーバーに送信されることはありません。パスワードの強さは <a href="/tools/password-strength-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">パスワード強度チェッカー</a> で確認できます。',
    modeLabel: 'モード',
    modeEncrypt: '暗号化',
    modeDecrypt: '復号',
    inputLabel: '入力',
    inputPlaceholderEncrypt: '暗号化したいテキストを入力',
    inputPlaceholderDecrypt: '暗号化されたBase64文字列を貼り付け',
    passwordLabel: 'パスワード',
    passwordPlaceholder: '暗号化・復号に使うパスワード',
    showPassword: 'パスワードを表示',
    runEncrypt: '暗号化する',
    runDecrypt: '復号する',
    running: '処理中…',
    outputLabel: '結果',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    emptyPassword: 'パスワードを入力してください。',
    emptyInput: 'テキストを入力してください。',
    invalidFormat:
      '暗号文の形式が正しくありません。このツールで暗号化したBase64文字列を、欠けや余分な文字なく貼り付けてください。',
    wrongPassword:
      '復号できませんでした。パスワードが違うか、暗号文が改ざん・破損している可能性があります。',
    notesHeading: '注意事項',
    notes: [
      'パスワードを忘れると復号できません。パスワードの再発行や復元はできません。',
      '暗号の強さはパスワードの強さに依存します。短い・推測されやすいパスワードは避けてください（強さは「パスワード強度チェッカー」で確認できます）。',
      '暗号文の形式は、バージョン（1バイト）・ソルト（16バイト）・IV（12バイト）・暗号文と認証タグを連結してBase64にしたものです。鍵はPBKDF2（SHA-256・600,000回）でパスワードから導出します。',
      '暗号化できるのはテキストのみです。ファイルの暗号化には対応していません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'AES-256-GCM',
        description:
          '256ビットの鍵を使う共通鍵暗号です。GCMモードは暗号化と同時に改ざん検知用の認証タグを付けるため、暗号文が書き換えられると復号が失敗します。',
      },
      {
        term: 'PBKDF2',
        description:
          'パスワードから暗号鍵を作るための仕組みです。計算を何十万回も繰り返すことで、パスワードを総当たりで試す攻撃を遅くします。',
      },
      {
        term: 'ソルト・IV',
        description:
          '暗号化のたびにランダムに選ぶ値です。同じテキスト・同じパスワードでも毎回違う暗号文になります。暗号文に含めて保存するため、別に控える必要はありません。',
      },
    ],
  },
  en: {
    title: 'Text Encryptor & Decryptor (AES-256-GCM)',
    description:
      'Encrypt text with a password using AES-256-GCM into a shareable Base64 string, and decrypt it again. Runs in your browser; nothing is sent to a server.',
    h1: 'Text Encryptor & Decryptor (AES-256-GCM)',
    introHtml:
      'Encrypts text with a password into a Base64 string you can copy and share, and decrypts it on the same page. It uses the browser built-in Web Crypto API and everything stays in your browser. Your text and password are never sent to a server. You can check how strong a password is with the <a href="/en/tools/password-strength-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Password Strength Checker</a>.',
    modeLabel: 'Mode',
    modeEncrypt: 'Encrypt',
    modeDecrypt: 'Decrypt',
    inputLabel: 'Input',
    inputPlaceholderEncrypt: 'Enter the text to encrypt',
    inputPlaceholderDecrypt: 'Paste the encrypted Base64 string',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Password used to encrypt and decrypt',
    showPassword: 'Show password',
    runEncrypt: 'Encrypt',
    runDecrypt: 'Decrypt',
    running: 'Working…',
    outputLabel: 'Result',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    emptyPassword: 'Enter a password.',
    emptyInput: 'Enter some text.',
    invalidFormat:
      'The ciphertext format is not valid. Paste the Base64 string produced by this tool, with nothing missing or added.',
    wrongPassword:
      'Could not decrypt. The password may be wrong, or the ciphertext may have been altered or corrupted.',
    notesHeading: 'Notes',
    notes: [
      'If you forget the password, the text cannot be decrypted. There is no way to reset or recover it.',
      'The strength of the encryption depends on the password. Avoid short or guessable passwords (you can check one with the Password Strength Checker).',
      'The ciphertext is a Base64 string of the version (1 byte), salt (16 bytes), IV (12 bytes), and ciphertext with its authentication tag, concatenated. The key is derived from the password with PBKDF2 (SHA-256, 600,000 iterations).',
      'Only text can be encrypted. Files are not supported.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'AES-256-GCM',
        description:
          'A symmetric cipher with a 256-bit key. GCM mode attaches an authentication tag while encrypting, so decryption fails if the ciphertext has been modified.',
      },
      {
        term: 'PBKDF2',
        description:
          'A way to derive an encryption key from a password. Repeating the computation hundreds of thousands of times slows down brute-force password guessing.',
      },
      {
        term: 'Salt and IV',
        description:
          'Random values chosen on every encryption, so the same text and password give a different ciphertext each time. They are stored inside the ciphertext, so you do not need to keep them separately.',
      },
    ],
  },
};
