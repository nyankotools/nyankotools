import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'event.keyとevent.codeの違いは何ですか？',
      answer:
        'event.keyは入力される文字や意味（例: "a"）を表し、キーボード配列や修飾キーで変わります。event.codeは物理的なキーの位置（例: "KeyA"）を表し、配列に依存しません。ゲームのキー操作ではcodeが向いています。',
    },
    {
      question: 'keyCodeは使ってもよいですか？',
      answer:
        'keyCodeは非推奨です。新しいコードではevent.keyまたはevent.codeを使うことが推奨されています。このツールでは古いコードの動作確認用に表示しています。',
    },
    {
      question:
        '日本語入力中に押したキーが「Process」と表示されるのはなぜですか？',
      answer:
        'IMEで変換中に押したキーは、環境によってevent.keyが「Process」などの特殊な値になるためです。入力エリアにフォーカスしたうえでIMEをオフにして試してください。',
    },
  ],
  en: [
    {
      question: 'What is the difference between event.key and event.code?',
      answer:
        'event.key is the meaning of the key press (for example "a") and changes with layout and modifiers. event.code is the physical key position (for example "KeyA") and is layout-independent, which suits game controls.',
    },
    {
      question: 'Should I still use keyCode?',
      answer:
        'keyCode is deprecated. Use event.key or event.code in new code. The tool shows it only to help with checking legacy code.',
    },
    {
      question: 'Why does a key pressed during IME input show "Process"?',
      answer:
        'While an IME is composing, event.key can become a special value such as "Process". Focus the input area and turn the IME off to see the raw key.',
    },
  ],
};
