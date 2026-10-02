import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '同じパスワードなのにハッシュが毎回違うのはなぜですか？',
      answer:
        'bcryptは生成のたびにランダムなソルトを加えるためです。これは正常な動作で、ハッシュ同士を比べても一致は分かりません。保存済みのハッシュとの一致は、このツールの「ハッシュを照合」（内部でソルトを取り出して再計算）で確認してください。',
    },
    {
      question: 'コストはいくつにすればよいですか？',
      answer:
        '値が1増えるごとに計算時間が約2倍になります。ログイン処理が重くなりすぎず、総当たりには十分遅い値として、現在は10〜12程度がよく使われます。サーバーの性能に合わせて、1回あたり100〜500ミリ秒程度になる値を目安に選んでください。このツールではブラウザで動かすため4〜14に制限しています。',
    },
    {
      question:
        '長いパスワードや日本語のパスワードで注意することはありますか？',
      answer:
        'bcryptは先頭72バイトまでしか使いません。日本語は1文字3バイト、絵文字は4バイトなので、日本語だけなら24文字を超えた部分は無視されます。このツールは72バイトを超える入力をエラーにします。長いパスワードを扱う場合は、先にSHA-256などでハッシュ化してから渡す方法がありますが、実装を揃える必要があります。',
    },
    {
      question: '$2a$・$2b$・$2y$の違いは何ですか？',
      answer:
        '実装上のバージョン表記の違いで、現在の仕様では同じ計算結果になります。このツールは$2a$・$2b$・$2y$のハッシュを照合でき、生成時は$2b$形式のハッシュを出力します。',
    },
  ],
  en: [
    {
      question: 'Why is the hash different every time for the same password?',
      answer:
        'bcrypt mixes in a fresh random salt each time. That is normal, and comparing two hashes directly will not tell you whether they match. Use "Verify a hash" on this page, which extracts the salt from the stored hash and recomputes it.',
    },
    {
      question: 'What cost factor should I use?',
      answer:
        'Each +1 roughly doubles the computation time. A cost of about 10-12 is common today: slow enough to hinder brute force without making logins sluggish. Pick a value that takes roughly 100-500 ms per hash on your server. This tool limits the range to 4-14 because it runs in the browser.',
    },
    {
      question:
        'Is there anything to watch out for with long or non-ASCII passwords?',
      answer:
        'bcrypt only uses the first 72 bytes. Many non-ASCII characters take 2-4 bytes each (3 for most CJK characters, 4 for emoji), so a long password can be cut off earlier than you expect. This tool rejects input over 72 bytes. Some systems pre-hash long passwords with SHA-256 first, but both sides must do the same.',
    },
    {
      question: 'What is the difference between $2a$, $2b$ and $2y$?',
      answer:
        'They are version labels from different implementations and give the same result in current implementations. This tool can verify $2a$, $2b$ and $2y$ hashes, and generates hashes in the $2b$ form.',
    },
  ],
};
