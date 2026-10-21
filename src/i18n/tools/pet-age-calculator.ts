import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface PetAgeCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  speciesLegend: string;
  speciesDog: string;
  speciesCat: string;
  sizeLabel: string;
  sizeSmall: string;
  sizeMedium: string;
  sizeLarge: string;
  ageLegend: string;
  yearsLabel: string;
  monthsLabel: string;

  error: string;
  resultLabel: string;
  /** {y} は年 */
  resultYearsTemplate: string;
  /** {y} は年、{m} は月 */
  resultYearsMonthsTemplate: string;

  tableHeading: string;
  tableCaption: string;
  tablePetAge: string;
  tableCat: string;
  tableSmall: string;
  tableMedium: string;
  tableLarge: string;
  tableYearSuffix: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const petAgeCalculatorContent: Record<
  Locale,
  PetAgeCalculatorPageContent
> = {
  ja: {
    title: '犬・猫の年齢を人間に換算（体格別の早見表つき）',
    description:
      '犬・猫の年齢（年・月）を人間の年齢に換算する無料ツールです。犬は小型・中型・大型の体格別、猫を含む年齢別の早見表も表示します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '犬・猫の年齢を人間に換算',
    introHtml:
      '犬や猫の年齢を年と月で入力すると、人間でいうと何歳くらいかを計算します。犬は小型・中型・大型の体格別に、猫は1歳＝15歳・2歳＝24歳・以降は1年ごとに＋4歳という換算で求め、年齢別の早見表も表示します。ブラウザ内で計算され、入力内容がサーバーに送信されることはありません。人間の年齢や誕生日までの日数を調べたい場合は <a href="/tools/age-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">年齢計算機</a> もご利用ください。',

    speciesLegend: '種類',
    speciesDog: '犬',
    speciesCat: '猫',
    sizeLabel: '犬の体格',
    sizeSmall: '小型犬（体重 約10kg未満）',
    sizeMedium: '中型犬（約10〜25kg）',
    sizeLarge: '大型犬（約25kg以上）',
    ageLegend: 'ペットの年齢',
    yearsLabel: '年',
    monthsLabel: 'ヶ月',

    error:
      '計算できませんでした（年は0〜40、月は0〜11の整数で入力してください）',
    resultLabel: '人間に換算すると',
    resultYearsTemplate: '約{y}歳',
    resultYearsMonthsTemplate: '約{y}歳{m}ヶ月',

    tableHeading: '年齢別の換算早見表',
    tableCaption: '犬・猫の年齢と人間換算年齢の早見表',
    tablePetAge: 'ペットの年齢',
    tableCat: '猫',
    tableSmall: '小型犬',
    tableMedium: '中型犬',
    tableLarge: '大型犬',
    tableYearSuffix: '歳',

    notesHeading: '注意事項',
    notes: [
      '換算式は、1歳＝人間の15歳、2歳＝24歳とし、2歳以降は1年ごとに猫・小型犬が＋4歳、中型犬が＋5歳、大型犬が＋6歳とする、動物病院やペットフードメーカーの解説などで広く紹介されている目安式です。公的に定められた統一の基準はなく、資料によって数値は異なります。',
      '1歳未満と1〜2歳の間は、月数に応じて直線的に補間した概算値です。実際の成長はもっと速く、生後数か月で人間の十代に相当するといわれます。',
      '体格の区分は目安です。犬種や個体差、飼育環境、健康状態によって実際の老化の進み方は変わります。結果は健康管理や獣医師の診断に代わるものではありません。',
      '年は0〜40、月は0〜11の整数で入力してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '人間換算年齢',
        description:
          'ペットの成長や老化の進み具合を、人間の年齢に置き換えて示した目安です。ペットは生後1〜2年で成熟し、その後は人間より速いペースで年を重ねるため、実年齢をそのまま比べるより体の状態をイメージしやすくなります。',
      },
      {
        term: '犬の体格区分',
        description:
          '成犬時の体重による分類で、一般に小型犬・中型犬・大型犬に分けます。大型犬ほど寿命が短く老化が早い傾向があるため、2歳以降の換算で加算する年数が大きくなります。',
      },
    ],
  },
  en: {
    title: 'Pet Age Calculator: Dog & Cat Age in Human Years',
    description:
      "Convert your dog's or cat's age to human years, with an age chart by dog size and for cats. Runs in your browser; nothing is sent to a server.",
    h1: 'Dog & Cat Age to Human Years Calculator',
    introHtml:
      'Enter your pet\'s age in years and months to see roughly how old it is in human years. Cats follow 15 human years at age 1, 24 at age 2, and 4 more for each year after that; dogs use the same first two years and then add 4, 5, or 6 years per year depending on small, medium, or large size. A quick-reference chart is included. Everything is calculated in your browser, and nothing you type is sent to a server. To work out a person\'s age or the days until a birthday, try the <a href="/en/tools/age-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Age Calculator</a>.',

    speciesLegend: 'Pet',
    speciesDog: 'Dog',
    speciesCat: 'Cat',
    sizeLabel: 'Dog size',
    sizeSmall: 'Small (under about 22 lb / 10 kg)',
    sizeMedium: 'Medium (about 22–55 lb / 10–25 kg)',
    sizeLarge: 'Large (over about 55 lb / 25 kg)',
    ageLegend: "Pet's age",
    yearsLabel: 'years',
    monthsLabel: 'months',

    error: 'Could not calculate (enter whole numbers: years 0–40, months 0–11)',
    resultLabel: 'In human years',
    resultYearsTemplate: 'About {y} years old',
    resultYearsMonthsTemplate: 'About {y} years {m} months old',

    tableHeading: 'Age conversion chart',
    tableCaption: 'Dog and cat ages converted to human years',
    tablePetAge: 'Pet age',
    tableCat: 'Cat',
    tableSmall: 'Small dog',
    tableMedium: 'Medium dog',
    tableLarge: 'Large dog',
    tableYearSuffix: '',

    notesHeading: 'Notes',
    notes: [
      'The formula treats age 1 as 15 human years and age 2 as 24, then adds 4 years per year for cats and small dogs, 5 for medium dogs, and 6 for large dogs. This is a widely quoted rule of thumb from vets and pet food makers; there is no official standard, and sources differ.',
      'Ages under 1 and between 1 and 2 are straight-line estimates based on the number of months. In reality pets mature faster; a few months old is roughly a human teenager.',
      'Size groups are approximate. Breed, individual differences, lifestyle, and health all change how a pet ages. This is not a substitute for veterinary advice.',
      'Enter whole numbers: years 0–40 and months 0–11.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Human-equivalent age',
        description:
          "A rough way to express a pet's maturity and aging in human years. Pets mature within one to two years and then age faster than people, so the number is easier to picture than the calendar age.",
      },
      {
        term: 'Dog size groups',
        description:
          'Dogs are usually grouped by adult weight into small, medium, and large. Larger dogs tend to have shorter lifespans and age faster, so more human years are added per year after age 2.',
      },
    ],
  },
};
