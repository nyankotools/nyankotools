export type PolicyLocale = 'ja' | 'en';

export interface PolicyInput {
  siteName: string;
  operator: string;
  contact: string;
  /** 制定日 YYYY-MM-DD */
  enactedDate: string;
  /** 最終改定日 YYYY-MM-DD（任意） */
  revisedDate: string;
  /** お問い合わせフォームを設置している */
  contactForm: boolean;
  /** Cookie を利用している（アクセス解析・広告を選ぶと自動的に記載される） */
  cookies: boolean;
  /** Google アナリティクス */
  analytics: boolean;
  /** Google AdSense */
  adsense: boolean;
  /** その他の第三者配信広告 */
  otherAds: boolean;
  /** アフィリエイトプログラム */
  affiliate: boolean;
  /** Amazonアソシエイト */
  amazon: boolean;
}

export type PolicyIssueCode =
  | 'noSiteName'
  | 'noOperator'
  | 'noContact'
  | 'invalidEnactedDate'
  | 'invalidRevisedDate'
  | 'revisedBeforeEnacted';

export function emptyPolicyInput(): PolicyInput {
  return {
    siteName: '',
    operator: '',
    contact: '',
    enactedDate: '',
    revisedDate: '',
    contactForm: false,
    cookies: false,
    analytics: false,
    adsense: false,
    otherAds: false,
    affiliate: false,
    amazon: false,
  };
}

/** YYYY-MM-DD を厳密に解釈する。不正なら null */
export function parseDate(
  value: string,
): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== m - 1 ||
    date.getUTCDate() !== d
  ) {
    return null;
  }
  return { y, m, d };
}

const EN_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function formatDate(value: string, locale: PolicyLocale): string {
  const p = parseDate(value);
  if (!p) return '';
  return locale === 'ja'
    ? `${p.y}年${p.m}月${p.d}日`
    : `${EN_MONTHS[p.m - 1]} ${p.d}, ${p.y}`;
}

export function validatePolicy(input: PolicyInput): PolicyIssueCode[] {
  const issues: PolicyIssueCode[] = [];
  if (!input.siteName.trim()) issues.push('noSiteName');
  if (!input.operator.trim()) issues.push('noOperator');
  if (!input.contact.trim()) issues.push('noContact');
  const enacted = input.enactedDate.trim();
  const revised = input.revisedDate.trim();
  if (!enacted || !parseDate(enacted)) issues.push('invalidEnactedDate');
  if (revised) {
    if (!parseDate(revised)) issues.push('invalidRevisedDate');
    else if (parseDate(enacted) && revised < enacted)
      issues.push('revisedBeforeEnacted');
  }
  return issues;
}

interface Texts {
  placeholders: { site: string; operator: string; contact: string };
  intro: (site: string, operator: string) => string;
  heading: (n: number, title: string) => string;
  contactTitle: string;
  collectTitle: string;
  collectForm: string;
  collectNone: string;
  thirdPartyTitle: string;
  thirdParty: string;
  disclosureTitle: string;
  disclosure: (contact: string) => string;
  cookieTitle: string;
  cookie: string;
  analyticsTitle: string;
  analytics: string[];
  adsenseTitle: string;
  adsense: string[];
  otherAdsTitle: string;
  otherAds: string[];
  affiliateTitle: string;
  affiliate: string;
  amazon: string;
  changeTitle: string;
  change: string;
  contactBody: (contact: string) => string;
  enacted: (date: string) => string;
  revised: (date: string) => string;
  operatorLine: (operator: string) => string;
}

