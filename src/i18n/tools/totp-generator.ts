import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface TotpGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  secretLabel: string;
  secretPlaceholder: string;
  generateSecret: string;
  algorithmLabel: string;
  digitsLabel: string;
  periodLabel: string;
  codeLabel: string;
  nextCodeLabel: string;
  /** {n} を残り秒数に置換する */
  remaining: string;
  copy: string;
  copied: string;
  copyFailed: string;
  verifyLabel: string;
  verifyPlaceholder: string;
  verifyCurrent: string;
  verifyPrevious: string;
  verifyNext: string;
  verifyInvalid: string;
  invalidSecret: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const totpGeneratorContent: Record<Locale, TotpGeneratorPageContent> = {
  ja: {
    title: 'TOTPコード生成・検証（2段階認証）',
    description:
      'Base32の秘密鍵（またはotpauth://のURI）から、2段階認証で使われるTOTPコードをその場で生成・検証できる無料ツールです。実装のデバッグや動作確認に。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'TOTPコード生成・検証（2段階認証）',
    introHtml:
      '秘密鍵（Base32）から、Google Authenticatorなどと同じ方式（RFC 6238）の6桁コードを生成します。otpauth://形式のURIを貼り付けると設定も読み込みます。実装のデバッグ・動作確認用で、実際の2段階認証の登録・運用には認証アプリをお使いください。ブラウザ内で処理され、鍵がサーバーに送信されることはありません。内部ではHMACを使っています（<a href="/tools/hmac-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HMAC署名生成</a>）。',
    secretLabel: '秘密鍵（Base32）または otpauth:// URI',
    secretPlaceholder: 'JBSWY3DPEHPK3PXP',
    generateSecret: 'ランダムな鍵を生成',
    algorithmLabel: 'アルゴリズム',
    digitsLabel: '桁数',
    periodLabel: '更新間隔（秒）',
    codeLabel: '現在のコード',
    nextCodeLabel: '次のコード',
    remaining: '残り{n}秒',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    verifyLabel: 'コードを検証',
    verifyPlaceholder: '確認したいコードを入力',
    verifyCurrent: '有効です（現在のコード）',
    verifyPrevious: '有効です（1つ前のコード。時刻のずれの許容範囲内）',
    verifyNext: '有効です（1つ先のコード。時刻のずれの許容範囲内）',
    verifyInvalid: '無効です',
    invalidSecret:
      '秘密鍵が正しいBase32ではありません（A-Z と 2-7 のみ使えます）。',
    notesHeading: '注意事項',
    notes: [
      'コードの計算には端末の現在時刻を使います。端末の時計がずれていると、サーバー側のコードと一致しません。',
      '検証では、時刻のずれを考慮して前後1つぶんのコードも有効として扱います。',
      '本物のアカウントの秘密鍵を入力するのは避け、検証用の鍵で試すことをおすすめします。入力内容は保存・送信されませんが、画面共有などにご注意ください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'TOTP',
        description:
          'Time-based One-Time Password。共有した秘密鍵と現在時刻から、30秒ごとなど一定間隔で変わる使い捨てコードを計算する方式です（RFC 6238）。',
      },
      {
        term: 'Base32',
        description:
          'A-Zと2-7の32種類の文字でデータを表す形式です。認証アプリに登録する秘密鍵は、この形式で表示されるのが一般的です。',
      },
      {
        term: 'otpauth:// URI',
        description:
          'QRコードに埋め込まれる、秘密鍵・発行者・桁数・更新間隔などをまとめたURIです。認証アプリはこれを読み取って登録します。',
      },
    ],
  },
  en: {
    title: 'TOTP Code Generator & Verifier (2FA)',
    description:
      'Generate and verify TOTP 2FA codes from a Base32 secret or otpauth:// URI to debug 2FA implementations. Runs in your browser; nothing is sent to a server.',
    h1: 'TOTP Code Generator & Verifier (2FA)',
    introHtml:
      'Generates the same 6-digit codes (RFC 6238) that Google Authenticator and similar apps show, from a Base32 secret. Paste an otpauth:// URI to load its settings too. It is meant for debugging and testing an implementation, not as a replacement for an authenticator app. Everything runs in your browser, and your secret is never sent to a server. It is built on HMAC (see the <a href="/en/tools/hmac-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HMAC Generator</a>).',
    secretLabel: 'Secret (Base32) or otpauth:// URI',
    secretPlaceholder: 'JBSWY3DPEHPK3PXP',
    generateSecret: 'Generate random secret',
    algorithmLabel: 'Algorithm',
    digitsLabel: 'Digits',
    periodLabel: 'Period (seconds)',
    codeLabel: 'Current code',
    nextCodeLabel: 'Next code',
    remaining: '{n}s left',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    verifyLabel: 'Verify a code',
    verifyPlaceholder: 'Enter the code to check',
    verifyCurrent: 'Valid (current code)',
    verifyPrevious: 'Valid (previous code, within the clock-drift allowance)',
    verifyNext: 'Valid (next code, within the clock-drift allowance)',
    verifyInvalid: 'Invalid',
    invalidSecret:
      'The secret is not valid Base32 (only A-Z and 2-7 are allowed).',
    notesHeading: 'Notes',
    notes: [
      "Codes are computed from your device's current time. If your clock is off, the codes will not match the server's.",
      'Verification also accepts the code one step before and after the current one, to allow for clock drift.',
      'Avoid entering the secret of a real account; use a test secret instead. Nothing you type is stored or sent, but be careful when sharing your screen.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'TOTP',
        description:
          'Time-based One-Time Password. A scheme that computes a single-use code from a shared secret and the current time, changing at a fixed interval such as every 30 seconds (RFC 6238).',
      },
      {
        term: 'Base32',
        description:
          'An encoding that represents data with 32 characters, A-Z and 2-7. Secrets you register in an authenticator app are usually shown in this format.',
      },
      {
        term: 'otpauth:// URI',
        description:
          'The URI embedded in a 2FA QR code, bundling the secret, issuer, digits, period, and so on. Authenticator apps read it to register an account.',
      },
    ],
  },
};
