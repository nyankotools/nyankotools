import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '日をまたぐ勤務（夜勤）は計算できますか？',
      answer:
        'できます。退勤が出勤より前の時刻のときは翌日にまたぐ勤務として扱います。たとえば22:00〜6:00で休憩60分なら、実働は7時間です。',
    },
    {
      question: '7時間45分は小数時間でいくつですか？',
      answer:
        '7.75時間です。分を60で割った値を時間に足します（45÷60=0.75）。逆に、小数部分に60を掛けると分になります。',
    },
    {
      question: '小数時間が割り切れない場合はどうなりますか？',
      answer:
        '20分は0.3333…時間のように割り切れないため、小数第2位で四捨五入した0.33時間を表示します。時給計算では端数処理の方法で数円の差が出ることがあります。',
    },
    {
      question: '休憩が勤務時間より長いとどうなりますか？',
      answer:
        '拘束時間（退勤−出勤）より休憩が長い行は計算できない行としてエラーを表示し、合計には含めません。',
    },
  ],
  en: [
    {
      question: 'Can it handle overnight shifts?',
      answer:
        'Yes. When the end time is earlier than the start time, the shift is treated as running into the next day. For example, 22:00 to 6:00 with a 60-minute break is 7 hours worked.',
    },
    {
      question: 'How do I convert 7 hours 45 minutes to decimal hours?',
      answer:
        'It is 7.75 hours: divide the minutes by 60 (45 / 60 = 0.75) and add them to the hours. To go back, multiply the decimal part by 60.',
    },
    {
      question: 'What happens when the decimal does not divide evenly?',
      answer:
        '20 minutes is 0.3333... hours, so the tool rounds to two places and shows 0.33. In pay calculations, the rounding method can change the amount slightly.',
    },
    {
      question: 'What if the break is longer than the shift?',
      answer:
        'A row whose break is longer than the shift (end minus start) cannot be calculated, so it shows an error and is left out of the total.',
    },
  ],
};
