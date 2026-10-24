import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '宅急便のサイズは何で決まりますか？',
      answer:
        '3辺（縦・横・高さ）の合計と重量の両方で決まり、大きいほうの区分が適用されます。たとえば3辺合計が80cm以内でも、重さが5kgを超えれば100サイズです。60サイズは2kg、80は5kg、100は10kg、120は15kg、140は20kg、160は25kg、180と200は30kgまでが目安です（令和8年時点）。',
    },
    {
      question: 'ゆうパックの区分と上限を教えてください。',
      answer:
        'ゆうパックは3辺合計で60・80・100・120・140・160・170サイズに分かれ、最大は3辺合計170cm以内です。重量はどの区分でも25kg以内で、宅急便のように重量で区分が上がることはありません（令和8年時点）。',
    },
    {
      question: '薄い荷物はどのサービスで送れますか？',
      answer:
        '厚さ3cm以内なら、ゆうパケット（3辺合計60cm・長辺34cm・1kgまで）、レターパックライト（34×24.8cm・4kgまで）、定形外郵便（規格内は1kgまで）などが候補です。厚さ3.5cm以内ならネコポス（31.2×22.8cm・1kgまで）も対象ですが、提供状況は公式サイトで確認してください。このツールで一括判定できます。',
    },
    {
      question: '1cmだけ上限を超えたときはどうなりますか？',
      answer:
        '上限ちょうどまでは同じ区分で、超えた分から次の区分または利用不可になります。たとえば宅急便は3辺合計60cmで60サイズ、61cmなら80サイズです。収まらない場合は、どの上限をいくつ超えたかを結果に表示するので、梱包を見直す目安にしてください。',
    },
    {
      question: '実際の区分とこのツールの結果が違うことはありますか？',
      answer:
        'あります。区分は集荷時やお店の窓口での計測で決まり、梱包の膨らみや測り方で差が出ます。また各社の条件やサービス内容は改定されるため、このツールは令和8年時点の公式条件にもとづく目安です。発送前に公式サイトで最新の条件を確認してください。',
    },
  ],
  en: [
    {
      question: 'What decides the Takkyubin size class?',
      answer:
        'Both the sum of the three sides and the weight, and the larger class applies. A parcel with a three-side sum under 80 cm still becomes size 100 if it weighs over 5 kg. As a guide, size 60 allows 2 kg, 80 allows 5 kg, 100 allows 10 kg, 120 allows 15 kg, 140 allows 20 kg, 160 allows 25 kg, and 180 and 200 allow 30 kg (as of 2026).',
    },
    {
      question: 'What are the Yu-Pack classes and limits?',
      answer:
        'Yu-Pack has classes 60, 80, 100, 120, 140, 160 and 170 by the sum of the three sides, with a maximum of 170 cm total. Every class allows up to 25 kg, and unlike Takkyubin the weight does not push the parcel into a higher class (as of 2026).',
    },
    {
      question: 'Which services can carry a thin parcel?',
      answer:
        'If it is 3 cm thick or less, candidates include Yu-Packet (60 cm total, 34 cm longest side, up to 1 kg), Letter Pack Light (34 x 24.8 cm, up to 4 kg) and non-standard-size mail (up to 1 kg within the standard size). Up to 3.5 cm also qualifies for Nekopos (31.2 x 22.8 cm, up to 1 kg), but check its availability on the official site. This tool checks them all at once.',
    },
    {
      question: 'What if my parcel is only 1 cm over a limit?',
      answer:
        'Anything up to and including the limit stays in the same class; beyond it the parcel moves to the next class or becomes ineligible. For Takkyubin, 60 cm total is size 60 and 61 cm is size 80. When a parcel does not fit, the result shows which limit is exceeded and by how much, which helps you repack it.',
    },
    {
      question: 'Can the real class differ from this tool?',
      answer:
        'Yes. The class is decided by measurement at pickup or at the counter, and bulging or measuring methods can change the result. Conditions and services also change over time, so this tool is a guide based on the official conditions as of 2026. Check the official sites for the latest conditions before you ship.',
    },
  ],
};
