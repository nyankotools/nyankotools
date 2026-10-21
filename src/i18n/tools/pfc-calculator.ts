import type { Locale } from '../../data/tools';
import type { ActivityLevel } from '../../lib/tools/bmr-calorie-calculator';
import type { Goal, PfcPreset } from '../../lib/tools/pfc-calculator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export type UnitSystem = 'metric' | 'imperial';

export interface PfcCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  defaultUnit: UnitSystem;

  sourceLegend: string;
  sourceBody: string;
  sourceDirect: string;

  unitLegend: string;
  unitMetric: string;
  unitImperial: string;

  sexLegend: string;
  sexMale: string;
  sexFemale: string;
  ageLabel: string;
  agePlaceholder: string;
  heightLabel: string;
  heightCmPlaceholder: string;
  heightFtPlaceholder: string;
  heightInPlaceholder: string;
  weightLabel: string;
  weightHintOptional: string;
  weightKgPlaceholder: string;
  weightLbPlaceholder: string;
  activityLabel: string;
  activityLabels: Record<ActivityLevel, string>;
  kcalInputLabel: string;
  kcalInputPlaceholder: string;

  goalLabel: string;
  goalLabels: Record<Goal, string>;
  presetLabel: string;
  presetLabels: Record<PfcPreset, string>;
  customLegend: string;
  proteinShort: string;
  fatShort: string;
  carbShort: string;

  errorBody: string;
  errorKcal: string;
  errorRatio: string;

  intakeLabel: string;
  bmrLabel: string;
  proteinLabel: string;
  fatLabel: string;
  carbLabel: string;
  kcalUnit: string;
  gramUnit: string;
  perKgLabel: string;
  guideHeading: string;
  guideItem: string;
  belowBmrWarning: string;
  copyButton: string;
  copyDone: string;
  copyFailed: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const pfcCalculatorContent: Record<Locale, PfcCalculatorPageContent> = {
  ja: {
    title: 'PFCバランス計算機｜目標タンパク質量・摂取量(g)の自動計算',
    description:
      '摂取カロリーとPFC比率から、タンパク質・脂質・炭水化物の摂取量(g)を計算します。身長・体重・活動量から目標カロリーを求めることも可能。減量・増量の目安、体重あたりタンパク質量にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'PFCバランス計算機（目標タンパク質量・脂質・炭水化物のg数）',
    introHtml:
      '1日の摂取カロリーとPFCバランス（タンパク質・脂質・炭水化物の比率）から、それぞれの摂取量をグラム単位で計算します。身長・体重・活動レベルから基礎代謝を使って目標カロリーを出すことも、カロリーを直接入力することもできます。減量・維持・増量の目標と、バランス型・高タンパク型・低糖質型の比率プリセット、自分で決める比率に対応し、体重あたりのタンパク質量(g/kg)も確認できます。ブラウザ内で計算され、入力内容がサーバーに送信されることはありません。基礎代謝だけを知りたい場合は <a href="/tools/bmr-calorie-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">基礎代謝・消費カロリー計算機</a> をご利用ください。',
    numberLocale: 'ja-JP',
    defaultUnit: 'metric',

    sourceLegend: 'カロリーの求め方',
    sourceBody: '身長・体重などから計算',
    sourceDirect: 'カロリーを直接入力',

    unitLegend: '単位',
    unitMetric: 'メートル法（cm・kg）',
    unitImperial: 'ヤード・ポンド法（ft/in・lb）',

    sexLegend: '性別',
    sexMale: '男性',
    sexFemale: '女性',
    ageLabel: '年齢',
    agePlaceholder: '30',
    heightLabel: '身長',
    heightCmPlaceholder: '170',
    heightFtPlaceholder: '5',
    heightInPlaceholder: '7',
    weightLabel: '体重',
    weightHintOptional: '（g/kgの表示に使用・任意）',
    weightKgPlaceholder: '65',
    weightLbPlaceholder: '143',
    activityLabel: '活動レベル',
    activityLabels: {
      sedentary: 'ほぼ運動しない（座り仕事中心）',
      light: '軽い運動（週1〜3回）',
      moderate: '中程度の運動（週3〜5回）',
      active: '激しい運動（週6〜7回）',
      veryActive: '非常に激しい運動（肉体労働・1日2回の運動）',
    },
    kcalInputLabel: '維持カロリー（kcal/日）',
    kcalInputPlaceholder: '2000',

    goalLabel: '目標',
    goalLabels: {
      loss: '減量（維持カロリーの-20%）',
      mildLoss: 'ゆるやかに減量（維持カロリーの-10%）',
      maintain: '維持（±0%）',
      gain: '増量（維持カロリーの+10%）',
    },
    presetLabel: 'PFC比率',
    presetLabels: {
      balanced: 'バランス型（P15・F25・C60）',
      highProtein: '高タンパク型（P30・F25・C45）',
      lowCarb: '低糖質型（P30・F40・C30）',
      custom: '自分で指定',
    },
    customLegend: '比率（%）。合計が100になるように入力',
    proteinShort: 'P（タンパク質）',
    fatShort: 'F（脂質）',
    carbShort: 'C（炭水化物）',

    errorBody:
      '計算できませんでした（年齢は1〜120歳、身長・体重は0より大きい値を入力してください）',
    errorKcal:
      '計算できませんでした（カロリーは0より大きく20,000以下の値を入力してください）',
    errorRatio: '比率の合計が100%になるように入力してください',

    intakeLabel: '1日の目標摂取カロリー',
    bmrLabel: '基礎代謝量（Mifflin-St Jeor式）',
    proteinLabel: 'タンパク質（P）',
    fatLabel: '脂質（F）',
    carbLabel: '炭水化物（C）',
    kcalUnit: 'kcal',
    gramUnit: 'g',
    perKgLabel: '体重あたりのタンパク質量',
    guideHeading: '体重あたりタンパク質量の目安',
    guideItem: '1kgあたり {perKg} g → {grams} g',
    belowBmrWarning:
      '目標カロリーが基礎代謝量を下回っています。極端な制限は避け、必要に応じて医師・管理栄養士に相談してください。',
    copyButton: '結果をコピー',
    copyDone: 'コピーしました',
    copyFailed: 'コピーできませんでした',

    notesHeading: '注意事項',
    notes: [
      'この計算機は一般的な目安を示すもので、医療・栄養指導ではありません。持病のある方、妊娠中・授乳中の方、成長期のお子さんは医師・管理栄養士にご相談ください。',
      'カロリーへの換算は タンパク質4kcal/g・脂質9kcal/g・炭水化物4kcal/g で行っています。食品の実際の値や食物繊維・アルコールの扱いにより、実測値とは多少ずれます。',
      '身長・体重から求める場合の基礎代謝はMifflin-St Jeor式で推定し、活動係数（1.2〜1.9）を掛けて維持カロリーとしています。個人差があるため、体重の変化を見ながら調整してください。',
      '日本人の食事摂取基準（2020年版）では、エネルギー産生栄養素バランスの目標量は 18歳以上でタンパク質13〜20%・脂質20〜30%・炭水化物50〜65% とされています。プリセットや自分で指定した比率がこの範囲外でも計算はできますが、目安としてご確認ください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'PFCバランス',
        description:
          'Protein（タンパク質）・Fat（脂質）・Carbohydrate（炭水化物）の3大栄養素が、総摂取カロリーに占める割合のことです。食事のバランスを見る指標として使われ、英語圏ではマクロ（マクロ栄養素）とも呼ばれます。',
      },
      {
        term: '維持カロリー（TDEE）',
        description:
          '1日に消費する総エネルギー量です。基礎代謝量に活動レベルの係数を掛けて求め、摂取カロリーがこれと同程度なら体重はおおよそ維持されます。',
      },
      {
        term: '体重あたりのタンパク質量（g/kg）',
        description:
          '1日のタンパク質摂取量を体重で割った値です。運動量や目的によって目安が変わり、一般に推奨量は体重1kgあたり約0.8g以上、筋力トレーニングをする人では1.2〜2.0g程度がよく挙げられます。',
      },
    ],
  },
  en: {
    title: 'Macro (PFC) Calculator: Protein, Fat & Carb Grams',
    description:
      'Calculate daily protein, fat, and carb grams from your calorie target and macro ratio. Estimate calories from BMR and activity. Runs in your browser.',
    h1: 'Macro Calculator: Daily Protein, Fat, and Carb Grams',
    introHtml:
      'Enter a daily calorie target and a macro split, and this calculator shows how many grams of protein, fat, and carbohydrate to eat. You can either type your calories directly or let it estimate them from your height, weight, age, and activity level using BMR. Pick a goal (lose, maintain, or gain), a preset split (balanced, high protein, or low carb) or your own percentages, and see your protein in grams per kilogram of body weight. Everything runs in your browser, and nothing you enter is sent to a server. If you only need your BMR, use the <a href="/en/tools/bmr-calorie-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">BMR &amp; Calorie Calculator</a>.',
    numberLocale: 'en-US',
    defaultUnit: 'imperial',

    sourceLegend: 'Calories from',
    sourceBody: 'Height, weight, and activity',
    sourceDirect: 'Enter calories directly',

    unitLegend: 'Units',
    unitMetric: 'Metric (cm, kg)',
    unitImperial: 'Imperial (ft/in, lb)',

    sexLegend: 'Sex',
    sexMale: 'Male',
    sexFemale: 'Female',
    ageLabel: 'Age',
    agePlaceholder: '30',
    heightLabel: 'Height',
    heightCmPlaceholder: '170',
    heightFtPlaceholder: '5',
    heightInPlaceholder: '7',
    weightLabel: 'Weight',
    weightHintOptional: '(optional here; used for g/kg)',
    weightKgPlaceholder: '65',
    weightLbPlaceholder: '143',
    activityLabel: 'Activity level',
    activityLabels: {
      sedentary: 'Sedentary (little or no exercise)',
      light: 'Lightly active (1–3 days a week)',
      moderate: 'Moderately active (3–5 days a week)',
      active: 'Very active (6–7 days a week)',
      veryActive: 'Extra active (physical job or training twice a day)',
    },
    kcalInputLabel: 'Maintenance calories (kcal/day)',
    kcalInputPlaceholder: '2000',

    goalLabel: 'Goal',
    goalLabels: {
      loss: 'Lose weight (20% below maintenance)',
      mildLoss: 'Lose slowly (10% below maintenance)',
      maintain: 'Maintain (no change)',
      gain: 'Gain weight (10% above maintenance)',
    },
    presetLabel: 'Macro split',
    presetLabels: {
      balanced: 'Balanced (P15 / F25 / C60)',
      highProtein: 'High protein (P30 / F25 / C45)',
      lowCarb: 'Low carb (P30 / F40 / C30)',
      custom: 'Custom',
    },
    customLegend: 'Percentages (must add up to 100)',
    proteinShort: 'P (protein)',
    fatShort: 'F (fat)',
    carbShort: 'C (carbs)',

    errorBody:
      'Could not calculate (age must be 1–120, and height and weight must be greater than 0)',
    errorKcal:
      'Could not calculate (calories must be greater than 0 and at most 20,000)',
    errorRatio: 'The percentages must add up to 100',

    intakeLabel: 'Daily calorie target',
    bmrLabel: 'BMR (Mifflin-St Jeor)',
    proteinLabel: 'Protein (P)',
    fatLabel: 'Fat (F)',
    carbLabel: 'Carbs (C)',
    kcalUnit: 'kcal',
    gramUnit: 'g',
    perKgLabel: 'Protein per kg of body weight',
    guideHeading: 'Protein by body weight (reference)',
    guideItem: '{perKg} g/kg → {grams} g',
    belowBmrWarning:
      'Your calorie target is below your BMR. Avoid extreme restriction, and talk to a doctor or dietitian if you are unsure.',
    copyButton: 'Copy result',
    copyDone: 'Copied',
    copyFailed: 'Could not copy',

    notesHeading: 'Notes',
    notes: [
      'This calculator gives general estimates only and is not medical or nutrition advice. If you have a medical condition, are pregnant or breastfeeding, or are still growing, talk to a doctor or dietitian.',
      'Calories are converted at 4 kcal/g for protein, 9 kcal/g for fat, and 4 kcal/g for carbohydrate. Real foods differ slightly, for example in how fiber and alcohol are counted.',
      'When calories are calculated from your body data, BMR is estimated with the Mifflin-St Jeor equation and multiplied by an activity factor (1.2 to 1.9). Individual variation is large, so adjust based on how your weight changes.',
      'Japan’s dietary reference intakes (2020) suggest 13–20% protein, 20–30% fat, and 50–65% carbohydrate for adults. Ratios outside that range still calculate, so treat it as a reference point.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'PFC balance (macros)',
        description:
          'The share of your daily calories that comes from Protein, Fat, and Carbohydrate. In English this is usually called your macronutrient split, or "macros".',
      },
      {
        term: 'TDEE (maintenance calories)',
        description:
          'Total daily energy expenditure: your BMR multiplied by an activity factor. Eating about this many calories keeps your weight roughly stable.',
      },
      {
        term: 'Protein per kg (g/kg)',
        description:
          'Daily protein divided by body weight. The common minimum is about 0.8 g/kg, and people who strength train often aim for roughly 1.2–2.0 g/kg depending on goals.',
      },
    ],
  },
};
