import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'MD5やSHA-1をパスワードの保存に使えますか？',
      answer:
        '使わないでください。MD5とSHA-1には既知の脆弱性があります。パスワードの保存には、bcryptやArgon2のような専用のアルゴリズムを使うのが一般的です。',
    },
    {
      question: '同じ文字列なのにハッシュ値が違うのはなぜですか？',
      answer:
        '入力は改行や空白まで厳密に区別されます。末尾の改行や全角・半角スペースが1文字違うだけで、まったく別のハッシュ値になります。',
    },
    {
      question: 'ハッシュ値から元の文字列に戻せますか？',
      answer:
        'できません。ハッシュは一方向の関数で、元のデータを復元できない設計です。ファイルの改ざんチェックや同一性の確認に使われます。',
    },
  ],
  en: [
    {
      question: 'Can I use MD5 or SHA-1 to store passwords?',
      answer:
        'You should not. MD5 and SHA-1 have known weaknesses. For password storage, use dedicated algorithms such as bcrypt or Argon2.',
    },
    {
      question: 'Why do identical-looking strings give different hashes?',
      answer:
        'Input is compared exactly, including line breaks and spaces. A trailing newline or a full-width space produces a completely different hash.',
    },
    {
      question: 'Can a hash be reversed to the original text?',
      answer:
        'No. A hash is a one-way function and cannot be reversed. It is used for integrity checks and comparing data.',
    },
  ],
};
