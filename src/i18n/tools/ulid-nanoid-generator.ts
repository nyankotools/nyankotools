import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface UlidNanoidGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  kindLabel: string;
  kindUlid: string;
  kindNanoid: string;
  countLabel: string;
  sizeLabel: string;
  alphabetLabel: string;
  alphabetHint: string;
  lowercase: string;
  generate: string;
  copy: string;
  copied: string;
  copyFailed: string;
  outputLabel: string;
  errorAlphabet: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const ulidNanoidGeneratorContent: Record<
  Locale,
  UlidNanoidGeneratorPageContent
> = {
  ja: {
    title: 'ULID・NanoID生成',
    description:
      '時刻順に並べられるULIDと、短くURLに使いやすいNanoIDを1件〜100件まとめて生成できる無料ツールです。NanoIDは長さ・文字セットも指定可能。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ULID・NanoID生成',
    introHtml:
      '生成した順に並ぶ「ULID」と、短くてURLに使いやすい「NanoID」をまとめて生成します。どちらもブラウザの暗号学的乱数を使っています。標準的な形式のIDが必要な場合は <a href="/tools/uuid-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">UUID生成</a> もあわせてご利用ください。',
    kindLabel: 'IDの種類',
    kindUlid: 'ULID（26文字・時刻順）',
    kindNanoid: 'NanoID（短い・長さと文字を指定可）',
    countLabel: '生成する個数（1〜100）',
    sizeLabel: '長さ（1〜128）',
    alphabetLabel: '使う文字（空欄で既定の64文字）',
    alphabetHint:
      '既定は英数字と「_」「-」です。2〜256種類の文字を指定でき、重複した文字は取り除かれます。',
    lowercase: '小文字にする',
    generate: '生成する',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    outputLabel: '結果',
    errorAlphabet: '使う文字は重複を除いて2〜256種類にしてください。',
    notesHeading: '注意事項',
    notes: [
      'ULIDは先頭10文字が生成時刻（ミリ秒）、残り16文字がランダム値です。1回の生成分は同じ時刻を共有し、ランダム部を1ずつ増やすため、生成順に並べ替えても順序が保たれます。',
      'ULIDには生成時刻がそのまま含まれます。作成日時を知られたくないIDには使わないでください。',
      'NanoIDは長さが短いほど衝突しやすくなります。長さや文字種を減らす場合は、必要な一意性が保てるか確認してください。',
      'パスワードや認証トークンの用途には、専用のパスワード生成ツールのように文字種・強度を確認できるものを使うことをおすすめします。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ULID',
        description:
          'Universally Unique Lexicographically Sortable Identifier の略です。時刻とランダム値からなる26文字のIDで、文字列として並べると生成順になるため、データベースの主キーに向いています。',
      },
      {
        term: 'NanoID',
        description:
          '短くてURLにそのまま使える文字だけで作るランダムなIDです。標準では21文字で、長さや使う文字を自由に変えられます。',
      },
      {
        term: 'Crockford Base32',
        description:
          'ULIDで使う文字セットです。数字と英大文字から、読み間違えやすいI・L・O・Uを除いた32種類の文字でできています。',
      },
    ],
  },
  en: {
    title: 'Free ULID & NanoID Generator',
    description:
      'Generate 1 to 100 time-sortable ULIDs or URL-friendly NanoIDs at once, with custom NanoID length and alphabet. Runs in your browser, nothing is uploaded.',
    h1: 'ULID & NanoID Generator',
    introHtml:
      'Generates time-sortable ULIDs and short, URL-friendly NanoIDs in bulk. Both use the browser\'s cryptographic random source. If you need a standard-format identifier instead, try the <a href="/en/tools/uuid-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">UUID Generator</a> as well.',
    kindLabel: 'ID type',
    kindUlid: 'ULID (26 chars, time-sortable)',
    kindNanoid: 'NanoID (short, custom length and alphabet)',
    countLabel: 'Number to generate (1-100)',
    sizeLabel: 'Length (1-128)',
    alphabetLabel: 'Alphabet (leave empty for the default 64 characters)',
    alphabetHint:
      'The default is letters, digits, "_" and "-". You can use 2 to 256 distinct characters; duplicates are removed.',
    lowercase: 'Lowercase',
    generate: 'Generate',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    outputLabel: 'Result',
    errorAlphabet:
      'The alphabet must contain between 2 and 256 distinct characters.',
    notesHeading: 'Notes',
    notes: [
      'A ULID is a 10-character timestamp (milliseconds) followed by 16 random characters. IDs from one run share the same timestamp and increment the random part by one, so they stay in order when sorted.',
      'A ULID contains its creation time in plain form. Do not use it where the creation time should stay private.',
      'The shorter a NanoID is, the more likely collisions become. If you shorten the length or alphabet, make sure you still have enough uniqueness.',
      'For passwords or authentication tokens, use a dedicated tool such as the Password Generator, where you can check character types and strength.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'ULID',
        description:
          'Short for Universally Unique Lexicographically Sortable Identifier. A 26-character ID made of a timestamp and random data; sorting as strings gives creation order, which suits database primary keys.',
      },
      {
        term: 'NanoID',
        description:
          'A random ID built only from URL-safe characters. The default is 21 characters, and both the length and the alphabet can be customized.',
      },
      {
        term: 'Crockford Base32',
        description:
          'The alphabet used by ULID: 32 characters made of digits and uppercase letters, excluding the easily confused I, L, O, and U.',
      },
    ],
  },
};
