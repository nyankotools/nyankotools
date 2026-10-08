import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ImageBlurMosaicPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{width}` `{height}` `{size}` を置換 */
  sourceInfoTemplate: string;
  modeLabel: string;
  modeMosaic: string;
  modeBlur: string;
  modeFill: string;
  /** `{value}` を置換 */
  mosaicStrengthLabel: string;
  blurStrengthLabel: string;
  strengthValueTemplate: string;
  colorLabel: string;
  blurWarning: string;
  canvasLabel: string;
  canvasHint: string;
  touchModeLabel: string;
  touchModeSelect: string;
  touchModeScroll: string;
  touchModeHint: string;
  /** `{count}` を置換 */
  regionCountTemplate: string;
  undoButton: string;
  resetButton: string;
  formatLabel: string;
  downloadButton: string;
  clearButton: string;
  errorUnsupportedFile: string;
  errorLoadFailed: string;
  errorExportFailed: string;
  /** `{max}` を置換 */
  errorFileTooLargeTemplate: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const imageBlurMosaicContent: Record<
  Locale,
  ImageBlurMosaicPageContent
> = {
  ja: {
    title: '画像モザイク・ぼかし・塗りつぶし｜顔や個人情報を隠す無料ツール',
    description:
      '画像の一部をドラッグで範囲指定して、モザイク・ぼかし・塗りつぶしで隠せる無料ツールです。顔・ナンバープレート・住所などの個人情報の隠蔽に。複数範囲の適用と元に戻すに対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '画像モザイク・ぼかしツール（個人情報を隠す）',
    introHtml:
      '画像を選び、隠したい部分をドラッグで囲むだけで、モザイク・ぼかし・塗りつぶしを適用できます。顔、ナンバープレート、住所、スクリーンショット内の名前やメールアドレスなどを隠したいときに便利です。画像はアップロードされず、すべてブラウザ内で処理されます。画像全体にモザイクをかけたい場合は<a href="/tools/image-pixelart-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像ドット絵化・モザイク・減色ツール</a>、PDFの場合は<a href="/tools/pdf-redactor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF黒塗りツール</a>をご利用ください。',
    dropLabel: '画像ファイルを選択',
    dropHint: 'ここに画像ファイルをドラッグ＆ドロップすることもできます',
    sourceInfoTemplate: '元画像: {width}×{height}px（{size}）',
    modeLabel: '加工の種類',
    modeMosaic: 'モザイク',
    modeBlur: 'ぼかし',
    modeFill: '塗りつぶし',
    mosaicStrengthLabel: 'モザイクの粗さ（ブロックサイズ）',
    blurStrengthLabel: 'ぼかしの強さ（半径）',
    strengthValueTemplate: '{value}px',
    colorLabel: '塗りつぶしの色',
    blurWarning:
      'ぼかしは強度や画像によって元の内容が推測・復元される場合があります。個人情報を隠す目的には、モザイク（粗め）か塗りつぶしを使ってください。',
    canvasLabel: '編集中の画像（ドラッグで範囲を指定）',
    canvasHint:
      '画像の上をドラッグ（スマホは指でなぞる）すると、その範囲に加工が適用されます。',
    touchModeLabel: 'スマホでの操作',
    touchModeSelect: '範囲を選択',
    touchModeScroll: 'スクロール',
    touchModeHint:
      '「範囲を選択」中は画像の上で指をなぞると範囲を指定でき、ページはスクロールしません。スクロールしたいときは「スクロール」に切り替えてください。',
    regionCountTemplate: '適用済みの範囲: {count}件',
    undoButton: '1つ元に戻す',
    resetButton: 'すべてリセット',
    formatLabel: '保存形式',
    downloadButton: '加工した画像をダウンロード',
    clearButton: '画像をクリア',
    errorUnsupportedFile:
      '対応していないファイル形式です（PNG/JPEG/WebP/GIF/BMPのみ読み込めます）',
    errorLoadFailed:
      '画像を読み込めませんでした。ファイルが破損している可能性があります。',
    errorExportFailed:
      '画像の書き出しに失敗しました。別の保存形式をお試しください。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    notesHeading: '注意点',
    notes: [
      'ぼかしは、強さや画像の内容によっては元の文字や顔が推測・復元されることがあります。個人情報を隠す場合は、粗いモザイクか塗りつぶしを選んでください。',
      '塗りつぶし（黒塗り）は元の情報が完全に失われるため、最も確実な方法です。',
      '加工は書き出す画像に直接反映され、元の画像のデータは含まれません。ただし、元画像ファイルや、すでに公開した画像は別途管理してください。',
      'ファイル名や撮影位置などのメタデータ（EXIF）は、書き出し時に再エンコードされるため引き継がれません。',
      'GIFは先頭フレームのみが対象になり、アニメーションは保持されません。',
      'JPEGで保存すると透過部分は白で塗りつぶされます。透過を残すにはPNGまたはWebPを選んでください。',
      'すべての処理はブラウザ内で完結し、選択した画像がサーバーに送信されることはありません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '画像ファイルを選択します（ドラッグ＆ドロップも可能です）。',
      '「加工の種類」（モザイク・ぼかし・塗りつぶし）と強さを選びます。',
      '画像の隠したい部分をドラッグで囲みます。複数の範囲を続けて指定でき、間違えたら「1つ元に戻す」を押します。',
      '保存形式を選んで、加工した画像をダウンロードします。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'モザイク',
        description:
          '範囲を小さなブロックに分け、ブロックごとの平均色で塗る処理。ブロックを大きくするほど元の情報が読み取れなくなります。',
      },
      {
        term: 'ぼかし',
        description:
          '周囲の色を混ぜ合わせてなめらかにする処理。弱いぼかしは、画像処理で元に近い状態へ復元されてしまう場合があります。',
      },
      {
        term: '塗りつぶし（黒塗り）',
        description:
          '範囲を単色で完全に覆う処理。元のピクセル情報が残らないため、個人情報の隠蔽に最も確実です。',
      },
    ],
  },
  en: {
    title: 'Blur, Pixelate & Redact Parts of an Image (Hide Faces)',
    description:
      'Drag to select areas of a photo and hide faces or plates with mosaic, blur or a solid fill. Runs in your browser; nothing is uploaded.',
    h1: 'Image Blur & Mosaic Tool (Hide Faces and Personal Info)',
    introHtml:
      'Choose an image, drag over the part you want to hide, and apply mosaic, blur, or a solid fill. It is handy for faces, license plates, addresses, and names or email addresses in screenshots. Your image is never uploaded; everything happens in your browser. To pixelate the whole picture, use the <a href="/en/tools/image-pixelart-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Pixelate, Mosaic & Color Reduction Tool</a>, and for PDFs try the <a href="/en/tools/pdf-redactor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">PDF Redactor</a>.',
    dropLabel: 'Choose an image file',
    dropHint: 'You can also drag and drop an image file here',
    sourceInfoTemplate: 'Original: {width}×{height}px ({size})',
    modeLabel: 'Effect',
    modeMosaic: 'Mosaic',
    modeBlur: 'Blur',
    modeFill: 'Solid fill',
    mosaicStrengthLabel: 'Mosaic coarseness (block size)',
    blurStrengthLabel: 'Blur strength (radius)',
    strengthValueTemplate: '{value}px',
    colorLabel: 'Fill color',
    blurWarning:
      'Blurred content can sometimes be guessed or reconstructed, depending on the strength and the image. To hide personal information, use a coarse mosaic or a solid fill instead.',
    canvasLabel: 'Image being edited (drag to select an area)',
    canvasHint:
      'Drag over the image (or swipe with your finger on a phone) to apply the effect to that area.',
    touchModeLabel: 'Touch mode',
    touchModeSelect: 'Select area',
    touchModeScroll: 'Scroll',
    touchModeHint:
      'In Select area mode, swiping on the image selects an area and the page will not scroll. Switch to Scroll to move the page.',
    regionCountTemplate: 'Areas applied: {count}',
    undoButton: 'Undo last',
    resetButton: 'Reset all',
    formatLabel: 'Save as',
    downloadButton: 'Download edited image',
    clearButton: 'Clear image',
    errorUnsupportedFile:
      'Unsupported file type (only PNG, JPEG, WebP, GIF, and BMP can be opened)',
    errorLoadFailed: 'Could not load the image. The file may be corrupted.',
    errorExportFailed:
      'Could not export the image. Try a different save format.',
    errorFileTooLargeTemplate: 'This file exceeds the size limit ({max})',
    notesHeading: 'Notes',
    notes: [
      'Depending on its strength and the image, blur can let the original text or faces be guessed or reconstructed. To hide personal information, choose a coarse mosaic or a solid fill.',
      'A solid fill (blackout) destroys the original pixels completely, so it is the safest option.',
      'Effects are baked into the exported image and the original pixels are not included. Keep track of your original file and of images you have already published separately.',
      'Metadata such as EXIF (camera info, GPS location) is dropped because the image is re-encoded on export.',
      'For GIFs, only the first frame is used and animation is not preserved.',
      'Saving as JPEG fills transparent areas with white. Choose PNG or WebP to keep transparency.',
      'All processing happens in your browser — the image you select is never sent to a server.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose an image file (drag & drop also works).',
      'Pick an "Effect" (mosaic, blur, or solid fill) and its strength.',
      'Drag over the parts you want to hide. You can mark several areas in a row; press "Undo last" if you make a mistake.',
      'Choose a save format and download the edited image.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Mosaic',
        description:
          'Splits an area into small blocks and fills each with its average color. The larger the blocks, the less of the original can be read.',
      },
      {
        term: 'Blur',
        description:
          'Mixes neighboring colors to smooth an area. Light blur can sometimes be sharpened back toward the original by image processing.',
      },
      {
        term: 'Solid fill (blackout)',
        description:
          'Covers an area with a single color. No original pixel data remains, so it is the most reliable way to hide personal information.',
      },
    ],
  },
};
