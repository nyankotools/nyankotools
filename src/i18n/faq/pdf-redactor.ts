import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '黒塗りした部分の文字は、あとから復元できませんか？',
      answer:
        'できません。書き出すときに黒塗りを適用したうえで各ページを画像に変換するため、塗りつぶした部分の元の文字データは出力PDFに含まれません。PDF上に黒い図形を重ねるだけの方法とは異なります。',
    },
    {
      question: '黒塗りしたPDFの文字は選択・検索できますか？',
      answer:
        'いいえ。出力PDFは全ページが画像になるため、黒塗りしていない部分も含めて文字の選択・検索・コピーはできません。リンクやしおり、フォームも失われます。ただしChromeやEdgeなどは画像のPDFを自動で文字認識（OCR）するため、黒塗りしていない部分の文字がコピーできることがあります。PDF自体に文字データはなく、黒塗りした部分の元の文字は復元できません。',
    },
    {
      question: '共有する前に何を確認すればよいですか？',
      answer:
        '書き出したPDFを開き、隠したい文字が黒い四角で完全に覆われているか目視で確認してください。範囲が文字の端にかかっていないか、ページをまたぐ情報を見落としていないかも確認すると安心です。',
    },
    {
      question: 'PDFファイルはサーバーに送られますか？',
      answer:
        'いいえ。すべてブラウザ内で処理され、ファイルが端末の外に出ることはありません。',
    },
  ],
  en: [
    {
      question: 'Can the redacted text be recovered later?',
      answer:
        'No. The black boxes are applied and then every page is converted to an image on export, so the original text data under them is not in the output PDF. This differs from simply drawing a black shape over a PDF.',
    },
    {
      question: 'Can I still select or search text in the redacted PDF?',
      answer:
        'No. Every page of the output is an image, so text anywhere on the page — not just the redacted parts — cannot be selected, searched or copied. Links, bookmarks and forms are lost too. However, viewers such as Chrome and Edge run OCR on image-only PDFs, so text outside the black boxes may still be copyable there. The PDF itself holds no text data, and the text under the black boxes cannot be recovered.',
    },
    {
      question: 'What should I check before sharing the file?',
      answer:
        'Open the exported PDF and confirm by eye that the text you wanted to hide is fully covered. Also check that no box stops short at the edge of a word and that you have not missed the same information on other pages.',
    },
    {
      question: 'Is my PDF uploaded to a server?',
      answer:
        'No. Everything is processed in your browser and the file never leaves your device.',
    },
  ],
};
