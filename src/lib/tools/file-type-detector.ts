export type FileTypeCategory =
  | 'image'
  | 'audio'
  | 'video'
  | 'archive'
  | 'document'
  | 'executable'
  | 'font'
  | 'database'
  | 'text'
  | 'other';

export interface FileTypeInfo {
  /** 形式名（言語非依存の固有名詞。例: PNG, ZIP） */
  name: string;
  mime: string;
  /** この形式として正しい拡張子（小文字・ドットなし）。先頭が代表的な拡張子 */
  extensions: string[];
  category: FileTypeCategory;
}

export type ExtensionStatus =
  'match' | 'mismatch' | 'no-extension' | 'undetermined';

export interface ExtensionCheck {
  status: ExtensionStatus;
  /** ファイル名の拡張子（小文字・ドットなし。無ければ空文字） */
  extension: string;
}

/** 判定に使う先頭バイト数（ISO 9660 の識別子が 32769 バイト目にあるため 64KB） */
export const HEAD_BYTES = 64 * 1024;

/** 16進ダンプで表示するバイト数 */
export const DUMP_BYTES = 256;

const ZIP_FAMILY_EXTENSIONS = [
  'zip',
  'docx',
  'xlsx',
  'pptx',
  'jar',
  'war',
  'ear',
  'apk',
  'aab',
  'xpi',
  'epub',
  'odt',
  'ods',
  'odp',
  'vsix',
  'nupkg',
  'whl',
  'cbz',
  'kmz',
  'ipa',
  'appx',
  'msix',
  '3mf',
  'vsdx',
  'xps',
  'aar',
  'hpi',
];

function info(
  name: string,
  mime: string,
  extensions: string[],
  category: FileTypeCategory,
): FileTypeInfo {
  return { name, mime, extensions, category };
}

