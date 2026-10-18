import { test, expect } from './helpers/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('インデント変換（日本語版）', () => {
  test('タブをスペースに変換できる', async ({ page }) => {
    await page.goto('/tools/indent-converter/');
    await page.locator('#ic-input').fill('a\n\tb\n\t\tc');
    expect(await page.locator('#ic-output').textContent()).toBe(
      'a\n    b\n        c',
    );
  });

  test('幅変更モードで2スペースを4スペースにできる', async ({ page }) => {
    await page.goto('/tools/indent-converter/');
    await page.locator('#ic-mode-width').check();
    await page.locator('#ic-width').fill('2');
    await page.locator('#ic-to-width').fill('4');
    await page.locator('#ic-input').fill('a\n  b\n    c');
    expect(await page.locator('#ic-output').textContent()).toBe(
      'a\n    b\n        c',
    );
  });

  test('スペースをタブに変換できる', async ({ page }) => {
    await page.goto('/tools/indent-converter/');
    await page.locator('#ic-mode-s2t').check();
    await page.locator('#ic-input').fill('    a\n        b');
    expect(await page.locator('#ic-output').textContent()).toBe('\ta\n\t\tb');
  });

  test('空入力ではコピーが無効', async ({ page }) => {
    await page.goto('/tools/indent-converter/');
    await expect(page.locator('#ic-copy-button')).toBeDisabled();
  });

  test('タブとスペースが混在する行をタブストップで換算してスペースにする', async ({
    page,
  }) => {
    await page.goto('/tools/indent-converter/');
    // textarea は改行を LF に正規化するため、CRLF の検証は単体テスト側で行う
    await page.locator('#ic-input').fill('\tx\n  \ty\n  z');
    // 幅4: "\t"=4桁, "  \t"=4桁（タブストップ）, "  "=2桁
    expect(await page.locator('#ic-output').textContent()).toBe(
      '    x\n    y\n  z',
    );
  });

  test('結果にaxeのアクセシビリティ違反がない', async ({ page }) => {
    await page.goto('/tools/indent-converter/');
    await page.locator('#ic-input').fill('a\n\tb');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});

test.describe('Indent Converter (English)', () => {
  test('英語版で変換できる', async ({ page }) => {
    await page.goto('/en/tools/indent-converter/');
    await page.locator('#ic-input').fill('\ta');
    expect(await page.locator('#ic-output').textContent()).toBe('    a');
  });
});
