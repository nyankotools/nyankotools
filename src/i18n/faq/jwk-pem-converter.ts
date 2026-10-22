import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question:
        '「RSA PRIVATE KEY」や「EC PRIVATE KEY」のPEMは変換できますか？',
      answer:
        'できません。このツールはPKCS#8（「BEGIN PRIVATE KEY」）とSPKI（「BEGIN PUBLIC KEY」）のみ扱います。PKCS#1やSEC1形式は、先に openssl pkcs8 -topk8 -nocrypt などでPKCS#8に変換してください。',
    },
    {
      question: 'JWKからPEMにすると alg や kid が消えるのはなぜですか？',
      answer:
        'PEMは鍵の数値そのものだけを格納する形式で、alg（用途のアルゴリズム）・use・kidといったJWKのメタ情報を持てないためです。PEMからJWKに戻す際も、これらは自動では付きません。',
    },
    {
      question:
        'どのアルゴリズムの鍵か指定しなくても変換できるのはなぜですか？',
      answer:
        'JWKは kty と crv から種類が分かります。PEMは内部のOIDから種類が決まるため、RSA・ECのP-256/P-384/P-521・Ed25519を順に読み込んで、成功したものをJWKにしています。',
    },
    {
      question: '貼り付けた秘密鍵は送信・保存されますか？',
      answer:
        'いいえ。変換はブラウザ内のWeb Crypto APIだけで行い、サーバーへの送信も、入力内容のブラウザへの保存もしません。ただし画面には平文で表示されるため、画面共有中などはご注意ください。',
    },
  ],
  en: [
    {
      question: 'Can it convert "RSA PRIVATE KEY" or "EC PRIVATE KEY" PEM?',
      answer:
        'No. Only PKCS#8 ("BEGIN PRIVATE KEY") and SPKI ("BEGIN PUBLIC KEY") are handled. For PKCS#1 or SEC1 keys, first convert to PKCS#8 with something like openssl pkcs8 -topk8 -nocrypt.',
    },
    {
      question: 'Why do alg and kid disappear when I convert JWK to PEM?',
      answer:
        'PEM stores only the key material, so it cannot carry JWK metadata such as alg, use, or kid. Converting back from PEM to JWK does not restore them either.',
    },
    {
      question: 'How can it convert without me choosing the algorithm?',
      answer:
        'A JWK states its type through kty and crv. For PEM, the type is encoded inside the data, so the tool tries RSA, EC (P-256/P-384/P-521), and Ed25519 in turn and uses the one that loads.',
    },
    {
      question: 'Is a pasted private key sent anywhere or stored?',
      answer:
        'No. Conversion uses only the Web Crypto API in your browser; nothing is sent to a server and the input is not saved in the browser. The key is shown in plain text on screen, though, so be careful while screen sharing.',
    },
  ],
};
