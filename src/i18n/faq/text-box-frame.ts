import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '日本語を入れると右端がずれます',
      answer:
        'このツールは全角を幅2として計算しますが、貼り付け先のフォントが全角を半角2文字分で描画しないと、ずれて見えます。等幅フォント（日本語対応のもの）のエディタで確認してください。それでも崩れる場合は、罫線文字ではなく「ASCII」スタイルを試してください。',
    },
    {
      question: 'コードのコメントに貼るにはどうしますか？',
      answer:
        '「コメント」で行コメント（// # --）かブロックコメント（/* */）を選ぶと、各行に接頭辞が付いた状態で出力されます。言語に合わせて選び、そのままソースに貼り付けてください。',
    },
    {
      question: '吹き出しのしっぽは何のためですか？',
      answer:
        'ASCIIアートのキャラクターの口元につなげるための斜線です。キャラクターを置かない場合や、READMEに単独で使う場合は、「吹き出しのしっぽ」のチェックを外してください。',
    },
    {
      question: '枠の幅や行の折り返しは指定できますか？',
      answer:
        '枠の幅は、いちばん長い行に合わせて自動で決まります。長い文章を折り返す機能はないため、必要なら自分で改行してから入力してください。',
    },
    {
      question: '入力したテキストはサーバーに送られますか？',
      answer:
        '送られません。整形はすべてブラウザ内で行われ、入力内容が外部に送信・保存されることはありません。',
    },
  ],
  en: [
    {
      question: 'The right edge is crooked when I use Japanese text',
      answer:
        'The tool counts fullwidth characters as two columns, but if the font where you paste it does not draw them at exactly twice the width, the edge looks off. Check it in an editor with a monospace font that supports CJK. If it still breaks, try the ASCII style instead of box-drawing characters.',
    },
    {
      question: 'How do I paste the result into a code comment?',
      answer:
        'Choose a line comment (// # --) or a block comment (/* */) under "Comment". Every line is output with the prefix already added, so pick the one your language uses and paste it into the source.',
    },
    {
      question: 'What is the bubble tail for?',
      answer:
        'It is the slanted line that connects the bubble to the mouth of an ASCII-art character. If you have no character, or use the bubble on its own in a README, turn off "Bubble tail".',
    },
    {
      question: 'Can I set the box width or wrap long lines?',
      answer:
        'The width follows your longest line automatically. There is no word wrap, so break long text into lines yourself before entering it.',
    },
    {
      question: 'Is my text sent to a server?',
      answer:
        'No. Everything is formatted in your browser, and nothing you type is sent or stored anywhere else.',
    },
  ],
};
