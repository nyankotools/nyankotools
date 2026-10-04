import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '左右のどちらか片方しか音が出ません。故障ですか？',
      answer:
        'まず、OSやブラウザの音声設定がモノラルになっていないか、バランスが偏っていないかを確認してください。イヤホンはプラグの接触不良、スピーカーはケーブルや端子の問題が多いです。それでも直らない場合は、別の機器で同じテストをして、機器側の問題か切り分けてください。',
    },
    {
      question: '低い周波数（50Hz以下）が聞こえません。',
      answer:
        'ノートPCやスマホ、小型スピーカーは構造上、低音をほとんど再生できません。故障とは限らず、サブウーファーや大きなスピーカー、ヘッドホンで確認できます。',
    },
    {
      question: '音が出ません。何を確認すればよいですか？',
      answer:
        'ブラウザのタブがミュートになっていないか、OSの音量や出力先（スピーカー／ヘッドホン）、Bluetooth接続の切り替えを確認してください。再生はボタンを押したときに始まります。ページを開いただけでは鳴りません。',
    },
    {
      question: '音は保存・送信されますか？',
      answer:
        'いいえ。テスト音はこのページの中で生成されて再生されるだけで、サーバーへの送信や保存はありません。',
    },
  ],
  en: [
    {
      question: 'Only one side plays. Is my gear broken?',
      answer:
        'First check that your OS or browser audio is not set to mono and that the balance is not skewed. A loose plug is common with earphones, and cables or terminals with speakers. If that does not help, run the same test on other gear to find out whether the fault is in the equipment.',
    },
    {
      question: 'I cannot hear low frequencies (below 50 Hz).',
      answer:
        'Laptops, phones and small speakers physically cannot reproduce much bass. This is not necessarily a fault; check with a subwoofer, larger speakers or headphones.',
    },
    {
      question: 'I hear nothing. What should I check?',
      answer:
        'Check that the browser tab is not muted, the OS volume and output device (speakers or headphones), and any Bluetooth switching. Sound starts only when you press a button; just opening the page plays nothing.',
    },
    {
      question: 'Is the sound saved or sent anywhere?',
      answer:
        'No. The test tone is generated and played inside this page and is never uploaded or stored.',
    },
  ],
};
