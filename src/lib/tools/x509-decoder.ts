import { bytesToHex } from './hmac-generator';

export type X509Error = 'no-certificate' | 'invalid-certificate';

export interface NameAttribute {
  /** 例: CN / O / C。未知のOIDはOIDそのもの */
  name: string;
  value: string;
}

export interface Extension {
  oid: string;
  /** 既知の拡張なら名前（例: subjectAltName）。未知ならOID */
  name: string;
  critical: boolean;
  /** 表示用の値。解析できない拡張は null（OIDだけ表示する） */
  values: string[] | null;
}

export interface CertificateInfo {
  version: number;
  /** 16進数（コロンなし、大文字） */
  serialNumber: string;
  signatureAlgorithm: string;
  issuer: NameAttribute[];
  subject: NameAttribute[];
  notBefore: Date;
  notAfter: Date;
  publicKeyAlgorithm: string;
  /** RSAのモジュラス長・ECの曲線ビット数など。不明なら null */
  publicKeyBits: number | null;
  /** ECの曲線名など補足 */
  publicKeyDetail: string | null;
  extensions: Extension[];
  /** コロン区切り大文字16進数 */
  sha256Fingerprint: string;
  sha1Fingerprint: string;
}

export type X509Result =
  | { success: true; certificates: CertificateInfo[] }
  | { success: false; error: X509Error };

const OID_NAMES: Record<string, string> = {
  '2.5.4.3': 'CN',
  '2.5.4.4': 'SN',
  '2.5.4.5': 'serialNumber',
  '2.5.4.6': 'C',
  '2.5.4.7': 'L',
  '2.5.4.8': 'ST',
  '2.5.4.9': 'street',
  '2.5.4.10': 'O',
  '2.5.4.11': 'OU',
  '2.5.4.12': 'title',
  '2.5.4.42': 'GN',
  '2.5.4.97': 'organizationIdentifier',
  '1.2.840.113549.1.9.1': 'emailAddress',
  '0.9.2342.19200300.100.1.25': 'DC',
};

const SIGNATURE_ALGORITHMS: Record<string, string> = {
  '1.2.840.113549.1.1.4': 'md5WithRSAEncryption',
  '1.2.840.113549.1.1.5': 'sha1WithRSAEncryption',
  '1.2.840.113549.1.1.10': 'RSASSA-PSS',
  '1.2.840.113549.1.1.11': 'sha256WithRSAEncryption',
  '1.2.840.113549.1.1.12': 'sha384WithRSAEncryption',
  '1.2.840.113549.1.1.13': 'sha512WithRSAEncryption',
  '1.2.840.10045.4.1': 'ecdsa-with-SHA1',
  '1.2.840.10045.4.3.2': 'ecdsa-with-SHA256',
  '1.2.840.10045.4.3.3': 'ecdsa-with-SHA384',
  '1.2.840.10045.4.3.4': 'ecdsa-with-SHA512',
  '1.3.101.112': 'Ed25519',
  '1.3.101.113': 'Ed448',
};

const CURVES: Record<string, { name: string; bits: number }> = {
  '1.2.840.10045.3.1.7': { name: 'prime256v1 (P-256)', bits: 256 },
  '1.3.132.0.34': { name: 'secp384r1 (P-384)', bits: 384 },
  '1.3.132.0.35': { name: 'secp521r1 (P-521)', bits: 521 },
};

const EXTENSION_NAMES: Record<string, string> = {
  '2.5.29.14': 'subjectKeyIdentifier',
  '2.5.29.15': 'keyUsage',
  '2.5.29.17': 'subjectAltName',
  '2.5.29.18': 'issuerAltName',
  '2.5.29.19': 'basicConstraints',
  '2.5.29.31': 'cRLDistributionPoints',
  '2.5.29.32': 'certificatePolicies',
  '2.5.29.35': 'authorityKeyIdentifier',
  '2.5.29.37': 'extKeyUsage',
  '1.3.6.1.5.5.7.1.1': 'authorityInfoAccess',
  '1.3.6.1.4.1.11129.2.4.2': 'signedCertificateTimestamps',
};

