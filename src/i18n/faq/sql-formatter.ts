import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'SQLの方言（MySQLやPostgreSQLなど）は選べますか？',
      answer:
        'はい。方言を指定して整形できます。方言によってキーワードや引用符のルールが異なるため、使っているデータベースに合わせて選ぶと崩れにくくなります。',
    },
    {
      question: '整形するとSQLの動作は変わりますか？',
      answer:
        '空白・改行・インデント・キーワードの大文字小文字が変わるだけで、クエリの意味は変わりません。ただし、文字列リテラルの中身は変更されません。',
    },
    {
      question: 'クエリはサーバーに送信されますか？',
      answer:
        'いいえ。整形もミニファイもブラウザ内で完結し、入力したSQLがサーバーに送られることはありません。社内のクエリでも安心して使えます。',
    },
  ],
  en: [
    {
      question: 'Can I choose a SQL dialect such as MySQL or PostgreSQL?',
      answer:
        'Yes. Pick the dialect that matches your database, since keywords and quoting rules differ between them.',
    },
    {
      question: 'Does formatting change what the SQL does?',
      answer:
        'Only whitespace, line breaks, indentation and keyword casing change. The meaning is unchanged, and string literal contents are left alone.',
    },
    {
      question: 'Is my query sent to a server?',
      answer:
        'No. Formatting and minifying happen in your browser, so your SQL is never uploaded.',
    },
  ],
};
