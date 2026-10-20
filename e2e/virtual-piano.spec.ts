import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('バーチャルピアノ', () => {
  test('初期表示: 37鍵・C3〜C6・音名とキー名が出る', async ({ page }) => {
    await page.goto('/tools/virtual-piano/');
    await expect(page.locator('#vp-keys button')).toHaveCount(37);
    await expect(page.locator('#vp-range')).toHaveText('C3 〜 C6');
    await expect(page.locator('#vp-keys button[data-midi="48"]')).toContainText(
      'C3',
    );
    await expect(page.locator('#vp-keys button[data-midi="48"]')).toContainText(
      'Z',
    );
  });

  test('キーボードの Z で C3 の鍵が押された状態になり、離すと戻る', async ({
    page,
  }) => {
    await page.goto('/tools/virtual-piano/');
    const c3 = page.locator('#vp-keys button[data-midi="48"]');
    await page.keyboard.down('KeyZ');
    await expect(c3).toHaveAttribute('data-active', 'true');
    await page.keyboard.up('KeyZ');
    await expect(c3).toHaveAttribute('data-active', 'false');
  });

  test('Q は1オクターブ上の C4、同時押しもできる', async ({ page }) => {
    await page.goto('/tools/virtual-piano/');
    await page.keyboard.down('KeyQ');
    await page.keyboard.down('KeyE');
    await expect(
      page.locator('#vp-keys button[data-midi="60"]'),
    ).toHaveAttribute('data-active', 'true');
    await expect(
      page.locator('#vp-keys button[data-midi="64"]'),
    ).toHaveAttribute('data-active', 'true');
    await page.keyboard.up('KeyQ');
    await page.keyboard.up('KeyE');
  });

  test('Ctrl を押しながらのキーは演奏にならない', async ({ page }) => {
    await page.goto('/tools/virtual-piano/');
    await page.keyboard.down('Control');
    await page.keyboard.down('KeyZ');
    await expect(
      page.locator('#vp-keys button[data-midi="48"]'),
    ).toHaveAttribute('data-active', 'false');
    await page.keyboard.up('KeyZ');
    await page.keyboard.up('Control');
  });

  test('マウスで押すと鍵が押された状態になる', async ({ page }) => {
    await page.goto('/tools/virtual-piano/');
    const key = page.locator('#vp-keys button[data-midi="50"]');
    const box = (await key.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height - 10);
    await page.mouse.down();
    await expect(key).toHaveAttribute('data-active', 'true');
    await page.mouse.up();
    await expect(key).toHaveAttribute('data-active', 'false');
  });

  test('オクターブを上げ下げすると範囲が変わり、端で無効になる', async ({
    page,
  }) => {
    await page.goto('/tools/virtual-piano/');
    await page.locator('#vp-octave-up').click();
    await expect(page.locator('#vp-range')).toHaveText('C4 〜 C7');
    await page.locator('#vp-octave-up').click();
    await page.locator('#vp-octave-up').click();
    await expect(page.locator('#vp-range')).toHaveText('C6 〜 C9');
    await expect(page.locator('#vp-octave-up')).toBeDisabled();
    for (let i = 0; i < 5; i++) await page.locator('#vp-octave-down').click();
    await expect(page.locator('#vp-range')).toHaveText('C1 〜 C4');
    await expect(page.locator('#vp-octave-down')).toBeDisabled();
  });

  test('音名・キー名の表示を切り替えられる', async ({ page }) => {
    await page.goto('/tools/virtual-piano/');
    await page.locator('#vp-show-names').uncheck();
    await expect(
      page.locator('#vp-keys [data-role="name"]').first(),
    ).toBeHidden();
    await page.locator('#vp-show-keys').uncheck();
    await expect(
      page.locator('#vp-keys [data-role="cap"]').first(),
    ).toBeHidden();
  });

  test('音量スライダーの値が表示に反映され、スライダー上でも演奏できる', async ({
    page,
  }) => {
    await page.goto('/tools/virtual-piano/');
    await page.locator('#vp-volume').fill('20');
    await expect(page.locator('#vp-volume-value')).toHaveText('20');
    await page.locator('#vp-volume').focus();
    await page.keyboard.down('KeyZ');
    await expect(
      page.locator('#vp-keys button[data-midi="48"]'),
    ).toHaveAttribute('data-active', 'true');
    await page.keyboard.up('KeyZ');
  });

  test('音色は4種類から選べる', async ({ page }) => {
    await page.goto('/tools/virtual-piano/');
    await expect(page.locator('#vp-timbre option')).toHaveCount(4);
    await page.locator('#vp-timbre').selectOption('square');
    await page.keyboard.press('KeyZ');
  });

  test('鍵盤が横にスクロールでき、375px でもページ全体ははみ出さない', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/tools/virtual-piano/');
    const scrollable = await page.locator('#vp-scroll').evaluate((el) => ({
      client: el.clientWidth,
      scroll: el.scrollWidth,
    }));
    expect(scrollable.scroll).toBeGreaterThan(scrollable.client);
    const pageOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(pageOverflow).toBeLessThanOrEqual(0);
  });

  test('英語版で表示できる', async ({ page }) => {
    await page.goto('/en/tools/virtual-piano/');
    await expect(page.locator('main h1')).toContainText('Virtual Piano');
    await expect(page.locator('#vp-range')).toHaveText('C3 to C6');
  });

  test('初期表示でaxeの違反がない', async ({ page }) => {
    await page.goto('/tools/virtual-piano/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
