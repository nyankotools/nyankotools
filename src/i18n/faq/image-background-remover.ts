import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '白い背景だけを透明にして、白い服などは残せますか？',
      answer:
        '「透過する範囲」を「つながった領域だけ」にすると、プレビューでクリックした位置からつながる背景だけが透明になり、被写体の中にある白い部分は残ります。それでも消えるときは「許容値」を下げてください。',
    },
    {
      question: '切り抜いた縁に白い線（背景色）が残ります。',
      answer:
        '縁には背景と被写体が混ざった色のピクセルが残りやすい性質があります。「縁を削る」を1〜2pxにして混色部分を消し、「縁の色をなじませる」を1〜2pxにして縁の色を内側の色に置き換えると目立たなくなります。',
    },
    {
      question: '写真の人物や物をAIで自動的に切り抜けますか？',
      answer:
        'できません。このツールは指定した背景色との近さで透明にする方式で、AIによる被写体の認識は行いません。単色で均一な背景（白背景の商品写真やイラスト、グリーンバックなど）に向いています。',
    },
    {
      question: 'ステッカーのような輪郭（縁取り）を付けられますか？',
      answer:
        '「輪郭の太さ」を1px以上にして「輪郭の色」を選ぶと、切り抜いた形の外側に縁取りが付きます。輪郭がはみ出して切れないよう、太さの分だけ四辺に余白が加わります。',
    },
    {
      question: '画像はサーバーにアップロードされますか？',
      answer:
        'されません。背景の透過や輪郭の追加はすべてブラウザ内で行われ、画像が外部に送信されることはありません。',
    },
  ],
  en: [
    {
      question:
        'Can I make only a white background transparent and keep white clothes?',
      answer:
        'Set "Area to remove" to "Connected area only". Then only the background connected to the point you clicked in the preview becomes transparent, and white areas inside the subject stay. If they still disappear, lower the "Tolerance".',
    },
    {
      question:
        'A white line (the background color) remains around the cutout.',
      answer:
        'Edge pixels tend to be a blend of background and subject. Set "Shrink edges" to 1-2 px to remove the blended pixels, and "Blend edge colors" to 1-2 px to replace edge colors with colors from inside the subject. The line becomes much less visible.',
    },
    {
      question:
        'Can it cut out people or objects in a photo automatically with AI?',
      answer:
        'No. This tool makes pixels transparent by how close they are to the background color you pick and does no AI subject detection. It works best on solid, even backgrounds such as product photos on white, illustrations, or green screens.',
    },
    {
      question: 'Can I add a sticker-style outline?',
      answer:
        'Set "Outline width" to 1 px or more and choose an "Outline color" to add a border around the cutout shape. Padding of the same width is added on all four sides so the outline is not cut off.',
    },
    {
      question: 'Is my image uploaded to a server?',
      answer:
        'No. Removing the background and adding the outline all happen in your browser, and the image is never sent anywhere.',
    },
  ],
};
