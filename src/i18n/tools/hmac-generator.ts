import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface HmacGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  messageLabel: string;
  messagePlaceholder: string;
  keyLabel: string;
  keyPlaceholder: string;
  keyFormatLabel: string;
  keyFormatText: string;
  keyFormatHex: string;
  algorithmLabel: string;
  outputFormatLabel: string;
  outputHex: string;
  outputBase64: string;
  outputBase64Url: string;
  resultLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  expectedLabel: string;
  expectedPlaceholder: string;
  matchOk: string;
  matchNg: string;
  invalidHex: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const hmacGeneratorContent: Record<Locale, HmacGeneratorPageContent> = {
  ja: {
    title: 'HMAC署名生成（SHA-256/SHA-512）',
    description:
      'メッセージと秘密鍵からHMAC-SHA1・SHA-256・SHA-384・SHA-512の署名を計算できる無料ツールです。Webhook署名の検証やAPI認証のデバッグに。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'HMAC署名生成（SHA-256/SHA-512）',
    introHtml:
      'メッセージと秘密鍵からHMAC署名を計算します。Webhookの署名検証やAPI認証のデバッグに使えます。ブラウザ内で処理され、鍵やメッセージがサーバーに送信されることはありません。鍵なしのハッシュは <a href="/tools/hash-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ハッシュ生成</a> をご利用ください。',
    messageLabel: 'メッセージ',
    messagePlaceholder: '署名したいテキスト（Webhookならリクエストボディ）',
    keyLabel: '秘密鍵',
    keyPlaceholder: '共有シークレット',
    keyFormatLabel: '鍵の形式',
    keyFormatText: 'テキスト（UTF-8）',
    keyFormatHex: '16進数',
    algorithmLabel: 'アルゴリズム',
    outputFormatLabel: '出力形式',
    outputHex: '16進数',
    outputBase64: 'Base64',
    outputBase64Url: 'Base64URL',
    resultLabel: 'HMAC署名',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    expectedLabel: '照合する署名（任意）',
    expectedPlaceholder: '受け取った署名を貼り付けると一致を確認します',
    matchOk: '一致しました',
    matchNg: '一致しません',
    invalidHex: '鍵が正しい16進数ではありません（偶数桁の0-9・a-fで入力）。',
    notesHeading: '注意事項',
    notes: [
      'メッセージは改行や空白を含めて1バイトでも違うと別の署名になります。Webhookでは受信した生のボディをそのまま入力してください（JSONを整形し直さないこと）。',
      'HMAC-SHA1はHMACとしては現在も破られていませんが、新規に使うならSHA-256以上を選んでください。',
      '本番の秘密鍵の入力は避け、検証用の鍵で試すことをおすすめします。入力内容は保存・送信されませんが、画面共有などにご注意ください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'HMAC',
        description:
          '秘密鍵とハッシュ関数を組み合わせて、メッセージの改ざん検知と送信元の確認を行う仕組みです。同じ鍵を持つ者だけが同じ署名を作れます。',
      },
      {
        term: 'Webhook署名',
        description:
          'GitHubやStripeなどが通知の正当性を示すため、リクエストボディのHMACをヘッダーに付けて送る方式です。受信側で同じ鍵から計算し直して一致を確認します。',
      },
      {
        term: 'Base64URL',
        description:
          'Base64の「+」「/」を「-」「_」に置き換え、末尾の「=」を省いた形式です。URLやJWTの署名部分で使われます。',
      },
    ],
  },
  en: {
    title: 'HMAC Generator (SHA-256/SHA-512)',
    description:
      'Compute HMAC-SHA1/256/384/512 signatures from a message and secret key to verify webhooks and debug API auth. Runs in your browser; nothing is sent to a server.',
    h1: 'HMAC Generator (SHA-256/SHA-512)',
    introHtml:
      'Computes an HMAC signature from a message and a secret key, which is useful for verifying webhook signatures and debugging API authentication. Everything runs in your browser, and your key and message are never sent to a server. For a hash without a key, use the <a href="/en/tools/hash-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Hash Generator</a>.',
    messageLabel: 'Message',
    messagePlaceholder: 'Text to sign (the raw request body for a webhook)',
    keyLabel: 'Secret key',
    keyPlaceholder: 'Shared secret',
    keyFormatLabel: 'Key format',
    keyFormatText: 'Text (UTF-8)',
    keyFormatHex: 'Hex',
    algorithmLabel: 'Algorithm',
    outputFormatLabel: 'Output format',
    outputHex: 'Hex',
    outputBase64: 'Base64',
    outputBase64Url: 'Base64URL',
    resultLabel: 'HMAC signature',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    expectedLabel: 'Signature to compare (optional)',
    expectedPlaceholder: 'Paste a received signature to check for a match',
    matchOk: 'Match',
    matchNg: 'No match',
    invalidHex:
      'The key is not valid hex (use an even number of 0-9 and a-f characters).',
    notesHeading: 'Notes',
    notes: [
      'Even one byte of difference in the message, including line breaks and spaces, gives a different signature. For webhooks, paste the raw received body exactly as is (do not re-format the JSON).',
      'HMAC-SHA1 has not been broken as an HMAC, but pick SHA-256 or stronger for anything new.',
      'Prefer a test key over a production secret. Nothing you type is stored or sent, but be careful when sharing your screen.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'HMAC',
        description:
          'A construction that combines a secret key with a hash function to detect tampering and confirm the sender. Only someone holding the same key can produce the same signature.',
      },
      {
        term: 'Webhook signature',
        description:
          'Services such as GitHub and Stripe attach an HMAC of the request body in a header to prove a notification is genuine. The receiver recomputes it with the same key and checks that it matches.',
      },
      {
        term: 'Base64URL',
        description:
          'A Base64 variant that replaces "+" and "/" with "-" and "_" and drops the trailing "=". It is used in URLs and in the signature part of a JWT.',
      },
    ],
  },
};
