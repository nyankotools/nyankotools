import type { Locale } from '../../data/tools';

export interface ByteLengthCounterContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  statUtf8: string;
  statShiftJis: string;
  statUtf16: string;
  statCharacters: string;
  unit: string;
  optionsHeading: string;
  bomLabel: string;
  newlineLabel: string;
  newlineKeep: string;
  newlineLf: string;
  newlineCrlf: string;
  unmappableLabel: string;
  limitHeading: string;
  limitDescription: string;
  limitEncodingLabel: string;
  limitLabel: string;
  limitUsedLabel: string;
  limitRemainingLabel: string;
  limitOverLabel: string;
  limitOkMessage: string;
  /** {n} = 超過が始まる文字位置（1始まり） */
  limitOverMessage: string;
  limitFitLabel: string;
  limitOverTextLabel: string;
  notesHeading: string;
  notes: string[];
}

export const byteLengthCounterContent: Record<
  Locale,
  ByteLengthCounterContent
> = {
  ja: {
    title: 'バイト数カウント（UTF-8・Shift_JIS・UTF-16）',
    description:
      '文字列のバイト数をUTF-8・Shift_JIS・UTF-16で数え、上限を指定して超過位置も表示する無料ツールです。DBカラムやAPI、SMSの確認に。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'バイト数カウント（UTF-8・Shift_JIS・UTF-16）',
    introHtml:
      '文字列を入力すると、UTF-8・Shift_JIS・UTF-16で保存したときのバイト数をリアルタイムで表示します。DBカラムのバイト長、APIの文字列上限、SMSの長さ制限などの確認にご利用ください。上限バイト数を指定すると、どの文字から超過するかも確認できます。文字数や単語数は<a href="/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字数カウント</a>、文字コードの変換は<a href="/tools/encoding-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字コード変換</a>をご利用ください。入力した内容はブラウザ内で処理され、サーバーに送信されることはありません。',
    inputLabel: 'バイト数を数えるテキスト',
    inputPlaceholder: 'ここにテキストを入力してください',
    statUtf8: 'UTF-8',
    statShiftJis: 'Shift_JIS',
    statUtf16: 'UTF-16',
    statCharacters: '文字数',
    unit: 'バイト',
    optionsHeading: '数え方の設定',
    bomLabel: 'BOMを含める（UTF-8は3バイト、UTF-16は2バイト）',
    newlineLabel: '改行',
    newlineKeep: '入力のまま',
    newlineLf: 'LFに統一',
    newlineCrlf: 'CRLFに統一',
    unmappableLabel: 'Shift_JISで表現できない文字（「?」1バイトとして計算）:',
    limitHeading: '上限バイト数のチェック',
    limitDescription:
      '文字コードと上限バイト数を指定すると、上限に収まる範囲と、超過が始まる位置を表示します。',
    limitEncodingLabel: '文字コード',
    limitLabel: '上限（バイト）',
    limitUsedLabel: '使用バイト数',
    limitRemainingLabel: '残り',
    limitOverLabel: '超過',
    limitOkMessage: '上限に収まっています。',
    limitOverMessage: '{n}文字目から上限を超えます。',
    limitFitLabel: '収まる部分',
    limitOverTextLabel: '超過する部分',
    notesHeading: '注意事項',
    notes: [
      'UTF-8は1文字を1〜4バイト（ASCIIは1、ひらがな・漢字は3、絵文字は4）、UTF-16は2または4バイトで数えます。BOMを含めるかどうかは設定で切り替えられます。',
      'Shift_JISは半角英数字・半角カナを1バイト、全角文字を2バイトで数えます。Shift_JISで表現できない文字（絵文字や一部の記号・外字など）は、実際の変換と同様に「?」（1バイト）に置き換わるものとして数え、一覧に表示します。',
      'Shift_JISはWindows由来のCP932（Microsoft拡張）に近い対応表で数えます。DBやシステムによっては異なる変換になり、バイト数が変わる場合があります。',
      'UTF-16はBOMなしで、文字数に関わらず2バイトまたは4バイト（サロゲートペア）で数えます。LE/BEでバイト数は変わりません。',
      '文字数は見た目の文字ではなくUnicodeのコードポイント単位で数えます。組み合わせ絵文字などは複数文字として数えられます。',
      '改行はテキスト欄ではLFで入力されます。ファイルやAPIでCRLFが使われる場合は、設定で「CRLFに統一」を選ぶと改行が2バイトとして数えられます。',
      'MySQLのVARCHAR(n)のようにバイトではなく文字数で制限する環境もあります。上限がバイトか文字かを、利用するシステムの仕様で確認してください。',
    ],
  },
  en: {
    title: 'Byte Length Counter: UTF-8, Shift_JIS & UTF-16',
    description:
      'Free byte length counter: count a string in UTF-8, Shift_JIS and UTF-16, set a byte limit and see where it is exceeded. Runs in your browser.',
    h1: 'Byte Length Counter (UTF-8, Shift_JIS, UTF-16)',
    introHtml:
      'Type or paste text to see how many bytes it takes in UTF-8, Shift_JIS and UTF-16, updated live. Use it to check database column sizes, API string limits or SMS length limits. Enter a byte limit and the tool shows exactly which character pushes the text over it. For character and word counts, use the <a href="/en/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Character Counter</a>; to convert between encodings, use the <a href="/en/tools/encoding-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Character Encoding Converter</a>. Your text is processed in the browser and never sent to a server.',
    inputLabel: 'Text to measure',
    inputPlaceholder: 'Type or paste your text here',
    statUtf8: 'UTF-8',
    statShiftJis: 'Shift_JIS',
    statUtf16: 'UTF-16',
    statCharacters: 'Characters',
    unit: 'bytes',
    optionsHeading: 'Counting options',
    bomLabel: 'Include a BOM (3 bytes in UTF-8, 2 in UTF-16)',
    newlineLabel: 'Line breaks',
    newlineKeep: 'As typed',
    newlineLf: 'Normalize to LF',
    newlineCrlf: 'Normalize to CRLF',
    unmappableLabel:
      'Characters Shift_JIS cannot represent (counted as a 1-byte "?"):',
    limitHeading: 'Byte limit check',
    limitDescription:
      'Choose an encoding and a byte limit to see the part that fits and the point where the text goes over.',
    limitEncodingLabel: 'Encoding',
    limitLabel: 'Limit (bytes)',
    limitUsedLabel: 'Bytes used',
    limitRemainingLabel: 'Remaining',
    limitOverLabel: 'Over by',
    limitOkMessage: 'The text fits within the limit.',
    limitOverMessage: 'The text goes over the limit at character {n}.',
    limitFitLabel: 'Part that fits',
    limitOverTextLabel: 'Part over the limit',
    notesHeading: 'Notes',
    notes: [
      'UTF-8 uses 1 to 4 bytes per character (1 for ASCII, 3 for hiragana and kanji, 4 for emoji); UTF-16 uses 2 or 4. You can choose whether a BOM is included.',
      'Shift_JIS counts half-width letters, digits and half-width katakana as 1 byte and full-width characters as 2. Characters Shift_JIS cannot represent (emoji, some symbols and rare kanji) are counted as a replacement "?" (1 byte), as an actual conversion would do, and listed below the counts.',
      'Shift_JIS is counted with a table close to Windows CP932 (the Microsoft extension). Some databases and systems convert differently, so the byte count can differ.',
      'UTF-16 is counted without a BOM by default, as 2 bytes, or 4 bytes for a surrogate pair. Little-endian and big-endian give the same length.',
      'Characters are counted as Unicode code points, not visible glyphs, so emoji built from several code points count as multiple characters.',
      'The text box uses LF for line breaks. If your file or API uses CRLF, choose "Normalize to CRLF" so each line break counts as 2 bytes.',
      'Some systems, such as MySQL VARCHAR(n), limit characters rather than bytes. Check whether your limit is in bytes or characters.',
    ],
  },
};
