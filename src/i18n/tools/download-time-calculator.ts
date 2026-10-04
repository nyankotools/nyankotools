import type { Locale } from '../../data/tools';
import type {
  DownloadTimeError,
  SizeUnit,
  SpeedUnit,
} from '../../lib/tools/download-time-calculator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface DownloadTimeCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;

  sizeLabel: string;
  defaultSize: number;
  defaultSizeUnit: SizeUnit;
  speedLabel: string;
  sizeUnitLabel: string;
  speedUnitLabel: string;
  defaultSpeed: number;
  defaultSpeedUnit: SpeedUnit;
  /** 速度の単位の表示名 */
  speedUnits: Record<SpeedUnit, string>;
  efficiencyLabel: string;
  defaultEfficiency: number;
  efficiencyHint: string;

  errors: Record<DownloadTimeError, string>;

  timeLabel: string;
  effectiveSpeedLabel: string;
  /** {value} を数値に置き換える */
  effectiveSpeedText: string;
  /** 所要時間の表記。{n} を数値に置き換える */
  durationSeparator: string;
  unitDays: string;
  unitHours: string;
  unitMinutes: string;
  unitSeconds: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  /** コピー用のテキスト。{size} {speed} {time} を置き換える */
  copyTemplate: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const downloadTimeCalculatorContent: Record<
  Locale,
  DownloadTimeCalculatorPageContent
