import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface OcrProtectImagePageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  /** 効果を保証しない旨の警告（ツール本体の直前に常時表示する） */
  disclaimer: string;
  dropLabel: string;
  dropHint: string;
  /** `{width}` `{height}` `{size}` を置換して使うテンプレート */
  sourceInfoTemplate: string;
  noiseLabel: string;
  warpLabel: string;
  linesLabel: string;
  /** `{value}` を置換して使うテンプレート */
  strengthValueTemplate: string;
  strengthOffLabel: string;
  presetLabel: string;
  presetLight: string;
  presetStandard: string;
  presetStrong: string;
  regenerateButton: string;
  clearButton: string;
  resultsHeading: string;
  originalPreviewLabel: string;
  resultPreviewLabel: string;
  originalPreviewAlt: string;
  resultCanvasLabel: string;
  /** `{width}` `{height}` `{size}` を置換して使うテンプレート */
  resultSizeTemplate: string;
  downloadButton: string;
  errorUnsupportedFile: string;
  errorConversionFailed: string;
  /** `{max}` を置換して使うテンプレート */
  errorFileTooLargeTemplate: string;
  /** `{max}` を置換して使うテンプレート（単位は百万画素） */
  errorTooManyPixelsTemplate: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const ocrProtectImageContent: Record<
  Locale,
  OcrProtectImagePageContent
