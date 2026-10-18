import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ChecksumCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  dropLabel: string;
  dropHint: string;
  uppercaseLabel: string;
  compareLabel: string;
  comparePlaceholder: string;
  /** {algorithm} を置換する */
  compareMatch: string;
  compareMismatch: string;
  compareInvalid: string;
  textResultTitle: string;
  computing: string;
  /** {name}, {max} を置換する */
  errorTooLarge: string;
  /** {name} を置換する */
  errorReadFailed: string;
  copy: string;
  copied: string;
  copyFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const checksumCalculatorContent: Record<
  Locale,
  ChecksumCalculatorPageContent
> = {
  ja: {
    title: 'チェックサム計算（CRC32・CRC16・Adler-32）',
    description:
      'テキストやファイルのCRC-32・CRC-32C・CRC-16・Adler-32・Fletcherチェックサムを一括計算できる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'チェックサム計算（CRC32・CRC16・Adler-32・Fletcher）',
    introHtml:
      'テキストまたはファイルのCRC-32・CRC-32C・CRC-16（3種）・Adler-32・Fletcher-16/32を一度に計算します。データはブラウザ内で処理され、サーバーには送信されません。MD5やSHA-256などの暗号ハッシュは <a href="/tools/hash-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ハッシュ生成</a> や <a href="/tools/file-hash-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ファイルハッシュ計算</a> をご利用ください。',
    inputLabel: 'テキスト',
    inputPlaceholder: 'チェックサムを計算したいテキストを入力（UTF-8で計算）',
    dropLabel: 'ファイル',
    dropHint:
      'ここにファイルをドラッグ＆ドロップするか、ボタンから選択してください（複数可）。',
    uppercaseLabel: '大文字で表示する',
    compareLabel: '照合する値（任意）',
    comparePlaceholder: '期待するチェックサム（例: cbf43926）',
    compareMatch: '一致しました（{algorithm}）',
    compareMismatch:
      '一致しません。桁数（4桁は16ビット系、8桁は32ビット系）とアルゴリズムを確認してください。',
    compareInvalid: '値の形式が正しくありません（16進数で4桁または8桁）。',
    textResultTitle: '入力したテキスト',
    computing: '計算中…',
    errorTooLarge: '{name} は{max}MBを超えているため計算できません。',
    errorReadFailed: '{name} を読み込めませんでした。',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    howToHeading: '使い方',
    howToSteps: [
      '「テキスト」欄に文字列を入力するか、「ファイル」の枠にファイルをドラッグ＆ドロップします。',
      'CRC-32・CRC-16・Adler-32・Fletcherなどのチェックサムが一覧で表示されます。',
      '期待する値がある場合は「照合する値（任意）」に貼り付けると、一致したアルゴリズムが表示されます。',
      '必要な値は「コピー」ボタンでコピーできます。',
    ],
    notesHeading: '注意事項',
    notes: [
      'CRCやAdler-32は誤り検出用で、改ざん検出には使えません。改ざんの確認にはSHA-256などの暗号ハッシュを使ってください。',
      'ファイルは4MBずつ読み込んで計算するため、メモリを大量に使いません。1ファイルあたり1GBまでです。',
      'テキストはUTF-8のバイト列として計算します。改行コード（LF/CRLF）が違うと値が変わります。',
      'CRC-16には多くの派生があります。ここではARC・CCITT-FALSE・XMODEMの3種を表示します。相手のツールの種類と合わせて比較してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'CRC（巡回冗長検査）',
        description:
          'データを多項式で割った余りを使う誤り検出方式です。通信やZIP、PNGなどで、データの破損を検出するために使われます。',
      },
      {
        term: 'Adler-32',
        description:
          'zlibやPNG内部で使われる軽量なチェックサムです。計算が速い反面、短いデータでは偏りが出やすい特徴があります。',
      },
      {
        term: 'Fletcher',
        description:
          '単純な加算を2段重ねにしたチェックサムです。Fletcher-16は8ビット、Fletcher-32は16ビット単位で計算します。',
      },
    ],
  },
  en: {
    title: 'Checksum Calculator (CRC32, CRC16, Adler-32, Fletcher)',
    description:
      'Calculate CRC-32, CRC-32C, CRC-16, Adler-32, and Fletcher checksums of text or files. Runs in your browser; nothing is uploaded.',
    h1: 'Checksum Calculator: CRC32, CRC16, Adler-32, Fletcher',
    introHtml:
      'Calculates CRC-32, CRC-32C, three CRC-16 variants, Adler-32, and Fletcher-16/32 for text or a file in one go. Everything runs in your browser and nothing is uploaded. For cryptographic hashes such as MD5 and SHA-256, use the <a href="/en/tools/hash-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Hash Generator</a> or the <a href="/en/tools/file-hash-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">File Hash Calculator</a>.',
    inputLabel: 'Text',
    inputPlaceholder: 'Enter the text to checksum (calculated as UTF-8)',
    dropLabel: 'Files',
    dropHint: 'Drag and drop files here, or pick them with the button.',
    uppercaseLabel: 'Show in uppercase',
    compareLabel: 'Value to compare (optional)',
    comparePlaceholder: 'Expected checksum (e.g. cbf43926)',
    compareMatch: 'Match ({algorithm})',
    compareMismatch:
      'No match. Check the length (4 digits for 16-bit, 8 digits for 32-bit) and the algorithm.',
    compareInvalid: 'Not a valid value (expected 4 or 8 hexadecimal digits).',
    textResultTitle: 'Entered text',
    computing: 'Calculating…',
    errorTooLarge: '{name} is larger than {max} MB and cannot be calculated.',
    errorReadFailed: 'Could not read {name}.',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    howToHeading: 'How to use',
    howToSteps: [
      'Type a string into the "Text" field, or drag and drop files into the "Files" box.',
      'CRC-32, CRC-16, Adler-32, Fletcher, and other checksums are listed.',
      'If you have an expected value, paste it into "Value to compare (optional)" to see which algorithm matches.',
      'Use the Copy button to copy any value.',
    ],
    notesHeading: 'Notes',
    notes: [
      'CRC and Adler-32 detect accidental errors only and cannot detect deliberate tampering. Use a cryptographic hash such as SHA-256 for that.',
      'Files are read in 4 MB chunks, so memory use stays low. Each file can be up to 1 GB.',
      'Text is checksummed as UTF-8 bytes. Different line endings (LF vs CRLF) give different values.',
      'CRC-16 has many variants. This tool shows ARC, CCITT-FALSE, and XMODEM; compare against the same variant in the other tool.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'CRC (cyclic redundancy check)',
        description:
          'An error-detection method based on the remainder of polynomial division. It is used in networking, ZIP, PNG, and more to detect corrupted data.',
      },
      {
        term: 'Adler-32',
        description:
          'A lightweight checksum used inside zlib and PNG. It is fast, but tends to be weak on very short inputs.',
      },
      {
        term: 'Fletcher',
        description:
          'A checksum built from two stacked running sums. Fletcher-16 works on 8-bit units and Fletcher-32 on 16-bit units.',
      },
    ],
  },
};
