import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface KishuIzonCheckerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  highlightHeading: string;
  detectedHeading: string;
  copyReplaced: string;
  copied: string;
  copyFailed: string;
  noMatchesStatus: string;
  /** {count} {unique} をスクリプト側で置換して使うテンプレート（1件の場合はSingular、それ以外はPluralを使う） */
  matchesFoundSingular: string;
  matchesFoundPlural: string;
  tableColumnChar: string;
  tableColumnCodePoint: string;
  tableColumnCategory: string;
  tableColumnDescription: string;
  tableColumnCount: string;
  tableColumnReplacement: string;
  /** {count} をスクリプト側で置換して使うテンプレート（表内の出現数セル） */
  countCellTemplate: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const kishuIzonCheckerContent: Record<
  Locale,
  KishuIzonCheckerPageContent
> = {
  ja: {
    title: '機種依存文字（環境依存文字）チェッカー',
    description:
      '①②③などの丸数字やⅠⅡⅢのローマ数字、㈱㍉㍻といった機種依存文字（環境依存文字）を検出する無料ツールです。メールやメルマガで文字化けしやすい文字を一覧表示し、安全な表記への置き換え案も提示します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '機種依存文字（環境依存文字）チェッカー',
    introHtml:
      '入力したテキストの中から、①②③などの丸数字・ⅠⅡⅢなどのローマ数字・㈱㍉㍻といった機種依存文字（環境依存文字）を検出します。メールやメールマガジン、Webフォームなど環境によって文字化けする可能性がある箇所を送信前に確認したいときにご利用ください。全角・半角の変換が必要な場合は <a href="/tools/zenkaku-hankaku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">全角/半角変換</a> もあわせてご利用ください。',
    inputLabel: '入力',
    inputPlaceholder:
      'チェックしたいテキストを入力（例: 御中様①②③のお申込みは㈱ナンヤントで受付中です）',
    highlightHeading: '検出結果のハイライト表示',
    detectedHeading: '検出された文字の一覧',
    copyReplaced: '置き換え候補で置換したテキストをコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    noMatchesStatus: '機種依存文字は見つかりませんでした。',
    matchesFoundSingular:
      '{count}件の機種依存文字が見つかりました（{unique}種類）。',
    matchesFoundPlural:
      '{count}件の機種依存文字が見つかりました（{unique}種類）。',
    tableColumnChar: '文字',
    tableColumnCodePoint: 'コード',
    tableColumnCategory: '分類',
    tableColumnDescription: '説明',
    tableColumnCount: '出現数',
    tableColumnReplacement: '置き換え候補',
    countCellTemplate: '{count}件',
    notesHeading: '注意点',
    notes: [
      '判定対象はNEC特殊文字・NEC選定IBM拡張文字など、代表的な機種依存文字です。すべての環境依存文字を網羅しているわけではありません。',
      '置き換え候補はあくまで一般的な目安です。文脈によっては別の表記（例: 「㍿」を社名の一部としてそのまま使いたい場合など）が適切なこともあるため、置換後の文章は必ず内容を確認してください。',
      '「髙」「﨑」のようなIBM拡張文字の異体字は、人名・地名などで意図的に使われている場合があります。機械的な置き換えが適切でないこともあるためご注意ください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '機種依存文字（環境依存文字）',
        description:
          '①②③のような丸数字やⅠⅡⅢのようなローマ数字、㈱㌔㍻など、パソコンやスマートフォン、メールソフトの機種・OS・文字コードによって表示や変換のされ方が異なる文字のことです。送信側では正しく見えていても、受信側では別の文字や「文字化け」として表示されることがあります。',
      },
      {
        term: '文字化け',
        description:
          '文字コードの解釈の違いなどにより、本来の文字とは異なる記号や「�」のような表示になってしまう現象です。機種依存文字はShift_JISなど文字コードの拡張領域に配置されているものが多く、環境によって文字化けの原因になりやすいとされています。',
      },
      {
        term: 'Shift_JIS',
        description:
          'かつて日本語Windows環境で広く使われていた文字コードです。標準のJIS漢字に加えて、パソコンメーカーが独自に追加したNEC特殊文字・IBM拡張文字などの拡張領域があり、これが機種依存文字の主な出どころになっています。',
      },
    ],
  },
  en: {
    title: 'Machine-Dependent Character Checker',
    description:
      'Detect machine-dependent characters such as ①②③, ⅠⅡⅢ, and ㈱ that may garble in email, with safe replacement suggestions. Runs in your browser.',
    h1: 'Machine-Dependent Character Checker',
    introHtml:
      'Scans your text for machine-dependent characters (also called environment-dependent characters) such as circled numbers (①②③), Roman numerals (ⅠⅡⅢ), and ligatures like ㈱ ㍉ ㍻. Use it before sending an email or newsletter, or filling in a web form, to catch characters that might turn into mojibake on the recipient\'s device. Need to convert between full-width and half-width characters instead? Try the <a href="/en/tools/zenkaku-hankaku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Full-width / Half-width Converter</a>.',
    inputLabel: 'Input',
    inputPlaceholder:
      'Paste text to check (e.g. Orders ①②③ from ㈱Example are now open)',
    highlightHeading: 'Highlighted result',
    detectedHeading: 'Detected characters',
    copyReplaced: 'Copy text with replacements applied',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    noMatchesStatus: 'No machine-dependent characters were found.',
    matchesFoundSingular:
      'Found {count} machine-dependent character ({unique} unique).',
    matchesFoundPlural:
      'Found {count} machine-dependent characters ({unique} unique).',
    tableColumnChar: 'Character',
    tableColumnCodePoint: 'Code point',
    tableColumnCategory: 'Category',
    tableColumnDescription: 'Description',
    tableColumnCount: 'Count',
    tableColumnReplacement: 'Suggested replacement',
    countCellTemplate: '{count}',
    notesHeading: 'Notes',
    notes: [
      'This tool checks for well-known machine-dependent characters (NEC special characters, NEC-selected IBM extension characters, and similar). It does not cover every environment-dependent character that exists.',
      'The suggested replacements are general-purpose defaults. Depending on context (for example, wanting to keep "㍿" as part of a company name), a different replacement may be more appropriate — always review the replaced text before using it.',
      'IBM extension variants such as "髙" and "﨑" are sometimes used intentionally in personal or place names. A mechanical replacement may not always be appropriate for these.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Machine-dependent characters (kishu-izon moji)',
        description:
          'Characters such as circled numbers (①②③), Roman numerals (ⅠⅡⅢ), and ligatures like ㈱ ㍉ ㍻ that were added outside the standard JIS character set by specific PC vendors. They may look fine on the sender\'s device but turn into different characters or "mojibake" (garbled text) on another device, OS, or mail client.',
      },
      {
        term: 'Mojibake (garbled text)',
        description:
          'Text that displays as the wrong characters or as "�" placeholders because of a mismatch in character encoding interpretation. Many machine-dependent characters live in vendor-specific extension areas of encodings such as Shift_JIS, which makes them especially prone to this problem.',
      },
      {
        term: 'Shift_JIS',
        description:
          'A character encoding once widely used on Japanese Windows systems. In addition to standard JIS kanji, PC vendors added their own extension areas (NEC special characters, IBM extension characters, and so on), which is the main source of machine-dependent characters.',
      },
    ],
  },
};
