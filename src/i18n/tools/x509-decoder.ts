import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

/** 結果表示用のラベル（スクリプトへは data-labels のJSONで渡す） */
export interface X509Labels {
  certificate: string;
  version: string;
  serialNumber: string;
  signatureAlgorithm: string;
  issuer: string;
  subject: string;
  notBefore: string;
  notAfter: string;
  publicKey: string;
  fingerprints: string;
  extensions: string;
  critical: string;
  statusValid: string;
  statusExpired: string;
  statusNotYetValid: string;
  /** {n} を日数に置換する */
  daysLeft: string;
  /** {n} を日数に置換する */
  daysAgo: string;
  bits: string;
}

export interface X509DecoderPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  invalidCertificate: string;
  labels: X509Labels;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

// openssl で生成した自己署名のサンプル証明書（ECDSA P-256）
const SAMPLE_PEM = `-----BEGIN CERTIFICATE-----
MIICPDCCAeKgAwIBAgIUZCoB8yydS/zoOvpJXLPgDqsTi/kwCgYIKoZIzj0EAwIw
OjELMAkGA1UEBhMCSlAxFDASBgNVBAoMC055YW5rbyBUZXN0MRUwEwYDVQQDDAxl
eGFtcGxlLnRlc3QwHhcNMjYxMDAyMDgyMDM0WhcNMzYwOTI5MDgyMDM0WjA6MQsw
CQYDVQQGEwJKUDEUMBIGA1UECgwLTnlhbmtvIFRlc3QxFTATBgNVBAMMDGV4YW1w
bGUudGVzdDBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABK+Tu1ML8n36Uy8dj1In
v1O7VB00gY2ndhAxpMpxlGCe/C6tXiC6cw8TwXzlXjAg61ehqp3/CGwzJS4gJt+M
HfGjgcUwgcIwHQYDVR0OBBYEFJhCWqcx/NAt8KJUcZze6oiSAmi1MB8GA1UdIwQY
MBaAFJhCWqcx/NAt8KJUcZze6oiSAmi1MD0GA1UdEQQ2MDSCDGV4YW1wbGUudGVz
dIIOKi5leGFtcGxlLnRlc3SHBMCoAAGBDmFAZXhhbXBsZS50ZXN0MA4GA1UdDwEB
/wQEAwIHgDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwEgYDVR0TAQH/
BAgwBgEB/wIBAjAKBggqhkjOPQQDAgNIADBFAiBgpwNoQhijsMOcRsuusxh/LlsK
Hgbnyk18qgPA550w1QIhAObsaqPv65RNPNfLToYm70tQ2AVFOvik7yKmR1O4MXUv
-----END CERTIFICATE-----`;

