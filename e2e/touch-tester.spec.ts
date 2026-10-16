import { test, expect } from './helpers/test';
import { blockAnalytics } from './helpers/block-analytics';

test.describe('タッチパネルテスト', () => {
  test('日本語版: ポインター操作で統計が更新され、リセットで戻る', async ({
    page,
  }) => {
    await blockAnalytics(page);
    await page.goto('/tools/touch-tester/');
    await expect(page.locator('main h1')).toHaveText('タッチパネルテスト');
    await expect(page.locator('#tt-stat-total')).toHaveText('0');

    const box = (await page.locator('#tt-pad').boundingBox())!;
    await page.mouse.move(box.x + 20, box.y + 20);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width - 20, box.y + 20, { steps: 5 });
    await expect(page.locator('#tt-stat-current')).toHaveText('1');
    await page.mouse.up();

    await expect(page.locator('#tt-stat-current')).toHaveText('0');
    await expect(page.locator('#tt-stat-max')).toHaveText('1');
    await expect(page.locator('#tt-stat-total')).toHaveText('1');
    await expect(page.locator('#tt-stat-type')).toHaveText('mouse');
    await expect(page.locator('#tt-stat-coverage')).not.toHaveText('0.0%');
    await expect(page.locator('#tt-hint')).toBeHidden();

    await page.locator('#tt-reset').click();
    await expect(page.locator('#tt-stat-total')).toHaveText('0');
    await expect(page.locator('#tt-stat-coverage')).toHaveText('0.0%');
    await expect(page.locator('#tt-hint')).toBeVisible();
  });

  test('英語版: 見出しが英語で表示される', async ({ page }) => {
    await blockAnalytics(page);
    await page.goto('/en/tools/touch-tester/');
    await expect(page.locator('main h1')).toHaveText('Touch Screen Test');
    await expect(page.locator('#tt-stat-device-max')).not.toHaveText('-');
  });

  for (const [label, path] of [
    ['日本語版', '/tools/touch-tester/'],
    ['英語版', '/en/tools/touch-tester/'],
  ] as const) {
    test(`${label}: コンソールエラー・未捕捉例外が出ない`, async ({ page }) => {
      await blockAnalytics(page);
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (err) => errors.push(err.message));
      await page.goto(path);
      await expect(page.locator('#tt-stat-device-max')).not.toHaveText('-');
      expect(errors).toEqual([]);
    });
  }
});

test.describe('タッチ入力（CDPで実タッチイベントを送信）', () => {
  test.use({ hasTouch: true });

  test('2本指の同時タッチで同時数2・pointerTypeがtouchになり、離すと0に戻る', async ({
    page,
  }) => {
    await blockAnalytics(page);
    await page.goto('/tools/touch-tester/');
    await expect(page.locator('#tt-stat-device-max')).not.toHaveText('-');

    const box = (await page.locator('#tt-pad').boundingBox())!;
    const cdp = await page.context().newCDPSession(page);
    const x1 = box.x + box.width * 0.25;
    const x2 = box.x + box.width * 0.75;
    const y = box.y + box.height * 0.5;

    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [
        { x: x1, y, id: 1 },
        { x: x2, y, id: 2 },
      ],
    });
    await expect(page.locator('#tt-stat-current')).toHaveText('2');
    await expect(page.locator('#tt-stat-max')).toHaveText('2');
    await expect(page.locator('#tt-stat-type')).toHaveText('touch');

    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [
        { x: x1, y: y - 60, id: 1 },
        { x: x2, y: y + 60, id: 2 },
      ],
    });
    await expect(page.locator('#tt-stat-coverage')).not.toHaveText('0.0%');

    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await expect(page.locator('#tt-stat-current')).toHaveText('0');
    await expect(page.locator('#tt-stat-max')).toHaveText('2');
    await expect(page.locator('#tt-stat-total')).toHaveText('2');
  });
});
