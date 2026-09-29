import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '複数の画像を一度にリサイズすると縦横比はどうなりますか？',
      answer:
        '幅か高さのどちらか一方を指定すると、画像ごとに元の縦横比を保ってリサイズされます。縦横比の固定を解除して両方を指定すると、すべて同じサイズに揃えられます。',
    },
    {
      question: '拡大しても画質は上がりますか？',
      answer:
        '上がりません。拡大は可能ですが、画質は元画像以上には戻らず、ぼやけて見えることがあります。拡大が必要な場合は、できるだけ元の大きな画像から作成してください。',
    },
    {
      question: 'リサイズ後のファイルサイズを小さくするコツはありますか？',
      answer:
        '書き出し形式をWebPにして画質を調整すると、同程度の見た目でファイルサイズを大きく減らせます。PNGは可逆圧縮のため、サイズ削減には縮小が中心になります。',
    },
  ],
  en: [
    {
      question: 'How is aspect ratio handled when resizing several images?',
      answer:
        'If you specify only width or height, each image keeps its own aspect ratio. If you unlock the ratio and set both, all images are forced to the same size.',
    },
    {
      question: 'Does enlarging improve quality?',
      answer:
        'No. You can enlarge images, but detail cannot be restored, so they may look blurry. Start from the largest original whenever possible.',
    },
    {
      question: 'How can I get a smaller file after resizing?',
      answer:
        'Export as WebP and tune the quality to reduce file size with little visual loss. PNG is lossless, so size reduction mostly comes from shrinking dimensions.',
    },
  ],
};
