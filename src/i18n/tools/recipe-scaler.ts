import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface RecipeScalerContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  fromLabel: string;
  toLabel: string;
  roundingLabel: string;
  roundingFraction: string;
  roundingDecimal: string;
  roundingInteger: string;
  /** 帯分数の整数部と分数部をつなぐ文字 */
  mixedJoin: string;
  outputLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  errorServings: string;
  /** {factor} {count} を置換する */
  summaryTemplate: string;
  summaryNoNumbers: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const recipeScalerContent: Record<Locale, RecipeScalerContent> = {
  ja: {
    title: 'レシピ人数換算｜材料の分量を人数に合わせて自動計算',
    description:
      '材料リストを貼り付けて、元の人数から目標の人数へ分量を比例換算する無料ツールです。1/2・1と1/2・全角数字・「2〜3個」の範囲に対応し、単位はそのまま保持します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'レシピ人数換算（材料の分量を人数に合わせて計算）',
    introHtml:
      'レシピの材料リストを貼り付けて、「元の人数」と「目標の人数」を入力するだけで、各行の分量を人数に合わせて拡大・縮小します。分数（1/2、1と1/2、½）や全角数字、範囲（2〜3個）を読み取り、大さじ・g・mlなどの単位はそのまま残します。「塩 少々」のように数値のない行は変更しません。入力内容はブラウザ内で処理され、サーバーには送信されません。単純な比の計算には <a href="/tools/ratio-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">割合・比率計算機</a> もご利用ください。',
    inputLabel: '材料リスト（1行に1材料）',
    inputPlaceholder: '鶏もも肉 300g\n玉ねぎ 1個\n水 1と1/2カップ',
    sampleText:
      '材料（2人分）\n鶏もも肉 300g\n玉ねぎ 1個\n水 1と1/2カップ\nしょうゆ 大さじ2\n卵 2〜3個\nバター 小さじ½\n塩 少々\nこしょう 適量',
    fromLabel: '元の人数',
    toLabel: '目標の人数',
    roundingLabel: '丸め方',
    roundingFraction: '分数（1/2・1と1/2）',
    roundingDecimal: '小数（1.5）',
    roundingInteger: '整数',
    mixedJoin: 'と',
    outputLabel: '換算結果',
    copy: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorServings: '人数は0より大きい数値を入力してください',
    summaryTemplate: '倍率 {factor} 倍・{count}個の数値を換算しました',
    summaryNoNumbers: '換算できる数値が見つかりませんでした',
    howToHeading: '使い方',
    howToSteps: [
      '「材料リスト」にレシピの材料を1行ずつ貼り付けます。',
      '「元の人数」にレシピの人数、「目標の人数」に作りたい人数を入力します。',
      '「丸め方」で分数・小数・整数のどれで表示するか選びます。',
      '「換算結果」を確認し、「結果をコピー」で取り込みます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '換算するのは数量の数値だけで、単位や材料名は変更しません。結果の数字は半角で表示されます。',
      '時間（10分）・温度（200℃）・長さ（2cm）は人数に比例しないため換算しません。「2人分」のような人数表記は目標の人数に置き換えます。',
      '行頭の手順番号（1. など）や、A4のように英字に続く数字は換算しません。',
      '調味料や調理時間は、人数を大きく変えると単純な比例にならないことがあります。特に倍率が大きいときは味見をしながら調整してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '帯分数',
        description:
          '「1と1/2」のように整数と真分数を組み合わせた表記です。計量カップや計量スプーンの目盛りに合わせやすいため、料理では分数表示が好まれます。',
      },
      {
        term: '倍率',
        description:
          '「目標の人数 ÷ 元の人数」で求める換算の比率です。2人分を3人分にするなら1.5倍になります。',
      },
    ],
  },
  en: {
    title: 'Recipe Scaler – Resize Ingredient Amounts by Servings',
    description:
      'Paste an ingredient list and scale it to any number of servings. Handles fractions, ranges and units. Runs in your browser; nothing is sent to a server.',
    h1: 'Recipe Scaler: Adjust Ingredient Amounts by Servings',
    introHtml:
      'Paste your ingredient list, enter the original and target number of servings, and every quantity is scaled up or down to match. It reads fractions (1/2, 1 1/2, ½), full-width digits and ranges like "2-3 eggs", keeps units such as tbsp, g, ml and cups, and leaves lines without a number (like "salt, to taste") untouched. Everything runs in your browser and nothing you paste is sent to a server. For plain ratio math, try the <a href="/en/tools/ratio-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Ratio & Percentage Calculator</a>.',
    inputLabel: 'Ingredient list (one per line)',
    inputPlaceholder: '300 g chicken thighs\n1 onion\n1 1/2 cups water',
    sampleText:
      'Serves 2\n300 g chicken thighs\n1 onion\n1 1/2 cups water\n2 tbsp soy sauce\n2-3 eggs\n½ tsp butter\nsalt, to taste',
    fromLabel: 'Original servings',
    toLabel: 'Target servings',
    roundingLabel: 'Rounding',
    roundingFraction: 'Fractions (1/2, 1 1/2)',
    roundingDecimal: 'Decimals (1.5)',
    roundingInteger: 'Whole numbers',
    mixedJoin: ' ',
    outputLabel: 'Scaled result',
    copy: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorServings: 'Servings must be a number greater than 0',
    summaryTemplate: 'Scaled by x{factor} - {count} quantities converted',
    summaryNoNumbers: 'No quantities to scale were found',
    howToHeading: 'How to use',
    howToSteps: [
      'Paste your recipe ingredients into "Ingredient list", one per line.',
      'Enter the recipe\'s servings in "Original servings" and the number you want in "Target servings".',
      'Pick fractions, decimals or whole numbers in "Rounding".',
      'Check the "Scaled result" and press "Copy result".',
    ],
    notesHeading: 'Notes',
    notes: [
      'Only the numeric quantities change; units and ingredient names stay as written. Scaled numbers are always shown in ASCII digits.',
      'Times (10 min), temperatures (200°C) and lengths (2 cm) are not scaled because they do not grow with servings. Serving counts such as serves 4 are replaced with the target.',
      'Step numbers at the start of a line (like 1.) and digits attached to letters (like A4) are left alone.',
      'Seasoning and cooking time do not always scale linearly. For big jumps in servings, taste and adjust as you go.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Mixed number',
        description:
          'A whole number plus a proper fraction, such as 1 1/2. Cooks prefer it because it matches the markings on measuring cups and spoons.',
      },
      {
        term: 'Scale factor',
        description:
          'Target servings divided by original servings. Going from 2 servings to 3 gives a factor of 1.5.',
      },
    ],
  },
};
