import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'メールの生ヘッダーはどこから取得できますか？',
      answer:
        'Gmail なら「⋮」メニューの「メッセージのソースを表示」、Outlook ならメッセージのプロパティ（インターネットヘッダー）、Apple メールなら「表示 > メッセージ > すべてのヘッダー」などで確認できます。表示された内容のうち、最初の空行までがヘッダーです。',
    },
    {
      question: 'SPF が pass でも DMARC が fail になるのはなぜですか？',
      answer:
        'DMARC は SPF や DKIM が通るだけでなく、その認証ドメインが From のドメインと一致（アライメント）している必要があるためです。SPF は Return-Path のドメインを見るので、配信代行サービスなどで Return-Path が別ドメインだと、SPF が pass でも DMARC では不一致になります。',
    },
    {
      question: '遅延時間が負の値になるのはなぜですか？',
      answer:
        '各サーバーの時計がずれている場合や、Received が偽装されている場合に、後のホップの時刻が前より過去になります。少しの差は時計のずれでよく起こります。極端な場合は経路の信頼性を疑ってください。',
    },
    {
      question: 'Received の経路はすべて信頼できますか？',
      answer:
        'いいえ。送信者は自分で Received を書き足せるため、受信側のサーバーが付けた上位の数行だけが信頼できます。送信元に近い下の行は、偽装されていても見分けられません。',
    },
    {
      question: 'このツールは DNS で SPF や DKIM を検証しますか？',
      answer:
        'いいえ。通信は一切行わず、受信サーバーがヘッダーに記録した Authentication-Results や Received-SPF の内容を読み取って表示するだけです。ヘッダー自体が偽装されている可能性もあるため、重要な判断では自分のメールサービスの判定を確認してください。',
    },
  ],
  en: [
    {
      question: 'Where do I get the raw headers of an email?',
      answer:
        'In Gmail, use the three-dot menu and choose "Show original". In Outlook, open the message properties and copy the Internet headers. In Apple Mail, use View > Message > All Headers. The headers are everything up to the first blank line.',
    },
    {
      question: 'Why is DMARC failing when SPF passes?',
      answer:
        'DMARC needs more than a passing SPF or DKIM: the authenticated domain must also align with the From domain. SPF checks the Return-Path domain, so when a bulk sender uses its own Return-Path domain, SPF can pass while DMARC still fails.',
    },
    {
      question: 'Why is a delay negative?',
      answer:
        'A later hop is stamped earlier than the one before it when a server clock is off or a Received line was forged. Small differences are usually clock skew. A large one is a reason to doubt the route.',
    },
    {
      question: 'Can I trust the whole Received chain?',
      answer:
        'No. A sender can add fake Received lines of their own, so only the top few lines, added by your own receiving servers, are reliable. Lines lower down, closer to the sender, cannot be verified.',
    },
    {
      question: 'Does the tool verify SPF or DKIM through DNS?',
      answer:
        'No. It makes no network requests and just reads what the receiving server wrote in Authentication-Results or Received-SPF. Since headers can be forged too, check your mail provider’s own verdict before acting on something important.',
    },
  ],
};
