import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ImageAsciiArtPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{width}` `{height}` `{size}` を置換して使うテンプレート */
  sourceInfoTemplate: string;
  columnsLabel: string;
  /** `{value}` `{rows}` を置換して使うテンプレート */
  columnsValueTemplate: string;
  /** 画像未選択時に `{value}` を置換して使うテンプレート */
  columnsOnlyTemplate: string;
  charsetLabel: string;
  charsetStandard: string;
  charsetDetailed: string;
  charsetBlocks: string;
  charsetMono: string;
  invertLabel: string;
  outputLabel: string;
  copyButton: string;
  downloadButton: string;
  clearButton: string;
  copiedMessage: string;
  copyFailedMessage: string;
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

export const imageAsciiArtContent: Record<Locale, ImageAsciiArtPageContent> = {
  ja: {
    title: '画像をASCIIアートに変換（文字アート作成）無料ツール',
    description:
      '画像をASCIIアート（文字アート）に変換できる無料ツールです。横の文字数・文字の種類・明暗の反転を調整し、テキストとしてコピー・.txt保存できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '画像→ASCIIアート変換ツール',
    introHtml:
      '画像を選択すると、明るさに応じて文字を並べたASCIIアート（文字アート）に変換します。「横の文字数」で細かさを、「文字の種類」で雰囲気を調整でき、結果はテキストとしてコピーしたり .txt で保存したりできます。ドット絵風の画像にしたい場合は<a href="/tools/image-pixelart-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像ドット絵化・モザイク・減色</a>もご利用ください。',
    dropLabel: '画像ファイルを選択',
    dropHint: 'ここに画像ファイルをドラッグ＆ドロップすることもできます',
    sourceInfoTemplate: '元画像: {width}×{height}px（{size}）',
    columnsLabel: '横の文字数',
    columnsValueTemplate: '{value}文字 × {rows}行',
    columnsOnlyTemplate: '{value}文字',
    charsetLabel: '文字の種類',
    charsetStandard: '標準（@%#*+=-:.）',
    charsetDetailed: '詳細（70階調）',
    charsetBlocks: 'ブロック（█▓▒░）',
    charsetMono: '2値（# と空白）',
    invertLabel: '明暗を反転（黒背景・白文字向け）',
    outputLabel: 'ASCIIアート',
    copyButton: 'コピー',
    downloadButton: 'テキストでダウンロード',
    clearButton: 'クリア',
    copiedMessage: 'コピーしました',
    copyFailedMessage: 'コピーに失敗しました',
    errorUnsupportedFile:
      '対応していないファイル形式です（PNG/JPEG/WebP/GIF/BMPのみ変換できます）',
    errorConversionFailed:
      '変換に失敗しました。ファイルが破損しているか、お使いのブラウザが対応していない可能性があります。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    notesHeading: '注意点',
    notes: [
      '文字は縦長の比率で表示されるため、行数は元画像の縦横比に合わせて自動で間引いています。',
      '白い背景に黒い文字で見る前提で、暗い部分ほど濃い文字になります。黒背景のエディタやSNSで使う場合は「明暗を反転」をオンにしてください。',
      '透過部分は白い背景として扱います。',
      'きれいに表示するには等幅フォントが必要です。プロポーショナルフォントのSNSやチャットに貼ると崩れることがあります。',
      'すべての処理はブラウザ内で完結し、選択した画像がサーバーに送信されることはありません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '画像ファイルを選択します（ドラッグ＆ドロップも可能です）。',
      '「横の文字数」と「文字の種類」を調整します。黒背景で使うときは「明暗を反転」をオンにします。',
      'プレビューを確認し、「コピー」またはテキストでダウンロードします。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ASCIIアート',
        description:
          '文字や記号の並びで絵を描く表現。画像を変換する場合は、画素の明るさに応じて「@」のような濃い文字や「.」のような薄い文字を割り当てて並べます。',
      },
      {
        term: '等幅フォント',
        description:
          'すべての文字が同じ幅で表示されるフォント。ASCIIアートは文字の位置がそろうことで絵として見えるため、等幅フォントで表示する必要があります。',
      },
    ],
  },
  en: {
    title: 'Image to ASCII Art Converter (Text Art Generator)',
    description:
      'Convert an image into ASCII art. Adjust width, character set and invert, then copy it as text or save a .txt file. Runs in your browser; nothing is uploaded.',
    h1: 'Image to ASCII Art Converter',
    introHtml:
      'Select an image and it is converted into ASCII art, with characters chosen by pixel brightness. Use "Width (characters)" to set the detail and "Character set" to change the look, then copy the result as text or save it as a .txt file. If you want a pixel-art look instead, try the <a href="/en/tools/image-pixelart-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Pixelate, Mosaic & Color Reduction Tool</a>.',
    dropLabel: 'Choose an image file',
    dropHint: 'You can also drag and drop an image file here',
    sourceInfoTemplate: 'Original: {width}×{height}px ({size})',
    columnsLabel: 'Width (characters)',
    columnsValueTemplate: '{value} chars × {rows} lines',
    columnsOnlyTemplate: '{value} chars',
    charsetLabel: 'Character set',
    charsetStandard: 'Standard (@%#*+=-:.)',
    charsetDetailed: 'Detailed (70 levels)',
    charsetBlocks: 'Blocks (█▓▒░)',
    charsetMono: 'Two-tone (# and space)',
    invertLabel: 'Invert brightness (for dark backgrounds)',
    outputLabel: 'ASCII art',
    copyButton: 'Copy',
    downloadButton: 'Download as text',
    clearButton: 'Clear',
    copiedMessage: 'Copied',
    copyFailedMessage: 'Copy failed',
    errorUnsupportedFile:
      'Unsupported file type (only PNG, JPEG, WebP, GIF, and BMP can be converted)',
    errorConversionFailed:
      'Conversion failed. The file may be corrupted, or your browser may not support this format.',
    errorFileTooLargeTemplate: 'This file exceeds the size limit ({max})',
    notesHeading: 'Notes',
    notes: [
      'Characters are taller than they are wide, so the number of lines is reduced automatically to keep the original aspect ratio.',
      'The output assumes dark text on a white background, so darker areas get denser characters. Turn on "Invert brightness" for dark editors or dark-mode chats.',
      'Transparent areas are treated as a white background.',
      'A monospace font is required to display it correctly. Pasting it into a chat or social app that uses a proportional font may break the alignment.',
      'All processing happens in your browser — the image you select is never sent to a server.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose an image file (drag & drop also works).',
      'Adjust "Width (characters)" and "Character set". Turn on "Invert brightness" if you will view it on a dark background.',
      'Check the preview, then use "Copy" or download it as a text file.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'ASCII art',
        description:
          'Pictures drawn with letters and symbols. When converting an image, each pixel is replaced by a dense character like "@" or a light one like "." depending on its brightness.',
      },
      {
        term: 'Monospace font',
        description:
          'A font where every character has the same width. ASCII art only looks like a picture when characters line up, so it must be shown in a monospace font.',
      },
    ],
  },
};
