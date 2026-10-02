import type { Locale } from '../../data/tools';

export interface EncodingConverterContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeConvert: string;
  modeDiagnose: string;
  fileLabel: string;
  fileHint: string;
  readFailed: string;
  sourceLabel: string;
  sourceAuto: string;
  /** {encoding} を置換 */
  detectedTemplate: string;
  detectedAscii: string;
  detectedUnknown: string;
  textLabel: string;
  textPlaceholder: string;
  /** {count} を置換 */
  invalidBytesTemplate: string;
  targetLabel: string;
  bomLabel: string;
  lineEndingLabel: string;
  lineEndingKeep: string;
  filenameLabel: string;
  downloadButton: string;
  /** {chars} {encoding} を置換 */
  unmappableTemplate: string;
  encodingLabels: Record<
    'utf-8' | 'shift_jis' | 'euc-jp' | 'iso-2022-jp' | 'utf-16le' | 'utf-16be',
    string
  >;
  diagnoseInputLabel: string;
  diagnoseInputPlaceholder: string;
  diagnoseResultHeading: string;
  /** {actual} {misread} を置換 */
  diagnoseCandidateTemplate: string;
  diagnoseNone: string;
  diagnoseEmptyHint: string;
  windows1252Label: string;
  copy: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

const linkClass =
  'class="text-blue-700 underline hover:no-underline dark:text-blue-400"';

export const encodingConverterContent: Record<
  Locale,
  EncodingConverterContent
