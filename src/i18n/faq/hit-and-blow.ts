import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'Hit と Blow の違いは何ですか？',
      answer:
        'Hit は数字も位置も答えと一致している桁の数、Blow は数字は答えに含まれているが位置が違う桁の数です。たとえば答えが1234で予想が1357なら、1が Hit、3が Blow なので「1 Hit 1 Blow」になります。',
    },
    {
      question: '数字の重複ありのとき、Blow はどう数えますか？',
      answer:
        '同じ数字を二重に数えないよう、Hit になった桁を除いたうえで、答えと予想それぞれに残った数字の個数の少ないほうまでを Blow とします。答えが1123で予想が1111なら、Hit は2、Blow は0です。',
    },
    {
      question: '答えの先頭が0になることはありますか？',
      answer:
        'あります。0〜9のどの数字も先頭に来る可能性があるため、0123のような答えも出ます。予想するときも先頭の0をそのまま入力してください。',
    },
    {
      question: '答えの候補は全部で何通りありますか？',
      answer:
        '重複なしは4桁で5040通り（3桁は720通り、5桁は30240通り）、重複ありは桁数ぶんの10の累乗（4桁で10000通り）です。画面にも現在の設定での総数を表示しています。',
    },
    {
      question: 'ゲームの途中で設定を変えるとどうなりますか？',
      answer:
        '桁数や重複の設定を変えると、その場で新しいゲームが始まり、これまでの履歴と答えは破棄されます。ギブアップすると答えが表示され、それ以降は推測できないので「新しいゲーム」で始め直してください。',
    },
  ],
  en: [
    {
      question: 'What is the difference between a Hit and a Blow?',
      answer:
        'A Hit is a digit that is correct and in the right position. A Blow is a digit that is in the secret number but in a different position. If the answer is 1234 and you guess 1357, the 1 is a Hit and the 3 is a Blow: 1 Hit, 1 Blow.',
    },
    {
      question: 'How are Blows counted when repeated digits are allowed?',
      answer:
        'The same digit is never counted twice. After removing the Hits, each digit counts as a Blow only up to the smaller of how many times it remains in the answer and in your guess. With the answer 1123 and the guess 1111 you get 2 Hits and 0 Blows.',
    },
    {
      question: 'Can the secret number start with 0?',
      answer:
        'Yes. Any digit from 0 to 9 can be in the first position, so answers like 0123 are possible. Type leading zeros as they are when you guess.',
    },
    {
      question: 'How many possible answers are there?',
      answer:
        'Without repeats there are 5,040 answers for 4 digits (720 for 3 digits and 30,240 for 5 digits). With repeats there are 10 to the power of the number of digits, so 10,000 for 4 digits. The page shows the total for your current setting.',
    },
    {
      question: 'What happens if I change the settings mid-game?',
      answer:
        'Changing the number of digits or the repeat option immediately starts a new game and discards the current history and answer. After you give up, the answer is shown and you cannot guess any more, so press "New game" to play again.',
    },
  ],
};
