import { test, expect } from './helpers/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('じゃんけんゲーム', () => {
  test('手を選ぶと結果と成績が更新され、再読み込み後も通算が残る', async ({
    page,
  }) => {
    await page.goto('/tools/janken-game/');
    await page.locator('#jk-hands [data-hand="rock"]').click();
    await expect(page.locator('#jk-result')).toContainText('あなた: ✊ グー');
    await expect(page.locator('#jk-history li')).toHaveCount(1);
    const total = async () => {
      const ids = ['wins', 'losses', 'draws'];
      let sum = 0;
      for (const id of ids) {
        sum += Number(await page.locator(`#jk-${id}`).textContent());
      }
      return sum;
    };
    expect(await total()).toBe(1);
    await page.reload();
    expect(await total()).toBe(1);
    await expect(page.locator('#jk-history li')).toHaveCount(0);
  });

  test('リセットで成績が0に戻る', async ({ page }) => {
    await page.goto('/tools/janken-game/');
    await page.locator('#jk-hands [data-hand="paper"]').click();
    await page.locator('#jk-hands [data-hand="scissors"]').click();
    await expect(page.locator('#jk-history li')).toHaveCount(2);
    await page.locator('#jk-reset-button').click();
    for (const id of ['streak', 'best', 'wins', 'losses', 'draws']) {
      await expect(page.locator(`#jk-${id}`)).toHaveText('0');
    }
    await expect(page.locator('#jk-history li')).toHaveCount(0);
    await expect(page.locator('#jk-result')).toContainText('リセット');
  });

  test('結果はaria-liveで通知され、英語版も動く', async ({ page }) => {
    await page.goto('/en/tools/janken-game/');
    await expect(page.locator('#jk-result')).toHaveAttribute(
      'aria-live',
      'polite',
    );
    await page.locator('#jk-hands [data-hand="scissors"]').click();
    await expect(page.locator('#jk-result')).toContainText('You: ✌️ Scissors');
  });
});

test.describe('じゃんけんゲームのアクセシビリティ', () => {
  test('日本語版・英語版でaxe違反がない', async ({ page }) => {
    for (const path of ['/tools/janken-game/', '/en/tools/janken-game/']) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(results.violations.map((v) => v.id)).toEqual([]);
    }
  });

  test('localStorageが壊れていても初期表示できる', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('janken-game-stats', '{broken');
    });
    await page.goto('/tools/janken-game/');
    await expect(page.locator('#jk-wins')).toHaveText('0');
    await page.locator('#jk-hands [data-hand="rock"]').click();
    await expect(page.locator('#jk-result')).toContainText('あなた');
  });
});
