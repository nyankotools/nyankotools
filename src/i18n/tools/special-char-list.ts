import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SpecialCharListPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  searchLabel: string;
  searchPlaceholder: string;
  basketLabel: string;
  basketPlaceholder: string;
  copy: string;
  clear: string;
  copied: string;
  copyFailed: string;
  noResults: string;
  /** グループIDごとの見出し */
  groupNames: Record<string, string>;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const specialCharListContent: Record<
  Locale,
  SpecialCharListPageContent
> = {
  ja: {
    title: '特殊文字・記号・絵文字一覧｜クリックでコピペ（★♡→①顔文字）',
    description:
      '星・ハート・矢印・丸数字・単位記号・顔文字・絵文字などの特殊文字を、クリックしてまとめてコピーできる一覧ツールです。キーワード検索にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '特殊文字・記号・絵文字一覧',
    introHtml:
      '星・ハート・矢印・丸数字・顔文字・絵文字などの文字をクリックすると、下の入力欄に追加されます。まとめて「コピー」して、文書やSNSに貼り付けてください。「星」「arrow」のようなキーワードで絞り込めます。文字をおしゃれに装飾したいときは <a href="/tools/unicode-decorator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unicode装飾文字変換</a> もご利用ください。',
    searchLabel: '検索',
    searchPlaceholder: '星、矢印、heart、顔文字 など',
    basketLabel: '選んだ文字',
    basketPlaceholder: '下の文字をクリックするとここに追加されます',
    copy: 'コピー',
    clear: 'クリア',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    noResults: '該当する文字はありません。別のキーワードを試してください。',
    groupNames: {
      stars: '星・きらきら・花',
      hearts: 'ハート',
      arrows: '矢印',
      shapes: '図形（丸・四角・三角）',
      bullets: '点・箇条書き・区切り',
      brackets: 'かっこ・引用符',
      math: '数学記号',
      currency: '通貨記号',
      circledNumbers: '丸数字・ローマ数字',
      units: '単位・略号（㎏ ㈱ ℃ など）',
      music: '音符',
      weather: '天気・天体・星座',
      cards: 'トランプ・チェス・サイコロ',
      misc: 'チェック・マーク・その他',
      lines: '罫線・ブロック',
      kaomoji: '顔文字',
      emojiFaces: '絵文字：顔',
      emojiHands: '絵文字：手・体',
      emojiHearts: '絵文字：ハート・感情',
      emojiAnimals: '絵文字：動物・植物',
      emojiFood: '絵文字：食べ物・飲み物',
      emojiObjects: '絵文字：物・お祝い・乗り物',
    },
    notesHeading: '注意事項',
    notes: [
      '絵文字や一部の記号は、OS・ブラウザ・アプリによって見た目が異なります。環境によっては表示されず、□や？になることがあります。',
      '丸数字・単位記号・㈱などの機種依存文字は、システムや文字コード（Shift_JIS など）によっては文字化けや登録エラーの原因になります。メールの件名、ファイル名、業務システムへの入力では、普通の文字に置き換えるのが安全です。',
      '顔文字は複数の文字の組み合わせです。環境によっては一部の文字が崩れて表示されます。',
      '検索はグループ名とキーワード、文字そのものに対して行います。1文字ごとの名前（「ハート型の黒塗り」など）では検索できません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '機種依存文字',
        description:
          '特定のOSやシステムでしか正しく表示・保存できない文字です。丸数字（①）や㈱などが代表例で、相手の環境によっては文字化けします。',
      },
      {
        term: '絵文字',
        description:
          'Unicodeに含まれる、絵の形をした文字です。見た目はOS・アプリごとのデザインで描かれるため、同じ絵文字でも相手の画面では違う絵に見えます。',
      },
    ],
  },
  en: {
    title: 'Special Characters, Symbols & Emoji List – Click to Copy',
    description:
      'Click-to-copy list of stars, hearts, arrows, circled numbers, kaomoji and emoji, with search. Runs in your browser; nothing is sent to a server.',
    h1: 'Special Characters, Symbols & Emoji List',
    introHtml:
      'Click a character to add it to the box below, then press Copy to paste everything into a document or a social post. Narrow the list with a keyword such as "star" or "arrow". To style letters in fancy fonts, see the <a href="/en/tools/unicode-decorator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unicode Text Decorator</a>.',
    searchLabel: 'Search',
    searchPlaceholder: 'star, arrow, heart, kaomoji …',
    basketLabel: 'Selected characters',
    basketPlaceholder: 'Click a character below to add it here',
    copy: 'Copy',
    clear: 'Clear',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    noResults: 'No matching characters. Try another keyword.',
    groupNames: {
      stars: 'Stars, sparkles & flowers',
      hearts: 'Hearts',
      arrows: 'Arrows',
      shapes: 'Shapes (circles, squares, triangles)',
      bullets: 'Bullets, dots & separators',
      brackets: 'Brackets & quotes',
      math: 'Math symbols',
      currency: 'Currency symbols',
      circledNumbers: 'Circled & Roman numerals',
      units: 'Units & abbreviations (㎏ ㈱ ℃ …)',
      music: 'Music notes',
      weather: 'Weather, astronomy & zodiac',
      cards: 'Cards, chess & dice',
      misc: 'Checks, marks & others',
      lines: 'Box drawing & blocks',
      kaomoji: 'Kaomoji (text faces)',
      emojiFaces: 'Emoji: faces',
      emojiHands: 'Emoji: hands & body',
      emojiHearts: 'Emoji: hearts & feelings',
      emojiAnimals: 'Emoji: animals & plants',
      emojiFood: 'Emoji: food & drink',
      emojiObjects: 'Emoji: objects, party & travel',
    },
    notesHeading: 'Notes',
    notes: [
      'Emoji and some symbols look different depending on the OS, browser and app. In some environments they are not displayed and appear as □ or ?.',
      'Platform-dependent characters such as circled numbers and unit symbols (㈱) can turn into garbled text or cause errors depending on the system or encoding (for example Shift_JIS). For email subjects, file names and business systems, plain characters are safer.',
      'Kaomoji are combinations of several characters, and in some environments parts of them may look broken.',
      'Search matches group names, keywords and the characters themselves. You cannot search by a single character’s official name.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Platform-dependent character',
        description:
          'A character that can be displayed or stored correctly only on certain systems. Circled numbers (①) and ㈱ are typical examples and may be garbled on the recipient’s side.',
      },
      {
        term: 'Emoji',
        description:
          'Picture-shaped characters included in Unicode. Each OS and app draws them with its own design, so the same emoji can look different on another screen.',
      },
    ],
  },
};
