import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '/24や/16のスラッシュ以下の数字は何を表しますか？',
      answer:
        'ネットワーク部に使うビット数です。/24なら先頭24ビットがネットワーク部、残り8ビットがホスト部で、サブネットマスクは255.255.255.0になります。数字が小さいほど大きなネットワークを表します。',
    },
    {
      question: '利用可能なホスト数はどう計算されますか？',
      answer:
        'アドレス総数からネットワークアドレスとブロードキャストアドレスの2つを引いた数です。/24なら256 − 2 = 254台です。/31と/32は特例として別に扱われます。',
    },
    {
      question: 'IPv6にも対応していますか？',
      answer:
        '現在はIPv4のみの対応です。IPv6のプレフィックス計算はできません。',
    },
  ],
  en: [
    {
      question: 'What does the number after the slash (/24, /16) mean?',
      answer:
        'It is the number of leading bits used for the network portion. /24 means 24 network bits and 8 host bits, giving the subnet mask 255.255.255.0. Smaller numbers describe larger networks.',
    },
    {
      question: 'How is the number of usable hosts calculated?',
      answer:
        'It is the total number of addresses minus the network and broadcast addresses. For /24 that is 256 − 2 = 254. /31 and /32 are handled as special cases.',
    },
    {
      question: 'Does it support IPv6?',
      answer:
        'Currently only IPv4 is supported. IPv6 prefix calculations are not available.',
    },
  ],
};
