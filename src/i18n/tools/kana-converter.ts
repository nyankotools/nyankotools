import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface KanaConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  directionLabel: string;
  modeToKatakana: string;
  modeToHiragana: string;
  copy: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  inputPlaceholder: string;
  outputLabel: string;
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const kanaConverterContent: Record<Locale, KanaConverterPageContent> = {
  ja: {
    title: 'ひらがな/カタカナ変換',
    description:
      'ひらがなとカタカナを相互に変換する無料ツールです。濁音・半濁音・拗音・促音・踊り字にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ひらがな/カタカナ変換',
    introHtml:
      'テキストを入力すると、ひらがなとカタカナを相互に変換します。濁音・半濁音・拗音・促音・「ゔ」「ヴ」・踊り字（ゝゞ／ヽヾ）にも対応しており、漢字や英数字などそれ以外の文字はそのまま維持されます。半角カタカナを含むテキストの変換には <a href="/tools/zenkaku-hankaku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">全角/半角変換</a> もあわせてご利用ください。',
    directionLabel: '変換方向',
    modeToKatakana: 'ひらがな→カタカナ',
    modeToHiragana: 'カタカナ→ひらがな',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: '入力',
    inputPlaceholder: '変換したいテキストを入力',
    outputLabel: '結果',
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ひらがな・カタカナ',
        description:
          'どちらも日本語の音を表す表音文字（仮名）です。同じ音でも「ひらがな」と「カタカナ」はコンピューター上では別の文字として扱われるため、表記ゆれの統一や全文検索の前処理などで変換が必要になることがあります。',
      },
      {
        term: '踊り字（おどりじ）',
        description:
          '直前の文字の繰り返しを表す記号です。ひらがなの「ゝ」「ゞ」、カタカナの「ヽ」「ヾ」がこれにあたり、本ツールでも変換対象に含まれます。',
      },
    ],
  },
  en: {
    title: 'Hiragana / Katakana Converter for Japanese Learners',
    description:
      'Free online tool for Japanese learners: instantly convert text between hiragana and katakana, including voiced sounds, the small tsu, and iteration marks. Great for checking vocabulary, flashcards, and loanwords. Runs entirely in your browser — nothing is sent to a server.',
    h1: 'Hiragana / Katakana Converter for Japanese Learners',
    introHtml:
      'Paste in Japanese text and instantly see it in the other kana script — handy when you\'re studying vocabulary, making flashcards, or double-checking how a loanword (gairaigo) or name should be written in katakana. Voiced and semi-voiced sounds, contracted sounds (ゃゅょ), the small tsu (っ), "ゔ"/"ヴ", and iteration marks (ゝゞ / ヽヾ) are all converted automatically, while kanji, romaji, and other characters are left untouched. If you\'re also working with half-width katakana, try the <a href="/en/tools/zenkaku-hankaku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Full-width / Half-width Converter</a> as well.',
    directionLabel: 'Direction',
    modeToKatakana: 'Hiragana → Katakana',
    modeToHiragana: 'Katakana → Hiragana',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabel: 'Input',
    inputPlaceholder: 'Enter text to convert',
    outputLabel: 'Result',
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'When to use hiragana vs. katakana',
        description:
          'Hiragana is used for native Japanese words and grammatical parts (particles, verb endings, etc.), while katakana is mainly used for loanwords from other languages (gairaigo), foreign names, onomatopoeia, and for emphasis — similar to italics in English. Seeing a word in both scripts can help you recognize it either way.',
      },
      {
        term: 'Iteration marks (ゝゞ / ヽヾ)',
        description:
          'Symbols that repeat the previous character, occasionally seen in names and older texts: "ゝ"/"ゞ" in hiragana and "ヽ"/"ヾ" in katakana. This tool converts these too, so they won’t be left behind by mistake.',
      },
    ],
  },
};
