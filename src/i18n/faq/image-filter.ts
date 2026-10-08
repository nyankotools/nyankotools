import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'Safariなどでもフィルターは同じように効きますか？',
      answer:
        'はい。CSSのfilterやCanvasのfilterに頼らず、すべてピクセル単位の計算で適用しているため、ブラウザによる差は出ません。',
    },
    {
      question: '保存した画像の画質や大きさは変わりますか？',
      answer:
        'ピクセル数は元画像と同じです。JPEG・WebPは再圧縮されるため、画質設定によってファイルサイズが変わります。劣化を避けたい場合はPNGを選んでください。',
    },
    {
      question: 'プレビューと保存結果が少し違うことはありますか？',
      answer:
        'プレビューは軽量化のため縮小して処理するので、ぼかしやシャープの強さが見た目でわずかに異なることがあります。色の調整はほぼ同じです。',
    },
    {
      question: '写真のExif情報は残りますか？',
      answer:
        '残りません。Canvasで再エンコードするため、撮影位置などのExifは出力ファイルに含まれません。',
    },
  ],
  en: [
    {
      question: 'Do the filters work the same in Safari?',
      answer:
        'Yes. They do not rely on CSS or Canvas filter support. Every effect is computed pixel by pixel, so the result is the same across browsers.',
    },
    {
      question: 'Does saving change the size or quality of my image?',
      answer:
        'The pixel dimensions stay the same. JPEG and WebP are re-compressed, so file size depends on the quality setting. Choose PNG to avoid quality loss.',
    },
    {
      question: 'Can the preview differ from the saved file?',
      answer:
        'The preview is processed at a reduced size to stay fast, so blur and sharpen can look slightly different. Color adjustments match closely.',
    },
    {
      question: 'Is Exif data kept?',
      answer:
        'No. The image is re-encoded through a canvas, so Exif data such as shooting location is not included in the output.',
    },
  ],
};
