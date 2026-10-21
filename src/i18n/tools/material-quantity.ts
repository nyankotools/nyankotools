import type { Locale } from '../../data/tools';

export interface MaterialQuantityPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  materialLegend: string;
  materialWallpaper: string;
  materialPaint: string;
  materialTile: string;
  modeLegend: string;
  modeDims: string;
  modeArea: string;
  widthLabel: string;
  depthLabel: string;
  heightLabel: string;
  areaLabel: string;
  areaNote: string;
  openingsHeading: string;
  doorsLabel: string;
  doorAreaLabel: string;
  windowsLabel: string;
  windowAreaLabel: string;
  openingsNote: string;
  lossLabel: string;
  rollWidthLabel: string;
  rollLengthLabel: string;
  coverageLabel: string;
  coatsLabel: string;
  canLitersLabel: string;
  pieceWidthLabel: string;
  pieceLengthLabel: string;
  piecesPerBoxLabel: string;
  error: string;
  resultGrossLabel: string;
  resultOpeningLabel: string;
  resultNetLabel: string;
  resultTatamiLabel: string;
  resultWithLossLabel: string;
  resultRollsLabel: string;
  resultRollAreaLabel: string;
  resultLitersLabel: string;
  resultCansLabel: string;
  resultPurchasedLabel: string;
  resultPiecesLabel: string;
  resultBoxesLabel: string;
  unitSqm: string;
  unitLiter: string;
  unitRolls: string;
  unitCans: string;
  unitPieces: string;
  unitBoxes: string;
  unitTatami: string;
  notesHeading: string;
  notes: string[];
}

export const materialQuantityContent: Record<
  Locale,
  MaterialQuantityPageContent
