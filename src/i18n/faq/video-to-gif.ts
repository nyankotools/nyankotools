import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '動画ファイルはサーバーにアップロードされますか？',
      answer:
        'いいえ。動画の読み込みからGIFの作成までブラウザ内で行われ、選択した動画が外部に送信されることはありません。',
    },
    {
      question: 'GIFのファイルサイズを小さくするにはどうすればよいですか？',
      answer:
        '「幅」を小さくする、「FPS」を下げる、GIFにする範囲を短くする、の3つが効果的です。GIFは1コマごとに画像として保存されるため、コマ数と画面サイズに比例して大きくなります。',
    },
    {
      question: '何秒の動画までGIFにできますか？',
      answer:
        '上限は秒数ではなくコマ数（300コマ）で決まります。たとえば10fpsなら30秒、20fpsなら15秒までです。幅を大きくしすぎてデータ量が多くなる場合も、エラーになることがあります。',
    },
    {
      question: '動画の特定の場面を画像として保存できますか？',
      answer:
        '「フレーム（静止画）をPNGで保存」に時刻（例: 1:30.5）を入力して取り出すと、その時刻のフレームを元の解像度のPNGとして保存できます。',
    },
    {
      question: '動画を読み込めない、または変換に失敗するのはなぜですか？',
      answer:
        '動画のデコードはブラウザの機能（WebCodecs）に依存するため、ブラウザや動画のコーデックによっては読み込めません。最新のChromeやEdgeでお試しください。メモリが足りない場合も失敗することがあります。',
    },
  ],
  en: [
    {
      question: 'Is my video uploaded to a server?',
      answer:
        'No. Reading the video and building the GIF both happen in your browser, and the file you choose is never sent anywhere.',
    },
    {
      question: 'How can I make the GIF smaller?',
      answer:
        'Lower the width, lower the FPS, or shorten the range. A GIF stores every frame as an image, so its size grows with the number of frames and the picture size.',
    },
    {
      question: 'How long a clip can I turn into a GIF?',
      answer:
        'The limit is 300 frames, not a number of seconds: 30 seconds at 10 fps, or 15 seconds at 20 fps. A very wide GIF can also be rejected when its total data would be too large.',
    },
    {
      question: 'Can I save a single scene from the video as an image?',
      answer:
        'Enter a time (for example 1:30.5) under "Save a frame as PNG" and extract it. The frame at that time is saved as a PNG at the original resolution.',
    },
    {
      question: 'Why can’t the video be read, or why does conversion fail?',
      answer:
        'Decoding depends on your browser’s WebCodecs support, so some browsers or video codecs cannot be read. Try the latest Chrome or Edge. Running out of memory can also cause a failure.',
    },
  ],
};
