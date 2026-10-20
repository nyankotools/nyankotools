import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '音が鳴りません。',
      answer:
        'ブラウザの仕様で、ページを開いただけでは音を出せません。鍵盤をクリック・タップするか、キーボードを一度押してください。それでも鳴らない場合は、端末の音量、マナーモード、ブラウザのタブのミュート設定を確認してください。',
    },
    {
      question: 'パソコンのキーボードのどのキーがどの音ですか？',
      answer:
        '下段の Z S X D C V G B H N J M が一番左のドから1オクターブ分（黒鍵は S D G H J）、上段の Q 2 W 3 E R 5 T 6 Y 7 U … P がその1オクターブ上から続きます。「キー割り当てを表示」にチェックを入れると、各鍵にキー名が表示されます。キーの位置で判定するため、日本語配列でも英語配列でも同じ位置で鳴ります。',
    },
    {
      question: 'キーボードで和音を弾くと音が抜けます。',
      answer:
        'キーボードの仕組み上、同時に押せるキーの数や組み合わせに制限があります（ゴースト・キー対策）。多くのノートPCは3〜6キー程度です。和音は画面の鍵盤を複数の指でタッチするか、ゲーミングキーボードなど同時押しに強いキーボードで試してください。',
    },
    {
      question: '音色の違いは何ですか？',
      answer:
        '「ピアノ風」は基音に倍音を重ねて、押した直後が大きく徐々に減衰する音にしています。「サイン波」は倍音のない純粋な音、「矩形波」と「のこぎり波」は電子音らしい硬い・明るい音です。いずれもブラウザ内で合成した音で、実際のピアノの録音ではありません。',
    },
    {
      question: 'ブラウザのショートカット（Ctrl+C など）は使えますか？',
      answer:
        'はい。Ctrl・Alt・Command を押しながらのキーは演奏として扱わないので、コピーや再読み込みなどのショートカットは通常どおり使えます。ページ内の入力欄や選択欄にカーソルがあるときも、文字入力を優先します。',
    },
  ],
  en: [
    {
      question: 'I hear no sound.',
      answer:
        'Browsers do not allow audio until you interact with the page, so click or tap a key, or press a key on your keyboard, once. If it is still silent, check the device volume, silent mode and whether the browser tab is muted.',
    },
    {
      question: 'Which computer keys play which notes?',
      answer:
        'The bottom row Z S X D C V G B H N J M plays the first octave starting from the leftmost C (the black keys are S D G H J), and the top row Q 2 W 3 E R 5 T 6 Y 7 U … P continues one octave higher. Tick "Show keyboard shortcuts" to see the key on each piano key. Keys are matched by physical position, so QWERTY and other layouts play the same notes.',
    },
    {
      question: 'Some notes drop out when I play a chord on the keyboard.',
      answer:
        'Keyboards limit how many keys, and which combinations, can be pressed at once (ghosting protection); many laptops allow only about 3 to 6. Play chords by touching several on-screen keys with different fingers, or use a gaming keyboard that handles many simultaneous keys.',
    },
    {
      question: 'What is the difference between the sounds?',
      answer:
        '"Piano-like" stacks overtones on the fundamental and fades gradually after a sharp start. "Sine" is a pure tone with no overtones, while "Square" and "Sawtooth" are the harder and brighter tones of electronic instruments. All are synthesised in your browser, not recorded from a real piano.',
    },
    {
      question: 'Do browser shortcuts such as Ctrl+C still work?',
      answer:
        'Yes. Keys pressed together with Ctrl, Alt or Command are not treated as playing, so copy, reload and similar shortcuts work as usual. When the cursor is in a field or menu on the page, typing takes priority over playing.',
    },
  ],
};
