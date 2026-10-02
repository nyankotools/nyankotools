import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '文字をクリックするとどうなりますか？',
      answer:
        '「選んだ文字」の入力欄の末尾に追加されます。続けて別の文字を選び、「コピー」を押すとまとめてクリップボードにコピーされます。入力欄は直接編集することもできます。',
    },
    {
      question: '絵文字が□や？で表示されます',
      answer:
        '使っているOS・ブラウザ・フォントがその絵文字に対応していません。新しい絵文字ほど古い環境では表示されません。貼り付け先でも同じ環境とは限らないため、相手に確実に見せたい場合は広く使われている絵文字を選んでください。',
    },
    {
      question: '丸数字（①）や㈱を使ってもよいですか？',
      answer:
        '文書やSNSでは問題なく表示されることが多いですが、Shift_JISなど古い文字コードのシステム、メールの件名、ファイル名、業務システムへの入力では文字化けや登録エラーになることがあります。そうした場所では「(1)」「(株)」のように普通の文字に置き換えてください。',
    },
    {
      question: '探している記号が見つかりません',
      answer:
        '検索は、グループ名・キーワード（「星」「arrow」など）と文字そのものに対して行います。個別の記号の名前では検索できないため、近いジャンルのキーワードで探してください。',
    },
  ],
  en: [
    {
      question: 'What happens when I click a character?',
      answer:
        'It is added to the end of the "Selected characters" box. Pick more characters, then press Copy to copy them all to the clipboard at once. You can also edit the box directly.',
    },
    {
      question: 'Emoji show up as □ or ?',
      answer:
        'Your OS, browser or font does not support that emoji. Newer emoji are often missing on older systems. The place you paste into may differ from your own device, so choose widely supported emoji when it matters.',
    },
    {
      question: 'Is it safe to use circled numbers (①) or ㈱?',
      answer:
        'They usually display fine in documents and social posts, but systems that use older encodings such as Shift_JIS, email subjects, file names and business software may garble them or reject them. In those places use plain text such as "(1)" or "(Co., Ltd.)".',
    },
    {
      question: 'I cannot find the symbol I am looking for',
      answer:
        'Search matches group names, keywords (such as "star" or "arrow") and the characters themselves. It cannot search by an individual symbol’s name, so try a keyword for the closest category.',
    },
  ],
};
