import { formatIPv4, parseIPv4 } from './cidr-calculator';

export type IpInputFormat =
  | 'ipv4-dotted'
  | 'ipv4-decimal'
  | 'ipv4-hex'
  | 'ipv4-binary'
  | 'ipv4-binary-dotted'
  | 'ipv6';

export type IpType =
  | 'unspecified'
  | 'loopback'
  | 'private'
  | 'shared'
  | 'link-local'
  | 'unique-local'
  | 'multicast'
  | 'reserved'
  | 'broadcast'
  | 'documentation'
  | 'ipv4-mapped'
  | 'public';

/** 結果の行キー。表示ラベルは辞書側で対応づける */
export type IpRowKey =
  | 'ipv4'
  | 'decimal'
  | 'hex'
  | 'binary'
  | 'ipv4-mapped-ipv6'
  | 'ipv6-compressed'
  | 'ipv6-expanded'
  | 'ipv6-full'
  | 'ipv6-embedded-ipv4';

export interface IpRow {
  key: IpRowKey;
  value: string;
}

export interface IpConversion {
  version: 4 | 6;
  inputFormat: IpInputFormat;
  type: IpType;
  rows: IpRow[];
}

const UINT32_MAX = 0xffffffff;

/** 32bit整数をドット区切り2進（8bitごと）に変換する */
export function ipv4ToBinaryDotted(value: number): string {
  return [24, 16, 8, 0]
    .map((shift) => (((value >>> shift) & 0xff) | 0x100).toString(2).slice(1))
    .join('.');
}

/** 32bit整数を "0xC0A80101" 形式に変換する（8桁ゼロ埋め・大文字） */
export function ipv4ToHex(value: number): string {
  return '0x' + (value >>> 0).toString(16).toUpperCase().padStart(8, '0');
}

interface ParsedIPv4 {
  value: number;
  format: IpInputFormat;
}

/** IPv4を、ドット10進・10進整数・16進(0x)・2進(32桁/0b/ドット区切り)の各表記から読み取る */
export function parseIPv4Flexible(input: string): ParsedIPv4 | null {
  const s = input.trim();
  if (s === '') return null;

  const dotted = parseIPv4(s);
  if (dotted !== null) return { value: dotted, format: 'ipv4-dotted' };

  if (/^0[xX][0-9a-fA-F]{1,8}$/.test(s)) {
    return { value: parseInt(s.slice(2), 16) >>> 0, format: 'ipv4-hex' };
  }

  if (/^0[bB][01]{1,32}$/.test(s)) {
    return { value: parseInt(s.slice(2), 2) >>> 0, format: 'ipv4-binary' };
  }

  if (/^[01]{32}$/.test(s)) {
    return { value: parseInt(s, 2) >>> 0, format: 'ipv4-binary' };
  }

  const parts = s.split('.');
  if (parts.length === 4 && parts.every((p) => /^[01]{8}$/.test(p))) {
    let v = 0;
    for (const p of parts) v = v * 256 + parseInt(p, 2);
    return { value: v >>> 0, format: 'ipv4-binary-dotted' };
  }

  if (/^\d{1,10}$/.test(s)) {
    const n = Number(s);
    if (n > UINT32_MAX) return null;
    return { value: n, format: 'ipv4-decimal' };
  }

  return null;
}

/** IPv6文字列を16bit×8の配列に読み取る。末尾のIPv4埋め込み表記・[]囲みに対応。ゾーンIDは非対応 */
export function parseIPv6(input: string): number[] | null {
  let s = input.trim();
  if (s.startsWith('[') && s.endsWith(']')) s = s.slice(1, -1);
  if (!s.includes(':') || /[%/\s]/.test(s) || s.includes(':::')) return null;

  const lastColon = s.lastIndexOf(':');
  const tail = s.slice(lastColon + 1);
  if (tail.includes('.')) {
    const v4 = parseIPv4(tail);
    if (v4 === null) return null;
    const hi = (v4 >>> 16).toString(16);
    const lo = (v4 & 0xffff).toString(16);
    s = `${s.slice(0, lastColon + 1)}${hi}:${lo}`;
  }

  const doubleIndex = s.indexOf('::');
  if (doubleIndex !== s.lastIndexOf('::')) return null;

  const toGroups = (part: string): number[] | null => {
    if (part === '') return [];
    const out: number[] = [];
    for (const g of part.split(':')) {
      if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
      out.push(parseInt(g, 16));
    }
    return out;
  };

  if (doubleIndex === -1) {
    const groups = toGroups(s);
    return groups && groups.length === 8 ? groups : null;
  }

  const head = toGroups(s.slice(0, doubleIndex));
  const rest = toGroups(s.slice(doubleIndex + 2));
  if (!head || !rest) return null;
  const missing = 8 - head.length - rest.length;
  if (missing < 1) return null;
  return [...head, ...new Array<number>(missing).fill(0), ...rest];
}

