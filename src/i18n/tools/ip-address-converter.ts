import type { Locale } from '../../data/tools';
import type {
  IpInputFormat,
  IpRowKey,
  IpType,
} from '../../lib/tools/ip-address-converter';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface IpAddressConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  defaultInput: string;
  errorMessage: string;
  detectedLabel: string;
  typeLabel: string;
  rowLabels: Record<IpRowKey, string>;
  formatLabels: Record<IpInputFormat, string>;
  typeLabels: Record<IpType, string>;
  copyResult: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const ipAddressConverterContent: Record<
  Locale,
  IpAddressConverterPageContent
> = {
  ja: {
    title: 'IPアドレス変換（IPv4の10進・16進・2進／IPv6の短縮・展開）',
    description:
      'IPv4アドレスを10進整数・16進・2進に相互変換し、IPv6アドレスを短縮・展開・完全展開表記にそろえる無料ツール。入力形式は自動判別。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'IPアドレス変換ツール（IPv4・IPv6）',
    introHtml:
      'IPアドレスを入力すると、表記を自動判別して別の表記にまとめて変換します。IPv4は「192.168.1.1」「3232235777」「0xC0A80101」「2進32桁」のどれでも入力でき、ドット区切り・10進整数・16進・2進を一覧表示します。IPv6は短縮（::）・展開・ゼロ埋めの完全展開に加え、128bit整数も確認できます。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。サブネットの計算には <a href="/tools/cidr-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CIDR/サブネット計算機</a> をご利用ください。',
    inputLabel: 'IPアドレス',
    inputPlaceholder: '192.168.1.1 / 3232235777 / 2001:db8::1',
    defaultInput: '192.168.1.1',
    errorMessage:
      '形式が正しくありません（例: 192.168.1.1、3232235777、0xC0A80101、2001:db8::1）',
    detectedLabel: '入力形式',
    typeLabel: 'アドレスの種類',
    rowLabels: {
      ipv4: 'IPv4（ドット区切り）',
      decimal: '10進整数',
      hex: '16進',
      binary: '2進',
      'ipv4-mapped-ipv6': 'IPv4射影IPv6アドレス',
      'ipv6-compressed': 'IPv6 短縮表記',
      'ipv6-expanded': 'IPv6 展開表記',
      'ipv6-full': 'IPv6 完全展開（ゼロ埋め）',
      'ipv6-embedded-ipv4': '埋め込まれたIPv4',
    },
    formatLabels: {
      'ipv4-dotted': 'IPv4（ドット区切り10進）',
      'ipv4-decimal': 'IPv4（10進整数）',
      'ipv4-hex': 'IPv4（16進）',
      'ipv4-binary': 'IPv4（2進32桁）',
      'ipv4-binary-dotted': 'IPv4（ドット区切り2進）',
      ipv6: 'IPv6',
    },
    typeLabels: {
      unspecified: '未指定アドレス',
      loopback: 'ループバック',
      private: 'プライベートアドレス',
      shared: 'キャリアグレードNAT用（共有アドレス空間）',
      'link-local': 'リンクローカル',
      'unique-local': 'ユニークローカル（IPv6のプライベート相当）',
      multicast: 'マルチキャスト',
      reserved: '予約済み',
      broadcast: '限定ブロードキャスト',
      documentation: 'ドキュメント用（例示用）',
      'ipv4-mapped': 'IPv4射影アドレス',
      public: 'グローバル（その他）',
    },
    copyResult: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      'IPv4は、ドット区切り10進、10進整数（0〜4294967295）、0x付き16進、32桁の2進（0b付き可）、8桁ずつドットで区切った2進を自動判別します。',
      '16進は0xを付けて入力してください。0xなしの数字は10進整数として扱います。',
      '先頭にゼロが付く10進表記（例: 192.168.001.001）は、8進数と混同されるおそれがあるためエラーにしています。',
      'IPv6は[2001:db8::1]のような角括弧付きや、::ffff:192.168.1.1のようなIPv4埋め込み表記も読み取れます。%eth0のようなゾーンIDや、/64のようなプレフィックス長には対応していません。',
      'IPv6の短縮表記はRFC 5952に従い、2つ以上連続する0のうち最長のものを::にまとめ、英字は小文字で出力します。',
      'アドレスの種類は代表的な範囲だけの判定です。実際の割り当て状況までは判定しません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '10進整数表記（例: 3232235777）',
        description:
          'IPv4アドレスの32bitをそのまま1つの整数として書いたものです。192.168.1.1は 192×2^24 + 168×2^16 + 1×2^8 + 1 = 3232235777 になります。ブラウザによってはURLに入れてもアクセスできる場合があります。',
      },
      {
        term: 'IPv6の短縮表記（::）',
        description:
          '各グループ先頭の0を省き、連続する0のグループを :: に置き換えた表記です。:: は1つのアドレスの中で1回しか使えません。',
      },
      {
        term: 'IPv4射影IPv6アドレス（::ffff:a.b.c.d）',
        description:
          'IPv4アドレスをIPv6の形式で表すためのアドレスです。上位80bitが0、次の16bitがffffで、下位32bitにIPv4アドレスが入ります。',
      },
      {
        term: 'ユニークローカルアドレス（fc00::/7）',
        description:
          'IPv6でプライベートネットワーク内に使うアドレス帯です。インターネットにはルーティングされません。',
      },
    ],
  },
  en: {
    title: 'IP Address Converter (IPv4 Decimal/Hex/Binary, IPv6)',
    description:
      'Convert IPv4 to decimal, hex and binary, and compress or expand IPv6 addresses. Auto-detects the format. Runs in your browser; nothing is uploaded.',
    h1: 'IP Address Converter (IPv4 & IPv6)',
    introHtml:
      'Type an IP address and this tool detects its notation and shows every other form at once. IPv4 can be entered as dotted decimal ("192.168.1.1"), a plain integer ("3232235777"), hex ("0xC0A80101") or 32-digit binary, and you get dotted, decimal, hex and binary back. IPv6 is shown compressed (::), expanded and fully zero-padded, along with the 128-bit integer. Everything runs in your browser, so nothing you type is sent to a server. For subnet math, use the <a href="/en/tools/cidr-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CIDR / Subnet Calculator</a>.',
    inputLabel: 'IP address',
    inputPlaceholder: '192.168.1.1 / 3232235777 / 2001:db8::1',
    defaultInput: '192.168.1.1',
    errorMessage:
      'Invalid format (e.g. 192.168.1.1, 3232235777, 0xC0A80101 or 2001:db8::1)',
    detectedLabel: 'Detected format',
    typeLabel: 'Address type',
    rowLabels: {
      ipv4: 'IPv4 (dotted decimal)',
      decimal: 'Decimal integer',
      hex: 'Hex',
      binary: 'Binary',
      'ipv4-mapped-ipv6': 'IPv4-mapped IPv6',
      'ipv6-compressed': 'IPv6 compressed',
      'ipv6-expanded': 'IPv6 expanded',
      'ipv6-full': 'IPv6 full (zero-padded)',
      'ipv6-embedded-ipv4': 'Embedded IPv4',
    },
    formatLabels: {
      'ipv4-dotted': 'IPv4 (dotted decimal)',
      'ipv4-decimal': 'IPv4 (decimal integer)',
      'ipv4-hex': 'IPv4 (hex)',
      'ipv4-binary': 'IPv4 (32-bit binary)',
      'ipv4-binary-dotted': 'IPv4 (dotted binary)',
      ipv6: 'IPv6',
    },
    typeLabels: {
      unspecified: 'Unspecified',
      loopback: 'Loopback',
      private: 'Private',
      shared: 'Carrier-grade NAT (shared address space)',
      'link-local': 'Link-local',
      'unique-local': 'Unique local (IPv6 private)',
      multicast: 'Multicast',
      reserved: 'Reserved',
      broadcast: 'Limited broadcast',
      documentation: 'Documentation',
      'ipv4-mapped': 'IPv4-mapped',
      public: 'Global (other)',
    },
    copyResult: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'IPv4 input is auto-detected as dotted decimal, a decimal integer (0 to 4294967295), 0x-prefixed hex, 32-digit binary (an optional 0b prefix is fine), or binary in four dotted 8-bit groups.',
      'Add the 0x prefix for hex. Digits without a prefix are always read as a decimal integer.',
      'Decimal parts with leading zeros (e.g. 192.168.001.001) are rejected because they can be mistaken for octal.',
      'IPv6 accepts square brackets such as [2001:db8::1] and embedded IPv4 such as ::ffff:192.168.1.1. Zone IDs (%eth0) and prefix lengths (/64) are not supported.',
      'Compressed IPv6 follows RFC 5952: the longest run of two or more zero groups becomes ::, and letters are lowercase.',
      'The address type only checks well-known ranges. It does not tell you whether the address is actually allocated.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Decimal integer form (e.g. 3232235777)',
        description:
          'The 32 bits of an IPv4 address written as a single number. 192.168.1.1 is 192×2^24 + 168×2^16 + 1×2^8 + 1 = 3232235777. Some browsers will even open it in a URL.',
      },
      {
        term: 'IPv6 compression (::)',
        description:
          'Leading zeros in each group are dropped and a run of all-zero groups is replaced with ::. The :: may appear only once in an address.',
      },
      {
        term: 'IPv4-mapped IPv6 address (::ffff:a.b.c.d)',
        description:
          'A way to write an IPv4 address in IPv6 form. The upper 80 bits are zero, the next 16 bits are ffff, and the lower 32 bits hold the IPv4 address.',
      },
      {
        term: 'Unique local address (fc00::/7)',
        description:
          'The IPv6 range for private networks. These addresses are not routed on the public internet.',
      },
    ],
  },
};
