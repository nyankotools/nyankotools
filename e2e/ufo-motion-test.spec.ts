import { test, expect } from './helpers/test';
import { blockAnalytics } from './helpers/block-analytics';

test.describe('モーション・残像テスト', () => {
  test('日本語版: 開始→Escで終了すると結果が表示される', async ({ page }) => {
    await blockAnalytics(page);
    await page.goto('/tools/ufo-motion-test/');
    await expect(page.locator('#ufo-stage')).toBeHidden();
    await expect(page.locator('#ufo-empty')).toBeVisible();

    await page.locator('#ufo-start').click();
    await expect(page.locator('#ufo-stage')).toBeVisible();
    await expect(page.locator('#ufo-hud')).toContainText('Hz', {
      timeout: 5000,
    });

    await page.keyboard.press('Escape');
    await expect(page.locator('#ufo-stage')).toBeHidden();
    await expect(page.locator('#ufo-result')).toBeVisible();
    await expect(page.locator('#ufo-res-frames')).not.toHaveText('-');
    await expect(page.locator('#ufo-res-verdict')).not.toHaveText('-');
  });

  test('速度ボタンの選択が切り替わり、閉じるボタンで終了できる', async ({
    page,
  }) => {
    await blockAnalytics(page);
    await page.goto('/tools/ufo-motion-test/');
    const fast = page.locator('[data-ufo-speed="1920"]');
    await fast.click();
    await expect(fast).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-ufo-speed="960"]')).toHaveAttribute(
      'aria-pressed',
      'false',
    );

    await page.locator('#ufo-start').click();
    await expect(page.locator('#ufo-hud')).toContainText('Hz', {
      timeout: 5000,
    });
    await page.locator('#ufo-close').click();
    await expect(page.locator('#ufo-stage')).toBeHidden();
  });

  test('英語版: 見出しと注意書きが英語で表示される', async ({ page }) => {
    await blockAnalytics(page);
    await page.goto('/en/tools/ufo-motion-test/');
    await expect(page.locator('main h1')).toHaveText(
      'Motion Blur & Frame Skip Test',
    );
    await expect(page.locator('#ufo-start')).toHaveText('Start test');
    await expect(
      page.getByText('Photosensitivity and comfort warning'),
    ).toBeVisible();
  });
});
