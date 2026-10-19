import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'bcryptとSHA-1はどちらを選べばよいですか？',
      answer:
        '基本的にはbcryptを選んでください。bcryptはソルトを含み、意図的に計算が遅いため総当たりに強い方式です。SHA-1（{SHA}形式）はソルトがなく高速に計算できるため、bcryptに対応していない古い環境でだけ使います。',
    },
    {
      question: '生成した .htpasswd はどこに置けばよいですか？',
      answer:
        'Webから直接ダウンロードできない、公開ディレクトリの外に置くのが安全です。そのうえで .htaccess に AuthType Basic、AuthName、AuthUserFile（.htpasswd の絶対パス）、Require valid-user を書きます。設定の雛形は .htaccess生成ツールでも作れます。',
    },
    {
      question: 'ユーザー名やパスワードにコロン（:）は使えますか？',
      answer:
        'ユーザー名には使えません。Basic認証が「ユーザー名:パスワード」の最初のコロンで区切るためです。パスワードには含められます。このツールも最初のコロンでユーザー名とパスワードを分けます。',
    },
    {
      question: '同じパスワードでも毎回違うハッシュになるのはなぜですか？',
      answer:
        'bcryptは生成のたびにランダムなソルトを加えるためで、正常な動作です。どのハッシュでもApacheは同じパスワードで認証できます。SHA-1はソルトがないので、同じパスワードなら同じ結果になります。',
    },
  ],
  en: [
    {
      question: 'Should I choose bcrypt or SHA-1?',
      answer:
        'Choose bcrypt in almost every case. It includes a salt and is deliberately slow, so it resists brute force. SHA-1 (the {SHA} format) has no salt and is fast to compute, so keep it for old environments that cannot read bcrypt.',
    },
    {
      question: 'Where should I put the generated .htpasswd file?',
      answer:
        'Keep it outside the public web root so it cannot be downloaded over HTTP. Then add AuthType Basic, AuthName, AuthUserFile (the absolute path to the .htpasswd) and Require valid-user to your .htaccess. The .htaccess Generator can help with a template.',
    },
    {
      question: 'Can usernames or passwords contain a colon?',
      answer:
        'Usernames cannot, because Basic auth splits "username:password" at the first colon. Passwords can. This tool also splits each line at the first colon.',
    },
    {
      question: 'Why does the same password give a different hash each time?',
      answer:
        'bcrypt adds a fresh random salt on every run, which is normal. Apache can still verify the password against any of those hashes. SHA-1 has no salt, so the same password always gives the same result.',
    },
  ],
};
