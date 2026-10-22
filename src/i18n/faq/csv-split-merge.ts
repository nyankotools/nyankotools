import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '行数指定と個数指定の違いは何ですか？',
      answer:
        '行数指定は「1ファイルを1000行ずつ」のように行数で区切り、最後のファイルだけ端数になります。個数指定は「3つに分ける」のようにファイル数を決め、行数ができるだけ均等になるように分けます。どちらも元の行の順序は保たれ、分割結果は1つのZIPにまとまります。',
    },
    {
      question: '結合でエラーになるのはどんなときですか？',
      answer:
        '「見出しが一致するか確認する」がオンのとき、最初のファイルと列名・列の順序・列数のどれかが違うファイルがあるとエラーになり、そのファイル名が表示されます。列の並びが違うCSVを無理に結合するとデータがずれるため、先にCSVビューアなどで列をそろえてください。',
    },
    {
      question: '重複削除のキー列には何を選べばよいですか？',
      answer:
        '「同じ人・同じ商品」を表す列（ID、メールアドレスなど）を選びます。何も選ばない場合は行全体が完全に一致する行だけを重複とみなします。複数の列を選ぶと、それらすべてが一致する行が重複です。残す行は最初か最後かを選べ、残った行の順序は変わりません。',
    },
    {
      question: 'Excelで開くと文字化けします。',
      answer:
        '「出力にBOMを付ける」をオンにすると、ExcelがUTF-8として認識して正しく開けます。逆にShift_JISのCSVを読み込むときは、「読み込む文字コード」でShift_JISを選んでください。出力は常にUTF-8になります。',
    },
    {
      question: 'セルの中に改行があるCSVも分割できますか？',
      answer:
        'できます。引用符で囲まれたセル内の改行やカンマは1つのセルとして扱うため、改行の途中で分割されたり、行がずれたりすることはありません。',
    },
  ],
  en: [
    {
      question:
        'What is the difference between rows per file and number of files?',
      answer:
        'Rows per file cuts the data every N rows, such as 1,000, and only the last file holds the remainder. Number of files picks how many parts you want and spreads the rows as evenly as possible. Either way the original row order is kept and all parts are saved in a single ZIP.',
    },
    {
      question: 'When does merging fail with an error?',
      answer:
        'With "Check that headers match" on, merging stops if any file differs from the first in column names, column order or column count, and it names the file. Merging CSVs whose columns are arranged differently would shift your data, so align the columns first, for example in the CSV Viewer.',
    },
    {
      question:
        'Which columns should I use as the key for removing duplicates?',
      answer:
        'Choose the column(s) that identify the same person or item, such as an ID or email address. If you choose none, only rows that are identical across every column count as duplicates. With several columns, all of them must match. You can keep the first or last occurrence, and the remaining rows stay in their original order.',
    },
    {
      question: 'The file looks garbled when opened in Excel.',
      answer:
        'Turn on "Add a BOM to the output" so Excel recognizes the file as UTF-8. When you load a Shift_JIS CSV, pick Shift_JIS under "Input encoding" instead. The output is always UTF-8.',
    },
    {
      question: 'Can it split a CSV that has line breaks inside cells?',
      answer:
        'Yes. Line breaks and commas inside quoted cells are treated as part of that cell, so a split never cuts through a cell and rows do not shift.',
    },
  ],
};
