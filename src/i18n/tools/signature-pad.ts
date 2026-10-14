import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SignaturePadPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  canvasLabel: string;
  canvasHint: string;
  penWidthLabel: string;
  penColorLabel: string;
  undoButton: string;
  clearButton: string;
  trimLabel: string;
  paddingLabel: string;
  scaleLabel: string;
  /** {width}, {height} を置換する */
  outputInfo: string;
  downloadButton: string;
  downloaded: string;
  errorEmpty: string;
  /** {max} を置換する */
  errorTooLarge: string;
  errorExportFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const signaturePadContent: Record<Locale, SignaturePadPageContent> = {
  ja: {
    title: '手書き署名作成｜透過PNGのサイン画像をブラウザで作る',
    description:
      'マウスやスマホの指で手書きの署名を書き、背景が透明なPNG画像として保存できる無料ツールです。ペンの太さ・色・余白の自動トリミングに対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '手書き署名作成（透過PNGのサイン画像を作る）',
    introHtml:
      '枠の中にマウスや指で署名を書くだけで、背景が透明なPNG画像を作れます。余白は自動で切り詰められるので、書類やPDFにそのまま重ねられます。署名はブラウザ内で処理され、アップロードされません。画像をほかの形式に変えたいときは <a href="/tools/image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像形式変換</a> もご利用ください。',
    canvasLabel: '署名を書く枠',
    canvasHint: 'この枠の中に、マウスまたは指で署名を書いてください。',
    penWidthLabel: 'ペンの太さ',
    penColorLabel: 'ペンの色',
    undoButton: '1つ戻す',
    clearButton: 'すべて消す',
    trimLabel: '余白を自動で切り詰める',
    paddingLabel: '余白（px）',
    scaleLabel: '出力の倍率',
    outputInfo: '出力サイズ: {width} × {height} px',
    downloadButton: '透過PNGをダウンロード',
    downloaded: 'ダウンロードしました',
    errorEmpty:
      '署名がまだ書かれていません。枠の中に書いてから保存してください。',
    errorTooLarge:
      '出力画像が大きすぎます（1辺{max}pxまで）。倍率を下げてください。',
    errorExportFailed:
      '画像を書き出せませんでした。お使いのブラウザで再度お試しください。',
    howToHeading: '使い方',
    howToSteps: [
      '「署名を書く枠」の中に、マウスまたは指で署名を書きます。',
      '「ペンの太さ」「ペンの色」を調整します。書き間違えたら「1つ戻す」または「すべて消す」を押します。',
      '必要に応じて「余白を自動で切り詰める」「余白（px）」「出力の倍率」を設定します。',
      '「透過PNGをダウンロード」を押して保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '書き出した画像は背景が透明です。画像ビューアによっては黒や白の背景で表示されることがあります。',
      '「出力の倍率」を上げると、同じ署名でも画素数が増えて拡大してもきれいに使えます。そのぶんファイルは大きくなります。',
      '署名は個人情報にあたります。共有端末では使用後にページを閉じ、書き出したファイルの扱いにご注意ください。',
      '書き出した署名画像は、電子署名のような法的な効力を持つものではありません。提出先の要件を確認してお使いください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '透過PNG',
        description:
          '背景が透明なPNG画像です。書類やPDFの上に重ねても、署名の文字だけが表示されます。',
      },
      {
        term: 'トリミング',
        description:
          '画像の余分な余白を切り落とすことです。署名の周囲を自動で切り詰めると、貼り付け時にサイズを合わせやすくなります。',
      },
    ],
  },
  en: {
    title: 'Signature Maker: Draw a Transparent PNG Signature',
    description:
      'Draw a handwritten signature with your mouse or finger and save it as a transparent PNG. Trims margins. Runs in your browser; nothing is uploaded.',
    h1: 'Online Signature Maker (Transparent PNG Signature)',
    introHtml:
      'Sign inside the box with your mouse or finger and get a PNG with a transparent background. Empty margins are trimmed automatically, so it drops straight onto a document or PDF. Everything runs in your browser and nothing is uploaded. To change the image format afterwards, try the <a href="/en/tools/image-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Converter</a>.',
    canvasLabel: 'Signature box',
    canvasHint: 'Sign inside this box with your mouse or finger.',
    penWidthLabel: 'Pen width',
    penColorLabel: 'Pen color',
    undoButton: 'Undo',
    clearButton: 'Clear all',
    trimLabel: 'Trim empty margins automatically',
    paddingLabel: 'Padding (px)',
    scaleLabel: 'Output scale',
    outputInfo: 'Output size: {width} × {height} px',
    downloadButton: 'Download transparent PNG',
    downloaded: 'Downloaded',
    errorEmpty: 'There is no signature yet. Sign in the box before saving.',
    errorTooLarge:
      'The output image is too large (up to {max} px per side). Lower the scale.',
    errorExportFailed:
      'Could not export the image. Please try again in your browser.',
    howToHeading: 'How to use',
    howToSteps: [
      'Sign inside the "Signature box" with your mouse or finger.',
      'Adjust "Pen width" and "Pen color". Press "Undo" or "Clear all" to fix mistakes.',
      'If needed, set "Trim empty margins automatically", "Padding (px)", and "Output scale".',
      'Click "Download transparent PNG" to save it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The exported image has a transparent background. Some image viewers show it on a black or white backdrop.',
      'A higher "Output scale" gives the same signature more pixels, so it stays sharp when enlarged, at the cost of a larger file.',
      'A signature is personal data. On a shared device, close the page after use and handle the exported file with care.',
      'The image is not a legally binding electronic signature. Check what the recipient requires before using it.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Transparent PNG',
        description:
          'A PNG image with no background color. Placed over a document or PDF, only the strokes of the signature show.',
      },
      {
        term: 'Trimming',
        description:
          'Cutting away extra empty space around an image. Auto-trimming the signature makes it easier to size when you paste it.',
      },
    ],
  },
};
