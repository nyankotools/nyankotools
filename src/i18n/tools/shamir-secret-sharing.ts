import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ShamirSecretSharingPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeSplit: string;
  modeCombine: string;
  secretLabel: string;
  secretPlaceholder: string;
  countLabel: string;
  thresholdLabel: string;
  sharesInputLabel: string;
  sharesInputPlaceholder: string;
  runSplit: string;
  runCombine: string;
  outputLabelSplit: string;
  outputLabelCombine: string;
  copy: string;
  copied: string;
  copyFailed: string;
  splitDone: string;
  combineDone: string;
  errEmptySecret: string;
  errCount: string;
  errThreshold: string;
  errThresholdExceeds: string;
  errNoShares: string;
  errFormat: string;
  errLength: string;
  errDuplicate: string;
  errThresholdMismatch: string;
  errNotEnough: string;
  errCorrupted: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const shamirSecretSharingContent: Record<
  Locale,
  ShamirSecretSharingPageContent
> = {
  ja: {
    title: 'Shamir秘密分散｜秘密をn個に分割・k個で復元',
    description:
      'Shamir秘密分散で、テキストの秘密をn個のシェアに分割し、k個以上集めると復元できる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Shamir秘密分散（秘密の分割・復元）',
    introHtml:
      'テキストの秘密（パスフレーズやメモなど）を n 個のシェアに分割し、そのうち k 個以上を集めたときだけ元に戻せるようにします。k-1 個以下のシェアからは秘密について何も分かりません。GF(256) 上のShamir法を使い、乱数にはブラウザの <code>crypto.getRandomValues</code> を使います。処理はすべてブラウザ内で完結し、秘密やシェアがサーバーに送信されることはありません。秘密そのものをパスワードで暗号化したい場合は <a href="/tools/crypto-encryptor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">テキスト暗号化・復号</a> も使えます。',
    modeLabel: 'モード',
    modeSplit: '分割',
    modeCombine: '復元',
    secretLabel: '秘密（テキスト）',
    secretPlaceholder: '分割したい秘密のテキストを入力',
    countLabel: 'シェアの数 n（2〜255）',
    thresholdLabel: '復元に必要な数 k（2〜n）',
    sharesInputLabel: 'シェア（1行に1つ）',
    sharesInputPlaceholder: '集めたシェアを1行に1つずつ貼り付け',
    runSplit: 'シェアに分割する',
    runCombine: '秘密を復元する',
    outputLabelSplit: 'シェア（1行に1つ）',
    outputLabelCombine: '復元された秘密',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    splitDone: 'シェアを作成しました。1行ずつ別々の場所に保管してください。',
    combineDone: '秘密を復元しました。',
    errEmptySecret: '秘密のテキストを入力してください。',
    errCount: 'シェアの数 n は2〜255の整数で指定してください。',
    errThreshold: '復元に必要な数 k は2以上の整数で指定してください。',
    errThresholdExceeds: 'k は n 以下にしてください。',
    errNoShares: 'シェアを貼り付けてください。',
    errFormat:
      '{n}行目のシェアの形式が正しくありません。このツールで作成したシェアを、欠けや余分な文字なく貼り付けてください。',
    errLength:
      '{n}行目のシェアの長さが他と一致しません。同じ秘密から作ったシェアか確認してください。',
    errDuplicate:
      '{n}行目のシェアが他と重複しています。同じシェアを2回入れていませんか。',
    errThresholdMismatch:
      '{n}行目のシェアは、必要数 k が他と異なります。別の分割で作ったシェアが混ざっています。',
    errNotEnough:
      'シェアが足りません。復元には、分割時に決めた k 個以上のシェアが必要です。',
    errCorrupted:
      '復元できませんでした。シェアが破損しているか、別の秘密のシェアが混ざっている可能性があります。',
    howToHeading: '使い方',
    howToSteps: [
      'モードで「分割」を選び、秘密のテキストとシェアの数 n、復元に必要な数 k を入力します。',
      '「シェアに分割する」を押すと、n 個のシェアが1行に1つずつ表示されます。コピーして別々の場所や人に保管します。',
      '復元するときはモードで「復元」を選び、集めたシェアを1行に1つずつ貼り付けます。',
      '「秘密を復元する」を押すと、k 個以上のシェアがそろっていれば元のテキストが表示されます。',
    ],
    notesHeading: '注意事項',
    notes: [
      'k 個未満のシェアしか残っていないと、秘密は復元できません。シェアを紛失して k 個を下回ると、秘密は二度と取り戻せません。復元用の連絡先や保管場所を忘れないようにしてください。',
      '学習・バックアップ用途のツールです。本ツールは監査された実装ではないため、実運用の重要な鍵や資産の管理には、検証済みのソフトウェアを使うことをおすすめします。',
      'シェアは16進文字列で、先頭の3バイトがバージョン・k・x座標です。シェアそのものは暗号化されていないため、k 個が同じ人や場所に集まると秘密が分かります。保管先は分散させてください。',
      '秘密はUTF-8のテキストで扱い、復元時の取り違え検出のため末尾にCRC32を付けて分割します。このため、シェアは元の秘密より4バイト分長くなります。他のツールのシェアとは互換性がありません。',
      'シェアの数は2〜255、k は2以上 n 以下です。ファイルの分割には対応していません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Shamir秘密分散',
        description:
          '秘密を複数のシェアに分け、しきい値以上のシェアを集めたときだけ復元できる方式です。k-1 次の多項式の定数項に秘密を置き、複数の点（シェア）から補間して取り出します。',
      },
      {
        term: 'しきい値（k）',
        description:
          '復元に必要な最小のシェア数です。「3-of-5」なら5個に分割し、どの3個でも復元できますが、2個では何も分かりません。',
      },
      {
        term: 'GF(256)',
        description:
          '要素が256個（1バイト分）の有限体です。バイト単位で足し算（XOR）・掛け算ができるため、1バイトずつ秘密を分割できます。',
      },
    ],
  },
  en: {
    title: "Shamir's Secret Sharing: Split & Combine Secrets",
    description:
      "Split a text secret into n shares with Shamir's Secret Sharing and recover it from any k of them. Runs in your browser; nothing is sent to a server.",
    h1: "Shamir's Secret Sharing (Split & Combine)",
    introHtml:
      'Splits a text secret (a passphrase, a note) into n shares so that any k of them can rebuild it, while k-1 or fewer reveal nothing about it. It uses Shamir\'s scheme over GF(256) and the browser\'s <code>crypto.getRandomValues</code> for randomness. Everything runs in your browser, and your secret and shares are never sent to a server. To protect a secret with a password instead, try the <a href="/en/tools/crypto-encryptor/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Text Encryptor &amp; Decryptor</a>.',
    modeLabel: 'Mode',
    modeSplit: 'Split',
    modeCombine: 'Combine',
    secretLabel: 'Secret (text)',
    secretPlaceholder: 'Enter the secret text to split',
    countLabel: 'Number of shares n (2-255)',
    thresholdLabel: 'Shares needed to recover k (2 to n)',
    sharesInputLabel: 'Shares (one per line)',
    sharesInputPlaceholder: 'Paste the shares you collected, one per line',
    runSplit: 'Split into shares',
    runCombine: 'Recover secret',
    outputLabelSplit: 'Shares (one per line)',
    outputLabelCombine: 'Recovered secret',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    splitDone:
      'Shares created. Store each line in a separate place or with a different person.',
    combineDone: 'Secret recovered.',
    errEmptySecret: 'Enter the secret text.',
    errCount: 'The number of shares n must be an integer from 2 to 255.',
    errThreshold: 'The threshold k must be an integer of 2 or more.',
    errThresholdExceeds: 'k must not be greater than n.',
    errNoShares: 'Paste the shares.',
    errFormat:
      'Line {n} is not a valid share. Paste shares created by this tool, with nothing missing or added.',
    errLength:
      'The share on line {n} has a different length from the others. Check that they all come from the same secret.',
    errDuplicate:
      'The share on line {n} is a duplicate. Did you paste the same share twice?',
    errThresholdMismatch:
      'The share on line {n} needs a different k than the others, so shares from different splits are mixed.',
    errNotEnough:
      'Not enough shares. You need at least the k shares you chose when splitting.',
    errCorrupted:
      'Could not recover the secret. A share may be corrupted, or shares of a different secret may be mixed in.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose "Split" as the mode, then enter the secret text, the number of shares n, and the number needed to recover k.',
      'Click "Split into shares" to get n shares, one per line. Copy them and store each in a separate place or with a different person.',
      'To recover, choose "Combine" as the mode and paste the collected shares, one per line.',
      'Click "Recover secret" and, if you have at least k shares, the original text appears.',
    ],
    notesHeading: 'Notes',
    notes: [
      'With fewer than k shares the secret cannot be recovered. If you lose shares and fewer than k remain, the secret is gone for good. Keep track of where each share is stored.',
      'This tool is meant for learning and backups. It has not been audited, so for critical keys or assets use well-reviewed software.',
      'A share is a hex string whose first 3 bytes are the version, k, and the x coordinate. Shares are not encrypted, so anyone who gathers k of them can read the secret. Store them in different places.',
      'The secret is handled as UTF-8 text, and a CRC32 is appended before splitting to detect mixed-up shares, so each share is 4 bytes longer than the secret. The format is not compatible with other tools.',
      'The number of shares is 2 to 255, and k is between 2 and n. Splitting files is not supported.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: "Shamir's Secret Sharing",
        description:
          'A scheme that splits a secret into shares so that it can be recovered only when a threshold number of shares are combined. The secret is the constant term of a degree k-1 polynomial, and the shares are points on it.',
      },
      {
        term: 'Threshold (k)',
        description:
          'The minimum number of shares needed to recover the secret. With "3-of-5" you make 5 shares and any 3 recover the secret, while 2 reveal nothing.',
      },
      {
        term: 'GF(256)',
        description:
          'A finite field with 256 elements, one per byte value. Addition (XOR) and multiplication work on whole bytes, so the secret can be split byte by byte.',
      },
    ],
  },
};
