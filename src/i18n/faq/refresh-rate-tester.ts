import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '144Hzのモニターなのに60Hzと表示されます。',
      answer:
        'OSのディスプレイ設定でリフレッシュレートが60Hzのままになっている、ケーブルや端子（HDMIの旧規格など）が高レートに対応していない、省電力モードで制限されている、などが考えられます。OSの設定と接続を確認してください。',
    },
    {
      question: '測定値が59.9Hzや143.8Hzのように少しずれるのはなぜですか？',
      answer:
        '60Hz系の映像規格は厳密には59.94Hzなどであり、測定時の誤差も数%程度出ます。本ツールは許容誤差内の最も近い標準レートを「近い標準レート」として表示します。',
    },
    {
      question: '値が安定せず上下します。',
      answer:
        '可変リフレッシュレート（VRR）の画面では負荷に応じて値が変わります。ほかのタブやアプリの負荷が高い場合もフレーム落ちで値が乱れるため、他の作業を閉じてリセットしてから測り直してください。',
    },
    {
      question: 'スマホでも測れますか？',
      answer:
        'はい。ただしバッテリーセーバーが有効だと、120Hz対応の端末でも60Hzに制限されることがあります。省電力モードをオフにして測定してください。',
    },
  ],
  en: [
    {
      question: 'My monitor is 144Hz but it shows 60Hz.',
      answer:
        'The OS display setting may still be at 60Hz, the cable or port (e.g. an older HDMI standard) may not support the higher rate, or a power-saving mode may be capping it. Check your OS settings and connection.',
    },
    {
      question: 'Why is the value slightly off, like 59.9Hz or 143.8Hz?',
      answer:
        'Many "60Hz" standards are really 59.94Hz, and measurement adds an error of a few percent. The tool shows the closest standard rate within tolerance as "Closest standard rate".',
    },
    {
      question: 'The value is unstable and jumps around.',
      answer:
        'On variable refresh rate (VRR) displays the value changes with load. Heavy load from other tabs or apps also causes dropped frames and noisy readings, so close other work, press Reset and measure again.',
    },
    {
      question: 'Can I measure a phone?',
      answer:
        'Yes. Note that with battery saver on, even a 120Hz-capable phone may be limited to 60Hz. Turn power-saving mode off before measuring.',
    },
  ],
};
