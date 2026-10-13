export type MimeCategory =
  | 'web'
  | 'text'
  | 'data'
  | 'image'
  | 'audio'
  | 'video'
  | 'document'
  | 'archive'
  | 'font'
  | 'executable'
  | 'model'
  | 'other';

export const MIME_CATEGORIES: MimeCategory[] = [
  'web',
  'text',
  'data',
  'image',
  'audio',
  'video',
  'document',
  'archive',
  'font',
  'executable',
  'model',
  'other',
];

export interface MimeEntry {
  mime: string;
  /** 小文字・ドットなし。先頭が代表的な拡張子。空配列の場合もある */
  extensions: string[];
  category: MimeCategory;
}

export type LookupMode = 'auto' | 'extension' | 'mime';
export type QueryKind = 'extension' | 'mime';
export type CategoryFilter = MimeCategory | 'all';

export interface LookupResult {
  /** 実際に使った判別結果 */
  kind: QueryKind;
  /** 正規化した検索語 */
  query: string;
  /** 完全一致（拡張子一致 / MIMEタイプ一致 / type/* の一致） */
  exact: MimeEntry[];
  /** 部分一致（上限 PARTIAL_LIMIT 件） */
  partial: MimeEntry[];
  /** 部分一致の総数（上限で切った場合は partial.length より大きい） */
  partialTotal: number;
  /** image/* のようなワイルドカード指定だったか */
  wildcard: boolean;
  /** 未登録の MIME で +json / +xml などの構造化サフィックスを持つ場合のその値 */
  structuredSuffix?: string;
}

export const PARTIAL_LIMIT = 100;

