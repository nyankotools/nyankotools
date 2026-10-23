import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface OhmCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  // オームの法則
  ohmHeading: string;
  ohmHint: string;
  voltageLabel: string;
  currentLabel: string;
  resistanceLabel: string;
  powerLabel: string;
  clearButton: string;
  ohmErrors: Record<'many' | 'invalid' | 'negative' | 'zero', string>;
  // 直列・並列
  combineHeading: string;
  combineLabel: string;
  combineHint: string;
  combineSample: string;
  seriesLabel: string;
  parallelLabel: string;
  combineErrors: Record<'invalid' | 'negative', string>;
  // LED
  ledHeading: string;
  ledHint: string;
  supplyLabel: string;
  forwardLabel: string;
  ledCurrentLabel: string;
  ledResistanceLabel: string;
  ledStandardLabel: string;
  ledActualCurrentLabel: string;
  ledPowerLabel: string;
  ledDropLabel: string;
  ledErrors: Record<'invalid' | 'negative' | 'supply' | 'current', string>;
  copyButton: string;
  copied: string;
  copyFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const ohmCalculatorContent: Record<Locale, OhmCalculatorPageContent> = {
  ja: {
    title: 'オームの法則・電力計算機｜合成抵抗・LED抵抗値',
    description:
      '電圧V・電流I・抵抗R・電力Pのうち2つを入力すると残りを計算できます。直列・並列の合成抵抗、LEDの電流制限抵抗(E24系列)も算出。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'オームの法則・電力計算機（V・I・R・P、合成抵抗、LED抵抗）',
    introHtml:
      '電圧(V)・電流(I)・抵抗(R)・電力(P)のうち2つを入力すると、残りの2つを計算します。複数の抵抗の直列・並列の合成抵抗と、LEDに流す電流から決める電流制限抵抗(E24系列の実用値つき)も同じページで求められます。数値には <code>4.7k</code>（4,700）や <code>20m</code>（0.02）のように SI 接頭辞を付けて入力できます。',
    ohmHeading: 'オームの法則・電力（2つ入力して残りを計算）',
    ohmHint:
      '4つのうち2つだけを入力し、残りは空欄にしてください。基本単位（V・A・Ω・W）で入力し、k・m などの接頭辞も使えます。',
    voltageLabel: '電圧 V（ボルト）',
    currentLabel: '電流 I（アンペア）',
    resistanceLabel: '抵抗 R（オーム）',
    powerLabel: '電力 P（ワット）',
    clearButton: 'クリア',
    ohmErrors: {
      many: '入力が3つ以上あります。2つだけ入力し、残りは空欄にしてください。',
      invalid: '数値として読み取れない欄があります（例: 5、4.7k、20m、1e3）。',
      negative: '負の値には対応していません。0以上で入力してください。',
      zero: '0で割る計算になるため求められません。値を見直してください。',
    },
    combineHeading: '直列・並列の合成抵抗',
    combineLabel: '抵抗値（Ω）',
    combineHint:
      'カンマ・空白・改行で区切って2本以上入力します（例: 100, 4.7k, 220）。',
    combineSample: '100, 220, 330',
    seriesLabel: '直列の合成抵抗',
    parallelLabel: '並列の合成抵抗',
    combineErrors: {
      invalid: '数値として読み取れない値があります（例: 100、4.7k、1M）。',
      negative: '負の値には対応していません。0以上で入力してください。',
    },
    ledHeading: 'LEDの電流制限抵抗',
    ledHint:
      '電源電圧からLEDの順電圧を引いた分を抵抗で受け持たせます。電流は mA を m で表します（20mA は 20m）。',
    supplyLabel: '電源電圧 Vs（V）',
    forwardLabel: 'LEDの順電圧 Vf（V）',
    ledCurrentLabel: 'LEDに流す電流 If（A、20mA は 20m）',
    ledResistanceLabel: '計算上の抵抗値',
    ledStandardLabel: '使う抵抗（E24で次に大きい値）',
    ledActualCurrentLabel: 'その抵抗での電流',
    ledPowerLabel: '抵抗の消費電力',
    ledDropLabel: '抵抗の電圧降下',
    ledErrors: {
      invalid: '数値として読み取れない欄があります（例: 5、3.3、20m）。',
      negative: '負の値には対応していません。0以上で入力してください。',
      supply: '電源電圧がLEDの順電圧以下です。電源電圧を上げてください。',
      current: '電流は0より大きい値にしてください。',
    },
    copyButton: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    howToHeading: '使い方',
    howToSteps: [
      '「オームの法則・電力」で、「電圧 V（ボルト）」「電流 I（アンペア）」「抵抗 R（オーム）」「電力 P（ワット）」のうち2つだけを入力します。',
      '残りの2つが自動で表示されます。入力し直すときは「クリア」を押します。',
      '複数の抵抗をつなぐときは、「直列・並列の合成抵抗」の「抵抗値（Ω）」に値を区切って入力します。',
      'LEDの抵抗は、「電源電圧 Vs（V）」「LEDの順電圧 Vf（V）」「LEDに流す電流 If（A、20mA は 20m）」を入力すると求まります。',
    ],
    notesHeading: '注意事項',
    notes: [
      '数値は基本単位（V・A・Ω・W）で入力します。mA は 20m、kΩ は 4.7k のように接頭辞を付けてください。小文字の m はミリ、大文字の M はメガです。',
      '直流回路と、交流の実効値で見た抵抗負荷を想定しています。コイルやコンデンサを含む交流回路のインピーダンス・力率は扱いません。',
      '並列の合成抵抗は 0Ω が含まれると 0Ω（短絡）になります。',
      'LEDの順電圧は色や型番で違います（赤で約2V、白・青で約3V前後が目安）。データシートの値を使ってください。',
      'E24系列の値に丸めると、電流は計算値より少し小さくなります。実際の抵抗には誤差(±5%など)があるため、電流・電力に余裕を持たせてください。',
      '抵抗の定格電力は、消費電力の2倍程度以上のものを選ぶのが一般的です。計算結果は設計の目安であり、安全性を保証するものではありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'オームの法則',
        description:
          '電圧V・電流I・抵抗Rの関係 V = I × R を表す法則です。電力は P = V × I で、これらを組み合わせると2つの値から残りを求められます。',
      },
      {
        term: '合成抵抗',
        description:
          '複数の抵抗をまとめて1つの抵抗と見なした値です。直列は足し算、並列は逆数の和の逆数(1/R = 1/R1 + 1/R2 + …)になります。',
      },
      {
        term: '順電圧（Vf）',
        description:
          'LEDが点灯しているときにLEDの両端にかかる電圧です。色や素材で決まり、電源電圧との差を電流制限抵抗が受け持ちます。',
      },
      {
        term: 'E24系列',
        description:
          '市販の抵抗でよく使われる標準値の系列で、1.0・1.1・1.2・1.3・1.5…のように1桁あたり24種類の値があります。',
      },
    ],
  },
  en: {
    title: "Ohm's Law Calculator: V, I, R, P, Series/Parallel, LED",
    description:
      'Enter any two of voltage, current, resistance and power to get the rest. Also finds series/parallel resistance and LED resistors. Runs in your browser.',
    h1: "Ohm's Law and Power Calculator with Series/Parallel and LED Resistor",
    introHtml:
      'Enter any two of voltage (V), current (I), resistance (R) and power (P) and the other two are calculated. The same page finds the combined resistance of resistors in series or parallel, and the current-limiting resistor for an LED, with the next standard E24 value. Values accept SI prefixes such as <code>4.7k</code> (4,700) or <code>20m</code> (0.02).',
    ohmHeading: "Ohm's law and power (enter two, get the rest)",
    ohmHint:
      'Fill in exactly two of the four fields and leave the others empty. Use base units (V, A, ohm, W); prefixes like k and m work too.',
    voltageLabel: 'Voltage V (volts)',
    currentLabel: 'Current I (amperes)',
    resistanceLabel: 'Resistance R (ohms)',
    powerLabel: 'Power P (watts)',
    clearButton: 'Clear',
    ohmErrors: {
      many: 'Three or more fields are filled. Enter just two and leave the rest empty.',
      invalid:
        'One of the fields is not a number (examples: 5, 4.7k, 20m, 1e3).',
      negative: 'Negative values are not supported. Enter 0 or more.',
      zero: 'This would divide by zero, so it cannot be solved. Check the values.',
    },
    combineHeading: 'Series and parallel resistance',
    combineLabel: 'Resistor values (ohms)',
    combineHint:
      'Separate two or more values with commas, spaces or new lines (example: 100, 4.7k, 220).',
    combineSample: '100, 220, 330',
    seriesLabel: 'Series total',
    parallelLabel: 'Parallel total',
    combineErrors: {
      invalid: 'One of the values is not a number (examples: 100, 4.7k, 1M).',
      negative: 'Negative values are not supported. Enter 0 or more.',
    },
    ledHeading: 'LED current-limiting resistor',
    ledHint:
      'The resistor takes up the difference between the supply voltage and the LED forward voltage. Write milliamps with m (20 mA is 20m).',
    supplyLabel: 'Supply voltage Vs (V)',
    forwardLabel: 'LED forward voltage Vf (V)',
    ledCurrentLabel: 'LED current If (A, 20 mA is 20m)',
    ledResistanceLabel: 'Calculated resistance',
    ledStandardLabel: 'Resistor to use (next E24 value up)',
    ledActualCurrentLabel: 'Current with that resistor',
    ledPowerLabel: 'Resistor power dissipation',
    ledDropLabel: 'Voltage drop across resistor',
    ledErrors: {
      invalid: 'One of the fields is not a number (examples: 5, 3.3, 20m).',
      negative: 'Negative values are not supported. Enter 0 or more.',
      supply:
        'The supply voltage is not higher than the LED forward voltage. Raise the supply voltage.',
      current: 'The current must be greater than 0.',
    },
    copyButton: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    howToHeading: 'How to use',
    howToSteps: [
      'Under "Ohm\'s law and power", fill in only two of "Voltage V (volts)", "Current I (amperes)", "Resistance R (ohms)" and "Power P (watts)".',
      'The other two values appear automatically. Press "Clear" to start over.',
      'To combine several resistors, enter their values separated by commas in "Resistor values (ohms)" under "Series and parallel resistance".',
      'For an LED resistor, enter "Supply voltage Vs (V)", "LED forward voltage Vf (V)" and "LED current If (A, 20 mA is 20m)".',
    ],
    notesHeading: 'Notes',
    notes: [
      'Enter values in base units (V, A, ohm, W) with a prefix where needed: 20m for 20 mA, 4.7k for 4.7 kilohms. A lowercase m means milli and an uppercase M means mega.',
      'This covers DC circuits and purely resistive loads on AC (RMS values). Impedance and power factor with coils or capacitors are not handled.',
      'If any resistor in a parallel group is 0 ohms, the parallel total is 0 ohms (a short circuit).',
      'LED forward voltage depends on color and part: roughly 2 V for red and around 3 V for white or blue. Use the datasheet value.',
      'Rounding up to an E24 value lowers the current slightly. Real resistors have tolerance (for example 5%), so leave some margin in current and power.',
      'Pick a resistor rated for about twice the dissipated power or more. Results are a design guide, not a guarantee of safety.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: "Ohm's law",
        description:
          'The relation V = I x R between voltage, current and resistance. With power P = V x I, any two quantities give you the other two.',
      },
      {
        term: 'Equivalent resistance',
        description:
          'The single resistance that can replace a group of resistors. In series the values add; in parallel the reciprocals add (1/R = 1/R1 + 1/R2 + ...).',
      },
      {
        term: 'Forward voltage (Vf)',
        description:
          'The voltage across an LED while it is lit. It depends on the color and material, and the current-limiting resistor takes up the rest of the supply voltage.',
      },
      {
        term: 'E24 series',
        description:
          'A set of standard resistor values with 24 steps per decade (1.0, 1.1, 1.2, 1.3, 1.5 and so on), widely stocked as 5% parts.',
      },
    ],
  },
};
