import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '同じ番号が二度出ることはありますか？',
      answer:
        'ありません。まだ出ていない番号の中から1つずつ抽選し、出た番号は山から取り除きます。すべて出たあとは「リセット」で最初からやり直せます。',
    },
    {
      question: '番号の範囲は75以外にも変えられますか？',
      answer:
        '抽選機は5〜100の範囲で変更できます。範囲を変えると最初からやり直しになります。なお、カードは標準の75ボール形式（B=1〜15 … O=61〜75）固定です。',
    },
    {
      question: 'ビンゴカードを人数分印刷するには？',
      answer:
        '枚数を入力して「カードを作る」を押し、「印刷する」でブラウザの印刷画面を開きます。印刷されるのはカードだけです。罫線が薄いときは「背景のグラフィック」をオンにしてください。1回に作れるのは最大100枚です。',
    },
    {
      question: '全画面表示や音が使えません。',
      answer:
        '全画面表示はブラウザが対応している場合のみ動作し、非対応だと何も起こりません。音は短いビープ音で、既定ではオフです。「音を鳴らす」をオンにしても、端末のマナーモードや音量が小さいと聞こえないことがあります。',
    },
    {
      question: 'ページを再読み込みしたら履歴が消えました。',
      answer:
        '出た番号の履歴は画面の中だけで保持しており、再読み込みやタブを閉じると消えます。大会の途中ではページを閉じないでください。',
    },
  ],
  en: [
    {
      question: 'Can the same number be called twice?',
      answer:
        'No. Each draw picks from the numbers that have not been called yet and removes the result from the pool. Once every number is out, press Reset to begin a new game.',
    },
    {
      question: 'Can I use a range other than 1–75?',
      answer:
        'The caller accepts a range from 5 to 100, and changing it restarts the game. The printable cards always use the standard 75-ball layout (B is 1–15 through O is 61–75).',
    },
    {
      question: 'How do I print a card for every guest?',
      answer:
        'Enter the number of cards, press “Generate cards”, then “Print” to open the print dialog. Only the cards are printed. If the grid lines look faint, turn on “Background graphics”. You can make up to 100 cards at a time.',
    },
    {
      question: 'Full screen or sound does not work.',
      answer:
        'Full screen works only in browsers that support it; elsewhere the button does nothing. Sound is a short beep and is off by default. Even when turned on, a muted device or low volume can keep it silent.',
    },
    {
      question: 'I reloaded the page and the history disappeared.',
      answer:
        'The call history lives only on the page, so reloading or closing the tab clears it. Keep the tab open until the game is over.',
    },
  ],
};
