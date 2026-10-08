import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '「今日の運勢」は、なぜ同じ日だと同じ結果になるのですか？',
      answer:
        '端末の日付（ローカル時間）と入力した名前から結果を計算しているためです。同じ日・同じ名前なら何度開いても同じ結果になり、日付が変わると結果も変わります。履歴は保存していません。',
    },
    {
      question: '名前を入れないとどうなりますか？',
      answer:
        '名前が空でも、日付だけから結果が決まります。この場合は同じ日であれば誰が引いても同じ結果になります。名前を入れると、あなた専用の結果になります。',
    },
    {
      question: '何度でも引き直せますか？',
      answer:
        '「引き直し」モードなら、ボタンを押すたびに新しく引きます。暗号用乱数を使っているので、前の結果には影響されません。',
    },
    {
      question: '大吉や大凶はどのくらいの確率で出ますか？',
      answer:
        '引き直しでは、大吉15%・吉25%・中吉20%・小吉15%・末吉15%・凶8%・大凶2%を目安にしています。実際の神社のおみくじの割合とは異なります。',
    },
    {
      question: '入力した名前は保存・送信されますか？',
      answer:
        'いいえ。名前も結果もすべてブラウザ内で処理され、サーバーには送信されません。',
    },
  ],
  en: [
    {
      question: 'Why does the daily fortune stay the same all day?',
      answer:
        'The result is calculated from your device’s local date and the name you enter. The same date and name always give the same slip, and a new date gives a new one. No history is stored.',
    },
    {
      question: 'What happens if I leave the name blank?',
      answer:
        'The result is then based on the date alone, so anyone who leaves it blank gets the same fortune on a given day. Enter a name to get one just for you.',
    },
    {
      question: 'Can I draw again and again?',
      answer:
        'Yes, in Redraw mode every press draws a new slip using cryptographic randomness, unaffected by earlier results.',
    },
    {
      question: 'How likely are great blessing and great curse?',
      answer:
        'Redraw uses roughly: great blessing 15%, blessing 25%, middle blessing 20%, small blessing 15%, future blessing 15%, curse 8%, great curse 2%. These odds are not those of any real shrine.',
    },
    {
      question: 'Is the name I enter saved or sent anywhere?',
      answer:
        'No. The name and the result are processed only in your browser and are never sent to a server.',
    },
  ],
};
