import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SitemapGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  optionsHeading: string;
  lastmodLabel: string;
  lastmodPlaceholder: string;
  todayButton: string;
  changefreqLabel: string;
  changefreqNone: string;
  priorityLabel: string;
  priorityPlaceholder: string;
  optionsHint: string;
  summaryFormat: string;
  hostsWarning: string;
  invalidDefaultFormat: string;
  issuesHeading: string;
  issueLineFormat: string;
  reasonInvalidUrl: string;
  reasonUnsupportedScheme: string;
  reasonTooLong: string;
  reasonDuplicate: string;
  reasonInvalidOptionFormat: string;
  splitNoticeFormat: string;
  fileLabel: string;
  outputLabel: string;
  outputEmpty: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  downloadButton: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const codeClass = 'rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800';
const linkClass =
  'text-blue-700 underline hover:no-underline dark:text-blue-400';

export const sitemapGeneratorContent: Record<
  Locale,
  SitemapGeneratorPageContent
> = {
  ja: {
    title: 'sitemap.xml生成ツール（URL一覧から無料で作成・ダウンロード）',
    description:
      'URLを1行ずつ貼り付けるだけでsitemap.xmlを生成できる無料ツールです。lastmod・changefreq・priorityの一括付与、無効URLと重複の除外、50,000件超の分割にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'sitemap.xml生成（URL一覧から作成）',
    introHtml: `1行1URLで貼り付けたURL一覧から、検索エンジンに送信する<code class="${codeClass}">sitemap.xml</code>を生成します。更新日（lastmod）・更新頻度（changefreq）・優先度（priority）を全URLにまとめて付与でき、行ごとの上書きも可能です。無効なURLや重複は自動で除外され、XMLの特殊文字（<code class="${codeClass}">&amp;</code>など）もエスケープされます。URLの中身を確認したいときは<a href="/tools/url-parser/" class="${linkClass}">URL分解・組み立てツール</a>、ページのOGPは<a href="/tools/meta-tag-generator/" class="${linkClass}">metaタグ生成ツール</a>も便利です。`,
    inputLabel: 'URL一覧（1行1URL）',
    inputPlaceholder:
      'https://example.com/\nhttps://example.com/about\nhttps://example.com/blog/post-1 2026-10-01 monthly 0.6',
    sampleText:
      'https://example.com/\nhttps://example.com/about\nhttps://example.com/blog/\nhttps://example.com/blog/post-1 2026-10-01 monthly 0.6\n# 先頭が # の行は無視されます',
    optionsHeading: '全URL共通の設定（任意）',
    lastmodLabel: 'lastmod（最終更新日）',
    lastmodPlaceholder: '例: 2026-10-13',
    todayButton: '今日の日付',
    changefreqLabel: 'changefreq（更新頻度）',
    changefreqNone: '指定しない',
    priorityLabel: 'priority（0.0〜1.0）',
    priorityPlaceholder: '例: 0.5',
    optionsHint:
      '行末に空白区切りで「日付 / 更新頻度 / 優先度」を書くと、その行だけ上書きできます（順不同。例: https://example.com/a 2026-10-01 weekly 0.8）。',
    summaryFormat: '有効 {valid} 件 / 無効 {invalid} 件 / 重複 {duplicate} 件',
    hostsWarning:
      '複数のホスト名（{hosts}）が含まれています。サイトマップに含められるのは、サイトマップを置くホストと同じホストのURLだけです。',
    invalidDefaultFormat:
      '共通設定の {fields} は形式が不正なため無視しました。',
    issuesHeading: '除外された行',
    issueLineFormat: '{line}行目: {text}',
    reasonInvalidUrl: 'URLとして解釈できません（https:// から書いてください）',
    reasonUnsupportedScheme: 'http / https 以外のURLは含められません',
    reasonTooLong: 'URLが2,048文字を超えています',
    reasonDuplicate: '同じURLが既に含まれています',
    reasonInvalidOptionFormat: '個別設定「{token}」を解釈できません',
    splitNoticeFormat:
      '上限（1ファイル50,000件・50MB）を超えるため {count} 個のファイルに分割しました。各ファイルとインデックス（sitemap-index.xml）を保存し、インデックスをサーチコンソールに送信してください。インデックス内のURLは1件目のURLのドメイン直下を想定しているので、配置場所に合わせて修正してください。',
    fileLabel: '表示するファイル',
    outputLabel: '生成されたXML',
    outputEmpty: 'URLを貼り付けると、ここにsitemap.xmlが生成されます。',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    downloadButton: 'ダウンロード',
    howToHeading: '使い方',
    howToSteps: [
      '「URL一覧」にURLを1行1件で貼り付けます。',
      '必要なら lastmod・changefreq・priority を設定します（全URLに付与されます）。',
      '除外された行がないか確認し、XMLをコピーまたはダウンロードします。',
      'サイトのルート直下に sitemap.xml として置き、サーチコンソールに送信します。',
    ],
    notesHeading: '注意事項',
    notes: [
      'sitemap.xml は、含めるURLと同じホスト（同じドメイン・プロトコル）の直下か、そのパス配下に置いてください。',
      'URLの末尾のフラグメント（#以降）は取り除かれ、日本語などの非ASCII文字はパーセントエンコードされます。',
      'changefreq と priority は Google では参照されないことが多く、lastmod も実際の更新日と一致しない場合は無視されます。正確な更新日が分からないときは lastmod を空のままにしてください。',
      '1ファイルの上限は50,000件・非圧縮50MBです。超える場合は複数ファイルに分割し、sitemap index でまとめます。',
      '入力したURLはブラウザ内だけで処理されます。サーバーへは送信されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'sitemap.xml',
        description:
          'サイト内のURLを検索エンジンに伝えるためのXMLファイル。クローラーが見つけにくいページの発見を助ける。',
      },
      {
        term: 'lastmod',
        description:
          'ページの最終更新日。YYYY-MM-DD 形式、または時刻付きのW3C Datetime形式で書く。',
      },
      {
        term: 'changefreq / priority',
        description:
          'ページの更新頻度のヒントと、サイト内での相対的な優先度（0.0〜1.0）。あくまでヒントであり、検索エンジンが従うとは限らない。',
      },
      {
        term: 'sitemap index',
        description:
          '複数のサイトマップファイルを束ねて1つにまとめるXML。50,000件を超えるサイトで使う。',
      },
    ],
  },
  en: {
    title: 'sitemap.xml Generator from a URL List (Free, In-Browser)',
    description:
      'Paste one URL per line to generate sitemap.xml with bulk lastmod, changefreq and priority, and automatic splitting past 50,000 URLs. Runs in your browser.',
    h1: 'sitemap.xml Generator from a URL List',
    introHtml: `Paste a list of URLs, one per line, and get a ready-to-upload <code class="${codeClass}">sitemap.xml</code>. Apply <code class="${codeClass}">lastmod</code>, <code class="${codeClass}">changefreq</code> and <code class="${codeClass}">priority</code> to every URL at once, or override them on individual lines. Invalid URLs and duplicates are dropped automatically, and XML special characters such as <code class="${codeClass}">&amp;</code> are escaped. To inspect a URL's parts, try the <a href="/en/tools/url-parser/" class="${linkClass}">URL Parser</a>; for page-level tags, see the <a href="/en/tools/meta-tag-generator/" class="${linkClass}">Meta Tag Generator</a>.`,
    inputLabel: 'URL list (one per line)',
    inputPlaceholder:
      'https://example.com/\nhttps://example.com/about\nhttps://example.com/blog/post-1 2026-10-01 monthly 0.6',
    sampleText:
      'https://example.com/\nhttps://example.com/about\nhttps://example.com/blog/\nhttps://example.com/blog/post-1 2026-10-01 monthly 0.6\n# lines starting with # are ignored',
    optionsHeading: 'Defaults for every URL (optional)',
    lastmodLabel: 'lastmod (last modified)',
    lastmodPlaceholder: 'e.g. 2026-10-13',
    todayButton: 'Today',
    changefreqLabel: 'changefreq',
    changefreqNone: 'Not set',
    priorityLabel: 'priority (0.0 to 1.0)',
    priorityPlaceholder: 'e.g. 0.5',
    optionsHint:
      'Add a date, a change frequency and/or a priority after a URL, separated by spaces, to override the defaults for that line only (any order, e.g. https://example.com/a 2026-10-01 weekly 0.8).',
    summaryFormat: '{valid} valid / {invalid} invalid / {duplicate} duplicates',
    hostsWarning:
      'Several hosts ({hosts}) are mixed in. A sitemap may only list URLs on the same host it is served from.',
    invalidDefaultFormat:
      'Ignored an invalid value in the shared settings: {fields}.',
    issuesHeading: 'Skipped lines',
    issueLineFormat: 'Line {line}: {text}',
    reasonInvalidUrl: 'Not a valid URL (start with https://)',
    reasonUnsupportedScheme: 'Only http and https URLs can be included',
    reasonTooLong: 'The URL is longer than 2,048 characters',
    reasonDuplicate: 'This URL is already in the list',
    reasonInvalidOptionFormat: 'Could not read the per-line setting "{token}"',
    splitNoticeFormat:
      "The list exceeds the limit (50,000 URLs or 50 MB per file), so it was split into {count} files. Save each file and the index (sitemap-index.xml), then submit the index to Search Console. The index assumes the files sit at the root of the first URL's domain; adjust the locations if you host them elsewhere.",
    fileLabel: 'File to show',
    outputLabel: 'Generated XML',
    outputEmpty: 'Paste URLs above and sitemap.xml will appear here.',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    downloadButton: 'Download',
    howToHeading: 'How to use',
    howToSteps: [
      'Paste your URLs into the URL list, one per line.',
      'Optionally set lastmod, changefreq and priority (applied to every URL).',
      'Check the skipped lines, then copy or download the XML.',
      'Upload it as sitemap.xml at your site root and submit it in Search Console.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Serve the sitemap from the same host (domain and protocol) as the URLs it lists, at the site root or above the listed paths.',
      'URL fragments (everything after #) are removed, and non-ASCII characters are percent-encoded.',
      'Google largely ignores changefreq and priority, and ignores lastmod when it does not match real modification dates. If you do not know the true date, leave lastmod empty.',
      'A single file may hold at most 50,000 URLs and 50 MB uncompressed. Beyond that, split into several files and tie them together with a sitemap index.',
      'The URLs are processed only in your browser and are never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'sitemap.xml',
        description:
          'An XML file that lists the URLs of a site for search engines, helping crawlers discover pages they might otherwise miss.',
      },
      {
        term: 'lastmod',
        description:
          "A page's last modification date, written as YYYY-MM-DD or as a full W3C Datetime with a time.",
      },
      {
        term: 'changefreq / priority',
        description:
          'A hint about how often a page changes and its relative importance (0.0 to 1.0) within the site. They are only hints, and search engines are free to ignore them.',
      },
      {
        term: 'sitemap index',
        description:
          'An XML file that bundles several sitemap files into one entry point, used by sites with more than 50,000 URLs.',
      },
    ],
  },
};
