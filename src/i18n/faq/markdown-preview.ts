import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'プレビューでHTMLタグが表示されないことがあるのはなぜですか？',
      answer:
        'プレビューは安全のためにサニタイズして表示しています。scriptタグなど一部の要素は表示されません。生成されたHTMLソースのコピーは、そのまま利用できます。',
    },
    {
      question: 'HTMLからMarkdownへの変換もできますか？',
      answer:
        'はい。「HTML→Markdown」に切り替えてHTMLを貼り付けると、見出し・リスト・リンク・コードブロック・表をMarkdownに変換できます。見出しや箇条書きの書式、画像・リンクの除去も選べます。複雑なレイアウトや装飾は完全には再現できない場合があるため、変換後の内容を確認してください。',
    },
    {
      question: 'GitHubのREADMEと同じ表示になりますか？',
      answer:
        '基本的な記法は同じように表示されますが、環境ごとに拡張記法や見た目が異なります。GitHub固有の機能は、実際にGitHub上で確認してください。',
    },
  ],
  en: [
    {
      question: 'Why are some HTML tags missing from the preview?',
      answer:
        'The preview is sanitized for safety, so elements such as script tags are not rendered. You can still copy the generated HTML source.',
    },
    {
      question: 'Can it convert HTML back to Markdown?',
      answer:
        'Yes. Switch to "HTML to Markdown" and paste HTML to convert headings, lists, links, code blocks and tables. You can also pick the heading and bullet style, or strip images and links. Complex layouts or styling may not convert perfectly, so review the result.',
    },
    {
      question: 'Will it look identical to a GitHub README?',
      answer:
        'Basic syntax renders the same way, but extensions and styling vary by platform. Check GitHub-specific features on GitHub itself.',
    },
  ],
};