> = {
  ja: {
    title: 'OCR対策 画像加工ツール｜文字を読み取りにくくするノイズ・歪み加工',
    description:
      '画像内の文字に微小な歪み・ノイズ・細線を加え、OCRによる自動読み取りを難しくする無料ツールです。強度をスライダーで調整し、元画像と見比べてPNGで保存できます。効果は保証できません。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'OCR対策 画像加工（文字を読み取りにくくする）',
    introHtml:
      '画像を選び、「ノイズ量」「歪み」「細線の量」を調整すると、人の目にはなるべく読めるまま、OCR（文字認識）による自動読み取りを難しくすることを目指した加工を行えます。自分の画像がスクレイピング・自動収集されるのを減らしたい場合などに使えます。画像の一部を隠したいときは<a href="/tools/image-pixelart-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像ドット絵化・モザイク・減色</a>、画像に文字を重ねたいときは<a href="/tools/image-text-overlay/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像への文字入れ・透かし</a>もご利用ください。',
    disclaimer:
      '【ご注意】この加工でOCRや画像認識AIによる読み取りを防げることは保証できません。技術の進歩により、加工後の文字が読み取られる可能性があります。パスワード・個人情報などの重要な情報の保護手段として過信せず、本当に隠したい情報は画像に含めないでください。',
    dropLabel: '画像ファイルを選択',
    dropHint: 'ここに画像ファイルをドラッグ＆ドロップすることもできます',
    sourceInfoTemplate: '元画像: {width}×{height}px（{size}）',
    noiseLabel: 'ノイズ量',
    warpLabel: '歪み',
    linesLabel: '細線の量',
    strengthValueTemplate: '{value}',
    strengthOffLabel: 'オフ',
    presetLabel: 'プリセット',
    presetLight: '弱め',
    presetStandard: '標準',
    presetStrong: '強め',
    regenerateButton: '別のパターンで再生成',
    clearButton: 'クリア',
    resultsHeading: '加工結果',
    originalPreviewLabel: '加工前',
    resultPreviewLabel: '加工後',
    originalPreviewAlt: '加工前の画像',
    resultCanvasLabel: '加工後の画像プレビュー',
    resultSizeTemplate: '出力: {width}×{height}px（PNG、約{size}）',
    downloadButton: 'PNGでダウンロード',
    errorUnsupportedFile:
      '対応していないファイル形式です（PNG/JPEG/WebP/GIF/BMPのみ加工できます）',
    errorConversionFailed:
      '加工に失敗しました。ファイルが破損しているか、お使いのブラウザが対応していない可能性があります。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    errorTooManyPixelsTemplate:
      '画像のピクセル数が上限（{max}百万画素）を超えています。先にリサイズしてからお試しください',
    notesHeading: '注意点',
    notes: [
      'OCRエンジンや生成AIの画像認識は進化を続けており、この加工でOCRによる読み取りを防げることは保証できません。重要な情報の保護手段として過信しないでください。',
      '強度を上げるほどOCRには読みにくくなる傾向がありますが、人間にとっても読みづらくなります。加工後のプレビューを必ず拡大して確認し、読みやすさとのバランスを取ってください。',
      'ノイズ・歪み・線を加えた画像は、スクリーンリーダー（画像の代替テキストで内容を伝える）や拡大表示を使う方にとって読みにくくなることがあります。重要な内容は、代替テキストなど別の手段でも伝えることをおすすめします。',
      'アニメーションGIFは1フレーム目のみが加工対象になります。',
      '出力は可逆圧縮のPNGです。ノイズを含むため、元の画像よりファイルサイズが大きくなることがあります。',
      '本ツールは、自分が権利を持つ画像のスクレイピング・自動収集への対策を想定しています。他者の画像の加工や、CAPTCHAの回避などの不正な目的には利用しないでください。',
      'すべての処理はブラウザ内で完結し、選択した画像がサーバーに送信されることはありません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '画像ファイルを選択します（ドラッグ＆ドロップも可能です）。',
      'プリセットを選ぶか、「ノイズ量」「歪み」「細線の量」のスライダーで加工の強さを調整します。',
      '加工前後のプレビューを拡大して見比べ、人の目で読めるか確認します。模様を変えたいときは「別のパターンで再生成」を押します。',
      '問題なければ「PNGでダウンロード」で保存します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'OCR（光学文字認識）',
        description:
          '画像に写った文字を、コンピュータが読み取ってテキストデータに変換する技術。スクリーンショットや写真からの文字起こし、自動収集（スクレイピング）などに使われます。',
      },
      {
        term: '敵対的ノイズ',
        description:
          '人間にはほとんど気にならないが、機械学習モデルの判断を乱すように加えられるノイズや変形。本ツールの加工はこの考え方に近いものの、特定のOCRに最適化したものではなく、効果は保証できません。',
      },
      {
        term: 'スクレイピング',
        description:
          'Webサイトの内容（画像や文章）をプログラムで自動的に収集すること。画像内の文字は、OCRを使えばテキストとして取り出されることがあります。',
      },
    ],
  },
  en: {
    title: 'OCR-Resistant Image Tool: Noise & Distortion for Text',
    description:
      'Free tool that adds subtle distortion, noise and fine lines to image text to make OCR harder. No guarantee of effect. Runs in your browser, no upload.',
    h1: 'OCR-Resistant Image Obfuscator (Make Text Harder to Read for OCR)',
    introHtml:
      'Choose an image and adjust "Noise", "Distortion", and "Line overlay" to keep it readable to people while making automatic reading by OCR (text recognition) more difficult. It can help reduce the chance of your own images being scraped and read in bulk. To hide only part of an image, try the <a href="/en/tools/image-pixelart-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Pixelate, Mosaic & Color Reduction</a> tool; to add text, use <a href="/en/tools/image-text-overlay/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Add Text or Watermark to Image</a> tool.',
    disclaimer:
      'Important: this processing cannot be guaranteed to stop OCR or AI image recognition from reading your text. As the technology advances, processed text may still be read. Do not rely on it to protect passwords, personal data, or other sensitive information; keep anything you truly need to hide out of the image.',
    dropLabel: 'Choose an image file',
    dropHint: 'You can also drag and drop an image file here',
    sourceInfoTemplate: 'Original: {width}×{height}px ({size})',
    noiseLabel: 'Noise',
    warpLabel: 'Distortion',
    linesLabel: 'Line overlay',
    strengthValueTemplate: '{value}',
    strengthOffLabel: 'Off',
    presetLabel: 'Preset',
    presetLight: 'Light',
    presetStandard: 'Standard',
    presetStrong: 'Strong',
    regenerateButton: 'Regenerate with a new pattern',
    clearButton: 'Clear',
    resultsHeading: 'Result',
    originalPreviewLabel: 'Before',
    resultPreviewLabel: 'After',
    originalPreviewAlt: 'Image before processing',
    resultCanvasLabel: 'Preview of the processed image',
    resultSizeTemplate: 'Output: {width}×{height}px (PNG, about {size})',
    downloadButton: 'Download as PNG',
    errorUnsupportedFile:
      'Unsupported file type (only PNG, JPEG, WebP, GIF, and BMP can be processed)',
    errorConversionFailed:
      'Processing failed. The file may be corrupted or your browser may not support it.',
    errorFileTooLargeTemplate: 'The file exceeds the size limit ({max})',
    errorTooManyPixelsTemplate:
      'The image exceeds the pixel limit ({max} megapixels). Please resize it first and try again',
    notesHeading: 'Notes',
    notes: [
      'OCR engines and AI image recognition keep improving, so this processing cannot be guaranteed to stop OCR from reading your text. Do not rely on it to protect sensitive information.',
      'Higher strength tends to make text harder for OCR to read, but also harder for people. Always zoom in on the preview and balance the strength against readability.',
      'Images with added noise, distortion, and lines can be harder to read for people who use screen readers (which rely on alt text) or magnification. For important content, also provide it another way, such as alt text.',
      'For animated GIFs, only the first frame is processed.',
      'The output is a lossless PNG. Because it contains noise, the file may be larger than the original.',
      'This tool is intended to help protect images you own from scraping and bulk collection. Do not use it on other people’s images or for improper purposes such as bypassing CAPTCHAs.',
      'All processing happens in your browser; the image you choose is never sent to a server.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose an image file (drag and drop also works).',
      'Pick a preset, or adjust the "Noise", "Distortion", and "Line overlay" sliders to set the strength.',
      'Zoom in on the before and after previews and check that it is still readable to the eye. Press "Regenerate with a new pattern" to change the pattern.',
      'When it looks right, save it with "Download as PNG".',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'OCR (optical character recognition)',
        description:
          'Technology that reads text in an image and converts it to text data. It is used to transcribe screenshots and photos, and in automated collection (scraping).',
      },
      {
        term: 'Adversarial noise',
        description:
          'Noise or distortion that is barely noticeable to people but disturbs a machine-learning model’s judgment. This tool is similar in spirit, but it is not tuned to any specific OCR engine and its effect cannot be guaranteed.',
      },
      {
        term: 'Scraping',
        description:
          'Collecting website content such as images and text automatically with a program. Text inside images can sometimes be extracted with OCR.',
      },
    ],
  },
};
