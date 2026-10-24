import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '切り抜いた外側のデータは削除されますか？',
      answer:
        'いいえ。ページの表示範囲（CropBox）を設定するだけで、外側の文字や画像はファイルに残ります。PDFを編集できるソフトでは元に戻せるため、見せたくない情報を隠す用途には、書き出し時に画像化して塗りつぶす黒塗りツールをお使いください。',
    },
    {
      question: '余白の自動検出はどのように動きますか？',
      answer:
        'ページを画像として描画し、白に近くない画素がある範囲を内容として探します。その範囲の周りに指定した余白を残して切り抜き範囲にします。薄い色の内容や、スキャン時の影・ゴミがあると結果がずれることがあるため、プレビューで確認して数値で調整してください。',
    },
    {
      question: '「全ページ共通」と「ページごと」は何が違いますか？',
      answer:
        '「全ページ共通」は同じ長さ（mm）を全ページの各辺から切り落とし、自動検出では全ページの内容がすべて収まる範囲を使います。「ページごと」はページ別に範囲を持てるので、ページの大きさや内容の位置がばらばらのPDF向きです。',
    },
    {
      question: '回転しているページも正しく切り抜けますか？',
      answer:
        'はい。上下左右は、ページを表示したときの向きで指定します。ページに回転が設定されていても、内部で向きを補正してCropBoxを設定します。',
    },
    {
      question: 'PDFファイルはサーバーに送られますか？',
      answer:
        'いいえ。すべてブラウザ内で処理され、ファイルが端末の外に出ることはありません。',
    },
  ],
  en: [
    {
      question: 'Is the data outside the crop deleted?',
      answer:
        'No. The tool only sets the visible page area (the CropBox); text and images outside it stay in the file, and software that can edit PDFs can bring them back. To hide information you do not want others to see, use a redaction tool that flattens the page to an image.',
    },
    {
      question: 'How does margin auto-detect work?',
      answer:
        'The page is rendered as an image and the tool looks for the area containing pixels that are not close to white. The space you choose is kept around that area to form the crop. Very light content, scanner shadows or specks can shift the result, so check the preview and adjust by number.',
    },
    {
      question:
        'What is the difference between "All pages" and "Page by page"?',
      answer:
        '"All pages" cuts the same length (mm) from every side of every page, and auto-detect uses an area that fits the content of all pages. "Page by page" keeps a separate area for each page, which suits PDFs whose pages differ in size or content position.',
    },
    {
      question: 'Do rotated pages crop correctly?',
      answer:
        'Yes. Top, right, bottom and left refer to how the page looks on screen. If a page has a rotation set, the tool converts the directions internally when it writes the CropBox.',
    },
    {
      question: 'Is my PDF uploaded to a server?',
      answer:
        'No. Everything is processed in your browser and the file never leaves your device.',
    },
  ],
};
