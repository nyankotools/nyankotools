import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'モニターのガンマは2.2が正解ですか？',
      answer:
        'Windowsやwebの標準であるsRGBは、ガンマ約2.2に近い特性を持つため、多くの用途で2.2前後が目安になります。映像制作などでは2.4を使うこともあります。このツールの推定値が2.0〜2.4の範囲に収まっていれば、極端にずれてはいないと考えられます。',
    },
    {
      question: 'グレーランプに縞が見えます。故障ですか？',
      answer:
        '8bit表示では黒から白まで256段階しかないため、画面の幅によってはうっすら段差が見えることがあり、必ずしも故障ではありません。段階パターンで隣り合う段が見分けられない、または極端に太い縞が出る場合は、モニターの映像モードやGPUの出力設定（色深度・RGBレンジ）を見直してください。',
    },
    {
      question: '黒つぶれの確認では、いくつ見えれば正常ですか？',
      answer:
        '環境と設定によって異なります。暗い部屋で明るさ・コントラストが適切なら、1〜2段目の四角から見分けられるのが理想です。最初の数個が見えない場合は、モニターの明るさやブラックレベル、映像モードを調整して、すべて見えるか試してください。',
    },
    {
      question: 'ガンマチェッカーは、なぜ100%ズームで見る必要がありますか？',
      answer:
        'ブラウザを拡大・縮小すると、1画素単位の縞がぼやけて、本来の平均輝度と異なって見えるためです。ブラウザのズームを100%にして確認してください。OSの表示スケールが100%以外の場合も縞が再サンプリングされ、比較の精度が下がることがあります。',
    },
    {
      question: 'スマホやタブレットでも確認できますか？',
      answer:
        'はい。「全画面でチェックを開始」を押して、画面をタップしてパターンを切り替えます。ただし、スマホは画素密度が高く、縞の比較がしにくいことがあります。階調やバンディングの確認には十分使えます。',
    },
  ],
  en: [
    {
      question: 'Is a gamma of 2.2 the right value?',
      answer:
        'sRGB, the standard for Windows and the web, behaves close to a gamma of 2.2, so around 2.2 is the usual target. Video work sometimes uses 2.4. If the estimate here falls between 2.0 and 2.4, your screen is not far off.',
    },
    {
      question: 'I can see bands in the gray ramp. Is my monitor faulty?',
      answer:
        '8-bit output has only 256 levels from black to white, so faint steps can show on a wide screen and are not necessarily a fault. If neighboring steps in the Gray steps pattern look identical, or the bands are very coarse, check the monitor’s picture mode and the GPU output settings (color depth and RGB range).',
    },
    {
      question: 'How many squares should I see in the black clipping test?',
      answer:
        'It depends on the room and the settings. In a dim room with sensible brightness and contrast, you should ideally be able to tell the squares apart from the first or second one. If the first few are invisible, try adjusting brightness, black level or picture mode until they all show.',
    },
    {
      question: 'Why does the gamma checker need 100% zoom?',
      answer:
        'Zooming the browser blurs the one-pixel stripes, so they no longer average to the intended brightness. Set the browser zoom to 100%. If your OS display scaling is not 100%, the stripes may also be resampled and the comparison becomes less reliable.',
    },
    {
      question: 'Does this work on phones and tablets?',
      answer:
        'Yes. Press "Start fullscreen test" and tap the screen to change patterns. Phone screens have such a high pixel density that comparing the stripes can be hard, but the gradient and step patterns work fine for spotting banding.',
    },
  ],
};