const TYPES = {
  png: info('PNG', 'image/png', ['png', 'apng'], 'image'),
  jpeg: info('JPEG', 'image/jpeg', ['jpg', 'jpeg', 'jpe', 'jfif'], 'image'),
  gif: info('GIF', 'image/gif', ['gif'], 'image'),
  bmp: info('BMP', 'image/bmp', ['bmp', 'dib'], 'image'),
  ico: info('ICO', 'image/vnd.microsoft.icon', ['ico'], 'image'),
  cur: info('CUR', 'image/x-icon', ['cur'], 'image'),
  tiff: info(
    'TIFF',
    'image/tiff',
    ['tif', 'tiff', 'dng', 'nef', 'cr2', 'arw', 'orf', 'rw2'],
    'image',
  ),
  psd: info('PSD', 'image/vnd.adobe.photoshop', ['psd'], 'image'),
  webp: info('WebP', 'image/webp', ['webp'], 'image'),
  avif: info('AVIF', 'image/avif', ['avif', 'avifs'], 'image'),
  heic: info('HEIC', 'image/heic', ['heic', 'heif', 'heics'], 'image'),
  pdf: info('PDF', 'application/pdf', ['pdf'], 'document'),
  ps: info(
    'PostScript',
    'application/postscript',
    ['ps', 'eps', 'ai'],
    'document',
  ),
  rtf: info('RTF', 'application/rtf', ['rtf'], 'document'),
  ole: info(
    'OLE2 (legacy Office)',
    'application/x-ole-storage',
    [
      'doc',
      'dot',
      'xls',
      'xlt',
      'ppt',
      'pps',
      'pot',
      'msi',
      'msg',
      'vsd',
      'pub',
      'mpp',
      'hwp',
    ],
    'document',
  ),
  docx: info(
    'DOCX',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ['docx', 'docm', 'dotx', 'dotm'],
    'document',
  ),
  xlsx: info(
    'XLSX',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ['xlsx', 'xlsm', 'xltx', 'xltm', 'xlam'],
    'document',
  ),
  pptx: info(
    'PPTX',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ['pptx', 'pptm', 'ppsx', 'ppsm', 'potx', 'potm', 'ppam', 'sldx'],
    'document',
  ),
  odt: info(
    'ODT',
    'application/vnd.oasis.opendocument.text',
    ['odt', 'ott'],
    'document',
  ),
  ods: info(
    'ODS',
    'application/vnd.oasis.opendocument.spreadsheet',
    ['ods', 'ots'],
    'document',
  ),
  odp: info(
    'ODP',
    'application/vnd.oasis.opendocument.presentation',
    ['odp', 'otp'],
    'document',
  ),
  epub: info('EPUB', 'application/epub+zip', ['epub'], 'document'),
  zip: info('ZIP', 'application/zip', ZIP_FAMILY_EXTENSIONS, 'archive'),
  jar: info(
    'JAR',
    'application/java-archive',
    ['jar', 'war', 'ear', 'aar', 'hpi', 'xpi', 'apk'],
    'archive',
  ),
  apk: info(
    'APK',
    'application/vnd.android.package-archive',
    ['apk', 'aab', 'xapk'],
    'archive',
  ),
  gzip: info('GZIP', 'application/gzip', ['gz', 'tgz', 'svgz'], 'archive'),
  bzip2: info(
    'BZIP2',
    'application/x-bzip2',
    ['bz2', 'tbz2', 'tbz'],
    'archive',
  ),
  sevenZip: info('7-Zip', 'application/x-7z-compressed', ['7z'], 'archive'),
  rar: info('RAR', 'application/vnd.rar', ['rar'], 'archive'),
  xz: info('XZ', 'application/x-xz', ['xz', 'txz'], 'archive'),
  zstd: info('Zstandard', 'application/zstd', ['zst'], 'archive'),
  tar: info('TAR', 'application/x-tar', ['tar'], 'archive'),
  cab: info('CAB', 'application/vnd.ms-cab-compressed', ['cab'], 'archive'),
  lzip: info('LZIP', 'application/x-lzip', ['lz'], 'archive'),
  iso: info('ISO 9660', 'application/x-iso9660-image', ['iso'], 'archive'),
  ar: info('ar', 'application/x-archive', ['deb', 'a', 'ar', 'lib'], 'archive'),
  rpm: info('RPM', 'application/x-rpm', ['rpm'], 'archive'),
  mp3: info('MP3', 'audio/mpeg', ['mp3', 'mp2', 'mpga'], 'audio'),
  aac: info('AAC', 'audio/aac', ['aac'], 'audio'),
  flac: info('FLAC', 'audio/flac', ['flac'], 'audio'),
  ogg: info(
    'Ogg',
    'audio/ogg',
    ['ogg', 'oga', 'ogv', 'ogx', 'opus', 'spx'],
    'audio',
  ),
  midi: info('MIDI', 'audio/midi', ['mid', 'midi', 'kar'], 'audio'),
  wav: info('WAV', 'audio/wav', ['wav', 'wave'], 'audio'),
  aiff: info('AIFF', 'audio/aiff', ['aif', 'aiff', 'aifc'], 'audio'),
  m4a: info('M4A', 'audio/mp4', ['m4a', 'm4b', 'mp4'], 'audio'),
  mp4: info(
    'MP4',
    'video/mp4',
    ['mp4', 'm4v', 'm4a', 'm4b', 'f4v', '3gp', '3g2', 'cr3'],
    'video',
  ),
  mov: info('QuickTime', 'video/quicktime', ['mov', 'qt'], 'video'),
  gp3: info('3GP', 'video/3gpp', ['3gp', '3g2', 'mp4'], 'video'),
  webm: info('WebM', 'video/webm', ['webm'], 'video'),
  mkv: info(
    'Matroska',
    'video/x-matroska',
    ['mkv', 'mka', 'mks', 'mk3d'],
    'video',
  ),
  avi: info('AVI', 'video/x-msvideo', ['avi'], 'video'),
  flv: info('FLV', 'video/x-flv', ['flv'], 'video'),
  mpeg: info('MPEG', 'video/mpeg', ['mpg', 'mpeg', 'vob', 'm2v'], 'video'),
  asf: info('ASF', 'video/x-ms-asf', ['wmv', 'wma', 'asf'], 'video'),
  ts: info('MPEG-TS', 'video/mp2t', ['ts', 'mts', 'm2ts', 'm2t'], 'video'),
  riff: info(
    'RIFF',
    'application/octet-stream',
    ['riff', 'rmi', 'ani', 'cda'],
    'other',
  ),
  pe: info(
    'Windows PE (EXE/DLL)',
    'application/vnd.microsoft.portable-executable',
    ['exe', 'dll', 'sys', 'scr', 'ocx', 'cpl', 'drv', 'efi'],
    'executable',
  ),
  elf: info(
    'ELF',
    'application/x-executable',
    ['elf', 'so', 'o', 'bin', 'out', 'ko', 'axf'],
    'executable',
  ),
  macho: info(
    'Mach-O',
    'application/x-mach-binary',
    ['dylib', 'o', 'bundle'],
    'executable',
  ),
  javaClass: info('Java class', 'application/java-vm', ['class'], 'executable'),
  wasm: info('WebAssembly', 'application/wasm', ['wasm'], 'executable'),
  dex: info('Dalvik DEX', 'application/octet-stream', ['dex'], 'executable'),
  lnk: info(
    'Windows shortcut',
    'application/x-ms-shortcut',
    ['lnk'],
    'executable',
  ),
  sqlite: info(
    'SQLite',
    'application/vnd.sqlite3',
    ['sqlite', 'sqlite3', 'db', 'db3', 'sqlitedb'],
    'database',
  ),
  ttf: info('TrueType', 'font/ttf', ['ttf'], 'font'),
  otf: info('OpenType', 'font/otf', ['otf'], 'font'),
  ttc: info('TrueType Collection', 'font/collection', ['ttc', 'otc'], 'font'),
  woff: info('WOFF', 'font/woff', ['woff'], 'font'),
  woff2: info('WOFF2', 'font/woff2', ['woff2'], 'font'),
  pcap: info('pcap', 'application/vnd.tcpdump.pcap', ['pcap', 'cap'], 'other'),
  pcapng: info('pcapng', 'application/x-pcapng', ['pcapng', 'ntar'], 'other'),
  // テキスト系（extensions は使わない。バイナリ形式の拡張子との不一致だけを警告する）
  text: info('Text', 'text/plain', [], 'text'),
  textOther: info('Text (non-UTF-8)', 'text/plain', [], 'text'),
  utf8Bom: info('Text (UTF-8 with BOM)', 'text/plain', [], 'text'),
  utf16le: info('Text (UTF-16 LE)', 'text/plain', [], 'text'),
  utf16be: info('Text (UTF-16 BE)', 'text/plain', [], 'text'),
  html: info('HTML', 'text/html', [], 'text'),
  xml: info('XML', 'application/xml', [], 'text'),
  svg: info('SVG', 'image/svg+xml', [], 'text'),
  script: info('Script (#!)', 'text/x-shellscript', [], 'text'),
} satisfies Record<string, FileTypeInfo>;

