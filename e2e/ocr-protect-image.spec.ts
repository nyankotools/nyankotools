import { test, expect, type Page } from './helpers/test';

/** ブラウザのCanvas APIでテスト用PNG（白地に黒い帯）を生成し、Bufferとして返す */
async function createTestPng(
  page: Page,
  width: number,
  height: number,
): Promise<Buffer> {
  const dataUrl = await page.evaluate(
    ({ w, h }) => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#000000';
      ctx.fillRect(10, 10, w - 20, 20);
      return canvas.toDataURL('image/png');
    },
    { w: width, h: height },
  );
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

async function upload(page: Page) {
  const buffer = await createTestPng(page, 200, 100);
  await page
    .locator('#op-file-input')
    .setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer });
}

/** 下半分（元は純白）がすべて純白かどうか */
function isBottomHalfPureWhite(page: Page) {
  return page.evaluate(() => {
    const c = document.getElementById('op-result-canvas') as HTMLCanvasElement;
    const d = c.getContext('2d')!.getImageData(0, 50, c.width, 50).data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] !== 255 || d[i + 1] !== 255 || d[i + 2] !== 255) return false;
    }
    return true;
  });
}

test('日本語ページが表示され、効果を保証しない旨の注意が常に表示される', async ({
  page,
}) => {
  await page.goto('/tools/ocr-protect-image/');
  await expect(page.locator('main h1')).toContainText('OCR対策');
  await expect(page.locator('main [role="note"]').first()).toContainText(
    '保証できません',
  );
});

test('英語ページが表示され、効果を保証しない旨の注意が常に表示される', async ({
  page,
}) => {
  await page.goto('/en/tools/ocr-protect-image/');
  await expect(page.locator('main h1')).toContainText('OCR');
  await expect(page.locator('main [role="note"]').first()).toContainText(
    'cannot be guaranteed',
  );
});

test('初期状態では結果が非表示で、ボタンが無効', async ({ page }) => {
  await page.goto('/tools/ocr-protect-image/');
  await expect(page.locator('#op-results-section')).toHaveAttribute('hidden');
  await expect(page.locator('#op-clear-button')).toBeDisabled();
  await expect(page.locator('#op-regenerate-button')).toBeDisabled();
});

test('画像を選択すると加工結果が表示され、加工後の画素が元と異なる', async ({
  page,
}) => {
  await page.goto('/tools/ocr-protect-image/');
  await upload(page);

  await expect(page.locator('#op-source-info')).toContainText('200×100px');
  await expect(page.locator('#op-results-section')).not.toHaveAttribute(
    'hidden',
  );
  await expect(page.locator('#op-download-button')).not.toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await expect(page.locator('#op-result-size')).toContainText('200×100px');
  expect(await isBottomHalfPureWhite(page)).toBe(false);
});

test('すべての強度を0にすると元画像と同じ画素になる', async ({ page }) => {
  await page.goto('/tools/ocr-protect-image/');
  await upload(page);
  await expect(page.locator('#op-result-size')).not.toHaveText('');

  for (const k of ['noise', 'warp', 'lines']) {
    await page.locator(`#op-${k}`).fill('0');
    await expect(page.locator(`#op-${k}-value`)).toContainText('オフ');
  }
  await expect.poll(() => isBottomHalfPureWhite(page)).toBe(true);
});

test('プリセットを選ぶとスライダーが切り替わり、手動変更で選択が外れる', async ({
  page,
}) => {
  await page.goto('/tools/ocr-protect-image/');
  const strong = page.locator('[data-preset="strong"]');
  const standard = page.locator('[data-preset="standard"]');

  await expect(standard).toHaveAttribute('aria-pressed', 'true');
  await strong.click();
  await expect(strong).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#op-noise')).toHaveValue('55');

  await page.locator('#op-noise').fill('41');
  await expect(strong).toHaveAttribute('aria-pressed', 'false');
});

test('再生成で模様が変わり、クリアで結果が消える', async ({ page }) => {
  await page.goto('/tools/ocr-protect-image/');
  await upload(page);
  await expect(page.locator('#op-result-size')).not.toHaveText('');

  const snapshot = () =>
    page.evaluate(() =>
      (
        document.getElementById('op-result-canvas') as HTMLCanvasElement
      ).toDataURL(),
    );
  const before = await snapshot();
  await page.locator('#op-regenerate-button').click();
  await expect.poll(snapshot).not.toBe(before);

  await page.locator('#op-clear-button').click();
  await expect(page.locator('#op-results-section')).toHaveAttribute('hidden');
  await expect(page.locator('#op-clear-button')).toBeDisabled();
});

test('画像以外のファイルを選ぶとエラーが表示される', async ({ page }) => {
  await page.goto('/tools/ocr-protect-image/');
  await page.locator('#op-file-input').setInputFiles({
    name: 'a.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('hello'),
  });
  await expect(page.locator('#op-error')).toBeVisible();
  await expect(page.locator('#op-results-section')).toHaveAttribute('hidden');
});
