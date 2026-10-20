import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '描いた絵は保存されますか？',
      answer:
        'ブラウザ内にも保存されません。ページを閉じたりリロードしたりすると消えるため、必要なときは「PNGをダウンロード」で保存してください。データはサーバーにも送信されません。',
    },
    {
      question: 'PNGの背景は透明になりますか？',
      answer:
        'はい。色を塗っていないマスは透明のまま書き出されます。消しゴムで消したマスも透明になります。背景色が必要な場合は、画像編集ソフトなどで合成してください。',
    },
    {
      question: '拡大して書き出してもぼやけませんか？',
      answer:
        '拡大は補間なし（ニアレストネイバー）で行うため、1マスがそのまま大きな正方形になり、輪郭はぼやけません。1〜32倍から選べ、16マスの絵を8倍にすると128×128pxになります。',
    },
    {
      question: 'キャンバスサイズを後から変えると絵はどうなりますか？',
      answer:
        '左上を基準に絵が引き継がれます。大きくすると右と下に空白が増え、小さくすると外側が切り取られます。「元に戻す」で変更前のサイズと絵に戻せます。',
    },
    {
      question: 'アニメーションGIFは作れますか？',
      answer:
        '現在は静止画のPNG書き出しのみ対応しています。アニメーションGIFの作成には対応していません。',
    },
  ],
  en: [
    {
      question: 'Is my drawing saved?',
      answer:
        'No, not even in the browser. It disappears when you close or reload the page, so use "Download PNG" to keep it. The data is never sent to a server either.',
    },
    {
      question: 'Is the PNG background transparent?',
      answer:
        'Yes. Cells you have not painted, or that you erased, are exported as transparent. If you need a background color, add it in an image editor.',
    },
    {
      question: 'Will the image stay sharp when exported at a larger scale?',
      answer:
        'Yes. Scaling uses nearest-neighbor with no smoothing, so each cell becomes a crisp square. You can choose 1x to 32x; a 16-cell drawing at 8x is 128×128 px.',
    },
    {
      question: 'What happens to my drawing if I change the canvas size?',
      answer:
        'The drawing stays anchored at the top-left. Enlarging adds blank space on the right and bottom; shrinking crops the outside. "Undo" restores the previous size and drawing.',
    },
    {
      question: 'Can I make an animated GIF?',
      answer:
        'Not at the moment. Only still PNG export is supported; animated GIFs cannot be created.',
    },
  ],
};