type Signature = {
  type: FileTypeInfo;
  bytes: number[];
  offset?: number;
  test?: (data: Uint8Array) => boolean;
};

function hex(value: string): number[] {
  return value.match(/../g)!.map((pair) => parseInt(pair, 16));
}

function ascii(data: Uint8Array, start: number, length: number): string {
  let out = '';
  const end = Math.min(data.length, start + length);
  for (let i = start; i < end; i++) out += String.fromCharCode(data[i]);
  return out;
}

const DIB_HEADER_SIZES = new Set([12, 40, 52, 56, 64, 108, 124]);

const SIGNATURES: Signature[] = [
  { type: TYPES.png, bytes: hex('89504E470D0A1A0A') },
  { type: TYPES.jpeg, bytes: hex('FFD8FF') },
  { type: TYPES.gif, bytes: hex('474946383761') },
  { type: TYPES.gif, bytes: hex('474946383961') },
  {
    type: TYPES.bmp,
    bytes: hex('424D'),
    test: (d) =>
      d.length > 17 &&
      DIB_HEADER_SIZES.has(d[14]) &&
      d[15] === 0 &&
      d[16] === 0 &&
      d[17] === 0,
  },
  {
    type: TYPES.ico,
    bytes: hex('00000100'),
    test: (d) => d.length > 5 && (d[4] > 0 || d[5] > 0),
  },
  {
    type: TYPES.cur,
    bytes: hex('00000200'),
    test: (d) => d.length > 5 && (d[4] > 0 || d[5] > 0),
  },
  { type: TYPES.tiff, bytes: hex('49492A00') },
  { type: TYPES.tiff, bytes: hex('4D4D002A') },
  { type: TYPES.psd, bytes: hex('38425053') },
  { type: TYPES.pdf, bytes: hex('255044462D') },
  { type: TYPES.ps, bytes: hex('25215053') },
  { type: TYPES.rtf, bytes: hex('7B5C727466') },
  { type: TYPES.ole, bytes: hex('D0CF11E0A1B11AE1') },
  { type: TYPES.gzip, bytes: hex('1F8B08') },
  {
    type: TYPES.bzip2,
    bytes: hex('425A68'),
    test: (d) =>
      d.length > 9 &&
      d[3] >= 0x31 &&
      d[3] <= 0x39 &&
      matchesAt(d, hex('314159265359'), 4),
  },
  { type: TYPES.sevenZip, bytes: hex('377ABCAF271C') },
  { type: TYPES.rar, bytes: hex('526172211A07') },
  { type: TYPES.xz, bytes: hex('FD377A585A00') },
  { type: TYPES.zstd, bytes: hex('28B52FFD') },
  { type: TYPES.tar, bytes: hex('7573746172'), offset: 257 },
  { type: TYPES.cab, bytes: hex('4D534346') },
  { type: TYPES.lzip, bytes: hex('4C5A4950') },
  { type: TYPES.iso, bytes: hex('4344303031'), offset: 32769 },
  { type: TYPES.ar, bytes: hex('213C617263683E0A') },
  { type: TYPES.rpm, bytes: hex('EDABEEDB') },
  {
    type: TYPES.mp3,
    bytes: hex('494433'),
    test: (d) => d.length > 4 && d[3] >= 2 && d[3] <= 4,
  },
  { type: TYPES.mp3, bytes: hex('FFFB') },
  { type: TYPES.mp3, bytes: hex('FFFA') },
  { type: TYPES.mp3, bytes: hex('FFF3') },
  { type: TYPES.mp3, bytes: hex('FFF2') },
  { type: TYPES.aac, bytes: hex('FFF1') },
  { type: TYPES.aac, bytes: hex('FFF9') },
  { type: TYPES.flac, bytes: hex('664C6143') },
  { type: TYPES.ogg, bytes: hex('4F676753') },
  { type: TYPES.midi, bytes: hex('4D546864') },
  {
    type: TYPES.aiff,
    bytes: hex('464F524D'),
    test: (d) => ['AIFF', 'AIFC'].includes(ascii(d, 8, 4)),
  },
  { type: TYPES.flv, bytes: hex('464C5601') },
  { type: TYPES.mpeg, bytes: hex('000001BA') },
  { type: TYPES.mpeg, bytes: hex('000001B3') },
  { type: TYPES.asf, bytes: hex('3026B2758E66CF11A6D900AA0062CE6C') },
  {
    type: TYPES.ts,
    bytes: hex('47'),
    test: (d) => d.length > 376 && d[188] === 0x47 && d[376] === 0x47,
  },
  {
    type: TYPES.pe,
    bytes: hex('4D5A'),
    // e_lfanew（0x3C）が指す位置に PE シグネチャがあること（範囲外なら DOS ヘッダーの存在だけで許容）
    test: (d) => {
      if (d.length < 64) return false;
      const peOffset = readUint32LE(d, 0x3c);
      if (peOffset + 4 > d.length) return peOffset >= 64 && peOffset < 1 << 24;
      return matchesAt(d, hex('50450000'), peOffset);
    },
  },
  { type: TYPES.elf, bytes: hex('7F454C46') },
  { type: TYPES.macho, bytes: hex('FEEDFACE') },
  { type: TYPES.macho, bytes: hex('FEEDFACF') },
  { type: TYPES.macho, bytes: hex('CEFAEDFE') },
  { type: TYPES.macho, bytes: hex('CFFAEDFE') },
  {
    // Java クラスファイルと Mach-O ユニバーサルバイナリは同じマジックナンバー。
    // 5〜8バイト目が、前者は（マイナー＋メジャー）バージョン（45以上）、後者はアーキテクチャ数（小さい値）
    type: TYPES.javaClass,
    bytes: hex('CAFEBABE'),
    test: (d) => d.length > 7 && readUint32BE(d, 4) >= 45,
  },
  {
    type: TYPES.macho,
    bytes: hex('CAFEBABE'),
    test: (d) => d.length > 7 && readUint32BE(d, 4) < 45,
  },
  { type: TYPES.wasm, bytes: hex('0061736D') },
  { type: TYPES.dex, bytes: hex('6465780A') },
  { type: TYPES.lnk, bytes: hex('4C00000001140200') },
  { type: TYPES.sqlite, bytes: hex('53514C69746520666F726D6174203300') },
  {
    type: TYPES.ttf,
    bytes: hex('00010000'),
    test: (d) => d.length > 5 && d[4] === 0 && d[5] >= 1 && d[5] <= 64,
  },
  { type: TYPES.otf, bytes: hex('4F54544F') },
  { type: TYPES.woff, bytes: hex('774F4646') },
  { type: TYPES.woff2, bytes: hex('774F4632') },
  { type: TYPES.ttc, bytes: hex('74746366') },
  { type: TYPES.pcap, bytes: hex('D4C3B2A1') },
  { type: TYPES.pcap, bytes: hex('A1B2C3D4') },
  { type: TYPES.pcapng, bytes: hex('0A0D0D0A') },
];

