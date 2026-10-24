import type { Locale } from '../../data/tools';
import type { ExerciseGroup } from '../../lib/tools/mets-calorie-calculator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface MetsCalorieCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  defaultWeightUnit: 'kg' | 'lb';
  defaultWeight: string;

  formulaHeading: string;
  formulaText: string;

  weightLabel: string;
  weightPlaceholder: string;
  weightUnitLabel: string;
  excludeRestingLabel: string;

  tableHeading: string;
  tableHint: string;
  groupLabels: Record<ExerciseGroup, string>;
  exerciseNames: Record<string, string>;
  metsUnit: string;
  addButton: string;
  addAriaSuffix: string;
  addCustomButton: string;
  customName: string;

  entriesHeading: string;
  entriesEmpty: string;
  metsInputLabel: string;
  hoursUnit: string;
  minutesUnit: string;
  removeButton: string;
  removeAriaSuffix: string;
  hoursAriaLabel: string;
  minutesAriaLabel: string;

  weightError: string;
  entryError: string;

  totalLabel: string;
  totalTimeLabel: string;
  kcalUnit: string;
  copyButton: string;
  copiedMessage: string;
  copyFailedMessage: string;
  copyTimeLine: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const metsCalorieCalculatorContent: Record<
  Locale,
  MetsCalorieCalculatorPageContent