const TEXTS: Record<PolicyLocale, Texts> = {
  ja: {
    placeholders: {
      site: '【サイト名】',
      operator: '【運営者名】',
      contact: '【連絡先】',
    },
    intro: (site, operator) =>
      `「${site}」（以下「当サイト」）は、${operator}（以下「運営者」）が運営しています。運営者は、個人情報の保護に関する法律（個人情報保護法）その他の関係法令を遵守し、以下のとおりプライバシーポリシーを定めます。`,
    heading: (n, title) => `${n}. ${title}`,
    contactTitle: 'お問い合わせ先',
    collectTitle: '個人情報の取得と利用目的',
    collectForm:
      '当サイトのお問い合わせフォームでは、お名前（ハンドルネームを含む）、メールアドレス、お問い合わせ内容をご入力いただきます。これらの情報は、お問い合わせへの回答や必要な連絡の目的にのみ利用し、その他の目的には利用しません。',
    collectNone:
      '当サイトは、閲覧者の氏名・住所・メールアドレスなどの個人情報を、閲覧者から直接取得することはありません。',
    thirdPartyTitle: '個人情報の第三者提供',
    thirdParty:
      '運営者は、法令に基づく場合を除き、あらかじめ本人の同意を得ることなく、取得した個人情報を第三者に提供しません。',
    disclosureTitle: '個人情報の開示・訂正・削除',
    disclosure: (contact) =>
      `ご本人から個人情報の開示、訂正、利用停止、削除などのご請求があった場合は、本人確認を行ったうえで、法令に従い合理的な範囲で対応します。ご請求は下記のお問い合わせ先（${contact}）までご連絡ください。`,
    cookieTitle: 'Cookie（クッキー）について',
    cookie:
      '当サイトでは、利便性の向上や後述のサービスの提供のためにCookieを使用することがあります。Cookieとは、ウェブサイトがお使いのブラウザに保存する小さなデータで、それ自体で個人を特定するものではありません。ブラウザの設定によりCookieの受け取りを拒否・削除できますが、その場合、一部の機能が利用できなくなることがあります。',
    analyticsTitle: 'アクセス解析ツールについて',
    analytics: [
      '当サイトでは、Googleによるアクセス解析ツール「Google アナリティクス」を利用しています。Google アナリティクスはCookieを使用して、トラフィックデータを収集します。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。',
      'この機能はCookieを無効にすることで収集を拒否できますので、ブラウザの設定をご確認ください。また、Googleが提供する「Google アナリティクス オプトアウト アドオン」（https://tools.google.com/dlpage/gaoptout?hl=ja）を利用して、収集を無効にすることもできます。',
      'Google アナリティクスの利用規約およびGoogleによるデータの取り扱いについては、Google アナリティクス利用規約（https://marketingplatform.google.com/about/analytics/terms/jp/）および Googleポリシーと規約（https://policies.google.com/technologies/partner-sites?hl=ja）をご確認ください。',
    ],
    adsenseTitle: '広告の配信について（Google AdSense）',
    adsense: [
      '当サイトでは、第三者配信の広告サービス「Google AdSense」を利用しています。',
      'Googleなどの第三者配信事業者は、Cookieを使用して、ユーザーが当サイトや他のサイトに過去にアクセスした際の情報に基づいて広告を配信します。',
      'Googleが広告Cookieを使用することにより、ユーザーが当サイトや他のサイトにアクセスした際の情報に基づいて、Googleやそのパートナーが適切な広告をユーザーに表示できます。',
      'ユーザーは、Googleの広告設定（https://adssettings.google.com/）でパーソナライズ広告を無効にできます。また、www.aboutads.info（https://www.aboutads.info/）にアクセスすれば、第三者配信事業者によるパーソナライズ広告のためのCookieの使用を無効にできます。',
      'Googleによる広告Cookieの取り扱いの詳細は、Googleのポリシーと規約（https://policies.google.com/technologies/ads?hl=ja）をご確認ください。',
    ],
    otherAdsTitle: '第三者配信の広告について',
    otherAds: [
      '当サイトは、第三者配信の広告サービスを利用することがあります。広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookieなどを使用して、当サイトや他のサイトへのアクセスに関する情報（氏名、住所、メールアドレス、電話番号は含まれません）を利用することがあります。',
      'こうした広告配信事業者によるCookieの利用は、各事業者が提供するオプトアウトの手段やブラウザの設定により拒否できます。',
    ],
    affiliateTitle: 'アフィリエイトプログラムについて',
    affiliate:
      '当サイトは、アフィリエイトプログラムに参加しており、商品やサービスを紹介するリンクを掲載することがあります。リンク経由で購入・申込みがあった場合、運営者が紹介料を受け取ることがあります。リンクのクリックの確認のため、広告主やアフィリエイトサービス提供事業者がCookieを使用することがあります。',
    amazon:
      '当サイトは、Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者です。',
    changeTitle: 'プライバシーポリシーの変更',
    change:
      '運営者は、法令の変更やサイト運営の状況に応じて、本プライバシーポリシーの内容を予告なく変更することがあります。変更後のプライバシーポリシーは、当ページに掲載した時点から効力を生じます。',
    contactBody: (contact) => `${contact}`,
    enacted: (date) => `制定日: ${date}`,
    revised: (date) => `最終改定日: ${date}`,
    operatorLine: (operator) => `運営者: ${operator}`,
  },
  en: {
    placeholders: {
      site: '[Site name]',
      operator: '[Operator name]',
      contact: '[Contact]',
    },
    intro: (site, operator) =>
      `"${site}" (the "Site") is operated by ${operator} (the "Operator"). The Operator complies with Japan's Act on the Protection of Personal Information (APPI) and other applicable laws, and sets out this Privacy Policy as follows.`,
    heading: (n, title) => `${n}. ${title}`,
    contactTitle: 'Contact',
    collectTitle: 'Personal information we collect and how we use it',
    collectForm:
      'When you use the contact form on the Site, we ask for your name (or nickname), email address, and the content of your message. We use this information only to reply to your inquiry and to contact you when necessary, and for no other purpose.',
    collectNone:
      'The Site does not directly collect personal information such as your name, address, or email address from visitors.',
    thirdPartyTitle: 'Disclosure to third parties',
    thirdParty:
      "Except where required by law, the Operator does not provide personal information to third parties without the individual's prior consent.",
    disclosureTitle: 'Access, correction, and deletion',
    disclosure: (contact) =>
      `If you ask us to disclose, correct, stop using, or delete your personal information, we will verify your identity and respond within a reasonable scope in accordance with the law. Please send requests to the contact below (${contact}).`,
    cookieTitle: 'Cookies',
    cookie:
      'The Site may use cookies to improve usability and to provide the services described below. A cookie is a small piece of data that a website stores in your browser; by itself it does not identify you. You can refuse or delete cookies in your browser settings, but some features may then stop working.',
    analyticsTitle: 'Access analytics',
    analytics: [
      'The Site uses Google Analytics, an analytics service provided by Google. Google Analytics uses cookies to collect traffic data. This data is collected anonymously and does not identify individuals.',
      'You can refuse this collection by disabling cookies in your browser settings. You can also opt out by installing the Google Analytics Opt-out Browser Add-on (https://tools.google.com/dlpage/gaoptout).',
      'For the terms of use and how Google handles data, see the Google Analytics Terms of Service (https://marketingplatform.google.com/about/analytics/terms/us/) and "How Google uses information from sites or apps that use our services" (https://policies.google.com/technologies/partner-sites).',
    ],
    adsenseTitle: 'Advertising (Google AdSense)',
    adsense: [
      'The Site uses Google AdSense, a third-party advertising service.',
      "Third-party vendors, including Google, use cookies to serve ads based on a user's previous visits to the Site or other websites.",
      "Google's use of advertising cookies enables Google and its partners to serve ads to users based on their visits to the Site and/or other sites on the Internet.",
      "Users can opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com/). Users can also opt out of a third-party vendor's use of cookies for personalized advertising by visiting www.aboutads.info (https://www.aboutads.info/).",
      "For details on how Google handles advertising cookies, see Google's Advertising Policies (https://policies.google.com/technologies/ads).",
    ],
    otherAdsTitle: 'Third-party advertising',
    otherAds: [
      'The Site may use third-party advertising services. These advertisers may use cookies and similar technologies to show ads that match your interests, drawing on information about your visits to the Site and other websites (this does not include your name, address, email address, or phone number).',
      'You can refuse the use of cookies by these advertisers through the opt-out options each provider offers or through your browser settings.',
    ],
    affiliateTitle: 'Affiliate programs',
    affiliate:
      'The Site participates in affiliate programs and may include links to products and services. If you buy or sign up through such a link, the Operator may receive a commission. Advertisers and affiliate service providers may use cookies to track clicks on these links.',
    amazon:
      'As an Amazon Associate, the Operator earns from qualifying purchases.',
    changeTitle: 'Changes to this Privacy Policy',
    change:
      'The Operator may change this Privacy Policy without notice to reflect changes in the law or in how the Site is run. A revised policy takes effect when it is posted on this page.',
    contactBody: (contact) => `${contact}`,
    enacted: (date) => `Enacted: ${date}`,
    revised: (date) => `Last revised: ${date}`,
    operatorLine: (operator) => `Operator: ${operator}`,
  },
};

