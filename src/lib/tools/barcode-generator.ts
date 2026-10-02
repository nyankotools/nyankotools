import JsBarcode from 'jsbarcode';

export const barcodeFormats = [
  'CODE128',
  'EAN13',
  'EAN8',
  'UPC',
  'CODE39',
  'ITF',
] as const;

export type BarcodeFormat = (typeof barcodeFormats)[number];

export function isBarcodeFormat(value: string): value is BarcodeFormat {
  return (barcodeFormats as readonly string[]).includes(value);
}

/** 指定した規格でそのテキストをバーコード化できるかを判定する（DOM不要） */
export function isValidBarcodeInput(
  text: string,
  format: BarcodeFormat,
): boolean {
  if (text === '') return false;
  let valid = false;
  try {
    JsBarcode({}, text, { format, valid: (v: boolean) => (valid = v) });
  } catch {
    return false;
  }
  return valid;
}

export interface BarcodeRenderOptions {
  format: BarcodeFormat;
  /** 1本の最小バーの幅（px） */
  width: number;
  /** バーの高さ（px） */
  height: number;
  displayValue: boolean;
}

/** canvas にバーコードを描画する。入力が規格に合わなければ false（描画しない） */
export function renderBarcode(
  canvas: HTMLCanvasElement,
  text: string,
  options: BarcodeRenderOptions,
): boolean {
  if (!isValidBarcodeInput(text, options.format)) return false;
  JsBarcode(canvas, text, {
    ...options,
    margin: 16,
    background: '#ffffff',
    lineColor: '#000000',
    fontSize: 18,
  });
  return true;
}