> = {
  ja: {
    title: 'METs消費カロリー計算機（運動の消費カロリー早見表つき）',
    description:
      '運動の消費カロリーを METs × 体重(kg) × 時間(h) × 1.05 で計算します。ウォーキング・ジョギング・水泳・筋トレ・家事などのMETs表から選んで、複数の運動を合計できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'METs消費カロリー計算機',
    introHtml:
      '運動の強さを表す METs（メッツ）と体重、運動時間から、運動で消費するカロリーを計算します。ウォーキングやジョギング、サイクリング、水泳、筋トレ、ヨガ、家事などの代表的な METs 値を一覧にしているので、選んで追加するだけで消費カロリーがわかり、複数の運動の合計も出せます。ブラウザ内で計算され、入力内容がサーバーに送信されることはありません。1日の必要カロリーは <a href="/tools/bmr-calorie-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">基礎代謝・消費カロリー計算機</a>、体格の判定は <a href="/tools/bmi-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">BMI計算機</a> が便利です。',
    numberLocale: 'ja-JP',
    defaultWeightUnit: 'kg',
    defaultWeight: '60',

    formulaHeading: '計算式',
    formulaText:
      '消費カロリー(kcal) = METs × 体重(kg) × 時間(h) × 1.05　（1.05 は 1METs・体重1kg・1時間あたりのおおよそのkcal）',

    weightLabel: '体重',
    weightPlaceholder: '60',
    weightUnitLabel: '体重の単位',
    excludeRestingLabel:
      '安静時の分（1METs）を差し引いて、運動による上乗せ分だけを求める',

    tableHeading: 'METs表（代表的な運動）',
    tableHint:
      '運動を選んで「追加」を押すと、下の「行った運動」に入ります。値は目安です。',
    groupLabels: {
      walking: '歩行・階段',
      running: 'ランニング',
      cycling: 'サイクリング',
      water: '水泳・水中運動',
      training: '筋トレ・体操',
      sports: 'スポーツ',
      daily: '家事・日常',
    },
    exerciseNames: {
      walkSlow: 'ゆっくり歩く・散歩（平地、約3km/h以下）',
      walkNormal: '普通歩行（平地、約4km/h）',
      walkBrisk: '速歩き（平地、約5.5km/h）',
      stairsUp: '階段を上る',
      jogging: 'ジョギング（一般）',
      running8: 'ランニング（約8km/h）',
      running10: 'ランニング（約10km/h）',
      cyclingLight: '自転車（ゆっくり、約16km/h未満）',
      cyclingModerate: '自転車（中程度、約16〜19km/h）',
      swimLight: '水泳（クロール・ゆっくり）',
      swimHard: '水泳（クロール・速い）',
      aquaWalking: '水中ウォーキング',
      strengthLight: '筋トレ（軽〜中強度）',
      strengthHard: '筋トレ（高強度・ハードな負荷）',
      yoga: 'ヨガ',
      stretching: 'ストレッチ',
      radioExercise: 'ラジオ体操',
      jumpRope: '縄跳び',
      tennis: 'テニス（シングルス）',
      badminton: 'バドミントン（レクリエーション）',
      golf: 'ゴルフ（クラブを持って歩く）',
      cooking: '料理・食事の支度',
      laundry: '洗濯・洗濯物を干す',
      cleaning: '掃除（掃除機がけ・床拭きなど）',
      deskWork: '立ち仕事・軽い事務作業',
    },
    metsUnit: 'METs',
    addButton: '追加',
    addAriaSuffix: 'を追加',
    addCustomButton: 'METsを自分で入力して追加',
    customName: 'その他の運動',

    entriesHeading: '行った運動',
    entriesEmpty: 'まだ運動が追加されていません。上の表から選んで追加します。',
    metsInputLabel: 'METs値',
    hoursUnit: '時間',
    minutesUnit: '分',
    removeButton: '削除',
    removeAriaSuffix: 'を削除',
    hoursAriaLabel: 'の時間',
    minutesAriaLabel: 'の分',

    weightError: '体重は0より大きい値（500以下）を入力してください',
    entryError:
      '一部の行は計算できませんでした（METsは0〜30、時間は24時間以内で入力してください）',

    totalLabel: '合計消費カロリー',
    totalTimeLabel: '合計時間',
    kcalUnit: 'kcal',
    copyButton: '結果をコピー',
    copiedMessage: 'コピーしました',
    copyFailedMessage: 'コピーに失敗しました',
    copyTimeLine: '合計時間',

    notesHeading: '注意事項',
    notes: [
      'METs 値は、国立健康・栄養研究所「改訂版 身体活動のMETs表」や Compendium of Physical Activities などの公表値を参考にした代表値の目安です。速度・強度・環境で値は変わるため、正確な値は原典をご確認ください。',
      '1.05 の係数にはおおよそ安静時の消費分も含まれるため、結果は「運動中の総消費カロリー」です。運動による上乗せ分だけを知りたい場合は、安静時の分を差し引くオプションを使ってください。',
      '結果は体重・時間・METsから求める推定値で、年齢・性別・体力・体組成などによる個人差は反映されません。実際の消費量を保証するものではなく、医療・栄養指導に代わるものではありません。',
      '体調に不安がある方、持病のある方、妊娠中の方は、運動を始める前に医師へご相談ください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'METs（メッツ）',
        description:
          '運動や身体活動の強さを、安静にしているときの何倍のエネルギーを使うかで表した単位です。安静時（座って楽にしている状態）を1METsとし、普通の歩行は約3METs、ジョギングは約7METsが目安です。',
      },
      {
        term: 'エクササイズ（METs・時）',
        description:
          'METs に運動時間（時間）を掛けた活動量の単位です。たとえば 3METs の運動を 30分行うと 1.5 METs・時になります。厚生労働省の運動指針でも活動量の目安として使われています。',
      },
    ],
  },
  en: {
    title: 'METs Calorie Calculator – Calories Burned by Exercise',
    description:
      'Calculate calories burned from METs, body weight, and time (kcal = METs × kg × hours × 1.05). Pick from a METs table and total several activities.',
    h1: 'METs Calorie Calculator: Calories Burned by Exercise',
    introHtml:
      'Estimate the calories you burn from an activity using its METs value (metabolic equivalent of task), your body weight, and how long you do it. A table of typical METs values for walking, running, cycling, swimming, strength training, yoga, and housework lets you add activities with one click and total several of them. Everything is calculated in your browser, and nothing you type is sent to a server. For your daily calorie needs, try the <a href="/en/tools/bmr-calorie-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">BMR &amp; Calorie Calculator</a>, and to check your weight category, the <a href="/en/tools/bmi-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">BMI Calculator</a>.',
    numberLocale: 'en-US',
    defaultWeightUnit: 'lb',
    defaultWeight: '150',

    formulaHeading: 'Formula',
    formulaText:
      'Calories (kcal) = METs × body weight (kg) × time (hours) × 1.05 (1.05 is roughly the kcal per 1 MET, per kg, per hour)',

    weightLabel: 'Body weight',
    weightPlaceholder: '150',
    weightUnitLabel: 'Weight unit',
    excludeRestingLabel:
      'Subtract resting energy (1 MET) to get only the extra calories from exercise',

    tableHeading: 'METs table (common activities)',
    tableHint:
      'Pick an activity and press "Add" to put it in "Activities done" below. Values are approximate.',
    groupLabels: {
      walking: 'Walking & stairs',
      running: 'Running',
      cycling: 'Cycling',
      water: 'Swimming & water',
      training: 'Strength & exercise',
      sports: 'Sports',
      daily: 'Housework & daily life',
    },
    exerciseNames: {
      walkSlow: 'Slow walk / stroll (level, about 2 mph or less)',
      walkNormal: 'Walking (level, about 2.5 mph)',
      walkBrisk: 'Brisk walking (level, about 3.5 mph)',
      stairsUp: 'Climbing stairs',
      jogging: 'Jogging (general)',
      running8: 'Running (about 5 mph)',
      running10: 'Running (about 6 mph)',
      cyclingLight: 'Cycling, leisure (under 10 mph)',
      cyclingModerate: 'Cycling, moderate (10–12 mph)',
      swimLight: 'Swimming, freestyle, light effort',
      swimHard: 'Swimming, freestyle, vigorous',
      aquaWalking: 'Water walking',
      strengthLight: 'Strength training, light to moderate',
      strengthHard: 'Strength training, vigorous',
      yoga: 'Yoga',
      stretching: 'Stretching',
      radioExercise: 'Calisthenics (radio taiso)',
      jumpRope: 'Jumping rope',
      tennis: 'Tennis (singles)',
      badminton: 'Badminton (recreational)',
      golf: 'Golf (walking with clubs)',
      cooking: 'Cooking / meal prep',
      laundry: 'Laundry / hanging clothes',
      cleaning: 'Cleaning (vacuuming, mopping)',
      deskWork: 'Standing or light office work',
    },
    metsUnit: 'METs',
    addButton: 'Add',
    addAriaSuffix: ': add',
    addCustomButton: 'Add with a custom METs value',
    customName: 'Other activity',

    entriesHeading: 'Activities done',
    entriesEmpty:
      'No activities yet. Choose one from the table above to add it.',
    metsInputLabel: 'METs value',
    hoursUnit: 'h',
    minutesUnit: 'min',
    removeButton: 'Remove',
    removeAriaSuffix: ': remove',
    hoursAriaLabel: ': hours',
    minutesAriaLabel: ': minutes',

    weightError: 'Enter a body weight greater than 0 (up to 500 kg)',
    entryError:
      'Some rows could not be calculated (METs must be 0–30 and time within 24 hours)',

    totalLabel: 'Total calories burned',
    totalTimeLabel: 'Total time',
    kcalUnit: 'kcal',
    copyButton: 'Copy result',
    copiedMessage: 'Copied',
    copyFailedMessage: 'Copy failed',
    copyTimeLine: 'Total time',

    notesHeading: 'Notes',
    notes: [
      'METs values are representative figures based on published sources such as the Compendium of Physical Activities and the National Institute of Health and Nutrition (Japan) METs table. Speed, intensity, and conditions change the value, so check the original sources for exact numbers.',
      'The 1.05 factor roughly includes the energy you would burn at rest, so the result is the total burned during the activity. To see only the extra calories from exercise, use the option that subtracts resting energy.',
      'The result is an estimate from weight, time, and METs, and does not reflect age, sex, fitness, or body composition. It is not a guarantee of actual energy use and is not medical or nutrition advice.',
      'If you have a health concern or medical condition, or are pregnant, talk to a doctor before starting an exercise program.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'METs (Metabolic Equivalent of Task)',
        description:
          'A measure of how intense an activity is, expressed as a multiple of the energy you use at rest. Sitting quietly is 1 MET, normal walking is about 3 METs, and jogging is about 7 METs.',
      },
      {
        term: 'MET-hours',
        description:
          'METs multiplied by hours of activity, a unit of total activity volume. For example, 30 minutes of a 3 METs activity is 1.5 MET-hours.',
      },
    ],
  },
};
