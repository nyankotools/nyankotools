import { test, expect } from './helpers/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('有給休暇の付与日数計算（日本語版）', () => {
  test('通常付与の付与スケジュールが表示される', async ({ page }) => {
    await page.goto('/tools/paid-leave-calculator/');
    await page.locator('#leave-hire').fill('2020-04-01');
    await page.locator('#leave-reference').fill('2022-10-14');

    await expect(page.locator('#leave-result-current')).toContainText('12日');
    await expect(page.locator('#leave-result-current')).toContainText(
      '2022年10月1日',
    );
    await expect(page.locator('#leave-result-max')).toHaveText('23日');
    await expect(page.locator('#leave-schedule tr').first()).toContainText(
      '6か月',
    );
  });

  test('週3日は比例付与になる', async ({ page }) => {
    await page.goto('/tools/paid-leave-calculator/');
    await page.locator('#leave-hire').fill('2024-04-01');
    await page.locator('#leave-reference').fill('2024-10-01');
    await page.locator('#leave-days').selectOption('3');

    await expect(page.locator('#leave-result-category')).toContainText(
      '比例付与',
    );
    await expect(page.locator('#leave-result-current')).toContainText('5日');
  });

  test('週30時間以上なら週4日でも通常付与', async ({ page }) => {
    await page.goto('/tools/paid-leave-calculator/');
    await page.locator('#leave-hire').fill('2024-04-01');
    await page.locator('#leave-reference').fill('2024-10-01');
    await page.locator('#leave-days').selectOption('4');
    await page.locator('#leave-hours').fill('32');

    await expect(page.locator('#leave-result-category')).toContainText(
      '通常付与',
    );
    await expect(page.locator('#leave-result-current')).toContainText('10日');
  });

  test('不正な週所定労働時間ならエラーを表示する', async ({ page }) => {
    await page.goto('/tools/paid-leave-calculator/');
    await page.locator('#leave-hire').fill('2024-04-01');
    await page.locator('#leave-hours').fill('500');
    await expect(page.locator('#leave-error')).not.toBeEmpty();
    await expect(page.locator('#leave-results')).toBeHidden();
  });

  test('エラー表示の状態でもaxeの違反がない', async ({ page }) => {
    await page.goto('/tools/paid-leave-calculator/');
    await page.locator('#leave-hire').fill('2024-04-01');
    await page.locator('#leave-hours').fill('500');
    await expect(page.locator('#leave-error')).not.toBeEmpty();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test('法的助言でない旨が表示される', async ({ page }) => {
    await page.goto('/tools/paid-leave-calculator/');
    await expect(page.locator('p[role="note"]')).toContainText('法的助言');
  });
});

test.describe('Paid Leave Calculator (English)', () => {
  test('shows the grant and schedule', async ({ page }) => {
    await page.goto('/en/tools/paid-leave-calculator/');
    await page.locator('#leave-hire').fill('2020-04-01');
    await page.locator('#leave-reference').fill('2022-10-14');
    await expect(page.locator('#leave-result-current')).toContainText(
      '12 days (granted Sat, 2022-10-01)',
    );
  });
});
