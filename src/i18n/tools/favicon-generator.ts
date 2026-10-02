import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface FaviconGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  errorUnsupportedFile: string;
  /** `{max}` を置換して使うテンプレート */
  errorFileTooLargeTemplate: string;
  errorLoadFailed: string;
  warningSmallSource: string;
  sourceInfoTemplate: string;
  previewHeading: string;
  previewHint: string;
  resultsHeading: string;
  /** `{width}` `{height}` を置換して使うテンプレート */
  dimensionsTemplate: string;
  icoDimensionsLabel: string;
  downloadButton: string;
  clearButton: string;
  snippetHeading: string;
  snippetIntro: string;
  copyButton: string;
  copiedMessage: string;
  copyFailedMessage: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const faviconGeneratorContent: Record<
  Locale,
  FaviconGeneratorPageContent
> = {
  ja: {
    title: 'favicon（ファビコン）一括生成ツール｜ICO/PNGを複数サイズで書き出し',
    description:
      '1枚の画像から、favicon.ico（16/32/48px同梱）とapple-touch-iconなど複数サイズのPNGを一括生成できる無料ツールです。linkタグも自動生成。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'favicon（ファビコン）一括生成',
    introHtml:
      '画像を1枚選択するだけで、favicon.ico（16px・32px・48pxを1ファイルに格納）と、favicon-16x16.png・favicon-32x32.png・favicon-48x48.png・apple-touch-icon.png（180px）・android-chrome-192x192.png・android-chrome-512x512.pngをまとめて生成します。長方形の画像は中央を基準に正方形へ自動的に切り抜かれますが、プレビュー上の枠をドラッグして切り抜く位置を調整することもできます。生成したファイルをHTMLで読み込むための&lt;link&gt;タグも合わせて出力します。フォーマット変換のみでよい場合は<a href="/tools/image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像フォーマット変換</a>もご利用ください。',
    dropLabel: '元画像を選択',
    dropHint:
      'ここに画像ファイルをドラッグ＆ドロップすることもできます（正方形の画像推奨、512×512px以上を推奨）',
    errorUnsupportedFile:
      '対応していないファイル形式です（PNG/JPEG/WebP/GIF/BMPのみ利用できます）',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    errorLoadFailed:
      '画像の読み込みに失敗しました。ファイルが破損しているか、お使いのブラウザが対応していない可能性があります。',
    warningSmallSource:
      '元画像の正方形部分が512×512pxより小さいため、大きいサイズのアイコンは引き伸ばされてぼやける場合があります。可能であれば512×512px以上の正方形画像を用意してください。',
    sourceInfoTemplate: '元画像: {width}×{height}px',
    previewHeading: '切り抜き範囲',
    previewHint:
      'プレビュー上の枠をドラッグすると、切り抜く位置を移動できます（初期状態では中央が選択されています）。',
    resultsHeading: '生成されたファイル',
    dimensionsTemplate: '{width}×{height}px',
    icoDimensionsLabel: '16px/32px/48pxを1ファイルに格納',
    downloadButton: 'ダウンロード',
    clearButton: 'クリア',
    snippetHeading: 'HTML貼り付け用コード',
    snippetIntro:
      '生成したファイルをすべて公開ディレクトリの直下に配置した場合の参照コードです。配置場所に合わせてパスを書き換えてください。',
    copyButton: 'コピー',
    copiedMessage: 'コピーしました',
    copyFailedMessage: 'コピーに失敗しました',
    notesHeading: '注意点',
    notes: [
      '長方形の画像を選択した場合、初期状態では中央を基準にした正方形の範囲が使われますが、プレビュー上の枠をドラッグして切り抜く位置を調整できます。枠の大きさ（一辺の長さ）自体は変更できないため、ロゴ全体を確実に含めたい場合は、あらかじめ正方形にトリミングした画像を用意してください。',
      '透過（アルファチャンネル）情報がある画像はそのまま透過を維持して書き出されます。背景色を敷きたい場合は、事前に背景色を合成した画像を用意してください。',
      'favicon.icoは16px・32px・48pxの3サイズを1ファイルに格納した、Windows Vista以降が対応するPNG格納形式のICOファイルです。非常に古いブラウザ・OS（Windows XP時代のIEなど）では表示できない場合があります。',
      'android-chrome-192x192.png・android-chrome-512x512.pngは、PWA（ホーム画面への追加）用のWeb App Manifest（manifest.json）から参照する想定のサイズです。本ツールは画像ファイルのみ生成し、manifest.json自体は生成しません。',
      'すべての処理はブラウザ内で完結し、選択した画像がサーバーに送信されることはありません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '元になる画像を選択します（正方形で512×512px以上を推奨します）。',
      'プレビュー上の枠をドラッグして、切り抜く範囲を調整します。',
      '生成されたfavicon.icoや各サイズのPNGを、必要なものだけダウンロードします。',
      '「HTML貼り付け用コード」をコピーして、サイトのheadに貼り付けます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'favicon（ファビコン）',
        description:
          'ブラウザのタブやブックマーク一覧、履歴などに表示される、サイトを表す小さなアイコン画像のこと。"favorite icon"の略。',
      },
      {
        term: 'ICO形式',
        description:
          'Windowsのアイコンで使われるファイル形式。1つのファイルに複数サイズ・複数解像度の画像を格納でき、表示先に応じて適したサイズが自動的に選ばれます。',
      },
      {
        term: 'Apple Touch Icon',
        description:
          'iOS/iPadOSでWebページをホーム画面に追加した際に使われるアイコン画像。180×180pxが現在の推奨サイズです。',
      },
      {
        term: 'Web App Manifest',
        description:
          'PWA（Progressive Web App）の名前・アイコン・テーマカラーなどを定義するJSONファイル（manifest.json）。ホーム画面追加時のアイコンや起動時の見た目に使われます。',
      },
    ],
  },
  en: {
    title: 'Favicon Generator – Create ICO & PNG Icons in Every Size',
    description:
      'Generate favicon.ico, apple-touch-icon, android-chrome icons and more from one image, with ready-to-paste link tags. Runs in your browser; nothing is uploaded.',
    h1: 'Favicon Generator',
    introHtml:
      'Choose one image and this tool generates favicon.ico (bundling 16px, 32px, and 48px into one file) along with favicon-16x16.png, favicon-32x32.png, favicon-48x48.png, apple-touch-icon.png (180px), android-chrome-192x192.png, and android-chrome-512x512.png. A non-square image is automatically cropped to a centered square, and you can drag the box on the preview to adjust the crop position. It also outputs the &lt;link&gt; tags you need to reference the generated files from your HTML. If you only need format conversion, try the <a href="/en/tools/image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Format Converter</a> instead.',
    dropLabel: 'Choose a source image',
    dropHint:
      'You can also drag and drop an image file here (a square image is recommended, ideally 512×512px or larger)',
    errorUnsupportedFile:
      'Unsupported file type (only PNG, JPEG, WebP, GIF, and BMP can be used)',
    errorFileTooLargeTemplate: 'This file exceeds the size limit ({max})',
    errorLoadFailed:
      'Failed to load the image. The file may be corrupted, or your browser may not support this format.',
    warningSmallSource:
      'The square portion of your source image is smaller than 512×512px, so the larger icon sizes may look blurry after being scaled up. Use a square image of 512×512px or larger if possible.',
    sourceInfoTemplate: 'Source image: {width}×{height}px',
    previewHeading: 'Crop area',
    previewHint:
      'Drag the box on the preview to move the crop position (it starts centered).',
    resultsHeading: 'Generated files',
    dimensionsTemplate: '{width}×{height}px',
    icoDimensionsLabel: 'Bundles 16px, 32px, and 48px into one file',
    downloadButton: 'Download',
    clearButton: 'Clear',
    snippetHeading: 'HTML snippet',
    snippetIntro:
      'Assumes every generated file is placed directly under your site root. Adjust the paths to match where you actually place them.',
    copyButton: 'Copy',
    copiedMessage: 'Copied',
    copyFailedMessage: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'If you choose a non-square image, the centered square area is used by default, but you can drag the box on the preview to reposition it. The crop size itself cannot be resized, so if you need the whole logo included, crop it to a square yourself first.',
      'Transparency (an alpha channel) in the source image is preserved as-is in the output. If you want a solid background, flatten the image against that background color before uploading.',
      'favicon.ico bundles 16px, 32px, and 48px into a single file using the PNG-compressed ICO format supported by Windows Vista and later. Very old browsers or OSes (such as Internet Explorer on Windows XP) may fail to display it.',
      'android-chrome-192x192.png and android-chrome-512x512.png are the sizes typically referenced from a Web App Manifest (manifest.json) for "Add to Home Screen" / PWA installs. This tool only generates the image files, not manifest.json itself.',
      'All processing happens in your browser — the image you select is never sent to a server.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a source image (a square image of 512×512px or larger is recommended).',
      'Drag the frame on the preview to adjust the crop area.',
      'Download the generated favicon.ico and PNG files you need.',
      "Copy the HTML snippet and paste it into your site's head element.",
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Favicon',
        description:
          'A small icon representing a website, shown in browser tabs, bookmark lists, and history. Short for "favorite icon".',
      },
      {
        term: 'ICO format',
        description:
          'The file format used for Windows icons. A single .ico file can hold several sizes and resolutions of the same image, and the operating system automatically picks the one that fits.',
      },
      {
        term: 'Apple Touch Icon',
        description:
          'The icon used when a web page is added to the Home Screen on iOS/iPadOS. 180×180px is the currently recommended size.',
      },
      {
        term: 'Web App Manifest',
        description:
          "A JSON file (manifest.json) that defines a Progressive Web App's name, icons, and theme color, used for the Home Screen icon and launch appearance.",
      },
    ],
  },
};
