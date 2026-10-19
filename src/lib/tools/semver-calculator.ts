/**
 * セマンティックバージョン（semver 2.0.0）の解析・比較と、npm 形式の範囲式の判定。
 * npm の node-semver の挙動（caret / tilde / x-range / ハイフン範囲 / `||` / prerelease の扱い）に準拠して自前実装する。
 * looseモードは扱わない（"1.2" のような不完全なバージョンは範囲式の中でのみ許可）。
 */

export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  /** 数値識別子は number、英数字識別子は string */
  prerelease: (string | number)[];
  build: string[];
}

export type ComparatorOp = '<' | '<=' | '>' | '>=' | '=';

export interface Comparator {
  /** 任意のバージョンに一致（`*` / `x` / 空文字） */
  any: boolean;
  op: ComparatorOp;
  version: SemVer;
}

export interface SemverRange {
  /** `||` で区切られたOR条件。各要素はAND条件の比較子の列 */
  sets: Comparator[][];
}

export interface SatisfiesOptions {
  /** true なら prerelease 付きバージョンも通常のバージョンと同様に範囲判定する */
  includePrerelease?: boolean;
}

const NUM = '0|[1-9]\\d*';
const PRE_ID = '(?:0|[1-9]\\d*|\\d*[A-Za-z-][0-9A-Za-z-]*)';
const BUILD_ID = '[0-9A-Za-z-]+';
const PRE = `(?:-(${PRE_ID}(?:\\.${PRE_ID})*))`;
const BUILD = `(?:\\+(${BUILD_ID}(?:\\.${BUILD_ID})*))`;

const FULL_RE = new RegExp(
  `^[v=]*\\s*(${NUM})\\.(${NUM})\\.(${NUM})${PRE}?${BUILD}?$`,
);
const X = '[xX*]';
const PARTIAL_RE = new RegExp(
  `^[v=]*\\s*(${NUM}|${X})(?:\\.(${NUM}|${X})(?:\\.(${NUM}|${X})${PRE}?${BUILD}?)?)?$`,
);

const MAX_SAFE = Number.MAX_SAFE_INTEGER;

function toIdentifiers(pre: string | undefined): (string | number)[] {
  if (!pre) return [];
  return pre.split('.').map((id) => (/^\d+$/.test(id) ? Number(id) : id));
}

function makeVersion(
  major: number,
  minor: number,
  patch: number,
  prerelease: (string | number)[] = [],
  build: string[] = [],
): SemVer {
  return { major, minor, patch, prerelease, build };
}

/** バージョン文字列をパースする。先頭の "v" / "=" と前後の空白は許容。不正な形式は null */
export function parseVersion(input: string): SemVer | null {
  const m = FULL_RE.exec(input.trim());
  if (!m) return null;
  const major = Number(m[1]);
  const minor = Number(m[2]);
  const patch = Number(m[3]);
  if (major > MAX_SAFE || minor > MAX_SAFE || patch > MAX_SAFE) return null;
  const prerelease = toIdentifiers(m[4]);
  if (prerelease.some((id) => typeof id === 'number' && id > MAX_SAFE)) {
    return null;
  }
  return makeVersion(
    major,
    minor,
    patch,
    prerelease,
    m[5] ? m[5].split('.') : [],
  );
}

/** 正規化したバージョン文字列（"v" を除去。build メタデータは残す） */
export function formatVersion(v: SemVer): string {
  let s = `${v.major}.${v.minor}.${v.patch}`;
  if (v.prerelease.length > 0) s += `-${v.prerelease.join('.')}`;
  if (v.build.length > 0) s += `+${v.build.join('.')}`;
  return s;
}

function compareIdentifiers(a: string | number, b: string | number): number {
  const aNum = typeof a === 'number';
  const bNum = typeof b === 'number';
  if (aNum && bNum) return a === b ? 0 : a < b ? -1 : 1;
  // 数値識別子は英数字識別子より常に小さい
  if (aNum) return -1;
  if (bNum) return 1;
  return a === b ? 0 : a < b ? -1 : 1;
}