/** RFC 5952 に従った短縮表記（最長のゼロ連続を "::" に、同長なら先頭側。小文字） */
export function compressIPv6(groups: number[]): string {
  let bestStart = -1;
  let bestLen = 0;
  let i = 0;
  while (i < 8) {
    if (groups[i] === 0) {
      let j = i;
      while (j < 8 && groups[j] === 0) j++;
      if (j - i > bestLen) {
        bestStart = i;
        bestLen = j - i;
      }
      i = j;
    } else {
      i++;
    }
  }
  const hex = groups.map((g) => g.toString(16));
  if (bestLen < 2) return hex.join(':');
  const left = hex.slice(0, bestStart).join(':');
  const right = hex.slice(bestStart + bestLen).join(':');
  return `${left}::${right}`;
}

/** ゼロ埋めなしで8グループすべてを書いた展開表記 */
export function expandIPv6(groups: number[]): string {
  return groups.map((g) => g.toString(16)).join(':');
}

/** 各グループを4桁にゼロ埋めした完全展開表記 */
export function fullIPv6(groups: number[]): string {
  return groups.map((g) => g.toString(16).padStart(4, '0')).join(':');
}

/** IPv6を128bit整数（10進文字列）に変換する */
export function ipv6ToDecimal(groups: number[]): string {
  let n = BigInt(0);
  for (const g of groups) n = (n << BigInt(16)) | BigInt(g);
  return n.toString(10);
}

function ipv4Type(v: number): IpType {
  const a = v >>> 24;
  const b = (v >>> 16) & 0xff;
  if (v === 0) return 'unspecified';
  if (v === UINT32_MAX) return 'broadcast';
  if (a === 127) return 'loopback';
  if (a === 10) return 'private';
  if (a === 172 && b >= 16 && b <= 31) return 'private';
  if (a === 192 && b === 168) return 'private';
  if (a === 100 && b >= 64 && b <= 127) return 'shared';
  if (a === 169 && b === 254) return 'link-local';
  if (a >= 224 && a <= 239) return 'multicast';
  if (a >= 240) return 'reserved';
  if (a === 0) return 'reserved';
  if (a === 192 && b === 0 && ((v >>> 8) & 0xff) === 2) return 'documentation';
  if (a === 198 && b === 51 && ((v >>> 8) & 0xff) === 100)
    return 'documentation';
  if (a === 203 && b === 0 && ((v >>> 8) & 0xff) === 113)
    return 'documentation';
  return 'public';
}

function isMappedV4(groups: number[]): boolean {
  return groups.slice(0, 5).every((g) => g === 0) && groups[5] === 0xffff;
}

function ipv6Type(groups: number[]): IpType {
  const allZeroUpTo = (n: number) => groups.slice(0, n).every((g) => g === 0);
  if (allZeroUpTo(8)) return 'unspecified';
  if (allZeroUpTo(7) && groups[7] === 1) return 'loopback';
  if (isMappedV4(groups)) return 'ipv4-mapped';
  const first = groups[0];
  if ((first & 0xffc0) === 0xfe80) return 'link-local';
  if ((first & 0xfe00) === 0xfc00) return 'unique-local';
  if ((first & 0xff00) === 0xff00) return 'multicast';
  if (first === 0x2001 && groups[1] === 0x0db8) return 'documentation';
  return 'public';
}

function fromIPv4(parsed: ParsedIPv4): IpConversion {
  const v = parsed.value;
  const hi = (v >>> 16).toString(16);
  const lo = (v & 0xffff).toString(16);
  return {
    version: 4,
    inputFormat: parsed.format,
    type: ipv4Type(v),
    rows: [
      { key: 'ipv4', value: formatIPv4(v) },
      { key: 'decimal', value: String(v) },
      { key: 'hex', value: ipv4ToHex(v) },
      { key: 'binary', value: ipv4ToBinaryDotted(v) },
      { key: 'ipv4-mapped-ipv6', value: `::ffff:${hi}:${lo}` },
    ],
  };
}

function fromIPv6(groups: number[]): IpConversion {
  const rows: IpRow[] = [
    { key: 'ipv6-compressed', value: compressIPv6(groups) },
    { key: 'ipv6-expanded', value: expandIPv6(groups) },
    { key: 'ipv6-full', value: fullIPv6(groups) },
    { key: 'decimal', value: ipv6ToDecimal(groups) },
    {
      key: 'hex',
      value: '0x' + groups.map((g) => g.toString(16).padStart(4, '0')).join(''),
    },
    {
      key: 'binary',
      value: groups.map((g) => g.toString(2).padStart(16, '0')).join(':'),
    },
  ];
  if (isMappedV4(groups)) {
    rows.push({
      key: 'ipv6-embedded-ipv4',
      value: formatIPv4(((groups[6] << 16) | groups[7]) >>> 0),
    });
  }
  return { version: 6, inputFormat: 'ipv6', type: ipv6Type(groups), rows };
}

/** 入力の表記を自動判別し、IPv4/IPv6の各表記に変換する。判別できなければnull */
export function convertIpAddress(input: string): IpConversion | null {
  const s = input.trim();
  if (s === '') return null;
  if (s.includes(':')) {
    const groups = parseIPv6(s);
    return groups ? fromIPv6(groups) : null;
  }
  const v4 = parseIPv4Flexible(s);
  return v4 ? fromIPv4(v4) : null;
}
