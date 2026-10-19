import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'IPアドレスを10進整数に変換するとどうなりますか？',
      answer:
        'IPv4の4つの数字を256進数の各桁とみなして1つの整数にします。192.168.1.1は3232235777、127.0.0.1は2130706433です。0.0.0.0から255.255.255.255までが0〜4294967295に対応します。',
    },
    {
      question: '0xを付けない16進数や2進数は入力できますか？',
      answer:
        '数字だけの入力は10進整数として扱います。16進は0xC0A80101のように0xを付けてください。2進は0と1だけの32桁、または0b付き、8桁ずつドットで区切った形で入力できます。',
    },
    {
      question: 'IPv6の短縮表記はどのルールで作られますか？',
      answer:
        '各グループ先頭の0を省き、2つ以上連続する0のグループのうち最長のものを::にします。同じ長さが並ぶときは先頭側を優先し、英字は小文字にします（RFC 5952）。1つだけの0グループは短縮しません。',
    },
    {
      question: 'fe80::1%eth0 や 2001:db8::/64 は変換できますか？',
      answer:
        'ゾーンID（%eth0）とプレフィックス長（/64）には対応していません。アドレス部分だけを入力してください。IPv4のサブネット計算はCIDR/サブネット計算機で行えます。',
    },
  ],
  en: [
    {
      question: 'What is an IP address as a decimal integer?',
      answer:
        'The four IPv4 octets are treated as digits in base 256 and combined into one number. 192.168.1.1 becomes 3232235777 and 127.0.0.1 becomes 2130706433. The range 0.0.0.0 to 255.255.255.255 maps to 0 to 4294967295.',
    },
    {
      question: 'Can I enter hex or binary without a prefix?',
      answer:
        'Digits alone are read as a decimal integer. For hex, add 0x, as in 0xC0A80101. Binary can be 32 digits of 0 and 1, a 0b-prefixed value, or four dotted 8-bit groups.',
    },
    {
      question: 'How is the compressed IPv6 form chosen?',
      answer:
        'Leading zeros in each group are dropped and the longest run of two or more zero groups becomes ::. If two runs tie, the first one wins, and letters are lowercase (RFC 5952). A single zero group is never shortened.',
    },
    {
      question: 'Can it convert fe80::1%eth0 or 2001:db8::/64?',
      answer:
        'Zone IDs (%eth0) and prefix lengths (/64) are not supported, so enter just the address. For IPv4 subnet math, use the CIDR / Subnet Calculator.',
    },
  ],
};
