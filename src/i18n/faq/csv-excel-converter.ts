import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'CSVをExcelで開くと文字化けします。どうすればよいですか？',
      answer:
        'このツールで一度xlsxに変換すれば、文字コードの違いによる文字化けを避けられます。CSVはShift_JISでもUTF-8でも自動で判定して読み込みます。CSVのままExcelで開きたい場合は、「Excel→CSV」で「BOM付きUTF-8で保存する」にチェックを入れてください。',
    },
    {
      question: '電話番号や郵便番号の先頭の0が消えませんか？',
      answer:
        '先頭が0の値は文字列のセルとして保存するため、消えません。16桁以上の数字もExcelの有効桁数（15桁）を超えて丸められるのを防ぐため、文字列のままにします。数値として扱いたい値だけ、変換後にExcelで形式を変更してください。',
    },
    {
      question: '複数シートのExcelファイルはどう変換されますか？',
      answer:
        '「Excel→CSV」では、ブック内のシートを一覧から選び、1シートずつCSVに変換します。CSVは1つのファイルに1シートしか持てないため、全シートを一度に出力することはできません。',
    },
    {
      question: '古い.xlsファイルやパスワード付きのファイルは変換できますか？',
      answer:
        'いいえ。対応しているのは.xlsx形式のみです。.xlsファイルや、パスワードで保護されたブックは、Excelで「名前を付けて保存」から（パスワードを解除して）.xlsx形式で保存し直してから読み込んでください。',
    },
    {
      question: 'ファイルはどこかに送信されますか？',
      answer:
        'いいえ。変換はすべてブラウザ内で行われ、ファイルの内容がサーバーに送信されることはありません。',
    },
  ],
  en: [
    {
      question: 'My CSV shows garbled characters in Excel. What should I do?',
      answer:
        'Converting the CSV to xlsx here avoids encoding problems, since the tool auto-detects UTF-8 and Shift_JIS when reading. If you need to keep a CSV that opens correctly in Excel, use "Excel→CSV" with "Save as UTF-8 with BOM" checked.',
    },
    {
      question: 'Will leading zeros in phone numbers or ZIP codes be lost?',
      answer:
        'No. Values with a leading zero are stored as text cells, so they stay as they are. Numbers with more than 15 digits are also kept as text, because Excel would otherwise round them. You can change the cell format in Excel afterwards if you want numbers.',
    },
    {
      question: 'How are workbooks with multiple sheets handled?',
      answer:
        'In "Excel→CSV" you pick one sheet from the list and it is exported as CSV. A CSV file can only hold a single sheet, so all sheets cannot be exported in one go; export them one at a time.',
    },
    {
      question: 'Can I convert old .xls files or password-protected workbooks?',
      answer:
        'No, only .xlsx is supported. Open the .xls file or the protected workbook in Excel, remove the password, and use "Save As" to save a copy as .xlsx first.',
    },
    {
      question: 'Is my file uploaded anywhere?',
      answer:
        'No. The conversion runs entirely in your browser and the contents of your file are never sent to a server.',
    },
  ],
};
