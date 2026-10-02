import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '同じテキストなのに暗号化のたびに結果が変わるのはなぜですか？',
      answer:
        '暗号化のたびにソルトとIVというランダムな値を新しく選ぶためです。仕様どおりの動作で、どの結果も同じパスワードで正しく復号できます。',
    },
    {
      question: '他のツールやOpenSSLで作った暗号文を復号できますか？',
      answer:
        'できません。このツール独自の形式（バージョン・ソルト・IV・暗号文を連結したBase64）のため、このツールで暗号化した文字列のみ復号できます。形式はページ内の注意事項に記載しています。',
    },
    {
      question: '「復号できませんでした」と表示されるのはどんなときですか？',
      answer:
        'パスワードが違う場合のほか、暗号文の一部が欠けたり書き換えられたりした場合です。AES-GCMは改ざん検知を備えているため、1文字でも変わると復号に失敗します。コピー時の欠けや余分な空白が入っていないか確認してください。',
    },
    {
      question: 'RSAなどの公開鍵暗号には対応していますか？',
      answer:
        '現在はパスワードによるAES-256-GCMのみ対応しています。公開鍵暗号やファイルの暗号化には対応していません。',
    },
  ],
  en: [
    {
      question:
        'Why does the same text encrypt to a different result each time?',
      answer:
        'A new random salt and IV are chosen for every encryption. This is expected, and every result decrypts correctly with the same password.',
    },
    {
      question: 'Can I decrypt ciphertext made by other tools or OpenSSL?',
      answer:
        'No. The tool uses its own format (version, salt, IV, and ciphertext concatenated and Base64-encoded), so only strings it produced can be decrypted. The format is described in the notes on the page.',
    },
    {
      question: 'When do I get "Could not decrypt"?',
      answer:
        'When the password is wrong, or when part of the ciphertext is missing or modified. AES-GCM detects tampering, so even a single changed character makes decryption fail. Check that nothing was cut off or added when copying.',
    },
    {
      question: 'Does it support public-key encryption such as RSA?',
      answer:
        'Currently only password-based AES-256-GCM is supported. Public-key encryption and file encryption are not available.',
    },
  ],
};
