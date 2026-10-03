import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ゼロ幅スペースはどこから紛れ込みますか？',
      answer:
        'Webページ・チャット・PDF・AIの出力などからコピーしたときに混ざることが多く、画面では見えません。文字数のずれや、検索・文字列比較が一致しない原因になります。',
    },
    {
      question:
        'ゼロ幅接合子（ZWJ）を除去すると絵文字が分かれるのはなぜですか？',
      answer:
        '家族や職業の絵文字（👨‍👩‍👧など）は、複数の絵文字をU+200Dでつないで1つに見せています。除去するとつなぎが消えて別々の絵文字になるため、初期設定では除去しない設定にしています。',
    },
    {
      question: '全角スペースやノーブレークスペースも除去されますか？',
      answer:
        'いいえ。全角スペース（U+3000）やノーブレークスペース（U+00A0）は画面上で幅を持つ空白のため、検出・除去の対象外です。',
    },
    {
      question: '除去した文字は元に戻せますか？',
      answer:
        '入力欄の元のテキストはそのまま残るため、設定を変えれば結果に反映されます。除去後のテキストをコピーして使う場合は、元のテキストを別に保存しておいてください。',
    },
  ],
  en: [
    {
      question: 'Where do zero-width spaces come from?',
      answer:
        'They often slip in when you copy text from web pages, chats, PDFs or AI output, and they are invisible on screen. They cause wrong character counts and make searches or string comparisons fail.',
    },
    {
      question: 'Why does removing a zero-width joiner split an emoji?',
      answer:
        'Compound emoji such as family or profession emoji (👨‍👩‍👧 and similar) are several emoji glued together by U+200D. Removing it breaks the glue, so the emoji separate. That is why joiners are kept by default.',
    },
    {
      question: 'Are ideographic spaces and no-break spaces removed too?',
      answer:
        'No. The ideographic space (U+3000) and no-break space (U+00A0) are visible whitespace with width, so they are neither detected nor removed.',
    },
    {
      question: 'Can I undo a removal?',
      answer:
        'Your original text stays in the input box, so changing the settings updates the result. If you copy and use the cleaned text, keep the original saved separately.',
    },
  ],
};
