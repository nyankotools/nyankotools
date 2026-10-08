import type { Locale } from '../../data/tools';

export interface TypingTestPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  mobileWarning: string;
  modeLabel: string;
  modeJa: string;
  modeEn: string;
  sizeLabel: string;
  /** {n} を置換 */
  sizeFormat: string;
  startLabel: string;
  retryLabel: string;
  areaLabel: string;
  statusIdle: string;
  statusReady: string;
  statusRunning: string;
  statusDone: string;
  imeWarning: string;
  /** {current} {total} を置換 */
  progressFormat: string;
  timeLabel: string;
  /** {s} を置換 */
  secondsFormat: string;
  resultHeading: string;
  wpmLabel: string;
  cpmLabel: string;
  accuracyLabel: string;
  missLabel: string;
  weakHeading: string;
  weakNone: string;
  /** {key} {n} を置換 */
  weakFormat: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** {mode} {wpm} {cpm} {accuracy} を置換 */
  shareText: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const typingTestContent: Record<Locale, TypingTestPageContent> = {
  ja: {
    title: 'タイピング速度テスト（WPM・CPM・正確性・苦手キー判定）',
    description:
      '日本語（ローマ字入力）と英語のタイピング速度を無料で測定。WPM・CPM・正確性と、ミスが多かった苦手キーを表示します。し=si/shi、ん=n/nn などの表記ゆれにも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'タイピング速度テスト（日本語ローマ字・英語）',
    introHtml:
      '短い文を打って、1分あたりの入力数（WPM・CPM）と正確性、ミスの多かった苦手キーを測ります。日本語はローマ字入力で、し=<code>si</code>/<code>shi</code>/<code>ci</code>、ん=<code>n</code>/<code>nn</code>、っ=子音の重ね打ち/<code>xtu</code> など、どの打ち方でも正解になります。キーが反応しているか確かめたいときは<a href="/tools/keyboard-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">キーボードテスト</a>もどうぞ。入力内容はブラウザの外には出ません。',
    mobileWarning:
      'このツールは物理キーボードでの入力を前提にしています。スマートフォンやタブレットの画面キーボードでは正しく測定できないことがあります。',
    modeLabel: '言語',
    modeJa: '日本語（ローマ字入力）',
    modeEn: '英語',
    sizeLabel: '出題数',
    sizeFormat: '{n}問',
    startLabel: 'スタート',
    retryLabel: 'もう一度',
    areaLabel: 'タイピングの入力領域。スタートを押してからキーを打ってください',
    statusIdle: '「スタート」を押してから、キーボードで打ち始めてください',
    statusReady: '最初のキーを打つと計測が始まります',
    statusRunning: '計測中：表示された文を打ってください',
    statusDone: '終了しました。結果を確認してください',
    imeWarning:
      '日本語入力（IME）がオンになっています。半角英数に切り替えてから打ってください。',
    progressFormat: '{current} / {total}問目',
    timeLabel: '経過時間',
    secondsFormat: '{s}秒',
    resultHeading: '結果',
    wpmLabel: 'WPM（1分あたりの単語数）',
    cpmLabel: 'CPM（1分あたりの打鍵数）',
    accuracyLabel: '正確性',
    missLabel: 'ミス打鍵数',
    weakHeading: '苦手キー（ミスが多かった順）',
    weakNone: 'ミスはありませんでした。',
    weakFormat: '{key}：{n}回',
    copy: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーできませんでした',
    shareText:
      'タイピング速度テスト（{mode}）：{wpm} WPM / {cpm} CPM / 正確性 {accuracy}%',
    howToHeading: '使い方',
    howToSteps: [
      '言語（日本語・英語）と出題数を選びます。',
      '「スタート」を押し、表示された文を、下に出るガイドを見ながらキーボードで打ちます。',
      '最初のキーを打った時点から計測され、全問打ち終えると結果が表示されます。',
      '「結果」で WPM・CPM・正確性と苦手キーを確認し、「もう一度」で再挑戦します。',
    ],
    notesHeading: '注意点',
    notes: [
      '物理キーボードでの入力を前提にしています。スマホやタブレットの画面キーボードでは、正しく判定できないことがあります。',
      '日本語は、日本語入力（IME）をオフにした半角英数の状態で、ローマ字を打ちます。打ち間違えたキーは入力されず、正しいキーを打つまで進みません（Backspaceは不要です）。',
      'ローマ字の表記ゆれに対応しています（し=si/shi/ci、ち=ti/chi、つ=tu/tsu、ふ=hu/fu、ん=n/nn/xn、っ=子音の重ね打ち/xtu/ltu、小さいゃゅょぁ=xya/lya など）。画面のガイドは標準的な打ち方を表示しますが、ほかの打ち方でも正解です。 んは、次が母音・な行・や行のときや文末ではnnが必要です。',
      '英語は大文字・小文字・記号を区別します。大文字はShiftを押しながら打ちます。',
      'WPMは正しく打ったキー数÷5を1分あたりに換算した値です。日本語でも打鍵数で計算するため、文字数ベースの速度（かな文字数）とは異なります。ミスをしてもやり直しの時間は計測に含まれます。',
      'お題は当サイトが用意した短文です。結果は保存されず、ページを閉じると消えます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'WPM（Words Per Minute）',
        description:
          '1分あたりに打てる単語数です。英語では5打鍵を1単語とみなして、正しく打ったキー数÷5を経過時間（分）で割って求めます。',
      },
      {
        term: 'CPM（Characters Per Minute）',
        description:
          '1分あたりに正しく打ったキーの数です。日本語のローマ字入力では、かな1文字に1〜3打鍵かかるため、打鍵数で数えます。',
      },
      {
        term: '正確性',
        description:
          '正しく打ったキー数 ÷（正しく打ったキー数＋ミスしたキー数）です。速くてもミスが多いと、結果的に遅くなります。',
      },
      {
        term: '表記ゆれ（ローマ字）',
        description:
          '同じかなに複数のローマ字の打ち方があることです。例えば「し」は si・shi・ci のどれでも入力できます。',
      },
    ],
  },
  en: {
    title: 'Typing Speed Test – WPM, CPM, Accuracy & Weak Keys',
    description:
      'Measure your typing speed in English or Japanese romaji. Get WPM, CPM, accuracy and the keys you miss most. Accepts alternate romaji spellings.',
    h1: 'Typing Speed Test (English & Japanese Romaji)',
    introHtml:
      'Type short sentences and see your words per minute (WPM), characters per minute (CPM), accuracy and the keys you miss most. In Japanese mode you type romaji, and every common spelling counts: <code>si</code>, <code>shi</code> or <code>ci</code> for し, <code>n</code> or <code>nn</code> for ん, a doubled consonant or <code>xtu</code> for っ. To check whether each key registers at all, try the <a href="/en/tools/keyboard-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Keyboard Tester</a>. Nothing you type leaves your browser.',
    mobileWarning:
      'This test assumes a physical keyboard. On-screen keyboards on phones and tablets may not be measured correctly.',
    modeLabel: 'Language',
    modeJa: 'Japanese (romaji)',
    modeEn: 'English',
    sizeLabel: 'Sentences',
    sizeFormat: '{n}',
    startLabel: 'Start',
    retryLabel: 'Try again',
    areaLabel: 'Typing area. Press Start, then type on your keyboard',
    statusIdle: 'Press Start, then begin typing on your keyboard',
    statusReady: 'The timer starts when you press the first key',
    statusRunning: 'Timing: type the sentence shown',
    statusDone: 'Finished. See your results below',
    imeWarning:
      'A Japanese input method (IME) is on. Switch to direct (half-width) input and try again.',
    progressFormat: 'Sentence {current} of {total}',
    timeLabel: 'Elapsed time',
    secondsFormat: '{s} s',
    resultHeading: 'Results',
    wpmLabel: 'WPM (words per minute)',
    cpmLabel: 'CPM (characters per minute)',
    accuracyLabel: 'Accuracy',
    missLabel: 'Mistyped keys',
    weakHeading: 'Weak keys (most missed first)',
    weakNone: 'No mistakes. Nice!',
    weakFormat: '{key}: {n}',
    copy: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Could not copy',
    shareText:
      'Typing speed test ({mode}): {wpm} WPM / {cpm} CPM / {accuracy}% accuracy',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose the language (Japanese or English) and the number of sentences.',
      'Press Start and type the sentence shown, following the guide underneath.',
      'The timer starts at your first key and stops when the last sentence is done.',
      'Check your WPM, CPM, accuracy and weak keys under Results, then press Try again.',
    ],
    notesHeading: 'Notes',
    notes: [
      'A physical keyboard is assumed. On-screen keyboards on phones and tablets may not be detected correctly.',
      'In Japanese mode, turn the IME off (direct input) and type romaji. A wrong key is not entered and you cannot move on until you press the right one, so Backspace is not needed.',
      'Alternate romaji spellings are accepted (し = si / shi / ci, ち = ti / chi, つ = tu / tsu, ふ = hu / fu, ん = n / nn / xn, っ = doubled consonant / xtu / ltu, small ゃ ゅ ょ ぁ = xya / lya and so on). The guide on screen shows the standard spelling, but any other valid one works. For ん, nn is required before a vowel, na-row or ya-row kana and at the end of a sentence.',
      'English mode is case- and punctuation-sensitive. Hold Shift for capital letters.',
      'WPM is the number of correctly typed keys divided by 5, converted to one minute. Japanese mode also counts keystrokes, so it differs from a kana-per-minute figure. Time spent on mistakes counts toward your total.',
      'The sentences are a short built-in list. Results are not saved and disappear when you close the page.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'WPM (words per minute)',
        description:
          'How many words you type in a minute. Five keystrokes count as one word, so WPM = correct keys ÷ 5 ÷ minutes elapsed.',
      },
      {
        term: 'CPM (characters per minute)',
        description:
          'The number of correct keystrokes per minute. In Japanese romaji, one kana takes one to three keystrokes, so keystrokes are what is counted.',
      },
      {
        term: 'Accuracy',
        description:
          'Correct keys ÷ (correct keys + mistyped keys). Fast typing with many mistakes ends up slower overall.',
      },
      {
        term: 'Romaji spelling variants',
        description:
          'Many kana can be typed in more than one way. For example, し can be entered as si, shi or ci.',
      },
    ],
  },
};
