import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'メールに添付できない大きなファイルはどう送ればよいですか？',
      answer:
        '添付上限より小さいサイズ（例: 上限が10MBなら8MB程度）を指定して分割し、パーツを複数のメールに分けて送ります。受け取る側はこのツールの「パーツを結合」で元のファイルに戻せます。分割しても内容は変わりません。',
    },
    {
      question: '分割したファイルはどうやって元に戻しますか？',
      answer:
        'すべてのパーツ（.001 .002 …）を「パーツを結合」にドロップして「結合してダウンロード」を押します。番号順に自動で並べ替え、足りない番号があれば結合せず知らせます。コマンドなら Windows は copy /b、Mac・Linux は cat でも連結できます。',
    },
    {
      question: '何GBまで分割できますか？',
      answer:
        '固定の上限はなく、お使いの端末とブラウザのメモリに依存します。1GBを超えると警告が出ます。分割は必要な部分だけを切り出すので全体を二重に読み込みませんが、巨大なファイルでは失敗することがあります。',
    },
    {
      question: 'パーツは暗号化や圧縮されますか？',
      answer:
        'いいえ。元のデータをそのままのサイズで切り分けるだけで、圧縮も暗号化もしません。中身を守りたい場合は、先にファイル暗号化ツールで暗号化してから分割してください。',
    },
    {
      question: 'パーツが1つ足りないまま結合するとどうなりますか？',
      answer:
        'このツールは欠番や重複を検出すると結合を止め、足りない番号を表示します。欠けたまま無理に連結すると、動画や圧縮ファイルは壊れて開けなくなるため、すべてのパーツをそろえてください。',
    },
  ],
  en: [
    {
      question: 'How do I send a file that is too big for email?',
      answer:
        'Split it into parts smaller than the attachment limit (for example about 8 MB for a 10 MB limit) and send them in separate emails. The recipient drops the parts into "Join parts" to get the original back. Splitting does not alter the data.',
    },
    {
      question: 'How do I put the split parts back together?',
      answer:
        'Drop all the parts (.001, .002 …) into "Join parts" and press "Join and download". They are sorted by number automatically, and joining stops if a number is missing. On the command line, copy /b on Windows or cat on macOS and Linux also works.',
    },
    {
      question: 'How large a file can it split?',
      answer:
        'There is no fixed cap; it depends on your device and browser memory. A warning appears above 1 GB. Only the needed range is cut out, so the file is not loaded twice, but very large files can still fail.',
    },
    {
      question: 'Are the parts compressed or encrypted?',
      answer:
        'No. The original bytes are simply cut into pieces, with no compression or encryption. To protect the contents, encrypt the file with an encryption tool first, then split it.',
    },
    {
      question: 'What happens if one part is missing when I join?',
      answer:
        'The tool stops and shows which numbers are missing, and it does the same for duplicates. Joining with a gap would corrupt videos and archives, so make sure you have every part.',
    },
  ],
};
