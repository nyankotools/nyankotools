import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '度分秒を10進度に変換するにはどう計算しますか？',
      answer:
        '度 + 分/60 + 秒/3600 で求めます。たとえば 35°40′52″ は 35 + 40/60 + 52/3600 ≒ 35.6811度です。南緯・西経はマイナスにします。このツールは緯度経度のどちらにも対応し、逆方向（10進度から度分秒）の変換もできます。',
    },
    {
      question: '距離の誤差はどのくらいですか？',
      answer:
        '地球を球とみなすHaversine公式なので、楕円体で計算する測地線距離とは最大0.5%程度（数百kmで数km）ずれることがあります。日常の目安には十分ですが、測量や航法には向きません。',
    },
    {
      question: 'どんな書き方の緯度経度を読み取れますか？',
      answer:
        '35.6812、-33.87、35°40′52″ N、35 40 52、N35度40分52秒、東経139.7671 などです。方位文字は緯度ならN/S、経度ならE/Wのみで、軸に合わないとエラーになります。度が実数のまま分や秒を併記した入力（35.5 10 10）は誤りとして扱います。',
    },
    {
      question: '方位角が出発時と到着時で違うのはなぜですか？',
      answer:
        '大圏航路（地球上の最短経路）は、経線と交わる角度が進むにつれて変わるためです。出発地点での向きが初期方位角、到着地点で進んでいる向きが到着時の方位角で、東西に長い移動ほど差が大きくなります。',
    },
    {
      question: '位置情報を入力しても外部に送られませんか？',
      answer:
        '計算はすべてブラウザ内で行い、地図タイルの読み込みもしないため、入力した座標が外部に送信されることはありません。入力内容は保存もされません。',
    },
  ],
  en: [
    {
      question: 'How do I convert DMS to decimal degrees?',
      answer:
        'Use degrees + minutes/60 + seconds/3600. For example 35°40′52″ is 35 + 40/60 + 52/3600, about 35.6811 degrees. South latitude and west longitude are negative. This tool also converts the other way, from decimal degrees to DMS.',
    },
    {
      question: 'How accurate is the distance?',
      answer:
        'The Haversine formula treats the Earth as a sphere, so it can differ from an ellipsoidal geodesic distance by up to about 0.5% (a few kilometers over several hundred). That is fine for everyday estimates but not for surveying or navigation.',
    },
    {
      question: 'Which coordinate formats can it read?',
      answer:
        'Formats such as 35.6812, -33.87, 35°40′52″ N, 35 40 52 and N 35 40 52. A direction letter must match the axis (N/S for latitude, E/W for longitude) or you get an error. A fractional degree followed by minutes or seconds (35.5 10 10) is rejected as ambiguous.',
    },
    {
      question: 'Why do the initial and final bearings differ?',
      answer:
        'The shortest path on a sphere (a great circle) crosses each meridian at a different angle as you go. The initial bearing is the heading at the start and the final bearing is the heading when you arrive; the longer the east-west leg, the bigger the gap.',
    },
    {
      question: 'Are the coordinates I enter sent anywhere?',
      answer:
        'No. Everything is calculated in your browser and no map tiles are loaded, so the coordinates never leave your device. They are not stored either.',
    },
  ],
};
