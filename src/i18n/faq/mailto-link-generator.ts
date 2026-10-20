import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'mailtoリンクで本文に改行を入れるにはどうしますか？',
      answer:
        '改行を%0D%0A（CRLF）に置き換えます。%0Aだけでも動くメーラーはありますが、RFC 6068は%0D%0Aを定めています。このツールは本文の改行を自動で%0D%0Aに変換します。',
    },
    {
      question: 'スペースは+ではなく%20になるのはなぜですか？',
      answer:
        'mailtoの件名や本文では、+はスペースとして扱われず、そのまま「+」と表示されるメーラーがあります。そのためスペースは常に%20にしています。',
    },
    {
      question: 'CCやBCCを複数指定するには？',
      answer:
        'アドレスをカンマで区切ります。このツールでは、カンマ・セミコロン・改行のどれで区切って入力してもかまいません。BCCは宛先に表示されませんが、HTMLに書いたリンクのソースからは誰でも読めます。',
    },
    {
      question: 'SMSリンクの本文がiPhoneで入らないのはなぜですか？',
      answer:
        '標準は「sms:番号?body=本文」ですが、古いiOSでは「sms:番号&body=本文」でないと本文が反映されません。「本文の区切り方」でiOS向けを選んで試してください。端末やOSのバージョンによる差があります。',
    },
    {
      question: '電話番号のハイフンや括弧は消す必要がありますか？',
      answer:
        'tel:ではハイフン、ピリオド、括弧は見やすさのための区切りとして使えます。空白は除かれます。国をまたいで使うなら、+81のような国際形式がおすすめです。',
    },
  ],
  en: [
    {
      question: 'How do I add line breaks to a mailto body?',
      answer:
        'Replace each line break with %0D%0A (CRLF). Some mail apps accept a bare %0A, but RFC 6068 specifies %0D%0A. This tool converts line breaks in the body for you.',
    },
    {
      question: 'Why are spaces written as %20 instead of +?',
      answer:
        'In mailto subjects and bodies, some mail apps show a literal "+" instead of a space. Using %20 always works, so that is what this tool writes.',
    },
    {
      question: 'How do I add several CC or BCC recipients?',
      answer:
        'Separate the addresses with commas. Here you can enter them separated by commas, semicolons or line breaks. BCC addresses stay hidden in the sent mail, but anyone can read them in the page source of your link.',
    },
    {
      question: 'Why does the SMS body not appear on an iPhone?',
      answer:
        'The standard form is sms:number?body=text, but older iOS versions only read sms:number&body=text. Pick the iOS style under "Body separator" and test it. Results depend on the device and OS version.',
    },
    {
      question:
        'Do I need to remove hyphens and parentheses from phone numbers?',
      answer:
        'In tel: links, hyphens, dots and parentheses are allowed as visual separators; spaces are removed. For visitors from different countries, use the international format such as +81.',
    },
  ],
};
