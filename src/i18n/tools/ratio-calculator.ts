import type { Locale } from '../../data/tools';
import type { PercentageMode } from '../../lib/tools/ratio-calculator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface PercentageModeLabels {
  optionLabel: string;
  value1Label: string;
  value2Label: string;
  value1Placeholder: string;
  value2Placeholder: string;
  resultLabel: string;
  /** 結果に付与する単位（割合(%)・増減率(%)を求めるモードは'%'、それ以外は''） */
  resultUnit: string;
}

export interface RatioCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;

  section1Heading: string;
  section1Intro: string;
  ratioALabel: string;
  ratioBLabel: string;
  ratioAPlaceholder: string;
  ratioBPlaceholder: string;
  errorRatio: string;
  ratioResultLabel: string;

  section2Heading: string;
  section2Intro: string;
  proportionUnknownLegend: string;
  proportionLabelA: string;
  proportionLabelB: string;
  proportionLabelC: string;
  proportionLabelD: string;
  errorProportion: string;
  proportionResultLabel: string;

  section3Heading: string;
  section3Intro: string;
  percentModeLegend: string;
  percentModes: Record<PercentageMode, PercentageModeLabels>;
  errorPercent: string;
  percentResultLabel: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const ratioCalculatorContent: Record<
  Locale,
  RatioCalculatorPageContent
