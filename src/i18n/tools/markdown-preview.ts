import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface MarkdownPreviewPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  modeAriaLabel: string;
  modeMdToHtml: string;
  modeHtmlToMd: string;
  viewAriaLabel: string;
  viewPreview: string;
  viewHtmlSource: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  inputPlaceholderMdToHtml: string;
  inputPlaceholderHtmlToMd: string;
  resultHeading: string;
  headingLabel: string;
  headingAtx: string;
  headingSetext: string;
  bulletLabel: string;
  codeLabel: string;
  codeFenced: string;
  codeIndented: string;
  removeImagesLabel: string;
  removeLinksLabel: string;
  /** `{message}` を置換して使うテンプレート */
  errorTemplate: string;
  sanitizeNoteBeforeCode: string;
  sanitizeNoteAfterCode: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const markdownPreviewContent: Record<
  Locale,
  MarkdownPreviewPageContent
> = {
  ja: {
    title: 'Markdown⇔HTML変換',
    description:
      'Markdownをリアルタイムプレビューしながら、HTMLと相互変換できる無料ツールです。GitHubのREADMEやブログ記事の下書き確認、生成したHTMLソースのコピー、HTMLからMarkdownへの逆変換にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Markdown⇔HTML変換ツール（プレビュー付き）',
    introHtml:
      'Markdownを入力すると、リアルタイムでHTMLに変換してプレビュー表示します。生成されたHTMLソースはそのままコピーでき、逆にHTMLを貼り付けてMarkdownに変換することもできます。GitHubのREADMEやブログ記事の下書き確認に便利です。変換後の文章の文字数を数えたい場合は <a href="/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字数カウント</a> もあわせてご利用ください。',
    modeAriaLabel: '変換方向',
    modeMdToHtml: 'Markdown→HTML',
    modeHtmlToMd: 'HTML→Markdown',
    viewAriaLabel: '表示形式',
    viewPreview: 'プレビュー',
    viewHtmlSource: 'HTMLソース',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: '入力',
    inputPlaceholderMdToHtml:
      '# 見出し\n\n**太字**のテキストと[リンク](https://example.com)を書けます。',
    inputPlaceholderHtmlToMd:
      '<h1>見出し</h1>\n<p><strong>太字</strong>のテキストです。</p>',
    resultHeading: '結果',
    headingLabel: '見出しの書式',
    headingAtx: '# 見出し（ATX）',
    headingSetext: '下線（Setext）',
    bulletLabel: '箇条書きの記号',
    codeLabel: 'コードブロック',
    codeFenced: '``` で囲む',
    codeIndented: 'インデント',
    removeImagesLabel: '画像を取り除く',
    removeLinksLabel: 'リンクを取り除く（文字だけ残す）',
    errorTemplate: 'エラー: {message}',
    sanitizeNoteBeforeCode:
      '※ プレビューは安全のためサニタイズして表示しています。',
    sanitizeNoteAfterCode: 'タグなど一部の要素は表示されません。',
    notesHeading: '注意事項',
    notes: [
      'プレビューは安全のためサニタイズして表示するため、scriptタグなど一部のHTML要素は表示されません。',
      'Markdownの解釈は環境ごとに細かな違いがあります。GitHubなど特定のサービスに掲載する場合は、そのサービス上の表示も確認してください。',
      'HTMLからMarkdownへの変換では、表はセルの文字だけのMarkdown表になり（結合セルは展開されません）、<script>・<style> の中身は出力されません。複雑なレイアウトや装飾を完全には再現できない場合があります。変換後の内容を確認してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Markdown',
        description:
          '見出しや箇条書き、リンクなどを簡単な記号で表現できる軽量マークアップ言語です。READMEファイルやブログ記事の執筆などで広く使われています。',
      },
      {
        term: 'HTML',
        description:
          'HyperText Markup Language の略で、Webページの構造を表現するマークアップ言語です。ブラウザはHTMLを解釈して画面に表示します。',
      },
      {
        term: 'GFM（GitHub Flavored Markdown）',
        description:
          'GitHubで採用されている拡張Markdown記法です。テーブルや取り消し線、タスクリストなどが使えます。本ツールもGFM記法に対応しています。',
      },
      {
        term: 'サニタイズ',
        description:
          '入力されたHTMLから、スクリプトの実行など危険な要素を安全に取り除く処理です。本ツールはプレビュー表示前に自動でサニタイズを行っています。',
      },
    ],
  },
  en: {
    title: 'Markdown to HTML Converter',
    description:
      'Convert Markdown to HTML with live preview, or HTML back to Markdown. Runs in your browser; nothing is sent to a server.',
    h1: 'Markdown to HTML Converter (with Live Preview)',
    introHtml:
      'Type Markdown and it\'s converted to HTML with a live preview as you type. Copy the generated HTML source directly, or switch direction to paste HTML and convert it back to Markdown. Handy for checking a GitHub README or a blog draft before publishing. To count the characters in your result, try the <a href="/en/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Character Counter</a> as well.',
    modeAriaLabel: 'Direction',
    modeMdToHtml: 'Markdown→HTML',
    modeHtmlToMd: 'HTML→Markdown',
    viewAriaLabel: 'View',
    viewPreview: 'Preview',
    viewHtmlSource: 'HTML Source',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabel: 'Input',
    inputPlaceholderMdToHtml:
      '# Heading\n\nWrite **bold** text and [links](https://example.com).',
    inputPlaceholderHtmlToMd:
      '<h1>Heading</h1>\n<p><strong>Bold</strong> text.</p>',
    resultHeading: 'Result',
    headingLabel: 'Heading style',
    headingAtx: '# Heading (ATX)',
    headingSetext: 'Underlined (Setext)',
    bulletLabel: 'Bullet marker',
    codeLabel: 'Code blocks',
    codeFenced: 'Fenced (```)',
    codeIndented: 'Indented',
    removeImagesLabel: 'Remove images',
    removeLinksLabel: 'Remove links (keep the text)',
    errorTemplate: 'Error: {message}',
    sanitizeNoteBeforeCode:
      'Note: the preview is sanitized for safety, so some elements like',
    sanitizeNoteAfterCode: 'tags are not rendered.',
    notesHeading: 'Notes',
    notes: [
      'The preview is sanitized for safety, so some HTML elements such as script tags are not displayed.',
      'Markdown rendering varies slightly between platforms. If you publish on a specific service such as GitHub, check how it looks there as well.',
      'Converting HTML to Markdown may not reproduce complex layouts or styling exactly. Review the result.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Markdown',
        description:
          'A lightweight markup language that lets you write headings, lists, links, and more using simple symbols. Widely used for README files and blog posts.',
      },
      {
        term: 'HTML',
        description:
          'Short for HyperText Markup Language, the markup language used to structure web pages. Browsers interpret HTML to render the page.',
      },
      {
        term: 'GFM (GitHub Flavored Markdown)',
        description:
          "GitHub's extended Markdown syntax, which adds tables, strikethrough text, task lists, and more. This tool supports GFM syntax.",
      },
      {
        term: 'Sanitizing',
        description:
          'The process of safely stripping dangerous elements, such as executable scripts, from HTML input. This tool sanitizes the output automatically before rendering the preview.',
      },
    ],
  },
};