> = {
  ja: {
    title: '壁紙・塗料・タイル・床材の必要量計算｜ロール数・缶数・枚数',
    description:
      '部屋の寸法や面積から、壁紙のロール数、塗料の缶数、タイル・床材の枚数と箱数を計算します。ドア・窓の控除とロス率に対応し、畳換算も表示。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '壁紙・塗料・タイル・床材の必要量計算（DIY向け）',
    introHtml:
      '部屋の幅・奥行・高さ（または面積）を入れ、ドアや窓の分を引き、ロス率を足して、壁紙は何ロール、塗料は何缶、タイルや床材は何枚・何箱必要かを計算します。㎡と畳の換算も表示します。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。<a href="/tools/unit-converter/">単位変換</a>や<a href="/tools/screen-size-calculator/">画面サイズ計算</a>もあわせてどうぞ。',
    numberLocale: 'ja-JP',
    materialLegend: '材料',
    materialWallpaper: '壁紙',
    materialPaint: '塗料',
    materialTile: 'タイル・床材',
    modeLegend: '面積の入力方法',
    modeDims: '部屋の寸法から計算',
    modeArea: '面積を直接入力',
    widthLabel: '幅（m）',
    depthLabel: '奥行（m）',
    heightLabel: '天井高（m）',
    areaLabel: '面積（㎡）',
    areaNote:
      '壁紙・塗料は貼る・塗る壁の総面積、タイル・床材は床面積を入力します。',
    openingsHeading: 'ドア・窓（壁紙・塗料のみ控除）',
    doorsLabel: 'ドアの数',
    doorAreaLabel: 'ドア1枚の面積（㎡）',
    windowsLabel: '窓の数',
    windowAreaLabel: '窓1枚の面積（㎡）',
    openingsNote:
      '目安：一般的なドアは約1.6㎡（幅0.8m×高さ2m）、腰高窓は約1.5㎡です。',
    lossLabel: 'ロス率（%）',
    rollWidthLabel: '壁紙の幅（m）',
    rollLengthLabel: '1ロールの長さ（m）',
    coverageLabel: '塗れる面積（㎡/L・1回塗り）',
    coatsLabel: '塗り回数',
    canLitersLabel: '1缶の容量（L）',
    pieceWidthLabel: '1枚の幅（cm）',
    pieceLengthLabel: '1枚の長さ（cm）',
    piecesPerBoxLabel: '1箱の枚数',
    error:
      '計算できませんでした（寸法・面積・材料の数値は0より大きく、ドア・窓の数は0以上の整数、ロス率は0以上、塗り回数と1箱の枚数は1以上の整数にしてください。ドア・窓が壁面積以上の場合も計算できません）',
    resultGrossLabel: '開口部を引く前の面積',
    resultOpeningLabel: 'ドア・窓の面積',
    resultNetLabel: '施工面積',
    resultTatamiLabel: '施工面積の畳換算（1畳=1.62㎡）',
    resultWithLossLabel: 'ロスを含む面積',
    resultRollsLabel: '必要なロール数',
    resultRollAreaLabel: '1ロールの面積',
    resultLitersLabel: '必要な塗料の量',
    resultCansLabel: '必要な缶数',
    resultPurchasedLabel: '購入する合計量',
    resultPiecesLabel: '必要な枚数',
    resultBoxesLabel: '必要な箱数',
    unitSqm: '㎡',
    unitLiter: 'L',
    unitRolls: 'ロール',
    unitCans: '缶',
    unitPieces: '枚',
    unitBoxes: '箱',
    unitTatami: '畳',
    notesHeading: '注意事項',
    notes: [
      '壁紙は面積÷ロールの面積で概算しています。実際は柄合わせや天井高に合わせた切り出しで、巾（ストリップ）単位のロスが出るため、ロス率は多めに見るか、メーカーの目安と見比べてください。',
      '塗料の「塗れる面積」は製品ごとに異なり、下地の吸い込みや塗り方でも変わります。製品表示の値（㎡/L）を入力してください。',
      'タイル・床材は、斜め貼りや柄合わせ、端材の出方でロスが増えます。直線貼りで5〜10%、斜め貼りで10〜15%が一つの目安です。',
      '畳換算は1畳=1.62㎡で計算しています。江戸間・京間などサイズの違いによる畳数とは一致しない場合があります。',
    ],
  },
  en: {
    title: 'Wallpaper, Paint, Tile & Flooring Quantity Calculator',
    description:
      'Estimate rolls of wallpaper, cans of paint, and tiles or flooring boxes from room size, minus doors and windows, plus waste. Runs in your browser.',
    h1: 'Wallpaper, Paint, Tile and Flooring Quantity Calculator for DIY',
    introHtml:
      'Enter the room width, depth and height (or an area), subtract doors and windows, add a waste allowance, and see how many rolls of wallpaper, cans of paint, or tiles and boxes of flooring you need. Square meters are also shown as Japanese tatami mats. Everything runs in your browser and nothing you type is sent to a server. You may also want the <a href="/en/tools/unit-converter/">unit converter</a> or the <a href="/en/tools/screen-size-calculator/">screen size calculator</a>.',
    numberLocale: 'en-US',
    materialLegend: 'Material',
    materialWallpaper: 'Wallpaper',
    materialPaint: 'Paint',
    materialTile: 'Tile / flooring',
    modeLegend: 'How to enter the area',
    modeDims: 'From room dimensions',
    modeArea: 'Enter area directly',
    widthLabel: 'Width (m)',
    depthLabel: 'Depth (m)',
    heightLabel: 'Ceiling height (m)',
    areaLabel: 'Area (m²)',
    areaNote:
      'For wallpaper and paint, enter the total wall area; for tile and flooring, enter the floor area.',
    openingsHeading:
      'Doors and windows (deducted for wallpaper and paint only)',
    doorsLabel: 'Number of doors',
    doorAreaLabel: 'Area per door (m²)',
    windowsLabel: 'Number of windows',
    windowAreaLabel: 'Area per window (m²)',
    openingsNote:
      'Rough guide: a standard door is about 1.6 m² (0.8 m x 2 m) and a window about 1.5 m².',
    lossLabel: 'Waste allowance (%)',
    rollWidthLabel: 'Wallpaper roll width (m)',
    rollLengthLabel: 'Length per roll (m)',
    coverageLabel: 'Coverage (m² per L, one coat)',
    coatsLabel: 'Number of coats',
    canLitersLabel: 'Can size (L)',
    pieceWidthLabel: 'Piece width (cm)',
    pieceLengthLabel: 'Piece length (cm)',
    piecesPerBoxLabel: 'Pieces per box',
    error:
      'Could not calculate (dimensions, area and material values must be above 0; doors and windows a whole number of 0 or more; waste 0 or more; coats and pieces per box a whole number of 1 or more. Doors and windows must also be smaller than the wall area)',
    resultGrossLabel: 'Area before deductions',
    resultOpeningLabel: 'Doors and windows',
    resultNetLabel: 'Area to cover',
    resultTatamiLabel: 'Area in tatami mats (1 mat = 1.62 m²)',
    resultWithLossLabel: 'Area including waste',
    resultRollsLabel: 'Rolls needed',
    resultRollAreaLabel: 'Area per roll',
    resultLitersLabel: 'Paint needed',
    resultCansLabel: 'Cans needed',
    resultPurchasedLabel: 'Total paint you buy',
    resultPiecesLabel: 'Pieces needed',
    resultBoxesLabel: 'Boxes needed',
    unitSqm: 'm²',
    unitLiter: 'L',
    unitRolls: 'rolls',
    unitCans: 'cans',
    unitPieces: 'pieces',
    unitBoxes: 'boxes',
    unitTatami: 'mats',
    notesHeading: 'Notes',
    notes: [
      'Wallpaper is estimated as area divided by roll area. In practice, pattern matching and cutting strips to the ceiling height waste material per strip, so use a generous waste allowance or compare with the manufacturer guidance.',
      'Paint coverage differs by product and also depends on how absorbent the surface is. Enter the m² per L printed on the product label.',
      'Diagonal layouts, pattern matching and awkward edges increase waste for tile and flooring. About 5-10% for a straight layout and 10-15% for a diagonal one is a common rule of thumb.',
      'Tatami conversion uses 1 mat = 1.62 m². Regional mat sizes (such as Edoma or Kyoma) differ, so the count may not match a mat count quoted for a room.',
    ],
  },
};
