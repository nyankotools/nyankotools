import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface LuhnCheckerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  warning: string;
  inputLabel: string;
  inputHint: string;
  placeholder: string;
  testNumbersLabel: string;
  testNumbersHint: string;
  resultLabel: string;
  resultEmpty: string;
  /** 以下は {length} {actual} {expected} {brand} を置換して表示する */
  resultValid: string;
  resultInvalid: string;
  resultInvalidDetail: string;
  resultInvalidChars: string;
  resultWrongLength: string;
  brandLabel: string;
  brandUnknown: string;
  lengthOk: string;
  lengthNg: string;
  formattedLabel: string;
  brandNames: Record<
    'visa' | 'mastercard' | 'amex' | 'jcb' | 'diners' | 'discover' | 'unionpay',
    string
  >;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const brandNamesJa = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  jcb: 'JCB',
  diners: 'Diners Club',
  discover: 'Discover',
  unionpay: '銀聯（UnionPay）',
};

const brandNamesEn = {
  ...brandNamesJa,
  unionpay: 'UnionPay',
};

export const luhnCheckerContent: Record<Locale, LuhnCheckerPageContent> = {
  ja: {
    title: 'Luhnチェック・カード番号ブランド判定ツール',
    description:
      'Luhnアルゴリズムでカード番号の検査桁を検証し、先頭の桁（IIN）からカードブランドを判定します。決済テスト用の公開番号付き。ブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Luhnチェック・カード番号ブランド判定',
    introHtml:
      'カード番号などの検査桁をLuhnアルゴリズム（モジュラス10）で検証し、先頭の桁（IIN/BIN）からブランドを判定します。決済システムの開発・テストで使う、各社が公開しているテスト用番号をワンクリックで入力できます。ほかのチェックサムは<a href="/tools/checksum-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">チェックサム計算</a> もご利用ください。',
    warning:
      '実際のクレジットカード番号は入力しないでください。動作確認には下のテスト番号を使ってください。入力内容はブラウザ内だけで処理され、外部へ送信・保存されません。',
    inputLabel: '番号（カード番号など）',
    inputHint:
      '2〜19桁。スペース・ハイフン・全角数字は自動で取り除きます。最後の1桁が検査桁です。',
    placeholder: '例: 4111 1111 1111 1111',
    testNumbersLabel: 'テスト用の公開番号',
    testNumbersHint:
      '決済事業者のドキュメントで公開されているテスト番号です。実在のカードではありません。',
    resultLabel: '判定結果',
    resultEmpty: '番号を入力すると、ここに結果が表示されます。',
    resultValid: 'Luhnチェックに合格しました（検査桁 {actual}）。',
    resultInvalid: 'Luhnチェックに不合格です。',
    resultInvalidDetail:
      '入力された検査桁は {actual}、計算結果は {expected} です。',
    resultInvalidChars: '数字以外の文字が含まれています。',
    resultWrongLength:
      '{length}桁が入力されています。2〜19桁で入力してください。',
    brandLabel: 'ブランド（IIN判定）: ',
    brandUnknown: '判定できません',
    lengthOk: '桁数はブランドの範囲内です。',
    lengthNg: '桁数がこのブランドの一般的な範囲と一致しません。',
    formattedLabel: '表示形式: ',
    brandNames: brandNamesJa,
    notesHeading: '注意事項',
    notes: [
      '実際のクレジットカード番号・デビットカード番号を入力することは推奨しません。計算はブラウザの中だけで行い、サーバーへの送信・保存・履歴の記録はしませんが、念のためテスト番号でお試しください。',
      'Luhnチェックに合格しても、そのカードが実在する・使える・本人のものであるという意味ではありません。入力ミスの検出が目的のアルゴリズムです。',
      'ブランド判定は先頭の桁の範囲による簡易判定です。実際の発行元・ブランドは決済事業者の判定が正になります。国内専用カードや新しい発行範囲には対応していない場合があります。',
      'ここに載せているテスト番号は、各決済事業者が公開しているものです。本番環境では使えず、事業者ごとに有効な番号が異なる場合があります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Luhnアルゴリズム',
        description:
          '右端の検査桁を除いた数字を、右から1桁おきに2倍して各桁を足し合わせ、検査桁を加えた合計が10の倍数になるかで入力ミスを検出する方式です。1桁の誤りや隣り合う桁の入れ替えの大半を見つけられます。',
      },
      {
        term: 'IIN/BIN',
        description:
          '発行者識別番号（Issuer Identification Number）。カード番号の先頭6〜8桁で、カードブランドと発行元を識別します。旧称はBIN（Bank Identification Number）です。',
      },
    ],
  },
  en: {
    title: 'Luhn Checker & Card Brand Detector (Test Numbers)',
    description:
      'Validate a card number with the Luhn algorithm and detect the brand from its IIN. Includes public payment test numbers. Runs in your browser; nothing is sent.',
    h1: 'Luhn Checker & Card Brand Detector',
    introHtml:
      'Verify the check digit of a card number (or any Luhn-protected ID) with the Luhn mod 10 algorithm and detect the brand from the leading digits (IIN/BIN). Fill in the public test numbers that payment providers publish for development and QA with one click. For other checksums, try the <a href="/en/tools/checksum-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Checksum Calculator</a>.',
    warning:
      'Do not enter real credit card numbers. Use the test numbers below instead. Everything is processed in your browser only, and nothing is sent or stored.',
    inputLabel: 'Number (card number, etc.)',
    inputHint:
      '2 to 19 digits. Spaces, hyphens and full-width digits are removed automatically. The last digit is the check digit.',
    placeholder: 'e.g. 4111 1111 1111 1111',
    testNumbersLabel: 'Public test numbers',
    testNumbersHint:
      'These are test numbers published in payment providers’ documentation. They are not real cards.',
    resultLabel: 'Result',
    resultEmpty: 'Enter a number and the result appears here.',
    resultValid: 'The number passes the Luhn check (check digit {actual}).',
    resultInvalid: 'The number fails the Luhn check.',
    resultInvalidDetail:
      'The number ends in {actual}, but the calculated check digit is {expected}.',
    resultInvalidChars: 'The input contains characters other than digits.',
    resultWrongLength:
      'You entered {length} digits. Enter between 2 and 19 digits.',
    brandLabel: 'Brand (by IIN): ',
    brandUnknown: 'Unknown',
    lengthOk: 'The length is within the range for this brand.',
    lengthNg: 'The length is outside the usual range for this brand.',
    formattedLabel: 'Formatted: ',
    brandNames: brandNamesEn,
    notesHeading: 'Notes',
    notes: [
      'Entering real credit or debit card numbers is not recommended. Calculation happens only in your browser and nothing is sent, stored or logged, but please use the test numbers anyway.',
      'Passing the Luhn check does not mean the card exists, can be used, or belongs to the person entering it. The algorithm only exists to catch typing mistakes.',
      'Brand detection is a simple lookup on the leading digits. The payment provider’s own determination is authoritative, and some domestic-only cards or newly issued ranges may not be recognized.',
      'The test numbers listed here are the ones payment providers publish. They do not work in production, and which numbers are accepted can differ by provider.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Luhn algorithm',
        description:
          'Starting from the digit left of the check digit, double every second digit going leftwards, add all the digits together with the check digit, and the total must be a multiple of 10. It catches most single-digit errors and swaps of neighboring digits.',
      },
      {
        term: 'IIN / BIN',
        description:
          'The Issuer Identification Number, the first 6 to 8 digits of a card number, identifies the card brand and issuer. It was formerly called the Bank Identification Number (BIN).',
      },
    ],
  },
};
