import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question:
        '分解したコマが、元のGIFで見えるのと同じ絵にならないことはありますか？',
      answer:
        'GIFは、前のコマとの差分だけを持つことがあります。このツールは、処分方法・透過色・部分更新を指定どおりに重ねて、各コマを元のGIF全体の大きさの完成した1枚に直してから保存します。そのため、PNGにしたコマ単体でアニメーション中と同じ絵になります。',
    },
    {
      question: '表示時間が0や極端に短いGIFは、どう扱われますか？',
      answer:
        '0〜10ミリ秒の指定は、ブラウザと同じく100ミリ秒として扱います。作り直すGIFでは、表示時間を20〜10,000ミリ秒に収め、GIFの単位（10ミリ秒）に丸めます。',
    },
    {
      question:
        'GIFを作り直すと、色が変わったりファイルが大きくなったりしますか？',
      answer:
        '各コマを256色以内に減色し直すため、色が少し変わることがあります。また、元のGIFは差分だけを保存していても、作り直したGIFは各コマを丸ごと保存するので、ファイルが大きくなる場合があります。コマを減らすと小さくなります。',
    },
    {
      question: '読み込めないGIFがあるのはなぜですか？',
      answer:
        '壊れている、途中で切れている、またはファイル50MB・1コマ400万画素・300コマ・全コマ合計4,000万画素の上限を超えている場合は、メモリを使い切らないよう読み込みを止めてエラーを表示します。拡張子がGIFでも中身が別の形式のファイルも読み込めません。',
    },
    {
      question: 'GIFファイルはサーバーに送られますか？',
      answer:
        'いいえ。GIFの展開、PNGへの変換、ZIPの作成、GIFの書き出しはすべてお使いのブラウザの中で行われ、ファイルが外部に送信されることはありません。',
    },
  ],
  en: [
    {
      question:
        'Will an extracted frame look the same as it does in the playing GIF?',
      answer:
        'A GIF often stores only the part that changed from the previous frame. This tool applies the disposal methods, transparent colors, and partial updates as specified, and turns every frame into a finished image the size of the whole GIF before saving. So each PNG shows what you see at that moment of the animation.',
    },
    {
      question: 'How are zero or very short frame delays handled?',
      answer:
        'A delay of 0 to 10 ms is treated as 100 ms, as browsers do. In the rebuilt GIF, delays are kept between 20 and 10,000 ms and rounded to the GIF unit of 10 ms.',
    },
    {
      question: 'Does rebuilding the GIF change its colors or file size?',
      answer:
        'Every frame is reduced to 256 colors or fewer again, so colors can shift slightly. Also, the original may store only differences between frames while the rebuilt GIF stores every frame in full, so the file can get bigger. Dropping frames makes it smaller.',
    },
    {
      question: 'Why can some GIFs not be opened?',
      answer:
        'GIFs that are damaged, cut off, or over the limits (50 MB, 4 million pixels per frame, 300 frames, 40 million pixels across all frames) are rejected with an error so the browser does not run out of memory. A file with a .gif name but another format inside cannot be opened either.',
    },
    {
      question: 'Is my GIF sent to a server?',
      answer:
        'No. Decoding the GIF, converting to PNG, building the ZIP, and writing the new GIF all happen inside your browser. The file is never uploaded.',
    },
  ],
};
