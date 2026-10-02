import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '入力したマイナンバーはサーバーに送信されますか？',
      answer:
        'いいえ。検査用数字の計算はすべてブラウザの中で行い、番号を送信・保存することはありません。入力内容は再読み込み後にも残りません。',
    },
    {
      question: '検証で「正しい」と出れば、その番号は実在しますか？',
      answer:
        'いいえ。確認できるのは検査用数字との整合性だけで、番号が実在するか・有効かは分かりません。法人番号の実在確認は、国税庁の法人番号公表サイトで行ってください。',
    },
    {
      question: 'インボイス登録番号（T＋13桁）も検証できますか？',
      answer:
        '「法人番号」を選んで、Tから始まる番号をそのまま入力してください。法人が登録した番号は「T」＋法人番号なので、先頭のTを除いて検証します。個人事業主の番号は対象外です。',
    },
    {
      question: '桁が足りないときはどうなりますか？',
      answer:
        'マイナンバーは11桁、法人番号は12桁を入力すると、検査用数字を計算して完成した番号を表示します。それ以外の桁数では、桁数のエラーを表示します。',
    },
  ],
  en: [
    {
      question: 'Is the My Number I enter sent to a server?',
      answer:
        'No. The check digit is calculated entirely in your browser. Nothing is sent or stored, and the input is not kept after a reload.',
    },
    {
      question: 'If it says "correct", does the number exist?',
      answer:
        'No. It only confirms that the check digit is consistent, not that the number exists or is valid. Use the National Tax Agency’s Corporate Number Publication Site to confirm that a corporate number exists.',
    },
    {
      question:
        'Can it validate an invoice registration number (T + 13 digits)?',
      answer:
        'Choose "Corporate Number" and enter the number starting with T. For corporations the registration number is "T" plus the corporate number, so the T is removed before validating. Sole proprietors’ numbers are not covered.',
    },
    {
      question: 'What if I enter one digit fewer?',
      answer:
        'Enter 11 digits for a My Number or 12 for a Corporate Number and the tool calculates the check digit and shows the complete number. Any other length shows a length error.',
    },
  ],
};
