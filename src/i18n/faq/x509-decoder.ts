import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'サーバーの証明書のPEMはどうやって取得できますか？',
      answer:
        'ブラウザの鍵アイコンから証明書を表示してエクスポートする方法のほか、コマンドでは「openssl s_client -connect example.com:443 -showcerts」で取得できます。出力の「-----BEGIN CERTIFICATE-----」から「-----END CERTIFICATE-----」までをそのまま貼り付けてください。',
    },
    {
      question: '証明書が信頼できるかどうかも分かりますか？',
      answer:
        'いいえ。このツールは証明書の中身を読み取って表示するだけで、署名やチェーンの検証、失効確認は行いません。有効期限の判定も端末の現在時刻との単純な比較です。',
    },
    {
      question:
        '「期限切れ」と表示されるのに、サイトは正常に開けます。なぜですか？',
      answer:
        '貼り付けた証明書がサイトで実際に使われているものとは別の（古い）証明書である可能性があります。更新後の証明書を取得し直して確認してください。また、端末の時刻がずれている場合も判定が変わります。',
    },
    {
      question: 'DER形式やPKCS#12（.pfx）の証明書は読み取れますか？',
      answer:
        'いいえ。PEM形式（またはヘッダーなしのBase64）のみ対応しています。DER形式のファイルは、「openssl x509 -inform der -in cert.der -out cert.pem」でPEMに変換してから貼り付けてください。',
    },
  ],
  en: [
    {
      question: 'How do I get the PEM of a server certificate?',
      answer:
        'You can export it from the certificate viewer behind the padlock icon in your browser, or run "openssl s_client -connect example.com:443 -showcerts" and copy everything from "-----BEGIN CERTIFICATE-----" to "-----END CERTIFICATE-----" as is.',
    },
    {
      question: 'Does it tell me whether a certificate is trustworthy?',
      answer:
        "No. This tool only reads and displays what is inside the certificate. It does not verify the signature or chain, or check revocation. The validity status is a simple comparison with your device's current time.",
    },
    {
      question: 'It says "Expired" but the site loads fine. Why?',
      answer:
        'The certificate you pasted may be an older one rather than the one the site currently serves. Fetch the renewed certificate and check again. A wrong clock on your device can also change the result.',
    },
    {
      question: 'Can it read DER files or PKCS#12 (.pfx) bundles?',
      answer:
        'No. Only PEM (or Base64 without the header lines) is supported. Convert a DER file first with "openssl x509 -inform der -in cert.der -out cert.pem", then paste the result.',
    },
  ],
};
