import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'シャッフルしたら解けない配置になることはありますか？',
      answer:
        'ありません。ランダムに並べたあと、転倒数（タイルの順序の乱れ具合）で解けるかを判定し、解けない並びは2枚を入れ替えて必ず完成形にたどり着ける配置にしています。完成済みの並びが出ることもありません。',
    },
    {
      question: '手数はどう数えますか？',
      answer:
        '動かしたタイルの数が手数です。空きマスと同じ行・列にあるタイルをクリックして複数枚をまとめて滑らせたときは、動いた枚数ぶん加算されます。1枚ずつ動かした場合と同じ手数になります。',
    },
    {
      question: '画像で遊ぶと、画像はどこかに送信されますか？',
      answer:
        'いいえ。選んだ画像はブラウザ内で読み込み・分割するだけで、サーバーには送信されません。ページを閉じる・再読み込みすると画像は破棄されます。',
    },
    {
      question: '縦長や横長の画像はどう使われますか？',
      answer:
        '短いほうの辺に合わせて、画像の中央を正方形に切り取って使います。端の部分はパズルに含まれません。人物や被写体を中央に置いた画像のほうが遊びやすくなります。',
    },
    {
      question: '3×3・4×4・5×5でベスト記録は別々ですか？',
      answer:
        'はい。大きさごとに最少手数と最短タイムを別々に保存します。数字モードと画像モードは区別せず、同じ大きさの記録として扱います。',
    },
  ],
  en: [
    {
      question: 'Can a shuffle ever be unsolvable?',
      answer:
        'No. After shuffling, the layout is checked using its inversion count, and if it is not solvable two tiles are swapped so that it always can be solved. A layout that is already solved is never dealt.',
    },
    {
      question: 'How are moves counted?',
      answer:
        'Moves are the number of tiles you slide. If you click a tile in the same row or column as the empty space and several tiles slide together, each tile counts, so it equals moving them one at a time.',
    },
    {
      question: 'Is my image uploaded when I play with a picture?',
      answer:
        'No. The image is only read and split inside your browser and is never sent to a server. It is discarded when you close or reload the page.',
    },
    {
      question: 'How are tall or wide images used?',
      answer:
        'The central square of the image, as wide as its shorter side, is used. The edges are cropped away, so pictures with the subject near the center work best.',
    },
    {
      question: 'Are best records separate for 3×3, 4×4 and 5×5?',
      answer:
        'Yes. The fewest moves and shortest time are saved separately for each size. Number mode and image mode share the same records for a given size.',
    },
  ],
};
