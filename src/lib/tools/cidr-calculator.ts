export interface CidrInfo {
  ipAddress: string;
  prefixLength: number;
  subnetMask: string;
  wildcardMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string | null;
  lastUsableHost: string | null;
  usableHostCount: number;
  totalAddressCount: number;
}

/** "192.168.1.10" のようなIPv4文字列を32bit符号なし整数に変換する。不正な形式はnull */
export function parseIPv4(input: string): number | null {
  const trimmed = input.trim();
  const parts = trimmed.split('.');
  if (parts.length !== 4) return null;

  let result = 0;
  for (const part of parts) {
    // 先頭ゼロ付き表記（"01"等）は8進数と誤解される余地があるため不可とする
    if (!/^(0|[1-9]\d{0,2})$/.test(part)) return null;
    const octet = Number(part);
    if (octet < 0 || octet > 255) return null;
    result = result * 256 + octet;
  }
  return result >>> 0;
}

/** 32bit符号なし整数をIPv4のドット区切り表記に変換する */
export function formatIPv4(value: number): string {
  return [24, 16, 8, 0].map((shift) => (value >>> shift) & 0xff).join('.');
}

/** プレフィックス長（0〜32）をサブネットマスクの32bit整数に変換する */
export function prefixToMaskInt(prefix: number): number {
  if (prefix <= 0) return 0;
  if (prefix >= 32) return 0xffffffff;
  return (0xffffffff << (32 - prefix)) >>> 0;
}

/** サブネットマスクの32bit整数をプレフィックス長に変換する。連続した1のビット列でなければnull */
export function maskIntToPrefix(mask: number): number | null {
  for (let prefix = 0; prefix <= 32; prefix++) {
    if (prefixToMaskInt(prefix) === mask) return prefix;
  }
  return null;
}

interface ParsedCidr {
  ipInt: number;
  prefix: number;
}

/**
 * "192.168.1.10/24" や "192.168.1.10/255.255.255.0" 形式の入力をパースする。
 * プレフィックス部分は0〜32の数値、またはドット区切りのサブネットマスクのどちらでも受け付ける。
 * 不正な形式はnull。
 */
export function parseCidrNotation(input: string): ParsedCidr | null {
  const trimmed = input.trim();
  const slashIndex = trimmed.indexOf('/');
  if (slashIndex === -1) return null;

  const ipPart = trimmed.slice(0, slashIndex);
  const prefixPart = trimmed.slice(slashIndex + 1).trim();

  const ipInt = parseIPv4(ipPart);
  if (ipInt === null) return null;

  if (/^\d{1,2}$/.test(prefixPart)) {
    const prefix = Number(prefixPart);
    if (prefix < 0 || prefix > 32) return null;
    return { ipInt, prefix };
  }

  if (prefixPart.includes('.')) {
    const maskInt = parseIPv4(prefixPart);
    if (maskInt === null) return null;
    const prefix = maskIntToPrefix(maskInt);
    if (prefix === null) return null;
    return { ipInt, prefix };
  }

  return null;
}

/**
 * CIDR表記からネットワークアドレス・ブロードキャストアドレス・利用可能ホスト範囲などを計算する。
 * /31はRFC 3021のポイントツーポイント用途として2アドレスとも利用可能、/32は単一ホストとして1アドレスのみ利用可能として扱う。
 */
export function calculateCidr(input: string): CidrInfo | null {
  const parsed = parseCidrNotation(input);
  if (!parsed) return null;
  const { ipInt, prefix } = parsed;

  const maskInt = prefixToMaskInt(prefix);
  const wildcardInt = ~maskInt >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;
  const totalAddressCount = 2 ** (32 - prefix);

  let firstUsableHost: string | null;
  let lastUsableHost: string | null;
  let usableHostCount: number;

  if (prefix === 32) {
    firstUsableHost = formatIPv4(ipInt);
    lastUsableHost = formatIPv4(ipInt);
    usableHostCount = 1;
  } else if (prefix === 31) {
    firstUsableHost = formatIPv4(networkInt);
    lastUsableHost = formatIPv4(broadcastInt);
    usableHostCount = 2;
  } else {
    firstUsableHost = formatIPv4(networkInt + 1);
    lastUsableHost = formatIPv4(broadcastInt - 1);
    usableHostCount = totalAddressCount - 2;
  }

  return {
    ipAddress: formatIPv4(ipInt),
    prefixLength: prefix,
    subnetMask: formatIPv4(maskInt),
    wildcardMask: formatIPv4(wildcardInt),
    networkAddress: formatIPv4(networkInt),
    broadcastAddress: formatIPv4(broadcastInt),
    firstUsableHost,
    lastUsableHost,
    usableHostCount,
    totalAddressCount,
  };
}
