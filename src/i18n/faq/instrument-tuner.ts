import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'マイクの音は録音・送信されますか？',
      answer:
        'いいえ。マイクの音はこのページ内でピッチ（音の高さ）を調べるためだけに使い、録音も保存も外部への送信もしません。「停止」を押すか、ページを離れるとマイクは解放されます。',
    },
    {
      question: '音が検出されない、またはメーターが安定しません。',
      answer:
        '周囲が静かな場所で、1本ずつ弦を弾いてください。ほかの弦が響いていたり、音が小さすぎたりすると検出できません。ベースの低い弦のように低音ほど揺れやすいので、しっかり弾いて音を伸ばすと安定します。',
    },
    {
      question: '実際の音より1オクターブ高い（低い）音名が出ることがあります。',
      answer:
        'ギター弦などは基音より倍音が強く出ることがあり、誤って倍音を拾うことがあります。このチューナーは基音を優先して検出しますが、弦をはじいた直後は不安定です。少し置いた安定した部分を見てください。',
    },
    {
      question: 'エレキギターやベースはどうやって合わせますか？',
      answer:
        'アンプやスピーカーから出した音をマイクで拾ってください。オーディオインターフェースやマイク入力につないでいる場合は、ブラウザの入力デバイスをそちらに切り替えると、直接合わせられます。',
    },
    {
      question: '基準ピッチ（A4）は何Hzにすればよいですか？',
      answer:
        '一般的には440Hzです。ピアノや合奏の相手がいて音が合わないときは、相手の基準（たとえば442Hz）に合わせて、410〜480Hzの範囲で変更してください。',
    },
  ],
  en: [
    {
      question: 'Is my microphone audio recorded or sent anywhere?',
      answer:
        'No. The audio is only used on this page to work out the pitch. It is never recorded, stored or uploaded. The microphone is released when you press Stop or leave the page.',
    },
    {
      question: 'No note is detected, or the meter keeps jumping around.',
      answer:
        'Use a quiet room and play one string at a time. Other strings ringing, or a note that is too quiet, prevent detection. Low notes such as a bass low string are the least steady, so pluck firmly and let the note sustain.',
    },
    {
      question:
        'It sometimes shows a note an octave higher or lower than expected.',
      answer:
        'Guitar strings often have overtones stronger than the fundamental, which can be picked up by mistake. This tuner favours the fundamental, but the moment right after plucking is unstable, so read the meter a little after the attack.',
    },
    {
      question: 'How do I tune an electric guitar or bass?',
      answer:
        'Point the microphone at the amp or speaker. If you use an audio interface or a line input, select it as the input device in your browser and you can tune from it directly.',
    },
    {
      question: 'What should I set the reference pitch (A4) to?',
      answer:
        'Normally 440 Hz. If you play with a piano or other players and sound out of tune together, match their reference (for example 442 Hz); it can be set between 410 and 480 Hz.',
    },
  ],
};
