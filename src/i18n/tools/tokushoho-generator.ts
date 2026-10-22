import type { Locale } from '../../data/tools';
import type {
  TokushohoFieldId,
  TokushohoFormat,
  TokushohoIssueCode,
} from '../../lib/tools/tokushoho-generator';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface FieldCopy {
  label: string;
  hint: string;
  placeholder: string;
}

export interface TokushohoGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  disclaimerHeading: string;
  disclaimer: string;
  howToHeading: string;
  howToSteps: string[];
  inputHeading: string;
  fields: Record<TokushohoFieldId, FieldCopy>;
  hideAddressLabel: string;
  hidePhoneLabel: string;
  phoneHoursLabel: string;
  phoneHoursPlaceholder: string;
  urlLabel: string;
  urlPlaceholder: string;
  extraLabel: string;
  extraHint: string;
  extraPlaceholder: string;
  presetHeading: string;
  presets: { target: TokushohoFieldId; label: string; text: string }[];
  issuesHeading: string;
  noIssues: string;
  errorPrefix: string;
  warningPrefix: string;
  issueMessages: Record<TokushohoIssueCode, string>;
  formatLabel: string;
  formats: { id: TokushohoFormat; label: string }[];
  outputHeading: string;
  outputEmpty: string;
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

const goodsReturns =
  '商品到着後7日以内に、メールにてご連絡ください。未使用・未開封の商品に限り、返品・交換をお受けします。返品にかかる送料はお客様のご負担となります。\n商品に不良・破損、または注文と異なる商品が届いた場合は、到着後7日以内にご連絡いただければ、送料当社負担で交換または返金いたします。';
const digitalReturns =
  'デジタルコンテンツの性質上、お支払い後の返品・返金・キャンセルはお受けできません。ただし、商品に不具合があり正常にご利用いただけない場合は、メールにてご連絡ください。交換または返金のご対応をいたします。';
const goodsFees =
  '送料: 全国一律○○円（○○円以上のご注文で無料）\n代金引換手数料: ○○円\n消費税は販売価格に含まれています。';
const digitalFees =
  'インターネット接続料金、通信料金等はお客様のご負担となります。';

export const tokushohoGeneratorContent: Record<
  Locale,
  TokushohoGeneratorPageContent
