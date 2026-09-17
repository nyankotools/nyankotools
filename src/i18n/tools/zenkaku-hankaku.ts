import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ZenkakuHankakuPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  directionLabel: string;
  modeToHalf: string;
  modeToFull: string;
  copy: string;
  copied: string;
  copyFailed: string;
  charTypesLegend: string;
  optAlphanumeric: string;
  optSymbol: string;
  optKatakana: string;
  optSpace: string;
  inputLabel: string;
  inputPlaceholder: string;
  outputLabel: string;
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const zenkakuHankakuContent: Record<Locale, ZenkakuHankakuPageContent> =
  {
    ja: {
      title: '全角/半角変換',
      description:
        '英数字・記号・カタカナ・スペースを対象に、全角と半角を相互に変換できる無料ツールです。変換したい文字種を個別に選択可能。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: '全角/半角変換',
      introHtml:
        'テキストを入力すると、選択した文字種（英数字・記号・カタカナ・スペース）を全角⇔半角に変換します。フォーム入力の表記ゆれ統一や、半角カタカナが混在したデータの正規化などにご利用いただけます。変換後の文字数を確認したい場合は <a href="/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字数カウント</a> もあわせてご利用ください。',
      directionLabel: '変換方向',
      modeToHalf: '全角→半角',
      modeToFull: '半角→全角',
      copy: 'コピー',
      copied: 'コピーしました',
      copyFailed: 'コピーに失敗しました',
      charTypesLegend: '変換する文字種',
      optAlphanumeric: '英数字',
      optSymbol: '記号',
      optKatakana: 'カタカナ',
      optSpace: 'スペース',
      inputLabel: '入力',
      inputPlaceholder: '変換したいテキストを入力',
      outputLabel: '結果',
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: '全角・半角',
          description:
            '全角文字は日本語の文字幅（正方形）で表示される文字、半角文字はその半分の幅で表示される文字です。同じ「A」でも「Ａ」（全角）と「A」（半角）はコンピューター上では別の文字として扱われ、検索やプログラムの動作に影響することがあります。',
        },
        {
          term: '半角カタカナ',
          description:
            'JIS X 0201で定義された、半角幅で表示されるカタカナです。濁点・半濁点は「ﾞ」「ﾟ」として別の文字になるため、変換時は直前の文字と組み合わせて1文字の全角カタカナに変換されます。',
        },
      ],
    },
    en: {
      title: 'Full-width / Half-width Converter',
      description:
        'A free tool that converts between full-width and half-width characters for alphanumerics, symbols, katakana, and spaces, with each character type selectable individually. Your data is processed in the browser and never sent to a server.',
      h1: 'Full-width / Half-width Converter',
      introHtml:
        'Enter text and it will be converted between full-width and half-width for the character types you select (alphanumerics, symbols, katakana, and spaces). Useful for normalizing inconsistent form input or data that mixes in half-width katakana. To check the character count of the result, try the <a href="/en/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Character Counter</a> as well.',
      directionLabel: 'Direction',
      modeToHalf: 'Full → Half',
      modeToFull: 'Half → Full',
      copy: 'Copy',
      copied: 'Copied',
      copyFailed: 'Copy failed',
      charTypesLegend: 'Character types to convert',
      optAlphanumeric: 'Alphanumeric',
      optSymbol: 'Symbols',
      optKatakana: 'Katakana',
      optSpace: 'Space',
      inputLabel: 'Input',
      inputPlaceholder: 'Enter text to convert',
      outputLabel: 'Result',
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'Full-width / half-width',
          description:
            'Full-width characters occupy a square cell (the standard width used for Japanese text), while half-width characters occupy half that width. Even the same letter, such as "Ａ" (full-width) and "A" (half-width), is treated as a different character by computers, which can affect search results or program behavior.',
        },
        {
          term: 'Half-width katakana',
          description:
            'Katakana rendered at half width, as defined by JIS X 0201. Voiced and semi-voiced marks ("ﾞ" and "ﾟ") are separate characters, so converting to full-width combines each mark with the preceding character into a single full-width katakana character.',
        },
      ],
    },
  };
