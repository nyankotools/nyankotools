/**
 * 字幕（SRT / WebVTT）の相互変換・時間ずらし・フレームレート補正・文字コード判定のロジック。
 * UI の文言は持たない。
 */

export type SubtitleFormat = 'srt' | 'vtt';
export type SubtitleEncoding = 'auto' | 'utf-8' | 'shift_jis';

export interface Cue {
  /** 開始時刻（ミリ秒） */
  start: number;
  /** 終了時刻（ミリ秒） */
  end: number;
  /** 字幕本文（改行は \n） */
  text: string;
  /** VTT の識別子（SRT の連番は保持しない） */
  id?: string;
  /** VTT の位置指定などの設定文字列（"line:90% align:center" など） */
  settings?: string;
}

export interface ParseResult {
  format: SubtitleFormat;
  cues: Cue[];
  /** タイムコード行を解釈できなかったブロック数 */
  skipped: number;
}

export const FRAME_RATES = [23.976, 24, 25, 29.97, 30] as const;

const TIME_PART = String.raw`(?:(\d{1,3}):)?(\d{1,2}):(\d{2})[,.](\d{1,3})`;
const TIMING_RE = new RegExp(
  String.raw`^\s*${TIME_PART}\s*-->\s*(?:(\d{1,3}):)?(\d{1,2}):(\d{2})[,.](\d{1,3})(?:\s+(.*))?$`,
);

function toMs(h: string | undefined, m: string, s: string, ms: string): number {
  return (
    (Number(h ?? 0) * 3600 + Number(m) * 60 + Number(s)) * 1000 +
    Number(ms.padEnd(3, '0'))
  );
}

/** 先頭の BOM と改行コードを整える */
export function normalizeText(text: string): string {
  return text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
}

/** 字幕テキストを解析する。WEBVTT ヘッダがあれば VTT、なければ SRT とみなす */
export function parseSubtitle(input: string): ParseResult {
  const text = normalizeText(input);
  const format: SubtitleFormat = /^WEBVTT(?:[ \t\n]|$)/.test(text)
    ? 'vtt'
    : 'srt';
  const blocks = text.split(/\n(?:[ \t]*\n)+/);
  const cues: Cue[] = [];
  let skipped = 0;

  blocks.forEach((raw, index) => {
    const lines = raw.split('\n');
    // 先頭の空行を除く
    while (lines.length > 0 && lines[0].trim() === '') lines.shift();
    if (lines.length === 0) return;
    if (index === 0 && format === 'vtt' && lines[0].startsWith('WEBVTT')) {
      // ヘッダ直後にタイムコードが続くブロックは稀なので、ヘッダのみのブロックとして捨てる
      const rest = lines.slice(1).some((l) => l.includes('-->'));
      if (!rest) return;
      lines.shift();
    }
    if (/^(NOTE|STYLE|REGION)(\s|$)/.test(lines[0])) return;

    const timingIndex = lines.findIndex((l) => l.includes('-->'));
    if (timingIndex < 0 || timingIndex > 1) {
      skipped++;
      return;
    }
    const m = TIMING_RE.exec(lines[timingIndex]);
    if (!m) {
      skipped++;
      return;
    }
    const start = toMs(m[1], m[2], m[3], m[4]);
    const end = toMs(m[5], m[6], m[7], m[8]);
    const cue: Cue = {
      start,
      end,
      text: lines
        .slice(timingIndex + 1)
        .join('\n')
        .replace(/\s+$/, ''),
    };
    if (timingIndex === 1) {
      const id = lines[0].trim();
      // SRT の連番は出力時に振り直す
      if (id !== '' && !/^\d+$/.test(id)) cue.id = id;
    }
    if (m[9] && m[9].trim() !== '') cue.settings = m[9].trim();
    cues.push(cue);
  });

  return { format, cues, skipped };
}

function pad(n: number, width: number): string {
  return String(n).padStart(width, '0');
}

