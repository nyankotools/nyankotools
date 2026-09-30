import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface UrlEncodePageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeEncode: string;
  modeDecode: string;
  copy: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  inputPlaceholder: string;
  outputLabel: string;
  decodeError: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const urlEncodeContent: Record<Locale, UrlEncodePageContent> = {
  ja: {
    title: 'URLエンコード/デコード',
    description:
      'テキストやURLをパーセントエンコード形式に変換したり、エンコードされた文字列を元に戻したりできる無料ツールです。クエリパラメータの日本語などマルチバイト文字にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'URLエンコード/デコード',
    introHtml:
      'テキストを入力すると自動でパーセントエンコード（%XX形式）に変換します。エンコードされた文字列を元のテキストに戻したい場合は「デコード」を選んでください。クエリパラメータに日本語や記号を含めたい場合などにご利用いただけます。Base64形式への変換が必要な場合は <a href="/tools/base64/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Base64エンコード/デコード</a> もあわせてご利用ください。',
    modeLabel: 'モード',
    modeEncode: 'エンコード',
    modeDecode: 'デコード',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: '入力',
    inputPlaceholder: '変換したいテキストを入力',
    outputLabel: '結果',
    decodeError:
      'URLエンコード文字列として解釈できませんでした。%XX形式が正しいか確認してください。',
    notesHeading: '注意事項',
    notes: [
      'パーセントエンコード（%XX形式）に変換します。スペースは「%20」になり、フォーム送信で使われる「+」にはなりません。',
      'URL全体ではなく、クエリパラメータの値などの必要な部分だけをエンコードしてください。全体をエンコードすると「:」や「/」も変換され、URLとして機能しなくなります。',
      '文字はUTF-8としてエンコードされます。他の文字コード（Shift_JISなど）を前提とするシステムでは、結果が異なる場合があります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'パーセントエンコーディング',
        description:
          'URLに直接含められない文字（日本語や一部の記号など）を「%」に続く2桁の16進数で表す変換方式です。「URLエンコード」とも呼ばれます。',
      },
      {
        term: 'クエリパラメータ',
        description:
          'URLの「?」以降に付与される、key=value形式のパラメータです。日本語や記号を含める場合はパーセントエンコーディングが必要になります。',
      },
    ],
  },
  en: {
    title: 'URL Encoder/Decoder',
    description:
      'A free tool that percent-encodes text or URLs, or decodes an encoded string back to the original text, with full support for multibyte characters in query parameters. Your data is processed in the browser and never sent to a server.',
    h1: 'URL Encoder / Decoder',
    introHtml:
      'Type or paste text below to automatically percent-encode it (%XX format). Switch to "Decode" to convert an encoded string back to text. Handy when you need to include non-ASCII characters or symbols in a query parameter. Need to convert to Base64 instead? Try the <a href="/en/tools/base64/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Base64 Encoder/Decoder</a>.',
    modeLabel: 'Mode',
    modeEncode: 'Encode',
    modeDecode: 'Decode',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabel: 'Input',
    inputPlaceholder: 'Enter text to convert',
    outputLabel: 'Result',
    decodeError:
      'Could not decode this string as a URL-encoded value. Please check the %XX format.',
    notesHeading: 'Notes',
    notes: [
      'Text is percent-encoded (%XX). A space becomes "%20", not the "+" used in form submissions.',
      'Encode only the parts you need, such as query parameter values, not the entire URL. Encoding everything also converts ":" and "/" and breaks the URL.',
      'Characters are encoded as UTF-8. Systems that expect another encoding, such as Shift_JIS, may need a different result.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Percent-encoding',
        description:
          'A way to represent characters that cannot appear directly in a URL (such as non-ASCII characters or certain symbols) as "%" followed by two hex digits. Also known as "URL encoding."',
      },
      {
        term: 'Query parameter',
        description:
          'A key=value pair appended after the "?" in a URL. Non-ASCII characters or symbols in a query parameter need percent-encoding.',
      },
    ],
  },
};
