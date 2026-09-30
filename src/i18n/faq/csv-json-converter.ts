import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'CSVの値はJSONで数値になりますか？',
      answer:
        'いいえ。CSVからJSONへの変換では、すべての値が文字列として出力されます。数値や真偽値として使いたい場合は、変換後に取り込み側で型を変換してください。',
    },
    {
      question: '区切り文字がカンマ以外のファイルにも使えますか？',
      answer:
        'はい。区切り文字はカンマとタブ（TSV）から選べます。値の中に区切り文字や改行が含まれる場合は、ダブルクォートで囲む一般的なCSVの規則で処理します。',
    },
    {
      question: '「列数が一致しません」というエラーが出るのはなぜですか？',
      answer:
        'データ行の列数がヘッダー行と異なるためです。値の中にカンマを含むのにダブルクォートで囲まれていない場合などによく起こります。エラーに表示される行番号を手がかりに元データを確認してください。',
    },
  ],
  en: [
    {
      question: 'Are numbers in CSV converted to JSON numbers?',
      answer:
        'No. When converting CSV to JSON, all values are output as strings. Convert types on the consuming side if you need numbers or booleans.',
    },
    {
      question: 'Does it work with delimiters other than commas?',
      answer:
        'Yes. You can choose between comma and tab (TSV) delimiters. Values containing delimiters or line breaks are handled with standard double-quote rules.',
    },
    {
      question: 'Why do I get a column count mismatch error?',
      answer:
        'A data row has a different number of columns than the header. This often happens when a value contains a comma but is not wrapped in double quotes. Use the reported row number to find it.',
    },
  ],
};
