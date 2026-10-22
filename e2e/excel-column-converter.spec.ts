import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('Excel列変換: アクセシビリティ', () => {
  test('初期表示でaxeのWCAG 2.1 A/AA違反がない（ja/en）', async ({ page }) => {
    for (const path of [
      '/tools/excel-column-converter/',
      '/en/tools/excel-column-converter/',
    ]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        results.violations.map((v) => v.id),
        path,
      ).toEqual([]);
    }
  });
});

test.describe('Excel列番号⇔列記号変換ツール', () => {
  test('列記号から列番号に変換できる', async ({ page }) => {
    await page.goto('/tools/excel-column-converter/');
    await page.locator('#excel-col-letters').fill('az');
    await expect(page.locator('#excel-col-number')).toHaveValue('52');
  });

  test('列番号から列記号に変換できる', async ({ page }) => {
    await page.goto('/tools/excel-column-converter/');
    await page.locator('#excel-col-number').fill('16384');
    await expect(page.locator('#excel-col-letters')).toHaveValue('XFD');
  });

  test('範囲外の列番号はエラーになる', async ({ page }) => {
    await page.goto('/tools/excel-column-converter/');
    await page.locator('#excel-col-number').fill('16385');
    await expect(page.locator('#excel-col-error')).toContainText('16384');
  });

  test('絶対参照のセル参照を分解できる', async ({ page }) => {
    await page.goto('/tools/excel-column-converter/');
    await page.locator('#excel-ref-input').fill('$B$3');
    await expect(page.locator('#excel-ref-result')).toContainText('2');
    await expect(page.locator('#excel-ref-result')).toContainText(
      '絶対 / 絶対',
    );
  });

  test('範囲のセル数を計算できる', async ({ page }) => {
    await page.goto('/tools/excel-column-converter/');
    await page.locator('#excel-ref-input').fill('A1:C10');
    await expect(page.locator('#excel-ref-result')).toContainText('30');
  });

  test('英語版で動作しエラーが英語で表示される', async ({ page }) => {
    await page.goto('/en/tools/excel-column-converter/');
    await page.locator('#excel-col-letters').fill('A1');
    await expect(page.locator('#excel-col-error')).toHaveText(
      'Column letters must contain only A to Z',
    );
    await page.locator('#excel-col-letters').fill('Z');
    await expect(page.locator('#excel-col-number')).toHaveValue('26');
  });
});
