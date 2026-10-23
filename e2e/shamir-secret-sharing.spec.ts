import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

const output = '#shamir-output';

test.describe('Shamir秘密分散（日本語版）', () => {
  test('分割したシェアのうちk個から秘密を復元できる', async ({ page }) => {
    await page.goto('/tools/shamir-secret-sharing/');
    await page.locator('#shamir-secret').fill('ひみつ 🐱 123');
    await page.locator('#shamir-count').fill('5');
    await page.locator('#shamir-threshold').fill('3');
    await page.locator('#shamir-run-button').click();
    await expect(page.locator(output)).toHaveValue(
      /^([0-9a-f]+\n){4}[0-9a-f]+$/,
    );
    const shares = (await page.locator(output).inputValue()).split('\n');
    expect(shares).toHaveLength(5);

    await page.getByRole('button', { name: '復元', exact: true }).click();
    await expect(page.locator(output)).toHaveValue('');
    await page
      .locator('#shamir-shares-input')
      .fill([shares[4], shares[0], shares[2]].join('\n'));
    await page.locator('#shamir-run-button').click();
    await expect(page.locator(output)).toHaveValue('ひみつ 🐱 123');
  });

  test('入力不正・シェア不足ではエラーを表示する', async ({ page }) => {
    await page.goto('/tools/shamir-secret-sharing/');
    const error = page.locator('#shamir-error');
    await page.locator('#shamir-run-button').click();
    await expect(error).toHaveText('秘密のテキストを入力してください。');

    await page.locator('#shamir-secret').fill('abc');
    await page.locator('#shamir-count').fill('3');
    await page.locator('#shamir-threshold').fill('4');
    await page.locator('#shamir-run-button').click();
    await expect(error).toHaveText('k は n 以下にしてください。');

    await page.locator('#shamir-threshold').fill('3');
    await page.locator('#shamir-run-button').click();
    const shares = (await page.locator(output).inputValue()).split('\n');

    await page.getByRole('button', { name: '復元', exact: true }).click();
    await page
      .locator('#shamir-shares-input')
      .fill([shares[0], shares[1]].join('\n'));
    await page.locator('#shamir-run-button').click();
    await expect(error).toContainText('シェアが足りません');

    await page
      .locator('#shamir-shares-input')
      .fill([shares[0], 'not-a-share'].join('\n'));
    await page.locator('#shamir-run-button').click();
    await expect(error).toContainText('2行目のシェアの形式が正しくありません');
  });

  test('大きな秘密（乱数が65536バイトを超える）でも分割・復元でき、例外で止まらない', async ({
    page,
  }) => {
    await page.goto('/tools/shamir-secret-sharing/');
    const big = 'あ'.repeat(30000); // UTF-8で約90KB
    await page.locator('#shamir-secret').fill(big);
    await page.locator('#shamir-count').fill('5');
    await page.locator('#shamir-threshold').fill('3');
    await page.locator('#shamir-run-button').click();
    await expect(page.locator(output)).toHaveValue(
      /^([0-9a-f]+\n){4}[0-9a-f]+$/,
    );
    await expect(page.locator('#shamir-error')).toBeHidden();
    const shares = (await page.locator(output).inputValue()).split('\n');

    await page.getByRole('button', { name: '復元', exact: true }).click();
    await page
      .locator('#shamir-shares-input')
      .fill([shares[1], shares[3], shares[4]].join('\n'));
    await page.locator('#shamir-run-button').click();
    await expect(page.locator(output)).toHaveValue(big);
  });

  test('結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/shamir-secret-sharing/');
    await page.locator('#shamir-secret').fill('copy me');
    await page.locator('#shamir-run-button').click();
    await page.locator('#shamir-copy-button').click();
    await expect(page.locator('#shamir-status')).toHaveText('コピーしました');
  });
});

test.describe("Shamir's Secret Sharing (English)", () => {
  test('英語版で分割・復元できる', async ({ page }) => {
    await page.goto('/en/tools/shamir-secret-sharing/');
    await expect(page.locator('main h1')).toHaveText(
      "Shamir's Secret Sharing (Split & Combine)",
    );
    await page.locator('#shamir-secret').fill('hello');
    await page.locator('#shamir-count').fill('3');
    await page.locator('#shamir-threshold').fill('2');
    await page.locator('#shamir-run-button').click();
    const shares = (await page.locator(output).inputValue()).split('\n');

    await page.getByRole('button', { name: 'Combine', exact: true }).click();
    await page
      .locator('#shamir-shares-input')
      .fill([shares[2], shares[1]].join('\n'));
    await page.locator('#shamir-run-button').click();
    await expect(page.locator(output)).toHaveValue('hello');
  });
});

test('Shamir: 初期表示でaxeの違反がない（ja/en）', async ({ page }) => {
  for (const path of [
    '/tools/shamir-secret-sharing/',
    '/en/tools/shamir-secret-sharing/',
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
