import { test, expect } from './helpers/test';

test.describe('セマンティックバージョン比較・範囲判定（日本語版）', () => {
  test('初期値でバージョン比較と範囲判定の結果が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/semver-calculator/');

    await expect(page.locator('#sv-compare-text')).toHaveText(
      'A < B（Aの方が古い）',
    );
    await expect(page.locator('#sv-normalized')).toHaveText('>=1.2.3 <2.0.0-0');
    await expect(page.locator('#sv-summary')).toHaveText(
      '適合する最新: 1.10.0 / 適合する最古: 1.2.3',
    );
    await expect(page.locator('#sv-rows tr')).toHaveCount(6);
  });

  test('バージョンAを変更すると比較結果が更新され、不正値でエラー表示', async ({
    page,
  }) => {
    await page.goto('/tools/semver-calculator/');

    await page.locator('#sv-a').fill('2.0.0');
    await expect(page.locator('#sv-compare-text')).toHaveText(
      'A > B（Aの方が新しい）',
    );
    await expect(page.locator('#sv-compare-diff')).toHaveText(
      '違いのある桁: メジャー',
    );

    await page.locator('#sv-a').fill('1.2');
    await expect(page.locator('#sv-compare-error')).toContainText(
      'semver形式ではありません',
    );
  });

  test('範囲式とプレリリース設定で適合判定が変わる', async ({ page }) => {
    await page.goto('/tools/semver-calculator/');

    await page.locator('#sv-range').fill('>=1.0.0 <2.0.0 || 2.0.0');
    await expect(page.locator('#sv-rows tr').nth(5)).toContainText('適合');
    await expect(page.locator('#sv-rows tr').nth(4)).toContainText('不適合');

    await page.locator('#sv-range').fill('^2.0.0-beta.0');
    await expect(page.locator('#sv-rows tr').nth(4)).toContainText('適合');
    await expect(page.locator('#sv-rows tr').nth(4)).not.toContainText(
      '不適合',
    );

    await page.locator('#sv-range').fill('^1.0.0');
    await page.locator('#sv-prerelease').check();
    await expect(page.locator('#sv-rows tr').nth(3)).not.toContainText(
      '不適合',
    );
  });

  test('降順ソートと不正な範囲式のエラー表示', async ({ page }) => {
    await page.goto('/tools/semver-calculator/');

    await page.locator('#sv-sort').selectOption('desc');
    await expect(page.locator('#sv-rows tr').first()).toContainText('2.0.0');

    await page.locator('#sv-range').fill('^^');
    await expect(page.locator('#sv-range-error')).toContainText(
      '範囲式を解釈できません',
    );
  });

  test('コピーボタンで結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/semver-calculator/');

    await page.locator('#sv-copy-button').click();
    await expect(page.locator('#sv-status')).toHaveText('コピーしました');
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain('1.2.3\t適合');
  });
});

test.describe('Semver Calculator (English)', () => {
  test('英語版で比較・範囲判定の結果が表示される', async ({ page }) => {
    await page.goto('/en/tools/semver-calculator/');

    await expect(page.locator('#sv-compare-text')).toHaveText(
      'A < B (A is older)',
    );
    await expect(page.locator('#sv-summary')).toHaveText(
      'Highest match: 1.10.0 / Lowest match: 1.2.3',
    );

    await page.locator('#sv-range').fill('~');
    await expect(page.locator('#sv-range-error')).toContainText(
      'Could not parse the range',
    );
  });
});
