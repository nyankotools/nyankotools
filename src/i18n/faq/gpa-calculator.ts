import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'GPAはどのように計算されますか？',
      answer:
        '各科目の評価をグレードポイントに置き換え、単位数を掛けたものを合計し、評価のついた単位数の合計で割ります。たとえば 2単位のA（3.0）と 4単位のB（2.0）なら、（2×3.0 + 4×2.0）÷ 6 = 2.33 です。結果は小数点第3位を四捨五入して表示します。',
    },
    {
      question: '不可（F）の科目はGPAに含まれますか？',
      answer:
        '含まれます。不可やFはグレードポイント0として、単位数も分母に算入します。一方、取得単位数には含まれません。再履修で成績が置き換わる大学もあるので、その場合は該当科目の行を直してください。',
    },
    {
      question: '自分の大学と評価の点数が違うのですが？',
      answer:
        '大学や学部によって、S を 4.0 とするか 4.5 とするか、A を 4.0 とするかなどが異なります。このツールのスケールは代表的な例なので、完全に一致しない場合は近いスケールで目安としてお使いください。正式なGPAは大学の規程と成績証明書で確認してください。',
    },
    {
      question: '4.0スケールと4.3スケールの違いは何ですか？',
      answer:
        '4.0スケールは A+ も A も 4.0 が上限です。4.3スケールは A+ だけが 4.3 になり、それ以外は4.0スケール（＋－あり）と同じです。海外の大学では4.0スケールが一般的ですが、一部の大学・国で4.3や4.5が使われます。',
    },
    {
      question: '合否のみの科目や評価のない科目はどう入力しますか？',
      answer:
        '評価を「未選択」のままにするか、行を削除してください。評価が未選択の行はGPAの計算から除外され、除外した科目数と単位数が結果の下に表示されます。',
    },
  ],
  en: [
    {
      question: 'How is GPA calculated?',
      answer:
        'Each grade is converted to grade points and multiplied by the course credits. The products are summed and divided by the total graded credits. For example, a 2-credit A (3.0) and a 4-credit B (2.0) give (2×3.0 + 4×2.0) ÷ 6 = 2.33. The result is rounded to two decimals.',
    },
    {
      question: 'Do failed courses count toward the GPA?',
      answer:
        'Yes. A fail or F counts as 0 grade points and its credits stay in the denominator. It does not count toward earned credits, though. Some schools replace the grade when a course is retaken; if yours does, edit the row accordingly.',
    },
    {
      question: 'My school uses different point values. What should I do?',
      answer:
        'Schools differ on whether S is 4.0 or 4.5, whether A+ is separate, and so on. The scales here are common examples. If none matches exactly, use the closest one as an estimate and check your institution’s rules and transcript for the official figure.',
    },
    {
      question: 'What is the difference between the 4.0 and 4.3 scales?',
      answer:
        'On a 4.0 scale both A+ and A are capped at 4.0. On a 4.3 scale only A+ is worth 4.3, and the other grades match the 4.0 scale with plus/minus. The 4.0 scale is the most common overseas, while some schools and countries use 4.3 or 4.5.',
    },
    {
      question: 'How do I enter pass/fail courses or courses with no grade?',
      answer:
        'Leave the grade as "Not selected" or remove the row. Rows with no grade are left out of the GPA, and the number of skipped courses and credits is shown under the result.',
    },
  ],
};
