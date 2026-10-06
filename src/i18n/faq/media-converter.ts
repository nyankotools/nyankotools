import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '動画ファイルはサーバーにアップロードされますか？',
      answer:
        'いいえ。変換はブラウザ内（WebCodecs）で行われ、選択したファイルが外部に送信されることはありません。',
    },
    {
      question: '動画の容量を小さくするにはどうすればよいですか？',
      answer:
        '「品質」を下げるか、「解像度（高さの上限）」を720pや480pなどに下げてください。出力形式は、元と同じ形式のままでも構いません。再エンコードするため画質は多少劣化します。',
    },
    {
      question: '動画から音声だけを取り出せますか？',
      answer:
        '出力形式で「MP3」「M4A」「OGG」「WAV」などの音声形式を選ぶと、映像を除いた音声だけが保存されます。音声のない動画は音声形式に変換できません。',
    },
    {
      question: '変換に失敗する、または選べない出力形式があるのはなぜですか？',
      answer:
        'エンコードはブラウザの機能（WebCodecs）に依存するため、ブラウザによって対応する形式が異なります。最新のChromeやEdgeでの利用をおすすめします。元の動画のコーデックを読み込めない場合や、メモリが足りない長い動画でも失敗することがあります。',
    },
    {
      question: 'トリミングの時刻はどのように入力しますか？',
      answer:
        '「90」（秒）、「1:30」（分:秒）、「1:02:03.5」（時:分:秒.小数）の形式で入力します。開始だけ、終了だけの指定もでき、両方が空欄なら全体を変換します。',
    },
  ],
  en: [
    {
      question: 'Is my video uploaded to a server?',
      answer:
        'No. Conversion runs inside your browser using WebCodecs, and the file you choose is never sent anywhere.',
    },
    {
      question: 'How do I make a video file smaller?',
      answer:
        'Lower the "Quality" or reduce "Resolution (max height)" to 720p or 480p. You can keep the same output format as the original. Re-encoding does cost some visual quality.',
    },
    {
      question: 'Can I extract just the audio from a video?',
      answer:
        'Choose an audio format such as MP3, M4A, OGG or WAV as the output format, and only the audio is saved. A video with no audio track cannot be converted to an audio format.',
    },
    {
      question: 'Why does conversion fail, or why can’t I use some formats?',
      answer:
        'Encoding depends on your browser’s WebCodecs support, so supported formats differ by browser. The latest Chrome or Edge is recommended. Conversion can also fail if the source codec cannot be decoded or if a long video runs out of memory.',
    },
    {
      question: 'How do I enter trim times?',
      answer:
        'Use "90" (seconds), "1:30" (minutes:seconds) or "1:02:03.5" (hours:minutes:seconds.fraction). You can set only the start or only the end; leave both empty to convert the whole file.',
    },
  ],
};
