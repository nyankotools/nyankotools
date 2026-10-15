import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'Instagramの9分割は、どの順番で投稿すればいいですか？',
      answer:
        'Instagramのフィードは最後に投稿した画像が左上に表示されるため、右下のタイルから順に投稿します。「Instagram投稿順の番号にする」にチェックすると、右下が1番になり、番号順に投稿するだけで元の絵の通りに並びます。',
    },
    {
      question: '割り切れない大きさの画像は、どう分割されますか？',
      answer:
        '縦横それぞれ均等になるよう境界を丸めて分けるため、タイル同士の大きさは最大1pxだけ異なります。隙間や重なりはなく、すべてのピクセルがいずれかのタイルに入ります。',
    },
    {
      question: '長方形の画像を、正方形のタイルに分割できますか？',
      answer:
        'タイルの形は、画像の縦横比と行数・列数で決まります。正方形のタイルが必要なときは、先に「画像に余白を追加・正方形にする」などで画像を正方形にそろえてから3×3に分割してください。',
    },
    {
      question: '分割した画像を1枚ずつ保存できますか？',
      answer:
        'すべてのタイルを1つのZIPファイルにまとめて保存します。ZIPを展開すると、番号付きの画像ファイルが取り出せます。',
    },
    {
      question: '画像はサーバーにアップロードされますか？',
      answer:
        'されません。分割・ZIP化はすべてブラウザ内で行われ、画像が外部に送信されることはありません。',
    },
  ],
  en: [
    {
      question: 'In what order should I post an Instagram 3x3 grid?',
      answer:
        'Instagram shows the newest post at the top-left, so you post the bottom-right tile first. Tick "Number in Instagram posting order" and the bottom-right tile becomes number 1; posting in numeric order rebuilds the original picture.',
    },
    {
      question: 'How is an image split when it does not divide evenly?',
      answer:
        'Boundaries are rounded so both directions are split as evenly as possible, and tile sizes differ by at most 1 px. There are no gaps or overlaps, and every pixel lands in exactly one tile.',
    },
    {
      question: 'Can I get square tiles from a rectangular image?',
      answer:
        'Tile shape follows the image aspect ratio and the number of rows and columns. If you need square tiles, first make the image square with a tool such as Image Padding, then split it 3×3.',
    },
    {
      question: 'Can I save the tiles one by one?',
      answer:
        'All tiles are saved together in a single ZIP file. Extract it to get the numbered image files.',
    },
    {
      question: 'Is my image uploaded to a server?',
      answer:
        'No. Splitting and zipping all happen in your browser, and the image is never sent anywhere.',
    },
  ],
};
