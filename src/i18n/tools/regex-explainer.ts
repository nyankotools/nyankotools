import type { Locale } from '../../data/tools';
import type {
  ErrorCode,
  FlagErrorCode,
  TokenKind,
} from '../../lib/tools/regex-explainer';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface RegexExplainerLabels {
  summary: string;
  groupsLine: string;
  namedGroupsLine: string;
  noGroups: string;
  flagsHeading: string;
  noFlags: string;
  tokensHeading: string;
  emptyPattern: string;
  errorHeading: string;
  errorPosition: string;
  lazyNote: string;
  literalFormNote: string;
}

export interface RegexExplainerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  patternLabel: string;
  patternPlaceholder: string;
  flagsLabel: string;
  flagsPlaceholder: string;
  sampleButton: string;
  clearButton: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  labels: RegexExplainerLabels;
  tokens: Record<TokenKind, string>;
  errors: Record<ErrorCode, string>;
  flagErrors: Record<FlagErrorCode, string>;
  flagDescriptions: Record<string, string>;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
  samplePattern: string;
  sampleFlags: string;
}

const SAMPLE_PATTERN =
  '^(?<user>[\\w.+-]+)@(?<domain>(?:[a-z\\d-]+\\.)+[a-z]{2,})$(?<!\\.)';

