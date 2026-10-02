import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '「ん」はどう入力すればいいですか？',
      answer:
        "語末や子音の前（かんぱい の kan など）は n だけで「ん」になります。母音や y の前（かんい、ほんや など）は、「kan'i」のようにアポストロフィを付けるか、nn と重ねます。「こんにちは」の konnichiwa のように、「ん」のあとに「に」が続く場合も nn と重ねて入力します。",
    },
    {
      question: 'ヘボン式と訓令式はどちらを選べばいいですか？',
      answer:
        'パスポートの氏名や駅名表示など、一般にはヘボン式（shi, chi, tsu）が使われます。訓令式（si, ti, tu）は学校教育や公文書の一部で使われます。迷ったらヘボン式を選んでください。',
    },
    {
      question: '「こんにちは」が konnichiwa にならないのはなぜですか？',
      answer:
        '助詞の「は」を ha、「を」を o と機械的に変換するためです。あいさつの「こんにちは」を konnichiwa と書きたい場合は、結果を手で直してください。',
    },
    {
      question: '長音（ー）をマクロンにしたくないときはどうしますか？',
      answer:
        '「長音（ー）の書き方」で、母音を重ねる（aa）・ハイフン（a-）・省略（a）から選べます。マクロン付きの文字（ā ī ū ē ō）は、ローマ字→かなの入力にも使えます。',
    },
    {
      question: '漢字は変換できますか？',
      answer:
        'できません。漢字の読みを調べる機能はなく、漢字はそのまま残ります。読みを知っている場合は、ひらがなで入力してください。',
    },
  ],
  en: [
    {
      question: 'How do I type ん in romaji?',
      answer:
        "At the end of a word or before a consonant (the n in kanpai), a single n gives ん. Before a vowel or y (as in かんい or ほんや), write n' (kan'i) or double the n. When ん is followed by に, as in konnichiwa, double the n as well.",
    },
    {
      question: 'Should I use Hepburn or Kunrei-shiki?',
      answer:
        'Hepburn (shi, chi, tsu) is what passports, station signs and most English-language material use. Kunrei-shiki (si, ti, tu) is taught in schools and used in some government documents. If unsure, choose Hepburn.',
    },
    {
      question: 'Why does こんにちは not become konnichiwa?',
      answer:
        'The tool mechanically writes the particle は as ha and を as o. If you want the greeting spelling konnichiwa, edit the result by hand.',
    },
    {
      question: 'Can I avoid macrons for long vowels?',
      answer:
        'Yes. Under "Long vowel mark" choose a doubled vowel (aa), a hyphen (a-) or omit it (a). Macron letters (ā ī ū ē ō) are also accepted as input in the romaji → kana direction.',
    },
    {
      question: 'Does it convert kanji?',
      answer:
        'No. It has no reading dictionary, so kanji are left as they are. If you know the reading, type it in hiragana.',
    },
  ],
};
