import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface FieldRow {
  id:
    | 'network-address'
    | 'broadcast-address'
    | 'subnet-mask'
    | 'wildcard-mask'
    | 'first-host'
    | 'last-host'
    | 'usable-host-count'
    | 'total-address-count';
  label: string;
}

export interface CidrCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  fieldRows: FieldRow[];
  copyResult: string;
  copied: string;
  copyFailed: string;
  errorMessage: string;
  notesHeading: string;
  notes: string[];
  clipboardIpAddress: string;
  clipboardNetworkAddress: string;
  clipboardBroadcastAddress: string;
  clipboardSubnetMask: string;
  clipboardWildcardMask: string;
  clipboardFirstHost: string;
  clipboardLastHost: string;
  clipboardUsableHostCount: string;
  clipboardTotalAddressCount: string;
  emptyValuePlaceholder: string;
  numberLocale: string;
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cidrCalculatorContent: Record<Locale, CidrCalculatorPageContent> =
  {
    ja: {
      title: 'CIDR/サブネット計算機（ネットワークアドレス・ホスト数計算）',
      description:
        'CIDR表記（例: 192.168.1.0/24）やIPアドレス+サブネットマスクから、ネットワークアドレス・ブロードキャストアドレス・サブネットマスク・利用可能ホスト数を自動計算する無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: 'CIDR/サブネット計算機',
      introHtml:
        'IPv4アドレスとCIDRプレフィックス（例: 192.168.1.10/24）またはサブネットマスク（例: 192.168.1.10/255.255.255.0）を入力すると、ネットワークアドレス・ブロードキャストアドレス・サブネットマスク・ワイルドカードマスク・利用可能ホストの範囲と個数をリアルタイムで計算します。ネットワーク設計やサブネット分割の確認に便利です。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。パーミッション設定の確認には <a href="/tools/chmod-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Chmodパーミッション計算機</a> もあわせてご利用ください。',
      inputLabel: 'IPアドレス / CIDR',
      inputPlaceholder: '192.168.1.10/24',
      fieldRows: [
        { id: 'network-address', label: 'ネットワークアドレス' },
        { id: 'broadcast-address', label: 'ブロードキャストアドレス' },
        { id: 'subnet-mask', label: 'サブネットマスク' },
        { id: 'wildcard-mask', label: 'ワイルドカードマスク' },
        { id: 'first-host', label: '最初の利用可能ホスト' },
        { id: 'last-host', label: '最後の利用可能ホスト' },
        { id: 'usable-host-count', label: '利用可能ホスト数' },
        { id: 'total-address-count', label: '総アドレス数' },
      ],
      copyResult: '結果をコピー',
      copied: 'コピーしました',
      copyFailed: 'コピーに失敗しました',
      errorMessage:
        '形式が正しくありません（例: 192.168.1.10/24 または 192.168.1.10/255.255.255.0）',
      notesHeading: '注意事項',
      notes: [
        '対応しているのはIPv4のみです。IPv6アドレスには対応していません。',
        'プレフィックス部分は「/24」のようなビット数指定と「/255.255.255.0」のようなサブネットマスク指定のどちらでも入力できます。',
        '「01」のような先頭にゼロが付くIPアドレスの表記は、8進数との解釈の混同を避けるためエラーとして扱います。',
        '/31はRFC 3021に基づきポイントツーポイント回線用として2アドレスとも利用可能、/32は単一ホストを表す特殊な表記として扱います。',
      ],
      clipboardIpAddress: 'IPアドレス',
      clipboardNetworkAddress: 'ネットワークアドレス',
      clipboardBroadcastAddress: 'ブロードキャストアドレス',
      clipboardSubnetMask: 'サブネットマスク',
      clipboardWildcardMask: 'ワイルドカードマスク',
      clipboardFirstHost: '最初の利用可能ホスト',
      clipboardLastHost: '最後の利用可能ホスト',
      clipboardUsableHostCount: '利用可能ホスト数',
      clipboardTotalAddressCount: '総アドレス数',
      emptyValuePlaceholder: '-',
      numberLocale: 'ja-JP',
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'CIDR表記（例: 192.168.1.0/24）',
          description:
            'IPアドレスの後ろに「/」区切りでプレフィックス長（ネットワーク部のビット数）を付けた表記です。「/24」なら先頭24ビットがネットワーク部、残り8ビットがホスト部を表します。',
        },
        {
          term: 'サブネットマスク（例: 255.255.255.0）',
          description:
            'IPアドレスのうちどこまでがネットワーク部かを、ビットを1で埋めたドット区切り表記で表したものです。CIDRのプレフィックス長と1対1で対応します（/24 = 255.255.255.0）。',
        },
        {
          term: 'ネットワークアドレス・ブロードキャストアドレス',
          description:
            'ネットワークアドレスはそのサブネットの先頭アドレス（ホスト部が全て0）で、ネットワーク自体を識別するために使われホストには割り当てられません。ブロードキャストアドレスは末尾のアドレス（ホスト部が全て1）で、そのサブネット内の全ホストへの一斉送信に使われます。',
        },
        {
          term: 'ワイルドカードマスク',
          description:
            'サブネットマスクの各ビットを反転させたものです。Cisco機器のACL（アクセスリスト）設定などで、サブネットマスクの代わりに使われます。',
        },
        {
          term: '利用可能ホスト数',
          description:
            'そのサブネット内で実際に機器に割り当てられるアドレスの数です。通常はネットワークアドレスとブロードキャストアドレスの2つを除いた数になりますが、/31はRFC 3021によりポイントツーポイント回線用として2アドレスとも利用可能、/32は単一ホストを表す特殊な表記として1アドレスのみとして扱います。',
        },
      ],
    },
    en: {
      title: 'CIDR / Subnet Calculator (Network Address & Host Count)',
      description:
        'Calculate network and broadcast addresses, subnet mask, and usable hosts from CIDR (192.168.1.0/24). Runs in your browser; nothing is sent to a server.',
      h1: 'CIDR / Subnet Calculator',
      introHtml:
        'Enter an IPv4 address with a CIDR prefix (e.g. 192.168.1.10/24) or a subnet mask (e.g. 192.168.1.10/255.255.255.0), and this tool calculates the network address, broadcast address, subnet mask, wildcard mask, and the range and count of usable hosts in real time. Handy for network design and checking subnet splits. Everything happens in your browser, and nothing you type is ever sent to a server. If you need to check file permissions, try the <a href="/en/tools/chmod-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Chmod Permission Calculator</a> as well.',
      inputLabel: 'IP Address / CIDR',
      inputPlaceholder: '192.168.1.10/24',
      fieldRows: [
        { id: 'network-address', label: 'Network address' },
        { id: 'broadcast-address', label: 'Broadcast address' },
        { id: 'subnet-mask', label: 'Subnet mask' },
        { id: 'wildcard-mask', label: 'Wildcard mask' },
        { id: 'first-host', label: 'First usable host' },
        { id: 'last-host', label: 'Last usable host' },
        { id: 'usable-host-count', label: 'Usable host count' },
        { id: 'total-address-count', label: 'Total address count' },
      ],
      copyResult: 'Copy result',
      copied: 'Copied',
      copyFailed: 'Copy failed',
      errorMessage:
        'Invalid format (e.g. 192.168.1.10/24 or 192.168.1.10/255.255.255.0)',
      notesHeading: 'Notes',
      notes: [
        'Only IPv4 is supported; IPv6 addresses are not.',
        'The part after the slash can be either a bit-count prefix ("/24") or a dotted subnet mask ("/255.255.255.0").',
        'An IP address octet with a leading zero (e.g. "01") is treated as invalid, to avoid any ambiguity with octal interpretation.',
        '/31 is treated as a point-to-point link (RFC 3021) with both addresses usable, and /32 is treated as a single host with just 1 usable address.',
      ],
      clipboardIpAddress: 'IP address',
      clipboardNetworkAddress: 'Network address',
      clipboardBroadcastAddress: 'Broadcast address',
      clipboardSubnetMask: 'Subnet mask',
      clipboardWildcardMask: 'Wildcard mask',
      clipboardFirstHost: 'First usable host',
      clipboardLastHost: 'Last usable host',
      clipboardUsableHostCount: 'Usable host count',
      clipboardTotalAddressCount: 'Total address count',
      emptyValuePlaceholder: '-',
      numberLocale: 'en-US',
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'CIDR notation (e.g. 192.168.1.0/24)',
          description:
            'An IP address followed by a "/" and a prefix length (the number of network bits). "/24" means the first 24 bits are the network part and the remaining 8 bits are the host part.',
        },
        {
          term: 'Subnet mask (e.g. 255.255.255.0)',
          description:
            'A dotted-decimal value with the network-part bits set to 1, showing how much of the address is the network. It maps one-to-one to a CIDR prefix length (/24 = 255.255.255.0).',
        },
        {
          term: 'Network address & broadcast address',
          description:
            "The network address is the first address in a subnet (all host bits zero) and identifies the network itself — it can't be assigned to a host. The broadcast address is the last one (all host bits one) and is used to send to every host on that subnet at once.",
        },
        {
          term: 'Wildcard mask',
          description:
            'The bitwise inverse of a subnet mask, used in place of a subnet mask in access control list (ACL) configuration on Cisco devices, for example.',
        },
        {
          term: 'Usable host count',
          description:
            'The number of addresses that can actually be assigned to devices in a subnet. Normally this excludes the network and broadcast addresses, but /31 is treated as a point-to-point link (RFC 3021) with both addresses usable, and /32 is treated as a single host with just 1 usable address.',
        },
      ],
    },
  };