> = {
  ja: {
    title: '割合・比率計算機（比の簡略化・比例式・割合の相互計算）',
    description:
      '比（A:B）を最も簡単な整数比に約分したり、比例式（A:B=C:D）の空欄の値を求めたり、部分・全体・割合(%)・増減率を相互に計算できる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '割合・比率計算機',
    introHtml:
      '比を最も簡単な整数比に約分する「比の簡略化」、比例式（A:B=C:D）の空欄の値を求める「比例式の計算」、部分の値・全体の値・割合(%)・増減率のいずれかを求める「割合の計算」の3つの機能をまとめたツールです。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。税込/税抜金額や割引後の価格を計算したい場合は <a href="/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">消費税・割引計算機</a> もあわせてご利用ください。',
    numberLocale: 'ja-JP',

    section1Heading: '1. 比の簡略化',
    section1Intro: '比 A:B を最も簡単な整数比に約分します。',
    ratioALabel: 'A',
    ratioBLabel: 'B',
    ratioAPlaceholder: '4',
    ratioBPlaceholder: '6',
    errorRatio: '計算できませんでした（A・Bは0より大きい値を入力してください）',
    ratioResultLabel: '簡略化した比',

    section2Heading: '2. 比例式の計算',
    section2Intro:
      '比例式 A:B = C:D が成り立つとき、空欄にした1項の値を求めます。',
    proportionUnknownLegend: '空欄にする項目',
    proportionLabelA: 'A',
    proportionLabelB: 'B',
    proportionLabelC: 'C',
    proportionLabelD: 'D',
    errorProportion:
      '計算できませんでした（空欄以外の3項に0より大きい値を入力してください）',
    proportionResultLabel: '計算結果',

    section3Heading: '3. 割合(%)の計算',
    section3Intro: '求めたい値に応じて計算方法を選んでください。',
    percentModeLegend: '計算方法',
    percentModes: {
      partToPercent: {
        optionLabel: '部分の値と全体の値 → 割合(%)',
        value1Label: '部分の値',
        value2Label: '全体の値',
        value1Placeholder: '25',
        value2Placeholder: '200',
        resultLabel: '割合',
        resultUnit: '%',
      },
      percentToPart: {
        optionLabel: '全体の値と割合(%) → 部分の値',
        value1Label: '全体の値',
        value2Label: '割合(%)',
        value1Placeholder: '200',
        value2Placeholder: '12.5',
        resultLabel: '部分の値',
        resultUnit: '',
      },
      partToWhole: {
        optionLabel: '部分の値と割合(%) → 全体の値',
        value1Label: '部分の値',
        value2Label: '割合(%)',
        value1Placeholder: '25',
        value2Placeholder: '12.5',
        resultLabel: '全体の値',
        resultUnit: '',
      },
      changeRate: {
        optionLabel: '元の値と新しい値 → 増減率(%)',
        value1Label: '元の値',
        value2Label: '新しい値',
        value1Placeholder: '100',
        value2Placeholder: '120',
        resultLabel: '増減率',
        resultUnit: '%',
      },
    },
    errorPercent:
      '計算できませんでした（入力値を確認してください。割合(%)を求める場合は全体の値、増減率を求める場合は元の値を0より大きい値にしてください）',
    percentResultLabel: '計算結果',

    notesHeading: '注意事項',
    notes: [
      '「比の簡略化」は、入力した比が0または負の値、あるいは小数として認識できない場合は計算できません。',
      '「比例式の計算」では、空欄にした項目以外の3項すべてに0より大きい値を入力してください。',
      '「割合の計算」の増減率は、元の値に対する変化の割合です。増加ならプラス、減少ならマイナスの値になります。',
      '本ツールは概算のシミュレーションです。表示された数値を根拠資料としてそのまま利用する場合は、別途正確性を確認してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '比（比率）',
        description:
          '2つ以上の数量の大きさを比べた割合をA:B（コロン）の形で表したもの。例えば「4:6」は「2:3」と同じ大きさの関係を表しており、両辺を最大公約数で割ることで最も簡単な整数比（既約比）に約分できます。',
      },
      {
        term: '比例式',
        description:
          '「A:B = C:D」のように、2つの比が等しいことを示す式。内項の積と外項の積が等しい（A×D = B×C）という関係を使うと、3つの項の値がわかれば残り1つの項の値を求められます。',
      },
      {
        term: '割合(%)',
        description:
          '全体に対して一部が占める大きさをパーセント（%）で表したもの。「部分の値 ÷ 全体の値 × 100」で求められ、逆に「全体の値 × 割合(%) ÷ 100」で部分の値を求めることもできます。',
      },
      {
        term: '増減率',
        description:
          '元の値から新しい値へどれだけ変化したかを、元の値に対する割合(%)で表したもの。「（新しい値－元の値）÷ 元の値 × 100」で求められ、増加していればプラス、減少していればマイナスの値になります。前年比・前月比などの計算に使われます。',
      },
    ],
  },
  en: {
    title: 'Ratio & Percentage Calculator',
    description:
      'Simplify ratios, solve proportions (A:B = C:D), or convert between part, whole, and percentage. Runs in your browser; nothing is sent to a server.',
    h1: 'Ratio & Percentage Calculator',
    introHtml:
      'This tool bundles three related calculations: reducing a ratio to its simplest whole-number form, solving for a missing term in a proportion (A:B = C:D), and converting between a part, a whole, a percentage, and a rate of change. Everything happens in your browser, and nothing you type is ever sent to a server. If you want to work out a tax-included/excluded price or a discounted price, try the <a href="/en/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Consumption Tax & Discount Calculator</a> as well.',
    numberLocale: 'en-US',

    section1Heading: '1. Simplify a ratio',
    section1Intro: 'Reduce the ratio A:B to its simplest whole-number form.',
    ratioALabel: 'A',
    ratioBLabel: 'B',
    ratioAPlaceholder: '4',
    ratioBPlaceholder: '6',
    errorRatio: 'Could not calculate (A and B must be greater than 0)',
    ratioResultLabel: 'Simplified ratio',

    section2Heading: '2. Solve a proportion',
    section2Intro:
      'Given the proportion A:B = C:D, calculate the value of whichever term you leave blank.',
    proportionUnknownLegend: 'Term to solve for',
    proportionLabelA: 'A',
    proportionLabelB: 'B',
    proportionLabelC: 'C',
    proportionLabelD: 'D',
    errorProportion:
      'Could not calculate (the other three terms must all be greater than 0)',
    proportionResultLabel: 'Result',

    section3Heading: '3. Percentage calculations',
    section3Intro: 'Choose what you want to calculate.',
    percentModeLegend: 'Calculation',
    percentModes: {
      partToPercent: {
        optionLabel: 'Part + whole → percentage',
        value1Label: 'Part',
        value2Label: 'Whole',
        value1Placeholder: '25',
        value2Placeholder: '200',
        resultLabel: 'Percentage',
        resultUnit: '%',
      },
      percentToPart: {
        optionLabel: 'Whole + percentage → part',
        value1Label: 'Whole',
        value2Label: 'Percentage (%)',
        value1Placeholder: '200',
        value2Placeholder: '12.5',
        resultLabel: 'Part',
        resultUnit: '',
      },
      partToWhole: {
        optionLabel: 'Part + percentage → whole',
        value1Label: 'Part',
        value2Label: 'Percentage (%)',
        value1Placeholder: '25',
        value2Placeholder: '12.5',
        resultLabel: 'Whole',
        resultUnit: '',
      },
      changeRate: {
        optionLabel: 'Old value + new value → rate of change',
        value1Label: 'Old value',
        value2Label: 'New value',
        value1Placeholder: '100',
        value2Placeholder: '120',
        resultLabel: 'Rate of change',
        resultUnit: '%',
      },
    },
    errorPercent:
      'Could not calculate (check your input; the whole must be greater than 0 to find a percentage, and the old value must be greater than 0 to find a rate of change)',
    percentResultLabel: 'Result',

    notesHeading: 'Notes',
    notes: [
      '"Simplify a ratio" can\'t calculate if either value is 0, negative, or not recognized as a valid number.',
      'For "Solve a proportion", enter a value greater than 0 for all three terms other than the one you leave blank.',
      'The rate of change in "Percentage calculations" is relative to the old value: positive for an increase, negative for a decrease.',
      'This tool provides a rough simulation only. Double-check accuracy separately before relying on the results for anything official.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Ratio',
        description:
          'A comparison of the sizes of two or more quantities, written as A:B. For example, "4:6" represents the same relationship as "2:3" — dividing both sides by their greatest common divisor reduces it to the simplest whole-number ratio.',
      },
      {
        term: 'Proportion',
        description:
          'An equation stating that two ratios are equal, such as "A:B = C:D". Because the product of the extremes equals the product of the means (A×D = B×C), knowing any three terms lets you solve for the fourth.',
      },
      {
        term: 'Percentage',
        description:
          'The size of a part relative to a whole, expressed out of 100. It\'s calculated as "part ÷ whole × 100", and conversely the part can be found as "whole × percentage ÷ 100".',
      },
      {
        term: 'Rate of change',
        description:
          'How much a value changed from an old value to a new one, expressed as a percentage of the old value: "(new value − old value) ÷ old value × 100". It\'s positive for an increase and negative for a decrease, and is commonly used for year-over-year or month-over-month comparisons.',
      },
    ],
  },
};
