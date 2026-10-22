import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '印刷すると名刺のサイズや位置がずれます。',
      answer:
        '印刷ダイアログで倍率を100%（実際のサイズ）にし、「用紙に合わせる」や「拡大縮小」をオフにしてください。A4用紙は縦横どちらも自動で選ばれます（横向き名刺は縦、縦向き名刺は横）。プリンターの余白設定や給紙位置で数mmずれることがあるため、普通紙に試し刷りして名刺用紙に重ねて確かめてください。',
    },
    {
      question: 'ミシン目付きの市販の名刺用紙（A4・10面）に印刷できますか？',
      answer:
        '91×55mmの10面タイプなら、「A4用紙に10面付け」で用紙の中央に隙間なく並べます。メーカーや製品によって面の位置が数mm異なるため、先に普通紙に刷って名刺用紙に重ね、光に透かして確認してください。「裁断用の枠線を印刷する」はオフにすると枠線が出ません。',
    },
    {
      question: 'QRコードには何が入りますか？ スマホで読み取れますか？',
      answer:
        '「連絡先（vCard）」では氏名・会社名・電話・メール・住所・URLがvCard 3.0形式で入り、読み取ると連絡先の登録に進めます。項目が多いほどQRコードは細かくなるため、読み取りにくい場合は「QRコードの大きさ（mm）」を大きくするか、「WebサイトのURLのみ」に切り替えてください。',
    },
    {
      question: '入力した個人情報は保存・送信されますか？',
      answer:
        '入力内容はブラウザの中だけで処理され、サーバーへの送信も保存もしません。ページを閉じるか再読み込みすると消えます。再入力の手間を省く自動保存も、個人情報を扱うため行っていません。',
    },
  ],
  en: [
    {
      question: 'The card size or position is off when I print.',
      answer:
        'Set the scale to 100% (actual size) in the print dialog and turn off "Fit to page" or custom scaling. The page orientation (portrait for landscape cards, landscape for portrait cards) is picked automatically. Margins and paper feed can shift the result by a few millimetres, so print a test on plain paper and hold it against your card stock.',
    },
    {
      question:
        'Can I print on perforated A4 business-card sheets (10 per sheet)?',
      answer:
        'For 91 × 55 mm, 10-up stock, "10 cards on an A4 sheet" centers the cards edge to edge. Card positions differ by a few millimetres between makers, so print on plain paper first and hold it up to the light against the stock. Turn off "Print cut-line borders" if you do not want the outlines.',
    },
    {
      question: 'What goes in the QR code, and will phones scan it?',
      answer:
        'With "Contact (vCard)" it holds your name, company, phones, email, address and URL as a vCard 3.0, and scanning offers to save the contact. More fields make a denser code. If it is hard to scan, increase "QR code size (mm)" or switch to "Website URL only".',
    },
    {
      question: 'Is what I type saved or sent anywhere?',
      answer:
        'No. Everything is processed in your browser, nothing is uploaded or stored, and it disappears when you close or reload the page. Because it is personal data, the tool also does not auto-save your input for next time.',
    },
  ],
};