> = {
  ja: {
    title: '特定商取引法に基づく表記ジェネレーター（通信販売のひな形作成）',
    description:
      '特定商取引法に基づく表記（通信販売）の必須項目を入力して、ひな形をテキスト・Markdown・HTMLで作成。住所・電話番号の非公開表記にも対応。法的助言ではありません。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '特定商取引法に基づく表記ジェネレーター',
    introHtml:
      'ネットショップや個人の販売サイトに必要な「特定商取引法に基づく表記」を、項目を入力するだけでひな形にします。販売業者・運営責任者・所在地・電話番号・メールアドレス・販売価格・代金以外の必要料金・支払方法と時期・引渡時期・返品などの記載項目に対応し、テキスト・Markdown・HTMLで出力できます。サイト公開時のメタ情報は <a href="/tools/meta-tag-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">metaタグ・OGPタグ生成</a> も使えます。',
    disclaimerHeading: 'ご利用にあたって',
    disclaimer:
      'このツールが出力するのは一般的なひな形であり、法的助言ではありません。実際の記載内容は、取扱う商品・サービスや販売方法に合わせて、必ずご自身で確認し、必要に応じて消費者庁の資料や弁護士等の専門家にご相談ください。',
    howToHeading: '使い方',
    howToSteps: [
      '販売業者から返品・交換・キャンセルまで、各項目に自分のショップの内容を入力します。',
      '個人事業者で住所・電話番号を公開したくない場合は、「所在地を公開せず、請求があれば開示する」「電話番号を公開せず、請求があれば開示する」にチェックします。',
      '「定型文を挿入」で返品や送料などの文例を入れたあと、自分の条件に書き換えます。',
      '確認事項に表示された問題を直し、「出力形式」を選んで「コピー」または「ダウンロード」で出力します。',
    ],
    inputHeading: '記載項目',
    fields: {
      seller: {
        label: '販売業者（事業者名・屋号）',
        hint: '法人は登記上の名称、個人事業者は氏名または屋号を書きます。',
        placeholder: '例: 猫野商店',
      },
      representative: {
        label: '運営責任者',
        hint: '法人は代表者または責任者の氏名を書きます。',
        placeholder: '例: 猫野 太郎',
      },
      address: {
        label: '所在地',
        hint: '郵便番号から番地、建物名まで省略せずに書きます。',
        placeholder: '例: 〒100-0000 東京都千代田区○○1-2-3',
      },
      phone: {
        label: '電話番号',
        hint: '連絡のつく番号を書きます。',
        placeholder: '例: 03-1234-5678',
      },
      email: {
        label: 'メールアドレス',
        hint: '問い合わせを受け付けるアドレスを書きます。',
        placeholder: '例: info@example.com',
      },
      price: {
        label: '販売価格',
        hint: '消費税を含む総額で表示します。',
        placeholder: '例: 各商品ページに税込価格で表示しています。',
      },
      extraFees: {
        label: '商品代金以外の必要料金',
        hint: '送料、手数料、梱包料などを具体的に書きます。',
        placeholder: '例: 送料 全国一律500円',
      },
      payment: {
        label: 'お支払方法',
        hint: '利用できる決済手段をすべて書きます。',
        placeholder: '例: クレジットカード、銀行振込、コンビニ払い',
      },
      paymentTiming: {
        label: 'お支払時期',
        hint: '決済手段ごとの支払期限や引き落とし日を書きます。',
        placeholder:
          '例: クレジットカードは注文時にお支払いが確定します。銀行振込は注文から7日以内にお振込みください。',
      },
      delivery: {
        label: '商品の引渡時期',
        hint: '注文から発送・提供までの目安を書きます。',
        placeholder: '例: ご入金確認後、3営業日以内に発送します。',
      },
      returns: {
        label: '返品・交換・キャンセル',
        hint: '条件、期限、返品送料の負担者、不良品の扱いを書きます。',
        placeholder: '例: 商品到着後7日以内にご連絡ください。',
      },
    },
    hideAddressLabel: '所在地を公開せず、請求があれば開示する',
    hidePhoneLabel: '電話番号を公開せず、請求があれば開示する',
    phoneHoursLabel: '電話の受付時間（任意）',
    phoneHoursPlaceholder: '例: 平日10:00〜18:00',
    urlLabel: 'サイトURL（任意）',
    urlPlaceholder: '例: https://example.com/',
    extraLabel: '追加項目（任意）',
    extraHint:
      '「項目名: 内容」の形式で1行に1項目。申込有効期限、動作環境などを足せます。',
    extraPlaceholder: '例:\n申込有効期限: 注文から7日以内',
    presetHeading: '定型文を挿入',
    presets: [
      {
        target: 'extraFees',
        label: '代金以外の料金: 物販',
        text: goodsFees,
      },
      {
        target: 'extraFees',
        label: '代金以外の料金: デジタル',
        text: digitalFees,
      },
      { target: 'returns', label: '返品: 物販', text: goodsReturns },
      { target: 'returns', label: '返品: デジタル', text: digitalReturns },
    ],
    issuesHeading: '確認事項',
    noIssues: '問題は見つかりませんでした。',
    errorPrefix: 'エラー',
    warningPrefix: '警告',
    issueMessages: {
      missing: '「{field}」が未入力です。出力には【要記入】と表示されます。',
      invalidEmail: 'メールアドレスの形式が正しくありません。',
      invalidPhone:
        '電話番号は数字（9〜15桁）とハイフン・括弧だけで書いてください。',
      invalidUrl:
        'サイトURL「{value}」は https:// で始まる形式で書いてください。',
      priceNoTax:
        '販売価格に「税」の記載がありません。消費税を含む総額（税込価格）で表示してください。',
      hiddenNeedsContact:
        '住所や電話番号を非公開にする場合は、請求を受け付けられる連絡先（メールアドレス）を入力してください。',
      extraNoSeparator:
        '追加項目「{value}」に「:」がないため出力されません。「項目名: 内容」の形式で書いてください。',
    },
    formatLabel: '出力形式',
    formats: [
      { id: 'text', label: 'テキスト' },
      { id: 'markdown', label: 'Markdownの表' },
      { id: 'html', label: 'HTMLの表' },
    ],
    outputHeading: '生成された特定商取引法に基づく表記',
    outputEmpty: '項目を入力すると、ここにひな形が生成されます。',
    copyButton: 'コピー',
    downloadButton: 'ダウンロード',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    downloaded: 'ダウンロードしました',
    notesHeading: '注意事項',
    notes: [
      '出力は一般的なひな形であり、法的助言ではありません。取扱う商品・サービスや販売方法によって、記載すべき内容は異なります。最終的な記載はご自身の責任で確認してください。',
      '定型文の「○○」や例示は必ず自分の条件に書き換えてください。そのまま公開しないでください。',
      '個人事業者が所在地・電話番号を非公開にできるのは、請求があれば遅滞なく開示する体制を整えている場合に限られます。開示を求められたときに実際に対応できるか、その手段（メールなど）が用意できているかを確認してください。',
      '販売する商品の種類（物販、デジタルコンテンツ、サービス、定期購入など）によっては、ひな形にない項目（申込有効期限、動作環境、定期購入の条件など）の記載が必要です。「追加項目」で足してください。',
      '返品・キャンセルの特約を表示していない場合、通信販売には法律上のクーリング・オフはありませんが、商品の到着後8日以内なら返品できる原則（送料は購入者負担）が適用されます。特約を設けるなら表示が必要です。',
      '法令や運用は改正されることがあります。公開前に消費者庁などの最新情報を確認してください。入力内容はブラウザ内でのみ処理され、サーバーには送信されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '特定商取引法に基づく表記',
        description:
          '通信販売を行う事業者が、販売業者名・所在地・価格・支払方法・返品条件などを広告や販売ページに表示する義務のこと。サイトのフッターなどから専用ページにリンクするのが一般的。',
      },
      {
        term: '請求があれば遅滞なく開示',
        description:
          '住所・電話番号をページに載せない代わりに、消費者から請求があったら速やかに知らせる旨の表示。表示するだけでなく、実際に対応できる体制が必要。',
      },
      {
        term: '運営責任者',
        description:
          'サイトの運営に責任を持つ人。法人では代表者または担当役員などの氏名を書く。',
      },
    ],
  },
  en: {
    title: 'Tokushoho Notice Generator (Japan E-commerce Disclosure)',
    description:
      'Fill in the required items to draft a Japanese "Specified Commercial Transactions Act" notice as text, Markdown or HTML. Not legal advice. Runs in your browser.',
    h1: 'Tokushoho Notice Generator (Japan Commercial Transactions Act)',
    introHtml:
      'If you sell goods or services online to customers in Japan, the Act on Specified Commercial Transactions requires a legal disclosure page, usually titled 特定商取引法に基づく表記 (tokushoho). Enter the seller, representative, address, phone, email, prices, extra fees, payment methods and timing, delivery timing and return policy, and get a Japanese-language draft as text, Markdown or HTML. The output is always in Japanese, because the notice is shown to Japanese consumers. Related: <a href="/en/tools/meta-tag-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Meta Tag &amp; OGP Generator</a>.',
    disclaimerHeading: 'Before you use this',
    disclaimer:
      'This tool outputs a general template, not legal advice. What you must disclose depends on what you sell and how. Check the final wording yourself, and consult the Consumer Affairs Agency guidance or a qualified professional if needed.',
    howToHeading: 'How to use',
    howToSteps: [
      'Fill in each item, from the seller to the return policy, with your shop details (write in Japanese, since the notice is for Japanese customers).',
      'If you are a sole proprietor and do not want to publish your address or phone number, tick "Withhold the address and disclose on request" and "Withhold the phone number and disclose on request".',
      'Use "Insert sample text" to drop in an example for fees or returns, then rewrite it to match your terms.',
      'Fix anything listed under the checks, choose an "Output format", then press "Copy" or "Download".',
    ],
    inputHeading: 'Items to disclose',
    fields: {
      seller: {
        label: 'Seller (company or trade name)',
        hint: 'Registered name for a company; name or shop name for a sole proprietor.',
        placeholder: 'e.g. 猫野商店',
      },
      representative: {
        label: 'Person responsible for operations',
        hint: 'The representative or the person in charge of running the shop.',
        placeholder: 'e.g. 猫野 太郎',
      },
      address: {
        label: 'Address',
        hint: 'Full address, including postal code and building name.',
        placeholder: 'e.g. 〒100-0000 東京都千代田区○○1-2-3',
      },
      phone: {
        label: 'Phone number',
        hint: 'A number where you can be reached.',
        placeholder: 'e.g. 03-1234-5678',
      },
      email: {
        label: 'Email address',
        hint: 'The address that receives customer inquiries.',
        placeholder: 'e.g. info@example.com',
      },
      price: {
        label: 'Selling price',
        hint: 'Show the total including consumption tax.',
        placeholder: 'e.g. 各商品ページに税込価格で表示しています。',
      },
      extraFees: {
        label: 'Fees other than the price',
        hint: 'Shipping, handling, packaging and similar charges, spelled out.',
        placeholder: 'e.g. 送料 全国一律500円',
      },
      payment: {
        label: 'Payment methods',
        hint: 'Every payment method you accept.',
        placeholder: 'e.g. クレジットカード、銀行振込、コンビニ払い',
      },
      paymentTiming: {
        label: 'Payment timing',
        hint: 'Deadline or debit date for each payment method.',
        placeholder:
          'e.g. クレジットカードは注文時にお支払いが確定します。銀行振込は注文から7日以内にお振込みください。',
      },
      delivery: {
        label: 'Delivery timing',
        hint: 'Typical time from order to shipment or delivery.',
        placeholder: 'e.g. ご入金確認後、3営業日以内に発送します。',
      },
      returns: {
        label: 'Returns, exchanges and cancellations',
        hint: 'Conditions, deadline, who pays return shipping, and how defects are handled.',
        placeholder: 'e.g. 商品到着後7日以内にご連絡ください。',
      },
    },
    hideAddressLabel: 'Withhold the address and disclose on request',
    hidePhoneLabel: 'Withhold the phone number and disclose on request',
    phoneHoursLabel: 'Phone hours (optional)',
    phoneHoursPlaceholder: 'e.g. 平日10:00〜18:00',
    urlLabel: 'Site URL (optional)',
    urlPlaceholder: 'e.g. https://example.com/',
    extraLabel: 'Additional items (optional)',
    extraHint:
      'One item per line as "Label: Value", for example a purchase deadline or system requirements.',
    extraPlaceholder: 'e.g.\n申込有効期限: 注文から7日以内',
    presetHeading: 'Insert sample text',
    presets: [
      {
        target: 'extraFees',
        label: 'Fees: physical goods',
        text: goodsFees,
      },
      {
        target: 'extraFees',
        label: 'Fees: digital goods',
        text: digitalFees,
      },
      {
        target: 'returns',
        label: 'Returns: physical goods',
        text: goodsReturns,
      },
      {
        target: 'returns',
        label: 'Returns: digital goods',
        text: digitalReturns,
      },
    ],
    issuesHeading: 'Checks',
    noIssues: 'No problems found.',
    errorPrefix: 'Error',
    warningPrefix: 'Warning',
    issueMessages: {
      missing:
        '"{field}" is empty. The output will show a 【要記入】 ("fill in") marker.',
      invalidEmail: 'The email address does not look valid.',
      invalidPhone:
        'Use only digits (9 to 15 of them), hyphens and parentheses in the phone number.',
      invalidUrl:
        'The site URL "{value}" must be a full URL starting with https://.',
      priceNoTax:
        'The selling price does not mention tax (税). Show the total price including consumption tax.',
      hiddenNeedsContact:
        'If you withhold your address or phone number, enter an email address where customers can request them.',
      extraNoSeparator:
        'The additional item "{value}" has no ":" and is left out. Write it as "Label: Value".',
    },
    formatLabel: 'Output format',
    formats: [
      { id: 'text', label: 'Plain text' },
      { id: 'markdown', label: 'Markdown table' },
      { id: 'html', label: 'HTML table' },
    ],
    outputHeading: 'Generated notice (in Japanese)',
    outputEmpty: 'Fill in the items to generate the notice here.',
    copyButton: 'Copy',
    downloadButton: 'Download',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    downloaded: 'Downloaded',
    notesHeading: 'Notes',
    notes: [
      'The output is a general template, not legal advice. What you must disclose varies with the goods or services and the way you sell. You are responsible for checking the final text.',
      'Replace every ○○ and example in the sample text with your own terms. Do not publish it as is.',
      'A sole proprietor may withhold the address and phone number only if they can actually disclose them without delay on request. Make sure you have a channel, such as email, to handle such requests.',
      'Depending on what you sell (physical goods, digital content, services, subscriptions), further items such as a purchase deadline, system requirements or subscription terms may be needed. Add them under "Additional items".',
      'There is no statutory cooling-off period for online sales in Japan, but if you do not state your return terms, the buyer may generally return goods within 8 days of receipt at their own cost. State your own terms if you want something different.',
      'Laws and guidance can change, so check the latest information from the Consumer Affairs Agency before publishing. Your input is processed only in your browser and is never sent to a server.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Tokushoho notice (特定商取引法に基づく表記)',
        description:
          'The disclosure that online sellers in Japan must show in ads and on sales pages: seller name, address, prices, payment methods, return terms and so on. It is usually a dedicated page linked from the site footer.',
      },
      {
        term: 'Disclosure on request',
        description:
          'A statement that the address or phone number will be provided promptly when a consumer asks, used instead of printing them on the page. The seller must really be able to respond.',
      },
      {
        term: 'Person responsible for operations (運営責任者)',
        description:
          'The person accountable for running the site. For a company, the name of the representative or officer in charge.',
      },
    ],
  },
};