> = {
  ja: {
    title: '文字コード変換・文字化け診断（Shift-JIS/EUC-JP/UTF-8）',
    description:
      'テキストファイルの文字コードを自動判定し、Shift_JIS・EUC-JP・UTF-8・ISO-2022-JP・UTF-16の間で変換できる無料ツールです。文字化けしたテキストの原因診断と復元にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '文字コード変換・文字化け診断',
    introHtml: `テキストファイルを選ぶと文字コードを自動判定して中身を表示し、Shift_JIS・EUC-JP・UTF-8などに変換してダウンロードできます。「文字化け診断」では、文字化けしたテキストを貼り付けるだけで元に戻せるか調べます。改行コードの統一には<a href="/tools/line-ending-converter/" ${linkClass}>改行コード変換</a>、URL用の変換には<a href="/tools/url-encode/" ${linkClass}>URLエンコード/デコード</a>もご利用ください。`,
    modeLabel: 'モード',
    modeConvert: 'ファイル変換',
    modeDiagnose: '文字化け診断',
    fileLabel: 'テキストファイル',
    fileHint:
      'CSV・テキスト・ログなどのファイルを選択、またはここにドラッグ＆ドロップしてください（ブラウザ内で処理され、アップロードされません）',
    readFailed: 'ファイルを読み込めませんでした。',
    sourceLabel: '読み込む文字コード',
    sourceAuto: '自動判定',
    detectedTemplate: '判定結果: {encoding}',
    detectedAscii: '判定結果: ASCIIのみ（どの文字コードでも同じ内容です）',
    detectedUnknown:
      '判定結果: 確定できませんでした（近い候補で表示しています。上の選択で切り替えてください）',
    textLabel: 'テキスト（直接編集・貼り付けもできます）',
    textPlaceholder:
      'ファイルを選ぶとここに内容が表示されます。テキストを直接入力して変換することもできます。',
    invalidBytesTemplate:
      'この文字コードでは読めないバイトが{count}か所あり、「�」に置き換わっています。別の文字コードを試してください。',
    targetLabel: '変換後の文字コード',
    bomLabel: 'BOMを付ける',
    lineEndingLabel: '改行コード',
    lineEndingKeep: '元のファイルのまま',
    filenameLabel: '保存するファイル名',
    downloadButton: '変換してダウンロード',
    unmappableTemplate:
      '{encoding}では表現できない文字（{chars}）は「?」に置き換わります。',
    encodingLabels: {
      'utf-8': 'UTF-8',
      shift_jis: 'Shift_JIS（CP932）',
      'euc-jp': 'EUC-JP',
      'iso-2022-jp': 'ISO-2022-JP（JIS）',
      'utf-16le': 'UTF-16LE',
      'utf-16be': 'UTF-16BE',
    },
    diagnoseInputLabel: '文字化けしたテキスト',
    diagnoseInputPlaceholder: '例: 縺薙ｓ縺ｫ縺｡縺ｯ',
    diagnoseResultHeading: '復元候補',
    diagnoseCandidateTemplate:
      '{actual}のデータを{misread}として読んでしまった可能性',
    diagnoseNone:
      '復元候補が見つかりませんでした。化けた文字を欠けなくコピーできているか、元の文字コードが特殊でないか確認してください。',
    diagnoseEmptyHint: '文字化けしたテキストを貼り付けると診断します。',
    windows1252Label: 'Latin-1（Windows-1252）',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '文字コードの自動判定は推測です。Shift_JISとEUC-JPなど、短いテキストでは区別できない場合があります。結果がおかしいときは「読み込む文字コード」を手動で選んでください。',
      'UTF-8をShift_JISなどで読んだ文字化けは、読み取り時に一部のバイトが失われて「�」になっていると完全には復元できません（読める部分だけを復元し、失われた部分は「�」のまま残します）。可能なら、文字化けする前の元ファイルをこのツールに直接読み込ませてください。',
      'Shift_JISはWindows標準のCP932として扱うため、①などの機種依存文字や「〜」「～」も変換できます。一方、絵文字などSJIS/EUC-JPにない文字は「?」に置き換わります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '文字コード',
        description:
          '文字をコンピューター上の数値（バイト列）で表すための取り決めです。日本語ではUTF-8、Shift_JIS、EUC-JPなどが使われ、保存時と読み込み時で文字コードが食い違うと文字化けが起こります。',
      },
      {
        term: 'Shift_JIS / EUC-JP / UTF-8',
        description:
          'Shift_JIS（SJIS）はWindowsの古いソフトやCSVでよく使われる日本語向けの文字コード、EUC-JPはUnix系システムで使われた日本語向けの文字コード、UTF-8は世界中の文字を扱える現在の標準です。Webサイトや新しいシステムはほぼUTF-8です。',
      },
      {
        term: 'BOM（バイトオーダーマーク）',
        description:
          'ファイルの先頭に付ける、文字コードを示す目印のバイト列です。ExcelでUTF-8のCSVを文字化けなく開くにはBOM付きにすると効果的ですが、プログラムによってはBOMがあると誤動作することがあります。',
      },
      {
        term: '文字化け',
        description:
          '本来と異なる文字コードで解釈したために、意味のない文字が表示される現象です。例えばUTF-8のテキストをShift_JISとして読むと「縺薙ｓ縺ｫ縺｡縺ｯ」のような文字列になります。',
      },
    ],
  },
  en: {
    title: 'Encoding Converter & Mojibake Fixer (Shift-JIS/EUC-JP/UTF-8)',
    description:
      'Detect and convert text encoding between Shift_JIS, EUC-JP, UTF-8, ISO-2022-JP and UTF-16, and diagnose mojibake. Runs in your browser; nothing is uploaded.',
    h1: 'Character Encoding Converter & Mojibake Fixer',
    introHtml: `Choose a text file to auto-detect its encoding, preview the contents, and download it converted to Shift_JIS, EUC-JP, UTF-8 and more. Use "Mojibake fixer" to paste garbled Japanese text and see whether it can be restored. To normalize newlines, try the <a href="/en/tools/line-ending-converter/" ${linkClass}>Line Ending Converter</a>; for percent-encoding, see the <a href="/en/tools/url-encode/" ${linkClass}>URL Encoder/Decoder</a>.`,
    modeLabel: 'Mode',
    modeConvert: 'Convert file',
    modeDiagnose: 'Mojibake fixer',
    fileLabel: 'Text file',
    fileHint:
      'Choose a CSV, text or log file, or drag and drop it here. It is processed in your browser and never uploaded.',
    readFailed: 'Could not read the file.',
    sourceLabel: 'Read as',
    sourceAuto: 'Auto-detect',
    detectedTemplate: 'Detected: {encoding}',
    detectedAscii: 'Detected: ASCII only (identical in every encoding)',
    detectedUnknown:
      'Detected: could not be determined (showing the closest match — pick another encoding above if it looks wrong)',
    textLabel: 'Text (you can also edit or paste directly)',
    textPlaceholder:
      'The file contents appear here. You can also type or paste text to convert it.',
    invalidBytesTemplate:
      '{count} byte sequence(s) cannot be read in this encoding and were replaced with "�". Try a different encoding.',
    targetLabel: 'Convert to',
    bomLabel: 'Add BOM',
    lineEndingLabel: 'Line endings',
    lineEndingKeep: 'Same as source file',
    filenameLabel: 'File name',
    downloadButton: 'Convert & download',
    unmappableTemplate:
      'Characters that cannot be represented in {encoding} ({chars}) will be replaced with "?".',
    encodingLabels: {
      'utf-8': 'UTF-8',
      shift_jis: 'Shift_JIS (CP932)',
      'euc-jp': 'EUC-JP',
      'iso-2022-jp': 'ISO-2022-JP (JIS)',
      'utf-16le': 'UTF-16LE',
      'utf-16be': 'UTF-16BE',
    },
    diagnoseInputLabel: 'Garbled text',
    diagnoseInputPlaceholder: 'e.g. 縺薙ｓ縺ｫ縺｡縺ｯ',
    diagnoseResultHeading: 'Possible fixes',
    diagnoseCandidateTemplate: '{actual} data that was read as {misread}',
    diagnoseNone:
      'No fix found. Make sure the garbled text was copied completely, and that the original encoding is not an unusual one.',
    diagnoseEmptyHint: 'Paste garbled text to diagnose it.',
    windows1252Label: 'Latin-1 (Windows-1252)',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Encoding detection is a best guess. Short texts may be ambiguous, e.g. between Shift_JIS and EUC-JP. If the result looks wrong, choose the "Read as" encoding manually.',
      'When UTF-8 was misread as Shift_JIS or similar, some bytes are lost and appear as "�", so the text cannot be restored completely — readable parts are recovered and lost parts stay as "�". If possible, load the original, un-garbled file directly into this tool instead.',
      'Shift_JIS is handled as Windows CP932, so characters like ① and the wave dash convert fine. Characters that do not exist in SJIS/EUC-JP, such as emoji, are replaced with "?".',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Character encoding',
        description:
          'A rule for representing characters as numbers (bytes). Japanese text commonly uses UTF-8, Shift_JIS or EUC-JP. If the encoding used when saving differs from the one used when reading, the text becomes garbled.',
      },
      {
        term: 'Shift_JIS / EUC-JP / UTF-8',
        description:
          "Shift_JIS (SJIS) is a Japanese encoding common in older Windows software and CSV files. EUC-JP was used on Unix-like systems. UTF-8 can represent characters from every language and is today's standard for websites and modern systems.",
      },
      {
        term: 'BOM (byte order mark)',
        description:
          'A short byte sequence at the start of a file that hints at its encoding. Adding a BOM helps Excel open UTF-8 CSV files correctly, but some programs misbehave when a BOM is present.',
      },
      {
        term: 'Mojibake',
        description:
          'Garbled, meaningless characters that appear when text is read with a different encoding than it was written in. For example, UTF-8 Japanese read as Shift_JIS turns into strings like 縺薙ｓ縺ｫ縺｡縺ｯ.',
      },
    ],
  },
};
