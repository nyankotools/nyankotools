import type { Locale } from '../../data/tools';
import type { TextCaseResult } from '../../lib/tools/text-case-converter';

export const textCaseOrder: (keyof TextCaseResult)[] = [
  'camelCase',
  'pascalCase',
  'snakeCase',
  'kebabCase',
  'constantCase',
  'titleCase',
  'sentenceCase',
  'lowerCase',
  'upperCase',
];

export interface TextCaseConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  copy: string;
  copied: string;
  copyFailed: string;
  labels: Record<keyof TextCaseResult, string>;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const textCaseConverterContent: Record<
  Locale,
  TextCaseConverterPageContent
> = {
  ja: {
    title: 'テキストケース変換 - camelCase/snake_case/kebab-case/PascalCase',
    description:
      '入力した文字列をcamelCase・PascalCase・snake_case・kebab-case・CONSTANT_CASEなど9種類の命名規則に一括変換する無料ツールです。プログラミングの変数名・関数名の書き換えに便利。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'テキストケース変換（camelCase / snake_case / kebab-case / PascalCase）',
    introHtml:
      '文字列を入力すると、camelCase・PascalCase・snake_case・kebab-caseなど9種類の命名規則へ自動で一括変換します。単語の区切り（スペース・ハイフン・アンダースコア）や既存のcamelCase表記も自動で認識します。文字列の重複削除やソートが必要な場合は<a href="/tools/text-list-tools/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字列の重複削除・ソート・シャッフル</a>、全角/半角の統一には<a href="/tools/zenkaku-hankaku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">全角/半角変換</a>もあわせてご利用ください。',
    inputLabel: '入力',
    inputPlaceholder: '変換したい文字列を入力（例: hello world / hello_world）',
    sampleText: 'hello world sample_text',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    labels: {
      camelCase: 'camelCase',
      pascalCase: 'PascalCase',
      snakeCase: 'snake_case',
      kebabCase: 'kebab-case',
      constantCase: 'CONSTANT_CASE',
      titleCase: 'Title Case',
      sentenceCase: 'Sentence case',
      lowerCase: 'lower case',
      upperCase: 'UPPER CASE',
    },
    notesHeading: '注意事項',
    notes: [
      'スペース・ハイフン・アンダースコアで区切られた単語と、camelCase・PascalCaseの大文字の位置から、単語の区切りを推測して変換します。',
      'XMLHttpRequestのように大文字が連続する場合の区切りは推測のため、意図と異なる結果になることがあります。',
      '日本語などの大文字・小文字の区別がない文字は、変換されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'camelCase / PascalCase',
        description:
          '複数の単語をスペースなしでつなげ、単語の先頭を大文字にする命名規則です。camelCaseは先頭の単語だけ小文字（例: helloWorld）、PascalCaseはすべての単語の先頭を大文字にします（例: HelloWorld）。JavaScript/TypeScriptの変数名やクラス名でよく使われます。',
      },
      {
        term: 'snake_case / CONSTANT_CASE',
        description:
          '単語をアンダースコア（_）でつなぐ命名規則です。すべて小文字にするsnake_case（例: hello_world）は Python の変数名などで、すべて大文字にするCONSTANT_CASE（例: HELLO_WORLD）は定数名でよく使われます。',
      },
      {
        term: 'kebab-case',
        description:
          '単語をハイフン（-）でつなぐ命名規則です（例: hello-world）。URLのスラッグやCSSのクラス名、HTMLのカスタム属性などでよく使われます。',
      },
    ],
  },
  en: {
    title:
      'Text Case Converter - camelCase, snake_case, kebab-case, PascalCase',
    description:
      'A free tool that converts text into 9 naming conventions at once — camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE and more. Handy for renaming variables and functions. Your data is processed in the browser and never sent to a server.',
    h1: 'Text Case Converter (camelCase / snake_case / kebab-case / PascalCase)',
    introHtml:
      'Type or paste text below to automatically convert it into 9 naming conventions, including camelCase, PascalCase, snake_case, and kebab-case. Word boundaries (spaces, hyphens, underscores) and existing camelCase text are detected automatically. Need to dedupe or sort a list instead? Try <a href="/en/tools/text-list-tools/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Text List Deduplicate, Sort & Shuffle</a>. To unify full-width and half-width characters, use the <a href="/en/tools/zenkaku-hankaku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Full-width / Half-width Converter</a>.',
    inputLabel: 'Input',
    inputPlaceholder: 'Enter text to convert (e.g. hello world / hello_world)',
    sampleText: 'hello world sample_text',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    labels: {
      camelCase: 'camelCase',
      pascalCase: 'PascalCase',
      snakeCase: 'snake_case',
      kebabCase: 'kebab-case',
      constantCase: 'CONSTANT_CASE',
      titleCase: 'Title Case',
      sentenceCase: 'Sentence case',
      lowerCase: 'lower case',
      upperCase: 'UPPER CASE',
    },
    notesHeading: 'Notes',
    notes: [
      'Word boundaries are inferred from spaces, hyphens, underscores and the capital letters in camelCase and PascalCase.',
      'Runs of capitals such as XMLHttpRequest are split by inference, so the result may not always match your intent.',
      'Characters without letter case, such as Japanese, are not converted.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'camelCase / PascalCase',
        description:
          'Naming conventions that join words without spaces and capitalize the start of each word. camelCase keeps the first word lowercase (e.g. helloWorld), while PascalCase capitalizes every word (e.g. HelloWorld). Commonly used for variable and class names in JavaScript/TypeScript.',
      },
      {
        term: 'snake_case / CONSTANT_CASE',
        description:
          'Naming conventions that join words with underscores. snake_case keeps everything lowercase (e.g. hello_world) and is common for Python variable names, while CONSTANT_CASE uppercases everything (e.g. HELLO_WORLD) and is common for constants.',
      },
      {
        term: 'kebab-case',
        description:
          'A naming convention that joins words with hyphens (e.g. hello-world). Commonly used for URL slugs, CSS class names, and HTML custom attributes.',
      },
    ],
  },
};
