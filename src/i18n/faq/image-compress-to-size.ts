import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '目標サイズぴったりにならないのはなぜですか？',
      answer:
        'このツールは「目標サイズ以下に収まる最大の画質」を整数の画質値（1〜100）で探すため、目標より少し小さい結果になります。画質を1つ上げると目標を超える場合に、その手前の画質が採用されます。',
    },
    {
      question: '画質を下げても目標サイズに届かない場合はどうなりますか？',
      answer:
        '「画質を下げても届かない場合は画像サイズも縮小する」がオンなら、縦横比を保ったまま90%・80%…と段階的に縮小して再度探索します。オフの場合は、届かなかった旨と最小で到達できたサイズを表示します。',
    },
    {
      question: '1KBは何バイトで計算していますか？',
      answer:
        '1KB = 1024バイト、1MB = 1024KBで計算します。アップロード先が1KB = 1000バイトで判定する場合は、200KB制限なら190KB程度など、少し余裕を持たせてください。',
    },
    {
      question: 'PNGやGIFを指定サイズに圧縮できますか？',
      answer:
        '入力としては読み込めますが、出力はJPEGまたはWebPです。PNGは可逆圧縮で品質指定による容量調整ができないためです。透過を残したい場合はWebPを選んでください。',
    },
  ],
  en: [
    {
      question: 'Why is the result not exactly my target size?',
      answer:
        'The tool looks for the highest whole-number quality (1-100) that stays under the target, so the result is usually a little smaller. If the next quality step would go over the limit, the one below it is used.',
    },
    {
      question: 'What if lowering the quality is not enough?',
      answer:
        'If "Also shrink the image if lowest quality is not enough" is on, the image is scaled down step by step (90%, 80%, ...) with its aspect ratio kept and searched again. If it is off, the tool tells you the target was not reached and shows the smallest size it got.',
    },
    {
      question: 'How many bytes is 1KB here?',
      answer:
        'The tool uses 1KB = 1024 bytes and 1MB = 1024KB. If the site you upload to counts 1KB as 1000 bytes, leave some margin, for example aim for about 190KB for a 200KB limit.',
    },
    {
      question: 'Can I compress PNG or GIF files to a target size?',
      answer:
        'You can load them, but the output is JPEG or WebP, because PNG is lossless and its size cannot be tuned with a quality setting. Choose WebP to keep transparency.',
    },
  ],
};