export const x509DecoderContent: Record<Locale, X509DecoderPageContent> = {
  ja: {
    title: 'X.509証明書（PEM）デコーダー',
    description:
      'PEM形式のSSL/TLS証明書を貼り付けるだけで、発行者・有効期限・SAN・公開鍵・フィンガープリントなどを読み取れる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'X.509証明書（PEM）デコーダー',
    introHtml:
      'SSL/TLSサーバー証明書などのPEM（-----BEGIN CERTIFICATE-----）を貼り付けると、発行者・有効期限・SAN・公開鍵・SHA-256フィンガープリントを一覧表示します。ブラウザ内で処理され、証明書がサーバーに送信されることはありません。',
    inputLabel: '証明書（PEM）',
    inputPlaceholder:
      '-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----',
    sampleText: SAMPLE_PEM,
    invalidCertificate:
      '証明書として読み取れません。PEM形式（-----BEGIN CERTIFICATE-----）の完全な証明書を貼り付けてください。秘密鍵やCSRには対応していません。',
    labels: {
      certificate: '証明書',
      version: 'バージョン',
      serialNumber: 'シリアル番号',
      signatureAlgorithm: '署名アルゴリズム',
      issuer: '発行者',
      subject: 'サブジェクト',
      notBefore: '有効期間の開始',
      notAfter: '有効期限',
      publicKey: '公開鍵',
      fingerprints: 'フィンガープリント',
      extensions: '拡張',
      critical: 'critical',
      statusValid: '有効',
      statusExpired: '期限切れ',
      statusNotYetValid: '有効期間前',
      daysLeft: '残り{n}日',
      daysAgo: '{n}日前に失効',
      bits: 'ビット',
    },
    notesHeading: '注意事項',
    notes: [
      '証明書の署名や証明書チェーンの検証、失効確認（CRL・OCSP）は行いません。内容を読み取って表示するだけなので、信頼できる証明書かどうかの判断には使えません。',
      '有効期限の判定は、お使いの端末の現在時刻を基準にしています。',
      '複数の証明書をつなげて貼り付けた場合（サーバー証明書と中間証明書など）は、すべてを順に表示します。',
      '秘密鍵（-----BEGIN PRIVATE KEY-----）は貼り付けないでください。このツールは証明書のみを扱い、秘密鍵は読み取れません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'X.509',
        description:
          'SSL/TLSなどで使われる公開鍵証明書の標準形式です。持ち主（サブジェクト）、発行者、有効期間、公開鍵などが含まれます。',
      },
      {
        term: 'PEM',
        description:
          '証明書のバイナリ（DER）をBase64にし、「-----BEGIN CERTIFICATE-----」と「-----END CERTIFICATE-----」で挟んだテキスト形式です。',
      },
      {
        term: 'SAN（サブジェクト代替名）',
        description:
          '証明書が有効なドメイン名やIPアドレスの一覧です。現在のブラウザはCN（コモンネーム）ではなくSANを見てホスト名を検証します。',
      },
      {
        term: 'フィンガープリント',
        description:
          '証明書全体のハッシュ値です。証明書を一意に識別でき、別経路で受け取った値と照合して改ざんや取り違えを確認するのに使います。',
      },
    ],
  },
  en: {
    title: 'X.509 Certificate (PEM) Decoder',
    description:
      'Paste a PEM SSL/TLS certificate to read its issuer, expiry, SANs, public key, and fingerprints. Runs in your browser; nothing is sent to a server.',
    h1: 'X.509 Certificate (PEM) Decoder',
    introHtml:
      'Paste a PEM (-----BEGIN CERTIFICATE-----) such as an SSL/TLS server certificate to see its issuer, validity dates, SANs, public key, and SHA-256 fingerprint. Everything runs in your browser, and the certificate is never sent to a server.',
    inputLabel: 'Certificate (PEM)',
    inputPlaceholder:
      '-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----',
    sampleText: SAMPLE_PEM,
    invalidCertificate:
      'This could not be read as a certificate. Paste a complete PEM certificate (-----BEGIN CERTIFICATE-----). Private keys and CSRs are not supported.',
    labels: {
      certificate: 'Certificate',
      version: 'Version',
      serialNumber: 'Serial number',
      signatureAlgorithm: 'Signature algorithm',
      issuer: 'Issuer',
      subject: 'Subject',
      notBefore: 'Not before',
      notAfter: 'Not after',
      publicKey: 'Public key',
      fingerprints: 'Fingerprints',
      extensions: 'Extensions',
      critical: 'critical',
      statusValid: 'Valid',
      statusExpired: 'Expired',
      statusNotYetValid: 'Not yet valid',
      daysLeft: '{n} days left',
      daysAgo: 'expired {n} days ago',
      bits: 'bits',
    },
    notesHeading: 'Notes',
    notes: [
      'This tool does not verify the signature or the certificate chain, and does not check revocation (CRL/OCSP). It only reads and displays the contents, so it cannot tell you whether a certificate is trustworthy.',
      'The validity status is judged against the current time on your device.',
      'If you paste several certificates together (for example a server certificate and an intermediate), all of them are shown in order.',
      'Do not paste a private key (-----BEGIN PRIVATE KEY-----). This tool only handles certificates and cannot read private keys.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'X.509',
        description:
          'The standard format for public-key certificates used in SSL/TLS and elsewhere. It holds the owner (subject), the issuer, the validity period, the public key, and more.',
      },
      {
        term: 'PEM',
        description:
          'A text format that wraps the Base64 of the binary (DER) certificate between "-----BEGIN CERTIFICATE-----" and "-----END CERTIFICATE-----" lines.',
      },
      {
        term: 'SAN (Subject Alternative Name)',
        description:
          'The list of domain names and IP addresses a certificate is valid for. Modern browsers check the hostname against the SAN, not the CN (common name).',
      },
      {
        term: 'Fingerprint',
        description:
          'A hash of the whole certificate. It identifies a certificate uniquely and is used to compare against a value received through another channel to detect tampering or mix-ups.',
      },
    ],
  },
};