function readUint32BE(d: Uint8Array, offset: number): number {
  return (
    ((d[offset] << 24) |
      (d[offset + 1] << 16) |
      (d[offset + 2] << 8) |
      d[offset + 3]) >>>
    0
  );
}

function readUint32LE(d: Uint8Array, offset: number): number {
  return (
    (d[offset] |
      (d[offset + 1] << 8) |
      (d[offset + 2] << 16) |
      (d[offset + 3] << 24)) >>>
    0
  );
}

function matchesAt(data: Uint8Array, bytes: number[], offset: number): boolean {
  if (data.length < offset + bytes.length) return false;
  for (let i = 0; i < bytes.length; i++) {
    if (data[offset + i] !== bytes[i]) return false;
  }
  return true;
}

function detectRiff(data: Uint8Array): FileTypeInfo | null {
  if (ascii(data, 0, 4) !== 'RIFF' || data.length < 12) return null;
  switch (ascii(data, 8, 4)) {
    case 'WEBP':
      return TYPES.webp;
    case 'WAVE':
      return TYPES.wav;
    case 'AVI ':
      return TYPES.avi;
    default:
      return TYPES.riff;
  }
}

/** ISO Base Media（MP4系）。メジャーブランドと互換ブランドから種類を決める */
function detectFtyp(data: Uint8Array): FileTypeInfo | null {
  if (data.length < 12 || ascii(data, 4, 4) !== 'ftyp') return null;
  const boxSize = Math.min(readUint32BE(data, 0), data.length);
  const major = ascii(data, 8, 4);
  const brands = [major];
  for (let i = 16; i + 4 <= boxSize; i += 4) brands.push(ascii(data, i, 4));

  if (brands.some((b) => b === 'avif' || b === 'avis')) return TYPES.avif;
  if (
    brands.some((b) => ['heic', 'heix', 'hevc', 'heim', 'heis'].includes(b)) ||
    major === 'mif1' ||
    major === 'msf1'
  ) {
    return TYPES.heic;
  }
  if (major === 'qt  ') return TYPES.mov;
  if (major.startsWith('3g')) return TYPES.gp3;
  if (major === 'M4A ' || major === 'M4B ') return TYPES.m4a;
  return TYPES.mp4;
}

