import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '入力した内容はサーバーに送信されますか？',
      answer:
        'いいえ。対応表はこのページに組み込まれており、検索はすべてブラウザ内で行います。入力は外部へ送信されません。',
    },
    {
      question: 'JavaScriptやJSONのMIMEタイプは何を使えばよいですか？',
      answer:
        'JavaScriptは text/javascript（現在の標準）、JSONは application/json が一般的です。古い資料にある application/javascript や text/json は旧式の書き方で、新しく設定する場合は上記を使うのが無難です。',
    },
    {
      question: '同じ拡張子に複数のMIMEタイプが出てくるのはなぜですか？',
      answer:
        '歴史的な経緯や環境の違いで、同じ形式に複数の書き方が使われているためです。たとえば xml は application/xml と text/xml、ico は image/x-icon と image/vnd.microsoft.icon があります。ts は TypeScript と動画（MPEG-TS）で衝突します。用途に合うものを選んでください。',
    },
    {
      question: '「application/octet-stream」はどんなときに使いますか？',
      answer:
        '種類が分からない、またはブラウザに表示させずダウンロードさせたいバイナリデータに使う汎用のMIMEタイプです。ファイルの種類が分かっているなら、対応するMIMEタイプを指定する方が正しく扱われます。',
    },
    {
      question: '表に載っていないMIMEタイプや拡張子はどうすればよいですか？',
      answer:
        '主要な形式のみを収録しているため、載っていないものがあります。「+json」「+xml」で終わるMIMEタイプは構造化サフィックスとして内容が分かりますが、それ以外はIANAの登録簿（Media Types）で確認してください。',
    },
  ],
  en: [
    {
      question: 'Is what I type sent to a server?',
      answer:
        'No. The lookup table is built into this page and every search runs in your browser. Nothing you enter is sent anywhere.',
    },
    {
      question: 'Which MIME type should I use for JavaScript and JSON?',
      answer:
        'Use text/javascript for JavaScript (the current standard) and application/json for JSON. Older references mention application/javascript or text/json; those are legacy spellings, so prefer the ones above for new configuration.',
    },
    {
      question: 'Why does one extension show several MIME types?',
      answer:
        'Because the same format has been labeled in more than one way over time. For example, xml maps to application/xml and text/xml, and ico to image/x-icon and image/vnd.microsoft.icon. The ts extension even collides between TypeScript and MPEG-TS video. Pick the one that fits your use.',
    },
    {
      question: 'When should I use application/octet-stream?',
      answer:
        'It is the generic type for binary data of unknown kind, or for data you want browsers to download instead of display. If you know the real type, send the matching MIME type so clients handle it correctly.',
    },
    {
      question: 'What if my MIME type or extension is not listed?',
      answer:
        'Only the major formats are included, so some are missing. A type ending in +json or +xml is a structured-syntax type, and its content format is clear from the suffix; for anything else, check the IANA Media Types registry.',
    },
  ],
};
