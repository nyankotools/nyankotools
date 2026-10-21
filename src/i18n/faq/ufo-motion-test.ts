import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'フレーム飛びが出るのはモニターの故障ですか？',
      answer:
        '多くはモニターではなく、ブラウザやPCの負荷が原因です。他のタブやアプリを閉じ、省電力モードをオフにしてから測り直してください。それでも頻繁に出る場合はGPUドライバーやハードウェアアクセラレーション設定も確認してください。',
    },
    {
      question: '残像は速度を変えると見え方が変わりますか？',
      answer:
        'はい。速いほど1フレームあたりの移動量が増え、残像やぼやけが目立ちます。逆に遅いと差が出にくいので、「速い」以上でパネルを見比べるのがおすすめです。背景を黒・グレー・白に変えると、色の階調による応答の違いも確認できます。',
    },
    {
      question: 'このテストでモニターの応答速度（ms）は分かりますか？',
      answer:
        '分かりません。表示された残像の長さを目視で比べる簡易テストで、GtGなどの応答速度や入力遅延を数値で測る機材の代わりにはなりません。',
    },
    {
      question: '60Hzと120Hzで見え方はどう違いますか？',
      answer:
        '同じ速度でも120Hzは1フレームの移動量が半分になるため、動きが滑らかでぼやけも少なく見えます。画面に表示される「1フレームの移動量」で比較できます。',
    },
  ],
  en: [
    {
      question: 'Do skipped frames mean my monitor is faulty?',
      answer:
        'Usually not; they come from browser or PC load. Close other tabs and apps, turn off power-saving mode and test again. If they still happen often, check your GPU driver and hardware acceleration settings.',
    },
    {
      question: 'Does ghosting look different at different speeds?',
      answer:
        'Yes. Faster speeds move the object further each frame, so trails and blur stand out more. Slow speeds hide differences, so compare panels at Fast or above. Switching the background between black, gray and white also shows how the panel responds at different tones.',
    },
    {
      question: 'Does this test tell me my monitor response time in ms?',
      answer:
        'No. It is a quick visual check where you compare how long the trails look. It cannot replace the equipment used to measure GtG response time or input lag.',
    },
    {
      question: 'How does 60Hz look different from 120Hz here?',
      answer:
        'At the same speed, 120Hz halves the distance moved per frame, so motion looks smoother with less blur. You can compare the "Movement per frame" value shown on screen.',
    },
  ],
};
