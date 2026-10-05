import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'あみだくじで同じ結果になる人が出ることはありますか？',
      answer:
        'ありません。横線に当たったら必ず曲がる仕組みなので、参加者ごとに別々のゴールにたどり着きます。結果に同じ文字列（はずれなど）を複数入れた場合に、同じ表示になるだけです。',
    },
    {
      question: '結果は本当にランダムですか？',
      answer:
        'ブラウザの暗号用乱数（crypto.getRandomValues）で横線を配置しています。ただし結果が公正であることを第三者に証明する仕組みはないため、懸賞や金銭が絡む抽選には使わないでください。',
    },
    {
      question: '参加者と結果の数が合わないとどうなりますか？',
      answer:
        'エラーが表示され、あみだくじは作られません。参加者と結果を同じ件数にしてください。はずれが多い場合は、「はずれ」を必要な行数だけ入力します。',
    },
    {
      question: '結果を隠したまま1人ずつ引くには？',
      answer:
        '「結果を隠す」をオンにして作成し、引く人の名前を選んで、好きな線（番号）をタップします。辿り終えた線の結果だけが下に表示されます。まだ選んでいない人がいても、「全員分を表示」を押すと残りの線にランダムに割り振って一括表示します。',
    },
    {
      question: '作ったあみだくじを画像で残せますか？',
      answer:
        'PNG画像で保存できます。「画像として保存」はその時点の表示がそのまま保存されるため、結果を隠した状態なら隠れたまま、辿った経路の色も付いたままです。紙に印刷する場合は「印刷用に保存（結果表示・色なし）」を使うと、結果をすべて表示し、経路に色を付けない画像になります。名前は入れず線の番号だけが表示されるので、紙に名前を書き込めます。',
    },
  ],
  en: [
    {
      question: 'Can two players end up at the same outcome?',
      answer:
        'No. You always turn when you meet a rung, so every player reaches a different slot. Two players only see the same text if you typed the same outcome on several lines.',
    },
    {
      question: 'Is the result really random?',
      answer:
        'Rungs are placed using the browser’s cryptographic random numbers (crypto.getRandomValues). There is no way to prove fairness to a third party, so do not use it for sweepstakes or draws involving money.',
    },
    {
      question: 'What happens if the number of players and outcomes differ?',
      answer:
        'An error is shown and no ladder is created. Make both lists the same length; if you need several misses, type “Miss” on as many lines as needed.',
    },
    {
      question: 'How do I draw one player at a time with outcomes hidden?',
      answer:
        'Keep “Hide outcomes” on, create the ladder, and choose who is drawing and tap any numbered line. Only the outcomes of traced lines appear at the bottom. “Reveal everyone” assigns anyone who has not chosen yet to the remaining lines at random and shows all outcomes.',
    },
    {
      question: 'Can I keep the ladder as an image?',
      answer:
        'Yes, as a PNG. “Save as image” captures the current screen, so hidden outcomes stay hidden and traced paths keep their colors. To print on paper, use “Save for printing (outcomes shown, no colors)”, which shows every outcome and leaves the lines uncolored. Names are left off and only line numbers are shown, so players can write their names on paper.',
    },
  ],
};
