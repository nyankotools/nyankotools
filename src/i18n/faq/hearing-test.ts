import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '高い周波数がまったく聞こえません。耳が悪いのでしょうか？',
      answer:
        '必ずしもそうではありません。高周波の聞こえは年齢で自然に低下しますし、ノートPCやスマホの内蔵スピーカーはもともと高音が出にくいです。イヤホンやヘッドホンで音量を少し上げて試し、それでも気になる場合は耳鼻咽喉科で相談してください。',
    },
    {
      question: '年齢の目安はどのくらい正確ですか？',
      answer:
        '一般に言われる傾向（若いほど高い音が聞こえる）に基づく大まかな目安で、個人差が大きく医療診断でもありません。機器の再生限界や周囲の騒音でも結果が変わるため、遊びや参考程度にしてください。',
    },
    {
      question: '音量はどのくらいにすればいいですか？',
      answer:
        '最小から始めて、聞こえ始めるまで少しずつ上げてください。このツールのスライダーには上限がありますが、OSやアンプの音量が大きいと危険です。不快に感じる大きさにはしないでください。',
    },
    {
      question: '16kHz以上で音が出ているかどうか分かりません。',
      answer:
        '機器の再生限界で音そのものが出ていない場合があります。その場合は「聞こえない」のではなく、鳴っていない可能性があります。有線のイヤホンなど別の機器でも試すと切り分けられます。',
    },
    {
      question: '聞こえた結果は保存・送信されますか？',
      answer:
        'いいえ。テスト音は端末内で生成され、チェックの結果もブラウザ内で表示するだけです。サーバーへの送信や保存はありません。',
    },
  ],
  en: [
    {
      question: 'I cannot hear the high tones at all. Is my hearing bad?',
      answer:
        'Not necessarily. High-frequency hearing declines naturally with age, and built-in laptop and phone speakers are poor at high pitches. Try headphones with the volume raised a little, and see a doctor if you are still concerned.',
    },
    {
      question: 'How accurate is the age guide?',
      answer:
        'It is a rough guide based on the general trend that younger people hear higher pitches. Individual variation is large and it is not a medical diagnosis. Equipment limits and background noise also change the result, so treat it as a bit of fun.',
    },
    {
      question: 'How loud should the volume be?',
      answer:
        'Start at minimum and raise it slowly until you just begin to hear the tone. The slider here has a cap, but a high OS or amplifier volume can still be dangerous. Never go to a level that is uncomfortable.',
    },
    {
      question: 'How do I know if sound is really playing above 16 kHz?',
      answer:
        'Your equipment may be unable to produce the tone at all, in which case you are not failing to hear it, it simply is not playing. Trying wired headphones or other equipment helps tell the two apart.',
    },
    {
      question: 'Are my results saved or sent anywhere?',
      answer:
        'No. The tones are generated on your device and the ticks are only used to show the result in your browser. Nothing is uploaded or stored.',
    },
  ],
};
