import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ホールドは何回でも使えますか？',
      answer:
        'いいえ。ブロック1つにつき1回までで、そのブロックを置くと再び使えるようになります。ホールドに何も入っていないときは、現在のブロックを取っておいて次のブロックが出てきます。',
    },
    {
      question: '壁際や積み上がった場所でうまく回転できません',
      answer:
        '回転後の形が壁や他のブロックにぶつかるときは、左右・上に少しずらして入れるか試します。それでも入らない狭い場所では回転できません。回してから動かすのではなく、先に広い場所へ動かしてから回すと確実です。',
    },
    {
      question: '得点とレベルはどう決まりますか？',
      answer:
        '1ライン100点・2ライン300点・3ライン500点・4ライン同時800点に、現在のレベルを掛けた点数です。10ライン消すごとにレベルが1上がり、ブロックの落ちる速さが上がります。ソフトドロップとハードドロップでも少しずつ加点されます。',
    },
    {
      question: 'スマホで遊べますか？',
      answer:
        'はい。盤面の下にある「←」「→」「回転」「↓」「落とす」「ホールド」のボタンで操作できます。「←」「→」「↓」は押し続けると連続で動きます。',
    },
    {
      question: 'ベストスコアはどこに保存されますか？',
      answer:
        'このブラウザのローカルストレージにだけ保存され、サーバーには送信されません。ブラウザのデータを消去したり、別の端末・ブラウザで遊んだりすると引き継がれません。',
    },
  ],
  en: [
    {
      question: 'Can I use Hold as many times as I like?',
      answer:
        'No. You can hold once per block; the next time is available after the current block is placed. If the hold slot is empty, the current block is stored and the next one comes in.',
    },
    {
      question: 'I can’t rotate near a wall or in a tight spot',
      answer:
        'When the rotated shape would hit a wall or the stack, the game tries nudging it sideways or up. In a gap that is still too narrow it can’t rotate. Move the block to open space first, then rotate.',
    },
    {
      question: 'How are score and level calculated?',
      answer:
        'Clearing 1 / 2 / 3 lines scores 100 / 300 / 500 and 4 at once scores 800, multiplied by your level. The level goes up every 10 lines and blocks fall faster. Soft drop and hard drop add a few extra points.',
    },
    {
      question: 'Can I play on a phone?',
      answer:
        'Yes. Use the ←, →, Rotate, ↓, Drop and Hold buttons below the board. Holding ←, → or ↓ repeats the move.',
    },
    {
      question: 'Where is my best score stored?',
      answer:
        'Only in this browser’s local storage; nothing is sent to a server. It is not carried over if you clear site data or play on a different browser or device.',
    },
  ],
};
