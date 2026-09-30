import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '重複を削除すると、どの行が残りますか？',
      answer:
        '最初に出現した行が残ります。どの表記を残したいかが気になる場合は、前後の空白削除や大文字・小文字を区別しないオプションと組み合わせて調整してください。',
    },
    {
      question: '数値ソートは行のどの部分を基準にしますか？',
      answer:
        '各行の中から最初に見つかった数値を基準に並べ替えます。数値を含まない行は、並べ替えた結果の末尾にまとまります。',
    },
    {
      question: 'シャッフルの結果は毎回変わりますか？',
      answer:
        'はい。選ぶたびにランダムな並びになります。同じ並びを残したい場合は、結果をコピーして保存してください。',
    },
  ],
  en: [
    {
      question: 'Which line is kept when removing duplicates?',
      answer:
        'The first occurrence is kept. To control which spelling survives, combine it with trimming or case-insensitive options.',
    },
    {
      question: 'What does numeric sorting use?',
      answer:
        'It sorts by the first number found in each line. Lines with no number are grouped at the end.',
    },
    {
      question: 'Is the shuffle different every time?',
      answer:
        'Yes, each shuffle is random. Copy and save the result if you want to keep a particular order.',
    },
  ],
};
