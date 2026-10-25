import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'しきい値は何dBにすればよいですか？',
      answer:
        '静かな部屋の声の録音なら-40dB前後が目安です。無音が検出されないときは-30dBのように大きく、声の語尾まで削られるときは-50dBのように小さくしてください。波形のオレンジの線と赤い帯を見ながら調整できます。',
    },
    {
      question: '語頭や語尾が欠けてしまうのを防ぐには？',
      answer:
        '「残す余白（秒）」を0.1〜0.3秒ほどにすると、音の前後に無音を少し残してカットします。「最小無音長（秒）」を長めにすると、息継ぎのような短い無音は対象外になります。',
    },
    {
      question: 'カットと短縮はどう違いますか？',
      answer:
        '「無音をカット」は、残す余白を除いて無音を取り除きます。「無音を短縮」は、長い無音を指定の長さ（例: 0.3秒）まで詰めるので、間を完全にはなくさず、話のテンポだけを整えたいときに向いています。',
    },
    {
      question: 'BGMが流れている音声でも無音を削除できますか？',
      answer:
        'BGMや環境音が常に鳴っていると、音量がしきい値を下回らず無音と判定されません。その音量より大きいしきい値にすれば検出できますが、小さな声も無音扱いになることがあります。声だけの録音に向いたツールです。',
    },
    {
      question: '保存形式はWAVだけですか？ 元の形式のまま保存できますか？',
      answer:
        '出力はWAV（16bit PCM）のみで、元がMP3でもWAVになり容量が大きくなります。MP3などにしたい場合は、保存したWAVを動画・音声変換ツールで変換してください。',
    },
  ],
  en: [
    {
      question: 'What threshold in dB should I use?',
      answer:
        'For a voice recorded in a quiet room, around -40 dB is a good start. If no silence is found, raise it (for example -30 dB); if the ends of words are getting clipped, lower it (for example -50 dB). The orange line and red bands on the waveform show the effect as you adjust.',
    },
    {
      question:
        'How do I stop the starts and ends of words from being clipped?',
      answer:
        'Set "Padding to keep (seconds)" to about 0.1 to 0.3 so a little silence stays before and after the sound. A longer "Minimum silence length (seconds)" also leaves short gaps such as breaths untouched.',
    },
    {
      question: 'What is the difference between cutting and shortening?',
      answer:
        '"Cut silence (keep only padding)" removes silence except for the padding. "Shorten silence (to a set length)" shrinks long silences to a length you choose (for example 0.3 seconds), so pauses never disappear completely. Use it when you only want to tighten the pacing.',
    },
    {
      question: 'Does it work on audio with background music?',
      answer:
        'If music or room noise is always playing, the level never drops below the threshold and no silence is detected. You can raise the threshold above that noise, but quiet speech may then count as silence too. The tool works best on voice-only recordings.',
    },
    {
      question: 'Is WAV the only output? Can I keep the original format?',
      answer:
        'The output is always 16-bit PCM WAV, so an MP3 input becomes a larger WAV file. To get MP3 or similar, open the saved WAV in the video and audio converter tool.',
    },
  ],
};
