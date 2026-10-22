import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('アナグラム・回文チェッカー', () => {
  test('日本語版: アナグラムを判定し、不一致なら過不足を表示する', async ({
    page,
  }) => {
    await page.goto('/tools/anagram-palindrome-checker/');
    await page.locator('#ap-a').fill('Dormitory');
    await page.locator('#ap-b').fill('Dirty room!');
    await expect(page.locator('#ap-anagram-status')).toHaveText(
      'アナグラムです',
    );
    await expect(page.locator('#ap-norm-a')).toContainText('dormitory');

    await page.locator('#ap-b').fill('dirty roof');
    await expect(page.locator('#ap-anagram-status')).toHaveText(
      'アナグラムではありません',
    );
    await expect(page.locator('#ap-extra-a')).toHaveText('m');
    await expect(page.locator('#ap-extra-b')).toHaveText('f');
  });

  test('回文を判定し、オプションで結果が変わる', async ({ page }) => {
    await page.goto('/tools/anagram-palindrome-checker/');
    await page.locator('#ap-p').fill('タケヤブ やけた！');
    await expect(page.locator('#ap-palindrome-status')).toHaveText('回文です');
    await page.locator('#ap-opt-kana').uncheck();
    await expect(page.locator('#ap-palindrome-status')).toHaveText(
      '回文ではありません',
    );
  });

  test('英語版も動作する', async ({ page }) => {
    await page.goto('/en/tools/anagram-palindrome-checker/');
    await page.locator('#ap-a').fill('Listen');
    await page.locator('#ap-b').fill('Silent');
    await expect(page.locator('#ap-anagram-status')).toHaveText(
      'These are anagrams',
    );
    await page.locator('#ap-p').fill('A man, a plan, a canal: Panama');
    await expect(page.locator('#ap-palindrome-status')).toHaveText(
      'This is a palindrome',
    );
  });
});

test.describe('anagram-palindrome-checker: アクセシビリティ', () => {
  test('初期表示でaxeのWCAG 2.1 A/AA違反がない（ja/en）', async ({ page }) => {
    for (const path of [
      '/tools/anagram-palindrome-checker/',
      '/en/tools/anagram-palindrome-checker/',
    ]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        results.violations.map((v) => v.id),
        path,
      ).toEqual([]);
    }
  });
});
