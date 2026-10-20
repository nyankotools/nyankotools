import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '表示されるdBは正確ですか？',
      answer:
        '目安です。マイクの感度や端末の音声処理で値が変わるため、校正済みの騒音計の代わりにはなりません。基準の騒音計と同じ音を測り、「校正オフセット」で合わせると近づけられます。',
    },
    {
      question: '校正オフセットはどう決めればよいですか？',
      answer:
        '騒音計（または信頼できる騒音計アプリ）と同じ場所で同じ音を測り、その値を「基準の騒音計の値」に入れて「現在の音に合わせる」を押してください。オフセットは端末ごとに異なり、このページを開き直すと初期値に戻ります。',
    },
    {
      question: '計測中の音声は録音されたり送信されたりしますか？',
      answer:
        'いいえ。マイクの音は音量の計算にだけ使われ、録音も保存もサーバーへの送信もしません。停止するかページを閉じるとマイクも解放されます。',
    },
    {
      question: '静かな部屋でも数値がゼロになりません。',
      answer:
        'マイク自体の電気的なノイズや、端末の音声処理による底上げがあるためです。目安として 30 dB より低い値は信頼しづらく、静けさの比較に使う程度にしてください。',
    },
    {
      question: '平均は単純な平均と違いますか？',
      answer:
        '違います。騒音の評価で使われる等価騒音レベル（Leq）の考え方で、音のエネルギーを平均してからdBに戻しています。大きな音が混ざると単純平均より高めに出ます。',
    },
  ],
  en: [
    {
      question: 'How accurate is the dB reading?',
      answer:
        'It is an estimate. Microphone sensitivity and your device’s audio processing change the number, so it cannot replace a calibrated sound level meter. Measure the same sound with a reference meter and tune the calibration offset to get closer.',
    },
    {
      question: 'How do I set the calibration offset?',
      answer:
        'Measure the same sound in the same place with a reference meter (or a trustworthy meter app), type its value into "Reference meter reading" and press "Match current sound". The offset is device-specific, and it returns to the default when you reload the page.',
    },
    {
      question: 'Is the audio recorded or sent anywhere while measuring?',
      answer:
        'No. The microphone signal is used only to calculate the level. Nothing is recorded, saved or uploaded, and the microphone is released when you stop or close the page.',
    },
    {
      question: 'The reading never reaches zero, even in a silent room.',
      answer:
        'The microphone’s own electrical noise and your device’s audio processing set a floor. Treat values below about 30 dB as unreliable and use them only to compare how quiet places are.',
    },
    {
      question: 'Is "Average" a plain average?',
      answer:
        'No. It uses the equivalent continuous sound level (Leq) approach used in noise assessment: the sound energy is averaged and then converted back to dB. Loud moments push it above a simple arithmetic mean.',
    },
  ],
};