> = {
  ja: {
    title: 'ダウンロード時間計算機（ファイルサイズと回線速度から所要時間）',
    description:
      'ファイルサイズと回線速度（Mbps・Gbps・MB/s）から、ダウンロードにかかる時間を計算します。実効速度の割合も指定でき、ゲームや動画の容量の目安確認に便利です。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ダウンロード時間計算機（ファイルサイズ÷回線速度）',
    introHtml:
      'ファイルサイズと回線速度を入力すると、ダウンロードにかかる時間を計算します。回線速度は Mbps・Gbps などのビット単位でも、MB/s のバイト単位でも指定でき、実際の速度が契約速度より遅くなる分を「実効速度の割合」で反映できます。ゲームのアップデートや動画データ、バックアップの転送時間の目安にどうぞ。計算はブラウザ内で行われ、入力内容がサーバーに送信されることはありません。単位の換算は <a href="/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">単位変換</a>、画像の容量を減らすなら <a href="/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像リサイズ・圧縮</a> もご利用ください。',
    numberLocale: 'ja-JP',

    sizeLabel: 'ファイルサイズ',
    defaultSize: 50,
    defaultSizeUnit: 'GB',
    speedLabel: '回線速度',
    sizeUnitLabel: 'ファイルサイズの単位',
    speedUnitLabel: '回線速度の単位',
    defaultSpeed: 100,
    defaultSpeedUnit: 'Mbps',
    speedUnits: {
      kbps: 'kbps',
      Mbps: 'Mbps',
      Gbps: 'Gbps',
      MBps: 'MB/s',
    },
    efficiencyLabel: '実効速度の割合（%）',
    defaultEfficiency: 70,
    efficiencyHint:
      '契約速度は理論上の最大値で、実際の速度は混雑や機器の影響で下がります。目安は50〜80%前後です。契約どおりの速度で計算するなら100を入力します。',

    errors: {
      invalidSize: 'ファイルサイズには0より大きい数値を入力してください',
      invalidSpeed: '回線速度には0より大きい数値を入力してください',
      invalidEfficiency:
        '実効速度の割合は0より大きく100以下の数値で入力してください',
    },

    timeLabel: '所要時間',
    effectiveSpeedLabel: '実効速度',
    effectiveSpeedText: '{value} MB/s',
    durationSeparator: '',
    unitDays: '日',
    unitHours: '時間',
    unitMinutes: '分',
    unitSeconds: '秒',
    copyButton: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    copyTemplate: '{size} を {speed} でダウンロード: 約{time}',

    notesHeading: '注意事項',
    notes: [
      'ファイルサイズは1KB=1,000バイトの10進で計算しています。OSによっては1KB=1,024バイトで表示されるため、表示サイズが少し異なる場合があります。',
      '回線速度のbps（ビット毎秒）は、MB/s（バイト毎秒）の8倍です。100Mbpsは理論上12.5MB/sに相当します。',
      '実際の所要時間は、回線の混雑、Wi-Fiの電波状況、配信元サーバーの速度制限、通信のオーバーヘッドなどで変わります。結果はあくまで目安です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'bps（ビット毎秒）とB/s（バイト毎秒）',
        description:
          '回線速度は1秒あたりに送れるビット数（bps）で表すのが一般的で、ファイルサイズはバイト（B）で表します。1バイトは8ビットなので、100Mbpsなら最大で約12.5MB/sです。',
      },
      {
        term: '実効速度',
        description:
          '実際に出ている通信速度です。契約速度（ベストエフォート）は理論上の最大値で、混雑や機器、通信プロトコルの制御情報などにより、実効速度はそれより低くなります。',
      },
      {
        term: 'ベストエフォート',
        description:
          '最大速度を保証せず、できる限りの速度で提供する方式です。家庭向けの光回線やモバイル回線の多くが該当し、表示された速度が常時出るとは限りません。',
      },
    ],
  },
  en: {
    title: 'Download Time Calculator (File Size & Internet Speed)',
    description:
      'Calculate how long a download takes from file size and connection speed (Mbps, Gbps, MB/s). Runs in your browser; nothing is sent to a server.',
    h1: 'Download Time Calculator: File Size ÷ Connection Speed',
    introHtml:
      'Enter a file size and your connection speed to see how long the download will take. Speed can be in bits (Mbps, Gbps) or bytes (MB/s), and a real-world speed factor accounts for the gap between your plan speed and what you actually get. Use it to estimate game updates, video files, or backup transfers. Everything is calculated in your browser, and nothing you type is sent to a server. For unit math, try the <a href="/en/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unit Converter</a>; to shrink images first, try the <a href="/en/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Resizer & Compressor</a>.',
    numberLocale: 'en-US',

    sizeLabel: 'File size',
    defaultSize: 50,
    defaultSizeUnit: 'GB',
    speedLabel: 'Connection speed',
    sizeUnitLabel: 'File size unit',
    speedUnitLabel: 'Connection speed unit',
    defaultSpeed: 100,
    defaultSpeedUnit: 'Mbps',
    speedUnits: {
      kbps: 'kbps',
      Mbps: 'Mbps',
      Gbps: 'Gbps',
      MBps: 'MB/s',
    },
    efficiencyLabel: 'Real-world speed (%)',
    defaultEfficiency: 70,
    efficiencyHint:
      'Your plan speed is a theoretical maximum; congestion and equipment usually lower it. 50-80% is typical. Enter 100 to calculate at the full plan speed.',

    errors: {
      invalidSize: 'Enter a file size greater than 0',
      invalidSpeed: 'Enter a connection speed greater than 0',
      invalidEfficiency:
        'Real-world speed must be greater than 0 and at most 100',
    },

    timeLabel: 'Time to download',
    effectiveSpeedLabel: 'Effective speed',
    effectiveSpeedText: '{value} MB/s',
    durationSeparator: ' ',
    unitDays: ' d',
    unitHours: ' h',
    unitMinutes: ' min',
    unitSeconds: ' s',
    copyButton: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    copyTemplate: '{size} at {speed}: about {time}',

    notesHeading: 'Notes',
    notes: [
      'File sizes use decimal units (1 KB = 1,000 bytes). Some operating systems show 1 KB as 1,024 bytes, so the size they display can differ slightly.',
      'Bits per second (bps) are 8 times bytes per second (B/s). A 100 Mbps connection tops out around 12.5 MB/s.',
      'Real download times depend on congestion, Wi-Fi signal, server-side limits, and protocol overhead. Treat the result as an estimate.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'bps vs. B/s',
        description:
          'Connection speeds are usually quoted in bits per second (bps), while file sizes are in bytes (B). One byte is 8 bits, so 100 Mbps is at most about 12.5 MB/s.',
      },
      {
        term: 'Effective speed',
        description:
          'The speed you actually get. Plan speeds are theoretical maximums, and congestion, equipment, and protocol overhead usually bring the real figure lower.',
      },
      {
        term: 'Throughput',
        description:
          'The amount of data actually transferred per second over a link. It is what determines download time, and it is often lower than the advertised bandwidth.',
      },
    ],
  },
};
