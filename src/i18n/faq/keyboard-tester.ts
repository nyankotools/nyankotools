import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '入力したキーの内容は保存・送信されますか？',
      answer:
        'いいえ。押したキーは画面の表示にだけ使われ、サーバーへの送信や保存はされません。ページを閉じる・結果をリセットすると消えます。',
    },
    {
      question: 'F5やスペースキーを押してもページが動かないのはなぜですか？',
      answer:
        'キーを正しく判定するため、テスト中はF5（再読み込み）やスペース（スクロール）などブラウザの標準動作を無効にしています。図の外側をクリックするとテストが止まり、通常の動作に戻ります。',
    },
    {
      question: 'Windowsキー・PrintScreen・Fnキーが反応しません。',
      answer:
        'これらはOSやキーボード本体が先に処理して、ブラウザに信号が届かないことがあります。特にFnキーは多くのキーボードで単体では検出できません。PrintScreenは離したときだけ検出される環境もあります。',
    },
    {
      question: 'JISキーボードですが、一部のキーが図にありません。',
      answer:
        '図は英字（ANSI）配列のフルサイズ配置です。JIS配列の「¥」「ろ」「無変換」「変換」「カタカナひらがな」などは、押すと「配置図にないキー」の欄にキー名とコードが表示され、反応していることを確認できます。',
    },
  ],
  en: [
    {
      question: 'Is what I type saved or sent anywhere?',
      answer:
        'No. Pressed keys are only used to draw the on-screen display and are never uploaded or stored. They disappear when you close the page or reset the results.',
    },
    {
      question: 'Why do F5 and Space not work on the page while testing?',
      answer:
        'To detect keys reliably, browser defaults such as F5 (reload) and Space (scroll) are disabled during the test. Click outside the diagram to stop the test and get normal behavior back.',
    },
    {
      question: 'The Windows key, PrintScreen or Fn key does not respond.',
      answer:
        'The operating system or the keyboard itself may handle these before the browser sees them. The Fn key in particular cannot be detected on its own on most keyboards, and PrintScreen is sometimes detected only when released.',
    },
    {
      question:
        'I have a Japanese (JIS) keyboard and some keys are not on the diagram.',
      answer:
        'The diagram is a full-size ANSI layout. JIS-only keys such as ¥, Ro, Muhenkan, Henkan and Katakana/Hiragana show their key name and code under "Keys not on the diagram" when pressed, so you can confirm they work.',
    },
  ],
};
