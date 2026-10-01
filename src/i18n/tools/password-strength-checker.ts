import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface PasswordStrengthCheckerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  showLabel: string;
  levelLabel: string;
  emptyLevel: string;
  /** スコア0〜4の順 */
  levels: [string, string, string, string, string];
  /** {bits}, {length} を置換する */
  summaryTemplate: string;
  crackHeading: string;
  onlineLabel: string;
  offlineLabel: string;
  /** {n} を置換する（instant / millionYears は数値を使わない） */
  units: {
    instant: string;
    seconds: string;
    minutes: string;
    hours: string;
    days: string;
    years: string;
    millionYears: string;
  };
  checklistHeading: string;
  checkLength: string;
  checkLowercase: string;
  checkUppercase: string;
  checkNumber: string;
  checkSymbol: string;
  issuesHeading: string;
  noIssues: string;
  issues: {
    'too-short': string;
    common: string;
    'common-base': string;
    'only-digits': string;
    'only-letters': string;
    repeated: string;
    sequence: string;
    keyboard: string;
  };
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const passwordStrengthCheckerContent: Record<
  Locale,
  PasswordStrengthCheckerPageContent
> = {
  ja: {
    title: 'パスワード強度チェッカー',
    description:
      'パスワードの強さを無料でチェックできるツールです。文字種・長さ・よくあるパスワード・連番やキーボード配列を判定し、解読にかかる目安時間を表示します。入力はブラウザ内で処理され、サーバーには送信されません。',
    h1: 'パスワード強度チェッカー',
    introHtml:
      '入力したパスワードの強さを、文字種・長さ・推測されやすいパターンから判定します。入力した内容はブラウザの外には送られず、保存もされません。強いパスワードが必要なときは <a href="/tools/password-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">パスワード生成</a> もご利用ください。',
    inputLabel: 'チェックするパスワード',
    inputPlaceholder: 'パスワードを入力',
    showLabel: 'パスワードを表示する',
    levelLabel: '強度',
    emptyLevel: '未入力',
    levels: ['非常に弱い', '弱い', '普通', '強い', '非常に強い'],
    summaryTemplate: '{length}文字 ／ 推定エントロピー 約{bits}ビット',
    crackHeading: '解読にかかる目安時間（総当たりの平均）',
    onlineLabel: 'オンライン攻撃（回数制限あり・毎秒100回）',
    offlineLabel: 'オフライン攻撃（高速ハッシュ・毎秒100億回）',
    units: {
      instant: '一瞬（1秒未満）',
      seconds: '約{n}秒',
      minutes: '約{n}分',
      hours: '約{n}時間',
      days: '約{n}日',
      years: '約{n}年',
      millionYears: '100万年以上',
    },
    checklistHeading: 'チェック項目',
    checkLength: '8文字以上',
    checkLowercase: '英小文字を含む',
    checkUppercase: '英大文字を含む',
    checkNumber: '数字を含む',
    checkSymbol: '記号を含む',
    issuesHeading: '改善ポイント',
    noIssues: '目立った弱点は見つかりませんでした。',
    issues: {
      'too-short': '短すぎます。12文字以上を目安にしてください。',
      common:
        'よく使われるパスワードです。記号や数字の置き換えをしても、すぐに推測されます。',
      'common-base':
        'よく使われる単語に数字や記号を足しただけの形です。推測されやすいパターンです。',
      'only-digits': '数字だけで構成されています。',
      'only-letters': '英字だけで構成されています。',
      repeated: '同じ文字の繰り返しがあります（例: aaa）。',
      sequence: '連続した文字や数字があります（例: abc、123）。',
      keyboard: 'キーボード上で隣り合う文字が並んでいます（例: qwerty）。',
    },
    notesHeading: '注意事項',
    notes: [
      '判定は文字種と長さによる目安です。実際の安全性は、使い回していないか、漏えい済みのパスワードでないかにも左右されます。',
      '解読時間は、探索空間の半分を総当たりで試す場合の理論値です。辞書攻撃や、過去に流出したパスワードの一覧を使った攻撃では、この時間より早く破られることがあります。',
      'よくあるパスワードの判定は、ブラウザに内蔵した小さな一覧との照合です。一覧にないだけで安全という意味ではありません。',
      '実際に使っているパスワードを入力するのはお控えください。このツールは入力を送信しませんが、画面の共有や録画に映る可能性があります。',
      '複数のサービスで同じパスワードを使い回さないことが最も効果的な対策です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'エントロピー（ビット）',
        description:
          'パスワードの推測されにくさを表す数値です。1ビット増えるごとに、総当たりに必要な試行回数が2倍になります。',
      },
      {
        term: '総当たり攻撃（ブルートフォース）',
        description:
          'あり得る文字の組み合わせを片端から試して、パスワードを見つける攻撃です。',
      },
      {
        term: '辞書攻撃',
        description:
          'よく使われる単語やパスワードの一覧を順に試す攻撃です。単語に数字を足しただけのパスワードは、総当たりよりはるかに早く破られます。',
      },
      {
        term: 'オフライン攻撃',
        description:
          '流出したハッシュ値を手元に持ち、回数制限なしに高速で試す攻撃です。ログイン画面を相手にするオンライン攻撃より、桁違いに速く試行できます。',
      },
    ],
  },
  en: {
    title: 'Free Password Strength Checker',
    description:
      'Check password strength: flags common passwords, sequences, and keyboard runs, and estimates crack time. Runs in your browser; nothing is uploaded.',
    h1: 'Password Strength Checker',
    introHtml:
      'Rates a password by its length, character types, and easily guessed patterns. What you type never leaves your browser and is not stored. If you need a strong one, try the <a href="/en/tools/password-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Password Generator</a>.',
    inputLabel: 'Password to check',
    inputPlaceholder: 'Type a password',
    showLabel: 'Show password',
    levelLabel: 'Strength',
    emptyLevel: 'Empty',
    levels: ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'],
    summaryTemplate: '{length} characters / about {bits} bits of entropy',
    crackHeading: 'Estimated time to crack (average brute force)',
    onlineLabel: 'Online attack (rate-limited, 100 guesses/s)',
    offlineLabel: 'Offline attack (fast hash, 10 billion guesses/s)',
    units: {
      instant: 'Instantly (under 1 second)',
      seconds: 'About {n} seconds',
      minutes: 'About {n} minutes',
      hours: 'About {n} hours',
      days: 'About {n} days',
      years: 'About {n} years',
      millionYears: 'Over 1 million years',
    },
    checklistHeading: 'Checklist',
    checkLength: 'At least 8 characters',
    checkLowercase: 'Has lowercase letters',
    checkUppercase: 'Has uppercase letters',
    checkNumber: 'Has numbers',
    checkSymbol: 'Has symbols',
    issuesHeading: 'Things to improve',
    noIssues: 'No obvious weaknesses were found.',
    issues: {
      'too-short': 'Too short. Aim for 12 or more characters.',
      common:
        'This is a commonly used password. Swapping in symbols or digits will not stop it from being guessed quickly.',
      'common-base':
        'This is a common word with digits or symbols tacked on, which is an easily guessed pattern.',
      'only-digits': 'It contains only digits.',
      'only-letters': 'It contains only letters.',
      repeated: 'It repeats the same character (for example, aaa).',
      sequence:
        'It contains a run of consecutive characters (for example, abc or 123).',
      keyboard:
        'It contains neighboring keys in a row on the keyboard (for example, qwerty).',
    },
    notesHeading: 'Notes',
    notes: [
      'The rating is a rough guide based on length and character types. Real-world safety also depends on whether the password is reused or has appeared in a data breach.',
      'Crack times are theoretical figures assuming half the search space is tried by brute force. Dictionary attacks and lists of leaked passwords can break a password much faster.',
      'The common-password check compares against a small built-in list. Not being on the list does not mean a password is safe.',
      'Avoid typing a password you actually use. This tool does not send your input anywhere, but a screen share or recording could capture it.',
      'The most effective defense is to never reuse the same password across services.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Entropy (bits)',
        description:
          'A measure of how hard a password is to guess. Each extra bit doubles the number of attempts a brute-force attack needs.',
      },
      {
        term: 'Brute-force attack',
        description:
          'An attack that tries every possible combination of characters until it finds the password.',
      },
      {
        term: 'Dictionary attack',
        description:
          'An attack that tries lists of common words and passwords first. A word with digits added on the end falls far faster than brute force would suggest.',
      },
      {
        term: 'Offline attack',
        description:
          'An attack against a stolen hash that the attacker can test at full speed with no rate limit. It is orders of magnitude faster than guessing through a login form.',
      },
    ],
  },
};