const EXTENDED_KEY_USAGES: Record<string, string> = {
  '1.3.6.1.5.5.7.3.1': 'serverAuth',
  '1.3.6.1.5.5.7.3.2': 'clientAuth',
  '1.3.6.1.5.5.7.3.3': 'codeSigning',
  '1.3.6.1.5.5.7.3.4': 'emailProtection',
  '1.3.6.1.5.5.7.3.8': 'timeStamping',
  '1.3.6.1.5.5.7.3.9': 'OCSPSigning',
};

const KEY_USAGE_BITS = [
  'digitalSignature',
  'nonRepudiation',
  'keyEncipherment',
  'dataEncipherment',
  'keyAgreement',
  'keyCertSign',
  'cRLSign',
  'encipherOnly',
  'decipherOnly',
];

const OID_RSA = '1.2.840.113549.1.1.1';
const OID_EC = '1.2.840.10045.2.1';
const OID_ED25519 = '1.3.101.112';
const OID_ED448 = '1.3.101.113';

class DerError extends Error {}

interface Node {
  tag: number;
  /** 内容部の先頭・末尾（end は排他的） */
  start: number;
  end: number;
}

/** DERのTLVを1つ読む（definite lengthのみ） */
function readNode(data: Uint8Array, offset: number): Node {
  if (offset + 2 > data.length) throw new DerError();
  const tag = data[offset];
  // 上位タグ番号（0x1f）は証明書では使われない
  if ((tag & 0x1f) === 0x1f) throw new DerError();
  let length = data[offset + 1];
  let start = offset + 2;
  if (length & 0x80) {
    const count = length & 0x7f;
    if (count === 0 || count > 4 || start + count > data.length) {
      throw new DerError();
    }
    length = 0;
    for (let i = 0; i < count; i++) length = length * 256 + data[start + i];
    start += count;
  }
  const end = start + length;
  if (end > data.length) throw new DerError();
  return { tag, start, end };
}

/** 構造体の子ノードを列挙する */
function children(data: Uint8Array, node: Node): Node[] {
  const result: Node[] = [];
  let offset = node.start;
  while (offset < node.end) {
    const child = readNode(data, offset);
    if (child.end > node.end) throw new DerError();
    result.push(child);
    offset = child.end;
  }
  return result;
}

function expectTag(node: Node | undefined, tag: number): Node {
  if (!node || node.tag !== tag) throw new DerError();
  return node;
}

function content(data: Uint8Array, node: Node): Uint8Array {
  return data.subarray(node.start, node.end);
}

function parseOid(bytes: Uint8Array): string {
  if (bytes.length === 0) throw new DerError();
  const parts: number[] = [];
  let value = 0;
  for (const b of bytes) {
    value = value * 128 + (b & 0x7f);
    if (!(b & 0x80)) {
      parts.push(value);
      value = 0;
    }
  }
  const first = parts[0];
  const head =
    first < 40 ? [0, first] : first < 80 ? [1, first - 40] : [2, first - 80];
  return [...head, ...parts.slice(1)].join('.');
}

function readOid(data: Uint8Array, node: Node | undefined): string {
  return parseOid(content(data, expectTag(node, 0x06)));
}

function bitLength(bytes: Uint8Array): number {
  let i = 0;
  while (i < bytes.length && bytes[i] === 0) i++;
  if (i === bytes.length) return 0;
  return (bytes.length - i - 1) * 8 + (32 - Math.clz32(bytes[i]));
}

function latin1(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => String.fromCharCode(b)).join('');
}

function decodeString(data: Uint8Array, node: Node): string {
  const bytes = content(data, node);
  switch (node.tag) {
    case 0x0c:
      return new TextDecoder().decode(bytes);
    case 0x1e: {
      // BMPString（UTF-16BE）
      let text = '';
      for (let i = 0; i + 1 < bytes.length; i += 2) {
        text += String.fromCharCode((bytes[i] << 8) | bytes[i + 1]);
      }
      return text;
    }
    case 0x13:
    case 0x14:
    case 0x16:
      return latin1(bytes);
    default:
      return bytesToHex(bytes);
  }
}

