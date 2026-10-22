import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'JWTのRS256署名はこのツールで作れますか？',
      answer:
        'いいえ。JWTのRS256はRSASSA-PKCS1-v1_5方式で、このツールのRSA-PSSとは別の方式です。両者の署名は互換性がなく、相互に検証できません。',
    },
    {
      question: 'OpenSSLで作った署名を検証できますか？',
      answer:
        'ECDSAはOpenSSLが出すDER形式ではなく、Web Cryptoのr||s連結形式（IEEE P1363）を使います。そのため、DER形式の署名はそのままでは検証できません。RSA-PSSはソルト長をハッシュ長に合わせた署名なら、Base64にすれば検証できます。',
    },
    {
      question: '「選んだアルゴリズムの鍵として読み込めません」と出ます。',
      answer:
        'PEMだけでは鍵の種類が分からないため、選んだアルゴリズムで読み込みます。RSA鍵にECDSAを選んだ場合や、P-256の鍵にP-384を選んだ場合などに起きます。鍵の種類と曲線を確認してください。',
    },
    {
      question: 'キーペア生成で作ったRSA鍵はそのまま使えますか？',
      answer:
        'はい。PKCS#8／SPKI形式の鍵は用途に依らず共通なので、このツールがRSA-PSSとして読み込みます。ECDSAの鍵もそのまま使えます。',
    },
    {
      question: 'RSA-PSSは同じメッセージでも署名が毎回変わるのはなぜですか？',
      answer:
        'RSA-PSSはランダムなソルトを加えて署名するためで、正常な動作です。毎回違う署名でも、検証はどれも成功します。',
    },
  ],
  en: [
    {
      question: 'Can I create a JWT RS256 signature with this tool?',
      answer:
        'No. JWT RS256 uses RSASSA-PKCS1-v1_5, which is a different scheme from the RSA-PSS offered here. The two signatures are not interchangeable and cannot verify each other.',
    },
    {
      question: 'Can I verify a signature made with OpenSSL?',
      answer:
        'For ECDSA, this tool uses the Web Crypto r||s format (IEEE P1363), not the DER format OpenSSL produces, so a DER signature cannot be verified as-is. An RSA-PSS signature with the salt length equal to the hash size can be verified once Base64-encoded.',
    },
    {
      question: 'I get "key could not be loaded for the selected algorithm".',
      answer:
        'A PEM does not state its key type, so it is loaded with the algorithm you pick. This happens when you choose ECDSA for an RSA key, or P-384 for a P-256 key. Check the key type and curve.',
    },
    {
      question: 'Can I use an RSA key from the Key Pair Generator?',
      answer:
        'Yes. PKCS#8 and SPKI keys are the same regardless of intended use, so this tool simply loads the RSA key as RSA-PSS. ECDSA keys work as they are.',
    },
    {
      question:
        'Why does RSA-PSS give a different signature for the same message?',
      answer:
        'RSA-PSS adds a random salt when signing, so this is normal. Every one of those different signatures still verifies successfully.',
    },
  ],
};
