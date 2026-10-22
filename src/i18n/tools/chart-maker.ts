import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ChartMakerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  dataLabel: string;
  dataHint: string;
  sampleData: string;
  sampleButton: string;
  clearButton: string;
  typeLabel: string;
  typeBar: string;
  typeLine: string;
  typePie: string;
  titleLabel: string;
  titlePlaceholder: string;
  xLabel: string;
  yLabel: string;
  sizeLabel: string;
  scaleLabel: string;
  optionLegend: string;
  optionGrid: string;
  optionTransparent: string;
  downloadButton: string;
  downloaded: string;
  downloadFailed: string;
  canvasLabel: string;
  /** 円グラフで複数系列があるとき、先頭の系列だけ使う旨 */
  pieFirstSeriesNote: string;
  errorEmpty: string;
  errorUnterminatedQuote: string;
  errorNoSeries: string;
  /** `{max}` を置換して使うテンプレート */
  errorTooManyRowsTemplate: string;
  /** `{max}` を置換して使うテンプレート */
  errorTooManySeriesTemplate: string;
  /** `{row}` `{column}` を置換して使うテンプレート */
  errorNotNumberTemplate: string;
  errorPieNegative: string;
  errorPieZeroTotal: string;
  errorTooSmall: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const chartMakerContent: Record<Locale, ChartMakerPageContent> = {
  ja: {
    title: 'グラフ作成（棒・折れ線・円）｜CSVからPNG画像を無料で作成',
    description:
      'CSVや表計算ソフトからコピーしたデータを貼り付けるだけで、棒グラフ・折れ線グラフ・円グラフを作ってPNG画像で保存できる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'グラフ作成（棒・折れ線・円グラフをPNGで保存）',
    introHtml:
      'CSV・TSV、またはExcel・スプレッドシートからコピーした表を貼り付けて、棒グラフ・折れ線グラフ・円グラフを作ります。1行目を系列名、1列目をラベルとして読み取り、複数の系列も重ねて表示できます。完成したグラフはPNG画像として保存でき、資料やブログにそのまま貼れます。入力したデータはブラウザ内で処理され、サーバーには送信されません。データの中身を確認・並べ替えたいときは <a href="/tools/csv-viewer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSVビューア</a> もご利用ください。',
    dataLabel: 'グラフの元データ',
    dataHint:
      '1行目が系列名、1列目がラベルです。カンマ・タブ・セミコロン区切りを自動で判別します（Excelからのコピーも貼り付け可）。',
    sampleData:
      '月,売上,費用\n1月,120,80\n2月,150,90\n3月,180,100\n4月,170,110',
    sampleButton: 'サンプルを入れる',
    clearButton: 'クリア',
    typeLabel: 'グラフの種類',
    typeBar: '棒グラフ',
    typeLine: '折れ線グラフ',
    typePie: '円グラフ',
    titleLabel: 'タイトル',
    titlePlaceholder: '例: 月別の売上',
    xLabel: '横軸のラベル',
    yLabel: '縦軸のラベル',
    sizeLabel: '画像のサイズ',
    scaleLabel: '解像度',
    optionLegend: '凡例を表示',
    optionGrid: 'グリッド線を表示',
    optionTransparent: '背景を透明にする',
    downloadButton: 'PNGで保存',
    downloaded: 'PNG画像を保存しました。',
    downloadFailed: '画像の書き出しに失敗しました。',
    canvasLabel: '作成したグラフのプレビュー',
    pieFirstSeriesNote: '円グラフでは最初の系列（2列目）だけを使います。',
    errorEmpty: 'データを入力してください（1行目に系列名、2行目以降に値）。',
    errorUnterminatedQuote: '引用符（"）が閉じられていません。',
    errorNoSeries:
      '値の列がありません。ラベルの右に、数値の列を1つ以上入れてください。',
    errorTooManyRowsTemplate: 'データ行は最大{max}行までです。',
    errorTooManySeriesTemplate: '系列（値の列）は最大{max}列までです。',
    errorNotNumberTemplate:
      '{row}行目・{column}列目が数値ではありません。数値か空欄にしてください。',
    errorPieNegative: '円グラフでは負の値は使えません。',
    errorPieZeroTotal: '円グラフには、合計が0より大きくなる値が必要です。',
    errorTooSmall:
      '画像サイズに対して項目が多すぎてグラフを描けません。画像のサイズを大きくするか、データを減らしてください。',
    notesHeading: '注意事項',
    notes: [
      'データ行は最大200行、系列（値の列）は最大8列までです。',
      '数値のカンマ区切り（1,234）・全角数字・末尾の%記号は読み取れます。空欄は欠損として扱い、折れ線では線が途切れます。',
      '棒グラフは縦軸が0から始まります。折れ線グラフは値の範囲に合わせて縦軸を調整します。',
      '円グラフは最初の系列だけを使い、負の値は使えません。値が0・空欄の項目は表示されません。',
      '文字のフォントは、お使いの端末にあるフォントで描かれます。端末によって見た目がわずかに異なることがあります。',
      '「背景を透明にする」を選ぶと、PNGの背景が透明になります。プレビューは白地で表示されますが、保存される画像には白地は入りません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '「グラフの元データ」欄に、CSVやExcelからコピーした表を貼り付ける',
      '「グラフの種類」で棒・折れ線・円を選ぶ',
      'タイトルや軸のラベル、画像のサイズを整える',
      '「PNGで保存」を押して画像をダウンロードする',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '系列',
        description:
          'グラフに描く1本の値の並びのことです。このツールでは2列目以降の各列が1つの系列になり、1行目の見出しが系列名（凡例）になります。',
      },
      {
        term: 'CSV',
        description:
          'カンマなどで値を区切ったテキスト形式の表データです。ExcelやGoogleスプレッドシートからコピーしたタブ区切りの表も、そのまま貼り付けられます。',
      },
      {
        term: 'PNG',
        description:
          '劣化のない可逆圧縮の画像形式です。文字や線がくっきり残り、透明な背景も扱えるため、グラフの保存に向いています。',
      },
    ],
  },
  en: {
    title: 'Chart Maker (Bar, Line, Pie) – CSV to PNG Online',
    description:
      'Paste CSV or spreadsheet data to make a bar, line or pie chart and save it as a PNG. Free; your data stays in your browser and is never uploaded.',
    h1: 'Chart Maker: Bar, Line and Pie Charts to PNG',
    introHtml:
      'Paste CSV, TSV, or a table copied from Excel or a spreadsheet and get a bar, line or pie chart. The first row is read as series names and the first column as labels, so you can plot several series together. Save the result as a PNG for slides, docs or blog posts. Your data is processed in your browser and never uploaded. To inspect or sort the data first, try the <a href="/en/tools/csv-viewer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSV Viewer</a>.',
    dataLabel: 'Chart data',
    dataHint:
      'The first row holds series names and the first column holds labels. Comma, tab and semicolon delimiters are detected automatically, so you can paste straight from Excel.',
    sampleData:
      'Month,Sales,Cost\nJan,120,80\nFeb,150,90\nMar,180,100\nApr,170,110',
    sampleButton: 'Insert sample',
    clearButton: 'Clear',
    typeLabel: 'Chart type',
    typeBar: 'Bar',
    typeLine: 'Line',
    typePie: 'Pie',
    titleLabel: 'Title',
    titlePlaceholder: 'e.g. Monthly sales',
    xLabel: 'X-axis label',
    yLabel: 'Y-axis label',
    sizeLabel: 'Image size',
    scaleLabel: 'Resolution',
    optionLegend: 'Show legend',
    optionGrid: 'Show grid lines',
    optionTransparent: 'Transparent background',
    downloadButton: 'Save as PNG',
    downloaded: 'Saved the PNG image.',
    downloadFailed: 'Could not export the image.',
    canvasLabel: 'Preview of the chart',
    pieFirstSeriesNote:
      'A pie chart uses only the first series (the second column).',
    errorEmpty:
      'Enter some data: series names in the first row, values below it.',
    errorUnterminatedQuote: 'A quotation mark (") is not closed.',
    errorNoSeries:
      'There is no value column. Add at least one numeric column to the right of the labels.',
    errorTooManyRowsTemplate: 'You can use up to {max} data rows.',
    errorTooManySeriesTemplate:
      'You can use up to {max} series (value columns).',
    errorNotNumberTemplate:
      'Row {row}, column {column} is not a number. Use a number or leave it blank.',
    errorPieNegative: 'A pie chart cannot use negative values.',
    errorPieZeroTotal:
      'A pie chart needs values that add up to more than zero.',
    errorTooSmall:
      'There is too much data to draw at this image size. Choose a larger size or use less data.',
    notesHeading: 'Notes',
    notes: [
      'Up to 200 data rows and 8 series (value columns) are supported.',
      'Thousands separators (1,234), full-width digits and a trailing % sign are accepted. Blank cells are treated as missing, which breaks the line in a line chart.',
      'Bar charts always start the value axis at 0. Line charts fit the axis to the range of your values.',
      'A pie chart uses only the first series and cannot use negative values. Items that are 0 or blank are not drawn.',
      'Text is drawn with fonts installed on your device, so the look can differ slightly between devices.',
      'With "Transparent background" on, the saved PNG has a transparent background. The preview still shows a white backdrop, but it is not part of the saved image.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Paste a table copied from CSV or Excel into "Chart data"',
      'Choose bar, line or pie under "Chart type"',
      'Adjust the title, axis labels and image size',
      'Press "Save as PNG" to download the image',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Series',
        description:
          'One run of values drawn on the chart. Here each column from the second onward is a series, and its header in the first row becomes the series name in the legend.',
      },
      {
        term: 'CSV',
        description:
          'A plain-text table whose values are separated by commas or similar delimiters. Tab-separated tables copied from Excel or Google Sheets can be pasted as they are.',
      },
      {
        term: 'PNG',
        description:
          'A lossless image format. Text and lines stay sharp and transparent backgrounds are supported, which suits charts.',
      },
    ],
  },
};
