import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'サーバー側のコードと一致しないのはなぜですか？',
      answer:
        '多くの場合、端末の時計のずれが原因です。TOTPは現在時刻から計算するため、数十秒ずれるだけで別のコードになります。そのほか、アルゴリズム（SHA-1が標準）・桁数・更新間隔の設定が実装側と合っているかも確認してください。',
    },
    {
      question: 'otpauth://のURIはどこで手に入りますか？',
      answer:
        '2段階認証の設定画面に表示されるQRコードの中身がこのURIです。QRコードリーダーなどで読み取った文字列をそのまま貼り付けると、鍵・桁数・更新間隔が自動で入力されます。',
    },
    {
      question: '認証アプリの代わりに使えますか？',
      answer:
        'このツールは実装のデバッグ・動作確認用です。実際のアカウントの秘密鍵を入力して運用することはおすすめしません。ブラウザのタブを閉じればコードは確認できなくなるため、日常のログインには認証アプリをお使いください。',
    },
    {
      question: '検証で「1つ前」「1つ先」のコードが有効になるのはなぜですか？',
      answer:
        '端末とサーバーの時計の小さなずれを許容するため、多くのサービスは前後1つぶんのコードも有効として扱います。このツールの検証も同じ動作です。',
    },
  ],
  en: [
    {
      question: 'Why does the code not match what my server expects?',
      answer:
        'Clock drift is the usual cause. TOTP is computed from the current time, so being off by a few dozen seconds gives a different code. Also check that the algorithm (SHA-1 is the default), digits, and period match your implementation.',
    },
    {
      question: 'Where do I get an otpauth:// URI?',
      answer:
        'It is the content of the QR code shown on a 2FA setup screen. Scan the QR code with a reader and paste the resulting text here to fill in the secret, digits, and period automatically.',
    },
    {
      question: 'Can I use this instead of an authenticator app?',
      answer:
        'This tool is for debugging and testing an implementation. We do not recommend entering a real account secret to use it day to day, and the codes are gone as soon as you close the tab. Use an authenticator app for everyday logins.',
    },
    {
      question: 'Why are the previous and next codes also accepted?',
      answer:
        'Most services accept the code one step before and after the current one to tolerate small clock differences between device and server. The verifier here behaves the same way.',
    },
  ],
};
