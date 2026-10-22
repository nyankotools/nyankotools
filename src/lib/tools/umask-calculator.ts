/** 新規ファイルの基準パーミッション（666） */
export const FILE_BASE = 0o666;
/** 新規ディレクトリの基準パーミッション（777） */
export const DIRECTORY_BASE = 0o777;

export type TargetKind = 'file' | 'directory';

export interface ModeInfo {
  /** 数値（0〜0o777） */
  mode: number;
  /** 3桁の8進数文字列（例: "644"） */
  octal: string;
  /** rwx 9文字（例: "rw-r--r--"） */
  symbolic: string;
}

export interface UmaskResult {
  /** umaskの数値（0〜0o777） */
  umask: number;
  /** 3桁の8進数（例: "022"） */
  umaskOctal: string;
  file: ModeInfo;
  directory: ModeInfo;
  /** 例: "umask 022" */
  command: string;
  /** umask -S の出力形式（例: "u=rwx,g=rx,o=rx"） */
  symbolicCommandOutput: string;
}

export interface ReverseResult {
  umask: number;
  umaskOctal: string;
  /** そのumaskで実際に得られるパーミッション */
  achieved: ModeInfo;
  /** 指定されたが、基準（ファイルは666）に含まれないため得られないビット（8進3桁）。無ければ "000" */
  unreachableOctal: string;
  /** unreachableOctal が 000 以外か */
  hasUnreachable: boolean;
}

/**
 * 1〜4桁の8進数文字列をumaskとしてパースする。
 * 4桁の場合は先頭が0のものだけ許可する（特殊権限桁はumaskの計算に影響しないため）。
 * 不正な形式はnull。
 */
export function parseUmask(input: string): number | null {
  const trimmed = input.trim();
  if (!/^[0-7]{1,4}$/.test(trimmed)) return null;
  if (trimmed.length === 4 && trimmed[0] !== '0') return null;
  return parseInt(trimmed, 8);
}

/** 3桁（4桁なら先頭0付き）の8進数文字列を、希望するパーミッションとしてパースする。不正はnull */
export function parseMode(input: string): number | null {
  const trimmed = input.trim();
  if (!/^[0-7]{3,4}$/.test(trimmed)) return null;
  if (trimmed.length === 4 && trimmed[0] !== '0') return null;
  return parseInt(trimmed, 8);
}

export function toOctal3(mode: number): string {
  return (mode & 0o777).toString(8).padStart(3, '0');
}

function triple(digit: number): string {
  return `${digit & 4 ? 'r' : '-'}${digit & 2 ? 'w' : '-'}${digit & 1 ? 'x' : '-'}`;
}

/** 0〜0o777 を "rwxr-xr-x" 形式にする */
export function toSymbolic(mode: number): string {
  const m = mode & 0o777;
  return `${triple((m >> 6) & 7)}${triple((m >> 3) & 7)}${triple(m & 7)}`;
}

function clause(digit: number): string {
  const s = `${digit & 4 ? 'r' : ''}${digit & 2 ? 'w' : ''}${digit & 1 ? 'x' : ''}`;
  return s;
}

/** umask -S 形式（例: "u=rwx,g=rx,o=rx"）にする */
export function toSymbolicClauses(mode: number): string {
  const m = mode & 0o777;
  return `u=${clause((m >> 6) & 7)},g=${clause((m >> 3) & 7)},o=${clause(m & 7)}`;
}

/** 基準パーミッションからumaskのビットを取り除く */
export function applyUmask(umask: number, base: number): number {
  return base & ~umask & 0o777;
}

function modeInfo(mode: number): ModeInfo {
  return { mode, octal: toOctal3(mode), symbolic: toSymbolic(mode) };
}

/** umaskから、新規ファイル・ディレクトリの実効パーミッションを求める */
export function calculateFromUmask(umask: number): UmaskResult {
  const u = umask & 0o777;
  const directory = applyUmask(u, DIRECTORY_BASE);
  return {
    umask: u,
    umaskOctal: toOctal3(u),
    file: modeInfo(applyUmask(u, FILE_BASE)),
    directory: modeInfo(directory),
    command: `umask ${toOctal3(u)}`,
    symbolicCommandOutput: toSymbolicClauses(directory),
  };
}

/**
 * 欲しいパーミッションからumaskを逆算する。
 * ファイルは666、ディレクトリは777を基準にし、その基準から「欲しいパーミッション」に無いビットを
 * マスクするumaskを返す（ファイル644 → 022、ディレクトリ750 → 027）。
 * ファイルに実行権限（x）を指定した場合、umaskでは付与できないため unreachable として返す。
 */
export function reverseUmask(desired: number, kind: TargetKind): ReverseResult {
  const base = kind === 'file' ? FILE_BASE : DIRECTORY_BASE;
  const d = desired & 0o777;
  const umask = base & ~d & 0o777;
  const unreachable = d & ~base & 0o777;
  return {
    umask,
    umaskOctal: toOctal3(umask),
    achieved: modeInfo(applyUmask(umask, base)),
    unreachableOctal: toOctal3(unreachable),
    hasUnreachable: unreachable !== 0,
  };
}