function detectEbml(data: Uint8Array): FileTypeInfo | null {
  if (!matchesAt(data, hex('1A45DFA3'), 0)) return null;
  const head = ascii(data, 0, 4096);
  return head.includes('webm') ? TYPES.webm : TYPES.mkv;
}

/** ZIPのローカルファイルヘッダーを先頭から辿り、エントリ名で中身（Office・EPUB・APKなど）を見分ける */
function detectZip(data: Uint8Array): FileTypeInfo | null {
  const isLocal = (pos: number) => matchesAt(data, hex('504B0304'), pos);
  if (!isLocal(0)) {
    return matchesAt(data, hex('504B0506'), 0) ||
      matchesAt(data, hex('504B0708'), 0)
      ? TYPES.zip
      : null;
  }

  const names: string[] = [];
  let firstContent = '';
  let pos = 0;
  let streamed = false;
  while (names.length < 64 && pos + 30 <= data.length && isLocal(pos)) {
    const flags = data[pos + 6] | (data[pos + 7] << 8);
    const compressedSize = readUint32LE(data, pos + 18);
    const nameLength = data[pos + 26] | (data[pos + 27] << 8);
    const extraLength = data[pos + 28] | (data[pos + 29] << 8);
    const name = ascii(data, pos + 30, nameLength);
    names.push(name);
    const dataStart = pos + 30 + nameLength + extraLength;
    if (names.length === 1 && name === 'mimetype') {
      firstContent = ascii(data, dataStart, Math.min(compressedSize, 100));
    }
    // サイズがヘッダーに無い（ストリーム書き込み）場合は、これ以上辿れない
    if (flags & 0x8) {
      streamed = true;
      break;
    }
    pos = dataStart + compressedSize;
  }

  if (streamed) {
    // 以降のエントリ名を辿れないので、先頭部分に現れる代表的な名前で補う
    const headText = ascii(data, 0, data.length);
    for (const key of [
      'word/',
      'xl/',
      'ppt/',
      'AndroidManifest.xml',
      'META-INF/MANIFEST.MF',
    ]) {
      if (headText.includes(key)) names.push(key);
    }
  }

  if (firstContent.startsWith('application/epub+zip')) return TYPES.epub;
  if (firstContent.includes('opendocument.text')) return TYPES.odt;
  if (firstContent.includes('opendocument.spreadsheet')) return TYPES.ods;
  if (firstContent.includes('opendocument.presentation')) return TYPES.odp;
  if (names.some((n) => n.startsWith('word/'))) return TYPES.docx;
  if (names.some((n) => n.startsWith('xl/'))) return TYPES.xlsx;
  if (names.some((n) => n.startsWith('ppt/'))) return TYPES.pptx;
  if (names.includes('AndroidManifest.xml')) return TYPES.apk;
  if (names.includes('META-INF/MANIFEST.MF')) return TYPES.jar;
  return TYPES.zip;
}

