/**
 * ポート番号一覧の静的データと検索ロジック。
 * 表示文言（用途の説明）は i18n 辞書側で持つ。ここにはポート番号・プロトコル・
 * サービス名・分類といった全ロケール共通の事実だけを置く。
 * `official: false` は IANA の登録名と一致しない、開発現場での慣例的な割り当て。
 */

export const PORT_CATEGORIES = [
  'web',
  'mail',
  'remote',
  'file',
  'database',
  'network',
  'messaging',
  'devops',
  'other',
] as const;
export type PortCategory = (typeof PORT_CATEGORIES)[number];
export type CategoryFilter = PortCategory | 'all';

export type Transport = 'tcp' | 'udp';
export type ProtocolFilter = Transport | 'all';

export interface PortInfo {
  port: number;
  protocols: readonly Transport[];
  /** 辞書キー（一意） */
  id: string;
  /** サービス名・プロトコル名（全ロケール共通の表記） */
  name: string;
  category: PortCategory;
  /** false: IANA 登録ではなく慣例的な用途 */
  official?: boolean;
}

const T = ['tcp'] as const;
const U = ['udp'] as const;
const TU = ['tcp', 'udp'] as const;

export const PORTS = [
  {
    port: 20,
    protocols: T,
    id: 'ftp-data',
    name: 'FTP (data)',
    category: 'file',
  },
  {
    port: 21,
    protocols: T,
    id: 'ftp',
    name: 'FTP (control)',
    category: 'file',
  },
  { port: 22, protocols: T, id: 'ssh', name: 'SSH / SFTP', category: 'remote' },
  { port: 23, protocols: T, id: 'telnet', name: 'Telnet', category: 'remote' },
  { port: 25, protocols: T, id: 'smtp', name: 'SMTP', category: 'mail' },
  { port: 43, protocols: T, id: 'whois', name: 'WHOIS', category: 'network' },
  { port: 53, protocols: TU, id: 'dns', name: 'DNS', category: 'network' },
  {
    port: 67,
    protocols: U,
    id: 'dhcp-server',
    name: 'DHCP (server)',
    category: 'network',
  },
  {
    port: 68,
    protocols: U,
    id: 'dhcp-client',
    name: 'DHCP (client)',
    category: 'network',
  },
  { port: 69, protocols: U, id: 'tftp', name: 'TFTP', category: 'file' },
  { port: 80, protocols: T, id: 'http', name: 'HTTP', category: 'web' },
  {
    port: 88,
    protocols: TU,
    id: 'kerberos',
    name: 'Kerberos',
    category: 'network',
  },
  { port: 110, protocols: T, id: 'pop3', name: 'POP3', category: 'mail' },
  {
    port: 111,
    protocols: TU,
    id: 'rpcbind',
    name: 'RPC (rpcbind / portmapper)',
    category: 'network',
  },
  { port: 123, protocols: U, id: 'ntp', name: 'NTP', category: 'network' },
  {
    port: 135,
    protocols: T,
    id: 'msrpc',
    name: 'Microsoft RPC',
    category: 'network',
  },
  {
    port: 137,
    protocols: U,
    id: 'netbios-ns',
    name: 'NetBIOS Name Service',
    category: 'file',
  },
  {
    port: 138,
    protocols: U,
    id: 'netbios-dgm',
    name: 'NetBIOS Datagram',
    category: 'file',
  },
  {
    port: 139,
    protocols: T,
    id: 'netbios-ssn',
    name: 'NetBIOS Session',
    category: 'file',
  },
  { port: 143, protocols: T, id: 'imap', name: 'IMAP', category: 'mail' },
  { port: 161, protocols: U, id: 'snmp', name: 'SNMP', category: 'network' },
  {
    port: 162,
    protocols: U,
    id: 'snmptrap',
    name: 'SNMP Trap',
    category: 'network',
  },
  { port: 179, protocols: T, id: 'bgp', name: 'BGP', category: 'network' },
  { port: 389, protocols: TU, id: 'ldap', name: 'LDAP', category: 'network' },
  {
    port: 443,
    protocols: TU,
    id: 'https',
    name: 'HTTPS / HTTP/3 (QUIC)',
    category: 'web',
  },
  {
    port: 445,
    protocols: T,
    id: 'smb',
    name: 'SMB (Microsoft-DS)',
    category: 'file',
  },
  {
    port: 465,
    protocols: T,
    id: 'smtps',
    name: 'SMTPS (SMTP over TLS)',
    category: 'mail',
  },
  {
    port: 500,
    protocols: U,
    id: 'isakmp',
    name: 'IKE / ISAKMP (IPsec)',
    category: 'network',
  },
  {
    port: 502,
    protocols: T,
    id: 'modbus',
    name: 'Modbus TCP',
    category: 'other',
  },
  {
    port: 514,
    protocols: U,
    id: 'syslog',
    name: 'Syslog',
    category: 'network',
  },
  {
    port: 515,
    protocols: T,
    id: 'lpd',
    name: 'LPD (printing)',
    category: 'other',
  },
  { port: 520, protocols: U, id: 'rip', name: 'RIP', category: 'network' },
  {
    port: 546,
    protocols: U,
    id: 'dhcpv6-client',
    name: 'DHCPv6 (client)',
    category: 'network',
  },
  {
    port: 547,
    protocols: U,
    id: 'dhcpv6-server',
    name: 'DHCPv6 (server)',
    category: 'network',
  },
  { port: 554, protocols: TU, id: 'rtsp', name: 'RTSP', category: 'other' },
  {
    port: 587,
    protocols: T,
    id: 'submission',
    name: 'SMTP Submission',
    category: 'mail',
  },
  {
    port: 631,
    protocols: TU,
    id: 'ipp',
    name: 'IPP (CUPS)',
    category: 'other',
  },
  { port: 636, protocols: T, id: 'ldaps', name: 'LDAPS', category: 'network' },
  {
    port: 853,
    protocols: TU,
    id: 'dot',
    name: 'DNS over TLS / QUIC',
    category: 'network',
  },
  { port: 873, protocols: T, id: 'rsync', name: 'rsync', category: 'file' },
  {
    port: 989,
    protocols: T,
    id: 'ftps-data',
    name: 'FTPS (data)',
    category: 'file',
  },
  {
    port: 990,
    protocols: T,
    id: 'ftps',
    name: 'FTPS (control)',
    category: 'file',
  },
  { port: 993, protocols: T, id: 'imaps', name: 'IMAPS', category: 'mail' },
  { port: 995, protocols: T, id: 'pop3s', name: 'POP3S', category: 'mail' },
  {
    port: 1080,
    protocols: TU,
    id: 'socks',
    name: 'SOCKS',
    category: 'network',
  },
  {
    port: 1194,
    protocols: TU,
    id: 'openvpn',
    name: 'OpenVPN',
    category: 'network',
  },
  {
    port: 1433,
    protocols: T,
    id: 'mssql',
    name: 'Microsoft SQL Server',
    category: 'database',
  },
  {
    port: 1434,
    protocols: U,
    id: 'mssql-browser',
    name: 'SQL Server Browser',
    category: 'database',
  },
  {
    port: 1521,
    protocols: T,
    id: 'oracle',
    name: 'Oracle Database (TNS listener)',
    category: 'database',
  },
  { port: 1701, protocols: U, id: 'l2tp', name: 'L2TP', category: 'network' },
  { port: 1723, protocols: T, id: 'pptp', name: 'PPTP', category: 'network' },
  {
    port: 1812,
    protocols: U,
    id: 'radius',
    name: 'RADIUS (authentication)',
    category: 'network',
  },
  {
    port: 1813,
    protocols: U,
    id: 'radius-acct',
    name: 'RADIUS (accounting)',
    category: 'network',
  },
  { port: 1883, protocols: T, id: 'mqtt', name: 'MQTT', category: 'messaging' },
  {
    port: 1900,
    protocols: U,
    id: 'ssdp',
    name: 'SSDP (UPnP)',
    category: 'network',
  },
  { port: 2049, protocols: TU, id: 'nfs', name: 'NFS', category: 'file' },
  {
    port: 2181,
    protocols: T,
    id: 'zookeeper',
    name: 'Apache ZooKeeper',
    category: 'devops',
  },
  {
    port: 2375,
    protocols: T,
    id: 'docker',
    name: 'Docker daemon (unencrypted)',
    category: 'devops',
  },
  {
    port: 2376,
    protocols: T,
    id: 'docker-tls',
    name: 'Docker daemon (TLS)',
    category: 'devops',
  },
  {
    port: 2379,
    protocols: T,
    id: 'etcd-client',
    name: 'etcd (client)',
    category: 'devops',
  },
  {
    port: 2380,
    protocols: T,
    id: 'etcd-peer',
    name: 'etcd (peer)',
    category: 'devops',
  },
  {
    port: 3000,
    protocols: T,
    id: 'dev-3000',
    name: 'Dev server (Node.js / Rails)',
    category: 'devops',
    official: false,
  },
  {
    port: 3128,
    protocols: T,
    id: 'squid',
    name: 'Squid proxy',
    category: 'network',
    official: false,
  },
  {
    port: 3306,
    protocols: T,
    id: 'mysql',
    name: 'MySQL / MariaDB',
    category: 'database',
  },
  { port: 3389, protocols: TU, id: 'rdp', name: 'RDP', category: 'remote' },
  {
    port: 3478,
    protocols: TU,
    id: 'stun',
    name: 'STUN / TURN',
    category: 'network',
  },
  {
    port: 3690,
    protocols: T,
    id: 'svn',
    name: 'Subversion (svnserve)',
    category: 'devops',
  },
  {
    port: 4500,
    protocols: U,
    id: 'ipsec-nat-t',
    name: 'IPsec NAT-T',
    category: 'network',
  },
  { port: 5060, protocols: TU, id: 'sip', name: 'SIP', category: 'messaging' },
  {
    port: 5061,
    protocols: T,
    id: 'sips',
    name: 'SIP over TLS',
    category: 'messaging',
  },
  {
    port: 5173,
    protocols: T,
    id: 'vite',
    name: 'Vite dev server',
    category: 'devops',
    official: false,
  },
  {
    port: 5222,
    protocols: T,
    id: 'xmpp',
    name: 'XMPP (client)',
    category: 'messaging',
  },
  {
    port: 5353,
    protocols: U,
    id: 'mdns',
    name: 'mDNS (Bonjour / Avahi)',
    category: 'network',
  },
  {
    port: 5432,
    protocols: T,
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'database',
  },
  {
    port: 5671,
    protocols: T,
    id: 'amqps',
    name: 'AMQP over TLS',
    category: 'messaging',
  },
  {
    port: 5672,
    protocols: T,
    id: 'amqp',
    name: 'AMQP (RabbitMQ)',
    category: 'messaging',
  },
  {
    port: 5900,
    protocols: T,
    id: 'vnc',
    name: 'VNC (RFB)',
    category: 'remote',
  },
  {
    port: 5984,
    protocols: T,
    id: 'couchdb',
    name: 'Apache CouchDB',
    category: 'database',
  },
  {
    port: 5985,
    protocols: T,
    id: 'winrm',
    name: 'WinRM (HTTP)',
    category: 'remote',
  },
  {
    port: 5986,
    protocols: T,
    id: 'winrm-tls',
    name: 'WinRM (HTTPS)',
    category: 'remote',
  },
  { port: 6000, protocols: T, id: 'x11', name: 'X11', category: 'remote' },
  {
    port: 6379,
    protocols: T,
    id: 'redis',
    name: 'Redis',
    category: 'database',
  },
  {
    port: 6443,
    protocols: T,
    id: 'kubernetes-api',
    name: 'Kubernetes API server',
    category: 'devops',
    official: false,
  },
  {
    port: 8000,
    protocols: T,
    id: 'dev-8000',
    name: 'Dev server (Django / python -m http.server)',
    category: 'devops',
    official: false,
  },
  {
    port: 8080,
    protocols: T,
    id: 'http-alt',
    name: 'HTTP (alternate)',
    category: 'web',
  },
  {
    port: 8443,
    protocols: T,
    id: 'https-alt',
    name: 'HTTPS (alternate)',
    category: 'web',
    official: false,
  },
  {
    port: 8883,
    protocols: T,
    id: 'mqtts',
    name: 'MQTT over TLS',
    category: 'messaging',
  },
  {
    port: 8888,
    protocols: T,
    id: 'jupyter',
    name: 'Jupyter Notebook',
    category: 'devops',
    official: false,
  },
  {
    port: 9092,
    protocols: T,
    id: 'kafka',
    name: 'Apache Kafka',
    category: 'messaging',
    official: false,
  },
  {
    port: 9200,
    protocols: T,
    id: 'elasticsearch',
    name: 'Elasticsearch (HTTP)',
    category: 'database',
    official: false,
  },
  {
    port: 9418,
    protocols: T,
    id: 'git',
    name: 'Git (git://)',
    category: 'devops',
  },
  {
    port: 11211,
    protocols: TU,
    id: 'memcached',
    name: 'Memcached',
    category: 'database',
  },
  {
    port: 27017,
    protocols: T,
    id: 'mongodb',
    name: 'MongoDB',
    category: 'database',
  },
  {
    port: 51820,
    protocols: U,
    id: 'wireguard',
    name: 'WireGuard',
    category: 'network',
    official: false,
  },
] as const satisfies readonly PortInfo[];

