import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '同時タッチ数が端末の仕様より少なく表示されます。',
      answer:
        'ブラウザやOSが一度に通知するタッチ数に上限を設けている場合があります（iOS Safariは5本程度など）。また、手のひらが触れて誤タッチ防止機能が働くことでも減ります。仕様より少ないこと自体は故障とは限りません。',
    },
    {
      question: '画面の端や四隅だけ反応しません。',
      answer:
        '端はOSのジェスチャー領域や、ケース・保護フィルムの縁が干渉して反応しにくいことがあります。ケースと保護フィルムを外して再確認し、それでも反応しない場合はタッチパネルの不良の可能性があります。',
    },
    {
      question: '触っていないのに点が表示されます（ゴーストタッチ）。',
      answer:
        '充電中のみ起きるなら充電器やケーブルのノイズが原因のことがあります。画面の水滴・汚れ・保護フィルムの浮きも原因になります。充電器を外して画面を拭いても続く場合は、パネルの故障が疑われます。',
    },
    {
      question: '線がカクカクしたり途切れたりします。',
      answer:
        'タッチの検出間隔が粗い（サンプリングレートが低い）か、端末が高負荷の可能性があります。他のアプリやタブを閉じて測り直してください。指を速く動かすほど点の間隔は広がるため、ゆっくりなぞって途切れの有無を確認すると確実です。',
    },
  ],
  en: [
    {
      question: 'The simultaneous touch count is lower than my device spec.',
      answer:
        'The browser or OS may cap how many touches it reports at once (for example around 5 on iOS Safari), and palm rejection can also reduce the count. A lower number does not necessarily mean a fault.',
    },
    {
      question: 'Only the edges or corners do not respond.',
      answer:
        'Edges can be hard to detect because of OS gesture zones or the rim of a case or screen protector. Remove the case and protector and test again; if the edge still fails, the touch panel may be defective.',
    },
    {
      question: 'Dots appear even though I am not touching (ghost touch).',
      answer:
        'If it only happens while charging, noise from the charger or cable may be the cause. Water, dirt and a lifted screen protector can also trigger it. If it continues after unplugging and wiping the screen, the panel may be faulty.',
    },
    {
      question: 'Lines look jagged or break up.',
      answer:
        'The touch sampling rate may be low or the device may be under heavy load. Close other apps and tabs and test again. Fast swipes naturally leave wider gaps between points, so swipe slowly to check for real breaks.',
    },
  ],
};
