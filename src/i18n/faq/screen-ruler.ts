import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'なぜクレジットカードで校正するのですか？',
      answer:
        'ブラウザは画面の実際の大きさ（インチ）を取得できないため、物差しになる実物が必要です。クレジットカードやキャッシュカード、運転免許証はISO/IEC 7810 ID-1という規格で85.60×53.98mmに揃っているので、手元にあれば基準にできます。',
    },
    {
      question: '表示される定規はどのくらい正確ですか？',
      answer:
        'カードと枠を目で合わせる精度に左右され、誤差は1mm前後と考えてください。校正を終えたあとは、cm・インチの目盛りはその値から計算して描くため、長いほど校正時の誤差が拡大されます。精密な測定には実物の定規を使ってください。',
    },
    {
      question: 'ブラウザのズームを変えると定規はどうなりますか？',
      answer:
        'ズームを変えるとCSSピクセルの大きさが変わるため、実寸がずれます。校正したときと同じ倍率で使うか、倍率を変えたあとで枠をカードに合わせ直してください。',
    },
    {
      question: '校正値はどこに保存されますか？',
      answer:
        'お使いのブラウザのlocalStorageにだけ保存され、サーバーには送信されません。別のブラウザや別の端末、外部モニターに移した場合は、それぞれで校正し直してください。',
    },
  ],
  en: [
    {
      question: 'Why calibrate with a credit card?',
      answer:
        "A browser cannot read your screen's real size in inches, so you need a physical reference. Credit cards, bank cards and many driver's licenses follow ISO/IEC 7810 ID-1 at 85.60 × 53.98 mm, so any of them works.",
    },
    {
      question: 'How accurate is the ruler?',
      answer:
        'It depends on how well you match the card to the frame; expect an error of about 1 mm. After calibration the cm and inch ticks are calculated from that value, so a calibration error grows over longer distances. Use a physical ruler for precise measurements.',
    },
    {
      question: 'What happens if I change the browser zoom?',
      answer:
        'Zooming changes the size of a CSS pixel, so the real-world size shifts. Use the ruler at the zoom level you calibrated at, or match the frame to your card again after changing it.',
    },
    {
      question: 'Where is my calibration stored?',
      answer:
        "Only in your browser's localStorage; it is never sent to a server. If you switch to another browser, device or external monitor, calibrate again there.",
    },
  ],
};
