import type { Locale } from '../../data/tools';

export interface Base64PageContent {
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
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const base64Content: Record<Locale, Base64PageContent> = {
  ja: {
    title: 'Base64エンコード/デコード',
    description:
      'テキストをBase64形式に変換したり、Base64文字列を元のテキストに戻したりできる無料ツールです。日本語などのマルチバイト文字にも対応しています。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Base64エンコード/デコード',
    introHtml:
      'テキストを入力すると自動でBase64にエンコードします。Base64文字列を元のテキストに戻したい場合は「デコード」を選んでください。JSONデータの整形が必要な場合は<a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a>、クエリパラメータの変換には<a href="/tools/url-encode/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">URLエンコード/デコード</a>もあわせてご利用ください。',
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
      'Base64として解釈できませんでした。文字列が正しいBase64形式か確認してください。',
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Base64',
        description:
          'バイナリデータを、英数字と一部の記号（A-Z, a-z, 0-9, +, /, =）のみの文字列に変換するエンコード方式です。メール添付やJSON内への画像埋め込みなど、テキストしか扱えない環境でデータをやり取りする際に使われます。',
      },
      {
        term: 'エンコード／デコード',
        description:
          'エンコードはデータを別の形式に変換すること、デコードはその変換を元に戻すことです。Base64エンコードは暗号化ではなく、誰でも簡単に元のデータへ戻せる（デコードできる）ため、秘匿したい情報の保護には使えません。',
      },
    ],
  },
  en: {
    title: 'Base64 Encoder/Decoder',
    description:
      'A free tool that encodes text to Base64 or decodes Base64 back to the original text, with full support for multibyte characters. Your data is processed in the browser and never sent to a server.',
    h1: 'Base64 Encoder / Decoder',
    introHtml:
      'Type or paste text below to automatically encode it to Base64. Switch to "Decode" to convert a Base64 string back to text. Need to format JSON instead? Try the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a>. For converting query parameters, check out the <a href="/en/tools/url-encode/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">URL Encoder/Decoder</a>.',
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
      'Could not decode this string as Base64. Please check the format.',
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Base64',
        description:
          'An encoding scheme that converts binary data into a string using only letters, digits, and a few symbols (A-Z, a-z, 0-9, +, /, =). Commonly used to embed binary data, such as images, in text-only formats like email or JSON.',
      },
      {
        term: 'Encode / Decode',
        description:
          'Encoding converts data into another format; decoding reverses that conversion. Base64 encoding is not encryption — anyone can decode it back to the original data, so it does not protect sensitive information.',
      },
    ],
  },
};
