import type { Locale } from '../../data/tools';
import type { NotationKind } from '../../lib/tools/notation-variants-checker';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface NotationVariantsCheckerContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleButton: string;
  sampleText: string;
  optionsLegend: string;
  /** 種別ごとの表示名（チェックボックス・結果表で共用） */
  kindLabels: Record<NotationKind, string>;
  /** 種別ごとの補足（チェックボックスの下に表示） */
  kindHints: Record<Exclude<NotationKind, 'custom'>, string>;
  customLabel: string;
  customHint: string;
  customPlaceholder: string;
  highlightLabel: string;
  highlightEmpty: string;
  /** {count} を置換して使う */
  statusTemplate: string;
  statusNone: string;
  statusEmpty: string;
  tableFound: string;
  tableSuggestion: string;
  tableKind: string;
  tableMixed: string;
  mixedYes: string;
  mixedNo: string;
  applyButton: string;
  copiedMessage: string;
  copyFailedMessage: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const SAMPLE_JA =
  '資料の取扱いには御注意下さい。出来るだけ早く御連絡頂ければ幸いです。\nソフトウエアのシュミレーションを行ないます。\nサーバとユーザーの設定を確認（必須）してください(再起動も)。\n費用は１２００円、期間は3ヶ月です。ﾃｽﾄ環境で試します。';

export const notationVariantsCheckerContent: Record<
  Locale,
  NotationVariantsCheckerContent