function comparePrerelease(a: SemVer, b: SemVer): number {
  // prerelease が無い方が大きい
  if (a.prerelease.length === 0 && b.prerelease.length === 0) return 0;
  if (a.prerelease.length === 0) return 1;
  if (b.prerelease.length === 0) return -1;
  const len = Math.max(a.prerelease.length, b.prerelease.length);
  for (let i = 0; i < len; i++) {
    const x = a.prerelease[i];
    const y = b.prerelease[i];
    if (x === undefined && y === undefined) return 0;
    // 識別子が少ない方が小さい
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    const c = compareIdentifiers(x, y);
    if (c !== 0) return c;
  }
  return 0;
}

/** 優先順位の比較（build メタデータは無視）。a<b なら -1、等しければ 0、a>b なら 1 */
export function compareVersions(a: SemVer, b: SemVer): -1 | 0 | 1 {
  if (a.major !== b.major) return a.major < b.major ? -1 : 1;
  if (a.minor !== b.minor) return a.minor < b.minor ? -1 : 1;
  if (a.patch !== b.patch) return a.patch < b.patch ? -1 : 1;
  const c = comparePrerelease(a, b);
  return c < 0 ? -1 : c > 0 ? 1 : 0;
}

export type VersionDiff = 'same' | 'major' | 'minor' | 'patch' | 'prerelease';

/** 2つのバージョンのどの桁が異なるか（build は無視）。最も上位の差異を返す */
export function diffVersions(a: SemVer, b: SemVer): VersionDiff {
  if (compareVersions(a, b) === 0) return 'same';
  if (a.major !== b.major) return 'major';
  if (a.minor !== b.minor) return 'minor';
  if (a.patch !== b.patch) return 'patch';
  return 'prerelease';
}

// ---------------------------------------------------------------- 範囲式

const ANY_VERSION = makeVersion(0, 0, 0);

function anyComparator(): Comparator {
  return { any: true, op: '>=', version: ANY_VERSION };
}

function cmp(op: ComparatorOp, version: SemVer): Comparator {
  return { any: false, op, version };
}

/** `<X.Y.Z-0`（X.Y.Z 系列のどの prerelease も含まない上限）を作る */
function upperExclusive(
  major: number,
  minor: number,
  patch: number,
): Comparator {
  return cmp('<', makeVersion(major, minor, patch, [0]));
}

interface PartialVersion {
  /** null は x ワイルドカード（または省略） */
  major: number | null;
  minor: number | null;
  patch: number | null;
  prerelease: (string | number)[];
}

function parsePartial(input: string): PartialVersion | null {
  const m = PARTIAL_RE.exec(input.trim());
  if (!m) return null;
  const part = (s: string | undefined): number | null | undefined => {
    if (s === undefined) return null;
    if (/^[xX*]$/.test(s)) return null;
    const n = Number(s);
    return n > MAX_SAFE ? undefined : n;
  };
  const major = part(m[1]);
  const minor = part(m[2]);
  const patch = part(m[3]);
  if (major === undefined || minor === undefined || patch === undefined) {
    return null;
  }
  // x の右側は全て x 扱い（"1.x.3" は "1.x.x" と同じ）
  const prerelease = toIdentifiers(m[4]);
  if (major === null)
    return { major: null, minor: null, patch: null, prerelease: [] };
  if (minor === null)
    return { major, minor: null, patch: null, prerelease: [] };
  if (patch === null) return { major, minor, patch: null, prerelease: [] };
  return { major, minor, patch, prerelease };
}

function partialToVersion(p: PartialVersion & { major: number }): SemVer {
  return makeVersion(p.major, p.minor ?? 0, p.patch ?? 0, p.prerelease);
}

function parseTilde(body: string): Comparator[] | null {
  const p = parsePartial(body);
  if (!p) return null;
  if (p.major === null) return [anyComparator()];
  if (p.minor === null) {
    return [
      cmp('>=', makeVersion(p.major, 0, 0)),
      upperExclusive(p.major + 1, 0, 0),
    ];
  }
  return [
    cmp('>=', partialToVersion({ ...p, major: p.major })),
    upperExclusive(p.major, p.minor + 1, 0),
  ];
}

