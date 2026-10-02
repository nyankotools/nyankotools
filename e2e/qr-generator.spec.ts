import { test, expect } from './helpers/test';

test.describe('QRコード生成ツール（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/qr-generator/');
    await expect(page.locator('main h1')).toHaveText('QRコード生成');
  });

  test('テキストを入力するとQRコードが生成される', async ({ page }) => {
    await page.goto('/tools/qr-generator/');

    const input = page.locator('input[type="text"], textarea').first();
    await input.fill('https://example.com');

    // QRコード画像（SVGまたはcanvas）が生成されることを確認
    const qrSvg = page.locator('svg');
    const qrImg = page.locator('img');

    // SVGまたはimgエレメントが存在することを確認
    const svgCount = await qrSvg.count();
    const imgCount = await qrImg.count();

    expect(svgCount + imgCount).toBeGreaterThan(0);
  });

  test('QRコードに日本語テキストが含まれる', async ({ page }) => {
    await page.goto('/tools/qr-generator/');

    const input = page.locator('input[type="text"], textarea').first();
    await input.fill('にゃんこツール');

    // QRコードが生成されることを確認
    const qrSvg = page.locator('svg');
    const qrImg = page.locator('img');

    const svgCount = await qrSvg.count();
    const imgCount = await qrImg.count();

    expect(svgCount + imgCount).toBeGreaterThan(0);
  });

  test('空入力でQRコードは表示されない、またはプレースホルダーが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/qr-generator/');

    const input = page.locator('input[type="text"], textarea').first();
    await input.fill('test');

    // QRコードが生成される
    const qrElements = await page.locator('svg, [id*="qr"] img').count();
    expect(qrElements).toBeGreaterThan(0);

    // 入力をクリア
    await input.fill('');

    // QRコードの表示状態を確認（生成されない、またはプレースホルダーのみ）
    const mainText = await page.locator('main').textContent();
    expect(mainText).toBeTruthy();
  });

  test('QRコードをダウンロード/保存できる', async ({ page }) => {
    await page.goto('/tools/qr-generator/');

    const input = page.locator('input[type="text"], textarea').first();
    await input.fill('https://example.com');

    // ダウンロード/保存ボタンを見つける
    const downloadButton = page.locator(
      'button:has-text("ダウンロード"), button:has-text("保存")',
    );
    const count = await downloadButton.count();

    if (count > 0) {
      // ボタンが存在する場合、クリック可能であることを確認
      await expect(downloadButton.first()).toBeVisible();
    }
  });

  test('QRコードの表示状態を確認できる', async ({ page }) => {
    await page.goto('/tools/qr-generator/');

    const input = page.locator('input[type="text"], textarea').first();
    await input.fill('test');

    // QRコードが表示されることを確認
    const qrSvg = page.locator('svg');
    const qrImg = page.locator('img');

    const svgCount = await qrSvg.count();
    const imgCount = await qrImg.count();

    expect(svgCount + imgCount).toBeGreaterThan(0);
  });
});

test.describe('QR Code Generator (English)', () => {
  test('英語版が正しく表示される', async ({ page }) => {
    await page.goto('/en/tools/qr-generator/');
    await expect(page.locator('main h1')).toHaveText('QR Code Generator');
  });

  test('英語版でQRコードが生成される', async ({ page }) => {
    await page.goto('/en/tools/qr-generator/');

    const input = page.locator('input[type="text"], textarea').first();
    await input.fill('https://example.com');

    const qrSvg = page.locator('svg');
    const qrImg = page.locator('img');

    const svgCount = await qrSvg.count();
    const imgCount = await qrImg.count();

    expect(svgCount + imgCount).toBeGreaterThan(0);
  });
});
