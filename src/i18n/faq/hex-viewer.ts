import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '数百MBや数GBのファイルでも開けますか？',
      answer:
        'はい。画面に表示している範囲だけをファイルから読み込むので、ファイル全体をメモリに載せません。数百MBでもすぐに表示できます。数GBを超えるファイルはブラウザの制限で選択できないことがあります。',
    },
    {
      question: 'オフセットは10進と16進のどちらで入力しますか？',
      answer:
        '数字だけなら10進、0x を付けると16進として扱います。たとえば 4096 と 0x1000 は同じ位置です。表示されるオフセットは16進なので、左端の値をそのまま 0x を付けて入力すれば移動できます。',
    },
    {
      question: '日本語の文字列でバイト列検索はできますか？',
      answer:
        'できます。検索方法を「テキストで指定」にして文字コードを選ぶと、UTF-8 や UTF-16LE のバイト列に変換して探します。Shift_JIS のファイルを探したいときは、16進で指定してください（例: 「あ」は 82 A0）。',
    },
    {
      question: '16進のバイト列はどんな書き方ができますか？',
      answer:
        '「50 4B 03 04」「504B0304」「0x50,0x4B,0x03,0x04」のように、空白・カンマ・コロン・ハイフン区切りのどれでも、区切り無しでも入力できます。1バイトは必ず2桁で入力してください。',
    },
    {
      question: 'バイトを書き換えて保存できますか？',
      answer:
        'いいえ。閲覧と検索のみに対応した読み取り専用のツールです。元のファイルは変更されません。',
    },
  ],
  en: [
    {
      question: 'Can it open files of hundreds of MB or several GB?',
      answer:
        'Yes. Only the rows currently on screen are read from the file, so the whole file is never loaded into memory and files of several hundred MB open at once. Files beyond a few GB may exceed what your browser can select.',
    },
    {
      question: 'Is the offset entered in decimal or hex?',
      answer:
        'Plain digits are read as decimal and a 0x prefix means hex, so 4096 and 0x1000 point to the same byte. The offsets shown in the dump are hex, so you can type a value from the left column with 0x in front of it to jump there.',
    },
    {
      question: 'Can I search for Japanese or other non-ASCII text?',
      answer:
        'Yes. Choose "Text" as the search type and pick an encoding; the text is converted to UTF-8 or UTF-16LE bytes before matching. For files in other encodings such as Shift_JIS, enter the bytes as hex instead (for example, the hiragana あ is 82 A0).',
    },
    {
      question: 'How can I write the hex bytes to search for?',
      answer:
        'You can write "50 4B 03 04", "504B0304", or "0x50,0x4B,0x03,0x04". Spaces, commas, colons, and hyphens all work as separators, or you can use none. Each byte must have two digits.',
    },
    {
      question: 'Can I edit the bytes and save the file?',
      answer:
        'No. This is a read-only viewer for browsing and searching; your original file is never modified.',
    },
  ],
};
