import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '貼り付けた先で罫線がずれます。',
      answer:
        '貼り付け先が等幅フォントになっているか確認してください。プロポーショナルフォントでは、半角と全角の幅の比が崩れて罫線がずれます。コードエディタやGitHubのコードブロック（```）の中なら、きれいに表示されます。',
    },
    {
      question: 'ASCII罫線とUnicode罫線はどちらを使うべきですか？',
      answer:
        'ソースコードのコメントや、環境が分からないメールにはASCII罫線が安全です。READMEなどで見た目を優先するなら、Unicode罫線が向いています。Unicode罫線は、フォントによっては幅が合わないことがあります。',
    },
    {
      question: 'Excelの表をそのまま変換できますか？',
      answer:
        'はい。Excelの範囲をコピーして貼り付けると、タブ区切り（TSV）として自動判定されます。区切り文字が合わない場合は、プルダウンで手動指定してください。',
    },
    {
      question: '全角文字や絵文字が入っていても揃いますか？',
      answer:
        '日本語などの全角文字と絵文字は、半角2文字分の幅として数えて整形します。ただし実際の表示幅はフォントに依存するため、環境によっては1文字分ずれることがあります。',
    },
  ],
  en: [
    {
      question: 'The borders look misaligned where I pasted the table.',
      answer:
        'Check that the destination uses a monospaced font. A proportional font breaks the width ratio between half-width and full-width characters. A code editor or a GitHub code block (```) will display it correctly.',
    },
    {
      question: 'Should I use ASCII or Unicode borders?',
      answer:
        "ASCII borders are the safe choice for source-code comments and for email where you do not know the reader's setup. For READMEs where looks matter, Unicode borders are nicer, though some fonts draw them at an uneven width.",
    },
    {
      question: 'Can I paste a table straight from Excel?',
      answer:
        'Yes. Copy the range in Excel and paste it; it is detected as tab-separated (TSV) automatically. If the delimiter is guessed wrong, choose it from the dropdown.',
    },
    {
      question: 'Do full-width characters and emoji line up?',
      answer:
        'Full-width text such as Japanese, and emoji, are counted as two columns wide when padding. The real width depends on the font, so in some environments a row can still be off by one column.',
    },
  ],
};
