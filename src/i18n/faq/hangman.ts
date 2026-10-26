import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '何回まちがえるとゲームオーバーですか？',
      answer:
        '単語に含まれない文字を6回選ぶとゲームオーバーです。絵は外れるたびに頭、胴体、両腕、両脚の順に描き足されます。同じ文字を選び直してもミスにはなりません。',
    },
    {
      question: 'どんな単語が出題されますか？',
      answer:
        'ページに内蔵した約240語のリストから出ます。動物、食べ物、自然、学校、家、旅行、仕事、体の8カテゴリで、日常的な名詞が中心です。カテゴリを「すべて」にすると全体から選ばれます。',
    },
    {
      question: '大文字や全角で入力してもよいですか？',
      answer:
        'はい。大文字・小文字は区別せず、全角のアルファベットも半角に直して判定します。a〜z以外の文字や、2文字以上の入力は受け付けず、ミスにも数えません。',
    },
    {
      question: '答えの意味を知るにはどうすればよいですか？',
      answer:
        '日本語ページでは、ゲームが終わった（正解・ゲームオーバー・ギブアップ）時点で、答えの単語の日本語の意味を表示します。途中でヒントとして見ることはできません。',
    },
    {
      question: 'すぐに同じ単語がもう一度出ることはありますか？',
      answer:
        '直前の単語は続けて出ないようにしています。ただし数回前に出た単語は再び出ることがあります。ページを再読み込みしても出題は新しくなり、履歴は保存されません。',
    },
  ],
  en: [
    {
      question: 'How many wrong guesses end the game?',
      answer:
        'Six. The drawing adds the head, body, two arms and two legs in that order, one for each letter that is not in the word. Picking a letter you already chose does not count as a miss.',
    },
    {
      question: 'What kind of words does it use?',
      answer:
        'The page has a built-in list of about 240 words in 8 categories: animals, food, nature, school, home, travel, jobs and body. They are mostly everyday nouns. Choose "All" to draw from every category.',
    },
    {
      question: 'Can I type capital letters or full-width letters?',
      answer:
        'Yes. Case does not matter, and full-width letters are converted before checking. Anything other than a single letter from a to z is rejected and does not count as a miss.',
    },
    {
      question: 'Can I see what the word means?',
      answer:
        'This page does not show definitions. The answer is revealed when you win, lose or give up. If you want to check a word, look it up in a dictionary afterwards.',
    },
    {
      question: 'Will the same word come up twice in a row?',
      answer:
        'No, the word you just played is skipped. A word from a few rounds ago can come back, though. Reloading the page also starts with a fresh random word, and nothing is saved.',
    },
  ],
};