/** プライバシーポリシーの本文（プレーンテキスト）を組み立てる */
export function buildPrivacyPolicy(
  input: PolicyInput,
  locale: PolicyLocale,
): string {
  const t = TEXTS[locale];
  const site = input.siteName.trim() || t.placeholders.site;
  const operator = input.operator.trim() || t.placeholders.operator;
  const contact = input.contact.trim() || t.placeholders.contact;

  const sections: { title: string; body: string[] }[] = [];
  sections.push({
    title: t.collectTitle,
    body: [input.contactForm ? t.collectForm : t.collectNone],
  });
  sections.push({ title: t.thirdPartyTitle, body: [t.thirdParty] });
  sections.push({
    title: t.disclosureTitle,
    body: [t.disclosure(contact)],
  });

  const useCookies =
    input.cookies ||
    input.analytics ||
    input.adsense ||
    input.otherAds ||
    input.affiliate;
  if (useCookies) sections.push({ title: t.cookieTitle, body: [t.cookie] });
  if (input.analytics)
    sections.push({ title: t.analyticsTitle, body: t.analytics });
  if (input.adsense) sections.push({ title: t.adsenseTitle, body: t.adsense });
  if (input.otherAds)
    sections.push({ title: t.otherAdsTitle, body: t.otherAds });
  if (input.affiliate || input.amazon) {
    const body = [];
    if (input.affiliate) body.push(t.affiliate);
    if (input.amazon) body.push(t.amazon);
    sections.push({ title: t.affiliateTitle, body });
  }
  sections.push({ title: t.changeTitle, body: [t.change] });
  sections.push({ title: t.contactTitle, body: [t.contactBody(contact)] });

  const lines: string[] = [t.intro(site, operator), ''];
  sections.forEach((s, i) => {
    lines.push(t.heading(i + 1, s.title));
    for (const para of s.body) lines.push(para);
    lines.push('');
  });

  const enacted = formatDate(input.enactedDate, locale);
  const revised = formatDate(input.revisedDate, locale);
  if (enacted) lines.push(t.enacted(enacted));
  if (revised) lines.push(t.revised(revised));
  lines.push(t.operatorLine(operator));
  return lines.join('\n') + '\n';
}
