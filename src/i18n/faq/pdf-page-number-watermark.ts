import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ページ番号に「第1ページ」のような日本語は使えますか？',
      answer:
        '使えません。ページ番号はPDF標準のフォントで描くため、半角の英数字・記号（例: {n} / {total}、- {n} -、Page {n}）のみ使えます。日本語を入れたい場合は、透かし機能なら日本語の文字も使えます。',
    },
    {
      question: '表紙にページ番号を入れず、2ページ目を「1」にできますか？',
      answer:
        'できます。「1ページ目には入れない」にチェックを入れると、1ページ目は番号なしで、2ページ目が開始番号（初期値は1）になります。',
    },
    {
      question: '透かしの文字は選択やコピーができますか？',
      answer:
        'できません。透かしは文字を画像にして貼り付けるため、PDF上では画像として扱われます。その代わり、日本語など標準フォントにない文字も表示できます。',
    },
    {
      question:
        '向きが変わっているページ（横向きなど）でも正しい位置に入りますか？',
      answer:
        '入ります。ページの回転を考慮して、画面で見えている向きの下・上・左・右を基準に配置します。',
    },
  ],
  en: [
    {
      question:
        'Can the page number contain non-Latin text such as "Page" in Japanese?',
      answer:
        'No. Page numbers are drawn with a standard PDF font, so the format can only contain ASCII letters, digits and symbols (for example {n} / {total}, - {n} -, or Page {n}). The watermark does support non-Latin text.',
    },
    {
      question:
        'Can I leave the cover page unnumbered and start at 1 on page 2?',
      answer:
        'Yes. Tick "Skip the first page" and page 1 gets no number while page 2 receives the starting number (1 by default).',
    },
    {
      question: 'Can I select or copy the watermark text?',
      answer:
        'No. The watermark is placed as an image of the text, so the PDF treats it as an image. In exchange it can show characters that standard PDF fonts lack.',
    },
    {
      question: 'Does it work on rotated (for example landscape) pages?',
      answer:
        'Yes. The tool takes each page’s rotation into account and positions numbers and watermarks relative to the orientation you see on screen.',
    },
  ],
};
