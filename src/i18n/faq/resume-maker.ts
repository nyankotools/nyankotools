import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '入力した内容や写真はどこかに送信されますか？',
      answer:
        'いいえ。入力内容も写真もブラウザの中だけで処理し、サーバーには送信しません。「ブラウザに保存」を押したときだけ、この端末のブラウザ（localStorage）に文字の内容を保存します。写真は保存しません。',
    },
    {
      question: '学歴・職歴はどう書けば年月の欄に入りますか？',
      answer:
        '1行に1項目、行頭に「2015-04 ○○高等学校 入学」のように西暦と月を書きます。「2015年4月」「令和元年5月」のような書き方も読み取れます。年月のない行（「現在に至る」など）は内容欄にそのまま出ます。「以上」は自動で付きます。',
    },
    {
      question: '欄に収まらないと言われたらどうすればよいですか？',
      answer:
        '学歴・職歴は21行、免許・資格は8行、志望動機は11行、本人希望は8行までです。長い行は自動で折り返して行数を使うため、項目を減らす、言い回しを短くする、といった調整をしてください。収まるまで印刷ボタンは押せません。',
    },
    {
      question: '証明写真はどう貼ればよいですか？',
      answer:
        '縦4:横3の写真を選ぶと、写真欄（縦40mm×横30mm）に合わせて表示されます。ほかの比率の画像は中央を切り抜いて表示します。「証明写真メーカー」の出力画像も使えます。画像を使わない場合は、印刷した用紙に写真をはってください。',
    },
    {
      question: '印刷すると2ページ目がずれる、または余白が出ます。',
      answer:
        '印刷ダイアログで用紙サイズをA4、倍率を100%（実際のサイズ）にし、「ヘッダーとフッター」を切ってください。「ページに合わせる」を選ぶと縮小されて余白が出ます。',
    },
  ],
  en: [
    {
      question: 'Is anything I type or my photo sent anywhere?',
      answer:
        'No. Your text and photo are processed only in your browser and never sent to a server. Only when you press "Save in browser" are your text entries written to this browser\'s local storage on this device. The photo is never stored.',
    },
    {
      question: 'How do I write history entries so they fill the year columns?',
      answer:
        'Write one entry per line, starting with a Western year and month, like "2015-04 Sample High School, enrolled". Formats such as "2015年4月" and "令和元年5月" also work. A line without a date (for example "現在に至る") goes into the content column as it is. The closing "以上" is added for you.',
    },
    {
      question: 'It says my text does not fit. What can I do?',
      answer:
        'Education and work history take up to 21 rows, licenses 8, motivation 11 and requests 8. Long lines wrap and use extra rows, so remove entries or shorten the wording. The Print button stays disabled until everything fits.',
    },
    {
      question: 'How do I add my ID photo?',
      answer:
        'Choose a portrait photo with a 4:3 (tall) ratio and it is fitted to the photo box (40 mm by 30 mm). Other ratios are cropped around the center. An image from the ID Photo Maker works. If you skip the photo, stick a printed one on the paper.',
    },
    {
      question: 'The second page is shifted or has odd margins when printed.',
      answer:
        'In the print dialog set the paper to A4, the scale to 100% (actual size) and turn off headers and footers. "Fit to page" shrinks the sheet and leaves extra margins.',
    },
  ],
};
