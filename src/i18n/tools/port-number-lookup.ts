import type { Locale } from '../../data/tools';
import type { PortCategory, PortId } from '../../lib/tools/port-number-lookup';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface PortNumberLookupPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  searchLabel: string;
  searchPlaceholder: string;
  searchHint: string;
  categoryLabel: string;
  protocolLabel: string;
  allLabel: string;
  categories: Record<PortCategory, string>;
  /** {shown} {total} を件数に置き換える */
  countTemplate: string;
  noResults: string;
  unofficialBadge: string;
  unofficialNote: string;

  /** ポートごとの用途の説明 */
  ports: Record<PortId, string>;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const portNumberLookupContent: Record<
  Locale,
  PortNumberLookupPageContent
> = {
  ja: {
    title: 'ポート番号一覧・検索（TCP/UDP の well-known ポート）',
    description:
      '22・80・443・3306・5432 など主要なポート番号を、番号・範囲（8000-8100）・サービス名で検索できる一覧表。TCP/UDP の区別と用途つき。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ポート番号一覧・検索',
    introHtml:
      'よく使われるポート番号を、番号・範囲（例: 8000-8100）・サービス名・用途のキーワードで検索できます。TCP / UDP の区別と、カテゴリ（Web・メール・データベースなど）での絞り込みに対応しています。Webサーバーの応答コードは <a href="/tools/http-status-codes/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTTPステータスコード一覧</a>、IPアドレスの表記変換は <a href="/tools/ip-address-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">IPアドレス変換</a> もご利用ください。',

    searchLabel: '番号・範囲・サービス名で検索',
    searchPlaceholder: '例: 443 / 8000-8100 / ssh / データベース',
    searchHint:
      '数字だけの入力はポート番号の完全一致です。「8000-8100」のように範囲も指定できます。空白区切りで複数の語を指定すると、すべてに一致するポートだけが表示されます。',
    categoryLabel: 'カテゴリで絞り込み',
    protocolLabel: 'プロトコルで絞り込み',
    allLabel: 'すべて',
    categories: {
      web: 'Web',
      mail: 'メール',
      remote: 'リモート接続',
      file: 'ファイル共有・転送',
      database: 'データベース',
      network: 'ネットワーク基盤',
      messaging: 'メッセージング・通話',
      devops: '開発・インフラ',
      other: 'その他',
    },
    countTemplate: '{shown} / {total} 件を表示中',
    noResults: '該当するポート番号が見つかりません。',
    unofficialBadge: '慣例',
    unofficialNote:
      'IANA の正式な割り当てではなく、広く使われている慣例的なポートです。',

    ports: {
      'ftp-data': 'FTP のデータ転送用（アクティブモード）。',
      ftp: 'FTP の制御用接続。パスワードが平文で流れるため、現在は SFTP や FTPS が推奨されます。',
      ssh: 'SSH によるリモートログイン、および SFTP・scp によるファイル転送。',
      telnet:
        'Telnet によるリモートログイン。通信が暗号化されないため、SSH への置き換えが一般的です。',
      smtp: 'メールサーバー間のメール配送（SMTP）。',
      whois: 'ドメインやIPアドレスの登録情報を問い合わせる WHOIS。',
      dns: '名前解決（DNS）。通常の問い合わせは UDP、応答が大きい場合やゾーン転送は TCP を使います。',
      'dhcp-server': 'DHCP サーバーがIPアドレスを配布する際に使うポート。',
      'dhcp-client': 'DHCP クライアントが設定を受け取る際に使うポート。',
      tftp: '認証のない簡易ファイル転送（TFTP）。ネットワーク機器の設定やPXEブートで使われます。',
      http: '暗号化なしのWeb通信（HTTP）。',
      kerberos:
        'Kerberos による認証。Active Directory のログインで使われます。',
      pop3: 'メール受信（POP3）。暗号化なしの方式です。',
      rpcbind:
        'Unix 系の RPC サービスの割り当てを管理する rpcbind（portmapper）。NFS が利用します。',
      ntp: '時刻同期（NTP）。',
      msrpc:
        'Windows のリモートプロシージャコール（RPC）のエンドポイントマッパー。',
      'netbios-ns':
        'NetBIOS による名前解決。古い Windows のネットワーク共有で使われます。',
      'netbios-dgm':
        'NetBIOS のデータグラム通信。古い Windows のネットワーク共有で使われます。',
      'netbios-ssn':
        'NetBIOS のセッション通信。古い Windows のファイル共有で使われます。',
      imap: 'メール受信（IMAP）。サーバー上にメールを残して複数端末で同期します。暗号化なしの方式です。',
      snmp: 'ネットワーク機器の監視・管理（SNMP）。',
      snmptrap: 'SNMP の障害通知（トラップ）を受け取るポート。',
      bgp: 'インターネットの経路制御に使われる BGP。',
      ldap: 'ディレクトリサービスへの問い合わせ（LDAP）。Active Directory や OpenLDAP で使われます。',
      https:
        '暗号化されたWeb通信（HTTPS）。UDP 443 は HTTP/3（QUIC）で使われます。',
      smb: 'Windows のファイル共有（SMB / CIFS）。Samba も使います。インターネットへの公開は避けるのが一般的です。',
      smtps:
        'TLS で暗号化された SMTP（暗黙のTLS）。メール送信の提出用として RFC 8314 で再び推奨されました。',
      isakmp: 'IPsec VPN の鍵交換（IKE）。',
      modbus: '工場やプラントの機器で使われる産業用プロトコル Modbus/TCP。',
      syslog: 'ログの転送（Syslog）。',
      lpd: 'ネットワークプリンターへの印刷（LPD）。',
      rip: 'ルーター間の経路情報交換（RIP）。',
      'dhcpv6-client': 'IPv6 の DHCP でクライアントが使うポート。',
      'dhcpv6-server': 'IPv6 の DHCP でサーバーが使うポート。',
      rtsp: '監視カメラやストリーミング機器の映像配信制御（RTSP）。',
      submission:
        'メールクライアントからサーバーへのメール送信（STARTTLS 対応）。ISPによる 25 番の制限を避けて使います。',
      ipp: 'ネットワークプリンターへの印刷（IPP）。CUPS が使用します。',
      ldaps: 'TLS で暗号化された LDAP。',
      dot: 'DNS over TLS（TCP）および DNS over QUIC（UDP）。',
      rsync:
        'ファイルの同期・バックアップに使う rsync デーモン。SSH 経由の rsync は 22 番を使います。',
      'ftps-data': 'TLS で暗号化された FTP（FTPS）のデータ転送用。',
      ftps: 'TLS で暗号化された FTP（FTPS）の制御用。',
      imaps: 'TLS で暗号化された IMAP。',
      pop3s: 'TLS で暗号化された POP3。',
      socks:
        'SOCKS プロキシ。SSH のダイナミックポートフォワードでもよく使われます。',
      openvpn: 'OpenVPN の標準ポート。通常は UDP を使います。',
      mssql: 'Microsoft SQL Server の標準ポート。',
      'mssql-browser':
        'SQL Server の名前付きインスタンスを探す SQL Server Browser サービス。',
      oracle: 'Oracle Database のリスナー（TNS）の標準ポート。',
      l2tp: 'L2TP による VPN。IPsec と組み合わせた L2TP/IPsec で使われます。',
      pptp: 'PPTP による VPN。セキュリティ上の問題があり、現在は推奨されません。',
      radius: 'RADIUS による認証。Wi-Fi の 802.1X や VPN の認証で使われます。',
      'radius-acct': 'RADIUS のアカウンティング（利用記録）用。',
      mqtt: 'IoT 向けの軽量メッセージング MQTT。暗号化なしです。',
      ssdp: 'UPnP 機器の探索（SSDP）。',
      nfs: 'Unix 系のネットワークファイル共有（NFS）。',
      zookeeper: 'Apache ZooKeeper のクライアント接続用。',
      docker:
        'Docker デーモンのリモート API（暗号化なし）。公開するとホストを乗っ取られるため注意が必要です。',
      'docker-tls': 'TLS で保護された Docker デーモンのリモート API。',
      'etcd-client':
        'etcd のクライアント接続用。Kubernetes のデータストアでもあります。',
      'etcd-peer': 'etcd のクラスタ内ノード間通信用。',
      'dev-3000':
        'Node.js（Express・Next.js）や Ruby on Rails の開発サーバーでよく使われます。',
      squid: 'Squid などのプロキシサーバーの定番ポート。',
      mysql: 'MySQL および MariaDB の標準ポート。',
      rdp: 'Windows のリモートデスクトップ（RDP）。インターネットへの直接公開は避けるのが一般的です。',
      stun: 'NAT 越えのための STUN / TURN。WebRTC で使われます。',
      svn: 'Subversion のサーバー（svnserve）。',
      'ipsec-nat-t': 'NAT 越えの IPsec（NAT-T）。IPsec VPN で使われます。',
      sip: 'IP電話のセッション制御（SIP）。',
      sips: 'TLS で暗号化された SIP。',
      vite: 'Vite の開発サーバーの既定ポート。',
      xmpp: 'XMPP（Jabber）のクライアント接続用。',
      mdns: 'mDNS（Bonjour・Avahi）によるローカルネットワーク内の名前解決・機器探索。',
      postgresql: 'PostgreSQL の標準ポート。',
      amqps: 'TLS で暗号化された AMQP。',
      amqp: 'AMQP（RabbitMQ など）のメッセージキュー用。',
      vnc: 'VNC（RFB）によるリモートデスクトップ。画面ごとに 5901、5902 … と続きます。',
      couchdb: 'Apache CouchDB の HTTP API。',
      winrm:
        'WinRM（Windows リモート管理）の HTTP 用。PowerShell リモート実行で使われます。',
      'winrm-tls': 'WinRM（Windows リモート管理）の HTTPS 用。',
      x11: 'X Window System（X11）のリモート表示。ディスプレイごとに 6001 … と続きます。',
      redis: 'Redis の標準ポート。認証なしで公開しない設定が重要です。',
      'kubernetes-api': 'Kubernetes の API サーバーでよく使われるポート。',
      'dev-8000':
        'Django の runserver や python -m http.server などの開発サーバーでよく使われます。',
      'http-alt':
        'HTTP の代替ポート。開発用のWebサーバーやプロキシ、Tomcat などで広く使われます。',
      'https-alt':
        'HTTPS の代替ポートとして慣例的に使われます。Tomcat や管理画面などです。',
      mqtts: 'TLS で暗号化された MQTT。',
      jupyter: 'Jupyter Notebook / JupyterLab の既定ポート。',
      kafka: 'Apache Kafka ブローカーの既定ポート。',
      elasticsearch: 'Elasticsearch の HTTP API の既定ポート。',
      git: 'Git プロトコル（git://）。認証・暗号化がなく、読み取り専用の公開に使われます。',
      memcached: 'Memcached の標準ポート。',
      mongodb: 'MongoDB の標準ポート。',
      wireguard: 'WireGuard VPN でよく使われる既定の待ち受けポート（UDP）。',
    },

    howToHeading: '使い方',
    howToSteps: [
      '検索欄にポート番号（443）、範囲（8000-8100）、サービス名（ssh）、用途のキーワード（データベース）を入力します。',
      'カテゴリとプロトコルのボタンで、Web・メール・TCP のみなどに絞り込みます。',
      '一覧でサービス名と用途、TCP / UDP の区別を確認します。',
    ],
    notesHeading: '注意事項',
    notes: [
      'ポート番号は IANA の登録と、広く知られた用途に基づく目安です。網羅的な一覧ではなく、主要なものだけを掲載しています。',
      '「慣例」と表示したポートは IANA の正式な割り当てではなく、開発現場で広く使われている既定値です。アプリの設定で変更できます。',
      '同じ番号でも設定やソフトウェアによって別の用途に使われることがあります。実際の待ち受け状況は netstat や ss コマンドで確認してください。',
      'Well-known ポートは 0〜1023、登録ポートは 1024〜49151、動的・プライベートポートは 49152〜65535 です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'well-known ポート',
        description:
          '0〜1023 番の範囲で、HTTP（80）や SSH（22）など代表的なサービスに割り当てられたポートです。Unix 系では待ち受けに管理者権限が必要です。',
      },
      {
        term: 'TCP と UDP',
        description:
          'TCP は接続を確立して順序と到達を保証する方式、UDP は接続なしで軽く送る方式です。同じ番号でも別のプロトコルとして扱われます。',
      },
      {
        term: 'IANA',
        description:
          'ポート番号やプロトコルの割り当てを管理している組織です。登録済みのサービス名と番号の対応表を公開しています。',
      },
      {
        term: 'STARTTLS と暗黙の TLS',
        description:
          '平文で接続してから暗号化に切り替えるのが STARTTLS（587・143 など）、最初から暗号化して接続するのが暗黙の TLS（465・993・995 など）です。',
      },
    ],
  },
  en: {
    title: 'Port Number List & Search (TCP/UDP Well-Known Ports)',
    description:
      'Look up TCP/UDP port numbers such as 22, 80, 443, 3306, and 5432 by number, range, or service name, with what each is used for. Runs in your browser.',
    h1: 'Port Number List & Search',
    introHtml:
      'Look up commonly used ports by number, range (for example 8000-8100), service name, or a keyword about what they do. You can filter by TCP or UDP and by category such as web, mail, or databases. For web server responses, see the <a href="/en/tools/http-status-codes/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTTP Status Codes</a> list; to convert IP address notations, try the <a href="/en/tools/ip-address-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">IP Address Converter</a>.',

    searchLabel: 'Search by port, range, or service name',
    searchPlaceholder: 'e.g. 443 / 8000-8100 / ssh / database',
    searchHint:
      'A number on its own matches that exact port. You can also enter a range such as 8000-8100. Separate several words with spaces to show only ports that match all of them.',
    categoryLabel: 'Filter by category',
    protocolLabel: 'Filter by protocol',
    allLabel: 'All',
    categories: {
      web: 'Web',
      mail: 'Mail',
      remote: 'Remote access',
      file: 'File sharing & transfer',
      database: 'Databases',
      network: 'Network infrastructure',
      messaging: 'Messaging & voice',
      devops: 'Dev & infrastructure',
      other: 'Other',
    },
    countTemplate: 'Showing {shown} of {total}',
    noResults: 'No matching ports.',
    unofficialBadge: 'Convention',
    unofficialNote:
      'Not an official IANA assignment; a widely used default by convention.',

    ports: {
      'ftp-data': 'FTP data transfer (active mode).',
      ftp: 'FTP control connection. Passwords travel in plain text, so SFTP or FTPS is preferred today.',
      ssh: 'Secure remote login over SSH, plus file transfer with SFTP and scp.',
      telnet:
        'Remote login over Telnet. Traffic is not encrypted, so SSH has largely replaced it.',
      smtp: 'Mail delivery between mail servers (SMTP).',
      whois: 'WHOIS queries for domain and IP registration data.',
      dns: 'Name resolution (DNS). Ordinary queries use UDP; large responses and zone transfers use TCP.',
      'dhcp-server': 'Port a DHCP server uses to hand out IP addresses.',
      'dhcp-client': 'Port a DHCP client uses to receive its configuration.',
      tftp: 'Simple file transfer without authentication (TFTP), used for device configs and PXE boot.',
      http: 'Unencrypted web traffic (HTTP).',
      kerberos: 'Kerberos authentication, used for Active Directory sign-in.',
      pop3: 'Mail retrieval over POP3, unencrypted.',
      rpcbind:
        'rpcbind (portmapper), which tracks Unix RPC services. NFS relies on it.',
      ntp: 'Time synchronization (NTP).',
      msrpc: 'Windows Remote Procedure Call (RPC) endpoint mapper.',
      'netbios-ns':
        'NetBIOS name resolution, used by legacy Windows network sharing.',
      'netbios-dgm':
        'NetBIOS datagram service, used by legacy Windows network sharing.',
      'netbios-ssn':
        'NetBIOS session service, used by legacy Windows file sharing.',
      imap: 'Mail retrieval over IMAP, keeping messages on the server so devices stay in sync. Unencrypted.',
      snmp: 'Monitoring and managing network devices (SNMP).',
      snmptrap: 'Port that receives SNMP traps (fault notifications).',
      bgp: 'BGP, used for routing between networks on the Internet.',
      ldap: 'Directory service queries (LDAP), used by Active Directory and OpenLDAP.',
      https: 'Encrypted web traffic (HTTPS). UDP 443 carries HTTP/3 (QUIC).',
      smb: 'Windows file sharing (SMB / CIFS), also used by Samba. It should not normally be exposed to the Internet.',
      smtps:
        'SMTP over implicit TLS. RFC 8314 brought it back as an option for mail submission.',
      isakmp: 'Key exchange (IKE) for IPsec VPNs.',
      modbus:
        'Modbus/TCP, an industrial protocol used by factory and plant equipment.',
      syslog: 'Log forwarding (Syslog).',
      lpd: 'Printing to network printers (LPD).',
      rip: 'Route exchange between routers (RIP).',
      'dhcpv6-client': 'Port DHCPv6 clients use.',
      'dhcpv6-server': 'Port DHCPv6 servers and relays use.',
      rtsp: 'Stream control for IP cameras and media devices (RTSP).',
      submission:
        'Mail clients sending outgoing mail to a server (STARTTLS supported). Used to get around ISP blocks on port 25.',
      ipp: 'Printing to network printers (IPP), used by CUPS.',
      ldaps: 'LDAP over TLS.',
      dot: 'DNS over TLS (TCP) and DNS over QUIC (UDP).',
      rsync:
        'The rsync daemon for file sync and backup. rsync over SSH uses port 22 instead.',
      'ftps-data': 'Data transfer for FTP over TLS (FTPS).',
      ftps: 'Control connection for FTP over TLS (FTPS).',
      imaps: 'IMAP over TLS.',
      pop3s: 'POP3 over TLS.',
      socks: 'SOCKS proxy, also common with SSH dynamic port forwarding.',
      openvpn: 'Default OpenVPN port. UDP is the usual choice.',
      mssql: 'Default port for Microsoft SQL Server.',
      'mssql-browser':
        'SQL Server Browser service, which locates named instances.',
      oracle: 'Default port for the Oracle Database listener (TNS).',
      l2tp: 'L2TP VPN, typically combined with IPsec as L2TP/IPsec.',
      pptp: 'PPTP VPN. It has known security weaknesses and is no longer recommended.',
      radius: 'RADIUS authentication, used for Wi-Fi 802.1X and VPN sign-in.',
      'radius-acct': 'RADIUS accounting (usage records).',
      mqtt: 'MQTT, a lightweight messaging protocol for IoT. Unencrypted.',
      ssdp: 'UPnP device discovery (SSDP).',
      nfs: 'Network File System (NFS) for Unix-like systems.',
      zookeeper: 'Client connections to Apache ZooKeeper.',
      docker:
        'Docker daemon remote API without encryption. Exposing it lets anyone take over the host.',
      'docker-tls': 'Docker daemon remote API protected with TLS.',
      'etcd-client':
        'etcd client connections. etcd is also the Kubernetes data store.',
      'etcd-peer': 'Traffic between etcd cluster members.',
      'dev-3000':
        'Commonly used by Node.js (Express, Next.js) and Ruby on Rails development servers.',
      squid: 'The conventional port for Squid and similar proxy servers.',
      mysql: 'Default port for MySQL and MariaDB.',
      rdp: 'Windows Remote Desktop (RDP). It should not normally be exposed directly to the Internet.',
      stun: 'STUN / TURN for NAT traversal, used by WebRTC.',
      svn: 'Subversion server (svnserve).',
      'ipsec-nat-t': 'IPsec NAT traversal (NAT-T), used by IPsec VPNs.',
      sip: 'Session control for VoIP calls (SIP).',
      sips: 'SIP over TLS.',
      vite: 'Default port of the Vite dev server.',
      xmpp: 'Client connections for XMPP (Jabber).',
      mdns: 'mDNS (Bonjour, Avahi) name resolution and device discovery on the local network.',
      postgresql: 'Default port for PostgreSQL.',
      amqps: 'AMQP over TLS.',
      amqp: 'AMQP message queuing, used by RabbitMQ and others.',
      vnc: 'Remote desktop over VNC (RFB). Further displays use 5901, 5902, and so on.',
      couchdb: 'HTTP API of Apache CouchDB.',
      winrm:
        'WinRM (Windows Remote Management) over HTTP, used for PowerShell remoting.',
      'winrm-tls': 'WinRM (Windows Remote Management) over HTTPS.',
      x11: 'Remote display for the X Window System (X11). Further displays use 6001 and up.',
      redis: 'Default port for Redis. Do not expose it without authentication.',
      'kubernetes-api': 'Commonly used by the Kubernetes API server.',
      'dev-8000':
        'Commonly used by development servers such as Django’s runserver and python -m http.server.',
      'http-alt':
        'Alternate HTTP port, widely used by development web servers, proxies, and Tomcat.',
      'https-alt':
        'Alternate HTTPS port by convention, seen with Tomcat and admin consoles.',
      mqtts: 'MQTT over TLS.',
      jupyter: 'Default port of Jupyter Notebook and JupyterLab.',
      kafka: 'Default port of an Apache Kafka broker.',
      elasticsearch: 'Default port of the Elasticsearch HTTP API.',
      git: 'The Git protocol (git://). No authentication or encryption; used for read-only public access.',
      memcached: 'Default port for Memcached.',
      mongodb: 'Default port for MongoDB.',
      wireguard: 'Commonly used listening port for WireGuard VPN (UDP).',
    },

    howToHeading: 'How to use',
    howToSteps: [
      'Type a port (443), a range (8000-8100), a service name (ssh), or a keyword (database) in the search box.',
      'Use the category and protocol buttons to narrow the list to web, mail, TCP only, and so on.',
      'Read the service name, its purpose, and the TCP / UDP details in the list.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Entries are based on IANA registrations and widely known uses. This is a curated list of the main ports, not an exhaustive one.',
      'Ports marked "Convention" are not official IANA assignments but defaults widely used in development. You can change them in each app’s settings.',
      'The same number can be used for something else depending on the setup. Check what is really listening with netstat or ss.',
      'Well-known ports are 0-1023, registered ports are 1024-49151, and dynamic/private ports are 49152-65535.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Well-known ports',
        description:
          'Ports 0-1023, assigned to core services such as HTTP (80) and SSH (22). On Unix-like systems, listening on them requires administrator privileges.',
      },
      {
        term: 'TCP vs. UDP',
        description:
          'TCP sets up a connection and guarantees ordered delivery; UDP sends lightweight datagrams with no connection. The same number is treated separately for each protocol.',
      },
      {
        term: 'IANA',
        description:
          'The organization that manages protocol and port assignments. It publishes the registry that maps service names to port numbers.',
      },
      {
        term: 'STARTTLS vs. implicit TLS',
        description:
          'STARTTLS connects in plain text and then upgrades to encryption (587, 143). Implicit TLS encrypts from the first byte (465, 993, 995).',
      },
    ],
  },
};
