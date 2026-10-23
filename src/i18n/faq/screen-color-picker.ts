import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'FirefoxやSafariで画面の色を取得できないのはなぜですか？',
      answer:
        '画面スポイトに使うEyeDropper APIは、現在主にChrome・EdgeなどChromium系ブラウザだけが対応しています。非対応ブラウザでは、画像を読み込んでクリックした位置の色を取る方式に自動で切り替わります。',
    },
    {
      question: 'スポイトで他のウィンドウやデスクトップの色も取れますか？',
      answer:
        'はい。対応ブラウザでは、ブラウザの外（他のアプリのウィンドウやデスクトップ）も含めて、画面上の任意の位置を選べます。選んだ1画素の色だけが返され、画面全体が読み取られることはありません。',
    },
    {
      question: '画像方式で取れる色は、画面で見える色と違うことがありますか？',
      answer:
        '画像方式はファイルに保存されたピクセルの値を読むため、ディスプレイのカラープロファイルや夜間モードの影響は受けません。逆に、画面スポイトは表示された色を取るので、プロファイルによって画像データとわずかにずれることがあります。',
    },
    {
      question: '履歴はどこに保存されますか？',
      answer:
        '履歴はこのページを開いている間だけメモリ上に保持される最大30件で、ブラウザへの保存も送信もしません。ページを閉じるか再読み込みすると消えます。',
    },
  ],
  en: [
    {
      question: 'Why can’t I pick colors from the screen in Firefox or Safari?',
      answer:
        'The screen eyedropper relies on the EyeDropper API, which is currently supported mainly by Chromium browsers such as Chrome and Edge. In other browsers the tool switches to loading an image and clicking it to read a color.',
    },
    {
      question: 'Can the eyedropper pick colors outside the browser window?',
      answer:
        'Yes. In supported browsers you can choose any point on your screen, including other app windows and the desktop. Only the single color you click is returned; the page cannot read the rest of your screen.',
    },
    {
      question: 'Can image mode return a different color than I see on screen?',
      answer:
        'Image mode reads the pixel values stored in the file, so your display’s color profile or night mode does not affect it. The screen eyedropper reads what is displayed, so it can differ slightly from the image data depending on the profile.',
    },
    {
      question: 'Where is the history stored?',
      answer:
        'History is kept in memory only while the page is open, up to 30 colors. It is not saved to the browser or sent anywhere, and it disappears when you close or reload the page.',
    },
  ],
};
