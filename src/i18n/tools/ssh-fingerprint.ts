import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SshFingerprintPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  keyTypeLabel: string;
  bitsLabel: string;
  commentLabel: string;
  sha256Label: string;
  md5Label: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** {n} を行番号に置換する */
  lineLabel: string;
  invalidFormat: string;
  unsupportedType: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

// ssh-keygen で生成したサンプルのED25519公開鍵
const SAMPLE_KEY =
  'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOO5oum+3qqVZlGjw8biKqsamenET2qniWYO1tcPZIjl test@example';

export const sshFingerprintContent: Record<Locale, SshFingerprintPageContent> =
  {
    ja: {
      title: 'SSH鍵フィンガープリント表示（SHA256・MD5）',
      description:
        'SSH公開鍵（ssh-rsa・ssh-ed25519・ecdsa）からSHA256・MD5のフィンガープリントを計算する無料ツールです。authorized_keysの複数行にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: 'SSH鍵フィンガープリント表示',
      introHtml:
        'SSH公開鍵（<code>id_ed25519.pub</code> や <code>authorized_keys</code> の内容）を貼り付けると、<code>ssh-keygen -l</code> と同じSHA256・MD5のフィンガープリントを表示します。ブラウザ内で処理され、鍵がサーバーに送信されることはありません。',
      inputLabel: '公開鍵',
      inputPlaceholder: 'ssh-ed25519 AAAAC3Nza... user@host',
      sampleText: SAMPLE_KEY,
      keyTypeLabel: '鍵の種類',
      bitsLabel: '鍵長',
      commentLabel: 'コメント',
      sha256Label: 'SHA256',
      md5Label: 'MD5',
      copy: 'コピー',
      copied: 'コピーしました',
      copyFailed: 'コピーに失敗しました',
      lineLabel: '{n}行目',
      invalidFormat:
        '公開鍵として読み取れません。「ssh-ed25519 AAAA... コメント」の形式の1行を貼り付けてください。',
      unsupportedType: '未対応の鍵の種類です。',
      notesHeading: '注意事項',
      notes: [
        '貼り付けるのは公開鍵（.pub ファイルの内容）です。秘密鍵（-----BEGIN OPENSSH PRIVATE KEY----- など）は貼り付けないでください。このツールでは読み取れません。',
        '複数行を貼り付けると、行ごとに結果を表示します。空行と # で始まる行は無視されます。',
        '対応する鍵の種類は ssh-rsa、ssh-dss、ssh-ed25519、ecdsa-sha2-nistp256/384/521、およびセキュリティキー用の sk-ssh-ed25519 / sk-ecdsa です。証明書付きの鍵（-cert-v01）には対応していません。',
        'MD5は古い形式です。現在のOpenSSHは既定でSHA256を表示します。MD5は古い機器やドキュメントとの照合用です。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'フィンガープリント',
          description:
            '公開鍵のハッシュ値です。鍵そのものより短く、初めて接続するサーバーの鍵が正しいかを人が見比べて確認するのに使います。',
        },
        {
          term: 'authorized_keys',
          description:
            'SSHサーバー側で、ログインを許可する公開鍵を1行ずつ並べたファイル（~/.ssh/authorized_keys）です。',
        },
        {
          term: 'ED25519',
          description:
            '楕円曲線を使う署名方式で、鍵が短く高速です。現在のSSH鍵の標準的な選択肢の1つです。',
        },
      ],
    },
    en: {
      title: 'SSH Key Fingerprint Viewer (SHA256 & MD5)',
      description:
        'Get the SHA256 and MD5 fingerprint of an SSH public key, including authorized_keys lines. Runs in your browser; nothing is sent to a server.',
      h1: 'SSH Key Fingerprint Viewer',
      introHtml:
        'Paste an SSH public key (the contents of <code>id_ed25519.pub</code> or <code>authorized_keys</code>) to see the same SHA256 and MD5 fingerprints that <code>ssh-keygen -l</code> prints. Everything runs in your browser, and your key is never sent to a server.',
      inputLabel: 'Public key',
      inputPlaceholder: 'ssh-ed25519 AAAAC3Nza... user@host',
      sampleText: SAMPLE_KEY,
      keyTypeLabel: 'Key type',
      bitsLabel: 'Key size',
      commentLabel: 'Comment',
      sha256Label: 'SHA256',
      md5Label: 'MD5',
      copy: 'Copy',
      copied: 'Copied',
      copyFailed: 'Copy failed',
      lineLabel: 'Line {n}',
      invalidFormat:
        'This could not be read as a public key. Paste one line in the form "ssh-ed25519 AAAA... comment".',
      unsupportedType: 'Unsupported key type.',
      notesHeading: 'Notes',
      notes: [
        'Paste the public key (the contents of the .pub file). Do not paste a private key (-----BEGIN OPENSSH PRIVATE KEY----- and the like); this tool cannot read them.',
        'If you paste several lines, a result is shown for each line. Blank lines and lines starting with # are ignored.',
        'Supported key types are ssh-rsa, ssh-dss, ssh-ed25519, ecdsa-sha2-nistp256/384/521, and the security-key types sk-ssh-ed25519 and sk-ecdsa. Certificate keys (-cert-v01) are not supported.',
        'MD5 is the legacy format. Current OpenSSH shows SHA256 by default; MD5 is for comparing against older devices and documentation.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'Fingerprint',
          description:
            'A hash of a public key. It is shorter than the key itself and is what people compare by eye to check that the key of a server they are connecting to for the first time is the right one.',
        },
        {
          term: 'authorized_keys',
          description:
            'A file on the SSH server (~/.ssh/authorized_keys) that lists, one per line, the public keys allowed to log in.',
        },
        {
          term: 'ED25519',
          description:
            'An elliptic-curve signature scheme with short keys and fast operations, and one of the standard choices for SSH keys today.',
        },
      ],
    },
  };