export const regexExplainerContent: Record<Locale, RegexExplainerPageContent> =
  {
    ja: {
      title: '正規表現の意味を日本語で解説（パターンを分解）',
      description:
        '正規表現のパターンを貼り付けると、文字クラス・量指定子・グループ・先読み・後読み・アンカー・フラグに分解して日本語で解説します。不正なパターンはエラー位置つきで表示。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: '正規表現の解説（パターンを要素ごとに分解）',
      introHtml:
        '読み解きたい正規表現を貼り付けると、文字クラス・量指定子・グループ・先読み／後読み・アンカー・エスケープ・フラグといった構文要素に分解し、1要素ずつ日本語で説明します。JavaScriptの正規表現構文に対応し、文法エラーは位置つきで指摘します。このツールはパターンを解説するだけで、テキストへのマッチは行いません。実際に試すには <a href="/tools/regex-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">正規表現テスター</a>、よく使うパターンは <a href="/tools/regex-pattern-library/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">正規表現パターン集</a> をご利用ください。',
      patternLabel: '正規表現パターン',
      patternPlaceholder: '^(\\d{3})-(\\d{4})$',
      flagsLabel: 'フラグ',
      flagsPlaceholder: 'gi',
      sampleButton: 'サンプルを入力',
      clearButton: 'クリア',
      copyButton: '説明をコピー',
      copied: 'コピーしました',
      copyFailed: 'コピーに失敗しました',
      labels: {
        summary: '解析結果',
        groupsLine: 'キャプチャグループ: {count}個',
        namedGroupsLine: '名前付きグループ: {names}',
        noGroups: 'キャプチャグループ: なし',
        flagsHeading: 'フラグ',
        noFlags: 'フラグ: 指定なし',
        tokensHeading: '構成要素',
        emptyPattern:
          '空のパターンは、どんな文字列にも（空文字の位置で）一致します。',
        errorHeading: 'パターンに誤りがあります',
        errorPosition: '{pos}文字目',
        lazyNote: '（できるだけ少なく一致する最短一致）',
        literalFormNote:
          '/パターン/フラグ 形式として読み取りました（フラグ欄より優先されます）。',
      },
      tokens: {
        literal: '文字「{c}」そのものに一致',
        space: '半角スペースに一致',
        any: '任意の1文字に一致（改行は除く。sフラグがあれば改行も含む）',
        digit: '数字（0-9）1文字に一致',
        notDigit: '数字以外の1文字に一致',
        word: '単語構成文字（英数字とアンダースコア）1文字に一致',
        notWord: '単語構成文字以外の1文字に一致',
        whitespace: '空白文字（スペース・タブ・改行など）1文字に一致',
        notWhitespace: '空白文字以外の1文字に一致',
        wordBoundary:
          '単語境界（単語構成文字とそれ以外の間）に一致。文字は消費しない',
        notWordBoundary: '単語境界でない位置に一致。文字は消費しない',
        start: '入力の先頭に一致（mフラグがあれば各行の先頭）',
        end: '入力の末尾に一致（mフラグがあれば各行の末尾）',
        escNewline: '改行（LF）に一致',
        escTab: 'タブに一致',
        escCR: '復帰（CR）に一致',
        escFF: '改ページ（FF）に一致',
        escVT: '垂直タブに一致',
        escNul: 'NUL文字（U+0000）に一致',
        escBackspace: 'バックスペース文字（U+0008）に一致',
        codePoint: '{hex}（{c}）の文字に一致',
        controlLetter: '制御文字 Ctrl+{c} に一致',
        unicodeProp: 'Unicodeプロパティ「{name}」を持つ1文字に一致',
        notUnicodeProp: 'Unicodeプロパティ「{name}」を持たない1文字に一致',
        escapedLiteral: '文字「{c}」そのものに一致（エスケープ）',
        backref: '{n}番目のキャプチャグループと同じ文字列に一致（後方参照）',
        namedBackref:
          'グループ「{name}」と同じ文字列に一致（名前付き後方参照）',
        classOpen: '文字クラス: 次のいずれか1文字に一致',
        negClassOpen: '否定の文字クラス: 次のいずれにも一致しない1文字に一致',
        classRange: '{from} から {to} までの範囲の1文字',
        group: 'キャプチャグループ {n}: 中身に一致した部分を記憶',
        namedGroup:
          '名前付きキャプチャグループ「{name}」（{n}番目）: 中身に一致した部分を記憶',
        nonCapture: '非キャプチャグループ: まとめるだけで記憶しない',
        lookahead:
          '肯定の先読み: 直後が次の内容であることを確認（文字は消費しない）',
        negLookahead:
          '否定の先読み: 直後が次の内容でないことを確認（文字は消費しない）',
        lookbehind:
          '肯定の後読み: 直前が次の内容であることを確認（文字は消費しない）',
        negLookbehind:
          '否定の後読み: 直前が次の内容でないことを確認（文字は消費しない）',
        modifierGroup: '修飾子グループ: この中だけフラグを変更（{flags}）',
        alternation: '選択（OR）: 左右どちらかに一致',
        qStar: '直前の要素の0回以上の繰り返し',
        qPlus: '直前の要素の1回以上の繰り返し',
        qOptional: '直前の要素が0回または1回（あってもなくてもよい）',
        qExact: '直前の要素のちょうど{n}回の繰り返し',
        qAtLeast: '直前の要素の{n}回以上の繰り返し',
        qRange: '直前の要素の{min}回から{max}回の繰り返し',
      },
      errors: {
        unterminatedGroup: '開き括弧「(」に対応する閉じ括弧「)」がありません。',
        unmatchedParen: '対応する開き括弧のない閉じ括弧「)」があります。',
        unterminatedClass: '文字クラス「[」が「]」で閉じられていません。',
        rangeOutOfOrder:
          '文字クラスの範囲の順序が逆です（例: z-a ではなく a-z と書きます）。',
        invalidClassRange:
          'uフラグ（またはvフラグ）では、\\d などのクラスを範囲の端に使えません。',
        nothingToRepeat:
          '量指定子の前に繰り返す対象がありません（先頭、| の直後、^ や $ などのアンカーの直後、量指定子の直後には置けません）。',
        incompleteQuantifier:
          'uフラグ（またはvフラグ）では、{ をリテラルとして書けません。{n}・{n,}・{n,m} の形にするか、\\{ とエスケープしてください。',
        quantifierOutOfOrder: '{n,m} の最小値が最大値より大きくなっています。',
        trailingBackslash: 'パターンがバックスラッシュ「\\」で終わっています。',
        invalidEscape:
          'uフラグ（またはvフラグ）では使えないエスケープ、または形式が不正なエスケープです。',
        invalidBackref:
          'uフラグ（またはvフラグ）では、存在しないグループへの後方参照は使えません。',
        invalidGroup:
          '「(?」の後ろの構文が不正です。(?: (?= (?! (?<= (?<! (?<名前> のいずれかで始めてください。',
        invalidGroupName:
          'グループ名が不正です。英字・$・_ で始まる識別子を < > で囲んで指定します。',
        undefinedGroupName: '定義されていない名前のグループを参照しています。',
        loneBracket:
          'uフラグ（またはvフラグ）では、] や } を単独で書けません。\\] \\} とエスケープしてください。',
        native: 'JavaScriptの正規表現として無効です: {detail}',
      },
      flagErrors: {
        invalidFlag:
          'フラグ「{char}」は使えません。使えるのは d g i m s u v y です。',
        duplicateFlag: 'フラグ「{char}」が重複しています。',
        flagUV: 'uフラグとvフラグは同時に指定できません。',
      },
      flagDescriptions: {
        d: 'マッチ位置の添字（indices）を結果に含める',
        g: '全体検索: 最初の1件だけでなく、すべての一致を探す',
        i: '大文字と小文字を区別しない',
        m: '複数行モード: ^ と $ が各行の先頭・末尾に一致する',
        s: 'dotAllモード: . が改行にも一致する',
        u: 'Unicodeモード: サロゲートペアをコードポイントとして扱い、\\p{…} が使える。構文も厳格になる',
        v: 'Unicode集合モード: uの拡張。文字クラスの集合演算などが使える',
        y: 'sticky: lastIndex の位置からだけ一致を試みる',
      },
      howToHeading: '使い方',
      howToSteps: [
        '「正規表現パターン」欄に解説したいパターンを入力します（/パターン/gi 形式で貼り付けてもかまいません）。',
        'フラグが必要なら「フラグ」欄に g i m s u v y などを入力します。',
        '下に表示される構成要素の一覧で、各部分の意味とネスト構造を確認します。',
        '「説明をコピー」で解説をテキストとして保存できます。「サンプルを入力」で例を試せます。',
      ],
      notesHeading: '注意点',
      notes: [
        'JavaScript（ECMAScript）の正規表現構文を対象にしています。PCRE・Python・Javaなど他の言語では、一部の構文（所有量指定子、条件式、\\A \\z など）の意味や可否が異なります。',
        'このツールはパターンの意味を説明するだけで、テキストへの一致判定は行いません。動作の確認には正規表現テスターを使ってください。',
        '構文エラーは位置（先頭を1文字目として数えます）つきで表示します。パーサーが見逃した不正は、ブラウザの RegExp が返すメッセージで補います。',
        'uフラグやvフラグを付けると構文が厳格になり、フラグなしでは通るパターン（例: 不要なエスケープ \\a）がエラーになります。',
        'ネストしたグループや文字クラスの中身は、字下げして表示します。量指定子は、直前の1要素（グループなら閉じ括弧まで）にかかります。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: '量指定子（グリーディ／レイジー）',
          description:
            '* + ? {n,m} など、直前の要素の繰り返し回数を決める記号です。通常はできるだけ多く一致する（最長一致）が、後ろに ? を付けるとできるだけ少なく一致する（最短一致）になります。',
        },
        {
          term: '先読み・後読み',
          description:
            '文字を消費せずに、直後（先読み）や直前（後読み）の内容を条件として確認する構文です。(?=…) (?!…) (?<=…) (?<!…) の4種類があります。',
        },
        {
          term: 'キャプチャグループ',
          description:
            '( ) で囲んだ部分に一致した文字列を記憶する仕組みです。番号（左の開き括弧から順に1,2,…）や名前で、後方参照や置換から取り出せます。記憶が不要なら (?:…) を使います。',
        },
        {
          term: 'アンカーと単語境界',
          description:
            '^ $ \\b \\B のように、文字ではなく位置に一致する要素です。長さ0で、文字を消費しません。',
        },
        {
          term: 'Unicodeプロパティエスケープ',
          description:
            '\\p{Letter} や \\p{Script=Hiragana} のように、Unicodeの文字の性質で文字を指定する構文です。uまたはvフラグが必要です。',
        },
      ],
      samplePattern: SAMPLE_PATTERN,
      sampleFlags: 'i',
    },
    en: {
      title: 'Regex Explainer (Break Down a Regular Expression)',
      description:
        'Paste a regular expression and see each part explained in plain English: character classes, quantifiers, groups, lookarounds and flags. Runs in your browser.',
      h1: 'Regex Explainer: Break a Pattern Into Plain-English Parts',
      introHtml:
        'Paste a regular expression to split it into its syntax elements (character classes, quantifiers, groups, lookaheads and lookbehinds, anchors, escapes and flags) and read what each one does. It follows JavaScript regex syntax and reports syntax errors with their position. This tool only explains a pattern; it does not match it against text. To try a pattern on real input use the <a href="/en/tools/regex-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Regex Tester</a>, or grab a ready-made one from the <a href="/en/tools/regex-pattern-library/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Regex Pattern Library</a>.',
      patternLabel: 'Regex pattern',
      patternPlaceholder: '^(\\d{3})-(\\d{4})$',
      flagsLabel: 'Flags',
      flagsPlaceholder: 'gi',
      sampleButton: 'Insert sample',
      clearButton: 'Clear',
      copyButton: 'Copy explanation',
      copied: 'Copied',
      copyFailed: 'Copy failed',
      labels: {
        summary: 'Result',
        groupsLine: 'Capturing groups: {count}',
        namedGroupsLine: 'Named groups: {names}',
        noGroups: 'Capturing groups: none',
        flagsHeading: 'Flags',
        noFlags: 'Flags: none',
        tokensHeading: 'Parts of the pattern',
        emptyPattern:
          'An empty pattern matches at every position (the empty string).',
        errorHeading: 'This pattern is not valid',
        errorPosition: 'Character {pos}',
        lazyNote: ' (lazy: matches as few as possible)',
        literalFormNote:
          'Read as /pattern/flags form; its flags take priority over the Flags field.',
      },
      tokens: {
        literal: 'Matches the character "{c}" literally',
        space: 'Matches a space character',
        any: 'Matches any one character except a newline (including newlines with the s flag)',
        digit: 'Matches one digit (0-9)',
        notDigit: 'Matches one character that is not a digit',
        word: 'Matches one word character (letter, digit or underscore)',
        notWord: 'Matches one character that is not a word character',
        whitespace:
          'Matches one whitespace character (space, tab, newline, ...)',
        notWhitespace: 'Matches one character that is not whitespace',
        wordBoundary:
          'Matches a word boundary (between a word character and a non-word character); consumes nothing',
        notWordBoundary:
          'Matches a position that is not a word boundary; consumes nothing',
        start:
          'Matches the start of the input (the start of each line with the m flag)',
        end: 'Matches the end of the input (the end of each line with the m flag)',
        escNewline: 'Matches a line feed (LF)',
        escTab: 'Matches a tab',
        escCR: 'Matches a carriage return (CR)',
        escFF: 'Matches a form feed (FF)',
        escVT: 'Matches a vertical tab',
        escNul: 'Matches the NUL character (U+0000)',
        escBackspace: 'Matches the backspace character (U+0008)',
        codePoint: 'Matches the character {hex} ({c})',
        controlLetter: 'Matches the control character Ctrl+{c}',
        unicodeProp: 'Matches one character with the Unicode property "{name}"',
        notUnicodeProp:
          'Matches one character without the Unicode property "{name}"',
        escapedLiteral: 'Matches the character "{c}" literally (escaped)',
        backref: 'Matches the same text as capturing group {n} (backreference)',
        namedBackref:
          'Matches the same text as the group "{name}" (named backreference)',
        classOpen: 'Character class: matches any one of the following',
        negClassOpen:
          'Negated character class: matches one character that is none of the following',
        classRange: 'One character in the range {from} to {to}',
        group: 'Capturing group {n}: remembers the text its contents matched',
        namedGroup:
          'Named capturing group "{name}" (group {n}): remembers the text its contents matched',
        nonCapture:
          'Non-capturing group: groups the contents without remembering them',
        lookahead:
          'Positive lookahead: asserts that what follows is the following (consumes nothing)',
        negLookahead:
          'Negative lookahead: asserts that what follows is not the following (consumes nothing)',
        lookbehind:
          'Positive lookbehind: asserts that what precedes is the following (consumes nothing)',
        negLookbehind:
          'Negative lookbehind: asserts that what precedes is not the following (consumes nothing)',
        modifierGroup:
          'Modifier group: changes flags only inside this group ({flags})',
        alternation:
          'Alternation (OR): matches either the left or the right side',
        qStar: 'Repeats the previous element 0 or more times',
        qPlus: 'Repeats the previous element 1 or more times',
        qOptional: 'The previous element appears 0 or 1 times (optional)',
        qExact: 'Repeats the previous element exactly {n} times',
        qAtLeast: 'Repeats the previous element {n} or more times',
        qRange: 'Repeats the previous element {min} to {max} times',
      },
      errors: {
        unterminatedGroup: 'This opening parenthesis "(" has no closing ")".',
        unmatchedParen: 'This closing parenthesis ")" has no matching "(".',
        unterminatedClass: 'This character class "[" is not closed by "]".',
        rangeOutOfOrder:
          'The range in this character class is reversed (write a-z, not z-a).',
        invalidClassRange:
          'With the u or v flag, a class such as \\d cannot be an end of a range.',
        nothingToRepeat:
          'There is nothing to repeat before this quantifier (it cannot follow the start of the pattern, "|", an anchor such as ^ or $, or another quantifier).',
        incompleteQuantifier:
          'With the u or v flag, a bare "{" is not allowed. Write {n}, {n,} or {n,m}, or escape it as \\{.',
        quantifierOutOfOrder:
          'The minimum in {n,m} is larger than the maximum.',
        trailingBackslash: 'The pattern ends with a backslash "\\".',
        invalidEscape:
          'This escape is malformed or not allowed with the u or v flag.',
        invalidBackref:
          'With the u or v flag, a backreference to a group that does not exist is not allowed.',
        invalidGroup:
          'Invalid syntax after "(?". Start with (?: (?= (?! (?<= (?<! or (?<name>.',
        invalidGroupName:
          'Invalid group name. Use an identifier that starts with a letter, $ or _ inside < >.',
        undefinedGroupName: 'This refers to a group name that is not defined.',
        loneBracket:
          'With the u or v flag, a bare ] or } is not allowed. Escape it as \\] or \\}.',
        native: 'Not a valid JavaScript regular expression: {detail}',
      },
      flagErrors: {
        invalidFlag:
          'The flag "{char}" is not valid. Allowed flags: d g i m s u v y.',
        duplicateFlag: 'The flag "{char}" is repeated.',
        flagUV: 'The u and v flags cannot be used together.',
      },
      flagDescriptions: {
        d: 'Include match indices in the result',
        g: 'Global: find every match, not just the first',
        i: 'Ignore case',
        m: 'Multiline: ^ and $ match at the start and end of each line',
        s: 'dotAll: . also matches newlines',
        u: 'Unicode mode: treats surrogate pairs as code points, enables \\p{...}, and applies stricter syntax',
        v: 'Unicode sets mode: an extension of u with set operations in character classes',
        y: 'Sticky: matches only at the position given by lastIndex',
      },
      howToHeading: 'How to use',
      howToSteps: [
        'Type or paste the pattern you want explained into "Regex pattern" (the /pattern/gi form works too).',
        'If you need flags, enter letters such as g i m s u v y in "Flags".',
        'Read the parts list below to see what each piece means and how groups nest.',
        'Use "Copy explanation" to save the text, or "Insert sample" to try an example.',
      ],
      notesHeading: 'Notes',
      notes: [
        'This explains JavaScript (ECMAScript) regex syntax. Other flavors such as PCRE, Python or Java differ on some features (possessive quantifiers, conditionals, \\A and \\z, and so on).',
        'The tool only explains a pattern; it never tests it against text. Use the Regex Tester to check behavior.',
        "Syntax errors show the character position (counting from 1). Anything the parser misses is caught with the message from the browser's own RegExp.",
        'The u and v flags make the syntax stricter, so a pattern that works without them (for example an unnecessary escape such as \\a) can become an error.',
        'Contents of groups and character classes are indented. A quantifier applies to the one element before it, or the whole group up to its closing parenthesis.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'Quantifier (greedy / lazy)',
          description:
            'Symbols such as * + ? and {n,m} that set how many times the previous element repeats. By default they match as much as possible (greedy); adding ? makes them match as little as possible (lazy).',
        },
        {
          term: 'Lookahead and lookbehind',
          description:
            'Assertions that check what follows (lookahead) or precedes (lookbehind) without consuming characters. There are four forms: (?=...) (?!...) (?<=...) (?<!...).',
        },
        {
          term: 'Capturing group',
          description:
            'Parentheses that remember the text their contents matched. Groups are numbered 1, 2, ... by their opening parenthesis and can also be named, then used in backreferences and replacements. Use (?:...) when you do not need to remember it.',
        },
        {
          term: 'Anchors and word boundaries',
          description:
            'Elements such as ^ $ \\b \\B match a position rather than a character. They have zero width and consume nothing.',
        },
        {
          term: 'Unicode property escape',
          description:
            'Syntax like \\p{Letter} or \\p{Script=Hiragana} that selects characters by their Unicode properties. It needs the u or v flag.',
        },
      ],
      samplePattern: SAMPLE_PATTERN,
      sampleFlags: 'i',
    },
  };
