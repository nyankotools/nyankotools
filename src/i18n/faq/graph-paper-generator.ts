import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '印刷したらマスの大きさがずれます。',
      answer:
        '印刷ダイアログの倍率が「ページに合わせる」「用紙に合わせて縮小」になっていると、全体が縮小されてマスの寸法が変わります。倍率を「100%（実際のサイズ）」にして印刷してください。',
    },
    {
      question: '5mm方眼や7mm罫線など、市販ノートと同じ寸法にできますか？',
      answer:
        '「マス・行間（mm）」に5や7などの値を入力すると、その寸法で作成できます。0.5mm単位で指定でき、方眼は2〜50mmまで対応しています。',
    },
    {
      question: '用紙の端が印刷で欠けてしまいます。',
      answer:
        'プリンターには機種ごとに印刷できない縁があります。「余白（mm）」を5〜10mm程度にすると、端まで線が欠けずに印刷できます。',
    },
    {
      question: '原稿用紙風を選ぶと400字詰め原稿用紙になりますか？',
      answer:
        '外枠つきのマス目を作るもので、20×20の400字詰め原稿用紙とは行間・欄外の作りが異なります。マスの大きさに応じて、用紙に収まる数のマスが並びます。',
    },
  ],
  en: [
    {
      question: 'The printed cells are the wrong size. Why?',
      answer:
        'If the print dialog is set to “fit to page” or “shrink to fit”, the whole sheet is scaled and the cell size changes. Set the scale to 100% (actual size) before printing.',
    },
    {
      question:
        'Can I match common notebook sizes such as 5 mm grid or 7 mm ruling?',
      answer:
        'Yes. Enter 5 or 7 under “Cell / line spacing (mm)”. You can use steps of 0.5 mm, from 2 up to 50 mm.',
    },
    {
      question: 'The edges of the sheet get cut off when printing.',
      answer:
        'Every printer has an unprintable border that varies by model. Set the margin to about 5–10 mm so the lines are not clipped at the edges.',
    },
    {
      question: 'Does the boxed manuscript type give me a 400-character sheet?',
      answer:
        'It draws a bordered grid that fits as many whole cells as the paper allows, so it is not an exact copy of a 20×20 Japanese manuscript sheet.',
    },
  ],
};
