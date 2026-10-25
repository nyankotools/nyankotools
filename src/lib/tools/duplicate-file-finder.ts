/** 重複ファイル検出の純粋ロジック（サイズ→ハッシュの順に絞り込む） */

/** 1ファイルあたりの上限（SHA-256 計算のため全体をメモリに読み込む） */
export const MAX_FILE_SIZE = 256 * 1024 * 1024;

export interface FileInfo {
  /** 呼び出し側で一意に振る番号 */
  id: number;
  /** 表示用のパス（フォルダ選択時は相対パス） */
  path: string;
  size: number;
}

export interface DuplicateGroup {
  /** SHA-256（小文字16進数） */
  hash: string;
  size: number;
  files: FileInfo[];
  /** 1つだけ残した場合に削減できる容量（size × (件数 − 1)） */
  wastedBytes: number;
}

export interface DuplicateSummary {
  groupCount: number;
  /** 重複グループに含まれるファイルの総数 */
  fileCount: number;
  wastedBytes: number;
}

/** 同じサイズのファイルが2件以上あるグループだけを返す（ハッシュ計算の対象を絞る） */
export function groupBySize(files: FileInfo[]): FileInfo[][] {
  const bySize = new Map<number, FileInfo[]>();
  for (const file of files) {
    const list = bySize.get(file.size);
    if (list) list.push(file);
    else bySize.set(file.size, [file]);
  }
  return [...bySize.values()].filter((list) => list.length >= 2);
}

/** 同サイズ候補のうち、ハッシュ計算が必要なファイルの一覧 */
export function filesToHash(files: FileInfo[]): FileInfo[] {
  return groupBySize(files).flat();
}

/**
 * サイズとハッシュが一致するファイルを重複グループにまとめる。
 * ハッシュが無いファイル（読み込み失敗など）は対象外。無駄容量の大きい順に並べる。
 */
export function buildDuplicateGroups(
  files: FileInfo[],
  hashes: ReadonlyMap<number, string>,
): DuplicateGroup[] {
  const byKey = new Map<string, DuplicateGroup>();
  for (const file of files) {
    const hash = hashes.get(file.id);
    if (!hash) continue;
    const key = `${file.size}:${hash}`;
    const group = byKey.get(key);
    if (group) group.files.push(file);
    else {
      byKey.set(key, { hash, size: file.size, files: [file], wastedBytes: 0 });
    }
  }
  const groups = [...byKey.values()].filter((g) => g.files.length >= 2);
  for (const group of groups) {
    group.wastedBytes = group.size * (group.files.length - 1);
  }
  return groups.sort(
    (a, b) =>
      b.wastedBytes - a.wastedBytes ||
      b.files.length - a.files.length ||
      a.hash.localeCompare(b.hash),
  );
}

export function summarizeGroups(groups: DuplicateGroup[]): DuplicateSummary {
  return {
    groupCount: groups.length,
    fileCount: groups.reduce((sum, g) => sum + g.files.length, 0),
    wastedBytes: groups.reduce((sum, g) => sum + g.wastedBytes, 0),
  };
}

/** バイト数を 1024 区切りの短い表記にする（例: 1.5 MB） */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unit = 0;
  // 丸めた結果が1024に達するときも次の単位へ繰り上げる
  const rounded = (v: number) => Number(v.toFixed(v >= 100 ? 0 : 1));
  while (rounded(value) >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const text = unit === 0 ? String(value) : value.toFixed(value >= 100 ? 0 : 1);
  return `${text.replace(/\.0$/, '')} ${units[unit]}`;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** SHA-256 を小文字16進数で返す */
export async function sha256Hex(
  data: Uint8Array<ArrayBuffer>,
): Promise<string> {
  return toHex(new Uint8Array(await crypto.subtle.digest('SHA-256', data)));
}

function csvCell(value: string): string {
  // 表計算ソフトで式として解釈されないよう、先頭の記号を無効化する
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

/** グループ番号・サイズ・ハッシュ・パスのCSV（ヘッダ行は呼び出し側から渡す） */
export function groupsToCsv(
  groups: DuplicateGroup[],
  header: [string, string, string, string],
): string {
  const rows = [header.map(csvCell).join(',')];
  groups.forEach((group, index) => {
    for (const file of group.files) {
      rows.push(
        [String(index + 1), String(group.size), group.hash, file.path]
          .map(csvCell)
          .join(','),
      );
    }
  });
  return rows.join('\r\n');
}

/** コピー用のテキスト。グループごとに空行で区切り、1行1パス */
export function groupsToText(
  groups: DuplicateGroup[],
  groupTitle: (index: number, group: DuplicateGroup) => string,
): string {
  return groups
    .map((group, index) =>
      [groupTitle(index + 1, group), ...group.files.map((f) => f.path)].join(
        '\n',
      ),
    )
    .join('\n\n');
}
