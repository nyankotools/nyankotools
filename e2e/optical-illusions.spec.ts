import { test, expect } from './helpers/test';

const PAGES = {
  ja: '/tools/optical-illusions/',
  en: '/en/tools/optical-illusions/',
} as const;

for (const lang of ['ja', 'en'] as const) {
  test.describe(`錯視ギャラリー（${lang}）`, () => {
    test('初期表示で図と解説が1つだけ表示される', async ({ page }) => {
      await page.goto(PAGES[lang]);
      await expect(page.locator('#oi-svg > *').first()).toBeAttached();
      await expect(page.locator('[data-info]:not([hidden])')).toHaveCount(1);
      await expect(page.locator('#oi-svg')).toHaveAttribute('aria-label', /.+/);
    });

    test('補助線の表示で図形が増え、要因を隠すと減る', async ({ page }) => {
      await page.goto(PAGES[lang]);
      const count = () => page.locator('#oi-svg > *').count();
      const base = await count();
      await page.locator('#oi-guides').check();
      const withGuides = await count();
      expect(withGuides).toBeGreaterThan(base);
      await page.locator('#oi-inducers').check();
      expect(await count()).toBeLessThan(withGuides);
      await page.locator('#oi-guides').uncheck();
      await page.locator('#oi-inducers').uncheck();
      expect(await count()).toBe(base);
    });

    test('次の錯視で切り替わり、強さは対象外の錯視で無効になる', async ({
      page,
    }) => {
      await page.goto(PAGES[lang]);
      await expect(page.locator('#oi-select')).toHaveValue('muller-lyer');
      await page.locator('#oi-next-button').click();
      await expect(page.locator('#oi-select')).toHaveValue('ponzo');
      await page.locator('#oi-select').selectOption('checker-shadow');
      await expect(page.locator('#oi-strength')).toBeDisabled();
      await expect(page.locator('#oi-strength-note')).toBeVisible();
      await expect(page.locator('#oi-inducers')).toBeDisabled();
      await page.locator('#oi-select').selectOption('zollner');
      await expect(page.locator('#oi-strength')).toBeEnabled();
    });

    test('強さを変えると図が更新される', async ({ page }) => {
      await page.goto(PAGES[lang]);
      await page.locator('#oi-select').selectOption('ebbinghaus');
      const before = await page.locator('#oi-svg').innerHTML();
      await page.locator('#oi-strength').fill('0');
      await expect(page.locator('#oi-strength-out')).toHaveText('0');
      expect(await page.locator('#oi-svg').innerHTML()).not.toBe(before);
    });
  });
}
