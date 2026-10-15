import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'RS256やES256のJWTは生成できますか？',
      answer:
        'いいえ。共有の秘密鍵で署名するHS256・HS384・HS512のみ対応しています。公開鍵方式（RS256・ES256など）には対応していません。',
    },
    {
      question: '生成したJWTが他のライブラリで検証に通りません。なぜですか？',
      answer:
        '秘密鍵の取り違えが最も多い原因です。鍵をテキストとして扱うか16進数として扱うか、Base64でエンコードされた鍵をそのまま文字列として渡していないかを確認してください。また、検証側が許可するアルゴリズムと、ここで選んだアルゴリズムが一致している必要があります。',
    },
    {
      question: 'ペイロードに入れた情報は隠せますか？',
      answer:
        'いいえ。JWTのペイロードは署名されるだけで暗号化されないため、トークンを受け取った人は誰でもBase64URLをデコードして中身を読めます。パスワードなどの機密情報は入れないでください。',
    },
    {
      question: 'ヘッダーのalgを書き換えても反映されますか？',
      answer:
        'ヘッダーのalgは、選択したアルゴリズムで常に上書きされます。署名方式とヘッダーの宣言が食い違ったトークンを作らないための仕様です。',
    },
  ],
  en: [
    {
      question: 'Can I generate RS256 or ES256 JWTs?',
      answer:
        'No. Only HS256, HS384 and HS512, which are signed with a shared secret key, are supported. Public-key algorithms such as RS256 and ES256 are not.',
    },
    {
      question:
        'Why does my generated JWT fail verification in another library?',
      answer:
        'A mismatched secret is the most common cause. Check whether the key is treated as text or hex, and whether a Base64-encoded key was passed as a plain string. The verifier must also allow the same algorithm you selected here.',
    },
    {
      question: 'Is the payload hidden?',
      answer:
        'No. A JWT payload is signed but not encrypted, so anyone who gets the token can Base64URL-decode and read it. Do not put passwords or other sensitive data in it.',
    },
    {
      question: 'Can I set "alg" in the header myself?',
      answer:
        'The header "alg" is always overwritten with the algorithm you select. This prevents creating a token whose declared algorithm does not match how it was signed.',
    },
  ],
};
