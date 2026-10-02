import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ドット抜けはどの色で確認すればよいですか？',
      answer:
        '白では黒い点（黒点）、黒では明るく光る点（輝点）を見つけやすくなります。さらに赤・緑・青を順に表示すると、特定の色だけが点灯しない・点灯し続けるサブピクセルの不良も確認できます。',
    },
    {
      question: '画面に点が見えますが、ドット抜けかどうか判断できません。',
      answer:
        'ホコリや汚れ、画面保護フィルムの気泡がドット抜けに見えることがあります。柔らかい布で拭いて消えるか、別の色に切り替えても同じ位置に残るかを確認してください。残る場合は画素の不良の可能性があります。',
    },
    {
      question: 'ドット抜けがあったら交換や返品してもらえますか？',
      answer:
        '製品によって異なります。多くのメーカーは、ドット抜けの数や画面上の位置による基準を設けており、基準内であれば交換の対象外になることがあります。購入後は早めにチェックし、メーカー・販売店の規定を確認してください。',
    },
    {
      question: 'スマホやタブレットでも使えますか？',
      answer:
        'はい。ブラウザで開いて「全画面でチェックを開始」を押し、画面をタップして色を切り替えます。全画面表示に対応していないブラウザでは、ブラウザのウィンドウ全体を覆う表示になります。',
    },
  ],
  en: [
    {
      question: 'Which colors should I use to find dead pixels?',
      answer:
        'White makes dark dots (dead pixels) easy to spot, and black makes bright dots (stuck pixels) easy to spot. Red, green and blue in turn also reveal subpixels that are stuck on or off for just one color.',
    },
    {
      question: 'I see a dot, but is it really a dead pixel?',
      answer:
        'Dust, smudges and air bubbles under a screen protector can look like dead pixels. Wipe the screen with a soft cloth, and check whether the dot stays in the same place when you switch colors. If it does, it is probably a faulty pixel.',
    },
    {
      question: 'Can I get a replacement if my screen has a dead pixel?',
      answer:
        'It depends on the product. Many manufacturers set limits on how many dead pixels, and where on the screen, are acceptable, so a few may not qualify. Test soon after purchase and read the manufacturer or store policy.',
    },
    {
      question: 'Does this work on phones and tablets?',
      answer:
        'Yes. Open the page, press "Start fullscreen test", and tap the screen to change colors. In browsers that do not support fullscreen, the test covers the whole browser window instead.',
    },
  ],
};
