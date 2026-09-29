import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'カメラの映像は録画・保存されますか？',
      answer:
        'いいえ。映像も音声も録画や保存はされず、ページを閉じるか停止すると破棄されます。すべてブラウザ内で処理され、外部に送信されることもありません。',
    },
    {
      question: 'カメラが映らないときは何を確認すればよいですか？',
      answer:
        '初回はブラウザから使用許可を求められるので「許可」を選んでください。すでに拒否した場合はブラウザのサイト設定で許可し直し、他のアプリがカメラを使用していないかも確認してください。',
    },
    {
      question: '表示される解像度やFPSは正確ですか？',
      answer:
        '解像度は指定した値が必ず得られるわけではなく、カメラが対応する最も近い値になります。フレームレートは実測値で、暗い場所ではカメラが自動的に下げることがあります。',
    },
  ],
  en: [
    {
      question: 'Is the camera feed recorded or saved?',
      answer:
        'No. Neither video nor audio is recorded or stored, and both are discarded when you stop or close the page. Nothing is sent externally.',
    },
    {
      question: 'What should I check if the camera does not appear?',
      answer:
        'Allow camera access when the browser asks. If you already blocked it, re-enable it in the site settings, and make sure no other app is using the camera.',
    },
    {
      question: 'Are the displayed resolution and FPS accurate?',
      answer:
        'The camera provides the closest resolution it supports, not always the requested one. Frame rate is measured live and may drop in dim lighting.',
    },
  ],
};