function parseCaret(body: string): Comparator[] | null {
  const p = parsePartial(body);
  if (!p) return null;
  if (p.major === null) return [anyComparator()];
  const major = p.major;
  if (p.minor === null) {
    return [
      cmp('>=', makeVersion(major, 0, 0)),
      upperExclusive(major + 1, 0, 0),
    ];
  }
  const minor = p.minor;
  if (p.patch === null) {
    if (major === 0) {
      return [
        cmp('>=', makeVersion(0, minor, 0)),
        upperExclusive(0, minor + 1, 0),
      ];
    }
    return [
      cmp('>=', makeVersion(major, minor, 0)),
      upperExclusive(major + 1, 0, 0),
    ];
  }
  const lower = cmp('>=', makeVersion(major, minor, p.patch, p.prerelease));
  if (major !== 0) return [lower, upperExclusive(major + 1, 0, 0)];
  if (minor !== 0) return [lower, upperExclusive(0, minor + 1, 0)];
  return [lower, upperExclusive(0, 0, p.patch + 1)];
}

const COMPARATOR_RE = /^(<=|>=|<|>|=)?(.*)$/;

function parseXRange(token: string): Comparator[] | null {
  const m = COMPARATOR_RE.exec(token);
  if (!m) return null;
  let op = m[1] ?? '';
  const p = parsePartial(m[2]);
  if (!p) return null;
  if (op === '=') op = '';

  if (p.major === null) {
    // "*" / "x"。">*" や "<*" は何にも一致しない
    if (op === '>' || op === '<') return [upperExclusive(0, 0, 0)];
    return [anyComparator()];
  }
  const hasX = p.minor === null || p.patch === null;
  if (op !== '' && hasX) {
    let major = p.major;
    let minor = p.minor ?? 0;
    const xMinor = p.minor === null;
    if (op === '>') {
      if (xMinor) {
        major += 1;
        minor = 0;
      } else {
        minor += 1;
      }
      return [cmp('>=', makeVersion(major, minor, 0))];
    }
    if (op === '<=') {
      return xMinor
        ? [upperExclusive(major + 1, 0, 0)]
        : [upperExclusive(major, minor + 1, 0)];
    }
    if (op === '<') return [upperExclusive(major, minor, 0)];
    // ">="
    return [cmp('>=', makeVersion(major, minor, 0))];
  }
  if (p.minor === null) {
    return [
      cmp('>=', makeVersion(p.major, 0, 0)),
      upperExclusive(p.major + 1, 0, 0),
    ];
  }
  if (p.patch === null) {
    return [
      cmp('>=', makeVersion(p.major, p.minor, 0)),
      upperExclusive(p.major, p.minor + 1, 0),
    ];
  }
  const version = makeVersion(p.major, p.minor, p.patch, p.prerelease);
  return [cmp((op || '=') as ComparatorOp, version)];
}

function parseComparatorToken(token: string): Comparator[] | null {
  if (token === '' || token === '*') return [anyComparator()];
  if (token.startsWith('~>')) return parseTilde(token.slice(2));
  if (token.startsWith('~')) return parseTilde(token.slice(1));
  if (token.startsWith('^')) return parseCaret(token.slice(1));
  return parseXRange(token);
}

function parseHyphen(fromRaw: string, toRaw: string): Comparator[] | null {
  const from = parsePartial(fromRaw);
  const to = parsePartial(toRaw);
  if (!from || !to) return null;
  const result: Comparator[] = [];

  if (from.major !== null) {
    result.push(cmp('>=', partialToVersion({ ...from, major: from.major })));
  }
  if (to.major !== null) {
    if (to.minor === null) {
      result.push(upperExclusive(to.major + 1, 0, 0));
    } else if (to.patch === null) {
      result.push(upperExclusive(to.major, to.minor + 1, 0));
    } else {
      result.push(
        cmp('<=', makeVersion(to.major, to.minor, to.patch, to.prerelease)),
      );
    }
  }
  return result.length === 0 ? [anyComparator()] : result;
}

function parseComparatorSet(input: string): Comparator[] | null {
  // 演算子と版の間の空白を詰める（">= 1.2.3" → ">=1.2.3"）
  const normalized = input.trim().replace(/(~>|<=|>=|[<>=~^])\s+/g, '$1');
  if (normalized === '') return [anyComparator()];
  const tokens = normalized.split(/\s+/);
  const result: Comparator[] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i + 1] === '-' && i + 2 < tokens.length) {
      const hy = parseHyphen(tokens[i], tokens[i + 2]);
      if (!hy) return null;
      result.push(...hy);
      i += 2;
      continue;
    }
    const cs = parseComparatorToken(tokens[i]);
    if (!cs) return null;
    result.push(...cs);
  }
  // 条件の中に any 以外があれば any は不要
  const concrete = result.filter((c) => !c.any);
  return concrete.length > 0 ? concrete : [anyComparator()];
}

