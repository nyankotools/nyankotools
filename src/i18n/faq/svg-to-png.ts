import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'PNGの解像度（大きさ）はどう決まりますか？',
      answer:
        'SVGのwidth・height（なければviewBox）を元のサイズとし、選んだ倍率をかけた大きさで出力します。SVGはベクター形式なので、4倍にしても粗くならずにくっきり書き出せます。',
    },
    {
      question: '背景を透明のままPNGにできますか？',
      answer:
        'できます。背景で「透過」を選べば、SVGの塗りがない部分は透明のまま書き出されます。白や好きな色で塗りつぶしたい場合は「白」または「色を指定」を選んでください。',
    },
    {
      question: '文字やフォントが崩れるのはなぜですか？',
      answer:
        'SVG内のテキストは、お使いの端末にインストールされているフォントで描画されます。Webフォントや特殊なフォントを指定していると別のフォントに置き換わるため、事前にテキストをパス（図形）に変換しておくと確実です。',
    },
    {
      question: 'SVGコードを貼り付けたのにエラーになります。',
      answer:
        'コードが「<svg」で始まっているか、width・heightまたはviewBoxがあるかを確認してください。タグの閉じ忘れなど構文の誤りがあると画像として読み込めません。',
    },
    {
      question: 'SVGのファイルはサーバーにアップロードされますか？',
      answer:
        'されません。変換はすべてブラウザ内で行われ、SVGの内容が外部に送信されることはありません。',
    },
  ],
  en: [
    {
      question: 'How is the PNG resolution decided?',
      answer:
        'The SVG width and height (or viewBox if they are missing) set the original size, and the scale you pick is applied on top. Because SVG is vector, even a 4x export comes out crisp.',
    },
    {
      question: 'Can I keep the background transparent?',
      answer:
        'Yes. Choose "Transparent" and any area the SVG does not paint stays transparent in the PNG. Pick "White" or "Custom color" if you want a filled background instead.',
    },
    {
      question: 'Why does the text look different from my design?',
      answer:
        'Text inside an SVG is drawn with fonts installed on your device. If the SVG relies on a web font or a special typeface, it is replaced by another one. Converting the text to paths beforehand avoids this.',
    },
    {
      question: 'I pasted SVG code but get an error.',
      answer:
        'Check that the code starts with "<svg" and that the root element has width and height or a viewBox. Syntax errors such as an unclosed tag prevent the browser from loading it as an image.',
    },
    {
      question: 'Is my SVG file uploaded to a server?',
      answer:
        'No. The conversion happens entirely in your browser, and the SVG content is never sent anywhere.',
    },
  ],
};
