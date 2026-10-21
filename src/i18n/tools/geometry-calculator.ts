import type { Locale } from '../../data/tools';
import type {
  MetricKey,
  ShapeId,
  UnitId,
} from '../../lib/tools/geometry-calculator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ShapeLabels {
  name: string;
  /** パラメータ記号 -> 入力欄ラベル */
  params: Record<string, string>;
}

export interface GeometryCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;

  shapeLabel: string;
  shapes: Record<ShapeId, ShapeLabels>;
  unitLabel: string;
  units: Record<UnitId, string>;
  piLabel: string;
  piOptions: { exact: string; d2: string; d4: string; d10: string };

  resultHeading: string;
  metrics: Record<MetricKey, string>;
  formulaLabel: string;
  substitutionLabel: string;
  copyButton: string;
  copiedMessage: string;
  copyFailedMessage: string;

  errorEmpty: string;
  errorInvalid: string;
  errorNonPositive: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const geometryCalculatorContent: Record<
  Locale,
  GeometryCalculatorPageContent
> = {
  ja: {
    title: '図形の面積・体積計算（円・三角形・台形・円柱・円錐・球）',
    description:
      '円・三角形・四角形・台形の面積、円柱・円錐・球・直方体の体積と表面積を、公式と途中式つきで計算できます。単位指定、円周率の桁数指定に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '図形の面積・体積計算',
    introHtml:
      '円・三角形・四角形・台形の面積と、円柱・円錐・球・直方体の体積・表面積を、公式と数値を代入した途中式つきで計算します。長さの単位を選ぶと、面積は cm²、体積は cm³ のように単位が自動で切り替わります。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。比の計算には <a href="/tools/ratio-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">割合・比率計算機</a>、単位の換算には <a href="/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">単位変換ツール</a> もご利用ください。',
    numberLocale: 'ja-JP',

    shapeLabel: '図形',
    shapes: {
      circle: { name: '円', params: { r: '半径 r' } },
      triangle: { name: '三角形', params: { b: '底辺 b', h: '高さ h' } },
      rectangle: {
        name: '四角形（長方形）',
        params: { w: '横 w', h: '縦 h' },
      },
      trapezoid: {
        name: '台形',
        params: { a: '上底 a', b: '下底 b', h: '高さ h' },
      },
      cylinder: { name: '円柱', params: { r: '底面の半径 r', h: '高さ h' } },
      cone: { name: '円錐', params: { r: '底面の半径 r', h: '高さ h' } },
      sphere: { name: '球', params: { r: '半径 r' } },
      cuboid: {
        name: '直方体',
        params: { w: '横 w', d: '奥行き d', h: '高さ h' },
      },
    },
    unitLabel: '長さの単位',
    units: {
      mm: 'mm（ミリメートル）',
      cm: 'cm（センチメートル）',
      m: 'm（メートル）',
      km: 'km（キロメートル）',
      in: 'in（インチ）',
      ft: 'ft（フィート）',
    },
    piLabel: '円周率 π の扱い',
    piOptions: {
      exact: 'そのまま（3.141592653589793）',
      d2: '3.14',
      d4: '3.1416',
      d10: '3.1415926536',
    },

    resultHeading: '計算結果',
    metrics: {
      area: '面積',
      circumference: '円周',
      perimeter: '周の長さ',
      slant: '母線の長さ l',
      volume: '体積',
      surfaceArea: '表面積',
    },
    formulaLabel: '公式',
    substitutionLabel: '途中式',
    copyButton: '結果をコピー',
    copiedMessage: 'コピーしました',
    copyFailedMessage: 'コピーできませんでした',

    errorEmpty: 'すべての項目に数値を入力してください。',
    errorInvalid: '数値として扱えない値、または大きすぎる値が含まれています。',
    errorNonPositive:
      '0 以下の値は計算できません。0 より大きい値を入力してください。',

    notesHeading: '注意事項',
    notes: [
      '入力はすべて同じ長さの単位として扱います。mm と cm のように単位が混在する場合は、先に換算してから入力してください。',
      '結果は小数第6位までで丸めて表示します。円周率にそのまま Math.PI を使う場合でも、浮動小数点の誤差がごくわずかに含まれます。',
      '円周率を 3.14 などに指定すると、教科書や試験の計算に合わせた値になります。途中式の π もその値で表示されます。',
      '三角形・台形は面積のみ、四角形は面積と周の長さを表示します。斜めの辺の長さが必要な図形の周は計算しません。',
      '円錐の表面積は、底面積と側面積（π × r × 母線）の合計です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '円周率（π）',
        description:
          '円周の長さと直径の比で、約 3.14159265… と続く無理数です。計算では 3.14 や 3.1416 に丸めて使うことがあり、桁数によって結果が少し変わります。',
      },
      {
        term: '表面積',
        description:
          '立体の表面全体の面積。円柱なら上下の円2つと側面、直方体なら6つの面の合計です。',
      },
      {
        term: '母線',
        description:
          '円錐の頂点から底面の円周までの斜めの長さ。半径 r と高さ h から √(r² + h²) で求められます。',
      },
      {
        term: '面積と体積の単位',
        description:
          '長さを cm で入力すると、面積は cm²（平方センチメートル）、体積は cm³（立方センチメートル）になります。1 m² = 10,000 cm²、1 L = 1,000 cm³ です。',
      },
    ],
  },
  en: {
    title: 'Area & Volume Calculator for Shapes with Formulas',
    description:
      'Find the area of circles, triangles and trapezoids and the volume of cylinders, cones, spheres and boxes, with formulas and steps. Runs in your browser.',
    h1: 'Area & Volume Calculator',
    introHtml:
      'Work out the area of a circle, triangle, rectangle or trapezoid, and the volume and surface area of a cylinder, cone, sphere or box. The formula and your numbers plugged into it are shown step by step. Pick a length unit and the area and volume units follow, such as cm² and cm³. Everything runs in your browser and nothing you enter is sent to a server. For ratios, see the <a href="/en/tools/ratio-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Ratio & Percentage Calculator</a>, and to convert units, try the <a href="/en/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unit Converter</a>.',
    numberLocale: 'en-US',

    shapeLabel: 'Shape',
    shapes: {
      circle: { name: 'Circle', params: { r: 'Radius r' } },
      triangle: { name: 'Triangle', params: { b: 'Base b', h: 'Height h' } },
      rectangle: {
        name: 'Rectangle',
        params: { w: 'Width w', h: 'Height h' },
      },
      trapezoid: {
        name: 'Trapezoid',
        params: { a: 'Top side a', b: 'Bottom side b', h: 'Height h' },
      },
      cylinder: {
        name: 'Cylinder',
        params: { r: 'Base radius r', h: 'Height h' },
      },
      cone: { name: 'Cone', params: { r: 'Base radius r', h: 'Height h' } },
      sphere: { name: 'Sphere', params: { r: 'Radius r' } },
      cuboid: {
        name: 'Box (cuboid)',
        params: { w: 'Width w', d: 'Depth d', h: 'Height h' },
      },
    },
    unitLabel: 'Length unit',
    units: {
      mm: 'mm (millimeters)',
      cm: 'cm (centimeters)',
      m: 'm (meters)',
      km: 'km (kilometers)',
      in: 'in (inches)',
      ft: 'ft (feet)',
    },
    piLabel: 'Value of π',
    piOptions: {
      exact: 'Full precision (3.141592653589793)',
      d2: '3.14',
      d4: '3.1416',
      d10: '3.1415926536',
    },

    resultHeading: 'Result',
    metrics: {
      area: 'Area',
      circumference: 'Circumference',
      perimeter: 'Perimeter',
      slant: 'Slant height l',
      volume: 'Volume',
      surfaceArea: 'Surface area',
    },
    formulaLabel: 'Formula',
    substitutionLabel: 'Steps',
    copyButton: 'Copy results',
    copiedMessage: 'Copied',
    copyFailedMessage: 'Could not copy',

    errorEmpty: 'Enter a number in every field.',
    errorInvalid: 'One of the values is not a usable number or is too large.',
    errorNonPositive:
      'Values of 0 or less cannot be calculated. Enter a number greater than 0.',

    notesHeading: 'Notes',
    notes: [
      'All inputs are treated as the same length unit. If you have a mix such as mm and cm, convert them first.',
      'Results are rounded to 6 decimal places. Even with full-precision π, tiny floating-point errors can remain.',
      'Choosing 3.14 or another rounded π matches textbook and exam conventions. The steps show π as that value.',
      'Triangles and trapezoids show area only, and rectangles show area and perimeter. Perimeters that need slanted side lengths are not calculated.',
      "A cone's surface area is the base area plus the lateral area (π × r × slant height).",
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Pi (π)',
        description:
          "The ratio of a circle's circumference to its diameter, an irrational number of about 3.14159265… Rounded values such as 3.14 or 3.1416 are common, and the number of digits changes the result slightly.",
      },
      {
        term: 'Surface area',
        description:
          "The total area of a solid's outer surface. For a cylinder it is two circles plus the side, and for a box it is the sum of the six faces.",
      },
      {
        term: 'Slant height',
        description:
          "The slanted distance from a cone's apex to the edge of its base. It equals √(r² + h²) for radius r and height h.",
      },
      {
        term: 'Area and volume units',
        description:
          'If you enter lengths in cm, areas come out in cm² and volumes in cm³. 1 m² = 10,000 cm², and 1 L = 1,000 cm³.',
      },
    ],
  },
};
