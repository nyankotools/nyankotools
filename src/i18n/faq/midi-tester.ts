import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'どのブラウザでMIDI機器を確認できますか？',
      answer:
        'Web MIDIに対応しているChrome・Edge・Operaなどで使えます（PCとAndroid）。Firefoxは許可の仕組みが異なり、使えない場合があります。iPhone・iPadを含むSafariは非対応です。未対応のブラウザでは、このページに未対応である旨が表示されます。',
    },
    {
      question: '「MIDI機器に接続」を押しても機器が表示されません。',
      answer:
        '機器の電源とUSBケーブルを確認し、ブラウザのMIDI許可が「ブロック」になっていないか確認してください。DAWなど他のアプリが機器を占有していると、ブラウザから見えないことがあります。他のアプリを閉じてから、ページを再読み込みして接続し直してください。',
    },
    {
      question: '許可を求められるのはなぜですか？ HTTPSが必要な理由は？',
      answer:
        'MIDI機器は外部のハードウェアなので、ブラウザは使う前にユーザーの許可を求めます。また、安全のためHTTPSのページでしか使えません。ここで受け取ったメッセージはブラウザの画面に表示するだけで、サーバーには送信されません。',
    },
    {
      question: 'ログにMIDIクロックが出ないのはなぜですか？',
      answer:
        'MIDIクロックやアクティブセンシングは1秒間に何十回も届き、本来確認したいノートやCCが流れてしまうため、初期設定では非表示にしています。「MIDIクロックなど連続メッセージも表示」にチェックを入れると表示されます。',
    },
    {
      question: 'ベロシティ0のノートオンが「ノートオフ」と表示されます。',
      answer:
        'MIDIではベロシティ0のノートオンをノートオフとして扱うのが一般的な決まりで、多くのキーボードがこの形でキーを離したことを伝えます。このページでもそれに合わせて「ノートオフ」と表示しています。',
    },
  ],
  en: [
    {
      question: 'Which browsers can test MIDI devices?',
      answer:
        'Chrome, Edge, Opera and other browsers with Web MIDI support, on desktop and Android. Firefox handles permission differently and may not work, and Safari (including iPhone and iPad) is not supported. In an unsupported browser this page tells you so.',
    },
    {
      question: 'My device is not listed after I press "Connect MIDI devices".',
      answer:
        'Check the device power and USB cable, and make sure MIDI is not blocked in the browser site settings. If another app such as a DAW has taken over the device, the browser may not see it. Close that app, reload the page and connect again.',
    },
    {
      question: 'Why does it ask for permission, and why HTTPS?',
      answer:
        'A MIDI device is external hardware, so the browser asks before a page can use it, and it only allows this on secure HTTPS pages. Messages are only displayed on screen and never sent to a server.',
    },
    {
      question: 'Why do I not see MIDI clock messages?',
      answer:
        'MIDI clock and active sensing arrive dozens of times per second and would bury the notes and CC messages you want to check, so they are hidden by default. Tick "Also show MIDI clock and other frequent messages" to see them.',
    },
    {
      question:
        'A Note On with velocity 0 is shown as Note Off. Is that a bug?',
      answer:
        'No. By MIDI convention a Note On with velocity 0 means Note Off, and many keyboards release keys that way. This page shows it as Note Off to match.',
    },
  ],
};
