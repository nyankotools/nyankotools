import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'SHA256とMD5のどちらのフィンガープリントを使えばよいですか？',
      answer:
        '現在のOpenSSH（6.8以降）は既定でSHA256を表示します。GitHubやサーバーの表示と比べるときは「SHA256:」で始まる値を使ってください。MD5（aa:bb:cc...形式）は古い機器やドキュメントとの照合用です。',
    },
    {
      question: 'ssh-keygen -l の結果と一致しないのはなぜですか？',
      answer:
        '貼り付けた公開鍵が別の鍵である可能性が高いです。鍵本体のBase64部分が1文字でも違うと値が変わります。コメント部分（末尾のuser@hostなど）はフィンガープリントに影響しません。',
    },
    {
      question: '秘密鍵からフィンガープリントを求められますか？',
      answer:
        'いいえ。このツールは公開鍵のみを扱い、秘密鍵には対応していません。秘密鍵を貼り付けないでください。公開鍵は「ssh-keygen -y -f 秘密鍵ファイル」で取り出せます。',
    },
    {
      question: 'known_hostsの1行も読み取れますか？',
      answer:
        'はい。行頭のホスト名（またはハッシュ化されたホスト）や、authorized_keysの先頭にあるオプション（command="..." など）は、鍵の種類（ssh-ed25519 など）が現れるまで読み飛ばします。',
    },
  ],
  en: [
    {
      question: 'Should I use the SHA256 or the MD5 fingerprint?',
      answer:
        'OpenSSH 6.8 and later show SHA256 by default. When comparing with what GitHub or a server displays, use the value that starts with "SHA256:". MD5 (the aa:bb:cc... form) is for older devices and documentation.',
    },
    {
      question: 'Why does the result differ from ssh-keygen -l?',
      answer:
        'You have most likely pasted a different key. Even one character of difference in the Base64 key data changes the value. The comment at the end (such as user@host) does not affect the fingerprint.',
    },
    {
      question: 'Can I get a fingerprint from a private key?',
      answer:
        'No. This tool only handles public keys and does not support private keys, so please do not paste one. You can extract the public key with "ssh-keygen -y -f <private key file>".',
    },
    {
      question: 'Can it read a known_hosts line?',
      answer:
        'Yes. Everything before the key type (ssh-ed25519 and so on) is skipped: the host name (or hashed host) at the start of a known_hosts line, or options such as command="..." at the start of an authorized_keys line.',
    },
  ],
};
