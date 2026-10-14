import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ペース（分/km）と時速（km/h）はどう変換しますか？',
      answer:
        '時速は 3600 ÷ 1kmあたりの秒数 で求められます。たとえば5分/km（300秒）なら 3600÷300 = 12km/h です。このツールは距離とタイムを入れるだけで両方を表示します。',
    },
    {
      question: '予想タイムはどのくらい当てになりますか？',
      answer:
        '入力したペースを最後まで維持した場合の単純な掛け算です。距離が延びるほどペースは落ちるため、5kmのペースをそのままフルマラソンに当てはめると実際より速く出ます。長い距離は少し余裕を見てください。',
    },
    {
      question: 'カルボーネン法とは何ですか？',
      answer:
        '安静時心拍数を使って目標心拍数を求める方法です。最大心拍数を220−年齢とし、（最大−安静時）×強度＋安静時で計算します。最大心拍数だけの割合より、普段の心拍が低い人・高い人の差が反映されます。',
    },
    {
      question: '安静時心拍数はどう測ればよいですか？',
      answer:
        '朝起きてすぐ、布団の中で1分間の脈拍を数えるのが一般的です。数日測って平均を取ると安定します。スマートウォッチの安静時心拍の値も使えます。',
    },
    {
      question: 'マイル単位でペースを入れられますか？',
      answer:
        '距離はkmとマイルから選べますが、ペースの入力は1kmあたりです。結果にはマイルあたりのペースも併記されます。',
    },
  ],
  en: [
    {
      question: 'How do I convert pace per km to speed in km/h?',
      answer:
        'Divide 3600 by the seconds per kilometer. A 5:00 per km pace is 300 seconds, so 3600 / 300 = 12 km/h. This tool shows both from a distance and a time.',
    },
    {
      question: 'How accurate are the predicted race times?',
      answer:
        'They simply multiply your pace by the distance, assuming you hold it the whole way. Pace usually drops over longer races, so applying a 5K pace to a marathon will look too fast. Allow some margin for long distances.',
    },
    {
      question: 'What is the Karvonen method?',
      answer:
        'It sets target heart rates using your resting heart rate. Max HR is estimated as 220 minus age, then target = (max − resting) × intensity + resting. It reflects differences in resting heart rate better than a plain percentage of max.',
    },
    {
      question: 'How should I measure my resting heart rate?',
      answer:
        'Count your pulse for one minute right after waking up, before getting out of bed. Averaging a few mornings gives a steadier number. A smartwatch resting heart rate value also works.',
    },
    {
      question: 'Can I enter pace per mile?',
      answer:
        'Distance can be in km or miles, but pace is entered per kilometer. The result also shows the pace per mile.',
    },
  ],
};
