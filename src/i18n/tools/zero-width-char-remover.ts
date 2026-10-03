import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface GroupLabel {
  label: string;
  description: string;
}

export interface ZeroWidthCharRemoverPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  groupsLabel: string;
  groups: Record<
    'zeroWidth' | 'joiner' | 'direction' | 'other' | 'tag',
    GroupLabel
  >;
  /** {total} {removed} を置換する */
  summaryFound: string;
  summaryNone: string;
  findingsLabel: string;
  colCode: string;
  colName: string;
  colGroup: string;
  colCount: string;
  colStatus: string;
  statusRemoved: string;
  statusKept: string;
  /** キーは「U+200B」形式。Unicodeタグ文字は tagCharName を使う */
  charNames: Record<string, string>;
  tagCharName: string;
  outputLabel: string;
  visualizeLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const zeroWidthCharRemoverContent: Record<
  Locale,
  ZeroWidthCharRemoverPageContent
> = {
  ja: {
    title: 'ゼロ幅文字の検出・除去（見えない文字を削除）',
    description:
      'テキストに紛れ込んだゼロ幅スペース（U+200B）・BOM・ゼロ幅接合子・方向制御文字などの「見えない文字」を検出して、位置と件数を確認しながら除去できる無料ツールです。コピペ後の不具合やChatGPTの出力の掃除に。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ゼロ幅文字の検出・除去ツール',
    introHtml:
      'Webページやチャット、AIの出力からコピーした文章には、目に見えない「ゼロ幅スペース」などが混ざることがあります。検索やプログラムの文字列比較が合わない原因になるため、このツールで検出して除去できます。文字数の確認は <a href="/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字数カウント</a> もあわせてご利用ください。',
    inputLabel: '入力',
    inputPlaceholder: '見えない文字を含むテキストを貼り付け',
    sampleText: 'こん\u200Bにち\u200Bは\uFEFF 😀 Hello\u200D!',
    groupsLabel: '除去する文字の種類',
    groups: {
      zeroWidth: {
        label: 'ゼロ幅スペース類',
        description: 'U+200B・U+2060・U+FEFF（BOM）・U+180E',
      },
      joiner: {
        label: 'ゼロ幅接合子',
        description:
          'U+200C・U+200D。絵文字の合成（👨\u200D👩\u200D👧など）に使われるため、除去すると絵文字が分かれます',
      },
      direction: {
        label: '方向制御文字',
        description: 'U+200E・U+200F・U+202A〜U+202E・U+2066〜U+2069・U+061C',
      },
      other: {
        label: 'その他の不可視文字',
        description: 'ソフトハイフン（U+00AD）・U+034F・U+2061〜U+2064',
      },
      tag: {
        label: 'Unicodeタグ文字',
        description:
          'U+E0000〜U+E007F。見えないまま文字列を埋め込めます（一部の国旗絵文字にも使用）',
      },
    },
    summaryFound: '見えない文字を{total}個検出しました（{removed}個を除去）',
    summaryNone: '見えない文字は見つかりませんでした',
    findingsLabel: '検出した文字',
    colCode: 'コードポイント',
    colName: '名称',
    colGroup: '種類',
    colCount: '個数',
    colStatus: '処理',
    statusRemoved: '除去',
    statusKept: '残す',
    charNames: {
      'U+200B': 'ゼロ幅スペース',
      'U+2060': 'ワードジョイナー',
      'U+FEFF': 'BOM / ゼロ幅非改行スペース',
      'U+180E': 'モンゴル母音分離記号',
      'U+200C': 'ゼロ幅非接合子',
      'U+200D': 'ゼロ幅接合子',
      'U+200E': '左から右マーク',
      'U+200F': '右から左マーク',
      'U+061C': 'アラビア文字マーク',
      'U+202A': '左から右への埋め込み',
      'U+202B': '右から左への埋め込み',
      'U+202C': '方向書式の解除',
      'U+202D': '左から右への強制',
      'U+202E': '右から左への強制',
      'U+2066': '左から右への分離',
      'U+2067': '右から左への分離',
      'U+2068': '最初の強い文字による分離',
      'U+2069': '分離の解除',
      'U+00AD': 'ソフトハイフン',
      'U+034F': '結合書記素ジョイナー',
      'U+2061': '関数適用（不可視）',
      'U+2062': '不可視の乗算記号',
      'U+2063': '不可視の区切り記号',
      'U+2064': '不可視の加算記号',
    },
    tagCharName: 'タグ文字',
    outputLabel: '除去後のテキスト',
    visualizeLabel: '検出位置の可視化（[U+XXXX] で表示）',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      'ゼロ幅接合子（U+200C・U+200D）は絵文字の合成やペルシア語などの表記に使われます。初期設定では除去しない設定にしています。',
      '方向制御文字は、アラビア語・ヘブライ語など右から左に書く言語の文章を正しく表示するために使われます。そうした文章では除去しないでください。',
      'ファイル先頭のBOM（U+FEFF）は、文字コードの判定に使われることがあります。テキストをコピーして使う場合は除去して問題ありません。',
      'ノーブレークスペース（U+00A0）や全角スペースは、見える空白のため対象外です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ゼロ幅スペース（U+200B）',
        description:
          '幅を持たず、画面上では見えない文字です。単語の途中で改行を許可する目的で使われますが、コピペで紛れ込むと検索や文字列の比較が合わない原因になります。',
      },
      {
        term: 'BOM（バイトオーダーマーク）',
        description:
          'ファイルの先頭に付けられるU+FEFFの文字で、UTF-16のバイト順やUTF-8であることを示すために使われます。テキストの途中にある場合はゼロ幅非改行スペースとして扱われます。',
      },
      {
        term: 'Unicodeタグ文字',
        description:
          'U+E0000〜U+E007Fにある、画面に表示されない文字です。本来は言語タグなどのための領域で、現在はイングランドなどの国旗絵文字の指定に使われます。見えないまま文章を埋め込める点が悪用されることもあります。',
      },
    ],
  },
  en: {
    title: 'Zero-Width Character Detector & Remover',
    description:
      'Detect and remove zero-width spaces, BOM and other invisible characters, with a count of each. Runs in your browser; nothing is sent to a server.',
    h1: 'Zero-Width & Invisible Character Remover',
    introHtml:
      'Text copied from web pages, chats or AI output can contain invisible characters such as zero-width spaces. They break searches, string comparisons and diffs without any visible sign. Paste your text here to detect them and strip them out. To check length afterwards, try the <a href="/en/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Character Counter</a>.',
    inputLabel: 'Input',
    inputPlaceholder: 'Paste text that may contain invisible characters',
    sampleText: 'He\u200Bllo wor\u200Bld\uFEFF 😀 Test\u200D!',
    groupsLabel: 'Character types to remove',
    groups: {
      zeroWidth: {
        label: 'Zero-width spaces',
        description: 'U+200B, U+2060, U+FEFF (BOM), U+180E',
      },
      joiner: {
        label: 'Zero-width joiners',
        description:
          'U+200C, U+200D. Used to build compound emoji (like 👨\u200D👩\u200D👧), so removing them splits those emoji',
      },
      direction: {
        label: 'Bidi control characters',
        description:
          'U+200E, U+200F, U+202A to U+202E, U+2066 to U+2069, U+061C',
      },
      other: {
        label: 'Other invisible characters',
        description: 'Soft hyphen (U+00AD), U+034F, U+2061 to U+2064',
      },
      tag: {
        label: 'Unicode tag characters',
        description:
          'U+E0000 to U+E007F. Can smuggle text invisibly (also used in some flag emoji)',
      },
    },
    summaryFound: 'Found {total} invisible characters ({removed} removed)',
    summaryNone: 'No invisible characters found',
    findingsLabel: 'Detected characters',
    colCode: 'Code point',
    colName: 'Name',
    colGroup: 'Type',
    colCount: 'Count',
    colStatus: 'Action',
    statusRemoved: 'Removed',
    statusKept: 'Kept',
    charNames: {
      'U+200B': 'Zero width space',
      'U+2060': 'Word joiner',
      'U+FEFF': 'BOM / zero width no-break space',
      'U+180E': 'Mongolian vowel separator',
      'U+200C': 'Zero width non-joiner',
      'U+200D': 'Zero width joiner',
      'U+200E': 'Left-to-right mark',
      'U+200F': 'Right-to-left mark',
      'U+061C': 'Arabic letter mark',
      'U+202A': 'Left-to-right embedding',
      'U+202B': 'Right-to-left embedding',
      'U+202C': 'Pop directional formatting',
      'U+202D': 'Left-to-right override',
      'U+202E': 'Right-to-left override',
      'U+2066': 'Left-to-right isolate',
      'U+2067': 'Right-to-left isolate',
      'U+2068': 'First strong isolate',
      'U+2069': 'Pop directional isolate',
      'U+00AD': 'Soft hyphen',
      'U+034F': 'Combining grapheme joiner',
      'U+2061': 'Function application',
      'U+2062': 'Invisible times',
      'U+2063': 'Invisible separator',
      'U+2064': 'Invisible plus',
    },
    tagCharName: 'Tag character',
    outputLabel: 'Cleaned text',
    visualizeLabel: 'Detected positions (shown as [U+XXXX])',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Zero-width joiners (U+200C, U+200D) are used to build compound emoji and in scripts such as Persian. They are not removed by default.',
      'Bidi control characters are needed to display right-to-left languages such as Arabic and Hebrew correctly. Do not remove them from such text.',
      'A BOM (U+FEFF) at the start of a file can be used to detect the encoding. It is safe to remove when you just copy and reuse the text.',
      'No-break spaces (U+00A0) and ideographic spaces are visible whitespace and are not treated as invisible characters.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Zero-width space (U+200B)',
        description:
          'A character with no width that cannot be seen on screen. It marks places where a line may break, but when it sneaks in through copy and paste it makes searches and string comparisons fail.',
      },
      {
        term: 'BOM (byte order mark)',
        description:
          'The character U+FEFF placed at the start of a file to indicate UTF-16 byte order or UTF-8. Inside text it acts as a zero width no-break space.',
      },
      {
        term: 'Unicode tag characters',
        description:
          'Non-displayed characters in U+E0000 to U+E007F. Originally meant for language tags, they are now used in flag emoji such as England. They can also hide text invisibly, which is sometimes abused.',
      },
    ],
  },
};