function parseTime(data: Uint8Array, node: Node): Date {
  const text = latin1(content(data, node));
  const m =
    node.tag === 0x17
      ? /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?Z$/.exec(text)
      : node.tag === 0x18
        ? /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?Z$/.exec(text)
        : null;
  if (!m) throw new DerError();
  let year = Number(m[1]);
  if (node.tag === 0x17) year += year >= 50 ? 1900 : 2000;
  const [month, day, hour, minute, second] = [2, 3, 4, 5, 6].map((i) =>
    Number(m[i] ?? 0),
  );
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour > 23 ||
    minute > 59 ||
    second > 60
  ) {
    throw new DerError();
  }
  return new Date(
    Date.UTC(
      year,
      Number(m[2]) - 1,
      Number(m[3]),
      Number(m[4]),
      Number(m[5]),
      Number(m[6] ?? 0),
    ),
  );
}

function parseName(data: Uint8Array, node: Node): NameAttribute[] {
  const attributes: NameAttribute[] = [];
  for (const rdn of children(data, expectTag(node, 0x30))) {
    for (const attr of children(data, expectTag(rdn, 0x31))) {
      const [oid, value] = children(data, expectTag(attr, 0x30));
      if (!value) throw new DerError();
      const oidText = readOid(data, oid);
      attributes.push({
        name: OID_NAMES[oidText] ?? oidText,
        value: decodeString(data, value),
      });
    }
  }
  return attributes;
}

/** 整数ノードの値を16進数文字列にする（先頭の符号用ゼロは除く） */
function integerHex(data: Uint8Array, node: Node | undefined): string {
  let bytes = content(data, expectTag(node, 0x02));
  while (bytes.length > 1 && bytes[0] === 0) bytes = bytes.subarray(1);
  return bytesToHex(bytes).toUpperCase();
}

function formatHexColon(bytes: Uint8Array): string {
  return bytesToHex(bytes)
    .toUpperCase()
    .replace(/(..)(?!$)/g, '$1:');
}

function formatIp(bytes: Uint8Array): string {
  if (bytes.length === 4) return Array.from(bytes).join('.');
  if (bytes.length === 16) {
    const groups: string[] = [];
    for (let i = 0; i < 16; i += 2) {
      groups.push(((bytes[i] << 8) | bytes[i + 1]).toString(16));
    }
    return groups.join(':');
  }
  return bytesToHex(bytes);
}

function parseGeneralName(data: Uint8Array, node: Node): string {
  const bytes = content(data, node);
  switch (node.tag) {
    case 0x81:
      return `email:${latin1(bytes)}`;
    case 0x82:
      return `DNS:${latin1(bytes)}`;
    case 0x86:
      return `URI:${latin1(bytes)}`;
    case 0x87:
      return `IP:${formatIp(bytes)}`;
    case 0xa4:
      return 'directoryName';
    default:
      return `otherName(tag 0x${node.tag.toString(16)})`;
  }
}

/** 入れ子の中から URI（[6]）を集める（CRL配布点用） */
function collectUris(data: Uint8Array, node: Node, out: string[]): void {
  if (node.tag === 0x86) {
    out.push(`URI:${latin1(content(data, node))}`);
    return;
  }
  // 構造体（constructed）だけ辿る
  if (node.tag & 0x20) {
    for (const child of children(data, node)) collectUris(data, child, out);
  }
}

