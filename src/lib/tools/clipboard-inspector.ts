/** クリップボード（pasteイベントのDataTransfer）の内容を整形する純粋関数群。DOMには依存しない。 */

export type MimeCategory =
  'text' | 'html' | 'image' | 'json' | 'uri-list' | 'rtf' | 'file' | 'other';

/** MIME種別を大まかな分類にまとめる。パラメータ（;charset=…）と大文字小文字は無視する。 */
export function classifyMime(type: string): MimeCategory {
  const base = type.split(';')[0].trim().toLowerCase();
  if (base === 'text/plain') return 'text';
  if (base === 'text/html') return 'html';
  if (base === 'text/uri-list') return 'uri-list';
  if (base === 'text/rtf' || base === 'application/rtf') return 'rtf';
  if (base === 'application/json' || base.endsWith('+json')) return 'json';
  if (base.startsWith('image/')) return 'image';
  if (base === 'files') return 'file';
  if (base.startsWith('text/')) return 'text';
  return 'other';
}

/** バイト数を 1.5 KB のような表記にする（1024 区切り）。 */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes < 1024) return `${Math.floor(bytes)} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(value >= 100 ? 0 : 1)} ${units[i]}`;
}

/** 文字列をUTF-8にしたときのバイト数。 */
export function utf8Size(text: string): number {
  return new TextEncoder().encode(text).length;
}

export interface TextSummary {
  characters: number;
  lines: number;
  bytes: number;
}

/** 文字数（コードポイント）・行数・UTF-8バイト数。空文字列は行数0。 */
export function summarizeText(text: string): TextSummary {
  if (text === '') return { characters: 0, lines: 0, bytes: 0 };
  return {
    characters: Array.from(text).length,
    lines: text.split(/\r\n|\r|\n/).length,
    bytes: utf8Size(text),
  };
}

export interface HtmlSummary {
  /** 開始タグ数（コメント・終了タグ・doctypeを除く） */
  tags: number;
  images: number;
  links: number;
  /** scriptタグを含むか（レンダリングしないが、警告に使う） */
  hasScript: boolean;
  /** Windows/Chrome由来の <!--StartFragment--> を含むか */
  hasFragmentMarker: boolean;
  /** タグ名ごとの出現数（多い順、最大8件） */
  topTags: { name: string; count: number }[];
}

/** HTML文字列を解析せず、正規表現だけでタグ数などの概要を出す。 */
export function summarizeHtml(html: string): HtmlSummary {
  const counts = new Map<string, number>();
  const re = /<([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const name = m[1].toLowerCase();
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  let tags = 0;
  for (const c of counts.values()) tags += c;
  const topTags = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));
  return {
    tags,
    images: counts.get('img') ?? 0,
    links: counts.get('a') ?? 0,
    hasScript: counts.has('script'),
    hasFragmentMarker: /<!--\s*StartFragment\s*-->/i.test(html),
    topTags,
  };
}

/** 有効なJSONなら整形（2スペース）して返す。無効なら null。 */
export function prettyJson(text: string): string | null {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return null;
  }
}

/** text/uri-list を行ごとのURLにする（# で始まるコメント行と空行は除く）。 */
export function parseUriList(text: string): string[] {
  return text
    .split(/\r\n|\r|\n/)
    .map((l) => l.trim())
    .filter((l) => l !== '' && !l.startsWith('#'));
}

export interface ClipEntry {
  type: string;
  kind: 'string' | 'file';
  /** 文字列エントリの内容。ファイルでは undefined */
  text?: string;
  /** ファイル名（ファイルのみ） */
  fileName?: string;
  /** ファイルのバイト数 */
  fileSize?: number;
}

export interface EntryInfo {
  type: string;
  category: MimeCategory;
  kind: 'string' | 'file';
  bytes: number;
}

/** 1エントリの種別・サイズをまとめる。 */
export function describeEntry(e: ClipEntry): EntryInfo {
  const category = classifyMime(e.type);
  const bytes = e.kind === 'file' ? (e.fileSize ?? 0) : utf8Size(e.text ?? '');
  return { type: e.type, category, kind: e.kind, bytes };
}

/** 全エントリをコピー用のテキストレポートにする（ラベルは呼び出し側が渡す）。 */
export function buildReport(
  entries: ClipEntry[],
  labels: { type: string; size: string; file: string },
): string {
  const parts: string[] = [];
  for (const e of entries) {
    const info = describeEntry(e);
    const head = `${labels.type}: ${e.type || '(empty)'}\n${labels.size}: ${formatBytes(info.bytes)} (${info.bytes} B)`;
    if (e.kind === 'file') {
      parts.push(`${head}\n${labels.file}: ${e.fileName ?? ''}`);
    } else {
      parts.push(`${head}\n\n${e.text ?? ''}`);
    }
  }
  return parts.join('\n\n----\n\n');
}
