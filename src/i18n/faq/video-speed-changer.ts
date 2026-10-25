import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '指定できる再生速度の範囲はどれくらいですか？',
      answer:
        '0.25倍（4分の1の速さ）から4倍までです。「2」で2倍速、「0.5」で半分の速さになり、出力の長さは元の長さを倍率で割った値になります。',
    },
    {
      question: '倍速にすると音声の高さ（ピッチ）はどうなりますか？',
      answer:
        '音声は再生速度に合わせて再生し直すため、ピッチは保持されず、倍速では高く、スローでは低くなります。ピッチを保ったまま速度を変えたい場合は、音声だけを取り出して「音声の速度・ピッチ変更」で処理してください。',
    },
    {
      question: 'スロー動画がカクカクして見えるのはなぜですか？',
      answer:
        'スローにするとコマの間隔が広がりますが、このツールはコマの補間（フレーム補間）を行いません。元のfpsが低い動画ほど動きがぎこちなく見えます。',
    },
    {
      question: '長い動画や大きな動画でも処理できますか？',
      answer:
        'ファイルサイズは1GBまでです。ブラウザ内で再エンコードするため、長い動画・高解像度の動画は時間がかかり、メモリ不足で失敗することもあります。「解像度（高さの上限）」を下げると軽くなります。',
    },
    {
      question: '動画はサーバーにアップロードされますか？',
      answer:
        'いいえ。変換はブラウザ内（WebCodecs）で行われ、選択したファイルが外部に送信されることはありません。',
    },
  ],
  en: [
    {
      question: 'What range of speeds can I set?',
      answer:
        'From 0.25x (quarter speed) to 4x. Enter "2" for double speed or "0.5" for half speed; the output length is the original length divided by the multiplier.',
    },
    {
      question: 'What happens to the audio pitch when I speed a video up?',
      answer:
        'The audio is re-timed along with the video, so its pitch is not preserved: it sounds higher when sped up and lower when slowed down. To keep the pitch, extract the audio and process it with the Audio Speed & Pitch Changer.',
    },
    {
      question: 'Why does my slow-motion video look choppy?',
      answer:
        'Slowing down stretches the gap between frames, and this tool does not interpolate new frames. Videos with a low original frame rate look more jerky in slow motion.',
    },
    {
      question: 'Can it handle long or large videos?',
      answer:
        'Files up to 1 GB are accepted. Because the video is re-encoded in your browser, long or high-resolution videos can take a while or run out of memory. Lowering "Resolution (max height)" makes it lighter.',
    },
    {
      question: 'Is my video uploaded to a server?',
      answer:
        'No. Conversion runs inside your browser using WebCodecs, and the file you choose is never sent anywhere.',
    },
  ],
};
