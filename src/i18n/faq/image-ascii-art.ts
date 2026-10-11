import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ASCIIアートがSNSやチャットで崩れてしまいます。',
      answer:
        'ASCIIアートは等幅フォントでないと文字の位置がずれます。多くのSNSやチャットは等幅ではないため、コードブロック（バッククォート3つで囲む）が使えるサービスで貼るか、画像として共有してください。',
    },
    {
      question: '横の文字数はどれくらいにすればよいですか？',
      answer:
        '細部を出したいなら100〜200文字程度、貼り付けやすさを優先するなら40〜80文字程度が目安です。文字数が多いほど横幅が広くなり、画面から横にはみ出します。',
    },
    {
      question: '黒背景で見ると明暗が逆になります。',
      answer:
        '標準では白い背景に黒い文字で見ることを想定し、暗い部分ほど濃い文字を割り当てています。黒背景のエディタやダークモードで見る場合は「明暗を反転」をオンにしてください。',
    },
    {
      question: 'アップロードした画像はサーバーに送られますか？',
      answer:
        '送られません。変換はすべてブラウザ内で行われ、画像データが外部に送信されることはありません。',
    },
  ],
  en: [
    {
      question:
        'My ASCII art looks broken when I paste it into a chat or social app.',
      answer:
        'ASCII art only lines up in a monospace font, and most social apps and chats use a proportional one. Paste it into a code block where supported, or share it as an image instead.',
    },
    {
      question: 'How many characters wide should I make it?',
      answer:
        'Around 100–200 characters shows fine detail; 40–80 is easier to paste and share. Wider output may scroll sideways on a narrow screen.',
    },
    {
      question: 'The brightness looks inverted on a dark background.',
      answer:
        'By default, darker areas get denser characters, assuming dark text on a white background. Turn on "Invert brightness" when viewing it in a dark editor or dark mode.',
    },
    {
      question: 'Is my image uploaded to a server?',
      answer:
        'No. The conversion runs entirely in your browser, and the image data is never sent anywhere.',
    },
  ],
};
