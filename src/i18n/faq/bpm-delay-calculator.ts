import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'BPM120の八分音符ディレイは何msですか？',
      answer:
        '250msです。四分音符（1拍）が60000÷120=500msで、八分音符はその半分です。付点八分なら375ms、八分3連符なら約166.67msになります。',
    },
    {
      question: '付点と3連符のディレイは何が違いますか？',
      answer:
        '付点は元の音符の1.5倍、3連符は2/3倍の長さです。付点八分（1/8D）はゆったり跳ねる反復、八分3連符はシャッフルのような反復になります。',
    },
    {
      question: 'ミリ秒（ms）とヘルツ（Hz）はどう使い分けますか？',
      answer:
        'ディレイタイムはmsで指定するプラグインが多く、LFOやモジュレーションの速さはHzで指定します。Hzは1000÷msで、500msなら2Hzです。',
    },
    {
      question:
        'リバーブのプリディレイやディケイもテンポに合わせるべきですか？',
      answer:
        '必須ではありませんが、ディケイを1拍や1小節の長さに合わせると、次の音の前に残響が消えて濁りにくくなります。プリディレイは1/64〜1/8程度の短さが目安です。表の値は出発点として、最後は耳で調整してください。',
    },
    {
      question: '小数点以下はどこまで入力すればよいですか？',
      answer:
        '表示は小数第2位までです。多くのプラグインは1ms単位か0.1ms単位なので、最も近い値を入れれば実用上ずれは気になりません。',
    },
  ],
  en: [
    {
      question: 'How many ms is an eighth-note delay at 120 BPM?',
      answer:
        '250 ms. A quarter note is 60000 / 120 = 500 ms, and an eighth note is half of that. A dotted eighth is 375 ms and an eighth-note triplet is about 166.67 ms.',
    },
    {
      question: 'What is the difference between dotted and triplet delays?',
      answer:
        'A dotted note is 1.5 times as long as the plain note and a triplet is 2/3 as long. A dotted eighth gives a loose, bouncing repeat while eighth triplets sound like a shuffle.',
    },
    {
      question: 'When should I use ms and when Hz?',
      answer:
        'Most plugins take delay time in ms, while LFO and modulation speed is set in Hz. Hz is 1000 divided by ms, so 500 ms is 2 Hz.',
    },
    {
      question: 'Should reverb pre-delay and decay follow the tempo too?',
      answer:
        'It is not required, but setting the decay to a beat or a bar lets the tail clear before the next note, so the mix stays clearer. Pre-delay is usually short, around 1/64 to 1/8. Use the table as a starting point and finish by ear.',
    },
    {
      question: 'How many decimals do I need to enter?',
      answer:
        'Values are shown to two decimal places. Most plugins work in 1 ms or 0.1 ms steps, so entering the nearest value is accurate enough in practice.',
    },
  ],
};
