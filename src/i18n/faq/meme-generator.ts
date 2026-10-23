import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '長い文章を入れると文字が小さくなりますか？',
      answer:
        '「幅に合わせて自動で縮小・折り返し」がオンのとき、文字は画像の幅で折り返され、上下それぞれ画像の高さの約3割に収まる最大の大きさに縮みます。「文字サイズ（最大・px）」が上限です。オフにすると、指定した大きさのまま折り返すだけで、はみ出すことがあります。',
    },
    {
      question: '日本語のキャプションでも定番のミームらしく見えますか？',
      answer:
        '使えます。日本語は端末のゴシック体の太字で描かれ、白文字＋黒の縁取りという定番の見た目になります。英字はImpactなどの太いフォントが使われます。書体は端末にあるものから選ばれるため、環境によって少し違って見えます。',
    },
    {
      question: '上の文字だけ、または下の文字だけ入れることはできますか？',
      answer:
        'できます。使わない側の欄を空にすれば、何も描かれません。最初に画像を読み込んだときは、見本の文字が両方に入っているので、不要なほうを消してください。',
    },
    {
      question: '文字がくっきり見えないときはどうしますか？',
      answer:
        '「縁取りの太さ（px）」を増やすか、「縁取りの色」を文字色と反対の明るさ（白文字なら黒）にしてください。大きな画像では、縁取りの太さが相対的に細く見えるため、数値を上げるのが効果的です。',
    },
    {
      question: '画像や入力した文字はサーバーに送られますか？',
      answer:
        'いいえ。読み込みから文字の描画・保存まで、すべてお使いのブラウザの中で処理されます。画像や入力した文字がサーバーにアップロードされることはありません。',
    },
  ],
  en: [
    {
      question: 'Does long text make the letters smaller?',
      answer:
        'With "Auto-shrink and wrap to fit" on, text wraps to the image width and shrinks to the largest size that fits about 30% of the image height for each caption. "Max font size (px)" is the upper limit. With it off, the text only wraps at the size you set and may overflow.',
    },
    {
      question: 'Does it look like a classic meme with Japanese captions?',
      answer:
        'Yes. Japanese is drawn in a bold gothic face from your device, with white text and a black outline. Latin letters use a heavy font such as Impact. Fonts come from your device, so the look differs a little between environments.',
    },
    {
      question: 'Can I add only top text or only bottom text?',
      answer:
        'Yes. Leave the field you do not need empty and nothing is drawn there. When you first load an image, both fields contain sample text, so clear the one you do not want.',
    },
    {
      question: 'How do I make the text easier to read?',
      answer:
        'Increase "Outline width (px)", or set "Outline color" to the opposite brightness of the text (black for white text). On large images the outline looks thinner in proportion, so a higher value helps.',
    },
    {
      question: 'Is my image or text sent to a server?',
      answer:
        'No. Loading, drawing the text, and saving all happen inside your browser. Neither your image nor the text you type is uploaded.',
    },
  ],
};
