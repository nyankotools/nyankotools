import type { Locale } from '../../data/tools';
import type { PolicyIssueCode } from '../../lib/tools/privacy-policy-generator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface PrivacyPolicyGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  disclaimer: string;
  howToHeading: string;
  howToSteps: string[];
  basicHeading: string;
  siteNameLabel: string;
  siteNamePlaceholder: string;
  operatorLabel: string;
  operatorPlaceholder: string;
  contactLabel: string;
  contactPlaceholder: string;
  enactedLabel: string;
  revisedLabel: string;
  featuresHeading: string;
  featuresHint: string;
  contactFormLabel: string;
  cookiesLabel: string;
  analyticsLabel: string;
  adsenseLabel: string;
  otherAdsLabel: string;
  affiliateLabel: string;
  amazonLabel: string;
  issuesHeading: string;
  issueMessages: Record<PolicyIssueCode, string>;
  outputHeading: string;
  copyButton: string;
  downloadButton: string;
  copied: string;
  copyFailed: string;
  downloaded: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const privacyPolicyGeneratorContent: Record<
  Locale,
  PrivacyPolicyGeneratorPageContent
> = {
  ja: {
    title:
      'プライバシーポリシー作成ツール（Googleアナリティクス・AdSense対応）',
    description:
      'サイト名・運営者名・連絡先を入力し、アクセス解析・広告・Cookie・アフィリエイトなどにチェックするだけでプライバシーポリシーの雛形を作成。Googleアナリティクス・AdSenseの定型文つき。法的助言ではありません。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'プライバシーポリシー雛形生成',
    introHtml:
      '個人情報保護法に沿った日本のサイト向けのプライバシーポリシーを、チェックボックスで選ぶだけで作成します。Googleアナリティクス（Cookieによる匿名のトラフィックデータ収集とオプトアウト方法）や Google AdSense（第三者配信事業者のCookieとパーソナライズ広告の無効化）などの定型文にも対応しています。特定商取引法に基づく表記が必要な場合は <a href="/tools/tokushoho-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">特定商取引法に基づく表記生成</a> もご利用ください。',
    disclaimer:
      'このツールが出力するのは一般的な雛形であり、法的助言ではありません。公開前に、実際のサイトの運用内容と一致しているか必ずご自身で確認し、必要に応じて弁護士などの専門家にご相談ください。',
    howToHeading: '使い方',
    howToSteps: [
      '「サイト名」「運営者名」「連絡先」「制定日」を入力します。',
      '「利用している機能」から、自分のサイトで実際に使っているものにチェックを入れます。',
      '「確認事項」の指摘を直し、生成された文面を読んで内容がサイトの実態と合っているか確認します。',
      '「コピー」または「ダウンロード」で出力し、サイトの固定ページに掲載します。',
    ],
    basicHeading: '基本情報',
    siteNameLabel: 'サイト名',
    siteNamePlaceholder: '例: サンプルブログ',
    operatorLabel: '運営者名',
    operatorPlaceholder: '例: 山田太郎（個人）／株式会社サンプル',
    contactLabel: '連絡先',
    contactPlaceholder: '例: info@example.com またはお問い合わせページのURL',
    enactedLabel: '制定日',
    revisedLabel: '最終改定日（任意）',
    featuresHeading: '利用している機能',
    featuresHint: '実際にサイトで使っているものだけにチェックしてください。',
    contactFormLabel: 'お問い合わせフォームを設置している',
    cookiesLabel: 'Cookieを利用している',
    analyticsLabel: 'アクセス解析（Googleアナリティクス）',
    adsenseLabel: '広告配信（Google AdSense）',
    otherAdsLabel: 'その他の第三者配信広告',
    affiliateLabel: 'アフィリエイトプログラム',
    amazonLabel: 'Amazonアソシエイト',
    issuesHeading: '確認事項',
    issueMessages: {
      noSiteName:
        'サイト名が未入力です。出力には【サイト名】と入ります。公開前に置き換えてください。',
      noOperator:
        '運営者名が未入力です。出力には【運営者名】と入ります。公開前に置き換えてください。',
      noContact:
        '連絡先が未入力です。出力には【連絡先】と入ります。開示請求などの受付先として必要です。',
      invalidEnactedDate:
        '制定日を入力してください。入力すると出力に制定日が入ります。',
      invalidRevisedDate: '最終改定日が正しい日付ではありません。',
      revisedBeforeEnacted: '最終改定日が制定日より前になっています。',
    },
    outputHeading: '生成されたプライバシーポリシー',
    copyButton: 'コピー',
    downloadButton: 'ダウンロード',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    downloaded: 'privacy-policy.txt をダウンロードしました',
    notesHeading: '注意事項',
    notes: [
      'このツールは法的助言を行うものではありません。出力は一般的な雛形で、すべてのサイトに適合することは保証されません。公開前に内容を必ず確認してください。',
      '日本のサイト向け（個人情報保護法ベース）の文面です。EU/EEA・英国の訪問者を対象とする場合のGDPRや、カリフォルニア州などの法令への対応は含まれていません。',
      'チェックを入れていない機能の説明は出力されません。後から機能を追加したときは、ポリシーも更新して改定日を記載してください。',
      'Googleアナリティクス・AdSenseの定型文は、Googleが案内している説明に基づいた一般的な表現です。URLやポリシーの内容は変更されることがあるため、最新の公式情報を確認してください。',
      'Googleアナリティクスや広告を使う場合の同意取得（Cookieバナーなど）が必要かどうかは、対象地域や運用により異なります。このツールはバナーを作成しません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'プライバシーポリシー',
        description:
          'サイトが取得する個人情報や閲覧データの種類、利用目的、管理方法を説明する文書。個人情報を取り扱う事業者には利用目的の公表などが求められる。',
      },
      {
        term: 'Cookie（クッキー）',
        description:
          'ウェブサイトがブラウザに保存する小さなデータ。アクセス解析や広告の配信で、訪問の履歴を識別するために使われる。',
      },
      {
        term: 'オプトアウト',
        description:
          'データの収集や広告のパーソナライズを、利用者が自分の意思で拒否する仕組み。',
      },
    ],
  },
  en: {
    title: 'Privacy Policy Generator for Japan (GA & AdSense)',
    description:
      'Generate a privacy policy template with Google Analytics, AdSense, cookie and affiliate clauses, based on Japanese law. Not legal advice. Runs in your browser.',
    h1: 'Privacy Policy Template Generator',
    introHtml:
      'Pick the features your site uses and get a privacy policy template based on Japan\'s Act on the Protection of Personal Information (APPI). It includes standard wording for Google Analytics (anonymous traffic data via cookies, and how to opt out) and Google AdSense (third-party vendor cookies and turning off personalized ads). The text is an English version of a template written for Japanese sites, so it is not tuned for the GDPR or US state laws. If you also sell goods or services in Japan, try the <a href="/en/tools/tokushoho-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Specified Commercial Transactions Act Notice Generator</a>.',
    disclaimer:
      'This tool produces a general template, not legal advice. Before publishing, check that it matches how your site actually works, and consult a lawyer or other professional if needed.',
    howToHeading: 'How to use',
    howToSteps: [
      'Enter the "Site name", "Operator name", "Contact", and "Enacted date".',
      'Under "Features your site uses", tick only what your site really uses.',
      'Fix anything listed under "Checks", then read the generated text and make sure it matches your site.',
      'Use "Copy" or "Download" and publish it on a fixed page of your site.',
    ],
    basicHeading: 'Basic information',
    siteNameLabel: 'Site name',
    siteNamePlaceholder: 'e.g. Sample Blog',
    operatorLabel: 'Operator name',
    operatorPlaceholder: 'e.g. Taro Yamada (individual) / Sample Inc.',
    contactLabel: 'Contact',
    contactPlaceholder: 'e.g. info@example.com or your contact page URL',
    enactedLabel: 'Enacted date',
    revisedLabel: 'Last revised date (optional)',
    featuresHeading: 'Features your site uses',
    featuresHint: 'Tick only what your site actually uses.',
    contactFormLabel: 'Contact form',
    cookiesLabel: 'Cookies',
    analyticsLabel: 'Analytics (Google Analytics)',
    adsenseLabel: 'Ads (Google AdSense)',
    otherAdsLabel: 'Other third-party ads',
    affiliateLabel: 'Affiliate programs',
    amazonLabel: 'Amazon Associates',
    issuesHeading: 'Checks',
    issueMessages: {
      noSiteName:
        'Site name is empty. The output will show [Site name]; replace it before publishing.',
      noOperator:
        'Operator name is empty. The output will show [Operator name]; replace it before publishing.',
      noContact:
        'Contact is empty. The output will show [Contact]. Visitors need it to send access or deletion requests.',
      invalidEnactedDate: 'Enter the enacted date to include it in the output.',
      invalidRevisedDate: 'The last revised date is not a valid date.',
      revisedBeforeEnacted:
        'The last revised date is earlier than the enacted date.',
    },
    outputHeading: 'Generated privacy policy',
    copyButton: 'Copy',
    downloadButton: 'Download',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    downloaded: 'Downloaded privacy-policy.txt',
    notesHeading: 'Notes',
    notes: [
      'This tool does not give legal advice. The output is a general template and is not guaranteed to fit every site. Review it before you publish.',
      'The text is an English version of a template written for Japanese sites (based on the APPI). It does not cover the GDPR for EU/EEA or UK visitors, or laws such as those of California.',
      'Sections for features you did not tick are left out. If you add a feature later, update the policy and note the revision date.',
      'The Google Analytics and AdSense wording follows the general explanations Google provides. URLs and policies change, so check the latest official information.',
      'Whether you need consent (such as a cookie banner) for analytics or ads depends on your audience and setup. This tool does not create a banner.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Privacy policy',
        description:
          'A document explaining what personal information and visit data a site collects, why, and how it is handled.',
      },
      {
        term: 'Cookie',
        description:
          'A small piece of data a website stores in your browser. Analytics and ad services use it to recognize repeat visits.',
      },
      {
        term: 'Opt-out',
        description:
          'A way for users to decline data collection or ad personalization.',
      },
    ],
  },
};
