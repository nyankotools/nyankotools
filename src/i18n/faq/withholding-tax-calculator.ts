import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '10万円の原稿料から源泉徴収される金額はいくらですか？',
      answer:
        '消費税を区分せず10万円のみの場合は10万円×10.21%で10,210円、振込額は89,790円です。税抜10万円と消費税1万円を請求書で区分していれば、対象は税抜の10万円なので源泉徴収は10,210円、振込額は99,790円になります。',
    },
    {
      question: '源泉徴収の税率10.21%と20.42%はどう使い分けますか？',
      answer:
        '1回の支払金額が100万円以下なら全額に10.21%です。100万円を超えると、超えた部分に20.42%をかけ、100万円分の税額102,100円を加えます。たとえば200万円なら306,300円です。',
    },
    {
      question: '消費税は源泉徴収の対象に含まれますか？',
      answer:
        '請求書などで報酬と消費税が明確に区分されていれば、消費税を除いた金額が対象です。区分がなければ、消費税込みの金額全体が対象になり、源泉徴収の額が大きくなります。',
    },
    {
      question: '司法書士への報酬は計算がどう違いますか？',
      answer:
        '司法書士・土地家屋調査士・海事代理士などの報酬は、1回の支払ごとに1万円を差し引いた金額に税率をかけます。たとえば10万円なら（10万円−1万円）×10.21%で9,189円です。100万円を超えるかの判定も控除後で行います。',
    },
    {
      question: '手取りから請求額を逆算すると誤差は出ますか？',
      answer:
        '源泉徴収は1円未満を切り捨てるため、手取りが一致しない請求額が出ることがあります。このツールは手取りが入力額以上になる最小の請求額を求め、ぴったりの金額がない場合はその旨を表示します。',
    },
  ],
  en: [
    {
      question: 'How much is withheld from a ¥100,000 manuscript fee?',
      answer:
        'If no consumption tax is listed and the fee is just ¥100,000, withholding is ¥100,000 × 10.21% = ¥10,210 and you receive ¥89,790. If the invoice lists ¥100,000 plus ¥10,000 consumption tax separately, only the ¥100,000 is the base, so withholding is ¥10,210 and you receive ¥99,790.',
    },
    {
      question: 'When do the 10.21% and 20.42% rates apply?',
      answer:
        'If a single payment is ¥1 million or less, 10.21% applies to all of it. Above ¥1 million, 20.42% applies to the excess and ¥102,100 (the tax on the first ¥1 million) is added. For ¥2 million that is ¥306,300.',
    },
    {
      question: 'Is consumption tax part of the withholding base?',
      answer:
        'If the invoice clearly separates the fee from consumption tax, the base excludes consumption tax. If it does not, the whole amount including consumption tax is the base, which makes the withholding larger.',
    },
    {
      question: 'How are judicial scrivener fees calculated differently?',
      answer:
        'For judicial scriveners, land and house surveyors, maritime agents and similar professionals, ¥10,000 is subtracted per payment before the rate is applied. For ¥100,000 that is (¥100,000 − ¥10,000) × 10.21% = ¥9,189. The ¥1 million check is also made after the deduction.',
    },
    {
      question: 'Can working back from a net amount be off by a yen?',
      answer:
        'Withholding rounds down to the yen, so some net amounts cannot be matched exactly. The tool finds the smallest invoice amount whose net is at least what you entered, and says so when no exact match exists.',
    },
  ],
};
