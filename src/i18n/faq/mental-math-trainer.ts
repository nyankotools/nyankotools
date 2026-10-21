import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'どんな問題が出ますか？',
      answer:
        '選んだ演算と桁数で、毎回ランダムに出題されます。ひき算の答えは負にならず、わり算は必ず割り切れる問題（商は2以上の整数）だけが出ます。同じ問題はできるだけ重ならないようにしています。',
    },
    {
      question: 'ランクはどう決まりますか？',
      answer:
        '出題数に対する正解率で決まります。95%以上でS、85%以上でA、70%以上でB、50%以上でC、それ未満はDです。時間切れややめた場合の未回答は不正解として数えます。',
    },
    {
      question: 'ベスト記録は何を基準に保存されますか？',
      answer:
        '演算・桁数・問題数・制限時間の組み合わせごとに保存します。正解数が多い方、同じ正解数なら所要時間が短い方が上位です。記録はこのブラウザのローカルストレージだけに保存され、サーバーには送信されません。',
    },
    {
      question: '制限時間を選ぶとどうなりますか？',
      answer:
        '残り時間が0になった時点で終了し、それまでに回答した問題だけが採点されます。「なし」を選ぶと時間無制限で、全問解き終わるまで続きます。',
    },
    {
      question: '答えは全角数字で入力しても判定されますか？',
      answer:
        'はい。全角数字も半角に直して判定します。小数や文字が入っている場合は「数字で入力してください」と表示し、その問題は進みません。',
    },
  ],
  en: [
    {
      question: 'What kind of questions do I get?',
      answer:
        'Random questions using the operations and digit counts you choose. Subtraction never goes below zero, and division only uses exact divisions (the quotient is a whole number of at least 2). The tool avoids repeating the same question where it can.',
    },
    {
      question: 'How is the rank decided?',
      answer:
        'By accuracy over all questions: 95% or more is S, 85% A, 70% B, 50% C and anything lower is D. Questions left unanswered after a timeout or quitting count as wrong.',
    },
    {
      question: 'What is the best record based on?',
      answer:
        'It is stored per combination of operations, digits, question count and time limit. More correct answers rank higher, and for the same count the shorter time wins. Records stay in this browser’s local storage and are never sent to a server.',
    },
    {
      question: 'What does the time limit do?',
      answer:
        'When the clock reaches zero the round ends, and only the questions you answered by then are scored. With "None" there is no limit and the round continues until you finish every question.',
    },
    {
      question: 'Are full-width digits accepted as answers?',
      answer:
        'Yes, they are converted to normal digits before checking. If the input contains decimals or letters, the tool asks for a number and stays on the same question.',
    },
  ],
};
