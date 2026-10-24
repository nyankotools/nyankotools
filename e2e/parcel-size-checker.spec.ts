import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

async function fillParcel(
  page: import('@playwright/test').Page,
  l: string,
  w: string,
  h: string,
  kg: string,
) {
  await page.locator('#parcel-length').fill(l);
  await page.locator('#parcel-width').fill(w);
  await page.locator('#parcel-height').fill(h);
  await page.locator('#parcel-weight').fill(kg);
}

test.describe('宅配サイズ判定', () => {
  test('日本語版: 初期値（40×30×20cm・3kg）で100サイズと判定される', async ({
    page,
  }) => {
    await page.goto('/tools/parcel-size-checker/');

    await expect(page.locator('#parcel-sum')).toHaveText('90 cm');
    const yamato = page.locator('#parcel-svc-yamato-takkyubin');
    await expect(yamato).toContainText('◯ 利用できます');
    await expect(yamato).toContainText('100サイズ');
    await expect(page.locator('#parcel-svc-yupack')).toContainText('100サイズ');
    await expect(page.locator('#parcel-svc-sagawa-hikyaku')).toContainText(
      '100サイズ',
    );
    await expect(page.locator('#parcel-svc-sagawa-large')).toContainText(
      '◯ 利用できます',
    );
    await expect(page.locator('#parcel-svc-yupacket')).toContainText(
      '× 利用できません',
    );
  });

  test('英語版が表示され判定される', async ({ page }) => {
    await page.goto('/en/tools/parcel-size-checker/');

    await expect(page.locator('#parcel-svc-yamato-takkyubin')).toContainText(
      'Size 100',
    );
  });

  test('重量で区分が上がり、上限を超えると理由が出る', async ({ page }) => {
    await page.goto('/tools/parcel-size-checker/');

    await fillParcel(page, '20', '20', '20', '12');
    const yamato = page.locator('#parcel-svc-yamato-takkyubin');
    await expect(yamato).toContainText('120サイズ');
    await expect(yamato).toContainText('重量で決まりました');

    await fillParcel(page, '30', '30', '30', '26');
    await expect(page.locator('#parcel-svc-yupack')).toContainText(
      '重量 26kg が上限の 25kg を超えています',
    );
  });

  test('薄型サービスの厚さ・サイズ判定', async ({ page }) => {
    await page.goto('/tools/parcel-size-checker/');

    await fillParcel(page, '30', '20', '3', '0.5');
    await expect(page.locator('#parcel-svc-yupacket')).toContainText(
      '◯ 利用できます',
    );
    await expect(page.locator('#parcel-svc-yamato-nekopos')).toContainText(
      '◯ 利用できます',
    );

    await fillParcel(page, '30', '20', '3.1', '0.5');
    await expect(page.locator('#parcel-svc-yupacket')).toContainText(
      '厚さ（最も短い辺）3.1cm が上限の 3cm を超えています',
    );
  });

  test('入力が空・不正のときの表示', async ({ page }) => {
    await page.goto('/tools/parcel-size-checker/');

    await page.locator('#parcel-weight').fill('');
    await expect(page.locator('#parcel-results')).toBeHidden();

    await page.locator('#parcel-weight').fill('0');
    await expect(page.locator('#parcel-error')).not.toBeEmpty();
    await expect(page.locator('#parcel-results')).toBeHidden();
  });

  test('初期表示でaxeの違反がない（ja/en）', async ({ page }) => {
    for (const path of [
      '/tools/parcel-size-checker/',
      '/en/tools/parcel-size-checker/',
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
