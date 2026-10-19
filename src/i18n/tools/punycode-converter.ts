import type { Locale } from '../../data/tools';

export interface PunycodeConverterContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  directionLabel: string;
  directionEncode: string;
  directionDecode: string;
  scopeLabel: string;
  scopeDomain: string;
  scopeRaw: string;
  copy: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  inputPlaceholderDomain: string;
  inputPlaceholderRaw: string;
  outputLabel: string;
  /** {char} を置換する */
  errorInvalidChar: string;
  errorInvalidInput: string;
  errorOverflow: string;
  errorLabelTooLong: string;
  errorDomainTooLong: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const punycodeConverterContent: Record<
  Locale,
  PunycodeConverterContent
> = {
  ja: {
    title: 'Punycode変換（日本語ドメイン⇔xn--）',
    description:
      '日本語ドメイン（IDN）をxn--形式のPunycodeに、またはPunycodeを日本語に戻せる無料ツールです。RFC 3492準拠。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Punycode変換（日本語ドメイン⇔xn--）',
    introHtml:
      '日本語などのドメイン名（国際化ドメイン名、IDN）を、DNSで使われる「xn--」形式のPunycodeに変換します。逆変換にも対応します。URL全体の変換は<a href="/tools/url-encode/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">URLエンコード/デコード</a>をご利用ください。',
    directionLabel: '変換方向',
    directionEncode: '日本語 → Punycode',
    directionDecode: 'Punycode → 日本語',
    scopeLabel: '対象',
    scopeDomain: 'ドメイン',
    scopeRaw: '文字列のみ',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: '入力',
    inputPlaceholderDomain: '例: 日本語.jp / xn--wgv71a119e.jp',
    inputPlaceholderRaw: '例: 日本語 / wgv71a119e',
    outputLabel: '結果',
    errorInvalidChar:
      '「{char}」はPunycodeとして使えない文字です。変換方向や対象の選択と、入力を確認してください。',
    errorInvalidInput:
      'Punycodeとして正しくない文字列です。途中で切れていないか確認してください。',
    errorOverflow:
      '値が範囲を超えています。Punycodeとして正しい文字列か確認してください。',
    errorLabelTooLong:
      'ラベル（ドットで区切られた1区間）が変換後に63文字を超えるため、ドメイン名として使えません。',
    errorDomainTooLong:
      'ドメイン全体が253文字を超えるため、ドメイン名として使えません。',
    howToHeading: '使い方',
    howToSteps: [
      '「変換方向」で「日本語 → Punycode」か「Punycode → 日本語」を選びます。',
      'ドメイン名をそのまま変換するなら「対象」で「ドメイン」を、ドットのない文字列だけを変換するなら「文字列のみ」を選びます。',
      '「入力」にドメインや文字列を入力すると、「結果」に表示されます。「コピー」で貼り付け用にコピーできます。',
    ],
    notesHeading: '注意事項',
    notes: [
      'ドメインの変換はドット（. 。 ．）で区切ったラベルごとに行い、日本語などを含むラベルだけに「xn--」を付けます。英数字だけのラベルはそのままです。',
      '日本語などを含むラベルは、変換前に全角英数を半角にし（NFKC）、英字を小文字にそろえます。ブラウザのIDN処理（UTS #46）を完全に再現するものではありません。',
      '「文字列のみ」は、RFC 3492のPunycode本体だけを扱い、「xn--」は付けません。',
      'ラベルは変換後63文字、ドメイン全体は253文字までです。超える場合はエラーになります。',
      '偽装サイトに使われる見た目の似た文字（ホモグラフ）の判定は行いません。不審なURLは「xn--」付きの表記で確認するのが安全です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Punycode',
        description:
          'Unicodeの文字列を、英数字とハイフンだけで表す符号化方式です（RFC 3492）。ドメイン名に日本語を使うときに利用されます。',
      },
      {
        term: 'IDN（国際化ドメイン名）',
        description:
          '日本語や中国語など、英数字以外の文字を含むドメイン名です。DNS上ではPunycodeに変換され、「xn--」で始まる形で扱われます。',
      },
      {
        term: 'xn--',
        description:
          'Punycodeに変換されたドメインのラベルを示す接頭辞（ACEプレフィックス）です。',
      },
    ],
  },
  en: {
    title: 'Punycode Converter - IDN to xn-- and Back',
    description:
      'Convert internationalized domain names (IDN) to xn-- Punycode and back (RFC 3492). Works on domains or raw strings. Runs in your browser; nothing is uploaded.',
    h1: 'Punycode Converter (IDN Domain to xn-- and Back)',
    introHtml:
      'Convert domain names with non-ASCII characters (internationalized domain names, IDN) to the "xn--" Punycode form used in DNS, or turn Punycode back into readable text. To encode a whole URL, use the <a href="/en/tools/url-encode/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">URL Encoder/Decoder</a>.',
    directionLabel: 'Direction',
    directionEncode: 'Unicode → Punycode',
    directionDecode: 'Punycode → Unicode',
    scopeLabel: 'Target',
    scopeDomain: 'Domain',
    scopeRaw: 'Raw string',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabel: 'Input',
    inputPlaceholderDomain: 'e.g. münchen.de / xn--mnchen-3ya.de',
    inputPlaceholderRaw: 'e.g. münchen / mnchen-3ya',
    outputLabel: 'Result',
    errorInvalidChar:
      '"{char}" is not valid in Punycode. Check the direction, the target and your input.',
    errorInvalidInput:
      'This is not valid Punycode. The string may be truncated.',
    errorOverflow:
      'A value is out of range. Check that this is valid Punycode.',
    errorLabelTooLong:
      'A label (the part between dots) is longer than 63 characters after conversion, so it cannot be used in a domain name.',
    errorDomainTooLong:
      'The whole domain is longer than 253 characters, so it cannot be used as a domain name.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose "Unicode → Punycode" or "Punycode → Unicode" under "Direction".',
      'Under "Target", pick "Domain" to convert a whole domain name, or "Raw string" to convert a single string without dots.',
      'Type or paste into "Input" and the converted text appears in "Result". Use "Copy" to copy it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Domains are converted label by label (split at dots, including the ideographic and fullwidth dots). Only labels with non-ASCII characters get the "xn--" prefix; plain ASCII labels are left as they are.',
      'Labels with non-ASCII characters are normalized to NFKC and lowercased first. This is not a complete implementation of the browser IDN rules (UTS #46).',
      '"Raw string" handles only the RFC 3492 Punycode itself and does not add "xn--".',
      'A label may be up to 63 characters and the whole domain up to 253 after conversion. Longer results are reported as errors.',
      'Look-alike (homograph) detection is not performed. For a suspicious URL, check its "xn--" form to be safe.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Punycode',
        description:
          'An encoding (RFC 3492) that represents Unicode text using only letters, digits and hyphens. It is how non-ASCII characters are put into domain names.',
      },
      {
        term: 'IDN (internationalized domain name)',
        description:
          'A domain name containing non-ASCII characters such as Japanese or Chinese. In DNS it is stored as Punycode starting with "xn--".',
      },
      {
        term: 'xn--',
        description:
          'The prefix (ACE prefix) that marks a domain label as Punycode-encoded.',
      },
    ],
  },
};
