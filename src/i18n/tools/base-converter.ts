import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface BitWidthOption {
  value: 8 | 16 | 32 | 64;
  label: string;
}

export interface BaseConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  bitWidthLabel: string;
  bitWidthOptions: BitWidthOption[];
  binaryLabel: string;
  octalLabel: string;
  decimalLabel: string;
  hexLabel: string;
  binaryPlaceholder: string;
  octalPlaceholder: string;
  decimalPlaceholder: string;
  hexPlaceholder: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  errorInvalidBinary: string;
  errorInvalidOctal: string;
  errorInvalidDecimal: string;
  errorInvalidHex: string;
  /** `{bits}` `{max}` を置換して使うテンプレート */
  errorOutOfRangeUnsignedTemplate: string;
  /** `{bits}` `{min}` `{max}` を置換して使うテンプレート */
  errorOutOfRangeSignedTemplate: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const baseConverterContent: Record<Locale, BaseConverterPageContent> = {
  ja: {
    title: '進数変換ツール（2進数・8進数・10進数・16進数、2の補数対応）',
    description:
      '2進数・8進数・10進数・16進数の数値をリアルタイムに相互変換する無料ツールです。ビット幅（8/16/32/64bit）を選択でき、負数は2の補数表現で正しく変換されます。0x/0b/0oプレフィックスにも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '進数変換ツール',
    introHtml:
      'ビット幅（8/16/32/64bit）を選んでから、2進数・8進数・10進数・16進数のいずれかの欄に数値を入力すると、残りの3つの欄をリアルタイムに変換して表示します。負数は選択したビット幅の2の補数表現で変換されます（例: 8bitで10進数「-1」は2進数「11111111」・16進数「FF」）。10進数欄のみ先頭に「-」を付けた符号付き入力に対応し、2進数・8進数・16進数の欄はビットパターンそのもの（0x/0b/0oプレフィックス付き入力可）を表すため符号は使用しません。桁数の大きい数値も欠落なく変換されます。ビット演算の確認には <a href="/tools/cidr-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CIDR/サブネット計算機</a> もあわせてご利用ください。',
    bitWidthLabel: 'ビット幅',
    bitWidthOptions: [
      { value: 8, label: '8bit' },
      { value: 16, label: '16bit' },
      { value: 32, label: '32bit' },
      { value: 64, label: '64bit' },
    ],
    binaryLabel: '2進数（binary）',
    octalLabel: '8進数（octal）',
    decimalLabel: '10進数（decimal・符号付き）',
    hexLabel: '16進数（hex）',
    binaryPlaceholder: '11111111',
    octalPlaceholder: '377',
    decimalPlaceholder: '-1',
    hexPlaceholder: 'FF',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorInvalidBinary: '2進数として無効です（0と1のみ使用できます）',
    errorInvalidOctal: '8進数として無効です（0〜7のみ使用できます）',
    errorInvalidDecimal:
      '10進数として無効です（先頭の+/-以外は0〜9のみ使用できます）',
    errorInvalidHex: '16進数として無効です（0〜9、A〜Fのみ使用できます）',
    errorOutOfRangeUnsignedTemplate:
      '{bits}bitで表せる範囲（0〜{max}）を超えています。ビット幅を変更するか、値を小さくしてください。',
    errorOutOfRangeSignedTemplate:
      '{bits}bitの符号付き整数として表せる範囲（{min}〜{max}）を超えています。',
    notesHeading: '注意事項',
    notes: [
      '負数は選択したビット幅の2の補数表現で変換されます。10進数欄には符号付きの値（例: -1）を入力し、2進数・8進数・16進数の欄にはそのビット幅でのビットパターン（例: 8bitの-1は2進数「11111111」）が表示されます。',
      '2進数・8進数・16進数の欄には符号（+/-）を入力できません。これらの欄はビットパターンそのものを表すためです。10進数欄でのみ符号付きの値を入力できます。',
      'ビット幅を変更すると、符号付き整数として表せる範囲（例: 8bitなら-128〜127）も変わります。現在の10進数の値が新しいビット幅の範囲外になった場合はエラーが表示されるので、値を調整してください。',
      '内部的にBigIntを使用しているため、64bitの範囲の数値も欠落なく変換できます。',
      '入力には「0xFF」「0b1111」「0o17」のような進数プレフィックスを付けても構いません（変換結果の表示にはプレフィックスは付きません）。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '2進数（binary）',
        description:
          '0と1の2種類の数字だけで数値を表す方法。コンピュータが内部で扱うビット列そのものに対応します。',
      },
      {
        term: '8進数（octal）',
        description:
          '0〜7の8種類の数字で数値を表す方法。2進数3桁をまとめて1桁に対応させられ、UNIX系OSのファイルパーミッション（例: chmod 755）などで使われます。',
      },
      {
        term: '16進数（hexadecimal）',
        description:
          '0〜9とA〜Fの16種類の文字で数値を表す方法。2進数4桁をまとめて1桁に対応させられ、カラーコード（例: #FF0000）やメモリアドレスの表記などでよく使われます。',
      },
      {
        term: '2の補数（two’s complement）',
        description:
          'コンピュータが負の整数をビット列で表現する際に標準的に使われる方式です。あるビット幅（例: 8bit）において、負の値vは「2^ビット幅 + v」を計算したビットパターンで表されます。例えば8bitの場合、-1は「256 + (-1) = 255」つまり2進数で「11111111」になります。この方式では、そのままの足し算・引き算のビット演算で正しく加減算ができるという利点があります。',
      },
      {
        term: 'ビット幅（8/16/32/64bit）',
        description:
          '整数を何ビットの固定長で表現するかを表します。ビット幅によって表現できる符号付き整数の範囲が変わります（例: 8bitは-128〜127、16bitは-32768〜32767）。プログラミング言語の整数型（int8、int32など）のサイズに対応します。',
      },
      {
        term: 'BigInt',
        description:
          'JavaScriptで任意精度の整数を扱うためのデータ型。通常の数値型（Number）では正確に表現できない、非常に大きな整数も誤差なく扱えます。',
      },
    ],
  },
  en: {
    title: "Base Converter with Two's Complement (Binary, Octal, Decimal, Hex)",
    description:
      "Convert numbers between binary, octal, decimal, and hexadecimal in real time — free and works from any of the four fields. Choose a bit width (8/16/32/64-bit) and negative numbers convert correctly using two's complement. Supports 0x/0b/0o prefixes. Your data is processed in the browser and never sent to a server.",
    h1: 'Base Converter',
    introHtml:
      'Pick a bit width (8/16/32/64-bit), then type a number into any of the binary, octal, decimal, or hexadecimal fields, and the other three update instantly. Negative numbers convert using the two\'s complement representation for the selected bit width (e.g. with 8 bits, decimal "-1" becomes binary "11111111" and hex "FF"). Only the decimal field accepts a signed value with a leading "-"; the binary, octal, and hex fields represent the raw bit pattern itself (0x/0b/0o-prefixed input is accepted there) and have no sign. Large numbers convert without losing precision. If you also work with bitwise networking values, try the <a href="/en/tools/cidr-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CIDR / Subnet Calculator</a>.',
    bitWidthLabel: 'Bit width',
    bitWidthOptions: [
      { value: 8, label: '8-bit' },
      { value: 16, label: '16-bit' },
      { value: 32, label: '32-bit' },
      { value: 64, label: '64-bit' },
    ],
    binaryLabel: 'Binary',
    octalLabel: 'Octal',
    decimalLabel: 'Decimal (signed)',
    hexLabel: 'Hexadecimal',
    binaryPlaceholder: '11111111',
    octalPlaceholder: '377',
    decimalPlaceholder: '-1',
    hexPlaceholder: 'FF',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorInvalidBinary: 'Invalid binary number (only 0 and 1 are allowed)',
    errorInvalidOctal: 'Invalid octal number (only 0-7 are allowed)',
    errorInvalidDecimal:
      'Invalid decimal number (only a leading +/- and digits 0-9 are allowed)',
    errorInvalidHex:
      'Invalid hexadecimal number (only 0-9 and A-F are allowed)',
    errorOutOfRangeUnsignedTemplate:
      "This value doesn't fit in {bits} bits (0 to {max}). Choose a wider bit width or a smaller value.",
    errorOutOfRangeSignedTemplate:
      'This value is out of range for a signed {bits}-bit integer ({min} to {max}).',
    notesHeading: 'Notes',
    notes: [
      'Negative numbers are converted using two\'s complement for the selected bit width. Enter a signed value (e.g. -1) in the decimal field, and the binary, octal, and hex fields show the corresponding bit pattern for that width (e.g. -1 at 8 bits is binary "11111111").',
      "The binary, octal, and hex fields don't accept a sign (+/-), since they represent the raw bit pattern itself. Only the decimal field accepts a signed value.",
      'Changing the bit width also changes the range of values a signed integer can represent (e.g. -128 to 127 for 8 bits). If the current decimal value no longer fits the new bit width, an error is shown so you can adjust it.',
      'This tool uses BigInt internally, so values up to 64 bits convert without losing precision.',
      'You can prefix your input with "0xFF", "0b1111", or "0o17" — the converted results themselves are shown without a prefix.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Binary',
        description:
          'A base-2 number system using only the digits 0 and 1 — it maps directly to the bit patterns a computer works with internally.',
      },
      {
        term: 'Octal',
        description:
          'A base-8 number system using the digits 0-7. Each octal digit maps to exactly 3 binary digits, and it shows up in things like UNIX file permissions (e.g. chmod 755).',
      },
      {
        term: 'Hexadecimal',
        description:
          'A base-16 number system using the digits 0-9 and letters A-F. Each hex digit maps to exactly 4 binary digits, and it shows up in color codes (e.g. #FF0000) and memory addresses.',
      },
      {
        term: "Two's complement",
        description:
          'The standard way computers represent negative integers in bits. At a given bit width (e.g. 8 bits), a negative value v is represented by the bit pattern for "2^width + v". For example, at 8 bits, -1 is "256 + (-1) = 255", which is "11111111" in binary. This representation lets addition and subtraction work correctly using ordinary bitwise arithmetic.',
      },
      {
        term: 'Bit width (8/16/32/64-bit)',
        description:
          'How many bits are used to represent an integer in a fixed-length form. It determines the range a signed integer can hold (e.g. -128 to 127 at 8 bits, -32768 to 32767 at 16 bits) — matching integer types in programming languages such as int8 or int32.',
      },
      {
        term: 'BigInt',
        description:
          "JavaScript's data type for arbitrary-precision integers, letting you work with very large whole numbers that the regular Number type cannot represent exactly.",
      },
    ],
  },
};