> = {
  ja: {
    title: '文章校正ツール｜表記ゆれ・用字用語・送り仮名チェック',
    description:
      '日本語の文章から表記ゆれ（送り仮名・漢字とかなの使い分け・カタカナ表記・全角半角の混在）を辞書で検出し、推奨表記をハイライトで提案する無料ツール。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '文章校正（表記ゆれ・用字用語チェック）',
    introHtml:
      '貼り付けた日本語の文章を、数百語の辞書と全角・半角のルールでチェックし、表記ゆれの疑いがある箇所をハイライトして推奨表記を提案します。形態素解析は使わない軽量版です。文字数の確認は <a href="/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字数カウント</a>、全角・半角の一括変換は <a href="/tools/zenkaku-hankaku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">全角/半角変換</a> もご利用ください。',
    inputLabel: 'チェックしたい文章',
    inputPlaceholder: 'ここに日本語の文章を貼り付け',
    sampleButton: 'サンプルを入力',
    sampleText: SAMPLE_JA,
    optionsLegend: 'チェックする項目',
    kindLabels: {
      okurigana: '送り仮名',
      kanjiKana: '用字（漢字・かな）',
      katakana: 'カタカナ表記',
      longVowel: '長音（ー）の有無',
      term: '用語・単位',
      width: '全角・半角',
      custom: '独自ルール',
    },
    kindHints: {
      okurigana: '行なう→行う、取扱い→取り扱い など',
      kanjiKana: '出来る→できる、下さい→ください、御連絡→ご連絡 など',
      katakana: 'ソフトウエア→ソフトウェア など',
      longVowel: 'サーバ→サーバー など（文書の流儀で分かれるため初期はオフ）',
      term: '3ヶ月→3か月、個所→箇所 など',
      width: '半角カナ、全角と半角の英数字・括弧・句読点の混在',
    },
    customLabel: '独自ルール（任意）',
    customHint:
      '「変更前>推奨表記」を1行ずつ書くと、辞書と同じように検出します。',
    customPlaceholder: 'お客さま>お客様\nログオン>ログイン',
    highlightLabel: 'チェック結果（該当箇所をハイライト）',
    highlightEmpty: '文章を入力すると、ここに結果が表示されます。',
    statusTemplate: '{count}件の表記ゆれ候補が見つかりました',
    statusNone: '表記ゆれの候補は見つかりませんでした',
    statusEmpty: '文章を入力してください',
    tableFound: '該当箇所',
    tableSuggestion: '推奨表記',
    tableKind: '種別',
    tableMixed: '推奨表記も使用',
    mixedYes: 'あり（混在）',
    mixedNo: 'なし',
    applyButton: 'すべて推奨表記に置き換えてコピー',
    copiedMessage: '置き換えた文章をコピーしました',
    copyFailedMessage: 'コピーに失敗しました',
    notesHeading: '注意点',
    notes: [
      '辞書と記号ルールによる機械的な検出です。固有名詞・引用・専門用語・社内表記ルールでは、指摘どおりに直すと不適切な場合があります。最終判断は人が行ってください。',
      '形態素解析は使っていないため、文脈による判定（例: 「出来る」を名詞として使う場合）や、辞書にない表記ゆれは検出できません。',
      '推奨表記は公用文の表記の考え方や一般的な表記を参考にした一例です。媒体や組織の用字用語集がある場合は、独自ルールで補ってください。',
      '全角・半角の判定は、同じ文章内で混在している場合に少数派を指摘します。英文中の括弧やURLの記号は対象外です。',
      '入力した文章はブラウザ内だけで処理され、サーバーには送信されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '表記ゆれ',
        description:
          '同じ意味の語が、送り仮名・漢字とかな・カタカナの綴り・全角半角などの違いで複数の書き方をされている状態です。文書の統一感や検索性を下げる原因になります。',
      },
      {
        term: '送り仮名',
        description:
          '漢字の後ろに付けるかなです。「行う」と「行なう」のように、書き方が複数ある語は表記ゆれになりやすく、公用文では本則に沿った書き方が示されています。',
      },
      {
        term: '用字用語',
        description:
          '文書で使う漢字・かな・語句の取り決めです。新聞社や企業ごとに用字用語集があり、「できる」「出来る」のどちらを使うかなどを定めています。',
      },
    ],
  },
  en: {
    title: 'Japanese Notation Variants Checker',
    description:
      'Find inconsistent spellings in Japanese text: okurigana, kanji vs kana, katakana variants, and full/half-width mixing. Runs in your browser, no upload.',
    h1: 'Japanese Notation Variants Checker (Proofreading)',
    introHtml:
      'Paste Japanese text to flag likely spelling inconsistencies with a dictionary of a few hundred entries plus full-width/half-width rules, and get a recommended form for each. It is a lightweight checker without morphological analysis. To count characters, use the <a href="/en/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Character Counter</a>; to convert widths in bulk, try the <a href="/en/tools/zenkaku-hankaku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Full-width / Half-width Converter</a>.',
    inputLabel: 'Japanese text to check',
    inputPlaceholder: 'Paste Japanese text here',
    sampleButton: 'Insert sample',
    sampleText: SAMPLE_JA,
    optionsLegend: 'Checks to run',
    kindLabels: {
      okurigana: 'Okurigana',
      kanjiKana: 'Kanji vs kana',
      katakana: 'Katakana spelling',
      longVowel: 'Long vowel mark (ー)',
      term: 'Terms and units',
      width: 'Full/half-width',
      custom: 'Custom rules',
    },
    kindHints: {
      okurigana: 'e.g. 行なう → 行う, 取扱い → 取り扱い',
      kanjiKana: 'e.g. 出来る → できる, 下さい → ください',
      katakana: 'e.g. ソフトウエア → ソフトウェア',
      longVowel: 'e.g. サーバ → サーバー (style varies, so off by default)',
      term: 'e.g. 3ヶ月 → 3か月, 個所 → 箇所',
      width:
        'Half-width kana and mixed full/half-width digits, letters, brackets and punctuation',
    },
    customLabel: 'Custom rules (optional)',
    customHint:
      'Write one "before>recommended" pair per line to detect it like a dictionary entry.',
    customPlaceholder: 'お客さま>お客様\nログオン>ログイン',
    highlightLabel: 'Result (matches highlighted)',
    highlightEmpty: 'Enter some text and the result appears here.',
    statusTemplate: 'Possible inconsistencies found: {count}',
    statusNone: 'No inconsistencies found',
    statusEmpty: 'Enter some text',
    tableFound: 'Found',
    tableSuggestion: 'Recommended',
    tableKind: 'Type',
    tableMixed: 'Recommended form also used',
    mixedYes: 'Yes (mixed)',
    mixedNo: 'No',
    applyButton: 'Replace all with recommended and copy',
    copiedMessage: 'Copied the corrected text',
    copyFailedMessage: 'Failed to copy',
    notesHeading: 'Notes',
    notes: [
      'Detection is mechanical, based on a dictionary and symbol rules. Proper nouns, quotations, technical terms and house styles may be correct as written, so a person should make the final call.',
      'There is no morphological analysis, so context-dependent cases (such as 出来る used as a noun) and variants missing from the dictionary are not detected.',
      'Recommended forms are examples based on general usage and official-document conventions. If your publication has its own style guide, add its rules under custom rules.',
      'For full/half-width checks, the minority form is flagged when both appear in the same text. Brackets inside English text and symbols in URLs are ignored.',
      'Your text is processed only in your browser and is never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Notation variants (表記ゆれ)',
        description:
          'The same word written in several ways, such as different okurigana, kanji versus kana, katakana spellings, or full-width versus half-width characters. It makes a document feel inconsistent and harder to search.',
      },
      {
        term: 'Okurigana (送り仮名)',
        description:
          'Kana written after a kanji to show its ending, such as 行う versus 行なう. Words with more than one accepted spelling are a common source of inconsistency.',
      },
      {
        term: 'Style guide (用字用語集)',
        description:
          'A publication or company rule set that fixes which kanji, kana and words to use, for example whether to write できる or 出来る.',
      },
    ],
  },
};
