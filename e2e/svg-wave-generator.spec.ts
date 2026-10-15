import { test, expect } from './helpers/test';

test.describe('SVG波・ブロブジェネレーター（日本語版）', () => {
  test('初期状態で波のSVGとCSSが生成される', async ({ page }) => {
    await page.goto('/tools/svg-wave-generator/');
    await expect(page.locator('main h1')).toHaveText(
      'SVG波・ブロブジェネレーター',
    );
    const svg = page.locator('#sw-svg-output');
    await expect(svg).toHaveValue(/viewBox="0 0 1440 320"/);
    await expect(svg).toHaveValue(/preserveAspectRatio="none"/);
    await expect(page.locator('#sw-css-output')).toHaveValue(
      /background-image: url\("data:image\/svg\+xml,/,
    );
    await expect(page.locator('#sw-preview svg')).toBeVisible();
  });

  test('同じシードなら同じ形、シードを変えると形が変わる', async ({ page }) => {
    await page.goto('/tools/svg-wave-generator/');
    const svg = page.locator('#sw-svg-output');
    const first = await svg.inputValue();
    await page.locator('#sw-seed').fill('99');
    await expect(svg).not.toHaveValue(first);
    await page.locator('#sw-seed').fill('1234');
    await expect(svg).toHaveValue(first);
  });

  test('ブロブに切り替えると波用の設定が隠れる', async ({ page }) => {
    await page.goto('/tools/svg-wave-generator/');
    await page.locator('#sw-kind').selectOption('blob');
    await expect(page.locator('#sw-svg-output')).toHaveValue(
      /viewBox="0 0 400 400"/,
    );
    await expect(page.locator('#sw-svg-output')).not.toHaveValue(
      /preserveAspectRatio/,
    );
    await expect(page.locator('#sw-height')).toBeHidden();
    await expect(page.locator('#sw-points')).toBeVisible();
  });

  test('色と設定がSVGに反映される', async ({ page }) => {
    await page.goto('/tools/svg-wave-generator/');
    await page.locator('#sw-color').fill('#ff0000');
    await page.locator('#sw-side').selectOption('top');
    await expect(page.locator('#sw-svg-output')).toHaveValue(/fill="#ff0000"/);
    await expect(page.locator('#sw-svg-output')).toHaveValue(/L1440,0 L0,0 Z/);
  });

  test('ランダム生成でシードが変わる', async ({ page }) => {
    await page.goto('/tools/svg-wave-generator/');
    const seed = page.locator('#sw-seed');
    await expect(seed).toHaveValue('1234');
    await page.locator('#sw-random-button').click();
    await expect(seed).not.toHaveValue('1234');
  });

  test('コピーボタンで成功メッセージが出る', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/svg-wave-generator/');
    await page.locator('#sw-copy-button').click();
    await expect(page.locator('#sw-status')).toHaveText('コピーしました');
  });

  test('リロード後も設定（形・高さ・シード・色）が復元される', async ({
    page,
  }) => {
    await page.goto('/tools/svg-wave-generator/');
    await page.locator('#sw-height').fill('250');
    await page.locator('#sw-seed').fill('777');
    await page.locator('#sw-color').fill('#00ff00');
    // 入力の保存は遅延して行われるため、保存済みになるまで待つ
    await page.waitForFunction(() => sessionStorage.length > 0);
    await page.reload();
    await expect(page.locator('#sw-height')).toHaveValue('250');
    await expect(page.locator('#sw-height-value')).toHaveText('250');
    await expect(page.locator('#sw-seed')).toHaveValue('777');
    await expect(page.locator('#sw-color')).toHaveValue('#00ff00');
    await expect(page.locator('#sw-svg-output')).toHaveValue(
      /viewBox="0 0 1440 250".*fill="#00ff00"/,
    );
  });

  test('形の切り替え（ブロブ）もリロード後に復元される', async ({ page }) => {
    await page.goto('/tools/svg-wave-generator/');
    await page.locator('#sw-kind').selectOption('blob');
    await page.waitForFunction(() => sessionStorage.length > 0);
    await page.reload();
    await expect(page.locator('#sw-kind')).toHaveValue('blob');
    await expect(page.locator('#sw-svg-output')).toHaveValue(
      /viewBox="0 0 400 400"/,
    );
    await expect(page.locator('#sw-height')).toBeHidden();
  });

  test('SVGをダウンロードできる', async ({ page }) => {
    await page.goto('/tools/svg-wave-generator/');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#sw-download-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('wave.svg');
  });
});

test.describe('SVG Wave & Blob Generator (English)', () => {
  test('shows the English heading and generates an SVG', async ({ page }) => {
    await page.goto('/en/tools/svg-wave-generator/');
    await expect(page.locator('main h1')).toHaveText(
      'SVG Wave & Blob Generator',
    );
    await expect(page.locator('#sw-svg-output')).toHaveValue(/<svg /);
  });
});
