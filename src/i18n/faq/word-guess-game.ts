import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '緑・黄・灰の色はそれぞれ何を表しますか？',
      answer:
        '緑はその文字が答えにあり、位置も合っています。黄は答えに含まれますが位置が違います。灰は答えに含まれません。画面下のキーも、これまでの推測で分かった最も強い判定の色になります。',
    },
    {
      question: '同じ文字が2つある単語はどう判定されますか？',
      answer:
        '答えに含まれる個数の分だけ色がつきます。まず位置が合う文字を緑にし、残った文字を左から順に、答えに余っている数だけ黄にします。答えに E が1つなら、EE を含む推測で色がつく E は1つだけで、もう一方は灰になります。',
    },
    {
      question: '「内蔵リストにありません」と出るのはなぜですか？',
      answer:
        '回答にできるのは、ページに内蔵した約2,900語の英単語だけです。固有名詞や専門用語、まれな単語は入っていないことがあります。エラーのときは回数に数えないので、別の単語を入力してください。',
    },
    {
      question: '答えにはどんな単語が出ますか？',
      answer:
        '約1,200語の一般的な英単語から選ばれます。受け付ける単語より絞ってあり、あまり見かけない単語は答えになりません。直前に出た単語は続けて出ないようにしています。',
    },
    {
      question: '結果をコピーすると何が貼り付けられますか？',
      answer:
        '推測ごとの色を絵文字（緑・黄・黒の四角）にした升目だけです。答えの文字や入力した単語は含まれないので、そのまま共有しても答えは分かりません。',
    },
  ],
  en: [
    {
      question: 'What do the green, yellow and gray tiles mean?',
      answer:
        'Green means the letter is in the answer and in the right spot. Yellow means it is in the answer but in another spot. Gray means it is not in the answer. The on-screen keys also show the strongest clue learned so far for each letter.',
    },
    {
      question: 'How are repeated letters scored?',
      answer:
        'Each letter is colored only as many times as it appears in the answer. Letters in the right spot turn green first, then the remaining letters turn yellow from left to right while copies are left over. If the answer has one E, a guess with two Es colors one of them and the other stays gray.',
    },
    {
      question: 'Why does it say a word is not in the list?',
      answer:
        'Only the roughly 2,900 words built into the page are accepted as guesses. Proper nouns, specialist terms and rare words may be missing. An invalid word does not use up a try, so just enter another one.',
    },
    {
      question: 'What kind of words can be the answer?',
      answer:
        'Answers come from about 1,200 common English words, a narrower set than the words accepted as guesses, so obscure words are never the answer. The word you just played will not come up right away.',
    },
    {
      question: 'What does "Copy result" copy?',
      answer:
        'Only a grid of colored squares (green, yellow and black), one row per guess. It never includes the answer or the words you typed, so you can share it without giving anything away.',
    },
  ],
};
