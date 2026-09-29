import type { Locale } from '../../data/tools';
import type { BmiCategory } from '../../lib/tools/bmi-calculator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export type UnitSystem = 'metric' | 'imperial';

export interface BmiCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  defaultUnit: UnitSystem;

  unitLegend: string;
  unitMetric: string;
  unitImperial: string;

  heightLabel: string;
  heightCmPlaceholder: string;
  heightFtPlaceholder: string;
  heightInPlaceholder: string;
  weightLabel: string;
  weightKgPlaceholder: string;
  weightLbPlaceholder: string;

  error: string;

  bmiResultLabel: string;
  categoryLabels: Record<BmiCategory, string>;
  healthyWeightResultLabel: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const bmiCalculatorContent: Record<Locale, BmiCalculatorPageContent> = {
  ja: {
    title: 'BMI計算機（標準体重・肥満度判定つき）',
    description:
      '身長・体重からBMI（体格指数）を計算し、日本肥満学会の基準に基づく肥満度判定と、適正体重（普通体重）の範囲を表示する無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'BMI計算機',
    introHtml:
      '身長と体重を入力するとBMI（Body Mass Index、体格指数）を計算し、日本肥満学会の基準に基づく肥満度（低体重・普通体重・肥満1〜4度）の判定と、普通体重（BMI 18.5〜25未満）に相当する体重の範囲を表示します。ブラウザ内で計算され、入力内容がサーバーに送信されることはありません。年齢や生年月日から日数を計算したい場合は <a href="/tools/age-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">年齢計算機</a> もあわせてご利用ください。',
    numberLocale: 'ja-JP',
    defaultUnit: 'metric',

    unitLegend: '単位',
    unitMetric: 'メートル法（cm・kg）',
    unitImperial: 'ヤード・ポンド法（ft/in・lb）',

    heightLabel: '身長',
    heightCmPlaceholder: '170',
    heightFtPlaceholder: '5',
    heightInPlaceholder: '7',
    weightLabel: '体重',
    weightKgPlaceholder: '65',
    weightLbPlaceholder: '143',

    error:
      '計算できませんでした（身長・体重に0より大きい値を入力してください）',

    bmiResultLabel: 'BMI',
    categoryLabels: {
      underweight: '低体重（やせ型）',
      normal: '普通体重',
      overweight: '肥満（1度）',
      obeseClass1: '肥満（2度）',
      obeseClass2: '肥満（3度）',
      obeseClass3: '肥満（4度）',
    },
    healthyWeightResultLabel: '普通体重の範囲（この身長でBMI 18.5〜25未満）',

    notesHeading: '注意事項',
    notes: [
      '肥満度の判定基準は日本肥満学会（2000年）のものです。妊娠中の方や筋肉量の多い方など、BMIだけでは体格を正しく評価できない場合があります。',
      'BMIおよび普通体重の範囲はあくまで統計的な目安であり、医学的な診断や個別の健康アドバイスに代わるものではありません。健康上の判断は医師にご相談ください。',
      '身長・体重は0より大きい値のみ入力できます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'BMI（体格指数）',
        description:
          'Body Mass Indexの略で、「体重(kg) ÷ 身長(m)の2乗」で求める体格の指標です。身長差の影響を取り除いて体重の目安を比較できるため、肥満度の簡易判定に広く使われています。',
      },
      {
        term: '肥満度の判定基準（日本肥満学会）',
        description:
          '日本肥満学会はBMI 25以上を「肥満」と定義しており、BMI 18.5未満を「低体重」、18.5〜25未満を「普通体重」、25以上を肥満度に応じて1〜4度に分類します。国際的に使われるWHO基準では区切り値（18.5・25・30・35・40）自体は同じですが、25〜30未満を「肥満」ではなく「Overweight（過体重）」と呼ぶなど、呼称が異なります。',
      },
      {
        term: '普通体重の範囲',
        description:
          'BMIが18.5以上25未満になる体重の範囲のことです。統計的に生活習慣病のリスクが低いとされる範囲であり、その身長における目安の体重として使われます。',
      },
    ],
  },
  en: {
    title: 'BMI Calculator (with Healthy Weight Range)',
    description:
      'Calculate your Body Mass Index from height and weight, see which WHO weight category it falls into, and get the healthy weight range for your height. Your data is processed in the browser and never sent to a server.',
    h1: 'BMI Calculator',
    introHtml:
      'Enter your height and weight to calculate your BMI (Body Mass Index), see which WHO weight category (underweight, normal weight, overweight, or obese class I–III) it falls into, and get the healthy weight range (BMI 18.5–25) for your height. Everything happens in your browser, and nothing you type is ever sent to a server. If you want to work out an age or the number of days since birth, try the <a href="/en/tools/age-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Age Calculator</a> as well.',
    numberLocale: 'en-US',
    defaultUnit: 'imperial',

    unitLegend: 'Units',
    unitMetric: 'Metric (cm, kg)',
    unitImperial: 'Imperial (ft/in, lb)',

    heightLabel: 'Height',
    heightCmPlaceholder: '170',
    heightFtPlaceholder: '5',
    heightInPlaceholder: '7',
    weightLabel: 'Weight',
    weightKgPlaceholder: '65',
    weightLbPlaceholder: '143',

    error: 'Could not calculate (height and weight must be greater than 0)',

    bmiResultLabel: 'BMI',
    categoryLabels: {
      underweight: 'Underweight',
      normal: 'Normal weight',
      overweight: 'Overweight',
      obeseClass1: 'Obese Class I',
      obeseClass2: 'Obese Class II',
      obeseClass3: 'Obese Class III',
    },
    healthyWeightResultLabel:
      'Healthy weight range (BMI 18.5–25 at this height)',

    notesHeading: 'Notes',
    notes: [
      'The weight categories follow the WHO classification. BMI can misrepresent body composition for some people, such as pregnant women or those with a high muscle mass.',
      'BMI and the healthy weight range are statistical rules of thumb, not a medical diagnosis or personalized health advice. Talk to a doctor for guidance about your own health.',
      'Height and weight must be greater than 0.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'BMI (Body Mass Index)',
        description:
          'A measure of body weight relative to height, calculated as "weight (kg) ÷ height (m)²". Because it factors out height, it\'s widely used as a quick way to compare weight status across people of different heights.',
      },
      {
        term: 'WHO weight categories',
        description:
          'The World Health Organization classifies BMI under 18.5 as underweight, 18.5–24.9 as normal weight, 25–29.9 as overweight, and 30 and above as obese (split into Class I, II, and III). Some countries, including Japan, use the same cutoffs (18.5, 25, 30, 35, 40) but label the 25–30 range as an obesity grade rather than "overweight".',
      },
      {
        term: 'Healthy weight range',
        description:
          "The range of body weight that gives a BMI between 18.5 and 25 for a given height. It's statistically associated with lower risk of weight-related health issues, and is commonly used as a target range for that height.",
      },
    ],
  },
};
