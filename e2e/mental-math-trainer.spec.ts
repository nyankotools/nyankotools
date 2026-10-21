import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { test, expect } from './helpers/test';

async function solve(page: Page): Promise<number> {
  const text = (await page.locator('#mm-problem').innerText()).replace(
    /\s+/g,
    ' ',
  );
  const m = text.match(/(\d+) ([+−×÷]) (\d+) =/);
  expect(m).not.toBeNull();
  const a = Number(m![1]);
  const b = Number(m![3]);
  switch (m![2]) {
    case '+':
      return a + b;
    case '−':
      return a - b;
    case '×':
      return a * b;
    default:
      return a / b;
  }
}

test.describe('暗算トレーニング', () => {
  test('全問正解でSランクになり、ベスト記録が保存される', async ({ page }) => {
    await page.goto('/tools/mental-math-trainer/');
    await page.locator('#mm-count').selectOption('10');
    await page.locator('#mm-start-button').click();
    for (let i = 0; i < 10; i++) {
      await page.locator('#mm-answer').fill(String(await solve(page)));
      await page.locator('#mm-answer').press('Enter');
    }
    await expect(page.locator('#mm-result')).toBeVisible();
    await expect(page.locator('#mm-rank')).toHaveText('S');
    await expect(page.locator('#mm-r-score')).toHaveText('10 / 10 問');
    await expect(page.locator('#mm-r-accuracy')).toHaveText('100%');
    await page.locator('#mm-back-button').click();
    await expect(page.locator('#mm-setup-best')).toContainText('10 / 10 問');
    const stored = await page.evaluate(() =>
      localStorage.getItem('mental-math-trainer-best'),
    );
    expect(stored).toContain('"correct":10');
  });

  test('不正解ばかりだとDランクで、不正な入力は進まない', async ({ page }) => {
    await page.goto('/tools/mental-math-trainer/');
    await page.locator('#mm-count').selectOption('10');
    await page.locator('#mm-start-button').click();
    await page.locator('#mm-answer').fill('abc');
    await page.locator('#mm-answer').press('Enter');
    await expect(page.locator('#mm-status')).toContainText('数字');
    await expect(page.locator('#mm-progress')).toContainText('1 / 10');
    for (let i = 0; i < 10; i++) {
      await page.locator('#mm-answer').fill('99999');
      await page.locator('#mm-answer').press('Enter');
    }
    await expect(page.locator('#mm-rank')).toHaveText('D');
    await expect(page.locator('#mm-r-score')).toHaveText('0 / 10 問');
  });

  test('制限時間が来ると終了する', async ({ page }) => {
    await page.goto('/tools/mental-math-trainer/');
    await page.locator('#mm-limit').selectOption('30');
    await page.clock.install();
    await page.locator('#mm-start-button').click();
    await expect(page.locator('#mm-time')).toContainText('0:');
    await page.clock.fastForward(31000);
    await expect(page.locator('#mm-result')).toBeVisible();
    await expect(page.locator('#mm-status')).toContainText('時間切れ');
    await expect(page.locator('#mm-rank')).toHaveText('D');
  });

  test('演算が未選択だとエラーになり開始しない', async ({ page }) => {
    await page.goto('/tools/mental-math-trainer/');
    await page.locator('#mm-op-add').uncheck();
    await page.locator('#mm-start-button').click();
    await expect(page.locator('#mm-error')).toContainText('1つ以上');
    await expect(page.locator('#mm-play')).toBeHidden();
  });

  test('割り算・引き算の問題が成立している', async ({ page }) => {
    await page.goto('/tools/mental-math-trainer/');
    await page.locator('#mm-op-add').uncheck();
    await page.locator('#mm-op-sub').check();
    await page.locator('#mm-op-div').check();
    await page.locator('#mm-digits-a').selectOption('2');
    await page.locator('#mm-count').selectOption('10');
    await page.locator('#mm-start-button').click();
    for (let i = 0; i < 10; i++) {
      const ans = await solve(page);
      expect(Number.isInteger(ans)).toBe(true);
      expect(ans).toBeGreaterThanOrEqual(0);
      await page.locator('#mm-answer').fill(String(ans));
      await page.locator('#mm-answer').press('Enter');
    }
    await expect(page.locator('#mm-rank')).toHaveText('S');
  });

  test('やめると設定画面に戻る', async ({ page }) => {
    await page.goto('/tools/mental-math-trainer/');
    await page.locator('#mm-start-button').click();
    await page.locator('#mm-quit-button').click();
    await expect(page.locator('#mm-setup')).toBeVisible();
    await expect(page.locator('#mm-play')).toBeHidden();
  });

  test('英語版でも動作する', async ({ page }) => {
    await page.goto('/en/tools/mental-math-trainer/');
    await page.locator('#mm-count').selectOption('10');
    await page.locator('#mm-start-button').click();
    await expect(page.locator('#mm-progress')).toHaveText('Question 1 of 10');
    await page.locator('#mm-answer').fill('x');
    await page.locator('#mm-answer').press('Enter');
    await expect(page.locator('#mm-status')).toContainText('number');
  });
});

test.describe('暗算トレーニング（アクセシビリティ）', () => {
  test('設定・出題・結果の各画面でaxe違反がない', async ({ page }) => {
    await page.goto('/tools/mental-math-trainer/');
    const scan = async () =>
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze()
      ).violations.map((v) => v.id);
    expect(await scan()).toEqual([]);
    await page.locator('#mm-count').selectOption('10');
    await page.locator('#mm-start-button').click();
    expect(await scan()).toEqual([]);
    for (let i = 0; i < 10; i++) {
      await page.locator('#mm-answer').fill('0');
      await page.locator('#mm-answer').press('Enter');
    }
    await expect(page.locator('#mm-result')).toBeVisible();
    expect(await scan()).toEqual([]);
  });
});
