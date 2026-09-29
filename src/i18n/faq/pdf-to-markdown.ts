import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'スキャンしたPDFも変換できますか？',
      answer:
        'できません。文字情報を持つPDFが対象で、スキャン画像だけのPDFはOCRが必要なため変換できません。',
    },
    {
      question: '表や見出しはどのくらい正確に変換されますか？',
      answer:
        '見出しは本文より大きい文字や太字の短い行から、表は桁の揃った行から推定します。PDFの作り方によっては正しく認識できず、セル結合のある表は崩れることがあります。変換後の確認をおすすめします。',
    },
    {
      question: 'AIに読ませる前処理として使えますか？',
      answer:
        'はい。見出しや箇条書きの構造を保ったMarkdownにできるため、AIに読ませる前の整形に向いています。図・画像・数式は変換されない点にご注意ください。',
    },
  ],
  en: [
    {
      question: 'Can scanned PDFs be converted?',
      answer:
        'No. Only PDFs that contain text data work. Image-only scans would require OCR, which this tool does not perform.',
    },
    {
      question: 'How accurate are headings and tables?',
      answer:
        'Headings are inferred from larger or bold short lines and tables from aligned rows. Depending on how the PDF was made, detection can fail, and tables with merged cells may break. Please review the output.',
    },
    {
      question: 'Is it useful as preprocessing for AI?',
      answer:
        'Yes. The Markdown keeps structure such as headings and lists, which suits feeding documents to AI. Note that figures, images and equations are not converted.',
    },
  ],
};
