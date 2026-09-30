import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'URLエンコードはなぜ必要ですか？',
      answer:
        'URLには使える文字が決まっており、日本語やスペース、記号はそのままでは扱えません。パーセントエンコード（%XX形式）に変換することで、クエリパラメータなどに安全に含められます。',
    },
    {
      question: 'スペースは「+」と「%20」のどちらになりますか？',
      answer:
        'このツールはパーセントエンコードを行い、スペースは「%20」になります。フォーム送信で使われる「+」形式とは異なるため、送信先の仕様に合わせて確認してください。',
    },
    {
      question: 'URL全体をエンコードしても大丈夫ですか？',
      answer:
        'URL全体をエンコードすると「:」や「/」なども変換され、URLとして機能しなくなることがあります。通常はクエリパラメータの値など、必要な部分だけをエンコードしてください。',
    },
  ],
  en: [
    {
      question: 'Why is URL encoding necessary?',
      answer:
        'URLs allow only certain characters, so non-ASCII text, spaces and some symbols must be percent-encoded (%XX) to be included safely in query parameters.',
    },
    {
      question: 'Is a space encoded as "+" or "%20"?',
      answer:
        'This tool uses percent-encoding, so a space becomes "%20". Form submissions may use "+", so check what the destination expects.',
    },
    {
      question: 'Can I encode a whole URL?',
      answer:
        'Encoding an entire URL also converts characters like ":" and "/" and can break it. Normally encode only the parts you need, such as query parameter values.',
    },
  ],
};
