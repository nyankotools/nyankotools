import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface RubyTagGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  insertLegend: string;
  insertRuby: string;
  insertRubyBar: string;
  insertHint: string;
  optionsLegend: string;
  optRp: string;
  optBr: string;
  htmlLabel: string;
  previewLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  countTemplate: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const rubyTagGeneratorContent: Record<
  Locale,
  RubyTagGeneratorPageContent
> = {
  ja: {
    title: 'ルビ（ふりがな）HTMLタグ生成｜rubyタグ作成ツール',
    description:
      '「漢字《かんじ》」「｜親文字《ルビ》」の記法から、ふりがな用の<ruby>タグを生成する無料ツールです。<rp>括弧の有無を選べ、プレビュー付き。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ルビ（ふりがな）HTMLタグ生成',
    introHtml:
      '漢字の直後に《よみ》を添える記法（青空文庫風）で書いたテキストから、HTMLの &lt;ruby&gt; タグを生成します。漢字以外を親文字にしたいときは先頭に ｜ を付けてください。読みの自動付与は行わず、入力した読みをそのままタグにします。ひらがな・カタカナの相互変換は <a href="/tools/kana-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ひらがな・カタカナ変換</a> もご利用ください。',
    inputLabel: '入力（漢字《かんじ》 / ｜親文字《ルビ》）',
    inputPlaceholder: '例: 吾輩《わがはい》は猫である。',
    sampleText:
      '魔王《サタン》は｜神殺しの英雄《ゴッドスレイヤー》に告げた。\n｜終わりなき螺旋の迷宮《エンドレス・ラビリンス》で、運命《さだめ》は動き出す。\n宿敵《ライバル》であり親友《ダチ》でもある彼は、本気《マジ》だった。by Claude\n\n｜深淵の執行者《アビス・エグゼキューター》は｜絶望の黒剣《グラディウス》を抜き放ち、｜絶対神《オディン》に宣告《つ》げた。\n｜虚無の境界《アブソリュート・ゼロ》を越えた先、｜約束の地《アルカディア》で｜世界終焉の禁忌《ラグナロク》が幕を開ける。\n｜最強の宿敵《ライバル》であり｜唯一の理解者《ダチ》でもある｜狂王《アイツ》の瞳は、｜本気《マジ》で｜殺意《あい》に満ちていた。by Gemini\n\n｜世界の理《ルール》を破壊する少年は、｜神々の黄昏《ラグナロク》に立ち向かった。\n「運命《さだめ》だと？ そんなもの、俺が殺してやる」\n｜右手に宿る禁忌の力《オーバー・リミット》。その一撃は、創世神《デウス》すら滅ぼす。\n宿敵《ライバル》にして戦友《ソウルメイト》。そして、前世《むかし》に愛した少女《おまえ》。\n「今度こそ、絶対《ぜってぇ》に救ってみせる――！」by ChatGPT',
    insertLegend: '記号の挿入',
    insertRuby: '《》を挿入',
    insertRubyBar: '｜《》を挿入',
    insertHint:
      '文字を選択してから押すと、選択部分の後ろに《》を付け、カーソルを《》の中に置きます。｜《》は選択部分の前に｜も付けます。',
    optionsLegend: '出力オプション',
    optRp: '<rp>括弧を付ける',
    optBr: '改行を<br>に変換する',
    htmlLabel: '生成されたHTML',
    previewLabel: 'プレビュー',
    copy: 'HTMLをコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    countTemplate: '{n} 件のルビを変換',
    notesHeading: '注意事項',
    notes: [
      '漢字《よみ》は、《の直前にある漢字（々・〆・ヶを含む）の連続を親文字とします。ひらがなやカタカナ、英数字に付けたいときは ｜（または半角の |）で親文字の先頭を指定してください。',
      '《》が閉じていない場合、読みが空の場合、改行をまたぐ場合は変換せず、そのまま出力します。',
      '<rp> はルビ非対応の環境で読みを括弧付きで表示するための要素です。最近のブラウザでは通常不要ですが、付けても表示は変わりません。',
      '入力中の &, <, > などの記号は自動でエスケープされ、プレビューも安全なルビ要素だけで組み立てています。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ルビ（ふりがな）',
        description:
          '漢字などの上や横に付ける読み仮名のことです。HTMLでは <ruby>（親文字）と <rt>（ルビ）、必要に応じて <rp>（非対応環境用の括弧）を組み合わせて表現します。',
      },
      {
        term: '青空文庫のルビ記法',
        description:
          '青空文庫で使われる「漢字《かんじ》」「｜親文字《ルビ》」という書き方です。このツールはその記法を HTML に変換します。',
      },
    ],
  },
  en: {
    title: 'Ruby Tag Generator - Furigana HTML Maker',
    description:
      'Generate HTML <ruby> tags for furigana from a simple bracket notation. Optional <rp> parentheses and live preview. Runs in your browser.',
    h1: 'Ruby (Furigana) HTML Tag Generator',
    introHtml:
      'Write readings in Aozora Bunko style, such as 漢字《かんじ》, and get HTML &lt;ruby&gt; tags. To annotate something other than kanji, start the base text with ｜. Readings are not added automatically; your own text is used as-is. For converting between hiragana and katakana, see the <a href="/en/tools/kana-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Kana Converter</a>.',
    inputLabel: 'Input (漢字《かんじ》 / ｜base《ruby》)',
    inputPlaceholder: 'e.g. 吾輩《わがはい》は猫である。',
    sampleText:
      '魔王《サタン》は｜神殺しの英雄《ゴッドスレイヤー》に告げた。\n｜終わりなき螺旋の迷宮《エンドレス・ラビリンス》で、運命《さだめ》は動き出す。\n宿敵《ライバル》であり親友《ダチ》でもある彼は、本気《マジ》だった。by Claude\n\n｜深淵の執行者《アビス・エグゼキューター》は｜絶望の黒剣《グラディウス》を抜き放ち、｜絶対神《オディン》に宣告《つ》げた。\n｜虚無の境界《アブソリュート・ゼロ》を越えた先、｜約束の地《アルカディア》で｜世界終焉の禁忌《ラグナロク》が幕を開ける。\n｜最強の宿敵《ライバル》であり｜唯一の理解者《ダチ》でもある｜狂王《アイツ》の瞳は、｜本気《マジ》で｜殺意《あい》に満ちていた。by Gemini\n\n｜世界の理《ルール》を破壊する少年は、｜神々の黄昏《ラグナロク》に立ち向かった。\n「運命《さだめ》だと？ そんなもの、俺が殺してやる」\n｜右手に宿る禁忌の力《オーバー・リミット》。その一撃は、創世神《デウス》すら滅ぼす。\n宿敵《ライバル》にして戦友《ソウルメイト》。そして、前世《むかし》に愛した少女《おまえ》。\n「今度こそ、絶対《ぜってぇ》に救ってみせる――！」by ChatGPT',
    insertLegend: 'Insert symbols',
    insertRuby: 'Insert 《》',
    insertRubyBar: 'Insert ｜《》',
    insertHint:
      'Select some text first: 《》 is added after it and the cursor is placed inside. ｜《》 also adds ｜ before the selection.',
    optionsLegend: 'Output options',
    optRp: 'Add <rp> parentheses',
    optBr: 'Convert line breaks to <br>',
    htmlLabel: 'Generated HTML',
    previewLabel: 'Preview',
    copy: 'Copy HTML',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    countTemplate: '{n} ruby annotation(s) converted',
    notesHeading: 'Notes',
    notes: [
      'For 漢字《reading》, the run of kanji (including 々, 〆 and ヶ) right before 《 is the base text. To annotate kana or letters, mark the start of the base text with ｜ (or a half-width |).',
      'Unclosed 《》, empty readings, and readings that span a line break are left unchanged in the output.',
      '<rp> shows the reading in parentheses in environments that do not support ruby. Modern browsers rarely need it, and adding it does not change how ruby displays there.',
      'Characters such as &, < and > in your input are escaped automatically, and the preview is built only from safe ruby elements.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Ruby (furigana)',
        description:
          'Small reading annotations placed above or beside characters such as kanji. In HTML they are written with <ruby> (base text), <rt> (the annotation) and optionally <rp> (parentheses for unsupported environments).',
      },
      {
        term: 'Aozora Bunko ruby notation',
        description:
          'The 漢字《かんじ》 and ｜base《ruby》 style used by the Aozora Bunko digital library. This tool converts that notation to HTML.',
      },
    ],
  },
};
