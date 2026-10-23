import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '生成されたプライバシーポリシーをそのまま公開してよいですか？',
      answer:
        'このツールは法的助言ではなく、一般的な雛形を出力します。公開前に、実際のサイトで取得している情報や使っているサービスと文面が一致しているか必ず確認してください。事業の内容によっては弁護士などの専門家に相談することをおすすめします。',
    },
    {
      question:
        'Googleアナリティクスだけ使っている場合はどこにチェックしますか？',
      answer:
        '「アクセス解析（Googleアナリティクス）」にチェックします。Cookieによる匿名のトラフィックデータ収集と、Cookieの無効化やオプトアウト アドオンによる拒否の方法が記載され、Cookieの説明も自動的に加わります。',
    },
    {
      question: 'Google AdSenseを使うときに記載が必要な内容は何ですか？',
      answer:
        '第三者配信事業者がCookieを使って広告を配信すること、Googleの広告設定やaboutads.infoでパーソナライズ広告を無効にできることなどを記載する必要があります。「広告配信（Google AdSense）」にチェックすると、これらを含む定型文が入ります。最新の要件はGoogleの公式案内でご確認ください。',
    },
    {
      question: 'EUやアメリカの訪問者にも対応できますか？',
      answer:
        'いいえ。この文面は日本の個人情報保護法をベースにしたもので、GDPR（EU/EEA・英国）やカリフォルニア州法などの要件は含みません。海外の訪問者を主な対象とする場合は、各地域の要件に合わせた内容と同意取得の仕組みを別途ご検討ください。',
    },
    {
      question: '制定日と最終改定日はどう使い分けますか？',
      answer:
        '制定日は初めてポリシーを公開した日、最終改定日は内容を変更した日です。広告やアクセス解析を追加したときなど、実態が変わったらポリシーも更新し、最終改定日を記載してください。',
    },
  ],
  en: [
    {
      question: 'Can I publish the generated privacy policy as it is?',
      answer:
        'This tool outputs a general template, not legal advice. Before you publish, check that the text matches the information your site really collects and the services it really uses. Depending on your business, consider consulting a lawyer or other professional.',
    },
    {
      question: 'What do I tick if I only use Google Analytics?',
      answer:
        'Tick "Analytics (Google Analytics)". The policy then explains anonymous traffic data collected through cookies and how to refuse it by disabling cookies or using the opt-out add-on, and a cookie section is added automatically.',
    },
    {
      question: 'What does a policy need to say when I use Google AdSense?',
      answer:
        'It should say that third-party vendors serve ads using cookies and that users can turn off personalized ads in Google Ads Settings or at aboutads.info. Ticking "Ads (Google AdSense)" adds standard wording covering these points. Check Google\'s official guidance for the latest requirements.',
    },
    {
      question: 'Does it cover the GDPR or US state laws?',
      answer:
        "No. The text is based on Japan's Act on the Protection of Personal Information, so it does not include GDPR (EU/EEA, UK) or California requirements. If your visitors are mainly overseas, you will need wording and a consent mechanism that fit those regions.",
    },
    {
      question: 'What is the difference between enacted and revised dates?',
      answer:
        'The enacted date is when you first published the policy, and the last revised date is when you last changed it. Whenever your practices change, for example when you add ads or analytics, update the policy and record the revision date.',
    },
  ],
};
