import { describe, expect, it } from 'vitest';
import { generateQrMatrix } from './qr-generator';

describe('generateQrMatrix', () => {
  it('空文字列の場合はエラーを返す', () => {
    const result = generateQrMatrix('');
    expect(result.ok).toBe(false);
  });

  it('短いテキストからQRコードのマトリクスを生成できる', () => {
    const result = generateQrMatrix('https://nyankotools.com');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.matrix.moduleCount).toBeGreaterThan(0);
    // バージョン1〜40のモジュール数は 21, 25, 29, ... (4n+17) の等差数列
    expect((result.matrix.moduleCount - 17) % 4).toBe(0);
  });

  it('誤り訂正レベルが高いほど必要なモジュール数が同じか多くなる', () => {
    const text = 'A'.repeat(200);
    const low = generateQrMatrix(text, 'L');
    const high = generateQrMatrix(text, 'H');
    expect(low.ok).toBe(true);
    expect(high.ok).toBe(true);
    if (!low.ok || !high.ok) return;
    expect(high.matrix.moduleCount).toBeGreaterThanOrEqual(
      low.matrix.moduleCount,
    );
  });

  it('日本語（マルチバイト文字）を正しくエンコードできる', () => {
    const result = generateQrMatrix('こんにちは、世界！');
    expect(result.ok).toBe(true);
  });

  it('容量を超える長さのテキストはエラーを返す', () => {
    const result = generateQrMatrix('A'.repeat(5000), 'H');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe('too-long');
  });

  it('isDarkは指定した行・列の範囲内で真偽値を返す', () => {
    const result = generateQrMatrix('test');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const { moduleCount, isDark } = result.matrix;
    // 3つのファインダーパターンの中心はいずれも黒になる
    expect(isDark(3, 3)).toBe(true);
    expect(typeof isDark(moduleCount - 1, moduleCount - 1)).toBe('boolean');
  });
});
