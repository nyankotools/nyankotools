import { readFileSync } from 'node:fs';
import { test, expect, type Page } from './helpers/test';

/** ブラウザ内で単色PNGを作り、ファイル入力にまとめて渡す */
async function addImages(page: Page, colors: string[], w = 40, h = 20) {
  await page.evaluate(
    async ({ colors, w, h }) => {
      const dt = new DataTransfer();
      for (const [i, color] of colors.entries()) {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h);
        const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!)));
        dt.items.add(new File([blob], `f${i + 1}.png`, { type: 'image/png' }));
      }
      const input = document.getElementById('gif-file') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    { colors, w, h },
  );
}

test.describe('GIF作成（日本語版）', () => {
  test('3コマからGIFを作成し、プレビューとダウンロードができる', async ({
    page,
  }) => {
    await page.goto('/tools/gif-maker/');
    await expect(page.locator('main h1')).toContainText('GIF作成');
    await expect(page.locator('#gif-workspace')).toBeHidden();

    await addImages(page, ['red', 'green', 'blue']);
    await expect(page.locator('#gif-list li')).toHaveCount(3);
    await expect(page.locator('#gif-download')).toBeDisabled();

    await page.locator('#gif-width').fill('80');
    await page.locator('#gif-generate-button').click();
    await expect(page.locator('#gif-info')).toContainText('80 × 40 px・3コマ');
    await expect(page.locator('#gif-preview')).toBeVisible();

    // 実際にブラウザがGIFとして読み込め、サイズが一致する
    await expect
      .poll(() =>
        page
          .locator('#gif-preview')
          .evaluate((el) => (el as HTMLImageElement).naturalWidth),
      )
      .toBe(80);
    const height = await page
      .locator('#gif-preview')
      .evaluate((el) => (el as HTMLImageElement).naturalHeight);
    expect(height).toBe(40);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#gif-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('animation.gif');
    const head = readFileSync((await download.path())!).subarray(0, 6);
    expect(head.toString('ascii')).toBe('GIF89a');
  });

  test('往復再生ではコマ数が増え、設定を変えると結果が消える', async ({
    page,
  }) => {
    await page.goto('/tools/gif-maker/');
    await addImages(page, ['red', 'green', 'blue']);
    await page.locator('#gif-pingpong').check();
    await page.locator('#gif-generate-button').click();
    await expect(page.locator('#gif-info')).toContainText('4コマ');
    await page.locator('#gif-delay').fill('200');
    await expect(page.locator('#gif-preview')).toBeHidden();
    await expect(page.locator('#gif-download')).toBeDisabled();
  });

  test('順番入れ替えと削除ができる', async ({ page }) => {
    await page.goto('/tools/gif-maker/');
    await addImages(page, ['red', 'green']);
    await page.locator('#gif-list li').nth(1).getByText('↑ 上へ').click();
    await expect(page.locator('#gif-list li').first()).toContainText('f2.png');
    await page.locator('#gif-list li').first().getByText('削除').click();
    await expect(page.locator('#gif-list li')).toHaveCount(1);
  });

  test('画像でないファイルはエラーになる', async ({ page }) => {
    await page.goto('/tools/gif-maker/');
    await page.locator('#gif-file').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#gif-error')).toContainText('a.txt');
    await expect(page.locator('#gif-workspace')).toBeHidden();
  });

  test('縦長画像は高さと画素数の上限に収まるよう自動スケーリングされる', async ({
    page,
  }) => {
    await page.goto('/tools/gif-maker/');
    // 100x5000（非常に縦長）の3フレーム
    const colors = ['red', 'green', 'blue'];
    await page.evaluate(
      async ({ colors }) => {
        const dt = new DataTransfer();
        for (const [i, color] of colors.entries()) {
          const c = document.createElement('canvas');
          c.width = 100;
          c.height = 5000;
          const ctx = c.getContext('2d')!;
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, 100, 5000);
          const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!)));
          dt.items.add(
            new File([blob], `f${i + 1}.png`, { type: 'image/png' }),
          );
        }
        const input = document.getElementById('gif-file') as HTMLInputElement;
        input.files = dt.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      },
      { colors },
    );
    await page.locator('#gif-width').fill('100');
    await page.locator('#gif-generate-button').click();
    // 縮小されているので、高さが2000以下になるはず、プレビューが表示される
    await expect(page.locator('#gif-preview')).toBeVisible();
    const height = await page
      .locator('#gif-preview')
      .evaluate((el) => (el as HTMLImageElement).naturalHeight);
    expect(height).toBeLessThanOrEqual(2000);
  });

  test('100フレームを超える場合は追加できない', async ({ page }) => {
    await page.goto('/tools/gif-maker/');
    // 101フレーム作成を試みる
    const colors = Array.from(
      { length: 101 },
      (_, i) => `hsl(${(i * 3.6) % 360}, 50%, 50%)`,
    );
    await page.evaluate(
      async ({ colors }) => {
        const dt = new DataTransfer();
        for (const [i, color] of colors.entries()) {
          const c = document.createElement('canvas');
          c.width = 40;
          c.height = 20;
          const ctx = c.getContext('2d')!;
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, 40, 20);
          const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!)));
          dt.items.add(
            new File([blob], `f${i + 1}.png`, { type: 'image/png' }),
          );
        }
        const input = document.getElementById('gif-file') as HTMLInputElement;
        input.files = dt.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      },
      { colors },
    );
    // エラーが表示されるか、リストが100以下に制限されるか
    await expect(page.locator('#gif-error')).toContainText('100');
  });
});

test.describe('GIF Maker (English)', () => {
  test('英語版が表示され、GIFを作れる', async ({ page }) => {
    await page.goto('/en/tools/gif-maker/');
    await expect(page.locator('main h1')).toContainText('GIF Maker');
    await addImages(page, ['red', 'blue']);
    await page.locator('#gif-generate-button').click();
    await expect(page.locator('#gif-info')).toContainText('2 frames');
  });
});
