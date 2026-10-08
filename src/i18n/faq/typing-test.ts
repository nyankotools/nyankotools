import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question:
        'ローマ字入力で「し」を si と shi のどちらで打っても正解になりますか？',
      answer:
        'はい。し（si/shi/ci）、ち（ti/chi）、つ（tu/tsu）、ふ（hu/fu）、じ（zi/ji）など、一般的な打ち方はすべて正解です。「ん」は n・nn・xn、「っ」は子音の重ね打ちか xtu・ltu、小さい「ゃ」は xya・lya などに対応しています。',
    },
    {
      question: '「ん」を n 1回で打てるときと nn が必要なときの違いは？',
      answer:
        '次のかなが母音（あいうえお）・な行・や行のときと、文の最後では nn（または xn）が必要です。それ以外（か行・さ行など）の前なら n 1回で入ります。画面のガイドは迷わないよう、この条件に合う標準的な打ち方を表示します。',
    },
    {
      question: 'WPM と CPM はどう計算していますか？',
      answer:
        '正しく打ったキー数だけを数えます。CPM は正しく打ったキー数 ÷ 経過時間（分）、WPM は 5 キーを 1 語として CPM ÷ 5 です。ミスしたキーは含まれず、やり直しにかかった時間は経過時間に含まれます。日本語もかな数ではなくローマ字の打鍵数で計算します。',
    },
    {
      question: '日本語入力をオンにしたままだと測定できませんか？',
      answer:
        '測定できません。IME がオンだとブラウザにキーが正しく届かないため、半角英数に切り替えてから打ってください。IME が検出されると画面に案内が出ます。',
    },
    {
      question: 'スマホやタブレットでも測れますか？',
      answer:
        '物理キーボードをつないだ場合を前提にしています。画面キーボードは打鍵のイベントが一部の端末で正しく届かず、速度や正確性が正しく測れないことがあります。',
    },
  ],
  en: [
    {
      question: 'In Japanese mode, can I type し as either si or shi?',
      answer:
        'Yes. All common romaji spellings are accepted: し (si/shi/ci), ち (ti/chi), つ (tu/tsu), ふ (hu/fu), じ (zi/ji) and so on. ん takes n, nn or xn, っ takes a doubled consonant or xtu/ltu, and small kana such as ゃ take xya/lya.',
    },
    {
      question: 'When does ん need "nn" and when is a single "n" enough?',
      answer:
        'You need "nn" (or "xn") when the next kana is a vowel, a na-row kana or a ya-row kana, and at the end of a sentence. Before other consonants a single "n" is enough. The on-screen guide shows a standard spelling that fits this rule.',
    },
    {
      question: 'How are WPM and CPM calculated?',
      answer:
        'Only correctly typed keys count. CPM is correct keys divided by the elapsed minutes, and WPM is CPM divided by 5 (five keystrokes make one word). Mistyped keys are excluded, but time spent recovering stays in the elapsed time. Japanese mode also counts romaji keystrokes, not kana.',
    },
    {
      question: 'Does it work with a Japanese IME turned on?',
      answer:
        'Not properly. With an IME on, the browser does not receive the keys as typed, so switch to direct (half-width) input first. A message appears when an IME is detected.',
    },
    {
      question: 'Can I take the test on a phone or tablet?',
      answer:
        'It assumes a physical keyboard. On-screen keyboards on some devices do not send reliable key events, so speed and accuracy may not be measured correctly.',
    },
  ],
};
