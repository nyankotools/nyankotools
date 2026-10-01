import type { Locale } from '../../data/tools';
import type {
  ActivityLevel,
  BmrFormula,
  Sex,
} from '../../lib/tools/bmr-calorie-calculator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export type UnitSystem = 'metric' | 'imperial';

export interface BmrCalorieCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  defaultUnit: UnitSystem;

  unitLegend: string;
  unitMetric: string;
  unitImperial: string;

  sexLegend: string;
  sexLabels: Record<Sex, string>;
  ageLabel: string;
  agePlaceholder: string;
  heightLabel: string;
  heightCmPlaceholder: string;
  heightFtPlaceholder: string;
  heightInPlaceholder: string;
  weightLabel: string;
  weightKgPlaceholder: string;
  weightLbPlaceholder: string;
  formulaLabel: string;
  formulaLabels: Record<BmrFormula, string>;
  activityLabel: string;
  activityLabels: Record<ActivityLevel, string>;

  error: string;
  japanAgeError: string;

  bmrResultLabel: string;
  tdeeResultLabel: string;
  targetsHeading: string;
  targetMaintain: string;
  targetMildLoss: string;
  targetLoss: string;
  targetGain: string;
  kcalUnit: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const bmrCalorieCalculatorContent: Record<
  Locale,
  BmrCalorieCalculatorPageContent
