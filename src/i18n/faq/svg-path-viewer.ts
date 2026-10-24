import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'パスのd属性はどこから取り出せますか？',
      answer:
        'SVGファイルをテキストエディタで開き、<path d="..."> の引用符の中身をコピーしてください。ブラウザの開発者ツールでpath要素を選んでも取り出せます。',
    },
    {
      question: '大文字と小文字のコマンドはどう違いますか？',
      answer:
        '大文字（M・L・Cなど）は原点を基準にした絶対座標、小文字（m・l・cなど）は現在位置からの差分で指定します。コマンド一覧では、どちらも絶対座標に換算した値を図に使っています。',
    },
    {
      question:
        'SやTコマンドの制御点はなぜ自分で書いていないのに表示されますか？',
      answer:
        'Sは直前のC/Sの第2制御点、Tは直前のQ/Tの制御点を、現在位置を中心に反転した点を制御点として使います。図では中抜きの丸で表示します。',
    },
    {
      question: '小数桁を減らすと見た目はどのくらい変わりますか？',
      answer:
        'viewBoxが数百程度なら、小数1〜2桁でもほとんど違いは見えません。座標が小さい（0〜1程度）パスでは桁数を減らしすぎると形が崩れるため、プレビューで確認してください。',
    },
  ],
  en: [
    {
      question: 'Where do I find the d attribute of a path?',
      answer:
        'Open the SVG file in a text editor and copy what is inside the quotes of <path d="...">. You can also select the path element in your browser developer tools.',
    },
    {
      question:
        'What is the difference between uppercase and lowercase commands?',
      answer:
        'Uppercase commands (M, L, C and so on) use absolute coordinates; lowercase ones (m, l, c) use offsets from the current point. The preview uses absolute values for both, as shown in the command list.',
    },
    {
      question:
        'Why are control points shown for S and T when I did not write them?',
      answer:
        'S reuses the previous C/S second control point and T the previous Q/T control point, mirrored around the current point. They are drawn as hollow circles.',
    },
    {
      question: 'How much does the shape change when I reduce decimal places?',
      answer:
        'With a viewBox of a few hundred units, one or two decimals is usually invisible. For paths with small coordinates (around 0 to 1), too few decimals will distort the shape, so check the preview.',
    },
  ],
};
