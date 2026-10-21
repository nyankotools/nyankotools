import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '退職金2,000万円・勤続30年だと税金はいくらですか？',
      answer:
        '退職所得控除は1,500万円なので、残りの500万円の2分の1（250万円）が課税対象です。所得税と復興特別所得税が約15.6万円、住民税が約25万円で、合計約40.6万円が目安です。',
    },
    {
      question: '退職所得控除はどう計算しますか？',
      answer:
        '勤続20年以下は40万円×勤続年数（80万円に満たない場合は80万円）、20年を超える部分は1年あたり70万円を加えます。たとえば勤続30年なら800万円+700万円で1,500万円です。障害退職は100万円が加算されます。',
    },
    {
      question: '勤続年数の端数はどう扱いますか？',
      answer:
        '1年未満の端数は切り上げます。勤続10年1か月なら11年として退職所得控除を計算します。このツールは年と月を入力すると自動で切り上げます。',
    },
    {
      question: '勤続5年以下だと税金が高くなるのはなぜですか？',
      answer:
        '令和4年分から、勤続5年以下の一般の従業員は控除後の金額が300万円を超える部分に2分の1課税が使えません。役員等の勤続5年以下は全額に2分の1課税が使えず、税負担が重くなります。',
    },
    {
      question: '申告書を出していないとどうなりますか？',
      answer:
        '退職所得の受給に関する申告書を会社に出さないと、退職金に一律20.42%が源泉徴収されます。確定申告をすれば退職所得控除などで精算され、払いすぎた分が戻ります。このツールは申告書を出した場合の税額です。',
    },
  ],
  en: [
    {
      question: 'How much tax on a ¥20 million allowance after 30 years?',
      answer:
        'The retirement income deduction is ¥15 million, so half of the remaining ¥5 million (¥2.5 million) is taxed. Income tax with the reconstruction surtax is about ¥156,000 and resident tax about ¥250,000, roughly ¥406,000 in total.',
    },
    {
      question: 'How is the retirement income deduction calculated?',
      answer:
        'For 20 years or less it is ¥400,000 times the years of service (at least ¥800,000). Each year beyond 20 adds ¥700,000. For 30 years that is ¥8 million plus ¥7 million, or ¥15 million. A disability retirement adds ¥1 million.',
    },
    {
      question: 'How are partial years of service handled?',
      answer:
        'A partial year is rounded up. Ten years and one month counts as 11 years for the deduction. This tool rounds up automatically when you enter years and months.',
    },
    {
      question: 'Why is the tax higher after five years or less of service?',
      answer:
        'Since 2022, ordinary employees with five years or less get no half taxation on the part above ¥3 million after the deduction. For officers with five years or less in that role, half taxation does not apply at all, so the tax burden is heavier.',
    },
    {
      question: 'What if I did not submit the declaration form?',
      answer:
        'Without the retirement income declaration form, your employer withholds a flat 20.42% from the allowance. Filing a tax return then applies the deduction and refunds any excess. This tool shows the tax when the form has been submitted.',
    },
  ],
};
