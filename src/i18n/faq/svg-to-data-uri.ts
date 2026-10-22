import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'URLエンコードとBase64はどちらを選ぶべきですか？',
      answer:
        '通常はURLエンコード（軽量）がおすすめです。SVGはテキストなので、Base64にするより短くなり、gzipもよく効きます。古い環境との互換性を優先したいときなどにBase64を選んでください。',
    },
    {
      question: 'CSSに貼ったのにSVGが表示されません。',
      answer:
        'SVGに xmlns="http://www.w3.org/2000/svg" が無いと背景画像として表示されません。このツールは自動で補いますが、width・height・viewBox が無いSVGは大きさが決まらず、background-size を指定しないと見えないことがあります。',
    },
    {
      question: 'SVGの中の「#」や「%」はどう扱われますか？',
      answer:
        'URLエンコード方式では「#」を %23、「%」を %25 に変換します。変換しないと、ブラウザがURLの一部と解釈してSVGが壊れるためです。Base64方式では変換は不要です。',
    },
    {
      question: '背景に使ったSVGの色をCSSで変えられますか？',
      answer:
        '背景画像として読み込まれたSVGは外側のCSSの影響を受けないため、色はエンコード前にSVG内の fill や stroke で指定してください。',
    },
  ],
  en: [
    {
      question: 'Should I choose URL encoding or Base64?',
      answer:
        'URL encoding (compact) is the usual choice. SVG is text, so it stays shorter than Base64 and compresses well with gzip. Pick Base64 when you need to match an older toolchain or environment.',
    },
    {
      question: "I pasted the CSS but the SVG doesn't show up.",
      answer:
        'An SVG without xmlns="http://www.w3.org/2000/svg" will not render as a background image. This tool adds it automatically, but an SVG with no width, height, or viewBox has no intrinsic size and may stay invisible unless you set background-size.',
    },
    {
      question: 'How are "#" and "%" inside the SVG handled?',
      answer:
        'URL encoding turns # into %23 and % into %25, because otherwise the browser reads them as part of the URL and the SVG breaks. Base64 needs no such escaping.',
    },
    {
      question: 'Can I recolor a background SVG with CSS?',
      answer:
        'No. An SVG loaded as a background image is not affected by the page CSS, so set colors with fill or stroke inside the SVG before encoding.',
    },
  ],
};
