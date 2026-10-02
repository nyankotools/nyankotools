import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '変換した文字はどこで使えますか？',
      answer:
        'X（旧Twitter）・Instagram・TikTokのプロフィールや投稿、ゲームのキャラクター名、チャットなど、Unicodeの文字を表示できる場所で使えます。ただしサービスによっては使えない文字を弾いたり、フォントが対応せず□になったりするため、貼り付け先で表示を確認してください。',
    },
    {
      question: '日本語（ひらがな・漢字）は装飾できますか？',
      answer:
        'できません。太字や筆記体などの別字形が用意されているのは英字と一部の数字だけです。日本語はそのまま残ります。取り消し線・下線・「囲む」系の装飾は日本語にも使えます。',
    },
    {
      question: '変換した文字を検索で見つけてもらえますか？',
      answer:
        '見つかりにくくなります。装飾文字は元の英字とは別の文字なので、「Nyanko」で検索しても「𝐍𝐲𝐚𝐧𝐤𝐨」はヒットしません。ハッシュタグ・ユーザー名・検索されたい文章には向きません。',
    },
    {
      question: '一部の文字が□や？で表示されます',
      answer:
        '使っているフォントがその文字に対応していません。丸文字・四角文字・ゴシック体などは、環境によって表示されないことがあります。別のスタイルを試すか、貼り付け先のアプリで表示を確認してください。',
    },
    {
      question: '入力した文字はサーバーに送られますか？',
      answer:
        '送られません。変換はすべてブラウザ内で行われ、入力した内容が外部に送信・保存されることはありません。',
    },
  ],
  en: [
    {
      question: 'Where can I use the converted text?',
      answer:
        'Anywhere that displays Unicode: bios and posts on X, Instagram and TikTok, character names in games, chats and so on. Some services reject certain characters, and fonts that lack them show □ instead, so check how the text looks where you paste it.',
    },
    {
      question: 'Can it decorate Japanese text?',
      answer:
        'No. Alternate letterforms such as bold or script exist only for Latin letters and some digits, so Japanese stays as is. Strikethrough, underline and the "between" frames work with any text, including Japanese.',
    },
    {
      question: 'Will search engines find the decorated text?',
      answer:
        'Not easily. Decorated characters are different from the original letters, so searching for "Nyanko" will not match "𝐍𝐲𝐚𝐧𝐤𝐨". Avoid it for hashtags, usernames or any text you want people to find.',
    },
    {
      question: 'Some characters show as □ or ?',
      answer:
        'The font you are using does not include that character. Circled, squared and Fraktur styles in particular may not display everywhere. Try another style or check the text in the app where you will use it.',
    },
    {
      question: 'Is my text sent to a server?',
      answer:
        'No. The conversion runs entirely in your browser, and nothing you type is sent or stored anywhere else.',
    },
  ],
};
