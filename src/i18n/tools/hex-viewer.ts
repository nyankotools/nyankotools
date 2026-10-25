import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface HexViewerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** {name}, {size} を置換する */
  fileInfo: string;
  /** {size} を置換する */
  rowsInfo: string;
  /** {from}, {to} を置換する */
  rangeInfo: string;
  jumpLabel: string;
  jumpPlaceholder: string;
  jumpButton: string;
  searchLabel: string;
  searchModeHex: string;
  searchModeText: string;
  searchHexPlaceholder: string;
  searchTextPlaceholder: string;
  encodingLabel: string;
  encodingUtf8: string;
  encodingUtf16: string;
  encodingLatin1: string;
  findNext: string;
  findPrev: string;
  viewerLabel: string;
  /** {offset} を置換する */
  jumpDone: string;
  /** {offset}, {length} を置換する */
  found: string;
  notFound: string;
  /** {percent} を置換する */
  searching: string;
  errorNoFile: string;
  errorJumpEmpty: string;
  errorJumpInvalid: string;
  /** {size} を置換する */
  errorJumpRange: string;
  errorHexEmpty: string;
  errorHexInvalid: string;
  errorHexOdd: string;
  errorTextEmpty: string;
  errorTextUnmappable: string;
  emptyFile: string;
  /** {name} を置換する */
  errorReadFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const hexViewerContent: Record<Locale, HexViewerPageContent> = {
  ja: {
    title: 'バイナリビューア（16進ダンプ）｜ファイルを16進とASCIIで表示',
    description:
      'ファイルを16進とASCIIで表示する無料のバイナリビューアです。オフセットへジャンプ、16進・テキストでのバイト列検索に対応し、大きなファイルも軽く表示。ファイルはブラウザ内で処理され、サーバーには送信されません。',
    h1: '16進ダンプビューア（バイナリビューア）',
    introHtml:
      'ファイルの中身を、オフセット・16進数・ASCII文字で並べて表示します。オフセットを指定したジャンプや、16進またはテキストでのバイト列検索ができ、数百MBのファイルでも表示している範囲だけを読み込むため軽く動作します。ファイルはブラウザ内で処理され、アップロードされません。先頭だけで形式を判定したいときは <a href="/tools/file-type-detector/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ファイル種別判定</a> もご利用ください。',
    dropLabel: 'ファイルを選択',
    dropHint:
      'ここにファイルをドラッグ＆ドロップするか、ボタンから選択してください。',
    fileInfo: '{name}（{size}）',
    rowsInfo: '{size} バイト',
    rangeInfo: '表示中のオフセット: {from} 〜 {to}',
    jumpLabel: 'オフセットへ移動',
    jumpPlaceholder: '例: 4096 または 0x1000',
    jumpButton: '移動',
    searchLabel: 'バイト列を検索',
    searchModeHex: '16進で指定',
    searchModeText: 'テキストで指定',
    searchHexPlaceholder: '例: 50 4B 03 04',
    searchTextPlaceholder: '例: PNG',
    encodingLabel: '文字コード',
    encodingUtf8: 'UTF-8',
    encodingUtf16: 'UTF-16LE',
    encodingLatin1: 'Latin-1',
    findNext: '次を検索',
    findPrev: '前を検索',
    viewerLabel: '16進ダンプ表示領域',
    jumpDone: 'オフセット {offset} に移動しました。',
    found: 'オフセット {offset} で {length} バイトが見つかりました。',
    notFound: '見つかりませんでした。',
    searching: '検索中… {percent}%',
    errorNoFile: '先にファイルを選択してください。',
    errorJumpEmpty: 'オフセットを入力してください。',
    errorJumpInvalid:
      'オフセットは10進数、または 0x から始まる16進数で入力してください。',
    errorJumpRange: 'オフセットがファイルの範囲外です（0〜{max}）。',
    errorHexEmpty: '検索する16進バイト列を入力してください。',
    errorHexInvalid:
      '16進バイト列に使えない文字があります。0-9 と A-F、区切りの空白・カンマのみ使えます。',
    errorHexOdd: '16進の桁数が奇数です。1バイトは2桁で入力してください。',
    errorTextEmpty: '検索する文字列を入力してください。',
    errorTextUnmappable: 'Latin-1 で表せない文字が含まれています。',
    emptyFile: '空のファイルです（0バイト）。',
    errorReadFailed: '{name} を読み込めませんでした。',
    howToHeading: '使い方',
    howToSteps: [
      'ファイルを枠内にドラッグ＆ドロップするか、「ファイルを選択」から選びます。',
      'オフセット・16進・ASCIIが並んで表示されます。スクロールして中身を確認します。',
      '「オフセットへ移動」にアドレスを入れて「移動」を押すと、その位置にジャンプします。',
      '「バイト列を検索」で16進またはテキストを指定し、「次を検索」「前を検索」で一致箇所を探します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '表示している範囲だけをファイルから読み込むため、大きなファイルでも読み込み待ちは短く済みます。ただし数GBを超えるファイルは、ブラウザの制限で扱えない場合があります。',
      '巨大なファイルではスクロールバーの1目盛りが数百行分になります。細かい位置はオフセット移動を使ってください。',
      'ASCII欄では、表示できないバイトと0x7Fより大きいバイトをドット（.）で表します。日本語などのマルチバイト文字は文字としては表示されません。テキスト検索では UTF-8・UTF-16LE・Latin-1 のバイト列に変換して探します。',
      '検索は大文字と小文字を区別します。正規表現やワイルドカードには対応していません。また、このツールは閲覧専用で、バイトの編集や保存はできません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'オフセット',
        description:
          'ファイルの先頭から数えたバイト位置です。先頭が0で、このツールでは16進数で表示します。',
      },
      {
        term: '16進ダンプ',
        description:
          'ファイルの各バイトを2桁の16進数で並べた表示です。テキストエディタでは見えないバイナリの中身を確認できます。',
      },
      {
        term: 'エンディアン',
        description:
          '複数バイトの数値や文字を並べる順序です。UTF-16LE は下位バイトが先に並ぶため、A は 41 00 になります。',
      },
    ],
  },
  en: {
    title: 'Hex Viewer: View Any File as Hex and ASCII Online',
    description:
      'View any file as a hex dump with ASCII, jump to an offset, and search for hex or text bytes. Handles large files. Runs in your browser; nothing is uploaded.',
    h1: 'Hex Viewer (Binary File Dump)',
    introHtml:
      'Shows a file’s contents as offsets, hexadecimal bytes, and ASCII characters. Jump to any offset or search for a byte sequence given as hex or text. Only the part you are looking at is read from the file, so even files of several hundred MB stay responsive. Files are processed in your browser and never uploaded. If you only need the file format, try the <a href="/en/tools/file-type-detector/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">File Type Detector</a>.',
    dropLabel: 'Choose a file',
    dropHint: 'Drag and drop a file here, or pick one with the button.',
    fileInfo: '{name} ({size})',
    rowsInfo: '{size} bytes',
    rangeInfo: 'Showing offsets {from} to {to}',
    jumpLabel: 'Go to offset',
    jumpPlaceholder: 'e.g. 4096 or 0x1000',
    jumpButton: 'Go',
    searchLabel: 'Search for bytes',
    searchModeHex: 'Hex bytes',
    searchModeText: 'Text',
    searchHexPlaceholder: 'e.g. 50 4B 03 04',
    searchTextPlaceholder: 'e.g. PNG',
    encodingLabel: 'Encoding',
    encodingUtf8: 'UTF-8',
    encodingUtf16: 'UTF-16LE',
    encodingLatin1: 'Latin-1',
    findNext: 'Find next',
    findPrev: 'Find previous',
    viewerLabel: 'Hex dump view',
    jumpDone: 'Jumped to offset {offset}.',
    found: 'Found {length} bytes at offset {offset}.',
    notFound: 'No match found.',
    searching: 'Searching… {percent}%',
    errorNoFile: 'Choose a file first.',
    errorJumpEmpty: 'Enter an offset.',
    errorJumpInvalid:
      'Enter the offset as a decimal number or a hex number starting with 0x.',
    errorJumpRange: 'The offset is outside the file (0 to {max}).',
    errorHexEmpty: 'Enter the hex bytes to search for.',
    errorHexInvalid:
      'The hex input has invalid characters. Use only 0-9, A-F, and spaces or commas as separators.',
    errorHexOdd:
      'The hex input has an odd number of digits. Each byte needs two digits.',
    errorTextEmpty: 'Enter the text to search for.',
    errorTextUnmappable:
      'The text contains characters that Latin-1 cannot represent.',
    emptyFile: 'The file is empty (0 bytes).',
    errorReadFailed: 'Could not read {name}.',
    howToHeading: 'How to use',
    howToSteps: [
      'Drag and drop a file into the box, or pick one with "Choose a file".',
      'Offsets, hex bytes, and ASCII appear side by side. Scroll to look through the contents.',
      'Type an address in "Go to offset" and press "Go" to jump there.',
      'In "Search for bytes", enter hex or text, then use "Find next" or "Find previous" to step through matches.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Only the range on screen is read from the file, so large files open quickly. Files of several GB or more may still hit browser limits.',
      'For very large files one scrollbar step can cover hundreds of rows. Use "Go to offset" to reach an exact position.',
      'The ASCII column shows non-printable bytes and bytes above 0x7F as a dot (.), so multibyte characters such as Japanese are not displayed as text. Text search converts your input to UTF-8, UTF-16LE, or Latin-1 bytes before matching.',
      'Search is case-sensitive and does not support regular expressions or wildcards. This is a viewer only; you cannot edit or save bytes.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Offset',
        description:
          'The byte position counted from the start of the file. The first byte is at 0. This tool shows offsets in hexadecimal.',
      },
      {
        term: 'Hex dump',
        description:
          'A view that lists every byte of a file as a two-digit hexadecimal number, letting you inspect binary data that a text editor cannot show.',
      },
      {
        term: 'Endianness',
        description:
          'The order in which the bytes of a multi-byte value are stored. UTF-16LE puts the low byte first, so the letter A is stored as 41 00.',
      },
    ],
  },
};
