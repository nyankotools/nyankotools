import type { Locale } from '../../data/tools';

export interface TextBinaryConverterContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeEncode: string;
  modeDecode: string;
  encodingLabel: string;
  encodingOptions: { value: string; label: string }[];
  radixLabel: string;
  radixOptions: { value: string; label: string }[];
  separatorLabel: string;
  uppercaseLabel: string;
  bomLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  inputLabelEncode: string;
  inputLabelDecode: string;
  inputPlaceholderEncode: string;
  inputPlaceholderDecode: string;
  outputLabel: string;
  byteCountTemplate: string;
  unmappableTemplate: string;
  invalidCharError: string;
  outOfRangeError: string;
  badLengthError: string;
  replacedWarning: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

const linkClass =
  'text-blue-700 underline hover:no-underline dark:text-blue-400';

export const textBinaryConverterContent: Record<
  Locale,
  TextBinaryConverterContent
> = {
  ja: {
    title: 'テキスト⇔2進数・16進数変換（UTF-8・Shift_JIS対応）',
    description:
      'テキストを文字コード（UTF-8・UTF-16・Shift_JIS）ごとの2進数・8進数・16進数のバイト列に変換し、逆変換もできる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'テキスト⇔2進数・16進数変換',
    introHtml: `文字列を、UTF-8・UTF-16・Shift_JISなど選んだ文字コードのバイト列として、2進数・8進数・16進数で表示します。「数値 → テキスト」に切り替えると、バイト列から元の文字列へ戻せます。数値そのものの進数変換は<a href="/tools/base-converter/" class="${linkClass}">進数変換</a>、ファイルや文字化けの確認は<a href="/tools/encoding-converter/" class="${linkClass}">文字コード変換</a>、Base64は<a href="/tools/base64/" class="${linkClass}">Base64エンコード/デコード</a>をご利用ください。`,
    modeLabel: 'モード',
    modeEncode: 'テキスト → 数値',
    modeDecode: '数値 → テキスト',
    encodingLabel: '文字コード',
    encodingOptions: [
      { value: 'utf-8', label: 'UTF-8' },
      { value: 'utf-16le', label: 'UTF-16LE' },
      { value: 'utf-16be', label: 'UTF-16BE' },
      { value: 'shift_jis', label: 'Shift_JIS' },
    ],
    radixLabel: '進数',
    radixOptions: [
      { value: '2', label: '2進数' },
      { value: '8', label: '8進数' },
      { value: '16', label: '16進数' },
    ],
    separatorLabel: 'バイトを空白で区切る',
    uppercaseLabel: '16進数を大文字にする',
    bomLabel: 'BOMを付ける',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabelEncode: 'テキスト',
    inputLabelDecode: '数値（バイト列）',
    inputPlaceholderEncode: '変換したいテキストを入力',
    inputPlaceholderDecode: '例: E3 81 82 または 0xE3,0x81,0x82',
    outputLabel: '結果',
    byteCountTemplate: '{n} バイト',
    unmappableTemplate:
      '{chars} はこの文字コードで表せないため「?」（3F）に置き換えました。',
    invalidCharError:
      '「{token}」は選んだ進数で使えない文字を含んでいます。進数の選択を確認してください。',
    outOfRangeError:
      '「{token}」は1バイト（0〜255）に収まりません。区切りや桁数を確認してください。',
    badLengthError:
      '区切りなしの数値は1バイトぶんの桁数（2進数8桁・8進数3桁・16進数2桁）の倍数にしてください。',
    replacedWarning:
      '{n} か所を文字コードとして解釈できず「�」に置き換えました。文字コードの選択を確認してください。',
    howToHeading: '使い方',
    howToSteps: [
      '「テキスト → 数値」か「数値 → テキスト」を選びます。',
      '「文字コード」と「進数」を選びます（日本語はUTF-8かShift_JISが一般的です）。',
      '入力欄にテキスト、または数値のバイト列を入力すると、結果が自動で表示されます。',
      '「コピー」で結果をクリップボードにコピーします。',
    ],
    notesHeading: '注意事項',
    notes: [
      '同じテキストでも文字コードによってバイト列が変わります。たとえば『あ』はUTF-8では E3 81 82、Shift_JISでは 82 A0 です。',
      '数値 → テキストでは、空白・カンマ・改行区切りのほか、区切りなしの連続した数値も1バイトずつ読み取ります。0x や \\x の接頭辞も使えます。',
      'Shift_JISはCP932（Windows）に近い対応表を使います。表現できない文字は半角の?に置き換わります。',
      'UTF-16は文字ごとに2バイト（絵文字などは4バイト）で、LEは下位バイトが先、BEは上位バイトが先です。',
      'この変換は暗号化ではありません。誰でも元のテキストに戻せます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'バイト列',
        description:
          'コンピューターが文字を保存・送受信するときの、0〜255の数値（8ビット）の並びです。文字をどの数値に対応させるかは文字コードが決めます。',
      },
      {
        term: 'BOM',
        description:
          'Byte Order Mark。UTF-8やUTF-16のデータの先頭に付ける目印のバイト列（UTF-8は EF BB BF）で、文字コードやバイト順を示します。付けないのが一般的です。',
      },
      {
        term: 'リトルエンディアン／ビッグエンディアン',
        description:
          'UTF-16のように1文字を複数バイトで表すときの並び順です。リトルエンディアン（LE）は下位バイトから、ビッグエンディアン（BE）は上位バイトから並べます。',
      },
    ],
  },
  en: {
    title: 'Text to Binary / Hex Converter (UTF-8, Shift_JIS)',
    description:
      'Convert text to binary, octal or hex bytes in UTF-8, UTF-16 or Shift_JIS, and back. Runs in your browser; nothing is sent to a server.',
    h1: 'Text to Binary / Hex Converter',
    introHtml: `See how your text is stored as bytes. Pick an encoding (UTF-8, UTF-16 or Shift_JIS) and a base, and the tool shows each byte in binary, octal or hex. Switch to "Number → Text" to turn bytes back into text. To convert plain numbers between bases, use the <a href="/en/tools/base-converter/" class="${linkClass}">Base Converter</a>. For Base64, see the <a href="/en/tools/base64/" class="${linkClass}">Base64 Encoder/Decoder</a>, and for files or garbled text, the <a href="/en/tools/encoding-converter/" class="${linkClass}">Encoding Converter</a>.`,
    modeLabel: 'Mode',
    modeEncode: 'Text → Number',
    modeDecode: 'Number → Text',
    encodingLabel: 'Encoding',
    encodingOptions: [
      { value: 'utf-8', label: 'UTF-8' },
      { value: 'utf-16le', label: 'UTF-16LE' },
      { value: 'utf-16be', label: 'UTF-16BE' },
      { value: 'shift_jis', label: 'Shift_JIS' },
    ],
    radixLabel: 'Base',
    radixOptions: [
      { value: '2', label: 'Binary' },
      { value: '8', label: 'Octal' },
      { value: '16', label: 'Hex' },
    ],
    separatorLabel: 'Separate bytes with spaces',
    uppercaseLabel: 'Uppercase hex',
    bomLabel: 'Add BOM',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabelEncode: 'Text',
    inputLabelDecode: 'Numbers (bytes)',
    inputPlaceholderEncode: 'Enter text to convert',
    inputPlaceholderDecode: 'e.g. E3 81 82 or 0xE3,0x81,0x82',
    outputLabel: 'Result',
    byteCountTemplate: '{n} bytes',
    unmappableTemplate:
      '{chars} cannot be represented in this encoding and was replaced with "?" (3F).',
    invalidCharError:
      '"{token}" contains characters that are not valid in the selected base. Check the base setting.',
    outOfRangeError:
      '"{token}" does not fit in one byte (0-255). Check the separators and digit counts.',
    badLengthError:
      'Numbers without separators must be a multiple of one byte (8 binary, 3 octal or 2 hex digits).',
    replacedWarning:
      '{n} place(s) could not be read in this encoding and were replaced with "�". Check the encoding setting.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose "Text → Number" or "Number → Text".',
      'Pick an "Encoding" and a "Base" (UTF-8 is the usual choice).',
      'Type text, or paste bytes as numbers, and the result appears automatically.',
      'Press "Copy" to copy the result.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The same text produces different bytes in different encodings. For example, あ is E3 81 82 in UTF-8 and 82 A0 in Shift_JIS.',
      'In Number → Text mode, bytes can be separated by spaces, commas or line breaks, or written as one unbroken run. 0x and \\x prefixes are accepted.',
      'Shift_JIS uses a mapping close to CP932 (Windows). Characters it cannot represent are replaced with a plain ? character.',
      'UTF-16 uses 2 bytes per character (4 for emoji and other supplementary characters). LE puts the low byte first, BE the high byte first.',
      'This is not encryption. Anyone can convert the numbers back to text.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Byte sequence',
        description:
          'The series of 8-bit values (0-255) a computer uses to store or send text. The encoding decides which numbers stand for which characters.',
      },
      {
        term: 'BOM',
        description:
          'Byte Order Mark. A marker placed at the start of UTF-8 or UTF-16 data (EF BB BF for UTF-8) that signals the encoding and byte order. It is usually omitted.',
      },
      {
        term: 'Little-endian / Big-endian',
        description:
          'The byte order used when one character takes several bytes, as in UTF-16. Little-endian (LE) stores the low byte first; big-endian (BE) stores the high byte first.',
      },
    ],
  },
};
