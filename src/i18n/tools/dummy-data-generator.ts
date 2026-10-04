import type { Locale } from '../../data/tools';
import type {
  DummyField,
  DummyFormat,
  DummyLocale,
} from '../../lib/tools/dummy-data-generator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface DummyDataGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  dataLocaleLabel: string;
  dataLocaleOptions: Record<DummyLocale, string>;
  countLabel: string;
  seedLabel: string;
  seedPlaceholder: string;
  seedHint: string;
  fieldsLabel: string;
  fieldLabels: Record<DummyField, string>;
  kanaJaOnly: string;
  formatLabel: string;
  formatOptions: Record<DummyFormat, string>;
  generateButton: string;
  noFieldError: string;
  outputLabel: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  downloadButton: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const dummyDataGeneratorContent: Record<
  Locale,
  DummyDataGeneratorPageContent
> = {
  ja: {
    title: 'ダミー個人データ生成（名前・住所・メール・電話番号をJSON/CSVで）',
    description:
      'テストやデモ用の架空の個人データ（氏名・カナ・メール・電話番号・住所・生年月日・会社名）を最大1,000件まとめて生成し、JSON・CSV・TSVで出力します。シード指定で同じデータの再現も可能。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ダミー個人データ生成（JSON・CSV・TSV）',
    introHtml:
      '開発・テスト・デモ用に、架空の氏名・カナ・メールアドレス・電話番号・郵便番号・住所・生年月日・会社名・ユーザー名をまとめて生成します。日本語と英語（米国形式）のデータに対応し、JSON・CSV・TSVで出力できます。メールアドレスは例示用に予約されたドメイン（example.com など）だけを使うため、実在のアドレスに届くことはありません。生成はすべてブラウザ内で行われ、サーバーへは送信されません。ID が必要な場合は <a href="/tools/uuid-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">UUID生成</a>、ダミーの文章は <a href="/tools/lorem-ipsum/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ダミーテキスト生成</a> をご利用ください。',

    dataLocaleLabel: 'データの言語・形式',
    dataLocaleOptions: { ja: '日本語', en: '英語（米国）' },
    countLabel: '件数（1〜1,000）',
    seedLabel: 'シード（任意）',
    seedPlaceholder: '例: test-1',
    seedHint:
      '同じシードなら同じデータを再現できます（生年月日・年齢は実行日によって変わります）。空欄の場合は生成のたびに異なるデータになります。',
    fieldsLabel: '出力する項目',
    fieldLabels: {
      name: '氏名',
      kana: 'ふりがな',
      email: 'メールアドレス',
      phone: '電話番号',
      zip: '郵便番号',
      address: '住所',
      birthday: '生年月日',
      age: '年齢',
      company: '会社名',
      username: 'ユーザー名',
    },
    kanaJaOnly: 'ふりがなは日本語データのみ',
    formatLabel: '出力形式',
    formatOptions: { json: 'JSON', csv: 'CSV', tsv: 'TSV' },
    generateButton: '生成する',
    noFieldError: '出力する項目を1つ以上選んでください',
    outputLabel: '生成結果',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    downloadButton: 'ダウンロード',

    notesHeading: '注意事項',
    notes: [
      '生成されるのは架空のデータです。氏名・住所・会社名は一般的な語の組み合わせで作っており、偶然実在の人物や組織と一致することがあります。本番のデータとしては使わないでください。',
      'メールアドレスは RFC 2606 で例示用に予約されたドメイン（example.com / example.net / example.org）です。英語版の電話番号は北米で架空番号として確保されている 555-01XX を使っています。日本語版の電話番号・郵便番号はランダムな数字のため、実在の番号と一致することがあります。住所は市区までが実在し、町名・番地は架空です。',
      '1回に生成できるのは1,000件までです。CSV・TSVのダウンロードは、Excelで文字化けしにくいよう UTF-8（BOM付き）で保存します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ダミーデータ',
        description:
          '開発やテストで本物の個人情報を使わずに済むよう、形式だけを似せて作った架空のデータです。個人情報の漏えいリスクを避けられます。',
      },
      {
        term: 'シード（乱数の種）',
        description:
          '乱数列の出発点となる値です。同じシードからは同じ乱数列が作られるため、不具合の再現やテストデータの共有に役立ちます。',
      },
      {
        term: 'RFC 2606',
        description:
          'example.com など、文書やテストで自由に使える予約済みドメイン名を定めた規格です。実際にメールが届く心配なく例示に使えます。',
      },
    ],
  },
  en: {
    title: 'Dummy Personal Data Generator (JSON, CSV)',
    description:
      'Generate up to 1,000 fake people (name, email, phone, address, birthday) as JSON, CSV, or TSV. Seed for repeatable data. Runs in your browser.',
    h1: 'Dummy Personal Data Generator (JSON, CSV, TSV)',
    introHtml:
      'Generates fake names, kana readings, email addresses, phone numbers, postal codes, addresses, birthdays, company names, and usernames for development, testing, and demos. It supports Japanese and US-style English data and exports JSON, CSV, or TSV. Email addresses only use domains reserved for examples (such as example.com), so they never reach a real inbox. Everything is generated in your browser and nothing is sent to a server. For IDs, see the <a href="/en/tools/uuid-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">UUID Generator</a>; for filler text, the <a href="/en/tools/lorem-ipsum/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Lorem Ipsum Generator</a>.',

    dataLocaleLabel: 'Data language / style',
    dataLocaleOptions: { ja: 'Japanese', en: 'English (US)' },
    countLabel: 'Number of records (1-1,000)',
    seedLabel: 'Seed (optional)',
    seedPlaceholder: 'e.g. test-1',
    seedHint:
      'The same seed reproduces the same data (birthdays and ages shift with the current date). Leave it empty to get different data each time.',
    fieldsLabel: 'Fields to include',
    fieldLabels: {
      name: 'Name',
      kana: 'Name reading (kana)',
      email: 'Email',
      phone: 'Phone',
      zip: 'Postal code',
      address: 'Address',
      birthday: 'Birthday',
      age: 'Age',
      company: 'Company',
      username: 'Username',
    },
    kanaJaOnly: 'Kana is available for Japanese data only',
    formatLabel: 'Output format',
    formatOptions: { json: 'JSON', csv: 'CSV', tsv: 'TSV' },
    generateButton: 'Generate',
    noFieldError: 'Select at least one field',
    outputLabel: 'Result',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    downloadButton: 'Download',

    notesHeading: 'Notes',
    notes: [
      'All data is fictional. Names, addresses, and companies are built from common words and may coincidentally match a real person or organization, so do not use them as real data.',
      'Email addresses use the domains reserved for examples by RFC 2606 (example.com, example.net, example.org). English phone numbers use the 555-01XX range set aside for fictional numbers in North America. Japanese phone numbers and postal codes are random digits and may match real ones. Address cities exist, but street names and numbers are made up.',
      'You can generate up to 1,000 records at a time. CSV and TSV downloads are saved as UTF-8 with a BOM so that Excel displays Japanese text correctly.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Dummy data',
        description:
          'Fake data that mimics the shape of real records so development and testing do not need real personal information, which avoids privacy risks.',
      },
      {
        term: 'Seed',
        description:
          'The starting value of a random sequence. The same seed always produces the same sequence, which helps reproduce bugs and share test data.',
      },
      {
        term: 'RFC 2606',
        description:
          'A standard that reserves domain names such as example.com for documentation and testing, so they can be used in examples without any chance of reaching a real mailbox.',
      },
    ],
  },
};
