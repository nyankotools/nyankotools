import { test, expect } from './helpers/test';

test.describe('チーム分けツール', () => {
  test('チーム数で分けると全員が振り分けられる', async ({ page }) => {
    await page.goto('/tools/team-splitter/');
    await page.locator('#ts-teams').fill('3');
    await page.locator('#ts-generate-button').click();
    await expect(page.locator('#ts-teams-list [data-team]')).toHaveCount(3);
    await expect(page.locator('#ts-teams-list li')).toHaveCount(10);
    await expect(page.locator('#ts-summary')).toContainText('10人を3チーム');
  });

  test('1チームの人数で分けると余りが均等に分散される', async ({ page }) => {
    await page.goto('/tools/team-splitter/');
    await page.locator('#ts-mode [data-mode="size"]').click();
    await page.locator('#ts-size').fill('3');
    await page.locator('#ts-generate-button').click();
    await expect(page.locator('#ts-teams-list [data-team]')).toHaveCount(4);
    const sizes = await page
      .locator('#ts-teams-list [data-team]')
      .evaluateAll((cards) =>
        cards.map((c) => c.querySelectorAll('li').length).sort(),
      );
    expect(sizes).toEqual([2, 2, 3, 3]);
  });

  test('再シャッフルで結果が変わりうる', async ({ page }) => {
    await page.goto('/tools/team-splitter/');
    await page.locator('#ts-generate-button').click();
    const seen = new Set<string>();
    for (let i = 0; i < 8; i++) {
      await page.locator('#ts-reshuffle-button').click();
      seen.add(await page.locator('#ts-teams-list').innerText());
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  test('結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/team-splitter/');
    await page.locator('#ts-generate-button').click();
    await page.locator('#ts-copy-button').click();
    await expect(page.locator('#ts-status')).toHaveText('コピーしました');
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain('チーム1');
    expect(text).toContain('Aさん');
  });

  test('名簿が1人だとエラーを表示する', async ({ page }) => {
    await page.goto('/tools/team-splitter/');
    await page.locator('#ts-names').fill('Solo');
    await page.locator('#ts-generate-button').click();
    await expect(page.locator('#ts-error')).toContainText('2人以上');
    await expect(page.locator('#ts-result')).toBeHidden();
  });

  test('チーム数が人数を超えるとエラーを表示する', async ({ page }) => {
    await page.goto('/en/tools/team-splitter/');
    await page.locator('#ts-names').fill('A\nB\nC');
    await page.locator('#ts-teams').fill('5');
    await page.locator('#ts-generate-button').click();
    await expect(page.locator('#ts-error')).toContainText('from 2 to 3');
  });

  test('名前に特殊文字を含んでもそのまま表示される', async ({ page }) => {
    await page.goto('/tools/team-splitter/');
    await page.locator('#ts-names').fill('<b>x</b>\n$&\n{n}\nZ');
    await page.locator('#ts-teams').fill('2');
    await page.locator('#ts-generate-button').click();
    const items = await page.locator('#ts-teams-list li').allTextContents();
    expect(items.sort()).toEqual(['$&', '<b>x</b>', 'Z', '{n}'].sort());
  });
});
