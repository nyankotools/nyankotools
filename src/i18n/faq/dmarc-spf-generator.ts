import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'SPFのDNSルックアップ10回上限とは何ですか？',
      answer:
        'SPFの評価では、include・a・mx・ptr・exists・redirect を処理するたびにDNS問い合わせが発生し、合計10回を超えると受信側が permerror としてSPFを無効扱いにします。ip4・ip6・all は数えません。include 先のレコードの中でさらに使われる分も合算されるため、このツールの表示（貼り付けたレコード内だけの概算）より実際の回数は多くなることがあります。',
    },
    {
      question: 'SPFレコードを2つ登録してもよいですか？',
      answer:
        'いけません。1つのドメインに v=spf1 で始まるTXTレコードが複数あると permerror になります。送信サービスが増えたときは、レコードを増やさず、1つのレコードに include や ip4 を追記して統合してください。',
    },
    {
      question: '-all と ~all のどちらを選べばよいですか？',
      answer:
        '-all は許可していない送信元を失敗（fail）、~all は soft fail として扱います。送信元を網羅できていないうちは ~all で運用して様子を見て、すべての正規の送信元を登録できたら -all にするのが一般的です。DMARC を併用している場合、どちらでも SPF の失敗として DMARC に伝わります。+all は誰でも送信できる設定になるので使わないでください。',
    },
    {
      question: 'DMARCはいきなり p=reject にしてよいですか？',
      answer:
        '推奨しません。SPF や DKIM を設定していない正規の送信元（請求書システムやメール配信サービスなど）のメールまで拒否される恐れがあります。まず p=none と rua で集計レポートを集め、正規の送信元がすべて認証に通ることを確認してから、pct を使って quarantine、reject へ段階的に強めてください。',
    },
    {
      question: 'レコードが255文字を超えるとどうなりますか？',
      answer:
        'DNSのTXTレコードは1つの文字列が255文字までで、長い値は複数の文字列に分けて登録します。多くのDNS管理画面は自動で分割しますが、対応していない場合は、このツールの「255文字ごとに分割した表記」を使ってください。また、DNS応答全体が約450バイトを超えるとTCPでの取得が必要になり、失敗する受信側もあるため、SPFでは include や IP を整理するのが安全です。',
    },
  ],
  en: [
    {
      question: 'What is the 10 DNS lookup limit in SPF?',
      answer:
        'While evaluating SPF, every include, a, mx, ptr, exists, and redirect triggers a DNS query. If the total goes past 10, receivers return a permerror and ignore your SPF. ip4, ip6, and all are free. Lookups made inside included records count too, so the real total can be higher than the estimate here, which only counts the pasted record.',
    },
    {
      question: 'Can I publish two SPF records?',
      answer:
        'No. More than one TXT record starting with v=spf1 on the same domain causes a permerror. When you add a new sending service, merge it into the existing record with another include or ip4 instead of creating a second record.',
    },
    {
      question: 'Should I use -all or ~all?',
      answer:
        '-all marks unlisted senders as fail and ~all as soft fail. A common path is to start with ~all while you are still finding every legitimate sender, then switch to -all once they are all listed. With DMARC in place, both are reported to DMARC as an SPF failure. Never use +all, which lets anyone send as your domain.',
    },
    {
      question: 'Is it safe to start DMARC with p=reject?',
      answer:
        'Not recommended. Legitimate senders that lack SPF or DKIM setup, such as an invoicing system or a newsletter service, could have their mail rejected. Start with p=none and rua to collect aggregate reports, confirm every legitimate sender authenticates, then tighten to quarantine and reject, using pct to ramp up gradually.',
    },
    {
      question: 'What happens when the record is longer than 255 characters?',
      answer:
        'A single TXT string holds at most 255 characters, so longer values are stored as several strings. Most DNS panels split them automatically; if yours does not, use the 255-character split shown by this tool. A whole DNS response above about 450 bytes may need TCP, which some receivers fail on, so for SPF it is safer to trim includes and IP lists.',
    },
  ],
};
