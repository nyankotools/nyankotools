import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface UnicodeNormalizerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  formLabel: string;
  formNfc: string;
  formNfd: string;
  formNfkc: string;
  formNfkd: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  resultLabel: string;
  /** `{codePoints}` `{utf16}` `{decomposed}` を置換 */
  statsTemplate: string;
  /** `{count}` を置換。分離した濁点・半濁点が見つかった場合 */
  decomposedWarningTemplate: string;
  unchangedMessage: string;
  changesHeading: string;
  /** `{count}` を置換 */
  changeCountTemplate: string;
  /** `{shown}` `{count}` を置換。一覧が切り詰められた場合 */
  truncatedTemplate: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const unicodeNormalizerContent: Record<
  Locale,
  UnicodeNormalizerPageContent
> = {
  ja: {
    title: 'Unicode正規化ツール（NFC/NFD/NFKC/NFKD・濁点分離対策）',
    description:
      'テキストをUnicode正規化（NFC・NFD・NFKC・NFKD）で変換。Macのファイル名で起きる濁点・半濁点の分離を検出して直し、変換された箇所も一覧表示。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Unicode正規化（NFC/NFD/NFKC/NFKD）・濁点分離の修正',
    introHtml:
      'テキストをUnicodeの正規化形式（NFC・NFD・NFKC・NFKD）に変換します。Macのファイル名をコピーすると「が」が「か」＋濁点の2文字に分かれてしまい、検索や比較が一致しない問題は、NFCに変換すると解消します。半角カナ・全角英数の統一には <a href="/tools/zenkaku-hankaku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">全角・半角変換</a> も使えます。',
    inputLabel: '変換したいテキスト',
    inputPlaceholder: 'ファイル名やテキストを貼り付けてください',
    sampleText: 'がい゙ど゙（ガイド）ﾊﾞｲﾄ ＡＢＣ１２３',
    formLabel: '正規化形式',
    formNfc: 'NFC（合成・標準）',
    formNfd: 'NFD（分解）',
    formNfkc: 'NFKC（互換合成）',
    formNfkd: 'NFKD（互換分解）',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    resultLabel: '結果',
    statsTemplate:
      '{codePoints}コードポイント / UTF-16で{utf16}単位 / 分離した濁点・半濁点 {decomposed}件',
    decomposedWarningTemplate:
      '入力に濁点・半濁点が分離した文字が{count}件あります。NFCまたはNFKCに変換すると1文字にまとまります。',
    unchangedMessage: 'この形式では変化する文字はありませんでした。',
    changesHeading: '変換された箇所',
    changeCountTemplate: '{count}件',
    truncatedTemplate: '（{count}件中、先頭の{shown}件のみ表示）',
    notesHeading: '注意点',
    notes: [
      'NFKC・NFKDは互換文字も変換するため、半角カナが全角になる、全角英数が半角になる、「①」が「1」になる、「㌔」が「キロ」になるなど、見た目や意味が変わることがあります。単に濁点の分離を直したい場合はNFCを選んでください。',
      'ファイル名として使う場合、macOSの旧来のファイルシステムはNFD寄りで保存します。変換後のテキストを貼り付けても、保存先によっては再び分解されることがあります。',
      '変換された箇所の一覧は、文字とそれに続く結合文字を1単位として比較しています。長いテキストでは先頭の50件のみ表示します。',
      'すべての処理はブラウザ内で完結し、入力したテキストがサーバーに送信されることはありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'NFC / NFD',
        description:
          'NFCは文字と結合文字をできるだけ1文字にまとめる形式、NFDは1文字を基底文字と結合文字に分解する形式です。「が」はNFCで1コードポイント、NFDで「か」＋濁点の2コードポイントになります。',
      },
      {
        term: 'NFKC / NFKD',
        description:
          'NFC・NFDに加えて、半角カナ、全角英数字、丸数字、合字などの互換文字を標準的な文字へ置き換える形式です。検索用の文字揃えに向きますが、元に戻せません。',
      },
      {
        term: '結合文字',
        description:
          '直前の文字に重ねて表示される文字で、濁点（U+3099）や半濁点（U+309A）などがあります。分離した濁点は見た目は同じでも、文字列としては別物として扱われます。',
      },
    ],
  },
  en: {
    title: 'Unicode Normalizer (NFC / NFD / NFKC / NFKD)',
    description:
      'Convert text to Unicode NFC, NFD, NFKC or NFKD, fix decomposed Japanese dakuten from macOS filenames, and see what changed. Runs in your browser only.',
    h1: 'Unicode Normalizer (NFC / NFD / NFKC / NFKD)',
    introHtml:
      'Convert text between Unicode normalization forms (NFC, NFD, NFKC, NFKD). It is handy when copied text looks identical but fails to match in search or comparison, for example macOS filenames where a precomposed character is split into a base letter plus a combining mark. To convert full-width and half-width characters by hand, try the <a href="/en/tools/zenkaku-hankaku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Full-width / Half-width Converter</a>.',
    inputLabel: 'Text to normalize',
    inputPlaceholder: 'Paste a filename or any text',
    sampleText: 'がい゙ど゙ (ガイド) ﾊﾞｲﾄ ＡＢＣ１２３ café',
    formLabel: 'Normalization form',
    formNfc: 'NFC (composed, standard)',
    formNfd: 'NFD (decomposed)',
    formNfkc: 'NFKC (compatibility composed)',
    formNfkd: 'NFKD (compatibility decomposed)',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    resultLabel: 'Result',
    statsTemplate:
      '{codePoints} code points / {utf16} UTF-16 units / {decomposed} decomposed dakuten or handakuten',
    decomposedWarningTemplate:
      'The input has {count} decomposed dakuten or handakuten mark(s). Converting to NFC or NFKC merges them into single characters.',
    unchangedMessage: 'No characters change in this form.',
    changesHeading: 'Changed characters',
    changeCountTemplate: '{count} change(s)',
    truncatedTemplate: '(showing the first {shown} of {count})',
    notesHeading: 'Notes',
    notes: [
      'NFKC and NFKD also replace compatibility characters, so appearance or meaning can change: half-width katakana becomes full-width, full-width letters become ASCII, "①" becomes "1", and so on. If you only want to repair split accents or dakuten, choose NFC.',
      'Older macOS file systems store filenames in a decomposed (NFD-like) form. Even after you paste normalized text, the destination may decompose it again.',
      'The list of changes compares each character together with its combining marks as one unit. For long text, only the first 50 changes are listed.',
      'Everything runs in your browser. The text you enter is never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'NFC / NFD',
        description:
          'NFC merges base characters and combining marks into single characters where possible; NFD splits them apart. For example "é" is one code point in NFC and "e" plus a combining accent in NFD.',
      },
      {
        term: 'NFKC / NFKD',
        description:
          'Like NFC and NFD, but they also replace compatibility characters such as half-width katakana, full-width letters, circled digits and ligatures with standard ones. Useful for matching text, but not reversible.',
      },
      {
        term: 'Combining mark',
        description:
          'A character drawn on top of the preceding one, such as an accent or the Japanese dakuten (U+3099). A decomposed form looks the same but is a different string.',
      },
    ],
  },
};
