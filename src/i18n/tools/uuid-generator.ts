import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface UuidGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  countLabel: string;
  removeHyphens: string;
  uppercase: string;
  generate: string;
  copy: string;
  copied: string;
  copyFailed: string;
  outputLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const uuidGeneratorContent: Record<Locale, UuidGeneratorPageContent> = {
  ja: {
    title: 'UUID生成',
    description:
      'ランダムなUUID（v4）を1件〜100件まとめて生成できる無料ツールです。ハイフンなし・大文字表記にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'UUID生成（v4）',
    introHtml:
      'ランダムなUUID（バージョン4・RFC 4122準拠）をまとめて生成します。データベースの主キーやテスト用のダミーIDなどにご利用ください。生成したUUIDをJSONデータに組み込む場合は <a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a> もあわせてご利用ください。',
    countLabel: '生成する個数（1〜100）',
    removeHyphens: 'ハイフンなし',
    uppercase: '大文字',
    generate: '生成する',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    outputLabel: '結果',
    notesHeading: '注意事項',
    notes: [
      '生成されるのはバージョン4（ランダム）のUUIDです。ブラウザの暗号学的乱数を使っており、衝突する確率は現実的には無視できるほど低くなります。',
      '一度に生成できるのは1〜100個です。ハイフンの有無と大文字・小文字を選べます。',
      'バージョン4は生成順に並ばないため、データベースの主キーにする場合はインデックスの効率に注意してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'UUID',
        description:
          'Universally Unique Identifier の略で、世界中で重複しないことを目的として生成される識別子です。データベースの主キーなど、一意性が求められる場面で使われます。',
      },
      {
        term: 'RFC 4122',
        description:
          'UUIDの生成方法を定めたインターネット標準の仕様書です。このツールは「バージョン4」と呼ばれる、乱数を元にした生成方式に準拠しています。',
      },
    ],
  },
  en: {
    title: 'UUID Generator',
    description:
      'A free tool that generates 1 to 100 random UUIDs (v4) at once, with optional hyphen removal and uppercase formatting. Your data is processed in the browser and never sent to a server.',
    h1: 'UUID Generator (v4)',
    introHtml:
      'Generates random, RFC 4122-compliant version 4 UUIDs in bulk. Useful for database primary keys, test fixtures, and dummy IDs. Need to embed the generated UUIDs into JSON data? Try the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a> as well.',
    countLabel: 'Number to generate (1-100)',
    removeHyphens: 'No hyphens',
    uppercase: 'Uppercase',
    generate: 'Generate',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    outputLabel: 'Result',
    notesHeading: 'Notes',
    notes: [
      "Generated values are version 4 (random) UUIDs. They use the browser's cryptographic random source, so collisions are practically negligible.",
      'You can generate 1 to 100 at a time, with or without hyphens and in upper or lower case.',
      'Version 4 values are not ordered, so consider index efficiency when using them as database primary keys.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'UUID',
        description:
          'Short for Universally Unique Identifier, an identifier designed to be unique across systems worldwide. Commonly used for database primary keys and other cases where uniqueness matters.',
      },
      {
        term: 'RFC 4122',
        description:
          'The internet standard that defines how UUIDs are generated. This tool follows "version 4," a randomness-based generation method.',
      },
    ],
  },
};
