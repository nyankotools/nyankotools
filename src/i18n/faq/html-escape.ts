import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'HTMLエスケープはなぜ必要ですか？',
      answer:
        '「<」や「&」などの特殊文字はそのままだとHTMLとして解釈されます。ユーザー入力を画面に表示するときにエスケープしないと、意図しないタグが実行されるクロスサイトスクリプティング（XSS）の原因になります。',
    },
    {
      question: 'どの文字がエスケープされますか？',
      answer:
        'アンパサンド（&）、小なり（<）、大なり（>）、ダブルクォート（"）、シングルクォート（\'）の5種類を対応する文字参照に変換します。',
    },
    {
      question: 'JS文字列エスケープはどんなときに使いますか？',
      answer:
        'テキストをJavaScriptの文字列リテラルに埋め込みたいときに使います。改行やクォートなどをバックスラッシュ付きのエスケープシーケンスに変換します。',
    },
  ],
  en: [
    {
      question: 'Why is HTML escaping necessary?',
      answer:
        'Characters such as "<" and "&" are interpreted as HTML. If user input is displayed without escaping, unintended tags can run, which leads to cross-site scripting (XSS).',
    },
    {
      question: 'Which characters are escaped?',
      answer:
        'Five characters are converted to their entities: ampersand (&), less-than (<), greater-than (>), double quote (") and single quote (\').',
    },
    {
      question: 'When should I use JS string escape?',
      answer:
        'Use it to embed text in a JavaScript string literal. Line breaks and quotes are converted into backslash escape sequences.',
    },
  ],
};