/** npm 形式の範囲式をパースする。不正な式は null。空文字は `*`（すべて）扱い */
export function parseRange(input: string): SemverRange | null {
  const sets: Comparator[][] = [];
  for (const part of input.split('||')) {
    const set = parseComparatorSet(part);
    if (!set) return null;
    sets.push(set);
  }
  return { sets };
}

/** 範囲式を比較子に展開した正規形の文字列にする（例: "^1.2.3" → ">=1.2.3 <2.0.0-0"） */
export function formatRange(range: SemverRange): string {
  return range.sets
    .map((set) =>
      set
        .map((c) =>
          c.any
            ? '*'
            : `${c.op === '=' ? '' : c.op}${formatVersion(c.version)}`,
        )
        .join(' '),
    )
    .join(' || ');
}

function testComparator(c: Comparator, v: SemVer): boolean {
  if (c.any) return true;
  const r = compareVersions(v, c.version);
  switch (c.op) {
    case '<':
      return r < 0;
    case '<=':
      return r <= 0;
    case '>':
      return r > 0;
    case '>=':
      return r >= 0;
    default:
      return r === 0;
  }
}

function setMatches(
  set: Comparator[],
  v: SemVer,
  includePrerelease: boolean,
): boolean {
  if (!set.every((c) => testComparator(c, v))) return false;
  if (v.prerelease.length === 0 || includePrerelease) return true;
  // prerelease 付きは、同じ major.minor.patch の prerelease 付き比較子が範囲内にある場合のみ許可
  return set.some(
    (c) =>
      !c.any &&
      c.version.prerelease.length > 0 &&
      c.version.major === v.major &&
      c.version.minor === v.minor &&
      c.version.patch === v.patch,
  );
}

/** バージョンが範囲を満たすか */
export function satisfies(
  version: SemVer,
  range: SemverRange,
  options: SatisfiesOptions = {},
): boolean {
  const include = options.includePrerelease === true;
  return range.sets.some((set) => setMatches(set, version, include));
}

// ---------------------------------------------------------------- 一括判定

export interface VersionRow {
  /** 入力行（トリム済み） */
  input: string;
  /** パース成功時のみ */
  version: SemVer | null;
  /** 正規化文字列（パース失敗時は空） */
  normalized: string;
  /** 範囲が不正または版が不正のとき null */
  matches: boolean | null;
}

export type SortOrder = 'input' | 'asc' | 'desc';

export interface VersionListResult {
  /** 範囲式が不正な場合 true（rows の matches は全て null） */
  rangeInvalid: boolean;
  rangeNormalized: string;
  rows: VersionRow[];
  /** 範囲を満たす最大・最小のバージョン（無ければ null） */
  highestMatch: string | null;
  lowestMatch: string | null;
}

/** 改行区切りのバージョン一覧を範囲式で判定し、指定順に並べる。空行は無視する */
export function evaluateVersionList(
  text: string,
  rangeInput: string,
  options: SatisfiesOptions & { sort?: SortOrder } = {},
): VersionListResult {
  const range = parseRange(rangeInput);
  const rows: VersionRow[] = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .map((input) => {
      const version = parseVersion(input);
      return {
        input,
        version,
        normalized: version ? formatVersion(version) : '',
        matches: version && range ? satisfies(version, range, options) : null,
      };
    });

  const sort = options.sort ?? 'input';
  if (sort !== 'input') {
    const dir = sort === 'asc' ? 1 : -1;
    // 配列のsortは安定ソート。不正な行は末尾に寄せる
    rows.sort((a, b) => {
      if (!a.version && !b.version) return 0;
      if (!a.version) return 1;
      if (!b.version) return -1;
      return compareVersions(a.version, b.version) * dir;
    });
  }

  const matched = rows
    .filter((r) => r.matches === true && r.version)
    .map((r) => r.version as SemVer)
    .sort(compareVersions);

  return {
    rangeInvalid: range === null,
    rangeNormalized: range ? formatRange(range) : '',
    rows,
    highestMatch:
      matched.length > 0 ? formatVersion(matched[matched.length - 1]) : null,
    lowestMatch: matched.length > 0 ? formatVersion(matched[0]) : null,
  };
}
