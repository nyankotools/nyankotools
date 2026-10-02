import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface HashGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  copy: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const hashGeneratorContent: Record<Locale, HashGeneratorPageContent> = {
  ja: {
    title: 'ハッシュ生成（MD5/SHA-1/SHA-256）',
    description:
      'テキストからMD5・SHA-1・SHA-256のハッシュ値を無料で計算できるツールです。ファイルの改ざんチェックやパスワードのハッシュ化確認などにご利用ください。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ハッシュ生成（MD5/SHA-1/SHA-256）',
    introHtml:
      '入力したテキストのMD5・SHA-1・SHA-256ハッシュ値をリアルタイムで計算します。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。ランダムな文字列が必要な場合は <a href="/tools/password-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">パスワード生成</a> もあわせてご利用ください。',
    inputLabel: '入力',
    inputPlaceholder: 'ハッシュ化したいテキストを入力',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      'MD5・SHA-1は既知の脆弱性があり、パスワードの保存など安全性が求められる用途には使用しないでください。',
      '入力は改行やスペースも含めて厳密に区別されます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ハッシュ値',
        description:
          '元のデータから一定の計算手順で求められる、固定長の文字列です。同じ入力からは常に同じハッシュ値が得られますが、ハッシュ値だけから元のデータを逆算することはできません。',
      },
      {
        term: 'MD5',
        description:
          '古くから使われているハッシュ関数の一つです。異なる入力から同じハッシュ値を意図的に作り出す方法（衝突）が知られており、改ざん検知やパスワード保存などセキュリティが求められる用途には使用しないでください。',
      },
      {
        term: 'SHA-1',
        description:
          'MD5の後継として広く使われたハッシュ関数ですが、こちらも安全性の問題が指摘されており、現在はセキュリティ用途では非推奨とされています。',
      },
      {
        term: 'SHA-256',
        description:
          'SHA-2ファミリーに属するハッシュ関数です。現在も安全性が高いとされ、デジタル証明書やブロックチェーンなど幅広い分野で利用されています。',
      },
    ],
  },
  en: {
    title: 'Hash Generator (MD5/SHA-1/SHA-256)',
    description:
      'Compute MD5, SHA-1, and SHA-256 hashes from text to check integrity or verify a hash. Runs in your browser; nothing is sent to a server.',
    h1: 'Hash Generator (MD5/SHA-1/SHA-256)',
    introHtml:
      'Computes the MD5, SHA-1, and SHA-256 hash of your text in real time. All processing happens in your browser, and nothing you type is ever sent to a server. Need a random string instead? Try the <a href="/en/tools/password-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Password Generator</a> as well.',
    inputLabel: 'Input',
    inputPlaceholder: 'Enter the text you want to hash',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'MD5 and SHA-1 have known vulnerabilities and should not be used for security-sensitive purposes such as password storage.',
      'Input is matched exactly, including line breaks and spaces.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Hash value',
        description:
          'A fixed-length string computed from input data using a set procedure. The same input always produces the same hash, but you cannot reverse a hash back into the original data.',
      },
      {
        term: 'MD5',
        description:
          'An older hash function. Methods for deliberately producing two different inputs with the same MD5 hash (collisions) are well known, so avoid it for security-sensitive uses such as tamper detection or password storage.',
      },
      {
        term: 'SHA-1',
        description:
          "Widely used as MD5's successor, but it also has known weaknesses and is now discouraged for security purposes.",
      },
      {
        term: 'SHA-256',
        description:
          'Part of the SHA-2 family. It is still considered secure and is used widely, including in digital certificates and blockchains.',
      },
    ],
  },
};
