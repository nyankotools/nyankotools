import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '漢字や英単語でも作れますか？',
      answer:
        'はい。ひらがな・カタカナ・漢字・英字のどれでも入力できます。ひらがな・カタカナ・英字の語なら空きマスを同じ文字種で埋め、漢字などを含む場合は入力した言葉に使われている文字で埋めます。英字は大文字に、全角英数は半角にそろえます。',
    },
    {
      question: '置けなかった言葉が出るのはなぜですか？',
      answer:
        'マス数より長い言葉は置けません。また、言葉の数が多くてマス数が小さいと、置き場所がなくなる言葉が出ます。その場合は、マス数を大きくするか、言葉の数や長さを減らしてください。置けなかった言葉は一覧には表示されず、作成後のメッセージに出ます。',
    },
    {
      question: '答え付きと答えなしの2種類を印刷するには？',
      answer:
        '「答えを表示」をオフにして印刷し、そのままオンに切り替えて印刷すると、同じパズルの問題用紙と答え用紙を作れます。「パズルを作る」を押すと別の配置になるため、2回の印刷の間は押さないでください。',
    },
    {
      question: '同じ言葉が別の場所にも見つかってしまうことはありますか？',
      answer:
        '空きマスを埋める文字は、言葉と同じ並びができないようにできるだけ選び直しています。ただし、複数の言葉が交差して偶然できる並びまでは避けられないことがあります。気になる場合は「パズルを作る」を押し直してください。',
    },
    {
      question: 'クロスワードは作れますか？',
      answer:
        'このツールで作れるのはワードサーチ（言葉探し）です。クロスワードは別ツールの「クロスワード作成」で、答えとヒントを入れるだけで作れます。',
    },
  ],
  en: [
    {
      question: 'Can I use words in Japanese or other languages?',
      answer:
        'Yes. Latin letters, hiragana, katakana, kanji and other characters all work. For Latin letters, hiragana or katakana the empty cells are filled with the same kind of characters; otherwise they are filled with characters taken from your words. Letters are converted to upper case and full-width letters to half-width.',
    },
    {
      question: 'Why were some words not placed?',
      answer:
        'A word longer than the grid cannot be placed, and a small grid crowded with words can run out of room. Increase the grid size or use fewer or shorter words. Words that could not be placed are named in the message shown after generation.',
    },
    {
      question: 'How do I print a worksheet and an answer key?',
      answer:
        'Print with "Show answer" off, then tick it and print again to get the answer key of the same puzzle. Do not press "Generate puzzle" between the two prints, because that creates a different layout.',
    },
    {
      question: 'Can a word appear in more than one place?',
      answer:
        'The filler letters are re-rolled to avoid creating an extra copy of any word. A copy that happens to be formed by overlapping words can still occur in rare cases; press "Generate puzzle" again if you want a different layout.',
    },
    {
      question: 'Can it make crosswords?',
      answer:
        'This tool makes word search puzzles only. For crosswords, use the separate Crossword Generator, which builds a puzzle from your answers and clues.',
    },
  ],
};
