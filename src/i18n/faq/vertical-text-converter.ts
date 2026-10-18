import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question:
        '変換した縦書き文字がSNSで崩れたり、□になったりするのはなぜですか？',
      answer:
        '縦書き用の句読点や括弧はUnicodeの「縦書き形」という特殊な文字で、フォントによっては収録されていません。表示できない環境では空白や□になります。その場合は「句読点・長音・括弧を縦書き用の字形にする」をオフにして、通常の文字のまま1文字1行にしてください。',
    },
    {
      question: '1文字1行と、右から左へ列を並べる方式はどう使い分けますか？',
      answer:
        '1文字1行は1本の縦書きの文を作るのに向いており、改行は空行になります。列を並べる方式は複数行の文章を本物の縦書きのように右から左へ並べ、足りない部分は全角スペースで埋めます。ただし、フォントやアプリによっては列がずれて見えます。',
    },
    {
      question: '半角の英数字や記号はどうなりますか？',
      answer:
        '既定では半角の英数字・記号・スペースを全角に変えてから縦に並べます。半角のままだと文字の幅が揃わず、列がずれやすいためです。そのまま残したい場合は全角化のチェックを外してください。',
    },
    {
      question: 'プレビューと変換結果の見た目が違うのはなぜですか？',
      answer:
        'プレビューはブラウザのCSSの縦書き表示で入力文をそのまま縦組みにしたものです。コピーする変換結果は、縦書き用の字形に置き換えて1文字ずつ改行した文字列なので、見え方が異なることがあります。',
    },
  ],
  en: [
    {
      question: 'Why do some characters show as boxes or break in my post?',
      answer:
        'Vertical punctuation and brackets are special Unicode vertical forms that many fonts do not include, so they can appear as blanks or boxes. If that happens, turn off the vertical forms option and keep the ordinary characters, one per line.',
    },
    {
      question: 'When should I use one character per line versus columns?',
      answer:
        'One character per line suits a single vertical sentence; line breaks become blank lines. Columns lays multi-line text out right to left like real tategaki and pads gaps with full-width spaces, but columns can look misaligned depending on the font and app.',
    },
    {
      question: 'What happens to half-width letters, digits and symbols?',
      answer:
        'By default they are converted to full-width, along with spaces, before being stacked. Half-width characters have uneven widths and tend to misalign columns. Uncheck the full-width option to keep them as typed.',
    },
    {
      question: 'Why does the preview look different from the converted text?',
      answer:
        'The preview uses browser CSS vertical writing on your raw input. The text you copy swaps in vertical forms and puts each character on its own line, so the two can look different.',
    },
  ],
};