// 形式: mime|ext ext ...|category
const TABLE = `
text/html|html htm shtml|web
text/css|css|web
text/javascript|js mjs cjs|web
application/wasm|wasm|web
application/manifest+json|webmanifest|web
application/xhtml+xml|xhtml xht|web
text/jsx|jsx|web
text/typescript|ts mts cts|web
text/x-scss|scss|web
text/x-less|less|web
application/x-httpd-php|php|web
text/plain|txt text log conf cfg ini|text
text/markdown|md markdown|text
text/csv|csv|data
text/tab-separated-values|tsv|data
text/calendar|ics ifb|text
text/vcard|vcf vcard|text
text/vtt|vtt|text
application/x-subrip|srt|text
text/x-python|py|text
text/x-java-source|java|text
text/x-c|c h|text
text/x-rust|rs|text
text/x-shellscript|sh bash|text
text/x-tex|tex|text
text/event-stream||text
application/json|json|data
application/ld+json|jsonld|data
application/geo+json|geojson|data
application/x-ndjson|ndjson jsonl|data
application/xml|xml|data
text/xml|xml|data
application/rss+xml|rss|data
application/atom+xml|atom|data
application/yaml|yaml yml|data
application/toml|toml|data
application/sql|sql|data
application/x-ipynb+json|ipynb|data
application/x-www-form-urlencoded||data
multipart/form-data||data
application/octet-stream|bin|other
application/vnd.sqlite3|sqlite sqlite3 db|data
application/vnd.google-earth.kml+xml|kml|data
application/vnd.google-earth.kmz|kmz|data
application/gpx+xml|gpx|data
application/x-pem-file|pem|data
application/x-x509-ca-cert|crt cer der|data
application/pkcs12|p12 pfx|data
application/x-bittorrent|torrent|data
application/x-shockwave-flash|swf|other
image/png|png|image
image/jpeg|jpg jpeg jpe jfif|image
image/gif|gif|image
image/webp|webp|image
image/avif|avif|image
image/svg+xml|svg svgz|image
image/bmp|bmp|image
image/x-icon|ico|image
image/vnd.microsoft.icon|ico|image
image/tiff|tif tiff|image
image/heic|heic|image
image/heif|heif|image
image/apng|apng|image
image/jxl|jxl|image
image/jp2|jp2|image
image/vnd.adobe.photoshop|psd|image
image/x-icns|icns|image
image/x-tga|tga|image
image/vnd.djvu|djvu djv|image
image/x-adobe-dng|dng|image
image/x-canon-cr2|cr2|image
image/x-nikon-nef|nef|image
application/postscript|ai eps ps|image
audio/mpeg|mp3 mpga|audio
audio/wav|wav|audio
audio/x-wav|wav|audio
audio/ogg|oga ogg spx|audio
audio/opus|opus|audio
audio/flac|flac|audio
audio/aac|aac|audio
audio/mp4|m4a|audio
audio/webm|weba|audio
audio/midi|mid midi|audio
audio/x-ms-wma|wma|audio
audio/x-aiff|aif aiff aifc|audio
audio/amr|amr|audio
audio/x-matroska|mka|audio
audio/x-mpegurl|m3u|audio
application/vnd.apple.mpegurl|m3u8|video
video/mp4|mp4 m4v mp4v|video
video/webm|webm|video
video/ogg|ogv|video
video/quicktime|mov qt|video
video/x-msvideo|avi|video
video/x-matroska|mkv|video
video/mpeg|mpeg mpg mpe|video
video/x-ms-wmv|wmv|video
video/x-ms-asf|asf|video
video/x-flv|flv|video
video/3gpp|3gp|video
video/3gpp2|3g2|video
video/mp2t|ts m2ts|video
application/pdf|pdf|document
application/msword|doc|document
application/vnd.openxmlformats-officedocument.wordprocessingml.document|docx|document
application/vnd.ms-word.document.macroenabled.12|docm|document
application/vnd.ms-excel|xls|document
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet|xlsx|document
application/vnd.ms-excel.sheet.macroenabled.12|xlsm|document
application/vnd.ms-powerpoint|ppt|document
application/vnd.openxmlformats-officedocument.presentationml.presentation|pptx|document
application/vnd.oasis.opendocument.text|odt|document
application/vnd.oasis.opendocument.spreadsheet|ods|document
application/vnd.oasis.opendocument.presentation|odp|document
application/rtf|rtf|document
application/epub+zip|epub|document
application/vnd.amazon.ebook|azw|document
application/x-mobipocket-ebook|mobi|document
application/vnd.visio|vsd|document
application/vnd.ms-outlook|msg|document
message/rfc822|eml|document
application/vnd.apple.pages|pages|document
application/vnd.apple.numbers|numbers|document
application/vnd.apple.keynote|key|document
application/zip|zip|archive
application/gzip|gz|archive
application/x-tar|tar|archive
application/x-bzip2|bz2|archive
application/x-xz|xz|archive
application/x-7z-compressed|7z|archive
application/vnd.rar|rar|archive
application/zstd|zst|archive
application/x-compress|z|archive
application/x-lzh-compressed|lzh lha|archive
application/java-archive|jar war ear|archive
application/x-iso9660-image|iso|archive
application/x-apple-diskimage|dmg|archive
application/vnd.android.package-archive|apk|archive
application/vnd.debian.binary-package|deb|archive
application/x-rpm|rpm|archive
application/x-msi|msi|archive
application/vnd.microsoft.portable-executable|exe dll|executable
application/x-msdownload|exe dll|executable
application/x-sh|sh|executable
application/x-msdos-program|com bat|executable
font/woff|woff|font
font/woff2|woff2|font
font/ttf|ttf|font
font/otf|otf|font
font/collection|ttc|font
application/vnd.ms-fontobject|eot|font
model/gltf+json|gltf|model
model/gltf-binary|glb|model
model/stl|stl|model
model/obj|obj|model
model/3mf|3mf|model
`;

export const MIME_ENTRIES: MimeEntry[] = TABLE.trim()
  .split('\n')
  .map((line) => {
    const [mime, exts, category] = line.split('|');
    return {
      mime,
      extensions: exts ? exts.split(' ') : [],
      category: category as MimeCategory,
    };
  });

