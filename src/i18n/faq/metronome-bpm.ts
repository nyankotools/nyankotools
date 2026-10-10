import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'タップテンポで測ったBPMが曲の表記とずれます。',
      answer:
        'タップの間隔の誤差がそのまま結果に出るためです。8回ほど、曲の拍に合わせて一定の間隔で叩くと安定します。曲によっては、拍ではなく倍・半分のテンポ（例: 70と140）で感じ取れるため、半分や2倍にすると曲の表記と合うこともあります。',
    },
    {
      question: '何BPMまで設定できますか？',
      answer:
        '20〜300 BPMです。ほとんどの楽曲や練習用途をカバーできます。範囲外の数値を入力した場合は、この範囲に自動で収められます。',
    },
    {
      question: 'クリックの「分割」とは何ですか？',
      answer:
        '1拍の間に小さなクリックを加える設定です。八分音符は1拍に2回、三連符は3回、十六分音符は4回鳴ります。拍の頭以外の音は小さく鳴るので、細かいリズムの練習に使えます。',
    },
    {
      question: '別のタブを開くと音が止まるのはなぜですか？',
      answer:
        'ブラウザは裏のタブの処理を大きく遅らせるため、そのまま鳴らし続けると拍がずれてしまいます。ずれた状態で鳴り続けるのを避けるため、タブを離れると自動で停止します。',
    },
    {
      question: '音は保存・送信されますか？',
      answer:
        'いいえ。クリック音はこのページの中で生成されて再生されるだけで、サーバーへの送信や保存はありません。',
    },
  ],
  en: [
    {
      question: 'The tapped BPM does not match the published tempo of a song.',
      answer:
        'Every timing error in your taps shows up in the result, so tap about 8 times at a steady pace with the beat. Some songs also feel natural at double or half the tempo (for example 70 and 140), so halving or doubling the result may match the published value.',
    },
    {
      question: 'What BPM range can I set?',
      answer:
        'From 20 to 300 BPM, which covers nearly all songs and practice use. A value outside that range is clamped to it.',
    },
    {
      question: 'What does click subdivision mean?',
      answer:
        'It adds smaller clicks between the beats: two per beat for eighth notes, three for triplets and four for sixteenth notes. The clicks between beats are quieter, which helps when practising fine rhythms.',
    },
    {
      question: 'Why does the sound stop when I open another tab?',
      answer:
        'Browsers heavily slow down background tabs, so the beat would drift if it kept playing. To avoid playing a drifting beat, the metronome stops when you leave the tab.',
    },
    {
      question: 'Is the sound saved or sent anywhere?',
      answer:
        'No. The click is generated and played inside this page and is never uploaded or stored.',
    },
  ],
};
