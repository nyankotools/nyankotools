import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface AnagramPalindromeCheckerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  optionsLabel: string;
  optNfkc: string;
  optIgnoreCase: string;
  optIgnoreSpaces: string;
  optIgnorePunctuation: string;
  optUnifyKana: string;
  optIgnoreLongVowel: string;
  optIgnoreDakuten: string;
  anagramHeading: string;
  inputALabel: string;
  inputBLabel: string;
  anagramPlaceholderA: string;
  anagramPlaceholderB: string;
  anagramSample: { a: string; b: string };
  sampleButton: string;
  anagramYes: string;
  anagramIdentical: string;
  anagramNo: string;
  anagramEmpty: string;
  normalizedALabel: string;
  normalizedBLabel: string;
  /** {n} を文字数に置換する */
  charsUnit: string;
  extraInALabel: string;
  extraInBLabel: string;
  none: string;
  palindromeHeading: string;
  palindromeInputLabel: string;
  palindromePlaceholder: string;
  palindromeSample: string;
  palindromeYes: string;
  palindromeNo: string;
  palindromeEmpty: string;
  normalizedLabel: string;
  reversedLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const anagramPalindromeCheckerContent: Record<
  Locale,
  AnagramPalindromeCheckerPageContent
> = {
  ja: {
    title: 'アナグラム・回文チェッカー（かな・記号を無視して判定）',
    description:
      '2つの語がアナグラムか、文が回文かを判定する無料ツールです。大文字小文字・空白・記号・カタカナとひらがなの差・長音・濁点の扱いを選べ、正規化後の文字列と過不足の文字も表示します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'アナグラム・回文チェッカー',
    introHtml:
      '2つの語が同じ文字の並べ替え（アナグラム）か、文が前から読んでも後ろから読んでも同じ（回文）かを判定します。比較前に、大文字小文字や空白、記号、カタカナとひらがなの差などをそろえる方法を選べます。文字数の確認には <a href="/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字数カウント</a> も使えます。',
    optionsLabel: '比較前にそろえる内容',
    optNfkc: '全角英数・半角カナを正規化する（NFKC）',
    optIgnoreCase: '大文字小文字を区別しない',
    optIgnoreSpaces: '空白を無視する',
    optIgnorePunctuation: '記号・句読点を無視する',
    optUnifyKana: 'カタカナとひらがなを同じとみなす',
    optIgnoreLongVowel: '長音「ー」を無視する',
    optIgnoreDakuten: '濁点・半濁点を無視する',
    anagramHeading: 'アナグラム判定',
    inputALabel: '語・文 A',
    inputBLabel: '語・文 B',
    anagramPlaceholderA: '例: Listen',
    anagramPlaceholderB: '例: Silent',
    anagramSample: { a: 'Dormitory', b: 'Dirty room' },
    sampleButton: 'サンプルを入れる',
    anagramYes: 'アナグラムです',
    anagramIdentical: '同じ文字列です（並べ替えなしで一致）',
    anagramNo: 'アナグラムではありません',
    anagramEmpty: '比較できる文字がありません。両方に文字を入力してください',
    normalizedALabel: 'A の正規化後',
    normalizedBLabel: 'B の正規化後',
    charsUnit: '{n}文字',
    extraInALabel: 'A にだけ多い文字（B に不足）',
    extraInBLabel: 'B にだけ多い文字（A に不足）',
    none: 'なし',
    palindromeHeading: '回文判定',
    palindromeInputLabel: '文',
    palindromePlaceholder: '例: たけやぶやけた',
    palindromeSample: 'たけやぶやけた',
    palindromeYes: '回文です',
    palindromeNo: '回文ではありません',
    palindromeEmpty: '判定できる文字がありません',
    normalizedLabel: '正規化後',
    reversedLabel: '逆順',
    notesHeading: '注意事項',
    notes: [
      '文字はコードポイント単位で数えます。𠮷や絵文字も1文字として扱いますが、複数のコードポイントでできた絵文字は分かれて数えます。',
      '「記号・句読点を無視する」をオンにすると、絵文字や記号類も無視されます。長音「ー」は記号として削除せず、「長音を無視する」で別に指定します。',
      '「濁点・半濁点を無視する」をオンにすると、が→か、ぱ→はのように清音にそろえて比べます。しりとりや言葉遊びでゆるく比べたいときに使います。',
      '漢字は読みを考慮しません。読みで比べたいときは、ひらがなに直した文字列を入力してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'アナグラム',
        description:
          '文字を並べ替えて別の語や文を作る言葉遊びです。Listen と Silent のように、使う文字の種類と個数が同じなら成り立ちます。',
      },
      {
        term: '回文',
        description:
          '前から読んでも後ろから読んでも同じになる語や文です。「たけやぶやけた」「しんぶんし」が代表例で、空白や記号を除いて比べるのが一般的です。',
      },
      {
        term: 'NFKC正規化',
        description:
          'Unicodeの互換文字を通常の文字にそろえる処理です。全角の「Ａ」を半角の「A」に、半角カナの「ｶﾞ」を「ガ」にそろえます。',
      },
    ],
  },
  en: {
    title: 'Anagram & Palindrome Checker (Ignore Case and Symbols)',
    description:
      'Check whether two words are anagrams or a phrase is a palindrome. Choose how case, spaces, punctuation and kana are handled, and see the missing letters.',
    h1: 'Anagram & Palindrome Checker',
    introHtml:
      'Find out whether two words are made of the same letters (an anagram) or whether a phrase reads the same backward and forward (a palindrome). Before comparing, you can choose to ignore case, spaces, punctuation and Japanese kana differences. To count characters in a text, try the <a href="/en/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Character Counter</a>.',
    optionsLabel: 'Normalize before comparing',
    optNfkc: 'Normalize full-width and half-width forms (NFKC)',
    optIgnoreCase: 'Ignore case',
    optIgnoreSpaces: 'Ignore spaces',
    optIgnorePunctuation: 'Ignore punctuation and symbols',
    optUnifyKana: 'Treat katakana and hiragana as the same',
    optIgnoreLongVowel: 'Ignore the long vowel mark "ー"',
    optIgnoreDakuten: 'Ignore dakuten and handakuten marks',
    anagramHeading: 'Anagram check',
    inputALabel: 'Word or phrase A',
    inputBLabel: 'Word or phrase B',
    anagramPlaceholderA: 'e.g. Listen',
    anagramPlaceholderB: 'e.g. Silent',
    anagramSample: { a: 'Dormitory', b: 'Dirty room' },
    sampleButton: 'Insert sample',
    anagramYes: 'These are anagrams',
    anagramIdentical: 'Both are identical (a match without rearranging)',
    anagramNo: 'These are not anagrams',
    anagramEmpty: 'Nothing to compare. Enter text in both fields',
    normalizedALabel: 'A after normalizing',
    normalizedBLabel: 'B after normalizing',
    charsUnit: '{n} chars',
    extraInALabel: 'Extra in A (missing from B)',
    extraInBLabel: 'Extra in B (missing from A)',
    none: 'None',
    palindromeHeading: 'Palindrome check',
    palindromeInputLabel: 'Phrase',
    palindromePlaceholder: 'e.g. A man, a plan, a canal: Panama',
    palindromeSample: 'A man, a plan, a canal: Panama',
    palindromeYes: 'This is a palindrome',
    palindromeNo: 'This is not a palindrome',
    palindromeEmpty: 'Nothing to check',
    normalizedLabel: 'After normalizing',
    reversedLabel: 'Reversed',
    notesHeading: 'Notes',
    notes: [
      'Characters are counted by code point. Rare kanji and emoji count as one character, but emoji built from several code points are split.',
      'With "Ignore punctuation and symbols" on, emoji and other symbols are ignored too. The long vowel mark "ー" is not removed as a symbol; use its own option.',
      'With "Ignore dakuten and handakuten marks" on, voiced kana are compared as unvoiced ones (が as か, ぱ as は), which suits loose word games.',
      'Kanji readings are not considered. To compare by reading, enter the text in hiragana.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Anagram',
        description:
          'A word game where the letters of one word or phrase are rearranged into another. "Listen" and "Silent" qualify because they use the same letters the same number of times.',
      },
      {
        term: 'Palindrome',
        description:
          'A word or phrase that reads the same backward and forward, such as "level". Spaces and punctuation are usually ignored when comparing.',
      },
      {
        term: 'NFKC normalization',
        description:
          'A Unicode step that folds compatibility characters into ordinary ones, for example full-width "Ａ" into "A" and half-width katakana "ｶﾞ" into "ガ".',
      },
    ],
  },
};
