import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '声が高くならずに、再生速度だけ変えられますか？',
      answer:
        'はい。「ピッチの扱い」で「ピッチを保って速度だけ変える」を選ぶと、声の高さを保ったまま速くしたり遅くしたりできます。ただし簡易的な方式のため、極端な倍率では音が少し濁ります。',
    },
    {
      question: '曲のキーだけを上げ下げするにはどうしますか？',
      answer:
        '「ピッチの扱い」を「ピッチを保って速度だけ変える」にして、速度を1のまま「ピッチ（半音）」に+2や-3などを入れます。長さは変わらず、キーだけが変わります。',
    },
    {
      question: '速度を変えると声がチップマンクのようになるのはなぜですか？',
      answer:
        '「速度に合わせてピッチも変える（テープ風）」では、再生速度を上げると周波数も上がるためです。ピッチを変えたくない場合は「ピッチを保って速度だけ変える」を選んでください。',
    },
    {
      question: '保存形式はWAVだけですか？ MP3で保存できますか？',
      answer:
        '出力はWAV（16bit PCM）のみです。MP3やM4Aにしたい場合は、保存したWAVを動画・音声変換ツールに読み込んで変換してください。',
    },
    {
      question: '読み込めない音声ファイルがあるのはなぜですか？',
      answer:
        '読み込みはブラウザの音声デコード機能に依存するため、ブラウザが対応していない形式やコーデックは開けません。長さが10分を超える音声やサイズが200MBを超えるファイルも受け付けていません。',
    },
  ],
  en: [
    {
      question: 'Can I change the speed without making the voice higher?',
      answer:
        'Yes. Choose "Keep the pitch, change only the speed" under "Pitch handling" to make audio faster or slower while keeping its pitch. It is a simple method, so extreme ratios can sound slightly smeared.',
    },
    {
      question: 'How do I transpose a song without changing its length?',
      answer:
        'Select "Keep the pitch, change only the speed", leave the speed at 1, and enter a value such as +2 or -3 in "Pitch (semitones)". The length stays the same and only the key changes.',
    },
    {
      question: 'Why does the voice sound like a chipmunk when I speed it up?',
      answer:
        'With "Change pitch along with speed (tape style)", raising the speed also raises the frequency, just like a sped-up tape. Choose "Keep the pitch, change only the speed" if you want the pitch to stay put.',
    },
    {
      question: 'Is WAV the only output format? Can I get an MP3?',
      answer:
        'The output is WAV (16-bit PCM) only. To get MP3 or M4A, open the saved WAV in the video and audio converter tool and convert it there.',
    },
    {
      question: 'Why can’t some audio files be opened?',
      answer:
        'Decoding relies on your browser, so formats or codecs it does not support cannot be loaded. Audio longer than 10 minutes and files over 200 MB are also rejected.',
    },
  ],
};