function detectText(data: Uint8Array): FileTypeInfo | null {
  if (matchesAt(data, hex('EFBBBF'), 0)) return TYPES.utf8Bom;
  if (matchesAt(data, hex('FFFE'), 0)) return TYPES.utf16le;
  if (matchesAt(data, hex('FEFF'), 0)) return TYPES.utf16be;

  const sample = data.subarray(0, 4096);
  let hasHighByte = false;
  for (const byte of sample) {
    if (byte === 0x7f || (byte < 0x20 && ![9, 10, 12, 13, 27].includes(byte))) {
      return null;
    }
    if (byte >= 0x80) hasHighByte = true;
  }

  let text: string;
  try {
    // stream: true で、サンプル末尾で切れたマルチバイト文字を許容する
    text = new TextDecoder('utf-8', { fatal: true }).decode(sample, {
      stream: true,
    });
  } catch {
    return hasHighByte ? TYPES.textOther : null;
  }

  const head = text.trimStart().slice(0, 1024).toLowerCase();
  if (head.startsWith('#!')) return TYPES.script;
  if (head.startsWith('<?xml')) {
    return head.includes('<svg') ? TYPES.svg : TYPES.xml;
  }
  if (head.startsWith('<svg')) return TYPES.svg;
  if (head.startsWith('<!doctype html') || head.startsWith('<html')) {
    return TYPES.html;
  }
  return TYPES.text;
}

/**
 * バイト列の先頭（マジックナンバー）から実際の形式を判定する。
 * 判定できない場合は null。
 */
