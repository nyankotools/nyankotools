import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'このブラックジャックで本物のお金や景品はもらえますか？',
      answer:
        'いいえ。使うのは換金できない仮想チップだけで、現実のお金や景品とは一切関係ありません。娯楽とルール練習のためのゲームで、実際の賭け事を勧めるものではありません。',
    },
    {
      question: 'ブラックジャックの配当とディーラーのルールは？',
      answer:
        '最初の2枚が21のブラックジャックは3:2（ベットの1.5倍の儲け）、通常の勝ちは1:1、引き分けはベットが戻ります。ディーラーはソフト17（Aを11として17）を含め、17以上になるまで引き、17でスタンドします。',
    },
    {
      question: 'ダブルダウンはいつ使えますか？',
      answer:
        '最初の2枚が配られた直後だけ、手持ちのチップがベット額以上あるときに使えます。ベットを2倍にして1枚だけ引き、そのままスタンドします。ヒットしたあとは使えません。',
    },
    {
      question: 'スプリットやインシュランスはできますか？',
      answer:
        'できません。このツールはヒット・スタンド・ダブルダウンだけのシンプルなルールです。ディーラーの伏せカードを含めてブラックジャックになっていれば、配札の時点で勝負が決まります。',
    },
    {
      question: 'カードのシャッフルは公平ですか？チップは保存されますか？',
      answer:
        '6デッキをブラウザの安全な乱数（crypto.getRandomValues）でシャッフルしています。チップ数と最高記録はこの端末のブラウザにだけ保存され、サーバーには送信されません。チップがなくなったら「チップをリセット」で1,000枚から再開できます。',
    },
  ],
  en: [
    {
      question: 'Can I win real money or prizes in this blackjack game?',
      answer:
        'No. It uses virtual chips that cannot be cashed out, and it has nothing to do with real money or prizes. It is a game for fun and practicing the rules, and it does not encourage real gambling.',
    },
    {
      question: 'What are the payouts and the dealer’s rules?',
      answer:
        'A blackjack (21 with your first two cards) pays 3:2, a regular win pays 1:1, and a push returns your bet. The dealer draws until reaching 17 and stands on every 17, including soft 17 (an ace counted as 11).',
    },
    {
      question: 'When can I double down?',
      answer:
        'Only right after the first two cards are dealt, and only if you have at least as many chips as your bet. Your bet doubles, you take exactly one more card, and you stand. It is not available after you hit.',
    },
    {
      question: 'Can I split pairs or buy insurance?',
      answer:
        'No. This tool keeps the rules simple with hit, stand and double down only. If the dealer’s two cards, including the face-down one, make a blackjack, the round is decided as soon as the cards are dealt.',
    },
    {
      question: 'Is the shuffle fair, and are my chips saved?',
      answer:
        'The six-deck shoe is shuffled with the browser’s secure random source (crypto.getRandomValues). Your chip count and best record are saved only in this browser and never sent to a server. If you run out of chips, press "Reset chips" to restart with 1,000.',
    },
  ],
};