function parseExtensionValue(
  oid: string,
  data: Uint8Array,
  node: Node,
): string[] | null {
  switch (oid) {
    case '2.5.29.17':
    case '2.5.29.18':
      return children(data, expectTag(node, 0x30)).map((n) =>
        parseGeneralName(data, n),
      );
    case '2.5.29.15': {
      const bits = content(data, expectTag(node, 0x03));
      if (bits.length < 1) throw new DerError();
      const names: string[] = [];
      for (let i = 0; i < KEY_USAGE_BITS.length; i++) {
        const byte = bits[1 + (i >> 3)];
        if (byte !== undefined && byte & (0x80 >> (i & 7))) {
          names.push(KEY_USAGE_BITS[i]);
        }
      }
      return names;
    }
    case '2.5.29.37':
      return children(data, expectTag(node, 0x30)).map((n) => {
        const id = readOid(data, n);
        return EXTENDED_KEY_USAGES[id] ?? id;
      });
    case '2.5.29.19': {
      let isCa = false;
      let pathLen: number | null = null;
      for (const child of children(data, expectTag(node, 0x30))) {
        if (child.tag === 0x01) isCa = content(data, child)[0] !== 0;
        else if (child.tag === 0x02) {
          pathLen = parseInt(integerHex(data, child), 16);
        }
      }
      return pathLen === null
        ? [`CA:${isCa}`]
        : [`CA:${isCa}`, `pathlen:${pathLen}`];
    }
    case '2.5.29.14':
      return [formatHexColon(content(data, expectTag(node, 0x04)))];
    case '2.5.29.35': {
      for (const child of children(data, expectTag(node, 0x30))) {
        if (child.tag === 0x80) return [formatHexColon(content(data, child))];
      }
      return [];
    }
    case '1.3.6.1.5.5.7.1.1': {
      const values: string[] = [];
      for (const desc of children(data, expectTag(node, 0x30))) {
        const [method, location] = children(data, expectTag(desc, 0x30));
        const id = readOid(data, method);
        const label =
          id === '1.3.6.1.5.5.7.48.1'
            ? 'OCSP'
            : id === '1.3.6.1.5.5.7.48.2'
              ? 'CA Issuers'
              : id;
        values.push(`${label} - ${parseGeneralName(data, location)}`);
      }
      return values;
    }
    case '2.5.29.31': {
      const uris: string[] = [];
      collectUris(data, expectTag(node, 0x30), uris);
      return uris;
    }
    default:
      return null;
  }
}

function parseExtensions(data: Uint8Array, node: Node): Extension[] {
  const list = expectTag(children(data, node)[0], 0x30);
  return children(data, list).map((ext) => {
    const parts = children(data, expectTag(ext, 0x30));
    const oid = readOid(data, parts[0]);
    // critical（BOOLEAN）は省略されることがあるので、有無で値の位置が変わる
    const hasCritical = parts[1]?.tag === 0x01;
    const critical = hasCritical && content(data, parts[1])[0] !== 0;
    const octets = content(data, expectTag(parts[hasCritical ? 2 : 1], 0x04));
    let values: string[] | null;
    try {
      values = parseExtensionValue(oid, octets, readNode(octets, 0));
    } catch {
      // 拡張の中身だけ壊れていても、証明書全体は表示できるようにする
      values = null;
    }
    return { oid, name: EXTENSION_NAMES[oid] ?? oid, critical, values };
  });
}

function parsePublicKey(
  data: Uint8Array,
  node: Node,
): { algorithm: string; bits: number | null; detail: string | null } {
  const [algorithm, keyBits] = children(data, expectTag(node, 0x30));
  const [oidNode, params] = children(data, expectTag(algorithm, 0x30));
  const oid = readOid(data, oidNode);
  const bitString = content(data, expectTag(keyBits, 0x03)).subarray(1);

  if (oid === OID_RSA) {
    const [modulus] = children(
      bitString,
      expectTag(readNode(bitString, 0), 0x30),
    );
    return {
      algorithm: 'RSA',
      bits: bitLength(content(bitString, expectTag(modulus, 0x02))),
      detail: null,
    };
  }
  if (oid === OID_EC) {
    // 明示的パラメータ（OID以外）の場合は曲線名を特定せず続行する
    const curveOid = params?.tag === 0x06 ? readOid(data, params) : '';
    const curve = CURVES[curveOid];
    return {
      algorithm: 'EC',
      bits: curve?.bits ?? null,
      detail: curve?.name ?? curveOid,
    };
  }
  if (oid === OID_ED25519) {
    return { algorithm: 'Ed25519', bits: 256, detail: null };
  }
  if (oid === OID_ED448) return { algorithm: 'Ed448', bits: 456, detail: null };
  return { algorithm: oid, bits: null, detail: null };
}

async function fingerprint(
  algorithm: 'SHA-1' | 'SHA-256',
  der: Uint8Array,
): Promise<string> {
  const digest = await crypto.subtle.digest(algorithm, der as BufferSource);
  return formatHexColon(new Uint8Array(digest));
}

