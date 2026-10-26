import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ラウンドはどこまで続きますか？',
      answer:
        '間違えるまで続きます。クリアするたびに順番が1つ増え、ラウンドが進むほど光る速さが少しずつ上がります。クリアしたラウンド数がスコアになります。',
    },
    {
      question: '音が鳴りません。どうすればいいですか？',
      answer:
        '「効果音を鳴らす」にチェックが入っているか、端末の音量やマナーモードを確認してください。音は「スタート」を押したあとに生成されるため、押す前は鳴りません。音なしでも光と番号で遊べます。',
    },
    {
      question: '色の区別が難しくても遊べますか？',
      answer:
        'はい。各パネルには色のほか、番号（1〜4）と記号（▲●■◆）を表示しています。また、パネルごとに音の高さが違うので、音でも見分けられます。',
    },
    {
      question: 'キーボードで操作できますか？',
      answer:
        'キーボードの 1〜4 がそれぞれ左上・右上・左下・右下のパネルに対応しています。パネルにフォーカスして Enter や Space で押すこともできます。',
    },
    {
      question: 'ベスト記録はどこに保存されますか？',
      answer:
        'お使いのブラウザのローカルストレージに、クリアしたラウンド数の最高値を保存します。サーバーには送信されないため、ブラウザのデータを消去したり別の端末で開いたりすると引き継がれません。',
    },
  ],
  en: [
    {
      question: 'How long does the game go on?',
      answer:
        'Until you make a mistake. Each cleared round adds one step to the sequence, and the lights get slightly faster as you go. Your score is the number of rounds you cleared.',
    },
    {
      question: 'I cannot hear any sound. What should I check?',
      answer:
        'Make sure "Play sounds" is checked and that your device volume is up and not on silent. Sound is created after you press "Start", so nothing plays before that. You can always play with lights and numbers alone.',
    },
    {
      question: 'Can I play if I have trouble telling colors apart?',
      answer:
        'Yes. Every panel shows a number (1-4) and a symbol (▲ ● ■ ◆) in addition to its color, and each panel has its own pitch, so you can tell them apart by sound too.',
    },
    {
      question: 'Can I play with the keyboard?',
      answer:
        'Keys 1 to 4 map to the top-left, top-right, bottom-left and bottom-right panels. You can also focus a panel and press Enter or Space.',
    },
    {
      question: 'Where is my best record stored?',
      answer:
        'In your browser’s local storage, as the highest number of rounds you have cleared. It is never sent to a server, so clearing site data or using another browser or device starts you from zero.',
    },
  ],
};
