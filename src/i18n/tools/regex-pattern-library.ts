import type { Locale } from '../../data/tools';
import type {
  PatternCategory,
  PatternId,
} from '../../lib/tools/regex-pattern-library';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface PatternText {
  name: string;
  description: string;
}

export interface RegexPatternLibraryPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  searchLabel: string;
  searchPlaceholder: string;
  searchHint: string;
  categoryLabel: string;
  allLabel: string;
  categories: Record<PatternCategory, string>;
  /** {shown} {total} を件数に置き換える */
  countTemplate: string;
  noResults: string;

  copyLabel: string;
  copiedLabel: string;
  copyFailedLabel: string;
  testerLabel: string;
  testerHref: string;
  flagsLabel: string;
  noFlags: string;
  matchLabel: string;
  nonMatchLabel: string;
  emptyExample: string;

  patterns: Record<PatternId, PatternText>;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const regexPatternLibraryContent: Record<
  Locale,
  RegexPatternLibraryPageContent
> = {
  ja: {
    title: '正規表現パターン集（郵便番号・電話番号・メール・カタカナなど）',
    description:
      '郵便番号・電話番号・メールアドレス・全角カタカナ・日付・IPアドレスなど、よく使う正規表現をコピーして使えるパターン集。一致／不一致の例つき。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '正規表現パターン集（日本向け）',
    introHtml:
      '郵便番号・電話番号・メールアドレス・全角カタカナ・日付・IPアドレスなど、入力チェックでよく使う正規表現をまとめました。各パターンには一致する例と一致しない例がついていて、ボタンでコピーできます。コピーしたパターンは <a href="/tools/regex-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">正規表現テスター</a> に貼り付けて、手元のデータで動作を確かめてください。',

    searchLabel: 'パターンを検索',
    searchPlaceholder: '例: 郵便番号 / email / カタカナ / 日付',
    searchHint:
      '名前・説明・パターン本体から探せます。空白区切りで複数の語を指定すると、すべてに一致するものだけが表示されます。',
    categoryLabel: 'カテゴリで絞り込み',
    allLabel: 'すべて',
    categories: {
      japan: '日本向け',
      chars: '文字種・空白',
      web: 'Web・ネットワーク',
      datetime: '日付・時刻',
      number: '数値',
      dev: '開発・ID',
    },
    countTemplate: '{shown} / {total} 件を表示中',
    noResults: '該当するパターンが見つかりません。',

    copyLabel: 'コピー',
    copiedLabel: 'コピーしました',
    copyFailedLabel: 'コピーできませんでした',
    testerLabel: 'regex-testerで試す',
    testerHref: '/tools/regex-tester/',
    flagsLabel: 'フラグ',
    noFlags: 'なし',
    matchLabel: '一致する例',
    nonMatchLabel: '一致しない例',
    emptyExample: '（空文字）',

    patterns: {
      'postal-jp': {
        name: '郵便番号（ハイフン任意）',
        description:
          '7桁の郵便番号。「100-0001」でも「1000001」でも一致します。実在する番号かどうかは確認しません。',
      },
      'postal-jp-hyphen': {
        name: '郵便番号（ハイフン必須）',
        description: '「123-4567」の形式だけを許可する郵便番号です。',
      },
      'phone-jp-mobile': {
        name: '携帯電話番号',
        description:
          '070・080・090 で始まる11桁。ハイフンは付けても付けなくても一致します。050 などの IP 電話は対象外です。',
      },
      'phone-jp-hyphen': {
        name: '固定電話番号（ハイフンあり）',
        description:
          '市外局番・市内局番・加入者番号をハイフンで区切った形式。「03-1234-5678」「0123-45-6789」などに一致し、携帯電話の「090-1234-5678」にも一致します。',
      },
      'phone-jp-digits': {
        name: '電話番号（数字のみ）',
        description:
          '0 で始まる10桁または11桁の数字だけの電話番号です。ハイフン入りは一致しません。',
      },
      'my-number': {
        name: 'マイナンバー（12桁）',
        description:
          '12桁の数字かどうかだけを調べます。チェックデジットの検証はしません。',
      },
      katakana: {
        name: '全角カタカナ',
        description:
          '全角カタカナと長音「ー」だけで構成された文字列。フリガナ欄の入力チェックに使えます。中黒「・」や空白は含まれません。',
      },
      hiragana: {
        name: 'ひらがな',
        description:
          'ひらがなと長音「ー」だけで構成された文字列。よみがな欄の入力チェックに使えます。',
      },
      kanji: {
        name: '漢字',
        description:
          '漢字と「々」だけで構成された文字列です。Unicode のスクリプトプロパティを使うため u フラグが必要です。',
      },
      'hankaku-kana': {
        name: '半角カタカナ',
        description:
          '半角カタカナだけの文字列です。濁点・半濁点も含みます。半角カナを禁止したい場合の判定に使えます。',
      },
      'zenkaku-digits': {
        name: '全角数字',
        description: '全角の数字「０〜９」だけで構成された文字列です。',
      },
      alnum: {
        name: '半角英数字',
        description: '半角の英字と数字だけで構成された文字列です。',
      },
      'no-ascii': {
        name: '半角英数記号以外を含む',
        description:
          'ASCII 以外の文字（日本語、アクセント付き文字、絵文字の一部など）を1文字でも含むと一致します。「全体が ASCII か」を調べる逆の判定です。',
      },
      'trim-spaces': {
        name: '先頭・末尾の空白',
        description:
          '文字列の先頭と末尾にある空白や改行です。g フラグ付きで置換に使い、置換後を空にすると trim と同じ結果になります。',
      },
      'blank-line': {
        name: '空行',
        description:
          '何も書かれていない行、または空白だけの行。m フラグを付けると行ごとに判定されます。',
      },
      email: {
        name: 'メールアドレス（実用的な簡易版）',
        description:
          '一般的なメールアドレスの形を判定します。RFC を完全には満たさず、日本語ドメインや引用符つきのローカル部は対象外です。最終的な確認は確認メールで行ってください。',
      },
      'url-http': {
        name: 'URL（http / https）',
        description:
          'http:// または https:// で始まり、空白を含まない URL。大文字小文字は区別しません。',
      },
      domain: {
        name: 'ドメイン名',
        description:
          'ラベルが英数字とハイフンで、末尾が英字2文字以上の FQDN。国際化ドメインは Punycode（xn--）に変換した形で判定します。',
      },
      ipv4: {
        name: 'IPv4 アドレス',
        description:
          '0〜255 の4つの数字をドットで区切った形式。「256」や先頭ゼロ付き「01」は一致しません。',
      },
      'mac-address': {
        name: 'MAC アドレス',
        description:
          'コロンまたはハイフン区切りの16進数6組。区切り文字の混在は区別しません。',
      },
      'hex-color': {
        name: 'カラーコード（#RGB / #RRGGBB）',
        description:
          '「#」で始まる3桁または6桁の16進数。アルファ付きの4桁・8桁は一致しません。',
      },
      'x-handle': {
        name: 'X（Twitter）のユーザー名',
        description:
          '英数字とアンダースコアの1〜15文字。先頭の「@」は任意です。',
      },
      'date-iso': {
        name: '日付（YYYY-MM-DD）',
        description:
          '月が01〜12、日が01〜31の範囲かを調べます。「2026-02-31」のような実在しない日付は一致するため、カレンダーとしての正しさは別途確認が必要です。',
      },
      'date-slash': {
        name: '日付（YYYY/M/D）',
        description:
          'スラッシュ区切りで、月と日のゼロ埋めは任意です。実在しない日付は一致します。',
      },
      'time-24h': {
        name: '時刻（24時間表記 HH:MM）',
        description: '00:00〜23:59 の範囲。時は2桁のゼロ埋めが必要です。',
      },
      integer: {
        name: '整数',
        description:
          '先頭にマイナス記号が付けられる整数です。「+」は含みません。',
      },
      decimal: {
        name: '小数',
        description:
          '整数部が必須の小数。「.5」や「1.」は一致しません。カンマ小数点は対象外です。',
      },
      'comma-number': {
        name: '3桁区切りの数値',
        description:
          '「1,234,567」のようにカンマで3桁ごとに区切られた正の整数です。',
      },
      uuid: {
        name: 'UUID',
        description:
          'ハイフン区切りの8-4-4-4-12形式。バージョンの値までは検証しません。大文字小文字は区別しません。',
      },
      semver: {
        name: 'セマンティックバージョン',
        description:
          'semver.org の仕様に沿った「1.2.3」「1.0.0-beta.1+build.5」の形式。先頭の「v」は含みません。',
      },
      slug: {
        name: 'スラッグ（URL 用の識別子）',
        description:
          '小文字の英数字をハイフンでつないだ文字列。先頭・末尾のハイフンや連続ハイフンは許可しません。',
      },
      username: {
        name: 'ユーザー名（3〜16文字）',
        description:
          '英字で始まり、英数字とアンダースコアを使える3〜16文字。長さや文字種はサービスの仕様に合わせて調整してください。',
      },
      'password-strong': {
        name: 'パスワード（英大小文字＋数字を含む8文字以上）',
        description:
          '先読み（?=…）で、小文字・大文字・数字をそれぞれ1文字以上含み、全体で8文字以上であることを調べます。',
      },
    },

    howToHeading: '使い方',
    howToSteps: [
      '検索欄やカテゴリのボタンで、使いたいパターンを探します。',
      '一致する例と一致しない例を見て、目的に合っているか確認します。',
      '「コピー」でパターンをコピーして、コードや入力チェックに貼り付けます。',
      '「regex-testerで試す」から正規表現テスターを開き、手元のデータで確かめます。',
    ],
    notesHeading: '注意事項',
    notes: [
      'パターンは JavaScript（ECMAScript）の正規表現として書かれています。Python・Java・PHP などでは、先読みや Unicode プロパティ、フラグの書き方が異なる場合があります。',
      'コピーされるのはパターン本体だけです。フラグ（i・m・u など）が必要なものは、カードに表示されているフラグを別途指定してください。',
      'メールアドレス・日付・パスワードなどは、実用的な簡易版です。存在確認や実在する日付かどうかは、正規表現だけでは判定できません。',
      '入力チェックはサーバー側でも必ず行ってください。ブラウザ側のチェックは利便性のためで、セキュリティ対策にはなりません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'アンカー（^ と $）',
        description:
          '文字列の先頭と末尾を表します。パターンの前後に付けることで、「文字列全体が一致する」ことを確かめられます。付けないと、一部だけが一致しても true になります。',
      },
      {
        term: '先読み（lookahead）',
        description:
          '「この位置の後ろに〜が続くか」を、文字を消費せずに調べる構文です。パスワードの強度チェックのように、複数の条件を同時に満たすかを判定するときに使います。',
      },
      {
        term: 'フラグ',
        description:
          '正規表現の動作を変える指定です。i は大文字小文字を無視、m は行ごとに ^ と $ を判定、g は全件の検索、u は Unicode の扱いを有効にします。',
      },
    ],
  },
  en: {
    title: 'Regex Pattern Library: Postal Code, Phone, Email & More',
    description:
      'Copy-ready regex for Japanese postal codes, phone numbers, katakana, plus email, URL, IPv4, dates, and UUIDs, with match examples. Runs in your browser.',
    h1: 'Regex Pattern Library (Japan Edition)',
    introHtml:
      'A collection of regular expressions for everyday input validation: Japanese postal codes and phone numbers, katakana and hiragana, plus email, URL, IPv4, dates, UUIDs, and more. Each pattern comes with examples that match and ones that do not, and you can copy it with one click. Paste the copied pattern into the <a href="/en/tools/regex-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Regex Tester</a> to try it on your own data.',

    searchLabel: 'Search patterns',
    searchPlaceholder: 'e.g. postal / email / katakana / date',
    searchHint:
      'Searches names, descriptions, and the patterns themselves. Separate several words with spaces to show only patterns that match all of them.',
    categoryLabel: 'Filter by category',
    allLabel: 'All',
    categories: {
      japan: 'Japan',
      chars: 'Characters & whitespace',
      web: 'Web & network',
      datetime: 'Date & time',
      number: 'Numbers',
      dev: 'Dev & IDs',
    },
    countTemplate: 'Showing {shown} of {total}',
    noResults: 'No matching patterns.',

    copyLabel: 'Copy',
    copiedLabel: 'Copied',
    copyFailedLabel: 'Copy failed',
    testerLabel: 'Try in Regex Tester',
    testerHref: '/en/tools/regex-tester/',
    flagsLabel: 'Flags',
    noFlags: 'none',
    matchLabel: 'Matches',
    nonMatchLabel: 'Does not match',
    emptyExample: '(empty string)',

    patterns: {
      'postal-jp': {
        name: 'Japanese postal code (hyphen optional)',
        description:
          'A 7-digit postal code. Both "100-0001" and "1000001" match. It does not check that the code actually exists.',
      },
      'postal-jp-hyphen': {
        name: 'Japanese postal code (hyphen required)',
        description: 'Accepts only the "123-4567" format.',
      },
      'phone-jp-mobile': {
        name: 'Japanese mobile number',
        description:
          'Eleven digits starting with 070, 080, or 090. Hyphens are optional. 050 IP phone numbers are not covered.',
      },
      'phone-jp-hyphen': {
        name: 'Japanese phone number (with hyphens)',
        description:
          'Area code, local code, and subscriber number split by hyphens, such as "03-1234-5678" or "0123-45-6789". Mobile numbers like "090-1234-5678" match too.',
      },
      'phone-jp-digits': {
        name: 'Japanese phone number (digits only)',
        description:
          'A 10- or 11-digit number that starts with 0 and has no hyphens. Hyphenated numbers do not match.',
      },
      'my-number': {
        name: 'My Number (12 digits)',
        description:
          'Only checks for exactly 12 digits. The check digit is not verified.',
      },
      katakana: {
        name: 'Full-width katakana',
        description:
          'Strings made only of full-width katakana and the long-vowel mark. Handy for furigana fields. The middle dot and spaces are not allowed.',
      },
      hiragana: {
        name: 'Hiragana',
        description:
          'Strings made only of hiragana and the long-vowel mark. Handy for reading (yomigana) fields.',
      },
      kanji: {
        name: 'Kanji',
        description:
          'Strings made only of kanji and the iteration mark 々. It uses a Unicode script property, so the u flag is required.',
      },
      'hankaku-kana': {
        name: 'Half-width katakana',
        description:
          'Strings made only of half-width katakana, including the voiced sound marks. Use it to detect or reject half-width kana.',
      },
      'zenkaku-digits': {
        name: 'Full-width digits',
        description: 'Strings made only of full-width digits 0 to 9.',
      },
      alnum: {
        name: 'Half-width letters and digits',
        description: 'Strings made only of ASCII letters and digits.',
      },
      'no-ascii': {
        name: 'Contains non-ASCII characters',
        description:
          'Matches when the text has at least one non-ASCII character, such as Japanese, accented letters, or some emoji. The opposite of checking that everything is ASCII.',
      },
      'trim-spaces': {
        name: 'Leading and trailing whitespace',
        description:
          'Whitespace and line breaks at the start and end of a string. Use it with the g flag in a replace, replacing with nothing, to get the same result as trim.',
      },
      'blank-line': {
        name: 'Blank lines',
        description:
          'Lines with nothing on them, or only whitespace. With the m flag each line is checked separately.',
      },
      email: {
        name: 'Email address (practical, simplified)',
        description:
          'Checks the common shape of an email address. It does not follow the RFC completely and skips internationalized domains and quoted local parts. Confirm the address by sending a message.',
      },
      'url-http': {
        name: 'URL (http / https)',
        description:
          'A URL that starts with http:// or https:// and has no whitespace. Case-insensitive.',
      },
      domain: {
        name: 'Domain name',
        description:
          'A fully qualified domain name whose labels use letters, digits, and hyphens and whose last label has 2 or more letters. Internationalized names are checked in their Punycode (xn--) form.',
      },
      ipv4: {
        name: 'IPv4 address',
        description:
          'Four numbers from 0 to 255 separated by dots. Values like "256" or zero-padded "01" do not match.',
      },
      'mac-address': {
        name: 'MAC address',
        description:
          'Six pairs of hex digits separated by colons or hyphens. Mixed separators are not rejected.',
      },
      'hex-color': {
        name: 'Hex color (#RGB / #RRGGBB)',
        description:
          'A "#" followed by 3 or 6 hex digits. The 4- and 8-digit forms with alpha do not match.',
      },
      'x-handle': {
        name: 'X (Twitter) username',
        description:
          '1 to 15 letters, digits, or underscores. The leading "@" is optional.',
      },
      'date-iso': {
        name: 'Date (YYYY-MM-DD)',
        description:
          'Checks that the month is 01-12 and the day is 01-31. Impossible dates such as "2026-02-31" still match, so validate the calendar date separately.',
      },
      'date-slash': {
        name: 'Date (YYYY/M/D)',
        description:
          'Slash-separated, with optional zero padding on month and day. Impossible dates still match.',
      },
      'time-24h': {
        name: 'Time (24-hour HH:MM)',
        description: 'From 00:00 to 23:59. The hour must be zero-padded.',
      },
      integer: {
        name: 'Integer',
        description:
          'A whole number with an optional leading minus sign. A plus sign is not allowed.',
      },
      decimal: {
        name: 'Decimal number',
        description:
          'A decimal with a required integer part, so ".5" and "1." do not match. Comma decimal separators are not supported.',
      },
      'comma-number': {
        name: 'Number with thousands separators',
        description:
          'A positive integer grouped in threes by commas, like "1,234,567".',
      },
      uuid: {
        name: 'UUID',
        description:
          'The 8-4-4-4-12 hyphenated format. The version digit is not validated. Case-insensitive.',
      },
      semver: {
        name: 'Semantic version',
        description:
          'Follows the semver.org spec, e.g. "1.2.3" or "1.0.0-beta.1+build.5". A leading "v" is not included.',
      },
      slug: {
        name: 'Slug (URL identifier)',
        description:
          'Lowercase letters and digits joined by single hyphens. Leading, trailing, and doubled hyphens are rejected.',
      },
      username: {
        name: 'Username (3-16 characters)',
        description:
          'Starts with a letter, then letters, digits, or underscores, for 3 to 16 characters in total. Adjust the length and characters to your service.',
      },
      'password-strong': {
        name: 'Password (8+ characters with upper, lower, and a digit)',
        description:
          'Uses lookaheads (?=...) to require at least one lowercase letter, one uppercase letter, and one digit, with 8 or more characters overall.',
      },
    },

    howToHeading: 'How to use',
    howToSteps: [
      'Find a pattern with the search box or the category buttons.',
      'Check the matching and non-matching examples to see whether it fits your case.',
      'Click "Copy" and paste the pattern into your code or validation.',
      'Click "Try in Regex Tester" to open the Regex Tester and try it on your own data.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Patterns are written as JavaScript (ECMAScript) regular expressions. Python, Java, PHP, and others differ in lookaheads, Unicode properties, and how flags are written.',
      'Only the pattern itself is copied. If a pattern needs flags (i, m, u, and so on), set the flags shown on its card yourself.',
      'The email, date, and password patterns are practical simplifications. A regex cannot confirm that an address exists or that a date is real.',
      'Always validate input on the server too. Checks in the browser are a convenience, not a security measure.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Anchors (^ and $)',
        description:
          'They mark the start and end of the string. Wrapping a pattern in them requires the whole string to match; without them, a partial match is enough for a test to return true.',
      },
      {
        term: 'Lookahead',
        description:
          'Checks what follows the current position without consuming characters. It is how a password pattern can require several conditions at once.',
      },
      {
        term: 'Flags',
        description:
          'Switches that change how a regex works: i ignores case, m makes ^ and $ work per line, g finds every match, and u enables Unicode handling.',
      },
    ],
  },
};
