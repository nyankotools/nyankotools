import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'RGBからCMYKへの変換結果は、印刷の色と一致しますか？',
      answer:
        '一致しません。このツールのCMYKはICCプロファイルを使わない数式による簡易換算で、画面上のRGBを機械的に置き換えたものです。実際の印刷は用紙やインクで色が変わるため、色合わせは印刷会社やDTPソフトの指定に従ってください。',
    },
    {
      question: 'LabとOKLCHはどう使い分ければよいですか？',
      answer:
        'CSSで色を扱うなら、明るさや色相を調整しても見た目の明るさが揃いやすいOKLCHが向いています。色の差を測る用途や、既存のLab値を扱う場合はLabを使います。本ツールのLabはCSSのlab()と同じD50基準です。',
    },
    {
      question:
        'LabやOKLCHの値を入れると「丸めた」と表示されるのはなぜですか？',
      answer:
        'LabやOKLCHには、sRGBのディスプレイでは表示できない鮮やかな色も含まれます。そのような値は最も近い表示可能な色に丸めて他の形式に反映するため、変換して戻すと元の値とは一致しません。',
    },
    {
      question: 'PhotoshopのLab値と数値が合わないのはなぜですか？',
      answer:
        'Photoshopなど多くのツールはD65基準のLabを使うことがありますが、CSSのlab()とこのツールはD50基準です。白色点が違うと同じ色でもa・bの値が少し変わります。',
    },
  ],
  en: [
    {
      question: 'Does the RGB to CMYK result match what will be printed?',
      answer:
        'No. The CMYK here is a simple formula without an ICC profile, a mechanical re-expression of the on-screen RGB color. Printed color varies with paper and ink, so follow your print shop or DTP software for color matching.',
    },
    {
      question: 'When should I use Lab versus OKLCH?',
      answer:
        'For CSS work, OKLCH is handy because perceived lightness stays steadier when you change hue or chroma. Use Lab for measuring color differences or when you already have Lab values. The Lab here is D50, same as CSS lab().',
    },
    {
      question:
        'Why does it say the color was rounded when I enter Lab or OKLCH?',
      answer:
        'Lab and OKLCH can describe vivid colors that an sRGB display cannot show. Such values are rounded to the closest displayable color before the other formats are filled in, so converting back will not reproduce the original value.',
    },
    {
      question: 'Why do my Lab values differ from Photoshop?',
      answer:
        'Many tools such as Photoshop use a D65-based Lab, while CSS lab() and this tool use D50. A different white point shifts the a and b values slightly even for the same color.',
    },
  ],
};
