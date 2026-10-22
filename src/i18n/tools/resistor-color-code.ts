import type { Locale } from '../../data/tools';
import type { ColorId } from '../../lib/tools/resistor-color-code';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ResistorColorCodePageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  settingsLabel: string;
  bandCountLabel: string;
  bandCountOptions: Record<'4' | '5' | '6', string>;
  seriesLabel: string;
  readHeading: string;
  readHint: string;
  /** {n} {role} を置換する */
  bandLabel: string;
  roleLabels: Record<
    'digit1' | 'digit2' | 'digit3' | 'multiplier' | 'tolerance' | 'tempco',
    string
  >;
  colorNames: Record<ColorId, string>;
  resultLabel: string;
  /** {value} {tol} を置換する */
  resultValue: string;
  /** {min} {max} */
  rangeLine: string;
  /** {tc} */
  tempcoLine: string;
  findHeading: string;
  valueLabel: string;
  valueHint: string;
  valuePlaceholder: string;
  toleranceLabel: string;
  tempcoLabel: string;
  findResultLabel: string;
  findEmpty: string;
  /** {value} {tol} */
  findSummary: string;
  copy: string;
  copied: string;
  copyFailed: string;
  useNearest: string;
  errInvalidValue: string;
  errNotRepresentable: string;
  errOutOfRange: string;
  /** {series} {value} {dev} */
  eNearest: string;
  /** {series} */
  eExact: string;
  /** {lower} {upper} */
  eNeighbors: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const resistorColorCodeContent: Record<
  Locale,
  ResistorColorCodePageContent
