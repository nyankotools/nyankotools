import { test, expect } from './helpers/test';

const JA = '/tools/css-text-shadow-generator/';
const EN = '/en/tools/css-text-shadow-generator/';

test.describe('CSS text-shadowジェネレーター（日本語版）', () => {
  test('初期状態で正しいCSSが生成されプレビューに反映される', async ({
    page,
  }) => {
    await page.goto(JA);

    await expect(page.locator('#ts-css-output')).toHaveValue(
      'text-shadow: 2px 2px 4px #000000;',
    );
    await expect(page.locator('#ts-preview')).toHaveText('NyankoTools');
    const style = await page.locator('#ts-preview').getAttribute('style');
    expect(style).toContain('text-shadow');
  });

  test('オフセット・ぼかし・色の変更が出力に反映される', async ({ page }) => {
    await page.goto(JA);

    await page.locator('[data-offset-x]').first().fill('10');
    await page.locator('[data-offset-y]').first().fill('-5');
    await page.locator('[data-blur]').first().fill('12');
    await page.locator('[data-color]').first().fill('#ff0000');

    await expect(page.locator('#ts-css-output')).toHaveValue(
      'text-shadow: 10px -5px 12px #ff0000;',
    );
  });

  test('範囲外のオフセットはクランプされる', async ({ page }) => {
    await page.goto(JA);

    const x = page.locator('[data-offset-x]').first();
    await x.fill('500');
    await x.blur();

    await expect(x).toHaveValue('100');
  });

  test('プレビュー文字を変更するとプレビューが更新される', async ({ page }) => {
    await page.goto(JA);

    await page.locator('#ts-preview-text').fill('Hello');
    await expect(page.locator('#ts-preview')).toHaveText('Hello');
  });

  test('影の追加・削除と上限が機能する', async ({ page }) => {
    await page.goto(JA);

    await expect(page.locator('[data-remove]')).toBeDisabled();

    const add = page.locator('#ts-add-shadow-button');
    for (let i = 0; i < 7; i++) await add.click();

    await expect(page.locator('[data-shadow-row]')).toHaveCount(8);
    await expect(add).toBeDisabled();

    await page.locator('[data-remove]').last().click();
    await expect(page.locator('[data-shadow-row]')).toHaveCount(7);
    await expect(add).not.toBeDisabled();
  });

  test('ネオンプリセットで5レイヤーになる', async ({ page }) => {
    await page.goto(JA);

    await page.locator('[data-preset="neon"]').click();

    await expect(page.locator('[data-shadow-row]')).toHaveCount(5);
    await expect(page.locator('#ts-css-output')).toHaveValue(/#ff00de/);
  });

  test('縁取りプリセットで4レイヤーになる', async ({ page }) => {
    await page.goto(JA);

    await page.locator('[data-preset="outline"]').click();

    await expect(page.locator('[data-shadow-row]')).toHaveCount(4);
    await expect(page.locator('#ts-css-output')).toHaveValue(
      /-1px -1px 0px #000000/,
    );
  });

  test('コピーボタンでCSSをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(JA);

    const css = await page.locator('#ts-css-output').inputValue();
    await page.locator('#ts-copy-button').click();

    await expect(page.locator('#ts-status')).toHaveText('コピーしました');
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toBe(css);
  });
});

test.describe('CSS Text-Shadow Generator (English)', () => {
  test('initial CSS and copy message in English', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(EN);

    await expect(page.locator('#ts-css-output')).toHaveValue(
      'text-shadow: 2px 2px 4px #000000;',
    );
    await expect(page.locator('[data-color]').first()).toHaveAttribute(
      'aria-label',
      'Shadow color',
    );

    await page.locator('#ts-copy-button').click();
    await expect(page.locator('#ts-status')).toHaveText('Copied');
  });

  test('preset works in English', async ({ page }) => {
    await page.goto(EN);

    await page.locator('[data-preset="neon"]').click();
    await expect(page.locator('[data-shadow-row]')).toHaveCount(5);
  });
});
