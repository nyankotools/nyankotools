import type { Locale } from '../../data/tools';
import type {
  DistanceUnit,
  PaceMode,
} from '../../lib/tools/running-pace-calculator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface RunningPaceCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  defaultUnit: DistanceUnit;

  modeLegend: string;
  modeLabels: Record<PaceMode, string>;
  unitLabel: string;
  unitLabels: Record<DistanceUnit, string>;
  distanceLabel: string;
  distancePlaceholder: string;
  timeLabel: string;
  paceLabel: string;
  hoursUnit: string;
  minutesUnit: string;
  secondsUnit: string;
  paceMinutesUnit: string;
  paceSecondsUnit: string;

  error: string;

  resultHeading: string;
  resultPace: string;
  resultPaceMile: string;
  resultSpeed: string;
  resultTime: string;
  resultDistance: string;
  racesHeading: string;
  racesNote: string;
  raceLabels: Record<string, string>;

  hrHeading: string;
  hrAgeLabel: string;
  hrRestLabel: string;
  hrError: string;
  hrMaxLabel: string;
  hrReserveLabel: string;
  hrZoneHeading: string;
  hrZoneColumn: string;
  hrIntensityColumn: string;
  hrBpmColumn: string;
  hrZoneNames: string[];
  bpmUnit: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const runningPaceCalculatorContent: Record<
  Locale,
  RunningPaceCalculatorPageContent
