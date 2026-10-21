import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CookingUnitConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  amountLabel: string;
  fromLabel: string;
  ingredientLabel: string;
  cupLabel: string;
  unitTsp: string;
  unitTbsp: string;
  unitCup: string;
  unitMl: string;
  unitG: string;
  cupJp: string;
  cupUs: string;
  cupMetric: string;
  ingredients: {
    water: string;
    flour: string;
    starch: string;
    sugar: string;
    granulated: string;
    salt: string;
    oil: string;
    milk: string;
    butter: string;
    honey: string;
    soy: string;
    miso: string;
    rice: string;
  };

  error: string;
  resultHeading: string;
  copyLabel: string;
  copied: string;
  copyFailed: string;

  tableHeading: string;
  tableCaption: string;
  tableIngredient: string;
  tableTsp: string;
  tableTbsp: string;
  tableCup: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cookingUnitConverterContent: Record<
  Locale,
  CookingUnitConverterPageContent
> = {
  ja: {
    title: '料理の分量換算｜大さじ・小さじ・カップ・g・ml',
    description:
      '大さじ・小さじ・カップ・g・mlを食材別に相互換算する無料ツールです。小麦粉・砂糖・油・塩・バター・はちみつ・米などの重さ早見表つき。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '料理の分量換算（大さじ・小さじ・カップ・g・ml）',
    introHtml:
      '大さじ・小さじ・カップ・g・ml を、食材ごとの比重に合わせて相互に換算します。小麦粉大さじ3は何gか、バター50gは大さじいくつか、といったレシピの分量を、日本の計量（大さじ15ml・小さじ5ml・1カップ200ml）を基準にすぐ確認できます。米国カップ（240ml）なども選べます。ブラウザ内で計算され、入力内容がサーバーに送信されることはありません。長さ・重さ・温度などの物理単位は <a href="/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">単位変換</a> をご利用ください。',

    amountLabel: '量',
    fromLabel: '換算元の単位',
    ingredientLabel: '食材',
    cupLabel: '1カップの量',
    unitTsp: '小さじ',
    unitTbsp: '大さじ',
    unitCup: 'カップ',
    unitMl: 'ml',
    unitG: 'g',
    cupJp: '日本（200ml）',
    cupUs: '米国（240ml）',
    cupMetric: 'メートル法（250ml）',
    ingredients: {
      water: '水・酒・酢',
      flour: '小麦粉（薄力粉）',
      starch: '片栗粉',
      sugar: '上白糖',
      granulated: 'グラニュー糖',
      salt: '食塩',
      oil: '油（サラダ油）',
      milk: '牛乳',
      butter: 'バター',
      honey: 'はちみつ',
      soy: 'しょうゆ・みりん',
      miso: 'みそ',
      rice: '精白米',
    },

    error: '0以上の数値を入力してください（100万まで）',
    resultHeading: '換算結果',
    copyLabel: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーできませんでした',

    tableHeading: '食材別の重さ早見表',
    tableCaption: '食材ごとの小さじ1・大さじ1・1カップ（200ml）の重さ（g）',
    tableIngredient: '食材',
    tableTsp: '小さじ1（5ml）',
    tableTbsp: '大さじ1（15ml）',
    tableCup: '1カップ（200ml）',

    notesHeading: '注意事項',
    notes: [
      '比重は一般に流通している目安値です。粉類は詰め方・ふるい方、バターは温度、米は品種や乾燥度で変わるため、実際の重さは数%〜1割ほど前後します。出典によって数値が異なる場合もあるので、正確さが必要なお菓子作りなどでは、できるだけ g で量ってください。',
      '日本の計量は 大さじ＝15ml・小さじ＝5ml・1カップ＝200ml・米1合＝180ml です。米国のカップは約240ml、メートル法のカップは250mlで、レシピの国に合わせて「1カップの量」を切り替えてください。大さじ・小さじは国による差が小さいため、すべて15ml・5mlとして計算します（豪州の大さじ20mlには対応していません）。',
      '「水・酒・酢」は水と同じ比重（1g/ml）として扱います。「しょうゆ・みりん」と「みそ」は1.2g/mlの近似です。',
      'すりきりで量った場合の値です。山盛りにすると多くなります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '比重（密度）',
        description:
          '同じ体積あたりの重さの比で、ここでは1mlあたりの重さ（g）として使っています。水は1g/mlですが、小麦粉は約0.6g/ml、はちみつは約1.4g/mlなので、同じ大さじ1でも重さが変わります。',
      },
      {
        term: 'すりきり',
        description:
          '計量スプーンやカップに入れた材料を、平らなもので縁に沿ってすり、盛り上がった分を落とした状態です。レシピの分量は特に指定がなければすりきりが基本です。',
      },
    ],
  },
  en: {
    title: 'Cooking Unit Converter: Tablespoon, Cup, Grams, ml',
    description:
      'Convert tablespoons, teaspoons, cups, grams and ml for flour, sugar, oil, butter, honey, rice and more. Runs in your browser; nothing is sent to a server.',
    h1: 'Cooking Measurement Converter: Tbsp, Tsp, Cups, Grams, ml',
    introHtml:
      'Convert tablespoons, teaspoons, cups, grams, and milliliters for common ingredients. It answers questions such as how many grams 3 tablespoons of flour weigh, or how many tablespoons 50 g of butter is, using each ingredient\'s density. Pick the cup size that matches your recipe (Japanese 200 ml, US 240 ml, or metric 250 ml). Everything is calculated in your browser, and nothing you type is sent to a server. For length, weight, temperature, and other physical units, use the <a href="/en/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unit Converter</a>.',

    amountLabel: 'Amount',
    fromLabel: 'Convert from',
    ingredientLabel: 'Ingredient',
    cupLabel: 'Cup size',
    unitTsp: 'Teaspoon',
    unitTbsp: 'Tablespoon',
    unitCup: 'Cup',
    unitMl: 'ml',
    unitG: 'g',
    cupJp: 'Japan (200 ml)',
    cupUs: 'US (240 ml)',
    cupMetric: 'Metric (250 ml)',
    ingredients: {
      water: 'Water, sake, vinegar',
      flour: 'Flour (all-purpose / cake)',
      starch: 'Potato starch (katakuriko)',
      sugar: 'Sugar (white)',
      granulated: 'Granulated sugar',
      salt: 'Table salt',
      oil: 'Vegetable oil',
      milk: 'Milk',
      butter: 'Butter',
      honey: 'Honey',
      soy: 'Soy sauce, mirin',
      miso: 'Miso',
      rice: 'Uncooked white rice',
    },

    error: 'Enter a number from 0 up to 1,000,000',
    resultHeading: 'Result',
    copyLabel: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Could not copy',

    tableHeading: 'Weight chart by ingredient',
    tableCaption:
      'Weight in grams of 1 teaspoon, 1 tablespoon and 1 cup (200 ml) of each ingredient',
    tableIngredient: 'Ingredient',
    tableTsp: '1 tsp (5 ml)',
    tableTbsp: '1 tbsp (15 ml)',
    tableCup: '1 cup (200 ml)',

    notesHeading: 'Notes',
    notes: [
      'Densities are commonly quoted approximate values. Packing and sifting (flour), temperature (butter), and variety or dryness (rice) change the real weight by a few percent up to about 10%. Sources also disagree slightly, so for baking and other precise work, weigh in grams whenever you can.',
      'Japanese measures are 1 tbsp = 15 ml, 1 tsp = 5 ml, 1 cup = 200 ml, and 1 gō of rice = 180 ml. A US cup is about 240 ml and a metric cup is 250 ml, so switch "Cup size" to match your recipe. Tablespoons and teaspoons differ little between countries, so 15 ml and 5 ml are used throughout (the Australian 20 ml tablespoon is not supported).',
      '"Water, sake, vinegar" uses the density of water (1 g/ml). "Soy sauce, mirin" and "Miso" are approximated at 1.2 g/ml.',
      'Values assume level (leveled-off) measures. Heaped spoonfuls hold more.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Density',
        description:
          'Weight per unit of volume; here, grams per milliliter. Water is 1 g/ml, but flour is about 0.6 g/ml and honey about 1.4 g/ml, so one tablespoon of each weighs a different amount.',
      },
      {
        term: 'Level measure',
        description:
          'A spoon or cup filled and then leveled off with a flat edge so nothing is heaped above the rim. Unless a recipe says otherwise, amounts are level measures.',
      },
    ],
  },
};
