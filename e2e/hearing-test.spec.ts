import { test, expect } from './helpers/test';

test('可聴域テスト: 初期表示は1kHz刻みの13行で結果は未選択', async ({
  page,
}) => {
  await page.goto('/tools/hearing-test/');
  await expect(page.locator('[data-row]:visible')).toHaveCount(13);
  await expect(page.locator('#ht-result')).toContainText('まだ');
  await expect(page.locator('#ht-volume')).toHaveAttribute('max', '50');
});

test('可聴域テスト: 聞こえた最高周波数から年齢の目安が出る', async ({
  page,
}) => {
  await page.goto('/tools/hearing-test/');
  await page.locator('#ht-heard-8000').check();
  await page.locator('#ht-heard-16000').check();
  await expect(page.locator('#ht-result')).toContainText('16 kHz');
  await expect(page.locator('#ht-result')).toContainText('30歳以下');

  await page.locator('#ht-reset').click();
  await expect(page.locator('#ht-result')).toContainText('まだ');
});

test('可聴域テスト: 間隔を変えると表示行が変わる', async ({ page }) => {
  await page.goto('/tools/hearing-test/');
  await page.locator('#ht-step').selectOption('2000');
  await expect(page.locator('[data-row]:visible')).toHaveCount(7);
  await page.locator('#ht-step').selectOption('500');
  await expect(page.locator('[data-row]:visible')).toHaveCount(25);
});

test('可聴域テスト(英語): 結果が英語で表示される', async ({ page }) => {
  await page.goto('/en/tools/hearing-test/');
  await page.locator('#ht-heard-12000').check();
  await expect(page.locator('#ht-result')).toContainText('12 kHz');
});

test('可聴域テスト: 再生ボタンで再生中表示になり、再度押すと停止する', async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));
  await page.goto('/tools/hearing-test/');
  const playing = await page.locator('#ht-root').getAttribute('data-playing');
  const play = page.locator('[data-play-freq="8000"]');
  await expect(play).toBeEnabled();
  await play.click();
  await expect(play).toHaveText(playing!);
  await play.click();
  await expect(play).not.toHaveText(playing!);
  expect(pageErrors).toEqual([]);
});
