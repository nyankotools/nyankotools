import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '全角と半角は区別して数えられますか？',
      answer:
        '文字数は全角・半角を区別せず1文字として数えます。スペースや改行を除いた文字数も併せて表示するため、原稿の文字数制限の確認に使えます。',
    },
    {
      question: '絵文字は1文字と数えられますか？',
      answer:
        '文字はUnicodeのコードポイント単位で数えます。基本的な絵文字は1文字ですが、複数の文字を組み合わせた絵文字（家族や肌の色付きなど）は2文字以上として数えられることがあります。SNSなどは独自のルールで数えるため、投稿先の数え方と差が出ることもあります。',
    },
    {
      question: 'X（Twitter）の280字制限はどう数えますか？',
      answer:
        '「Xでの文字数」で確認できます。半角英数字・記号は1、日本語などの全角文字と絵文字は2、URLは長さによらず23として数え、上限は「アカウント」で切り替えられます。無料アカウントは280字（日本語だけなら140字が目安）、Xの公式ヘルプによると長文ポストは有料プラン（Basic・Premium・Premium+）加入者が作成でき、上限は25,000字です。',
    },
    {
      question: '入力したテキストは保存・送信されますか？',
      answer:
        'いいえ。カウントはすべてブラウザ内で行われ、入力内容がサーバーへ送信されたり保存されたりすることはありません。',
    },
  ],
  en: [
    {
      question:
        'Does it count full-width and half-width characters differently?',
      answer:
        'Every character counts as one regardless of width. The tool also shows the count without spaces and line breaks, which is useful for checking length limits.',
    },
    {
      question: 'Are emoji counted as one character?',
      answer:
        'Characters are counted as Unicode code points. Basic emoji count as one, but emoji built from several code points (such as family or skin-tone variants) can count as two or more. Social networks use their own rules, so results may differ from the destination.',
    },
    {
      question: "How is X's (Twitter's) 280-character limit counted?",
      answer:
        'See the Count on X box. Half-width letters, digits and symbols count as 1, Japanese and other full-width characters and emoji count as 2, any URL counts as 23, and you can switch the limit with the Account menu. Free accounts get 280 (about 140 for Japanese-only text); according to the X Help Center, subscribers on any paid tier (Basic, Premium, Premium+) can write long posts of up to 25,000 characters.',
    },
    {
      question: 'Is my text saved or sent anywhere?',
      answer:
        'No. Counting happens entirely in your browser, and your text is never sent to or stored on a server.',
    },
  ],
};
