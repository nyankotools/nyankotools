import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface MarkdownTocGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  minLevelLabel: string;
  maxLevelLabel: string;
  levelOption: string;
  styleLabel: string;
  styleBullet: string;
  styleNumber: string;
  indentLabel: string;
  indent2: string;
  indent4: string;
  linksLabel: string;
  /** {count} を置換する */
  summaryFound: string;
  summaryNone: string;
  resultLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const markdownTocGeneratorContent: Record<
  Locale,
  MarkdownTocGeneratorPageContent
> = {
  ja: {
    title: 'Markdown目次（TOC）生成ツール｜GitHub形式アンカー対応',
    description:
      'Markdownの見出しからネスト付きの目次を生成する無料ツールです。GitHub形式のアンカー、重複見出しの連番、深さ指定、番号付き・箇条書きに対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Markdown目次（TOC）生成ツール',
    introHtml:
      'READMEやドキュメントのMarkdownを貼り付けると、見出しから目次をMarkdownのリストとして作ります。リンクはGitHub形式のアンカーで、コードブロック内の「#」は見出しとして扱いません。変換後の見た目を確認したいときは <a href="/tools/markdown-preview/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Markdownプレビュー</a> をご利用ください。',
    inputLabel: 'Markdown',
    inputPlaceholder: '目次を作りたいMarkdownを貼り付け',
    sampleText:
      '# プロジェクト名\n\n## インストール\n\n```sh\n# これは見出しではありません\nnpm install\n```\n\n## 使い方\n\n### 基本\n\n### オプション\n\n## ライセンス\n',
    minLevelLabel: '目次に含める最上位の見出し',
    maxLevelLabel: '目次に含める最下位の見出し',
    levelOption: 'h{level}',
    styleLabel: 'リストの形式',
    styleBullet: '箇条書き（-）',
    styleNumber: '番号付き（1.）',
    indentLabel: 'ネストのインデント',
    indent2: 'スペース2つ',
    indent4: 'スペース4つ',
    linksLabel: '見出しへのリンクを付ける',
    summaryFound: '見出し{count}件から目次を作成しました',
    summaryNone: '目次に含める見出しが見つかりません',
    resultLabel: '生成した目次',
    copy: '目次をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    howToHeading: '使い方',
    howToSteps: [
      '「Markdown」欄に目次を作りたい文章を貼り付けます。',
      '「目次に含める最上位の見出し」と「目次に含める最下位の見出し」で深さを決めます。',
      '「リストの形式」などを選び、「目次をコピー」で結果をコピーします。',
    ],
    notesHeading: '注意事項',
    notes: [
      '見出しの抽出は、行頭が「#」のATX形式と、下線（=== / ---）のSetext形式に対応しています。コードブロック（``` / ~~~）とフロントマターの中は対象外です。',
      'アンカーは小文字化し、記号を除いてスペースを「-」にするGitHub形式です。同じ見出しが複数あると末尾に連番（-1、-2…）を付けます。GitLabなど他のサービスでは仕様が少し異なる場合があります。',
      '見出しに含まれるリンク・コード・強調は、目次では文字だけにします。HTMLで書いた見出し（<h2>など）は対象外です。',
      '番号付きのときは、ネストが崩れないようにインデントを3つ以上にします。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'アンカー',
        description:
          'ページ内の特定の位置へ移動するためのリンク先（#以降の文字列）です。GitHubでは見出しの文字から自動で作られ、目次のリンクもこの名前を指します。',
      },
      {
        term: 'Setext見出し',
        description:
          '見出しの下に「===」または「---」の行を置いて書く形式です。h1とh2だけを表せます。',
      },
      {
        term: 'フロントマター',
        description:
          'ファイルの先頭に「---」で囲んで書くメタ情報（YAML）です。静的サイトジェネレーターなどで使われ、本文の見出しではありません。',
      },
    ],
  },
  en: {
    title: 'Markdown Table of Contents (TOC) Generator',
    description:
      'Generate a nested table of contents from Markdown headings. GitHub-style anchors, duplicate numbering, depth limits, bullets or numbers. Runs in your browser.',
    h1: 'Markdown Table of Contents Generator',
    introHtml:
      'Paste the Markdown of your README or docs and get a table of contents as a Markdown list. Links use GitHub-style anchors, and "#" lines inside code blocks are not treated as headings. To see how the document renders, use the <a href="/en/tools/markdown-preview/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Markdown Preview</a>.',
    inputLabel: 'Markdown',
    inputPlaceholder: 'Paste the Markdown you want a table of contents for',
    sampleText:
      '# Project\n\n## Install\n\n```sh\n# not a heading\nnpm install\n```\n\n## Usage\n\n### Basics\n\n### Options\n\n## License\n',
    minLevelLabel: 'Top heading level to include',
    maxLevelLabel: 'Bottom heading level to include',
    levelOption: 'h{level}',
    styleLabel: 'List style',
    styleBullet: 'Bullets (-)',
    styleNumber: 'Numbered (1.)',
    indentLabel: 'Nesting indent',
    indent2: '2 spaces',
    indent4: '4 spaces',
    linksLabel: 'Link each entry to its heading',
    summaryFound: 'Built a table of contents from {count} heading(s)',
    summaryNone: 'No headings found for the table of contents',
    resultLabel: 'Generated table of contents',
    copy: 'Copy TOC',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    howToHeading: 'How to use',
    howToSteps: [
      'Paste your document into the "Markdown" field.',
      'Choose the depth with "Top heading level to include" and "Bottom heading level to include".',
      'Pick a "List style" and other options, then press "Copy TOC".',
    ],
    notesHeading: 'Notes',
    notes: [
      'Headings are detected in ATX form (lines starting with "#") and Setext form (underlined with === or ---). Fenced code blocks (``` or ~~~) and front matter are skipped.',
      'Anchors follow the GitHub rule: lowercase, punctuation removed, spaces turned into "-". Repeated headings get a numeric suffix (-1, -2 and so on). Other platforms such as GitLab may differ slightly.',
      'Links, code and emphasis inside a heading are reduced to plain text in the TOC. Headings written as HTML (like <h2>) are not detected.',
      'Numbered lists use at least a 3-space indent so nesting renders correctly.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Anchor',
        description:
          'The part after "#" in a URL that jumps to a spot on the page. GitHub builds it from the heading text, and the TOC links point to these names.',
      },
      {
        term: 'Setext heading',
        description:
          'A heading written with a line of "===" or "---" under the text. It can only express levels 1 and 2.',
      },
      {
        term: 'Front matter',
        description:
          'A block of metadata (YAML) fenced by "---" at the top of a file, used by static site generators. It is not part of the document headings.',
      },
    ],
  },
};
