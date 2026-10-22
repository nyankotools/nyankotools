import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface IsbnCheckerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  inputHint: string;
  copy: string;
  copied: string;
  copyFailed: string;
  resultHeading: string;
  /** {check} を正しいチェックデジットに置換する */
  statusValid: string;
  statusInvalid: string;
  statusCompleted: string;
  kindLabel: string;
  kinds: { isbn10: string; ean13: string; ean8: string };
  checkDigitLabel: string;
  completedLabel: string;
  isbn10Label: string;
  isbn13Label: string;
  noteLabel: string;
  noteIsbn978: string;
  noteIsbn979: string;
  noteJapanJan: string;
  errors: { empty: string; chars: string; length: string };
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const isbnCheckerContent: Record<Locale, IsbnCheckerPageContent> = {
  ja: {
    title: 'ISBN・JANコード チェックデジット検証',
    description:
      'ISBN-10・ISBN-13・JAN(EAN-13/EAN-8)のチェックデジットを検証・計算し、ISBN-10とISBN-13を相互変換します。ハイフン入りもOK。データはブラウザ内で処理されます。',
    h1: 'ISBN・JANコードのチェックデジット検証・変換',
    introHtml:
      'ISBNやJANコードを入力すると、チェックデジットが正しいかを確認し、ISBN-10とISBN-13を相互に変換します。桁数が1つ足りない場合は、チェックデジットを計算して補います。ハイフンや空白が入っていても使えます。入力内容はブラウザ内で処理され、サーバーには送信されません。確認したコードのバーコード画像は <a href="/tools/barcode-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">バーコード生成</a> で作れます。',
    inputLabel: 'ISBN・JANコード',
    inputPlaceholder: '例: 978-4-12-345678-9 / 4901234567894',
    inputHint:
      'ISBN-10（9〜10桁）、ISBN-13・JAN（12〜13桁）、JAN-8（7〜8桁）に対応します。末尾のチェックデジットは省略できます。',
    copy: '補完後のコードをコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    resultHeading: '判定結果',
    statusValid: 'チェックデジットは正しいです。',
    statusInvalid:
      'チェックデジットが正しくありません。正しい値は {check} です。',
    statusCompleted: 'チェックデジットを計算しました（{check}）。',
    kindLabel: '種類',
    kinds: {
      isbn10: 'ISBN-10',
      ean13: 'ISBN-13 / JAN（EAN-13）',
      ean8: 'JAN-8（EAN-8）',
    },
    checkDigitLabel: '正しいチェックデジット',
    completedLabel: 'チェックデジット付きコード',
    isbn10Label: 'ISBN-10',
    isbn13Label: 'ISBN-13',
    noteLabel: '補足',
    noteIsbn978: '先頭が978のため、書籍のISBN-13として扱えます。',
    noteIsbn979: '先頭が979のISBN-13です。ISBN-10には変換できません。',
    noteJapanJan:
      '先頭が45または49のため、日本国内で割り当てられたJANコードです。',
    errors: {
      empty: 'コードを入力してください。',
      chars:
        '数字以外の文字が含まれています。ISBN-10の末尾に限り「X」を使えます。',
      length:
        '桁数が合いません。7〜8桁、9〜10桁、12〜13桁のいずれかで入力してください。',
    },
    notesHeading: '注意事項',
    notes: [
      'チェックデジットが正しくても、そのコードが実在する書籍や商品に割り当てられているとは限りません。入力ミスの検出のみが目的です。',
      '9桁・12桁・7桁の入力は、チェックデジットを持たないものとして末尾の1桁を計算します。10桁のISBN-10と13桁のISBN-13は、末尾を検証します。',
      '979始まりのISBN-13は、対応するISBN-10がありません。ISBN-13からISBN-10への変換は978始まりのみ可能です。',
      '出版社コードの区切り位置（ハイフンの位置）は国・出版者ごとの範囲表が必要なため、出力はハイフンなしです。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ISBN',
        description:
          '書籍を一意に識別する国際標準図書番号です。2007年以降は13桁（ISBN-13）が標準で、それ以前は10桁（ISBN-10）でした。',
      },
      {
        term: 'JANコード',
        description:
          '日本の商品に付ける標準のバーコード番号で、国際規格ではEANと呼ばれます。13桁と8桁があり、末尾の1桁がチェックデジットです。',
      },
      {
        term: 'チェックデジット',
        description:
          '他の桁から計算して末尾に付ける検査用の数字です。ISBN-10は重み10〜1の合計を11で割った余り、ISBN-13とJANは重み1と3を交互にかけた合計から求めます。',
      },
      {
        term: 'Bookland（978・979）',
        description:
          '書籍のISBNをEAN-13のバーコードで表すために割り当てられた接頭辞です。日本の出版物では978に続けて4（日本語圏を表す番号）が付くものが多くあります。',
      },
    ],
  },
  en: {
    title: 'ISBN & EAN-13 Check Digit Validator',
    description:
      'Validate or calculate check digits for ISBN-10, ISBN-13 and EAN-13/EAN-8 (JAN), and convert ISBN-10 to ISBN-13. Hyphens OK. Runs in your browser.',
    h1: 'ISBN and EAN-13 Check Digit Validator and Converter',
    introHtml:
      'Enter an ISBN or an EAN / JAN code to verify its check digit and convert between ISBN-10 and ISBN-13. If the last digit is missing, the tool calculates it for you. Hyphens and spaces are fine. Everything runs in your browser, and nothing you type is sent to a server. To turn a verified code into a barcode image, use the <a href="/en/tools/barcode-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Barcode Generator</a>.',
    inputLabel: 'ISBN or EAN / JAN code',
    inputPlaceholder: 'e.g. 978-0-306-40615-7 / 4901234567894',
    inputHint:
      'Accepts ISBN-10 (9-10 digits), ISBN-13 / EAN-13 (12-13 digits), and EAN-8 (7-8 digits). You can leave off the final check digit.',
    copy: 'Copy completed code',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    resultHeading: 'Result',
    statusValid: 'The check digit is correct.',
    statusInvalid: 'The check digit is wrong. It should be {check}.',
    statusCompleted: 'Check digit calculated: {check}.',
    kindLabel: 'Type',
    kinds: {
      isbn10: 'ISBN-10',
      ean13: 'ISBN-13 / EAN-13',
      ean8: 'EAN-8',
    },
    checkDigitLabel: 'Correct check digit',
    completedLabel: 'Code with check digit',
    isbn10Label: 'ISBN-10',
    isbn13Label: 'ISBN-13',
    noteLabel: 'Note',
    noteIsbn978: 'The 978 prefix means this can be used as a book ISBN-13.',
    noteIsbn979:
      'This is an ISBN-13 with the 979 prefix. It has no ISBN-10 equivalent.',
    noteJapanJan:
      'The 45 or 49 prefix means this code was allocated in Japan (JAN).',
    errors: {
      empty: 'Enter a code.',
      chars:
        'The input contains characters other than digits. Only the last character of an ISBN-10 may be "X".',
      length: 'The length does not match. Enter 7-8, 9-10, or 12-13 digits.',
    },
    notesHeading: 'Notes',
    notes: [
      'A valid check digit does not prove the code is assigned to a real book or product. It only catches typing errors.',
      'Inputs of 9, 12, or 7 digits are treated as missing the check digit, and the last digit is calculated. Inputs of 10 (ISBN-10) or 13 (ISBN-13) digits have their last digit verified.',
      'An ISBN-13 starting with 979 has no ISBN-10 equivalent. Converting ISBN-13 to ISBN-10 works only for the 978 prefix.',
      'Hyphen positions depend on registrant range tables per country and publisher, so the output is shown without hyphens.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'ISBN',
        description:
          'The International Standard Book Number that identifies a book edition. It has had 13 digits (ISBN-13) since 2007; earlier books used 10 digits (ISBN-10).',
      },
      {
        term: 'EAN / JAN',
        description:
          'The retail product barcode number (called JAN in Japan). It comes in 13-digit and 8-digit forms, and the last digit is the check digit.',
      },
      {
        term: 'Check digit',
        description:
          'A verification digit calculated from the other digits. ISBN-10 uses weights 10 to 1 with modulo 11; ISBN-13 and EAN use alternating weights of 1 and 3 with modulo 10.',
      },
      {
        term: 'Bookland (978 / 979)',
        description:
          'The prefixes reserved so that book ISBNs can be shown as EAN-13 barcodes. Only 978 has matching ISBN-10 numbers.',
      },
    ],
  },
};
