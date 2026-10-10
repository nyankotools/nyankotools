import { test, expect } from './helpers/test';

test.describe('ランダム文字列・乱数生成', () => {
  test('ランダム文字列を指定の長さ・個数で生成する', async ({ page }) => {
    await page.goto('/tools/random-generator/');
    await page.locator('#rg-length').fill('12');
    await page.locator('#rg-count').fill('5');
    await page.locator('#rg-generate-button').click();
    const lines = (await page.locator('#rg-output').inputValue()).split('\n');
    expect(lines).toHaveLength(5);
    for (const line of lines) expect(line).toMatch(/^[A-Za-z0-9]{12}$/);
    await expect(page.locator('#rg-summary')).toContainText('5件');
  });

  test('追加文字だけで生成できる', async ({ page }) => {
    await page.goto('/tools/random-generator/');
    for (const id of ['lowercase', 'uppercase', 'digits']) {
      await page.locator(`#rg-${id}`).uncheck();
    }
    await page.locator('#rg-custom').fill('xyz');
    await page.locator('#rg-generate-button').click();
    const lines = (await page.locator('#rg-output').inputValue()).split('\n');
    for (const line of lines) expect(line).toMatch(/^[xyz]{16}$/);
  });

  test('ひらがな・漢字だけで生成できる', async ({ page }) => {
    await page.goto('/tools/random-generator/');
    for (const id of ['lowercase', 'uppercase', 'digits']) {
      await page.locator(`#rg-${id}`).uncheck();
    }
    await page.locator('#rg-hiragana').check();
    await page.locator('#rg-joyo').check();
    await page.locator('#rg-length').fill('8');
    await page.locator('#rg-count').fill('20');
    await page.locator('#rg-generate-button').click();
    const lines = (await page.locator('#rg-output').inputValue()).split('\n');
    expect(lines).toHaveLength(20);
    for (const line of lines) {
      expect(Array.from(line)).toHaveLength(8);
      expect(line).toMatch(/^[\p{Script=Hiragana}\p{Script=Han}]+$/u);
    }
  });

  test('整数を重複なしで範囲全体から取ると全値が出る', async ({ page }) => {
    await page.goto('/tools/random-generator/');
    await page.locator('#rg-mode [data-mode="integer"]').click();
    await page.locator('#rg-min').fill('1');
    await page.locator('#rg-max').fill('10');
    await page.locator('#rg-count').fill('10');
    await page.locator('#rg-unique').check();
    await page.locator('#rg-sort').check();
    await page.locator('#rg-generate-button').click();
    await expect(page.locator('#rg-output')).toHaveValue(
      '1\n2\n3\n4\n5\n6\n7\n8\n9\n10',
    );
  });

  test('小数を指定桁数で生成する', async ({ page }) => {
    await page.goto('/tools/random-generator/');
    await page.locator('#rg-mode [data-mode="decimal"]').click();
    await page.locator('#rg-min').fill('0');
    await page.locator('#rg-max').fill('1');
    await page.locator('#rg-decimals').fill('3');
    await page.locator('#rg-count').fill('20');
    await page.locator('#rg-generate-button').click();
    const lines = (await page.locator('#rg-output').inputValue()).split('\n');
    expect(lines).toHaveLength(20);
    for (const line of lines) expect(line).toMatch(/^[01]\.\d{3}$/);
  });

  test('重複なしで個数が範囲を超えるとエラーを表示する', async ({ page }) => {
    await page.goto('/tools/random-generator/');
    await page.locator('#rg-mode [data-mode="integer"]').click();
    await page.locator('#rg-min').fill('1');
    await page.locator('#rg-max').fill('5');
    await page.locator('#rg-count').fill('6');
    await page.locator('#rg-unique').check();
    await page.locator('#rg-generate-button').click();
    await expect(page.locator('#rg-error')).toContainText('重複させない場合');
    await expect(page.locator('#rg-result')).toBeHidden();
  });

  test('モードを切り替えると入力欄の表示が変わる', async ({ page }) => {
    await page.goto('/tools/random-generator/');
    await expect(page.locator('#rg-string-fields')).toBeVisible();
    await expect(page.locator('#rg-number-fields')).toBeHidden();
    await expect(page.locator('#rg-unique-field')).toBeVisible();

    await page.locator('#rg-mode [data-mode="decimal"]').click();
    await expect(page.locator('#rg-string-fields')).toBeHidden();
    await expect(page.locator('#rg-number-fields')).toBeVisible();
    await expect(page.locator('#rg-decimals-field')).toBeVisible();
    await expect(page.locator('#rg-unique-field')).toBeHidden();
    await expect(page.locator('#rg-sort-field')).toBeVisible();
    await expect(
      page.locator('#rg-mode [data-mode="decimal"]'),
    ).toHaveAttribute('aria-pressed', 'true');

    await page.locator('#rg-mode [data-mode="string"]').click();
    await expect(page.locator('#rg-string-fields')).toBeVisible();
    await expect(page.locator('#rg-decimals-field')).toBeHidden();
  });

  test('個数が空欄だとエラーを表示する', async ({ page }) => {
    await page.goto('/tools/random-generator/');
    await page.locator('#rg-count').fill('');
    await page.locator('#rg-generate-button').click();
    await expect(page.locator('#rg-error')).toContainText('個数');
    await expect(page.locator('#rg-result')).toBeHidden();
  });

  test('文字が1つも選ばれていないとエラーを表示する', async ({ page }) => {
    await page.goto('/tools/random-generator/');
    for (const id of ['lowercase', 'uppercase', 'digits']) {
      await page.locator(`#rg-${id}`).uncheck();
    }
    await page.locator('#rg-generate-button').click();
    await expect(page.locator('#rg-error')).toContainText('使う文字');
  });

  test('結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/random-generator/');
    await page.locator('#rg-generate-button').click();
    await page.locator('#rg-copy-button').click();
    await expect(page.locator('#rg-status')).toHaveText('コピーしました');
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text.replace(/\r\n/g, '\n')).toBe(
      await page.locator('#rg-output').inputValue(),
    );
  });

  test('英語ページでも生成できる', async ({ page }) => {
    await page.goto('/en/tools/random-generator/');
    await page.locator('#rg-generate-button').click();
    await expect(page.locator('#rg-summary')).toContainText('Generated 10');
  });
});
