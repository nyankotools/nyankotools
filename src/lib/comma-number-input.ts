/** 数字文字列（カンマなし）の整数部を3桁区切りにする。符号・小数部はそのまま保持する。 */
export function formatNumberWithCommas(value: string): string {
  const trimmed = value.trim();
  if (trimmed === '') return '';

  const isNegative = trimmed.startsWith('-');
  const unsigned = isNegative ? trimmed.slice(1) : trimmed;

  const dotIndex = unsigned.indexOf('.');
  const rawIntegerPart =
    dotIndex === -1 ? unsigned : unsigned.slice(0, dotIndex);
  const integerPart = rawIntegerPart.replace(/[^0-9]/g, '');
  const decimalPart =
    dotIndex === -1
      ? ''
      : `.${unsigned.slice(dotIndex + 1).replace(/[^0-9]/g, '')}`;

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return `${isNegative ? '-' : ''}${formattedInteger}${decimalPart}`;
}

/** カンマ区切り表示の入力値から、Number() に渡せるカンマなし文字列を取り出す。 */
export function stripCommas(value: string): string {
  return value.replace(/,/g, '');
}

/**
 * type="text" の数値入力欄に、入力のたびに3桁カンマ区切り表示を適用する。
 * カーソル位置は末尾からの距離を基準に復元する（先頭側の桁数・カンマ数が変わっても違和感が出にくいため）。
 * 呼び出し側で値を数値化する際は Number(input.value) ではなく Number(stripCommas(input.value)) を使うこと。
 */
export function attachCommaFormatting(input: HTMLInputElement): void {
  input.addEventListener('input', () => {
    const cursorFromEnd =
      input.value.length - (input.selectionStart ?? input.value.length);
    const formatted = formatNumberWithCommas(stripCommas(input.value));
    input.value = formatted;
    const newPosition = Math.max(0, formatted.length - cursorFromEnd);
    input.setSelectionRange(newPosition, newPosition);
  });
}
