import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '元のファイルの名前そのものを変更できますか？',
      answer:
        'できません。ブラウザのセキュリティ上、選んだファイルを直接書き換えることはできないため、変更後の名前でZIPにまとめて保存します。ZIPを解凍すると名前が変わったファイルが得られ、元のファイルはそのまま残ります。',
    },
    {
      question: '連番を001、002のように桁をそろえて付けるには？',
      answer:
        '「連番を付ける」をオンにして、「桁数」を3にします。開始番号と増分も変えられ、「連番の位置」で名前の前後への追加や、名前そのものを連番に置き換えることもできます。桁数は最大10です。',
    },
    {
      question: '変更後の名前が重複するとどうなりますか？',
      answer:
        '重複する行はプレビューに警告が出て、解消するまでZIPに保存できません。大文字小文字は区別せずに比べるので、Windowsなどで同名として扱われるケースも検出します。連番を付けるなどして名前を分けてください。',
    },
    {
      question: 'ファイル名に使えない文字を入れるとどうなりますか？',
      answer:
        '/ \\ : * ? " < > | と制御文字は _ に置き換え、末尾のドットや空白は取り除きます。これらの調整が入った行はプレビューに表示されます。置換で ../ のような指定をしても、フォルダ移動にはなりません。',
    },
    {
      question: '正規表現の置換で、一部を使い回せますか？',
      answer:
        '「正規表現を使う」をオンにすると、丸括弧で囲んだ部分を $1、$2 として置換後の文字列に使えます。たとえば IMG_(\\d+) を photo-$1 に置換すると IMG_001 が photo-001 になります。対象は拡張子を除いた部分です。',
    },
  ],
  en: [
    {
      question: 'Can it rename the original files themselves?',
      answer:
        'No. For security reasons a browser cannot rewrite the files you pick, so the tool saves copies under the new names in a ZIP. Extract it to get the renamed files; your originals stay as they are.',
    },
    {
      question: 'How do I number files as 001, 002, 003?',
      answer:
        'Turn on "Add sequence numbers" and set digits to 3. You can change the start value and step, and "Number position" lets you put the number before or after the name, or replace the name with it. Digits go up to 10.',
    },
    {
      question: 'What happens if two new names are the same?',
      answer:
        'Those rows are flagged in the preview and saving is blocked until they are resolved. Names are compared ignoring case, so clashes that Windows or macOS would treat as the same file are caught too. Add numbering or change the pattern to tell them apart.',
    },
    {
      question: 'What if a name contains characters that are not allowed?',
      answer:
        '/ \\ : * ? " < > | and control characters become _, and trailing dots or spaces are removed. Rows that needed such changes are marked in the preview. Replacing text with something like ../ cannot move a file into another folder.',
    },
    {
      question: 'Can I reuse part of the match in a regex replacement?',
      answer:
        'Turn on "Use regular expression" and refer to parenthesized groups as $1, $2 in the replacement. For example, replacing IMG_(\\d+) with photo-$1 turns IMG_001 into photo-001. Only the part before the extension is matched.',
    },
  ],
};
