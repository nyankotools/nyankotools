import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '答えとヒントはどう入力しますか？',
      answer:
        '1行に1問、「答え:ヒント」の形で入力します。区切りは、最初に現れるコロン・カンマ・読点・タブのいずれかです。ヒントを省略した行は、答えだけが盤面に使われます。例: 「ねこ:ニャーと鳴くペット」。',
    },
    {
      question: '置けなかった言葉が出るのはなぜですか？',
      answer:
        'クロスワードは言葉どうしを同じ文字で交差させて並べるため、他のどの言葉とも共通する文字がない言葉は配置できません。同じ文字を含む言葉を増やすか、その言葉を入れ替えてください。置けなかった言葉は作成後のメッセージに表示されます。',
    },
    {
      question: '問題用紙と答え用紙を両方印刷するには？',
      answer:
        '「答えを表示」をオフにして印刷し、そのままオンに切り替えて印刷すると、同じパズルの問題用紙と答え用紙を作れます。「パズルを作る」を押すと別の配置になるため、2回の印刷の間は押さないでください。',
    },
    {
      question: '盤面の大きさを指定できますか？',
      answer:
        '盤面の大きさは、入力した言葉の数と長さに応じて自動で決まります。何度か配置を試して、置ける言葉が多く、できるだけ小さく収まるものを選んでいます。大きさを変えたいときは、言葉の数や長さを増減してください。',
    },
    {
      question: '漢字や英単語でも作れますか？',
      answer:
        'はい。ひらがな・カタカナ・漢字・英字のどれでも使えます。1文字が1マスになるので、漢字の熟語なら1文字ずつ入ります。英字は大文字に、全角英数は半角にそろえます。ただし、ひらがなどうし、カタカナどうしのように同じ文字種の方が交差しやすくなります。',
    },
  ],
  en: [
    {
      question: 'How do I enter answers and clues?',
      answer:
        'Enter one entry per line as "answer:clue". The first colon, comma or tab separates the two. If you leave the clue out, only the answer is used on the grid. Example: "CAT:A pet that meows".',
    },
    {
      question: 'Why were some words not placed?',
      answer:
        'A crossword interlocks words at shared letters, so a word that has no letter in common with any other word cannot be placed. Add words that share letters with it, or replace it. Words that could not be placed are named in the message shown after generation.',
    },
    {
      question: 'How do I print a worksheet and an answer key?',
      answer:
        'Print with "Show answer" off, then tick it and print again to get the answer key of the same puzzle. Do not press "Generate puzzle" between the two prints, because that creates a different layout.',
    },
    {
      question: 'Can I choose the grid size?',
      answer:
        'The grid size is decided from the number and length of your words. The tool tries many layouts and keeps the one that places the most words in the smallest area. To change the size, add or remove words or make them longer or shorter.',
    },
    {
      question: 'Can I use words in Japanese or other languages?',
      answer:
        'Yes. Latin letters, hiragana, katakana, kanji and other characters all work, with one character per cell. Letters are converted to upper case and full-width letters to half-width. Words interlock best when they share many letters.',
    },
  ],
};
