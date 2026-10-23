import { test, expect, type Page } from './helpers/test';

// 単色（赤）の画像を生成して、ファイル入力へ渡す
async function loadRedImage(page: Page) {
  await page.evaluate(async () => {
    const c = document.createElement('canvas');
    c.width = 40;
    c.height = 20;
    const g = c.getContext('2d')!;
    g.fillStyle = '#ff0000';
    g.fillRect(0, 0, 40, 20);
    const blob = await new Promise<Blob>((resolve) =>
      c.toBlob((b) => resolve(b!), 'image/png'),
    );
    const dt = new DataTransfer();
    dt.items.add(new File([blob], 'red.png', { type: 'image/png' }));
    const input = document.getElementById('scp-file-input') as HTMLInputElement;
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

test.describe('スクリーンカラーピッカー（日本語版）', () => {
  test('スポイト非対応ブラウザでは案内が出て、画像方式で色を取得できる', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      delete (window as unknown as { EyeDropper?: unknown }).EyeDropper;
    });
    await page.goto('/tools/screen-color-picker/');
    await expect(page.locator('#scp-unsupported')).toBeVisible();
    await expect(page.locator('#scp-pick-button')).toBeHidden();

    await loadRedImage(page);
    await expect(page.locator('#scp-canvas')).toBeVisible();
    await page.locator('#scp-canvas').click();
    await expect(page.locator('#scp-value-hex')).toHaveText('#FF0000');
    await expect(page.locator('#scp-value-rgb')).toContainText('255');
    await expect(page.locator('#scp-value-hsl')).toContainText('hsl');
    await expect(page.locator('#scp-history-wrap')).toBeVisible();

    await page.locator('#scp-clear-history').click();
    await expect(page.locator('#scp-history-wrap')).toBeHidden();
  });

  test('EyeDropper をモックすると、取得した色が表示される', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      (window as unknown as { EyeDropper: unknown }).EyeDropper = class {
        open() {
          return Promise.resolve({ sRGBHex: '#1e90ff' });
        }
      };
    });
    await page.goto('/tools/screen-color-picker/');
    await expect(page.locator('#scp-unsupported')).toBeHidden();
    await page.locator('#scp-pick-button').click();
    await expect(page.locator('#scp-value-hex')).toHaveText('#1E90FF');
    await expect(page.locator('#scp-value-rgb')).toContainText('30, 144, 255');
  });

  test('スポイトを中断してもエラーは出ない', async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { EyeDropper: unknown }).EyeDropper = class {
        open() {
          return Promise.reject(new DOMException('cancel', 'AbortError'));
        }
      };
    });
    await page.goto('/tools/screen-color-picker/');
    await page.locator('#scp-pick-button').click();
    await expect(page.locator('#scp-error')).toBeHidden();
    await expect(page.locator('#scp-result')).toBeHidden();
  });
});

test.describe('スクリーンカラーピッカー（375px・大画像）', () => {
  test('大きな画像でも375pxで縦横比が崩れず、横にはみ出さない', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/screen-color-picker/');
    await page.evaluate(async () => {
      const c = document.createElement('canvas');
      c.width = 3000;
      c.height = 1000;
      const g = c.getContext('2d')!;
      g.fillStyle = '#ff0000';
      g.fillRect(0, 0, 3000, 1000);
      const blob = await new Promise<Blob>((resolve) =>
        c.toBlob((b) => resolve(b!), 'image/png'),
      );
      const dt = new DataTransfer();
      dt.items.add(new File([blob], 'big.png', { type: 'image/png' }));
      const input = document.getElementById(
        'scp-file-input',
      ) as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    const canvas = page.locator('#scp-canvas');
    await expect(canvas).toBeVisible();
    const intrinsic = await canvas.evaluate((el) => ({
      w: (el as HTMLCanvasElement).width,
      h: (el as HTMLCanvasElement).height,
    }));
    expect(intrinsic).toEqual({ w: 3000, h: 1000 });
    // 枠線(border)を含む boundingBox ではなく内側の表示サイズで比較する
    const shown = await canvas.evaluate((el) => ({
      w: (el as HTMLCanvasElement).clientWidth,
      h: (el as HTMLCanvasElement).clientHeight,
    }));
    expect(shown.w).toBeLessThanOrEqual(375);
    const expectedRatio = intrinsic.w / intrinsic.h;
    expect(
      Math.abs(shown.w / shown.h - expectedRatio) / expectedRatio,
    ).toBeLessThan(0.01);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  });
});

test.describe('Screen Color Picker (English)', () => {
  test('picks a color from a loaded image', async ({ page }) => {
    await page.goto('/en/tools/screen-color-picker/');
    await loadRedImage(page);
    await page.locator('#scp-canvas').click();
    await expect(page.locator('#scp-value-hex')).toHaveText('#FF0000');
  });
});
