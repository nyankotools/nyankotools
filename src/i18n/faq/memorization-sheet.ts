import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '赤シートで隠す暗記シートはどう作りますか？',
      answer:
        '覚えたい語を ** で囲んで入力します（例: 日本の首都は**東京**です）。囲んだ語が赤い帯で隠れた状態でプレビューされ、クリックすると答えが赤字で表示されます。',
    },
    {
      question: '隠した状態と答え入りの状態、どちらで印刷できますか？',
      answer:
        '「印刷時の状態」で選べます。語を隠した問題用と、答えを赤字にした解答用を切り替えて印刷できます。画面上で個別に表示している語があっても、印刷の状態は設定どおりになります。',
    },
    {
      question: '赤い帯が印刷で薄くなったり消えたりします。',
      answer:
        'ブラウザが背景色を印刷しない設定になっている可能性があります。印刷ダイアログの詳細設定で「背景のグラフィック」を有効にしてください。空欄（下線）の表示なら背景色に依存しません。',
    },
    {
      question: '語の中に ** そのものを入れたい場合は？',
      answer:
        '閉じていない ** や、中身が空の **** は文字としてそのまま表示されます。**と**の間に語がある場合だけ囲みと解釈されるため、通常の文章でそのまま使えます。',
    },
  ],
  en: [
    {
      question: 'How do I make a red-sheet study sheet?',
      answer:
        'Wrap each term you want to learn in ** (for example, The capital of Japan is **Tokyo**). The preview covers those terms with a red bar, and clicking one reveals the answer in red.',
    },
    {
      question: 'Can I print it with terms hidden or with answers shown?',
      answer:
        'Yes. Pick the print state: terms hidden for the question sheet, or answers in red for the answer key. Terms you revealed on screen do not affect what gets printed.',
    },
    {
      question: 'The red bars look faint or missing when I print.',
      answer:
        'Your browser may be set not to print background colors. Turn on "Background graphics" in the print dialog options. The blank (underline) style does not depend on background colors.',
    },
    {
      question: 'What if my text contains a literal **?',
      answer:
        'An unclosed ** or an empty **** is shown as plain characters. Only a ** pair with at least one character between them counts as a marker, so ordinary text is safe.',
    },
  ],
};
