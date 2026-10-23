import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '2枚の画像のサイズが違うときはどう比較されますか？',
      answer:
        '「余白を足して比較」では拡縮せず左上を揃え、大きい方のサイズまで足りない部分を透明として扱うので、その余白は差異になります。「大きい方に拡縮して比較」では、面積の大きい画像のサイズに、もう一方を縦横比を無視して引き伸ばして比べます。',
    },
    {
      question: 'しきい値は何を基準にしていますか？',
      answer:
        '各画素の赤・緑・青・透明度のうち最も大きい差（0〜255）を、しきい値（0〜100%）に対応する値と比べます。しきい値を超えた画素だけが差異として数えられ、0%なら1でも違えば差異です。',
    },
    {
      question: 'JPEGどうしを比べると、見た目は同じなのに差異が出ます。',
      answer:
        'JPEGは再圧縮のたびに画素値が少しずつ変わるため、見た目が同じでも差異が出ます。しきい値を数%に上げると、圧縮ノイズを無視して目に見える変更だけを検出しやすくなります。',
    },
    {
      question: '「ヒートマップ」と「ハイライト」は何が違いますか？',
      answer:
        'ヒートマップは差のない場所を黒、差が大きいほど赤から黄色で示します。ハイライトは基準画像を薄いグレーで表示し、差異のある画素だけを赤で重ねるので、どこが変わったか位置を把握しやすい表示です。',
    },
  ],
  en: [
    {
      question: 'How are images of different sizes compared?',
      answer:
        '"Pad to the larger size" aligns the images at the top-left without scaling and treats the missing area as transparent, so that margin shows up as a difference. "Scale to the larger image" stretches the other image to the size of the one with the larger area, ignoring aspect ratio.',
    },
    {
      question: 'What does the tolerance measure?',
      answer:
        'For each pixel, the largest difference across red, green, blue, and alpha (0-255) is compared with the value matching your tolerance (0-100%). Only pixels above it count as different. At 0%, any difference counts.',
    },
    {
      question: 'Two JPEGs look identical but show differences. Why?',
      answer:
        'JPEG changes pixel values slightly each time it is re-encoded, so images that look the same can still differ. Raising the tolerance to a few percent ignores that compression noise and surfaces only visible changes.',
    },
    {
      question: 'What is the difference between Heatmap and Highlight?',
      answer:
        'Heatmap draws unchanged areas in black and larger differences from red toward yellow. Highlight shows the base image in pale gray and overlays only the differing pixels in red, which makes it easier to see where the change is.',
    },
  ],
};
