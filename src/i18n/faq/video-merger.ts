import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '解像度やフレームレートがバラバラの動画も結合できますか？',
      answer:
        'はい。先頭の動画の解像度とフレームレート（fps）に全体を揃えます。サイズや縦横比が違う動画は、切り取らずに黒い余白つきで収めます。出力に使いたい動画を一覧の先頭に置いてください。',
    },
    {
      question: '音声のない動画が混ざっているとどうなりますか？',
      answer:
        '音声のない動画の区間は無音で補うので、前後の動画の音声が映像とずれることはありません。すべての動画に音声がない場合は、音声なしの動画が出力されます。',
    },
    {
      question: '結合できる動画の本数や長さに上限はありますか？',
      answer:
        '10本まで、1本あたり300MBまで、合計600MBまで、合計の長さ10分までです。ブラウザ内で再エンコードしてメモリ上に出力を作るため、制限を厳しめにしています。大きい場合は「解像度（高さの上限）」を下げるか、動画を分けて結合してください。',
    },
    {
      question: '結合すると画質は落ちますか？',
      answer:
        'すべての動画を再エンコードするため、元より少し劣化します。品質を「高」にすると劣化を抑えられますが、ファイルサイズは大きくなります。',
    },
    {
      question: '動画はサーバーにアップロードされますか？',
      answer:
        'いいえ。結合はブラウザ内（WebCodecs）で行われ、選択したファイルが外部に送信されることはありません。',
    },
  ],
  en: [
    {
      question: 'Can I merge videos with different resolutions or frame rates?',
      answer:
        'Yes. Everything is matched to the first video’s resolution and frame rate (fps). Clips with a different size or aspect ratio are fitted in with black bars instead of being cropped, so put the clip you want to base the output on first in the list.',
    },
    {
      question: 'What happens to clips that have no audio?',
      answer:
        'Those sections are filled with silence, so the audio of the surrounding clips stays in sync with the video. If none of the clips has audio, the output has no audio track.',
    },
    {
      question: 'Is there a limit on the number or length of videos?',
      answer:
        'Up to 10 clips, 300 MB per clip, 600 MB in total, and 10 minutes in total length. The limits are strict because everything is re-encoded in your browser and built in memory. If you hit them, lower "Resolution (max height)" or merge in smaller groups.',
    },
    {
      question: 'Does merging reduce the video quality?',
      answer:
        'Slightly, because every clip is re-encoded. Choosing "High" quality keeps the loss small but makes a larger file.',
    },
    {
      question: 'Are my videos uploaded to a server?',
      answer:
        'No. Merging runs inside your browser using WebCodecs, and the files you choose are never sent anywhere.',
    },
  ],
};
