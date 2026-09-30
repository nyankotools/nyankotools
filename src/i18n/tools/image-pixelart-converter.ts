import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ImagePixelartConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{width}` `{height}` `{size}` を置換して使うテンプレート */
  sourceInfoTemplate: string;
  blockSizeLabel: string;
  /** `{value}` を置換して使うテンプレート */
  blockSizeValueTemplate: string;
  colorLevelsLabel: string;
  /** `{value}` `{max}` を置換して使うテンプレート */
  colorLevelsValueTemplate: string;
  colorLevelsOffLabel: string;
  formatLabel: string;
  formatWebp: string;
  formatJpeg: string;
  formatPng: string;
  qualityLabel: string;
  /** `{value}` を置換して使うテンプレート */
  qualityValueTemplate: string;
  qualityPngNote: string;
  originalPreviewLabel: string;
  resultPreviewLabel: string;
  resultsHeading: string;
  originalSizeLabel: string;
  convertedSizeLabel: string;
  /** `{width}` `{height}` `{size}` を置換して使うテンプレート */
  dimensionsSizeTemplate: string;
  /** `{percent}` を置換して使うテンプレート（増加時は負の値） */
  reductionIncreasedTemplate: string;
  /** `{percent}` を置換して使うテンプレート */
  reductionDecreasedTemplate: string;
  downloadButton: string;
  clearButton: string;
  errorUnsupportedFile: string;
  errorConversionFailed: string;
  /** `{max}` を置換して使うテンプレート */
  errorFileTooLargeTemplate: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const imagePixelartConverterContent: Record<
  Locale,
  ImagePixelartConverterPageContent
> = {
  ja: {
    title: '画像ドット絵化・モザイク・減色処理（ピクセルアート変換）無料ツール',
    description:
      '画像をドット絵（ピクセルアート）風に変換できる無料ツールです。ブロックサイズでモザイク・ドット感の強さを、色数で減色（ポスタリゼーション）の度合いを調整し、WebP・JPEG・PNGで書き出せます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '画像ドット絵化・モザイク・減色ツール',
    introHtml:
      '画像を選択し、「ブロックサイズ」でモザイク・ドット絵の粗さを、「色数（階調）」で減色の度合いを調整して、レトロなピクセルアート風の画像に変換できます。SNSアイコンやアイキャッチ画像の加工、顔やナンバープレートなどを隠すモザイク処理にも使えます。画像そのもののサイズを変更したい場合は<a href="/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像リサイズ・圧縮</a>もご利用ください。',
    dropLabel: '画像ファイルを選択',
    dropHint: 'ここに画像ファイルをドラッグ＆ドロップすることもできます',
    sourceInfoTemplate: '元画像: {width}×{height}px（{size}）',
    blockSizeLabel: 'ブロックサイズ（モザイク・ドットの粗さ）',
    blockSizeValueTemplate: '{value}px',
    colorLevelsLabel: '色数（階調・減色の強さ）',
    colorLevelsValueTemplate: '{value}階調（最大約{max}色）',
    colorLevelsOffLabel: '256階調（減色オフ／元の色のまま）',
    formatLabel: '出力フォーマット',
    formatWebp: 'WebP',
    formatJpeg: 'JPEG',
    formatPng: 'PNG',
    qualityLabel: '画質（圧縮率）',
    qualityValueTemplate: '{value}%',
    qualityPngNote:
      'PNGは可逆圧縮のため画質設定は反映されません（元画像の透過情報はそのまま保持されます）',
    originalPreviewLabel: '変換前',
    resultPreviewLabel: '変換後',
    resultsHeading: '変換結果',
    originalSizeLabel: '変換前',
    convertedSizeLabel: '変換後',
    dimensionsSizeTemplate: '{width}×{height}px（{size}）',
    reductionIncreasedTemplate: '{percent}%増加',
    reductionDecreasedTemplate: '{percent}%削減',
    downloadButton: 'ダウンロード',
    clearButton: 'クリア',
    errorUnsupportedFile:
      '対応していないファイル形式です（PNG/JPEG/WebP/GIF/BMPのみ変換できます）',
    errorConversionFailed:
      '変換に失敗しました。ファイルが破損しているか、お使いのブラウザが対応していない可能性があります。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    notesHeading: '注意点',
    notes: [
      'ブロックサイズを大きくするほどモザイク効果が強くなり、画像が粗く（ドットが大きく）なります。',
      '色数（階調）を減らすほど使用される色の種類が少なくなり、レトロな雰囲気やイラスト風の見た目になります。256階調（オフ）のままだとモザイク・ドット化のみが適用され、色は元のまま維持されます。',
      '顔やナンバープレートなど個人情報を隠す目的でモザイク処理を使う場合、ブロックサイズが小さいと元の情報が推測できてしまうことがあります。十分に大きいブロックサイズを選んでください。',
      'JPEGには透過（アルファチャンネル）情報がないため、透過部分は白色で塗りつぶされます。透過を維持したい場合はWebPまたはPNGを選んでください。',
      'すべての処理はブラウザ内で完結し、選択した画像がサーバーに送信されることはありません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '画像ファイルを選択します（ドラッグ＆ドロップも可能です）。',
      '「ブロックサイズ」でドットの粗さを、「色数（階調）」で減色の強さを調整します。',
      '変換前後のプレビューを見比べながら、出力フォーマットと画質を選びます。',
      '結果を確認してダウンロードします。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ピクセルアート（ドット絵）',
        description:
          '1つ1つの色の四角（ドット）を並べて描く、レトロゲーム風の表現方法。写真をピクセルアート風に変換するには、画像を粗いブロック単位に分けて色を単純化する処理を行います。',
      },
      {
        term: 'モザイク処理',
        description:
          '画像を一定サイズのブロックに分割し、ブロックごとに色を平均化して塗りつぶす処理。ブロックが大きいほど元の細かい情報が読み取りにくくなるため、顔や個人情報の隠蔽にも使われます。',
      },
      {
        term: '減色（ポスタリゼーション）',
        description:
          '画像で使用する色の階調数を減らす処理。各色チャンネル（赤・緑・青）の値を少ない段階に丸めることで、なめらかなグラデーションが階段状になり、イラストやレトロゲームのような見た目になります。',
      },
    ],
  },
  en: {
    title: 'Pixelate, Mosaic & Color Reduction Tool (Pixel Art Converter)',
    description:
      'Free tool that turns a photo into retro pixel art. Adjust the block size to control the pixelate/mosaic strength and the color count to control posterization, then export as WebP, JPEG, or PNG. Your image is processed in the browser and never sent to a server.',
    h1: 'Image Pixelate, Mosaic & Color Reduction Tool',
    introHtml:
      'Select an image, then adjust the "block size" to control how chunky the pixelate/mosaic effect is and the "color count" to control how much the palette is reduced, turning your photo into retro pixel art. Useful for stylizing social media icons and thumbnails, or for mosaic-blurring faces and license plates. If you just need to change the image dimensions, try the <a href="/en/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Resizer & Compressor</a> instead.',
    dropLabel: 'Choose an image file',
    dropHint: 'You can also drag and drop an image file here',
    sourceInfoTemplate: 'Original: {width}×{height}px ({size})',
    blockSizeLabel: 'Block size (pixelate/mosaic strength)',
    blockSizeValueTemplate: '{value}px',
    colorLevelsLabel: 'Color levels (color reduction strength)',
    colorLevelsValueTemplate: '{value} levels (up to {max} colors)',
    colorLevelsOffLabel: '256 levels (color reduction off / original colors)',
    formatLabel: 'Output format',
    formatWebp: 'WebP',
    formatJpeg: 'JPEG',
    formatPng: 'PNG',
    qualityLabel: 'Quality (compression level)',
    qualityValueTemplate: '{value}%',
    qualityPngNote:
      'PNG is lossless, so the quality setting has no effect (the original transparency is preserved as-is)',
    originalPreviewLabel: 'Before',
    resultPreviewLabel: 'After',
    resultsHeading: 'Result',
    originalSizeLabel: 'Before',
    convertedSizeLabel: 'After',
    dimensionsSizeTemplate: '{width}×{height}px ({size})',
    reductionIncreasedTemplate: '{percent}% larger',
    reductionDecreasedTemplate: '{percent}% smaller',
    downloadButton: 'Download',
    clearButton: 'Clear',
    errorUnsupportedFile:
      'Unsupported file type (only PNG, JPEG, WebP, GIF, and BMP can be converted)',
    errorConversionFailed:
      'Conversion failed. The file may be corrupted, or your browser may not support this format.',
    errorFileTooLargeTemplate: 'This file exceeds the size limit ({max})',
    notesHeading: 'Notes',
    notes: [
      'A larger block size gives a stronger pixelate/mosaic effect and a chunkier, blockier image.',
      'Fewer color levels means fewer distinct colors are used, giving a retro or illustration-like look. Leaving it at 256 levels (off) applies only the pixelate/mosaic effect and keeps the original colors.',
      'If you use this to mosaic a face or license plate for privacy, a small block size may still let the original details be guessed. Choose a large enough block size to be safe.',
      'JPEG has no alpha channel, so transparent areas are filled with white. Use WebP or PNG if you need to keep transparency.',
      'All processing happens in your browser — the image you select is never sent to a server.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose an image file (drag & drop also works).',
      'Use "Block size" to set how coarse the pixels are and "Color levels" to set how strongly colors are reduced.',
      'Compare the before/after previews while you pick the output format and quality.',
      'Check the result and download it.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Pixel art',
        description:
          'A retro, video-game-style look built from individual colored squares (pixels/dots). Turning a photo into pixel art means dividing it into coarse blocks and simplifying the color within each one.',
      },
      {
        term: 'Mosaic (pixelation)',
        description:
          'Dividing an image into fixed-size blocks and filling each block with its average color. Larger blocks hide more of the original detail, which is why mosaics are used to obscure faces or personal information.',
      },
      {
        term: 'Color reduction (posterization)',
        description:
          'Reducing the number of tone levels used in an image. Rounding each color channel (red, green, blue) to fewer discrete steps turns smooth gradients into visible bands, giving an illustration or retro-game look.',
      },
    ],
  },
};
