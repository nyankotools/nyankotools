import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '編集距離（レーベンシュタイン距離）とは何ですか？',
      answer:
        '文字列Aを文字列Bに変えるのに必要な、1文字の挿入・削除・置換の最小回数です。例えば「kitten」と「sitting」は、2回の置換と1回の挿入で変わるため距離は3です。',
    },
    {
      question: '類似率はどう計算されますか？',
      answer:
        '1 −（編集距離 ÷ 長い方の文字数）です。「kitten」と「sitting」なら 1 − 3/7 で約57.1%になります。両方が空の場合は100%、片方だけ空の場合は0%です。',
    },
    {
      question: '絵文字や結合文字はどう数えますか？',
      answer:
        '初期設定のコードポイント単位では、絵文字などのサロゲートペアも1文字として数えます。「é」を「e」と結合文字で表した場合は2文字になるので、見た目どおりに数えたいときは「書記素（見た目の1文字）」を選んでください。',
    },
    {
      question: '隣接転置を1回と数える距離とは何ですか？',
      answer:
        '「ab」を「ba」に変えるとき、通常のレーベンシュタイン距離は2ですが、隣り合う2文字の入れ替えを1回と数えると1になります。タイプミスの検出に向いた考え方です。',
    },
    {
      question: '長い文字列は比較できますか？',
      answer:
        '各文字列5000文字までです。計算量は文字数の積に比例するため、それを超えるとブラウザが固まるおそれがあり、制限しています。',
    },
  ],
  en: [
    {
      question: 'What is Levenshtein edit distance?',
      answer:
        'It is the minimum number of single-character inserts, deletes, and replacements needed to turn string A into string B. "kitten" to "sitting" takes two replacements and one insert, so the distance is 3.',
    },
    {
      question: 'How is the similarity percentage calculated?',
      answer:
        'It is 1 - (edit distance / length of the longer string). For "kitten" and "sitting" that is 1 - 3/7, about 57.1%. Two empty strings give 100%; one empty string gives 0%.',
    },
    {
      question: 'How are emoji and combining characters counted?',
      answer:
        'By default, code points are counted, so a surrogate-pair emoji is one character. An "e" plus a combining accent is two, so choose "Graphemes (visible characters)" to count what you actually see.',
    },
    {
      question: 'What does "adjacent swap counts as 1" mean?',
      answer:
        'Turning "ab" into "ba" costs 2 in plain Levenshtein distance, but 1 if swapping two neighboring characters counts as one step. This variant suits typo detection.',
    },
    {
      question: 'Can I compare long strings?',
      answer:
        'Each string can be up to 5000 characters. The work grows with the product of the two lengths, so longer input could freeze the browser.',
    },
  ],
};
