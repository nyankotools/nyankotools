import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'テキストを含む要素が整形されず1行のままなのはなぜですか？',
      answer:
        '<p>Hello <b>world</b></p> のようにテキストと子要素が混ざった要素では、空白がそのまま文章の一部になります。改行やインデントを入れると内容が変わってしまうため、そのような要素の中身は元の空白を保っています。',
    },
    {
      question: '整形するとXMLの意味が変わることはありますか？',
      answer:
        '要素だけで構成される部分の要素間の空白を作り直すだけで、テキスト・属性・コメント・CDATAは変更しません。ただし xml:space="preserve" のような空白を重視する運用では、結果を目視で確認してください。',
    },
    {
      question: 'エラーの行・列はどう読めばよいですか？',
      answer:
        '入力の先頭を1行目1列目として、最初に問題が見つかった位置を示します。閉じタグの不一致の場合は、対応するはずの開始タグの位置がメッセージに含まれることがあります。位置は検出箇所で、実際のミスはその少し前にある場合もあります。',
    },
    {
      question: 'DTDやXSDによる検証はできますか？',
      answer:
        'いいえ。タグの対応や属性値の引用符といった整形式（well-formed）のチェックのみです。外部のDTDやエンティティを取得することもないため、通信は発生しません。',
    },
  ],
  en: [
    {
      question: 'Why are elements with text left on a single line?',
      answer:
        'In mixed content such as <p>Hello <b>world</b></p>, whitespace is part of the text. Adding line breaks or indentation would change the content, so the formatter keeps those elements exactly as written.',
    },
    {
      question: 'Can formatting change the meaning of my XML?',
      answer:
        'Only the whitespace between elements in element-only sections is rebuilt; text, attributes, comments, and CDATA are untouched. If your data relies on xml:space="preserve", check the result by eye.',
    },
    {
      question: 'How do I read the line and column in an error?',
      answer:
        'The first character of the input is line 1, column 1, and the position is where the first problem was detected. For a mismatched closing tag, the message may also mention where the matching start tag was. The real mistake can sit a little before the reported position.',
    },
    {
      question: 'Does it validate against a DTD or XSD?',
      answer:
        'No. It only checks that the document is well-formed, such as matching tags and quoted attribute values. External DTDs and entities are never fetched, so no network request is made.',
    },
  ],
};
