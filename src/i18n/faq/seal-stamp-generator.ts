import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ここで作った電子印鑑を実印や銀行印の代わりに使えますか？',
      answer:
        '使えません。実印は市区町村への印鑑登録、銀行印は銀行への届出がある印影そのものに意味があります。このツールの画像は見た目を再現しただけなので、契約書の実印欄や銀行の手続きなど、登録・届出が必要な場面では使えません。',
    },
    {
      question: '請求書や社内書類に電子印鑑として貼ってもよいですか？',
      answer:
        '社内の承認欄や、先方が認めている書類の認印代わりであれば使える場合があります。ただし、本人が押した証明にはならないため、取引先や提出先が電子印鑑を認めているか、事前に確認してください。',
    },
    {
      question: '背景が透明なPNGは、どう使えばよいですか？',
      answer:
        '「透過PNGをダウンロード」で保存した画像は、印影以外の部分が透明です。WordやExcel、PDF編集ソフトなどで画像として挿入し、書類の上に重ねると、紙に押したような見た目になります。印影の色は「印影の色」で変えられます。',
    },
    {
      question:
        '名前の文字が小さくなったり、見た目が端末ごとに違ったりします。',
      answer:
        '文字が多いと、枠に収まるよう自動で小さくなります。丸印・角印は4文字程度までが目安です。書体は端末に入っている明朝体・ゴシック体から選ばれ、篆書体などの印鑑用フォントは使えないため、端末によって見た目が少し異なります。',
    },
    {
      question: '入力した名前はサーバーに送られますか？',
      answer:
        'いいえ。印影の描画から保存まで、すべてお使いのブラウザの中で処理されます。入力した名前や日付、作成した画像がアップロードされることはありません。',
    },
  ],
  en: [
    {
      question:
        'Can I use a seal made here in place of a registered or bank seal?',
      answer:
        'No. A registered personal seal (jitsuin) and a bank seal (ginko-in) matter because that exact impression is registered with the authority or bank. The image made here only imitates the look, so it cannot be used where registration or filing is required, such as contracts or bank procedures.',
    },
    {
      question: 'Can I paste it onto invoices or internal documents?',
      answer:
        'It may be fine for an internal approval box or for documents whose recipient accepts it as an everyday sign-off. It does not prove who applied it, though, so check beforehand that your client or recipient accepts electronic seals.',
    },
    {
      question: 'How do I use the transparent PNG?',
      answer:
        'Everything except the stamp itself is transparent in the file saved with "Download transparent PNG". Insert it as an image in Word, Excel, or a PDF editor and lay it over the document so it looks stamped on paper. You can change the color with "Ink color".',
    },
    {
      question: 'Why is my text small, or different on another device?',
      answer:
        'Long text is shrunk automatically to fit the frame; about four characters is a good limit for round and square seals. Fonts come from the serif and sans-serif fonts installed on your device, and seal scripts such as tensho are not available, so the look varies a little between devices.',
    },
    {
      question: 'Is the name I type sent to a server?',
      answer:
        'No. Drawing and saving the stamp all happen inside your browser. The name, the date, and the image you create are never uploaded.',
    },
  ],
};
