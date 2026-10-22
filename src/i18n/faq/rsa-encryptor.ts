import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '暗号化できるテキストの長さに上限があるのはなぜですか？',
      answer:
        'RSAは鍵の長さを超えるデータを一度に暗号化できず、OAEPのパディング分も差し引かれるためです。SHA-256のOAEPでは「鍵のビット数÷8−66」バイトが上限で、RSA-2048なら190バイト（日本語で約63文字）です。長いデータはAESで暗号化し、その鍵だけをRSAで暗号化してください。',
    },
    {
      question:
        '「公開鍵が必要です」「秘密鍵が必要です」と出るのはなぜですか？',
      answer:
        '暗号化には公開鍵（BEGIN PUBLIC KEY）、復号には秘密鍵（BEGIN PRIVATE KEY）を使います。モードと鍵の種類が逆になっていると、このエラーになります。',
    },
    {
      question: 'どの形式の鍵が使えますか？',
      answer:
        'RSAの公開鍵（SPKI、BEGIN PUBLIC KEY）と秘密鍵（PKCS#8、BEGIN PRIVATE KEY）のPEMです。「BEGIN RSA PRIVATE KEY」（PKCS#1）やEC・Ed25519の鍵は使えません。「鍵ペア生成」ツールで作ったRSA鍵はそのまま使えます。',
    },
    {
      question: 'OpenSSLなど他のツールで作った暗号文を復号できますか？',
      answer:
        'OAEPのハッシュがSHA-256（MGF1もSHA-256）で、Base64にした暗号文であれば復号できます。SHA-1やPKCS#1 v1.5パディングで作った暗号文は復号できません。',
    },
    {
      question: '同じテキストなのに暗号化のたびに結果が変わるのはなぜですか？',
      answer:
        'OAEPが暗号化のたびにランダムな値を加えるためで、仕様どおりの動作です。どの結果も同じ秘密鍵で復号できます。',
    },
  ],
  en: [
    {
      question: 'Why is there a limit on how much text I can encrypt?',
      answer:
        'RSA cannot encrypt more data than fits in the key, and OAEP padding takes part of that space. With SHA-256 OAEP the limit is key bits ÷ 8 − 66 bytes, which is 190 bytes for RSA-2048. For longer data, encrypt it with AES and encrypt only the AES key with RSA.',
    },
    {
      question: 'Why do I get "needs a public key" or "needs a private key"?',
      answer:
        'Encryption uses a public key (BEGIN PUBLIC KEY) and decryption uses a private key (BEGIN PRIVATE KEY). The error appears when the mode and the type of key are swapped.',
    },
    {
      question: 'Which key formats are supported?',
      answer:
        'RSA public keys (SPKI, BEGIN PUBLIC KEY) and private keys (PKCS#8, BEGIN PRIVATE KEY) in PEM. "BEGIN RSA PRIVATE KEY" (PKCS#1) and EC or Ed25519 keys are not supported. RSA keys made with the Key Pair Generator work as they are.',
    },
    {
      question: 'Can I decrypt ciphertext made by OpenSSL or other tools?',
      answer:
        'Yes, if it was made with OAEP using SHA-256 (and MGF1 with SHA-256) and is Base64-encoded. Ciphertext made with SHA-1 or PKCS#1 v1.5 padding cannot be decrypted.',
    },
    {
      question:
        'Why does the same text encrypt to a different result each time?',
      answer:
        'OAEP mixes in random data on every encryption, which is expected. Every result decrypts with the same private key.',
    },
  ],
};
