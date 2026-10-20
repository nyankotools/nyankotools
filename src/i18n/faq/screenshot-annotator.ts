import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'スクリーンショットを貼り付けて使えますか？',
      answer:
        'はい。スクリーンショットをクリップボードにコピーしたあと、このページで Ctrl+V（Macは ⌘+V）を押すと読み込まれます。貼り付けに対応していない環境では、ファイル選択やドラッグ＆ドロップを使ってください。',
    },
    {
      question:
        '番号は自動で振られますか？途中の番号を消したらどうなりますか？',
      answer:
        '番号は追加した順に1から自動で振られます。「削除」で途中の番号を消すと、残りの番号は1から振り直されます。「1つ元に戻す」は直前の書き込みを取り消します。',
    },
    {
      question: '書き込んだ後に矢印や文字を動かせますか？',
      answer:
        '動かすことはできません。間違えたときは「削除」で書き込みをクリックして消すか、「1つ元に戻す」で取り消してから書き直してください。',
    },
    {
      question: '画像の個人情報を隠したいときは？',
      answer:
        '先に画像モザイク・ぼかしツールで該当部分を隠してから、そのPNGをこのツールで読み込んで注釈を付けるのが確実です。このツールの書き込みは隠蔽用ではありません。',
    },
    {
      question: '保存した画像の大きさは変わりますか？',
      answer:
        '元の画像と同じ解像度のPNGとして保存されます。画面上の表示が縮小されていても、書き込みは元の解像度で描かれます。',
    },
  ],
  en: [
    {
      question: 'Can I paste a screenshot directly?',
      answer:
        'Yes. Copy a screenshot to the clipboard, then press Ctrl+V (⌘+V on Mac) on this page. If your environment does not support pasting, use the file picker or drag and drop.',
    },
    {
      question:
        'Are the numbers automatic? What if I delete one in the middle?',
      answer:
        'Badges are numbered from 1 in the order you add them. If you remove one in the middle with Delete, the rest are renumbered from 1. "Undo last" removes the most recent annotation.',
    },
    {
      question: 'Can I move an arrow or label after placing it?',
      answer:
        'No. If you make a mistake, use Delete and click the annotation to remove it, or use "Undo last", then draw it again.',
    },
    {
      question: 'How do I hide personal information in the image?',
      answer:
        'First hide those areas with the Image Blur & Mosaic Tool, then load the resulting PNG here and annotate it. The marks added by this tool are not meant for redaction.',
    },
    {
      question: 'Does the saved image change size?',
      answer:
        'It is saved as a PNG at the same resolution as the original. Even if the preview on screen is scaled down, annotations are drawn at the original resolution.',
    },
  ],
};
