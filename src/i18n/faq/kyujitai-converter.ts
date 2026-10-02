import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '「髙」や「﨑」も新字体にできますか？',
      answer:
        'できます。「旧字体→新字体」のとき、「髙・﨑・嶋などの異体字も新字体にする」にチェックを入れると、髙→高、﨑→崎、嶋→島のように変換します。',
    },
    {
      question: '新字体から旧字体に変換して、そのまま使えますか？',
      answer:
        '1文字ずつの機械的な置き換えなので、語によっては実際の旧表記と異なります（意味が分かれる「弁・台・予・欠」は変換しません）。公的な書類や名前には、正式な表記を確認してから使ってください。',
    },
    {
      question: '「弁」を旧字体にできないのはなぜですか？',
      answer:
        '「弁」の旧字体は、辨（区別）・辯（言葉）・瓣（花びら）の3つに分かれ、1文字だけでは決められないためです。旧字体→新字体では3つとも「弁」に変換します。',
    },
    {
      question: 'すべての旧字体に対応していますか？',
      answer:
        '主な常用漢字の旧字体と、人名に使われる一部の異体字に対応しています。すべての旧字体・異体字を網羅しているわけではありません。',
    },
  ],
  en: [
    {
      question: 'Can it convert name variants like 髙 and 﨑?',
      answer:
        'Yes. In the "Old → new forms" direction, tick the option for name variants and 髙 becomes 高, 﨑 becomes 崎 and 嶋 becomes 島.',
    },
    {
      question: 'Can I use the new → old result as it is?',
      answer:
        'Characters are replaced one by one, so some words come out wrong (characters with several meanings, 弁 台 予 欠, are skipped). Check the official spelling before using it on official documents or names.',
    },
    {
      question: 'Why is 弁 not converted to an old form?',
      answer:
        '弁 has three old forms, 辨 (distinguish), 辯 (speech) and 瓣 (petal), and one character alone cannot tell which is meant. In the old → new direction all three become 弁.',
    },
    {
      question: 'Does it cover every old kanji form?',
      answer:
        'It covers the old forms of the main jōyō kanji and some variants used in names, but not every old form or variant.',
    },
  ],
};
