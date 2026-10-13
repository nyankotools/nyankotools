import type { Locale } from '../../data/tools';

export interface ClassicalCipherPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  methodLabel: string;
  methodCaesar: string;
  methodRot13: string;
  methodRot47: string;
  methodVigenere: string;
  methodAtbash: string;
  directionLabel: string;
  directionEncrypt: string;
  directionDecrypt: string;
  shiftLabel: string;
  keyLabel: string;
  keyPlaceholder: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  outputLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  keyError: string;
  bruteHeading: string;
  bruteDescription: string;
  bruteShiftLabel: string;
  bruteTruncated: string;
  bruteEmpty: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const classicalCipherContent: Record<
  Locale,
  ClassicalCipherPageContent
> = {
  ja: {
    title: 'シーザー暗号・ROT13・ヴィジュネル暗号の変換',
    description:
      'シーザー暗号（シフト数指定）・ROT13・ROT47・ヴィジュネル暗号・アトバシュ暗号を暗号化・復号できる無料ツールです。シーザー暗号は全25シフトの総当たり解読にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '古典暗号変換（シーザー暗号・ROT13・ヴィジュネル暗号）',
    introHtml:
      'シーザー暗号・ROT13・ROT47・ヴィジュネル暗号・アトバシュ暗号で、テキストの暗号化と復号ができます。シフト数が分からないシーザー暗号は、全25通りを一覧する総当たりで解読できます。古典暗号は学習・パズル・遊び用途のもので、安全ではありません。実用の暗号化には<a href="/tools/crypto-encryptor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">テキスト暗号化・復号（AES）</a>を、文字列の変換には<a href="/tools/base64/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Base64エンコード/デコード</a>をご利用ください。',
    methodLabel: '暗号方式',
    methodCaesar: 'シーザー暗号（シフト数指定）',
    methodRot13: 'ROT13',
    methodRot47: 'ROT47',
    methodVigenere: 'ヴィジュネル暗号（鍵文字列）',
    methodAtbash: 'アトバシュ暗号',
    directionLabel: '方向',
    directionEncrypt: '暗号化',
    directionDecrypt: '復号',
    shiftLabel: 'シフト数（0〜25）',
    keyLabel: '鍵（英字）',
    keyPlaceholder: '例: LEMON',
    inputLabel: '入力',
    inputPlaceholder: '変換したいテキストを入力',
    sampleText: 'Hello, World! Attack at dawn.',
    outputLabel: '結果',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    keyError:
      '鍵にはA〜Zの英字を1文字以上入れてください（英字以外は無視されます）。',
    bruteHeading: '総当たり解読（全25シフト）',
    bruteDescription:
      '入力を、シフト数1〜25で復号した結果の一覧です。意味の通る行が見つかれば、そのシフト数が鍵です。',
    bruteShiftLabel: 'シフト {n}',
    bruteTruncated: '入力が長いため、先頭{n}文字までを表示しています。',
    bruteEmpty: '入力すると、ここに全25シフトの復号結果が並びます。',
    howToHeading: '使い方',
    howToSteps: [
      '「暗号方式」を選びます（シーザー暗号ならシフト数、ヴィジュネル暗号なら鍵も入力）。',
      '「暗号化」か「復号」を選び、テキストを入力します。',
      '「結果」を確認して、コピーボタンで取り出します。シフト数が不明なときは下の総当たり一覧を見ます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '古典暗号はいずれも現代では簡単に解読できます。パスワードや個人情報の保護には使わないでください。実用の暗号化にはAES-GCMなどの現代暗号を使うツールをご利用ください。',
      'シーザー暗号・ROT13・ヴィジュネル暗号・アトバシュ暗号は、英字（A-Z、a-z）のみを変換します。数字・記号・日本語などはそのまま残り、大文字小文字は保持されます。',
      'ROT47はASCIIの印字可能文字（!〜~）を変換するため、数字や記号も変わります。ROT13・ROT47・アトバシュは、暗号化と復号が同じ操作です。',
      'ヴィジュネル暗号の鍵は英字のみ使われ、英字以外の文字（スペースや記号）では鍵が進みません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'シーザー暗号',
        description:
          'すべての英字をアルファベット順に一定数ずらす、最も古典的な換字式暗号です。ずらす数（シフト数）が鍵で、候補が25通りしかないため総当たりですぐ解読できます。',
      },
      {
        term: 'ROT13',
        description:
          'シーザー暗号のシフト数を13にしたものです。アルファベットは26文字なので、2回適用すると元に戻ります。ネタバレの目隠しなど、軽い難読化に使われます。',
      },
      {
        term: 'ヴィジュネル暗号',
        description:
          '鍵文字列の各文字をシフト数として、位置ごとにシーザー暗号を切り替える多表式暗号です。単純なシーザー暗号より解読が難しいものの、現代では安全ではありません。',
      },
      {
        term: 'アトバシュ暗号',
        description:
          'アルファベットを逆順に対応させる暗号です（AはZ、BはYに置き換わる）。鍵がなく、暗号化と復号は同じ操作です。',
      },
    ],
  },
  en: {
    title: 'Caesar Cipher, ROT13 & Vigenere Cipher Tool',
    description:
      'Encrypt and decrypt with Caesar, ROT13, ROT47, Vigenere or Atbash. Includes a brute-force view of all 25 Caesar shifts. Runs in your browser.',
    h1: 'Classical Cipher Tool: Caesar, ROT13, Vigenere & Atbash',
    introHtml:
      'Encrypt or decrypt text with the Caesar cipher, ROT13, ROT47, Vigenere cipher, or Atbash. If you do not know a Caesar shift, the brute-force list shows all 25 candidates at once. Classical ciphers are for puzzles, learning, and fun, and they are not secure. For real encryption, use the <a href="/en/tools/crypto-encryptor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Text Encryptor &amp; Decryptor (AES)</a>; for plain encoding, try the <a href="/en/tools/base64/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Base64 Encoder/Decoder</a>.',
    methodLabel: 'Cipher',
    methodCaesar: 'Caesar cipher (choose a shift)',
    methodRot13: 'ROT13',
    methodRot47: 'ROT47',
    methodVigenere: 'Vigenere cipher (keyword)',
    methodAtbash: 'Atbash cipher',
    directionLabel: 'Direction',
    directionEncrypt: 'Encrypt',
    directionDecrypt: 'Decrypt',
    shiftLabel: 'Shift (0-25)',
    keyLabel: 'Key (letters)',
    keyPlaceholder: 'e.g. LEMON',
    inputLabel: 'Input',
    inputPlaceholder: 'Enter text to convert',
    sampleText: 'Hello, World! Attack at dawn.',
    outputLabel: 'Result',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    keyError:
      'Enter at least one letter (A-Z) as the key. Other characters are ignored.',
    bruteHeading: 'Brute force (all 25 shifts)',
    bruteDescription:
      'Your input decrypted with every shift from 1 to 25. The row that reads as real text shows the shift that was used.',
    bruteShiftLabel: 'Shift {n}',
    bruteTruncated:
      'The input is long, so only the first {n} characters are shown.',
    bruteEmpty: 'Enter text to see all 25 decrypted candidates here.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a cipher. For Caesar, set the shift; for Vigenere, enter a key.',
      'Choose Encrypt or Decrypt, then enter your text.',
      'Check the result and copy it. If the shift is unknown, scan the brute-force list below.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Every classical cipher here is trivial to break today. Do not use them to protect passwords or personal data; use a modern cipher such as AES-GCM for real encryption.',
      'The Caesar, ROT13, Vigenere, and Atbash ciphers only change English letters (A-Z, a-z). Digits, symbols, and non-Latin text pass through unchanged, and letter case is preserved.',
      'ROT47 works on all printable ASCII characters (! to ~), so digits and symbols change too. ROT13, ROT47, and Atbash are their own inverse: encrypting and decrypting are the same operation.',
      'Only letters in the Vigenere key are used, and the key does not advance on non-letter characters such as spaces or punctuation.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Caesar cipher',
        description:
          'A substitution cipher that shifts every letter a fixed number of places along the alphabet. The shift is the key, and with only 25 possibilities it is broken instantly by brute force.',
      },
      {
        term: 'ROT13',
        description:
          'A Caesar cipher with a shift of 13. Because the alphabet has 26 letters, applying it twice returns the original text. It is used for light obfuscation such as hiding spoilers.',
      },
      {
        term: 'Vigenere cipher',
        description:
          'A polyalphabetic cipher that uses each letter of a keyword as the shift for the matching position, switching between Caesar shifts. It is harder to break than a single Caesar shift, but still not secure today.',
      },
      {
        term: 'Atbash cipher',
        description:
          'A cipher that maps the alphabet onto its reverse (A becomes Z, B becomes Y). It has no key, and encrypting and decrypting are the same operation.',
      },
    ],
  },
};
