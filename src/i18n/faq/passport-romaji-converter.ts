import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '「大野」や「伊藤」の長音はどう書きますか？',
      answer:
        'パスポートのヘボン式では、オ段・ウ段の長音は原則として書かず、大野（おおの）は ONO、伊藤（いとう）は ITO になります。OHNO・ITOH のような OH 表記を希望する場合は、このツールの「OH 表記」に切り替えたうえで、申請前に旅券窓口へ相談してください。',
    },
    {
      question: '「なんば」は NANBA ですか、NAMBA ですか？',
      answer:
        'B・M・P の前の「ん」は M と書くため、なんばは NAMBA、ほんまは HOMMA、さんぺいは SAMPEI になります。それ以外の「ん」は N です。母音や y が続く場合もアポストロフィは付けず、じゅんいちは JUNICHI になります。',
    },
    {
      question: '一般的なローマ字変換ツールとの違いは何ですか？',
      answer:
        '一般的な変換は大野を ōno や oono にしますが、このツールはパスポートの運用に合わせて長音を省略し、「ん」の M 表記やアポストロフィ無しの表記、大文字出力に対応します。汎用の変換が必要なときは「ローマ字⇔ひらがな変換」を使ってください。',
    },
    {
      question: '漢字の名前を入力できますか？',
      answer:
        'できません。漢字の読みを調べる機能はないため、戸籍上の読みをひらがな・カタカナで入力してください。変換できない文字が含まれると警告が出ます。',
    },
    {
      question: 'この結果をそのまま申請に使えますか？',
      answer:
        '参考としての変換結果です。ルールは変更されることがあり、窓口での確認が必要な場合もあります。一度決めた綴りは原則として後から変更できないため、申請前に最新の案内を確認してください。',
    },
  ],
  en: [
    {
      question: 'How are long vowels in names like 大野 or 伊藤 written?',
      answer:
        'In passport Hepburn, long O and U sounds are normally omitted, so 大野 (おおの) is ONO and 伊藤 (いとう) is ITO. If you want an OH spelling such as OHNO or ITOH, switch the option here and discuss it with the passport office before applying.',
    },
    {
      question: 'Is なんば NANBA or NAMBA?',
      answer:
        'ん is written M before B, M and P, so なんば is NAMBA, ほんま is HOMMA and さんぺい is SAMPEI. Otherwise it is N. No apostrophe is used before a vowel or Y, so じゅんいち is JUNICHI.',
    },
    {
      question: 'How is this different from a general romaji converter?',
      answer:
        'A general converter writes 大野 as ōno or oono. This tool follows the passport conventions: long O/U vowels omitted, M before B/M/P, no apostrophes and uppercase output. For general conversion, use the Romaji ⇔ Hiragana Converter.',
    },
    {
      question: 'Can I enter my name in kanji?',
      answer:
        'No. There is no reading dictionary, so enter the official reading in hiragana or katakana. A warning appears if the input contains characters that cannot be converted.',
    },
    {
      question: 'Can I use the result as-is on my application?',
      answer:
        'Treat it as a reference. Rules can change and some cases need confirmation at the passport office. The spelling you choose generally cannot be changed later, so check the latest official guidance first.',
    },
  ],
};
