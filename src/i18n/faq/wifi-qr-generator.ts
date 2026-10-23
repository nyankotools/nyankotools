import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'Wi-Fi用QRコードはどのスマートフォンで読み取れますか？',
      answer:
        'iPhone（iOS 11以降）の標準カメラと、Android 10以降の標準カメラやGoogleレンズなどで読み取って接続できます。古い端末や一部のアプリでは非対応のことがあるため、実際に試してから配布してください。',
    },
    {
      question: '暗号化方式が分からないときはどれを選べばよいですか？',
      answer:
        '近年のルーターはほとんどWPA2またはWPA3なので、「WPA / WPA2 / WPA3」を選んでください。パスワード不要の公衆Wi-Fiなどは「パスワードなし」を選びます。WEPは古い方式で、ルーターがWEPのときだけ選びます。',
    },
    {
      question:
        'パスワードに「;」や「:」などの記号が含まれていても大丈夫ですか？',
      answer:
        'はい。QRコードの形式で特別な意味を持つバックスラッシュ・セミコロン・カンマ・コロン・ダブルクォートは、自動でバックスラッシュを付けてエスケープします。パスワードはそのまま入力してください。',
    },
    {
      question: '生成したQRコードを人に見られても安全ですか？',
      answer:
        'QRコードにはパスワードがそのまま入っているため、読み取れる人は誰でも接続できます。ゲスト用のネットワークを分ける、掲示場所を限定するなど、共有範囲に注意してください。',
    },
  ],
  en: [
    {
      question: 'Which phones can scan a Wi-Fi QR code?',
      answer:
        'The built-in camera on iPhones (iOS 11 and later) and on Android 10 and later, as well as Google Lens, can scan it and join the network. Older devices or some apps may not support it, so test before you share it.',
    },
    {
      question: "I don't know my security type. Which should I pick?",
      answer:
        'Most modern routers use WPA2 or WPA3, so choose "WPA / WPA2 / WPA3". Pick "None (open network)" for networks without a password. Choose WEP only if your router is set to the old WEP mode.',
    },
    {
      question: 'Can my password contain characters like ; or :?',
      answer:
        'Yes. Backslash, semicolon, comma, colon and double quote have special meaning in the QR format, so the tool escapes them with a backslash automatically. Just type your password as it is.',
    },
    {
      question: 'Is it safe to let others see the generated QR code?',
      answer:
        'The password is stored in the code as plain text, so anyone who scans it can join your network. Consider a separate guest network and limit where the code is displayed.',
    },
  ],
};
