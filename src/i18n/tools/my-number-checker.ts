import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface MyNumberCheckerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  kindLabel: string;
  kindMyNumber: string;
  kindCorporate: string;
  inputLabelMyNumber: string;
  inputLabelCorporate: string;
  inputHintMyNumber: string;
  inputHintCorporate: string;
  placeholderMyNumber: string;
  placeholderCorporate: string;
  dummyButton: string;
  resultLabel: string;
  resultEmpty: string;
  /** 以下は {expected} {actual} {length} {digits} {digit} を置換して表示する */
  resultValid: string;
  resultInvalid: string;
  resultInvalidDetail: string;
  resultComputed: string;
  resultComputedDetail: string;
  resultInvalidChars: string;
  resultWrongLength: string;
  invoiceLabel: string;
  copyFull: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const myNumberCheckerContent: Record<
  Locale,
  MyNumberCheckerPageContent
> = {
  ja: {
    title: 'マイナンバー・法人番号チェックデジット検証',
    description:
      'マイナンバー（個人番号12桁）と法人番号（13桁・インボイス登録番号のT＋13桁）の検査用数字（チェックデジット）を検証・計算する無料ツールです。入力した番号はブラウザ内でのみ処理され、サーバーには送信されません。',
    h1: 'マイナンバー・法人番号チェックデジット検証',
    introHtml:
      'マイナンバー（個人番号）と法人番号の「検査用数字」（チェックデジット）が正しいかを確認します。桁の入力ミスや打ち間違いの検出、システム開発のテスト番号の作成確認に使えます。インボイス登録番号（T＋法人番号）もそのまま入力できます。入力した番号は端末の外へ送信されません。ランダムな文字列の生成は <a href="/tools/uuid-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">UUID生成</a> をご利用ください。',
    kindLabel: '番号の種類',
    kindMyNumber: 'マイナンバー（12桁）',
    kindCorporate: '法人番号（13桁）',
    inputLabelMyNumber: 'マイナンバー',
    inputLabelCorporate: '法人番号・インボイス登録番号',
    inputHintMyNumber:
      '12桁を入力すると検証します。11桁を入力すると、12桁目の検査用数字を計算します。',
    inputHintCorporate:
      '13桁（Tから始まるインボイス登録番号も可）を入力すると検証します。12桁を入力すると、先頭の検査用数字を計算します。',
    placeholderMyNumber: '例: 1234 5678 9018',
    placeholderCorporate: '例: 7000012050002',
    dummyButton: 'ダミーの番号を入れる',
    resultLabel: '判定結果',
    resultEmpty: '番号を入力すると、ここに結果が表示されます。',
    resultValid: '検査用数字（{digit}）は正しいです。',
    resultInvalid: '検査用数字が一致しません。',
    resultInvalidDetail:
      '入力された検査用数字は {actual}、計算結果は {expected} です。',
    resultComputed: '検査用数字は {digit} です。',
    resultComputedDetail: '完成した番号: {digits}',
    resultInvalidChars: '数字以外の文字が含まれています。',
    resultWrongLength:
      '{length}桁が入力されています。{expected}桁で入力してください。',
    invoiceLabel: 'インボイス登録番号: ',
    copyFull: '完成した番号をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      'このツールが確認するのは検査用数字（チェックデジット）の整合性だけです。番号が実在するか、誰のものか、現在有効かまでは確認できません。法人番号の存在確認は国税庁の法人番号公表サイトで行ってください。',
      '入力した番号は、ブラウザの中だけで計算します。サーバーへの送信・保存・履歴の記録は行いません。',
      '検査用数字が正しいことは、その番号が正規に発行されたことを意味しません。ほかの人のマイナンバーを入力・取得することは、番号法で厳しく制限されています。',
      'インボイス登録番号は「T」＋13桁の法人番号です。個人事業主の登録番号は法人番号とは別の13桁で、検査用数字の計算方法は法人番号と同じではない場合があるため、このツールの対象外です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '検査用数字（チェックデジット）',
        description:
          '番号の入力ミスを見つけるために、番号の一部から計算して付ける数字です。マイナンバーは末尾の1桁、法人番号は先頭の1桁が検査用数字で、1桁の打ち間違いや隣り合う桁の入れ替えのほとんどを検出できます。',
      },
      {
        term: 'マイナンバー（個人番号）と法人番号',
        description:
          'マイナンバーは住民票を持つ個人に付けられる12桁の番号で、税・社会保障・災害対策の手続きに使われます。法人番号は国税庁長官が法人などに付ける13桁の番号で、原則として誰でも公表サイトで確認できます。',
      },
    ],
  },
  en: {
    title: 'My Number & Corporate Number Check Digit Validator (Japan)',
    description:
      'Validate or calculate the check digit of a Japanese My Number or Corporate Number (including invoice numbers). Processed only in your browser.',
    h1: 'My Number & Corporate Number Check Digit Validator',
    introHtml:
      'Check whether the check digit of a Japanese My Number (individual number) or Corporate Number is correct. Use it to catch typos, or to confirm that test numbers you generate for software development are well formed. Invoice registration numbers (T + corporate number) can be pasted in as they are. The number never leaves your device. For random identifiers, see the <a href="/en/tools/uuid-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">UUID Generator</a>.',
    kindLabel: 'Number type',
    kindMyNumber: 'My Number (12 digits)',
    kindCorporate: 'Corporate Number (13 digits)',
    inputLabelMyNumber: 'My Number',
    inputLabelCorporate: 'Corporate Number / invoice registration number',
    inputHintMyNumber:
      'Enter 12 digits to validate. Enter 11 digits to calculate the 12th digit (the check digit).',
    inputHintCorporate:
      'Enter 13 digits (an invoice registration number starting with T also works) to validate. Enter 12 digits to calculate the leading check digit.',
    placeholderMyNumber: 'e.g. 1234 5678 9018',
    placeholderCorporate: 'e.g. 7000012050002',
    dummyButton: 'Insert a dummy number',
    resultLabel: 'Result',
    resultEmpty: 'Enter a number and the result appears here.',
    resultValid: 'The check digit ({digit}) is correct.',
    resultInvalid: 'The check digit does not match.',
    resultInvalidDetail:
      'The number has {actual}, but the calculated check digit is {expected}.',
    resultComputed: 'The check digit is {digit}.',
    resultComputedDetail: 'Complete number: {digits}',
    resultInvalidChars: 'The input contains characters other than digits.',
    resultWrongLength: 'You entered {length} digits. Enter {expected} digits.',
    invoiceLabel: 'Invoice registration number: ',
    copyFull: 'Copy the complete number',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'This tool only checks that the check digit is consistent. It cannot tell whether the number exists, who it belongs to, or whether it is currently valid. To confirm that a corporate number exists, use the National Tax Agency’s Corporate Number Publication Site.',
      'Numbers are calculated only inside your browser. Nothing is sent, stored or logged.',
      'A correct check digit does not mean the number was officially issued. Collecting or entering other people’s My Numbers is strictly restricted by Japanese law.',
      'An invoice registration number is "T" plus the 13-digit corporate number. Sole proprietors’ registration numbers are a separate 13-digit number whose check digit may not follow the corporate number rule, so they are out of scope.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Check digit',
        description:
          'A digit calculated from the rest of the number to catch entry errors. In a My Number it is the last digit, and in a Corporate Number it is the first. It detects almost all single-digit typos and swaps of neighboring digits.',
      },
      {
        term: 'My Number and Corporate Number',
        description:
          'The My Number is a 12-digit number assigned to each resident of Japan and used for tax, social security and disaster-response procedures. The Corporate Number is a 13-digit number assigned to corporations by the National Tax Agency, and anyone can look it up on the public site.',
      },
    ],
  },
};