/** 拡張子の入力を正規化する。`*.PNG` / `.tar.gz` / `photo.JPG` → png / gz / jpg */
export function normalizeExtension(input: string): string {
  let value = input.trim().toLowerCase();
  const lastDot = value.lastIndexOf('.');
  if (lastDot >= 0) value = value.slice(lastDot + 1);
  return value.replace(/^\*+/, '').trim();
}

/** MIMEタイプの入力を正規化する。`Content-Type: text/html; charset=UTF-8` → text/html */
export function normalizeMime(input: string): string {
  let value = input.trim().toLowerCase();
  value = value.replace(/^content-type\s*:\s*/, '');
  const semi = value.indexOf(';');
  if (semi >= 0) value = value.slice(0, semi);
  return value.trim();
}

/** モードが auto のとき、スラッシュを含むか、または Content-Type: で始まるかで判別する */
export function detectQueryKind(input: string): QueryKind {
  return input.includes('/') || /^\s*content-type\s*:/i.test(input)
    ? 'mime'
    : 'extension';
}

const SUFFIXES = ['json', 'xml', 'zip', 'gzip'];

function rank(entry: MimeEntry, query: string): number {
  const subtype = entry.mime.split('/')[1] ?? '';
  if (
    entry.extensions.some((e) => e.startsWith(query)) ||
    entry.mime.startsWith(query) ||
    subtype.startsWith(query)
  ) {
    return 0;
  }
  return 1;
}

/** 検索する。空の検索語は category が指定されているときだけ分類の一覧を返す */
export function lookup(
  input: string,
  mode: LookupMode = 'auto',
  category: CategoryFilter = 'all',
): LookupResult {
  const kind: QueryKind =
    mode === 'auto' ? detectQueryKind(input) : (mode as QueryKind);
  const query =
    kind === 'mime' ? normalizeMime(input) : normalizeExtension(input);
  const inCategory = (e: MimeEntry) =>
    category === 'all' || e.category === category;

  const result: LookupResult = {
    kind,
    query,
    exact: [],
    partial: [],
    partialTotal: 0,
    wildcard: false,
  };

  if (!query) {
    if (category !== 'all') {
      const all = MIME_ENTRIES.filter(inCategory);
      result.partialTotal = all.length;
      result.partial = all.slice(0, PARTIAL_LIMIT);
    }
    return result;
  }

  let exactMatcher: (e: MimeEntry) => boolean;
  if (kind === 'extension') {
    exactMatcher = (e) => e.extensions.includes(query);
  } else if (query.endsWith('/*')) {
    const prefix = query.slice(0, -1);
    result.wildcard = true;
    exactMatcher = (e) => e.mime.startsWith(prefix);
  } else {
    exactMatcher = (e) => e.mime === query;
  }

  result.exact = MIME_ENTRIES.filter((e) => exactMatcher(e) && inCategory(e));

  if (!result.wildcard) {
    const partialAll = MIME_ENTRIES.filter(
      (e) =>
        inCategory(e) &&
        !exactMatcher(e) &&
        (e.mime.includes(query) || e.extensions.some((x) => x.includes(query))),
    )
      .map((e, i) => ({ e, i, r: rank(e, query) }))
      .sort((a, b) => a.r - b.r || a.i - b.i)
      .map((x) => x.e);
    result.partialTotal = partialAll.length;
    result.partial = partialAll.slice(0, PARTIAL_LIMIT);
  }

  if (kind === 'mime' && !result.wildcard && result.exact.length === 0) {
    const plus = query.lastIndexOf('+');
    if (plus >= 0) {
      const suffix = query.slice(plus + 1);
      if (SUFFIXES.includes(suffix)) result.structuredSuffix = suffix;
    }
  }

  return result;
}

/** Content-Type ヘッダー値の例を作る。text/* には charset=utf-8 を付ける */
export function buildContentType(mime: string): string {
  return mime.startsWith('text/') ? `${mime}; charset=utf-8` : mime;
}

/** 拡張子を `.png, .jpg` の形式に整形する。無い場合は空文字 */
export function formatExtensions(entry: MimeEntry): string {
  return entry.extensions.map((e) => `.${e}`).join(', ');
}
