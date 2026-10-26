import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '平均的には何桁まで覚えられますか？',
      answer:
        '一般に、人が一度に覚えられる数字は7桁前後（±2）といわれます。このテストでも7〜9桁あたりが一つの壁になることが多いです。10桁を超えると、数字をまとまりに区切るなどの工夫が必要になります。',
    },
    {
      question: '覚えるコツはありますか？',
      answer:
        '3〜4桁ずつのかたまりに区切って覚える（チャンク化）と、長い数字でも覚えやすくなります。声に出さず頭の中で読み上げる方法も有効です。',
    },
    {
      question: '先頭が0の数字も出ますか？',
      answer:
        '出ます。各桁を0〜9からランダムに選ぶため、「0123」のような数字も出題されます。入力するときも先頭の0を省くと不正解になります。',
    },
    {
      question: 'ベスト記録はどこに保存されますか？',
      answer:
        'お使いのブラウザのlocalStorageにだけ保存され、サーバーには送信されません。別のブラウザや端末とは共有されず、ブラウザのデータを削除すると消えます。「ベスト記録を消す」でも削除できます。',
    },
  ],
  en: [
    {
      question: 'How many digits can the average person remember?',
      answer:
        'People can typically hold about seven digits (give or take two) at once. Many players hit a wall around 7 to 9 digits here. Beyond 10 digits you usually need a strategy such as grouping the digits.',
    },
    {
      question: 'Any tips for remembering longer numbers?',
      answer:
        'Split the number into chunks of three or four digits and remember the chunks instead of single digits. Silently repeating the chunks in your head also helps.',
    },
    {
      question: 'Can a number start with 0?',
      answer:
        'Yes. Each digit is picked at random from 0 to 9, so numbers like "0123" can appear. Leave out the leading zero and the answer counts as wrong.',
    },
    {
      question: 'Where is my best score stored?',
      answer:
        'Only in your browser\'s localStorage. It is never sent to a server, is not shared with other browsers or devices, and disappears if you clear site data. You can also remove it with "Clear best score".',
    },
  ],
};