export type PortId = (typeof PORTS)[number]['id'];

/** 全角・大文字小文字を揃え、数字間の範囲記号まわりの空白を詰める */
export function normalizeQuery(query: string): string {
  return query
    .normalize('NFKC')
    .toLowerCase()
    .trim()
    .replace(/(\d)\s*[-–—~〜]\s*(\d)/g, '$1-$2');
}

/** `8000-8100` 形式を解析する。逆順は入れ替える。範囲でなければ null */
export function parseRange(token: string): [number, number] | null {
  const m = /^(\d+)-(\d+)$/.exec(token);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b)) return null;
  return a <= b ? [a, b] : [b, a];
}

/**
 * 検索語がポートに一致するか。空白区切りの各語がすべて一致（AND）した場合に true。
 * - 数字のみの語: ポート番号の完全一致（`80` は 80 のみ）
 * - `8000-8100`: 範囲内（両端を含む）
 * - それ以外: haystack（名称・説明・プロトコルなど）への部分一致（大文字小文字無視）
 */
export function matchesPort(
  info: Pick<PortInfo, 'port' | 'protocols' | 'category'>,
  haystack: string,
  query: string,
  category: CategoryFilter = 'all',
  protocol: ProtocolFilter = 'all',
): boolean {
  if (category !== 'all' && info.category !== category) return false;
  if (protocol !== 'all' && !info.protocols.includes(protocol)) return false;
  const q = normalizeQuery(query);
  if (q === '') return true;
  const text = haystack.normalize('NFKC').toLowerCase();
  return q.split(/\s+/).every((token) => {
    if (/^\d+$/.test(token)) return info.port === Number(token);
    const range = parseRange(token);
    if (range) return info.port >= range[0] && info.port <= range[1];
    return text.includes(token);
  });
}
