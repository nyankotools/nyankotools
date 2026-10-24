import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'METsから消費カロリーを求める式を教えてください。',
      answer:
        '消費カロリー(kcal) = METs × 体重(kg) × 時間(h) × 1.05 です。たとえば体重60kgの人が3METsの運動を1時間行うと、3 × 60 × 1 × 1.05 = 189kcal になります。1.05 は1METs・体重1kg・1時間あたりのおおよそのkcalです。',
    },
    {
      question: 'METs値はどこから来ていますか？正確ですか？',
      answer:
        '国立健康・栄養研究所「改訂版 身体活動のMETs表」や Compendium of Physical Activities などの公表値を参考にした、代表的な値の目安です。同じ運動でも速度や強度、環境で値は変わるので、正確な値が必要な場合は原典を確認してください。「METsを自分で入力して追加」で任意の値も使えます。',
    },
    {
      question: '「安静時の分を差し引く」とはどういう意味ですか？',
      answer:
        'METs × 体重 × 時間 × 1.05 の結果には、運動していなくても消費する安静時のエネルギー(1METs分)が含まれます。差し引くオプションでは (METs - 1) で計算し、運動によって上乗せされたカロリーだけを求めます。1日の合計に基礎代謝を別に足す場合などに使います。',
    },
    {
      question: '複数の運動はどう合計されますか？',
      answer:
        '運動ごとに「METs × 体重 × 時間 × 1.05」を計算し、その合計を表示します。同じ運動を別の行に分けて追加しても構いません。時間は「時間」と「分」の両方に入力でき、合計時間も表示されます。',
    },
    {
      question: '実際の消費カロリーとずれるのはなぜですか？',
      answer:
        'METs は平均的な人を想定した値で、年齢・性別・体力・体組成・フォームの違いは反映されません。ウェアラブル機器の数値とも差が出ることがあります。あくまで目安として使い、体調に不安がある場合は医師に相談してください。',
    },
  ],
  en: [
    {
      question: 'What is the formula for calories burned from METs?',
      answer:
        'Calories (kcal) = METs × body weight (kg) × hours × 1.05. For example, a 60 kg person doing a 3 METs activity for one hour burns about 3 × 60 × 1 × 1.05 = 189 kcal. The 1.05 is roughly the kcal per 1 MET, per kg, per hour.',
    },
    {
      question: 'Where do the METs values come from, and are they exact?',
      answer:
        'They are representative values based on published sources such as the Compendium of Physical Activities and the METs table from Japan’s National Institute of Health and Nutrition. The real value changes with speed, intensity, and conditions, so check the original sources if you need precision. You can also enter any value with "Add with a custom METs value".',
    },
    {
      question: 'What does subtracting resting energy do?',
      answer:
        'The result of METs × weight × hours × 1.05 includes the energy you would burn at rest anyway (1 MET). The option calculates with (METs - 1) instead, so you see only the extra calories from the exercise. It is useful when you add your resting metabolism separately.',
    },
    {
      question: 'How are several activities totaled?',
      answer:
        'Each row is calculated as METs × weight × time × 1.05, and the rows are summed. You can add the same activity more than once. Time can be entered in hours and minutes, and the total time is shown too.',
    },
    {
      question: 'Why can the result differ from what I actually burn?',
      answer:
        'METs describe an average person and ignore age, sex, fitness, body composition, and technique. It can also differ from wearable devices. Treat it as a rough guide, and talk to a doctor if you have health concerns.',
    },
  ],
};
