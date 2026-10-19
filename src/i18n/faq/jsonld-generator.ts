import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'JSON-LDはどこに貼り付ければよいですか？',
      answer:
        '生成したscriptタグをページの<head>内、またはbody内にそのまま貼り付けます。1ページに複数のscriptタグを置くこともできるので、FAQとパンくずを別々に生成して並べても問題ありません。',
    },
    {
      question: '</script>を含む文章を入力しても大丈夫ですか？',
      answer:
        '大丈夫です。「<」「>」「&」はJSON内で\\u003cなどのエスケープに置き換えて出力するため、scriptタグが途中で閉じることはありません。検索エンジンが読み取るJSONとしての内容は変わりません。',
    },
    {
      question: '生成したJSON-LDが正しいか確認するには？',
      answer:
        '公開後にGoogleのリッチリザルトテストやSchema Markup Validatorで確認できます。このツールは通信しないため、検証そのものは行いません。',
    },
    {
      question: 'FAQPageを入れれば検索結果にFAQが表示されますか？',
      answer:
        '表示は保証されません。Googleは対象サイトを限定する場合があり、ページ上に同じ質問と回答が見えていることも必要です。構造化データだけを追加しても表示される保証はありません。',
    },
  ],
  en: [
    {
      question: 'Where do I paste the generated JSON-LD?',
      answer:
        'Paste the script tag as-is into the <head> or the body of your page. A page can hold several JSON-LD script tags, so you can generate FAQ and breadcrumb markup separately and place both.',
    },
    {
      question: 'Is it safe to enter text containing </script>?',
      answer:
        'Yes. The characters <, > and & are written as \\u003c-style escapes inside the JSON, so the script tag cannot be closed early. The data that search engines parse is unchanged.',
    },
    {
      question: 'How do I check that the markup is valid?',
      answer:
        "After publishing, run the URL through Google's Rich Results Test or the Schema Markup Validator. This tool makes no network requests, so it does not validate the markup itself.",
    },
    {
      question: 'Will adding FAQPage markup show FAQs in search results?',
      answer:
        'Not guaranteed. Google limits FAQ rich results to certain sites, and the same questions and answers must be visible on the page. Structured data alone does not ensure a rich result.',
    },
  ],
};
