import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '日本語の文章は文字単位と単語単位のどちらで数えるべきですか？',
      answer:
        '用途によります。文章全体の傾向や使用頻度の高い漢字・かなを見たいときは文字単位、キーワードを洗い出したいときは単語単位が向いています。単語単位ではブラウザの単語分割機能を使うため、日本語でも単語に近い単位で集計できますが、分割はブラウザによって異なることがあります。',
    },
    {
      question: '「The」と「the」は別の単語として数えられますか？',
      answer:
        '初期設定では大文字・小文字を区別せず、小文字にそろえて合算します。「大文字・小文字を区別しない」のチェックを外すと、別々の項目として数えます。',
    },
    {
      question: '回数が同じ文字や単語の並び順は？',
      answer:
        '回数が同じ項目は、テキストの中で先に現れた順に並びます。上位N件で絞ったときに同数の項目が境界をまたぐ場合も、この順で切り取られます。',
    },
    {
      question: '集計結果をExcelなどで使えますか？',
      answer:
        'CSVとしてコピーまたはダウンロードできます。列は順位・文字または単語・回数・割合（％）で、文字コードはUTF-8です。Excelで文字化けする場合は、データの取り込み機能でUTF-8を指定してください。',
    },
  ],
  en: [
    {
      question: 'Should I count Japanese text by characters or by words?',
      answer:
        "It depends on the goal. Use characters to see which kanji and kana dominate a text, and words to pull out keywords. Word mode relies on the browser's word segmentation, which gives word-like units for Japanese but can differ slightly between browsers.",
    },
    {
      question: 'Are "The" and "the" counted as different words?',
      answer:
        'By default case is ignored and both are merged under the lowercase form. Untick Ignore case to count them separately.',
    },
    {
      question: 'How are items with the same count ordered?',
      answer:
        'Ties are listed in the order they first appear in the text. If a tie straddles your top-N cutoff, the earlier items are the ones kept.',
    },
    {
      question: 'Can I use the results in Excel or Google Sheets?',
      answer:
        'Yes. Copy or download the CSV; its columns are rank, character or word, count and share (%), encoded as UTF-8. If Excel shows garbled text, import the file as data and choose UTF-8.',
    },
  ],
};
