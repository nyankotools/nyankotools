import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '空白や記号を無視してアナグラム判定できますか？',
      answer:
        'できます。「空白を無視する」と「記号・句読点を無視する」を初期でオンにしているので、「Dormitory」と「Dirty room」のような組み合わせも一致します。区別したいときはチェックを外してください。',
    },
    {
      question: 'カタカナとひらがなは同じ文字として比べられますか？',
      answer:
        'はい。「カタカナとひらがなを同じとみなす」がオンなら、「しんぶんし」と「ブンシシン」はアナグラムと判定されます。濁点だけが違う語まで比べたいときは、「濁点・半濁点を無視する」もオンにします。',
    },
    {
      question: 'アナグラムにならないとき、何が足りないか分かりますか？',
      answer:
        '不一致の場合は、Aにだけ多い文字とBにだけ多い文字を個数つきで表示します。どの文字を足したり減らしたりすればよいかの手がかりになります。',
    },
    {
      question: '「ー」（長音）はどう扱われますか？',
      answer:
        '初期設定では1文字として比べます。「ラーメン」と「メーラン」のように長音も含めて並べ替えるなら、そのままで構いません。読みだけで比べたいときは「長音「ー」を無視する」をオンにしてください。',
    },
  ],
  en: [
    {
      question: 'Can I check anagrams while ignoring spaces and punctuation?',
      answer:
        'Yes. "Ignore spaces" and "Ignore punctuation and symbols" are on by default, so pairs like "Dormitory" and "Dirty room" match. Uncheck them if you want an exact comparison.',
    },
    {
      question: 'Can katakana and hiragana be treated as the same letters?',
      answer:
        'Yes. With "Treat katakana and hiragana as the same" on, "しんぶんし" and "ブンシシン" count as anagrams. To also compare words that differ only by dakuten marks, turn on "Ignore dakuten and handakuten marks".',
    },
    {
      question: 'If two words are not anagrams, can I see what differs?',
      answer:
        'Yes. The tool lists the letters that appear more often in A and those that appear more often in B, with counts, so you can see which letters to add or remove.',
    },
    {
      question: 'How is the long vowel mark "ー" handled?',
      answer:
        'By default it is compared as a normal character, so "ラーメン" can be rearranged along with its mark. To compare by sound only, turn on "Ignore the long vowel mark".',
    },
  ],
};
