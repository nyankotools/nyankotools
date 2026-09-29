import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'このツールでJWTの署名は検証できますか？',
      answer:
        'できません。ヘッダーとペイロードをBase64URLデコードして表示するだけで、署名の検証は行いません。トークンが正規の発行元のものかどうかの確認には使えません。',
    },
    {
      question: '本番環境のトークンを貼り付けても安全ですか？',
      answer:
        '処理はすべてブラウザ内で完結し、トークンが送信されることはありません。ただしペイロードには機密情報が含まれることがあるため、本番の実トークンは扱いに注意し、共有画面などに表示しないようにしてください。',
    },
    {
      question: 'exp や iat の日時はどのタイムゾーンで表示されますか？',
      answer:
        '日時クレームはUNIX秒として解釈し、お使いの端末のローカルタイムゾーンで表示します。サーバー側のUTC時刻と見比べる際は時差に注意してください。',
    },
  ],
  en: [
    {
      question: 'Can this tool verify a JWT signature?',
      answer:
        'No. It only Base64URL-decodes the header and payload for display. It cannot tell you whether the token was issued by a legitimate party.',
    },
    {
      question: 'Is it safe to paste a production token?',
      answer:
        'Everything runs in your browser and the token is never sent anywhere. Payloads can still contain sensitive data, so be careful with real tokens and avoid showing them on shared screens.',
    },
    {
      question: 'Which time zone are exp and iat shown in?',
      answer:
        "Time claims are read as UNIX seconds and shown in your device's local time zone. Keep the offset in mind when comparing with UTC on the server.",
    },
  ],
};
