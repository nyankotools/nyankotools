import { expect, test } from '@playwright/test';

test.describe('avatar-generator', () => {
  test('イニシャルとidenticonを切り替えて描画し、PNGをダウンロードできる', async ({
    page,
  }) => {
    await page.goto('/tools/avatar-generator/');
    const info = page.locator('#av-info');
    await expect(info).toContainText('512 × 512');

    await page.locator('#av-size').selectOption('256');
    await expect(info).toContainText('256 × 256');

    // 自動配色の背景色が入力欄に反映される
    const bgBefore = await page.locator('#av-bg').inputValue();
    await page.locator('#av-text').fill('Another Person');
    await expect(page.locator('#av-bg')).not.toHaveValue(bgBefore);

    await page.getByRole('button', { name: 'identicon（模様）' }).click();
    await expect(page.locator('#av-initials-opts')).toBeHidden();
    await expect(page.locator('#av-text-label')).toContainText('シード文字列');

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#av-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(
      'identicon-Another-Person-256.png',
    );
  });

  test('自動配色を外すと色を手動で選べる', async ({ page }) => {
    await page.goto('/en/tools/avatar-generator/');
    await expect(page.locator('#av-bg')).toBeDisabled();
    await page.locator('#av-auto').uncheck();
    await expect(page.locator('#av-bg')).toBeEnabled();
    await page.locator('#av-bg').fill('#ff0000');
    await expect(page.locator('#av-bg')).toHaveValue('#ff0000');
  });
});