/** ミリ秒を `HH:MM:SS<sep>mmm` にする（負数は 0 扱い） */
export function formatTimestamp(ms: number, separator: ',' | '.'): string {
  const total = Math.max(0, Math.round(ms));
  const h = Math.floor(total / 3600000);
  const m = Math.floor((total % 3600000) / 60000);
  const s = Math.floor((total % 60000) / 1000);
  return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)}${separator}${pad(total % 1000, 3)}`;
}

export function serializeSrt(cues: Cue[]): string {
  return cues
    .map(
      (c, i) =>
        `${i + 1}\n${formatTimestamp(c.start, ',')} --> ${formatTimestamp(c.end, ',')}\n${c.text}`,
    )
    .join('\n\n')
    .concat(cues.length > 0 ? '\n' : '');
}

export function serializeVtt(cues: Cue[]): string {
  const body = cues
    .map((c) => {
      // SRT の座標指定（X1:… や {\an8}）は VTT の cue 設定ではないので、VTT 形式のものだけ残す
      const settings = (c.settings ?? '')
        .split(/\s+/)
        .filter((t) =>
          /^(vertical|line|position|size|align|region):\S+$/.test(t),
        )
        .join(' ');
      const timing = `${formatTimestamp(c.start, '.')} --> ${formatTimestamp(c.end, '.')}${settings ? ` ${settings}` : ''}`;
      return `${c.id ? `${c.id}\n` : ''}${timing}\n${c.text}`;
    })
    .join('\n\n');
  return cues.length > 0 ? `WEBVTT\n\n${body}\n` : 'WEBVTT\n';
}

export function serializeSubtitle(cues: Cue[], format: SubtitleFormat): string {
  return format === 'srt' ? serializeSrt(cues) : serializeVtt(cues);
}

/**
 * 全体の時間をずらす（offsetMs が正なら遅らせる）。
 * 終了時刻が 0 以下になった字幕は削除し、開始が負になった字幕は 0 に切り上げる。
 */
export function shiftCues(cues: Cue[], offsetMs: number): Cue[] {
  if (offsetMs === 0) return cues.map((c) => ({ ...c }));
  const out: Cue[] = [];
  for (const c of cues) {
    const end = Math.round(c.end + offsetMs);
    if (end <= 0) continue;
    out.push({ ...c, start: Math.max(0, Math.round(c.start + offsetMs)), end });
  }
  return out;
}

/**
 * フレームレートの違いによる時間のずれを補正する。
 * 字幕が `fromFps` の映像用で、`toFps` の映像に合わせたいときの時刻倍率は fromFps / toFps。
 */
export function convertFrameRate(
  cues: Cue[],
  fromFps: number,
  toFps: number,
): Cue[] {
  if (!(fromFps > 0) || !(toFps > 0)) throw new Error('invalid fps');
  const factor = fromFps / toFps;
  return cues.map((c) => ({
    ...c,
    start: Math.round(c.start * factor),
    end: Math.round(c.end * factor),
  }));
}

export type NumberParse =
  { ok: true; value: number } | { ok: false; error: 'invalid' | 'outOfRange' };

/** 全角数字・全角記号を半角にして数値化する */
function parseNumber(input: string): number | null {
  const normalized = input
    .trim()
    .replace(/[０-９．－＋]/g, (c) =>
      c === '．'
        ? '.'
        : c === '－'
          ? '-'
          : c === '＋'
            ? '+'
            : String.fromCharCode(c.charCodeAt(0) - 0xfee0),
    );
  if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(normalized)) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export const MAX_OFFSET_SECONDS = 86400;

/** 秒単位の入力（小数・符号可）をミリ秒にする。空欄は 0 */
export function parseOffsetSeconds(input: string): NumberParse {
  if (input.trim() === '') return { ok: true, value: 0 };
  const n = parseNumber(input);
  if (n === null) return { ok: false, error: 'invalid' };
  if (Math.abs(n) > MAX_OFFSET_SECONDS) {
    return { ok: false, error: 'outOfRange' };
  }
  return { ok: true, value: Math.round(n * 1000) };
}

/* ------------------------------ 文字コード ------------------------------ */

export interface DecodeResult {
  text: string;
  /** 実際に使った文字コード */
  encoding: 'utf-8' | 'shift_jis' | 'utf-16le' | 'utf-16be';
  /** デコードできず U+FFFD に置き換わった文字の数 */
  invalidCount: number;
}

function countReplacement(text: string): number {
  let n = 0;
  for (const ch of text) if (ch === '�') n++;
  return n;
}

/** バイト列を字幕テキストにする。`auto` は BOM → UTF-8（厳密）→ Shift_JIS の順に判定 */
export function decodeSubtitleBytes(
  bytes: Uint8Array,
  encoding: SubtitleEncoding = 'auto',
): DecodeResult {
  if (encoding === 'auto') {
    if (bytes[0] === 0xff && bytes[1] === 0xfe) {
      return decodeWith(bytes, 'utf-16le');
    }
    if (bytes[0] === 0xfe && bytes[1] === 0xff) {
      return decodeWith(bytes, 'utf-16be');
    }
    try {
      const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      return { text, encoding: 'utf-8', invalidCount: 0 };
    } catch {
      return decodeWith(bytes, 'shift_jis');
    }
  }
  return decodeWith(bytes, encoding);
}

function decodeWith(
  bytes: Uint8Array,
  encoding: DecodeResult['encoding'],
): DecodeResult {
  const text = new TextDecoder(encoding).decode(bytes);
  return { text, encoding, invalidCount: countReplacement(text) };
}

/* ------------------------------ 補助 ------------------------------ */

/** 出力ファイル名（拡張子を目的の形式に置き換える） */
export function buildOutputFileName(
  originalName: string,
  format: SubtitleFormat,
): string {
  const base = originalName.replace(/\.[^./\\]+$/, '') || 'subtitle';
  return `${base}.${format}`;
}