> = {
  ja: {
    title: '抵抗カラーコード計算（4〜6本線・E系列）',
    description:
      '抵抗のカラーコード（4・5・6本線）から抵抗値・許容差・温度係数を読み取り、抵抗値から色帯も求められます。最も近いE系列の値も表示。ブラウザ内で処理されます。',
    h1: '抵抗カラーコード計算（色帯⇔抵抗値）',
    introHtml:
      '抵抗の色帯（4・5・6本線）を選ぶと、抵抗値・許容差・温度係数と許容範囲が分かります。逆に抵抗値を入れると色帯を表示し、E6〜E192のうち最も近い標準値も確認できます。データはブラウザ内で処理され、サーバーには送信されません。',
    settingsLabel: '共通設定',
    bandCountLabel: '帯の本数',
    bandCountOptions: { '4': '4本', '5': '5本', '6': '6本' },
    seriesLabel: 'E系列',
    readHeading: '色帯から抵抗値を読む',
    readHint: '抵抗の左側（金・銀の帯が右に来る向き）から順に色を選びます。',
    bandLabel: '帯{n}: {role}',
    roleLabels: {
      digit1: '第1数字',
      digit2: '第2数字',
      digit3: '第3数字',
      multiplier: '乗数',
      tolerance: '許容差',
      tempco: '温度係数',
    },
    colorNames: {
      black: '黒',
      brown: '茶',
      red: '赤',
      orange: '橙',
      yellow: '黄',
      green: '緑',
      blue: '青',
      violet: '紫',
      gray: '灰',
      white: '白',
      gold: '金',
      silver: '銀',
    },
    resultLabel: '読み取り結果',
    resultValue: '{value} ±{tol}%',
    rangeLine: '許容範囲: {min} 〜 {max}',
    tempcoLine: '温度係数: {tc} ppm/℃',
    findHeading: '抵抗値から色帯を求める',
    valueLabel: '抵抗値',
    valueHint:
      '4.7k・4k7・2.2M・R47・470 のように入力できます（単位はΩ、Ωの記号は省略可）。',
    valuePlaceholder: '例: 4.7k',
    toleranceLabel: '許容差',
    tempcoLabel: '温度係数',
    findResultLabel: '色帯',
    findEmpty: '抵抗値を入力すると、色帯がここに表示されます。',
    findSummary: '{value} ±{tol}%',
    copy: '色名をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    useNearest: '近い標準値を入力する',
    errInvalidValue:
      '抵抗値を読み取れません。4.7k や 470 のように入力してください。',
    errNotRepresentable:
      'この本数では表せない値です。有効数字が多すぎるか、桁が足りません（4本は2桁、5・6本は3桁まで）。',
    errOutOfRange: '大きすぎる値です。乗数で表せるのは 10GΩ 未満までです。',
    eNearest: '{series}で最も近い値: {value}（入力との差 {dev}%）',
    eExact: '{series}の標準値です。',
    eNeighbors: '前後の値: {lower} / {upper}',
    howToHeading: '使い方',
    howToSteps: [
      '「帯の本数」で4・5・6本を選びます。',
      '「色帯から抵抗値を読む」では、左の帯から順に色を選びます。',
      '「抵抗値から色帯を求める」では、「抵抗値」に 4.7k や 4k7 のように入力します。',
      '「E系列」を選ぶと、最も近い標準値と前後の値が表示されます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '帯の向きは、金・銀の許容差帯を右側に置き、反対側の端に近い帯を1本目として読みます。帯の間隔や太さで向きが分からない場合は、テスターで実測してください。',
      '4本線は2桁、5・6本線は3桁の有効数字です。3桁の値（例: 4.75kΩ）は4本線では表せません。',
      '温度係数の色は規格やメーカーで異なる場合があります（黒を250ppm/℃とする表を使用）。重要な用途ではデータシートを確認してください。',
      'E48・E96・E192は式で計算した値を3桁に丸めたもので、規格表と1桁違う場合があります。E6・E12・E24は規格表の値です。',
      '色の見え方は経年変化や照明で変わります。茶と赤、橙と赤、灰と白などは見間違えやすいので、迷うときは実測で確認してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'E系列',
        description:
          '抵抗やコンデンサの標準値の並びです。1デケード（10倍）を等比数列で分け、E12なら12個、E96なら96個の値を持ちます。数字が大きいほど細かく、許容差が小さい部品向けです。',
      },
      {
        term: '許容差',
        description:
          '公称の抵抗値に対して許される誤差の割合です。±5%の4.7kΩなら、4.465kΩ〜4.935kΩの範囲に入ります。',
      },
      {
        term: '温度係数',
        description:
          '温度が1℃変わったときの抵抗値の変化率で、ppm/℃（100万分の1）で表します。6本線の6本目の帯が示します。',
      },
    ],
  },
  en: {
    title: 'Resistor Color Code Calculator (4-6 Bands, E Series)',
    description:
      'Read 4-, 5- and 6-band resistor color codes, or turn a resistance into bands. Shows tolerance and the nearest E series value. Runs in your browser.',
    h1: 'Resistor Color Code Calculator (Bands ⇄ Value)',
    introHtml:
      'Pick the color bands of a 4-, 5- or 6-band resistor to get its resistance, tolerance, temperature coefficient and tolerance range. Or type a resistance to see the bands and the nearest standard value in E6 to E192. Everything runs in your browser and nothing is sent to a server.',
    settingsLabel: 'Common settings',
    bandCountLabel: 'Number of bands',
    bandCountOptions: { '4': '4 bands', '5': '5 bands', '6': '6 bands' },
    seriesLabel: 'E series',
    readHeading: 'Read a resistor from its color bands',
    readHint:
      'Choose the colors from the left, with the gold or silver tolerance band on the right.',
    bandLabel: 'Band {n}: {role}',
    roleLabels: {
      digit1: '1st digit',
      digit2: '2nd digit',
      digit3: '3rd digit',
      multiplier: 'Multiplier',
      tolerance: 'Tolerance',
      tempco: 'Temp. coefficient',
    },
    colorNames: {
      black: 'Black',
      brown: 'Brown',
      red: 'Red',
      orange: 'Orange',
      yellow: 'Yellow',
      green: 'Green',
      blue: 'Blue',
      violet: 'Violet',
      gray: 'Gray',
      white: 'White',
      gold: 'Gold',
      silver: 'Silver',
    },
    resultLabel: 'Result',
    resultValue: '{value} ±{tol}%',
    rangeLine: 'Tolerance range: {min} to {max}',
    tempcoLine: 'Temperature coefficient: {tc} ppm/°C',
    findHeading: 'Find color bands from a resistance',
    valueLabel: 'Resistance',
    valueHint:
      'Accepts 4.7k, 4k7, 2.2M, R47 or 470 (in ohms; the Ω sign is optional).',
    valuePlaceholder: 'e.g. 4.7k',
    toleranceLabel: 'Tolerance',
    tempcoLabel: 'Temp. coefficient',
    findResultLabel: 'Color bands',
    findEmpty: 'Enter a resistance and the color bands appear here.',
    findSummary: '{value} ±{tol}%',
    copy: 'Copy color names',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    useNearest: 'Use the nearest standard value',
    errInvalidValue:
      'Could not read the resistance. Enter something like 4.7k or 470.',
    errNotRepresentable:
      'This value cannot be shown with this many bands: too many significant digits, or not enough range (2 digits for 4 bands, 3 for 5 and 6 bands).',
    errOutOfRange:
      'The value is too large. The multiplier band only reaches below 10 GΩ.',
    eNearest: 'Nearest {series} value: {value} ({dev}% from your input)',
    eExact: 'This is a standard {series} value.',
    eNeighbors: 'Neighbors: {lower} / {upper}',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose 4, 5 or 6 bands under "Number of bands".',
      'Under "Read a resistor from its color bands", pick the colors from the leftmost band.',
      'Under "Find color bands from a resistance", type a value such as 4.7k or 4k7 into "Resistance".',
      'Pick an "E series" to see the nearest standard value and its neighbors.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Read with the gold or silver tolerance band on the right; the first band is the one closest to the opposite end. If the orientation is unclear, measure the resistor with a multimeter.',
      '4-band resistors carry 2 significant digits and 5- or 6-band resistors carry 3. A 3-digit value such as 4.75 kΩ cannot be shown with 4 bands.',
      'Temperature coefficient colors differ between standards and manufacturers (this tool uses a table where black is 250 ppm/°C). Check the datasheet for critical designs.',
      'E48, E96 and E192 are calculated and rounded to 3 digits, so a few values may differ by one digit from the published tables. E6, E12 and E24 use the standard tables.',
      'Colors shift with age and lighting. Brown and red, orange and red, or gray and white are easy to confuse, so measure when in doubt.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'E series',
        description:
          'A set of preferred values for resistors and capacitors. One decade is split geometrically, giving 12 values for E12 and 96 for E96. Higher numbers are finer and suit tighter-tolerance parts.',
      },
      {
        term: 'Tolerance',
        description:
          'The allowed deviation from the nominal resistance. A 4.7 kΩ resistor at ±5% falls anywhere from 4.465 kΩ to 4.935 kΩ.',
      },
      {
        term: 'Temperature coefficient',
        description:
          'How much the resistance changes per degree Celsius, in ppm/°C (parts per million). On a 6-band resistor, the sixth band shows it.',
      },
    ],
  },
};
