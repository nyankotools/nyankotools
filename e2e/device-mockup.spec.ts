import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Page } from './helpers/test';

/** ブラウザ内で赤一色のPNGを作り、ファイル入力に渡す */
async function loadImage(page: Page, name = 'shot.png', w = 300, h = 600) {
  await page.evaluate(
    async ({ name, w, h }) => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, w, h);
      const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!)));
      const dt = new DataTransfer();
      dt.items.add(new File([blob], name, { type: 'image/png' }));
      const input = document.getElementById('mockup-file') as HTMLInputElement;
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    { name, w, h },
  );
}

function canvasPixel(page: Page, fx: number, fy: number) {
  return page.locator('#mockup-canvas').evaluate(
    (el, [x, y]) => {
      const c = el as HTMLCanvasElement;
      const ctx = c.getContext('2d')!;
      return Array.from(
        ctx.getImageData(
          Math.floor(c.width * x),
          Math.floor(c.height * y),
          1,
          1,
        ).data,
      );
    },
    [fx, fy],
  );
}

test.describe('デバイスモックアップ（日本語版）', () => {
  test('スマホ枠に読み込み、透明背景のPNGをダウンロードできる', async ({
    page,
  }) => {
    await page.goto('/tools/device-mockup/');
    await expect(page.locator('main h1')).toContainText('デバイスモックアップ');
    await expect(page.locator('#mockup-workspace')).toBeHidden();

    await loadImage(page);
    await expect(page.locator('#mockup-workspace')).toBeVisible();
    await expect(page.locator('#mockup-size')).toContainText('出力: 1200 ×');

    // 中央は画面（赤）、左上の隅は透明
    await expect
      .poll(() => canvasPixel(page, 0.5, 0.5))
      .toEqual([255, 0, 0, 255]);
    expect((await canvasPixel(page, 0, 0))[3]).toBe(0);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#mockup-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('shot-mockup.png');
    const bytes = await readFile((await download.path())!);
    // PNGシグネチャと幅(IHDR)
    expect(bytes.subarray(1, 4).toString()).toBe('PNG');
    expect(bytes.readUInt32BE(16)).toBe(1200);
    await expect(page.locator('#mockup-status')).toHaveText(
      'ダウンロードしました',
    );
  });

  test('デバイスを切り替えると本体色が変わり、横向きは対応機種だけ使える', async ({
    page,
  }) => {
    await page.goto('/tools/device-mockup/');
    await loadImage(page);
    await expect(page.locator('#mockup-landscape')).toBeEnabled();
    // 本体色の自動変更は利用者の操作（isTrusted）のときだけ行うため、
    // selectOption（非トラステッドイベント）ではなくキーボード操作で切り替える
    await page.locator('#mockup-device').focus();
    await page.keyboard.press('End');
    await expect(page.locator('#mockup-device')).toHaveValue('browser');
    await expect(page.locator('#mockup-landscape')).toBeDisabled();
    await expect(page.locator('#mockup-body-color')).toHaveValue('#e5e7eb');
    await page.locator('#mockup-device').selectOption('tablet');
    await page.locator('#mockup-landscape').check();
    await expect
      .poll(() =>
        page
          .locator('#mockup-canvas')
          .evaluate(
            (el) =>
              (el as HTMLCanvasElement).width >
              (el as HTMLCanvasElement).height,
          ),
      )
      .toBe(true);
  });

  test('背景の透明を外すと背景色が塗られ、axeに違反がない', async ({
    page,
  }) => {
    await page.goto('/tools/device-mockup/');
    await loadImage(page);
    await expect(page.locator('#mockup-bg-color')).toBeDisabled();
    await page.locator('#mockup-transparent').uncheck();
    await expect(page.locator('#mockup-bg-color')).toBeEnabled();
    await expect.poll(async () => (await canvasPixel(page, 0, 0))[3]).toBe(255);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test('画像でないファイルはエラーになる', async ({ page }) => {
    await page.goto('/tools/device-mockup/');
    await page.locator('#mockup-file').setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#mockup-error')).toBeVisible();
    await expect(page.locator('#mockup-workspace')).toBeHidden();
  });
});

test.describe('Device Mockup Generator (English)', () => {
  test('英語版が表示され、読み込める', async ({ page }) => {
    await page.goto('/en/tools/device-mockup/');
    await expect(page.locator('main h1')).toContainText('Device Mockup');
    await loadImage(page);
    await expect(page.locator('#mockup-size')).toContainText('Output: 1200 ×');
  });
});
