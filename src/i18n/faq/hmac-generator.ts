import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'Webhookの署名が一致しないのはなぜですか？',
      answer:
        '最も多い原因は、メッセージが受信した生のボディと1バイトでも違うことです。JSONの整形や改行コードの変換、末尾の改行の有無で結果が変わります。また、鍵が16進数かテキストか、署名がBase64か16進数かの取り違えにも注意してください。',
    },
    {
      question: '鍵が空でも計算できますか？',
      answer:
        'はい。HMACの仕様上、空の鍵はブロック長ぶんのゼロで埋めた鍵と同じ扱いになるため、空のままでも計算できます。ただし実運用で空の鍵を使うべきではありません。',
    },
    {
      question: 'HMACとハッシュ（SHA-256）の違いは何ですか？',
      answer:
        'ハッシュは誰でも同じ値を計算できますが、HMACは秘密鍵を知っている人だけが正しい署名を作れます。そのため、改ざん検知だけでなく送信元の確認にも使えます。',
    },
    {
      question: 'MD5のHMACには対応していますか？',
      answer:
        'いいえ。ブラウザ標準の暗号機能（Web Crypto API）が対応するSHA-1・SHA-256・SHA-384・SHA-512のみ選べます。',
    },
  ],
  en: [
    {
      question: 'Why does my webhook signature not match?',
      answer:
        'The most common cause is a message that differs by even one byte from the raw body you received. Re-formatting JSON, converting line endings, or adding a trailing newline changes the result. Also check whether the key is hex or text, and whether the signature is Base64 or hex.',
    },
    {
      question: 'Can I compute an HMAC with an empty key?',
      answer:
        'Yes. In the HMAC definition an empty key is treated the same as a key padded with zeros to the block size, so it works. You should not use an empty key in practice, though.',
    },
    {
      question: 'How is HMAC different from a plain hash like SHA-256?',
      answer:
        'Anyone can compute a plain hash, but only someone who knows the secret key can produce a valid HMAC. That makes it useful for confirming the sender as well as detecting tampering.',
    },
    {
      question: 'Is HMAC-MD5 supported?',
      answer:
        'No. Only SHA-1, SHA-256, SHA-384, and SHA-512 are available, which are the algorithms the browser Web Crypto API supports.',
    },
  ],
};
