import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ダウンロード時間はどのように計算していますか？',
      answer:
        'ファイルサイズをビットに直し（1バイト=8ビット）、回線速度に実効速度の割合を掛けた値で割っています。たとえば1GBを100Mbpsで実効100%なら、8,000Mビット÷100Mbps=80秒です。',
    },
    {
      question: 'MbpsとMB/sは何が違いますか？',
      answer:
        'Mbpsは1秒あたりのメガビット、MB/sは1秒あたりのメガバイトで、1MB/s=8Mbpsです。回線の契約速度はMbpsやGbps、ダウンロード画面の速度表示はMB/sが多いため、単位を揃えて比べてください。',
    },
    {
      question: '実効速度の割合はどのくらいにすればよいですか？',
      answer:
        '有線接続で混雑が少なければ80〜90%、Wi-Fiや夜間の混雑時は50〜70%程度が目安です。実際の速度が分かる場合は、速度測定の結果を回線速度に入力して割合を100%にすると正確に近づきます。',
    },
    {
      question: 'ファイルサイズの表示が実際と少し違うのはなぜですか？',
      answer:
        'このツールは1KB=1,000バイトで計算しますが、OSによっては1KB=1,024バイトで表示します（KiBやMiBに相当）。差は約2.4%（GBで約7%）で、所要時間の目安としては十分なことが多いです。',
    },
  ],
  en: [
    {
      question: 'How is the download time calculated?',
      answer:
        'The file size is converted to bits (1 byte = 8 bits) and divided by your connection speed multiplied by the real-world speed factor. For example, 1 GB over 100 Mbps at 100% is 8,000 megabits ÷ 100 Mbps = 80 seconds.',
    },
    {
      question: 'What is the difference between Mbps and MB/s?',
      answer:
        'Mbps is megabits per second and MB/s is megabytes per second, and 1 MB/s = 8 Mbps. Internet plans are quoted in Mbps or Gbps while download dialogs often show MB/s, so convert to the same unit before comparing.',
    },
    {
      question: 'What real-world speed percentage should I use?',
      answer:
        'Around 80-90% suits a wired connection with little congestion, and 50-70% is typical for Wi-Fi or busy evening hours. If you know your measured speed, enter it as the connection speed and set the percentage to 100.',
    },
    {
      question: 'Why might the file size shown on my system look different?',
      answer:
        'This tool uses decimal units (1 KB = 1,000 bytes), while some systems show 1 KB as 1,024 bytes (KiB, MiB). The gap is about 2.4% at KB scale and about 7% at GB scale, which is usually fine for an estimate.',
    },
  ],
};
