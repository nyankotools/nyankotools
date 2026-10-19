import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question:
        'Webページからコピーすると、なぜtext/plainとtext/htmlの両方が出るのですか？',
      answer:
        'コピー元は同じ内容を複数の形式で用意します。貼り付け先は対応している形式の中から最適なものを選びます。メモ帳はtext/plain、リッチエディタはtext/htmlを使うのが典型です。このツールは届いた形式をすべて表示します。',
    },
    {
      question: '貼り付けたHTMLにscriptが含まれていても安全ですか？',
      answer:
        'このツールはHTMLを描画せず、ソースをテキストとして表示するだけなので、スクリプトは実行されません。scriptタグがある場合は警告を表示します。',
    },
    {
      question: '画像をコピーしたのにtext/htmlしか表示されないことがあります。',
      answer:
        'ブラウザ上の画像をコピーすると、画像データではなく<img>タグのHTMLだけが入る場合があります。スクリーンショットや画像編集アプリからのコピーはimage/pngなどの画像形式で届きます。',
    },
    {
      question: 'ファイルをコピーして貼り付けたときの中身は見られますか？',
      answer:
        'ファイル名・種類・サイズは表示されます。画像ファイルはプレビューも表示します。それ以外のファイルの中身は、このツールでは読み取りません。',
    },
  ],
  en: [
    {
      question:
        'Why do I see both text/plain and text/html after copying from a web page?',
      answer:
        'The source app offers the same content in several formats and the destination picks the best one it understands. A plain-text editor typically takes text/plain, a rich editor takes text/html. This tool lists every format that arrives.',
    },
    {
      question: 'Is it safe to paste HTML that contains scripts?',
      answer:
        'Yes. This tool never renders HTML; it only shows the source as text, so scripts do not run. If a script tag is present, a warning is shown.',
    },
    {
      question: 'I copied an image but only text/html shows up. Why?',
      answer:
        'Copying an image from a web page often puts only an <img> tag in the HTML format, not the image bytes. Screenshots and copies from image editors arrive as image/png or similar.',
    },
    {
      question: 'Can I see the contents of files I pasted?',
      answer:
        'You see each file name, type and size, plus a preview for image files. The contents of other file types are not read by this tool.',
    },
  ],
};
