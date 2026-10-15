import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface GraphPaperGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  typeLabel: string;
  typeGrid: string;
  typeRuled: string;
  typeDot: string;
  typeManuscript: string;
  paperLabel: string;
  paperA3: string;
  paperA4: string;
  paperA5: string;
  paperB4: string;
  paperB5: string;
  paperLetter: string;
  orientationLabel: string;
  orientationPortrait: string;
  orientationLandscape: string;
  cellLabel: string;
  marginLabel: string;
  lineWidthLabel: string;
  colorLabel: string;
  printButton: string;
  downloadButton: string;
  /** {columns} {rows} を置き換える */
  summary: string;
  downloaded: string;
  /** {min} {max} を置き換える */
  errorCell: string;
  errorMargin: string;
  errorLineWidth: string;
  errorColor: string;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const graphPaperGeneratorContent: Record<
  Locale,
  GraphPaperGeneratorPageContent
> = {
  ja: {
    title: '方眼紙・罫線・原稿用紙の作成（A4・B5・印刷用）',
    description:
      'A4・B5・A3などの用紙サイズと、マス寸法（mm）・線の色・余白を指定して、方眼紙・罫線ノート・ドット方眼・原稿用紙風のマス目を作成して印刷できます。SVG保存にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '方眼紙・罫線・原稿用紙の作成（印刷用）',
    introHtml:
      '用紙サイズとマスの大きさ（mm）を指定するだけで、方眼紙・罫線・ドット方眼・原稿用紙風のマス目を作成します。実寸のまま印刷やPDF保存ができ、SVGとして保存することもできます。ブラウザ内で作成され、設定がサーバーに送信されることはありません。日付入りの紙が必要なときは <a href="/tools/calendar-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カレンダー生成</a> もご利用ください。',

    typeLabel: '種類',
    typeGrid: '方眼',
    typeRuled: '罫線',
    typeDot: 'ドット方眼',
    typeManuscript: '原稿用紙風（外枠つき）',
    paperLabel: '用紙サイズ',
    paperA3: 'A3',
    paperA4: 'A4',
    paperA5: 'A5',
    paperB4: 'B4',
    paperB5: 'B5',
    paperLetter: 'レター（Letter）',
    orientationLabel: '向き',
    orientationPortrait: '縦',
    orientationLandscape: '横',
    cellLabel: 'マス・行間（mm）',
    marginLabel: '余白（mm）',
    lineWidthLabel: '線の太さ（mm）',
    colorLabel: '線の色',
    printButton: '印刷する',
    downloadButton: 'SVGで保存',
    summary: '横{columns}マス × 縦{rows}マス',
    downloaded: 'SVGを保存しました',
    errorCell: 'マスの大きさは{min}〜{max}mmで入力してください',
    errorMargin: '余白は{min}〜{max}mmで入力してください',
    errorLineWidth: '線の太さは{min}〜{max}mmで入力してください',
    errorColor: '線の色を正しく指定してください',

    howToHeading: '使い方',
    howToSteps: [
      '「種類」で方眼・罫線・ドット方眼・原稿用紙風から選び、「用紙サイズ」と「向き」を指定します。',
      '「マス・行間（mm）」「余白（mm）」「線の太さ（mm）」「線の色」を調整します。プレビューで仕上がりを確認できます。',
      '「印刷する」を押すと用紙だけが印刷されます（PDFとして保存もできます）。「SVGで保存」で画像として保存することもできます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '印刷ダイアログでは、倍率を100%（実際のサイズ）にし、ページに合わせる・用紙に合わせて縮小はオフにしてください。縮小されるとマスの寸法が変わります。',
      'プリンターには印刷できない縁があるため、余白を5mm以上にすると端が欠けにくくなります。',
      'マスは余白の内側に収まる整数個だけを中央寄せで並べます。そのため左右・上下の余白は指定値よりやや広くなることがあります。',
      '原稿用紙風は外枠つきのマス目です。20×20の400字詰め原稿用紙とは行間・欄外の作りが異なります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ドット方眼',
        description:
          '線ではなく、格子の交点に点だけを打ったノートです。線が目立たないため、図やイラスト、文字を自由に書きたいときに向いています。',
      },
      {
        term: 'A判・B判',
        description:
          '日本で一般的な用紙サイズの規格です。A4は210×297mmで、B5（JIS規格）は182×257mmです。B判はA判より一回り大きい寸法で、ノートや書籍に使われます。',
      },
    ],
  },
  en: {
    title: 'Graph Paper, Lined & Dot Grid Paper Generator (Printable)',
    description:
      'Make printable graph, lined or dot grid paper in A4, A3, Letter and more. Set the cell size in mm, then print or save as SVG. Runs in your browser.',
    h1: 'Printable Graph Paper, Lined & Dot Grid Generator',
    introHtml:
      'Choose a paper size and cell size in millimetres to make graph paper, lined paper, dot grid paper or a boxed manuscript sheet. Print it at true size or save it as a PDF, or download the sheet as SVG. Everything is generated in your browser, and your settings are never sent to a server. Need dated paper instead? Try the <a href="/en/tools/calendar-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Calendar Generator</a>.',

    typeLabel: 'Type',
    typeGrid: 'Graph paper',
    typeRuled: 'Lined',
    typeDot: 'Dot grid',
    typeManuscript: 'Boxed manuscript (with border)',
    paperLabel: 'Paper size',
    paperA3: 'A3',
    paperA4: 'A4',
    paperA5: 'A5',
    paperB4: 'B4',
    paperB5: 'B5',
    paperLetter: 'US Letter',
    orientationLabel: 'Orientation',
    orientationPortrait: 'Portrait',
    orientationLandscape: 'Landscape',
    cellLabel: 'Cell / line spacing (mm)',
    marginLabel: 'Margin (mm)',
    lineWidthLabel: 'Line width (mm)',
    colorLabel: 'Line color',
    printButton: 'Print',
    downloadButton: 'Save as SVG',
    summary: '{columns} columns × {rows} rows',
    downloaded: 'SVG saved',
    errorCell: 'Cell size must be between {min} and {max} mm.',
    errorMargin: 'Margin must be between {min} and {max} mm.',
    errorLineWidth: 'Line width must be between {min} and {max} mm.',
    errorColor: 'Enter a valid line color.',

    howToHeading: 'How to use',
    howToSteps: [
      'Pick a sheet under “Type”, then choose the “Paper size” and “Orientation”.',
      'Adjust “Cell / line spacing (mm)”, “Margin (mm)”, “Line width (mm)” and “Line color”. The preview shows the result.',
      'Press “Print” to print just the sheet (or save it as a PDF), or use “Save as SVG” to download it as an image.',
    ],
    notesHeading: 'Notes',
    notes: [
      'In the print dialog, set the scale to 100% (actual size) and turn off fit to page or shrink to fit. Scaling changes the real cell size.',
      'Printers cannot print to the very edge of the paper, so a margin of 5 mm or more keeps the edges from being cut off.',
      'Only whole cells that fit inside the margins are drawn, centered on the page, so the real margins can be slightly larger than the value you set.',
      'The boxed manuscript type is a bordered grid; it is not an exact copy of a 20×20 Japanese genkō yōshi sheet.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Dot grid',
        description:
          'Paper with dots at the grid intersections instead of full lines. The pattern stays out of the way, which suits sketching, diagrams and free-form notes.',
      },
      {
        term: 'A and B paper sizes',
        description:
          'ISO 216 defines the A series, where A4 is 210 × 297 mm. The B series (JIS B5 is 182 × 257 mm) is common in Japan for notebooks and books. US Letter is 215.9 × 279.4 mm.',
      },
    ],
  },
};
