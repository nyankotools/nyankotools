import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '手数とタイムはどう数えますか？',
      answer:
        '手数は、カードを2枚めくるごとに1手です。タイムは最初の1枚をめくった瞬間から、最後のペアが揃うまでの時間です。「新しいゲーム」を押した直後は、カードをめくるまで時間は進みません。',
    },
    {
      question: '難易度ごとのカード枚数とペア数は？',
      answer:
        '簡単は12枚（6ペア）、普通は16枚（8ペア）、難しいは30枚（15ペア）です。毎回、用意した絵文字の中からペア数分をランダムに選んで配置するため、同じ配置が続くことはほぼありません。',
    },
    {
      question: 'ベスト記録はどこに保存されますか？',
      answer:
        'お使いのブラウザのローカルストレージに、難易度ごとの最少手数と最短タイムを保存します。サーバーには送信されません。そのため、ブラウザのデータを消去したり、別の端末・ブラウザで開いたりすると記録は引き継がれません。',
    },
    {
      question: '手数とタイムは別々に更新されますか？',
      answer:
        'はい。たとえば手数が過去最少でもタイムが遅ければ、手数のベストだけが更新されます。手数とタイムは同じゲームの結果である必要はなく、それぞれの自己ベストを個別に保持します。',
    },
    {
      question: '不一致のカードが裏返る前に次のカードを押すとどうなりますか？',
      answer:
        '待たずに次のカードを押せます。見えていた2枚はすぐに裏返り、押したカードが新しい1枚目としてめくれます。テンポよく進めたいときに便利です。',
    },
  ],
  en: [
    {
      question: 'How are moves and time counted?',
      answer:
        'One move is counted each time you flip two cards. The time runs from the moment you flip the first card until the last pair is matched. After you press “New game”, the clock does not start until you flip a card.',
    },
    {
      question: 'How many cards and pairs does each difficulty have?',
      answer:
        'Easy has 12 cards (6 pairs), Medium has 16 (8 pairs) and Hard has 30 (15 pairs). The pictures for each game are picked at random from a larger set, so you are very unlikely to get the same layout twice.',
    },
    {
      question: 'Where are my best records stored?',
      answer:
        'In your browser’s local storage, as the fewest moves and shortest time for each difficulty. They are not sent to any server, so clearing site data or opening the page in another browser or device starts you from scratch.',
    },
    {
      question: 'Are best moves and best time updated separately?',
      answer:
        'Yes. If you set a new low move count but finish slower than your best time, only the moves record changes. The two records do not have to come from the same game.',
    },
    {
      question: 'What if I click again before a mismatched pair flips back?',
      answer:
        'You do not have to wait. The two visible cards flip back immediately and the card you clicked becomes your new first card, which keeps the pace quick.',
    },
  ],
};
