import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SlidePuzzlePageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  sizeLabel: string;
  size3: string;
  size4: string;
  size5: string;
  modeLabel: string;
  modeNumber: string;
  modeImage: string;
  newGame: string;
  showNumbersLabel: string;
  dropLabel: string;
  dropHint: string;
  imageLoaded: string;
  previewLabel: string;
  errorUnsupportedFile: string;
  /** {max} を置換して表示する */
  errorFileTooLargeTemplate: string;
  errorImageFailed: string;
  boardLabel: string;
  /** {n} を置換して表示する */
  tileLabel: string;
  blankLabel: string;
  movesLabel: string;
  timeLabel: string;
  correctLabel: string;
  /** {correct} {total} を置換して表示する */
  correctValue: string;
  bestHeading: string;
  bestNone: string;
  /** {moves} {time} を置換して表示する */
  bestValue: string;
  resetRecords: string;
  recordsCleared: string;
  /** {moves} {time} を置換して表示する */
  completed: string;
  newBestMoves: string;
  newBestTime: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const slidePuzzleContent: Record<Locale, SlidePuzzlePageContent> = {
  ja: {
    title:
      'スライドパズル（15パズル）｜数字も自分の画像も遊べる無料ブラウザゲーム',
    description:
      'ブラウザで遊べるスライドパズル（15パズル）。3×3・4×4・5×5から選べて、数字だけでなく手持ちの画像でも遊べます。解けない配置は作りません。手数とクリア時間のベスト記録付き。画像・データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'スライドパズル｜15パズルを数字や自分の画像で遊ぶ',
    introHtml:
      '空きマスを使ってタイルを滑らせ、1から順に並べる定番のスライドパズル（15パズル）です。3×3・4×4・5×5の3種類から選べ、「画像」を選べば手持ちの写真を分割して絵合わせパズルにできます。配置は必ず解ける並びで作られ、手数とタイムのベスト記録も残ります。ほかのゲームでは <a href="/tools/sudoku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">数独</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '大きさ（3×3・4×4・5×5）を選びます。選ぶとすぐに新しいゲームが始まります。',
      '遊ぶ内容を「数字」または「画像」から選びます。「画像」では、画像を選ぶかドラッグ＆ドロップすると、その画像を分割したパズルになります。',
      '空きマスの隣のタイルをクリック（タップ）して動かします。矢印キーでも動かせます。空きマスと同じ行・列のタイルは、間のタイルをまとめて滑らせられます。',
      '数字が1から順に並ぶ（画像なら元の絵に戻る）とクリアです。「新しいゲーム」でシャッフルし直せます。',
    ],
    sizeLabel: '大きさ',
    size3: '3×3（8パズル）',
    size4: '4×4（15パズル）',
    size5: '5×5（24パズル）',
    modeLabel: 'モード',
    modeNumber: '数字',
    modeImage: '画像',
    newGame: '新しいゲーム',
    showNumbersLabel: '画像の上に番号を表示する',
    dropLabel: 'パズルにする画像',
    dropHint:
      '画像ファイルを選ぶか、ここにドラッグ＆ドロップします（PNG・JPEG・WebP・GIF・BMP）。中央の正方形部分が使われます。',
    imageLoaded: '画像を読み込みました。新しいゲームを始めました。',
    previewLabel: '完成イメージ',
    errorUnsupportedFile:
      '対応していないファイルです。PNG・JPEG・WebP・GIF・BMPの画像を選んでください。',
    errorFileTooLargeTemplate:
      'ファイルサイズが大きすぎます。{max}以下の画像を選んでください。',
    errorImageFailed: '画像を読み込めませんでした。別の画像をお試しください。',
    boardLabel: 'スライドパズルの盤面',
    tileLabel: 'タイル{n}',
    blankLabel: '空きマス',
    movesLabel: '手数',
    timeLabel: '時間',
    correctLabel: '正しい位置',
    correctValue: '{correct} / {total}',
    bestHeading: 'ベスト記録',
    bestNone: '記録なし',
    bestValue: '{moves} 手・{time}',
    resetRecords: '記録をリセット',
    recordsCleared: 'ベスト記録をリセットしました。',
    completed: 'クリア！ {moves} 手・{time} でした。',
    newBestMoves: '手数のベスト記録を更新しました。',
    newBestTime: 'タイムのベスト記録を更新しました。',
    notesHeading: '注意事項',
    notes: [
      '選んだ画像の読み込み・分割はすべて端末のブラウザ上で行われ、サーバーには送信されません。',
      '配置は毎回ランダムに作られますが、必ず完成形にたどり着ける並びだけを使います（完成済みの並びも出ません）。',
      '「手数」は動かしたタイルの数です。空きマスと同じ行・列で複数枚をまとめて滑らせたときは、動いた枚数ぶん数えます。「時間」は最初に動かした瞬間から完成までです。',
      'ベスト記録は大きさごとに、このブラウザのローカルストレージへ保存されます。数字・画像のモードは区別しません。ブラウザのデータを消去したり、別の端末・ブラウザを使ったりすると引き継がれません。',
      'ゲームの途中経過や読み込んだ画像は保存されません。ページを再読み込みすると新しいゲームになります。',
      '画像は中央の正方形に切り取って使います。極端に大きい画像（25MB超）は読み込めません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'スライドパズル（15パズル）',
        description:
          '正方形の枠に並んだ番号つきのタイルを、1マスだけある空きマスへ滑らせて動かし、順番に並べるパズルです。4×4で15枚のタイルを使うものが「15パズル」で、3×3は「8パズル」とも呼ばれます。',
      },
      {
        term: '転倒数（パリティ）',
        description:
          'タイルを並べたとき、大きい数が小さい数より前にある組の数です。この偶奇と空きマスの位置から、完成形にたどり着ける配置かどうかを判定できます。ランダムに並べただけだと、半分は解けない配置になります。',
      },
    ],
  },
  en: {
    title: 'Sliding Puzzle (15 Puzzle) – Numbers or Your Own Image',
    description:
      'Play the sliding tile puzzle (15 puzzle) in your browser with numbers or your own image. 3×3, 4×4 or 5×5, always solvable, with best records.',
    h1: 'Sliding Puzzle – 15 Puzzle with Numbers or Your Own Picture',
    introHtml:
      'The classic sliding tile puzzle: slide tiles into the empty space until they are in order. Pick 3×3, 4×4 or 5×5, and choose "Image" to turn your own photo into a picture puzzle. Every shuffle is guaranteed to be solvable, and your best moves and time are saved on this device. Looking for another game? Try <a href="/en/tools/sudoku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Sudoku</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a size (3×3, 4×4 or 5×5). A new game starts as soon as you pick one.',
      'Choose "Number" or "Image". For "Image", pick an image file or drag and drop it, and it becomes the puzzle.',
      'Click or tap a tile next to the empty space to slide it. Arrow keys work too, and tiles in the same row or column as the empty space slide together.',
      'The puzzle is solved when the numbers are in order (or the picture is restored). Press "New game" to shuffle again.',
    ],
    sizeLabel: 'Size',
    size3: '3×3 (8 puzzle)',
    size4: '4×4 (15 puzzle)',
    size5: '5×5 (24 puzzle)',
    modeLabel: 'Mode',
    modeNumber: 'Number',
    modeImage: 'Image',
    newGame: 'New game',
    showNumbersLabel: 'Show numbers on the picture',
    dropLabel: 'Image for the puzzle',
    dropHint:
      'Choose an image file or drag and drop it here (PNG, JPEG, WebP, GIF, BMP). The central square is used.',
    imageLoaded: 'Image loaded. A new game has started.',
    previewLabel: 'Goal picture',
    errorUnsupportedFile:
      'Unsupported file. Please choose a PNG, JPEG, WebP, GIF or BMP image.',
    errorFileTooLargeTemplate:
      'The file is too large. Please choose an image of {max} or less.',
    errorImageFailed: 'Could not load the image. Please try another one.',
    boardLabel: 'Sliding puzzle board',
    tileLabel: 'Tile {n}',
    blankLabel: 'Empty space',
    movesLabel: 'Moves',
    timeLabel: 'Time',
    correctLabel: 'In place',
    correctValue: '{correct} / {total}',
    bestHeading: 'Best records',
    bestNone: 'No record yet',
    bestValue: '{moves} moves · {time}',
    resetRecords: 'Reset records',
    recordsCleared: 'Best records have been reset.',
    completed: 'Solved! {moves} moves in {time}.',
    newBestMoves: 'New best for moves.',
    newBestTime: 'New best time.',
    notesHeading: 'Notes',
    notes: [
      'The image you choose is read and split entirely in your browser and is never sent to a server.',
      'Each shuffle is random, but only solvable layouts are used (and never an already-solved one).',
      'Moves count the tiles you slide. Sliding several tiles at once along the empty space’s row or column counts each tile. The timer runs from your first move until the puzzle is solved.',
      'Best records are stored per size in this browser’s local storage, and number and image modes share them. They are not carried over if you clear site data or switch browsers or devices.',
      'Game progress and the loaded image are not saved. Reloading the page starts a new game.',
      'The image is cropped to its central square. Very large files (over 25 MB) cannot be loaded.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Sliding puzzle (15 puzzle)',
        description:
          'A puzzle where numbered tiles in a square frame are slid into the single empty space until they are in order. The 4×4 version with 15 tiles is the "15 puzzle", and the 3×3 version is also called the "8 puzzle".',
      },
      {
        term: 'Inversions (parity)',
        description:
          'The number of tile pairs where a larger number comes before a smaller one. Its parity, together with the empty space’s position, tells whether a layout can reach the solved state. Half of all random arrangements are unsolvable.',
      },
    ],
  },
};
