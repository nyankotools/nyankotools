import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '撮影した画像はサーバーに送信されますか？',
      answer:
        'いいえ。撮影も画像の生成もブラウザの中だけで行われます。ダウンロードやコピーをしない限り外部へ出ることはなく、ページを閉じると消えます。',
    },
    {
      question: '撮影のたびに画面共有の許可が必要なのはなぜですか？',
      answer:
        'ブラウザの仕様で、Webページが画面を取得するには毎回ユーザーの許可が必要です。このツールは1フレームだけ取得するとすぐ共有を停止するため、共有中の表示は撮影直後に消えます。',
    },
    {
      question: 'スマートフォンでも撮影できますか？',
      answer:
        '多くのスマートフォンのブラウザは画面の撮影（getDisplayMedia）に対応していないため使えません。端末標準のスクリーンショット機能をご利用ください。PC版のChrome・Edge・Firefox・Safariなら使えます。',
    },
    {
      question: 'メニューやホバー表示を撮るにはどうすればいいですか？',
      answer:
        '「撮影までの待ち時間」を3〜10秒に設定して「撮影する」を押し、画面を選んだあとに撮りたい状態を作ってください。待ち時間が過ぎた瞬間の画面が撮影されます。',
    },
    {
      question: '撮影した画像に、このページが写り込みますか？',
      answer:
        '画面全体やこのタブを選んだ場合は写ります。他のウィンドウやタブを選べば写りません。写り込みの扱いはブラウザによって異なります。',
    },
  ],
  en: [
    {
      question: 'Is my screenshot sent to a server?',
      answer:
        'No. Capturing and building the image happen entirely in your browser. It goes nowhere unless you download or copy it, and it disappears when you close the page.',
    },
    {
      question: 'Why do I have to allow screen sharing every time?',
      answer:
        'Browsers require your permission each time a web page captures the screen. This tool grabs a single frame and stops sharing immediately, so the sharing indicator disappears right after the shot.',
    },
    {
      question: 'Does it work on a phone?',
      answer:
        'Most phone browsers do not support screen capture (getDisplayMedia), so it will not work there. Use your device’s built-in screenshot feature instead. Desktop Chrome, Edge, Firefox and Safari work.',
    },
    {
      question: 'How do I capture a menu or a hover state?',
      answer:
        'Set "Delay before capture" to 3-10 seconds, press "Take screenshot", pick the screen, then open the menu or hover the element. The screen as it looks when the delay ends is captured.',
    },
    {
      question: 'Will this page show up in my screenshot?',
      answer:
        'It will if you pick the whole screen or this tab. Choose another window or tab and it will not. How this is handled can differ between browsers.',
    },
  ],
};
