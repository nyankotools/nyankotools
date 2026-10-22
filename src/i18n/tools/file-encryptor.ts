import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface FileEncryptorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeEncrypt: string;
  modeDecrypt: string;
  fileLabelEncrypt: string;
  fileLabelDecrypt: string;
  dropHint: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  showPassword: string;
  runEncrypt: string;
  runDecrypt: string;
  running: string;
  resultReady: string;
  download: string;
  emptyFile: string;
  emptyPassword: string;
  errorTooLarge: string;
  errorReadFailed: string;
  invalidFormat: string;
  wrongPassword: string;
  truncated: string;
  corrupted: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const fileEncryptorContent: Record<Locale, FileEncryptorPageContent> = {
  ja: {
    title: 'ファイル暗号化・復号（AES-256-GCM）',
    description:
      'ファイルをパスワードでAES-256-GCM暗号化し、.encファイルとして保存できる無料ツールです。同じパスワードで元のファイルに復号できます。ファイルはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ファイル暗号化・復号（AES-256-GCM）',
    introHtml:
      '画像・PDF・文書などのファイルをパスワードで暗号化し、<code>.enc</code> ファイルとして保存します。復号も同じ画面でできます。ブラウザ標準のWeb Crypto APIを使い、処理はすべてブラウザ内で完結します。ファイルやパスワードがサーバーに送信されることはありません。テキストの暗号化は <a href="/tools/crypto-encryptor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">テキスト暗号化・復号</a> をご利用ください。',
    modeLabel: 'モード',
    modeEncrypt: '暗号化',
    modeDecrypt: '復号',
    fileLabelEncrypt: '暗号化するファイル',
    fileLabelDecrypt: '復号する .enc ファイル',
    dropHint:
      'ファイルをここにドラッグ＆ドロップするか、ファイルを選択してください（512MBまで）',
    passwordLabel: 'パスワード',
    passwordPlaceholder: '暗号化・復号に使うパスワード',
    showPassword: 'パスワードを表示',
    runEncrypt: '暗号化する',
    runDecrypt: '復号する',
    running: '処理中…',
    resultReady: '{name}（{size}）を保存できます。',
    download: 'ダウンロード',
    emptyFile: 'ファイルを選択してください。',
    emptyPassword: 'パスワードを入力してください。',
    errorTooLarge: 'ファイルが{max}MBを超えているため処理できません。',
    errorReadFailed:
      'ファイルを処理できませんでした。メモリ不足の可能性があります。',
    invalidFormat:
      'このツールで暗号化したファイルではありません。.enc ファイルを選び直してください。',
    wrongPassword: '復号できませんでした。パスワードが違う可能性があります。',
    truncated:
      'ファイルが途中で切れています。ダウンロードやコピーが完了していない可能性があります。',
    corrupted:
      'ファイルが改ざん・破損しているため復号できません。ダウンロードし直したファイルを試してください。',
    howToHeading: '使い方',
    howToSteps: [
      '「暗号化」か「復号」のモードを選びます。',
      'ファイルを枠内にドラッグ＆ドロップするか、ファイルを選択します。',
      'パスワードを入力して「暗号化する」または「復号する」を押します。',
      '処理が終わったら「ダウンロード」で保存します。暗号化すると元のファイル名に .enc が付きます。',
    ],
    notesHeading: '注意事項',
    notes: [
      'パスワードを忘れると復号できません。パスワードの再発行や復元はできません。',
      '暗号の強さはパスワードの強さに依存します。短い・推測されやすいパスワードは避けてください。',
      '入力と出力の両方をブラウザのメモリに保持するため、1ファイル512MBまでです。大きなファイルはメモリ不足で失敗することがあります。',
      'ファイル名と種類（MIMEタイプ）も暗号化して .enc の中に保存し、復号時に復元します。ただし暗号化後のファイルサイズからは、元のサイズがおおよそ推測できます。',
      '形式はこのツール独自です。OpenSSLや他のツールで作った暗号化ファイルは復号できず、このツールの .enc も他のツールでは開けません。',
      '1MBごとに分けて暗号化し、各ブロックの順序と最終ブロックも認証します。途中で切れたファイルや書き換えられたファイルは、復号時にエラーになります。',
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
        term: 'チャンク（ブロック）分割',
        description:
          '大きなファイルを1MBずつの塊に分けて順に暗号化する方法です。メモリへの負担を抑えられ、各塊の順序や、最後の塊が欠けていないかも検証できます。',
      },
    ],
  },
  en: {
    title: 'File Encryptor & Decryptor (AES-256-GCM)',
    description:
      'Encrypt a file with a password using AES-256-GCM and save it as .enc, then decrypt it again. Runs in your browser; files are never uploaded.',
    h1: 'File Encryptor & Decryptor (AES-256-GCM)',
    introHtml:
      'Encrypts files such as images, PDFs, and documents with a password and saves them as <code>.enc</code> files. Decryption works on the same page. It uses the browser built-in Web Crypto API and everything stays in your browser. Your files and password are never sent to a server. To encrypt plain text instead, use the <a href="/en/tools/crypto-encryptor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Text Encryptor &amp; Decryptor</a>.',
    modeLabel: 'Mode',
    modeEncrypt: 'Encrypt',
    modeDecrypt: 'Decrypt',
    fileLabelEncrypt: 'File to encrypt',
    fileLabelDecrypt: '.enc file to decrypt',
    dropHint: 'Drag & drop a file here, or choose one (up to 512 MB)',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Password used to encrypt and decrypt',
    showPassword: 'Show password',
    runEncrypt: 'Encrypt',
    runDecrypt: 'Decrypt',
    running: 'Working…',
    resultReady: '{name} ({size}) is ready to save.',
    download: 'Download',
    emptyFile: 'Choose a file.',
    emptyPassword: 'Enter a password.',
    errorTooLarge: 'The file is larger than {max} MB and cannot be processed.',
    errorReadFailed:
      'Could not process the file. The browser may have run out of memory.',
    invalidFormat:
      'This is not a file encrypted with this tool. Choose the .enc file again.',
    wrongPassword: 'Could not decrypt. The password may be wrong.',
    truncated:
      'The file ends too early. The download or copy may not have finished.',
    corrupted:
      'The file has been altered or corrupted and cannot be decrypted. Try downloading it again.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose the Encrypt or Decrypt mode.',
      'Drag and drop a file into the box, or choose one.',
      'Enter a password and press Encrypt or Decrypt.',
      'When it finishes, press Download to save the result. Encrypting adds .enc to the original file name.',
    ],
    notesHeading: 'Notes',
    notes: [
      'If you forget the password, the file cannot be decrypted. There is no way to reset or recover it.',
      'The strength of the encryption depends on the password. Avoid short or guessable passwords.',
      'Both the input and the output are held in browser memory, so files are limited to 512 MB. Very large files may fail if the browser runs out of memory.',
      'The file name and type (MIME type) are also encrypted inside the .enc file and restored on decryption. The encrypted file size still reveals roughly how large the original was.',
      'The format is specific to this tool. Files encrypted with OpenSSL or other tools cannot be decrypted here, and .enc files from this tool cannot be opened elsewhere.',
      'The file is encrypted in 1 MB blocks, and the order of the blocks and the final block are authenticated. A truncated or modified file makes decryption fail.',
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
        term: 'Chunked encryption',
        description:
          'Splitting a large file into 1 MB pieces and encrypting them one by one. It keeps memory use low and lets each piece, its order, and the presence of the final piece be verified.',
      },
    ],
  },
};
