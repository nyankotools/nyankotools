import type { Locale } from '../../data/tools';

export interface ReadabilityCheckerContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  sampleButton: string;
  maxLengthLabel: string;
  maxCommasLabel: string;
  scoreLabel: string;
  scoreEmpty: string;
  levelGood: string;
  levelFair: string;
  levelPoor: string;
  metricsHeading: string;
  statusOk: string;
  statusWarn: string;
  metricSentenceCount: string;
  metricAvgLength: string;
  metricLongSentences: string;
  metricKanjiRatio: string;
  metricEndingRepeat: string;
  metricConjunctionRun: string;
  metricCommaAvg: string;
  previewHeading: string;
  previewEmpty: string;
  issuesHeading: string;
  issuesNone: string;
  issueLong: string;
  issueCommaMany: string;
  issueCommaNone: string;
  issueEndingRepeat: string;
  issueConjunctionRun: string;
  notesHeading: string;
  notes: string[];
  relatedHeading: string;
  relatedLinks: { href: string; label: string; description: string }[];
}

export const readabilityCheckerContent: Record<
  Locale,
  ReadabilityCheckerContent
> = {
  ja: {
    title: '文章の読みやすさ診断｜文長・漢字率・文末の重複をチェック',
    description:
      '文章の読みやすさを無料で診断。1文の長さ、漢字率、同じ文末の連続、接続詞の連続、読点の多さを指標化し、問題のある文をハイライトします。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '文章の読みやすさ診断',
    introHtml:
      '文章を貼り付けると、1文の長さ・漢字とかなの比率・同じ文末の連続・接続詞の連続・読点の多寡を調べ、総合スコアと指標の一覧、問題のある文のハイライトを表示します。文字数や単語数などの量を知りたいときは<a href="/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字数カウント</a>、読み終えるまでの時間は<a href="/tools/reading-time-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">読了時間計算</a>、推敲前後の違いは<a href="/tools/text-diff/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">テキスト差分比較</a>をご利用ください。入力した文章はブラウザ内で処理され、サーバーに送信されることはありません。',
    inputLabel: '診断する文章',
    inputPlaceholder: 'ここに文章を貼り付けてください',
    sampleButton: 'サンプルを入れる',
    sampleText:
      '本日は晴天なり。しかし午後から雨が降る予報である。そして傘を持っていない。さらに会議の資料も作成できていないため、帰宅が遅くなる見込みだが、連絡はまだしていない。私は走る。彼は眠る。母は帰る。',
    maxLengthLabel: '1文の長さの上限（文字）',
    maxCommasLabel: '1文あたりの読点の上限',
    scoreLabel: '総合スコア',
    scoreEmpty: '文章を入力するとスコアが表示されます',
    levelGood: '読みやすい',
    levelFair: 'やや読みにくい',
    levelPoor: '読みにくい',
    metricsHeading: '指標一覧',
    statusOk: 'OK',
    statusWarn: '要確認',
    metricSentenceCount: '文の数',
    metricAvgLength: '平均文長（文字）',
    metricLongSentences: '長すぎる文の数',
    metricKanjiRatio: '漢字率（目安 15〜40%）',
    metricEndingRepeat: '同じ文末が続く文の数',
    metricConjunctionRun: '接続詞が続く文の数',
    metricCommaAvg: '1文あたりの平均読点数',
    previewHeading: 'ハイライト表示',
    previewEmpty: '文章を入力すると、ここに問題のある文が強調されます。',
    issuesHeading: '指摘された文',
    issuesNone: '指摘された文はありません。',
    issueLong: '文が長い',
    issueCommaMany: '読点が多い',
    issueCommaNone: '長いのに読点がない',
    issueEndingRepeat: '同じ文末が続く',
    issueConjunctionRun: '接続詞が続く',
    notesHeading: '注意事項',
    notes: [
      'この診断は文字種の判定と正規表現による簡易的なものです。形態素解析は行わないため、文末表現の判定や接続詞の検出には誤りが含まれる場合があります。',
      '文は句点（。）・感嘆符・疑問符・改行で区切ります。カギ括弧内の句点でも区切られるため、会話文が多い文章では文の数が実際より多くなることがあります。',
      '英文など日本語を含まない文は、語数の3倍を文字数相当として長さを判定します。',
      '漢字率は、漢字・ひらがな・カタカナの合計に占める漢字の割合です。日本語が30文字に満たない場合は評価しません。ジャンルによって適切な値は異なるため、あくまで目安としてください。',
      '総合スコアは、各指摘の割合から独自に算出した参考値であり、文章の良し悪しを断定するものではありません。',
    ],
    relatedHeading: '関連ツール',
    relatedLinks: [
      {
        href: '/tools/char-counter/',
        label: '文字数カウント',
        description: '文字数・単語数・行数を数える',
      },
      {
        href: '/tools/reading-time-calculator/',
        label: '読了時間計算',
        description: '文章の読了時間を見積もる',
      },
      {
        href: '/tools/text-diff/',
        label: 'テキスト差分比較',
        description: '推敲前後の違いを確認する',
      },
    ],
  },
  en: {
    title: 'Readability Checker: Sentence Length, Kanji Ratio & Style',
    description:
      'Check readability in your browser: sentence length, kanji ratio, repeated endings and conjunctions, comma use. Flags weak sentences. Nothing is uploaded.',
    h1: 'Readability Checker',
    introHtml:
      'Paste your writing to check sentence length, the kanji-to-kana ratio, repeated sentence endings, runs of conjunctions and comma use. You get an overall score, a metrics table and highlighted problem sentences. Tuned for Japanese, with basic support for English. To measure quantity rather than quality, use the <a href="/en/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Character Counter</a> or the <a href="/en/tools/reading-time-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Reading Time Calculator</a>; to compare drafts, try the <a href="/en/tools/text-diff/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Text Diff</a>. Your text is processed in the browser and never sent to a server.',
    inputLabel: 'Text to check',
    inputPlaceholder: 'Paste your text here',
    sampleButton: 'Insert sample',
    sampleText:
      '本日は晴天なり。しかし午後から雨が降る予報である。そして傘を持っていない。さらに会議の資料も作成できていないため、帰宅が遅くなる見込みだが、連絡はまだしていない。私は走る。彼は眠る。母は帰る。',
    maxLengthLabel: 'Max sentence length (characters)',
    maxCommasLabel: 'Max commas per sentence',
    scoreLabel: 'Overall score',
    scoreEmpty: 'Enter some text to see the score',
    levelGood: 'Easy to read',
    levelFair: 'Somewhat hard to read',
    levelPoor: 'Hard to read',
    metricsHeading: 'Metrics',
    statusOk: 'OK',
    statusWarn: 'Check',
    metricSentenceCount: 'Sentences',
    metricAvgLength: 'Average sentence length (characters)',
    metricLongSentences: 'Overlong sentences',
    metricKanjiRatio: 'Kanji ratio (guideline 15-40%)',
    metricEndingRepeat: 'Sentences with repeated endings',
    metricConjunctionRun: 'Sentences in conjunction runs',
    metricCommaAvg: 'Average commas per sentence',
    previewHeading: 'Highlighted text',
    previewEmpty: 'Problem sentences will be highlighted here.',
    issuesHeading: 'Flagged sentences',
    issuesNone: 'No sentences were flagged.',
    issueLong: 'Too long',
    issueCommaMany: 'Too many commas',
    issueCommaNone: 'Long with no commas',
    issueEndingRepeat: 'Repeated ending',
    issueConjunctionRun: 'Conjunction run',
    notesHeading: 'Notes',
    notes: [
      'This is a lightweight check based on character types and regular expressions. It does not use morphological analysis, so ending and conjunction detection can be wrong.',
      'Sentences are split at Japanese and Western sentence-end marks and at line breaks. Marks inside quotation brackets also split a sentence, so dialogue-heavy text may show more sentences than it really has.',
      'For sentences without Japanese characters, length is estimated as three times the word count, so English is judged against the same limit.',
      'The kanji ratio is kanji divided by kanji, hiragana and katakana combined. It is not evaluated when there are fewer than 30 Japanese characters. The right value depends on genre, so treat it as a guideline.',
      'The overall score is a rough figure derived from the share of flagged sentences. It is a reference, not a verdict on the quality of your writing.',
    ],
    relatedHeading: 'Related tools',
    relatedLinks: [
      {
        href: '/en/tools/char-counter/',
        label: 'Character Counter',
        description: 'count characters, words and lines',
      },
      {
        href: '/en/tools/reading-time-calculator/',
        label: 'Reading Time Calculator',
        description: 'estimate how long a text takes to read',
      },
      {
        href: '/en/tools/text-diff/',
        label: 'Text Diff',
        description: 'compare drafts before and after editing',
      },
    ],
  },
};
