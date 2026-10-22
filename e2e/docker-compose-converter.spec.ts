import { test, expect } from './helpers/test';

const CMD =
  'docker run -d --name web -p 8080:80 -v data:/data -e TZ=Asia/Tokyo --restart unless-stopped nginx:latest';

test('docker run変換: 主要オプションがcompose.ymlに変換される', async ({
  page,
}) => {
  await page.goto('/tools/docker-compose-converter/');

  await page.locator('#dc-input').fill(CMD);

  await expect(page.locator('#dc-results')).toBeVisible();
  const out = page.locator('#dc-output');
  await expect(out).toHaveValue(/image: nginx:latest/);
  await expect(out).toHaveValue(/- "8080:80"/);
  await expect(out).toHaveValue(/TZ: Asia\/Tokyo/);
  await expect(out).toHaveValue(/restart: unless-stopped/);
  await expect(out).toHaveValue(/volumes:\n {2}data:/);
});

test('docker run変換: 未対応オプションは警告される', async ({ page }) => {
  await page.goto('/tools/docker-compose-converter/');

  await page.locator('#dc-input').fill('docker run --rm -p 80:80 nginx');

  await expect(page.locator('#dc-warning-list')).toContainText('--rm');
});

test('docker run変換: チェックでcontainer_nameを切り替えられる', async ({
  page,
}) => {
  await page.goto('/tools/docker-compose-converter/');

  await page.locator('#dc-input').fill(CMD);
  await expect(page.locator('#dc-output')).toHaveValue(/container_name: web/);

  await page.locator('#dc-container-name').uncheck();
  await expect(page.locator('#dc-output')).not.toHaveValue(/container_name/);
});

test('docker run変換: docker run以外はエラー表示', async ({ page }) => {
  await page.goto('/tools/docker-compose-converter/');

  await page.locator('#dc-input').fill('docker build .');

  await expect(page.locator('#dc-error')).toBeVisible();
  await expect(page.locator('#dc-results')).toBeHidden();
});

test('docker run変換: サンプル・クリア・コピー・ダウンロード', async ({
  page,
}) => {
  await page.goto('/tools/docker-compose-converter/');

  await page.locator('#dc-sample-button').click();
  await expect(page.locator('#dc-output')).toHaveValue(/services:/);

  await page.locator('#dc-copy-button').click();
  await expect(page.locator('#dc-copy-status')).not.toHaveText('');

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#dc-download-button').click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    'docker-compose.yml',
  );

  await page.locator('#dc-clear-button').click();
  await expect(page.locator('#dc-results')).toBeHidden();
  await expect(page.locator('#dc-input')).toHaveValue('');
});

test('docker run変換: 英語版で変換できる', async ({ page }) => {
  await page.goto('/en/tools/docker-compose-converter/');

  await page.locator('#dc-input').fill(CMD);

  await expect(page.locator('#dc-summary')).toContainText('"web"');
  await expect(page.locator('#dc-output')).toHaveValue(/image: nginx:latest/);
});
