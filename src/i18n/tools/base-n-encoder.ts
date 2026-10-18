import type { Locale } from '../../data/tools';

export interface BaseNEncoderContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeEncode: string;
  modeDecode: string;
  formatLabel: string;
  formatNames: {
    base16: string;
    base32: string;
    base58: string;
    base62: string;
    base85: string;
  };
  paddingLabel: string;
  uppercaseLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  inputPlaceholder: string;
  outputLabel: string;
  /** {char} と {pos} を置換する */
  errorInvalidChar: string;
  errorInvalidLength: string;
  errorOverflow: string;
  errorInvalidUtf8: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const baseNEncoderContent: Record<Locale, BaseNEncoderContent> = {
  ja: {
    title: 'Base32・Base58・Base62・Base85・16進 エンコード/デコード',
    description:
      'テキストをBase16（16進）・Base32・Base58・Base62・Base85に変換、または元に戻せる無料ツールです。不正な文字の位置も表示します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Base32・Base58・Base62・Base85・16進 エンコード/デコード',
    introHtml:
      '形式を選んでテキストを入力すると、自動で変換します。「デコード」に切り替えると、文字列を元のテキストに戻せます。Base64は<a href="/tools/base64/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Base64エンコード/デコード</a>、進数変換は<a href="/tools/base-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">進数変換</a>をご利用ください。',
    modeLabel: 'モード',
    modeEncode: 'エンコード',
    modeDecode: 'デコード',
    formatLabel: '形式',
    formatNames: {
      base16: 'Base16（16進）',
      base32: 'Base32',
      base58: 'Base58（Bitcoin）',
      base62: 'Base62',
      base85: 'Base85（Ascii85）',
    },
    paddingLabel: 'パディング（=）を付ける',
    uppercaseLabel: '大文字で出力する',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: '入力',
    inputPlaceholder: '変換したいテキストを入力',
    outputLabel: '結果',
    errorInvalidChar:
      '{pos}文字目の「{char}」はこの形式で使えない文字です。形式の選択と入力を確認してください。',
    errorInvalidLength:
      '文字数がこの形式として正しくありません。文字列が途中で切れていないか確認してください。',
    errorOverflow:
      '値が範囲を超えています。Base85として正しい文字列か確認してください。',
    errorInvalidUtf8:
      'デコードはできましたが、UTF-8のテキストとして読めないデータです。画像などのバイナリや、Shift_JISなど別の文字コードの可能性があります。',
    notesHeading: '注意事項',
    notes: [
      'これらは暗号化ではなく、誰でも元に戻せる変換です。パスワードなどの秘匿情報の保護には使えません。',
      'テキストはUTF-8のバイト列として扱います。日本語や絵文字も変換できますが、他の文字コードで作られたデータはデコード時にエラーになる場合があります。',
      'Base32はRFC 4648、Base58はBitcoin方式（0・O・I・lを除外）、Base85はAscii85（Adobe方式）です。Z85やBase58の他方式とは結果が異なります。',
      'Base58とBase62は巨大な数値への変換のため、数万文字を超える入力では時間がかかることがあります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Base32',
        description:
          'A-Zと2-7の32種類の文字でバイナリを表す方式です。大文字小文字の混同が起きにくく、ワンタイムパスワード（TOTP）の秘密鍵などに使われます。',
      },
      {
        term: 'Base58',
        description:
          '紛らわしい文字（0・O・I・l）と記号を除いた58種類の文字で表す方式です。ビットコインのアドレスなどに使われます。',
      },
      {
        term: 'Base62',
        description:
          '数字と英字の大文字・小文字（0-9, A-Z, a-z）の62種類だけを使う方式です。記号を含まないので、短縮URLのIDなどに向いています。',
      },
      {
        term: 'Base85（Ascii85）',
        description:
          '4バイトを5文字で表す方式で、Base64より出力が短くなります（約1.25倍）。PostScriptやPDFで使われます。',
      },
    ],
  },
  en: {
    title: 'Base32, Base58, Base62, Base85 & Hex Encoder/Decoder',
    description:
      'Encode text to Base16 (hex), Base32, Base58, Base62 or Base85, or decode it back. Pinpoints invalid characters. Runs in your browser; nothing is uploaded.',
    h1: 'Base32 / Base58 / Base62 / Base85 / Hex Encoder & Decoder',
    introHtml:
      'Pick a format and type or paste text to convert it instantly. Switch to "Decode" to turn an encoded string back into text. For Base64, use the <a href="/en/tools/base64/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Base64 Encoder/Decoder</a>; for number systems, try the <a href="/en/tools/base-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Base Converter</a>.',
    modeLabel: 'Mode',
    modeEncode: 'Encode',
    modeDecode: 'Decode',
    formatLabel: 'Format',
    formatNames: {
      base16: 'Base16 (hex)',
      base32: 'Base32',
      base58: 'Base58 (Bitcoin)',
      base62: 'Base62',
      base85: 'Base85 (Ascii85)',
    },
    paddingLabel: 'Add = padding',
    uppercaseLabel: 'Uppercase output',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabel: 'Input',
    inputPlaceholder: 'Enter text to convert',
    outputLabel: 'Result',
    errorInvalidChar:
      'Character {pos} ("{char}") is not valid in this format. Check the selected format and your input.',
    errorInvalidLength:
      'The length is not valid for this format. The string may be truncated.',
    errorOverflow:
      'A value is out of range. Check that this is a valid Base85 string.',
    errorInvalidUtf8:
      'Decoded successfully, but the data is not valid UTF-8 text. It may be binary data such as an image, or text in another encoding like Shift_JIS.',
    notesHeading: 'Notes',
    notes: [
      'These are encodings, not encryption. Anyone can reverse them, so they cannot protect passwords or other secrets.',
      'Text is handled as UTF-8 bytes, so Japanese characters and emoji work. Data made from another encoding may fail to decode.',
      'Base32 follows RFC 4648, Base58 uses the Bitcoin alphabet (no 0, O, I or l), and Base85 is Ascii85 (Adobe). Results differ from Z85 or other Base58 alphabets.',
      'Base58 and Base62 convert the data as one huge number, so inputs of tens of thousands of characters can be slow.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Base32',
        description:
          'Represents binary data with 32 characters (A-Z and 2-7). Case mix-ups are rare, and it is used for things like TOTP secret keys.',
      },
      {
        term: 'Base58',
        description:
          'Uses 58 characters, leaving out look-alikes (0, O, I, l) and symbols. Best known from Bitcoin addresses.',
      },
      {
        term: 'Base62',
        description:
          'Uses only digits and upper/lowercase letters (0-9, A-Z, a-z). With no symbols, it suits short URL IDs.',
      },
      {
        term: 'Base85 (Ascii85)',
        description:
          'Encodes 4 bytes as 5 characters, so output is shorter than Base64 (about 1.25x). Used in PostScript and PDF.',
      },
    ],
  },
};