/** DER形式の証明書1つを解析する（形式が不正なら DerError を投げる） */
async function parseCertificate(der: Uint8Array): Promise<CertificateInfo> {
  const root = expectTag(readNode(der, 0), 0x30);
  // 証明書の後ろにゴミが付いたデータは受け付けない
  if (root.end !== der.length) throw new DerError();
  const tbs = children(der, expectTag(children(der, root)[0], 0x30));

  let index = 0;
  let version = 1;
  if (tbs[0]?.tag === 0xa0) {
    version = parseInt(integerHex(der, children(der, tbs[0])[0]), 16) + 1;
    index = 1;
  }
  const serial = tbs[index++];
  const signatureAlgorithm = expectTag(tbs[index++], 0x30);
  const issuer = expectTag(tbs[index++], 0x30);
  const validity = children(der, expectTag(tbs[index++], 0x30));
  const subject = expectTag(tbs[index++], 0x30);
  const spki = expectTag(tbs[index++], 0x30);
  if (validity.length !== 2) throw new DerError();

  const key = parsePublicKey(der, spki);
  let extensions: Extension[] = [];
  for (const node of tbs.slice(index)) {
    if (node.tag === 0xa3) extensions = parseExtensions(der, node);
  }
  const sigOid = readOid(der, children(der, signatureAlgorithm)[0]);

  return {
    version,
    serialNumber: integerHex(der, serial),
    signatureAlgorithm: SIGNATURE_ALGORITHMS[sigOid] ?? sigOid,
    issuer: parseName(der, issuer),
    subject: parseName(der, subject),
    notBefore: parseTime(der, validity[0]),
    notAfter: parseTime(der, validity[1]),
    publicKeyAlgorithm: key.algorithm,
    publicKeyBits: key.bits,
    publicKeyDetail: key.detail,
    extensions,
    sha256Fingerprint: await fingerprint('SHA-256', der),
    sha1Fingerprint: await fingerprint('SHA-1', der),
  };
}

function base64ToBytes(text: string): Uint8Array | null {
  const compact = text.replace(/\s+/g, '');
  if (compact === '' || !/^[A-Za-z0-9+/]+={0,2}$/.test(compact)) return null;
  try {
    return Uint8Array.from(atob(compact), (c) => c.charCodeAt(0));
  } catch {
    return null;
  }
}

/** PEM（複数可）またはヘッダーなしのBase64から、証明書のDERバイト列を取り出す */
export function extractDerCertificates(input: string): Uint8Array[] | null {
  const pemPattern =
    /-----BEGIN (?:X509 )?CERTIFICATE-----([\s\S]*?)-----END (?:X509 )?CERTIFICATE-----/g;
  const blocks = [...input.matchAll(pemPattern)].map((m) => m[1]);
  const bodies = blocks.length > 0 ? blocks : [input];
  const result: Uint8Array[] = [];
  for (const body of bodies) {
    const bytes = base64ToBytes(body);
    if (!bytes) return null;
    result.push(bytes);
  }
  return result;
}

export async function decodeCertificates(input: string): Promise<X509Result> {
  if (input.trim() === '') return { success: false, error: 'no-certificate' };
  const ders = extractDerCertificates(input);
  if (!ders) return { success: false, error: 'invalid-certificate' };
  try {
    const certificates: CertificateInfo[] = [];
    for (const der of ders) certificates.push(await parseCertificate(der));
    return { success: true, certificates };
  } catch {
    // 壊れたデータでは範囲外参照などの例外も起こりうるため、すべて不正な証明書として扱う
    return { success: false, error: 'invalid-certificate' };
  }
}

export type ValidityStatus = 'valid' | 'expired' | 'not-yet-valid';

/** 現在時刻に対する有効性と、有効期限までの日数（期限切れなら負数） */
export function validityStatus(
  cert: Pick<CertificateInfo, 'notBefore' | 'notAfter'>,
  now: Date,
): { status: ValidityStatus; daysLeft: number } {
  const daysLeft = Math.floor(
    (cert.notAfter.getTime() - now.getTime()) / 86_400_000,
  );
  if (now < cert.notBefore) return { status: 'not-yet-valid', daysLeft };
  if (now > cert.notAfter) return { status: 'expired', daysLeft };
  return { status: 'valid', daysLeft };
}