> = {
  ja: {
    title: 'ランニングペース計算機（タイム換算・心拍ゾーン）',
    description:
      '距離とタイムからペース（分/km）と時速を計算。ペースからフルマラソンなど大会距離別の予想タイム、年齢と安静時心拍からカルボーネン法の心拍ゾーンも表示。データはブラウザ内で処理されます。',
    h1: 'ランニングペース計算機（タイム換算・心拍ゾーン）',
    introHtml:
      '距離とタイムからペース（1kmあたりの時間）と時速を求めたり、距離とペースから完走タイム、タイムとペースから走れる距離を計算できます。求めたペースで5km・10km・ハーフ・フルマラソンを走った場合の予想タイムも一覧で表示し、年齢と安静時心拍からカルボーネン法で心拍ゾーンも計算します。ブラウザ内で計算され、入力内容がサーバーに送信されることはありません。移動時間の足し引きには <a href="/tools/time-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">時間計算機</a> もどうぞ。',
    defaultUnit: 'km',

    modeLegend: '求めたいもの',
    modeLabels: {
      pace: 'ペース（距離×タイム）',
      time: 'タイム（距離×ペース）',
      distance: '距離（タイム×ペース）',
    },
    unitLabel: '距離の単位',
    unitLabels: { km: 'キロメートル（km）', mi: 'マイル（mi）' },
    distanceLabel: '距離',
    distancePlaceholder: '10',
    timeLabel: 'タイム',
    paceLabel: 'ペース（1kmあたり）',
    hoursUnit: '時間',
    minutesUnit: '分',
    secondsUnit: '秒',
    paceMinutesUnit: '分/km',
    paceSecondsUnit: '秒',

    error:
      '計算できませんでした（距離・タイム・ペースは0より大きい現実的な値を入力してください）',

    resultHeading: '計算結果',
    resultPace: 'ペース（1kmあたり）',
    resultPaceMile: 'ペース（1マイルあたり）',
    resultSpeed: '時速',
    resultTime: 'タイム',
    resultDistance: '距離',
    racesHeading: '大会距離別の予想タイム',
    racesNote: '上の結果のペースを最後まで維持した場合の目安です。',
    raceLabels: {
      '1mile': '1マイル（1.609km）',
      '3k': '3km',
      '5k': '5km',
      '10k': '10km',
      half: 'ハーフマラソン（21.0975km）',
      full: 'フルマラソン（42.195km）',
      '100k': '100km',
    },

    hrHeading: '心拍ゾーン（カルボーネン法）',
    hrAgeLabel: '年齢',
    hrRestLabel: '安静時心拍数（拍/分）',
    hrError:
      '計算できませんでした（年齢は10〜100歳の整数、安静時心拍数は20〜150で最大心拍数より小さい値にしてください）',
    hrMaxLabel: '最大心拍数（220−年齢）',
    hrReserveLabel: '心拍予備量',
    hrZoneHeading: 'トレーニング強度別の目標心拍数',
    hrZoneColumn: 'ゾーン',
    hrIntensityColumn: '強度',
    hrBpmColumn: '目標心拍数',
    hrZoneNames: [
      'ゾーン1 ウォーミングアップ・回復',
      'ゾーン2 ジョグ・脂肪燃焼',
      'ゾーン3 ペース走・有酸素強化',
      'ゾーン4 乳酸閾値',
      'ゾーン5 最大努力',
    ],
    bpmUnit: '拍/分',

    notesHeading: '注意事項',
    notes: [
      '予想タイムは同じペースを維持できた場合の単純な計算です。実際には距離が延びるほどペースは落ちるため、フルマラソンなど長い距離では目安として扱ってください。',
      '最大心拍数を220−年齢で推定する方法には個人差があり、実測値と10拍以上ずれることもあります。心拍ゾーンは目安であり、医療上のアドバイスではありません。',
      '持病がある方、運動を始めたばかりの方、動悸や胸の痛みを感じる方は、運動強度について医師に相談してください。',
      'ペースは1kmあたりの時間を分と秒で入力します。マイルを選んだ場合も、入力するペースは1kmあたりです。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ペース',
        description:
          '1kmを走るのにかかる時間のこと（例: 5分30秒/km）。時速とは逆数の関係で、ペースが速いほど数値は小さくなります。',
      },
      {
        term: 'カルボーネン法',
        description:
          '安静時心拍数を考慮して目標心拍数を求める方法です。（最大心拍数−安静時心拍数）×運動強度＋安静時心拍数で計算し、最大心拍数だけで求める方法より個人差を反映できます。',
      },
      {
        term: '心拍予備量',
        description:
          '最大心拍数と安静時心拍数の差のことです。カルボーネン法では、この予備量に運動強度（%）を掛けて目標心拍数を求めます。',
      },
    ],
  },
  en: {
    title: 'Running Pace Calculator (Race Times, HR Zones)',
    description:
      'Calculate running pace per km or mile, speed, finish time, or distance. See predicted 5K, 10K, half and full marathon times and heart rate zones (Karvonen).',
    h1: 'Running Pace Calculator with Race Predictions and Heart Rate Zones',
    introHtml:
      'Work out your pace and speed from distance and time, your finish time from distance and pace, or how far you can run in a given time at a given pace. The calculator also lists predicted times for 5K, 10K, half marathon and marathon at that pace, and builds heart rate training zones with the Karvonen method from your age and resting heart rate. Everything runs in your browser and nothing is sent to a server. To add up split times, try the <a href="/en/tools/time-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Time Calculator</a>.',
    defaultUnit: 'km',

    modeLegend: 'Solve for',
    modeLabels: {
      pace: 'Pace (distance and time)',
      time: 'Time (distance and pace)',
      distance: 'Distance (time and pace)',
    },
    unitLabel: 'Distance unit',
    unitLabels: { km: 'Kilometers (km)', mi: 'Miles (mi)' },
    distanceLabel: 'Distance',
    distancePlaceholder: '10',
    timeLabel: 'Time',
    paceLabel: 'Pace (per km)',
    hoursUnit: 'h',
    minutesUnit: 'min',
    secondsUnit: 'sec',
    paceMinutesUnit: 'min/km',
    paceSecondsUnit: 'sec',

    error:
      'Could not calculate (distance, time and pace must be greater than 0 and realistic)',

    resultHeading: 'Result',
    resultPace: 'Pace (per km)',
    resultPaceMile: 'Pace (per mile)',
    resultSpeed: 'Speed',
    resultTime: 'Time',
    resultDistance: 'Distance',
    racesHeading: 'Predicted race times',
    racesNote: 'Estimates if you hold the pace above for the whole race.',
    raceLabels: {
      '1mile': '1 mile (1.609 km)',
      '3k': '3K',
      '5k': '5K',
      '10k': '10K',
      half: 'Half marathon (21.0975 km)',
      full: 'Marathon (42.195 km)',
      '100k': '100K',
    },

    hrHeading: 'Heart rate zones (Karvonen method)',
    hrAgeLabel: 'Age',
    hrRestLabel: 'Resting heart rate (bpm)',
    hrError:
      'Could not calculate (age must be a whole number from 10 to 100, and resting heart rate must be 20–150 and below your max heart rate)',
    hrMaxLabel: 'Max heart rate (220 − age)',
    hrReserveLabel: 'Heart rate reserve',
    hrZoneHeading: 'Target heart rate by training intensity',
    hrZoneColumn: 'Zone',
    hrIntensityColumn: 'Intensity',
    hrBpmColumn: 'Target heart rate',
    hrZoneNames: [
      'Zone 1 Warm-up and recovery',
      'Zone 2 Easy jog, fat burning',
      'Zone 3 Tempo, aerobic building',
      'Zone 4 Lactate threshold',
      'Zone 5 Maximum effort',
    ],
    bpmUnit: 'bpm',

    notesHeading: 'Notes',
    notes: [
      'Predicted times assume you can hold the same pace throughout. In reality pace drops over longer distances, so treat marathon and ultra estimates as rough guides.',
      'Estimating max heart rate as 220 minus age varies a lot between people and can be off by 10 bpm or more. The zones are a guide, not medical advice.',
      'If you have a medical condition, are new to exercise, or feel palpitations or chest pain, talk to a doctor about training intensity.',
      'Pace is always entered per kilometer, even when you choose miles for distance.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Pace',
        description:
          'The time it takes to cover one kilometer (for example 5:30 per km). It is the inverse of speed, so a faster pace is a smaller number.',
      },
      {
        term: 'Karvonen method',
        description:
          'A way to set target heart rates that accounts for resting heart rate: (max HR − resting HR) × intensity + resting HR. It reflects individual differences better than a percentage of max HR alone.',
      },
      {
        term: 'Heart rate reserve',
        description:
          'The difference between your maximum and resting heart rate. The Karvonen method multiplies this reserve by the training intensity to get a target heart rate.',
      },
    ],
  },
};
