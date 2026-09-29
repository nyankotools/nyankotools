import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ブロックサイズと色数はそれぞれ何を変えますか？',
      answer:
        'ブロックサイズは大きくするほどモザイクが粗く（ドットが大きく）なります。色数（階調）は減らすほど使われる色が少なくなり、レトロなイラスト風になります。256階調のままなら色は元のままです。',
    },
    {
      question: 'モザイクで顔やナンバープレートを隠しても安全ですか？',
      answer:
        'ブロックサイズが小さいと元の情報を推測されることがあります。個人情報を隠す目的では、十分に大きなブロックサイズを選び、公開前に結果を必ず確認してください。',
    },
    {
      question: '透過PNGを変換するとどうなりますか？',
      answer:
        'PNGやWebPで書き出せば透過は維持されます。JPEGは透過に対応していないため、透明部分は白で塗りつぶされます。',
    },
  ],
  en: [
    {
      question: 'What do block size and color count change?',
      answer:
        'A larger block size makes the mosaic coarser with bigger dots. Fewer colors reduce the palette for a retro, illustrated look. At 256 levels, colors stay unchanged.',
    },
    {
      question: 'Is mosaic safe for hiding faces or license plates?',
      answer:
        'A small block size can still leak information. When hiding personal data, choose a sufficiently large block size and check the result before publishing.',
    },
    {
      question: 'What happens to transparent PNGs?',
      answer:
        'Transparency is kept when exporting as PNG or WebP. JPEG has no transparency, so transparent areas are filled with white.',
    },
  ],
};
