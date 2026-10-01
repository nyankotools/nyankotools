import { describe, expect, it } from 'vitest';
import { isBarcodeFormat, isValidBarcodeInput } from './barcode-generator';

describe('isBarcodeFormat', () => {
  it('対応規格のみ true', () => {
    expect(isBarcodeFormat('CODE128')).toBe(true);
    expect(isBarcodeFormat('QR')).toBe(false);
  });
});

describe('isValidBarcodeInput', () => {
  it('空文字は無効', () => {
    expect(isValidBarcodeInput('', 'CODE128')).toBe(false);
  });

  it('CODE128 は ASCII を受け付け、日本語は拒否する', () => {
    expect(isValidBarcodeInput('Hello-123', 'CODE128')).toBe(true);
    expect(isValidBarcodeInput('日本語', 'CODE128')).toBe(false);
  });

  it('EAN13 は12桁（チェックデジット自動付与）と正しい13桁を受け付ける', () => {
    expect(isValidBarcodeInput('490123456789', 'EAN13')).toBe(true);
    expect(isValidBarcodeInput('4901234567894', 'EAN13')).toBe(true);
    expect(isValidBarcodeInput('4901234567890', 'EAN13')).toBe(false);
    expect(isValidBarcodeInput('ABC', 'EAN13')).toBe(false);
  });

  it('EAN8 は7桁または正しい8桁', () => {
    expect(isValidBarcodeInput('1234567', 'EAN8')).toBe(true);
    expect(isValidBarcodeInput('12345', 'EAN8')).toBe(false);
  });

  it('UPC は11桁または正しい12桁', () => {
    expect(isValidBarcodeInput('12345678901', 'UPC')).toBe(true);
    expect(isValidBarcodeInput('1234', 'UPC')).toBe(false);
  });

  it('CODE39 は英数字と一部記号のみ（小文字は大文字化される）', () => {
    expect(isValidBarcodeInput('ABC-123', 'CODE39')).toBe(true);
    expect(isValidBarcodeInput('日本', 'CODE39')).toBe(false);
  });

  it('ITF は偶数桁の数字のみ', () => {
    expect(isValidBarcodeInput('1234', 'ITF')).toBe(true);
    expect(isValidBarcodeInput('123', 'ITF')).toBe(false);
  });
});
