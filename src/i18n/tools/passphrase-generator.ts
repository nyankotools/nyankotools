import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface PassphraseGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  wordCountLabel: string;
  countLabel: string;
  separatorLabel: string;
  generateButton: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  capitalizeLabel: string;
  appendNumberLabel: string;
  outputLabel: string;
  /** `{strength}` `{entropyBits}` を置換して使うテンプレート */
  strengthTemplate: string;
  strengthWeak: string;
  strengthFair: string;
  strengthStrong: string;
  strengthVeryStrong: string;
  loadError: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  attributionHtml: string;
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const passphraseGeneratorContent: Record<
  Locale,
  PassphraseGeneratorPageContent
> = {
  ja: {
    title: 'パスフレーズ生成（Diceware方式）',
    description:
      'EFF大型ワードリスト（7,776語）からDiceware方式で覚えやすく強いパスフレーズを生成します。語数・区切り文字・エントロピー表示に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'パスフレーズ生成（Diceware方式）',
    introHtml:
      'EFFの大型ワードリスト（7,776語）から単語をランダムに選び、覚えやすく推測されにくいパスフレーズを生成します。乱数はブラウザの暗号学的乱数生成機能（Web Crypto API）で、偏りが出ないよう棄却サンプリングで選んでおり、生成結果がサーバーに送信されることはありません。記号を含む文字列のパスワードが必要な場合は <a href="/tools/password-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">パスワード生成</a>、強度の確認は <a href="/tools/password-strength-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">パスワード強度チェッカー</a> をご利用ください。',
    wordCountLabel: '単語数（3〜12）',
    countLabel: '生成する個数（1〜50）',
    separatorLabel: '区切り文字（5文字まで）',
    generateButton: '生成する',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    capitalizeLabel: '各単語の先頭を大文字にする',
    appendNumberLabel: 'ランダムな1語の末尾に数字を付ける',
    outputLabel: '結果',
    strengthTemplate:
      '強度: {strength}（理論上のエントロピー: 約{entropyBits}ビット）',
    strengthWeak: '弱い',
    strengthFair: '普通',
    strengthStrong: '強い',
    strengthVeryStrong: '非常に強い',
    loadError: '単語リストの読み込みに失敗しました。再読み込みしてください。',
    howToHeading: '使い方',
    howToSteps: [
      '「単語数」と「区切り文字」を決める（6語以上がおすすめ）',
      '必要なら「各単語の先頭を大文字にする」「ランダムな1語の末尾に数字を付ける」を選ぶ',
      '「生成する」を押すと、結果とエントロピーが表示される',
      '「コピー」で取り出し、パスワードマネージャーなどに保管する',
    ],
    notesHeading: '注意事項',
    notes: [
      'パスフレーズはブラウザの暗号学的乱数生成機能（Web Crypto API）で生成され、サーバーには送信されません。画面を閉じると再現できないため、必要なものはパスワードマネージャーに保管してください。',
      'エントロピーは単語数 × log2(7,776) ≒ 12.9ビットで計算した理論値です。攻撃者が単語リストと方式を知っている前提の数字で、大文字化や区切り文字は固定の規則なので加算していません。',
      '数字を付ける場合は、付ける単語（単語数通り）と数字（10通り）の分だけエントロピーを加算しています。',
      '単語リストにはdrop-down や t-shirt のようにハイフンを含む語が4つあります。',
      '初回の生成時に約60KBの単語リストを読み込みます。',
    ],
    attributionHtml:
      '単語リスト: <a href="https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases" class="text-blue-700 underline hover:no-underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">EFF Large Wordlist for Passphrases</a>（© Electronic Frontier Foundation、<a href="https://creativecommons.org/licenses/by/3.0/us/" class="text-blue-700 underline hover:no-underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">CC BY 3.0 US</a>）。',
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Diceware',
        description:
          'サイコロを振って単語リストから単語を選び、パスフレーズを作る方式です。このツールはサイコロの代わりに暗号学的乱数で、7,776語（サイコロ5個分の目の数）から選びます。',
      },
      {
        term: 'エントロピー',
        description:
          'パスフレーズの推測されにくさを表すビット数です。1語あたり約12.9ビットで、6語なら約77ビットになります。',
      },
      {
        term: '棄却サンプリング',
        description:
          '乱数を範囲に割り当てるとき、割り切れない余りの部分に当たった値を捨てて引き直す方法です。剰余だけで選ぶと一部の単語が出やすくなる偏りが生じるため、それを防ぎます。',
      },
    ],
  },
  en: {
    title: 'Passphrase Generator (Diceware)',
    description:
      'Generate memorable, strong passphrases with the Diceware method from the EFF large wordlist (7,776 words). Shows entropy. Runs in your browser; nothing is sent.',
    h1: 'Passphrase Generator (Diceware)',
    introHtml:
      'Pick random words from the EFF large wordlist (7,776 words) to build a passphrase that is easy to remember but hard to guess. Words are drawn with your browser\'s cryptographically secure random number generator (Web Crypto API) using rejection sampling to avoid bias, and nothing you generate is sent to a server. Need a random string with symbols instead? Try the <a href="/en/tools/password-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Password Generator</a>, and check a result with the <a href="/en/tools/password-strength-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Password Strength Checker</a>.',
    wordCountLabel: 'Number of words (3-12)',
    countLabel: 'Number to generate (1-50)',
    separatorLabel: 'Separator (up to 5 characters)',
    generateButton: 'Generate',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    capitalizeLabel: 'Capitalize each word',
    appendNumberLabel: 'Add a digit to the end of one random word',
    outputLabel: 'Result',
    strengthTemplate:
      'Strength: {strength} (theoretical entropy: ~{entropyBits} bits)',
    strengthWeak: 'Weak',
    strengthFair: 'Fair',
    strengthStrong: 'Strong',
    strengthVeryStrong: 'Very strong',
    loadError: 'Failed to load the word list. Please reload the page.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose the "Number of words" and the "Separator" (6 or more words is recommended)',
      'Optionally turn on "Capitalize each word" or "Add a digit to the end of one random word"',
      'Click "Generate" to see the result and its entropy',
      'Click "Copy" and store it in a password manager',
    ],
    notesHeading: 'Notes',
    notes: [
      'Passphrases are generated in your browser with the Web Crypto API and are never sent to a server. They cannot be reproduced after you leave the page, so save what you need in a password manager.',
      'Entropy is the theoretical value: number of words x log2(7,776), about 12.9 bits per word. It assumes the attacker knows the wordlist and the method. Capitalization and separators follow fixed rules, so they add nothing.',
      'When a digit is added, entropy increases for which word gets it (one of the words) and for the digit itself (10 options).',
      'Four words in the list contain a hyphen, such as drop-down and t-shirt.',
      'The word list (about 60 KB) is loaded the first time you generate.',
    ],
    attributionHtml:
      'Word list: <a href="https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases" class="text-blue-700 underline hover:no-underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">EFF Large Wordlist for Passphrases</a> (&copy; Electronic Frontier Foundation, licensed under <a href="https://creativecommons.org/licenses/by/3.0/us/" class="text-blue-700 underline hover:no-underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">CC BY 3.0 US</a>).',
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Diceware',
        description:
          'A method of building a passphrase by rolling dice to pick words from a list. This tool uses secure random numbers instead of dice to choose from 7,776 words, the number of outcomes of five dice.',
      },
      {
        term: 'Entropy',
        description:
          'A measure, in bits, of how hard a passphrase is to guess. Each word adds about 12.9 bits, so six words give about 77 bits.',
      },
      {
        term: 'Rejection sampling',
        description:
          'A way to map random numbers onto a range without bias: values that fall into the uneven remainder are discarded and redrawn. Using only a modulo would make some words slightly more likely.',
      },
    ],
  },
};