export function detectFileType(data: Uint8Array): FileTypeInfo | null {
  if (data.length === 0) return null;

  const container =
    detectZip(data) ?? detectRiff(data) ?? detectFtyp(data) ?? detectEbml(data);
  if (container) return container;

  for (const signature of SIGNATURES) {
    if (!matchesAt(data, signature.bytes, signature.offset ?? 0)) continue;
    if (signature.test && !signature.test(data)) continue;
    return signature.type;
  }

  return detectText(data);
}

/** テキストとして保存されることもある拡張子（誤警告を避けるため、テキストとの照合から除く） */
const TEXT_POSSIBLE_EXTENSIONS = new Set([
  'ts',
  'mts',
  'm2ts',
  'm2t',
  'out',
  'pub',
  'msg',
  'cap',
  'lib',
  'bin',
  'db',
  'a',
  'o',
  'ar',
  'sys',
  'lz',
  'kar',
  'ps',
  'eps',
  'ai',
  'rtf',
  'so',
  'elf',
  'ko',
  'axf',
  'riff',
  'rmi',
  'class',
  'dex',
]);

/** 中身がテキストであるはずがない形式の拡張子（画像・音声・動画・文書・アーカイブ・フォント・実行ファイル） */
const BINARY_EXTENSIONS = new Set(
  Object.values(TYPES)
    .filter(
      (type) =>
        type.category !== 'text' &&
        type.category !== 'database' &&
        type.category !== 'other',
    )
    .flatMap((type) => type.extensions)
    .filter((ext) => !TEXT_POSSIBLE_EXTENSIONS.has(ext)),
);

/** ファイル名から拡張子（小文字・ドットなし）を取り出す。先頭だけのドット（.gitignore）は拡張子としない */
export function getExtension(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  if (dot <= 0 || dot === fileName.length - 1) return '';
  return fileName.slice(dot + 1).toLowerCase();
}

/** 判定した形式とファイル名の拡張子が合っているかを調べる */
export function checkExtension(
  type: FileTypeInfo | null,
  fileName: string,
): ExtensionCheck {
  const extension = getExtension(fileName);
  if (!type) return { status: 'undetermined', extension };
  if (extension === '') return { status: 'no-extension', extension };

  if (type.category === 'text') {
    // テキストは拡張子が多様なので、バイナリ形式の拡張子を名乗っている場合だけ不一致とする
    return {
      status: BINARY_EXTENSIONS.has(extension) ? 'mismatch' : 'match',
      extension,
    };
  }
  return {
    status: type.extensions.includes(extension) ? 'match' : 'mismatch',
    extension,
  };
}

/** `00000000  89 50 4E 47 ...  |.PNG....|` 形式の16進ダンプを作る */
export function formatHexDump(data: Uint8Array, maxBytes = DUMP_BYTES): string {
  const bytes = data.subarray(0, maxBytes);
  const lines: string[] = [];
  for (let offset = 0; offset < bytes.length; offset += 16) {
    const row = bytes.subarray(offset, offset + 16);
    const hexCells: string[] = [];
    for (let i = 0; i < 16; i++) {
      const cell =
        i < row.length
          ? row[i].toString(16).toUpperCase().padStart(2, '0')
          : '  ';
      hexCells.push(i === 8 ? ' ' + cell : cell);
    }
    const text = Array.from(row, (b) =>
      b >= 0x20 && b < 0x7f ? String.fromCharCode(b) : '.',
    ).join('');
    lines.push(
      `${offset.toString(16).toUpperCase().padStart(8, '0')}  ${hexCells.join(' ')}  |${text}|`,
    );
  }
  return lines.join('\n');
}

/** 先頭 count バイトをスペース区切りの16進数にする */
export function formatHeadBytes(data: Uint8Array, count = 16): string {
  return Array.from(data.subarray(0, count), (b) =>
    b.toString(16).toUpperCase().padStart(2, '0'),
  ).join(' ');
}

/** バイト数を B / KB / MB / GB の文字列にする */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let unit = 0;
  // 丸めた結果が 1024 になる場合（1MB 直前など）も次の単位へ繰り上げる
  while (Math.round(value) >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value.toFixed(value >= 100 ? 0 : 1)} ${units[unit]}`;
}
