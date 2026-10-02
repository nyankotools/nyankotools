import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface BcryptGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  generateHeading: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  costLabel: string;
  costHint: string;
  generateButton: string;
  working: string;
  resultLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  verifyHeading: string;
  verifyPasswordLabel: string;
  hashLabel: string;
  hashPlaceholder: string;
  verifyButton: string;
  matchOk: string;
  matchNg: string;
  infoVersion: string;
  infoCost: string;
  infoSalt: string;
  passwordTooLong: string;
  invalidHash: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const bcryptGeneratorContent: Record<
  Locale,
  BcryptGeneratorPageContent
> = {
  ja: {
    title: 'bcryptハッシュ生成・照合',
    description:
      'パスワードからbcryptハッシュを生成し、既存のハッシュと照合できる無料ツールです。コスト（ラウンド数）も選べます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'bcryptハッシュ生成・照合',
    introHtml:
      'パスワードをbcryptでハッシュ化し、保存済みのハッシュと一致するかを確認できます。ブラウザ内で処理され、パスワードやハッシュがサーバーに送信されることはありません。SHA-256などの単純なハッシュは <a href="/tools/hash-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ハッシュ生成</a> をご利用ください。',
    generateHeading: 'ハッシュを生成',
    passwordLabel: 'パスワード',
    passwordPlaceholder: 'ハッシュ化したいパスワード',
    costLabel: 'コスト（ラウンド数）',
    costHint:
      '値が1増えると計算時間が約2倍になります。12以上は数秒かかることがあります。',
    generateButton: 'ハッシュを生成',
    working: '計算中…',
    resultLabel: 'bcryptハッシュ',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    verifyHeading: 'ハッシュを照合',
    verifyPasswordLabel: '確認するパスワード',
    hashLabel: 'bcryptハッシュ',
    hashPlaceholder: '$2a$10$...',
    verifyButton: '照合する',
    matchOk: '一致しました',
    matchNg: '一致しません',
    infoVersion: 'バージョン',
    infoCost: 'コスト',
    infoSalt: 'ソルト',
    passwordTooLong:
      'パスワードが72バイトを超えています。bcryptは先頭72バイトしか使わないため、生成できません。',
    invalidHash:
      'bcryptハッシュの形式ではありません（$2a$10$ などで始まる60文字の文字列）。',
    notesHeading: '注意事項',
    notes: [
      'bcryptはパスワードの先頭72バイトまでしか使いません。日本語は1文字3バイトなので、24文字を超えると切り捨てられます。このツールでは72バイトを超える入力は生成できません。',
      'ソルトは生成のたびにランダムに作られるため、同じパスワードでも毎回違うハッシュになります。一致の確認は「照合」で行ってください。',
      'コストを上げるほど総当たり攻撃に強くなりますが、ログイン時の計算も重くなります。目安として、本番では10〜12程度が使われます。',
      '本番で使っているパスワードの入力は避け、テスト用の値で試すことをおすすめします。入力内容は保存・送信されませんが、画面共有などにご注意ください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'bcrypt',
        description:
          'パスワード保存用に設計されたハッシュ関数です。意図的に計算を遅くすることで、総当たり攻撃のコストを高めます。',
      },
      {
        term: 'コスト（ラウンド数）',
        description:
          '計算の重さを決める値で、2のコスト乗回の繰り返しを行います。コスト10なら1024回、12なら4096回です。',
      },
      {
        term: 'ソルト',
        description:
          'ハッシュ化のたびに加えるランダムな値です。bcryptではハッシュ文字列の中に含まれるため、別途保存する必要はありません。',
      },
    ],
  },
  en: {
    title: 'Bcrypt Hash Generator & Verifier',
    description:
      'Generate a bcrypt hash from a password and check it against an existing hash, with an adjustable cost factor. Runs in your browser; nothing is sent to a server.',
    h1: 'Bcrypt Hash Generator & Verifier',
    introHtml:
      'Hash a password with bcrypt and check whether it matches a stored hash. Everything runs in your browser, and your password and hash are never sent to a server. For plain hashes such as SHA-256, use the <a href="/en/tools/hash-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Hash Generator</a>.',
    generateHeading: 'Generate a hash',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Password to hash',
    costLabel: 'Cost factor (rounds)',
    costHint:
      'Each +1 roughly doubles the computation time. 12 and above can take several seconds.',
    generateButton: 'Generate hash',
    working: 'Working…',
    resultLabel: 'Bcrypt hash',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    verifyHeading: 'Verify a hash',
    verifyPasswordLabel: 'Password to check',
    hashLabel: 'Bcrypt hash',
    hashPlaceholder: '$2a$10$...',
    verifyButton: 'Verify',
    matchOk: 'Match',
    matchNg: 'No match',
    infoVersion: 'Version',
    infoCost: 'Cost',
    infoSalt: 'Salt',
    passwordTooLong:
      'The password is longer than 72 bytes. bcrypt only uses the first 72 bytes, so a hash cannot be generated.',
    invalidHash:
      'This is not a bcrypt hash (a 60-character string starting with $2a$10$ or similar).',
    notesHeading: 'Notes',
    notes: [
      'bcrypt only uses the first 72 bytes of a password. Characters outside ASCII take 2-4 bytes each, so long non-ASCII passwords can hit the limit sooner. This tool refuses input over 72 bytes instead of silently truncating it.',
      'The salt is random every time, so the same password gives a different hash on each run. Use "Verify" to check for a match.',
      'A higher cost resists brute force better but also makes every login slower. A cost of about 10-12 is common in production.',
      'Prefer a test value over a real production password. Nothing you type is stored or sent, but be careful when sharing your screen.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'bcrypt',
        description:
          'A hash function designed for storing passwords. It is deliberately slow, which raises the cost of brute-force attacks.',
      },
      {
        term: 'Cost factor (rounds)',
        description:
          'Sets how heavy the computation is: the work is repeated 2^cost times. Cost 10 means 1,024 iterations and cost 12 means 4,096.',
      },
      {
        term: 'Salt',
        description:
          'A random value mixed in each time a password is hashed. In bcrypt it is embedded in the hash string, so it does not need to be stored separately.',
      },
    ],
  },
};
