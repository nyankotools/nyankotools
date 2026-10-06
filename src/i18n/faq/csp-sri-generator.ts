import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'SRIはsha256・sha384・sha512のどれを選べばよいですか？',
      answer:
        'どれもブラウザが対応しています。MDNなどでは sha384 が一般的に使われており、迷ったら sha384 で問題ありません。複数選ぶと integrity 属性に空白区切りで並び、ブラウザは最も強い方式で検証します。',
    },
    {
      question: 'SRIを付けたのにスクリプトが読み込まれません。',
      answer:
        'ファイルの内容がハッシュ計算時と1バイトでも違うか、別オリジンのファイルでCORSが許可されていない可能性があります。CDNがファイルを更新していないか、crossorigin="anonymous" が付いているか、配信元が Access-Control-Allow-Origin を返しているかを確認してください。',
    },
    {
      question: 'CSPを設定したらサイトの一部が動かなくなりました。',
      answer:
        'インラインスクリプトや外部の解析・広告・埋め込みタグが、許可していない送信元からの読み込みとしてブロックされている可能性があります。まず「Report-Onlyにする」で配信し、ブラウザの開発者ツールのコンソールに出る違反メッセージを見て、必要な送信元だけを追加してください。',
    },
    {
      question: 'metaタグとHTTPヘッダーのどちらで設定すべきですか？',
      answer:
        'HTTPヘッダーを推奨します。metaタグでは frame-ancestors などが無効で、Report-Onlyも使えず、タグより前に読み込まれたリソースには効きません。サーバー設定を変えられない静的ホスティングでは、metaタグが次善策になります。',
    },
    {
      question: 'CDNのURLを入れるだけでハッシュを計算できますか？',
      answer:
        'できません。このツールはデータを外部に送らずブラウザ内で処理するため、URLからは取得しません。CDNのファイルをダウンロードして選択するか、中身を貼り付けてください。',
    },
  ],
  en: [
    {
      question: 'Which should I choose: sha256, sha384 or sha512?',
      answer:
        'All three are supported by browsers. sha384 is the most commonly used choice, so pick it if unsure. If you select several, they are listed space-separated in the integrity attribute and the browser verifies with the strongest one.',
    },
    {
      question: 'I added SRI and now the script does not load.',
      answer:
        'Either the file differs from the one you hashed by even one byte, or a cross-origin file is not served with CORS. Check that the CDN has not updated the file, that crossorigin="anonymous" is present, and that the host returns Access-Control-Allow-Origin.',
    },
    {
      question: 'Parts of my site broke after I set a CSP.',
      answer:
        'Inline scripts and external analytics, ad or embed tags are probably being blocked as loads from sources you did not allow. Deploy with "Report-Only (report violations without blocking)" first, read the violation messages in the browser developer console, and add only the sources you actually need.',
    },
    {
      question: 'Should I use a meta tag or an HTTP header?',
      answer:
        'An HTTP header is recommended. A meta tag ignores frame-ancestors, cannot be Report-Only, and does not affect resources loaded before the tag. On static hosting where you cannot change server config, the meta tag is the next best option.',
    },
    {
      question: 'Can I just enter a CDN URL to get its hash?',
      answer:
        'No. This tool processes data in your browser and never sends it anywhere, so it does not fetch URLs. Download the CDN file and select it, or paste its contents.',
    },
  ],
};
