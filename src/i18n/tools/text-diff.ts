import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface TextDiffPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputALabel: string;
  inputBLabel: string;
  inputPlaceholder: string;
  ignoreWhitespace: string;
  ignoreCase: string;
  /** {added} {removed} {equal} をスクリプト側で置換して使うテンプレート文字列 */
  statusTemplate: string;
  tableColumnA: string;
  tableColumnB: string;
  tableColumnContent: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const textDiffContent: Record<Locale, TextDiffPageContent> = {
  ja: {
    title: 'テキスト差分比較（diff）ツール',
    description:
      '2つのテキストを行単位で比較し、追加・削除された箇所をハイライト表示する無料ツールです。空白や大文字小文字の違いを無視する比較にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'テキスト差分比較（diff）',
    introHtml:
      '2つのテキストを行単位で比較し、追加された行を緑、削除された行を赤でハイライト表示します。設定ファイルや文章の変更前後を見比べたいときに便利です。JSONの内容だけを整えたい場合は <a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a> もあわせてご利用ください。',
    inputALabel: 'テキストA（変更前）',
    inputBLabel: 'テキストB（変更後）',
    inputPlaceholder: '比較したいテキストを入力',
    ignoreWhitespace: '行頭・行末の空白の違いを無視する',
    ignoreCase: '大文字・小文字の違いを無視する',
    statusTemplate: '追加: {added}行 / 削除: {removed}行 / 変更なし: {equal}行',
    tableColumnA: 'A',
    tableColumnB: 'B',
    tableColumnContent: '内容',
    notesHeading: '注意点',
    notes: [
      '比較は行単位で行われます。1行の中の一部分だけをハイライトする機能はありません。',
      '非常に長いテキスト（数千行以上）を比較すると、ブラウザの処理が重くなる場合があります。',
      'すべての処理はブラウザ内で完結しており、入力したテキストがサーバーに送信されることはありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '差分（diff）',
        description:
          '2つのテキストを比較し、追加された行・削除された行・変わらない行を洗い出したものです。ソースコードの変更確認や、文章の校正前後の比較などに使われます。',
      },
      {
        term: '行単位の比較',
        description:
          'このツールは1文字ずつではなく、改行で区切った「行」を最小単位として比較します。1行の中の一部だけが変わった場合でも、その行全体が「削除された行」と「追加された行」のペアとして表示されます。',
      },
    ],
  },
  en: {
    title: 'Text Diff Checker (Compare Two Texts)',
    description:
      'Compare two texts line by line and highlight added and removed lines, optionally ignoring whitespace or case. Runs in your browser; nothing is sent to a server.',
    h1: 'Text Diff Checker',
    introHtml:
      'Compares two texts line by line, highlighting added lines in green and removed lines in red. Handy for comparing config files or document drafts before and after a change. If you just need to format JSON content, also try the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a> tool.',
    inputALabel: 'Text A (before)',
    inputBLabel: 'Text B (after)',
    inputPlaceholder: 'Enter the text you want to compare',
    ignoreWhitespace: 'Ignore leading/trailing whitespace differences',
    ignoreCase: 'Ignore case differences',
    statusTemplate: 'Added: {added} / Removed: {removed} / Unchanged: {equal}',
    tableColumnA: 'A',
    tableColumnB: 'B',
    tableColumnContent: 'Content',
    notesHeading: 'Notes',
    notes: [
      'Comparison is line-based. There is no feature to highlight just part of a line.',
      'Comparing very long texts (thousands of lines or more) may slow down your browser.',
      'Everything runs entirely in your browser — the text you enter is never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Diff',
        description:
          'A comparison between two texts that identifies added lines, removed lines, and lines that stayed the same. Commonly used to review source code changes or compare a document before and after editing.',
      },
      {
        term: 'Line-based comparison',
        description:
          'This tool compares text line by line (split on newlines) rather than character by character. If only part of a line changes, the entire line is shown as a removed/added pair.',
      },
    ],
  },
};
