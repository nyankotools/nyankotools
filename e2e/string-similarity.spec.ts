import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('文字列の類似度・編集距離計算（日本語版）', () => {
  test('kitten と sitting の編集距離と類似率が表示される', async ({ page }) => {
    await page.goto('/tools/string-similarity/');

    await page.locator('#ss-input-a').fill('kitten');
    await page.locator('#ss-input-b').fill('sitting');

    await expect(page.locator('#ss-distance')).toHaveText('3');
    await expect(page.locator('#ss-similarity')).toHaveText('57.1%');
    await expect(page.locator('#ss-breakdown')).toHaveText(
      '挿入 1 / 削除 0 / 置換 2',
    );
  });

  test('絵文字は1文字として数え、書記素を選ぶと結合文字も1文字になる', async ({
    page,
  }) => {
    await page.goto('/tools/string-similarity/');

    await page.locator('#ss-input-a').fill('a😀b');
    await page.locator('#ss-input-b').fill('a😎b');
    await expect(page.locator('#ss-distance')).toHaveText('1');
    await expect(page.locator('#ss-lengths')).toHaveText('A: 3文字 / B: 3文字');

    await page.locator('#ss-input-a').fill('é');
    await page.locator('#ss-input-b').fill('e');
    await expect(page.locator('#ss-distance')).toHaveText('1');
    await page.locator('#ss-unit').selectOption('grapheme');
    await expect(page.locator('#ss-lengths')).toHaveText('A: 1文字 / B: 1文字');
  });

  test('5000文字を超えるとエラーを表示する', async ({ page }) => {
    await page.goto('/tools/string-similarity/');

    await page.locator('#ss-input-a').fill('a'.repeat(5001));
    await page.locator('#ss-input-b').fill('b');

    await expect(page.locator('#ss-message')).toContainText('5000');
    await expect(page.locator('#ss-result')).toBeHidden();
  });
});

test.describe('String Similarity (English)', () => {
  test('英語版で結果が表示される', async ({ page }) => {
    await page.goto('/en/tools/string-similarity/');

    await page.locator('#ss-input-a').fill('ab');
    await page.locator('#ss-input-b').fill('ba');

    await expect(page.locator('#ss-distance')).toHaveText('2');
    await expect(page.locator('#ss-damerau')).toHaveText('1');
    await expect(page.locator('#ss-lengths')).toHaveText('A: 2 / B: 2');
  });

  test('差分（diff）と操作表が表示された状態でもaxeの違反がない', async ({
    page,
  }) => {
    await page.goto('/en/tools/string-similarity/');
    await page.locator('#ss-input-a').fill('kitten');
    await page.locator('#ss-input-b').fill('sitting');
    await expect(page.locator('#ss-distance')).toHaveText('3');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`,
      ),
    ).toEqual([]);
  });
});
