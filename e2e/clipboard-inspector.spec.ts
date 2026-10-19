import { test, expect, type Page } from './helpers/test';

async function pasteData(
  page: Page,
  data: Record<string, string>,
  png = false,
) {
  await page.locator('#clip-zone').focus();
  await page.evaluate(
    async ({ data, png }) => {
      const dt = new DataTransfer();
      for (const [k, v] of Object.entries(data)) dt.setData(k, v);
      if (png) {
        const canvas = document.createElement('canvas');
        canvas.width = 3;
        canvas.height = 2;
        canvas.getContext('2d')!.fillRect(0, 0, 3, 2);
        const blob: Blob = await new Promise((r) =>
          canvas.toBlob((b) => r(b!), 'image/png'),
        );
        dt.items.add(new File([blob], 'shot.png', { type: 'image/png' }));
      }
      const ev = new ClipboardEvent('paste', {
        clipboardData: dt,
        bubbles: true,
        cancelable: true,
      });
      document.getElementById('clip-zone')!.dispatchEvent(ev);
    },
    { data, png },
  );
}

test.describe('クリップボード確認（日本語版）', () => {
  test('text/plain と text/html が一覧され、HTMLは描画されない', async ({
    page,
  }) => {
    await page.goto('/tools/clipboard-inspector/');
    await pasteData(page, {
      'text/plain': 'hello',
      'text/html': '<b id="injected">hi</b><script>window.__x=1</script>',
    });

    await expect(page.locator('#clip-summary')).toContainText('2 件');
    await expect(page.locator('.clip-entry')).toHaveCount(2);
    await expect(page.locator('.clip-type').first()).toHaveText('text/plain');
    await expect(page.locator('#injected')).toHaveCount(0);
    await expect(
      page.locator('.clip-entry[data-type="text/html"]'),
    ).toContainText('<b id="injected">');
    await expect(
      page.locator('.clip-entry[data-type="text/html"]'),
    ).toContainText('scriptタグが含まれています');
    expect(
      await page.evaluate(() => (window as unknown as { __x?: unknown }).__x),
    ).toBeUndefined();
  });

  test('画像ファイルのプレビューとサイズが表示される', async ({ page }) => {
    await page.goto('/tools/clipboard-inspector/');
    await pasteData(page, {}, true);

    await expect(page.locator('.clip-file')).toContainText('shot.png');
    await expect(page.locator('.clip-image-size')).toHaveText('3 × 2 px');
  });

  test('コピーとクリアができる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/clipboard-inspector/');
    await pasteData(page, { 'text/plain': 'copy me' });

    await page.locator('#clip-copy-button').click();
    await expect(page.locator('#clip-status')).toHaveText('コピーしました');
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain('text/plain');
    expect(text).toContain('copy me');

    await page.locator('#clip-clear-button').click();
    await expect(page.locator('.clip-entry')).toHaveCount(0);
  });
});

test.describe('Clipboard Inspector (English)', () => {
  test('lists a pasted format', async ({ page }) => {
    await page.goto('/en/tools/clipboard-inspector/');
    await pasteData(page, { 'text/plain': 'abc' });
    await expect(page.locator('#clip-summary')).toContainText('1 format');
    await expect(page.locator('.clip-size')).toContainText('3 B');
  });
});