> = {
  ja: {
    title: '基礎代謝・消費カロリー計算機（1日の必要カロリー）',
    description:
      '年齢・性別・身長・体重から基礎代謝量と、活動レベルを加味した1日の消費カロリー（維持カロリー）を計算します。Mifflin-St Jeor式・ハリス・ベネディクト式・厚労省の基準値に対応。ダイエットの目安カロリーも表示。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '基礎代謝・消費カロリー計算機',
    introHtml:
      '年齢・性別・身長・体重を入力すると、安静時に消費するエネルギー（基礎代謝量）と、活動レベルを掛け合わせた1日の消費カロリー（維持カロリー）を計算します。計算式は Mifflin-St Jeor式（初期値）・ハリス・ベネディクト式（改良版）・日本人の食事摂取基準の基礎代謝基準値から選べ、減量・増量の目安カロリーも表示します。ブラウザ内で計算され、入力内容がサーバーに送信されることはありません。体格の判定には <a href="/tools/bmi-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">BMI計算機</a> もご利用ください。',
    numberLocale: 'ja-JP',
    defaultUnit: 'metric',

    unitLegend: '単位',
    unitMetric: 'メートル法（cm・kg）',
    unitImperial: 'ヤード・ポンド法（ft/in・lb）',

    sexLegend: '性別',
    sexLabels: { male: '男性', female: '女性' },
    ageLabel: '年齢',
    agePlaceholder: '30',
    heightLabel: '身長',
    heightCmPlaceholder: '170',
    heightFtPlaceholder: '5',
    heightInPlaceholder: '7',
    weightLabel: '体重',
    weightKgPlaceholder: '65',
    weightLbPlaceholder: '143',
    formulaLabel: '計算式',
    formulaLabels: {
      mifflin: 'Mifflin-St Jeor式（一般的・推奨）',
      harris: 'ハリス・ベネディクト式（改良版）',
      japan: '日本人の基準値（厚労省・18歳以上）',
    },
    activityLabel: '活動レベル',
    activityLabels: {
      sedentary: 'ほぼ運動しない（座り仕事中心）',
      light: '軽い運動（週1〜3回）',
      moderate: '中程度の運動（週3〜5回）',
      active: '激しい運動（週6〜7回）',
      veryActive: '非常に激しい運動（肉体労働・1日2回の運動）',
    },

    error:
      '計算できませんでした（年齢は1〜120歳、身長・体重は0より大きい値を入力してください）',
    japanAgeError:
      '日本人の基準値は18歳以上が対象です。別の計算式を選んでください',

    bmrResultLabel: '基礎代謝量',
    tdeeResultLabel: '1日の消費カロリー（維持カロリー）',
    targetsHeading: '目的別の摂取カロリーの目安',
    targetMaintain: '体重を維持する',
    targetMildLoss: 'ゆるやかに減量する（維持カロリーの-10%）',
    targetLoss: 'しっかり減量する（維持カロリーの-20%）',
    targetGain: '増量する（維持カロリーの+10%）',
    kcalUnit: 'kcal/日',

    notesHeading: '注意事項',
    notes: [
      '結果は統計的な推定値で、実際の基礎代謝は筋肉量・体質・体調などで個人差があります。医学的な診断や栄養指導に代わるものではありません。',
      '活動係数（1.2〜1.9）はハリス・ベネディクト式で一般的に使われる値です。厚生労働省の「身体活動レベル」（1.50・1.75・2.00）とは区分が異なります。',
      '減量・増量の目安は維持カロリーの割合で求めた簡易的な値です。極端な摂取制限は避け、目安が基礎代謝量を下回る場合は特に慎重にしてください。',
      '日本人の基準値は18歳以上のみ対応しています。妊娠中・授乳中の方、持病のある方は医師・管理栄養士にご相談ください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '基礎代謝量（BMR）',
        description:
          '何もせず安静にしていても、呼吸・体温維持・内臓の働きなどで消費されるエネルギーのことで、1日の消費カロリーの約6〜7割を占めます。年齢・性別・体格によって変わり、筋肉量が多いほど高くなる傾向があります。',
      },
      {
        term: '維持カロリー（TDEE）',
        description:
          '1日の総消費エネルギー量のことで、基礎代謝量に活動レベルを表す係数を掛けて求めます。摂取カロリーがこれと同じなら体重はおおよそ維持され、下回ると減少、上回ると増加します。',
      },
      {
        term: 'Mifflin-St Jeor式とハリス・ベネディクト式',
        description:
          'どちらも身長・体重・年齢・性別から基礎代謝を推定する計算式です。Mifflin-St Jeor式（1990年）は現代人の体格に近いデータから作られ、一般に精度が高いとされます。ハリス・ベネディクト式は1919年に作られ、1984年に係数が改良されました。',
      },
    ],
  },
  en: {
    title: 'BMR & Calorie Calculator (Daily Calorie Needs)',
    description:
      'Estimate your BMR and daily calorie needs from age, sex, height, weight, and activity level. Runs in your browser; nothing is sent to a server.',
    h1: 'BMR and Daily Calorie Calculator',
    introHtml:
      'Enter your age, sex, height, and weight to estimate your basal metabolic rate (BMR), the energy your body burns at rest, and your total daily energy expenditure (TDEE) once your activity level is factored in. Choose between the Mifflin-St Jeor equation (the default), the revised Harris-Benedict equation, or the reference values used in Japanese dietary guidelines, and see rough calorie targets for losing or gaining weight. Everything is calculated in your browser, and nothing you type is sent to a server. To check your weight category, try the <a href="/en/tools/bmi-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">BMI Calculator</a> as well.',
    numberLocale: 'en-US',
    defaultUnit: 'imperial',

    unitLegend: 'Units',
    unitMetric: 'Metric (cm, kg)',
    unitImperial: 'Imperial (ft/in, lb)',

    sexLegend: 'Sex',
    sexLabels: { male: 'Male', female: 'Female' },
    ageLabel: 'Age',
    agePlaceholder: '30',
    heightLabel: 'Height',
    heightCmPlaceholder: '170',
    heightFtPlaceholder: '5',
    heightInPlaceholder: '7',
    weightLabel: 'Weight',
    weightKgPlaceholder: '65',
    weightLbPlaceholder: '143',
    formulaLabel: 'Equation',
    formulaLabels: {
      mifflin: 'Mifflin-St Jeor (recommended)',
      harris: 'Harris-Benedict (revised)',
      japan: 'Japanese reference values (age 18+)',
    },
    activityLabel: 'Activity level',
    activityLabels: {
      sedentary: 'Sedentary (little or no exercise)',
      light: 'Lightly active (1–3 days a week)',
      moderate: 'Moderately active (3–5 days a week)',
      active: 'Very active (6–7 days a week)',
      veryActive: 'Extra active (physical job or training twice a day)',
    },

    error:
      'Could not calculate (age must be 1–120, and height and weight must be greater than 0)',
    japanAgeError:
      'The Japanese reference values apply to age 18 and over. Pick another equation',

    bmrResultLabel: 'Basal metabolic rate (BMR)',
    tdeeResultLabel: 'Daily calorie needs (TDEE, to maintain weight)',
    targetsHeading: 'Calorie targets by goal',
    targetMaintain: 'Maintain weight',
    targetMildLoss: 'Lose slowly (10% below maintenance)',
    targetLoss: 'Lose steadily (20% below maintenance)',
    targetGain: 'Gain weight (10% above maintenance)',
    kcalUnit: 'kcal/day',

    notesHeading: 'Notes',
    notes: [
      'Results are statistical estimates. Actual metabolism varies with muscle mass, genetics, and health, and this is not medical or nutrition advice.',
      'The activity multipliers (1.2 to 1.9) are the ones commonly used with the Harris-Benedict equation, and they differ from the physical activity levels (1.50, 1.75, 2.00) in Japanese dietary guidelines.',
      'The weight loss and gain targets are simple percentages of maintenance calories. Avoid extreme restriction, especially if a target falls below your BMR.',
      'The Japanese reference values are available for age 18 and over only. If you are pregnant, breastfeeding, or have a medical condition, talk to a doctor or dietitian.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'BMR (Basal Metabolic Rate)',
        description:
          'The energy your body uses at complete rest for breathing, keeping warm, and running your organs. It makes up roughly 60–70% of daily calorie burn and varies with age, sex, and body size, tending to be higher with more muscle.',
      },
      {
        term: 'TDEE (Total Daily Energy Expenditure)',
        description:
          'The total energy you burn in a day, found by multiplying BMR by an activity factor. Eating about this many calories keeps weight roughly stable; eating less tends to lose weight and eating more tends to gain it.',
      },
      {
        term: 'Mifflin-St Jeor vs Harris-Benedict',
        description:
          'Both estimate BMR from height, weight, age, and sex. Mifflin-St Jeor (1990) was built on more modern data and is generally considered more accurate. Harris-Benedict dates from 1919 and had its coefficients revised in 1984.',
      },
    ],
  },
};
