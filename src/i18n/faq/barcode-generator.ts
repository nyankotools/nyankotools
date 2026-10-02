import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'どの規格を選べばよいですか？',
      answer:
        '英数字を自由に入れたいなら CODE128 が汎用的です。商品に付けるJANコードなら EAN-13（13桁）または EAN-8（8桁）、米国の商品なら UPC-A、数字だけで短く表したいなら ITF が向いています。',
    },
    {
      question: 'EAN-13に12桁を入力してもエラーになりませんか？',
      answer:
        'エラーにはならず、12桁を入力すると13桁目のチェックデジットが自動で付与されます。13桁を入力する場合は、チェックデジットが正しくないとバーコードを生成できません。',
    },
    {
      question: '日本語は入力できますか？',
      answer:
        '入力できません。バーコードは主に半角の英数字・記号を表す規格で、日本語を含む文字列はエラーになります。日本語を埋め込みたい場合は QRコード生成を使ってください。',
    },
    {
      question: '作ったバーコードをそのまま商品に使えますか？',
      answer:
        'JANコードを流通で使うには、GS1などでの事業者コード登録が必要です。このツールは任意の数字からバーコード画像を作るだけなので、登録済みのコードを入力して使ってください。',
    },
  ],
  en: [
    {
      question: 'Which format should I choose?',
      answer:
        'CODE128 is the most flexible choice when you need free-form letters and digits. Use EAN-13 or EAN-8 for retail product codes, UPC-A for US products, and ITF when you want a compact digits-only code.',
    },
    {
      question: 'Can I enter only 12 digits for EAN-13?',
      answer:
        'Yes. With 12 digits, the 13th check digit is added automatically. If you enter 13 digits, the check digit must be correct or no barcode is generated.',
    },
    {
      question: 'Can I encode Japanese or other non-ASCII text?',
      answer:
        'No. These barcode formats mainly encode ASCII letters, digits, and symbols, so other characters produce an error. To embed arbitrary text, use the QR Code Generator instead.',
    },
    {
      question: 'Can I use the generated barcode on real products?',
      answer:
        'To use EAN / JAN codes in retail you must register a company prefix with GS1 or a similar body. This tool only draws an image from the digits you enter, so use a code you have been assigned.',
    },
  ],
};
