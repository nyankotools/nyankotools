import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface FileHashCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  uppercaseLabel: string;
  compareLabel: string;
  comparePlaceholder: string;
  /** {algorithm} を置換する */
  compareMatch: string;
  /** {algorithm} を置換する */
  compareMismatch: string;
  compareInvalid: string;
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

export const fileHashCalculatorContent: Record<
  Locale,
  FileHashCalculatorPageContent
> = {
  ja: {
    title: 'ファイルハッシュ計算（MD5・SHA-256）',
    description:
      'ファイルをドラッグ＆ドロップするだけで、MD5・SHA-1・SHA-256・SHA-384・SHA-512のハッシュ値を計算できる無料ツールです。ダウンロードしたファイルの改ざん・破損チェックに。ファイルはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ファイルハッシュ計算（MD5・SHA-256）',
    introHtml:
      'ファイルのMD5・SHA-1・SHA-256・SHA-384・SHA-512ハッシュ値を計算します。配布元が公開しているハッシュ値と見比べれば、ダウンロードしたファイルが壊れていないか、改ざんされていないかを確認できます。ファイルはブラウザ内で処理され、アップロードされません。テキストのハッシュは <a href="/tools/hash-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ハッシュ生成</a> をご利用ください。',
    dropLabel: 'ファイルを選択（複数可）',
    dropHint:
      'ここにファイルをドラッグ＆ドロップするか、ボタンから選択してください。',
    uppercaseLabel: '大文字で表示する',
    compareLabel: '配布元のハッシュ値と照合する（任意）',
    comparePlaceholder: '公開されているハッシュ値を貼り付け',
    compareMatch: '一致しました（{algorithm}）',
    compareMismatch:
      '一致しません（{algorithm}）。ファイルが壊れているか、別のファイルの可能性があります。',
    compareInvalid:
      'ハッシュ値の形式が正しくありません（16進数で32・40・64・96・128桁）。',
    computing: '計算中…',
    errorTooLarge: '{name} は{max}MBを超えているため計算できません。',
    errorReadFailed: '{name} を読み込めませんでした。',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    howToHeading: '使い方',
    howToSteps: [
      '計算したいファイルを枠内にドラッグ＆ドロップするか、ファイルを選択します。',
      'MD5・SHA-1・SHA-256・SHA-384・SHA-512のハッシュ値が一覧で表示されます。',
      '配布元が公開しているハッシュ値を「照合」欄に貼り付けると、一致・不一致が表示されます。',
      '必要なハッシュ値は「コピー」ボタンでコピーできます。',
    ],
    notesHeading: '注意事項',
    notes: [
      'ファイルはすべてブラウザのメモリに読み込んで計算します。1ファイルあたり256MBまでです。それより大きいファイルは計算できません。',
      'MD5・SHA-1には既知の脆弱性があり、改ざんの検出には向きません。安全性が必要な場合はSHA-256以上を使ってください。',
      'ハッシュ値が一致しても、配布元のハッシュ値自体が改ざんされていれば意味がありません。ハッシュ値は、ファイルとは別の信頼できる場所で公開されているものと照合してください。',
      '見た目が同じでも、ファイルの中身が1バイトでも違えばハッシュ値は大きく変わります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ハッシュ値（チェックサム）',
        description:
          'ファイルの中身から計算した固定長の「指紋」のような値です。中身が1バイトでも変わると、まったく別の値になります。',
      },
      {
        term: 'SHA-256',
        description:
          '現在もっとも広く使われているハッシュ関数の一つで、256ビット（16進数で64桁）の値を出力します。ソフトウェアの配布ページでよく使われています。',
      },
      {
        term: 'MD5',
        description:
          '128ビット（16進数で32桁）の古いハッシュ関数です。意図的な改ざんの検出には使えませんが、転送中の破損チェックには今も使われます。',
      },
    ],
  },
  en: {
    title: 'File Hash Calculator (MD5, SHA-256)',
    description:
      'Drag and drop files to get MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes and verify downloads. Runs in your browser; files are never uploaded.',
    h1: 'File Hash Calculator (MD5, SHA-256)',
    introHtml:
      'Calculates the MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes of a file. Compare them with the checksum published by the source to confirm a download is intact and unmodified. Files are processed in your browser and are never uploaded. To hash text instead, use the <a href="/en/tools/hash-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Hash Generator</a>.',
    dropLabel: 'Choose files (multiple allowed)',
    dropHint: 'Drag and drop files here, or pick them with the button.',
    uppercaseLabel: 'Show in uppercase',
    compareLabel: 'Compare with a published hash (optional)',
    comparePlaceholder: 'Paste the published hash',
    compareMatch: 'Match ({algorithm})',
    compareMismatch:
      'No match ({algorithm}). The file may be corrupted or a different file.',
    compareInvalid:
      'Not a valid hash (expected 32, 40, 64, 96, or 128 hexadecimal digits).',
    computing: 'Calculating…',
    errorTooLarge: '{name} is larger than {max} MB and cannot be calculated.',
    errorReadFailed: 'Could not read {name}.',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    howToHeading: 'How to use',
    howToSteps: [
      'Drag and drop the files you want to hash into the box, or choose them.',
      'The MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes are listed for each file.',
      'To verify a download, paste the hash published by the source into the compare field to see whether it matches.',
      'Use the Copy button to copy any hash.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Each file is read fully into browser memory to be hashed, so files are limited to 256 MB each. Larger files cannot be calculated.',
      'MD5 and SHA-1 have known weaknesses and are not suitable for detecting deliberate tampering. Use SHA-256 or stronger where security matters.',
      'A match is meaningless if the published hash itself was tampered with. Compare against a hash published in a trusted place separate from the file.',
      'Files that look identical still produce very different hashes if even one byte differs.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Hash (checksum)',
        description:
          'A fixed-length "fingerprint" computed from a file’s contents. Changing even one byte produces a completely different value.',
      },
      {
        term: 'SHA-256',
        description:
          'One of the most widely used hash functions today, producing a 256-bit value (64 hexadecimal digits). Software download pages commonly publish it.',
      },
      {
        term: 'MD5',
        description:
          'An older 128-bit hash function (32 hexadecimal digits). It cannot detect deliberate tampering, but is still used to check for corruption in transit.',
      },
    ],
  },
};
