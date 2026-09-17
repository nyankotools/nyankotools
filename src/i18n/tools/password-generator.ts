import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface PasswordGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  lengthLabel: string;
  countLabel: string;
  generateButton: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  lowercaseLabel: string;
  uppercaseLabel: string;
  numbersLabel: string;
  symbolsLabel: string;
  excludeSimilarLabel: string;
  outputLabel: string;
  /** `{strength}` `{entropyBits}` を置換して使うテンプレート */
  strengthTemplate: string;
  strengthWeak: string;
  strengthFair: string;
  strengthStrong: string;
  strengthVeryStrong: string;
  errorMissingCharType: string;
  tipsHeading: string;
  tips: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const passwordGeneratorContent: Record<
  Locale,
  PasswordGeneratorPageContent
> = {
  ja: {
    title: 'パスワード生成',
    description:
      '文字種（大文字・小文字・数字・記号）と桁数を指定して、安全なランダムパスワードを無料で生成できるツールです。強度の目安も表示。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'パスワード生成',
    introHtml:
      '文字種と桁数を指定して、推測されにくいランダムなパスワードを生成します。ブラウザの暗号学的乱数生成機能（Web Crypto API）を使っており、生成したパスワードがサーバーに送信されることはありません。生成したIDと組み合わせて使いたい場合は <a href="/tools/uuid-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">UUID生成</a> もあわせてご利用ください。',
    lengthLabel: '桁数（4〜128）',
    countLabel: '生成する個数（1〜100）',
    generateButton: '生成する',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    lowercaseLabel: '小文字（a-z）',
    uppercaseLabel: '大文字（A-Z）',
    numbersLabel: '数字（0-9）',
    symbolsLabel: '記号（!@#$%など）',
    excludeSimilarLabel: '紛らわしい文字を除外（l, 1, I, O, 0 など）',
    outputLabel: '結果',
    strengthTemplate:
      '強度: {strength}（推定エントロピー: 約{entropyBits}ビット）',
    strengthWeak: '弱い',
    strengthFair: '普通',
    strengthStrong: '強い',
    strengthVeryStrong: '非常に強い',
    errorMissingCharType: '少なくとも1つの文字種を選択してください',
    tipsHeading: '安全なパスワードのポイント',
    tips: [
      '桁数はできるだけ長く（12桁以上推奨）し、複数の文字種を組み合わせる',
      '他のサービスで使い回さず、サービスごとに異なるパスワードを設定する',
      '生成したパスワードはパスワードマネージャーなどで安全に保管する',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'エントロピー',
        description:
          'パスワードの推測されにくさ（ランダム性の強さ）を表す指標で、ビット数で表されます。数値が大きいほど、総当たり攻撃で破られるまでにかかる時間が長くなります。',
      },
      {
        term: 'Web Crypto API',
        description:
          'ブラウザに標準搭載されている暗号関連の機能群です。このツールはこのAPIの乱数生成機能を使っており、予測されにくい安全な乱数からパスワードを生成しています。',
      },
    ],
  },
  en: {
    title: 'Password Generator',
    description:
      'A free tool to generate strong, random passwords by choosing character types (uppercase, lowercase, numbers, symbols) and length, with a strength estimate. Your data is processed in the browser and never sent to a server.',
    h1: 'Password Generator',
    introHtml:
      'Generate hard-to-guess random passwords by choosing character types and length. It uses your browser\'s cryptographically secure random number generator (Web Crypto API), so generated passwords are never sent to a server. Need a random ID to go with it? Try the <a href="/en/tools/uuid-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">UUID Generator</a> as well.',
    lengthLabel: 'Length (4-128)',
    countLabel: 'Number to generate (1-100)',
    generateButton: 'Generate',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    lowercaseLabel: 'Lowercase (a-z)',
    uppercaseLabel: 'Uppercase (A-Z)',
    numbersLabel: 'Numbers (0-9)',
    symbolsLabel: 'Symbols (!@#$%, etc.)',
    excludeSimilarLabel: 'Exclude similar characters (l, 1, I, O, 0, etc.)',
    outputLabel: 'Result',
    strengthTemplate:
      'Strength: {strength} (estimated entropy: ~{entropyBits} bits)',
    strengthWeak: 'Weak',
    strengthFair: 'Fair',
    strengthStrong: 'Strong',
    strengthVeryStrong: 'Very strong',
    errorMissingCharType: 'Please select at least one character type.',
    tipsHeading: 'Tips for a strong password',
    tips: [
      'Use as many characters as practical (12+ recommended) and combine multiple character types',
      'Avoid reusing the same password across different services',
      'Store generated passwords safely, such as in a password manager',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Entropy',
        description:
          'A measure of how hard a password is to guess (its randomness), expressed in bits. The higher the number, the longer a brute-force attack would take to crack it.',
      },
      {
        term: 'Web Crypto API',
        description:
          'A cryptography toolkit built into web browsers. This tool uses its random number generator, so passwords are built from unpredictable, secure randomness.',
      },
    ],
  },
};
